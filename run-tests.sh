#!/bin/bash

echo "🧪 Running AqlHR Comprehensive Bilingual Test Suite"
echo "=================================================="

# Make scripts executable
chmod +x scripts/run-comprehensive-tests.sh
chmod +x scripts/run-strict-bilingual-tests.sh

# Run comprehensive tests
echo "▶ Starting comprehensive test suite..."
bash scripts/run-comprehensive-tests.sh

echo ""
echo "✅ Comprehensive test execution completed!"
echo "Check cypress/reports/ for detailed results."