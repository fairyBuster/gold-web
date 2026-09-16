# Verifikasi kartu ringkasan Riwayat Poin (RiwayatPoin.jsx):
# - loaded : GET /api/roulette/points/ → "Poin Didapat" 120 & "Poin Ditukar" -45
#            (total_earned/total_spent; daftar REDEEM bulan ini sengaja 50
#            supaya logika bulanan lama tidak lolos).
# - fail   : ringkasan poin 500 → dua baris tetap "—", daftar REDEEM tetap tampil.
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$cases = @('loaded', 'fail')
foreach ($case in $cases) {
  $dom = Join-Path $env:TEMP "riwayatpoin-$case.html"
  & $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-riwayatpoin" --window-size=430,900 --virtual-time-budget=30000 --dump-dom "http://localhost:5173/tmp-html/riwayatpoin/index.html?case=$case" 2>$null | Out-File -Encoding utf8 $dom
  $html = Get-Content $dom -Raw
  $m = [regex]::Match($html, '(?s)<pre id="riwayatpoin-metrics">(.*?)</pre>')
  Write-Output "=== case=$case ==="
  if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
}
