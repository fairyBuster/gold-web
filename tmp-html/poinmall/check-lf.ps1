# Cek & normalisasi line endings (harus CRLF) untuk file yang baru diedit.
$files = @(
  'd:\webbaru\src\lib\rouletteApi.js',
  'd:\webbaru\src\lib\authApi.js',
  'd:\webbaru\src\pages\rewards\poin-mall\PoinMall.jsx',
  'd:\webbaru\src\pages\profile\Profil.jsx',
  'd:\webbaru\tmp-html\profil\index.html',
  'd:\webbaru\tmp-html\poinmall\index.html',
  'd:\webbaru\tmp-html\poinmall\live.html',
  'd:\webbaru\tmp-html\poinmall\run.ps1',
  'd:\webbaru\tmp-html\poinmall\run-live.ps1',
  'd:\webbaru\tmp-html\poinmall\mint.py',
  'd:\webbaru\tmp-html\riwayat-handoff\mint.py'
)
foreach ($f in $files) {
  $t = [IO.File]::ReadAllText($f)
  $lf = ([regex]::Matches($t, '(?<!\r)\n')).Count
  if ($lf -gt 0) {
    $n = $t -replace '\r?\n', "`r`n"
    [IO.File]::WriteAllText($f, $n, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "normalized ($lf lone LFs): $f"
  } else {
    Write-Host "crlf ok: $f"
  }
}
