#!/bin/bash

echo "🔒 Running AqlHR Security Validation..."
echo "======================================"

# Run RLS Policy Audit
echo "📊 Checking RLS Policy Coverage..."
npx tsx scripts/audit-rls-policies.ts

echo ""
echo "🏢 Testing Company Data Isolation..."
npx tsx scripts/security-tests/company-isolation.test.ts

echo ""
echo "📋 Generating Security Report..."
npx tsx scripts/generate-security-report.ts

echo ""
echo "✅ Security validation complete!"
echo "📄 Review SECURITY_AUDIT_REPORT.md for detailed findings"
echo "📚 Follow docs/security/README.md for implementation steps"