# Cek & normalisasi line endings (harus CRLF) untuk file yang baru diedit.
$files = @(
  'd:\webbaru\src\pages\rewards\riwayat\RiwayatPoin.jsx',
  'd:\webbaru\src\lib\rouletteApi.js',
  'd:\webbaru\tmp-html\riwayatpoin\index.html',
  'd:\webbaru\tmp-html\riwayatpoin\run.ps1',
  'd:\webbaru\tmp-html\riwayatpoin\live.html',
  'd:\webbaru\tmp-html\riwayatpoin\run-live.ps1',
  'd:\webbaru\tmp-html\riwayatpoin\mint.py'
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
