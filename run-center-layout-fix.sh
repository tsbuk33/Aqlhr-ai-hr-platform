#!/bin/bash

# Run the center layout fixer across entire AqlHR platform
echo "🎯 Running center layout fixer across entire AqlHR platform..."

# First run in dry-run mode to see what will be changed
echo "📋 Scanning for layout issues (dry-run)..."
npx tsx scripts/fix-center-layout.ts --dry-run

echo ""
echo "✨ Applying centering fixes..."
# Apply the actual fixes
npx tsx scripts/fix-center-layout.ts --apply

echo ""
echo "🎉 Center layout enforcement complete!"
echo "📊 Check the generated report for details"