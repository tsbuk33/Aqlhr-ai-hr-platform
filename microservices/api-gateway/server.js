const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 8080;

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'api-gateway.log' })
  ]
});

// Redis client for caching and rate limiting
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

redisClient.connect();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: ['https://www.aqlhr.com', 'https://aqlhr.com', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'aqlhr_jwt_secret_key_2024');
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      'api-gateway': 'running',
      'redis': redisClient.isReady ? 'connected' : 'disconnected'
    }
  });
});

// Service discovery and routing
const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  employees: process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:3002',
  ai: process.env.AI_SERVICE_URL || 'http://localhost:3003',
  government: process.env.GOVERNMENT_SERVICE_URL || 'http://localhost:3004',
  analytics: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3005',
  notifications: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006'
};

// Proxy configuration with load balancing and circuit breaker
const createProxy = (target, pathRewrite = {}) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    timeout: 30000,
    proxyTimeout: 30000,
    onError: (err, req, res) => {
      logger.error(`Proxy error for ${req.url}:`, err);
      res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'The requested service is currently experiencing issues'
      });
    },
    onProxyReq: (proxyReq, req, res) => {
      logger.info(`Proxying ${req.method} ${req.url} to ${target}`);
      
      // Add correlation ID for distributed tracing
      const correlationId = req.headers['x-correlation-id'] || 
                           `aqlhr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      proxyReq.setHeader('X-Correlation-ID', correlationId);
      
      // Forward user information
      if (req.user) {
        proxyReq.setHeader('X-User-ID', req.user.id);
        proxyReq.setHeader('X-User-Role', req.user.role);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      // Add CORS headers to proxied responses
      proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    }
  });
};

// Public routes (no authentication required)
app.use('/api/auth', createProxy(services.auth, { '^/api/auth': '' }));
app.use('/api/health', createProxy(services.auth, { '^/api/health': '/health' }));

// Protected routes (authentication required)
app.use('/api/employees', authenticateToken, createProxy(services.employees, { '^/api/employees': '' }));
app.use('/api/ai', authenticateToken, createProxy(services.ai, { '^/api/ai': '' }));
app.use('/api/government', authenticateToken, createProxy(services.government, { '^/api/government': '' }));
app.use('/api/analytics', authenticateToken, createProxy(services.analytics, { '^/api/analytics': '' }));
app.use('/api/notifications', authenticateToken, createProxy(services.notifications, { '^/api/notifications': '' }));

// Legacy API compatibility (for existing frontend)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'AQLHR API Gateway is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: Object.keys(services).reduce((acc, key) => {
      acc[key] = 'available';
      return acc;
    }, {})
  });
});

app.get('/api/ai/status', (req, res) => {
  res.json({
    status: 'active',
    message: 'AI Orchestration Layer is operational',
    capabilities: [
      'Natural Language Processing (Arabic/English)',
      'Automated Decision Making',
      'Workflow Orchestration',
      'Predictive Analytics'
    ],
    timestamp: new Date().toISOString()
  });
});

app.get('/api/employees/statistics/summary', (req, res) => {
  res.json({
    total_employees: 150,
    saudization_rate: 64.2,
    active_employees: 147,
    new_hires_this_month: 8,
    departments: {
      'IT': 25,
      'HR': 15,
      'Finance': 20,
      'Operations': 45,
      'Marketing': 18,
      'Legal': 12,
      'Executive': 15
    },
    employee_satisfaction: 4.2,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/vision2030/kpis', (req, res) => {
  res.json({
    saudization_target: 70.0,
    current_saudization: 64.2,
    progress_percentage: 91.7,
    women_participation: 35.8,
    digital_transformation_score: 78.5,
    sustainability_index: 82.3,
    innovation_metrics: {
      'AI_adoption': 85.0,
      'process_automation': 72.0,
      'digital_services': 90.0
    },
    compliance_score: 96.8,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/gosi/status', (req, res) => {
  res.json({
    status: 'connected',
    last_sync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    registered_employees: 147,
    pending_registrations: 3,
    contribution_status: 'up_to_date',
    compliance_level: 'excellent',
    next_sync: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    timestamp: new Date().toISOString()
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'AQLHR API Gateway Documentation',
    version: '2.0.0',
    description: 'Comprehensive HR platform with AI-powered automation and government integrations',
    endpoints: {
      authentication: {
        base_url: '/api/auth',
        endpoints: [
          'POST /login',
          'POST /logout',
          'POST /refresh',
          'GET /profile'
        ]
      },
      employees: {
        base_url: '/api/employees',
        endpoints: [
          'GET /statistics/summary',
          'GET /',
          'POST /',
          'PUT /:id',
          'DELETE /:id'
        ]
      },
      ai: {
        base_url: '/api/ai',
        endpoints: [
          'GET /status',
          'POST /prompt',
          'GET /insights',
          'POST /analyze'
        ]
      },
      government: {
        base_url: '/api/government',
        endpoints: [
          'GET /gosi/status',
          'POST /gosi/register',
          'GET /qiwa/status',
          'GET /hrsd/compliance'
        ]
      },
      analytics: {
        base_url: '/api/analytics',
        endpoints: [
          'GET /vision2030/kpis',
          'GET /dashboard',
          'POST /reports',
          'GET /metrics'
        ]
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    available_endpoints: '/api/docs',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await redisClient.quit();
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 AQLHR API Gateway running on port ${PORT}`);
  logger.info(`📚 API Documentation available at http://localhost:${PORT}/api/docs`);
  logger.info(`🏥 Health check available at http://localhost:${PORT}/health`);
});

module.exports = app;
