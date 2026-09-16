"""Generate dist/galeri.html — a QC gallery of every image emitted by the build.

Each tile shows the image on the app's cream background AND on dark, so lost
transparency (black boxes) or broken files are easy to spot visually.
Pure stdlib; run after extracting /app/dist from the built image.
"""
import os

DIST = 'dist'


def main():
    assets = os.path.join(DIST, 'assets')
    exts = ('.webp', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.avif')
    files = sorted(
        f for f in os.listdir(assets)
        if f.lower().endswith(exts) and os.path.isfile(os.path.join(assets, f))
    )
    listed = ','.join("'assets/" + f + "'" for f in files)
    html = f"""<!doctype html>
<meta charset="utf-8"><title>Asset QC gallery ({len(files)} images)</title>
<style>
body{{font:12px/1.4 sans-serif;background:#222;color:#eee;margin:16px}}
h2{{font-size:15px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}}
.row{{display:flex;gap:6px}}
.cell{{flex:1;display:flex;align-items:center;justify-content:center;height:140px;overflow:hidden}}
.cream{{background:#fffbf4}}.dark{{background:#111}}
img{{max-width:100%;max-height:100%}}
.name{{word-break:break-all;color:#8f8;margin-top:4px}}
</style>
<h2 id="h">Asset QC gallery — {len(files)} images (left: cream #fffbf4, right: dark)</h2>
<div class="grid" id="g"></div>
<script>
const files = [{listed}];
const g = document.getElementById('g');
for (const f of files) {{
  const t = document.createElement('div');
  t.innerHTML = '<div class="row">' +
    '<div class="cell cream"><img loading="lazy" src="' + f + '"></div>' +
    '<div class="cell dark"><img loading="lazy" src="' + f + '"></div>' +
    '</div><div class="name">' + f + '</div>';
  g.appendChild(t);
}}
</script>
"""
    with open(os.path.join(DIST, 'galeri.html'), 'w', encoding='utf-8') as fh:
        fh.write(html)
    print(f'galeri.html written with {len(files)} images')


if __name__ == '__main__':
    main()
