#!/bin/bash

# 🏷️ SanadHR Backup Tag Creator
# Creates timestamped backup tags with release notes

set -e

# Configuration
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M:%S)
TAG_NAME="backup/$DATE"
BRANCH_NAME="archive/mainline-$DATE"

echo "🏷️ Creating SanadHR backup tag: $TAG_NAME"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Ensure we're on the main/dev branch
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
echo "📍 Current branch: $CURRENT_BRANCH"

# Get latest changes
echo "📥 Pulling latest changes..."
git pull origin $CURRENT_BRANCH

# Generate release notes
echo "📝 Generating release notes..."
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "Initial")
COMMIT_COUNT=$(git rev-list --count HEAD)
TOTAL_FILES=$(find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | wc -l)
TOTAL_COMPONENTS=$(find src/components -name "*.tsx" 2>/dev/null | wc -l || echo "0")
TOTAL_PAGES=$(find src/pages -name "*.tsx" 2>/dev/null | wc -l || echo "0")

# Create release notes
cat > /tmp/release-notes.md << EOF
# 🚀 SanadHR Backup Release - $DATE

## 📊 Project Statistics
- **Total Commits**: $COMMIT_COUNT
- **Components**: $TOTAL_COMPONENTS
- **Pages**: $TOTAL_PAGES  
- **TypeScript Files**: $TOTAL_FILES
- **Last Backup**: $LAST_TAG
- **Backup Created**: $DATE at $TIME UTC

## 🏗️ Architecture Overview
- ✅ **Supabase Integration**: 22 database tables with RLS
- ✅ **Localization**: Complete Arabic-English support
- ✅ **Mobile Ready**: Capacitor configuration
- ✅ **AI Features**: Sync engine, recommendations, predictions
- ✅ **Government APIs**: GOSI, Qiwa, MOL, ZATCA integrations

## 🔧 Technical Features
- **Database**: PostgreSQL with custom functions and triggers
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **UI Components**: Shadcn/ui with custom enterprise theme
- **Performance**: Memoized components and optimized hooks
- **Accessibility**: WCAG compliant with RTL support

## 📁 Key Modules
- **Core HR**: Employee management, payroll, attendance
- **Analytics**: Real-time dashboards and reporting
- **AI & Automation**: Document processing, predictive analytics
- **Government**: Saudi-specific compliance and integrations
- **Strategic**: Workforce planning and succession management

## 🔒 Backup Contents
This backup includes:
- Complete source code and assets
- Database schema and migrations
- Supabase edge functions
- Configuration files
- Documentation and scripts

---
*Generated automatically by SanadHR backup system*
EOF

# Create the tag
echo "🏷️ Creating tag: $TAG_NAME"
git tag -a "$TAG_NAME" -F /tmp/release-notes.md

# Create archive branch
echo "🌿 Creating archive branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"
git push origin "$BRANCH_NAME"
git checkout $CURRENT_BRANCH

# Push tag
echo "📤 Pushing tag to remote..."
git push origin "$TAG_NAME"

# Clean up
rm /tmp/release-notes.md

echo "✅ Backup tag created successfully!"
echo "🔗 Tag: $TAG_NAME"
echo "🌿 Archive branch: $BRANCH_NAME"
echo ""
echo "Next steps:"
echo "1. Check GitHub releases page for the new tag"
echo "2. Set up GitHub repository secrets for S3 backup"
echo "3. Configure branch protection for archive branches"