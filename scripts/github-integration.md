# GitHub & Vercel Integration Guide for Parallel Validation

## Overview
This guide explains how to integrate the AqlHR parallel validation script with GitHub Actions and Vercel for automated testing during deployments.

## Integration Options

### 1. Production Deployment Testing
- **Workflow**: `.github/workflows/vercel-deployment-tests.yml`
- **Triggers**: When Vercel production deployment succeeds
- **Purpose**: Validate live production deployments

### 2. Preview Deployment Testing
- **Workflow**: `.github/workflows/preview-deployment-tests.yml`
- **Triggers**: On pull requests when Vercel preview is ready
- **Purpose**: Test PR changes before merging

## Setup Instructions

### 1. Repository Secrets
Add these secrets to your GitHub repository:
```
SUPABASE_URL=https://qcuhjcyjlkfizesndmth.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Vercel Configuration
The `vercel.json` file is configured to:
- Enable GitHub integration
- Support preview comments
- Set proper security headers
- Handle SPA routing

### 3. Script Usage
The parallel validation script now supports:
```bash
# Local testing
./scripts/run-parallel-validation.sh

# External URL testing (for CI/CD)
./scripts/run-parallel-validation.sh --external-url
AQLHR_TEST_URL="https://your-site.vercel.app" ./scripts/run-parallel-validation.sh --external-url

# Custom URL
./scripts/run-parallel-validation.sh --url "https://custom-domain.com"
```

## Workflow Behavior

### Production Deployment Tests
1. **Trigger**: Vercel deployment status = success
2. **Wait**: 30 seconds for deployment to be accessible
3. **Test**: Run all 4 test suites in parallel against live site
4. **Report**: Upload artifacts and comment on PR (if applicable)

### Preview Deployment Tests
1. **Trigger**: Pull request opened/updated
2. **Wait**: Up to 5 minutes for Vercel preview to be ready
3. **Test**: Run validation against preview URL
4. **Comment**: Add results directly to PR

## Test Suites Included
- **Arabic-Indic Numerals**: Validates proper numeral rendering
- **RTL & i18n**: Tests right-to-left layout and translations
- **Module Features**: Validates core functionality
- **Critical Screenshots**: Captures visual validation screenshots

## Performance Benefits
- **70% faster**: ~4-5 minutes vs ~16 minutes sequential
- **Parallel execution**: All suites run simultaneously
- **Early feedback**: Results available within minutes of deployment

## Monitoring & Debugging
- **Artifacts**: All test reports and screenshots saved
- **Logs**: Detailed execution logs in GitHub Actions
- **PR Comments**: Automatic status updates
- **Vercel Integration**: Deployment status tracking

## Manual Testing
You can also run the script manually against any deployed URL:
```bash
export AQLHR_TEST_URL="https://your-deployed-site.com"
./scripts/run-parallel-validation.sh --external-url
```

## Troubleshooting
- Ensure Vercel deployment is fully accessible before testing
- Check that all required environment variables are set
- Verify Cypress can access the target URL
- Monitor GitHub Actions logs for detailed error information