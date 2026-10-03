#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

jmeter_cmd="${JMETER:-jmeter}"

for n in 1 10 100 1000 10000; do
  jtl="results/x${n}.jtl"
  report="results/x${n}"
  rm -rf "$jtl" "$report"
  mkdir -p results
  "$jmeter_cmd" -n -t phoneme-builder.jmx -Jthreads="$n" -l "$jtl" -e -o "$report"
done
