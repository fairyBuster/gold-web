# Verifikasi Rincian Penawaran asset-02: baris "Pembagian / Hari" untuk
# produk random memakai rentang min–max apa adanya (pid=134 → Rp6.250 – Rp10.350),
# dan tabel Informasi Produk custom field tetap sesuai (pid=200 tanpa field).
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$cases = @('134', '200')
foreach ($case in $cases) {
  $dom = Join-Path $env:TEMP "assetinfo-$case.html"
  & $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-assetinfo" --window-size=430,900 --virtual-time-budget=30000 --dump-dom "http://localhost:5173/tmp-html/assetinfo/index.html?pid=$case" 2>$null | Out-File -Encoding utf8 $dom
  $html = Get-Content $dom -Raw
  $m = [regex]::Match($html, '(?s)<pre id="info-metrics">(.*?)</pre>')
  Write-Output "=== pid=$case ==="
  if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
}
