# Verifikasi latar polos #fff9f2 di root asset-01 & asset-02 (tanpa artwork gambar).
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
foreach ($step in 1, 2) {
  $dom = Join-Path $env:TEMP "asset-bg-$step.html"
  & $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-assetbg" --window-size=430,900 --virtual-time-budget=30000 --dump-dom "http://localhost:5173/tmp-html/asset-bg/probe.html?step=$step" 2>$null | Out-File -Encoding utf8 $dom
  $html = Get-Content $dom -Raw
  $m = [regex]::Match($html, '(?s)<pre id="asset-bg-metrics">(.*?)</pre>')
  Write-Output "==== step $step"
  if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
}
