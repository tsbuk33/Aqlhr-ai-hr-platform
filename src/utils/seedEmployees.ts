import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/hooks/useEmployees';

interface SeedOptions {
  amount: number;
  locale: string;
  salaryRange: [number, number];
  saudizationMix: number; // percentage of Saudi employees
  companyId?: string;
  hireDateRange?: [Date, Date];
}

interface SeedResult {
  success: boolean;
  employeesCreated: number;
  saudiCreated: number;
  expatCreated: number;
  durationMs: number;
  errors: string[];
}

type NewEmployee = Omit<Employee, 'id' | 'created_at' | 'updated_at'>;

const SAUDI_FIRST_NAMES = [
  'أحمد', 'محمد', 'عبدالله', 'فهد', 'سالم', 'خالد', 'عبدالعزيز', 'ناصر',
  'فاطمة', 'عائشة', 'مريم', 'نورا', 'سارة', 'هند', 'ريم', 'أمل'
];

const SAUDI_LAST_NAMES = [
  'العتيبي', 'الحربي', 'المطيري', 'الدوسري', 'القحطاني', 'الغامدي', 
  'الزهراني', 'الشهري', 'العنزي', 'الرشيد'
];

const EXPAT_FIRST_NAMES = [
  'Ahmad', 'Mohamed', 'Ali', 'Hassan', 'Omar', 'Youssef', 'Kareem', 'Tariq',
  'Fatima', 'Aisha', 'Layla', 'Zainab', 'Nadia', 'Amira', 'Salma', 'Dina'
];

const EXPAT_LAST_NAMES = [
  'Khan', 'Ahmed', 'Hassan', 'Ali', 'Ibrahim', 'Mahmoud', 'Abdel Rahman',
  'El Sayed', 'Farouk', 'Mansour'
];

const DEPARTMENTS = [
  'Engineering', 'Finance', 'HR', 'Marketing', 'Operations', 'IT',
  'Legal', 'Procurement', 'Quality', 'Sales'
];

const POSITIONS = [
  'Manager', 'Senior Specialist', 'Specialist', 'Coordinator', 
  'Analyst', 'Executive', 'Director', 'Supervisor'
];

const POSITIONS_AR = [
  'مدير', 'أخصائي أول', 'أخصائي', 'منسق',
  'محلل', 'تنفيذي', 'مدير عام', 'مشرف'
];

function generateNationalId(): string {
  return 'TEST-1' + Math.random().toString().slice(2, 10);
}

function generateIqamaNumber(): string {
  return 'TEST-2' + Math.random().toString().slice(2, 10);
}

function generateEmployeeNumber(index: number): string {
  return 'EMP' + Date.now().toString().slice(-6) + String(index).padStart(4, '0');
}

function getRandomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateSalary(min: number, max: number): number {
  // Use normal distribution for more realistic salary curves
  const mean = (min + max) / 2;
  const stdDev = (max - min) / 6;
  
  // Box-Muller transform for normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  
  const normalValue = mean + z * stdDev;
  return Math.max(min, Math.min(max, Math.round(normalValue)));
}

function generateUniqueEmail(firstName: string, lastName: string, employeeNumber: string): string {
  const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '');
  return `${cleanFirst}.${cleanLast}.${employeeNumber}@testcompany.com`;
}

function generateHireDate(range?: [Date, Date]): string {
  const start = range ? range[0] : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1 year ago
  const end = range ? range[1] : new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function generateSaudiPhone(): string {
  const prefix = '+9665';
  const number = Math.floor(Math.random() * 90000000 + 10000000);
  return prefix + number.toString();
}

export async function seedEmployees(options: SeedOptions): Promise<SeedResult> {
  const startTime = Date.now();
  const { amount, salaryRange, saudizationMix, companyId, hireDateRange } = options;
  const errors: string[] = [];
  let saudiCreated = 0;
  let expatCreated = 0;

  // Handle company selection
  let targetCompanyId = companyId;
  if (!targetCompanyId) {
    const { data: companies } = await supabase
      .from('companies')
      .select('id, name')
      .limit(5);

    if (!companies?.length) {
      return {
        success: false,
        employeesCreated: 0,
        saudiCreated: 0,
        expatCreated: 0,
        durationMs: Date.now() - startTime,
        errors: ['No companies found. Please create a company first.']
      };
    }

    if (companies.length > 1) {
      const companyList = companies.map(c => `${c.name} (${c.id})`).join(', ');
      return {
        success: false,
        employeesCreated: 0,
        saudiCreated: 0,
        expatCreated: 0,
        durationMs: Date.now() - startTime,
        errors: [`Multiple companies found. Please specify companyId. Available: ${companyList}`]
      };
    }

    targetCompanyId = companies[0].id;
  }

  const saudiCount = Math.floor((amount * saudizationMix) / 100);
  const expatCount = amount - saudiCount;

  if (process.env.NODE_ENV !== 'production') {
    console.log(`Seeding ${amount} employees: ${saudiCount} Saudi, ${expatCount} Expat`);
  }

  try {
    // Build Saudi employees array
    const saudiEmployees: NewEmployee[] = [];
    for (let i = 0; i < saudiCount; i++) {
      const firstName = getRandomFromArray(SAUDI_FIRST_NAMES);
      const lastName = getRandomFromArray(SAUDI_LAST_NAMES);
      const empNumber = generateEmployeeNumber(i);
      const positionIndex = Math.floor(Math.random() * POSITIONS.length);
      
      saudiEmployees.push({
        company_id: targetCompanyId,
        employee_number: empNumber,
        national_id: generateNationalId(),
        first_name: firstName,
        last_name: lastName,
        first_name_ar: firstName,
        last_name_ar: lastName,
        email: generateUniqueEmail(firstName, lastName, empNumber),
        phone: generateSaudiPhone(),
        nationality: 'Saudi',
        is_saudi: true,
        hire_date: generateHireDate(hireDateRange),
        department: getRandomFromArray(DEPARTMENTS),
        position: POSITIONS[positionIndex],
        position_ar: POSITIONS_AR[positionIndex],
        salary: generateSalary(salaryRange[0], salaryRange[1]),
        status: 'active'
      });
    }

    // Batch insert Saudi employees
    if (saudiEmployees.length > 0) {
      const { error: saudiError, data } = await supabase
        .from('employees')
        .insert(saudiEmployees)
        .select('id');

      if (saudiError) {
        errors.push(`Failed to create Saudi employees: ${saudiError.message}`);
      } else {
        saudiCreated = data?.length || 0;
      }
    }

    // Short-circuit on high error count
    if (errors.length > 5) {
      return {
        success: false,
        employeesCreated: saudiCreated,
        saudiCreated,
        expatCreated: 0,
        durationMs: Date.now() - startTime,
        errors: [...errors, 'Aborting due to high error count']
      };
    }

    // Build Expat employees array
    const expatEmployees: NewEmployee[] = [];
    for (let i = 0; i < expatCount; i++) {
      const firstName = getRandomFromArray(EXPAT_FIRST_NAMES);
      const lastName = getRandomFromArray(EXPAT_LAST_NAMES);
      const empNumber = generateEmployeeNumber(saudiCount + i);
      const positionIndex = Math.floor(Math.random() * POSITIONS.length);
      
      expatEmployees.push({
        company_id: targetCompanyId,
        employee_number: empNumber,
        national_id: '',
        iqama_number: generateIqamaNumber(),
        first_name: firstName,
        last_name: lastName,
        email: generateUniqueEmail(firstName, lastName, empNumber),
        phone: generateSaudiPhone(),
        nationality: getRandomFromArray(['Indian', 'Pakistani', 'Egyptian', 'Jordanian', 'Lebanese']),
        is_saudi: false,
        hire_date: generateHireDate(hireDateRange),
        department: getRandomFromArray(DEPARTMENTS),
        position: POSITIONS[positionIndex],
        position_ar: POSITIONS_AR[positionIndex],
        salary: generateSalary(salaryRange[0], salaryRange[1]),
        status: 'active'
      });
    }

    // Batch insert Expat employees
    if (expatEmployees.length > 0) {
      const { error: expatError, data } = await supabase
        .from('employees')
        .insert(expatEmployees)
        .select('id');

      if (expatError) {
        errors.push(`Failed to create Expat employees: ${expatError.message}`);
      } else {
        expatCreated = data?.length || 0;
      }
    }

  } catch (error) {
    errors.push(`Seeding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const durationMs = Date.now() - startTime;
  const employeesCreated = saudiCreated + expatCreated;

  return {
    success: errors.length === 0,
    employeesCreated,
    saudiCreated,
    expatCreated,
    durationMs,
    errors
  };
}