# Verifikasi hero "Poin Kamu" PoinMall step 1 (PoinMall.jsx):
# - points   : GET /api/roulette/points/ → tickets 4321 (katalog redeem
#              sengaja 999) → hero harus 4.321, membuktikan sumbernya
#              ringkasan poin, bukan katalog.
# - fallback : ringkasan poin gagal (500) → hero jatuh ke saldo katalog (999).
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$cases = @('points', 'fallback')
foreach ($case in $cases) {
  $dom = Join-Path $env:TEMP "poinmall-$case.html"
  & $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-poinmall" --window-size=430,900 --virtual-time-budget=30000 --dump-dom "http://localhost:5173/tmp-html/poinmall/index.html?case=$case" 2>$null | Out-File -Encoding utf8 $dom
  $html = Get-Content $dom -Raw
  $m = [regex]::Match($html, '(?s)<pre id="poinmall-metrics">(.*?)</pre>')
  Write-Output "=== case=$case ==="
  if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
}
