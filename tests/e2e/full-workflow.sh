#!/usr/bin/env bash
# Aigency OS — End-to-End Workflow Test
# Tests the full idea-to-ship pipeline across all services
set -euo pipefail

PASS=0
FAIL=0
TOTAL=0

check() {
  TOTAL=$((TOTAL + 1))
  local desc="$1"
  local url="$2"
  local method="${3:-GET}"
  local data="${4:-}"
  
  if [ -n "$data" ]; then
    response=$(curl -sf -X "$method" "$url" -H "Content-Type: application/json" -d "$data" 2>/dev/null)
  else
    response=$(curl -sf "$url" 2>/dev/null)
  fi
  
  if [ $? -eq 0 ] && [ -n "$response" ]; then
    echo "  ✓ $desc"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $desc (FAILED)"
    FAIL=$((FAIL + 1))
  fi
}

echo "═══════════════════════════════════════════"
echo " Aigency OS v0.1.0 — E2E Workflow Test"
echo "═══════════════════════════════════════════"
echo ""

# ─── Step 1: Health checks on all services ────────────────────
echo "Step 1: Service Health Checks"
check "Paperclip API" "http://localhost:3001/health"
check "BMAD Service" "http://localhost:3010/health"
check "PAUL Service" "http://localhost:3011/health"
check "Gstack Service" "http://localhost:3012/health"
check "Plannotator Service" "http://localhost:3013/health"
check "AEGIS Service" "http://localhost:3014/health"
check "DenchClaw Service" "http://localhost:3015/health"
check "Gbrain Service" "http://localhost:3016/health"
echo ""

# ─── Step 2: BMAD — Create Business Model Canvas ─────────────
echo "Step 2: BMAD — Create Business Model Canvas"
check "Create BMC" "http://localhost:3010/api/v1/canvas" "POST" '{"name":"Test Venture","sections":[{"key":"value","content":"AI-powered collaboration"}]}'
echo ""

# ─── Step 3: PAUL — Generate Plan from PRD ────────────────────
echo "Step 3: PAUL — Generate Plan from PRD"
check "Generate Plan" "http://localhost:3011/api/v1/plan" "POST" '{"prd":"Build an AI-powered auth system with JWT and RBAC"}'
echo ""

# ─── Step 4: Plannotator — List Plans ─────────────────────────
echo "Step 4: Plannotator — Plan Review"
check "List Plans" "http://localhost:3013/api/v1/plans"
echo ""

# ─── Step 5: AEGIS — Trigger Audit ────────────────────────────
echo "Step 5: AEGIS — Quality Audit"
check "Trigger Audit" "http://localhost:3014/api/v1/audit" "POST" '{"project":"auth-system","domains":["security","performance"]}'
echo ""

# ─── Step 6: Gstack — Run Autoplan ───────────────────────────
echo "Step 6: Gstack — Build Orchestrator"
check "Autoplan" "http://localhost:3012/api/v1/autoplan" "POST" '{"spec":"auth system with JWT"}'
echo ""

# ─── Step 7: DenchClaw — CRM Pipeline ────────────────────────
echo "Step 7: DenchClaw — CRM"
check "List Contacts" "http://localhost:3015/api/v1/contacts"
check "Pipeline View" "http://localhost:3015/api/v1/pipeline"
echo ""

# ─── Step 8: Gbrain — Knowledge Query ────────────────────────
echo "Step 8: Gbrain — Knowledge Brain"
check "Query Knowledge" "http://localhost:3016/api/v1/query?q=auth"
check "Knowledge Graph" "http://localhost:3016/api/v1/graph"
echo ""

# ─── Step 9: Gbrain — Per-User Scoping ───────────────────────
echo "Step 9: Gbrain — Role-Based Scoping"
check "Domain Expert Query" "http://localhost:3016/api/v1/query?q=pricing&role=domain_expert"
check "Tech Founder Query" "http://localhost:3016/api/v1/query?q=architecture&role=technical_founder"
echo ""

# ─── Summary ──────────────────────────────────────────────────
echo "═══════════════════════════════════════════"
echo " Results: $PASS/$TOTAL passed, $FAIL failed"
echo "═══════════════════════════════════════════"

if [ $FAIL -gt 0 ]; then
  exit 1
else
  echo " All checks passed!"
  exit 0
fi
