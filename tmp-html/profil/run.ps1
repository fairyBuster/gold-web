# Verifikasi skeleton kartu "Saldo Kamu" (Profil.jsx):
# - loading : semua endpoint menggantung → 8 skeleton aktif (growth, saldo
#             utama & 6 nilai grid) dengan teks nilai kosong.
# - loaded  : data API → skeleton hilang dan angka API tampil (sumber harga
#             emas publik dipatok gagal agar konversi gram deterministik).
# - error   : semua request gagal → skeleton hilang, angka mockup kembali.
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$cases = @('loading', 'loaded', 'error')
foreach ($case in $cases) {
  $dom = Join-Path $env:TEMP "profil-$case.html"
  & $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-profil" --window-size=430,900 --virtual-time-budget=30000 --dump-dom "http://localhost:5173/tmp-html/profil/index.html?case=$case" 2>$null | Out-File -Encoding utf8 $dom
  $html = Get-Content $dom -Raw
  $m = [regex]::Match($html, '(?s)<pre id="profil-metrics">(.*?)</pre>')
  Write-Output "=== case=$case ==="
  if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
}
