/**
 * AQLHR Backend API - Main Entry Point
 * ===================================
 * 
 * Vercel serverless function for AQLHR 5-layer architecture
 * Deployed at: https://api.aqlhr.com
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method } = req;
  const timestamp = new Date().toISOString();

  // Root API endpoint
  if (url === '/' || url === '/api' || url === '/api/') {
    return res.status(200).json({
      message: "AQLHR 5-Layer Architecture API",
      version: "1.0.0",
      timestamp,
      environment: process.env.ENVIRONMENT || 'production',
      frontend_url: process.env.FRONTEND_URL || 'https://www.aqlhr.com',
      api_url: process.env.API_URL || 'https://api.aqlhr.com',
      documentation: {
        health: "/api/health",
        ai: "/api/ai/",
        employees: "/api/employees/",
        dashboard: "/api/dashboard/",
        vision2030: "/api/vision2030/",
        government: {
          gosi: "/api/gosi/",
          hrsd: "/api/hrsd/",
          qiwa: "/api/qiwa/"
        }
      },
      services: {
        ai_orchestration: "available",
        employee_management: "available", 
        executive_dashboard: "available",
        government_integration: "available",
        vision_2030_tracking: "available"
      },
      architecture: {
        layer1: "Presentation Layer - API Gateway",
        layer2: "AI Orchestration Layer - Autonomous Intelligence",
        layer3: "Business Logic Layer - HR Microservices",
        layer4: "Integration Layer - Government Connectors",
        layer5: "Data Layer - Analytics & Storage"
      }
    });
  }

  // Handle unknown routes
  return res.status(404).json({
    error: "Endpoint not found",
    message: `The endpoint ${url} does not exist`,
    timestamp,
    available_endpoints: [
      "/api/health",
      "/api/ai/",
      "/api/employees/",
      "/api/dashboard/",
      "/api/vision2030/",
      "/api/gosi/",
      "/api/hrsd/",
      "/api/qiwa/"
    ]
  });
}

