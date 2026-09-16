# Runner smoke test migrasi /index: sweep semua route + assert document.title.
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$dir = "d:\webbaru\tmp-html\route-smoke"
$profile = "$env:TEMP\edge-rs-profile"

$dom = "$dir\dom.html"
& $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$profile" --virtual-time-budget=180000 --dump-dom "http://localhost:5173/tmp-html/route-smoke/index.html" 2>$null | Out-File -Encoding utf8 $dom
$html = Get-Content $dom -Raw
Write-Output '==== ROUTE SMOKE (.html)'
$m = [regex]::Match($html, '(?s)<pre id="rs-metrics">(.*?)</pre>')
if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
