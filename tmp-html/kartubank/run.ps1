# Verifikasi masking kartu rekening (KartuBank.jsx, route /index/profil/kartu):
# nomor 16 & 8 digit → 5 digit pertama + " ••••" (digit ke-6 dst disensor),
# nomor ≤5 digit apa adanya; nama kata kedua dst jadi inisial + bullets.
# Nomor/nama asli tidak boleh bocor ke DOM. Tombol back harus langsung ke /index/profil.
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$dom = Join-Path $env:TEMP 'kartubank.html'
& $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-kartubank" --window-size=430,900 --virtual-time-budget=30000 --dump-dom "http://localhost:5173/tmp-html/kartubank/index.html" 2>$null | Out-File -Encoding utf8 $dom
$html = Get-Content $dom -Raw
$m = [regex]::Match($html, '(?s)<pre id="kartubank-metrics">(.*?)</pre>')
if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
