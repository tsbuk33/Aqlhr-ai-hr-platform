"""
AQLHR Backend API Entry Point for Vercel
========================================

This is the main entry point for the AQLHR backend when deployed on Vercel.
It routes requests to the appropriate layer services.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import sys
import os
from datetime import datetime

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

# Import our services
try:
    from layer2_ai_orchestration.main import app as ai_app
    from layer3_business_logic.hr_microservices.employee_service import app as employee_app
    from layer1_presentation.web_interfaces.executive_dashboard import app as dashboard_app
except ImportError as e:
    print(f"Import error: {e}")
    # Create a minimal app if imports fail
    ai_app = None
    employee_app = None
    dashboard_app = None

# Create main FastAPI app
app = FastAPI(
    title="AQLHR 5-Layer Architecture API",
    description="Unified API for AQLHR HR Platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "AQLHR 5-Layer Architecture",
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "production"),
        "services": {
            "ai_orchestration": "available" if ai_app else "unavailable",
            "employee_service": "available" if employee_app else "unavailable",
            "executive_dashboard": "available" if dashboard_app else "unavailable"
        }
    }

# Root endpoint
@app.get("/")
@app.get("/api")
async def root():
    """Root API endpoint"""
    return {
        "message": "AQLHR 5-Layer Architecture API",
        "version": "1.0.0",
        "documentation": "/api/docs",
        "health": "/api/health",
        "services": {
            "ai": "/api/ai/",
            "employees": "/api/employees/",
            "dashboard": "/dashboard/"
        }
    }

# AI Orchestration routes
@app.get("/api/ai/status")
async def ai_status():
    """Get AI service status"""
    if not ai_app:
        raise HTTPException(status_code=503, detail="AI service unavailable")
    
    return {
        "status": "operational",
        "service": "AI Orchestration Layer",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/ai/prompt")
async def ai_prompt(request: Request):
    """Process AI prompt"""
    if not ai_app:
        raise HTTPException(status_code=503, detail="AI service unavailable")
    
    # For now, return a mock response
    body = await request.json()
    return {
        "request_id": f"req_{int(datetime.now().timestamp())}",
        "status": "processed",
        "result": {
            "response": "AI service is operational and ready to process requests",
            "intent": "system_status",
            "confidence": 0.95
        },
        "processing_time": 0.5,
        "confidence_score": 0.95,
        "next_actions": ["monitor_system", "await_user_input"]
    }

# Employee Service routes
@app.get("/api/employees/statistics/summary")
async def employee_statistics():
    """Get employee statistics"""
    return {
        "total_employees": 0,
        "active_employees": 0,
        "saudi_employees": 0,
        "non_saudi_employees": 0,
        "saudization_rate": 0.0,
        "employees_by_status": {
            "active": 0,
            "inactive": 0,
            "terminated": 0,
            "on_leave": 0,
            "probation": 0
        }
    }

@app.get("/api/employees")
async def list_employees():
    """List employees"""
    return []

# Government Integration routes
@app.get("/api/gosi/status")
async def gosi_status():
    """Get GOSI integration status"""
    return {
        "status": "configured",
        "service": "GOSI Integration",
        "last_sync": datetime.now().isoformat(),
        "connection": "ready"
    }

# Executive Dashboard routes
@app.get("/api/dashboard/metrics")
async def dashboard_metrics():
    """Get dashboard metrics"""
    return {
        "workforce_roi": {
            "current_roi": 146,
            "change_percentage": 15,
            "trend": "increasing"
        },
        "saudization_rate": {
            "current_rate": 64,
            "target_rate": 70,
            "status": "on_track"
        },
        "vision_2030_alignment": 78,
        "system_health": "operational"
    }

# Vision 2030 tracking
@app.get("/api/vision2030/kpis")
async def vision_2030_kpis():
    """Get Vision 2030 KPIs"""
    return {
        "overall_alignment": 78,
        "kpis": {
            "women_participation": {
                "current": 34.2,
                "target": 35,
                "status": "on_track"
            },
            "saudization_rate": {
                "current": 64,
                "target": 70,
                "status": "needs_improvement"
            },
            "digital_transformation": {
                "current": 82,
                "target": 90,
                "status": "on_track"
            },
            "employee_satisfaction": {
                "current": 87,
                "target": 85,
                "status": "exceeding"
            }
        }
    }

# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc),
            "timestamp": datetime.now().isoformat()
        }
    )

# For Vercel deployment
handler = app

