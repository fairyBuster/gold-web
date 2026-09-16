# Verifikasi BeriRating step 1 (route /index/profil/beri-rating):
# - 12 ulasan dari API → hanya 10 terbaru dirender, urutan terbaru dulu;
# - angka ulasan di kartu overall bertambah sendiri (+1 tiap 10 detik).
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$dom = Join-Path $env:TEMP 'berirating.html'
& $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-berirating" --window-size=430,900 --virtual-time-budget=30000 --dump-dom "http://localhost:5173/tmp-html/berirating/index.html" 2>$null | Out-File -Encoding utf8 $dom
$html = Get-Content $dom -Raw
$m = [regex]::Match($html, '(?s)<pre id="berirating-metrics">(.*?)</pre>')
if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
