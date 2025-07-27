# AqlHR Audit Tools Documentation

This directory contains automated audit and verification tools for the AqlHR platform to ensure quality, compliance, and reliability.

## 🛠️ Available Tools

### 1. AI Inventory Auditor (`audit-ai-inventory.ts`)
**Purpose**: Automatically scans and verifies AI capabilities against a golden manifest.

**Usage**:
```bash
npm run audit:ai           # Run audit against manifest
npm run audit:ai -- --update  # Update manifest with current counts
tsx scripts/audit-ai-inventory.ts
```

**What it checks**:
- Edge Functions count and presence
- AI Components count
- AI Hooks count  
- AI Pages count
- Critical AI functions presence
- Drift from expected inventory

---

### 2. Reliability Verifier (`verify-uptime.ts`)
**Purpose**: Verifies system uptime and performance metrics against SLA targets.

**Usage**:
```bash
npm run verify:uptime          # Check Supabase metrics
npm run verify:uptime cloudwatch  # Check CloudWatch metrics
tsx scripts/verify-uptime.ts grafana
```

**SLA Targets**:
- Uptime: ≥99.97%
- Response Time: ≤2000ms
- Error Rate: ≤0.1%
- Throughput: ≥1000 req/min

---

### 3. Edge Function Locale Auditor (`audit-edge-locale.ts`)
**Purpose**: Ensures all Supabase Edge Functions properly handle locale parameters.

**Usage**:
```bash
npm run audit:locale
tsx scripts/audit-edge-locale.ts
```

**What it checks**:
- Locale parameter extraction from headers
- Language-aware AI prompts
- Localized responses
- Hardcoded string detection

---

### 4. Comprehensive Auditor (`run-comprehensive-audit.ts`)
**Purpose**: Orchestrates all audit tools and generates consolidated reports.

**Usage**:
```bash
npm run audit:all
tsx scripts/run-comprehensive-audit.ts
```

**Generates**:
- Consolidated audit report
- Overall compliance score
- Action items and recommendations

---

## 📋 Quick Start

1. **Run all audits**:
   ```bash
   npm run audit:all
   ```

2. **Check individual areas**:
   ```bash
   npm run audit:ai        # AI inventory
   npm run verify:uptime   # Reliability  
   npm run audit:locale    # Internationalization
   ```

3. **View reports**:
   ```bash
   cat docs/COMPREHENSIVE_AUDIT_REPORT.md
   cat docs/AI_CAPABILITIES_AUDIT.md
   cat docs/RELIABILITY_REPORT.md
   cat docs/EDGE_FUNCTION_LOCALE_AUDIT.md
   ```

---

## 🔧 Configuration

### AI Inventory Manifest (`ai-inventory.json`)
Controls expected counts and critical functions:
```json
{
  "expectedCounts": {
    "edgeFunctions": 25,
    "aiComponents": 50,
    "aiHooks": 10,
    "aiPages": 20
  },
  "criticalFunctions": [
    "ai-core-engine",
    "ai-document-processor"
  ]
}
```

### SLA Targets (built into tools)
```javascript
const targets = {
  uptimeTarget: 99.97,      // %
  responseTimeTarget: 2000, // ms
  errorRateTarget: 0.1,     // %
  throughputTarget: 1000    // req/min
};
```

---

## 📊 CI/CD Integration

### GitHub Actions Example
```yaml
name: AqlHR Quality Audits
on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run comprehensive audit
        run: npm run audit:all
      
      - name: Upload audit reports
        uses: actions/upload-artifact@v3
        with:
          name: audit-reports
          path: docs/*_AUDIT*.md
```

### Package.json Scripts
```json
{
  "scripts": {
    "audit:all": "tsx scripts/run-comprehensive-audit.ts",
    "audit:ai": "tsx scripts/audit-ai-inventory.ts",
    "verify:uptime": "tsx scripts/verify-uptime.ts",
    "audit:locale": "tsx scripts/audit-edge-locale.ts"
  }
}
```

---

## 📈 Reports Generated

### 1. Comprehensive Audit Report
**Location**: `docs/COMPREHENSIVE_AUDIT_REPORT.md`
**Contains**: Overall status, scores, recommendations

### 2. AI Capabilities Audit
**Location**: `docs/AI_CAPABILITIES_AUDIT.md`  
**Contains**: AI inventory details, drift analysis

### 3. Reliability Report
**Location**: `docs/RELIABILITY_REPORT.md`
**Contains**: Uptime metrics, SLA compliance

### 4. Locale Audit Report
**Location**: `docs/EDGE_FUNCTION_LOCALE_AUDIT.md`
**Contains**: Internationalization compliance

---

## 🚨 Alerting & Thresholds

### Critical Alerts (Exit Code 1)
- AI inventory drift >5 components
- Uptime <99.9%
- Locale compliance <70%
- Missing critical functions

### Warning Alerts (Exit Code 0, but logged)
- AI inventory drift 1-5 components
- Uptime 99.9-99.97%
- Locale compliance 70-80%

---

## 🔄 Audit Frequency

- **AI Inventory**: Daily (on commits)
- **Reliability**: Hourly (automated monitoring)
- **Locale**: Weekly (scheduled)
- **Comprehensive**: On PR/release

---

## 🏗️ Extending the Tools

### Adding New Audit Categories

1. Create new auditor class:
   ```typescript
   export class SecurityAuditor {
     async runAudit(): Promise<boolean> {
       // Implementation
     }
   }
   ```

2. Add to comprehensive auditor:
   ```typescript
   const securityAuditor = new SecurityAuditor();
   const securityPassed = await securityAuditor.runAudit();
   ```

3. Update package.json scripts
4. Add to CI pipeline

### Customizing Thresholds

Edit the respective tool files or add configuration files:
```javascript
// In audit tool
const config = await loadConfig('./audit-config.json');
const threshold = config.thresholds.compliance || 80;
```

---

## 🆘 Troubleshooting

### Common Issues

1. **"No manifest found"**
   - Run with `--update` flag to create default manifest
   - Ensure `ai-inventory.json` exists in project root

2. **"Metrics fetch failed"**
   - Check monitoring API credentials
   - Verify network connectivity
   - Try different metrics source (`cloudwatch`, `grafana`)

3. **"Edge function not found"**
   - Ensure `supabase/functions/*/index.ts` structure
   - Check file permissions

### Debug Mode
Add `DEBUG=true` environment variable for verbose logging:
```bash
DEBUG=true npm run audit:all
```

---

## 📞 Support

- **Issues**: Create GitHub issue with audit tool label
- **Questions**: Reference this documentation
- **Contributions**: Submit PR with tests

---

*Documentation generated for AqlHR Audit Tools v1.0*