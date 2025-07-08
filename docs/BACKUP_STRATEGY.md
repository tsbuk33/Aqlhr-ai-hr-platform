# 🔄 SanadHR Backup Strategy

## Overview
Multi-layered backup strategy ensuring zero data loss for the SanadHR platform.

## 🏗️ Backup Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SanadHR Backup System                    │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Git Tags & Releases (GitHub)                      │
│  Layer 2: Protected Archive Branches                        │  
│  Layer 3: Automated Off-site Storage (S3/GCS)              │
│  Layer 4: Database Dumps (Supabase)                        │
│  Layer 5: GitHub Action Artifacts (30 days)                │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Implementation Checklist

### Phase 1: Repository Setup
- [ ] **Connect to GitHub** (if not already connected)
- [ ] **Create initial backup tag**: `backup/2025-07-09`
- [ ] **Set up archive branch**: `archive/mainline`
- [ ] **Enable branch protection** for archive branches

### Phase 2: Automated Backups
- [ ] **GitHub Action workflow** (`.github/workflows/backup.yml`)
- [ ] **AWS S3 bucket** for off-site storage
- [ ] **Repository secrets** for AWS credentials
- [ ] **Test manual workflow trigger**

### Phase 3: Database Backups
- [ ] **Supabase database dumps** (nightly schedule)
- [ ] **Edge function backups** (included in repo)
- [ ] **Secrets backup strategy** (documented separately)

### Phase 4: Monitoring & Alerts
- [ ] **Backup success notifications**
- [ ] **Failed backup alerts**
- [ ] **Storage quota monitoring**

## 🔧 Setup Instructions

### 1. Connect to GitHub
1. Click the **GitHub button** in top-right of Lovable
2. Authorize the Lovable GitHub App
3. Select your GitHub account/organization
4. Click **Create Repository**

### 2. Create Backup Tag
```bash
# Make the script executable
chmod +x scripts/create-backup-tag.sh

# Run the backup script
./scripts/create-backup-tag.sh
```

### 3. Configure AWS S3 (Optional)
Add these secrets to your GitHub repository:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY` 
- `AWS_REGION` (e.g., `us-east-1`)
- `S3_BUCKET_NAME` (e.g., `sanadhr-backups`)

### 4. Set Up Branch Protection
1. Go to GitHub → Settings → Branches
2. Add rule for `archive/*` pattern
3. Enable:
   - Restrict pushes that create files larger than 100MB
   - Restrict force pushes
   - Require status checks

## 📊 Backup Schedule

| Frequency | Type | Storage | Retention |
|-----------|------|---------|-----------|
| **Daily** | Full repository ZIP | S3 + GitHub Artifacts | 30 days |
| **Weekly** | Tagged release | GitHub Releases | Indefinite |
| **Monthly** | Archive branch | GitHub Branches | Indefinite |
| **On-demand** | Manual trigger | All locations | As scheduled |

## 🔍 Backup Verification

### Automated Checks
- ✅ SHA-256 checksum verification
- ✅ File size validation
- ✅ Upload confirmation
- ✅ Metadata generation

### Manual Verification
```bash
# Download and verify backup
aws s3 cp s3://sanadhr-backups/2025/01/sanadhr-backup-2025-01-09.zip .
sha256sum -c checksums-2025-01-09.txt
```

## 🚨 Disaster Recovery

### Complete Loss Scenario
1. **Download latest backup** from S3 or GitHub Artifacts
2. **Restore repository** from ZIP archive
3. **Recreate Supabase project** from SQL dump
4. **Reconfigure secrets** and environment variables
5. **Redeploy application** to hosting platform

### Partial Loss Scenarios
- **Lost commits**: Restore from latest tag
- **Corrupted files**: Cherry-pick from archive branch  
- **Database issues**: Restore from Supabase dump
- **Deployment issues**: Redeploy from backup

## 🔐 Security Considerations

### What's Backed Up
- ✅ Source code and assets
- ✅ Configuration files (non-sensitive)
- ✅ Database schema and migrations
- ✅ Documentation and scripts

### What's NOT Backed Up
- ❌ Environment variables / secrets
- ❌ User data (handled by Supabase)
- ❌ API keys (stored in Supabase secrets)
- ❌ Personal development configs

### Secret Management
- Database connection strings → Supabase secrets
- API keys → Supabase secrets manager
- AWS credentials → GitHub repository secrets
- Environment configs → Documented separately

## 📈 Monitoring & Metrics

### Backup Health Dashboard
- Last successful backup timestamp
- Backup file sizes over time
- Failed backup count (last 30 days)
- Storage usage per month

### Alerts Configuration
- Backup failure → Email notification
- Storage quota (>80%) → Slack alert
- Missing daily backup → GitHub issue

## 🔄 Recovery Testing

### Monthly Recovery Tests
1. Download random backup from last 30 days
2. Restore to temporary environment
3. Verify application functionality
4. Document any issues found

### Annual Full Recovery Drill
1. Simulate complete infrastructure loss
2. Restore from backups only
3. Measure recovery time
4. Update procedures based on findings

---

## 📞 Emergency Contacts

| Scenario | Contact | Action |
|----------|---------|--------|
| **Backup Failure** | DevOps Team | Check GitHub Actions logs |
| **Storage Issues** | AWS Support | Verify S3 bucket status |
| **Data Loss** | Technical Lead | Initiate recovery procedures |
| **Security Breach** | Security Team | Isolate and assess damage |

---

*Last updated: January 9, 2025*
*Next review: February 9, 2025*