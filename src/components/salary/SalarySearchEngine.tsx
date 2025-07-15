import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { Search, Loader2, TrendingUp, Target, Globe, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SalaryData {
  minimum: number;
  midpoint: number;
  maximum: number;
  confidence: number;
  competitiveness: number;
  sources: string[];
  recommendations: string[];
  marketTrend: number;
}

interface Position {
  id: string;
  title: string;
  department: string;
  level: string;
}

export const SalarySearchEngine = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [filteredPositions, setFilteredPositions] = useState<Position[]>([]);

  const translations = {
    en: {
      salary_search_engine: "Salary Band Search Engine",
      search_placeholder: "Search job positions...",
      department: "Department",
      level: "Level",
      location: "Location",
      search_button: "Search Salary Data",
      salary_band_results: "Salary Band Results",
      minimum_salary: "Minimum",
      midpoint_salary: "Midpoint",
      maximum_salary: "Maximum",
      recommended_salary: "Recommended Salary",
      confidence_score: "Confidence Score",
      market_competitiveness: "Market Competitiveness",
      data_sources: "Data Sources",
      market_intelligence: "Market Intelligence",
      recommendations: "AI Recommendations",
      market_trend: "Market Trend",
      currency: "SAR",
      no_data: "No salary data available for this position",
      searching: "Searching market data...",
      select_department: "Select Department",
      select_level: "Select Level",
      all_departments: "All Departments",
      all_levels: "All Levels",
      // Tooltips
      salary_engine_tooltip: "Advanced search engine using real-time market data from multiple sources",
      confidence_tooltip: "Data quality and reliability score based on number of sources and data points",
      competitiveness_tooltip: "How competitive this salary is compared to market standards",
      recommendations_tooltip: "AI-powered recommendations based on market analysis and trends"
    },
    ar: {
      salary_search_engine: "محرك البحث عن نطاقات الرواتب",
      search_placeholder: "البحث عن المناصب الوظيفية...",
      department: "القسم",
      level: "المستوى",
      location: "الموقع",
      search_button: "البحث في بيانات الراتب",
      salary_band_results: "نتائج نطاق الراتب",
      minimum_salary: "الحد الأدنى",
      midpoint_salary: "النقطة الوسطى",
      maximum_salary: "الحد الأقصى",
      recommended_salary: "الراتب المُوصى به",
      confidence_score: "نقاط الثقة",
      market_competitiveness: "التنافسية السوقية",
      data_sources: "مصادر البيانات",
      market_intelligence: "الذكاء السوقي",
      recommendations: "توصيات الذكاء الاصطناعي",
      market_trend: "اتجاه السوق",
      currency: "ريال",
      no_data: "لا توجد بيانات راتب متاحة لهذا المنصب",
      searching: "البحث في بيانات السوق...",
      select_department: "اختر القسم",
      select_level: "اختر المستوى",
      all_departments: "جميع الأقسام",
      all_levels: "جميع المستويات",
      // Tooltips
      salary_engine_tooltip: "محرك بحث متقدم يستخدم بيانات السوق في الوقت الفعلي من مصادر متعددة",
      confidence_tooltip: "نقاط جودة وموثوقية البيانات بناءً على عدد المصادر ونقاط البيانات",
      competitiveness_tooltip: "مدى تنافسية هذا الراتب مقارنة بمعايير السوق",
      recommendations_tooltip: "توصيات مدعومة بالذكاء الاصطناعي بناءً على تحليل السوق والاتجاهات"
    }
  };

  const t = (key: string) => translations[language][key] || key;

  // Complete positions and departments from employee master data
  const positionsData = [
    // Executive Leadership (C-Level & Directors)
    { value: 'ceo', label: language === 'ar' ? 'الرئيس التنفيذي' : 'Chief Executive Officer (CEO)', department: 'executive_management', level: 'Executive' },
    { value: 'coo', label: language === 'ar' ? 'رئيس العمليات' : 'Chief Operating Officer (COO)', department: 'executive_management', level: 'Executive' },
    { value: 'cfo', label: language === 'ar' ? 'المدير المالي التنفيذي' : 'Chief Financial Officer (CFO)', department: 'finance', level: 'Executive' },
    { value: 'cto', label: language === 'ar' ? 'المدير التقني التنفيذي' : 'Chief Technology Officer (CTO)', department: 'it', level: 'Executive' },
    { value: 'cio', label: language === 'ar' ? 'مدير المعلومات التنفيذي' : 'Chief Information Officer (CIO)', department: 'it', level: 'Executive' },
    { value: 'chro', label: language === 'ar' ? 'مدير الموارد البشرية التنفيذي' : 'Chief Human Resources Officer (CHRO)', department: 'hr', level: 'Executive' },
    { value: 'cmo', label: language === 'ar' ? 'مدير التسويق التنفيذي' : 'Chief Marketing Officer (CMO)', department: 'marketing', level: 'Executive' },
    { value: 'board_member', label: language === 'ar' ? 'عضو مجلس إدارة' : 'Board Member', department: 'board_of_directors', level: 'Executive' },
    { value: 'executive_director', label: language === 'ar' ? 'مدير تنفيذي' : 'Executive Director', department: 'executive_management', level: 'Executive' },
    { value: 'regional_director', label: language === 'ar' ? 'مدير إقليمي' : 'Regional Director', department: 'executive_management', level: 'Director' },
    
    // Directors & VPs
    { value: 'director_operations', label: language === 'ar' ? 'مدير العمليات' : 'Director of Operations', department: 'operations', level: 'Director' },
    { value: 'director_finance', label: language === 'ar' ? 'مدير المالية' : 'Director of Finance', department: 'finance', level: 'Director' },
    { value: 'director_hr', label: language === 'ar' ? 'مدير الموارد البشرية' : 'Director of Human Resources', department: 'hr', level: 'Director' },
    { value: 'director_it', label: language === 'ar' ? 'مدير تقنية المعلومات' : 'Director of IT', department: 'it', level: 'Director' },
    { value: 'director_engineering', label: language === 'ar' ? 'مدير الهندسة' : 'Director of Engineering', department: 'civil_engineering', level: 'Director' },
    { value: 'director_sales', label: language === 'ar' ? 'مدير المبيعات' : 'Director of Sales', department: 'sales', level: 'Director' },
    { value: 'director_marketing', label: language === 'ar' ? 'مدير التسويق' : 'Director of Marketing', department: 'marketing', level: 'Director' },
    
    // Senior Management
    { value: 'project_manager', label: language === 'ar' ? 'مدير مشروع' : 'Project Manager', department: 'project_management', level: 'Senior' },
    { value: 'operations_manager', label: language === 'ar' ? 'مدير العمليات' : 'Operations Manager', department: 'operations', level: 'Senior' },
    { value: 'finance_manager', label: language === 'ar' ? 'مدير مالي' : 'Finance Manager', department: 'finance', level: 'Senior' },
    { value: 'hr_manager', label: language === 'ar' ? 'مدير موارد بشرية' : 'HR Manager', department: 'hr', level: 'Senior' },
    { value: 'it_manager', label: language === 'ar' ? 'مدير تقنية المعلومات' : 'IT Manager', department: 'it', level: 'Senior' },
    { value: 'sales_manager', label: language === 'ar' ? 'مدير مبيعات' : 'Sales Manager', department: 'sales', level: 'Senior' },
    { value: 'marketing_manager', label: language === 'ar' ? 'مدير تسويق' : 'Marketing Manager', department: 'marketing', level: 'Senior' },
    
    // Engineering Positions
    { value: 'civil_engineer', label: language === 'ar' ? 'مهندس مدني' : 'Civil Engineer', department: 'civil_engineering', level: 'Mid' },
    { value: 'mechanical_engineer', label: language === 'ar' ? 'مهندس ميكانيكي' : 'Mechanical Engineer', department: 'mechanical_engineering', level: 'Mid' },
    { value: 'electrical_engineer', label: language === 'ar' ? 'مهندس كهربائي' : 'Electrical Engineer', department: 'electrical_engineering', level: 'Mid' },
    { value: 'software_engineer', label: language === 'ar' ? 'مهندس برمجيات' : 'Software Engineer', department: 'software_development', level: 'Mid' },
    { value: 'senior_engineer', label: language === 'ar' ? 'مهندس أول' : 'Senior Engineer', department: 'civil_engineering', level: 'Senior' },
    
    // IT & Technology
    { value: 'software_developer', label: language === 'ar' ? 'مطور برمجيات' : 'Software Developer', department: 'software_development', level: 'Mid' },
    { value: 'web_developer', label: language === 'ar' ? 'مطور مواقع' : 'Web Developer', department: 'software_development', level: 'Mid' },
    { value: 'data_scientist', label: language === 'ar' ? 'عالم بيانات' : 'Data Scientist', department: 'data_analytics', level: 'Senior' },
    { value: 'cybersecurity_specialist', label: language === 'ar' ? 'أخصائي أمن معلومات' : 'Cybersecurity Specialist', department: 'cybersecurity', level: 'Senior' },
    { value: 'business_analyst', label: language === 'ar' ? 'محلل أعمال' : 'Business Analyst', department: 'it', level: 'Mid' },
    
    // Finance & Accounting
    { value: 'financial_analyst', label: language === 'ar' ? 'محلل مالي' : 'Financial Analyst', department: 'finance', level: 'Mid' },
    { value: 'accountant', label: language === 'ar' ? 'محاسب' : 'Accountant', department: 'accounting', level: 'Mid' },
    { value: 'auditor', label: language === 'ar' ? 'مدقق' : 'Auditor', department: 'internal_audit', level: 'Mid' },
    { value: 'senior_accountant', label: language === 'ar' ? 'محاسب أول' : 'Senior Accountant', department: 'accounting', level: 'Senior' },
    
    // Sales & Marketing
    { value: 'sales_representative', label: language === 'ar' ? 'مندوب مبيعات' : 'Sales Representative', department: 'sales', level: 'Junior' },
    { value: 'account_manager', label: language === 'ar' ? 'مدير حسابات' : 'Account Manager', department: 'sales', level: 'Mid' },
    { value: 'marketing_specialist', label: language === 'ar' ? 'أخصائي تسويق' : 'Marketing Specialist', department: 'marketing', level: 'Mid' },
    { value: 'digital_marketing_specialist', label: language === 'ar' ? 'أخصائي تسويق رقمي' : 'Digital Marketing Specialist', department: 'digital_marketing', level: 'Mid' },
    
    // Human Resources
    { value: 'hr_specialist', label: language === 'ar' ? 'أخصائي موارد بشرية' : 'HR Specialist', department: 'hr', level: 'Mid' },
    { value: 'recruitment_specialist', label: language === 'ar' ? 'أخصائي توظيف' : 'Recruitment Specialist', department: 'hr', level: 'Mid' },
    { value: 'training_specialist', label: language === 'ar' ? 'أخصائي تدريب' : 'Training Specialist', department: 'training_development', level: 'Mid' },
    
    // Healthcare
    { value: 'doctor', label: language === 'ar' ? 'طبيب' : 'Doctor', department: 'medical_services', level: 'Senior' },
    { value: 'nurse', label: language === 'ar' ? 'ممرض/ممرضة' : 'Nurse', department: 'nursing', level: 'Mid' },
    { value: 'pharmacist', label: language === 'ar' ? 'صيدلاني' : 'Pharmacist', department: 'pharmacy', level: 'Mid' },
    
    // Operations & Logistics
    { value: 'operations_specialist', label: language === 'ar' ? 'أخصائي عمليات' : 'Operations Specialist', department: 'operations', level: 'Mid' },
    { value: 'logistics_specialist', label: language === 'ar' ? 'أخصائي لوجستيات' : 'Logistics Specialist', department: 'logistics', level: 'Mid' },
    { value: 'warehouse_manager', label: language === 'ar' ? 'مدير المستودع' : 'Warehouse Manager', department: 'warehouse', level: 'Senior' }
  ];

  const departmentsData = [
    // Executive & Leadership
    { value: 'board_of_directors', label: language === 'ar' ? 'مجلس الإدارة' : 'Board of Directors' },
    { value: 'executive_management', label: language === 'ar' ? 'الإدارة التنفيذية' : 'Executive Management' },
    { value: 'ceo_office', label: language === 'ar' ? 'مكتب الرئيس التنفيذي' : 'CEO Office' },
    { value: 'strategic_planning', label: language === 'ar' ? 'التخطيط الاستراتيجي' : 'Strategic Planning' },
    
    // Administrative & Support
    { value: 'hr', label: language === 'ar' ? 'الموارد البشرية' : 'Human Resources' },
    { value: 'finance', label: language === 'ar' ? 'المالية' : 'Finance' },
    { value: 'accounting', label: language === 'ar' ? 'المحاسبة' : 'Accounting' },
    { value: 'legal', label: language === 'ar' ? 'الشؤون القانونية' : 'Legal Affairs' },
    { value: 'admin', label: language === 'ar' ? 'الشؤون الإدارية' : 'Administration' },
    { value: 'procurement', label: language === 'ar' ? 'المشتريات' : 'Procurement' },
    { value: 'supply_chain', label: language === 'ar' ? 'سلسلة التوريد' : 'Supply Chain' },
    { value: 'internal_audit', label: language === 'ar' ? 'التدقيق الداخلي' : 'Internal Audit' },
    { value: 'compliance', label: language === 'ar' ? 'الامتثال' : 'Compliance' },
    { value: 'risk_management', label: language === 'ar' ? 'إدارة المخاطر' : 'Risk Management' },
    
    // Technology & IT
    { value: 'it', label: language === 'ar' ? 'تكنولوجيا المعلومات' : 'Information Technology' },
    { value: 'cybersecurity', label: language === 'ar' ? 'الأمن السيبراني' : 'Cybersecurity' },
    { value: 'software_development', label: language === 'ar' ? 'تطوير البرمجيات' : 'Software Development' },
    { value: 'data_analytics', label: language === 'ar' ? 'تحليل البيانات' : 'Data Analytics' },
    { value: 'digital_transformation', label: language === 'ar' ? 'التحول الرقمي' : 'Digital Transformation' },
    { value: 'tech_support', label: language === 'ar' ? 'الدعم التقني' : 'Technical Support' },
    
    // Construction & Contracting
    { value: 'project_management', label: language === 'ar' ? 'إدارة المشاريع' : 'Project Management' },
    { value: 'construction_management', label: language === 'ar' ? 'إدارة الإنشاءات' : 'Construction Management' },
    { value: 'civil_engineering', label: language === 'ar' ? 'الهندسة المدنية' : 'Civil Engineering' },
    { value: 'mechanical_engineering', label: language === 'ar' ? 'الهندسة الميكانيكية' : 'Mechanical Engineering' },
    { value: 'electrical_engineering', label: language === 'ar' ? 'الهندسة الكهربائية' : 'Electrical Engineering' },
    { value: 'architectural_design', label: language === 'ar' ? 'التصميم المعماري' : 'Architectural Design' },
    { value: 'structural_engineering', label: language === 'ar' ? 'الهندسة الإنشائية' : 'Structural Engineering' },
    { value: 'site_supervision', label: language === 'ar' ? 'الإشراف الميداني' : 'Site Supervision' },
    { value: 'quantity_surveying', label: language === 'ar' ? 'المساحة الكمية' : 'Quantity Surveying' },
    { value: 'safety_engineering', label: language === 'ar' ? 'هندسة السلامة' : 'Safety Engineering' },
    { value: 'quality_control', label: language === 'ar' ? 'مراقبة الجودة' : 'Quality Control' },
    { value: 'materials_testing', label: language === 'ar' ? 'اختبار المواد' : 'Materials Testing' },
    
    // Oil & Gas
    { value: 'petroleum_engineering', label: language === 'ar' ? 'هندسة البترول' : 'Petroleum Engineering' },
    { value: 'drilling_operations', label: language === 'ar' ? 'عمليات الحفر' : 'Drilling Operations' },
    { value: 'production_engineering', label: language === 'ar' ? 'هندسة الإنتاج' : 'Production Engineering' },
    { value: 'reservoir_engineering', label: language === 'ar' ? 'هندسة المكامن' : 'Reservoir Engineering' },
    { value: 'process_engineering', label: language === 'ar' ? 'هندسة العمليات' : 'Process Engineering' },
    { value: 'pipeline_engineering', label: language === 'ar' ? 'هندسة الأنابيب' : 'Pipeline Engineering' },
    { value: 'refining_operations', label: language === 'ar' ? 'عمليات التكرير' : 'Refining Operations' },
    { value: 'petrochemicals', label: language === 'ar' ? 'البتروكيماويات' : 'Petrochemicals' },
    
    // Healthcare
    { value: 'medical_services', label: language === 'ar' ? 'الخدمات الطبية' : 'Medical Services' },
    { value: 'nursing', label: language === 'ar' ? 'التمريض' : 'Nursing' },
    { value: 'pharmacy', label: language === 'ar' ? 'الصيدلة' : 'Pharmacy' },
    { value: 'laboratory', label: language === 'ar' ? 'المختبر' : 'Laboratory' },
    { value: 'radiology', label: language === 'ar' ? 'الأشعة' : 'Radiology' },
    { value: 'emergency_medicine', label: language === 'ar' ? 'طب الطوارئ' : 'Emergency Medicine' },
    { value: 'medical_records', label: language === 'ar' ? 'السجلات الطبية' : 'Medical Records' },
    
    // Education
    { value: 'academic_affairs', label: language === 'ar' ? 'الشؤون الأكاديمية' : 'Academic Affairs' },
    { value: 'student_services', label: language === 'ar' ? 'خدمات الطلاب' : 'Student Services' },
    { value: 'faculty_development', label: language === 'ar' ? 'تطوير أعضاء هيئة التدريس' : 'Faculty Development' },
    { value: 'curriculum_development', label: language === 'ar' ? 'تطوير المناهج' : 'Curriculum Development' },
    { value: 'research_development', label: language === 'ar' ? 'البحث والتطوير' : 'Research & Development' },
    { value: 'library_services', label: language === 'ar' ? 'خدمات المكتبة' : 'Library Services' },
    
    // Manufacturing & Industrial
    { value: 'production', label: language === 'ar' ? 'الإنتاج' : 'Production' },
    { value: 'manufacturing', label: language === 'ar' ? 'التصنيع' : 'Manufacturing' },
    { value: 'industrial_engineering', label: language === 'ar' ? 'الهندسة الصناعية' : 'Industrial Engineering' },
    { value: 'maintenance', label: language === 'ar' ? 'الصيانة' : 'Maintenance' },
    { value: 'quality_assurance', label: language === 'ar' ? 'ضمان الجودة' : 'Quality Assurance' },
    { value: 'operations', label: language === 'ar' ? 'العمليات' : 'Operations' },
    { value: 'logistics', label: language === 'ar' ? 'اللوجستيات' : 'Logistics' },
    { value: 'warehouse', label: language === 'ar' ? 'المستودعات' : 'Warehouse' },
    
    // Banking & Finance
    { value: 'corporate_banking', label: language === 'ar' ? 'الخدمات المصرفية للشركات' : 'Corporate Banking' },
    { value: 'retail_banking', label: language === 'ar' ? 'الخدمات المصرفية للأفراد' : 'Retail Banking' },
    { value: 'investment_banking', label: language === 'ar' ? 'الخدمات المصرفية الاستثمارية' : 'Investment Banking' },
    { value: 'islamic_banking', label: language === 'ar' ? 'المصرفية الإسلامية' : 'Islamic Banking' },
    { value: 'treasury', label: language === 'ar' ? 'الخزينة' : 'Treasury' },
    { value: 'credit_risk', label: language === 'ar' ? 'مخاطر الائتمان' : 'Credit Risk' },
    { value: 'financial_planning', label: language === 'ar' ? 'التخطيط المالي' : 'Financial Planning' },
    
    // Sales & Marketing
    { value: 'marketing', label: language === 'ar' ? 'التسويق' : 'Marketing' },
    { value: 'sales', label: language === 'ar' ? 'المبيعات' : 'Sales' },
    { value: 'digital_marketing', label: language === 'ar' ? 'التسويق الرقمي' : 'Digital Marketing' },
    { value: 'business_development', label: language === 'ar' ? 'تطوير الأعمال' : 'Business Development' },
    { value: 'customer_service', label: language === 'ar' ? 'خدمة العملاء' : 'Customer Service' },
    { value: 'public_relations', label: language === 'ar' ? 'العلاقات العامة' : 'Public Relations' },
    
    // Training & Development
    { value: 'training_development', label: language === 'ar' ? 'التدريب والتطوير' : 'Training & Development' },
    
    // Other
    { value: 'other', label: language === 'ar' ? 'أخرى' : 'Other' }
  ];

  useEffect(() => {
    const formattedPositions: Position[] = positionsData.map((pos, index) => ({
      id: (index + 1).toString(),
      title: pos.label,
      department: pos.department,
      level: pos.level
    }));
    setPositions(formattedPositions);
    setFilteredPositions(formattedPositions);
  }, [language]);

  // Filter positions based on search and filters
  useEffect(() => {
    let filtered = positions;

    if (searchTerm) {
      filtered = filtered.filter(pos => 
        pos.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment && selectedDepartment !== "all") {
      filtered = filtered.filter(pos => pos.department === selectedDepartment);
    }

    if (selectedLevel && selectedLevel !== "all") {
      filtered = filtered.filter(pos => pos.level === selectedLevel);
    }

    setFilteredPositions(filtered);
  }, [searchTerm, selectedDepartment, selectedLevel, positions]);

  const handleSearch = async () => {
    if (!selectedPosition && !searchTerm) {
      toast({
        title: "Search Required",
        description: "Please select a position or enter a search term",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setSalaryData(null);

    try {
      const position = selectedPosition || searchTerm;
      const { data, error } = await supabase.functions.invoke('salary-market-intelligence', {
        body: {
          position,
          department: selectedDepartment,
          level: selectedLevel,
          location: "Saudi Arabia"
        }
      });

      if (error) throw error;

      setSalaryData(data);
      toast({
        title: "Search Complete",
        description: "Salary data retrieved successfully",
      });
    } catch (error) {
      console.error('Error fetching salary data:', error);
      toast({
        title: "Search Failed",
        description: "Could not retrieve salary data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getCompetitivenessColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const departments = [...new Set(positions.map(p => p.department))];
  const levels = [...new Set(positions.map(p => p.level))];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Search className="h-6 w-6 text-brand-primary" />
          <h2 className="text-2xl font-bold text-foreground">{t('salary_search_engine')}</h2>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{t('salary_engine_tooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Search Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Position Search Interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('search_placeholder')}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    list="positions"
                  />
                  <datalist id="positions">
                    {filteredPositions.map((pos) => (
                      <option key={pos.id} value={pos.title} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('department')}
                </label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_department')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all_departments')}</SelectItem>
                    {departmentsData.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t('level')}
                </label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_level')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all_levels')}</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Action</label>
                <Button 
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('searching')}
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      {t('search_button')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary Band Results */}
        {salaryData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-brand-primary" />
                {t('salary_band_results')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Salary Range Visualization */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{t('minimum_salary')}</span>
                  <span>{t('midpoint_salary')}</span>
                  <span>{t('maximum_salary')}</span>
                </div>
                <div className="relative">
                  <Progress value={50} className="h-8" />
                  <div className="absolute inset-0 flex justify-between items-center px-2">
                    <span className="text-xs font-medium text-white">
                      {formatCurrency(salaryData.minimum)}
                    </span>
                    <span className="text-xs font-bold text-white bg-brand-primary px-2 py-1 rounded">
                      {formatCurrency(salaryData.midpoint)}
                    </span>
                    <span className="text-xs font-medium text-white">
                      {formatCurrency(salaryData.maximum)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Salary & Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-700 mb-1">
                      {formatCurrency(salaryData.midpoint)}
                    </div>
                    <p className="text-sm text-blue-600">{t('recommended_salary')}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`text-2xl font-bold ${getConfidenceColor(salaryData.confidence)}`}>
                        {salaryData.confidence}%
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{t('confidence_tooltip')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-green-600">{t('confidence_score')}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`text-2xl font-bold ${getCompetitivenessColor(salaryData.competitiveness)}`}>
                        {salaryData.competitiveness}%
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{t('competitiveness_tooltip')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-purple-600">{t('market_competitiveness')}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Market Intelligence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {t('data_sources')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {salaryData.sources.map((source, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      {t('market_intelligence')}
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{t('recommendations_tooltip')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{t('market_trend')}:</span>
                        <span className={`font-medium ${salaryData.marketTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {salaryData.marketTrend > 0 ? '+' : ''}{salaryData.marketTrend}%
                        </span>
                      </div>
                      {salaryData.recommendations.map((rec, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          • {rec}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {salaryData === null && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('no_data')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};