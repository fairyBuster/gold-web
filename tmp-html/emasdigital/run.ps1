# Verifikasi skeleton kartu "Total Emas Digital" (EmasDigital.jsx): selama
# GET /api/gold/info/ menggantung tampil 2 bar skeleton (angka + rupiah) di
# balance-card; setelah sukses tampil nilai asli (2,5 gram / ≈ Rp5.000.000);
# setelah gagal skeleton berhenti dan fallback placeholder mockup tampil.
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$cases = @('loading', 'loaded', 'error')
foreach ($case in $cases) {
  $dom = Join-Path $env:TEMP "emasdigital-$case.html"
  & $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-emasdigital" --window-size=430,900 --virtual-time-budget=30000 --dump-dom "http://localhost:5173/tmp-html/emasdigital/index.html?case=$case" 2>$null | Out-File -Encoding utf8 $dom
  $html = Get-Content $dom -Raw
  $m = [regex]::Match($html, '(?s)<pre id="digital-metrics">(.*?)</pre>')
  Write-Output "=== case=$case ==="
  if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
}
