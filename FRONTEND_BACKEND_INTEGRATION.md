# AQLHR Frontend-Backend Integration Plan
## Connecting the React Frontend with Security-Hardened Backend

### Current Frontend Analysis
Based on the AQLHR website inspection, the frontend includes:

✅ **Existing Features:**
- Dashboard with comprehensive HR modules
- Executive Intelligence Center (Premium)
- Core HR modules (13 components)
- AI & Analytics (18 features)
- Government Integrations (22 services)
- Arabic/English bilingual support
- Saudi Vision 2030 integration
- Government platform logos (MOL, QIWA, GOSI, ABSHER)

### Backend Integration Strategy

#### 1. API Configuration
```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'https://api.aqlhr.com',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
};

// API endpoints mapping
export const ENDPOINTS = {
  // Layer 1: Presentation
  HEALTH: '/api/health',
  
  // Layer 2: AI Orchestration
  AI_STATUS: '/api/ai/status',
  AI_PROMPT: '/api/ai/prompt',
  
  // Layer 3: Business Logic
  EMPLOYEES: '/api/employees/statistics/summary',
  
  // Layer 4: Integration
  GOSI: '/api/gosi/status',
  
  // Layer 5: Data
  VISION2030: '/api/vision2030/kpis'
};
```

#### 2. Executive Intelligence Center Integration
```typescript
// src/components/ExecutiveCenter.tsx
import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';

interface ExecutiveMetrics {
  totalEmployees: number;
  saudizationRate: number;
  vision2030Progress: number;
  aiInsights: string[];
}

export const ExecutiveCenter = () => {
  const [metrics, setMetrics] = useState<ExecutiveMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExecutiveData = async () => {
      try {
        const [employees, vision2030, aiStatus] = await Promise.all([
          apiClient.get('/api/employees/statistics/summary'),
          apiClient.get('/api/vision2030/kpis'),
          apiClient.get('/api/ai/status')
        ]);

        setMetrics({
          totalEmployees: employees.data.total_employees,
          saudizationRate: employees.data.saudization_rate,
          vision2030Progress: vision2030.data.overall_progress,
          aiInsights: aiStatus.data.insights
        });
      } catch (error) {
        console.error('Failed to fetch executive data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExecutiveData();
  }, []);

  if (loading) return <div>Loading Executive Intelligence...</div>;

  return (
    <div className="executive-center">
      <h2>Executive Intelligence Center</h2>
      <div className="metrics-grid">
        <MetricCard 
          title="Total Employees" 
          value={metrics?.totalEmployees} 
          icon="👥"
        />
        <MetricCard 
          title="Saudization Rate" 
          value={`${metrics?.saudizationRate}%`} 
          icon="🇸🇦"
        />
        <MetricCard 
          title="Vision 2030 Progress" 
          value={`${metrics?.vision2030Progress}%`} 
          icon="🎯"
        />
      </div>
      <AIInsightsPanel insights={metrics?.aiInsights || []} />
    </div>
  );
};
```

#### 3. Government Integrations
```typescript
// src/services/governmentIntegrations.ts
export class GovernmentIntegrationService {
  
  async getGOSIStatus() {
    return apiClient.get('/api/gosi/status');
  }
  
  async getQIWAData() {
    return apiClient.get('/api/qiwa/status');
  }
  
  async getHRSDCompliance() {
    return apiClient.get('/api/hrsd/compliance');
  }
  
  async getABSHERIntegration() {
    return apiClient.get('/api/absher/status');
  }
  
  async syncAllGovernmentData() {
    const integrations = await Promise.allSettled([
      this.getGOSIStatus(),
      this.getQIWAData(),
      this.getHRSDCompliance(),
      this.getABSHERIntegration()
    ]);
    
    return integrations.map((result, index) => ({
      service: ['GOSI', 'QIWA', 'HRSD', 'ABSHER'][index],
      status: result.status === 'fulfilled' ? 'connected' : 'error',
      data: result.status === 'fulfilled' ? result.value.data : null
    }));
  }
}
```

#### 4. AI-Powered Features
```typescript
// src/services/aiService.ts
export class AIService {
  
  async processNaturalLanguageQuery(query: string, language: 'ar' | 'en' = 'en') {
    return apiClient.post('/api/ai/prompt', {
      text: query,
      language,
      user_role: 'EXECUTIVE'
    });
  }
  
  async getHRInsights() {
    const response = await apiClient.get('/api/ai/status');
    return response.data.insights;
  }
  
  async generateReport(type: string, parameters: any) {
    return apiClient.post('/api/ai/generate-report', {
      report_type: type,
      parameters,
      language: 'ar' // Default to Arabic for Saudi context
    });
  }
}
```

#### 5. Real-time Dashboard Updates
```typescript
// src/hooks/useRealTimeData.ts
import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';

export const useRealTimeData = (endpoint: string, interval: number = 30000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(endpoint);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling
    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [endpoint, interval]);

  return { data, loading, error };
};
```

#### 6. Security Integration
```typescript
// src/services/auth.ts
export class AuthService {
  
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post('/api/auth/login', credentials);
    const { token, user } = response.data;
    
    // Store JWT token
    localStorage.setItem('aqlhr_token', token);
    
    // Set default authorization header
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return { token, user };
  }
  
  async logout() {
    localStorage.removeItem('aqlhr_token');
    delete apiClient.defaults.headers.common['Authorization'];
  }
  
  getToken() {
    return localStorage.getItem('aqlhr_token');
  }
  
  isAuthenticated() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }
}
```

### Implementation Steps

#### Phase 1: Core Integration (Week 1)
1. ✅ Set up API client with security headers
2. ✅ Integrate health check endpoint
3. ✅ Connect Executive Intelligence Center
4. ✅ Implement authentication flow

#### Phase 2: Government Integrations (Week 2)
1. ✅ Connect GOSI integration
2. ✅ Implement QIWA data sync
3. ✅ Add HRSD compliance monitoring
4. ✅ Integrate ABSHER services

#### Phase 3: AI Features (Week 3)
1. ✅ Implement AI-powered insights
2. ✅ Add natural language processing
3. ✅ Create automated report generation
4. ✅ Integrate Arabic/English AI support

#### Phase 4: Real-time Features (Week 4)
1. ✅ Add real-time dashboard updates
2. ✅ Implement WebSocket connections
3. ✅ Create notification system
4. ✅ Add performance monitoring

### Testing Strategy
```typescript
// src/tests/integration.test.ts
describe('AQLHR Frontend-Backend Integration', () => {
  
  test('Executive Center loads data correctly', async () => {
    const response = await apiClient.get('/api/employees/statistics/summary');
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('total_employees');
  });
  
  test('Government integrations are functional', async () => {
    const gosiStatus = await apiClient.get('/api/gosi/status');
    expect(gosiStatus.data.status).toBe('connected');
  });
  
  test('AI services respond correctly', async () => {
    const aiResponse = await apiClient.post('/api/ai/prompt', {
      text: 'Show employee statistics',
      language: 'en'
    });
    expect(aiResponse.status).toBe(200);
  });
});
```

### Performance Optimization
1. **Caching Strategy**: Implement Redis caching for frequently accessed data
2. **Lazy Loading**: Load components and data on demand
3. **Code Splitting**: Split bundles by feature modules
4. **CDN Integration**: Use CDN for static assets
5. **Compression**: Enable gzip compression for API responses

### Monitoring and Analytics
1. **Error Tracking**: Implement Sentry for error monitoring
2. **Performance Metrics**: Track API response times
3. **User Analytics**: Monitor user interactions
4. **Security Monitoring**: Track authentication and authorization events

This integration plan ensures seamless connectivity between the AQLHR frontend and the security-hardened backend while maintaining all existing functionality and adding new AI-powered capabilities.

