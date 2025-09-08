# AQLHR Backend 5-Layer Architecture Integration

## Overview

The AQLHR platform has been enhanced with a comprehensive 5-layer backend architecture that provides autonomous AI-powered HR operations, government integrations, and enterprise-scale capabilities.

## Architecture Integration

### Frontend (Existing)
- **Location**: `/src/` - React/TypeScript frontend
- **Deployment**: Vercel (existing)
- **URL**: https://sanad-ai-hr-platform.vercel.app

### Backend (New 5-Layer Architecture)
- **Location**: `/backend/` - Python-based microservices
- **Deployment**: Vercel (new configuration)
- **Architecture**: 5-layer system with AI orchestration

## Backend Structure

```
backend/
├── layer1-presentation/          # API Gateway, Executive Dashboard
├── layer2-ai-orchestration/      # AI Agent Controller, NLP Engine
├── layer3-business-logic/        # HR Microservices, Compliance
├── layer4-integration/           # Government Connectors (GOSI, HRSD, QIWA)
├── layer5-data/                  # Data models and schemas
├── api/                          # Vercel-compatible API entry point
├── config/                       # Configuration files
├── scripts/                      # Deployment and utility scripts
├── requirements.txt              # Python dependencies
├── vercel.json                   # Vercel deployment configuration
└── package.json                  # Backend package configuration
```

## Key Features Implemented

### 🤖 AI Orchestration Layer
- **AI Agent Controller**: Master brain for autonomous decision making
- **NLP Engine**: Arabic/English natural language processing
- **Decision Engine**: Rule-based and ML-powered decisions
- **Workflow Orchestrator**: Automated HR process management

### ⚙️ Business Logic Layer
- **Employee Service**: Complete lifecycle management
- **Payroll Service**: Salary calculation and compliance
- **Compliance Service**: Regulatory adherence and audit trails
- **Analytics Service**: Real-time insights and reporting

### 🔗 Integration Layer
- **GOSI Connector**: Social insurance integration
- **HRSD Connector**: Ministry of Human Resources integration
- **QIWA Connector**: National employment platform
- **Banking Integration**: Multi-bank payment processing

### 🌐 Presentation Layer
- **Executive Dashboard**: Strategic metrics and Vision 2030 tracking
- **API Gateway**: Unified API access with rate limiting
- **Mobile API**: Cross-platform mobile support

## Deployment Options

### Option 1: Vercel Deployment (Recommended)

```bash
# Deploy backend to Vercel
cd backend
./scripts/deploy-vercel.sh deploy

# Set environment variables
./scripts/deploy-vercel.sh env

# Test deployment
./scripts/deploy-vercel.sh test
```

### Option 2: Docker Deployment

```bash
# Deploy full stack with Docker
cd backend
./scripts/deploy.sh deploy

# Access services
# - Executive Dashboard: https://localhost
# - API Gateway: https://localhost/api
# - Monitoring: http://localhost:3000
```

## API Endpoints

### Core Services
- `GET /api/health` - System health check
- `GET /api/` - API documentation and service list

### AI Orchestration
- `POST /api/ai/prompt` - Process AI prompts
- `GET /api/ai/status` - AI service status
- `GET /api/ai/analytics` - AI performance metrics

### Employee Management
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee
- `GET /api/employees/statistics/summary` - Employee statistics

### Government Integration
- `GET /api/gosi/status` - GOSI integration status
- `POST /api/gosi/register` - Register employee with GOSI
- `POST /api/gosi/calculate` - Calculate contributions

### Executive Dashboard
- `GET /api/dashboard/metrics` - Strategic metrics
- `GET /api/vision2030/kpis` - Vision 2030 KPIs

## Environment Configuration

### Required Environment Variables

```bash
# AI Configuration
OPENAI_API_KEY=your_openai_api_key

# Government APIs
GOSI_CLIENT_ID=your_gosi_client_id
GOSI_CLIENT_SECRET=your_gosi_client_secret
HRSD_CLIENT_ID=your_hrsd_client_id
HRSD_CLIENT_SECRET=your_hrsd_client_secret
QIWA_CLIENT_ID=your_qiwa_client_id
QIWA_CLIENT_SECRET=your_qiwa_client_secret

# Security
JWT_SECRET_KEY=your_jwt_secret_key
ENCRYPTION_KEY=your_encryption_key
```

### Vercel Environment Setup

1. Copy environment template:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Edit with your configuration:
   ```bash
   nano backend/.env
   ```

3. Deploy with environment variables:
   ```bash
   ./backend/scripts/deploy-vercel.sh env
   ```

## Frontend Integration

### API Client Setup

Add to your frontend environment:

```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-deployment.vercel.app'
    : 'http://localhost:8001',
  ENDPOINTS: {
    AI: '/api/ai',
    EMPLOYEES: '/api/employees',
    DASHBOARD: '/api/dashboard',
    GOSI: '/api/gosi'
  }
};
```

### Example API Usage

```typescript
// src/services/aiService.ts
import axios from 'axios';
import { API_CONFIG } from '../config/api';

export const aiService = {
  async processPrompt(prompt: string, language: string = 'en') {
    const response = await axios.post(`${API_CONFIG.BASE_URL}/api/ai/prompt`, {
      text: prompt,
      language,
      user_id: 'current_user',
      session_id: 'session_123',
      user_role: 'EXECUTIVE'
    });
    return response.data;
  },

  async getStatus() {
    const response = await axios.get(`${API_CONFIG.BASE_URL}/api/ai/status`);
    return response.data;
  }
};
```

## Testing

### Health Check
```bash
curl https://your-backend-deployment.vercel.app/api/health
```

### AI Service Test
```bash
curl -X POST https://your-backend-deployment.vercel.app/api/ai/prompt \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Show me employee statistics",
    "language": "en",
    "user_id": "test_user",
    "session_id": "test_session",
    "user_role": "EXECUTIVE"
  }'
```

## Monitoring and Observability

### Available Metrics
- System health and uptime
- AI processing performance
- Government API integration status
- Employee service statistics

### Monitoring Endpoints
- `/api/health` - Overall system health
- `/api/ai/status` - AI service metrics
- `/api/employees/statistics/summary` - HR metrics

## Security Features

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control (RBAC)
- API rate limiting

### Data Protection
- Encryption at rest and in transit
- GDPR and Saudi data protection compliance
- Audit logging for all operations

### Government Integration Security
- OAuth 2.0 for government APIs
- Secure credential management
- API signature validation

## Scaling Considerations

### Horizontal Scaling
- Microservices architecture supports independent scaling
- Load balancing across service instances
- Database read replicas for high availability

### Performance Optimization
- Redis caching for frequently accessed data
- Async processing for long-running operations
- Connection pooling for database operations

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all dependencies are installed
   ```bash
   pip install -r backend/requirements.txt
   ```

2. **Environment Variables**: Check Vercel environment configuration
   ```bash
   vercel env ls
   ```

3. **API Connectivity**: Verify CORS configuration for frontend integration

### Debug Mode

Enable debug logging:
```bash
export LOG_LEVEL=DEBUG
export ENVIRONMENT=development
```

## Next Steps

1. **Complete Environment Setup**: Configure all government API credentials
2. **Frontend Integration**: Connect existing React components to backend APIs
3. **Data Migration**: Import existing employee data to new system
4. **Testing**: Conduct comprehensive integration testing
5. **Production Deployment**: Deploy to production with monitoring
6. **User Training**: Train administrators on new AI capabilities

## Support

For technical support or questions:
- Check API documentation: `/api/docs`
- Review logs: `vercel logs`
- Monitor health: `/api/health`

The backend 5-layer architecture provides a robust foundation for autonomous AI-powered HR operations while maintaining compatibility with your existing frontend application.

