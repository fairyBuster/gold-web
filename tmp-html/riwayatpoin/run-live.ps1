# Live E2E (API asli, tanpa stub): kartu ringkasan Riwayat Poin harus sama
# dengan respons asli GET /api/roulette/points/ (total_earned/total_spent).
# Prasyarat: mint token dulu (mint.py) supaya /e2e-token.json tersedia.
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$dom = Join-Path $env:TEMP 'riwayatpoin-live.html'
& $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-riwayatpoin-live" --window-size=430,900 --virtual-time-budget=45000 --dump-dom "http://localhost:5173/tmp-html/riwayatpoin/live.html" 2>$null | Out-File -Encoding utf8 $dom
$html = Get-Content $dom -Raw
$m = [regex]::Match($html, '(?s)<pre id="rp-live-metrics">(.*?)</pre>')
if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
