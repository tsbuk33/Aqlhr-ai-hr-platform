import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Target, TrendingUp, Users, Award, Search, Filter, BarChart3, Zap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useToast } from '@/hooks/use-toast';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TechnicalSkill {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  proficiencyLevels: string[];
  industryRelevance: string;
  employeesWithSkill: number;
  averageLevel: number;
}

interface BehavioralSkill {
  id: string;
  name: string;
  nameAr: string;
  competencyArea: string;
  assessmentCriteria: string[];
  culturalContext: string;
  employeesAssessed: number;
  averageScore: number;
}

interface SkillGap {
  skillName: string;
  currentLevel: number;
  requiredLevel: number;
  priority: 'High' | 'Medium' | 'Low';
  affectedPositions: number;
}

export const SkillMatrixDashboard: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const { departments, loading: departmentsLoading } = useDepartments();
  const { positions: existingPositions, loading: positionsLoading } = usePositions();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    nameAr: '',
    category: '',
    skillType: 'technical',
    description: '',
    proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    industryRelevance: '',
    requiredFor: [] as string[],
    requiredForPositions: [] as string[],
    requiredForDepartments: [] as string[]
  });

  // Comprehensive skills library organized by job position categories
  const positionBasedSkillsLibrary: Record<string, { en: string; ar: string }[]> = {
    // Engineering & IT Skills
    engineering: [
      { en: "Software Development", ar: "تطوير البرمجيات" },
      { en: "Systems Engineering", ar: "هندسة الأنظمة" },
      { en: "Network Administration", ar: "إدارة الشبكات" },
      { en: "Database Management", ar: "إدارة قواعد البيانات" },
      { en: "Cybersecurity", ar: "الأمن السيبراني" },
      { en: "DevOps", ar: "عمليات التطوير" },
      { en: "Cloud Computing", ar: "الحوسبة السحابية" },
      { en: "API Development", ar: "تطوير واجهات البرمجة" },
      { en: "Mobile Development", ar: "تطوير التطبيقات المحمولة" },
      { en: "Web Development", ar: "تطوير المواقع" }
    ],
    // Management & Leadership Skills
    management: [
      { en: "Team Leadership", ar: "قيادة الفريق" },
      { en: "Project Management", ar: "إدارة المشاريع" },
      { en: "Strategic Planning", ar: "التخطيط الاستراتيجي" },
      { en: "Budget Management", ar: "إدارة الميزانية" },
      { en: "Performance Management", ar: "إدارة الأداء" },
      { en: "Risk Management", ar: "إدارة المخاطر" },
      { en: "Change Management", ar: "إدارة التغيير" },
      { en: "Stakeholder Management", ar: "إدارة أصحاب المصلحة" },
      { en: "Decision Making", ar: "اتخاذ القرارات" },
      { en: "Conflict Resolution", ar: "حل النزاعات" }
    ],
    // HR & Administrative Skills
    hr: [
      { en: "Recruitment & Selection", ar: "التوظيف والاختيار" },
      { en: "Employee Relations", ar: "علاقات الموظفين" },
      { en: "Training & Development", ar: "التدريب والتطوير" },
      { en: "Performance Appraisal", ar: "تقييم الأداء" },
      { en: "Compensation & Benefits", ar: "الأجور والمزايا" },
      { en: "HR Analytics", ar: "تحليلات الموارد البشرية" },
      { en: "HRIS Management", ar: "إدارة أنظمة الموارد البشرية" },
      { en: "Labor Law Compliance", ar: "الامتثال لقانون العمل" },
      { en: "Organizational Development", ar: "التطوير التنظيمي" },
      { en: "Employee Engagement", ar: "إشراك الموظفين" }
    ],
    // Finance & Accounting Skills
    finance: [
      { en: "Financial Analysis", ar: "التحليل المالي" },
      { en: "Budgeting & Forecasting", ar: "إعداد الميزانية والتنبؤ" },
      { en: "Auditing", ar: "التدقيق" },
      
      { en: "Financial Reporting", ar: "التقارير المالية" },
      { en: "Cost Accounting", ar: "محاسبة التكاليف" },
      { en: "Treasury Management", ar: "إدارة الخزينة" },
      { en: "Investment Analysis", ar: "تحليل الاستثمارات" },
      { en: "Risk Assessment", ar: "تقييم المخاطر" },
      { en: "ERP Systems", ar: "أنظمة تخطيط الموارد" }
    ],
    // Operations & Supply Chain Skills
    operations: [
      { en: "Process Optimization", ar: "تحسين العمليات" },
      { en: "Quality Control", ar: "مراقبة الجودة" },
      { en: "Supply Chain Management", ar: "إدارة سلسلة التوريد" },
      { en: "Inventory Management", ar: "إدارة المخزون" },
      { en: "Logistics Coordination", ar: "تنسيق اللوجستيات" },
      { en: "Vendor Management", ar: "إدارة الموردين" },
      { en: "Production Planning", ar: "تخطيط الإنتاج" },
      { en: "Lean Manufacturing", ar: "التصنيع الرشيق" },
      { en: "Safety Management", ar: "إدارة السلامة" },
      { en: "Facility Management", ar: "إدارة المرافق" }
    ],
    // Sales & Marketing Skills
    sales: [
      { en: "Customer Relationship Management", ar: "إدارة علاقات العملاء" },
      { en: "Sales Strategy", ar: "استراتيجية المبيعات" },
      { en: "Market Research", ar: "أبحاث السوق" },
      { en: "Digital Marketing", ar: "التسويق الرقمي" },
      { en: "Brand Management", ar: "إدارة العلامة التجارية" },
      { en: "Lead Generation", ar: "توليد العملاء المحتملين" },
      { en: "Negotiation Skills", ar: "مهارات التفاوض" },
      { en: "Product Marketing", ar: "تسويق المنتجات" },
      { en: "Social Media Marketing", ar: "تسويق وسائل التواصل الاجتماعي" },
      { en: "Business Development", ar: "تطوير الأعمال" }
    ],
    // Customer Service Skills
    customer_service: [
      { en: "Customer Support", ar: "دعم العملاء" },
      { en: "Problem Solving", ar: "حل المشكلات" },
      { en: "Technical Support", ar: "الدعم التقني" },
      { en: "Call Center Operations", ar: "عمليات مركز الاتصال" },
      { en: "Customer Satisfaction", ar: "رضا العملاء" },
      { en: "Complaint Handling", ar: "التعامل مع الشكاوى" },
      { en: "Product Knowledge", ar: "معرفة المنتج" },
      { en: "Service Excellence", ar: "التميز في الخدمة" },
      { en: "Multi-channel Support", ar: "الدعم متعدد القنوات" },
      { en: "Customer Retention", ar: "الاحتفاظ بالعملاء" }
    ],
    // Administrative Skills
    administrative: [
      { en: "Office Management", ar: "إدارة المكتب" },
      { en: "Document Management", ar: "إدارة الوثائق" },
      { en: "Data Entry", ar: "إدخال البيانات" },
      { en: "Scheduling & Coordination", ar: "الجدولة والتنسيق" },
      { en: "Administrative Support", ar: "الدعم الإداري" },
      { en: "Records Management", ar: "إدارة السجلات" },
      { en: "Meeting Management", ar: "إدارة الاجتماعات" },
      { en: "Communication Management", ar: "إدارة التواصل" },
      { en: "Workflow Management", ar: "إدارة سير العمل" },
      { en: "Policy Implementation", ar: "تنفيذ السياسات" }
    ]
  };

  // Get skills based on selected category
  const getSkillsForCategory = (category: string): { en: string; ar: string }[] => {
    const categoryMap: Record<string, string> = {
      'programming': 'engineering',
      'cloud': 'engineering',
      'data': 'engineering',
      'leadership': 'management',
      'communication': 'customer_service',
      'cultural': 'hr',
      'management': 'management',
      'finance': 'finance',
      'operations': 'operations',
      'sales': 'sales',
      'hr': 'hr',
      'administrative': 'administrative'
    };

    const mappedCategory = categoryMap[category] || 'engineering';
    return positionBasedSkillsLibrary[mappedCategory] || [];
  };

  // Generic descriptions and industry relevance for skill type and category combinations
  const getGenericDescription = (skillType: string, category: string) => {
    const descriptions: Record<string, Record<string, { en: string; ar: string }>> = {
      technical: {
        programming: {
          en: "Technical proficiency in programming languages, frameworks, and development methodologies. Includes coding standards, debugging, testing, and software architecture principles.",
          ar: "الكفاءة التقنية في لغات البرمجة والأطر والمنهجيات التطويرية. تشمل معايير الترميز والتصحيح والاختبار ومبادئ هندسة البرمجيات."
        },
        cloud: {
          en: "Expertise in cloud computing platforms, services, and deployment strategies. Covers infrastructure management, scalability, security, and cost optimization in cloud environments.",
          ar: "الخبرة في منصات الحوسبة السحابية والخدمات واستراتيجيات النشر. تغطي إدارة البنية التحتية وقابلية التوسع والأمان وتحسين التكلفة في البيئات السحابية."
        },
        data: {
          en: "Proficiency in data analysis, visualization, and statistical methods. Includes database management, data mining, machine learning, and business intelligence tools.",
          ar: "الكفاءة في تحليل البيانات والتصور والطرق الإحصائية. تشمل إدارة قواعد البيانات واستخراج البيانات والتعلم الآلي وأدوات ذكاء الأعمال."
        },
        management: {
          en: "Leadership and management capabilities including team coordination, strategic planning, and organizational effectiveness.",
          ar: "قدرات القيادة والإدارة بما في ذلك تنسيق الفريق والتخطيط الاستراتيجي والفعالية التنظيمية."
        },
        finance: {
          en: "Financial analysis, accounting principles, budget management, and fiscal responsibility skills.",
          ar: "التحليل المالي ومبادئ المحاسبة وإدارة الميزانية ومهارات المسؤولية المالية."
        },
        operations: {
          en: "Operational efficiency, process improvement, quality management, and supply chain optimization skills.",
          ar: "الكفاءة التشغيلية وتحسين العمليات وإدارة الجودة ومهارات تحسين سلسلة التوريد."
        },
        sales: {
          en: "Sales techniques, customer relationship management, market analysis, and revenue generation skills.",
          ar: "تقنيات البيع وإدارة علاقات العملاء وتحليل السوق ومهارات توليد الإيرادات."
        },
        hr: {
          en: "Human resources management including recruitment, employee development, performance management, and organizational culture.",
          ar: "إدارة الموارد البشرية بما في ذلك التوظيف وتطوير الموظفين وإدارة الأداء والثقافة التنظيمية."
        },
        administrative: {
          en: "Administrative coordination, documentation management, office procedures, and organizational support skills.",
          ar: "التنسيق الإداري وإدارة الوثائق وإجراءات المكتب ومهارات الدعم التنظيمي."
        }
      },
      behavioral: {
        leadership: {
          en: "Ability to guide, motivate, and develop teams effectively. Encompasses strategic thinking, decision-making, conflict resolution, and organizational influence.",
          ar: "القدرة على توجيه وتحفيز وتطوير الفرق بفعالية. تشمل التفكير الاستراتيجي واتخاذ القرارات وحل النزاعات والتأثير التنظيمي."
        },
        communication: {
          en: "Effective verbal and written communication skills across various contexts. Includes presentation abilities, active listening, cross-cultural communication, and stakeholder engagement.",
          ar: "مهارات التواصل الشفهي والكتابي الفعال في مختلف السياقات. تشمل قدرات العرض والاستماع النشط والتواصل عبر الثقافات وإشراك أصحاب المصلحة."
        },
        cultural: {
          en: "Understanding and adapting to diverse cultural contexts and practices. Includes cultural sensitivity, inclusive leadership, and global business acumen.",
          ar: "فهم والتكيف مع السياقات والممارسات الثقافية المتنوعة. تشمل الحساسية الثقافية والقيادة الشاملة والفطنة التجارية العالمية."
        }
      },
      certification: {
        programming: {
          en: "Professional certifications in programming languages, frameworks, or development methodologies. Validates technical competency and industry standards compliance.",
          ar: "الشهادات المهنية في لغات البرمجة أو الأطر أو منهجيات التطوير. تؤكد الكفاءة التقنية والامتثال لمعايير الصناعة."
        },
        cloud: {
          en: "Industry-recognized cloud platform certifications demonstrating expertise in cloud architecture, services, and best practices.",
          ar: "شهادات منصات السحابة المعترف بها في الصناعة التي تظهر الخبرة في هندسة السحابة والخدمات وأفضل الممارسات."
        },
        data: {
          en: "Professional certifications in data analytics, database management, or data science tools and methodologies.",
          ar: "الشهادات المهنية في تحليلات البيانات أو إدارة قواعد البيانات أو أدوات ومنهجيات علوم البيانات."
        },
        management: {
          en: "Professional management and leadership certifications demonstrating expertise in organizational leadership and strategic management.",
          ar: "شهادات الإدارة والقيادة المهنية التي تظهر الخبرة في القيادة التنظيمية والإدارة الاستراتيجية."
        },
        finance: {
          en: "Professional financial certifications validating expertise in accounting, financial analysis, and fiscal management.",
          ar: "الشهادات المالية المهنية التي تؤكد الخبرة في المحاسبة والتحليل المالي والإدارة المالية."
        },
        operations: {
          en: "Professional certifications in operations management, quality control, and process optimization methodologies.",
          ar: "الشهادات المهنية في إدارة العمليات ومراقبة الجودة ومنهجيات تحسين العمليات."
        },
        sales: {
          en: "Professional sales and marketing certifications demonstrating expertise in customer relationship management and revenue generation.",
          ar: "شهادات المبيعات والتسويق المهنية التي تظهر الخبرة في إدارة علاقات العملاء وتوليد الإيرادات."
        },
        hr: {
          en: "Professional human resources certifications validating expertise in talent management and organizational development.",
          ar: "شهادات الموارد البشرية المهنية التي تؤكد الخبرة في إدارة المواهب والتطوير التنظيمي."
        },
        administrative: {
          en: "Professional administrative certifications demonstrating competency in office management and organizational support.",
          ar: "الشهادات الإدارية المهنية التي تظهر الكفاءة في إدارة المكتب والدعم التنظيمي."
        }
      }
    };

    return descriptions[skillType]?.[category] || {
      en: "Professional competency in the selected skill area. Encompasses relevant knowledge, practical application, and industry best practices.",
      ar: "الكفاءة المهنية في مجال المهارة المحدد. تشمل المعرفة ذات الصلة والتطبيق العملي وأفضل ممارسات الصناعة."
    };
  };

  // Industry relevance for different skill categories
  const getIndustryRelevance = (skillType: string, category: string) => {
    const relevance: Record<string, Record<string, { en: string; ar: string }>> = {
      technical: {
        programming: {
          en: "Critical for digital transformation and software development initiatives in all industries",
          ar: "حيوية للتحول الرقمي ومبادرات تطوير البرمجيات في جميع الصناعات"
        },
        cloud: {
          en: "Essential for scalable infrastructure and modern business operations",
          ar: "ضرورية للبنية التحتية القابلة للتوسع والعمليات التجارية الحديثة"
        },
        data: {
          en: "Fundamental for data-driven decision making and business intelligence",
          ar: "أساسية لاتخاذ القرارات المبنية على البيانات وذكاء الأعمال"
        },
        management: {
          en: "Essential for organizational leadership and strategic business growth",
          ar: "ضرورية للقيادة التنظيمية والنمو التجاري الاستراتيجي"
        },
        finance: {
          en: "Critical for financial planning, compliance, and business sustainability",
          ar: "حيوية للتخطيط المالي والامتثال واستدامة الأعمال"
        },
        operations: {
          en: "Essential for operational efficiency and quality management",
          ar: "ضرورية للكفاءة التشغيلية وإدارة الجودة"
        },
        sales: {
          en: "Critical for revenue generation and market expansion",
          ar: "حيوية لتوليد الإيرادات وتوسيع السوق"
        },
        hr: {
          en: "Essential for talent management and organizational development",
          ar: "ضرورية لإدارة المواهب والتطوير التنظيمي"
        },
        administrative: {
          en: "Important for organizational support and operational coordination",
          ar: "مهمة للدعم التنظيمي والتنسيق التشغيلي"
        }
      },
      behavioral: {
        leadership: {
          en: "Critical for organizational culture and team performance across all industries",
          ar: "حيوية للثقافة التنظيمية وأداء الفريق في جميع الصناعات"
        },
        communication: {
          en: "Essential for stakeholder engagement and organizational effectiveness",
          ar: "ضرورية لإشراك أصحاب المصلحة والفعالية التنظيمية"
        },
        cultural: {
          en: "Important for diverse workplace integration and global business operations",
          ar: "مهمة لتكامل مكان العمل المتنوع والعمليات التجارية العالمية"
        }
      },
      certification: {
        programming: {
          en: "Highly valued for validating technical expertise in competitive IT markets",
          ar: "مقدرة بشدة لتأكيد الخبرة التقنية في أسواق تقنية المعلومات التنافسية"
        },
        cloud: {
          en: "Essential for cloud adoption and digital infrastructure modernization",
          ar: "ضرورية لاعتماد السحابة وتحديث البنية التحتية الرقمية"
        },
        data: {
          en: "Critical for data governance and analytics-driven business strategies",
          ar: "حيوية لحوكمة البيانات والاستراتيجيات التجارية المدفوعة بالتحليلات"
        },
        management: {
          en: "Valuable for executive leadership and strategic management positions",
          ar: "قيمة للقيادة التنفيذية ومناصب الإدارة الاستراتيجية"
        },
        finance: {
          en: "Required for financial compliance and professional accounting practices",
          ar: "مطلوبة للامتثال المالي وممارسات المحاسبة المهنية"
        },
        operations: {
          en: "Important for quality standards and operational excellence",
          ar: "مهمة لمعايير الجودة والتميز التشغيلي"
        },
        sales: {
          en: "Beneficial for customer relationship management and sales performance",
          ar: "مفيدة لإدارة علاقات العملاء وأداء المبيعات"
        },
        hr: {
          en: "Valuable for HR best practices and talent development programs",
          ar: "قيمة لأفضل ممارسات الموارد البشرية وبرامج تطوير المواهب"
        },
        administrative: {
          en: "Useful for administrative efficiency and organizational support",
          ar: "مفيدة للكفاءة الإدارية والدعم التنظيمي"
        }
      }
    };

    return relevance[skillType]?.[category] || {
      en: "Relevant for industry standards and professional development",
      ar: "ذات صلة بمعايير الصناعة والتطوير المهني"
    };
  };

  // Update description and industry relevance when skill type or category changes
  useEffect(() => {
    if (newSkill.skillType && newSkill.category) {
      const genericDesc = getGenericDescription(newSkill.skillType, newSkill.category);
      const industryRel = getIndustryRelevance(newSkill.skillType, newSkill.category);
      setNewSkill(prev => ({
        ...prev,
        description: language === 'ar' ? genericDesc.ar : genericDesc.en,
        industryRelevance: language === 'ar' ? industryRel.ar : industryRel.en
      }));
    }
  }, [newSkill.skillType, newSkill.category, language]);
  
  // Mock data - replace with actual API calls
  const [skillStats, setSkillStats] = useState({
    totalTechnicalSkills: 847,
    totalBehavioralSkills: 623,
    trackedCertifications: 234,
    skillGapsIdentified: 89,
    employeesAssessed: 1250,
    skillMatrixCompletion: 85
  });

  const [recentUpdates] = useState([
    { type: 'technical', skill: 'Python Programming', action: 'added', position: 'Software Engineer', time: '2 hours ago' },
    { type: 'behavioral', skill: 'Leadership Skills', action: 'updated', position: 'Manager positions', time: '4 hours ago' },
    { type: 'certification', skill: 'AWS Certification', action: 'requirement added', position: 'DevOps Engineer', time: '1 day ago' },
    { type: 'gap', skill: 'Data Analysis', action: 'gap identified', position: 'Multiple positions', time: '2 days ago' }
  ]);

  const [criticalSkillGaps] = useState<SkillGap[]>([
    { skillName: 'Cloud Architecture', currentLevel: 2.1, requiredLevel: 4.0, priority: 'High', affectedPositions: 12 },
    { skillName: 'AI/ML Expertise', currentLevel: 1.8, requiredLevel: 3.5, priority: 'High', affectedPositions: 8 },
    { skillName: 'Leadership Skills', currentLevel: 2.5, requiredLevel: 4.0, priority: 'Medium', affectedPositions: 15 },
    { skillName: 'Arabic Communication', currentLevel: 3.2, requiredLevel: 4.5, priority: 'Medium', affectedPositions: 6 }
  ]);

  const skillCategories = [
    { id: 'programming', name: 'Programming & IT', nameAr: 'البرمجة وتقنية المعلومات', count: 156 },
    { id: 'management', name: 'Management & Leadership', nameAr: 'الإدارة والقيادة', count: 98 },
    { id: 'finance', name: 'Finance & Accounting', nameAr: 'المالية والمحاسبة', count: 67 },
    { id: 'operations', name: 'Operations & Quality', nameAr: 'العمليات والجودة', count: 89 },
    { id: 'sales', name: 'Sales & Marketing', nameAr: 'المبيعات والتسويق', count: 74 },
    { id: 'hr', name: 'Human Resources', nameAr: 'الموارد البشرية', count: 82 },
    { id: 'administrative', name: 'Administrative', nameAr: 'الأعمال الإدارية', count: 65 },
    { id: 'communication', name: 'Communication', nameAr: 'التواصل', count: 92 },
    { id: 'leadership', name: 'Leadership', nameAr: 'القيادة', count: 78 },
    { id: 'cultural', name: 'Cultural Competency', nameAr: 'الكفاءة الثقافية', count: 45 }
  ];

  return (
    <div className="space-y-6 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {language === 'ar' ? 'مصفوفة المهارات التقنية والسلوكية' : 'Technical & Behavioral Skill Matrix'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'ar' 
              ? 'إدارة شاملة للمهارات مع تحليل الفجوات وتخطيط التطوير'
              : 'Comprehensive skill management with gap analysis and development planning'
            }
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              toast({
                title: language === 'ar' ? 'تحليل الفجوات' : 'Gap Analysis',
                description: language === 'ar' ? 'بدء تحليل فجوات المهارات...' : 'Starting skill gap analysis...',
              });
              setActiveTab('gaps');
            }}
          >
            <BarChart3 className="h-4 w-4" />
            {language === 'ar' ? 'تحليل الفجوات' : 'Gap Analysis'}
          </Button>
          <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {language === 'ar' ? 'إضافة مهارة جديدة' : 'Add New Skill'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {language === 'ar' ? 'إضافة مهارة جديدة' : 'Add New Skill'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Move Category and Skill Type to the TOP - these determine available skills */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="skill-category" className="text-sm font-medium text-foreground">
                      {language === 'ar' ? 'الفئة' : 'Category'} <span className="text-destructive">*</span>
                    </Label>
                    <Select value={newSkill.category} onValueChange={(value) => {
                      // Reset skill names when category changes
                      setNewSkill({
                        ...newSkill, 
                        category: value,
                        name: '',
                        nameAr: ''
                      });
                    }}>
                      <SelectTrigger className="bg-background border border-input hover:bg-accent hover:text-accent-foreground">
                        <SelectValue placeholder={language === 'ar' ? 'اختر الفئة أولاً' : 'Select category first'} />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border shadow-md">
                        {skillCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id} className="cursor-pointer hover:bg-accent">
                            {language === 'ar' ? cat.nameAr : cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skill-type" className="text-sm font-medium text-foreground">
                      {language === 'ar' ? 'نوع المهارة' : 'Skill Type'} <span className="text-destructive">*</span>
                    </Label>
                    <Select value={newSkill.skillType} onValueChange={(value) => setNewSkill({...newSkill, skillType: value})}>
                      <SelectTrigger className="bg-background border border-input hover:bg-accent hover:text-accent-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border shadow-md">
                        <SelectItem value="technical" className="cursor-pointer hover:bg-accent">
                          {language === 'ar' ? 'تقنية' : 'Technical'}
                        </SelectItem>
                        <SelectItem value="behavioral" className="cursor-pointer hover:bg-accent">
                          {language === 'ar' ? 'سلوكية' : 'Behavioral'}
                        </SelectItem>
                        <SelectItem value="certification" className="cursor-pointer hover:bg-accent">
                          {language === 'ar' ? 'شهادة' : 'Certification'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Show category selection notice if no category selected */}
                {!newSkill.category && (
                  <div className="p-3 bg-muted rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground text-center">
                      {language === 'ar' 
                        ? '⚠️ يرجى اختيار الفئة أولاً لعرض المهارات المتاحة' 
                        : '⚠️ Please select a category first to see available skills'
                      }
                    </p>
                  </div>
                )}

                {/* Skill Names - Now depend on category selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="skill-name" className="text-sm font-medium text-foreground">
                      {language === 'ar' ? 'اسم المهارة (الإنجليزية)' : 'Skill Name (English)'} <span className="text-destructive">*</span>
                    </Label>
                    <Select 
                      value={newSkill.name} 
                      onValueChange={(value) => {
                        const availableSkills = getSkillsForCategory(newSkill.category);
                        const selectedSkill = availableSkills.find(skill => skill.en === value);
                        setNewSkill({
                          ...newSkill, 
                          name: value,
                          nameAr: selectedSkill?.ar || ''
                        });
                      }}
                      disabled={!newSkill.category}
                    >
                      <SelectTrigger className={`bg-background border border-input hover:bg-accent hover:text-accent-foreground ${!newSkill.category ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <SelectValue placeholder={
                          !newSkill.category 
                            ? (language === 'ar' ? 'اختر الفئة أولاً' : 'Select category first')
                            : (language === 'ar' ? 'اختر المهارة' : 'Select skill')
                        } />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border shadow-md">
                        {newSkill.category ? (
                          getSkillsForCategory(newSkill.category).map((skill, index) => (
                            <SelectItem key={index} value={skill.en} className="cursor-pointer hover:bg-accent">
                              {skill.en}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="disabled" disabled>
                            {language === 'ar' ? 'اختر الفئة أولاً' : 'Select category first'}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skill-name-ar" className="text-sm font-medium text-foreground">
                      {language === 'ar' ? 'اسم المهارة (العربية)' : 'Skill Name (Arabic)'} <span className="text-destructive">*</span>
                    </Label>
                    <Select 
                      value={newSkill.nameAr} 
                      onValueChange={(value) => {
                        const availableSkills = getSkillsForCategory(newSkill.category);
                        const selectedSkill = availableSkills.find(skill => skill.ar === value);
                        setNewSkill({
                          ...newSkill, 
                          nameAr: value,
                          name: selectedSkill?.en || ''
                        });
                      }}
                      disabled={!newSkill.category}
                    >
                      <SelectTrigger className={`bg-background border border-input hover:bg-accent hover:text-accent-foreground ${!newSkill.category ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <SelectValue placeholder={
                          !newSkill.category 
                            ? (language === 'ar' ? 'اختر الفئة أولاً' : 'Select category first')
                            : (language === 'ar' ? 'اختر المهارة' : 'Select skill')
                        } />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border shadow-md">
                        {newSkill.category ? (
                          getSkillsForCategory(newSkill.category).map((skill, index) => (
                            <SelectItem key={index} value={skill.ar} className="cursor-pointer hover:bg-accent">
                              {skill.ar}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="disabled" disabled>
                            {language === 'ar' ? 'اختر الفئة أولاً' : 'Select category first'}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skill-description">
                    {language === 'ar' ? 'الوصف' : 'Description'}
                  </Label>
                  <Textarea
                    id="skill-description"
                    value={newSkill.description || (newSkill.category && newSkill.skillType ? 
                      getGenericDescription(newSkill.skillType, newSkill.category)[language === 'ar' ? 'ar' : 'en'] : '')}
                    onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                    placeholder={language === 'ar' ? 'وصف تفصيلي للمهارة (سيتم ملؤه تلقائياً حسب الفئة)' : 'Detailed skill description (auto-filled based on category)'}
                    rows={3}
                  />
                  {newSkill.category && newSkill.skillType && !newSkill.description && (
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? '💡 تم ملء الوصف تلقائياً حسب نوع المهارة والفئة' : '💡 Auto-filled based on skill type and category'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry-relevance">
                    {language === 'ar' ? 'صلة بالصناعة' : 'Industry Relevance'}
                  </Label>
                  <Textarea
                    id="industry-relevance"
                    value={newSkill.industryRelevance || (newSkill.category && newSkill.skillType ? 
                      getIndustryRelevance(newSkill.skillType, newSkill.category)[language === 'ar' ? 'ar' : 'en'] : '')}
                    onChange={(e) => setNewSkill({...newSkill, industryRelevance: e.target.value})}
                    placeholder={language === 'ar' ? 'أهمية المهارة في القطاع (سيتم ملؤها تلقائياً حسب الفئة)' : 'Industry relevance (auto-filled based on category)'}
                    rows={2}
                    className="text-sm"
                  />
                  {newSkill.category && newSkill.skillType && !newSkill.industryRelevance && (
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? '💡 تم ملء المحتوى تلقائياً حسب الفئة المختارة' : '💡 Auto-filled based on selected category'}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="required-positions">
                      {language === 'ar' ? 'مطلوبة للمناصب' : 'Required for Positions'}
                    </Label>
                    <Select 
                      disabled={positionsLoading || !newSkill.category || !newSkill.name}
                      onValueChange={(value) => {
                        if (!newSkill.requiredForPositions.includes(value)) {
                          setNewSkill({
                            ...newSkill, 
                            requiredForPositions: [...newSkill.requiredForPositions, value]
                          });
                        }
                      }}
                    >
                      <SelectTrigger className={`bg-background border border-input hover:bg-accent hover:text-accent-foreground ${(!newSkill.category || !newSkill.name) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <SelectValue placeholder={
                          !newSkill.category || !newSkill.name
                            ? (language === 'ar' ? 'اختر الفئة والمهارة أولاً' : 'Select category & skill first')
                            : positionsLoading 
                              ? (language === 'ar' ? 'جاري التحميل...' : 'Loading...') 
                              : (language === 'ar' ? 'اختر المناصب...' : 'Select positions...')
                        } />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border shadow-md max-h-[200px] overflow-y-auto">
                        {positionsLoading ? (
                          <SelectItem value="loading" disabled>
                            {language === 'ar' ? 'جاري تحميل المناصب...' : 'Loading positions...'}
                          </SelectItem>
                        ) : !newSkill.category || !newSkill.name ? (
                          <SelectItem value="no-skill-selected" disabled>
                            {language === 'ar' ? 'اختر الفئة والمهارة أولاً' : 'Select category & skill first'}
                          </SelectItem>
                        ) : (() => {
                          // Filter positions based on skill category and type
                          const filteredPositions = existingPositions.filter(position => {
                            const positionTitle = position.title.toLowerCase();
                            const category = newSkill.category.toLowerCase();
                            const skillType = newSkill.skillType.toLowerCase();
                            const skillName = newSkill.name.toLowerCase();
                            
                            // Technical skills mapping
                            if (skillType === 'technical') {
                              if (category === 'programming' && (
                                positionTitle.includes('developer') || 
                                positionTitle.includes('programmer') || 
                                positionTitle.includes('software') ||
                                positionTitle.includes('engineer')
                              )) return true;
                              
                              if (category === 'data' && (
                                positionTitle.includes('data') || 
                                positionTitle.includes('analyst') || 
                                positionTitle.includes('scientist')
                              )) return true;
                              
                              if (category === 'cloud' && (
                                positionTitle.includes('cloud') || 
                                positionTitle.includes('devops') || 
                                positionTitle.includes('infrastructure')
                              )) return true;
                              
                              if (category === 'management' && (
                                positionTitle.includes('manager') || 
                                positionTitle.includes('director') || 
                                positionTitle.includes('lead')
                              )) return true;
                              
                              if (category === 'finance' && (
                                positionTitle.includes('finance') || 
                                positionTitle.includes('accountant') || 
                                positionTitle.includes('financial')
                              )) return true;
                              
                              if (category === 'hr' && (
                                positionTitle.includes('hr') || 
                                positionTitle.includes('human') || 
                                positionTitle.includes('recruiter')
                              )) return true;
                              
                              if (category === 'sales' && (
                                positionTitle.includes('sales') || 
                                positionTitle.includes('marketing') || 
                                positionTitle.includes('business')
                              )) return true;
                            }
                            
                            // Behavioral skills - more broadly applicable
                            if (skillType === 'behavioral') {
                              if (category === 'leadership' && (
                                positionTitle.includes('manager') || 
                                positionTitle.includes('director') || 
                                positionTitle.includes('lead') ||
                                positionTitle.includes('supervisor')
                              )) return true;
                              
                              if (category === 'communication' && (
                                positionTitle.includes('sales') || 
                                positionTitle.includes('support') || 
                                positionTitle.includes('consultant') ||
                                positionTitle.includes('representative')
                              )) return true;
                            }
                            
                            // Default: show all if no specific mapping
                            return true;
                          });
                          
                          return filteredPositions.length > 0 ? (
                            filteredPositions.map((position) => (
                              <SelectItem key={position.title} value={position.title} className="cursor-pointer hover:bg-accent">
                                <div className="flex justify-between items-center w-full">
                                  <span>{language === 'ar' && position.titleAr ? position.titleAr : position.title}</span>
                                  {position.department && (
                                    <Badge variant="outline" className="text-xs ml-2">
                                      {position.department}
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-relevant-positions" disabled>
                              {language === 'ar' ? 'لا توجد مناصب مناسبة لهذه المهارة' : 'No relevant positions for this skill'}
                            </SelectItem>
                          );
                        })()}
                      </SelectContent>
                    </Select>
                    {newSkill.requiredForPositions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newSkill.requiredForPositions.map((position, index) => (
                          <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => {
                            setNewSkill({
                              ...newSkill,
                              requiredForPositions: newSkill.requiredForPositions.filter(p => p !== position)
                            });
                          }}>
                            {position} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="required-departments">
                      {language === 'ar' ? 'مطلوبة للأقسام' : 'Required for Departments'}
                    </Label>
                    <Select 
                      disabled={departmentsLoading || !newSkill.category || !newSkill.name}
                      onValueChange={(value) => {
                        if (!newSkill.requiredForDepartments.includes(value)) {
                          setNewSkill({
                            ...newSkill, 
                            requiredForDepartments: [...newSkill.requiredForDepartments, value]
                          });
                        }
                      }}
                    >
                      <SelectTrigger className={`bg-background border border-input hover:bg-accent hover:text-accent-foreground ${(!newSkill.category || !newSkill.name) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <SelectValue placeholder={
                          !newSkill.category || !newSkill.name
                            ? (language === 'ar' ? 'اختر الفئة والمهارة أولاً' : 'Select category & skill first')
                            : departmentsLoading 
                              ? (language === 'ar' ? 'جاري التحميل...' : 'Loading...') 
                              : (language === 'ar' ? 'اختر الأقسام...' : 'Select departments...')
                        } />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border shadow-md max-h-[200px] overflow-y-auto">
                        {departmentsLoading ? (
                          <SelectItem value="loading" disabled>
                            {language === 'ar' ? 'جاري تحميل الأقسام...' : 'Loading departments...'}
                          </SelectItem>
                        ) : !newSkill.category || !newSkill.name ? (
                          <SelectItem value="no-skill-selected" disabled>
                            {language === 'ar' ? 'اختر الفئة والمهارة أولاً' : 'Select category & skill first'}
                          </SelectItem>
                        ) : (() => {
                          // Filter departments based on skill category and type
                          const filteredDepartments = departments.filter(dept => {
                            const deptName = dept.toLowerCase();
                            const category = newSkill.category.toLowerCase();
                            const skillType = newSkill.skillType.toLowerCase();
                            
                            // Technical skills mapping to departments
                            if (skillType === 'technical') {
                              if (category === 'programming' && (
                                deptName.includes('it') || 
                                deptName.includes('technology') || 
                                deptName.includes('development') ||
                                deptName.includes('engineering') ||
                                deptName.includes('software')
                              )) return true;
                              
                              if (category === 'data' && (
                                deptName.includes('data') || 
                                deptName.includes('analytics') || 
                                deptName.includes('business intelligence') ||
                                deptName.includes('research')
                              )) return true;
                              
                              if (category === 'cloud' && (
                                deptName.includes('it') || 
                                deptName.includes('infrastructure') || 
                                deptName.includes('operations') ||
                                deptName.includes('technology')
                              )) return true;
                              
                              if (category === 'management' && (
                                deptName.includes('management') || 
                                deptName.includes('executive') || 
                                deptName.includes('administration') ||
                                deptName.includes('operations')
                              )) return true;
                              
                              if (category === 'finance' && (
                                deptName.includes('finance') || 
                                deptName.includes('accounting') || 
                                deptName.includes('treasury') ||
                                deptName.includes('audit')
                              )) return true;
                              
                              if (category === 'hr' && (
                                deptName.includes('hr') || 
                                deptName.includes('human resources') || 
                                deptName.includes('talent') ||
                                deptName.includes('people')
                              )) return true;
                              
                              if (category === 'sales' && (
                                deptName.includes('sales') || 
                                deptName.includes('marketing') || 
                                deptName.includes('business development') ||
                                deptName.includes('commercial')
                              )) return true;
                              
                              if (category === 'operations' && (
                                deptName.includes('operations') || 
                                deptName.includes('production') || 
                                deptName.includes('logistics') ||
                                deptName.includes('supply')
                              )) return true;
                            }
                            
                            // Behavioral skills - more broadly applicable
                            if (skillType === 'behavioral') {
                              if (category === 'leadership') {
                                // Leadership skills relevant to management departments
                                return deptName.includes('management') || 
                                       deptName.includes('executive') || 
                                       deptName.includes('operations') ||
                                       deptName.includes('hr');
                              }
                              
                              if (category === 'communication') {
                                // Communication skills relevant to customer-facing departments
                                return deptName.includes('sales') || 
                                       deptName.includes('marketing') || 
                                       deptName.includes('support') ||
                                       deptName.includes('customer');
                              }
                            }
                            
                            // Default: show all if no specific mapping or for general skills
                            return true;
                          });
                          
                          return filteredDepartments.length > 0 ? (
                            filteredDepartments.map((dept) => (
                              <SelectItem key={dept} value={dept} className="cursor-pointer hover:bg-accent">
                                {dept}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-relevant-departments" disabled>
                              {language === 'ar' ? 'لا توجد أقسام مناسبة لهذه المهارة' : 'No relevant departments for this skill'}
                            </SelectItem>
                          );
                        })()}
                      </SelectContent>
                    </Select>
                    {newSkill.requiredForDepartments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newSkill.requiredForDepartments.map((dept, index) => (
                          <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => {
                            setNewSkill({
                              ...newSkill,
                              requiredForDepartments: newSkill.requiredForDepartments.filter(d => d !== dept)
                            });
                          }}>
                            {dept} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsAddSkillOpen(false)}>
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button onClick={() => {
                    toast({
                      title: language === 'ar' ? 'تم إضافة المهارة' : 'Skill Added',
                      description: language === 'ar' ? `تم إضافة مهارة "${newSkill.name}" بنجاح` : `Skill "${newSkill.name}" has been added successfully`,
                    });
                    setIsAddSkillOpen(false);
                    setNewSkill({
                      name: '',
                      nameAr: '',
                      category: '',
                      skillType: 'technical',
                      description: '',
                      proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
                      industryRelevance: '',
                      requiredFor: [],
                      requiredForPositions: [],
                      requiredForDepartments: []
                    });
                  }}>
                    {language === 'ar' ? 'إضافة المهارة' : 'Add Skill'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'المهارات التقنية' : 'Technical Skills'}
                </p>
                <p className="text-2xl font-bold text-primary">{skillStats.totalTechnicalSkills}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'المهارات السلوكية' : 'Behavioral Skills'}
                </p>
                <p className="text-2xl font-bold text-secondary">{skillStats.totalBehavioralSkills}</p>
              </div>
              <Users className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'الشهادات المتتبعة' : 'Tracked Certifications'}
                </p>
                <p className="text-2xl font-bold text-accent">{skillStats.trackedCertifications}</p>
              </div>
              <Award className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'فجوات المهارات' : 'Skill Gaps'}
                </p>
                <p className="text-2xl font-bold text-destructive">{skillStats.skillGapsIdentified}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {language === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="technical" className="gap-2">
            <Target className="h-4 w-4" />
            {language === 'ar' ? 'المهارات التقنية' : 'Technical Skills'}
          </TabsTrigger>
          <TabsTrigger value="behavioral" className="gap-2">
            <Users className="h-4 w-4" />
            {language === 'ar' ? 'المهارات السلوكية' : 'Behavioral Skills'}
          </TabsTrigger>
          <TabsTrigger value="gaps" className="gap-2">
            <Zap className="h-4 w-4" />
            {language === 'ar' ? 'تحليل الفجوات' : 'Gap Analysis'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Skill Matrix Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {language === 'ar' ? 'اكتمال مصفوفة المهارات' : 'Skill Matrix Completion'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'نسبة الاكتمال الإجمالية' : 'Overall Completion Rate'}
                  </span>
                  <Badge variant="secondary">{skillStats.skillMatrixCompletion}%</Badge>
                </div>
                <Progress value={skillStats.skillMatrixCompletion} className="h-2" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {skillCategories.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">
                          {language === 'ar' ? category.nameAr : category.name}
                        </span>
                        <span className="text-xs font-medium">{category.count}</span>
                      </div>
                      <Progress value={Math.random() * 100} className="h-1" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'التحديثات الأخيرة' : 'Recent Updates'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUpdates.map((update, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        update.type === 'technical' ? 'default' :
                        update.type === 'behavioral' ? 'secondary' :
                        update.type === 'certification' ? 'outline' : 'destructive'
                      }>
                        {update.type}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">{update.skill}</p>
                        <p className="text-xs text-muted-foreground">
                          {update.action} for {update.position}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{update.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-6">
          {/* Critical Skill Gaps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                {language === 'ar' ? 'فجوات المهارات الحرجة' : 'Critical Skill Gaps'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'المهارات التي تحتاج إلى اهتمام فوري للوصول إلى مستويات الأداء المطلوبة'
                  : 'Skills requiring immediate attention to meet required performance levels'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalSkillGaps.map((gap, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{gap.skillName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {gap.affectedPositions} {language === 'ar' ? 'منصب متأثر' : 'positions affected'}
                        </p>
                      </div>
                      <Badge variant={
                        gap.priority === 'High' ? 'destructive' : 
                        gap.priority === 'Medium' ? 'secondary' : 'outline'
                      }>
                        {gap.priority} Priority
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{language === 'ar' ? 'المستوى الحالي' : 'Current Level'}</span>
                        <span className="font-medium">{gap.currentLevel}/5.0</span>
                      </div>
                      <Progress value={(gap.currentLevel / 5) * 100} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>{language === 'ar' ? 'المستوى المطلوب' : 'Required Level'}</span>
                        <span className="font-medium">{gap.requiredLevel}/5.0</span>
                      </div>
                      <Progress value={(gap.requiredLevel / 5) * 100} className="h-2" />
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      {language === 'ar' ? 'إنشاء خطة تطوير' : 'Create Development Plan'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={language === 'ar' ? 'البحث في المهارات التقنية...' : 'Search technical skills...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder={language === 'ar' ? 'اختر الفئة' : 'Select Category'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === 'ar' ? 'جميع الفئات' : 'All Categories'}
                    </SelectItem>
                    {skillCategories.slice(0, 3).map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {language === 'ar' ? category.nameAr : category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Technical Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillCategories.slice(0, 3).map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {language === 'ar' ? category.nameAr : category.name}
                  </CardTitle>
                  <CardDescription>
                    {category.count} {language === 'ar' ? 'مهارة' : 'skills'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={Math.random() * 100} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>{language === 'ar' ? 'متوسط المستوى' : 'Avg. Level'}</span>
                      <span className="font-medium">3.2/5.0</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      {language === 'ar' ? 'إدارة المهارات' : 'Manage Skills'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="behavioral" className="space-y-6">
          {/* Behavioral Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillCategories.slice(3).map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {language === 'ar' ? category.nameAr : category.name}
                  </CardTitle>
                  <CardDescription>
                    {category.count} {language === 'ar' ? 'مهارة' : 'skills'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={Math.random() * 100} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>{language === 'ar' ? 'متوسط النتيجة' : 'Avg. Score'}</span>
                      <span className="font-medium">3.8/5.0</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      {language === 'ar' ? 'إدارة المهارات' : 'Manage Skills'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};