# Verifikasi layout between pada .stats-grid kartu produk asset-01.
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$dom = Join-Path $env:TEMP 'asset-stats.html'
& $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-assetstats" --window-size=430,900 --virtual-time-budget=30000 --dump-dom "http://localhost:5173/tmp-html/asset-stats/probe.html" 2>$null | Out-File -Encoding utf8 $dom
$html = Get-Content $dom -Raw
$m = [regex]::Match($html, '(?s)<pre id="asset-stats-metrics">(.*?)</pre>')
if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
