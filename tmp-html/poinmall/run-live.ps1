# Live E2E (API asli, tanpa stub): "Poin Kamu" harus sama dengan respons
# asli GET /api/roulette/points/ — di hero PoinMall step 1 dan kartu Profil.
# Prasyarat: mint token dulu (mint.py) supaya /e2e-token.json tersedia.
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
foreach ($route in @('poinmall', 'profil')) {
  $dom = Join-Path $env:TEMP "poinmall-live-$route.html"
  & $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-poinmall-live" --window-size=430,900 --virtual-time-budget=45000 --dump-dom "http://localhost:5173/tmp-html/poinmall/live.html?route=$route" 2>$null | Out-File -Encoding utf8 $dom
  $html = Get-Content $dom -Raw
  $m = [regex]::Match($html, '(?s)<pre id="pl-live-metrics">(.*?)</pre>')
  Write-Output "=== route=$route ==="
  if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
}
