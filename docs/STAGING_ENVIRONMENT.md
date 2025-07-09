# SanadHR Staging Environment Configuration

## Environment Details

**URL:** https://staging.sanadhr.com  
**Environment:** Staging  
**Version:** v1.0.0-rc1  
**Deployment:** Blue-Green  
**Database:** Supabase (staging instance)  

## Access Credentials

### Basic Authentication
- **Username:** `staging`
- **Password:** `sanadhr2025!`

### Application Accounts
| Role | Email | Password | Purpose |
|------|--------|----------|---------|
| Admin | admin@sanadhr.com | Admin123! | Full system access |
| HR Manager | hr@sanadhr.com | HR123! | HR operations |
| Employee | employee@sanadhr.com | Emp123! | Employee self-service |
| Test User | test@sanadhr.com | Test123! | General testing |

## Monitoring & Observability

### Health Check Endpoints
- **Application Health:** `GET /health`
- **Database Health:** `GET /health/db`
- **Government APIs:** `GET /health/government`
- **AI Services:** `GET /health/ai`

### Monitoring Dashboards
| Dashboard | URL | Purpose |
|-----------|-----|---------|
| System Health | https://monitoring.sanadhr.com/staging/health | Overall system status |
| Performance | https://monitoring.sanadhr.com/staging/performance | Response times, throughput |
| Government APIs | https://monitoring.sanadhr.com/staging/government | External API status |
| Error Tracking | https://monitoring.sanadhr.com/staging/errors | Error rates and details |
| User Analytics | https://monitoring.sanadhr.com/staging/users | User behavior tracking |

### Alert Thresholds
| Metric | Threshold | Action |
|--------|-----------|--------|
| Error Rate | > 0.5% | Immediate alert |
| Response Time | > 500ms avg | Warning alert |
| AI Sync Lag | > 500ms | Warning alert |
| CPU Usage | > 70% | Warning alert |
| Memory Usage | > 80% | Warning alert |
| Database Connections | > 80% | Warning alert |
| Government API Failures | > 5% | Immediate alert |

### Alert Channels
- **Slack:** #sanadhr-staging-alerts
- **Email:** ops@sanadhr.com
- **SMS:** +966-xxx-xxx-xxxx (critical only)
- **PagerDuty:** High priority incidents

## Test Data

### Seeded Employees (50 total)
- **Saudi Nationals:** 34 (68%)
- **Non-Saudi Residents:** 16 (32%)
- **Salary Range:** 14,000 - 35,000 SAR
- **Departments:** 8 different departments
- **Positions:** Various from entry-level to executive

### Sample Data Includes
- **Attendance Records:** 150 entries
- **Leave Requests:** 12 pending/approved
- **Performance Reviews:** 25 completed
- **Training Records:** 18 TVTC-integrated courses
- **Payroll Runs:** 3 months of historical data

## Government API Configuration

### Sandbox/Test Mode
All government APIs are configured in test/sandbox mode:

| API | Status | Endpoint | Mode |
|-----|--------|----------|------|
| Qiwa | ✅ Active | api.qiwa.info/test | Sandbox |
| GOSI | ✅ Active | gosi.gov.sa/api/test | Test |
| Absher | ✅ Active | absher.sa/api/test | Sandbox |
| Mudad | ✅ Active | mudad.gov.sa/api/test | Test |
| ZATCA | ⚠️ Testing | zatca.gov.sa/api/test | Sandbox |
| ELM | ✅ Active | elm.sa/api/test | Test |
| TVTC | ✅ Active | tvtc.gov.sa/api/test | Sandbox |

### API Rate Limits
- **Qiwa:** 1000 req/hour
- **GOSI:** 500 req/hour
- **Absher:** 200 req/hour
- **Others:** 100 req/hour

## Performance Expectations

### Response Time Targets
- **Dashboard Load:** < 2s
- **Employee Operations:** < 1s
- **Payroll Calculation:** < 5s
- **Government API Calls:** < 250ms
- **Report Generation:** < 10s

### Throughput Targets
- **Concurrent Users:** 100
- **Requests/Second:** 50
- **Database Queries/Sec:** 200

## Testing Scenarios

### Core User Journeys
1. **Employee Onboarding**
   - Create employee record
   - GOSI classification
   - Government registration
   - Document upload

2. **Payroll Processing**
   - Calculate monthly payroll
   - Generate GOSI contributions
   - WPS file generation
   - Payment processing

3. **Mobile Experience**
   - Check-in/out via mobile
   - Leave request submission
   - Payslip viewing
   - Performance review

4. **Government Compliance**
   - Qiwa contract submission
   - GOSI payment processing
   - Absher identity verification
   - ZATCA tax calculation

### Load Testing Scenarios
- **Normal Load:** 50 concurrent users
- **Peak Load:** 100 concurrent users
- **Stress Test:** 200 concurrent users
- **Spike Test:** 500 users for 5 minutes

## 24-Hour Validation Checklist

### Hour 0-6: Initial Validation
- [ ] All health checks green
- [ ] User authentication working
- [ ] Core modules functional
- [ ] Government APIs responding
- [ ] Mobile app connectivity
- [ ] Monitoring alerts configured

### Hour 6-12: Functional Testing
- [ ] Complete user journey testing
- [ ] Government API integration testing
- [ ] Performance validation
- [ ] Security scanning
- [ ] Backup verification
- [ ] Error handling testing

### Hour 12-18: Load Testing
- [ ] Normal load testing (50 users)
- [ ] Peak load testing (100 users)
- [ ] Database performance validation
- [ ] AI sync engine performance
- [ ] Memory leak detection
- [ ] Resource utilization analysis

### Hour 18-24: Final Validation
- [ ] 24-hour uptime confirmed
- [ ] Error rates within SLA
- [ ] Performance metrics stable
- [ ] No critical issues detected
- [ ] Monitoring data analysis
- [ ] Go/No-go decision for production

## Rollback Plan

### Automatic Rollback Triggers
- Error rate > 5%
- Response time > 2000ms sustained
- Database connectivity loss
- Security incident detected
- Critical functionality broken

### Manual Rollback Process
1. **Immediate:** Switch DNS back to blue environment
2. **Database:** Restore from last known good backup
3. **Monitoring:** Update alerts to previous environment
4. **Communication:** Notify stakeholders
5. **Post-mortem:** Schedule incident review

## Production Readiness Criteria

### Must Pass (Go/No-Go)
- [ ] 24-hour uptime achieved
- [ ] Error rate < 0.5%
- [ ] Response time < 250ms average
- [ ] All government APIs functional
- [ ] Security scan clean
- [ ] Load test passed
- [ ] Backup/restore verified

### Success Metrics
- **Availability:** 99.9%
- **Performance:** Lighthouse > 90
- **Security:** Zero critical vulnerabilities
- **Functionality:** All user journeys working
- **Compliance:** Government APIs operational

---

## Next Steps

1. **Monitor for 24 hours** (ends: $(date -d '+24 hours'))
2. **Daily status reports** at 8 AM, 2 PM, 8 PM
3. **Load testing** during business hours
4. **Go/No-go meeting** after validation period
5. **Production deployment** (if approved)

## Support Contacts

**Technical Lead:** Your Team  
**DevOps Engineer:** Your DevOps Team  
**QA Lead:** Your QA Team  
**Business Owner:** Stakeholder Team  

---

**Status:** 🟢 Live and monitoring  
**Next Review:** $(date -d '+24 hours')  
**Deployment Window:** TBD after validation