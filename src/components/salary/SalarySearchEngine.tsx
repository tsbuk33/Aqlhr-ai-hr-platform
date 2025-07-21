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
    { value: 'senior_project_manager', label: language === 'ar' ? 'مدير مشروع أول' : 'Senior Project Manager', department: 'project_management', level: 'Senior' },
    { value: 'construction_manager', label: language === 'ar' ? 'مدير إنشاءات' : 'Construction Manager', department: 'construction_management', level: 'Senior' },
    { value: 'operations_manager', label: language === 'ar' ? 'مدير العمليات' : 'Operations Manager', department: 'operations', level: 'Senior' },
    { value: 'finance_manager', label: language === 'ar' ? 'مدير مالي' : 'Finance Manager', department: 'finance', level: 'Senior' },
    { value: 'hr_manager', label: language === 'ar' ? 'مدير موارد بشرية' : 'HR Manager', department: 'hr', level: 'Senior' },
    { value: 'it_manager', label: language === 'ar' ? 'مدير تقنية المعلومات' : 'IT Manager', department: 'it', level: 'Senior' },
    { value: 'sales_manager', label: language === 'ar' ? 'مدير مبيعات' : 'Sales Manager', department: 'sales', level: 'Senior' },
    { value: 'marketing_manager', label: language === 'ar' ? 'مدير تسويق' : 'Marketing Manager', department: 'marketing', level: 'Senior' },
    
    // Engineering Positions (All Types)
    { value: 'civil_engineer', label: language === 'ar' ? 'مهندس مدني' : 'Civil Engineer', department: 'civil_engineering', level: 'Mid' },
    { value: 'senior_civil_engineer', label: language === 'ar' ? 'مهندس مدني أول' : 'Senior Civil Engineer', department: 'civil_engineering', level: 'Senior' },
    { value: 'structural_engineer', label: language === 'ar' ? 'مهندس إنشائي' : 'Structural Engineer', department: 'structural_engineering', level: 'Mid' },
    { value: 'mechanical_engineer', label: language === 'ar' ? 'مهندس ميكانيكي' : 'Mechanical Engineer', department: 'mechanical_engineering', level: 'Mid' },
    { value: 'electrical_engineer', label: language === 'ar' ? 'مهندس كهربائي' : 'Electrical Engineer', department: 'electrical_engineering', level: 'Mid' },
    { value: 'chemical_engineer', label: language === 'ar' ? 'مهندس كيميائي' : 'Chemical Engineer', department: 'chemical_engineering', level: 'Mid' },
    { value: 'petroleum_engineer', label: language === 'ar' ? 'مهندس بترول' : 'Petroleum Engineer', department: 'petroleum_engineering', level: 'Mid' },
    { value: 'industrial_engineer', label: language === 'ar' ? 'مهندس صناعي' : 'Industrial Engineer', department: 'industrial_engineering', level: 'Mid' },
    { value: 'environmental_engineer', label: language === 'ar' ? 'مهندس بيئي' : 'Environmental Engineer', department: 'environmental_engineering', level: 'Mid' },
    { value: 'geotechnical_engineer', label: language === 'ar' ? 'مهندس جيوتقني' : 'Geotechnical Engineer', department: 'geotechnical_engineering', level: 'Mid' },
    { value: 'process_engineer', label: language === 'ar' ? 'مهندس عمليات' : 'Process Engineer', department: 'process_engineering', level: 'Mid' },
    { value: 'project_engineer', label: language === 'ar' ? 'مهندس مشاريع' : 'Project Engineer', department: 'project_management', level: 'Mid' },
    { value: 'design_engineer', label: language === 'ar' ? 'مهندس تصميم' : 'Design Engineer', department: 'design_engineering', level: 'Mid' },
    { value: 'qa_engineer', label: language === 'ar' ? 'مهندس ضمان جودة' : 'QA Engineer', department: 'quality_assurance', level: 'Mid' },
    { value: 'qc_engineer', label: language === 'ar' ? 'مهندس مراقبة جودة' : 'QC Engineer', department: 'quality_control', level: 'Mid' },
    { value: 'hse_engineer', label: language === 'ar' ? 'مهندس سلامة وصحة مهنية وبيئة' : 'HSE Engineer', department: 'hse', level: 'Mid' },
    { value: 'safety_engineer', label: language === 'ar' ? 'مهندس سلامة' : 'Safety Engineer', department: 'safety', level: 'Mid' },
    { value: 'software_engineer', label: language === 'ar' ? 'مهندس برمجيات' : 'Software Engineer', department: 'software_development', level: 'Mid' },
    { value: 'network_engineer', label: language === 'ar' ? 'مهندس شبكات' : 'Network Engineer', department: 'networking', level: 'Mid' },
    { value: 'systems_engineer', label: language === 'ar' ? 'مهندس أنظمة' : 'Systems Engineer', department: 'systems_engineering', level: 'Mid' },
    
    // Construction & Field Positions
    { value: 'general_foreman', label: language === 'ar' ? 'وكيل عام' : 'General Foreman', department: 'construction_management', level: 'Senior' },
    { value: 'foreman', label: language === 'ar' ? 'وكيل' : 'Foreman', department: 'construction_management', level: 'Mid' },
    { value: 'site_supervisor', label: language === 'ar' ? 'مشرف موقع' : 'Site Supervisor', department: 'site_supervision', level: 'Mid' },
    { value: 'construction_supervisor', label: language === 'ar' ? 'مشرف إنشاءات' : 'Construction Supervisor', department: 'construction_management', level: 'Mid' },
    { value: 'site_engineer', label: language === 'ar' ? 'مهندس موقع' : 'Site Engineer', department: 'site_supervision', level: 'Mid' },
    { value: 'resident_engineer', label: language === 'ar' ? 'مهندس مقيم' : 'Resident Engineer', department: 'site_supervision', level: 'Senior' },
    
    // Skilled Trades & Craftsmen
    { value: 'mason', label: language === 'ar' ? 'بناء' : 'Mason', department: 'masonry', level: 'Junior' },
    { value: 'senior_mason', label: language === 'ar' ? 'بناء أول' : 'Senior Mason', department: 'masonry', level: 'Mid' },
    { value: 'steel_fixer', label: language === 'ar' ? 'حداد تسليح' : 'Steel Fixer', department: 'steel_fixing', level: 'Junior' },
    { value: 'senior_steel_fixer', label: language === 'ar' ? 'حداد تسليح أول' : 'Senior Steel Fixer', department: 'steel_fixing', level: 'Mid' },
    { value: 'carpenter', label: language === 'ar' ? 'نجار' : 'Carpenter', department: 'carpentry', level: 'Junior' },
    { value: 'senior_carpenter', label: language === 'ar' ? 'نجار أول' : 'Senior Carpenter', department: 'carpentry', level: 'Mid' },
    { value: 'plumber', label: language === 'ar' ? 'سباك' : 'Plumber', department: 'plumbing', level: 'Junior' },
    { value: 'senior_plumber', label: language === 'ar' ? 'سباك أول' : 'Senior Plumber', department: 'plumbing', level: 'Mid' },
    { value: 'electrician', label: language === 'ar' ? 'كهربائي' : 'Electrician', department: 'electrical_work', level: 'Junior' },
    { value: 'senior_electrician', label: language === 'ar' ? 'كهربائي أول' : 'Senior Electrician', department: 'electrical_work', level: 'Mid' },
    { value: 'welder', label: language === 'ar' ? 'لحام' : 'Welder', department: 'welding', level: 'Junior' },
    { value: 'senior_welder', label: language === 'ar' ? 'لحام أول' : 'Senior Welder', department: 'welding', level: 'Mid' },
    { value: 'painter', label: language === 'ar' ? 'دهان' : 'Painter', department: 'painting', level: 'Junior' },
    { value: 'tiler', label: language === 'ar' ? 'بلاط' : 'Tiler', department: 'tiling', level: 'Junior' },
    { value: 'plasterer', label: language === 'ar' ? 'قصار' : 'Plasterer', department: 'plastering', level: 'Junior' },
    { value: 'insulation_worker', label: language === 'ar' ? 'عامل عزل' : 'Insulation Worker', department: 'insulation', level: 'Junior' },
    { value: 'glass_installer', label: language === 'ar' ? 'مركب زجاج' : 'Glass Installer', department: 'glazing', level: 'Junior' },
    { value: 'aluminum_worker', label: language === 'ar' ? 'عامل ألمنيوم' : 'Aluminum Worker', department: 'aluminum_work', level: 'Junior' },
    
    // Heavy Equipment & Operations
    { value: 'crane_operator', label: language === 'ar' ? 'مشغل رافعة' : 'Crane Operator', department: 'heavy_equipment', level: 'Mid' },
    { value: 'excavator_operator', label: language === 'ar' ? 'مشغل حفارة' : 'Excavator Operator', department: 'heavy_equipment', level: 'Mid' },
    { value: 'bulldozer_operator', label: language === 'ar' ? 'مشغل جرافة' : 'Bulldozer Operator', department: 'heavy_equipment', level: 'Mid' },
    { value: 'loader_operator', label: language === 'ar' ? 'مشغل محملة' : 'Loader Operator', department: 'heavy_equipment', level: 'Mid' },
    { value: 'grader_operator', label: language === 'ar' ? 'مشغل سحالة' : 'Grader Operator', department: 'heavy_equipment', level: 'Mid' },
    { value: 'truck_driver', label: language === 'ar' ? 'سائق شاحنة' : 'Truck Driver', department: 'transportation', level: 'Junior' },
    { value: 'concrete_pump_operator', label: language === 'ar' ? 'مشغل مضخة خرسانة' : 'Concrete Pump Operator', department: 'concrete_operations', level: 'Mid' },
    { value: 'concrete_mixer_driver', label: language === 'ar' ? 'سائق خلاطة خرسانة' : 'Concrete Mixer Driver', department: 'concrete_operations', level: 'Junior' },
    
    // Road Construction & Asphalt
    { value: 'asphalt_operator', label: language === 'ar' ? 'مشغل أسفلت' : 'Asphalt Operator', department: 'asphalt_operations', level: 'Mid' },
    { value: 'asphalt_labor', label: language === 'ar' ? 'عامل أسفلت' : 'Asphalt Labor', department: 'asphalt_operations', level: 'Junior' },
    { value: 'road_construction_worker', label: language === 'ar' ? 'عامل إنشاء طرق' : 'Road Construction Worker', department: 'road_construction', level: 'Junior' },
    { value: 'paver_operator', label: language === 'ar' ? 'مشغل فرادة' : 'Paver Operator', department: 'asphalt_operations', level: 'Mid' },
    { value: 'roller_operator', label: language === 'ar' ? 'مشغل دحل' : 'Roller Operator', department: 'asphalt_operations', level: 'Mid' },
    
    // Quality Control & Testing
    { value: 'qaqc_inspector', label: language === 'ar' ? 'مفتش ضمان وضبط الجودة' : 'QA/QC Inspector', department: 'qaqc', level: 'Mid' },
    { value: 'quality_inspector', label: language === 'ar' ? 'مفتش جودة' : 'Quality Inspector', department: 'quality_control', level: 'Mid' },
    { value: 'materials_tester', label: language === 'ar' ? 'فاحص مواد' : 'Materials Tester', department: 'materials_testing', level: 'Mid' },
    { value: 'concrete_tester', label: language === 'ar' ? 'فاحص خرسانة' : 'Concrete Tester', department: 'materials_testing', level: 'Mid' },
    { value: 'soil_tester', label: language === 'ar' ? 'فاحص تربة' : 'Soil Tester', department: 'materials_testing', level: 'Mid' },
    { value: 'asphalt_tester', label: language === 'ar' ? 'فاحص أسفلت' : 'Asphalt Tester', department: 'materials_testing', level: 'Mid' },
    { value: 'ndt_technician', label: language === 'ar' ? 'فني اختبارات غير مدمرة' : 'NDT Technician', department: 'materials_testing', level: 'Mid' },
    
    // Health, Safety & Environment (HSE)
    { value: 'hse_manager', label: language === 'ar' ? 'مدير السلامة والصحة المهنية والبيئة' : 'HSE Manager', department: 'hse', level: 'Senior' },
    { value: 'hse_supervisor', label: language === 'ar' ? 'مشرف السلامة والصحة المهنية والبيئة' : 'HSE Supervisor', department: 'hse', level: 'Mid' },
    { value: 'safety_officer', label: language === 'ar' ? 'ضابط سلامة' : 'Safety Officer', department: 'safety', level: 'Mid' },
    { value: 'safety_inspector', label: language === 'ar' ? 'مفتش سلامة' : 'Safety Inspector', department: 'safety', level: 'Mid' },
    { value: 'environmental_specialist', label: language === 'ar' ? 'أخصائي بيئي' : 'Environmental Specialist', department: 'environmental', level: 'Mid' },
    { value: 'industrial_hygienist', label: language === 'ar' ? 'أخصائي صحة مهنية' : 'Industrial Hygienist', department: 'occupational_health', level: 'Mid' },
    { value: 'fire_safety_officer', label: language === 'ar' ? 'ضابط أمان حريق' : 'Fire Safety Officer', department: 'fire_safety', level: 'Mid' },
    
    // Surveying & Mapping
    { value: 'land_surveyor', label: language === 'ar' ? 'مساح أراضي' : 'Land Surveyor', department: 'surveying', level: 'Mid' },
    { value: 'quantity_surveyor', label: language === 'ar' ? 'مساح كميات' : 'Quantity Surveyor', department: 'quantity_surveying', level: 'Mid' },
    { value: 'senior_quantity_surveyor', label: language === 'ar' ? 'مساح كميات أول' : 'Senior Quantity Surveyor', department: 'quantity_surveying', level: 'Senior' },
    { value: 'survey_technician', label: language === 'ar' ? 'فني مساحة' : 'Survey Technician', department: 'surveying', level: 'Junior' },
    { value: 'gis_specialist', label: language === 'ar' ? 'أخصائي نظم معلومات جغرافية' : 'GIS Specialist', department: 'gis_mapping', level: 'Mid' },
    
    // IT & Technology
    { value: 'software_developer', label: language === 'ar' ? 'مطور برمجيات' : 'Software Developer', department: 'software_development', level: 'Mid' },
    { value: 'web_developer', label: language === 'ar' ? 'مطور مواقع' : 'Web Developer', department: 'software_development', level: 'Mid' },
    { value: 'data_scientist', label: language === 'ar' ? 'عالم بيانات' : 'Data Scientist', department: 'data_analytics', level: 'Senior' },
    { value: 'cybersecurity_specialist', label: language === 'ar' ? 'أخصائي أمن معلومات' : 'Cybersecurity Specialist', department: 'cybersecurity', level: 'Senior' },
    { value: 'business_analyst', label: language === 'ar' ? 'محلل أعمال' : 'Business Analyst', department: 'it', level: 'Mid' },
    { value: 'database_administrator', label: language === 'ar' ? 'مدير قواعد بيانات' : 'Database Administrator', department: 'it', level: 'Mid' },
    { value: 'it_support_specialist', label: language === 'ar' ? 'أخصائي دعم تقني' : 'IT Support Specialist', department: 'tech_support', level: 'Junior' },
    
    // Finance & Accounting
    { value: 'financial_analyst', label: language === 'ar' ? 'محلل مالي' : 'Financial Analyst', department: 'finance', level: 'Mid' },
    { value: 'accountant', label: language === 'ar' ? 'محاسب' : 'Accountant', department: 'accounting', level: 'Mid' },
    { value: 'senior_accountant', label: language === 'ar' ? 'محاسب أول' : 'Senior Accountant', department: 'accounting', level: 'Senior' },
    { value: 'cost_accountant', label: language === 'ar' ? 'محاسب تكاليف' : 'Cost Accountant', department: 'accounting', level: 'Mid' },
    { value: 'auditor', label: language === 'ar' ? 'مدقق' : 'Auditor', department: 'internal_audit', level: 'Mid' },
    { value: 'financial_controller', label: language === 'ar' ? 'مراقب مالي' : 'Financial Controller', department: 'finance', level: 'Senior' },
    { value: 'treasury_specialist', label: language === 'ar' ? 'أخصائي خزينة' : 'Treasury Specialist', department: 'treasury', level: 'Mid' },
    
    // Procurement & Supply Chain
    { value: 'procurement_manager', label: language === 'ar' ? 'مدير مشتريات' : 'Procurement Manager', department: 'procurement', level: 'Senior' },
    { value: 'procurement_specialist', label: language === 'ar' ? 'أخصائي مشتريات' : 'Procurement Specialist', department: 'procurement', level: 'Mid' },
    { value: 'buyer', label: language === 'ar' ? 'مشتري' : 'Buyer', department: 'procurement', level: 'Junior' },
    { value: 'supply_chain_analyst', label: language === 'ar' ? 'محلل سلسلة توريد' : 'Supply Chain Analyst', department: 'supply_chain', level: 'Mid' },
    { value: 'logistics_coordinator', label: language === 'ar' ? 'منسق لوجستيات' : 'Logistics Coordinator', department: 'logistics', level: 'Mid' },
    { value: 'warehouse_supervisor', label: language === 'ar' ? 'مشرف مستودع' : 'Warehouse Supervisor', department: 'warehouse', level: 'Mid' },
    { value: 'warehouse_manager', label: language === 'ar' ? 'مدير المستودع' : 'Warehouse Manager', department: 'warehouse', level: 'Senior' },
    { value: 'inventory_controller', label: language === 'ar' ? 'مراقب مخزون' : 'Inventory Controller', department: 'warehouse', level: 'Mid' },
    
    // Sales & Marketing
    { value: 'sales_representative', label: language === 'ar' ? 'مندوب مبيعات' : 'Sales Representative', department: 'sales', level: 'Junior' },
    { value: 'account_manager', label: language === 'ar' ? 'مدير حسابات' : 'Account Manager', department: 'sales', level: 'Mid' },
    { value: 'business_development_manager', label: language === 'ar' ? 'مدير تطوير أعمال' : 'Business Development Manager', department: 'business_development', level: 'Senior' },
    { value: 'marketing_specialist', label: language === 'ar' ? 'أخصائي تسويق' : 'Marketing Specialist', department: 'marketing', level: 'Mid' },
    { value: 'digital_marketing_specialist', label: language === 'ar' ? 'أخصائي تسويق رقمي' : 'Digital Marketing Specialist', department: 'digital_marketing', level: 'Mid' },
    { value: 'proposals_manager', label: language === 'ar' ? 'مدير عطاءات' : 'Proposals Manager', department: 'proposals', level: 'Senior' },
    { value: 'bid_manager', label: language === 'ar' ? 'مدير مناقصات' : 'Bid Manager', department: 'proposals', level: 'Senior' },
    
    // Human Resources
    { value: 'hr_specialist', label: language === 'ar' ? 'أخصائي موارد بشرية' : 'HR Specialist', department: 'hr', level: 'Mid' },
    { value: 'recruitment_specialist', label: language === 'ar' ? 'أخصائي توظيف' : 'Recruitment Specialist', department: 'hr', level: 'Mid' },
    { value: 'training_specialist', label: language === 'ar' ? 'أخصائي تدريب' : 'Training Specialist', department: 'training_development', level: 'Mid' },
    { value: 'payroll_specialist', label: language === 'ar' ? 'أخصائي رواتب' : 'Payroll Specialist', department: 'hr', level: 'Mid' },
    { value: 'hr_business_partner', label: language === 'ar' ? 'شريك أعمال موارد بشرية' : 'HR Business Partner', department: 'hr', level: 'Senior' },
    
    // Legal & Compliance
    { value: 'legal_counsel', label: language === 'ar' ? 'مستشار قانوني' : 'Legal Counsel', department: 'legal', level: 'Senior' },
    { value: 'contracts_manager', label: language === 'ar' ? 'مدير عقود' : 'Contracts Manager', department: 'contracts', level: 'Senior' },
    { value: 'compliance_officer', label: language === 'ar' ? 'ضابط امتثال' : 'Compliance Officer', department: 'compliance', level: 'Mid' },
    { value: 'legal_assistant', label: language === 'ar' ? 'مساعد قانوني' : 'Legal Assistant', department: 'legal', level: 'Junior' },
    
    // Healthcare (for companies with medical facilities)
    { value: 'doctor', label: language === 'ar' ? 'طبيب' : 'Doctor', department: 'medical_services', level: 'Senior' },
    { value: 'nurse', label: language === 'ar' ? 'ممرض/ممرضة' : 'Nurse', department: 'nursing', level: 'Mid' },
    { value: 'paramedic', label: language === 'ar' ? 'مسعف' : 'Paramedic', department: 'emergency_medical', level: 'Mid' },
    { value: 'pharmacist', label: language === 'ar' ? 'صيدلاني' : 'Pharmacist', department: 'pharmacy', level: 'Mid' },
    { value: 'medical_technician', label: language === 'ar' ? 'فني طبي' : 'Medical Technician', department: 'medical_services', level: 'Mid' },
    
    // Security & Facilities
    { value: 'security_manager', label: language === 'ar' ? 'مدير أمن' : 'Security Manager', department: 'security', level: 'Senior' },
    { value: 'security_guard', label: language === 'ar' ? 'حارس أمن' : 'Security Guard', department: 'security', level: 'Junior' },
    { value: 'facilities_manager', label: language === 'ar' ? 'مدير مرافق' : 'Facilities Manager', department: 'facilities', level: 'Senior' },
    { value: 'maintenance_supervisor', label: language === 'ar' ? 'مشرف صيانة' : 'Maintenance Supervisor', department: 'maintenance', level: 'Mid' },
    { value: 'maintenance_technician', label: language === 'ar' ? 'فني صيانة' : 'Maintenance Technician', department: 'maintenance', level: 'Junior' },
    { value: 'hvac_technician', label: language === 'ar' ? 'فني تكييف' : 'HVAC Technician', department: 'hvac', level: 'Junior' },
    { value: 'janitor', label: language === 'ar' ? 'عامل نظافة' : 'Janitor', department: 'cleaning', level: 'Junior' },
    { value: 'landscaper', label: language === 'ar' ? 'عامل تنسيق حدائق' : 'Landscaper', department: 'landscaping', level: 'Junior' },
    
    // General Labor
    { value: 'general_laborer', label: language === 'ar' ? 'عامل عام' : 'General Laborer', department: 'general_labor', level: 'Junior' },
    { value: 'construction_laborer', label: language === 'ar' ? 'عامل إنشاءات' : 'Construction Laborer', department: 'construction_labor', level: 'Junior' },
    { value: 'helper', label: language === 'ar' ? 'مساعد' : 'Helper', department: 'general_labor', level: 'Entry' },
    { value: 'watchman', label: language === 'ar' ? 'حارس' : 'Watchman', department: 'security', level: 'Junior' },
    
    // Administrative Support
    { value: 'administrative_assistant', label: language === 'ar' ? 'مساعد إداري' : 'Administrative Assistant', department: 'admin', level: 'Junior' },
    { value: 'executive_assistant', label: language === 'ar' ? 'مساعد تنفيذي' : 'Executive Assistant', department: 'admin', level: 'Mid' },
    { value: 'secretary', label: language === 'ar' ? 'سكرتير' : 'Secretary', department: 'admin', level: 'Junior' },
    { value: 'receptionist', label: language === 'ar' ? 'موظف استقبال' : 'Receptionist', department: 'admin', level: 'Junior' },
    { value: 'data_entry_clerk', label: language === 'ar' ? 'موظف إدخال بيانات' : 'Data Entry Clerk', department: 'admin', level: 'Junior' },
    { value: 'filing_clerk', label: language === 'ar' ? 'موظف أرشيف' : 'Filing Clerk', department: 'admin', level: 'Junior' },
    
    // Specialized Trades
    { value: 'scaffolder', label: language === 'ar' ? 'مركب سقالات' : 'Scaffolder', department: 'scaffolding', level: 'Junior' },
    { value: 'rigger', label: language === 'ar' ? 'مجهز رفع' : 'Rigger', department: 'rigging', level: 'Mid' },
    { value: 'blaster', label: language === 'ar' ? 'متفجرات' : 'Blaster', department: 'blasting', level: 'Mid' },
    { value: 'demolition_worker', label: language === 'ar' ? 'عامل هدم' : 'Demolition Worker', department: 'demolition', level: 'Junior' },
    { value: 'cable_technician', label: language === 'ar' ? 'فني كوابل' : 'Cable Technician', department: 'electrical_work', level: 'Mid' },
    { value: 'fiber_optic_technician', label: language === 'ar' ? 'فني ألياف بصرية' : 'Fiber Optic Technician', department: 'telecommunications', level: 'Mid' }
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
    { value: 'treasury', label: language === 'ar' ? 'الخزينة' : 'Treasury' },
    { value: 'legal', label: language === 'ar' ? 'الشؤون القانونية' : 'Legal Affairs' },
    { value: 'contracts', label: language === 'ar' ? 'العقود' : 'Contracts' },
    { value: 'admin', label: language === 'ar' ? 'الشؤون الإدارية' : 'Administration' },
    { value: 'procurement', label: language === 'ar' ? 'المشتريات' : 'Procurement' },
    { value: 'supply_chain', label: language === 'ar' ? 'سلسلة التوريد' : 'Supply Chain' },
    { value: 'logistics', label: language === 'ar' ? 'اللوجستيات' : 'Logistics' },
    { value: 'warehouse', label: language === 'ar' ? 'المستودعات' : 'Warehouse' },
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
    { value: 'networking', label: language === 'ar' ? 'الشبكات' : 'Networking' },
    { value: 'systems_engineering', label: language === 'ar' ? 'هندسة الأنظمة' : 'Systems Engineering' },
    { value: 'telecommunications', label: language === 'ar' ? 'الاتصالات' : 'Telecommunications' },
    
    // Construction & Contracting
    { value: 'project_management', label: language === 'ar' ? 'إدارة المشاريع' : 'Project Management' },
    { value: 'construction_management', label: language === 'ar' ? 'إدارة الإنشاءات' : 'Construction Management' },
    { value: 'site_supervision', label: language === 'ar' ? 'الإشراف الميداني' : 'Site Supervision' },
    { value: 'construction_labor', label: language === 'ar' ? 'عمال الإنشاءات' : 'Construction Labor' },
    { value: 'general_labor', label: language === 'ar' ? 'العمال العامة' : 'General Labor' },
    
    // Engineering Departments
    { value: 'civil_engineering', label: language === 'ar' ? 'الهندسة المدنية' : 'Civil Engineering' },
    { value: 'structural_engineering', label: language === 'ar' ? 'الهندسة الإنشائية' : 'Structural Engineering' },
    { value: 'mechanical_engineering', label: language === 'ar' ? 'الهندسة الميكانيكية' : 'Mechanical Engineering' },
    { value: 'electrical_engineering', label: language === 'ar' ? 'الهندسة الكهربائية' : 'Electrical Engineering' },
    { value: 'chemical_engineering', label: language === 'ar' ? 'الهندسة الكيميائية' : 'Chemical Engineering' },
    { value: 'petroleum_engineering', label: language === 'ar' ? 'هندسة البترول' : 'Petroleum Engineering' },
    { value: 'industrial_engineering', label: language === 'ar' ? 'الهندسة الصناعية' : 'Industrial Engineering' },
    { value: 'environmental_engineering', label: language === 'ar' ? 'الهندسة البيئية' : 'Environmental Engineering' },
    { value: 'geotechnical_engineering', label: language === 'ar' ? 'الهندسة الجيوتقنية' : 'Geotechnical Engineering' },
    { value: 'process_engineering', label: language === 'ar' ? 'هندسة العمليات' : 'Process Engineering' },
    { value: 'design_engineering', label: language === 'ar' ? 'هندسة التصميم' : 'Design Engineering' },
    { value: 'architectural_design', label: language === 'ar' ? 'التصميم المعماري' : 'Architectural Design' },
    
    // Skilled Trades & Crafts
    { value: 'masonry', label: language === 'ar' ? 'البناء' : 'Masonry' },
    { value: 'steel_fixing', label: language === 'ar' ? 'حدادة التسليح' : 'Steel Fixing' },
    { value: 'carpentry', label: language === 'ar' ? 'النجارة' : 'Carpentry' },
    { value: 'plumbing', label: language === 'ar' ? 'السباكة' : 'Plumbing' },
    { value: 'electrical_work', label: language === 'ar' ? 'الأعمال الكهربائية' : 'Electrical Work' },
    { value: 'welding', label: language === 'ar' ? 'اللحام' : 'Welding' },
    { value: 'painting', label: language === 'ar' ? 'الدهان' : 'Painting' },
    { value: 'tiling', label: language === 'ar' ? 'البلاط' : 'Tiling' },
    { value: 'plastering', label: language === 'ar' ? 'القصارة' : 'Plastering' },
    { value: 'insulation', label: language === 'ar' ? 'العزل' : 'Insulation' },
    { value: 'glazing', label: language === 'ar' ? 'الزجاج' : 'Glazing' },
    { value: 'aluminum_work', label: language === 'ar' ? 'أعمال الألمنيوم' : 'Aluminum Work' },
    { value: 'scaffolding', label: language === 'ar' ? 'السقالات' : 'Scaffolding' },
    { value: 'rigging', label: language === 'ar' ? 'تجهيز الرفع' : 'Rigging' },
    { value: 'blasting', label: language === 'ar' ? 'المتفجرات' : 'Blasting' },
    { value: 'demolition', label: language === 'ar' ? 'الهدم' : 'Demolition' },
    
    // Heavy Equipment & Transportation
    { value: 'heavy_equipment', label: language === 'ar' ? 'المعدات الثقيلة' : 'Heavy Equipment' },
    { value: 'transportation', label: language === 'ar' ? 'النقل' : 'Transportation' },
    { value: 'concrete_operations', label: language === 'ar' ? 'عمليات الخرسانة' : 'Concrete Operations' },
    
    // Road Construction & Asphalt
    { value: 'road_construction', label: language === 'ar' ? 'إنشاء الطرق' : 'Road Construction' },
    { value: 'asphalt_operations', label: language === 'ar' ? 'عمليات الأسفلت' : 'Asphalt Operations' },
    
    // Quality Control & Testing
    { value: 'qaqc', label: language === 'ar' ? 'ضمان ومراقبة الجودة' : 'Quality Assurance & Quality Control (QA/QC)' },
    { value: 'quality_control', label: language === 'ar' ? 'مراقبة الجودة' : 'Quality Control' },
    { value: 'quality_assurance', label: language === 'ar' ? 'ضمان الجودة' : 'Quality Assurance' },
    { value: 'materials_testing', label: language === 'ar' ? 'اختبار المواد' : 'Materials Testing' },
    
    // Health, Safety & Environment
    { value: 'hse', label: language === 'ar' ? 'السلامة والصحة المهنية والبيئة' : 'Health, Safety & Environment (HSE)' },
    { value: 'safety', label: language === 'ar' ? 'السلامة' : 'Safety' },
    { value: 'environmental', label: language === 'ar' ? 'البيئة' : 'Environmental' },
    { value: 'occupational_health', label: language === 'ar' ? 'الصحة المهنية' : 'Occupational Health' },
    { value: 'fire_safety', label: language === 'ar' ? 'أمان الحريق' : 'Fire Safety' },
    
    // Surveying & Mapping
    { value: 'surveying', label: language === 'ar' ? 'المساحة' : 'Surveying' },
    { value: 'quantity_surveying', label: language === 'ar' ? 'مساحة الكميات' : 'Quantity Surveying' },
    { value: 'gis_mapping', label: language === 'ar' ? 'رسم الخرائط بنظم المعلومات الجغرافية' : 'GIS Mapping' },
    
    // Oil & Gas
    { value: 'drilling_operations', label: language === 'ar' ? 'عمليات الحفر' : 'Drilling Operations' },
    { value: 'production_engineering', label: language === 'ar' ? 'هندسة الإنتاج' : 'Production Engineering' },
    { value: 'reservoir_engineering', label: language === 'ar' ? 'هندسة المكامن' : 'Reservoir Engineering' },
    { value: 'pipeline_engineering', label: language === 'ar' ? 'هندسة الأنابيب' : 'Pipeline Engineering' },
    { value: 'refining_operations', label: language === 'ar' ? 'عمليات التكرير' : 'Refining Operations' },
    { value: 'petrochemicals', label: language === 'ar' ? 'البتروكيماويات' : 'Petrochemicals' },
    
    // Sales & Marketing
    { value: 'sales', label: language === 'ar' ? 'المبيعات' : 'Sales' },
    { value: 'marketing', label: language === 'ar' ? 'التسويق' : 'Marketing' },
    { value: 'digital_marketing', label: language === 'ar' ? 'التسويق الرقمي' : 'Digital Marketing' },
    { value: 'business_development', label: language === 'ar' ? 'تطوير الأعمال' : 'Business Development' },
    { value: 'proposals', label: language === 'ar' ? 'العطاءات' : 'Proposals' },
    
    // Training & Development
    { value: 'training_development', label: language === 'ar' ? 'التدريب والتطوير' : 'Training & Development' },
    
    // Healthcare
    { value: 'medical_services', label: language === 'ar' ? 'الخدمات الطبية' : 'Medical Services' },
    { value: 'nursing', label: language === 'ar' ? 'التمريض' : 'Nursing' },
    { value: 'emergency_medical', label: language === 'ar' ? 'الطوارئ الطبية' : 'Emergency Medical' },
    { value: 'pharmacy', label: language === 'ar' ? 'الصيدلة' : 'Pharmacy' },
    { value: 'laboratory', label: language === 'ar' ? 'المختبر' : 'Laboratory' },
    { value: 'radiology', label: language === 'ar' ? 'الأشعة' : 'Radiology' },
    
    // Security & Facilities
    { value: 'security', label: language === 'ar' ? 'الأمن' : 'Security' },
    { value: 'facilities', label: language === 'ar' ? 'المرافق' : 'Facilities' },
    { value: 'maintenance', label: language === 'ar' ? 'الصيانة' : 'Maintenance' },
    { value: 'hvac', label: language === 'ar' ? 'التكييف والتهوية' : 'HVAC' },
    { value: 'cleaning', label: language === 'ar' ? 'النظافة' : 'Cleaning' },
    { value: 'landscaping', label: language === 'ar' ? 'تنسيق الحدائق' : 'Landscaping' },
    
    // Operations
    { value: 'operations', label: language === 'ar' ? 'العمليات' : 'Operations' }
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
            <CardTitle className="text-center">
              {language === 'ar' ? 'واجهة البحث عن المناصب الوظيفية' : 'Position Search Interface'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="space-y-2">
                <label className={`text-sm font-medium text-foreground block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'البحث عن المناصب الوظيفية...' : 'Search job positions...'}
                </label>
                <div className="relative">
                  <Search className={`absolute top-3 h-4 w-4 text-muted-foreground ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                  <Input
                    placeholder={t('search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`${language === 'ar' ? 'pr-10 text-right' : 'pl-10 text-left'}`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
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
                <label className={`text-sm font-medium text-foreground block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t('department')}
                </label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className={language === 'ar' ? 'text-right' : 'text-left'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
                <label className={`text-sm font-medium text-foreground block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {t('level')}
                </label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className={language === 'ar' ? 'text-right' : 'text-left'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
                <label className={`text-sm font-medium text-foreground block ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  {language === 'ar' ? 'إجراء' : 'Action'}
                </label>
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