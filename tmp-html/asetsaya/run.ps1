# Verifikasi AsetSaya (route /index/assets/aset-saya-01 & -02) — kartu
# "Total Aset Emas Kamu" bersumber GET /api/gold/info/ (balance_hold):
# gram = balance_hold ÷ price_per_gram, rupiah = ≈ formatRupiah(balance_hold);
# 2 bar skeleton selagi gold info dimuat; gagal → "—" di kedua baris;
# kartu terikat ke gold info saja (case goldonly: investments hang, nilai tetap tampil);
# urutan daftar: Aktif di atas (terbaru dulu), selesai (COMPLETED/EXPIRED/
# CANCELLED) pindah ke paling bawah dengan badge "Selesai"/"Kedaluwarsa"/
# "Dibatalkan" (case order); step 2 (total-asset-card) loaded & loading ikut diverifikasi.
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
foreach ($case in @('loading', 'loaded', 'goldonly', 'error', 'order', 'step02loading', 'step02loaded')) {
  $dom = Join-Path $env:TEMP "asetsaya-$case.html"
  & $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-asetsaya" --window-size=430,900 --virtual-time-budget=30000 --dump-dom "http://localhost:5173/tmp-html/asetsaya/index.html?case=$case" 2>$null | Out-File -Encoding utf8 $dom
  $html = Get-Content $dom -Raw
  $m = [regex]::Match($html, '(?s)<pre id="asetsaya-metrics">(.*?)</pre>')
  Write-Output "=== case=$case ==="
  if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
}
