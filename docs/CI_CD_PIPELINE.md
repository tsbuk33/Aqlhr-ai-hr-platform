# AqlHR CI/CD Pipeline Documentation

## Pipeline Overview

The AqlHR platform implements a comprehensive CI/CD pipeline designed for Saudi cloud infrastructure with government compliance requirements, security-first approach, and multi-environment deployment strategy.

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CI/CD Pipeline Flow                          │
├─────────────────────────────────────────────────────────────────┤
│  Developer → Git → CI Pipeline → Security Scan → Build → Test   │
│                           ↓                                     │
│  Staging Deploy → Integration Tests → Security Review          │
│                           ↓                                     │
│  Production Deploy → Monitoring → Rollback (if needed)         │
└─────────────────────────────────────────────────────────────────┘
```

## Environment Strategy

### 1. Environment Hierarchy
```yaml
environments:
  development:
    purpose: "Feature development and testing"
    location: "Local + Shared dev cloud"
    data: "Mock/synthetic data"
    government_apis: "Simulators"
    monitoring: "Basic logging"
    
  staging:
    purpose: "Pre-production validation"
    location: "Saudi cloud region (secondary)"
    data: "Anonymized production data"
    government_apis: "Sandbox/test APIs"
    monitoring: "Full monitoring stack"
    
  production:
    purpose: "Live customer environment"
    location: "Saudi cloud region (primary)"
    data: "Live customer data"
    government_apis: "Production APIs"
    monitoring: "Full monitoring + alerting"
```

### 2. Saudi Cloud Requirements
```typescript
// Cloud infrastructure requirements for Saudi compliance
const saudiCloudRequirements = {
  dataResidency: {
    location: 'Saudi Arabia',
    provider: 'AWS Middle East (Bahrain)' | 'Azure Middle East',
    certification: 'CSC-1 Level 3',
    backup: 'Within Saudi territory'
  },
  
  compliance: {
    regulations: ['PDPL', 'SAMA', 'CITC'],
    dataClassification: 'Government sensitive',
    auditRequirements: 'Quarterly compliance reviews',
    incidentResponse: '24/7 local support'
  },
  
  networking: {
    encryption: 'End-to-end TLS 1.3',
    vpn: 'Site-to-site for government APIs',
    firewall: 'Application-level filtering',
    ddosProtection: 'CloudFlare Enterprise'
  }
};
```

## CI Pipeline Configuration

### 1. GitHub Actions Workflow
```yaml
# .github/workflows/ci-cd.yml
name: AqlHR CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18.x'
  SUPABASE_PROJECT_ID: 'qcuhjcyjlkfizesndmth'

jobs:
  code-quality:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: TypeScript type checking
        run: npm run type-check
        
      - name: ESLint code analysis
        run: npm run lint
        
      - name: Prettier code formatting
        run: npm run format:check
        
      - name: Code complexity analysis
        run: npm run complexity-check

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Dependency vulnerability scan
        run: npm audit --audit-level=moderate
        
      - name: SAST security scanning
        uses: github/codeql-action/analyze@v2
        with:
          languages: typescript, javascript
          
      - name: Secret detection
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD
          
      - name: License compliance check
        run: npm run license-check

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm run test:unit -- --coverage
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  integration-tests:
    runs-on: ubuntu-latest
    needs: [unit-tests]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup test database
        run: |
          docker run -d --name test-postgres \
            -e POSTGRES_PASSWORD=test123 \
            -e POSTGRES_DB=aqlhr_test \
            -p 5432:5432 postgres:15
            
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:test123@localhost:5432/aqlhr_test

  build:
    runs-on: ubuntu-latest
    needs: [code-quality, security-scan, unit-tests]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          
      - name: Build size analysis
        run: npm run analyze:bundle
        
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/
          retention-days: 30

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [build, integration-tests]
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
          
      - name: Deploy to staging
        run: |
          # Deploy to staging environment
          ./scripts/deploy-staging.sh
        env:
          STAGING_DEPLOY_KEY: ${{ secrets.STAGING_DEPLOY_KEY }}
          STAGING_URL: ${{ secrets.STAGING_URL }}
          
      - name: Run smoke tests
        run: npm run test:smoke -- --env=staging

  deploy-production:
    runs-on: ubuntu-latest
    needs: [deploy-staging]
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Production deployment approval
        uses: trstringer/manual-approval@v1
        with:
          secret: ${{ github.TOKEN }}
          approvers: senior-developers,security-team
          
      - name: Blue-green deployment
        run: |
          # Implement blue-green deployment strategy
          ./scripts/deploy-production.sh
        env:
          PROD_DEPLOY_KEY: ${{ secrets.PROD_DEPLOY_KEY }}
          PROD_URL: ${{ secrets.PROD_URL }}
          
      - name: Health check verification
        run: npm run health-check -- --env=production
        
      - name: Performance validation
        run: npm run test:performance -- --env=production
```

### 2. Edge Functions Deployment
```yaml
# .github/workflows/edge-functions.yml
name: Deploy Supabase Edge Functions

on:
  push:
    paths:
      - 'supabase/functions/**'
    branches: [main, develop]

jobs:
  deploy-functions:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest
          
      - name: Deploy edge functions
        run: |
          supabase functions deploy --project-ref ${{ env.SUPABASE_PROJECT_ID }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          
      - name: Test deployed functions
        run: npm run test:edge-functions
```

## Database Migration Pipeline

### 1. Automated Migration Deployment
```bash
#!/bin/bash
# scripts/deploy-migrations.sh

set -e

ENVIRONMENT=$1
PROJECT_REF=$2

echo "Deploying migrations to $ENVIRONMENT environment..."

# Backup current database
supabase db dump --project-ref $PROJECT_REF --file "backup-$(date +%Y%m%d-%H%M%S).sql"

# Apply migrations
supabase db push --project-ref $PROJECT_REF

# Verify migration success
supabase db reset --project-ref $PROJECT_REF --linked

# Run post-migration tests
npm run test:migrations

echo "Migration deployment completed successfully"
```

### 2. Migration Validation
```typescript
// tests/migrations.test.ts
describe('Database Migrations', () => {
  beforeAll(async () => {
    // Setup test database
    await setupTestDatabase();
  });

  it('should apply all migrations successfully', async () => {
    const result = await runMigrations();
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should maintain data integrity', async () => {
    const beforeData = await exportTestData();
    await runMigrations();
    const afterData = await exportTestData();
    
    expect(validateDataIntegrity(beforeData, afterData)).toBe(true);
  });

  it('should preserve RLS policies', async () => {
    const policies = await getRLSPolicies();
    expect(policies.length).toBeGreaterThan(0);
    
    for (const policy of policies) {
      expect(policy.enabled).toBe(true);
    }
  });
});
```

## Security Integration

### 1. Security Scanning Pipeline
```yaml
security-pipeline:
  dependency-scan:
    - npm audit
    - Snyk vulnerability scanner
    - License compliance check
    
  static-analysis:
    - ESLint security rules
    - CodeQL semantic analysis
    - SonarQube quality gate
    
  secret-detection:
    - TruffleHog secret scanning
    - Git-secrets validation
    - Environment variable audit
    
  container-security:
    - Docker image scanning
    - Base image vulnerability check
    - Runtime security validation
```

### 2. Compliance Validation
```typescript
// Security compliance checks
const securityChecks = {
  pdplCompliance: async () => {
    // Verify PDPL compliance requirements
    const checks = [
      'Data encryption validation',
      'Consent management verification',
      'Data retention policy compliance',
      'Audit trail completeness'
    ];
    
    return await Promise.all(checks.map(validateComplianceCheck));
  },
  
  accessControlValidation: async () => {
    // Verify access control implementation
    const validations = [
      'RLS policy enforcement',
      'Role-based access control',
      'Multi-factor authentication',
      'Session management security'
    ];
    
    return await Promise.all(validations.map(validateAccessControl));
  }
};
```

## Performance Monitoring

### 1. Performance Testing Pipeline
```yaml
performance-tests:
  load-testing:
    tool: "Artillery.js"
    scenarios:
      - name: "Dashboard load test"
        duration: "5m"
        arrivalRate: 10
        maxUsers: 100
        
      - name: "Government API sync"
        duration: "3m"
        arrivalRate: 5
        maxUsers: 25
        
  lighthouse-audit:
    metrics:
      - performance: ">90"
      - accessibility: ">95"
      - best-practices: ">90"
      - seo: ">90"
      
  database-performance:
    queries:
      - "Employee data retrieval < 100ms"
      - "Dashboard aggregations < 500ms"
      - "Government sync < 2s"
```

### 2. Monitoring Integration
```typescript
// Performance monitoring setup
const performanceMonitoring = {
  frontend: {
    tools: ['Web Vitals', 'Lighthouse CI', 'Bundle Analyzer'],
    metrics: [
      'First Contentful Paint',
      'Largest Contentful Paint',
      'Cumulative Layout Shift',
      'First Input Delay'
    ]
  },
  
  backend: {
    tools: ['Supabase Analytics', 'Custom Metrics'],
    metrics: [
      'API response times',
      'Database query performance',
      'Edge function execution time',
      'Government API sync duration'
    ]
  },
  
  alerts: {
    performance: 'Response time > 2s',
    availability: 'Uptime < 99.9%',
    errors: 'Error rate > 1%',
    security: 'Failed auth attempts > 10/min'
  }
};
```

## Deployment Strategies

### 1. Blue-Green Deployment
```bash
#!/bin/bash
# scripts/blue-green-deploy.sh

ENVIRONMENT=$1
NEW_VERSION=$2

echo "Starting blue-green deployment..."

# Deploy to green environment
deploy_to_green() {
    echo "Deploying version $NEW_VERSION to green environment"
    # Deploy new version
    # Run health checks
    # Validate functionality
}

# Switch traffic to green
switch_traffic() {
    echo "Switching traffic to green environment"
    # Update load balancer
    # Monitor for issues
    # Validate switch success
}

# Cleanup blue environment
cleanup_blue() {
    echo "Cleaning up blue environment"
    # Keep blue for rollback capability (24 hours)
    # Schedule cleanup after validation period
}

deploy_to_green
if [ $? -eq 0 ]; then
    switch_traffic
    cleanup_blue
    echo "Blue-green deployment completed successfully"
else
    echo "Deployment failed, maintaining current environment"
    exit 1
fi
```

### 2. Canary Deployment
```typescript
// Canary deployment configuration
const canaryConfig = {
  stages: [
    { name: 'canary-5', traffic: 5, duration: '10m' },
    { name: 'canary-25', traffic: 25, duration: '20m' },
    { name: 'canary-50', traffic: 50, duration: '30m' },
    { name: 'full-rollout', traffic: 100, duration: 'stable' }
  ],
  
  rollbackTriggers: [
    'error_rate > 1%',
    'response_time > 2s',
    'user_complaints > 5',
    'security_incidents > 0'
  ],
  
  validationChecks: [
    'health_check_success',
    'database_connectivity',
    'government_api_connectivity',
    'ai_service_availability'
  ]
};
```

## Rollback Procedures

### 1. Automated Rollback
```yaml
rollback-triggers:
  - condition: "error_rate > 5%"
    duration: "5 minutes"
    action: "immediate_rollback"
    
  - condition: "response_time > 5s"
    duration: "10 minutes"
    action: "gradual_rollback"
    
  - condition: "security_incident"
    duration: "immediate"
    action: "emergency_rollback"

rollback-procedure:
  1. "Stop new deployments"
  2. "Switch traffic to previous version"
  3. "Validate rollback success"
  4. "Notify stakeholders"
  5. "Post-incident analysis"
```

### 2. Database Rollback
```sql
-- Database rollback procedure
BEGIN;

-- Create rollback point
SAVEPOINT pre_rollback;

-- Apply rollback migrations
SELECT apply_rollback_migration('migration_name');

-- Validate data integrity
SELECT validate_data_integrity();

-- If validation passes, commit
-- If validation fails, rollback to savepoint
COMMIT;
```

## Environment Configuration

### 1. Configuration Management
```typescript
// Environment-specific configuration
interface EnvironmentConfig {
  database: {
    url: string;
    poolSize: number;
    timeout: number;
  };
  
  government: {
    qiwaApi: string;
    gosiApi: string;
    absherApi: string;
    certificates: string;
  };
  
  ai: {
    huggingFaceApi: string;
    modelEndpoints: string[];
    timeout: number;
  };
  
  monitoring: {
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    metricsEnabled: boolean;
    alertingEnabled: boolean;
  };
}

const environments = {
  development: {
    database: {
      url: 'postgresql://localhost:5432/aqlhr_dev',
      poolSize: 5,
      timeout: 5000
    },
    government: {
      qiwaApi: 'https://api-test.qiwa.sa',
      gosiApi: 'https://api-test.gosi.gov.sa',
      absherApi: 'https://api-test.absher.sa',
      certificates: './certs/test'
    }
  },
  
  production: {
    database: {
      url: process.env.DATABASE_URL,
      poolSize: 20,
      timeout: 10000
    },
    government: {
      qiwaApi: 'https://api.qiwa.sa',
      gosiApi: 'https://api.gosi.gov.sa',
      absherApi: 'https://api.absher.sa',
      certificates: '/secure/certs/prod'
    }
  }
};
```

### 2. Secret Management
```yaml
# Secret management strategy
secrets:
  storage: "AWS Secrets Manager / Azure Key Vault"
  rotation: "90 days"
  access: "Principle of least privilege"
  audit: "All access logged"
  
secret-categories:
  database:
    - DATABASE_URL
    - DATABASE_PASSWORD
    
  apis:
    - SUPABASE_SERVICE_KEY
    - HUGGINGFACE_API_KEY
    - GOV_API_CERTIFICATES
    
  monitoring:
    - SENTRY_DSN
    - DATADOG_API_KEY
    
  deployment:
    - SSH_DEPLOY_KEYS
    - CLOUD_CREDENTIALS
```

## Monitoring & Alerting

### 1. Pipeline Monitoring
```typescript
// CI/CD pipeline monitoring
const pipelineMetrics = {
  buildTime: 'Average build duration',
  testCoverage: 'Code coverage percentage',
  deploymentFrequency: 'Deployments per day',
  leadTime: 'Code to production time',
  changeFailureRate: 'Failed deployment percentage',
  recoveryTime: 'Time to recover from failures'
};

// Alerting configuration
const alerts = {
  buildFailure: {
    channels: ['slack', 'email'],
    recipients: ['dev-team', 'on-call-engineer']
  },
  
  deploymentFailure: {
    channels: ['slack', 'email', 'sms'],
    recipients: ['dev-team', 'devops-team', 'management']
  },
  
  securityIncident: {
    channels: ['slack', 'email', 'sms', 'phone'],
    recipients: ['security-team', 'management', 'compliance-officer']
  }
};
```

### 2. Quality Gates
```yaml
quality-gates:
  code-coverage:
    minimum: 80%
    trend: "not decreasing"
    
  security-scan:
    critical: 0
    high: 0
    medium: "<5"
    
  performance:
    lighthouse: ">90"
    load-time: "<2s"
    bundle-size: "<500KB"
    
  compliance:
    pdpl: "100%"
    security: "100%"
    accessibility: ">95%"
```

This CI/CD pipeline ensures reliable, secure, and compliant deployment of the AqlHR platform while maintaining high quality standards and Saudi regulatory compliance.