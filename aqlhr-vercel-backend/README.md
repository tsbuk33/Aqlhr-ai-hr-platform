# AQLHR Vercel Backend

## Overview

Professional Vercel-based backend for the AQLHR 5-Layer Architecture, designed to replace temporary Manus infrastructure with production-ready serverless functions.

## 🚀 Production URLs

- **API Base URL**: https://api.aqlhr.com
- **Frontend URL**: https://www.aqlhr.com
- **GitHub Repository**: https://github.com/tsbuk33/Aqlhr-ai-hr-platform

## 🏗️ Architecture

### 5-Layer Serverless Architecture

1. **Layer 1 - Presentation**: API Gateway with CORS
2. **Layer 2 - AI Orchestration**: Intelligent decision making
3. **Layer 3 - Business Logic**: HR microservices
4. **Layer 4 - Integration**: Government connectors
5. **Layer 5 - Data**: Analytics and storage

### Serverless Functions Structure

```
api/
├── index.js                 # Main API entry point
├── health.js               # System health monitoring
├── ai/
│   └── index.js            # AI orchestration layer
├── employees/
│   └── index.js            # Employee management
├── dashboard/
│   └── index.js            # Executive dashboard
├── vision2030/
│   └── index.js            # Vision 2030 tracking
└── government/
    ├── gosi.js             # GOSI integration
    ├── hrsd.js             # HRSD integration
    └── qiwa.js             # QIWA integration
```

## 📡 API Endpoints

### Core System
- `GET /api/health` - System health check
- `GET /api/` - API documentation

### AI Orchestration (Layer 2)
- `GET /api/ai/status` - AI service status
- `POST /api/ai/prompt` - Process AI requests

### Employee Management (Layer 3)
- `GET /api/employees` - List employees with pagination
- `POST /api/employees` - Create new employee
- `GET /api/employees/statistics/summary` - Employee analytics

### Executive Dashboard
- `GET /api/dashboard/metrics` - Strategic metrics
- `GET /api/vision2030/kpis` - Vision 2030 KPIs
- `GET /api/vision2030/dashboard` - Dashboard summary

### Government Integration (Layer 4)
- `GET /api/gosi/status` - GOSI integration status
- `POST /api/gosi/register` - Register employee with GOSI
- `POST /api/gosi/calculate` - Calculate contributions
- `GET /api/hrsd/status` - HRSD integration status
- `GET /api/qiwa/status` - QIWA integration status

## 🛠️ Deployment

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally
   ```bash
   npm install -g vercel
   ```
3. **Domain Access**: Ability to configure api.aqlhr.com subdomain

### Quick Deployment

1. **Clone and Navigate**:
   ```bash
   cd aqlhr-vercel-backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

4. **Configure Custom Domain**:
   ```bash
   vercel alias your-deployment-url.vercel.app api.aqlhr.com
   ```

### Environment Configuration

1. **Copy Environment Template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Configure Variables**:
   ```bash
   # Edit .env.local with your configuration
   nano .env.local
   ```

3. **Set Vercel Environment Variables**:
   ```bash
   vercel env add ENVIRONMENT production
   vercel env add FRONTEND_URL https://www.aqlhr.com
   vercel env add API_URL https://api.aqlhr.com
   ```

### DNS Configuration

Add CNAME record to your DNS:
```
api.aqlhr.com CNAME your-deployment-url.vercel.app
```

## 🔧 Development

### Local Development

1. **Start Development Server**:
   ```bash
   npm run dev
   # or
   vercel dev
   ```

2. **Test Endpoints**:
   ```bash
   curl http://localhost:3000/api/health
   ```

### Testing

```bash
# Health check
curl https://api.aqlhr.com/api/health

# AI service test
curl -X POST https://api.aqlhr.com/api/ai/prompt \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Show me employee statistics",
    "language": "en",
    "user_role": "EXECUTIVE"
  }'

# Employee statistics
curl https://api.aqlhr.com/api/employees/statistics/summary

# Vision 2030 KPIs
curl https://api.aqlhr.com/api/vision2030/kpis
```

## 🔒 Security Features

### CORS Configuration
- Configured for www.aqlhr.com origin
- Supports all necessary HTTP methods
- Proper headers for cross-origin requests

### Rate Limiting
- Built-in Vercel rate limiting
- Configurable per endpoint
- DDoS protection included

### Environment Security
- Secure environment variable handling
- No sensitive data in code
- Production-grade secret management

## 📊 Monitoring

### Health Monitoring
- Comprehensive health checks
- Service status monitoring
- Performance metrics tracking

### Error Tracking
- Structured error responses
- Request/response logging
- Performance monitoring

### Analytics
- API usage tracking
- Response time monitoring
- Error rate analysis

## 🌐 Frontend Integration

### API Client Configuration

```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'https://api.aqlhr.com',
  FRONTEND_URL: 'https://www.aqlhr.com',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
```

### Service Examples

```typescript
// AI Service
export class AQLHRAIService {
  async processPrompt(text: string, language: 'en' | 'ar' = 'en') {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/ai/prompt`, {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({ text, language, user_role: 'EXECUTIVE' })
    });
    return response.json();
  }
}

// Employee Service
export class AQLHREmployeeService {
  async getStatistics() {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/employees/statistics/summary`);
    return response.json();
  }
}

// Vision 2030 Service
export class AQLHRVisionService {
  async getKPIs() {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/vision2030/kpis`);
    return response.json();
  }
}
```

## 🚀 Scaling Considerations

### Serverless Benefits
- **Automatic Scaling**: Handles traffic spikes automatically
- **Cost Efficiency**: Pay only for actual usage
- **Global Distribution**: CDN-powered worldwide access
- **Zero Maintenance**: No server management required

### Performance Optimization
- **Function Optimization**: Optimized cold start times
- **Caching Strategy**: Intelligent response caching
- **Compression**: Automatic response compression
- **CDN Integration**: Global edge network

## 📈 Migration from Manus Backend

### Migration Steps

1. **Update Frontend Configuration**:
   ```typescript
   // Change from
   const API_BASE_URL = 'https://19hninc0d1k1.manus.space';
   
   // To
   const API_BASE_URL = 'https://api.aqlhr.com';
   ```

2. **Test All Endpoints**:
   - Verify health check
   - Test AI functionality
   - Validate employee services
   - Check government integrations

3. **Update Documentation**:
   - Update all API references
   - Modify deployment guides
   - Update monitoring configurations

### Benefits of Migration

- ✅ **Professional Infrastructure**: Enterprise-grade Vercel platform
- ✅ **Custom Domain**: api.aqlhr.com branding
- ✅ **Better Performance**: Global CDN distribution
- ✅ **Cost Efficiency**: Serverless pricing model
- ✅ **Scalability**: Automatic scaling capabilities
- ✅ **Reliability**: 99.9% uptime SLA

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Verify frontend URL in environment variables
   - Check CORS headers configuration

2. **Function Timeouts**:
   - Optimize function performance
   - Increase timeout limits if needed

3. **Environment Variables**:
   - Verify all required variables are set
   - Check variable names and values

### Support Commands

```bash
# View deployment logs
vercel logs

# Check environment variables
vercel env ls

# View domain configuration
vercel domains ls

# Redeploy
vercel --prod --force
```

## 📞 Support

For technical support:
- Check API documentation: https://api.aqlhr.com/api/
- Monitor health: https://api.aqlhr.com/api/health
- Review logs: `vercel logs`

## 🎯 Next Steps

1. **Complete Migration**: Replace all Manus backend references
2. **Government API Integration**: Configure production API credentials
3. **Monitoring Setup**: Implement comprehensive monitoring
4. **Performance Optimization**: Fine-tune function performance
5. **Security Hardening**: Implement additional security measures

---

**AQLHR Backend** - Professional serverless infrastructure for autonomous HR operations.

