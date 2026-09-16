# Verifikasi halaman Tim & Afiliasi: fallback 0 kartu "Tim Kamu" (partial/nulls/full)
# dan link undangan pada tombol Salin/Bagikan (copy-link/share-link).
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$cases = @('partial', 'nulls', 'full', 'copy-link', 'share-link')
foreach ($case in $cases) {
  $dom = Join-Path $env:TEMP "timafiliasi-$case.html"
  & $edge --headless=new --disable-gpu --no-first-run --user-data-dir="$env:TEMP\edge-timafiliasi" --window-size=430,900 --virtual-time-budget=30000 --dump-dom "http://localhost:5173/tmp-html/timafiliasi/probe.html?case=$case" 2>$null | Out-File -Encoding utf8 $dom
  $html = Get-Content $dom -Raw
  $m = [regex]::Match($html, '(?s)<pre id="timafiliasi-metrics">(.*?)</pre>')
  Write-Output "=== $case ==="
  if ($m.Success) { [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value) } else { Write-Output 'NO METRICS BLOCK' }
}
