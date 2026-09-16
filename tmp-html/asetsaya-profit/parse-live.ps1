# Parse the asetsaya-profit live harness metrics from the dumped DOM.
$html = Get-Content 'd:\webbaru\tmp-html\asetsaya-profit\dom-live.html' -Raw
$raw = [regex]::Match($html, '(?s)<pre id="as-live-metrics">(.*?)</pre>').Groups[1].Value
if (-not $raw) { Write-Output 'NO METRICS BLOCK'; exit 1 }
$json = [System.Net.WebUtility]::HtmlDecode($raw)
$json
