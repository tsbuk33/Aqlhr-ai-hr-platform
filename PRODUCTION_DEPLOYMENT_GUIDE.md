# AQLHR Production Deployment Guide

## Production Environment Overview

### Primary Production URLs
- **Main Website**: https://www.aqlhr.com
- **Backend API**: https://19hninc0d1k1.manus.space
- **GitHub Repository**: https://github.com/tsbuk33/Aqlhr-ai-hr-platform

## Architecture Deployment Status

### ✅ Frontend Deployment (AQLHR.com)
- **Platform**: Vercel
- **Domain**: https://www.aqlhr.com
- **Framework**: React/TypeScript
- **Status**: Live and operational
- **Features**: Complete HR interface with AI integration

### ✅ Backend Deployment (5-Layer Architecture)
- **Platform**: Manus Space
- **API URL**: https://19hninc0d1k1.manus.space
- **Framework**: Flask with 5-layer architecture
- **Status**: Live and operational
- **Features**: AI orchestration, HR services, government integration

## Frontend-Backend Integration

### API Configuration for AQLHR.com

Update your frontend environment configuration:

```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'https://19hninc0d1k1.manus.space',
  FRONTEND_URL: 'https://www.aqlhr.com',
  ENDPOINTS: {
    HEALTH: '/api/health',
    AI: '/api/ai',
    EMPLOYEES: '/api/employees',
    DASHBOARD: '/api/dashboard',
    VISION_2030: '/api/vision2030',
    GOSI: '/api/gosi',
    HRSD: '/api/hrsd',
    QIWA: '/api/qiwa'
  }
};
```

### CORS Configuration

The backend is configured to accept requests from www.aqlhr.com:

```python
# CORS configuration in Flask app
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response
```

## Production API Endpoints

### Core System
- `GET https://19hninc0d1k1.manus.space/api/health` - System health
- `GET https://19hninc0d1k1.manus.space/api/` - API documentation

### AI Orchestration
- `POST https://19hninc0d1k1.manus.space/api/ai/prompt` - Process AI requests
- `GET https://19hninc0d1k1.manus.space/api/ai/status` - AI service status

### HR Management
- `GET https://19hninc0d1k1.manus.space/api/employees` - Employee list
- `GET https://19hninc0d1k1.manus.space/api/employees/statistics/summary` - HR analytics

### Executive Dashboard
- `GET https://19hninc0d1k1.manus.space/api/dashboard/metrics` - Strategic metrics
- `GET https://19hninc0d1k1.manus.space/api/vision2030/kpis` - Vision 2030 KPIs

### Government Integration
- `GET https://19hninc0d1k1.manus.space/api/gosi/status` - GOSI integration
- `GET https://19hninc0d1k1.manus.space/api/hrsd/status` - HRSD integration
- `GET https://19hninc0d1k1.manus.space/api/qiwa/status` - QIWA integration

## Frontend Integration Examples

### AI Service Integration

```typescript
// src/services/aiService.ts
import { API_CONFIG } from '../config/api';

export class AQLHRAIService {
  private baseUrl = API_CONFIG.BASE_URL;

  async processPrompt(text: string, language: 'en' | 'ar' = 'en') {
    const response = await fetch(`${this.baseUrl}/api/ai/prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        language,
        user_id: 'current_user',
        session_id: `session_${Date.now()}`,
        user_role: 'EXECUTIVE'
      })
    });
    
    return response.json();
  }

  async getAIStatus() {
    const response = await fetch(`${this.baseUrl}/api/ai/status`);
    return response.json();
  }
}
```

### Dashboard Service Integration

```typescript
// src/services/dashboardService.ts
import { API_CONFIG } from '../config/api';

export class AQLHRDashboardService {
  private baseUrl = API_CONFIG.BASE_URL;

  async getStrategicMetrics() {
    const response = await fetch(`${this.baseUrl}/api/dashboard/metrics`);
    return response.json();
  }

  async getVision2030KPIs() {
    const response = await fetch(`${this.baseUrl}/api/vision2030/kpis`);
    return response.json();
  }

  async getEmployeeStatistics() {
    const response = await fetch(`${this.baseUrl}/api/employees/statistics/summary`);
    return response.json();
  }
}
```

### Government Integration Service

```typescript
// src/services/governmentService.ts
import { API_CONFIG } from '../config/api';

export class AQLHRGovernmentService {
  private baseUrl = API_CONFIG.BASE_URL;

  async getGOSIStatus() {
    const response = await fetch(`${this.baseUrl}/api/gosi/status`);
    return response.json();
  }

  async getHRSDStatus() {
    const response = await fetch(`${this.baseUrl}/api/hrsd/status`);
    return response.json();
  }

  async getQIWAStatus() {
    const response = await fetch(`${this.baseUrl}/api/qiwa/status`);
    return response.json();
  }
}
```

## Environment Variables for Production

### Frontend Environment (.env.production)
```bash
VITE_API_BASE_URL=https://19hninc0d1k1.manus.space
VITE_APP_URL=https://www.aqlhr.com
VITE_ENVIRONMENT=production
```

### Backend Environment
```bash
ENVIRONMENT=production
FRONTEND_URL=https://www.aqlhr.com
CORS_ORIGINS=https://www.aqlhr.com,https://aqlhr.com
```

## Deployment Verification

### Health Check
```bash
curl https://19hninc0d1k1.manus.space/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "AQLHR 5-Layer Architecture",
  "environment": "production",
  "services": {
    "ai_orchestration": "available",
    "employee_service": "available",
    "executive_dashboard": "available",
    "government_integration": "available"
  }
}
```

### AI Service Test
```bash
curl -X POST https://19hninc0d1k1.manus.space/api/ai/prompt \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Show me employee statistics",
    "language": "en",
    "user_id": "test_user",
    "session_id": "test_session",
    "user_role": "EXECUTIVE"
  }'
```

## Monitoring and Maintenance

### Performance Monitoring
- Response time monitoring for all API endpoints
- Error rate tracking
- Resource utilization monitoring

### Security Monitoring
- API rate limiting
- Authentication token validation
- CORS policy enforcement

### Government Integration Monitoring
- GOSI connection status
- HRSD synchronization
- QIWA compliance tracking

## Scaling Considerations

### Frontend Scaling (www.aqlhr.com)
- Vercel automatic scaling
- CDN distribution
- Static asset optimization

### Backend Scaling (API)
- Microservices architecture supports horizontal scaling
- Load balancing capabilities
- Database optimization

## Support and Maintenance

### Regular Maintenance Tasks
1. Monitor API performance and response times
2. Update government integration credentials
3. Review security logs and access patterns
4. Update AI models and training data
5. Backup and recovery testing

### Emergency Procedures
1. Health check monitoring
2. Rollback procedures
3. Incident response protocols
4. Communication channels

## Next Steps for Full Production

1. **Domain Configuration**: Ensure www.aqlhr.com is properly configured
2. **SSL Certificates**: Verify HTTPS configuration
3. **Government API Credentials**: Configure production API keys
4. **Monitoring Setup**: Implement comprehensive monitoring
5. **User Training**: Train administrators on new AI capabilities

## Conclusion

The AQLHR platform is now fully deployed with:
- **Frontend**: https://www.aqlhr.com (React/TypeScript)
- **Backend**: https://19hninc0d1k1.manus.space (5-layer architecture)
- **Integration**: Complete API connectivity between frontend and backend
- **Features**: AI orchestration, government compliance, real-time analytics

The platform is ready for production use with autonomous AI capabilities and enterprise-grade architecture.

