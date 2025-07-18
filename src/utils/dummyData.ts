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
  {
    id: '1',
    title: 'Software Engineer',
    titleAr: 'مهندس برمجيات',
    department: 'Information Technology',
    level: 'Mid-Level',
    status: 'active',
    skillsRequired: 8,
    skillsMatched: 6,
    description: 'Responsible for developing and maintaining software applications',
    requirements: ['Bachelor in Computer Science', '3+ years experience', 'React/Node.js'],
    responsibilities: ['Code development', 'Testing', 'Documentation'],
    count: 3
  },
  {
    id: '2',
    title: 'HR Business Partner',
    titleAr: 'شريك أعمال الموارد البشرية',
    department: 'Human Resources',
    level: 'Senior',
    status: 'active',
    skillsRequired: 10,
    skillsMatched: 8,
    description: 'Strategic HR partner for business units',
    requirements: ['Bachelor in HR', '5+ years experience', 'SHRM certification'],
    responsibilities: ['Strategic planning', 'Employee development', 'Performance management'],
    count: 2
  },
  {
    id: '3',
    title: 'Financial Analyst',
    titleAr: 'محلل مالي',
    department: 'Finance',
    level: 'Mid-Level',
    status: 'active',
    skillsRequired: 7,
    skillsMatched: 5,
    description: 'Analyze financial data and prepare reports',
    requirements: ['Bachelor in Finance', '2+ years experience', 'Excel proficiency'],
    responsibilities: ['Financial analysis', 'Reporting', 'Budget planning'],
    count: 4
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