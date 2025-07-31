# 🔒 AqlHR Security Playbook

*Living documentation for maintaining security in the AqlHR platform*

## 📋 Quick Security Checklist

Before any feature goes to production:

- [ ] **Authentication Check:** All sensitive routes require authentication
- [ ] **RLS Policy:** New tables have proper Row Level Security policies  
- [ ] **Input Validation:** All user inputs are validated and sanitized
- [ ] **Company Isolation:** Data is properly scoped to user's company
- [ ] **Security Tests:** Feature includes security test coverage
- [ ] **Code Review:** Security checklist completed in PR review

## 🚀 Getting Started

### 1. Security-First Development Workflow

```bash
# Before starting any feature
npm run security:check          # Run security audit
npm run test:security           # Run security tests

# During development  
npm run lint:security           # Check for security issues
npm run audit:rls              # Verify RLS policies

# Before PR submission
npm run security:full-audit     # Complete security validation
```

### 2. Essential Security Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `npm run audit:rls` | Check RLS policy coverage | Before adding new tables |
| `npm run test:security:isolation` | Test company data isolation | After auth changes |
| `npm run security:generate-report` | Full security assessment | Weekly/before releases |

## 📚 Security Guides

### Core Security Documentation:
- [🔐 Authentication Flow Guide](./authentication-flow.md) - Complete auth implementation
- [🛡️ RLS Policy Guide](./rls-policy-guide.md) - Database security patterns  
- [✅ Security Code Review Checklist](./security-checklist.md) - PR review requirements
- [🚨 Incident Response Guide](./incident-response.md) - Security incident procedures
- [📋 Compliance Guide](./compliance-guide.md) - Saudi regulatory requirements

## 🔧 Adding Security to New Features

### Step 1: Plan Security Architecture
```typescript
// Before writing code, define:
interface FeatureSecurity {
  authentication: 'required' | 'optional' | 'public';
  authorization: Role[];
  dataScope: 'company' | 'user' | 'public';
  inputValidation: ValidationSchema;
  auditLogging: boolean;
}
```

### Step 2: Implement Database Security
```sql
-- Every new table needs RLS
ALTER TABLE public.new_feature_table ENABLE ROW LEVEL SECURITY;

-- Company-scoped access policy
CREATE POLICY "Company scoped access" ON public.new_feature_table
  USING (company_id = get_user_company_id());
```

### Step 3: Add Security Tests
```typescript
// Test company isolation
describe('New Feature Security', () => {
  it('should isolate data by company', async () => {
    // Test implementation
  });
});
```

## 🚨 Common Security Patterns

### ✅ Secure Database Query Pattern
```typescript
// ✅ CORRECT - Uses RLS automatically
const { data } = await supabase
  .from('employees')
  .select('*');  // RLS limits to user's company

// ❌ WRONG - Bypasses RLS
const { data } = await supabase
  .from('employees')
  .select('*')
  .eq('company_id', anyCompanyId);  // User can specify any company
```

### ✅ Secure Route Protection Pattern
```typescript
// ✅ CORRECT - Check auth before access
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

// ❌ WRONG - No auth check
const UnsafeRoute = ({ children }) => {
  return children;  // Anyone can access
};
```

### ✅ Secure Input Validation Pattern
```typescript
// ✅ CORRECT - Validate all inputs
const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  company_id: z.string().uuid()
});

const result = schema.safeParse(userInput);
if (!result.success) {
  throw new ValidationError(result.error);
}

// ❌ WRONG - Direct usage without validation
const unsafeData = {
  name: userInput.name,  // Could be malicious
  email: userInput.email  // Could be malicious
};
```

## 🔍 Security Monitoring

### Automated Security Monitoring
Our GitHub Actions pipeline automatically:
- ✅ Runs security linting on every PR
- ✅ Validates RLS policy coverage nightly  
- ✅ Tests company data isolation
- ✅ Scans for dependency vulnerabilities
- ✅ Generates security reports

### Manual Security Reviews
Weekly security review checklist:
- [ ] Review new RLS policies added this week
- [ ] Check security test coverage metrics
- [ ] Review any security-related GitHub alerts
- [ ] Validate user role assignments
- [ ] Check authentication audit logs

## 📊 Security Metrics Dashboard

Track these key security indicators:

| Metric | Target | Current |
|--------|--------|---------|
| RLS Policy Coverage | 100% | 0% (60 tables need policies) |
| Security Test Coverage | >90% | TBD |
| Authentication Coverage | 100% of sensitive routes | 0% (no auth system) |
| Vulnerability Count | 0 critical | TBD |

## 🚨 Security Incident Response

If you discover a security issue:

1. **🔴 CRITICAL:** Stop and assess impact immediately
2. **📞 ALERT:** Notify security team via `#security-alerts` Slack
3. **🔒 CONTAIN:** Limit exposure (disable feature if needed)
4. **📝 DOCUMENT:** Follow [incident response guide](./incident-response.md)
5. **🔧 FIX:** Implement fix following security review process
6. **📊 LEARN:** Post-incident review and prevention measures

## 🛠️ Security Tools Reference

### Development Tools
```bash
# Security linting
npm run lint:security

# RLS policy validation  
npm run audit:rls

# Company isolation testing
npm run test:security:isolation

# Full security audit
npm run security:comprehensive-audit
```

### CI/CD Security Tools
- **ESLint Security Plugin:** Catches common security issues
- **Supabase RLS Linter:** Validates database security
- **Snyk:** Dependency vulnerability scanning  
- **Custom Security Tests:** Company isolation validation

## 📈 Security Improvement Roadmap

### Phase 1: Critical Security (Week 1)
- [ ] Implement Supabase authentication system
- [ ] Add RLS policies for all 60+ tables
- [ ] Enable route protection for sensitive pages
- [ ] Setup basic security monitoring

### Phase 2: Enhanced Security (Week 2)  
- [ ] Comprehensive input validation
- [ ] XSS protection implementation
- [ ] Security test suite completion
- [ ] Audit logging system

### Phase 3: Advanced Security (Week 3)
- [ ] Automated security pipeline
- [ ] Continuous security monitoring
- [ ] Security documentation completion
- [ ] Compliance validation

## 📞 Security Contacts

| Role | Contact | Availability |
|------|---------|--------------|
| Security Lead | `@security-team` | 24/7 for critical issues |
| DevOps Security | `@devops-team` | Business hours |
| Compliance Officer | `@compliance-team` | Business hours |

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Security vulnerabilities guide
- [Supabase Security Guide](https://supabase.com/docs/guides/auth) - Platform-specific security
- [Saudi PDPL Compliance](./compliance-guide.md) - Local regulatory requirements

---

*This playbook is updated automatically with each security milestone. Last updated: $(date)*