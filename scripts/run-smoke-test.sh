#!/bin/bash

# Comprehensive smoke test runner for prompt logs system
echo "🚀 Running Prompt Logs System Smoke Tests"

# Set up environment
export NODE_ENV=test

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run test and check result
run_test() {
  local test_name="$1"
  local test_command="$2"
  
  echo -e "${YELLOW}Running ${test_name}...${NC}"
  
  if eval "$test_command"; then
    echo -e "${GREEN}✅ ${test_name} passed${NC}"
    return 0
  else
    echo -e "${RED}❌ ${test_name} failed${NC}"
    return 1
  fi
}

# Track failures
FAILED_TESTS=0

# 1. Unit Tests
if ! run_test "Unit Tests" "npm test -- --testPathPattern='prompt-logs|usePromptLogs' --passWithNoTests"; then
  ((FAILED_TESTS++))
fi

# 2. Type Checking
if ! run_test "TypeScript Type Check" "npx tsc --noEmit"; then
  ((FAILED_TESTS++))
fi

# 3. Linting
if ! run_test "ESLint Check" "npx eslint src/__tests__/**/*.{ts,tsx} --quiet"; then
  ((FAILED_TESTS++))
fi

# 4. Integration Tests (if Supabase credentials are available)
if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_ANON_KEY" ]; then
  if ! run_test "Integration Tests" "npx tsx scripts/test-prompt-logs-system.ts"; then
    ((FAILED_TESTS++))
  fi
else
  echo -e "${YELLOW}⚠️  Skipping integration tests - Supabase credentials not available${NC}"
fi

# 5. Build Test
if ! run_test "Build Test" "npm run build"; then
  ((FAILED_TESTS++))
fi

# 6. Security Audit (if in CI environment)
if [ "$CI" = "true" ]; then
  if ! run_test "Dependency Audit" "npm audit --audit-level moderate"; then
    ((FAILED_TESTS++))
  fi
fi

# Summary
echo ""
echo "===================="
echo "SMOKE TEST SUMMARY"
echo "===================="

if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed! Prompt logs system is ready for production.${NC}"
  exit 0
else
  echo -e "${RED}💥 $FAILED_TESTS test(s) failed. Please fix the issues before deploying.${NC}"
  exit 1
fi