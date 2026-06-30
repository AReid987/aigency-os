#!/usr/bin/env bash
# aigency-os health check — verifies all 9 API services respond on /health
# Usage: bash infra/scripts/health-check.sh [base_host]
#   base_host defaults to http://localhost

set -euo pipefail

BASE="${1:-http://localhost}"

# Service name → internal port (container-to-container) or external port
declare -A SERVICES=(
  ["paperclip-api"]="3001"
  ["bmad"]="3010"
  ["paul"]="3011"
  ["gstack"]="3012"
  ["plannotator"]="3013"
  ["aegis"]="3014"
  ["denchclaw"]="3015"
  ["gbrain"]="3016"
  ["hcom-api"]="3007"
)

pass=0
fail=0
total=${#SERVICES[@]}

printf "%-20s  %-8s  %s\n" "SERVICE" "PORT" "STATUS"
printf "%-20s  %-8s  %s\n" "-------" "----" "------"

for svc in $(echo "${!SERVICES[@]}" | tr ' ' '\n' | sort); do
  port="${SERVICES[$svc]}"
  url="${BASE}:${port}/health"

  if http_code=$(curl -sf -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 "$url" 2>/dev/null); then
    if [[ "$http_code" == "200" ]]; then
      printf "%-20s  %-8s  ✅ UP (HTTP %s)\n" "$svc" "$port" "$http_code"
      ((pass++))
    else
      printf "%-20s  %-8s  ⚠️  DEGRADED (HTTP %s)\n" "$svc" "$port" "$http_code"
      ((fail++))
    fi
  else
    printf "%-20s  %-8s  ❌ DOWN\n" "$svc" "$port"
    ((fail++))
  fi
done

echo ""
echo "────────────────────────────────────────"
echo "Results: ${pass}/${total} healthy, ${fail} failed"
echo "────────────────────────────────────────"

if [[ "$fail" -gt 0 ]]; then
  exit 1
fi
