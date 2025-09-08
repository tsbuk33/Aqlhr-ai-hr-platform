"""
AQLHR Employee Management Microservice
=====================================

This microservice handles all employee-related operations including
onboarding, data management, performance tracking, and lifecycle management.
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from enum import Enum
import uuid
import logging
import asyncio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AQLHR Employee Management Service",
    description="Microservice for employee lifecycle management",
    version="1.0.0"
)


class EmployeeStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    TERMINATED = "terminated"
    ON_LEAVE = "on_leave"
    PROBATION = "probation"


class ContractType(str, Enum):
    PERMANENT = "permanent"
    TEMPORARY = "temporary"
    CONTRACT = "contract"
    INTERN = "intern"


class EmployeeBase(BaseModel):
    """Base employee model"""
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    first_name_ar: Optional[str] = Field(None, max_length=50)
    last_name_ar: Optional[str] = Field(None, max_length=50)
    email: str = Field(..., regex=r'^[^@]+@[^@]+\.[^@]+$')
    phone: str = Field(..., min_length=10, max_length=15)
    national_id: str = Field(..., min_length=10, max_length=10)
    date_of_birth: date
    nationality: str = Field(..., min_length=2, max_length=3)
    is_saudi: bool = Field(default=False)
    department_id: str
    position_title: str
    position_title_ar: Optional[str] = None
    manager_id: Optional[str] = None
    hire_date: date
    contract_type: ContractType
    salary: float = Field(..., gt=0)
    status: EmployeeStatus = Field(default=EmployeeStatus.ACTIVE)


class EmployeeCreate(EmployeeBase):
    """Employee creation model"""
    pass


class EmployeeUpdate(BaseModel):
    """Employee update model"""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    first_name_ar: Optional[str] = None
    last_name_ar: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    department_id: Optional[str] = None
    position_title: Optional[str] = None
    position_title_ar: Optional[str] = None
    manager_id: Optional[str] = None
    salary: Optional[float] = None
    status: Optional[EmployeeStatus] = None


class Employee(EmployeeBase):
    """Complete employee model"""
    id: str
    employee_number: str
    created_at: datetime
    updated_at: datetime
    created_by: str
    updated_by: str


class EmployeePerformance(BaseModel):
    """Employee performance model"""
    employee_id: str
    review_period: str
    overall_rating: float = Field(..., ge=1, le=5)
    goals_achievement: float = Field(..., ge=0, le=100)
    competency_scores: Dict[str, float]
    feedback: str
    reviewer_id: str
    review_date: datetime


class EmployeeDocument(BaseModel):
    """Employee document model"""
    id: str
    employee_id: str
    document_type: str
    document_name: str
    file_path: str
    uploaded_by: str
    uploaded_at: datetime
    expiry_date: Optional[date] = None


class OnboardingTask(BaseModel):
    """Onboarding task model"""
    id: str
    employee_id: str
    task_name: str
    task_description: str
    assigned_to: str
    due_date: date
    status: str
    completed_at: Optional[datetime] = None


# In-memory storage (replace with actual database in production)
employees_db: Dict[str, Employee] = {}
performance_db: Dict[str, List[EmployeePerformance]] = {}
documents_db: Dict[str, List[EmployeeDocument]] = {}
onboarding_db: Dict[str, List[OnboardingTask]] = {}


class EmployeeService:
    """Employee management service"""
    
    @staticmethod
    async def create_employee(employee_data: EmployeeCreate, created_by: str) -> Employee:
        """Create a new employee"""
        employee_id = str(uuid.uuid4())
        employee_number = f"EMP-{datetime.now().year}-{len(employees_db) + 1:04d}"
        
        employee = Employee(
            id=employee_id,
            employee_number=employee_number,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            created_by=created_by,
            updated_by=created_by,
            **employee_data.dict()
        )
        
        employees_db[employee_id] = employee
        
        # Initialize performance and documents lists
        performance_db[employee_id] = []
        documents_db[employee_id] = []
        
        # Create onboarding tasks
        await EmployeeService.create_onboarding_tasks(employee_id)
        
        logger.info(f"Created employee: {employee_number}")
        return employee
    
    @staticmethod
    async def get_employee(employee_id: str) -> Optional[Employee]:
        """Get employee by ID"""
        return employees_db.get(employee_id)
    
    @staticmethod
    async def get_employee_by_number(employee_number: str) -> Optional[Employee]:
        """Get employee by employee number"""
        for employee in employees_db.values():
            if employee.employee_number == employee_number:
                return employee
        return None
    
    @staticmethod
    async def update_employee(
        employee_id: str,
        employee_data: EmployeeUpdate,
        updated_by: str
    ) -> Optional[Employee]:
        """Update employee information"""
        if employee_id not in employees_db:
            return None
        
        employee = employees_db[employee_id]
        update_data = employee_data.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(employee, field, value)
        
        employee.updated_at = datetime.now()
        employee.updated_by = updated_by
        
        employees_db[employee_id] = employee
        
        logger.info(f"Updated employee: {employee.employee_number}")
        return employee
    
    @staticmethod
    async def delete_employee(employee_id: str) -> bool:
        """Delete employee (soft delete by changing status)"""
        if employee_id not in employees_db:
            return False
        
        employee = employees_db[employee_id]
        employee.status = EmployeeStatus.TERMINATED
        employee.updated_at = datetime.now()
        
        logger.info(f"Terminated employee: {employee.employee_number}")
        return True
    
    @staticmethod
    async def list_employees(
        department_id: Optional[str] = None,
        status: Optional[EmployeeStatus] = None,
        is_saudi: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Employee]:
        """List employees with filters"""
        employees = list(employees_db.values())
        
        # Apply filters
        if department_id:
            employees = [e for e in employees if e.department_id == department_id]
        
        if status:
            employees = [e for e in employees if e.status == status]
        
        if is_saudi is not None:
            employees = [e for e in employees if e.is_saudi == is_saudi]
        
        # Apply pagination
        return employees[skip:skip + limit]
    
    @staticmethod
    async def get_employee_statistics() -> Dict[str, Any]:
        """Get employee statistics"""
        total_employees = len(employees_db)
        active_employees = len([e for e in employees_db.values() if e.status == EmployeeStatus.ACTIVE])
        saudi_employees = len([e for e in employees_db.values() if e.is_saudi])
        
        saudization_rate = (saudi_employees / total_employees * 100) if total_employees > 0 else 0
        
        return {
            'total_employees': total_employees,
            'active_employees': active_employees,
            'saudi_employees': saudi_employees,
            'non_saudi_employees': total_employees - saudi_employees,
            'saudization_rate': round(saudization_rate, 2),
            'employees_by_status': {
                status.value: len([e for e in employees_db.values() if e.status == status])
                for status in EmployeeStatus
            }
        }
    
    @staticmethod
    async def create_onboarding_tasks(employee_id: str) -> List[OnboardingTask]:
        """Create onboarding tasks for new employee"""
        standard_tasks = [
            {
                'task_name': 'IT Setup',
                'task_description': 'Setup computer, email, and system access',
                'assigned_to': 'IT_DEPARTMENT',
                'days_to_complete': 1
            },
            {
                'task_name': 'HR Documentation',
                'task_description': 'Complete employment contracts and policies',
                'assigned_to': 'HR_DEPARTMENT',
                'days_to_complete': 2
            },
            {
                'task_name': 'Government Registration',
                'task_description': 'Register with GOSI, HRSD, and other authorities',
                'assigned_to': 'COMPLIANCE_TEAM',
                'days_to_complete': 5
            },
            {
                'task_name': 'Department Orientation',
                'task_description': 'Introduction to team and role-specific training',
                'assigned_to': 'DEPARTMENT_MANAGER',
                'days_to_complete': 3
            },
            {
                'task_name': 'Safety Training',
                'task_description': 'Complete mandatory safety and security training',
                'assigned_to': 'SAFETY_OFFICER',
                'days_to_complete': 2
            }
        ]
        
        tasks = []
        for task_data in standard_tasks:
            task = OnboardingTask(
                id=str(uuid.uuid4()),
                employee_id=employee_id,
                task_name=task_data['task_name'],
                task_description=task_data['task_description'],
                assigned_to=task_data['assigned_to'],
                due_date=date.today() + timedelta(days=task_data['days_to_complete']),
                status='PENDING'
            )
            tasks.append(task)
        
        if employee_id not in onboarding_db:
            onboarding_db[employee_id] = []
        
        onboarding_db[employee_id].extend(tasks)
        
        logger.info(f"Created {len(tasks)} onboarding tasks for employee: {employee_id}")
        return tasks


# API Endpoints

@app.post("/employees", response_model=Employee)
async def create_employee(
    employee: EmployeeCreate,
    background_tasks: BackgroundTasks,
    created_by: str = "system"
):
    """Create a new employee"""
    try:
        new_employee = await EmployeeService.create_employee(employee, created_by)
        
        # Add background task for government registration
        background_tasks.add_task(
            register_with_government_systems,
            new_employee.id
        )
        
        return new_employee
    except Exception as e:
        logger.error(f"Error creating employee: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create employee")


@app.get("/employees/{employee_id}", response_model=Employee)
async def get_employee(employee_id: str):
    """Get employee by ID"""
    employee = await EmployeeService.get_employee(employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@app.get("/employees/number/{employee_number}", response_model=Employee)
async def get_employee_by_number(employee_number: str):
    """Get employee by employee number"""
    employee = await EmployeeService.get_employee_by_number(employee_number)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@app.put("/employees/{employee_id}", response_model=Employee)
async def update_employee(
    employee_id: str,
    employee_update: EmployeeUpdate,
    updated_by: str = "system"
):
    """Update employee information"""
    employee = await EmployeeService.update_employee(employee_id, employee_update, updated_by)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@app.delete("/employees/{employee_id}")
async def delete_employee(employee_id: str):
    """Delete (terminate) employee"""
    success = await EmployeeService.delete_employee(employee_id)
    if not success:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee terminated successfully"}


@app.get("/employees", response_model=List[Employee])
async def list_employees(
    department_id: Optional[str] = None,
    status: Optional[EmployeeStatus] = None,
    is_saudi: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100
):
    """List employees with optional filters"""
    return await EmployeeService.list_employees(
        department_id=department_id,
        status=status,
        is_saudi=is_saudi,
        skip=skip,
        limit=limit
    )


@app.get("/employees/statistics/summary")
async def get_employee_statistics():
    """Get employee statistics summary"""
    return await EmployeeService.get_employee_statistics()


@app.get("/employees/{employee_id}/onboarding", response_model=List[OnboardingTask])
async def get_onboarding_tasks(employee_id: str):
    """Get onboarding tasks for employee"""
    if employee_id not in employees_db:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return onboarding_db.get(employee_id, [])


@app.post("/employees/{employee_id}/performance", response_model=EmployeePerformance)
async def add_performance_review(employee_id: str, performance: EmployeePerformance):
    """Add performance review for employee"""
    if employee_id not in employees_db:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if employee_id not in performance_db:
        performance_db[employee_id] = []
    
    performance_db[employee_id].append(performance)
    
    logger.info(f"Added performance review for employee: {employee_id}")
    return performance


@app.get("/employees/{employee_id}/performance", response_model=List[EmployeePerformance])
async def get_performance_reviews(employee_id: str):
    """Get performance reviews for employee"""
    if employee_id not in employees_db:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return performance_db.get(employee_id, [])


# Background tasks

async def register_with_government_systems(employee_id: str):
    """Background task to register employee with government systems"""
    logger.info(f"Starting government registration for employee: {employee_id}")
    
    # Simulate government system registration
    await asyncio.sleep(2)  # Simulate API calls
    
    # Register with GOSI
    await register_with_gosi(employee_id)
    
    # Register with HRSD
    await register_with_hrsd(employee_id)
    
    # Register with QIWA
    await register_with_qiwa(employee_id)
    
    logger.info(f"Completed government registration for employee: {employee_id}")


async def register_with_gosi(employee_id: str):
    """Register employee with GOSI"""
    logger.info(f"Registering employee {employee_id} with GOSI")
    # Simulate GOSI API call
    await asyncio.sleep(1)
    logger.info(f"GOSI registration completed for employee: {employee_id}")


async def register_with_hrsd(employee_id: str):
    """Register employee with HRSD"""
    logger.info(f"Registering employee {employee_id} with HRSD")
    # Simulate HRSD API call
    await asyncio.sleep(1)
    logger.info(f"HRSD registration completed for employee: {employee_id}")


async def register_with_qiwa(employee_id: str):
    """Register employee with QIWA"""
    logger.info(f"Registering employee {employee_id} with QIWA")
    # Simulate QIWA API call
    await asyncio.sleep(1)
    logger.info(f"QIWA registration completed for employee: {employee_id}")


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "employee-management",
        "timestamp": datetime.now().isoformat(),
        "total_employees": len(employees_db)
    }


if __name__ == "__main__":
    import uvicorn
    logger.info("Starting AQLHR Employee Management Service...")
    uvicorn.run(app, host="0.0.0.0", port=8001)

