#!/bin/bash

echo "🚀 Executing comprehensive universal scaffolding for AqlHR platform..."

# Run the universal scaffolding
npx tsx scripts/apply-universal-scaffolding.ts

echo "✅ Universal scaffolding complete!"
echo "🔄 Running audit to verify completion..."

# Run audit to verify
npx tsx scripts/audit-module-features.ts > audit-results.json

echo "📊 Audit complete! Results saved to audit-results.json"