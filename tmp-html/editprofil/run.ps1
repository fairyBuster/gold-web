# Verifikasi filter input "Nama Lengkap", "Username" & "Telegram" di
# EditProfil.jsx (route /index/profil/edit): prefill account-info utuh; Nama
# Lengkap hanya huruf/angka/spasi (aturan full_name backend), Username &
# Telegram hanya huruf/angka; isi simbol semua → kosong; nilai huruf/angka/
# spasi murni lewat apa adanya.
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$dom = Join-Path $env:TEMP 'editprofil.html'
& $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-editprofil" --window-size=430,900 --virtual-time-budget=30000 --dump-dom "http://localhost:5173/tmp-html/editprofil/index.html" 2>$null | Out-File -Encoding utf8 $dom
$html = Get-Content $dom -Raw
$m = [regex]::Match($html, '(?s)<pre id="editprofil-metrics">(.*?)</pre>')
if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
