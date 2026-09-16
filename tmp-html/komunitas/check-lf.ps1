# Cek & normalisasi line endings (harus CRLF) untuk file yang baru diedit.
$files = @(
  'd:\webbaru\src\pages\home\Home.jsx',
  'd:\webbaru\src\components\PopupKomunitas.jsx',
  'd:\webbaru\tmp-html\komunitas\index.html',
  'd:\webbaru\tmp-html\komunitas\run.ps1'
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
