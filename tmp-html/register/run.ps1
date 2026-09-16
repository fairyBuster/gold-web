# Runner E2E wizard register: flow (index.html), guard (index.html?suite=guard), emailcheck.
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$dir = "d:\webbaru\tmp-html\register"
$profile = "$env:TEMP\edge-register-profile"

function Run-Suite([string]$name, [string]$url, [string]$metricsId, [string]$outFile) {
  $dom = Join-Path $dir $outFile
  & $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$profile" --virtual-time-budget=60000 --dump-dom $url 2>$null | Out-File -Encoding utf8 $dom
  $html = Get-Content $dom -Raw
  Write-Output "==== $name"
  $m = [regex]::Match($html, '(?s)<pre id="' + $metricsId + '">(.*?)</pre>')
  if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
}

Run-Suite 'FLOW (index.html)' 'http://localhost:5173/tmp-html/register/index.html' 'register-metrics' 'dom-flow.html'
Run-Suite 'GUARD (index.html?suite=guard)' 'http://localhost:5173/tmp-html/register/index.html?suite=guard' 'register-metrics' 'dom-guard.html'
Run-Suite 'EMAILCHECK (emailcheck.html)' 'http://localhost:5173/tmp-html/register/emailcheck.html' 'emailcheck-metrics' 'dom-emailcheck.html'
