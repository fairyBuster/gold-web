#!/usr/bin/env python3
"""Pixel-verify tmp-html/og-meta/og-render.png (2400x1260 = 1200x630 @2x).

Pure-stdlib PNG decode (zlib + unfilter) then structural checks:
background/glow, logo mark present, orange tag text, dark headline glyphs,
gold CTA pill bounding box, phone mockup pixels, opacity.
"""
import struct
import sys
import zlib

PATH = sys.argv[1] if len(sys.argv) > 1 else 'og-render.png'


def load_png(path):
    data = open(path, 'rb').read()
    assert data[:8] == b'\x89PNG\r\n\x1a\n', 'not a png'
    pos = 8
    idat = b''
    w = h = bd = ct = None
    while pos < len(data):
        ln = struct.unpack('>I', data[pos:pos + 4])[0]
        ctype = data[pos + 4:pos + 8]
        chunk = data[pos + 8:pos + 8 + ln]
        if ctype == b'IHDR':
            w, h, bd, ct = struct.unpack('>IIBB', chunk[:10])
        elif ctype == b'IDAT':
            idat += chunk
        elif ctype == b'IEND':
            break
        pos += 12 + ln
    raw = zlib.decompress(idat)
    ch = {0: 1, 2: 3, 4: 2, 6: 4}[ct]
    assert bd == 8, 'bad bitdepth %s' % bd
    stride = w * ch
    out = bytearray(h * stride)
    prev = bytearray(stride)
    p = 0
    for y in range(h):
        f = raw[p]
        p += 1
        line = bytearray(raw[p:p + stride])
        p += stride
        if f == 1:
            for i in range(ch, stride):
                line[i] = (line[i] + line[i - ch]) & 255
        elif f == 2:
            for i in range(stride):
                line[i] = (line[i] + prev[i]) & 255
        elif f == 3:
            for i in range(stride):
                a = line[i - ch] if i >= ch else 0
                line[i] = (line[i] + ((a + prev[i]) >> 1)) & 255
        elif f == 4:
            for i in range(stride):
                a = line[i - ch] if i >= ch else 0
                b = prev[i]
                c = prev[i - ch] if i >= ch else 0
                pa, pb, pc = abs(b - c), abs(a - c), abs(a + b - 2 * c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[i] = (line[i] + pr) & 255
        out[y * stride:(y + 1) * stride] = line
        prev = line
    return w, h, ch, out


W, H, CH, PIX = load_png(PATH)
print('image: %dx%d ch=%d' % (W, H, CH))


def px(x, y):
    i = (y * W + x) * CH
    a = PIX[i + 3] if CH == 4 else 255
    return PIX[i], PIX[i + 1], PIX[i + 2], a


def count(box, pred):
    x0, y0, x1, y1 = box
    n = 0
    for y in range(y0, y1, 2):
        for x in range(x0, x1, 2):
            if pred(px(x, y)):
                n += 1
    return n


results = []


def check(name, ok, detail):
    results.append((name, ok, detail))
    print('%s %s — %s' % ('PASS' if ok else 'FAIL', name, detail))


# 1) Orange glow top-right stronger than top-left (radial-gradient rendered)
glow = px(W - 8, 8)
flat = px(8, 8)
check('glow top-right', glow[0] > glow[2] + 15 and glow[0] - glow[2] > (flat[0] - flat[2]) + 10,
      'TR=%s TL=%s' % (glow[:3], flat[:3]))

# 2) Background is opaque white-ish
check('bg opaque', px(W // 2, H - 10)[3] == 255 and px(W // 2, H - 10)[:3] >= (250, 250, 250),
      'bottom-center=%s' % (px(W // 2, H - 10),))

# 3) Logo wordmark (black) present in top-left box (CSS 72,44 h46 -> 2x)
logo_dark = count((130, 70, 440, 200), lambda p: p[0] < 120 and p[1] < 120 and p[2] < 120)
check('logo mark', logo_dark > 40, 'dark px=%d in logo box' % logo_dark)

# 4) Orange tag text (#e8790c) in the copy area
tag_n = count((130, 350, 640, 450), lambda p: p[0] > 190 and 70 < p[1] < 170 and p[2] < 90)
check('tag #LangkahEmasmu', tag_n > 30, 'orange px=%d' % tag_n)

# 5) Dark headline glyphs in the copy area
h1_n = count((130, 450, 1250, 900), lambda p: p[0] < 100 and p[1] < 100 and p[2] < 100)
check('headline glyphs', h1_n > 400, 'dark px=%d' % h1_n)

# 6) Gold CTA pill (#f1b04a) — find bounding box in left-bottom area
x0 = y0 = 10 ** 9
x1 = y1 = -1
n = 0
for y in range(700, 1210, 2):
    for x in range(130, 1100, 2):
        r, g, b, _ = px(x, y)
        if abs(r - 241) < 22 and abs(g - 176) < 22 and abs(b - 74) < 26:
            n += 1
            x0, y0 = min(x0, x), min(y0, y)
            x1, y1 = max(x1, x), max(y1, y)
ok6 = n > 500 and x0 >= 130 and y1 <= H - 1
check('CTA pill', ok6, 'gold px=%d box=(%d,%d)-(%d,%d) CSS=(%.0f,%.0f)-(%.0f,%.0f)'
      % (n, x0, y0, x1, y1, x0 / 2, y0 / 2, x1 / 2, y1 / 2))

# 7) Dark CTA label glyphs inside the pill box
label_n = count((x0, y0, x1, y1), lambda p: p[0] < 110 and p[1] < 110 and p[2] < 110) if ok6 else 0
check('CTA label', label_n > 60, 'dark px in pill=%d' % label_n)

# 8) Phone mockup pixels on the right side (CSS right:40 w580 -> px ~1160..2320, y ~68..1228)
phone_n = count((1150, 60, 2330, 1235), lambda p: (p[0] < 235 or p[1] < 235 or p[2] < 235))
check('phone mockup', phone_n > 3000, 'non-white px=%d' % phone_n)

# 9) Real gap: rightmost dark glyph (copy column, bounded by CSS width 580
#    -> px <= 1310) vs leftmost phone pixel (scan right of px 1310).
hx = -1
for y in range(400, 920, 2):
    for x in range(130, 1312, 2):
        p = px(x, y)
        if p[0] < 100 and p[1] < 100 and p[2] < 100 and x > hx:
            hx = x
plx = 10 ** 9
for y in range(60, 1236, 2):
    for x in range(1312, 2332, 2):
        p = px(x, y)
        if (p[0] < 235 or p[1] < 235 or p[2] < 235) and x < plx:
            plx = x
gap_px = plx - hx
check('copy/phone gap', hx > 0 and plx < 10 ** 9 and gap_px >= 40,
      'headline right=%dpx phone left=%dpx gap=%dpx (%.0f CSS px)' % (hx, plx, gap_px, gap_px / 2))

# 10) All sampled alphas fully opaque
alphas = [px(x, y)[3] for x, y in [(5, 5), (W - 5, 5), (5, H - 5), (W - 5, H - 5), (W // 2, H // 2)]]
check('fully opaque', all(a == 255 for a in alphas), 'alphas=%s' % alphas)

passed = sum(1 for _, ok, _ in results if ok)
print('--- %d/%d checks passed' % (passed, len(results)))
