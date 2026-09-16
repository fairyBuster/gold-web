<#
  prefix-routes.ps1 - migrate every app route literal to the /index namespace.

  Modes:
    DryRun : list every planned replacement (file:line + source line). Writes nothing.
    Apply  : perform the replacements (UTF-8 no BOM, line endings preserved) and
             mirror backups to tmp-html/route-index-migration/backup/<rel path>.bak
    Verify : list any remaining un-namespaced route literals; exit 1 when found.

  Scope:
    d:\webbaru\src\**\*.jsx / *.js  +  d:\webbaru\tmp-html\**\*.html
    tmp-html artifacts named dump*/dom* and this migration folder are skipped.

  Rule ('/' + root when preceded by a quote/backtick/paren):
    (['"`(])/(auth|home|assets|rewards|transactions|profil|affiliate|berita|support|landing|sitemap)([/'"`),;]|$)
      ->  $1/index/$2$3

  Never touched by design: /api/... endpoints, /src/... module paths,
  /tmp-html/... harness URLs, and full https URLs (their leading char is not
  a quote/paren, so they cannot match).
#>
param(
  [ValidateSet('DryRun', 'Apply', 'Verify')]
  [string]$Mode = 'DryRun'
)

$ErrorActionPreference = 'Stop'

$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
if (-not (Test-Path (Join-Path $repo 'src\App.jsx'))) {
  throw "Repo root detection failed: $repo"
}

# Build the pattern from character codes so quoting can never bite us.
$sq = [string][char]39   # '
$dq = [string][char]34   # "
$bt = [string][char]96   # backtick
$roots = 'auth|home|assets|rewards|transactions|profil|affiliate|berita|support|landing|sitemap'
$pattern = '([' + $sq + $dq + $bt + '(])/(' + $roots + ')([/' + $sq + $dq + $bt + '),;]|$)'
$re = New-Object System.Text.RegularExpressions.Regex $pattern
$repl = '${1}/index/$2$3'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$backupRoot = Join-Path $PSScriptRoot 'backup'

$files = @()
$files += Get-ChildItem -Path (Join-Path $repo 'src') -Recurse -File -Include '*.jsx', '*.js' -ErrorAction SilentlyContinue
$files += Get-ChildItem -Path (Join-Path $repo 'tmp-html') -Recurse -File -Include '*.html' -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -notmatch '^(dump|dom)' -and $_.FullName -notmatch 'route-index-migration' }

$totalFiles = 0
$totalMatches = 0
$report = New-Object System.Collections.Generic.List[string]

foreach ($file in $files) {
  $text = [IO.File]::ReadAllText($file.FullName)
  $found = $re.Matches($text)
  if ($found.Count -eq 0) { continue }

  $rel = $file.FullName.Substring($repo.Length + 1)
  $totalFiles++
  $totalMatches += $found.Count

  if ($Mode -eq 'Apply') {
    $backup = (Join-Path $backupRoot $rel) + '.bak'
    $backupDir = Split-Path -Parent $backup
    if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir -Force | Out-Null }
    [IO.File]::WriteAllText($backup, $text, $utf8)
    [IO.File]::WriteAllText($file.FullName, $re.Replace($text, $repl), $utf8)
    $report.Add(('APPLY {0}: {1} replacement(s)' -f $rel, $found.Count))
  }
  else {
    $lines = [regex]::Split($text, '\r?\n')
    foreach ($m in $found) {
      $lineNo = ([regex]::Split($text.Substring(0, $m.Index), '\n')).Count
      $report.Add(('{0}:{1}: [{2}] {3}' -f $rel, $lineNo, $m.Value, $lines[$lineNo - 1].Trim()))
    }
  }
}

$report | ForEach-Object { Write-Host $_ }

switch ($Mode) {
  'DryRun' { Write-Host ("`nDRY RUN - {0} file(s), {1} planned replacement(s). Nothing written." -f $totalFiles, $totalMatches) }
  'Apply' { Write-Host ("`nAPPLIED - {0} file(s), {1} replacement(s). Backups: {2}" -f $totalFiles, $totalMatches, $backupRoot) }
  'Verify' {
    if ($totalMatches -eq 0) {
      Write-Host "`nVERIFY OK - no un-namespaced route literals remain."
    }
    else {
      Write-Host ("`nVERIFY FAILED - {0} leftover literal(s) in {1} file(s)." -f $totalMatches, $totalFiles)
      exit 1
    }
  }
}
