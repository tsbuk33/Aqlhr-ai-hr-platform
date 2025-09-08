# AQLHR Backend Integration Guide
## Deploying Security-Hardened Backend to api.aqlhr.com

### Overview
This guide outlines the steps to deploy the security-hardened AQLHR backend to your production domain at `api.aqlhr.com`.

### Current Status
✅ **Security Features Implemented:**
- Comprehensive security middleware with rate limiting (60 req/min)
- Security headers (X-Frame-Options, X-XSS-Protection, HSTS, CSP)
- Input validation against SQL injection, XSS, and command injection
- Authentication and authorization framework
- Audit logging and CSRF protection
- Docker containerization ready

✅ **5-Layer Architecture:**
- Layer 1: Presentation Layer with API Gateway
- Layer 2: AI Orchestration with Arabic/English NLP
- Layer 3: Business Logic with HR microservices
- Layer 4: Integration Layer with government connectors
- Layer 5: Data Layer with analytics and storage

### Deployment Options for api.aqlhr.com

#### Option 1: Vercel Deployment (Recommended)
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy backend
cd aqlhr-backend-production
vercel --prod

# 3. Configure custom domain
# In Vercel dashboard: Add domain api.aqlhr.com
```

#### Option 2: AWS ECS Deployment
```bash
# 1. Build and push Docker image
docker build -t aqlhr-backend .
docker tag aqlhr-backend:latest your-ecr-repo/aqlhr-backend:latest
docker push your-ecr-repo/aqlhr-backend:latest

# 2. Deploy to ECS using Terraform
cd ../aqlhr-infrastructure
terraform apply -var="environment=prod"
```

#### Option 3: Direct Server Deployment
```bash
# 1. Set up production server
# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment variables
export FLASK_ENV=production
export DATABASE_URL=your-production-db-url
export REDIS_URL=your-redis-url

# 4. Run with Gunicorn
gunicorn --bind 0.0.0.0:5000 --workers 4 src.main:app
```

### Environment Variables Required
```bash
# Security
JWT_SECRET_KEY=your-jwt-secret-key
CSRF_SECRET_KEY=your-csrf-secret-key

# Database
DATABASE_URL=postgresql://user:pass@host:port/dbname
REDIS_URL=redis://host:port/0

# CORS
CORS_ORIGINS=https://www.aqlhr.com,https://aqlhr.com

# Government APIs
GOSI_API_KEY=your-gosi-api-key
HRSD_API_KEY=your-hrsd-api-key
QIWA_API_KEY=your-qiwa-api-key
ABSHER_API_KEY=your-absher-api-key

# AI/ML
OPENAI_API_KEY=your-openai-api-key
```

### DNS Configuration
```
# Add CNAME record for api.aqlhr.com
api.aqlhr.com CNAME your-deployment-url
```

### SSL Certificate
- Automatic SSL via Vercel/CloudFlare
- Or use Let's Encrypt for custom deployments

### Frontend Integration
Update your React frontend to use the new backend:

```typescript
// src/config/api.ts
export const API_BASE_URL = 'https://api.aqlhr.com';

// Update all API calls
const response = await fetch(`${API_BASE_URL}/api/health`);
```

### Testing Checklist
- [ ] Health endpoint: `GET /api/health`
- [ ] Security headers present
- [ ] Rate limiting functional
- [ ] CORS configured for www.aqlhr.com
- [ ] All 5-layer endpoints working
- [ ] SSL certificate valid
- [ ] Performance under load

### Monitoring
- Set up CloudWatch/Grafana dashboards
- Configure alerts for errors and performance
- Monitor security events and rate limiting

### Next Steps
1. Choose deployment option
2. Configure environment variables
3. Set up DNS and SSL
4. Deploy backend
5. Update frontend configuration
6. Run integration tests
7. Monitor and optimize

### Support
For deployment assistance or issues, refer to the security audit report and implementation documentation.

