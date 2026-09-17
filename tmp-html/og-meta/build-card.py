#!/usr/bin/env python3
"""Build tmp-html/og-meta/card.html — a fixed 1200x630 Open Graph card.

Mirrors the landing-page hero look (white bg + orange radial glow, brand
palette from LandingPagePerusahaan: #e8790c / #f1b04a / #1a1410) and inlines
the real brand assets (logo wordmark + phone mockup) as data URIs so the page
is fully self-contained — the browser agent rasterizes it with html2canvas
and POSTs the PNG back to serve.py.
"""
import base64
import os

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, '..', '..', 'src', 'assets', 'images')

TEMPLATE = """<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<title>OG card 1200x630</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
<style>
  html, body { margin: 0; padding: 0; background: #ffffff; }
  #card {
    position: relative; width: 1200px; height: 630px; overflow: hidden;
    background-color: #ffffff;
    font-family: 'Inter', -apple-system, 'Segoe UI', Arial, sans-serif;
  }
  #card .glow {
    position: absolute; left: 0; top: 0; width: 1200px; height: 630px;
    background: radial-gradient(circle at 100% 0%, rgba(255,159,28,0.16) 0%, rgba(255,159,28,0) 52%),
                radial-gradient(circle at 0% 100%, rgba(241,176,74,0.14) 0%, rgba(241,176,74,0) 55%);
  }
  #card .logo { position: absolute; left: 72px; top: 44px; height: 46px; }
  #card .copy { position: absolute; left: 72px; top: 186px; width: 580px; }
  #card .tag { color: #e8790c; font-size: 20px; font-weight: 700; letter-spacing: 0.2px; }
  #card h1 {
    margin: 14px 0 0; color: #1a1410; font-size: 52px; line-height: 1.14;
    font-weight: 800; letter-spacing: -0.6px;
  }
  #card .cta {
    display: inline-block; margin-top: 30px; padding: 17px 38px; border-radius: 999px;
    background-color: #f1b04a; color: #1a1410; font-size: 21px; font-weight: 700;
  }
  #card .phone { position: absolute; right: 40px; top: 34px; height: 580px; }
</style>
</head>
<body>
  <div id="card">
    <div class="glow"></div>
    <img class="logo" src="data:image/webp;base64,__LOGO__" alt="" />
    <div class="copy">
      <div class="tag">#LangkahEmasmu</div>
      <h1>Kenal Lebih Dekat, Jelajah Lebih Mudah</h1>
      <div class="cta">Download JelajahEmas</div>
    </div>
    <img class="phone" src="data:image/webp;base64,__PHONE__" alt="" />
  </div>
</body>
</html>
"""


def b64(name):
    with open(os.path.join(IMG, name), 'rb') as f:
        return base64.b64encode(f.read()).decode('ascii')


html = (
    TEMPLATE
    .replace('__LOGO__', b64('3d6fb697a044e75c7a6c789438a276b40b37b5b9.webp'))
    .replace('__PHONE__', b64('handphone.webp'))
)

with open(os.path.join(HERE, 'card.html'), 'w') as f:
    f.write(html)
print('card.html written (%d bytes)' % len(html))
