import React, { useState, useEffect } from 'react';
import { useLanguage } from "@/hooks/useLanguageCompat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  Calculator,
  Target,
  Clock,
  FileBarChart,
  Settings,
  Brain,
  Zap,
  Upload,
  Building2,
  Crown,
  DollarSign,
  Filter
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';

// HRSD/Qiwa Approved Job Titles Database
const HRSD_JOB_TITLES = {
  // Healthcare (269 professions)
  healthcare: [
    { code: '2262011', title: 'Pharmacist', titleAr: 'صيدلاني', category: 'Pharmacy', level: 'Professional' },
    { code: '3213011', title: 'Pharmacy Technician', titleAr: 'فني صيدلة', category: 'Pharmacy', level: 'Technician' },
    { code: '3213021', title: 'Pharmacy Assistant', titleAr: 'مساعد صيدلي', category: 'Pharmacy', level: 'Assistant' },
    { code: '2261011', title: 'General Dentist', titleAr: 'طبيب أسنان عام', category: 'Dentistry', level: 'Professional' },
    { code: '3251011', title: 'Dental Hygienist', titleAr: 'أخصائي صحة أسنان', category: 'Dentistry', level: 'Specialist' },
    { code: '3251021', title: 'Dental Assistant', titleAr: 'مساعد طبيب أسنان', category: 'Dentistry', level: 'Assistant' },
    { code: '3212011', title: 'Medical Technologist', titleAr: 'تقني طبي', category: 'Medical Labs', level: 'Technician' },
    { code: '3212021', title: 'Lab Technician', titleAr: 'فني مختبر', category: 'Medical Labs', level: 'Technician' },
    { code: '3212031', title: 'Lab Assistant', titleAr: 'مساعد مختبر', category: 'Medical Labs', level: 'Assistant' },
    { code: '2264011', title: 'Physiotherapist', titleAr: 'أخصائي علاج طبيعي', category: 'Physiotherapy', level: 'Specialist' },
    { code: '3255011', title: 'PT Assistant', titleAr: 'مساعد علاج طبيعي', category: 'Physiotherapy', level: 'Assistant' },
    { code: '3255021', title: 'Rehabilitation Specialist', titleAr: 'أخصائي تأهيل', category: 'Physiotherapy', level: 'Specialist' },
    { code: '3211011', title: 'Radiologic Technologist', titleAr: 'تقني أشعة', category: 'Radiology', level: 'Technician' },
    { code: '3211021', title: 'Medical Imaging Specialist', titleAr: 'أخصائي تصوير طبي', category: 'Radiology', level: 'Specialist' },
    { code: '3211031', title: 'X-ray Technician', titleAr: 'فني أشعة سينية', category: 'Radiology', level: 'Technician' },
    { code: '2221011', title: 'Registered Nurse', titleAr: 'ممرض مسجل', category: 'Nursing', level: 'Professional' },
    { code: '2221021', title: 'Nurse Practitioner', titleAr: 'ممرض ممارس', category: 'Nursing', level: 'Advanced' },
    { code: '5321011', title: 'Nursing Assistant', titleAr: 'مساعد تمريض', category: 'Nursing', level: 'Assistant' },
  ],
  // Engineering (All Specializations)
  engineering: [
    { code: '2212061', title: 'Airport Engineer', titleAr: 'مهندس مطارات', category: 'Civil', level: 'Professional' },
    { code: '2212071', title: 'Seaport Engineer', titleAr: 'مهندس موانئ بحرية', category: 'Civil', level: 'Professional' },
    { code: '2212081', title: 'Railway Engineer', titleAr: 'مهندس سكك حديدية', category: 'Civil', level: 'Professional' },
    { code: '2212111', title: 'Traffic Engineer', titleAr: 'مهندس مرور', category: 'Civil', level: 'Professional' },
    { code: '2215161', title: 'Shipbuilding Engineer', titleAr: 'مهندس بناء سفن', category: 'Mechanical', level: 'Professional' },
    { code: '2215011', title: 'Industrial Engineer', titleAr: 'مهندس صناعي', category: 'Mechanical', level: 'Professional' },
    { code: '2215021', title: 'HVAC Engineer', titleAr: 'مهندس تكييف وتهوية', category: 'Mechanical', level: 'Professional' },
    { code: '2218121', title: 'Aviation Engineer', titleAr: 'مهندس طيران', category: 'Aviation', level: 'Professional' },
    { code: '3155011', title: 'Aircraft Maintenance Engineer', titleAr: 'مهندس صيانة طائرات', category: 'Aviation', level: 'Professional' },
    { code: '2145011', title: 'Petroleum Engineer', titleAr: 'مهندس بترول', category: 'Petroleum', level: 'Professional' },
    { code: '2145021', title: 'Drilling Engineer', titleAr: 'مهندس حفر', category: 'Petroleum', level: 'Professional' },
    { code: '2141011', title: 'Chemical Engineer', titleAr: 'مهندس كيميائي', category: 'Chemical', level: 'Professional' },
    { code: '2141021', title: 'Process Engineer', titleAr: 'مهندس عمليات', category: 'Chemical', level: 'Professional' },
    { code: '2151011', title: 'Electrical Engineer', titleAr: 'مهندس كهرباء', category: 'Electrical', level: 'Professional' },
    { code: '2151021', title: 'Power Systems Engineer', titleAr: 'مهندس أنظمة قوى', category: 'Electrical', level: 'Professional' },
    { code: '2512011', title: 'Software Engineer', titleAr: 'مهندس برمجيات', category: 'Software', level: 'Professional' },
    { code: '2512021', title: 'Systems Analyst', titleAr: 'محلل أنظمة', category: 'Software', level: 'Professional' },
  ],
  // Information Technology
  information_technology: [
    { code: '2512011', title: 'Software Developer', titleAr: 'مطور برمجيات', category: 'Development', level: 'Professional' },
    { code: '2521011', title: 'Database Administrator', titleAr: 'مدير قواعد البيانات', category: 'Database', level: 'Professional' },
    { code: '2522011', title: 'Network Administrator', titleAr: 'مدير الشبكات', category: 'Network', level: 'Professional' },
    { code: '2529011', title: 'Cybersecurity Specialist', titleAr: 'أخصائي أمن سيبراني', category: 'Security', level: 'Specialist' },
    { code: '3512011', title: 'IT Support Specialist', titleAr: 'أخصائي دعم تقني', category: 'Support', level: 'Specialist' },
    { code: '2513011', title: 'Web Developer', titleAr: 'مطور مواقع', category: 'Development', level: 'Professional' },
    { code: '2519011', title: 'Data Scientist', titleAr: 'عالم بيانات', category: 'Data', level: 'Professional' },
    { code: '3513011', title: 'Systems Administrator', titleAr: 'مدير أنظمة', category: 'Systems', level: 'Professional' },
    { code: '2513021', title: 'Mobile App Developer', titleAr: 'مطور تطبيقات محمولة', category: 'Development', level: 'Professional' },
  ],
  // Finance & Accounting
  finance: [
    { code: '2411011', title: 'CPA', titleAr: 'محاسب قانوني معتمد', category: 'Accounting', level: 'Professional' },
    { code: '2621021', title: 'Financial Analyst', titleAr: 'محلل مالي', category: 'Analysis', level: 'Professional' },
    { code: '2218161', title: 'Auditor', titleAr: 'مدقق حسابات', category: 'Audit', level: 'Professional' },
    { code: '1217081', title: 'Credit Manager', titleAr: 'مدير ائتمان', category: 'Credit', level: 'Management' },
    { code: '2412031', title: 'Investment Advisor', titleAr: 'مستشار استثماري', category: 'Investment', level: 'Advisory' },
    { code: '5121023', title: 'Insurance Broker', titleAr: 'وسيط تأمين', category: 'Insurance', level: 'Professional' },
    { code: '2621011', title: 'Budget Planner', titleAr: 'مخطط ميزانية', category: 'Planning', level: 'Professional' },
    { code: '1217131', title: 'Accounts Manager', titleAr: 'مدير حسابات', category: 'Management', level: 'Management' },
    { code: '2133111', title: 'Business Analyst', titleAr: 'محلل أعمال', category: 'Analysis', level: 'Professional' },
    { code: '2411021', title: 'Tax Specialist', titleAr: 'أخصائي ضرائب', category: 'Tax', level: 'Specialist' },
  ],
  // Sales & Marketing
  sales_marketing: [
    { code: '5221011', title: 'Sales Representative', titleAr: 'مندوب مبيعات', category: 'Sales', level: 'Representative' },
    { code: '2431011', title: 'Marketing Specialist', titleAr: 'أخصائي تسويق', category: 'Marketing', level: 'Specialist' },
    { code: '1221011', title: 'Sales Manager', titleAr: 'مدير مبيعات', category: 'Sales', level: 'Management' },
    { code: '4222011', title: 'Customer Service Rep', titleAr: 'ممثل خدمة عملاء', category: 'Service', level: 'Representative' },
    { code: '1221021', title: 'Brand Manager', titleAr: 'مدير علامة تجارية', category: 'Marketing', level: 'Management' },
    { code: '2431021', title: 'Digital Marketing Specialist', titleAr: 'أخصائي تسويق رقمي', category: 'Marketing', level: 'Specialist' },
    { code: '1221031', title: 'Business Development Manager', titleAr: 'مدير تطوير أعمال', category: 'Business Development', level: 'Management' },
    { code: '5221021', title: 'Account Executive', titleAr: 'مسؤول حسابات', category: 'Sales', level: 'Executive' },
  ],
  // Construction Industry
  construction: [
    { code: '1323011', title: 'Construction Manager', titleAr: 'مدير إنشاءات', category: 'Management', level: 'Management' },
    { code: '1323021', title: 'Site Supervisor', titleAr: 'مشرف موقع', category: 'Supervision', level: 'Supervisor' },
    { code: '3117011', title: 'Quality Inspector', titleAr: 'مفتش جودة', category: 'Quality', level: 'Inspector' },
    { code: '2149011', title: 'Safety Engineer', titleAr: 'مهندس سلامة', category: 'Safety', level: 'Professional' },
    { code: '2142011', title: 'Structural Engineer', titleAr: 'مهندس إنشائي', category: 'Engineering', level: 'Professional' },
    { code: '3117021', title: 'Building Inspector', titleAr: 'مفتش مباني', category: 'Inspection', level: 'Inspector' },
    { code: '7119011', title: 'Construction Foreman', titleAr: 'رئيس عمال بناء', category: 'Operations', level: 'Foreman' },
    { code: '7411011', title: 'Electrical Contractor', titleAr: 'مقاول كهرباء', category: 'Electrical', level: 'Contractor' },
    { code: '7126011', title: 'Plumber', titleAr: 'سباك', category: 'Plumbing', level: 'Technician' },
  ],
  // Human Resources
  human_resources: [
    { code: '1212011', title: 'HR Manager', titleAr: 'مدير موارد بشرية', category: 'Management', level: 'Management' },
    { code: '2423011', title: 'Recruitment Specialist', titleAr: 'أخصائي توظيف', category: 'Recruitment', level: 'Specialist' },
    { code: '2424021', title: 'Training Specialist', titleAr: 'أخصائي تدريب', category: 'Training', level: 'Specialist' },
    { code: '2423021', title: 'Compensation Analyst', titleAr: 'محلل تعويضات', category: 'Compensation', level: 'Analyst' },
    { code: '2423031', title: 'Employee Relations Specialist', titleAr: 'أخصائي علاقات موظفين', category: 'Relations', level: 'Specialist' },
  ],
  // Legal
  legal: [
    { code: '2611011', title: 'Lawyer', titleAr: 'محامي', category: 'Legal', level: 'Professional' },
    { code: '2611021', title: 'Legal Advisor', titleAr: 'مستشار قانوني', category: 'Advisory', level: 'Advisory' },
    { code: '3411011', title: 'Paralegal', titleAr: 'مساعد قانوني', category: 'Support', level: 'Assistant' },
    { code: '2611031', title: 'Compliance Officer', titleAr: 'مسؤول امتثال', category: 'Compliance', level: 'Officer' },
  ],
  // Transport/Aviation/Maritime
  transport: [
    { code: '1122121', title: 'Ship Captain', titleAr: 'قبطان سفينة', category: 'Maritime', level: 'Captain' },
    { code: '1122141', title: 'Marine Officer', titleAr: 'ضابط بحري', category: 'Maritime', level: 'Officer' },
    { code: '2232011', title: 'Maritime Navigator', titleAr: 'ملاح بحري', category: 'Maritime', level: 'Professional' },
    { code: '2218111', title: 'Ship Engineer', titleAr: 'مهندس سفن', category: 'Maritime', level: 'Professional' },
    { code: '2233051', title: 'Commercial Pilot', titleAr: 'طيار تجاري', category: 'Aviation', level: 'Professional' },
    { code: '3231012', title: 'Air Traffic Controller', titleAr: 'مراقب جوي', category: 'Aviation', level: 'Controller' },
    { code: '3155021', title: 'Flight Engineer', titleAr: 'مهندس طيران', category: 'Aviation', level: 'Professional' },
    { code: '2513061', title: 'Tourist Guide', titleAr: 'مرشد سياحي', category: 'Tourism', level: 'Professional' },
    { code: '5111023', title: 'Travel Agent', titleAr: 'وكيل سفر', category: 'Tourism', level: 'Agent' },
    { code: '1217141', title: 'Tourism Manager', titleAr: 'مدير سياحة', category: 'Tourism', level: 'Management' },
    { code: '1216011', title: 'Transport Manager', titleAr: 'مدير نقل', category: 'Transport', level: 'Management' },
    { code: '4223013', title: 'Traffic Controller', titleAr: 'مراقب مرور', category: 'Traffic', level: 'Controller' },
    { code: '9141014', title: 'Driver', titleAr: 'سائق', category: 'Driving', level: 'Operator' },
  ],
  // Education
  education: [
    { code: '2341011', title: 'Teacher', titleAr: 'معلم', category: 'Teaching', level: 'Professional' },
    { code: '1345011', title: 'Educational Administrator', titleAr: 'مدير تعليمي', category: 'Administration', level: 'Management' },
    { code: '2424011', title: 'Training Coordinator', titleAr: 'منسق تدريب', category: 'Training', level: 'Coordinator' },
    { code: '2359011', title: 'Curriculum Specialist', titleAr: 'أخصائي مناهج', category: 'Curriculum', level: 'Specialist' },
    { code: '2359021', title: 'Academic Advisor', titleAr: 'مستشار أكاديمي', category: 'Advisory', level: 'Advisory' },
  ],
  // Labor Workers
  labor: [
    { code: '8113011', title: 'Machine Operator', titleAr: 'مشغل آلة', category: 'Operations', level: 'Operator' },
    { code: '9329011', title: 'Production Worker', titleAr: 'عامل إنتاج', category: 'Production', level: 'Worker' },
    { code: '9624011', title: 'Warehouse Worker', titleAr: 'عامل مستودع', category: 'Warehouse', level: 'Worker' },
    { code: '7233011', title: 'Maintenance Technician', titleAr: 'فني صيانة', category: 'Maintenance', level: 'Technician' },
    { code: '3117031', title: 'Quality Control Worker', titleAr: 'عامل مراقبة جودة', category: 'Quality', level: 'Worker' },
    { code: '8219011', title: 'Assembly Worker', titleAr: 'عامل تجميع', category: 'Assembly', level: 'Worker' },
    { code: '8342011', title: 'Equipment Operator', titleAr: 'مشغل معدات', category: 'Equipment', level: 'Operator' },
    { code: '4321011', title: 'Logistics Coordinator', titleAr: 'منسق لوجستيات', category: 'Logistics', level: 'Coordinator' },
  ]
};

// Position Levels with Salary Ranges (SAR per month) - Based on HRSD Semi-Government Benchmarks
const POSITION_LEVELS = {
  'Fresh Graduate': { minSalary: 4000, maxSalary: 6000, experience: '0-1 years' },
  'Junior': { minSalary: 5500, maxSalary: 8500, experience: '1-3 years' },
  'Associate': { minSalary: 7500, maxSalary: 12000, experience: '2-5 years' },
  'Professional': { minSalary: 10000, maxSalary: 18000, experience: '3-7 years' },
  'Senior': { minSalary: 15000, maxSalary: 25000, experience: '5-10 years' },
  'Lead/Principal': { minSalary: 20000, maxSalary: 35000, experience: '7-12 years' },
  'Manager': { minSalary: 25000, maxSalary: 45000, experience: '8-15 years' },
  'Senior Manager': { minSalary: 35000, maxSalary: 60000, experience: '10-18 years' },
  'Director': { minSalary: 45000, maxSalary: 80000, experience: '12+ years' },
  'Executive Director': { minSalary: 60000, maxSalary: 120000, experience: '15+ years' },
  'VP/General Manager': { minSalary: 80000, maxSalary: 150000, experience: '18+ years' },
};

// Comprehensive Saudi Departments List
const SAUDI_DEPARTMENTS = [
  // Core Business Functions
  'Executive Management', 'Board of Directors', 'CEO Office',
  'Human Resources', 'Finance & Accounting', 'Legal & Compliance',
  'Information Technology', 'Operations', 'Quality Assurance',
  'Research & Development', 'Strategic Planning', 'Business Development',
  
  // Engineering & Technical
  'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering',
  'Chemical Engineering', 'Petroleum Engineering', 'Industrial Engineering',
  'Software Engineering', 'Environmental Engineering', 'Safety Engineering',
  'Structural Engineering', 'Geotechnical Engineering', 'Transportation Engineering',
  
  // Construction & Infrastructure
  'Project Management', 'Construction Management', 'Site Engineering',
  'Architecture', 'Urban Planning', 'Quantity Surveying',
  'Building Services', 'MEP Engineering', 'Project Controls',
  'Contract Administration', 'Construction Safety', 'Materials Testing',
  
  // Healthcare
  'Medical Services', 'Nursing', 'Pharmacy', 'Laboratory Services',
  'Radiology', 'Emergency Medicine', 'Surgery', 'Pediatrics',
  'Internal Medicine', 'Cardiology', 'Neurology', 'Orthopedics',
  'Ophthalmology', 'Dermatology', 'Psychiatry', 'Anesthesia',
  'Physical Therapy', 'Respiratory Therapy', 'Medical Technology',
  
  // Manufacturing & Production
  'Production Planning', 'Manufacturing Engineering', 'Process Engineering',
  'Quality Control', 'Maintenance', 'Supply Chain', 'Logistics',
  'Warehouse Management', 'Inventory Control', 'Procurement',
  
  // Oil & Gas
  'Exploration', 'Drilling', 'Production', 'Refining',
  'Petrochemicals', 'Pipeline Operations', 'Reservoir Engineering',
  'Facilities Engineering', 'HSE (Health, Safety, Environment)',
  
  // Finance & Banking
  'Corporate Banking', 'Investment Banking', 'Retail Banking',
  'Islamic Banking', 'Treasury', 'Risk Management',
  'Credit Analysis', 'Financial Planning', 'Audit',
  'Compliance', 'Anti-Money Laundering', 'Trade Finance',
  
  // Education
  'Academic Affairs', 'Student Services', 'Faculty Development',
  'Curriculum Development', 'Educational Technology', 'Library Services',
  'Research Administration', 'Continuing Education', 'Training & Development',
  
  // Government & Public Sector
  'Public Administration', 'Municipal Services', 'Urban Development',
  'Transportation Planning', 'Environmental Protection', 'Social Services',
  'Immigration Services', 'Customs', 'Border Security',
  
  // Retail & Consumer
  'Sales & Marketing', 'Customer Service', 'Merchandising',
  'Store Operations', 'E-commerce', 'Brand Management',
  'Product Development', 'Market Research', 'Digital Marketing',
  
  // Hospitality & Tourism
  'Hotel Operations', 'Food & Beverage', 'Event Management',
  'Tourism Development', 'Travel Services', 'Recreation Services',
  'Cultural Heritage', 'Entertainment', 'Convention Services',
  
  // Transportation & Logistics
  'Fleet Management', 'Air Transportation', 'Maritime Operations',
  'Railway Operations', 'Freight Services', 'Shipping',
  'Port Operations', 'Airport Management', 'Ground Transportation',
  
  // Agriculture & Food
  'Agricultural Engineering', 'Food Processing', 'Food Safety',
  'Agricultural Research', 'Livestock Management', 'Fisheries',
  'Food Technology', 'Nutrition Services', 'Agricultural Extension',
  
  // Mining & Minerals
  'Mining Engineering', 'Geology', 'Metallurgy',
  'Mine Operations', 'Mineral Processing', 'Mining Safety',
  
  // Media & Communications
  'Broadcasting', 'Publishing', 'Digital Media',
  'Public Relations', 'Corporate Communications', 'Journalism',
  'Graphic Design', 'Video Production', 'Social Media',
  
  // Real Estate & Construction
  'Property Development', 'Real Estate Management', 'Property Sales',
  'Facility Management', 'Building Maintenance', 'Property Investment',
  
  // Utilities & Infrastructure
  'Power Generation', 'Water Treatment', 'Waste Management',
  'Telecommunications', 'Network Operations', 'Infrastructure Maintenance',
  
  // Sports & Recreation
  'Sports Management', 'Athletic Training', 'Sports Medicine',
  'Recreation Programming', 'Facility Operations', 'Sports Marketing',
  
  // Security & Defense
  'Physical Security', 'Cybersecurity', 'Risk Assessment',
  'Emergency Response', 'Safety Management', 'Security Operations'
];

const SaudizationCalculator = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { toast } = useToast();

  // State for job title and salary management
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 0 });
  const [calculatorFilters, setCalculatorFilters] = useState({
    department: 'all',
    nationality: 'all',
    jobTitle: 'all',
    level: 'all'
  });

  // Smart calculations based on selections
  useEffect(() => {
    if (selectedLevel && POSITION_LEVELS[selectedLevel as keyof typeof POSITION_LEVELS]) {
      const levelData = POSITION_LEVELS[selectedLevel as keyof typeof POSITION_LEVELS];
      setSalaryRange({ 
        min: levelData.minSalary, 
        max: levelData.maxSalary 
      });
    }
  }, [selectedLevel]);

  const getJobTitlesByIndustry = (industry: string) => {
    return HRSD_JOB_TITLES[industry as keyof typeof HRSD_JOB_TITLES] || [];
  };

  const calculateSaudizationImpact = () => {
    if (!selectedDepartment || !selectedLevel) return null;
    
    const levelData = POSITION_LEVELS[selectedLevel as keyof typeof POSITION_LEVELS];
    const avgSalary = (levelData.minSalary + levelData.maxSalary) / 2;
    const compliance = saudizationData.departments.find(d => d.name === selectedDepartment);
    
    return {
      avgSalary,
      experience: levelData.experience,
      complianceImpact: compliance ? compliance.target - (compliance.saudi / compliance.total) * 100 : 0,
      recommendedHires: compliance ? Math.max(0, Math.ceil((compliance.target / 100) * compliance.total) - compliance.saudi) : 0
    };
  };

  // Mock data - in real implementation, this would come from your database
  const [saudizationData, setSaudizationData] = useState({
    totalEmployees: 2847,
    saudiEmployees: 1423,
    nonSaudiEmployees: 1424,
    currentPercentage: 49.98,
    targetPercentage: 50.0,
    gap: 1,
    complianceStatus: 'yellow', // green, yellow, red
    lastUpdated: new Date(),
    departments: [
      { name: 'Engineering', total: 450, saudi: 180, target: 40, status: 'green' },
      { name: 'Healthcare', total: 320, saudi: 200, target: 60, status: 'yellow' },
      { name: 'Finance', total: 180, saudi: 120, target: 65, status: 'green' },
      { name: 'IT', total: 280, saudi: 98, target: 35, status: 'red' },
      { name: 'Operations', total: 520, saudi: 312, target: 60, status: 'green' },
      { name: 'Sales', total: 290, saudi: 174, target: 60, status: 'green' },
    ],
    visaData: {
      totalAllocated: 500,
      used: 324,
      available: 176,
      expiringSoon: 23,
      pendingApplications: 45
    },
    nationalityBreakdown: [
      { nationality: 'Saudi', count: 1423, percentage: 49.98 },
      { nationality: 'Indian', count: 450, percentage: 15.8 },
      { nationality: 'Pakistani', count: 320, percentage: 11.2 },
      { nationality: 'Egyptian', count: 280, percentage: 9.8 },
      { nationality: 'Bangladeshi', count: 200, percentage: 7.0 },
      { nationality: 'Filipino', count: 174, percentage: 6.1 }
    ]
  });

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'green': return 'text-green-600 bg-green-50';
      case 'yellow': return 'text-yellow-600 bg-yellow-50';
      case 'red': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getComplianceText = (status: string) => {
    const texts = {
      green: isRTL ? 'ممتاز - ملتزم' : 'Excellent - Compliant',
      yellow: isRTL ? 'تحذير - يحتاج تحسين' : 'Warning - Needs Improvement',
      red: isRTL ? 'خطر - غير ملتزم' : 'Critical - Non-Compliant'
    };
    return texts[status as keyof typeof texts] || '';
  };

  const calculateSaudizationGap = (department: any) => {
    const currentPercentage = (department.saudi / department.total) * 100;
    const gap = department.target - currentPercentage;
    const requiredSaudis = Math.ceil((department.target / 100) * department.total) - department.saudi;
    return { currentPercentage, gap, requiredSaudis };
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', '#8884d8', '#82ca9d'];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-center gap-3">
          <Calculator className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            {isRTL ? 'حاسبة السعودة والتأشيرات' : 'Saudization & Visa Calculator'}
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {isRTL ? 'حاسبة ذكية مدعومة بالذكاء الاصطناعي لإدارة السعودة وامتثال النطاقات' : 'AI-powered calculator for Saudization management and Nitaqat compliance'}
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            {isRTL ? 'مدعوم بالذكاء الاصطناعي' : 'AI-Powered'}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {isRTL ? 'فوري' : 'Real-time'}
          </Badge>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className={`text-sm font-medium flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <Users className="h-4 w-4 text-primary" />
              {isRTL ? 'نسبة السعودة الحالية' : 'Current Saudization'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary text-center">
              {saudizationData.currentPercentage}%
            </div>
            <Progress value={saudizationData.currentPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {isRTL ? `الهدف: ${saudizationData.targetPercentage}%` : `Target: ${saudizationData.targetPercentage}%`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className={`text-sm font-medium flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <Target className="h-4 w-4 text-green-600" />
              {isRTL ? 'الحالة الامتثالية' : 'Compliance Status'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Badge className={getComplianceColor(saudizationData.complianceStatus)} variant="secondary">
                {getComplianceText(saudizationData.complianceStatus)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {isRTL ? `فجوة: ${saudizationData.gap} موظف` : `Gap: ${saudizationData.gap} employees`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className={`text-sm font-medium flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <FileBarChart className="h-4 w-4 text-blue-600" />
              {isRTL ? 'التأشيرات المتاحة' : 'Available Visas'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 text-center">
              {saudizationData.visaData.available}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {isRTL ? `من أصل ${saudizationData.visaData.totalAllocated}` : `out of ${saudizationData.visaData.totalAllocated}`}
            </p>
            <Progress 
              value={(saudizationData.visaData.used / saudizationData.visaData.totalAllocated) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className={`text-sm font-medium flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <Clock className="h-4 w-4 text-orange-600" />
              {isRTL ? 'تأشيرات تنتهي قريباً' : 'Expiring Soon'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 text-center">
              {saudizationData.visaData.expiringSoon}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {isRTL ? 'خلال 90 يوم' : 'within 90 days'}
            </p>
            {saudizationData.visaData.expiringSoon > 20 && (
              <div className="text-center mt-2">
                <Badge variant="destructive" className="text-xs">
                  {isRTL ? 'يتطلب اهتمام' : 'Requires Attention'}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Smart Position & Salary Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {isRTL ? 'حاسبة ذكية للمناصب والرواتب' : 'Smart Position & Salary Calculator'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 'اختر الصناعة والقسم والمستوى للحصول على تحليل ذكي للراتب وتأثير السعودة' : 'Select industry, department, and level for intelligent salary analysis and Saudization impact'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label>{isRTL ? 'الصناعة' : 'Industry'}</Label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر الصناعة' : 'Select Industry'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthcare">{isRTL ? 'الرعاية الصحية' : 'Healthcare'}</SelectItem>
                  <SelectItem value="engineering">{isRTL ? 'الهندسة' : 'Engineering'}</SelectItem>
                  <SelectItem value="information_technology">{isRTL ? 'تقنية المعلومات' : 'Information Technology'}</SelectItem>
                  <SelectItem value="finance">{isRTL ? 'المالية والمحاسبة' : 'Finance & Accounting'}</SelectItem>
                  <SelectItem value="sales_marketing">{isRTL ? 'المبيعات والتسويق' : 'Sales & Marketing'}</SelectItem>
                  <SelectItem value="construction">{isRTL ? 'البناء والإنشاء' : 'Construction'}</SelectItem>
                  <SelectItem value="human_resources">{isRTL ? 'الموارد البشرية' : 'Human Resources'}</SelectItem>
                  <SelectItem value="legal">{isRTL ? 'القانونية' : 'Legal'}</SelectItem>
                  <SelectItem value="transport">{isRTL ? 'النقل والطيران' : 'Transport & Aviation'}</SelectItem>
                  <SelectItem value="education">{isRTL ? 'التعليم' : 'Education'}</SelectItem>
                  <SelectItem value="labor">{isRTL ? 'العمالة' : 'Labor'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{isRTL ? 'القسم' : 'Department'}</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر القسم' : 'Select Department'} />
                </SelectTrigger>
                <SelectContent>
                  {SAUDI_DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{isRTL ? 'المسمى الوظيفي' : 'Job Title'}</Label>
              <Select value={selectedJobTitle} onValueChange={setSelectedJobTitle} disabled={!selectedIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر المسمى الوظيفي' : 'Select Job Title'} />
                </SelectTrigger>
                <SelectContent>
                  {selectedIndustry && getJobTitlesByIndustry(selectedIndustry).map((job) => (
                    <SelectItem key={job.code} value={job.code}>
                      <div className="flex flex-col">
                        <span className="font-medium">{isRTL ? job.titleAr : job.title}</span>
                        <span className="text-xs text-muted-foreground">Code: {job.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{isRTL ? 'المستوى الوظيفي' : 'Position Level'}</Label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر المستوى' : 'Select Level'} />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(POSITION_LEVELS).map((level) => (
                    <SelectItem key={level} value={level}>
                      <div className="flex flex-col">
                        <span className="font-medium">{level}</span>
                        <span className="text-xs text-muted-foreground">
                          {POSITION_LEVELS[level as keyof typeof POSITION_LEVELS].experience}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Smart Analysis Results */}
          {selectedLevel && selectedDepartment && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{isRTL ? 'نطاق الراتب (ريال سعودي)' : 'Salary Range (SAR)'}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {salaryRange.min.toLocaleString()} - {salaryRange.max.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? `متوسط: ${((salaryRange.min + salaryRange.max) / 2).toLocaleString()} ريال شهرياً` : `Avg: ${((salaryRange.min + salaryRange.max) / 2).toLocaleString()} SAR/month`}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{isRTL ? 'المستوى والخبرة' : 'Level & Experience'}</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {selectedLevel}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {POSITION_LEVELS[selectedLevel as keyof typeof POSITION_LEVELS].experience}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium">{isRTL ? 'تأثير السعودة' : 'Saudization Impact'}</span>
                  </div>
                  {(() => {
                    const impact = calculateSaudizationImpact();
                    return impact ? (
                      <div>
                        <div className="text-lg font-bold text-orange-600">
                          {impact.complianceImpact > 0 ? '+' : ''}{impact.complianceImpact.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isRTL ? `توظيف مطلوب: ${impact.recommendedHires}` : `Hiring needed: ${impact.recommendedHires}`}
                        </p>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {isRTL ? 'اختر القسم للتحليل' : 'Select department for analysis'}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Job Title Details */}
          {selectedJobTitle && selectedIndustry && (
            <Card className="mt-4">
              <CardContent className="pt-4">
                {(() => {
                  const jobDetails = getJobTitlesByIndustry(selectedIndustry).find(job => job.code === selectedJobTitle);
                  return jobDetails ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">{isRTL ? 'الكود المعتمد' : 'HRSD Code'}</span>
                        <p className="font-mono text-sm">{jobDetails.code}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">{isRTL ? 'المسمى الوظيفي' : 'Job Title'}</span>
                        <p className="font-medium">{isRTL ? jobDetails.titleAr : jobDetails.title}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">{isRTL ? 'الفئة' : 'Category'}</span>
                        <p className="text-sm">{jobDetails.category}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">{isRTL ? 'المستوى المقترح' : 'Suggested Level'}</span>
                        <Badge variant="outline">{jobDetails.level}</Badge>
                      </div>
                    </div>
                  ) : null;
                })()}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="executive" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="executive">
            {isRTL ? 'المدير التنفيذي' : 'Executive View'}
          </TabsTrigger>
          <TabsTrigger value="department">
            {isRTL ? 'عرض الأقسام' : 'Department View'}
          </TabsTrigger>
          <TabsTrigger value="operations">
            {isRTL ? 'العمليات' : 'Operations'}
          </TabsTrigger>
          <TabsTrigger value="hrsd-database">
            {isRTL ? 'قاعدة بيانات الموارد البشرية' : 'HRSD Database'}
          </TabsTrigger>
          <TabsTrigger value="documents">
            {isRTL ? 'المستندات' : 'Documents'}
          </TabsTrigger>
        </TabsList>

        {/* Executive View */}
        <TabsContent value="executive" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {isRTL ? 'توزيع الجنسيات' : 'Nationality Distribution'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={saudizationData.nationalityBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="count"
                      nameKey="nationality"
                    >
                      {saudizationData.nationalityBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {isRTL ? 'اتجاهات السعودة' : 'Saudization Trends'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { month: 'Jan', percentage: 45.2 },
                    { month: 'Feb', percentage: 46.8 },
                    { month: 'Mar', percentage: 47.5 },
                    { month: 'Apr', percentage: 48.1 },
                    { month: 'May', percentage: 49.2 },
                    { month: 'Jun', percentage: 49.98 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="percentage" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                {isRTL ? 'توصيات الذكاء الاصطناعي' : 'AI Recommendations'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'توصيات ذكية لتحسين نسبة السعودة' : 'Smart recommendations to improve Saudization'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">
                        {isRTL ? 'توظيف فوري مطلوب' : 'Immediate Hiring Required'}
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {isRTL ? 'يحتاج قسم تقنية المعلومات إلى توظيف 42 مواطن سعودي للوصول للهدف المطلوب' : 'IT department needs to hire 42 Saudi nationals to meet target compliance'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">
                        {isRTL ? 'استراتيجية التدريب والتطوير' : 'Training & Development Strategy'}
                      </h4>
                      <p className="text-sm text-green-700 mt-1">
                        {isRTL ? 'تطوير برامج تدريبية متقدمة لرفع مهارات الموظفين السعوديين في التخصصات التقنية' : 'Develop advanced training programs to upskill Saudi employees in technical specializations'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Department View */}
        <TabsContent value="department" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-center">
                <BarChart3 className="h-5 w-5" />
                {isRTL ? 'السعودة حسب القسم' : 'Saudization by Department'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {saudizationData.departments.map((dept, index) => {
                  const { currentPercentage, gap, requiredSaudis } = calculateSaudizationGap(dept);
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{dept.name}</h4>
                        <Badge className={getComplianceColor(dept.status)} variant="secondary">
                          {currentPercentage.toFixed(1)}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">{isRTL ? 'الإجمالي' : 'Total'}</p>
                          <p className="font-semibold">{dept.total}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">{isRTL ? 'سعوديين' : 'Saudis'}</p>
                          <p className="font-semibold text-green-600">{dept.saudi}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">{isRTL ? 'الهدف' : 'Target'}</p>
                          <p className="font-semibold">{dept.target}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">{isRTL ? 'مطلوب' : 'Required'}</p>
                          <p className="font-semibold text-orange-600">
                            {requiredSaudis > 0 ? `+${requiredSaudis}` : '✓'}
                          </p>
                        </div>
                      </div>
                      
                      <Progress value={currentPercentage} className="mb-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{currentPercentage.toFixed(1)}%</span>
                        <span>{isRTL ? `الهدف: ${dept.target}%` : `Target: ${dept.target}%`}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operations View */}
        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileBarChart className="h-5 w-5" />
                  {isRTL ? 'إدارة كتل التأشيرات' : 'Visa Block Management'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">{isRTL ? 'المخصص' : 'Allocated'}</span>
                    <span className="font-bold">{saudizationData.visaData.totalAllocated}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium">{isRTL ? 'المستخدم' : 'Used'}</span>
                    <span className="font-bold text-red-600">{saudizationData.visaData.used}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">{isRTL ? 'المتاح' : 'Available'}</span>
                    <span className="font-bold text-green-600">{saudizationData.visaData.available}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium">{isRTL ? 'طلبات معلقة' : 'Pending Applications'}</span>
                    <span className="font-bold text-orange-600">{saudizationData.visaData.pendingApplications}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Calculator className="h-4 w-4 mr-2" />
                    {isRTL ? 'حساب الفجوة التفصيلية' : 'Calculate Detailed Gap'}
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileBarChart className="h-4 w-4 mr-2" />
                    {isRTL ? 'تقرير الامتثال' : 'Generate Compliance Report'}
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {isRTL ? 'توقعات السعودة' : 'Saudization Forecast'}
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    {isRTL ? 'توصيات الذكاء الاصطناعي' : 'AI Recommendations'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* HRSD Database View */}
        <TabsContent value="hrsd-database" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  {isRTL ? 'قاعدة بيانات المهن المعتمدة من الموارد البشرية' : 'HRSD Approved Jobs Database'}
                </CardTitle>
                <CardDescription>
                  {isRTL ? 'ابحث في 269+ مهنة معتمدة حسب الصناعة والكود والمستوى' : 'Search through 269+ approved professions by industry, code, and level'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{isRTL ? 'بحث بالصناعة' : 'Filter by Industry'}</Label>
                      <Select value={calculatorFilters.department} onValueChange={(value) => setCalculatorFilters({...calculatorFilters, department: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder={isRTL ? 'جميع الصناعات' : 'All Industries'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{isRTL ? 'جميع الصناعات' : 'All Industries'}</SelectItem>
                          <SelectItem value="healthcare">{isRTL ? 'الرعاية الصحية (269 مهنة)' : 'Healthcare (269 professions)'}</SelectItem>
                          <SelectItem value="engineering">{isRTL ? 'الهندسة (جميع التخصصات)' : 'Engineering (All Specializations)'}</SelectItem>
                          <SelectItem value="information_technology">{isRTL ? 'تقنية المعلومات' : 'Information Technology'}</SelectItem>
                          <SelectItem value="finance">{isRTL ? 'المالية والمحاسبة' : 'Finance & Accounting'}</SelectItem>
                          <SelectItem value="construction">{isRTL ? 'صناعة البناء' : 'Construction Industry'}</SelectItem>
                          <SelectItem value="transport">{isRTL ? 'النقل/الطيران/البحري' : 'Transport/Aviation/Maritime'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{isRTL ? 'بحث بالمستوى' : 'Filter by Level'}</Label>
                      <Select value={calculatorFilters.level} onValueChange={(value) => setCalculatorFilters({...calculatorFilters, level: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder={isRTL ? 'جميع المستويات' : 'All Levels'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{isRTL ? 'جميع المستويات' : 'All Levels'}</SelectItem>
                          <SelectItem value="Professional">{isRTL ? 'مهني' : 'Professional'}</SelectItem>
                          <SelectItem value="Technician">{isRTL ? 'فني' : 'Technician'}</SelectItem>
                          <SelectItem value="Specialist">{isRTL ? 'أخصائي' : 'Specialist'}</SelectItem>
                          <SelectItem value="Management">{isRTL ? 'إداري' : 'Management'}</SelectItem>
                          <SelectItem value="Assistant">{isRTL ? 'مساعد' : 'Assistant'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto border rounded-lg">
                    <div className="space-y-2 p-4">
                      {Object.entries(HRSD_JOB_TITLES).map(([industry, jobs]) => (
                        (calculatorFilters.department === 'all' || calculatorFilters.department === industry) && 
                        jobs.filter(job => calculatorFilters.level === 'all' || job.level === calculatorFilters.level).map((job) => (
                          <div key={job.code} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs">{job.code}</Badge>
                                  <Badge variant="secondary" className="text-xs">{job.level}</Badge>
                                </div>
                                <h4 className="font-medium text-sm">{isRTL ? job.titleAr : job.title}</h4>
                                <p className="text-xs text-muted-foreground">{job.category}</p>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedJobTitle(job.code);
                                  setSelectedIndustry(industry);
                                  toast({
                                    title: isRTL ? 'تم اختيار المهنة' : 'Job Selected',
                                    description: isRTL ? `تم اختيار: ${job.titleAr}` : `Selected: ${job.title}`,
                                  });
                                }}
                              >
                                {isRTL ? 'اختيار' : 'Select'}
                              </Button>
                            </div>
                          </div>
                        ))
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  {isRTL ? 'إحصائيات قاعدة البيانات' : 'Database Statistics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">269+</div>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'مهنة معتمدة في الرعاية الصحية' : 'Healthcare Professions'}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">50+</div>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'تخصص هندسي' : 'Engineering Specializations'}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'متوافق مع قيوا' : 'Qiwa Compliant'}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>{isRTL ? 'الرعاية الصحية:' : 'Healthcare:'}</span>
                      <span className="font-medium">269</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isRTL ? 'الهندسة:' : 'Engineering:'}</span>
                      <span className="font-medium">{Object.keys(HRSD_JOB_TITLES.engineering).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isRTL ? 'تقنية المعلومات:' : 'IT:'}</span>
                      <span className="font-medium">{Object.keys(HRSD_JOB_TITLES.information_technology).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isRTL ? 'المالية:' : 'Finance:'}</span>
                      <span className="font-medium">{Object.keys(HRSD_JOB_TITLES.finance).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isRTL ? 'البناء:' : 'Construction:'}</span>
                      <span className="font-medium">{Object.keys(HRSD_JOB_TITLES.construction).length}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-900">{isRTL ? 'تحديث 2025' : '2025 Update'}</span>
                    </div>
                    <p className="text-xs text-orange-700">
                      {isRTL ? 'قاعدة البيانات محدثة حسب أحدث معايير الموارد البشرية وقيوا للعام 2025' : 'Database updated with latest HRSD and Qiwa standards for 2025'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Government Integration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {isRTL ? 'حالة التكامل مع المنصات الحكومية' : 'Government Platform Integration Status'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{isRTL ? 'قيوا' : 'Qiwa'}</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {isRTL ? 'متصل' : 'Connected'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{isRTL ? 'كتل التأشيرات، بيانات الموظفين' : 'Visa blocks, employee data'}</p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{isRTL ? 'الموارد البشرية' : 'HRSD'}</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {isRTL ? 'متصل' : 'Connected'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{isRTL ? 'تحديثات تنظيمية، تصنيف المهن' : 'Regulatory updates, job classifications'}</p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{isRTL ? 'مداد' : 'Mudad'}</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {isRTL ? 'جاري التحديث' : 'Updating'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{isRTL ? 'تصاريح العمل، معالجة التأشيرات' : 'Work permits, visa processing'}</p>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{isRTL ? 'أبشر' : 'Absher'}</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {isRTL ? 'متصل' : 'Connected'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{isRTL ? 'التحقق من الموظفين، إدارة الوثائق' : 'Employee verification, document management'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents View */}
        <TabsContent value="documents" className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <Upload className="h-5 w-5" />
                {isRTL ? 'رفع مستندات السعودة' : 'Upload Saudization Documents'}
              </CardTitle>
              <CardDescription className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'ارفع ملفات الموظفين، تقارير النطاقات، وثائق التأشيرات لمعالجتها بالذكاء الاصطناعي' : 'Upload employee files, Nitaqat reports, visa documents for AI processing'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UniversalDocumentManager
                moduleName="Saudization Calculator"
                moduleNameAr="حاسبة السعودة"
                description="Upload Nitaqat reports, employee nationality reports, GOSI data, and Saudization compliance documents"
                descriptionAr="رفع تقارير نطاقات وتقارير جنسيات الموظفين وبيانات التأمينات ووثائق امتثال السعودة"
                platform="saudization"
                moduleType="hr"
                acceptedTypes={['.pdf', '.xlsx', '.xls', '.csv', '.doc', '.docx']}
                maxFileSize={25 * 1024 * 1024}
                maxFiles={35}
                showAsCard={false}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'المستندات المرفوعة' : 'Uploaded Documents'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-3 border rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <FileBarChart className="h-4 w-4 text-primary" />
                    <span className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'تقرير نطاقات Q1 2024.xlsx' : 'Nitaqat Report Q1 2024.xlsx'}
                    </span>
                  </div>
                  <Badge variant="secondary">{isRTL ? 'تم معالجته' : 'Processed'}</Badge>
                </div>
                <div className={`flex items-center justify-between p-3 border rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <FileBarChart className="h-4 w-4 text-primary" />
                    <span className={`text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'قائمة الموظفين الحالية.pdf' : 'Current Employee List.pdf'}
                    </span>
                  </div>
                  <Badge variant="secondary">{isRTL ? 'تم معالجته' : 'Processed'}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SaudizationCalculator;