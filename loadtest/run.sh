#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

jmeter_cmd="${JMETER:-jmeter}"

ulimit -n 10240 2>/dev/null || true
export JVM_ARGS="${JVM_ARGS:--Xms1g -Xmx4g}"

for n in 1 10 100 1000 3000; do
  jtl="results/x${n}.jtl"
  report="results/x${n}"
  rampUp=$(( n <= 100 ? 5 : 30 ))
  rm -rf "$jtl" "$report"
  mkdir -p results
  echo "=== x${n} users (ramp-up ${rampUp}s, 5 loops, 500ms think time) ==="
  "$jmeter_cmd" -n -t phoneme-builder.jmx \
    -Jthreads="$n" -JrampUp="$rampUp" -Jloops=5 -JthinkTime=500 \
    -l "$jtl" -e -o "$report" || echo "x${n} exited with an error, continuing"
done