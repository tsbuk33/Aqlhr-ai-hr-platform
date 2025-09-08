/**
 * AQLHR Employee Management Service
 * ================================
 * 
 * Layer 3: Business Logic - Employee Lifecycle Management
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method, query } = req;
  const timestamp = new Date().toISOString();

  // Employee Statistics Summary
  if (url.includes('/statistics/summary') && method === 'GET') {
    return res.status(200).json({
      timestamp,
      total_employees: 247,
      active_employees: 235,
      saudi_employees: 158,
      non_saudi_employees: 89,
      saudization_rate: 63.97,
      nitaqat_status: "Green",
      
      employees_by_status: {
        active: 235,
        inactive: 5,
        terminated: 3,
        on_leave: 3,
        probation: 1
      },
      
      employees_by_department: {
        "Executive Management": 8,
        "Human Resources": 22,
        "Information Technology": 35,
        "Finance & Accounting": 28,
        "Operations": 45,
        "Sales & Marketing": 38,
        "Customer Service": 25,
        "Legal & Compliance": 12,
        "Research & Development": 18,
        "Quality Assurance": 16
      },
      
      gender_distribution: {
        male: 142,
        female: 105,
        women_participation_rate: 42.51
      },
      
      age_distribution: {
        "18-25": 28,
        "26-35": 98,
        "36-45": 78,
        "46-55": 32,
        "55+": 11
      },
      
      nationality_breakdown: {
        saudi: 158,
        egyptian: 25,
        indian: 18,
        pakistani: 15,
        filipino: 12,
        jordanian: 8,
        lebanese: 6,
        other: 5
      },
      
      education_levels: {
        high_school: 45,
        diploma: 62,
        bachelor: 118,
        master: 18,
        phd: 4
      },
      
      vision_2030_metrics: {
        women_participation: {
          current: 42.51,
          target: 35,
          status: "exceeding"
        },
        saudization_rate: {
          current: 63.97,
          target: 65,
          status: "approaching_target"
        },
        youth_employment: {
          under_30: 126,
          percentage: 51.01,
          status: "on_track"
        }
      }
    });
  }

  // Employee List with pagination
  if ((url === '/api/employees' || url.includes('/employees') && !url.includes('/statistics')) && method === 'GET') {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const department = query.department;
    const status = query.status || 'active';
    
    // Generate mock employee data
    const employees = [];
    const departments = ["Executive Management", "Human Resources", "Information Technology", "Finance & Accounting", "Operations", "Sales & Marketing"];
    const positions = ["Manager", "Senior Specialist", "Specialist", "Coordinator", "Assistant", "Director"];
    const saudiNames = ["Ahmed Al-Rashid", "Fatima Al-Zahra", "Mohammed Al-Saud", "Noura Al-Otaibi", "Khalid Al-Mutairi"];
    const nonSaudiNames = ["John Smith", "Maria Garcia", "Raj Patel", "Sarah Johnson", "Omar Hassan"];
    
    for (let i = 1; i <= 247; i++) {
      const isSaudi = i <= 158;
      const names = isSaudi ? saudiNames : nonSaudiNames;
      const randomName = names[i % names.length];
      const [firstName, lastName] = randomName.split(' ');
      
      const employee = {
        id: `emp_${i.toString().padStart(3, '0')}`,
        employee_number: `AQLHR-2024-${i.toString().padStart(4, '0')}`,
        first_name: firstName,
        last_name: lastName,
        first_name_ar: isSaudi ? `${firstName}_ar` : firstName,
        last_name_ar: isSaudi ? `${lastName}_ar` : lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace('-', '')}@aqlhr.com`,
        phone: `+966${Math.floor(Math.random() * 900000000) + 500000000}`,
        department: departments[i % departments.length],
        position: positions[i % positions.length],
        hire_date: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        status: i <= 235 ? 'active' : (i <= 240 ? 'on_leave' : 'inactive'),
        is_saudi: isSaudi,
        nationality: isSaudi ? 'Saudi' : ['Egyptian', 'Indian', 'Pakistani', 'Filipino'][Math.floor(Math.random() * 4)],
        salary: Math.floor(Math.random() * 15000) + 5000,
        gender: Math.random() > 0.57 ? 'male' : 'female',
        age: Math.floor(Math.random() * 37) + 23,
        education: ['High School', 'Diploma', 'Bachelor', 'Master', 'PhD'][Math.floor(Math.random() * 5)],
        gosi_number: isSaudi ? `GOSI${Math.floor(Math.random() * 9000000000) + 1000000000}` : null,
        iqama_number: !isSaudi ? `${Math.floor(Math.random() * 9000000000) + 1000000000}` : null
      };
      
      // Apply filters
      if (department && employee.department !== department) continue;
      if (status && employee.status !== status) continue;
      
      employees.push(employee);
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEmployees = employees.slice(startIndex, endIndex);
    
    return res.status(200).json({
      employees: paginatedEmployees,
      pagination: {
        page,
        limit,
        total: employees.length,
        pages: Math.ceil(employees.length / limit),
        has_next: endIndex < employees.length,
        has_previous: page > 1
      },
      filters: {
        department,
        status
      },
      timestamp
    });
  }

  // Employee creation
  if (url.includes('/employees') && method === 'POST') {
    const employeeData = req.body || {};
    
    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'email', 'department', 'position'];
    const missingFields = requiredFields.filter(field => !employeeData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missing_fields: missingFields,
        timestamp
      });
    }
    
    // Generate new employee
    const newEmployee = {
      id: `emp_${Date.now()}`,
      employee_number: `AQLHR-2024-${Math.floor(Math.random() * 9000) + 1000}`,
      ...employeeData,
      hire_date: new Date().toISOString().split('T')[0],
      status: 'active',
      created_at: timestamp,
      created_by: 'system'
    };
    
    return res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
      next_steps: [
        "Complete government registration (GOSI, HRSD)",
        "Set up payroll information",
        "Assign to organizational structure",
        "Schedule onboarding process"
      ],
      timestamp
    });
  }

  // Default response
  return res.status(404).json({
    error: "Employee endpoint not found",
    available_endpoints: [
      "GET /api/employees - List employees with pagination",
      "POST /api/employees - Create new employee", 
      "GET /api/employees/statistics/summary - Employee statistics"
    ],
    timestamp
  });
}

