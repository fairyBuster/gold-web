# Parse the emasdigital-live harness metrics from the dumped DOM.
$html = Get-Content 'd:\webbaru\tmp-html\emasdigital-live\dom.html' -Raw
$raw = [regex]::Match($html, '(?s)<pre id="edm-metrics">(.*?)</pre>').Groups[1].Value
if (-not $raw) { Write-Output 'NO METRICS BLOCK'; exit 1 }
$json = [System.Net.WebUtility]::HtmlDecode($raw)
$json
