"""
AQLHR GOSI Integration Connector
===============================

This module provides integration with the General Organization for Social Insurance (GOSI)
for employee registration, contribution calculations, and compliance reporting.
"""

import asyncio
import aiohttp
import logging
from datetime import datetime, date
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum
import json
import hashlib
import hmac
import base64

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GOSIEmployeeStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    TERMINATED = "terminated"


class GOSIContributionType(str, Enum):
    EMPLOYEE = "employee"
    EMPLOYER = "employer"
    UNEMPLOYMENT = "unemployment"
    OCCUPATIONAL_HAZARDS = "occupational_hazards"


class GOSIEmployee(BaseModel):
    """GOSI employee registration model"""
    national_id: str = Field(..., min_length=10, max_length=10)
    first_name: str
    last_name: str
    first_name_ar: str
    last_name_ar: str
    date_of_birth: date
    nationality: str
    gender: str
    marital_status: str
    basic_salary: float
    allowances: float = 0.0
    job_title: str
    job_title_ar: str
    hire_date: date
    contract_type: str
    work_location: str
    employer_id: str
    establishment_id: str


class GOSIContribution(BaseModel):
    """GOSI contribution calculation model"""
    employee_id: str
    month: int
    year: int
    basic_salary: float
    allowances: float
    total_salary: float
    employee_contribution: float
    employer_contribution: float
    unemployment_contribution: float
    occupational_hazards_contribution: float
    total_contribution: float


class GOSIRegistrationResponse(BaseModel):
    """GOSI registration response model"""
    success: bool
    gosi_id: Optional[str] = None
    registration_date: Optional[datetime] = None
    status: str
    message: str
    errors: List[str] = []


class GOSIContributionResponse(BaseModel):
    """GOSI contribution response model"""
    success: bool
    contribution_id: Optional[str] = None
    calculated_at: Optional[datetime] = None
    contribution_details: Optional[GOSIContribution] = None
    message: str
    errors: List[str] = []


class GOSIConnector:
    """GOSI API connector for employee registration and contribution management"""
    
    def __init__(self, api_base_url: str, client_id: str, client_secret: str, establishment_id: str):
        self.api_base_url = api_base_url.rstrip('/')
        self.client_id = client_id
        self.client_secret = client_secret
        self.establishment_id = establishment_id
        self.access_token = None
        self.token_expires_at = None
        
        # GOSI contribution rates (as of 2024)
        self.contribution_rates = {
            'employee_rate': 0.10,  # 10% of salary
            'employer_rate': 0.12,  # 12% of salary
            'unemployment_rate': 0.02,  # 2% of salary
            'occupational_hazards_rate': 0.01  # 1% of salary
        }
        
        # Salary limits for GOSI contributions
        self.min_contributory_salary = 400  # SAR
        self.max_contributory_salary = 45000  # SAR
        
        logger.info("GOSI Connector initialized")
    
    async def authenticate(self) -> bool:
        """Authenticate with GOSI API"""
        try:
            auth_url = f"{self.api_base_url}/oauth/token"
            
            auth_data = {
                'grant_type': 'client_credentials',
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'scope': 'employee_registration contribution_calculation'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(auth_url, data=auth_data) as response:
                    if response.status == 200:
                        token_data = await response.json()
                        self.access_token = token_data['access_token']
                        expires_in = token_data.get('expires_in', 3600)
                        self.token_expires_at = datetime.now().timestamp() + expires_in
                        
                        logger.info("GOSI authentication successful")
                        return True
                    else:
                        error_text = await response.text()
                        logger.error(f"GOSI authentication failed: {response.status} - {error_text}")
                        return False
        
        except Exception as e:
            logger.error(f"GOSI authentication error: {str(e)}")
            return False
    
    async def ensure_authenticated(self) -> bool:
        """Ensure we have a valid authentication token"""
        if not self.access_token or (
            self.token_expires_at and 
            datetime.now().timestamp() >= self.token_expires_at - 300  # Refresh 5 minutes before expiry
        ):
            return await self.authenticate()
        return True
    
    def _generate_signature(self, data: str, timestamp: str) -> str:
        """Generate HMAC signature for API requests"""
        message = f"{timestamp}{data}"
        signature = hmac.new(
            self.client_secret.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256
        ).digest()
        return base64.b64encode(signature).decode('utf-8')
    
    async def _make_api_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict] = None,
        params: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """Make authenticated API request to GOSI"""
        if not await self.ensure_authenticated():
            raise Exception("Failed to authenticate with GOSI API")
        
        url = f"{self.api_base_url}{endpoint}"
        timestamp = str(int(datetime.now().timestamp()))
        
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json',
            'X-GOSI-Timestamp': timestamp,
            'X-GOSI-Client-ID': self.client_id,
            'X-GOSI-Establishment-ID': self.establishment_id
        }
        
        # Add signature for data integrity
        if data:
            data_str = json.dumps(data, sort_keys=True)
            headers['X-GOSI-Signature'] = self._generate_signature(data_str, timestamp)
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.request(
                    method,
                    url,
                    json=data,
                    params=params,
                    headers=headers
                ) as response:
                    response_data = await response.json()
                    
                    if response.status >= 400:
                        logger.error(f"GOSI API error: {response.status} - {response_data}")
                    
                    return {
                        'status_code': response.status,
                        'data': response_data
                    }
        
        except Exception as e:
            logger.error(f"GOSI API request error: {str(e)}")
            raise
    
    async def register_employee(self, employee: GOSIEmployee) -> GOSIRegistrationResponse:
        """Register employee with GOSI"""
        try:
            logger.info(f"Registering employee with GOSI: {employee.national_id}")
            
            # Validate employee data
            validation_errors = await self._validate_employee_data(employee)
            if validation_errors:
                return GOSIRegistrationResponse(
                    success=False,
                    status="validation_failed",
                    message="Employee data validation failed",
                    errors=validation_errors
                )
            
            # Prepare registration data
            registration_data = {
                'employee': {
                    'national_id': employee.national_id,
                    'personal_info': {
                        'first_name': employee.first_name,
                        'last_name': employee.last_name,
                        'first_name_ar': employee.first_name_ar,
                        'last_name_ar': employee.last_name_ar,
                        'date_of_birth': employee.date_of_birth.isoformat(),
                        'nationality': employee.nationality,
                        'gender': employee.gender,
                        'marital_status': employee.marital_status
                    },
                    'employment_info': {
                        'basic_salary': employee.basic_salary,
                        'allowances': employee.allowances,
                        'job_title': employee.job_title,
                        'job_title_ar': employee.job_title_ar,
                        'hire_date': employee.hire_date.isoformat(),
                        'contract_type': employee.contract_type,
                        'work_location': employee.work_location
                    },
                    'employer_info': {
                        'employer_id': employee.employer_id,
                        'establishment_id': employee.establishment_id
                    }
                }
            }
            
            # Make API request
            response = await self._make_api_request(
                'POST',
                '/api/v1/employees/register',
                data=registration_data
            )
            
            if response['status_code'] == 201:
                response_data = response['data']
                return GOSIRegistrationResponse(
                    success=True,
                    gosi_id=response_data.get('gosi_id'),
                    registration_date=datetime.fromisoformat(response_data.get('registration_date')),
                    status="registered",
                    message="Employee registered successfully with GOSI"
                )
            else:
                error_data = response['data']
                return GOSIRegistrationResponse(
                    success=False,
                    status="registration_failed",
                    message=error_data.get('message', 'Registration failed'),
                    errors=error_data.get('errors', [])
                )
        
        except Exception as e:
            logger.error(f"Employee registration error: {str(e)}")
            return GOSIRegistrationResponse(
                success=False,
                status="system_error",
                message=f"System error during registration: {str(e)}",
                errors=[str(e)]
            )
    
    async def calculate_contributions(
        self,
        employee_id: str,
        month: int,
        year: int,
        basic_salary: float,
        allowances: float = 0.0
    ) -> GOSIContributionResponse:
        """Calculate GOSI contributions for employee"""
        try:
            logger.info(f"Calculating GOSI contributions for employee: {employee_id}")
            
            # Calculate total salary
            total_salary = basic_salary + allowances
            
            # Apply salary limits
            contributory_salary = max(
                self.min_contributory_salary,
                min(total_salary, self.max_contributory_salary)
            )
            
            # Calculate contributions
            employee_contribution = contributory_salary * self.contribution_rates['employee_rate']
            employer_contribution = contributory_salary * self.contribution_rates['employer_rate']
            unemployment_contribution = contributory_salary * self.contribution_rates['unemployment_rate']
            occupational_hazards_contribution = contributory_salary * self.contribution_rates['occupational_hazards_rate']
            
            total_contribution = (
                employee_contribution + 
                employer_contribution + 
                unemployment_contribution + 
                occupational_hazards_contribution
            )
            
            contribution = GOSIContribution(
                employee_id=employee_id,
                month=month,
                year=year,
                basic_salary=basic_salary,
                allowances=allowances,
                total_salary=total_salary,
                employee_contribution=round(employee_contribution, 2),
                employer_contribution=round(employer_contribution, 2),
                unemployment_contribution=round(unemployment_contribution, 2),
                occupational_hazards_contribution=round(occupational_hazards_contribution, 2),
                total_contribution=round(total_contribution, 2)
            )
            
            # Submit to GOSI API
            contribution_data = {
                'contribution': contribution.dict()
            }
            
            response = await self._make_api_request(
                'POST',
                '/api/v1/contributions/calculate',
                data=contribution_data
            )
            
            if response['status_code'] == 200:
                response_data = response['data']
                return GOSIContributionResponse(
                    success=True,
                    contribution_id=response_data.get('contribution_id'),
                    calculated_at=datetime.now(),
                    contribution_details=contribution,
                    message="Contributions calculated successfully"
                )
            else:
                error_data = response['data']
                return GOSIContributionResponse(
                    success=False,
                    message=error_data.get('message', 'Contribution calculation failed'),
                    errors=error_data.get('errors', [])
                )
        
        except Exception as e:
            logger.error(f"Contribution calculation error: {str(e)}")
            return GOSIContributionResponse(
                success=False,
                message=f"System error during calculation: {str(e)}",
                errors=[str(e)]
            )
    
    async def update_employee_salary(
        self,
        gosi_id: str,
        new_basic_salary: float,
        new_allowances: float = 0.0,
        effective_date: date = None
    ) -> Dict[str, Any]:
        """Update employee salary in GOSI system"""
        try:
            logger.info(f"Updating salary for GOSI employee: {gosi_id}")
            
            if effective_date is None:
                effective_date = date.today()
            
            update_data = {
                'gosi_id': gosi_id,
                'salary_update': {
                    'basic_salary': new_basic_salary,
                    'allowances': new_allowances,
                    'effective_date': effective_date.isoformat()
                }
            }
            
            response = await self._make_api_request(
                'PUT',
                f'/api/v1/employees/{gosi_id}/salary',
                data=update_data
            )
            
            return response['data']
        
        except Exception as e:
            logger.error(f"Salary update error: {str(e)}")
            raise
    
    async def terminate_employee(
        self,
        gosi_id: str,
        termination_date: date,
        termination_reason: str
    ) -> Dict[str, Any]:
        """Terminate employee in GOSI system"""
        try:
            logger.info(f"Terminating GOSI employee: {gosi_id}")
            
            termination_data = {
                'gosi_id': gosi_id,
                'termination': {
                    'termination_date': termination_date.isoformat(),
                    'reason': termination_reason,
                    'final_settlement': True
                }
            }
            
            response = await self._make_api_request(
                'POST',
                f'/api/v1/employees/{gosi_id}/terminate',
                data=termination_data
            )
            
            return response['data']
        
        except Exception as e:
            logger.error(f"Employee termination error: {str(e)}")
            raise
    
    async def get_employee_status(self, gosi_id: str) -> Dict[str, Any]:
        """Get employee status from GOSI"""
        try:
            response = await self._make_api_request(
                'GET',
                f'/api/v1/employees/{gosi_id}/status'
            )
            
            return response['data']
        
        except Exception as e:
            logger.error(f"Employee status retrieval error: {str(e)}")
            raise
    
    async def generate_monthly_report(
        self,
        month: int,
        year: int,
        establishment_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate monthly GOSI contribution report"""
        try:
            logger.info(f"Generating GOSI monthly report for {month}/{year}")
            
            params = {
                'month': month,
                'year': year,
                'establishment_id': establishment_id or self.establishment_id
            }
            
            response = await self._make_api_request(
                'GET',
                '/api/v1/reports/monthly',
                params=params
            )
            
            return response['data']
        
        except Exception as e:
            logger.error(f"Monthly report generation error: {str(e)}")
            raise
    
    async def _validate_employee_data(self, employee: GOSIEmployee) -> List[str]:
        """Validate employee data before registration"""
        errors = []
        
        # Validate national ID format (Saudi national ID)
        if not employee.national_id.isdigit() or len(employee.national_id) != 10:
            errors.append("Invalid national ID format")
        
        # Validate salary
        if employee.basic_salary < self.min_contributory_salary:
            errors.append(f"Basic salary must be at least {self.min_contributory_salary} SAR")
        
        # Validate hire date
        if employee.hire_date > date.today():
            errors.append("Hire date cannot be in the future")
        
        # Validate age (minimum 18 years)
        today = date.today()
        age = today.year - employee.date_of_birth.year - (
            (today.month, today.day) < (employee.date_of_birth.month, employee.date_of_birth.day)
        )
        if age < 18:
            errors.append("Employee must be at least 18 years old")
        
        return errors
    
    async def bulk_register_employees(self, employees: List[GOSIEmployee]) -> List[GOSIRegistrationResponse]:
        """Register multiple employees in bulk"""
        logger.info(f"Bulk registering {len(employees)} employees with GOSI")
        
        results = []
        
        # Process in batches of 10 to avoid overwhelming the API
        batch_size = 10
        for i in range(0, len(employees), batch_size):
            batch = employees[i:i + batch_size]
            
            # Process batch concurrently
            batch_tasks = [self.register_employee(employee) for employee in batch]
            batch_results = await asyncio.gather(*batch_tasks, return_exceptions=True)
            
            for result in batch_results:
                if isinstance(result, Exception):
                    results.append(GOSIRegistrationResponse(
                        success=False,
                        status="system_error",
                        message=f"Registration failed: {str(result)}",
                        errors=[str(result)]
                    ))
                else:
                    results.append(result)
            
            # Add delay between batches to respect rate limits
            if i + batch_size < len(employees):
                await asyncio.sleep(1)
        
        logger.info(f"Bulk registration completed: {len(results)} results")
        return results


# Example usage and testing
async def main():
    """Example usage of GOSI connector"""
    # Initialize connector
    connector = GOSIConnector(
        api_base_url="https://api.gosi.gov.sa",
        client_id="your_client_id",
        client_secret="your_client_secret",
        establishment_id="your_establishment_id"
    )
    
    # Example employee data
    employee = GOSIEmployee(
        national_id="1234567890",
        first_name="Ahmed",
        last_name="Al-Rashid",
        first_name_ar="أحمد",
        last_name_ar="الراشد",
        date_of_birth=date(1990, 5, 15),
        nationality="SA",
        gender="M",
        marital_status="single",
        basic_salary=8000.0,
        allowances=1000.0,
        job_title="Software Developer",
        job_title_ar="مطور برمجيات",
        hire_date=date.today(),
        contract_type="permanent",
        work_location="Riyadh",
        employer_id="EMP001",
        establishment_id="EST001"
    )
    
    # Register employee
    registration_result = await connector.register_employee(employee)
    print(f"Registration result: {registration_result}")
    
    # Calculate contributions
    if registration_result.success:
        contribution_result = await connector.calculate_contributions(
            employee_id="EMP001",
            month=12,
            year=2024,
            basic_salary=8000.0,
            allowances=1000.0
        )
        print(f"Contribution result: {contribution_result}")


if __name__ == "__main__":
    asyncio.run(main())

