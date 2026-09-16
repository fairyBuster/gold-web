"""Probe big image assets: transparency + photographic-ness (for format choice).

Needs Pillow; intended to run inside the python:3.12-slim docker image with the
repo mounted at /work.
"""
import os

from PIL import Image

ROOT = 'src/assets'
THRESHOLD = 150 * 1024


def main():
    for dirpath, _, names in os.walk(ROOT):
        for n in sorted(names):
            p = os.path.join(dirpath, n)
            sz = os.path.getsize(p)
            if sz <= THRESHOLD or not n.lower().endswith(('.png', '.jpg', '.jpeg')):
                continue
            im = Image.open(p)
            alpha = ''
            if im.mode in ('RGBA', 'LA', 'P'):
                lo, hi = im.convert('RGBA').getchannel('A').getextrema()
                alpha = f'alpha {lo}-{hi}'
            small = im.convert('RGB').resize((64, 64))
            colors = len(small.getcolors(64 * 64) or [])
            kind = 'PHOTO' if colors > 2000 else 'graphic'
            print(
                f'{sz / 1024:8.1f}KB {im.size[0]}x{im.size[1]} {im.mode:5s} '
                f'{alpha:14s} {kind:8s} {p}'
            )


if __name__ == '__main__':
    main()
