# Parse the emasdigital-box harness metrics from the dumped DOM.
$html = Get-Content 'd:\webbaru\tmp-html\emasdigital-box\dom.html' -Raw
$raw = [regex]::Match($html, '(?s)<pre id="ed-metrics">(.*?)</pre>').Groups[1].Value
if (-not $raw) { Write-Output 'NO METRICS BLOCK'; exit 1 }
$json = [System.Net.WebUtility]::HtmlDecode($raw)
$json
