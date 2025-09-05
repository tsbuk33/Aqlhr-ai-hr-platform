# AqlHR Team Onboarding Guide

## Welcome to AqlHR Platform Development Team

This comprehensive guide will help new team members understand the AqlHR platform, its architecture, development processes, and team culture.

## Project Overview

### What is AqlHR?
AqlHR is Saudi Arabia's most advanced AI-powered Human Resources management platform, specifically designed for the Saudi market with complete government integration capabilities.

### Key Features
- **🤖 AI-Powered**: Universal AI assistant across all modules
- **🏛️ Government Integration**: Direct integration with Qiwa, GOSI, and Absher
- **🇸🇦 Saudi-Compliant**: Built-in compliance with Saudi labor laws
- **🌐 Bilingual**: Full Arabic/English support with RTL
- **📊 Analytics**: Comprehensive HR analytics and reporting
- **⚡ Real-time**: Live data synchronization and updates

### Target Users
- **HR Professionals**: Complete employee lifecycle management
- **Compliance Officers**: Government reporting and compliance monitoring
- **Executives**: Strategic HR insights and analytics
- **Employees**: Self-service portals and AI assistance

## Technical Stack Deep Dive

### Frontend Architecture
```typescript
// Core Technologies
React 18.x          // UI Framework
TypeScript 5.x      // Type Safety
Vite               // Build Tool
Tailwind CSS       // Styling Framework
React Query        // Data Fetching & Caching
React Router       // Client-side Routing
```

### Backend Services
```typescript
// Supabase Platform
PostgreSQL         // Primary Database
Edge Functions     // Serverless Functions
Row Level Security // Multi-tenant Security
Real-time         // Live Data Synchronization
Storage           // File Management
Auth              // Authentication & Authorization
```

### External Integrations
```typescript
// Government APIs
Qiwa API          // Employment Services
GOSI API          // Social Insurance
Absher API        // Identity Verification

// AI Services
Hugging Face      // Machine Learning Models
Custom LLMs       // Specialized AI Models
Vector Database   // Semantic Search
```

## Codebase Understanding

### 1. Project Structure Deep Dive

#### `/src/components/` - Component Library
```
components/
├── ai/                    # AI Integration Components
│   ├── UniversalAIIntegrator.tsx  # Main AI integration
│   ├── AqlHRAIAssistant.tsx       # Core AI assistant
│   └── EnhancedAIAssistant.tsx    # Advanced AI features
├── government/            # Government Integration UI
│   ├── GovHubDashboard.tsx        # Government dashboard
│   └── ComplianceMonitor.tsx      # Compliance tracking
├── layout/               # Layout Components
│   ├── DashboardLayout.tsx        # Main app layout
│   └── LanguageRouter.tsx         # i18n routing
├── ui/                   # Base UI Components (shadcn/ui)
│   ├── button.tsx                 # Button component
│   ├── card.tsx                   # Card component
│   └── [50+ UI components]        # Complete UI system
└── shared/               # Shared Business Components
    ├── EmployeeCard.tsx           # Employee display
    └── ComplianceStatus.tsx       # Compliance indicators
```

#### `/src/pages/` - Page Components
```
pages/
├── Dashboard.tsx         # Main dashboard
├── government/          # Government integration pages
├── compliance/          # Compliance management
├── people/             # Employee management
└── analytics/          # Analytics & reporting
```

#### `/src/hooks/` - Custom Hooks
```
hooks/
├── useAuth.ts           # Authentication logic
├── useDashboardData.ts  # Dashboard data fetching
├── useLanguage.ts       # Internationalization
└── useGovernmentSync.ts # Government API integration
```

#### `/src/lib/` - Utility Libraries
```
lib/
├── i18n/               # Internationalization system
├── utils/              # Helper functions
├── government/         # Government API clients
└── ai/                # AI integration utilities
```

### 2. Data Flow Patterns

#### Multi-tenant Data Access Pattern
```typescript
// All database queries follow this pattern
const fetchEmployees = async () => {
  const { data } = await supabase
    .from('hr_employees')
    .select('*')
    .eq('company_id', getTenantId())  // Tenant isolation
    .order('created_at', { ascending: false });
  
  return data;
};
```

#### Government Integration Pattern
```typescript
// Government API calls use standardized error handling
const syncWithQiwa = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('gov-sync', {
      body: { 
        system: 'qiwa', 
        action: 'employee_status',
        tenantId: getTenantId()
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    // Standardized error handling
    console.error('AqlHR: [GOV_SYNC] Qiwa sync failed', { error });
    throw error;
  }
};
```

#### AI Integration Pattern
```typescript
// AI features use Universal AI Integrator
const EmployeePage = () => {
  return (
    <div>
      {/* Page content */}
      
      {/* AI Integration - Automatically configures based on context */}
      <UniversalAIIntegrator 
        pageType="core-hr" 
        moduleName="employee-management" 
        companyId="demo-company" 
        enabledFeatures={[
          'employee-insights', 
          'performance-analysis',
          'predictive-analytics'
        ]}
      />
    </div>
  );
};
```

## Development Workflow

### 1. Daily Development Process

#### Morning Routine
1. **Pull Latest Changes**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Check for Dependencies Updates**
   ```bash
   npm outdated
   # Review and update if necessary
   ```

3. **Verify Development Environment**
   ```bash
   npm run dev
   # Ensure everything starts correctly
   ```

#### Feature Development
1. **Create Feature Branch**
   ```bash
   git checkout -b feature/employee-performance-metrics
   ```

2. **Implement with Testing**
   ```bash
   # Write tests first (TDD approach recommended)
   npm run test:watch
   
   # Implement feature
   # Run quality checks
   npm run lint
   npm run type-check
   ```

3. **Code Review Process**
   ```bash
   git push origin feature/employee-performance-metrics
   # Create PR with detailed description
   # Address review feedback
   # Merge after approval
   ```

### 2. Code Quality Standards

#### TypeScript Best Practices
```typescript
// ✅ Good: Explicit interfaces
interface Employee {
  id: string;
  name: string;
  department: Department;
  hireDate: Date;
}

// ✅ Good: Proper error handling
const createEmployee = async (data: EmployeeData): Promise<Employee> => {
  try {
    const { data: employee, error } = await supabase
      .from('hr_employees')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return employee;
  } catch (error) {
    console.error('AqlHR: [EMPLOYEE] Creation failed', { error, data });
    throw new Error('Failed to create employee');
  }
};

// ❌ Avoid: Using 'any' type
const processData = (data: any) => { /* avoid this */ };
```

#### React Component Patterns
```typescript
// ✅ Good: Component composition with proper TypeScript
interface EmployeeCardProps {
  employee: Employee;
  onEdit: (id: string) => void;
  showActions?: boolean;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  employee, 
  onEdit, 
  showActions = true 
}) => {
  const { t } = useLocale();
  
  return (
    <Card className="employee-card">
      <CardHeader>
        <CardTitle>{employee.name}</CardTitle>
        <CardDescription>{employee.department.name}</CardDescription>
      </CardHeader>
      {showActions && (
        <CardFooter>
          <Button onClick={() => onEdit(employee.id)}>
            {t('common', 'edit')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
```

#### Styling Conventions
```typescript
// ✅ Good: Use design system tokens
<Button variant="primary" size="lg" className="w-full">
  {t('actions', 'create_employee')}
</Button>

// ✅ Good: Responsive design patterns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {employees.map(employee => (
    <EmployeeCard key={employee.id} employee={employee} />
  ))}
</div>

// ❌ Avoid: Hard-coded styles
<div style={{ color: '#ff0000', fontSize: '16px' }}>Error</div>
```

## Saudi-Specific Knowledge

### 1. Labor Law Compliance
Understanding Saudi labor law is crucial for platform development:

#### Key Compliance Areas
- **Saudization (Nitaqat)**: Percentage of Saudi employees required
- **GOSI Contributions**: Social insurance requirements
- **Working Hours**: Prayer time accommodations
- **Gender Segregation**: Workplace compliance requirements
- **Visa Management**: Iqama and visa status tracking

#### Implementation Examples
```typescript
// Saudization calculation
const calculateSaudizationRate = (employees: Employee[]) => {
  const totalEmployees = employees.length;
  const saudiEmployees = employees.filter(emp => emp.nationality === 'saudi').length;
  return (saudiEmployees / totalEmployees) * 100;
};

// Working hours with prayer time
const PRAYER_TIMES = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const accommodatePrayerTime = (schedule: WorkSchedule) => {
  // Implementation for prayer time accommodation
};
```

### 2. Arabic Language Support

#### RTL (Right-to-Left) Development
```css
/* CSS for RTL support */
.rtl {
  direction: rtl;
  text-align: right;
}

/* Tailwind RTL utilities */
.rtl:mr-4 { /* margin-right in RTL becomes margin-left */ }
```

#### Arabic Text Handling
```typescript
// Arabic numeral conversion
const formatArabicNumerals = (number: number): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return number.toString().replace(/\d/g, digit => arabicNumerals[parseInt(digit)]);
};

// Hijri date support
const formatHijriDate = (date: Date): string => {
  // Use Umm Al-Qura calendar for Saudi compliance
  return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura').format(date);
};
```

### 3. Government API Integration

#### Qiwa API Patterns
```typescript
// Employee status verification
const verifyQiwaStatus = async (iqamaNumber: string) => {
  const response = await supabase.functions.invoke('gov-sync', {
    body: {
      system: 'qiwa',
      endpoint: 'employee_status',
      payload: { iqama_number: iqamaNumber }
    }
  });
  
  return response.data;
};
```

#### GOSI Integration
```typescript
// Contribution status check
const getGosiContributions = async (employeeId: string) => {
  const response = await supabase.functions.invoke('gov-sync', {
    body: {
      system: 'gosi',
      endpoint: 'contribution_status',
      payload: { employee_id: employeeId }
    }
  });
  
  return response.data;
};
```

## AI Integration Understanding

### 1. Universal AI Integrator
The Universal AI Integrator automatically configures AI assistance based on context:

```typescript
// Automatically provides contextual AI help
<UniversalAIIntegrator 
  pageType="analytics"           // Determines AI capabilities
  moduleName="dashboard"         // Specific module context
  companyId="demo-company"      // Tenant context
  enabledFeatures={[            // Feature-specific AI
    'real-time-insights',
    'predictive-analytics',
    'executive-intelligence'
  ]}
/>
```

### 2. AI-Powered Features
- **Smart Document Processing**: Automatic document categorization
- **Predictive Analytics**: Employee turnover prediction
- **Compliance Monitoring**: Automated compliance checking
- **Natural Language Queries**: Ask questions in Arabic/English

## Security & Compliance

### 1. Data Security Principles
- **Multi-tenant Isolation**: Complete tenant data separation
- **Audit Logging**: All actions are logged for compliance
- **Encryption**: Data encrypted at rest and in transit
- **Access Control**: Role-based access with principle of least privilege

### 2. Saudi Data Protection Laws
- **PDPL Compliance**: Saudi Personal Data Protection Law
- **Medical Data**: Special handling for health information
- **Government Reporting**: Secure channels for government data

## Testing Strategy

### 1. Testing Pyramid
```typescript
// Unit Tests (Most)
describe('calculateSaudizationRate', () => {
  it('calculates correct saudization percentage', () => {
    const employees = [
      { nationality: 'saudi' },
      { nationality: 'pakistani' },
      { nationality: 'saudi' }
    ];
    expect(calculateSaudizationRate(employees)).toBe(66.67);
  });
});

// Integration Tests (Some)
describe('Employee API', () => {
  it('creates employee with proper tenant isolation', async () => {
    // Test database integration
  });
});

// E2E Tests (Few but Critical)
describe('Employee Workflow', () => {
  it('completes full employee onboarding process', () => {
    // Test complete user journey
  });
});
```

### 2. Government API Testing
```typescript
// Mock government APIs for testing
const mockQiwaResponse = {
  status: 'success',
  data: {
    employee_status: 'active',
    contract_type: 'unlimited'
  }
};

// Test with mock data
describe('Government Integration', () => {
  beforeEach(() => {
    mockGovernmentAPI('qiwa', mockQiwaResponse);
  });
  
  it('handles Qiwa API responses correctly', async () => {
    // Test implementation
  });
});
```

## Performance Optimization

### 1. Frontend Performance
- **Code Splitting**: Module-based lazy loading
- **Memoization**: React.memo for expensive components
- **Caching**: React Query for API responses
- **Bundle Optimization**: Tree shaking and compression

### 2. Database Performance
- **Indexing Strategy**: Optimized for multi-tenant queries
- **Query Optimization**: Use of materialized views
- **Connection Pooling**: Efficient database connections

## Monitoring & Debugging

### 1. Development Debugging
```typescript
// Use debug mode for enhanced logging
// URL: http://localhost:5173/en/dashboard?debug=1

console.log('AqlHR: [MODULE] Action', { data, context });
console.warn('AqlHR: [MODULE] Warning', { warning });
console.error('AqlHR: [MODULE] Error', { error, stack });
```

### 2. Production Monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time monitoring
- **User Analytics**: Feature usage tracking
- **Government API Status**: Real-time sync monitoring

## Deployment & Infrastructure

### 1. Environment Strategy
- **Development**: Local development with mock services
- **Staging**: Pre-production testing with government simulators
- **Production**: Saudi cloud regions with real government APIs

### 2. CI/CD Pipeline
```yaml
# Automated deployment pipeline
stages:
  - code_quality    # Linting, type checking
  - testing        # Unit, integration tests
  - security_scan  # Dependency vulnerabilities
  - build          # Production build
  - deploy         # Environment-specific deployment
```

## Team Communication

### 1. Communication Channels
- **Daily Standups**: Progress updates and blockers
- **Architecture Reviews**: Technical decision discussions
- **Code Reviews**: Peer review process
- **Knowledge Sharing**: Regular learning sessions

### 2. Documentation Standards
- **Code Comments**: For complex business logic
- **API Documentation**: OpenAPI specifications
- **Architecture Decisions**: ADR format
- **User Guides**: End-user documentation

## Getting Help

### 1. Internal Resources
- **Architecture Team**: Technical guidance
- **Product Team**: Business requirements
- **QA Team**: Testing support
- **DevOps Team**: Infrastructure support

### 2. External Resources
- **Supabase Documentation**: Database and backend
- **React Documentation**: Frontend framework
- **Saudi Government APIs**: Integration guides
- **Tailwind CSS**: Styling framework

## Next Steps

### Week 1: Foundation
- [ ] Complete development environment setup
- [ ] Review architecture documentation
- [ ] Understand codebase structure
- [ ] Run first local build successfully

### Week 2: First Contribution
- [ ] Implement small bug fix or feature
- [ ] Complete code review process
- [ ] Understand testing procedures
- [ ] Deploy to staging environment

### Week 3: Domain Knowledge
- [ ] Deep dive into Saudi HR compliance
- [ ] Understand government integration
- [ ] Learn AI system architecture
- [ ] Master i18n and RTL development

### Week 4: Full Productivity
- [ ] Lead a feature development
- [ ] Mentor another team member
- [ ] Contribute to architecture decisions
- [ ] Optimize performance or security

## Resources & Links

### Documentation
- [Architecture Overview](./ARCHITECTURE.md)
- [Development Setup](./DEVELOPMENT_SETUP.md)
- [Security Framework](./SECURITY_FRAMEWORK.md)
- [API Documentation](./API_DOCUMENTATION.md)

### External References
- [Saudi Labor Law Guide](https://hrsd.gov.sa/)
- [Qiwa Platform](https://www.qiwa.sa/)
- [GOSI Services](https://www.gosi.gov.sa/)
- [Supabase Platform](https://supabase.com/docs)

Welcome to the team! We're excited to have you contribute to building Saudi Arabia's most advanced HR platform. 🚀