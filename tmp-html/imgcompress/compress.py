"""Compress oversized assets under src/assets.

Rasters (PNG/JPG > 150 KiB):
  downscale to max 1440 px, re-encode as WebP (q84, alpha-aware), rename to
  .webp and rewrite every `images/<name>.ext` reference inside src/.
SVG wrappers (> 150 KiB with an embedded base64 raster):
  recompress the embedded raster in place (downscale to max 512 px, smallest
  of quantized/plain PNG) — the .svg filename stays the same.

Dry-run by default; pass --apply to write. Needs Pillow; intended to run in
the python:3.12-slim docker image with the repo mounted at /work.
"""
import base64
import io
import os
import re
import sys

from PIL import Image

ROOT = 'src/assets'
SRC = 'src'
THRESHOLD = 150 * 1024
MAX_RASTER = 1440
MAX_EMBED = 512
QUALITY = 84
APPLY = '--apply' in sys.argv

SVG_IMG_RE = re.compile(
    r'(<(?:image|xlink:image)\b[^>]*?(?:xlink:href|href)=")'
    r'data:image/(png|jpeg);base64,([A-Za-z0-9+/=\s]+?)(")'
)


def normalize(im):
    """Pick a WebP-safe mode, preserving transparency."""
    if im.mode == 'P':
        return im.convert('RGBA' if 'transparency' in im.info else 'RGB')
    if 'A' in im.getbands():
        return im if im.mode == 'RGBA' else im.convert('RGBA')
    return im if im.mode == 'RGB' else im.convert('RGB')


def downscale(im, cap):
    w, h = im.size
    if max(w, h) <= cap:
        return im
    s = cap / max(w, h)
    size = (max(1, round(w * s)), max(1, round(h * s)))
    return im.resize(size, Image.Resampling.LANCZOS)


def webp_bytes(im):
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=QUALITY, method=6)
    return buf.getvalue()


def png_bytes(im):
    """Smallest of quantized-256 vs plain optimized PNG."""
    outs = []
    if 'A' in im.getbands():
        buf = io.BytesIO()
        im.quantize(colors=256, method=Image.Quantize.FASTOCTREE).save(
            buf, 'PNG', optimize=True
        )
        outs.append(buf.getvalue())
    buf = io.BytesIO()
    im.save(buf, 'PNG', optimize=True)
    outs.append(buf.getvalue())
    return min(outs, key=len)


def process_svg(path):
    text = open(path, encoding='utf-8').read()
    m = SVG_IMG_RE.search(text)
    if not m:
        print(f'  svg: no embedded raster found, skipped {path}')
        return None
    raw = base64.b64decode(m.group(3))
    im = downscale(normalize(Image.open(io.BytesIO(raw))), MAX_EMBED)
    data = png_bytes(im)
    if len(data) >= len(raw):
        print(f'  keep (no gain) {path}')
        return None
    print(f'{len(raw) / 1024:8.1f}K {len(data) / 1024:8.1f}K  {path} (embedded raster)')
    return text[: m.start(3)] + base64.b64encode(data).decode('ascii') + text[m.end(3):]


def rewrite_references(renames):
    files = []
    for dirpath, _, names in os.walk(SRC):
        for n in names:
            if n.rsplit('.', 1)[-1] in ('js', 'jsx', 'css'):
                files.append(os.path.join(dirpath, n))
    texts = {f: open(f, encoding='utf-8').read() for f in files}
    for old, new in renames:
        hits = 0
        for f in files:
            if 'images/' + old in texts[f]:
                texts[f] = texts[f].replace('images/' + old, 'images/' + new)
                hits += 1
        if hits == 0:
            print(f'WARN: no reference found for {old}')
    if APPLY:
        for f, t in texts.items():
            with open(f, 'w', encoding='utf-8') as fh:
                fh.write(t)


def main():
    renames = []
    old_total = new_total = 0
    print(f'{"old":>9} {"new":>9}  file')
    for dirpath, _, names in os.walk(ROOT):
        for n in sorted(names):
            p = os.path.join(dirpath, n)
            sz = os.path.getsize(p)
            if sz <= THRESHOLD:
                continue
            low = n.lower()
            if low.endswith(('.png', '.jpg', '.jpeg')):
                im = downscale(normalize(Image.open(p)), MAX_RASTER)
                data = webp_bytes(im)
                old_total += sz
                if len(data) >= sz:
                    new_total += sz
                    print(f'  keep (no gain) {p}')
                    continue
                new_total += len(data)
                print(f'{sz / 1024:8.1f}K {len(data) / 1024:8.1f}K  {p}')
                new_p = os.path.splitext(p)[0] + '.webp'
                if APPLY:
                    with open(new_p, 'wb') as f:
                        f.write(data)
                    os.remove(p)
                renames.append((n, os.path.basename(new_p)))
            elif low.endswith('.svg'):
                new_text = process_svg(p)
                if new_text is not None:
                    old_total += sz
                    new_total += len(new_text.encode('utf-8'))
                    if APPLY:
                        with open(p, 'w', encoding='utf-8') as f:
                            f.write(new_text)
    if not APPLY:
        # size totals for svgs cannot be computed without writing; approx note
        print('\nDRY RUN — nothing written. Re-run with --apply to write.')
    print(f'\nrasters+svgs: {old_total / 1e6:.1f} MB -> {new_total / 1e6:.1f} MB')
    print(f'renamed to .webp: {len(renames)} files')
    rewrite_references(renames)


if __name__ == '__main__':
    main()
