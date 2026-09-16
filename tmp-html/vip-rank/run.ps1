# Runner E2E halaman VIP: kasus stub (index.html) + kasus live (live.html).
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$dir = "d:\webbaru\tmp-html\vip-rank"
$profile = "$env:TEMP\edge-vip-profile"

# --- stub ---
$dom = "$dir\dom.html"
& $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$profile" --virtual-time-budget=15000 --dump-dom "http://localhost:5173/tmp-html/vip-rank/index.html" 2>$null | Out-File -Encoding utf8 $dom
$html = Get-Content $dom -Raw
Write-Output '==== STUB (index.html)'
$m = [regex]::Match($html, '(?s)<pre id="vip-metrics">(.*?)</pre>')
if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }

# --- live ---
$domLive = "$dir\dom-live.html"
& $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$profile" --virtual-time-budget=20000 --dump-dom "http://localhost:5173/tmp-html/vip-rank/live.html" 2>$null | Out-File -Encoding utf8 $domLive
$htmlLive = Get-Content $domLive -Raw
Write-Output '==== LIVE (live.html)'
$mLive = [regex]::Match($htmlLive, '(?s)<pre id="vip-live-metrics">(.*?)</pre>')
if ($mLive.Success) { [System.Net.WebUtility]::HtmlDecode($mLive.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }

# --- screenshot (live, 393px) ---
& $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$profile" --window-size=393,900 --virtual-time-budget=20000 --screenshot="$dir\shot.png" "http://localhost:5173/tmp-html/vip-rank/live.html" 2>$null
Write-Output 'screenshot -> shot.png'
