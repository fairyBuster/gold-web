"""Analyze oversized image assets: dimensions, PNG color type, byte size.

Pure stdlib (no Pillow needed) — reads the PNG IHDR / JPEG SOF headers only.
"""
import os
import struct

ROOT = 'src/assets'
THRESHOLD = 150 * 1024


def png_info(path):
    with open(path, 'rb') as f:
        head = f.read(26)
    if head[:8] != b'\x89PNG\r\n\x1a\n' or len(head) < 26:
        return None
    w, h = struct.unpack('>II', head[16:24])
    return f'{w}x{h} ct{head[25]} bd{head[24]}'


def jpg_info(path):
    with open(path, 'rb') as f:
        data = f.read()
    i = 2
    while i < len(data) - 9:
        if data[i] != 0xFF:
            i += 1
            continue
        m = data[i + 1]
        if m in (0xC0, 0xC1, 0xC2, 0xC3):
            h, w = struct.unpack('>HH', data[i + 5:i + 9])
            return f'{w}x{h}'
        if m == 0xD8 or m == 0x01 or 0xD0 <= m <= 0xD7:
            i += 2
            continue
        i += 2 + struct.unpack('>H', data[i + 2:i + 4])[0]
    return None


def main():
    big = []
    for dirpath, _, names in os.walk(ROOT):
        for n in names:
            p = os.path.join(dirpath, n)
            sz = os.path.getsize(p)
            if sz > THRESHOLD:
                big.append((sz, p))
    big.sort(reverse=True)
    print(f'files >150KB: {len(big)}, total {sum(s for s, _ in big) / 1e6:.1f} MB')
    for sz, p in big:
        low = p.lower()
        if low.endswith('.png'):
            info = png_info(p) or '?'
        elif low.endswith(('.jpg', '.jpeg')):
            info = (jpg_info(p) or '?') + ' jpeg'
        elif low.endswith('.svg'):
            info = f'svg (first 120B: ' + repr(open(p, 'rb').read(120)) + ')'
        else:
            info = 'other'
        print(f'{sz / 1024:9.1f} KB  {info:60s} {p}')


if __name__ == '__main__':
    main()
