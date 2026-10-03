$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$jmeter = if ($env:JMETER) { $env:JMETER } else { "jmeter" }

foreach ($n in 1, 10, 100, 1000, 10000) {
    $jtl = "results/x$n.jtl"
    $report = "results/x$n"
    if (Test-Path $jtl) { Remove-Item $jtl -Force }
    if (Test-Path $report) { Remove-Item $report -Recurse -Force }
    New-Item -ItemType Directory -Force -Path results | Out-Null
    & $jmeter -n -t phoneme-builder.jmx -Jthreads=$n -l $jtl -e -o $report
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
