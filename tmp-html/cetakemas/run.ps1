# Verifikasi skeleton loading CetakEmas.jsx (saldo emas, detail pencetakan,
# alamat, ringkasan/rincian biaya, kartu order step 3) via 7 skenario:
# pending = fetch menggantung (bar shimmer tampil), settled = data termuat,
# s1-back = tombol back step 1 langsung ke Beranda.
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$cases = @('s1-pending', 's1-settled', 's1-back', 's2-pending', 's2-settled', 's3-pending', 's3-settled')
foreach ($case in $cases) {
  $dom = Join-Path $env:TEMP "cetakemas-$case.html"
  & $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-cetakemas" --window-size=430,900 --virtual-time-budget=30000 --dump-dom "http://localhost:5173/tmp-html/cetakemas/probe.html?case=$case" 2>$null | Out-File -Encoding utf8 $dom
  $html = Get-Content $dom -Raw
  $m = [regex]::Match($html, '(?s)<pre id="cetakemas-metrics">(.*?)</pre>')
  Write-Output "=== $case ==="
  if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
}
