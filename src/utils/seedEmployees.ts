import { supabase } from '@/integrations/supabase/client';

// Enhanced seeding with more comprehensive data
interface SeedOptions {
  amount: number;
  companyId?: string;
  saudizationMix?: number; // percentage of Saudi employees (default 65%)
}

interface SeedResult {
  success: boolean;
  employeesCreated: number;
  saudiCreated: number;
  expatCreated: number;
  durationMs: number;
  errors: string[];
}

// Employee interface for seeding
interface NewEmployee {
  company_id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  first_name_ar?: string;
  last_name_ar?: string;
  email?: string;
  phone?: string;
  national_id?: string;
  iqama_number?: string;
  passport_number?: string;
  passport_expiry_date?: string;
  visa_number?: string;
  nationality?: string;
  is_saudi?: boolean;
  gender?: string;
  family_status?: string;
  number_of_children?: number;
  number_of_wives?: number;
  department?: string;
  position?: string;
  position_ar?: string;
  company_job_title?: string;
  company_job_title_ar?: string;
  actual_job_title?: string;
  actual_job_title_ar?: string;
  job_level?: string;
  salary_level?: string;
  basic_salary?: number;
  salary?: number;
  housing_allowance_percentage?: number;
  transportation_allowance_percentage?: number;
  company_housing?: boolean;
  company_provides_transportation?: boolean;
  company_sim_card?: boolean;
  parents_medical_insurance?: boolean;
  life_insurance_home_country?: boolean;
  agreed_annual_bonus?: number;
  annual_tickets_count?: number;
  annual_tickets_type?: string;
  vacation_days_per_year?: number;
  overtime_eligible?: boolean;
  hire_date?: string;
  joining_date?: string;
  experience_years?: number;
  education_level?: string;
  contract_type?: string;
  shift_type?: string;
  work_location?: string;
  work_location_ar?: string;
  job_location?: string;
  national_address?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  company_email?: string;
  company_phone?: string;
  personal_email?: string;
  iban_number?: string;
  line_manager_extension?: string;
  recruitment_type?: string;
  position_hired_for?: string;
  position_hired_for_ar?: string;
  project_hired_for?: string;
  project_hired_for_ar?: string;
  hired_request_number?: string;
  project_name?: string;
  project_name_ar?: string;
  project_number?: string;
  project_cost_number?: string;
  certificates?: string;
  certificates_ar?: string;
  grade_level?: string;
  job_description?: string;
  job_description_ar?: string;
  kpis?: string;
  kpis_ar?: string;
  other_benefits?: string;
  other_benefits_ar?: string;
  schooling_fees_coverage?: string;
  medical_conditions?: string;
  medical_conditions_ar?: string;
  saudi_engineer_card_number?: string;
  driver_license_number?: string;
  qiwa_contract?: boolean;
  gosi_cost_per_month?: number;
  status?: string;
  additional_attributes?: any;
}

// Comprehensive Saudi names
const SAUDI_FIRST_NAMES = [
  'عبدالله', 'محمد', 'أحمد', 'عبدالعزيز', 'فهد', 'خالد', 'سلطان', 'عبدالرحمن', 'سعد', 'يوسف',
  'عمر', 'علي', 'حسن', 'إبراهيم', 'ناصر', 'بندر', 'مشعل', 'طلال', 'فيصل', 'مساعد',
  'فاطمة', 'عائشة', 'زينب', 'مريم', 'نورا', 'سارة', 'هند', 'لطيفة', 'منيرة', 'خديجة',
  'ريم', 'أمل', 'جواهر', 'لولوة', 'بدور', 'وجدان', 'رهف', 'دانة', 'شهد', 'لمى'
];

const SAUDI_LAST_NAMES = [
  'الأحمد', 'العبدالله', 'الفهد', 'الخالد', 'السعد', 'النصر', 'الفيصل', 'العتيبي', 'الغامدي', 'القحطاني',
  'الشهري', 'الزهراني', 'الحربي', 'المطيري', 'العنزي', 'الدوسري', 'الشمري', 'آل سعود', 'الحسن', 'البلوي',
  'الرشيد', 'المالك', 'العسكر', 'الصالح', 'الفالح', 'السديري', 'الجبر', 'الثنيان', 'الربيعة', 'السلوم'
];

const EXPAT_FIRST_NAMES = [
  'Ahmed', 'Mohammed', 'Abdullah', 'Khalid', 'Fahad', 'Sultan', 'Abdulaziz', 'Omar', 'Ali', 'Hassan',
  'Sarah', 'Fatima', 'Aisha', 'Maryam', 'Nora', 'Hind', 'Layla', 'Zainab', 'Khadija', 'Latifa',
  'Youssef', 'Kareem', 'Tariq', 'Amr', 'Waleed', 'Rami', 'Samer', 'Bilal', 'Naser', 'Majed',
  'Nadia', 'Amira', 'Salma', 'Dina', 'Rana', 'Lina', 'Maya', 'Reem', 'Zeina', 'Jana'
];

const EXPAT_LAST_NAMES = [
  'Al-Ahmad', 'Al-Abdullah', 'Al-Fahad', 'Al-Khalid', 'Al-Saad', 'Al-Nasr', 'Al-Faisal', 'Al-Otaibi', 
  'Al-Ghamdi', 'Al-Qahtani', 'Al-Shahri', 'Al-Zahrani', 'Al-Harbi', 'Al-Mutairi', 'Al-Anzi', 'Al-Dosari',
  'Khan', 'Ahmed', 'Hassan', 'Ali', 'Ibrahim', 'Mahmoud', 'Abdel Rahman', 'El Sayed', 'Farouk', 'Mansour',
  'Patel', 'Sharma', 'Singh', 'Kumar', 'Gupta', 'Chopra', 'Mehta', 'Shah', 'Jain', 'Agarwal'
];

const DEPARTMENTS = [
  'Human Resources', 'Finance', 'Information Technology', 'Marketing', 'Operations', 'Legal', 
  'Procurement', 'Quality Assurance', 'Research & Development', 'Customer Service', 'Sales', 
  'Administration', 'Security', 'Facilities Management', 'Internal Audit', 'Strategic Planning'
];

const DEPARTMENTS_AR = [
  'الموارد البشرية', 'المالية', 'تقنية المعلومات', 'التسويق', 'العمليات', 'الشؤون القانونية', 
  'المشتريات', 'ضمان الجودة', 'البحث والتطوير', 'خدمة العملاء', 'المبيعات', 'الإدارة',
  'الأمن', 'إدارة المرافق', 'التدقيق الداخلي', 'التخطيط الاستراتيجي'
];

const POSITIONS = [
  'Manager', 'Senior Manager', 'Director', 'Senior Director', 'VP', 'Senior Specialist', 'Specialist', 
  'Senior Analyst', 'Analyst', 'Coordinator', 'Senior Coordinator', 'Team Lead', 'Supervisor', 
  'Senior Supervisor', 'Executive', 'Senior Executive', 'Assistant', 'Officer', 'Consultant', 'Advisor'
];

const POSITIONS_AR = [
  'مدير', 'مدير أول', 'مدير عام', 'مدير عام أول', 'نائب رئيس', 'أخصائي أول', 'أخصائي', 
  'محلل أول', 'محلل', 'منسق', 'منسق أول', 'قائد فريق', 'مشرف', 'مشرف أول', 'تنفيذي', 
  'تنفيذي أول', 'مساعد', 'موظف', 'استشاري', 'مستشار'
];

const NATIONALITIES = [
  'Saudi', 'Egyptian', 'Pakistani', 'Indian', 'Bangladeshi', 'Filipino', 'Jordanian', 
  'Lebanese', 'Syrian', 'Sudanese', 'Yemeni', 'Palestinian', 'Tunisian', 'Moroccan', 'Iraqi'
];

const CITIES = [
  'Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 'Khobar', 'Tabuk', 'Abha', 'Khamis Mushait', 
  'Najran', 'Jazan', 'Hail', 'Al-Ahsa', 'Qatif', 'Buraidah', 'Taif', 'Yanbu', 'Jubail'
];

const CONTRACT_TYPES = ['Permanent', 'Temporary', 'Contract', 'Part-time', 'Full-time'];
const EDUCATION_LEVELS = ['High School', 'Diploma', 'Bachelor', 'Master', 'PhD'];
const JOB_LEVELS = ['Entry Level', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Principal', 'Executive'];
const SALARY_LEVELS = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function generateEmployee(index: number, companyId: string): NewEmployee {
  const isSaudi = Math.random() < 0.65; // 65% Saudi employees for Saudization
  const gender = Math.random() < 0.7 ? 'male' : 'female'; // 70% male in Saudi workforce
  
  const firstNameAr = getRandomElement(SAUDI_FIRST_NAMES);
  const lastNameAr = getRandomElement(SAUDI_LAST_NAMES);
  const firstNameEn = isSaudi ? getRandomElement(SAUDI_FIRST_NAMES) : getRandomElement(EXPAT_FIRST_NAMES);
  const lastNameEn = isSaudi ? getRandomElement(SAUDI_LAST_NAMES) : getRandomElement(EXPAT_LAST_NAMES);
  
  const department = getRandomElement(DEPARTMENTS);
  const departmentIndex = DEPARTMENTS.indexOf(department);
  const departmentAr = DEPARTMENTS_AR[departmentIndex];
  
  const position = getRandomElement(POSITIONS);
  const positionIndex = POSITIONS.indexOf(position);
  const positionAr = POSITIONS_AR[positionIndex];
  
  const baseSalary = getRandomNumber(3000, 25000);
  const experienceYears = getRandomNumber(0, 20);
  const hireDate = getRandomDate(new Date(2020, 0, 1), new Date(2024, 11, 31));
  
  return {
    company_id: companyId,
    employee_number: `EMP-${String(index + 1).padStart(4, '0')}`,
    first_name: firstNameEn,
    last_name: lastNameEn,
    first_name_ar: firstNameAr,
    last_name_ar: lastNameAr,
    email: `${firstNameEn.toLowerCase().replace(/[^a-z]/g, '')}.${lastNameEn.toLowerCase().replace(/[^a-z]/g, '')}@company.com`,
    phone: `+966${getRandomNumber(500000000, 599999999)}`,
    personal_email: `${firstNameEn.toLowerCase().replace(/[^a-z]/g, '')}${getRandomNumber(100, 999)}@gmail.com`,
    national_id: isSaudi ? `1${getRandomNumber(100000000, 999999999)}` : null,
    iqama_number: !isSaudi ? `2${getRandomNumber(100000000, 999999999)}` : null,
    passport_number: !isSaudi ? `A${getRandomNumber(1000000, 9999999)}` : null,
    passport_expiry_date: !isSaudi ? getRandomDate(new Date(2025, 0, 1), new Date(2030, 11, 31)) : null,
    visa_number: !isSaudi ? `V${getRandomNumber(100000, 999999)}` : null,
    nationality: isSaudi ? 'Saudi' : getRandomElement(NATIONALITIES.filter(n => n !== 'Saudi')),
    is_saudi: isSaudi,
    gender,
    family_status: getRandomElement(['family', 'non_family']),
    number_of_children: Math.random() < 0.6 ? getRandomNumber(0, 5) : 0,
    number_of_wives: gender === 'male' && Math.random() < 0.1 ? getRandomNumber(1, 2) : 0,
    department,
    position,
    position_ar: positionAr,
    company_job_title: `${position} - ${department}`,
    company_job_title_ar: `${positionAr} - ${departmentAr}`,
    actual_job_title: position,
    actual_job_title_ar: positionAr,
    job_level: getRandomElement(JOB_LEVELS),
    salary_level: getRandomElement(SALARY_LEVELS),
    basic_salary: baseSalary,
    salary: baseSalary * 1.2, // Total salary including allowances
    housing_allowance_percentage: getRandomElement([20, 25, 30]),
    transportation_allowance_percentage: getRandomElement([8, 10, 12]),
    company_housing: Math.random() < 0.3,
    company_provides_transportation: Math.random() < 0.4,
    company_sim_card: Math.random() < 0.8,
    parents_medical_insurance: Math.random() < 0.6,
    life_insurance_home_country: !isSaudi && Math.random() < 0.5,
    agreed_annual_bonus: Math.random() < 0.7 ? baseSalary * getRandomNumber(1, 3) : null,
    annual_tickets_count: !isSaudi ? getRandomNumber(1, 2) : 0,
    annual_tickets_type: !isSaudi ? getRandomElement(['single', 'family']) : null,
    vacation_days_per_year: getRandomNumber(21, 30),
    overtime_eligible: Math.random() < 0.7,
    hire_date: hireDate,
    joining_date: hireDate,
    experience_years: experienceYears,
    education_level: getRandomElement(EDUCATION_LEVELS),
    contract_type: getRandomElement(CONTRACT_TYPES),
    shift_type: getRandomElement(['day', 'night', 'rotating']),
    work_location: getRandomElement(CITIES),
    work_location_ar: getRandomElement(['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة']),
    job_location: getRandomElement(CITIES),
    national_address: `${getRandomNumber(1000, 9999)} ${getRandomElement(CITIES)} ${getRandomNumber(10000, 99999)}`,
    emergency_contact_name: `${getRandomElement(EXPAT_FIRST_NAMES)} ${getRandomElement(EXPAT_LAST_NAMES)}`,
    emergency_contact_number: `+966${getRandomNumber(500000000, 599999999)}`,
    company_email: `${firstNameEn.toLowerCase().replace(/[^a-z]/g, '')}.${lastNameEn.toLowerCase().replace(/[^a-z]/g, '')}@sanadhr.com`,
    company_phone: `+966${getRandomNumber(100000000, 199999999)}`,
    iban_number: `SA${getRandomNumber(10, 99)}${getRandomNumber(1000000000000000, 9999999999999999)}`,
    line_manager_extension: `${getRandomNumber(1000, 9999)}`,
    recruitment_type: getRandomElement(['local', 'international']),
    position_hired_for: position,
    position_hired_for_ar: positionAr,
    project_hired_for: `Project ${getRandomElement(['Alpha', 'Beta', 'Gamma', 'Delta'])}`,
    project_hired_for_ar: `مشروع ${getRandomElement(['ألفا', 'بيتا', 'جاما', 'دلتا'])}`,
    hired_request_number: `REQ-${getRandomNumber(1000, 9999)}`,
    project_name: `${getRandomElement(['Digital Transformation', 'Infrastructure', 'Innovation', 'Expansion'])} Project`,
    project_name_ar: `مشروع ${getRandomElement(['التحول الرقمي', 'البنية التحتية', 'الابتكار', 'التوسع'])}`,
    project_number: `PRJ-${getRandomNumber(1000, 9999)}`,
    project_cost_number: `COST-${getRandomNumber(10000, 99999)}`,
    certificates: getRandomElement(['PMP', 'CPA', 'CISSP', 'MBA', 'ITIL', 'Six Sigma']) + (Math.random() < 0.3 ? `, ${getRandomElement(['ISO 9001', 'Prince2', 'CISA', 'CMA'])}` : ''),
    certificates_ar: getRandomElement(['إدارة المشاريع المهنية', 'المحاسب القانوني المعتمد', 'أمن المعلومات', 'ماجستير إدارة الأعمال']),
    grade_level: getRandomElement(['A', 'B', 'C', 'D', 'E']),
    job_description: `Responsible for ${getRandomElement(['managing', 'coordinating', 'implementing', 'overseeing'])} ${getRandomElement(['daily operations', 'team activities', 'project deliverables', 'strategic initiatives'])} in the ${department} department.`,
    job_description_ar: `مسؤول عن ${getRandomElement(['إدارة', 'تنسيق', 'تنفيذ', 'الإشراف على'])} ${getRandomElement(['العمليات اليومية', 'أنشطة الفريق', 'مخرجات المشروع', 'المبادرات الاستراتيجية'])} في قسم ${departmentAr}.`,
    kpis: `${getRandomElement(['Customer Satisfaction', 'Project Delivery', 'Quality Metrics', 'Team Performance'])}: ${getRandomNumber(85, 98)}%`,
    kpis_ar: `${getRandomElement(['رضا العملاء', 'تسليم المشاريع', 'مقاييس الجودة', 'أداء الفريق'])}: ${getRandomNumber(85, 98)}%`,
    other_benefits: getRandomElement(['Health Insurance', 'Car Allowance', 'Phone Allowance', 'Internet Allowance']) + (Math.random() < 0.4 ? `, ${getRandomElement(['Gym Membership', 'Training Budget', 'Flexible Hours'])}` : ''),
    other_benefits_ar: getRandomElement(['التأمين الصحي', 'بدل سيارة', 'بدل هاتف', 'بدل إنترنت']),
    schooling_fees_coverage: Math.random() < 0.3 ? getRandomElement(['none', 'one_child', 'two_children', 'all_children']) : 'none',
    medical_conditions: Math.random() < 0.1 ? getRandomElement(['Diabetes', 'Hypertension', 'Asthma', 'None']) : null,
    medical_conditions_ar: Math.random() < 0.1 ? getRandomElement(['السكري', 'ضغط الدم', 'الربو', 'لا يوجد']) : null,
    saudi_engineer_card_number: (department === 'Information Technology' || department === 'Research & Development') && Math.random() < 0.3 ? `ENG-${getRandomNumber(100000, 999999)}` : null,
    driver_license_number: Math.random() < 0.8 ? `DL-${getRandomNumber(1000000, 9999999)}` : null,
    qiwa_contract: Math.random() < 0.9,
    gosi_cost_per_month: baseSalary * 0.21, // 21% GOSI contribution
    status: getRandomElement(['active', 'active', 'active', 'active', 'active', 'on_leave', 'suspended']), // 80% active
    additional_attributes: {
      performance_rating: getRandomNumber(3, 5),
      last_promotion_date: Math.random() < 0.4 ? getRandomDate(new Date(2022, 0, 1), new Date(2024, 11, 31)) : null,
      training_hours_completed: getRandomNumber(10, 80),
      languages: getRandomElement([['Arabic', 'English'], ['Arabic', 'English', 'French'], ['Arabic', 'English', 'Urdu']]),
      skills: getRandomElement([
        ['Leadership', 'Communication', 'Problem Solving'],
        ['Technical Analysis', 'Project Management', 'Team Building'],
        ['Strategic Planning', 'Data Analysis', 'Process Improvement']
      ])
    }
  };
}

export async function seedEmployees(options: SeedOptions): Promise<SeedResult> {
  const startTime = Date.now();
  const { amount, companyId, saudizationMix = 65 } = options;
  const errors: string[] = [];
  let employeesCreated = 0;
  let saudiCreated = 0;
  let expatCreated = 0;

  try {
    console.log(`Starting to seed ${amount} employees...`);
    
    // Handle company selection
    let targetCompanyId = companyId;
    if (!targetCompanyId) {
      // Create a sample company if none exists
      const { data: existingCompanies } = await supabase
        .from('companies')
        .select('id')
        .limit(1);
      
      if (!existingCompanies?.length) {
        const { data: newCompany, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: 'SanadHR Demo Company',
            cr_number: '1010123456',
            vat_number: '300123456789003',
            industry: 'Technology',
            size_category: 'Large',
            saudization_target: 65,
            language_preference: 'ar',
            rtl_enabled: true
          })
          .select()
          .single();
        
        if (companyError) {
          errors.push(`Failed to create company: ${companyError.message}`);
          return {
            success: false,
            employeesCreated: 0,
            saudiCreated: 0,
            expatCreated: 0,
            durationMs: Date.now() - startTime,
            errors
          };
        }
        
        targetCompanyId = newCompany.id;
      } else {
        targetCompanyId = existingCompanies[0].id;
      }
    }
    
    // Generate employees in batches to avoid timeout
    const batchSize = 50;
    const batches = Math.ceil(amount / batchSize);
    
    for (let batch = 0; batch < batches; batch++) {
      const startIndex = batch * batchSize;
      const endIndex = Math.min(startIndex + batchSize, amount);
      const batchEmployees: NewEmployee[] = [];
      
      for (let i = startIndex; i < endIndex; i++) {
        const employee = generateEmployee(i, targetCompanyId);
        batchEmployees.push(employee);
        
        if (employee.is_saudi) {
          saudiCreated++;
        } else {
          expatCreated++;
        }
      }
      
      const { data, error } = await supabase
        .from('employees')
        .insert(batchEmployees)
        .select('id');
      
      if (error) {
        console.error(`Error inserting batch ${batch + 1}:`, error);
        errors.push(`Batch ${batch + 1} failed: ${error.message}`);
      } else {
        employeesCreated += data?.length || 0;
        console.log(`Inserted batch ${batch + 1}/${batches} (${batchEmployees.length} employees)`);
      }
    }
    
    console.log(`Successfully seeded ${employeesCreated} employees!`);
    
  } catch (error) {
    console.error('Error seeding employees:', error);
    errors.push(`Seeding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const durationMs = Date.now() - startTime;
  
  return {
    success: errors.length === 0,
    employeesCreated,
    saudiCreated,
    expatCreated,
    durationMs,
    errors
  };
}

// Quick function to seed 500 employees
export async function seed500Employees(companyId?: string) {
  return await seedEmployees({ 
    amount: 500, 
    companyId, 
    saudizationMix: 65 
  });
}

// Function to create ERP integration configuration
export function createERPIntegrationConfig() {
  return {
    supportedSystems: [
      'SAP', 'Oracle HCM', 'Workday', 'SuccessFactors', 'ADP', 'BambooHR', 
      'Cornerstone OnDemand', 'UltiPro', 'PeopleSoft', 'Microsoft Dynamics'
    ],
    apiEndpoints: {
      employees: '/api/employees',
      departments: '/api/departments',
      positions: '/api/positions',
      payroll: '/api/payroll',
      attendance: '/api/attendance',
      leave: '/api/leave'
    },
    dataMapping: {
      employeeFields: {
        'employee_id': 'employee_number',
        'first_name': 'first_name',
        'last_name': 'last_name',
        'email': 'email',
        'department': 'department',
        'position': 'position',
        'salary': 'basic_salary',
        'hire_date': 'hire_date'
      }
    },
    webhooks: {
      onEmployeeCreate: '/webhooks/employee-created',
      onEmployeeUpdate: '/webhooks/employee-updated',
      onEmployeeDelete: '/webhooks/employee-deleted'
    },
    authentication: {
      type: 'oauth2',
      scopes: ['read:employees', 'write:employees', 'read:departments']
    }
  };
}