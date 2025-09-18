#!/bin/bash

echo "🎯 AqlHR Specific Test Suite Runner"
echo "===================================="
echo ""

# Function to run a specific test suite
run_suite() {
    local suite_name="$1"
    local spec_file="$2" 
    local description="$3"
    
    echo "🧪 Running: $suite_name"
    echo "📋 Description: $description"
    echo "📁 Spec: $spec_file"
    echo ""
    
    if npx cypress run --spec "$spec_file" --reporter json --reporter-options "output=cypress/reports/${suite_name}_$(date +%Y%m%d_%H%M%S).json"; then
        echo "✅ $suite_name completed successfully"
        echo ""
    else
        echo "❌ $suite_name failed"
        echo ""
        return 1
    fi
}

# Display available options
echo "📊 Available Test Suites:"
echo "========================="
echo ""
echo "1. 🔢 Arabic Numerals Only"
echo "   • Focus: ٠١٢٣٤٥٦٧٨٩ validation"
echo "   • Critical pages: payroll, analytics, leave"
echo "   • Command: run_arabic_numerals"
echo ""
echo "2. 🌐 Bilingual Labels Only"
echo "   • Focus: Exact Arabic translation validation"
echo "   • Critical labels: الرواتب، نظرة عامة على النظام"
echo "   • Command: run_bilingual_labels"
echo ""
echo "3. ↔️ RTL Layout Only"
echo "   • Focus: Right-to-left alignment"
echo "   • Components: cards, forms, navigation"
echo "   • Command: run_rtl_layout"
echo ""
echo "4. 🎯 Critical Pages Only"
echo "   • Focus: 5 most important Arabic routes"
echo "   • Pages: system-overview, payroll, leave, analytics, executive-center"
echo "   • Command: run_critical_pages"
echo ""
echo "5. 🖱️ Interactive Elements"
echo "   • Focus: Tables, forms, charts, AI assistant"
echo "   • Validation: Functionality in both languages"
echo "   • Command: run_interactive"
echo ""

# Check command line argument
case "${1:-menu}" in
    "arabic"|"numerals"|"1")
        echo "🔢 Running Arabic Numerals Test Suite"
        echo "====================================="
        run_suite "arabic_numerals" "cypress/e2e/arabic-indic-numerals.cy.ts" "Arabic-Indic numeral validation (٠١٢٣٤٥٦٧٨٩)"
        ;;
        
    "bilingual"|"labels"|"2")
        echo "🌐 Running Bilingual Labels Test Suite"
        echo "======================================"
        run_suite "bilingual_labels" "cypress/e2e/bilingual-functional.cy.ts" "Exact Arabic label validation"
        ;;
        
    "rtl"|"layout"|"3")
        echo "↔️ Running RTL Layout Test Suite"
        echo "==============================="
        run_suite "rtl_layout" "cypress/e2e/enhanced-rtl-layout.cy.ts" "Right-to-left layout validation"
        ;;
        
    "critical"|"pages"|"4")
        echo "🎯 Running Critical Pages Test Suite"
        echo "===================================="
        run_suite "critical_pages" "cypress/e2e/comprehensive-route-testing.cy.ts" "5 most critical Arabic routes"
        ;;
        
    "interactive"|"elements"|"5")
        echo "🖱️ Running Interactive Elements Test Suite"
        echo "=========================================="
        run_suite "interactive_elements" "cypress/e2e/interactive-components.cy.ts" "Interactive components validation"
        ;;
        
    "all"|"comprehensive")
        echo "🧪 Running ALL Test Suites"
        echo "=========================="
        bash scripts/run-strict-bilingual-tests.sh
        ;;
        
    "menu"|*)
        echo "💡 Usage Examples:"
        echo "=================="
        echo ""
        echo "Run specific suite:"
        echo "   bash run-specific-test-suites.sh arabic     # Just Arabic numerals"
        echo "   bash run-specific-test-suites.sh bilingual  # Just bilingual labels"
        echo "   bash run-specific-test-suites.sh rtl        # Just RTL layout"
        echo "   bash run-specific-test-suites.sh critical   # Just critical pages"
        echo "   bash run-specific-test-suites.sh interactive # Just interactive elements"
        echo ""
        echo "Direct Cypress commands:"
        echo "   npx cypress run --spec 'cypress/e2e/arabic-indic-numerals.cy.ts'"
        echo "   npx cypress run --spec 'cypress/e2e/bilingual-functional.cy.ts'"
        echo "   npx cypress run --spec 'cypress/e2e/enhanced-rtl-layout.cy.ts'"
        echo ""
        echo "NPM script alternatives (add to package.json):"
        echo "   npm run test:arabic      # Arabic numerals only"
        echo "   npm run test:bilingual   # Bilingual labels only"
        echo "   npm run test:rtl         # RTL layout only"
        echo ""
        
        read -p "🎯 Choose a test suite (1-5) or 'all' for comprehensive: " choice
        
        case "$choice" in
            "1"|"arabic") exec "$0" arabic ;;
            "2"|"bilingual") exec "$0" bilingual ;;
            "3"|"rtl") exec "$0" rtl ;;
            "4"|"critical") exec "$0" critical ;;
            "5"|"interactive") exec "$0" interactive ;;
            "all"|"comprehensive") exec "$0" all ;;
            *) echo "ℹ️ Exiting. Run with specific argument next time." ;;
        esac
        ;;
esac

echo ""
echo "📊 Check Results:"
echo "================="
echo "   🌐 HTML Reports: cypress/reports/*.html"
echo "   📊 JSON Data: cypress/reports/*.json"
echo "   📸 Screenshots: cypress/screenshots/"
echo ""
echo "🔍 Quick Validation:"
echo "===================="
echo "   • Visit: http://localhost:5173/ar/payroll"
echo "   • Console: validateArabicRoute()"
echo "   • Check: Arabic numerals ٠١٢٣٤٥٦٧٨٩ display"
echo ""