# AqlHR Security Framework Documentation

## Security Architecture Overview

The AqlHR platform implements a comprehensive security framework designed specifically for handling sensitive HR data in compliance with Saudi regulations, including PDPL (Personal Data Protection Law) and international standards.

## Core Security Principles

### 1. Defense in Depth
Multiple layers of security controls to protect against various attack vectors:

```
┌─────────────────────────────────────────┐
│           Application Layer             │
│  - Input validation                     │
│  - XSS protection                       │
│  - CSRF protection                      │
├─────────────────────────────────────────┤
│          Authentication Layer           │
│  - Multi-factor authentication         │
│  - Session management                   │
│  - Token-based security                │
├─────────────────────────────────────────┤
│          Authorization Layer            │
│  - Role-based access control           │
│  - Row-level security                   │
│  - Feature-based permissions           │
├─────────────────────────────────────────┤
│             Data Layer                  │
│  - Encryption at rest                   │
│  - Field-level encryption               │
│  - Secure data deletion                │
├─────────────────────────────────────────┤
│          Infrastructure Layer           │
│  - Network security                     │
│  - Monitoring & logging                 │
│  - Incident response                    │
└─────────────────────────────────────────┘
```

### 2. Zero Trust Architecture
Never trust, always verify:
- Every request is authenticated and authorized
- Network segmentation with micro-perimeters
- Continuous security monitoring
- Least privilege access principle

### 3. Data Classification & Handling
```typescript
enum DataClassification {
  PUBLIC = 'public',           // Company information
  INTERNAL = 'internal',       // Employee directory
  CONFIDENTIAL = 'confidential', // Salary information
  RESTRICTED = 'restricted'    // Medical records
}

interface SecurityContext {
  classification: DataClassification;
  encryptionRequired: boolean;
  auditRequired: boolean;
  retentionPolicy: string;
  accessControls: string[];
}
```

## Authentication & Authorization

### 1. Multi-Factor Authentication (MFA)
```typescript
// MFA implementation with TOTP
interface MFAConfig {
  enabled: boolean;
  methods: ('totp' | 'sms' | 'email')[];
  backupCodes: string[];
  gracePeriod: number; // days
}

const mfaPolicy: MFAConfig = {
  enabled: true,
  methods: ['totp', 'sms'],
  backupCodes: [], // Generated per user
  gracePeriod: 7   // 7 days for new accounts
};
```

### 2. Role-Based Access Control (RBAC)
```sql
-- Core roles and permissions
CREATE TYPE app_role AS ENUM (
  'super_admin',    -- Platform administration
  'admin',          -- Company administration
  'hr_manager',     -- HR operations
  'hr_specialist',  -- HR data entry
  'manager',        -- Team management
  'employee',       -- Self-service
  'read_only'       -- View-only access
);

-- Permission system
CREATE TABLE role_permissions (
  role app_role NOT NULL,
  permission text NOT NULL,
  resource text,
  constraints jsonb,
  PRIMARY KEY (role, permission, resource)
);
```

### 3. Row Level Security (RLS)
Every table implements tenant isolation:

```sql
-- Example RLS policy for employees table
CREATE POLICY "tenant_isolation_employees" ON hr_employees
  FOR ALL
  TO authenticated
  USING (company_id = get_user_company_id());

-- Medical data requires additional role check
CREATE POLICY "medical_data_access" ON hse_medical_surveillance
  FOR SELECT
  TO authenticated
  USING (
    company_id = get_user_company_id() 
    AND can_access_medical_data()
  );
```

## Data Protection & Privacy

### 1. Personal Data Protection Law (PDPL) Compliance

#### Data Processing Principles
```typescript
interface PDPLCompliance {
  lawfulBasis: 'consent' | 'contract' | 'legal_obligation' | 'legitimate_interest';
  dataMinimization: boolean;
  purposeLimitation: string;
  accuracyMaintenance: boolean;
  storageeLimitation: string;
  integrityConfidentiality: boolean;
  accountability: boolean;
}

// Implementation example
const employeeDataProcessing: PDPLCompliance = {
  lawfulBasis: 'contract',
  dataMinimization: true,
  purposeLimitation: 'HR management and Saudi labor law compliance',
  accuracyMaintenance: true,
  storageeLimitation: '7 years post-employment',
  integrityConfidentiality: true,
  accountability: true
};
```

#### Data Subject Rights
```typescript
enum DataSubjectRights {
  ACCESS = 'access',           // Right to access personal data
  RECTIFICATION = 'rectify',   // Right to correct data
  ERASURE = 'erasure',         // Right to deletion
  PORTABILITY = 'portability', // Right to data portability
  RESTRICTION = 'restriction', // Right to restrict processing
  OBJECTION = 'objection'      // Right to object to processing
}

// Implementation of data subject rights
const handleDataSubjectRequest = async (
  request: DataSubjectRequest
): Promise<DataSubjectResponse> => {
  // Verify identity
  await verifyDataSubjectIdentity(request.subjectId);
  
  // Process request based on type
  switch (request.type) {
    case DataSubjectRights.ACCESS:
      return await generateDataExport(request.subjectId);
    case DataSubjectRights.ERASURE:
      return await secureDataDeletion(request.subjectId);
    // ... other rights
  }
};
```

### 2. Encryption Standards

#### Encryption at Rest
```typescript
// Database encryption configuration
const encryptionConfig = {
  algorithm: 'AES-256-GCM',
  keyRotation: '90 days',
  keyManagement: 'supabase-vault',
  
  // Field-level encryption for sensitive data
  encryptedFields: [
    'hr_employees.salary',
    'hr_employees.bank_account',
    'hse_medical_surveillance.medical_notes',
    'personal_documents.document_content'
  ]
};
```

#### Encryption in Transit
```typescript
// TLS configuration
const tlsConfig = {
  minVersion: 'TLSv1.3',
  cipherSuites: [
    'TLS_AES_256_GCM_SHA384',
    'TLS_AES_128_GCM_SHA256'
  ],
  certificateTransparency: true,
  hstsMaxAge: 31536000 // 1 year
};
```

### 3. Data Masking & Anonymization
```typescript
// PII masking for non-authorized users
const maskPersonalData = (data: any[], userRole: string): any[] => {
  if (!hasAdminAccess(userRole)) {
    return data.map(record => ({
      ...record,
      salary: '***CONFIDENTIAL***',
      bankAccount: '***MASKED***',
      personalId: maskId(record.personalId),
      // Keep only necessary fields visible
    }));
  }
  return data;
};

// ID masking function
const maskId = (id: string): string => {
  if (id.length <= 4) return '****';
  return id.substring(0, 2) + '*'.repeat(id.length - 4) + id.substring(id.length - 2);
};
```

## Government Integration Security

### 1. API Security for Government Services
```typescript
// Secure government API client
class SecureGovernmentClient {
  private certificatePath: string;
  private privateKeyPath: string;
  private trustedCAsPath: string;

  async callQiwaAPI(endpoint: string, payload: any): Promise<any> {
    const client = axios.create({
      httpsAgent: new https.Agent({
        cert: fs.readFileSync(this.certificatePath),
        key: fs.readFileSync(this.privateKeyPath),
        ca: fs.readFileSync(this.trustedCAsPath),
        rejectUnauthorized: true
      }),
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AqlHR-Platform/1.0'
      }
    });

    try {
      const response = await client.post(endpoint, payload);
      
      // Log the interaction for audit
      await this.logGovernmentInteraction({
        system: 'qiwa',
        endpoint,
        success: true,
        timestamp: new Date()
      });
      
      return response.data;
    } catch (error) {
      // Log errors for security monitoring
      await this.logGovernmentInteraction({
        system: 'qiwa',
        endpoint,
        success: false,
        error: error.message,
        timestamp: new Date()
      });
      throw error;
    }
  }
}
```

### 2. Credential Management
```typescript
// Secure credential storage using Supabase Vault
const storeGovernmentCredentials = async (
  system: 'qiwa' | 'gosi' | 'absher',
  credentials: GovernmentAPICredentials
) => {
  // Encrypt credentials before storage
  const encryptedCreds = await encrypt(JSON.stringify(credentials));
  
  // Store in secure vault
  const { error } = await supabase
    .from('government_credentials')
    .upsert({
      tenant_id: getTenantId(),
      system,
      encrypted_credentials: encryptedCreds,
      created_at: new Date(),
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
    });

  if (error) throw error;
};
```

## Audit & Compliance Logging

### 1. Comprehensive Audit Trail
```sql
-- Audit logging table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  user_id UUID,
  user_email TEXT,
  user_role TEXT,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  severity TEXT DEFAULT 'info',
  category TEXT DEFAULT 'data_change',
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Audit trigger for employee changes
CREATE TRIGGER audit_employee_changes
  AFTER INSERT OR UPDATE OR DELETE ON hr_employees
  FOR EACH ROW EXECUTE FUNCTION audit_employee_changes();
```

### 2. Security Event Monitoring
```typescript
// Security event classification
enum SecurityEventType {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
  MFA_ENABLED = 'mfa_enabled',
  PASSWORD_CHANGED = 'password_changed',
  ROLE_CHANGED = 'role_changed',
  DATA_EXPORT = 'data_export',
  SENSITIVE_DATA_ACCESS = 'sensitive_data_access',
  API_RATE_LIMIT = 'api_rate_limit',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity'
}

// Security event logging
const logSecurityEvent = async (
  eventType: SecurityEventType,
  context: SecurityEventContext
) => {
  const event = {
    event_type: eventType,
    user_id: context.userId,
    ip_address: context.ipAddress,
    user_agent: context.userAgent,
    metadata: context.metadata,
    severity: determineSeverity(eventType),
    created_at: new Date()
  };

  await supabase.from('security_events').insert(event);

  // Trigger alerts for high-severity events
  if (event.severity === 'high') {
    await triggerSecurityAlert(event);
  }
};
```

## Incident Response

### 1. Security Incident Classification
```typescript
enum IncidentSeverity {
  LOW = 'low',           // Minor policy violation
  MEDIUM = 'medium',     // Potential security risk
  HIGH = 'high',         // Data breach risk
  CRITICAL = 'critical'  // Active security breach
}

interface SecurityIncident {
  id: string;
  severity: IncidentSeverity;
  type: string;
  description: string;
  affectedSystems: string[];
  affectedUsers: string[];
  detectedAt: Date;
  containedAt?: Date;
  resolvedAt?: Date;
  rootCause?: string;
  actionsTaken: string[];
}
```

### 2. Automated Incident Response
```typescript
// Automated response system
const handleSecurityIncident = async (incident: SecurityIncident) => {
  switch (incident.severity) {
    case IncidentSeverity.CRITICAL:
      // Immediate containment
      await disableAffectedAccounts(incident.affectedUsers);
      await isolateAffectedSystems(incident.affectedSystems);
      await notifySecurityTeam(incident);
      await notifyCustomers(incident);
      break;
      
    case IncidentSeverity.HIGH:
      // Enhanced monitoring
      await enableEnhancedLogging(incident.affectedSystems);
      await notifySecurityTeam(incident);
      await requireMFAForAffectedUsers(incident.affectedUsers);
      break;
      
    case IncidentSeverity.MEDIUM:
      // Investigation and monitoring
      await logIncidentForInvestigation(incident);
      await enhanceMonitoring(incident.affectedSystems);
      break;
      
    case IncidentSeverity.LOW:
      // Standard logging
      await logIncident(incident);
      break;
  }
};
```

## Security Testing & Validation

### 1. Automated Security Testing
```typescript
// Security test suite
describe('Security Tests', () => {
  describe('Authentication', () => {
    it('should enforce MFA for admin users', async () => {
      const adminUser = await createTestUser({ role: 'admin' });
      const loginResult = await attemptLogin(adminUser);
      expect(loginResult.requiresMFA).toBe(true);
    });

    it('should lock account after failed attempts', async () => {
      const user = await createTestUser();
      for (let i = 0; i < 5; i++) {
        await attemptLogin(user, 'wrong-password');
      }
      const result = await attemptLogin(user, user.password);
      expect(result.accountLocked).toBe(true);
    });
  });

  describe('Authorization', () => {
    it('should enforce tenant isolation', async () => {
      const tenant1User = await createTestUser({ tenantId: 'tenant1' });
      const tenant2Data = await createTestData({ tenantId: 'tenant2' });
      
      const result = await fetchData(tenant1User, tenant2Data.id);
      expect(result).toBeNull();
    });

    it('should restrict medical data access', async () => {
      const regularUser = await createTestUser({ role: 'employee' });
      const medicalData = await createMedicalRecord();
      
      const result = await fetchMedicalData(regularUser, medicalData.id);
      expect(result.restrictions).toBe('***CONFIDENTIAL***');
    });
  });

  describe('Data Protection', () => {
    it('should encrypt sensitive fields', async () => {
      const employee = await createEmployee({ salary: 5000 });
      const rawData = await getRawDatabaseRecord('hr_employees', employee.id);
      expect(rawData.salary).not.toBe('5000');
      expect(rawData.salary).toMatch(/^encrypted:/);
    });
  });
});
```

### 2. Penetration Testing Checklist
```typescript
// Security testing checklist
const securityTestingChecklist = {
  authentication: [
    'Password complexity enforcement',
    'Account lockout mechanisms',
    'Session timeout handling',
    'MFA bypass attempts',
    'Token manipulation testing'
  ],
  
  authorization: [
    'Role privilege escalation',
    'Horizontal privilege escalation',
    'Direct object reference testing',
    'API endpoint authorization',
    'Resource access validation'
  ],
  
  dataProtection: [
    'SQL injection testing',
    'XSS vulnerability scanning',
    'CSRF protection validation',
    'Data exposure in error messages',
    'Backup security verification'
  ],
  
  infrastructure: [
    'Network segmentation testing',
    'SSL/TLS configuration validation',
    'Security header verification',
    'Dependency vulnerability scanning',
    'Configuration security review'
  ]
};
```

## Security Monitoring & Alerting

### 1. Real-time Security Monitoring
```typescript
// Security monitoring system
class SecurityMonitor {
  private alertThresholds = {
    failedLogins: 5,        // per user per hour
    dataExports: 10,        // per user per day
    apiCalls: 1000,        // per user per hour
    suspiciousPatterns: 3   // pattern matches per hour
  };

  async monitorSecurityEvents() {
    // Monitor failed login attempts
    const failedLogins = await this.getFailedLogins(1); // last hour
    if (failedLogins.length > this.alertThresholds.failedLogins) {
      await this.triggerAlert('HIGH_FAILED_LOGIN_RATE', { count: failedLogins.length });
    }

    // Monitor unusual data access patterns
    const unusualAccess = await this.detectUnusualAccess();
    if (unusualAccess.length > 0) {
      await this.triggerAlert('UNUSUAL_DATA_ACCESS', { patterns: unusualAccess });
    }

    // Monitor government API usage
    const govApiUsage = await this.getGovernmentAPIUsage(1); // last hour
    if (govApiUsage.errorRate > 0.1) { // 10% error rate
      await this.triggerAlert('GOV_API_HIGH_ERROR_RATE', { errorRate: govApiUsage.errorRate });
    }
  }
}
```

### 2. Security Metrics Dashboard
```typescript
// Security KPIs
interface SecurityMetrics {
  authenticationMetrics: {
    successfulLogins: number;
    failedLogins: number;
    mfaAdoptionRate: number;
    averageSessionDuration: number;
  };
  
  accessControlMetrics: {
    privilegeEscalationAttempts: number;
    unauthorizedAccessAttempts: number;
    roleChangeFrequency: number;
  };
  
  dataProtectionMetrics: {
    encryptedFieldsPercentage: number;
    dataExportRequests: number;
    sensitiveDataAccess: number;
  };
  
  complianceMetrics: {
    auditCoverage: number;
    policyCompliance: number;
    incidentResponseTime: number;
  };
}
```

## Compliance Requirements

### 1. Saudi Regulatory Compliance
```typescript
// Compliance requirements mapping
const saudiComplianceRequirements = {
  PDPL: {
    requirements: [
      'Data processing lawful basis',
      'Data subject consent management',
      'Data breach notification (72 hours)',
      'Data protection impact assessments',
      'Privacy by design implementation'
    ],
    evidence: [
      'Consent records',
      'Data processing agreements',
      'Breach notification logs',
      'DPIA documentation',
      'Privacy controls audit'
    ]
  },
  
  SAMA: {
    requirements: [
      'Cybersecurity framework implementation',
      'Risk management procedures',
      'Incident response capabilities',
      'Business continuity planning',
      'Third-party risk management'
    ],
    evidence: [
      'Cybersecurity policies',
      'Risk assessment reports',
      'Incident response procedures',
      'BCP documentation',
      'Vendor security assessments'
    ]
  }
};
```

### 2. International Compliance Standards
```typescript
// ISO 27001 compliance mapping
const iso27001Controls = {
  'A.8.1.1': 'Information security policies',
  'A.9.1.1': 'Access control policy',
  'A.10.1.1': 'Cryptographic controls',
  'A.12.1.1': 'Documented operating procedures',
  'A.16.1.1': 'Information security incident management'
  // ... additional controls
};

// Compliance monitoring
const monitorCompliance = async () => {
  const complianceStatus = await Promise.all([
    checkPDPLCompliance(),
    checkISO27001Compliance(),
    checkSAMACompliance()
  ]);
  
  return {
    overallScore: calculateComplianceScore(complianceStatus),
    pdpl: complianceStatus[0],
    iso27001: complianceStatus[1],
    sama: complianceStatus[2],
    lastAssessment: new Date(),
    nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
  };
};
```

## Security Training & Awareness

### 1. Developer Security Training
- **Secure Coding Practices**: OWASP guidelines implementation
- **Saudi Compliance Requirements**: PDPL and regulatory training
- **Incident Response Procedures**: Security incident handling
- **Threat Modeling**: Application security assessment

### 2. Security Culture
- **Regular Security Reviews**: Monthly security assessment
- **Vulnerability Disclosure**: Responsible disclosure process
- **Security Champions**: Security advocates in each team
- **Continuous Learning**: Regular security training updates

This security framework ensures that the AqlHR platform maintains the highest standards of security while meeting Saudi regulatory requirements and international best practices.
