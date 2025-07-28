#!/bin/bash

echo "🚀 Starting AqlHR Full Platform Audit & Auto-Fix..."

# Make scripts executable
chmod +x scripts/*.ts

# Run the comprehensive audit
npx tsx scripts/comprehensive-audit.ts

echo "📊 Audit complete! Check AQLHR_FULL_AUDIT_REPORT.md for detailed results."