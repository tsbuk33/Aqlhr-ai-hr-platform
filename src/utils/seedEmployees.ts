import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/hooks/useEmployees';

interface SeedOptions {
  amount: number;
  locale: string;
  salaryRange: [number, number];
  saudizationMix: number; // percentage of Saudi employees
}

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

function generateNationalId(): string {
  return '1' + Math.random().toString().slice(2, 11);
}

function generateIqamaNumber(): string {
  return '2' + Math.random().toString().slice(2, 11);
}

function generateEmployeeNumber(): string {
  return 'EMP' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
}

function getRandomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateSalary(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateHireDate(): string {
  const start = new Date('2020-01-01');
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

export async function seedEmployees(options: SeedOptions): Promise<{
  success: boolean;
  employeesCreated: number;
  errors: string[];
}> {
  const { amount, salaryRange, saudizationMix } = options;
  const errors: string[] = [];
  let employeesCreated = 0;

  // Get first company for seeding
  const { data: companies } = await supabase
    .from('companies')
    .select('id')
    .limit(1);

  if (!companies?.length) {
    return {
      success: false,
      employeesCreated: 0,
      errors: ['No companies found. Please create a company first.']
    };
  }

  const companyId = companies[0].id;
  const saudiCount = Math.floor((amount * saudizationMix) / 100);
  const expatCount = amount - saudiCount;

  console.log(`Seeding ${amount} employees: ${saudiCount} Saudi, ${expatCount} Expat`);

  try {
    // Generate Saudi employees
    for (let i = 0; i < saudiCount; i++) {
      const firstName = getRandomFromArray(SAUDI_FIRST_NAMES);
      const lastName = getRandomFromArray(SAUDI_LAST_NAMES);
      
      const employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'> = {
        company_id: companyId,
        employee_number: generateEmployeeNumber(),
        national_id: generateNationalId(),
        first_name: firstName,
        last_name: lastName,
        first_name_ar: firstName,
        last_name_ar: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        phone: '+966' + Math.floor(Math.random() * 900000000 + 100000000),
        nationality: 'Saudi',
        is_saudi: true,
        hire_date: generateHireDate(),
        department: getRandomFromArray(DEPARTMENTS),
        position: getRandomFromArray(POSITIONS),
        position_ar: getRandomFromArray(POSITIONS),
        salary: generateSalary(salaryRange[0], salaryRange[1]),
        status: 'active'
      };

      const { error } = await supabase
        .from('employees')
        .insert([employee]);

      if (error) {
        errors.push(`Failed to create Saudi employee ${i + 1}: ${error.message}`);
      } else {
        employeesCreated++;
      }
    }

    // Generate Expat employees
    for (let i = 0; i < expatCount; i++) {
      const firstName = getRandomFromArray(EXPAT_FIRST_NAMES);
      const lastName = getRandomFromArray(EXPAT_LAST_NAMES);
      
      const employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'> = {
        company_id: companyId,
        employee_number: generateEmployeeNumber(),
        national_id: '',
        iqama_number: generateIqamaNumber(),
        first_name: firstName,
        last_name: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        phone: '+966' + Math.floor(Math.random() * 900000000 + 100000000),
        nationality: getRandomFromArray(['Indian', 'Pakistani', 'Egyptian', 'Jordanian', 'Lebanese']),
        is_saudi: false,
        hire_date: generateHireDate(),
        department: getRandomFromArray(DEPARTMENTS),
        position: getRandomFromArray(POSITIONS),
        salary: generateSalary(salaryRange[0], salaryRange[1]),
        status: 'active'
      };

      const { error } = await supabase
        .from('employees')
        .insert([employee]);

      if (error) {
        errors.push(`Failed to create Expat employee ${i + 1}: ${error.message}`);
      } else {
        employeesCreated++;
      }
    }

  } catch (error) {
    errors.push(`Seeding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    success: errors.length === 0,
    employeesCreated,
    errors
  };
}