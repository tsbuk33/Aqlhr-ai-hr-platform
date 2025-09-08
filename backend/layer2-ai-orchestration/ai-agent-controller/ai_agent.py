"""
AQLHR AI Agent Controller - Master Brain
========================================

This module implements the core AI Agent Controller that serves as the master brain
for the AQLHR platform, handling natural language prompts and orchestrating
autonomous workflows across the entire system.
"""

import asyncio
import logging
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass
import uuid
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AgentState(Enum):
    """Agent operational states"""
    IDLE = "idle"
    PROCESSING = "processing"
    EXECUTING = "executing"
    LEARNING = "learning"
    ERROR = "error"


@dataclass
class PromptRequest:
    """User prompt request structure"""
    id: str
    text: str
    language: str
    user_id: str
    session_id: str
    user_role: str
    timestamp: datetime
    context: Dict[str, Any]


@dataclass
class AgentContext:
    """Agent processing context"""
    recent_interactions: List[Dict]
    relevant_patterns: List[Dict]
    current_session: str
    user_profile: Dict[str, Any]
    system_state: Dict[str, Any]


@dataclass
class ProcessedPrompt:
    """Processed prompt with extracted information"""
    original_text: str
    normalized_text: str
    intent: str
    entities: List[Dict]
    confidence_score: float
    language: str
    business_terms: Dict[str, str]


@dataclass
class Task:
    """Individual task in execution plan"""
    id: str
    name: str
    type: str
    parameters: Dict[str, Any]
    dependencies: List[str]
    estimated_duration: int
    priority: int
    resource_requirements: Dict[str, Any]


@dataclass
class ExecutionPlan:
    """Comprehensive execution plan for prompt"""
    id: str
    tasks: List[Task]
    dependencies: Dict[str, List[str]]
    execution_order: List[str]
    resource_allocation: Dict[str, Any]
    estimated_duration: int
    complexity_score: float
    confidence_level: float


@dataclass
class AgentResponse:
    """Agent response to user prompt"""
    request_id: str
    status: str
    result: Dict[str, Any]
    execution_plan_id: str
    processing_time: float
    confidence_score: float
    next_actions: List[str]


class AgentMemory:
    """Agent memory management system"""
    
    def __init__(self):
        self.short_term_memory = {}
        self.long_term_memory = {}
        self.working_memory = {}
        
    async def store_prompt(self, prompt_request: PromptRequest, context: AgentContext) -> None:
        """Store prompt and context in appropriate memory systems"""
        # Store in short-term memory for immediate access
        memory_entry = {
            'prompt': prompt_request,
            'context': context,
            'timestamp': datetime.now(),
            'session_id': prompt_request.session_id
        }
        
        session_key = f"session_{prompt_request.session_id}"
        if session_key not in self.short_term_memory:
            self.short_term_memory[session_key] = []
        
        self.short_term_memory[session_key].append(memory_entry)
        
        # Keep only last 10 interactions per session
        if len(self.short_term_memory[session_key]) > 10:
            self.short_term_memory[session_key] = self.short_term_memory[session_key][-10:]
        
        # Extract patterns for long-term memory
        patterns = await self.extract_patterns(prompt_request, context)
        await self.store_patterns(patterns)
        
        logger.info(f"Stored prompt in memory: {prompt_request.id}")
    
    async def extract_patterns(self, prompt_request: PromptRequest, context: AgentContext) -> List[Dict]:
        """Extract patterns from prompt and context for learning"""
        patterns = []
        
        # Pattern: User role + intent combination
        if hasattr(prompt_request, 'intent'):
            patterns.append({
                'type': 'role_intent_pattern',
                'user_role': prompt_request.user_role,
                'intent': getattr(prompt_request, 'intent', 'unknown'),
                'frequency': 1,
                'success_rate': 1.0
            })
        
        # Pattern: Language preference
        patterns.append({
            'type': 'language_preference',
            'user_id': prompt_request.user_id,
            'language': prompt_request.language,
            'timestamp': prompt_request.timestamp
        })
        
        return patterns
    
    async def store_patterns(self, patterns: List[Dict]) -> None:
        """Store patterns in long-term memory"""
        for pattern in patterns:
            pattern_key = f"{pattern['type']}_{pattern.get('user_role', 'global')}"
            
            if pattern_key not in self.long_term_memory:
                self.long_term_memory[pattern_key] = []
            
            self.long_term_memory[pattern_key].append(pattern)
        
        logger.info(f"Stored {len(patterns)} patterns in long-term memory")
    
    async def retrieve_relevant_context(self, current_prompt: PromptRequest) -> AgentContext:
        """Retrieve relevant context from memory systems"""
        # Get recent interactions from short-term memory
        session_key = f"session_{current_prompt.session_id}"
        recent_interactions = self.short_term_memory.get(session_key, [])
        
        # Get relevant patterns from long-term memory
        relevant_patterns = []
        for pattern_key, patterns in self.long_term_memory.items():
            if current_prompt.user_role in pattern_key or 'global' in pattern_key:
                relevant_patterns.extend(patterns[-5:])  # Last 5 patterns
        
        # Build user profile
        user_profile = await self.build_user_profile(current_prompt.user_id)
        
        return AgentContext(
            recent_interactions=recent_interactions,
            relevant_patterns=relevant_patterns,
            current_session=current_prompt.session_id,
            user_profile=user_profile,
            system_state={}
        )
    
    async def build_user_profile(self, user_id: str) -> Dict[str, Any]:
        """Build user profile from memory"""
        return {
            'user_id': user_id,
            'preferences': {},
            'interaction_history': [],
            'success_patterns': []
        }


class NLPEngine:
    """Natural Language Processing Engine"""
    
    def __init__(self):
        self.arabic_processor = ArabicNLPProcessor()
        self.english_processor = EnglishNLPProcessor()
    
    async def process(self, text: str, language: str, context: AgentContext) -> ProcessedPrompt:
        """Process natural language text"""
        processor = self.arabic_processor if language == 'ar' else self.english_processor
        
        # Normalize text
        normalized_text = await processor.normalize_text(text)
        
        # Extract intent
        intent = await processor.extract_intent(normalized_text, context)
        
        # Extract entities
        entities = await processor.extract_entities(normalized_text)
        
        # Map business terms
        business_terms = await processor.map_business_terms(entities)
        
        # Calculate confidence
        confidence_score = await processor.calculate_confidence(intent, entities)
        
        return ProcessedPrompt(
            original_text=text,
            normalized_text=normalized_text,
            intent=intent,
            entities=entities,
            confidence_score=confidence_score,
            language=language,
            business_terms=business_terms
        )


class ArabicNLPProcessor:
    """Arabic language processing"""
    
    async def normalize_text(self, text: str) -> str:
        """Normalize Arabic text"""
        # Remove diacritics, normalize letters, etc.
        normalized = text.strip()
        # Add more sophisticated Arabic normalization here
        return normalized
    
    async def extract_intent(self, text: str, context: AgentContext) -> str:
        """Extract intent from Arabic text"""
        # Simplified intent extraction - in production, use trained models
        if 'موظف' in text or 'تعيين' in text:
            return 'EMPLOYEE_MANAGEMENT'
        elif 'راتب' in text or 'مرتب' in text:
            return 'PAYROLL_PROCESSING'
        elif 'تقرير' in text:
            return 'REPORT_GENERATION'
        elif 'إجازة' in text:
            return 'LEAVE_MANAGEMENT'
        else:
            return 'GENERAL_INQUIRY'
    
    async def extract_entities(self, text: str) -> List[Dict]:
        """Extract entities from Arabic text"""
        entities = []
        # Simplified entity extraction
        words = text.split()
        for word in words:
            if word.isdigit():
                entities.append({'type': 'NUMBER', 'value': word, 'text': word})
        return entities
    
    async def map_business_terms(self, entities: List[Dict]) -> Dict[str, str]:
        """Map Arabic business terms to system concepts"""
        business_mapping = {
            'موظف': 'employee',
            'راتب': 'salary',
            'تقرير': 'report',
            'إجازة': 'leave',
            'تعيين': 'hiring'
        }
        return business_mapping
    
    async def calculate_confidence(self, intent: str, entities: List[Dict]) -> float:
        """Calculate confidence score"""
        base_confidence = 0.8
        if entities:
            base_confidence += 0.1
        if intent != 'GENERAL_INQUIRY':
            base_confidence += 0.1
        return min(base_confidence, 1.0)


class EnglishNLPProcessor:
    """English language processing"""
    
    async def normalize_text(self, text: str) -> str:
        """Normalize English text"""
        return text.strip().lower()
    
    async def extract_intent(self, text: str, context: AgentContext) -> str:
        """Extract intent from English text"""
        if 'employee' in text or 'hire' in text:
            return 'EMPLOYEE_MANAGEMENT'
        elif 'salary' in text or 'payroll' in text:
            return 'PAYROLL_PROCESSING'
        elif 'report' in text:
            return 'REPORT_GENERATION'
        elif 'leave' in text or 'vacation' in text:
            return 'LEAVE_MANAGEMENT'
        else:
            return 'GENERAL_INQUIRY'
    
    async def extract_entities(self, text: str) -> List[Dict]:
        """Extract entities from English text"""
        entities = []
        words = text.split()
        for word in words:
            if word.isdigit():
                entities.append({'type': 'NUMBER', 'value': word, 'text': word})
        return entities
    
    async def map_business_terms(self, entities: List[Dict]) -> Dict[str, str]:
        """Map English business terms to system concepts"""
        return {}  # Already in English
    
    async def calculate_confidence(self, intent: str, entities: List[Dict]) -> float:
        """Calculate confidence score"""
        base_confidence = 0.8
        if entities:
            base_confidence += 0.1
        if intent != 'GENERAL_INQUIRY':
            base_confidence += 0.1
        return min(base_confidence, 1.0)


class DecisionEngine:
    """Autonomous decision making engine"""
    
    async def make_decision(self, decision_context: Dict[str, Any]) -> Dict[str, Any]:
        """Make autonomous decisions using multi-factor analysis"""
        # Simplified decision making - in production, use ML models
        decision = {
            'action': 'PROCEED',
            'confidence': 0.9,
            'reasoning': 'Based on context analysis',
            'risk_level': 'LOW'
        }
        return decision


class WorkflowOrchestrator:
    """Workflow orchestration engine"""
    
    async def execute(self, execution_plan: ExecutionPlan) -> Dict[str, Any]:
        """Execute workflow based on execution plan"""
        logger.info(f"Executing workflow plan: {execution_plan.id}")
        
        results = {}
        
        # Execute tasks in order
        for task_id in execution_plan.execution_order:
            task = next(t for t in execution_plan.tasks if t.id == task_id)
            
            logger.info(f"Executing task: {task.name}")
            
            # Simulate task execution
            await asyncio.sleep(0.1)  # Simulate processing time
            
            results[task_id] = {
                'status': 'COMPLETED',
                'result': f"Task {task.name} completed successfully",
                'execution_time': 0.1
            }
        
        return {
            'plan_id': execution_plan.id,
            'status': 'COMPLETED',
            'task_results': results,
            'total_execution_time': sum(r['execution_time'] for r in results.values())
        }


class LearningSystem:
    """AI learning and improvement system"""
    
    async def learn_from_execution(
        self,
        prompt_request: PromptRequest,
        execution_plan: ExecutionPlan,
        result: Dict[str, Any]
    ) -> None:
        """Learn from execution results to improve future performance"""
        logger.info(f"Learning from execution: {execution_plan.id}")
        
        # Analyze execution success
        success_rate = 1.0 if result['status'] == 'COMPLETED' else 0.0
        
        # Store learning data
        learning_data = {
            'prompt_intent': getattr(prompt_request, 'intent', 'unknown'),
            'execution_plan_complexity': execution_plan.complexity_score,
            'success_rate': success_rate,
            'execution_time': result.get('total_execution_time', 0),
            'timestamp': datetime.now()
        }
        
        # In production, this would update ML models
        logger.info(f"Stored learning data: {learning_data}")


class ContextManager:
    """Context management for AI processing"""
    
    async def build_context(self, prompt_request: PromptRequest) -> AgentContext:
        """Build comprehensive context for prompt processing"""
        return AgentContext(
            recent_interactions=[],
            relevant_patterns=[],
            current_session=prompt_request.session_id,
            user_profile={'user_id': prompt_request.user_id},
            system_state={}
        )


class AqlhrAIAgent:
    """Main AI Agent Controller - Master Brain of AQLHR Platform"""
    
    def __init__(self):
        self.state = AgentState.IDLE
        self.memory = AgentMemory()
        self.nlp_engine = NLPEngine()
        self.decision_engine = DecisionEngine()
        self.workflow_orchestrator = WorkflowOrchestrator()
        self.learning_system = LearningSystem()
        self.context_manager = ContextManager()
        
        logger.info("AQLHR AI Agent initialized successfully")
    
    async def process_prompt(self, prompt_request: PromptRequest) -> AgentResponse:
        """
        Main entry point for processing natural language prompts
        """
        try:
            # Update agent state
            self.state = AgentState.PROCESSING
            start_time = datetime.now()
            
            logger.info(f"Processing prompt: {prompt_request.id}")
            
            # Store prompt in memory with context
            context = await self.context_manager.build_context(prompt_request)
            await self.memory.store_prompt(prompt_request, context)
            
            # Process the prompt through NLP pipeline
            processed_prompt = await self.nlp_engine.process(
                prompt_request.text,
                prompt_request.language,
                context
            )
            
            # Generate execution plan
            execution_plan = await self.generate_execution_plan(
                processed_prompt,
                context
            )
            
            # Execute autonomous workflow
            self.state = AgentState.EXECUTING
            result = await self.workflow_orchestrator.execute(execution_plan)
            
            # Learn from execution
            self.state = AgentState.LEARNING
            await self.learning_system.learn_from_execution(
                prompt_request,
                execution_plan,
                result
            )
            
            # Calculate processing time
            processing_time = (datetime.now() - start_time).total_seconds()
            
            # Update state and return response
            self.state = AgentState.IDLE
            
            response = AgentResponse(
                request_id=prompt_request.id,
                status='COMPLETED',
                result=result,
                execution_plan_id=execution_plan.id,
                processing_time=processing_time,
                confidence_score=processed_prompt.confidence_score,
                next_actions=[]
            )
            
            logger.info(f"Prompt processed successfully: {prompt_request.id}")
            return response
            
        except Exception as e:
            await self.handle_error(e, prompt_request)
            raise
    
    async def generate_execution_plan(
        self,
        processed_prompt: ProcessedPrompt,
        context: AgentContext
    ) -> ExecutionPlan:
        """Generate a comprehensive execution plan for the prompt"""
        
        # Analyze prompt complexity
        complexity = await self.analyze_complexity(processed_prompt)
        
        # Decompose into tasks
        tasks = await self.decompose_into_tasks(processed_prompt, context)
        
        # Determine dependencies
        dependencies = await self.analyze_dependencies(tasks)
        
        # Optimize execution order
        execution_order = await self.optimize_execution_order(tasks, dependencies)
        
        # Allocate resources
        resource_allocation = await self.allocate_resources(tasks)
        
        # Estimate duration
        estimated_duration = await self.estimate_duration(tasks)
        
        execution_plan = ExecutionPlan(
            id=str(uuid.uuid4()),
            tasks=tasks,
            dependencies=dependencies,
            execution_order=execution_order,
            resource_allocation=resource_allocation,
            estimated_duration=estimated_duration,
            complexity_score=complexity['score'],
            confidence_level=complexity['confidence']
        )
        
        logger.info(f"Generated execution plan: {execution_plan.id}")
        return execution_plan
    
    async def analyze_complexity(self, processed_prompt: ProcessedPrompt) -> Dict[str, float]:
        """Analyze prompt complexity"""
        base_complexity = 0.5
        
        # Increase complexity based on intent
        if processed_prompt.intent in ['EMPLOYEE_MANAGEMENT', 'PAYROLL_PROCESSING']:
            base_complexity += 0.3
        
        # Increase complexity based on entities
        if len(processed_prompt.entities) > 3:
            base_complexity += 0.2
        
        return {
            'score': min(base_complexity, 1.0),
            'confidence': processed_prompt.confidence_score
        }
    
    async def decompose_into_tasks(
        self,
        processed_prompt: ProcessedPrompt,
        context: AgentContext
    ) -> List[Task]:
        """Break down complex prompts into executable tasks"""
        tasks = []
        
        # Create tasks based on intent
        if processed_prompt.intent == 'EMPLOYEE_MANAGEMENT':
            tasks.append(Task(
                id=str(uuid.uuid4()),
                name="Validate Employee Data",
                type="VALIDATION",
                parameters={'data_type': 'employee'},
                dependencies=[],
                estimated_duration=30,
                priority=1,
                resource_requirements={'cpu': 'low', 'memory': 'low'}
            ))
            
            tasks.append(Task(
                id=str(uuid.uuid4()),
                name="Process Employee Request",
                type="PROCESSING",
                parameters={'request_type': 'employee_management'},
                dependencies=[tasks[0].id] if tasks else [],
                estimated_duration=60,
                priority=2,
                resource_requirements={'cpu': 'medium', 'memory': 'medium'}
            ))
        
        elif processed_prompt.intent == 'REPORT_GENERATION':
            tasks.append(Task(
                id=str(uuid.uuid4()),
                name="Generate Report",
                type="REPORT",
                parameters={'report_type': 'standard'},
                dependencies=[],
                estimated_duration=45,
                priority=1,
                resource_requirements={'cpu': 'medium', 'memory': 'high'}
            ))
        
        else:
            # Default task for general inquiries
            tasks.append(Task(
                id=str(uuid.uuid4()),
                name="Process General Inquiry",
                type="GENERAL",
                parameters={'inquiry_type': 'general'},
                dependencies=[],
                estimated_duration=15,
                priority=1,
                resource_requirements={'cpu': 'low', 'memory': 'low'}
            ))
        
        return tasks
    
    async def analyze_dependencies(self, tasks: List[Task]) -> Dict[str, List[str]]:
        """Analyze task dependencies"""
        dependencies = {}
        for task in tasks:
            dependencies[task.id] = task.dependencies
        return dependencies
    
    async def optimize_execution_order(
        self,
        tasks: List[Task],
        dependencies: Dict[str, List[str]]
    ) -> List[str]:
        """Optimize task execution order"""
        # Simple topological sort for task ordering
        execution_order = []
        remaining_tasks = {task.id: task for task in tasks}
        
        while remaining_tasks:
            # Find tasks with no dependencies
            ready_tasks = [
                task_id for task_id, deps in dependencies.items()
                if task_id in remaining_tasks and not deps
            ]
            
            if not ready_tasks:
                # If no ready tasks, pick the highest priority one
                ready_tasks = [min(remaining_tasks.keys())]
            
            # Sort by priority
            ready_tasks.sort(key=lambda tid: remaining_tasks[tid].priority)
            
            # Add first ready task to execution order
            next_task = ready_tasks[0]
            execution_order.append(next_task)
            
            # Remove from remaining tasks
            del remaining_tasks[next_task]
            
            # Remove this task from other dependencies
            for deps in dependencies.values():
                if next_task in deps:
                    deps.remove(next_task)
        
        return execution_order
    
    async def allocate_resources(self, tasks: List[Task]) -> Dict[str, Any]:
        """Allocate resources for task execution"""
        return {
            'cpu_allocation': 'auto',
            'memory_allocation': 'auto',
            'storage_allocation': 'auto',
            'network_allocation': 'auto'
        }
    
    async def estimate_duration(self, tasks: List[Task]) -> int:
        """Estimate total execution duration"""
        return sum(task.estimated_duration for task in tasks)
    
    async def handle_error(self, error: Exception, prompt_request: PromptRequest) -> None:
        """Handle errors during processing"""
        self.state = AgentState.ERROR
        logger.error(f"Error processing prompt {prompt_request.id}: {str(error)}")
        
        # In production, implement error recovery and notification
        self.state = AgentState.IDLE
    
    def format_response(self, result: Dict[str, Any], context: AgentContext) -> AgentResponse:
        """Format the final response"""
        return AgentResponse(
            request_id=str(uuid.uuid4()),
            status=result.get('status', 'COMPLETED'),
            result=result,
            execution_plan_id=result.get('plan_id', ''),
            processing_time=result.get('total_execution_time', 0),
            confidence_score=0.9,
            next_actions=[]
        )


# Example usage and testing
async def main():
    """Example usage of the AI Agent"""
    agent = AqlhrAIAgent()
    
    # Example Arabic prompt
    arabic_prompt = PromptRequest(
        id=str(uuid.uuid4()),
        text="أريد إنشاء تقرير عن الموظفين الجدد",
        language="ar",
        user_id="user123",
        session_id="session456",
        user_role="HR_PROFESSIONAL",
        timestamp=datetime.now(),
        context={}
    )
    
    # Example English prompt
    english_prompt = PromptRequest(
        id=str(uuid.uuid4()),
        text="Generate a payroll report for this month",
        language="en",
        user_id="user123",
        session_id="session456",
        user_role="HR_PROFESSIONAL",
        timestamp=datetime.now(),
        context={}
    )
    
    # Process prompts
    print("Processing Arabic prompt...")
    arabic_response = await agent.process_prompt(arabic_prompt)
    print(f"Arabic Response: {arabic_response}")
    
    print("\nProcessing English prompt...")
    english_response = await agent.process_prompt(english_prompt)
    print(f"English Response: {english_response}")


if __name__ == "__main__":
    asyncio.run(main())

