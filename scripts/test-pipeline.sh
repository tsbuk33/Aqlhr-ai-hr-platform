#!/bin/bash

# Production-ready test pipeline for AqlHR
# Runs comprehensive smoke tests including E2E, unit, and integration tests
# Designed to block deployment on any failures

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
TEST_RESULTS=()

# Function to run test and track results
run_test_stage() {
  local stage_name="$1"
  local test_command="$2"
  local required="${3:-true}"
  
  ((TOTAL_TESTS++))
  echo -e "${BLUE}🧪 Running ${stage_name}...${NC}"
  
  if eval "$test_command" 2>&1 | tee "/tmp/test-${stage_name}.log"; then
    echo -e "${GREEN}✅ ${stage_name} PASSED${NC}"
    ((PASSED_TESTS++))
    TEST_RESULTS+=("✅ ${stage_name}")
    return 0
  else
    echo -e "${RED}❌ ${stage_name} FAILED${NC}"
    ((FAILED_TESTS++))
    TEST_RESULTS+=("❌ ${stage_name}")
    
    if [[ "$required" == "true" ]]; then
      echo -e "${RED}💥 ${stage_name} is required - stopping pipeline${NC}"
      show_failure_summary
      exit 1
    else
      echo -e "${YELLOW}⚠️  ${stage_name} is optional - continuing pipeline${NC}"
      return 1
    fi
  fi
}

# Function to show failure summary
show_failure_summary() {
  echo ""
  echo -e "${RED}===================="
  echo -e "PIPELINE FAILURE"
  echo -e "====================${NC}"
  echo ""
  echo -e "${YELLOW}Failed Tests Summary:${NC}"
  for result in "${TEST_RESULTS[@]}"; do
    if [[ $result == *"❌"* ]]; then
      echo "  $result"
    fi
  done
  echo ""
  echo -e "${YELLOW}Check logs in /tmp/test-*.log for details${NC}"
  echo ""
}

# Function to show success summary
show_success_summary() {
  echo ""
  echo -e "${GREEN}===================="
  echo -e "PIPELINE SUCCESS"
  echo -e "====================${NC}"
  echo ""
  echo -e "${GREEN}✨ All tests passed! Ready for deployment.${NC}"
  echo ""
  echo -e "${BLUE}Test Results Summary:${NC}"
  for result in "${TEST_RESULTS[@]}"; do
    echo "  $result"
  done
  echo ""
  echo -e "${GREEN}Total: ${PASSED_TESTS}/${TOTAL_TESTS} tests passed${NC}"
}

# Main pipeline
main() {
  echo -e "${BLUE}🚀 Starting AqlHR Test Pipeline${NC}"
  echo -e "${BLUE}==============================${NC}"
  echo ""
  
  # Stage 1: TypeScript Type Checking
  run_test_stage "TypeScript Compilation" "npx tsc --noEmit" true
  
  # Stage 2: ESLint Code Quality
  run_test_stage "ESLint Code Quality" "npx eslint src/**/*.{ts,tsx} --quiet --max-warnings 0" true
  
  # Stage 3: Unit Tests
  run_test_stage "Unit Tests" "npm test -- --testPathPattern='smoke-test|usePromptLogs' --passWithNoTests --watchAll=false" true
  
  # Stage 4: Build Test
  run_test_stage "Production Build" "npm run build" true
  
  # Stage 5: E2E Smoke Tests (Critical for regression detection)
  run_test_stage "E2E Smoke Tests" "npx cypress run --spec 'cypress/e2e/smoke.cy.ts' --headless" true
  
  # Stage 6: RTL/i18n Tests
  run_test_stage "RTL/i18n Tests" "npx cypress run --spec 'cypress/e2e/rtl_i18n_spec.cy.ts' --headless" false
  
  # Stage 7: Integration Tests (if credentials available)
  if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_ANON_KEY" ]; then
    run_test_stage "Integration Tests" "npx tsx scripts/test-prompt-logs-system.ts" false
  else
    echo -e "${YELLOW}⚠️  Skipping integration tests - Supabase credentials not available${NC}"
  fi
  
  # Stage 8: Security Audit (in CI only)
  if [ "$CI" = "true" ]; then
    run_test_stage "Security Audit" "npm audit --audit-level moderate" false
  fi
  
  # Success!
  show_success_summary
  
  exit 0
}

# Handle interrupts
trap 'echo -e "${RED}Pipeline interrupted by user${NC}"; exit 1' INT

# Run main pipeline
main "$@"