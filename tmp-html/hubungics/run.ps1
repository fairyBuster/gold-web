# Verifikasi wiring kartu channel (HubungiCs.jsx) ke GET /api/support/links/:
# sukses → href = url entri id 11 (Call Center & CS Jelajah), id 13 (Saluran
# Komunitas) & id 12 (WhatsApp); entri hilang / is_active=false / request
# gagal → keempat href tetap '#'. Kartu lain tidak berubah.
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$cases = @('loaded', 'missing', 'inactive', 'error')
foreach ($case in $cases) {
  $dom = Join-Path $env:TEMP "hubungics-$case.html"
  & $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-hubungics" --window-size=430,900 --virtual-time-budget=30000 --dump-dom "http://localhost:5173/tmp-html/hubungics/index.html?case=$case" 2>$null | Out-File -Encoding utf8 $dom
  $html = Get-Content $dom -Raw
  $m = [regex]::Match($html, '(?s)<pre id="hubungics-metrics">(.*?)</pre>')
  Write-Output "=== case=$case ==="
  if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
}
