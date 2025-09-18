#!/bin/bash

echo "🔍 Checking AqlHR Test Reports"
echo "==============================="

REPORTS_DIR="cypress/reports"

# Check if reports directory exists and has files
if [ -d "$REPORTS_DIR" ] && [ "$(ls -A $REPORTS_DIR 2>/dev/null)" ]; then
    echo "✅ Reports found in $REPORTS_DIR:"
    echo ""
    
    # List all report files
    for file in "$REPORTS_DIR"/*; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            size=$(du -h "$file" | cut -f1)
            modified=$(stat -c %y "$file" 2>/dev/null || stat -f %Sm "$file" 2>/dev/null)
            
            case "$filename" in
                *.html)
                    echo "🌐 HTML Report: $filename ($size)"
                    echo "   📅 Modified: $modified"
                    echo "   🔗 Open: file://$(pwd)/$file"
                    ;;
                *.json)
                    echo "📊 JSON Report: $filename ($size)"
                    echo "   📅 Modified: $modified"
                    ;;
                *)
                    echo "📄 Other: $filename ($size)"
                    ;;
            esac
            echo ""
        fi
    done
else
    echo "⚠️  No reports found in $REPORTS_DIR"
    echo ""
    echo "To generate reports, run one of these commands:"
    echo ""
    echo "🧪 Full Comprehensive Suite:"
    echo "   bash scripts/run-strict-bilingual-tests.sh"
    echo ""
    echo "🔄 Individual Test Suites:"
    echo "   npx cypress run --spec 'cypress/e2e/bilingual-functional.cy.ts'"
    echo "   npx cypress run --spec 'cypress/e2e/arabic-indic-numerals.cy.ts'"
    echo "   npx cypress run --spec 'cypress/e2e/comprehensive-bilingual-suite.cy.ts'"
    echo ""
    echo "📋 Sample Report (for preview):"
    echo "   node generate-sample-report.js"
    echo ""
fi

# Check for screenshots
SCREENSHOTS_DIR="cypress/screenshots"
if [ -d "$SCREENSHOTS_DIR" ] && [ "$(ls -A $SCREENSHOTS_DIR 2>/dev/null)" ]; then
    echo "📸 Screenshots found in $SCREENSHOTS_DIR:"
    echo ""
    
    for file in "$SCREENSHOTS_DIR"/*; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            size=$(du -h "$file" | cut -f1)
            echo "   🖼️  $filename ($size)"
        fi
    done
    echo ""
else
    echo "📸 No screenshots found (generated during test runs)"
    echo ""
fi

# Show what reports should contain
echo "📋 Expected Report Format:"
echo "=========================="
echo ""
echo "✅ Pass / ⚠️ Partial / ❌ Fail status per route"
echo ""
echo "Critical Arabic Routes Coverage:"
echo "   • /ar/system-overview → Cards fully Arabic"  
echo "   • /ar/payroll → Salaries in ٠١٢٣٤٥٦٧٨٩"
echo "   • /ar/leave → Day counts in Arabic numerals"
echo "   • /ar/analytics → Chart axes in Arabic numerals"
echo "   • /ar/executive-center → RTL layout validation"
echo ""
echo "Report Sections:"
echo "   📊 Executive Summary (pass/fail counts, success rate)"
echo "   🌐 Language Breakdown (EN vs AR results)"
echo "   🔢 Arabic-Indic Numeral Violations"
echo "   📋 Detailed Route Results Table"  
echo "   📸 Screenshot References"
echo "   💡 Actionable Recommendations"
echo ""

# Show sample report if no real reports exist
if [ ! -d "$REPORTS_DIR" ] || [ ! "$(ls -A $REPORTS_DIR 2>/dev/null)" ]; then
    echo "🎯 Generate Sample Report Now:"
    echo "=============================="
    echo ""
    echo "To see what the reports look like, run:"
    echo "   node generate-sample-report.js"
    echo ""
    echo "This creates sample HTML + JSON reports showing:"
    echo "   • 71.43% success rate with issues highlighted"
    echo "   • Arabic numeral violations on critical pages"  
    echo "   • RTL layout validation results"
    echo "   • Exact Arabic label verification"
    echo ""
fi