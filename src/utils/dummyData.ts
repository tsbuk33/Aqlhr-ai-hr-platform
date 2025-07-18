// Comprehensive dummy data generator for all AqlHR modules
export interface DummyEmployee {
  id: string;
  first_name: string;
  last_name: string;
  first_name_ar: string;
  last_name_ar: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  position_ar: string;
  salary: number;
  hire_date: string;
  is_saudi: boolean;
  nationality: string;
  status: 'active' | 'inactive' | 'terminated';
  employee_number: string;
  national_id?: string;
  iqama_number?: string;
  performance_score?: number;
  skills?: string[];
  certifications?: string[];
}

export interface DummyPosition {
  id: string;
  title: string;
  titleAr: string;
  department: string;
  level: string;
  status: 'active' | 'draft' | 'pending' | 'archived';
  skillsRequired: number;
  skillsMatched: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  count: number;
}

export interface DummyDepartment {
  id: string;
  name: string;
  name_ar: string;
  manager: string;
  employee_count: number;
  budget: number;
  description: string;
}

export interface DummySkill {
  id: string;
  name: string;
  name_ar: string;
  category: string;
  type: 'technical' | 'behavioral' | 'language' | 'certification';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  industry_relevance: string;
  description: string;
  assessment_method: string;
}

export interface DummyTraining {
  id: string;
  course_name: string;
  course_name_ar: string;
  provider: string;
  duration_hours: number;
  completion_rate: number;
  cost: number;
  participants: number;
  status: 'active' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
}

export interface DummyKPI {
  id: string;
  name: string;
  name_ar: string;
  category: string;
  current_value: number;
  target_value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'on_track' | 'at_risk' | 'critical';
  last_updated: string;
}

export interface DummyProject {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  progress: number;
  start_date: string;
  end_date: string;
  team_size: number;
  budget: number;
  manager: string;
}

// Sample data generators
export const generateDummyEmployees = (): DummyEmployee[] => [
  {
    id: '1',
    first_name: 'Ahmed',
    last_name: 'Al-Rashid',
    first_name_ar: 'أحمد',
    last_name_ar: 'الراشد',
    email: 'ahmed.alrashid@company.com',
    phone: '+966501234567',
    department: 'Human Resources',
    position: 'HR Manager',
    position_ar: 'مدير الموارد البشرية',
    salary: 15000,
    hire_date: '2022-01-15',
    is_saudi: true,
    nationality: 'Saudi',
    status: 'active',
    employee_number: 'EMP001',
    national_id: '1234567890',
    performance_score: 92,
    skills: ['Leadership', 'Communication', 'HR Management'],
    certifications: ['SHRM-CP', 'PHR']
  },
  {
    id: '2',
    first_name: 'Fatima',
    last_name: 'Al-Zahra',
    first_name_ar: 'فاطمة',
    last_name_ar: 'الزهراء',
    email: 'fatima.alzahra@company.com',
    phone: '+966501234568',
    department: 'Finance',
    position: 'Senior Accountant',
    position_ar: 'محاسب أول',
    salary: 12000,
    hire_date: '2021-06-20',
    is_saudi: true,
    nationality: 'Saudi',
    status: 'active',
    employee_number: 'EMP002',
    national_id: '1234567891',
    performance_score: 88,
    skills: ['Financial Analysis', 'SAP', 'Excel'],
    certifications: ['CPA', 'CMA']
  },
  {
    id: '3',
    first_name: 'Mohammed',
    last_name: 'Al-Otaibi',
    first_name_ar: 'محمد',
    last_name_ar: 'العتيبي',
    email: 'mohammed.alotaibi@company.com',
    phone: '+966501234569',
    department: 'Information Technology',
    position: 'Software Developer',
    position_ar: 'مطور برمجيات',
    salary: 18000,
    hire_date: '2020-03-10',
    is_saudi: true,
    nationality: 'Saudi',
    status: 'active',
    employee_number: 'EMP003',
    national_id: '1234567892',
    performance_score: 95,
    skills: ['React', 'Node.js', 'Python', 'AWS'],
    certifications: ['AWS Solutions Architect', 'React Developer']
  },
  {
    id: '4',
    first_name: 'Sarah',
    last_name: 'Al-Mansouri',
    first_name_ar: 'سارة',
    last_name_ar: 'المنصوري',
    email: 'sarah.almansouri@company.com',
    phone: '+966501234570',
    department: 'Marketing',
    position: 'Marketing Specialist',
    position_ar: 'أخصائي تسويق',
    salary: 10000,
    hire_date: '2023-02-01',
    is_saudi: true,
    nationality: 'Saudi',
    status: 'active',
    employee_number: 'EMP004',
    national_id: '1234567893',
    performance_score: 85,
    skills: ['Digital Marketing', 'Social Media', 'Content Creation'],
    certifications: ['Google Ads', 'Facebook Marketing']
  },
  {
    id: '5',
    first_name: 'Omar',
    last_name: 'Al-Ghamdi',
    first_name_ar: 'عمر',
    last_name_ar: 'الغامدي',
    email: 'omar.alghamdi@company.com',
    phone: '+966501234571',
    department: 'Operations',
    position: 'Operations Manager',
    position_ar: 'مدير العمليات',
    salary: 16000,
    hire_date: '2019-09-15',
    is_saudi: true,
    nationality: 'Saudi',
    status: 'active',
    employee_number: 'EMP005',
    national_id: '1234567894',
    performance_score: 90,
    skills: ['Project Management', 'Process Improvement', 'Lean Six Sigma'],
    certifications: ['PMP', 'Lean Six Sigma Black Belt']
  },
  {
    id: '6',
    first_name: 'Aisha',
    last_name: 'Khan',
    first_name_ar: 'عائشة',
    last_name_ar: 'خان',
    email: 'aisha.khan@company.com',
    phone: '+966501234572',
    department: 'Human Resources',
    position: 'HR Specialist',
    position_ar: 'أخصائي موارد بشرية',
    salary: 8000,
    hire_date: '2023-08-01',
    is_saudi: false,
    nationality: 'Pakistani',
    status: 'active',
    employee_number: 'EMP006',
    iqama_number: '2345678901',
    performance_score: 87,
    skills: ['Recruitment', 'Employee Relations', 'HRIS'],
    certifications: ['CIPD']
  }
];

export const generateDummyPositions = (): DummyPosition[] => [
  // Executive Level
  { id: '1', title: 'Chief Executive Officer', titleAr: 'الرئيس التنفيذي', department: 'Executive', level: 'Executive', status: 'active', skillsRequired: 15, skillsMatched: 12, description: 'Lead company strategy and operations', requirements: ['MBA', '10+ years experience'], responsibilities: ['Strategic planning', 'Leadership'], count: 1 },
  { id: '2', title: 'Chief Financial Officer', titleAr: 'المدير المالي التنفيذي', department: 'Finance', level: 'Executive', status: 'active', skillsRequired: 15, skillsMatched: 12, description: 'Oversee financial operations', requirements: ['CPA', '10+ years experience'], responsibilities: ['Financial strategy', 'Risk management'], count: 1 },
  { id: '3', title: 'Chief Operating Officer', titleAr: 'مدير العمليات التنفيذي', department: 'Operations', level: 'Executive', status: 'active', skillsRequired: 15, skillsMatched: 11, description: 'Manage daily operations', requirements: ['MBA', '10+ years experience'], responsibilities: ['Operations oversight', 'Process optimization'], count: 1 },
  { id: '4', title: 'Chief Technology Officer', titleAr: 'مدير التكنولوجيا التنفيذي', department: 'Information Technology', level: 'Executive', status: 'active', skillsRequired: 15, skillsMatched: 13, description: 'Lead technology strategy', requirements: ['Technical degree', '10+ years experience'], responsibilities: ['Technology strategy', 'Innovation'], count: 1 },
  { id: '5', title: 'Chief Human Resources Officer', titleAr: 'مدير الموارد البشرية التنفيذي', department: 'Human Resources', level: 'Executive', status: 'active', skillsRequired: 15, skillsMatched: 12, description: 'Lead HR strategy', requirements: ['HR degree', '10+ years experience'], responsibilities: ['HR strategy', 'Organizational development'], count: 1 },

  // Senior Management
  { id: '6', title: 'General Manager', titleAr: 'المدير العام', department: 'Management', level: 'Senior', status: 'active', skillsRequired: 12, skillsMatched: 10, description: 'Overall business management', requirements: ['Bachelor degree', '8+ years experience'], responsibilities: ['Business oversight', 'Strategic planning'], count: 2 },
  { id: '7', title: 'Deputy General Manager', titleAr: 'نائب المدير العام', department: 'Management', level: 'Senior', status: 'active', skillsRequired: 11, skillsMatched: 9, description: 'Assist general manager', requirements: ['Bachelor degree', '7+ years experience'], responsibilities: ['Management support', 'Operations'], count: 1 },
  { id: '8', title: 'Regional Manager', titleAr: 'المدير الإقليمي', department: 'Management', level: 'Senior', status: 'active', skillsRequired: 10, skillsMatched: 8, description: 'Manage regional operations', requirements: ['Bachelor degree', '6+ years experience'], responsibilities: ['Regional oversight', 'Team management'], count: 3 },
  { id: '9', title: 'Division Manager', titleAr: 'مدير القسم', department: 'Management', level: 'Senior', status: 'active', skillsRequired: 10, skillsMatched: 8, description: 'Manage division operations', requirements: ['Bachelor degree', '5+ years experience'], responsibilities: ['Division management', 'Performance monitoring'], count: 4 },

  // Finance Department
  { id: '10', title: 'Finance Manager', titleAr: 'مدير المالية', department: 'Finance', level: 'Senior', status: 'active', skillsRequired: 10, skillsMatched: 8, description: 'Manage financial operations', requirements: ['Finance degree', '5+ years experience'], responsibilities: ['Financial planning', 'Budget management'], count: 2 },
  { id: '11', title: 'Assistant Finance Manager', titleAr: 'مساعد مدير المالية', department: 'Finance', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 6, description: 'Support finance manager', requirements: ['Finance degree', '3+ years experience'], responsibilities: ['Financial analysis', 'Reporting'], count: 2 },
  { id: '12', title: 'Senior Accountant', titleAr: 'محاسب أول', department: 'Finance', level: 'Senior', status: 'active', skillsRequired: 8, skillsMatched: 7, description: 'Handle complex accounting', requirements: ['Accounting degree', '4+ years experience'], responsibilities: ['Financial reporting', 'Account reconciliation'], count: 3 },
  { id: '13', title: 'Accountant', titleAr: 'محاسب', department: 'Finance', level: 'Mid-Level', status: 'active', skillsRequired: 6, skillsMatched: 5, description: 'General accounting duties', requirements: ['Accounting degree', '2+ years experience'], responsibilities: ['Bookkeeping', 'Financial records'], count: 5 },
  { id: '14', title: 'Junior Accountant', titleAr: 'محاسب مبتدئ', department: 'Finance', level: 'Entry', status: 'active', skillsRequired: 4, skillsMatched: 3, description: 'Entry-level accounting', requirements: ['Accounting degree', '1+ years experience'], responsibilities: ['Basic accounting', 'Data entry'], count: 3 },
  { id: '15', title: 'Financial Analyst', titleAr: 'محلل مالي', department: 'Finance', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 5, description: 'Financial analysis and reporting', requirements: ['Finance degree', '2+ years experience'], responsibilities: ['Financial analysis', 'Budget planning'], count: 3 },
  { id: '16', title: 'Cost Accountant', titleAr: 'محاسب تكاليف', department: 'Finance', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'Cost analysis and control', requirements: ['Accounting degree', '3+ years experience'], responsibilities: ['Cost analysis', 'Budget control'], count: 2 },
  { id: '17', title: 'Auditor', titleAr: 'مدقق حسابات', department: 'Finance', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 6, description: 'Internal and external auditing', requirements: ['Accounting degree', '3+ years experience'], responsibilities: ['Audit procedures', 'Compliance review'], count: 2 },
  { id: '18', title: 'Treasury Specialist', titleAr: 'أخصائي خزينة', department: 'Finance', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 5, description: 'Cash management and treasury', requirements: ['Finance degree', '2+ years experience'], responsibilities: ['Cash flow management', 'Banking relations'], count: 1 },
  { id: '19', title: 'Payroll Specialist', titleAr: 'أخصائي رواتب', department: 'Finance', level: 'Mid-Level', status: 'active', skillsRequired: 6, skillsMatched: 5, description: 'Payroll processing and management', requirements: ['Business degree', '2+ years experience'], responsibilities: ['Payroll processing', 'Benefits administration'], count: 2 },

  // Human Resources Department
  { id: '20', title: 'HR Manager', titleAr: 'مدير الموارد البشرية', department: 'Human Resources', level: 'Senior', status: 'active', skillsRequired: 10, skillsMatched: 8, description: 'Manage HR operations', requirements: ['HR degree', '5+ years experience'], responsibilities: ['HR strategy', 'Team management'], count: 2 },
  { id: '21', title: 'Assistant HR Manager', titleAr: 'مساعد مدير الموارد البشرية', department: 'Human Resources', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 6, description: 'Support HR manager', requirements: ['HR degree', '3+ years experience'], responsibilities: ['HR operations', 'Policy implementation'], count: 2 },
  { id: '22', title: 'HR Business Partner', titleAr: 'شريك أعمال الموارد البشرية', department: 'Human Resources', level: 'Senior', status: 'active', skillsRequired: 10, skillsMatched: 8, description: 'Strategic HR partner', requirements: ['HR degree', '5+ years experience'], responsibilities: ['Strategic planning', 'Business alignment'], count: 2 },
  { id: '23', title: 'HR Specialist', titleAr: 'أخصائي موارد بشرية', department: 'Human Resources', level: 'Mid-Level', status: 'active', skillsRequired: 6, skillsMatched: 5, description: 'General HR functions', requirements: ['HR degree', '2+ years experience'], responsibilities: ['Employee relations', 'HR administration'], count: 4 },
  { id: '24', title: 'Recruitment Specialist', titleAr: 'أخصائي توظيف', department: 'Human Resources', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'Recruitment and selection', requirements: ['HR degree', '2+ years experience'], responsibilities: ['Talent acquisition', 'Candidate screening'], count: 3 },
  { id: '25', title: 'Training Specialist', titleAr: 'أخصائي تدريب', department: 'Human Resources', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 5, description: 'Training and development', requirements: ['Education degree', '2+ years experience'], responsibilities: ['Training programs', 'Skill development'], count: 2 },
  { id: '26', title: 'Compensation & Benefits Specialist', titleAr: 'أخصائي التعويضات والمزايا', department: 'Human Resources', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'Compensation and benefits management', requirements: ['HR degree', '3+ years experience'], responsibilities: ['Salary benchmarking', 'Benefits administration'], count: 2 },
  { id: '27', title: 'Employee Relations Specialist', titleAr: 'أخصائي علاقات الموظفين', department: 'Human Resources', level: 'Mid-Level', status: 'active', skillsRequired: 6, skillsMatched: 5, description: 'Employee relations and engagement', requirements: ['HR degree', '2+ years experience'], responsibilities: ['Employee engagement', 'Conflict resolution'], count: 2 },
  { id: '28', title: 'HRIS Specialist', titleAr: 'أخصائي نظم معلومات الموارد البشرية', department: 'Human Resources', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'HR information systems', requirements: ['IT/HR degree', '2+ years experience'], responsibilities: ['HRIS management', 'Data analysis'], count: 1 },
  { id: '29', title: 'HR Coordinator', titleAr: 'منسق موارد بشرية', department: 'Human Resources', level: 'Entry', status: 'active', skillsRequired: 4, skillsMatched: 3, description: 'HR coordination and support', requirements: ['Business degree', '1+ years experience'], responsibilities: ['Administrative support', 'Documentation'], count: 3 },

  // Information Technology Department
  { id: '30', title: 'IT Manager', titleAr: 'مدير تقنية المعلومات', department: 'Information Technology', level: 'Senior', status: 'active', skillsRequired: 12, skillsMatched: 10, description: 'Manage IT operations', requirements: ['IT degree', '5+ years experience'], responsibilities: ['IT strategy', 'Team management'], count: 1 },
  { id: '31', title: 'System Administrator', titleAr: 'مدير نظم', department: 'Information Technology', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 7, description: 'System administration', requirements: ['IT degree', '3+ years experience'], responsibilities: ['Server management', 'System maintenance'], count: 2 },
  { id: '32', title: 'Network Administrator', titleAr: 'مدير شبكات', department: 'Information Technology', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 6, description: 'Network management', requirements: ['IT degree', '3+ years experience'], responsibilities: ['Network configuration', 'Security management'], count: 2 },
  { id: '33', title: 'Software Engineer', titleAr: 'مهندس برمجيات', department: 'Information Technology', level: 'Mid-Level', status: 'active', skillsRequired: 9, skillsMatched: 7, description: 'Software development', requirements: ['Computer Science degree', '3+ years experience'], responsibilities: ['Software design', 'Code development'], count: 4 },
  { id: '34', title: 'Senior Software Engineer', titleAr: 'مهندس برمجيات أول', department: 'Information Technology', level: 'Senior', status: 'active', skillsRequired: 11, skillsMatched: 9, description: 'Senior software development', requirements: ['Computer Science degree', '5+ years experience'], responsibilities: ['Technical leadership', 'Code review'], count: 2 },
  { id: '35', title: 'Software Developer', titleAr: 'مطور برمجيات', department: 'Information Technology', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'Application development', requirements: ['Programming skills', '2+ years experience'], responsibilities: ['Code development', 'Testing'], count: 5 },
  { id: '36', title: 'Database Administrator', titleAr: 'مدير قواعد البيانات', department: 'Information Technology', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 7, description: 'Database management', requirements: ['Database certification', '3+ years experience'], responsibilities: ['Database design', 'Performance optimization'], count: 2 },
  { id: '37', title: 'Cybersecurity Specialist', titleAr: 'أخصائي أمن سيبراني', department: 'Information Technology', level: 'Mid-Level', status: 'active', skillsRequired: 9, skillsMatched: 7, description: 'Information security', requirements: ['Security certification', '3+ years experience'], responsibilities: ['Security monitoring', 'Threat analysis'], count: 2 },
  { id: '38', title: 'IT Support Specialist', titleAr: 'أخصائي دعم تقني', department: 'Information Technology', level: 'Entry', status: 'active', skillsRequired: 5, skillsMatched: 4, description: 'Technical support', requirements: ['IT certification', '1+ years experience'], responsibilities: ['User support', 'Troubleshooting'], count: 3 },
  { id: '39', title: 'Web Developer', titleAr: 'مطور مواقع', department: 'Information Technology', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'Web development', requirements: ['Web technologies', '2+ years experience'], responsibilities: ['Website development', 'UI/UX implementation'], count: 2 },
  { id: '40', title: 'Mobile App Developer', titleAr: 'مطور تطبيقات محمولة', department: 'Information Technology', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 6, description: 'Mobile app development', requirements: ['Mobile development skills', '2+ years experience'], responsibilities: ['App development', 'Testing'], count: 2 },

  // Engineering Department
  { id: '41', title: 'Chief Engineer', titleAr: 'كبير المهندسين', department: 'Engineering', level: 'Senior', status: 'active', skillsRequired: 12, skillsMatched: 10, description: 'Lead engineering operations', requirements: ['Engineering degree', '8+ years experience'], responsibilities: ['Engineering leadership', 'Technical oversight'], count: 1 },
  { id: '42', title: 'Project Engineer', titleAr: 'مهندس مشاريع', department: 'Engineering', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 7, description: 'Project engineering', requirements: ['Engineering degree', '3+ years experience'], responsibilities: ['Project design', 'Technical coordination'], count: 4 },
  { id: '43', title: 'Mechanical Engineer', titleAr: 'مهندس ميكانيكي', department: 'Engineering', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 6, description: 'Mechanical engineering', requirements: ['Mechanical Engineering degree', '2+ years experience'], responsibilities: ['Design', 'Analysis'], count: 3 },
  { id: '44', title: 'Electrical Engineer', titleAr: 'مهندس كهربائي', department: 'Engineering', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 6, description: 'Electrical engineering', requirements: ['Electrical Engineering degree', '2+ years experience'], responsibilities: ['Electrical design', 'System analysis'], count: 3 },
  { id: '45', title: 'Civil Engineer', titleAr: 'مهندس مدني', department: 'Engineering', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 6, description: 'Civil engineering', requirements: ['Civil Engineering degree', '2+ years experience'], responsibilities: ['Structural design', 'Project management'], count: 3 },
  { id: '46', title: 'Chemical Engineer', titleAr: 'مهندس كيميائي', department: 'Engineering', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 6, description: 'Chemical engineering', requirements: ['Chemical Engineering degree', '2+ years experience'], responsibilities: ['Process design', 'Safety analysis'], count: 2 },
  { id: '47', title: 'Quality Engineer', titleAr: 'مهندس جودة', department: 'Engineering', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'Quality assurance', requirements: ['Engineering degree', '2+ years experience'], responsibilities: ['Quality control', 'Process improvement'], count: 2 },
  { id: '48', title: 'Safety Engineer', titleAr: 'مهندس سلامة', department: 'Engineering', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 6, description: 'Safety engineering', requirements: ['Safety certification', '3+ years experience'], responsibilities: ['Safety protocols', 'Risk assessment'], count: 2 },
  { id: '49', title: 'Maintenance Engineer', titleAr: 'مهندس صيانة', department: 'Engineering', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'Maintenance engineering', requirements: ['Engineering degree', '2+ years experience'], responsibilities: ['Preventive maintenance', 'Equipment optimization'], count: 3 },
  { id: '50', title: 'Design Engineer', titleAr: 'مهندس تصميم', department: 'Engineering', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 6, description: 'Design engineering', requirements: ['Engineering degree', '2+ years experience'], responsibilities: ['Product design', 'CAD modeling'], count: 2 },

  // Operations Department
  { id: '51', title: 'Operations Manager', titleAr: 'مدير العمليات', department: 'Operations', level: 'Senior', status: 'active', skillsRequired: 10, skillsMatched: 8, description: 'Manage operations', requirements: ['Business degree', '5+ years experience'], responsibilities: ['Operations oversight', 'Process improvement'], count: 2 },
  { id: '52', title: 'Assistant Operations Manager', titleAr: 'مساعد مدير العمليات', department: 'Operations', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 6, description: 'Support operations manager', requirements: ['Business degree', '3+ years experience'], responsibilities: ['Operations support', 'Team coordination'], count: 2 },
  { id: '53', title: 'Production Manager', titleAr: 'مدير الإنتاج', department: 'Operations', level: 'Senior', status: 'active', skillsRequired: 10, skillsMatched: 8, description: 'Manage production', requirements: ['Engineering/Business degree', '5+ years experience'], responsibilities: ['Production planning', 'Quality control'], count: 2 },
  { id: '54', title: 'Production Supervisor', titleAr: 'مشرف إنتاج', department: 'Operations', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'Supervise production', requirements: ['Technical diploma', '3+ years experience'], responsibilities: ['Production oversight', 'Team management'], count: 4 },
  { id: '55', title: 'Quality Control Manager', titleAr: 'مدير مراقبة الجودة', department: 'Operations', level: 'Senior', status: 'active', skillsRequired: 9, skillsMatched: 7, description: 'Quality control management', requirements: ['Quality certification', '4+ years experience'], responsibilities: ['Quality systems', 'Process improvement'], count: 1 },
  { id: '56', title: 'Quality Control Inspector', titleAr: 'مفتش مراقبة جودة', department: 'Operations', level: 'Entry', status: 'active', skillsRequired: 5, skillsMatched: 4, description: 'Quality inspection', requirements: ['Technical training', '1+ years experience'], responsibilities: ['Product inspection', 'Testing'], count: 3 },
  { id: '57', title: 'Warehouse Manager', titleAr: 'مدير المستودع', department: 'Operations', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'Warehouse operations', requirements: ['Logistics experience', '3+ years experience'], responsibilities: ['Inventory management', 'Logistics coordination'], count: 2 },
  { id: '58', title: 'Logistics Coordinator', titleAr: 'منسق لوجستي', department: 'Operations', level: 'Entry', status: 'active', skillsRequired: 5, skillsMatched: 4, description: 'Logistics coordination', requirements: ['Business degree', '1+ years experience'], responsibilities: ['Shipping coordination', 'Documentation'], count: 3 },
  { id: '59', title: 'Supply Chain Specialist', titleAr: 'أخصائي سلسلة التوريد', department: 'Operations', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'Supply chain management', requirements: ['Supply chain certification', '2+ years experience'], responsibilities: ['Vendor management', 'Procurement'], count: 2 },
  { id: '60', title: 'Project Manager', titleAr: 'مدير مشروع', department: 'Operations', level: 'Senior', status: 'active', skillsRequired: 9, skillsMatched: 7, description: 'Project management', requirements: ['PMP certification', '4+ years experience'], responsibilities: ['Project planning', 'Risk management'], count: 3 },

  // Sales Department
  { id: '61', title: 'Sales Manager', titleAr: 'مدير المبيعات', department: 'Sales', level: 'Senior', status: 'active', skillsRequired: 9, skillsMatched: 7, description: 'Sales management', requirements: ['Business degree', '5+ years experience'], responsibilities: ['Sales strategy', 'Team management'], count: 2 },
  { id: '62', title: 'Senior Sales Executive', titleAr: 'مندوب مبيعات أول', department: 'Sales', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'Senior sales role', requirements: ['Sales experience', '3+ years experience'], responsibilities: ['Client management', 'Sales targets'], count: 3 },
  { id: '63', title: 'Sales Executive', titleAr: 'مندوب مبيعات', department: 'Sales', level: 'Entry', status: 'active', skillsRequired: 5, skillsMatched: 4, description: 'Sales execution', requirements: ['Communication skills', '1+ years experience'], responsibilities: ['Lead generation', 'Customer service'], count: 5 },
  { id: '64', title: 'Business Development Manager', titleAr: 'مدير تطوير الأعمال', department: 'Sales', level: 'Senior', status: 'active', skillsRequired: 9, skillsMatched: 8, description: 'Business development', requirements: ['Business degree', '5+ years experience'], responsibilities: ['Strategic partnerships', 'Market expansion'], count: 1 },
  { id: '65', title: 'Account Manager', titleAr: 'مدير حسابات', department: 'Sales', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'Account management', requirements: ['Business degree', '3+ years experience'], responsibilities: ['Client relationships', 'Account growth'], count: 3 },
  { id: '66', title: 'Customer Service Manager', titleAr: 'مدير خدمة العملاء', department: 'Sales', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'Customer service management', requirements: ['Service experience', '3+ years experience'], responsibilities: ['Service quality', 'Team management'], count: 1 },
  { id: '67', title: 'Customer Service Representative', titleAr: 'ممثل خدمة عملاء', department: 'Sales', level: 'Entry', status: 'active', skillsRequired: 4, skillsMatched: 3, description: 'Customer service', requirements: ['Communication skills', '1+ years experience'], responsibilities: ['Customer support', 'Issue resolution'], count: 4 },

  // Marketing Department
  { id: '68', title: 'Marketing Manager', titleAr: 'مدير التسويق', department: 'Marketing', level: 'Senior', status: 'active', skillsRequired: 9, skillsMatched: 8, description: 'Marketing management', requirements: ['Marketing degree', '5+ years experience'], responsibilities: ['Marketing strategy', 'Campaign management'], count: 1 },
  { id: '69', title: 'Digital Marketing Specialist', titleAr: 'أخصائي تسويق رقمي', department: 'Marketing', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'Digital marketing', requirements: ['Digital marketing certification', '2+ years experience'], responsibilities: ['Online campaigns', 'Social media'], count: 2 },
  { id: '70', title: 'Marketing Specialist', titleAr: 'أخصائي تسويق', department: 'Marketing', level: 'Mid-Level', status: 'active', skillsRequired: 6, skillsMatched: 5, description: 'General marketing', requirements: ['Marketing degree', '2+ years experience'], responsibilities: ['Campaign execution', 'Market research'], count: 3 },
  { id: '71', title: 'Content Creator', titleAr: 'منشئ محتوى', department: 'Marketing', level: 'Entry', status: 'active', skillsRequired: 5, skillsMatched: 4, description: 'Content creation', requirements: ['Creative skills', '1+ years experience'], responsibilities: ['Content development', 'Creative design'], count: 2 },
  { id: '72', title: 'Brand Manager', titleAr: 'مدير العلامة التجارية', department: 'Marketing', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 6, description: 'Brand management', requirements: ['Marketing degree', '3+ years experience'], responsibilities: ['Brand strategy', 'Brand positioning'], count: 1 },
  { id: '73', title: 'Market Research Analyst', titleAr: 'محلل أبحاث السوق', department: 'Marketing', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 5, description: 'Market research', requirements: ['Research skills', '2+ years experience'], responsibilities: ['Market analysis', 'Data interpretation'], count: 1 },

  // Procurement Department
  { id: '74', title: 'Procurement Manager', titleAr: 'مدير المشتريات', department: 'Procurement', level: 'Senior', status: 'active', skillsRequired: 9, skillsMatched: 7, description: 'Procurement management', requirements: ['Supply chain degree', '5+ years experience'], responsibilities: ['Procurement strategy', 'Vendor management'], count: 1 },
  { id: '75', title: 'Purchasing Officer', titleAr: 'مسؤول مشتريات', department: 'Procurement', level: 'Mid-Level', status: 'active', skillsRequired: 6, skillsMatched: 5, description: 'Purchasing operations', requirements: ['Business degree', '2+ years experience'], responsibilities: ['Purchase orders', 'Vendor relations'], count: 3 },
  { id: '76', title: 'Buyer', titleAr: 'مشتري', department: 'Procurement', level: 'Entry', status: 'active', skillsRequired: 4, skillsMatched: 3, description: 'Purchasing execution', requirements: ['Business knowledge', '1+ years experience'], responsibilities: ['Order processing', 'Price negotiation'], count: 2 },

  // Legal Department
  { id: '77', title: 'Legal Manager', titleAr: 'مدير شؤون قانونية', department: 'Legal', level: 'Senior', status: 'active', skillsRequired: 11, skillsMatched: 9, description: 'Legal affairs management', requirements: ['Law degree', '5+ years experience'], responsibilities: ['Legal oversight', 'Contract management'], count: 1 },
  { id: '78', title: 'Legal Counsel', titleAr: 'مستشار قانوني', department: 'Legal', level: 'Mid-Level', status: 'active', skillsRequired: 9, skillsMatched: 7, description: 'Legal counseling', requirements: ['Law degree', '3+ years experience'], responsibilities: ['Legal advice', 'Contract review'], count: 2 },
  { id: '79', title: 'Compliance Officer', titleAr: 'مسؤول الامتثال', department: 'Legal', level: 'Mid-Level', status: 'active', skillsRequired: 8, skillsMatched: 6, description: 'Compliance management', requirements: ['Law/Business degree', '3+ years experience'], responsibilities: ['Regulatory compliance', 'Policy enforcement'], count: 1 },

  // Health & Safety Department
  { id: '80', title: 'Health & Safety Manager', titleAr: 'مدير الصحة والسلامة', department: 'Health & Safety', level: 'Senior', status: 'active', skillsRequired: 10, skillsMatched: 8, description: 'Health and safety management', requirements: ['Safety certification', '5+ years experience'], responsibilities: ['Safety programs', 'Risk management'], count: 1 },
  { id: '81', title: 'Safety Officer', titleAr: 'مسؤول السلامة', department: 'Health & Safety', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'Safety operations', requirements: ['Safety training', '2+ years experience'], responsibilities: ['Safety inspections', 'Incident investigation'], count: 2 },
  { id: '82', title: 'Environmental Specialist', titleAr: 'أخصائي بيئي', department: 'Health & Safety', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 5, description: 'Environmental compliance', requirements: ['Environmental degree', '2+ years experience'], responsibilities: ['Environmental monitoring', 'Compliance reporting'], count: 1 },

  // Administrative Department
  { id: '83', title: 'Administrative Manager', titleAr: 'مدير إداري', department: 'Administration', level: 'Senior', status: 'active', skillsRequired: 8, skillsMatched: 7, description: 'Administrative management', requirements: ['Business degree', '4+ years experience'], responsibilities: ['Administrative oversight', 'Office management'], count: 1 },
  { id: '84', title: 'Office Manager', titleAr: 'مدير مكتب', department: 'Administration', level: 'Mid-Level', status: 'active', skillsRequired: 6, skillsMatched: 5, description: 'Office management', requirements: ['Administrative experience', '2+ years experience'], responsibilities: ['Office operations', 'Staff coordination'], count: 2 },
  { id: '85', title: 'Administrative Assistant', titleAr: 'مساعد إداري', department: 'Administration', level: 'Entry', status: 'active', skillsRequired: 4, skillsMatched: 3, description: 'Administrative support', requirements: ['Office skills', '1+ years experience'], responsibilities: ['Document management', 'Communication support'], count: 4 },
  { id: '86', title: 'Secretary', titleAr: 'سكرتير', department: 'Administration', level: 'Entry', status: 'active', skillsRequired: 4, skillsMatched: 3, description: 'Secretarial duties', requirements: ['Secretarial training', '1+ years experience'], responsibilities: ['Correspondence', 'Appointment scheduling'], count: 3 },
  { id: '87', title: 'Receptionist', titleAr: 'موظف استقبال', department: 'Administration', level: 'Entry', status: 'active', skillsRequired: 3, skillsMatched: 3, description: 'Reception duties', requirements: ['Communication skills'], responsibilities: ['Visitor reception', 'Phone handling'], count: 2 },
  { id: '88', title: 'Data Entry Clerk', titleAr: 'مدخل بيانات', department: 'Administration', level: 'Entry', status: 'active', skillsRequired: 3, skillsMatched: 2, description: 'Data entry', requirements: ['Computer skills'], responsibilities: ['Data input', 'Record maintenance'], count: 3 },

  // Maintenance Department
  { id: '89', title: 'Maintenance Manager', titleAr: 'مدير الصيانة', department: 'Maintenance', level: 'Senior', status: 'active', skillsRequired: 8, skillsMatched: 7, description: 'Maintenance management', requirements: ['Technical degree', '5+ years experience'], responsibilities: ['Maintenance planning', 'Team management'], count: 1 },
  { id: '90', title: 'Maintenance Supervisor', titleAr: 'مشرف صيانة', department: 'Maintenance', level: 'Mid-Level', status: 'active', skillsRequired: 6, skillsMatched: 5, description: 'Maintenance supervision', requirements: ['Technical diploma', '3+ years experience'], responsibilities: ['Work coordination', 'Quality control'], count: 2 },
  { id: '91', title: 'Maintenance Technician', titleAr: 'فني صيانة', department: 'Maintenance', level: 'Entry', status: 'active', skillsRequired: 5, skillsMatched: 4, description: 'Maintenance work', requirements: ['Technical training', '1+ years experience'], responsibilities: ['Equipment repair', 'Preventive maintenance'], count: 5 },
  { id: '92', title: 'Electrician', titleAr: 'كهربائي', department: 'Maintenance', level: 'Entry', status: 'active', skillsRequired: 5, skillsMatched: 4, description: 'Electrical work', requirements: ['Electrical certification', '2+ years experience'], responsibilities: ['Electrical installation', 'Troubleshooting'], count: 3 },
  { id: '93', title: 'Plumber', titleAr: 'سباك', department: 'Maintenance', level: 'Entry', status: 'active', skillsRequired: 4, skillsMatched: 3, description: 'Plumbing work', requirements: ['Plumbing certification', '1+ years experience'], responsibilities: ['Plumbing installation', 'Repairs'], count: 2 },
  { id: '94', title: 'HVAC Technician', titleAr: 'فني تكييف', department: 'Maintenance', level: 'Entry', status: 'active', skillsRequired: 5, skillsMatched: 4, description: 'HVAC maintenance', requirements: ['HVAC certification', '2+ years experience'], responsibilities: ['AC maintenance', 'System installation'], count: 2 },

  // Security Department
  { id: '95', title: 'Security Manager', titleAr: 'مدير الأمن', department: 'Security', level: 'Senior', status: 'active', skillsRequired: 8, skillsMatched: 7, description: 'Security management', requirements: ['Security certification', '5+ years experience'], responsibilities: ['Security planning', 'Team management'], count: 1 },
  { id: '96', title: 'Security Supervisor', titleAr: 'مشرف أمن', department: 'Security', level: 'Mid-Level', status: 'active', skillsRequired: 6, skillsMatched: 5, description: 'Security supervision', requirements: ['Security training', '3+ years experience'], responsibilities: ['Shift management', 'Security protocols'], count: 2 },
  { id: '97', title: 'Security Guard', titleAr: 'حارس أمن', department: 'Security', level: 'Entry', status: 'active', skillsRequired: 3, skillsMatched: 3, description: 'Security duties', requirements: ['Security license'], responsibilities: ['Facility protection', 'Access control'], count: 6 },

  // Transport Department
  { id: '98', title: 'Transport Manager', titleAr: 'مدير النقل', department: 'Transport', level: 'Mid-Level', status: 'active', skillsRequired: 7, skillsMatched: 6, description: 'Transport management', requirements: ['Transport license', '3+ years experience'], responsibilities: ['Fleet management', 'Route planning'], count: 1 },
  { id: '99', title: 'Driver', titleAr: 'سائق', department: 'Transport', level: 'Entry', status: 'active', skillsRequired: 3, skillsMatched: 3, description: 'Driving duties', requirements: ['Valid driving license'], responsibilities: ['Vehicle operation', 'Safety compliance'], count: 4 },

  // Business Analysis
  { id: '100', title: 'Business Analyst', titleAr: 'محلل أعمال', department: 'Operations', level: 'Mid-Level',
    status: 'active',
    skillsRequired: 7,
    skillsMatched: 6,
    description: 'Analyze business processes and requirements',
    requirements: ['Bachelor in Business', '3+ years experience', 'Analytical skills'],
    responsibilities: ['Requirements gathering', 'Process analysis', 'Documentation'],
    count: 3
  },
  {
    id: '13',
    title: 'Quality Assurance Engineer',
    titleAr: 'مهندس ضمان الجودة',
    department: 'Information Technology',
    level: 'Mid-Level',
    status: 'active',
    skillsRequired: 6,
    skillsMatched: 5,
    description: 'Ensure software quality through testing',
    requirements: ['Bachelor in Computer Science', '2+ years experience', 'Testing frameworks'],
    responsibilities: ['Test planning', 'Test execution', 'Bug reporting'],
    count: 2
  },
  {
    id: '14',
    title: 'DevOps Engineer',
    titleAr: 'مهندس DevOps',
    department: 'Information Technology',
    level: 'Senior',
    status: 'active',
    skillsRequired: 9,
    skillsMatched: 7,
    description: 'Manage deployment and infrastructure automation',
    requirements: ['Bachelor in Computer Science', '4+ years experience', 'Cloud platforms'],
    responsibilities: ['CI/CD management', 'Infrastructure automation', 'Monitoring'],
    count: 2
  },
  {
    id: '15',
    title: 'Data Scientist',
    titleAr: 'عالم البيانات',
    department: 'Information Technology',
    level: 'Senior',
    status: 'active',
    skillsRequired: 10,
    skillsMatched: 8,
    description: 'Extract insights from data using advanced analytics',
    requirements: ['Master in Data Science', '3+ years experience', 'Machine learning'],
    responsibilities: ['Data analysis', 'Model development', 'Insights generation'],
    count: 1
  }
];

export const generateDummyDepartments = (): DummyDepartment[] => [
  {
    id: '1',
    name: 'Human Resources',
    name_ar: 'الموارد البشرية',
    manager: 'Ahmed Al-Rashid',
    employee_count: 12,
    budget: 500000,
    description: 'Manages employee lifecycle and organizational development'
  },
  {
    id: '2',
    name: 'Information Technology',
    name_ar: 'تقنية المعلومات',
    manager: 'Mohammed Al-Otaibi',
    employee_count: 25,
    budget: 1200000,
    description: 'Develops and maintains technology infrastructure'
  },
  {
    id: '3',
    name: 'Finance',
    name_ar: 'المالية',
    manager: 'Fatima Al-Zahra',
    employee_count: 8,
    budget: 350000,
    description: 'Manages financial operations and reporting'
  },
  {
    id: '4',
    name: 'Marketing',
    name_ar: 'التسويق',
    manager: 'Sarah Al-Mansouri',
    employee_count: 6,
    budget: 400000,
    description: 'Handles brand promotion and customer engagement'
  },
  {
    id: '5',
    name: 'Operations',
    name_ar: 'العمليات',
    manager: 'Omar Al-Ghamdi',
    employee_count: 15,
    budget: 800000,
    description: 'Oversees daily operational activities'
  }
];

export const generateDummySkills = (): DummySkill[] => [
  {
    id: '1',
    name: 'Leadership',
    name_ar: 'القيادة',
    category: 'Management',
    type: 'behavioral',
    level: 'advanced',
    industry_relevance: 'Universal',
    description: 'Ability to guide and motivate teams',
    assessment_method: '360-degree feedback'
  },
  {
    id: '2',
    name: 'React Development',
    name_ar: 'تطوير React',
    category: 'Programming',
    type: 'technical',
    level: 'intermediate',
    industry_relevance: 'Technology',
    description: 'Frontend development using React framework',
    assessment_method: 'Technical assessment'
  },
  {
    id: '3',
    name: 'Financial Analysis',
    name_ar: 'التحليل المالي',
    category: 'Finance',
    type: 'technical',
    level: 'advanced',
    industry_relevance: 'Finance',
    description: 'Analyzing financial data and trends',
    assessment_method: 'Case study analysis'
  },
  {
    id: '4',
    name: 'Communication',
    name_ar: 'التواصل',
    category: 'Soft Skills',
    type: 'behavioral',
    level: 'intermediate',
    industry_relevance: 'Universal',
    description: 'Effective verbal and written communication',
    assessment_method: 'Presentation and writing samples'
  },
  {
    id: '5',
    name: 'Project Management',
    name_ar: 'إدارة المشاريع',
    category: 'Management',
    type: 'technical',
    level: 'advanced',
    industry_relevance: 'Universal',
    description: 'Planning and executing projects',
    assessment_method: 'PMP certification or equivalent'
  }
];

export const generateDummyTraining = (): DummyTraining[] => [
  {
    id: '1',
    course_name: 'Leadership Excellence Program',
    course_name_ar: 'برنامج التميز في القيادة',
    provider: 'AqlHR Academy',
    duration_hours: 40,
    completion_rate: 85,
    cost: 15000,
    participants: 20,
    status: 'active',
    start_date: '2024-01-15',
    end_date: '2024-02-15'
  },
  {
    id: '2',
    course_name: 'Advanced Excel for Finance',
    course_name_ar: 'Excel المتقدم للمالية',
    provider: 'External Training Center',
    duration_hours: 24,
    completion_rate: 92,
    cost: 8000,
    participants: 12,
    status: 'completed',
    start_date: '2023-11-01',
    end_date: '2023-11-30'
  },
  {
    id: '3',
    course_name: 'Digital Marketing Fundamentals',
    course_name_ar: 'أساسيات التسويق الرقمي',
    provider: 'Online Academy',
    duration_hours: 32,
    completion_rate: 78,
    cost: 6000,
    participants: 15,
    status: 'active',
    start_date: '2024-02-01',
    end_date: '2024-03-01'
  }
];

export const generateDummyKPIs = (): DummyKPI[] => [
  {
    id: '1',
    name: 'Employee Satisfaction',
    name_ar: 'رضا الموظفين',
    category: 'HR',
    current_value: 4.2,
    target_value: 4.5,
    unit: 'Score (1-5)',
    trend: 'up',
    status: 'on_track',
    last_updated: '2024-01-15'
  },
  {
    id: '2',
    name: 'Turnover Rate',
    name_ar: 'معدل دوران الموظفين',
    category: 'HR',
    current_value: 8.5,
    target_value: 5.0,
    unit: 'Percentage',
    trend: 'down',
    status: 'at_risk',
    last_updated: '2024-01-10'
  },
  {
    id: '3',
    name: 'Training Completion Rate',
    name_ar: 'معدل إتمام التدريب',
    category: 'Learning',
    current_value: 89,
    target_value: 95,
    unit: 'Percentage',
    trend: 'up',
    status: 'on_track',
    last_updated: '2024-01-12'
  },
  {
    id: '4',
    name: 'Saudization Rate',
    name_ar: 'معدل السعودة',
    category: 'Compliance',
    current_value: 65,
    target_value: 70,
    unit: 'Percentage',
    trend: 'stable',
    status: 'on_track',
    last_updated: '2024-01-08'
  }
];

export const generateDummyProjects = (): DummyProject[] => [
  {
    id: '1',
    name: 'Digital HR Transformation',
    name_ar: 'التحول الرقمي للموارد البشرية',
    description: 'Digitizing all HR processes and implementing new HRIS',
    status: 'in_progress',
    progress: 65,
    start_date: '2023-10-01',
    end_date: '2024-06-30',
    team_size: 8,
    budget: 500000,
    manager: 'Ahmed Al-Rashid'
  },
  {
    id: '2',
    name: 'Employee Wellness Program',
    name_ar: 'برنامج رفاهية الموظفين',
    description: 'Comprehensive wellness program for all employees',
    status: 'planning',
    progress: 25,
    start_date: '2024-03-01',
    end_date: '2024-12-31',
    team_size: 5,
    budget: 200000,
    manager: 'Sarah Al-Mansouri'
  },
  {
    id: '3',
    name: 'Performance Management System',
    name_ar: 'نظام إدارة الأداء',
    description: 'New performance evaluation and goal-setting system',
    status: 'completed',
    progress: 100,
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    team_size: 6,
    budget: 150000,
    manager: 'Omar Al-Ghamdi'
  }
];

// Analytics data generators
export const generateAnalyticsData = () => ({
  employeeGrowth: [
    { month: 'Jan', employees: 145, target: 150 },
    { month: 'Feb', employees: 152, target: 155 },
    { month: 'Mar', employees: 148, target: 160 },
    { month: 'Apr', employees: 165, target: 165 },
    { month: 'May', employees: 172, target: 170 },
    { month: 'Jun', employees: 185, target: 175 }
  ],
  departmentDistribution: [
    { department: 'IT', employees: 45, percentage: 24.3 },
    { department: 'HR', employees: 25, percentage: 13.5 },
    { department: 'Finance', employees: 30, percentage: 16.2 },
    { department: 'Operations', employees: 40, percentage: 21.6 },
    { department: 'Marketing', employees: 20, percentage: 10.8 },
    { department: 'Sales', employees: 25, percentage: 13.5 }
  ],
  performanceMetrics: [
    { metric: 'Productivity', value: 87, change: +5 },
    { metric: 'Quality', value: 92, change: +3 },
    { metric: 'Customer Satisfaction', value: 4.2, change: +0.2 },
    { metric: 'Employee Engagement', value: 78, change: -2 }
  ],
  attendanceData: [
    { day: 'Mon', present: 165, absent: 5, late: 3 },
    { day: 'Tue', present: 168, absent: 3, late: 2 },
    { day: 'Wed', present: 170, absent: 2, late: 1 },
    { day: 'Thu', present: 167, absent: 4, late: 2 },
    { day: 'Fri', present: 172, absent: 1, late: 0 }
  ]
});

// Government integration status
export const generateGovernmentIntegrations = () => [
  { name: 'Qiwa', name_ar: 'قوى', status: 'active', lastSync: '2024-01-15 10:30', success_rate: 98 },
  { name: 'GOSI', name_ar: 'التأمينات الاجتماعية', status: 'active', lastSync: '2024-01-15 09:45', success_rate: 100 },
  { name: 'Absher', name_ar: 'أبشر', status: 'active', lastSync: '2024-01-15 08:20', success_rate: 95 },
  { name: 'Mudad', name_ar: 'مدد', status: 'pending', lastSync: '2024-01-14 16:30', success_rate: 87 },
  { name: 'ELM', name_ar: 'علم', status: 'active', lastSync: '2024-01-15 11:15', success_rate: 92 }
];

// AI recommendations
export const generateAIRecommendations = () => [
  {
    id: '1',
    type: 'training',
    priority: 'high',
    title: 'Leadership Training Recommendation',
    title_ar: 'توصية تدريب القيادة',
    description: 'Based on performance data, 5 employees would benefit from leadership training',
    confidence: 87,
    impact: 'high',
    department: 'All Departments',
    estimated_cost: 25000
  },
  {
    id: '2',
    type: 'retention',
    priority: 'urgent',
    title: 'Retention Risk Alert',
    title_ar: 'تنبيه مخاطر الاحتفاظ',
    description: '3 high-performing employees show signs of disengagement',
    confidence: 92,
    impact: 'critical',
    department: 'IT',
    estimated_cost: 50000
  },
  {
    id: '3',
    type: 'performance',
    priority: 'medium',
    title: 'Performance Improvement Plan',
    title_ar: 'خطة تحسين الأداء',
    description: 'Recommend performance coaching for underperforming team members',
    confidence: 78,
    impact: 'medium',
    department: 'Sales',
    estimated_cost: 15000
  }
];

// Compliance status
export const generateComplianceData = () => ({
  overall_score: 87,
  categories: [
    { name: 'Labor Law', name_ar: 'قانون العمل', score: 92, status: 'compliant' },
    { name: 'GOSI Compliance', name_ar: 'امتثال التأمينات', score: 95, status: 'compliant' },
    { name: 'Saudization', name_ar: 'السعودة', score: 78, status: 'needs_attention' },
    { name: 'Health & Safety', name_ar: 'الصحة والسلامة', score: 85, status: 'compliant' },
    { name: 'Data Protection', name_ar: 'حماية البيانات', score: 90, status: 'compliant' }
  ],
  recent_audits: [
    { date: '2024-01-10', type: 'Internal', result: 'Passed', score: 88 },
    { date: '2023-12-15', type: 'Government', result: 'Passed', score: 92 },
    { date: '2023-11-20', type: 'ISO', result: 'Passed', score: 85 }
  ]
});