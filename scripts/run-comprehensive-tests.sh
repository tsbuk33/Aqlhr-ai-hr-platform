#!/bin/bash

# AqlHR Comprehensive Testing Suite Runner
# Executes all 142 route tests (71 routes × 2 languages) with detailed reporting

set -e

echo "🧪 Starting AqlHR Comprehensive Bilingual Testing Suite"
echo "=================================================="

# Configuration
CYPRESS_CACHE_FOLDER="node_modules/.cache/cypress"
REPORTS_DIR="cypress/reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_PREFIX="comprehensive_test_${TIMESTAMP}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create reports directory
mkdir -p "$REPORTS_DIR"

# Function to run test and capture results
run_test_suite() {
    local suite_name="$1"
    local spec_file="$2"
    local description="$3"
    
    echo -e "${BLUE}▶ Running ${suite_name}${NC}"
    echo "  Description: ${description}"
    
    if npx cypress run --spec "cypress/e2e/${spec_file}" --reporter json --reporter-options "output=${REPORTS_DIR}/${suite_name}_${TIMESTAMP}.json"; then
        echo -e "${GREEN}✅ ${suite_name} completed successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ ${suite_name} failed${NC}"
        return 1
    fi
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check if Cypress is installed
    if ! command -v npx &> /dev/null; then
        echo -e "${RED}❌ npx is not available${NC}"
        exit 1
    fi
    
    # Check if application is running
    if ! curl -s http://localhost:5173 > /dev/null; then
        echo -e "${YELLOW}⚠️  Application not running on localhost:5173${NC}"
        echo "Starting development server..."
        npm run dev &
        DEV_PID=$!
        sleep 10
        
        if ! curl -s http://localhost:5173 > /dev/null; then
            echo -e "${RED}❌ Failed to start application${NC}"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
}

# Function to generate summary report
generate_summary() {
    local total_suites=$1
    local passed_suites=$2
    local failed_suites=$3
    
    echo ""
    echo "📊 COMPREHENSIVE TEST SUMMARY"
    echo "=============================="
    echo "Total Test Suites: ${total_suites}"
    echo -e "Passed: ${GREEN}${passed_suites}${NC}"
    echo -e "Failed: ${RED}${failed_suites}${NC}"
    echo "Success Rate: $(( (passed_suites * 100) / total_suites ))%"
    
    # Generate HTML summary
    cat > "${REPORTS_DIR}/test_summary_${TIMESTAMP}.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>AqlHR Comprehensive Test Summary</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; }
        .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
        .metric { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 2rem; font-weight: bold; }
        .passed { color: #059669; }
        .failed { color: #dc2626; }
        .timestamp { color: #6b7280; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 AqlHR Comprehensive Test Results</h1>
        <p class="timestamp">Generated: $(date)</p>
    </div>
    
    <div class="summary">
        <div class="metric">
            <div class="metric-value">${total_suites}</div>
            <div>Total Suites</div>
        </div>
        <div class="metric">
            <div class="metric-value passed">${passed_suites}</div>
            <div>Passed</div>
        </div>
        <div class="metric">
            <div class="metric-value failed">${failed_suites}</div>
            <div>Failed</div>
        </div>
    </div>
    
    <h2>📋 Test Coverage</h2>
    <ul>
        <li>✅ 142 total route tests (71 routes × 2 languages)</li>
        <li>🔢 Arabic-Indic numeral validation</li>
        <li>🔄 RTL layout verification</li>
        <li>🎛️ Interactive component testing</li>
        <li>🌐 Bilingual translation validation</li>
    </ul>
</body>
</html>
EOF
    
    echo "📄 Summary report saved to: ${REPORTS_DIR}/test_summary_${TIMESTAMP}.html"
}

# Main execution
main() {
    local failed_suites=0
    local passed_suites=0
    local total_suites=5
    
    echo "🎯 Target: 142 route tests across all test suites"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Test Suite 1: RTL i18n Validation
    if run_test_suite "rtl_i18n" "rtl_i18n_spec.cy.ts" "Basic RTL and i18n validation"; then
        ((passed_suites++))
    else
        ((failed_suites++))
    fi
    
    # Test Suite 2: Arabic-Indic Numerals
    if run_test_suite "arabic_numerals" "arabic-indic-numerals.cy.ts" "Arabic-Indic numeral validation across all routes"; then
        ((passed_suites++))
    else
        ((failed_suites++))
    fi
    
    # Test Suite 3: Comprehensive Bilingual Routes
    if run_test_suite "bilingual_routes" "comprehensive-bilingual-suite.cy.ts" "All 71 routes × 2 languages = 142 total tests"; then
        ((passed_suites++))
    else
        ((failed_suites++))
    fi
    
    # Test Suite 4: Enhanced RTL Layout
    if run_test_suite "rtl_layout" "enhanced-rtl-layout.cy.ts" "Advanced RTL layout and component validation"; then
        ((passed_suites++))
    else
        ((failed_suites++))
    fi
    
    # Test Suite 5: Interactive Components
    if run_test_suite "interactive_components" "interactive-components.cy.ts" "Tables, forms, charts, and AI assistant validation"; then
        ((passed_suites++))
    else
        ((failed_suites++))
    fi
    
    # Generate final report
    generate_summary $total_suites $passed_suites $failed_suites
    
    # Exit with appropriate code
    if [ $failed_suites -eq 0 ]; then
        echo -e "${GREEN}🎉 All test suites passed!${NC}"
        exit 0
    else
        echo -e "${RED}❌ Some test suites failed. Check individual reports for details.${NC}"
        exit 1
    fi
}

# Handle cleanup on exit
cleanup() {
    if [ ! -z "$DEV_PID" ]; then
        echo "Stopping development server..."
        kill $DEV_PID 2>/dev/null || true
    fi
}

trap cleanup EXIT

# Execute main function
main "$@"