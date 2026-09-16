# Parse the emasdigital-live live harness metrics from the dumped DOM.
$html = Get-Content 'd:\webbaru\tmp-html\emasdigital-live\dom-live.html' -Raw
$raw = [regex]::Match($html, '(?s)<pre id="edl-metrics">(.*?)</pre>').Groups[1].Value
if (-not $raw) { Write-Output 'NO METRICS BLOCK'; exit 1 }
$json = [System.Net.WebUtility]::HtmlDecode($raw)
$json
