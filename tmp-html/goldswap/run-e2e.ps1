# E2E runner for the Tukar Emas flow harness (headless Edge + vite dev on :5173).
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$base = "http://localhost:5173/tmp-html/goldswap/index.html?case="
$cases = @('flow', 'off', 'noprice', 'holdpre', 'hold400', 'deposit400', 'price503', 'valid400', 'unconfigured400', 'shipped', 'cancelled', 'noaddr1', 'noaddr2', 'histdetail')
$results = @()
foreach ($case in $cases) {
  $out = "$env:TEMP\gs-$case.html"
  & $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-gs-profile" --virtual-time-budget=15000 --dump-dom "$base$case" 2>$null | Out-File -Encoding utf8 $out
  $html = Get-Content $out -Raw
  $m = [regex]::Match($html, '(?s)<pre id="gs-metrics">(.*?)</pre>')
  if (-not $m.Success) {
    $results += [pscustomobject]@{ case = $case; passed = 'NO-METRICS'; title = ''; desc = ''; note = ''; path = ''; errors = '' }
    continue
  }
  $mm = [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) | ConvertFrom-Json
  $results += [pscustomobject]@{
    case    = $case
    passed  = $mm.allPassed
    title   = $mm.notifTitle
    desc    = $mm.notifDesc
    note    = $mm.footerNote
    path    = $mm.finalPath
    errors  = ($mm.errors -join ' | ')
  }
}
$results | Format-Table -AutoSize | Out-String -Width 260
