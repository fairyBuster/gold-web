# Ukur frame video landing (rasio harus == 854/480) di viewport 390 & 1440,
# lalu ambil screenshot halaman /index/landing pada kedua lebar itu.
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

foreach ($w in 390, 1440) {
  $dom = Join-Path $env:TEMP "frame-$w.html"
  & $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-vframe" --window-size=$w,2000 --virtual-time-budget=45000 --dump-dom 'http://localhost:5173/tmp-html/video-probe/frame.html' 2>$null | Out-File -Encoding utf8 $dom
  $html = Get-Content $dom -Raw
  $m = [regex]::Match($html, '(?s)<pre id="frame-metrics">(.*?)</pre>')
  Write-Output "==== frame width=$w"
  if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
}

foreach ($w in 390, 1440) {
  $shot = "d:\webbaru\tmp-html\video-probe\shot-$w.png"
  & $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-vshot" --window-size=$w,3200 --virtual-time-budget=30000 --screenshot="$shot" 'http://localhost:5173/index/landing' 2>$null
  if (Test-Path $shot) { Write-Output ("SHOT $shot " + (Get-Item $shot).Length) } else { Write-Output "SHOT FAILED $shot" }
}
