#!/bin/bash

echo "🚀 AqlHR Local Validation Execution Guide"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking Prerequisites...${NC}"
    echo "================================"
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo -e "✅ Node.js: ${GREEN}$NODE_VERSION${NC}"
        
        # Check if version is 16+
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$MAJOR_VERSION" -lt 16 ]; then
            echo -e "${RED}❌ Node.js 16+ required, found: $NODE_VERSION${NC}"
            echo "   👉 Install from: https://nodejs.org/"
            return 1
        fi
    else
        echo -e "${RED}❌ Node.js not found${NC}"
        echo "   👉 Install from: https://nodejs.org/"
        return 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        echo -e "✅ npm: ${GREEN}$NPM_VERSION${NC}"
    else
        echo -e "${RED}❌ npm not found${NC}"
        return 1
    fi
    
    # Check if we're in project directory
    if [ -f "package.json" ]; then
        echo -e "✅ Project directory: ${GREEN}$(pwd)${NC}"
    else
        echo -e "${RED}❌ package.json not found${NC}"
        echo "   👉 Navigate to your AqlHR project root directory"
        return 1
    fi
    
    # Check if dependencies are installed
    if [ -d "node_modules" ]; then
        echo -e "✅ Dependencies: ${GREEN}Installed${NC}"
    else
        echo -e "${YELLOW}⚠️ Dependencies not installed${NC}"
        echo "   👉 Running: npm install"
        npm install
    fi
    
    # Check Cypress
    if npx cypress version &> /dev/null; then
        CYPRESS_VERSION=$(npx cypress version --component package 2>/dev/null | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+' | head -1)
        echo -e "✅ Cypress: ${GREEN}$CYPRESS_VERSION${NC}"
    else
        echo -e "${RED}❌ Cypress not found${NC}"
        echo "   👉 Installing Cypress..."
        npm install cypress --save-dev
    fi
    
    echo ""
    return 0
}

# Function to check dev server
check_dev_server() {
    echo -e "${BLUE}🌐 Checking Development Server...${NC}"
    echo "=================================="
    
    if curl -s http://localhost:5173 > /dev/null; then
        echo -e "✅ Dev server: ${GREEN}Running on localhost:5173${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️ Dev server not running${NC}"
        echo "   👉 Starting development server..."
        
        # Start dev server in background
        npm run dev &
        DEV_PID=$!
        echo "   📝 Dev server PID: $DEV_PID"
        
        # Wait for server to start
        echo "   ⏳ Waiting for server to start..."
        for i in {1..30}; do
            if curl -s http://localhost:5173 > /dev/null; then
                echo -e "   ✅ Dev server: ${GREEN}Started successfully${NC}"
                return 0
            fi
            sleep 1
            echo -n "."
        done
        
        echo -e "\n   ${RED}❌ Failed to start dev server${NC}"
        return 1
    fi
}

# Function to make scripts executable
setup_scripts() {
    echo -e "${BLUE}🔧 Setting up scripts...${NC}"
    echo "========================"
    
    # Make main scripts executable
    chmod +x run-final-validation.sh 2>/dev/null || echo "   ⚠️ run-final-validation.sh not found"
    chmod +x scripts/run-strict-bilingual-tests.sh 2>/dev/null || echo "   ⚠️ scripts/run-strict-bilingual-tests.sh not found"
    chmod +x scripts/run-comprehensive-tests.sh 2>/dev/null || echo "   ⚠️ scripts/run-comprehensive-tests.sh not found"
    
    echo -e "   ✅ Scripts: ${GREEN}Ready${NC}"
    echo ""
}

# Function to run validation pipeline
run_validation_pipeline() {
    echo -e "${PURPLE}🧪 Executing Validation Pipeline...${NC}"
    echo "===================================="
    echo ""
    
    echo -e "${BLUE}Step 1: Running comprehensive test suite${NC}"
    if [ -f "run-final-validation.sh" ]; then
        bash run-final-validation.sh
    elif [ -f "scripts/run-strict-bilingual-tests.sh" ]; then
        bash scripts/run-strict-bilingual-tests.sh
    else
        echo -e "${YELLOW}⚠️ Running individual Cypress tests...${NC}"
        
        # Create reports directory
        mkdir -p cypress/reports
        
        # Run key test suites
        echo "   🔢 Arabic numerals validation..."
        npx cypress run --spec 'cypress/e2e/arabic-indic-numerals.cy.ts' --reporter json --reporter-options "output=cypress/reports/arabic_numerals_$(date +%Y%m%d_%H%M%S).json" || true
        
        echo "   🌐 Bilingual labels validation..."
        npx cypress run --spec 'cypress/e2e/bilingual-functional.cy.ts' --reporter json --reporter-options "output=cypress/reports/bilingual_labels_$(date +%Y%m%d_%H%M%S).json" || true
        
        echo "   ↔️ RTL layout validation..."
        npx cypress run --spec 'cypress/e2e/enhanced-rtl-layout.cy.ts' --reporter json --reporter-options "output=cypress/reports/rtl_layout_$(date +%Y%m%d_%H%M%S).json" || true
    fi
    
    echo ""
}

# Function to capture screenshots
capture_screenshots() {
    echo -e "${BLUE}📸 Capturing Critical Route Screenshots...${NC}"
    echo "========================================="
    echo ""
    
    # Method 1: Try Cypress screenshot test
    if [ -f "cypress/e2e/capture-critical-screenshots.cy.ts" ]; then
        echo "   📋 Using Cypress screenshot test..."
        npx cypress run --spec "cypress/e2e/capture-critical-screenshots.cy.ts" --browser chrome
    else
        echo "   ⚠️ Screenshot test not found, creating manual capture script..."
        
        # Create manual screenshot instructions
        cat > manual-screenshot-guide.txt << 'EOF'
📸 Manual Screenshot Capture Guide
==================================

Visit each URL below and take a screenshot:

1. http://localhost:5173/ar/system-overview
   → Save as: ar-system-overview-validation.png
   → Check for: "نظرة عامة على النظام" header

2. http://localhost:5173/ar/payroll  
   → Save as: ar-payroll-numerals.png
   → Check for: Arabic numerals ٢٥٠,٠٠٠

3. http://localhost:5173/ar/leave
   → Save as: ar-leave-management.png
   → Check for: "إدارة الإجازات" header

4. http://localhost:5173/ar/analytics
   → Save as: ar-analytics-charts.png
   → Check for: Chart axes with Arabic numerals

5. http://localhost:5173/ar/executive-center
   → Save as: ar-executive-center-rtl.png
   → Check for: "مركز الذكاء التنفيذي" header

💡 Browser Console Validation:
On each page, open DevTools (F12) → Console → paste:
validateArabicRoute()
EOF
        
        echo -e "   📋 Manual guide created: ${GREEN}manual-screenshot-guide.txt${NC}"
    fi
    
    echo ""
}

# Function to display results
show_results() {
    echo -e "${PURPLE}📊 Validation Results${NC}"
    echo "==================="
    echo ""
    
    # Check for generated files
    if [ -d "cypress/reports" ]; then
        echo -e "${GREEN}📁 Test Reports:${NC}"
        ls -la cypress/reports/ | grep -E '\.(html|json)$' | while read line; do
            echo "   📄 $line"
        done
        echo ""
        
        # Find and display HTML reports
        HTML_REPORTS=$(find cypress/reports -name "*.html" -type f 2>/dev/null)
        if [ ! -z "$HTML_REPORTS" ]; then
            echo -e "${GREEN}🌐 Open HTML Reports:${NC}"
            for report in $HTML_REPORTS; do
                echo "   🔗 file://$(pwd)/$report"
            done
            echo ""
        fi
    fi
    
    if [ -d "cypress/screenshots" ]; then
        echo -e "${GREEN}📸 Screenshots:${NC}"
        ls -la cypress/screenshots/ 2>/dev/null | grep -E '\.png$' | while read line; do
            echo "   🖼️ $line"
        done
        echo ""
    fi
    
    echo -e "${BLUE}🎯 Next Steps:${NC}"
    echo "=============="
    echo "1. Open HTML reports in browser to review results"
    echo "2. Check screenshots for visual validation"
    echo "3. Run browser console validation on critical routes"
    echo "4. Address any failures found in reports"
    echo ""
    
    echo -e "${GREEN}🏆 Production Sign-off Checklist:${NC}"
    echo "================================="
    echo "□ All 71 routes tested in both EN and AR"
    echo "□ Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) on Arabic routes"
    echo "□ Exact Arabic labels validated"
    echo "□ RTL layout properly implemented"
    echo "□ Screenshots captured for critical routes"
    echo "□ Zero English text leakage on Arabic routes"
    echo ""
}

# Main execution
main() {
    echo "🎯 Starting local validation execution..."
    echo ""
    
    # Run all checks
    if ! check_prerequisites; then
        echo -e "${RED}❌ Prerequisites check failed${NC}"
        exit 1
    fi
    
    if ! check_dev_server; then
        echo -e "${RED}❌ Dev server check failed${NC}"
        exit 1
    fi
    
    setup_scripts
    run_validation_pipeline
    capture_screenshots
    show_results
    
    echo -e "${GREEN}🎉 Local validation execution completed!${NC}"
}

# Handle cleanup on exit
cleanup() {
    if [ ! -z "$DEV_PID" ]; then
        echo "🧹 Cleaning up..."
        kill $DEV_PID 2>/dev/null || true
    fi
}

trap cleanup EXIT

# Run main function
main "$@"