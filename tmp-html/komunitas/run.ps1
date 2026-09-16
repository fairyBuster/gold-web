# Verifikasi popup "Gabung Komunitas Kami" (PopupKomunitas) di Home:
# - page load baru → Home dibuka → popup muncul (judul/badge/3 tombol +
#   href dari GET /api/support/links/),
# - X menutup popup (hanya hide), tetap di /index/home,
# - keluar ke Profil lalu kembali ke Home (tanpa refresh) → popup tidak
#   muncul lagi,
# - REFRESH halaman (reload dokumen) → popup muncul lagi; klik di dalam
#   kartu tidak menutup, tap area overlay menutup (fase 2 probe).
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$dom = Join-Path $env:TEMP 'komunitas-home.html'
& $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-komunitas" --window-size=430,900 --virtual-time-budget=45000 --dump-dom "http://localhost:5173/tmp-html/komunitas/index.html" 2>$null | Out-File -Encoding utf8 $dom
$html = Get-Content $dom -Raw
$m = [regex]::Match($html, '(?s)<pre id="komunitas-metrics">(.*?)</pre>')
if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
