# Live E2E (API asli, tanpa stub): RiwayatLainnya -> tekan baris SWAP ->
# layar CetakEmas step 3 harus menampilkan data asli GET /api/gold/orders/<id>/.
# Prasyarat: mint token dulu (mint.py) supaya /e2e-token.json tersedia.
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$dom = Join-Path $env:TEMP 'riwayat-handoff-live.html'
& $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-riwayat-handoff" --window-size=430,900 --virtual-time-budget=45000 --dump-dom "http://localhost:5173/tmp-html/riwayat-handoff/live.html" 2>$null | Out-File -Encoding utf8 $dom
$html = Get-Content $dom -Raw
$m = [regex]::Match($html, '(?s)<pre id="rh-live-metrics">(.*?)</pre>')
if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
