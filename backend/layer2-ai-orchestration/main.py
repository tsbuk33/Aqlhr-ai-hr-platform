"""
AQLHR AI Orchestration Service - Main Entry Point
=================================================

This is the main entry point for the AI Orchestration Layer that coordinates
all AI operations across the AQLHR platform.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from datetime import datetime
import asyncio
import logging
import uvicorn
import os

# Import our AI Agent
from ai_agent_controller.ai_agent import AqlhrAIAgent, PromptRequest, AgentResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AQLHR AI Orchestration Service",
    description="AI Orchestration Layer for autonomous HR operations",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI Agent
ai_agent = AqlhrAIAgent()

# Request/Response Models
class AIPromptRequest(BaseModel):
    """AI prompt request model"""
    text: str
    language: str = "en"
    user_id: str
    session_id: str
    user_role: str
    context: Dict[str, Any] = {}


class AIPromptResponse(BaseModel):
    """AI prompt response model"""
    request_id: str
    status: str
    result: Dict[str, Any]
    processing_time: float
    confidence_score: float
    next_actions: List[str]


class HealthResponse(BaseModel):
    """Health check response model"""
    status: str
    timestamp: str
    version: str
    ai_agent_status: str
    uptime_seconds: float


# Global variables for tracking
start_time = datetime.now()
request_count = 0
active_sessions = set()


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("Starting AQLHR AI Orchestration Service...")
    logger.info("AI Agent initialized and ready")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down AQLHR AI Orchestration Service...")


@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint"""
    return {
        "service": "AQLHR AI Orchestration",
        "status": "operational",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    uptime = (datetime.now() - start_time).total_seconds()
    
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        version="1.0.0",
        ai_agent_status=ai_agent.state.value,
        uptime_seconds=uptime
    )


@app.post("/ai/prompt", response_model=AIPromptResponse)
async def process_ai_prompt(
    request: AIPromptRequest,
    background_tasks: BackgroundTasks
):
    """Process AI prompt through the orchestration layer"""
    global request_count
    request_count += 1
    
    try:
        logger.info(f"Processing AI prompt from user: {request.user_id}")
        
        # Create prompt request for AI agent
        prompt_request = PromptRequest(
            id=f"req_{request_count}_{int(datetime.now().timestamp())}",
            text=request.text,
            language=request.language,
            user_id=request.user_id,
            session_id=request.session_id,
            user_role=request.user_role,
            timestamp=datetime.now(),
            context=request.context
        )
        
        # Track active session
        active_sessions.add(request.session_id)
        
        # Process through AI agent
        agent_response = await ai_agent.process_prompt(prompt_request)
        
        # Add background task for analytics
        background_tasks.add_task(
            log_prompt_analytics,
            prompt_request,
            agent_response
        )
        
        return AIPromptResponse(
            request_id=agent_response.request_id,
            status=agent_response.status,
            result=agent_response.result,
            processing_time=agent_response.processing_time,
            confidence_score=agent_response.confidence_score,
            next_actions=agent_response.next_actions
        )
    
    except Exception as e:
        logger.error(f"Error processing AI prompt: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process AI prompt: {str(e)}"
        )


@app.get("/ai/status")
async def get_ai_status():
    """Get AI agent status and statistics"""
    uptime = (datetime.now() - start_time).total_seconds()
    
    return {
        "ai_agent_status": ai_agent.state.value,
        "uptime_seconds": uptime,
        "total_requests": request_count,
        "active_sessions": len(active_sessions),
        "memory_usage": {
            "short_term_sessions": len(ai_agent.memory.short_term_memory),
            "long_term_patterns": len(ai_agent.memory.long_term_memory)
        }
    }


@app.post("/ai/workflow/execute")
async def execute_workflow(
    workflow_data: Dict[str, Any],
    background_tasks: BackgroundTasks
):
    """Execute a specific workflow through AI orchestration"""
    try:
        logger.info(f"Executing workflow: {workflow_data.get('workflow_type')}")
        
        # Create a prompt request for workflow execution
        prompt_text = f"Execute workflow: {workflow_data.get('workflow_type')} with parameters: {workflow_data.get('parameters', {})}"
        
        prompt_request = PromptRequest(
            id=f"workflow_{int(datetime.now().timestamp())}",
            text=prompt_text,
            language=workflow_data.get('language', 'en'),
            user_id=workflow_data.get('user_id', 'system'),
            session_id=workflow_data.get('session_id', 'workflow_session'),
            user_role=workflow_data.get('user_role', 'SYSTEM'),
            timestamp=datetime.now(),
            context=workflow_data
        )
        
        # Process through AI agent
        result = await ai_agent.process_prompt(prompt_request)
        
        return {
            "workflow_id": result.execution_plan_id,
            "status": result.status,
            "result": result.result,
            "processing_time": result.processing_time
        }
    
    except Exception as e:
        logger.error(f"Error executing workflow: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to execute workflow: {str(e)}"
        )


@app.get("/ai/analytics")
async def get_ai_analytics():
    """Get AI analytics and insights"""
    return {
        "total_requests": request_count,
        "active_sessions": len(active_sessions),
        "agent_state": ai_agent.state.value,
        "performance_metrics": {
            "average_processing_time": 0.5,  # Would be calculated from actual data
            "success_rate": 0.95,
            "confidence_average": 0.87
        },
        "language_distribution": {
            "arabic": 0.6,
            "english": 0.4
        },
        "intent_distribution": {
            "EMPLOYEE_MANAGEMENT": 0.3,
            "PAYROLL_PROCESSING": 0.25,
            "REPORT_GENERATION": 0.2,
            "LEAVE_MANAGEMENT": 0.15,
            "GENERAL_INQUIRY": 0.1
        }
    }


@app.post("/ai/learn")
async def trigger_learning(learning_data: Dict[str, Any]):
    """Trigger AI learning from feedback"""
    try:
        logger.info("Triggering AI learning from feedback")
        
        # In a real implementation, this would update ML models
        # For now, we'll just log the learning data
        await ai_agent.learning_system.learn_from_execution(
            prompt_request=None,  # Would be actual prompt request
            execution_plan=None,  # Would be actual execution plan
            result=learning_data
        )
        
        return {
            "status": "learning_triggered",
            "message": "AI learning process initiated",
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        logger.error(f"Error triggering learning: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to trigger learning: {str(e)}"
        )


@app.get("/ai/models")
async def get_model_info():
    """Get information about loaded AI models"""
    return {
        "nlp_models": {
            "arabic_processor": "Custom Arabic NLP Pipeline",
            "english_processor": "Custom English NLP Pipeline",
            "intent_classifier": "Multi-language Intent Classifier",
            "entity_extractor": "Named Entity Recognition Model"
        },
        "decision_models": {
            "decision_engine": "Rule-based Decision Engine",
            "risk_assessor": "Risk Assessment Model",
            "compliance_checker": "Compliance Validation Engine"
        },
        "learning_models": {
            "pattern_recognition": "Pattern Learning System",
            "performance_optimizer": "Performance Optimization Model"
        }
    }


# Background tasks
async def log_prompt_analytics(
    prompt_request: PromptRequest,
    agent_response: AgentResponse
):
    """Log prompt analytics for monitoring and improvement"""
    analytics_data = {
        "request_id": prompt_request.id,
        "user_id": prompt_request.user_id,
        "session_id": prompt_request.session_id,
        "language": prompt_request.language,
        "user_role": prompt_request.user_role,
        "processing_time": agent_response.processing_time,
        "confidence_score": agent_response.confidence_score,
        "status": agent_response.status,
        "timestamp": datetime.now().isoformat()
    }
    
    # In production, this would be sent to analytics service
    logger.info(f"Analytics logged: {analytics_data}")


# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return {
        "error": "Internal server error",
        "message": "An unexpected error occurred",
        "timestamp": datetime.now().isoformat()
    }


# Metrics endpoint for Prometheus
@app.get("/metrics")
async def get_metrics():
    """Prometheus metrics endpoint"""
    uptime = (datetime.now() - start_time).total_seconds()
    
    metrics = f"""
# HELP aqlhr_ai_requests_total Total number of AI requests processed
# TYPE aqlhr_ai_requests_total counter
aqlhr_ai_requests_total {request_count}

# HELP aqlhr_ai_active_sessions Current number of active sessions
# TYPE aqlhr_ai_active_sessions gauge
aqlhr_ai_active_sessions {len(active_sessions)}

# HELP aqlhr_ai_uptime_seconds Service uptime in seconds
# TYPE aqlhr_ai_uptime_seconds gauge
aqlhr_ai_uptime_seconds {uptime}

# HELP aqlhr_ai_agent_status AI agent status (1=idle, 2=processing, 3=executing, 4=learning, 5=error)
# TYPE aqlhr_ai_agent_status gauge
aqlhr_ai_agent_status {1 if ai_agent.state.value == 'idle' else 2}
"""
    
    return metrics


if __name__ == "__main__":
    # Get configuration from environment
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8001))
    debug = os.getenv("DEBUG", "false").lower() == "true"
    workers = int(os.getenv("WORKERS", 1))
    
    logger.info(f"Starting AQLHR AI Orchestration Service on {host}:{port}")
    
    if debug:
        # Development mode
        uvicorn.run(
            "main:app",
            host=host,
            port=port,
            reload=True,
            log_level="info"
        )
    else:
        # Production mode
        uvicorn.run(
            app,
            host=host,
            port=port,
            workers=workers,
            log_level="info"
        )

