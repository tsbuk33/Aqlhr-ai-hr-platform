import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  MessageCircle, 
  Send, 
  Trash2, 
  Minimize2, 
  Maximize2, 
  Bot,
  Lightbulb,
  TrendingUp,
  Settings,
  RefreshCw,
  Globe,
  Shield,
  Upload,
  SpellCheck,
  CheckCircle,
  AlertTriangle,
  Image,
  FileText,
  BarChart,
  Presentation,
  Table,
  Mic,
  Paperclip
} from 'lucide-react';
import { useLocale } from '@/i18n/locale';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useDocumentAwareAI } from '@/hooks/useDocumentAwareAI';
import { DocumentUploadWidget } from '@/components/DocumentUploadWidget';
import { useAIAgentOrchestrator } from '@/hooks/useAIAgentOrchestrator';
import { useToast } from '@/hooks/use-toast';

interface AqlHRAIAssistantProps {
  moduleContext?: string;
  companyId?: string;
  position?: 'fixed' | 'static';
  className?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  module?: string;
  confidence?: number;
}

const AqlHRAIAssistant: React.FC<AqlHRAIAssistantProps> = ({ 
  moduleContext = 'default',
  companyId,
  position = 'fixed',
  className = ''
}) => {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';
  const { toast } = useToast();
  const location = useLocation();
  
  // Auto-detect module context from current route
  const getModuleFromRoute = (pathname: string): string => {
    if (pathname.includes('/employees')) return 'employees';
    if (pathname.includes('/payroll')) return 'payroll';
    if (pathname.includes('/government')) return 'government';
    if (pathname.includes('/analytics')) return 'analytics';
    if (pathname.includes('/executive')) return 'executive';
    if (pathname.includes('/core-hr')) return 'core-hr';
    if (pathname.includes('/strategic')) return 'strategic';
    if (pathname.includes('/consulting')) return 'consulting';
    if (pathname.includes('/compliance')) return 'compliance';
    if (pathname.includes('/welfare-safety')) return 'welfare-safety';
    if (pathname.includes('/ai-features')) return 'ai-features';
    if (pathname.includes('/organization')) return 'organization';
    if (pathname.includes('/self-service')) return 'self-service';
    if (pathname.includes('/documents')) return 'documents';
    return moduleContext || 'default';
  };
  
  const currentModule = getModuleFromRoute(location.pathname);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGatheringIntelligence, setIsGatheringIntelligence] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  
  // AI Agent Orchestrator integration
  const { 
    queryAIAgent, 
    getBestResponse, 
    isLoading: aiOrchestratorLoading,
    availableProviders 
  } = useAIAgentOrchestrator();
  
  // Enhanced contextual greetings with page-specific expertise
  const contextualGreetings = {
    'executive': {
      ar: `🎯 **مرحباً! أنا مساعدك الذكي في مركز الذكاء التنفيذي عقل HR**

يمكنني مساعدتك في:
• اتخاذ القرارات الاستراتيجية المبنية على البيانات
• تحليل البيانات التنفيذية المتقدمة
• الرؤى الذكية لإدارة الموارد البشرية
• مراقبة مؤشرات الأداء الرئيسية KPIs
• إدارة المواهب والتخطيط الاستراتيجي
• توقعات المخاطر والفرص

**كيف يمكنني مساعدتك اليوم؟**`,
      en: `🎯 **Hello! I'm your Executive AI Intelligence Assistant for AqlHR**

I can help you with:
• Data-driven strategic decision making
• Advanced executive analytics and reporting
• Intelligent HR insights and predictions
• Key performance indicators (KPIs) monitoring
• Talent management and strategic planning
• Risk assessment and opportunity forecasting

**How can I help you today?**`
    },
    'employees': {
      ar: `👥 **مرحباً! أنا خبيرك الذكي في إدارة شؤون الموظفين**

خبرتي الشاملة تتضمن:
• التوظيف: من الإعلان للتعيين (إقامات، تأشيرات، عقود)
• إدارة السجلات: البيانات الشخصية والوظيفية
• التقييم والأداء: أنظمة التقييم والتطوير
• الامتثال للقوانين السعودية (نظام العمل، وزارة العمل)
• إدارة الحضور والانصراف ومراقبة المواعيد
• التدريب والتطوير المهني
• إجراءات إنهاء الخدمة ومستحقاتها
• السعودة ونطاقات الشركات

**ما الإجراء الذي تحتاج مساعدة به؟**`,
      en: `👥 **Hello! I'm your Employee Management Expert AI Assistant**

My comprehensive expertise includes:
• Recruitment: From job posting to hiring (visas, permits, contracts)
• Record management: Personal and professional data
• Performance evaluation: Review systems and development
• Saudi compliance (Labor Law, MOL requirements)
• Attendance management and time tracking
• Training and professional development
• Termination procedures and end-of-service benefits
• Saudization and company Nitaqat categories

**Which procedure do you need help with?**`
    },
    'payroll': {
      ar: `💰 **أهلاً! أنا مساعدك الذكي المتخصص في الرواتب والشؤون المالية**

خبرتي تشمل:
• معالجة الرواتب وحسابات GOSI
• نظام حماية الأجور WPS
• جميع الأمور المالية للموظفين
• الامتثال المالي والحكومي

**كيف يمكنني مساعدتك؟**`,
      en: `💰 **Hi! I'm your AI assistant specialized in Payroll & Financial**

My expertise includes:
• Payroll processing and GOSI calculations
• Wage Protection System (WPS)
• All employee financial matters
• Financial and government compliance

**How can I assist you?**`
    },
    'government': {
      ar: `🏛️ **مرحباً! أنا مساعدك الذكي للتكامل الحكومي**

أتخصص في:
• منصة قوى والخدمات الحكومية
• وزارة العمل والتأمينات الاجتماعية
• نظام نطاقات والامتثال
• الإجراءات الحكومية

**ما الخدمة الحكومية التي تحتاج مساعدة بها؟**`,
      en: `🏛️ **Hello! I'm your AI assistant for Government Integrations**

I specialize in:
• Qiwa platform and government services
• Ministry of Labor and GOSI
• Nitaqat system and compliance
• Government procedures

**Which government service do you need help with?**`
    },
    'analytics': {
      ar: `📊 **مرحباً! أنا مساعدك الذكي للتحليلات والذكاء الاصطناعي**

يمكنني:
• تحليل البيانات وإنشاء التقارير
• توليد الرؤى الذكية
• تحليل الأداء والاتجاهات
• التنبؤ بالنتائج

**أي تحليل تريد أن نعمل عليه؟**`,
      en: `📊 **Hello! I'm your AI assistant for Analytics & AI Intelligence**

I can:
• Analyze data and generate reports
• Generate intelligent insights
• Analyze performance and trends
• Predict outcomes

**What analysis would you like to work on?**`
    },
      'core-hr': {
        ar: `🏢 **مرحباً! أنا مساعدك الذكي في أنظمة الموارد البشرية الأساسية**

أتخصص في:
• إدارة الحضور والانصراف والإجازات
• أنظمة إدارة الأداء والتقييم
• التدريب والتطوير المهني
• التوظيف والإعداد للعمل
• إدارة المزايا والتعويضات
• أتمتة سير العمل

**أي نظام HR تحتاج مساعدة به؟**`,
        en: `🏢 **Hello! I'm your Core HR Systems AI Assistant**

I specialize in:
• Time, attendance, and leave management
• Performance management and evaluation systems
• Training and professional development
• Recruitment and onboarding processes
• Benefits and compensation management
• Workflow automation

**Which HR system do you need help with?**`
      },
      'strategic': {
        ar: `🎯 **مرحباً! أنا مساعدك الذكي في الموارد البشرية الاستراتيجية**

أركز على:
• التخطيط الاستراتيجي للموارد البشرية
• إدارة المواهب والتطوير القيادي
• تخطيط التعاقب الوظيفي
• تحليل الاحتفاظ بالموظفين
• استراتيجيات التحفيز والمشاركة
• قياس عائد الاستثمار في الموارد البشرية

**أي استراتيجية HR تريد تطويرها؟**`,
        en: `🎯 **Hello! I'm your Strategic HR AI Assistant**

I focus on:
• Strategic HR planning and workforce planning
• Talent management and leadership development
• Succession planning and career pathing
• Employee retention analysis
• Engagement and motivation strategies
• HR ROI measurement and analytics

**Which HR strategy would you like to develop?**`
      },
      'consulting': {
        ar: `💼 **مرحباً! أنا مساعدك الذكي في الاستشارات المتخصصة**

أقدم استشارات في:
• تقييم النضج المؤسسي للموارد البشرية
• تصميم الهياكل التنظيمية
• تطوير السياسات والإجراءات
• تحسين العمليات وزيادة الكفاءة
• استراتيجيات التغيير والتطوير
• معايير الجودة والامتثال

**أي استشارة متخصصة تحتاجها؟**`,
        en: `💼 **Hello! I'm your Specialized HR Consulting AI Assistant**

I provide consulting on:
• HR organizational maturity assessment
• Organizational structure design
• Policy and procedure development
• Process optimization and efficiency
• Change management strategies
• Quality standards and compliance

**Which specialized consultation do you need?**`
      },
      'compliance': {
        ar: `⚖️ **مرحباً! أنا خبيرك الذكي في الامتثال والمطابقة**

أتخصص في:
• قوانين العمل السعودية ولوائحها التنفيذية
• نظام نطاقات والسعودة
• لوائح وزارة العمل والتأمينات الاجتماعية
• معايير الصحة والسلامة المهنية
• سياسات مكافحة التحرش والتمييز
• تدقيق الامتثال والمراجعة الداخلية

**أي موضوع امتثال تحتاج توضيحاً له؟**`,
        en: `⚖️ **Hello! I'm your Compliance and Legal AI Expert**

I specialize in:
• Saudi Labor Law and executive regulations
• Nitaqat system and Saudization compliance
• MOL and GOSI regulatory requirements
• Occupational health and safety standards
• Anti-harassment and discrimination policies
• Compliance auditing and internal review

**Which compliance topic needs clarification?**`
      },
      'welfare-safety': {
        ar: `🛡️ **مرحباً! أنا مساعدك الذكي في الرفاه والسلامة المهنية**

أغطي:
• برامج الصحة والسلامة المهنية
• إدارة المزايا الإضافية والرفاه
• خدمات الطعام والإسكان والنقل
• التأمين الطبي والصحي
• برامج اللياقة والعافية
• إدارة حالات الطوارئ والإسعافات

**أي خدمة رفاه أو سلامة تحتاج مساعدة بها؟**`,
        en: `🛡️ **Hello! I'm your Employee Welfare & Safety AI Assistant**

I cover:
• Occupational health and safety programs
• Additional benefits and welfare management
• Food, housing, and transportation services
• Medical and health insurance
• Fitness and wellness programs
• Emergency management and first aid

**Which welfare or safety service do you need help with?**`
      },
      'ai-features': {
        ar: `🤖 **مرحباً! أنا مساعدك الذكي في الميزات المدعومة بالذكاء الاصطناعي**

أساعدك في:
• الذكاء الاصطناعي في التوظيف والفرز
• تحليل البيانات التنبؤي للموارد البشرية
• أتمتة المهام الروتينية
• معالجة اللغة الطبيعية للمستندات
• التعلم الآلي لتحسين العمليات
• الرؤى الذكية والتوصيات

**أي ميزة ذكية تريد استكشافها؟**`,
        en: `🤖 **Hello! I'm your AI-Powered Features Assistant**

I help you with:
• AI in recruitment and candidate screening
• Predictive analytics for HR data
• Automation of routine tasks
• Natural language processing for documents
• Machine learning for process optimization
• Intelligent insights and recommendations

**Which AI feature would you like to explore?**`
      },
      'default': {
        ar: `🤖 **مرحباً! أنا مساعدك الذكي المتخصص في منصة عقل HR**

أقدم خدمات شاملة في:
• إدارة الموظفين والتوظيف (مع الامتثال الكامل للقوانين السعودية)
• الرواتب والأمور المالية (GOSI، WPS، حسابات متقدمة)
• التكامل الحكومي والامتثال (قوى، وزارة العمل، نطاقات)
• التحليلات والتقارير الذكية (BI، التنبؤات، KPIs)
• الاستشارات المتخصصة والتطوير التنظيمي

**كيف يمكنني مساعدتك اليوم؟**`,
        en: `🤖 **Hello! I'm your specialized HR AI assistant for AqlHR platform**

I provide comprehensive services in:
• Employee management and recruitment (Full Saudi compliance)
• Payroll and financial matters (GOSI, WPS, advanced calculations)
• Government integration and compliance (Qiwa, MOL, Nitaqat)
• Analytics and intelligent reporting (BI, predictions, KPIs)
• Specialized consulting and organizational development

**How can I help you today?**`
      }
  };
  
  // Initialize with welcome message based on current route/module context
  useEffect(() => {
    const effectiveModule = currentModule;
    const welcomeText = contextualGreetings[effectiveModule as keyof typeof contextualGreetings] || contextualGreetings['default'];
    const welcomeMessage: ChatMessage = {
      id: `welcome-message-${effectiveModule}-${Date.now()}`,
      type: 'assistant',
      content: welcomeText[isArabic ? 'ar' : 'en'],
      timestamp: new Date(),
      module: effectiveModule
    };
    setMessages([welcomeMessage]);
  }, [currentModule, isArabic, location.pathname]);

  // Document-aware AI integration with current module
  const { 
    queryWithDocuments, 
    documents, 
    moduleDocuments 
  } = useDocumentAwareAI(currentModule);
  
  // Get page-specific expertise
  const getPageExpertise = (module: string): string => {
    const expertiseMap: Record<string, string> = {
      'employees': 'Employee lifecycle management, Saudi labor law compliance, visa/permit processing, performance management, Saudization requirements',
      'payroll': 'Payroll processing, GOSI calculations, WPS compliance, salary structures, end-of-service benefits, tax calculations',
      'government': 'Qiwa platform integration, MOL procedures, GOSI services, work permit renewals, labor office procedures',
      'analytics': 'HR data analysis, predictive insights, dashboard creation, KPI monitoring, workforce analytics',
      'executive': 'Strategic decision support, executive reporting, business intelligence, organizational insights',
      'core-hr': 'Time attendance, leave management, performance systems, recruitment processes, benefits administration',
      'strategic': 'Strategic planning, talent management, succession planning, organizational development',
      'consulting': 'HR maturity assessment, organizational design, policy development, change management',
      'compliance': 'Legal compliance, audit requirements, policy adherence, risk management',
      'welfare-safety': 'Employee welfare programs, safety compliance, health benefits, emergency procedures',
      'ai-features': 'AI-powered automation, intelligent insights, process optimization, predictive analytics',
      'default': 'Comprehensive HR expertise across all domains with Saudi market specialization'
    };
    return expertiseMap[module] || expertiseMap['default'];
  };

  // Language detection helper
  const detectQueryLanguage = (query: string): 'ar' | 'en' => {
    // Check if query contains Arabic characters
    return /[\u0600-\u06FF]/.test(query) ? 'ar' : 'en';
  };

  // Translation helper functions
  const isTranslationRequest = (query: string): boolean => {
    const lowerQuery = query.toLowerCase();
    return lowerQuery.includes('translate') || 
           lowerQuery.includes('ترجم') || 
           lowerQuery.includes('arabic') || 
           lowerQuery.includes('عربي') ||
           lowerQuery.includes('english') ||
           lowerQuery.includes('انجليزي');
  };

  // Local fallback response generator
  const generateLocalFallbackResponse = (query: string, isArabic: boolean, module: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // GOSI/Social Insurance queries
    if (lowerQuery.includes('gosi') || lowerQuery.includes('جوسي') || lowerQuery.includes('تأمينات') || lowerQuery.includes('social insurance')) {
      return isArabic 
        ? `🏛️ **معلومات التأمينات الاجتماعية (GOSI):**

معدلات GOSI الحالية (2024):
• السعوديين (النظام الجديد): 9.75% موظف + 11.75% صاحب عمل = 21.5% إجمالي
• السعوديين (النظام القديم): 9% موظف + 9% صاحب عمل = 18% إجمالي  
• غير السعوديين: 0% موظف + 2% صاحب عمل = 2% إجمالي

للمزيد من المعلومات، يرجى زيارة موقع التأمينات الاجتماعية الرسمي.`
        : `🏛️ **GOSI (Social Insurance) Information:**

Current GOSI Rates (2024):
• Saudis (NEW System): 9.75% employee + 11.75% employer = 21.5% total
• Saudis (OLD System): 9% employee + 9% employer = 18% total  
• Non-Saudis: 0% employee + 2% employer = 2% total

For more information, please visit the official GOSI website.`;
    }
    
    // Employee registration queries
    if (lowerQuery.includes('register') || lowerQuery.includes('employee') || lowerQuery.includes('تسجيل') || lowerQuery.includes('موظف')) {
      return isArabic
        ? `👥 **تسجيل موظف جديد:**

خطوات التسجيل:
1. انتقل إلى قسم "الموظفين"
2. اضغط على "إضافة موظف جديد"
3. املأ البيانات الشخصية (الاسم، الهوية، الجنسية)
4. أدخل تفاصيل الوظيفة (المسمى، القسم، الراتب)
5. ارفع المستندات المطلوبة
6. احفظ البيانات

المتطلبات:
• رقم الهوية/الإقامة
• تصريح العمل للوافدين
• العقد الموحد في منصة قوى`
        : `👥 **Employee Registration:**

Registration Steps:
1. Navigate to "Employees" section
2. Click "Add New Employee"
3. Fill personal information (Name, ID, Nationality)
4. Enter job details (Title, Department, Salary)
5. Upload required documents
6. Save the data

Requirements:
• National ID/Iqama number
• Work permit for expatriates
• Unified contract in Qiwa platform`;
    }
    
    // Saudization queries
    if (lowerQuery.includes('saudization') || lowerQuery.includes('سعودة') || lowerQuery.includes('nitaqat') || lowerQuery.includes('نطاقات')) {
      return isArabic
        ? `🇸🇦 **معلومات السعودة:**

نطاقات الشركات:
• النطاق البلاتيني: 40% فأكثر
• النطاق الأخضر: 25% - 39%
• النطاق الأصفر: 10% - 24%
• النطاق الأحمر: أقل من 10%

لحساب نسبة السعودة:
النسبة = (عدد السعوديين ÷ إجمالي الموظفين) × 100`
        : `🇸🇦 **Saudization Information:**

Company Categories:
• Platinum: 40% and above
• Green: 25% - 39%
• Yellow: 10% - 24%
• Red: Less than 10%

To calculate Saudization rate:
Rate = (Saudi Employees ÷ Total Employees) × 100`;
    }
    
    // General module-specific responses
    const moduleResponses = {
      payroll: isArabic 
        ? `💰 **مساعد الرواتب:**\n\nيمكنني مساعدتك في:\n• معالجة الرواتب\n• حسابات GOSI\n• نظام حماية الأجور WPS\n• الاستقطاعات والمزايا\n\nما الذي تحتاج مساعدة به بالضبط؟`
        : `💰 **Payroll Assistant:**\n\nI can help you with:\n• Payroll processing\n• GOSI calculations\n• WPS system\n• Deductions and benefits\n\nWhat specifically do you need help with?`,
      employees: isArabic
        ? `👥 **مساعد إدارة الموظفين:**\n\nيمكنني مساعدتك في:\n• تسجيل الموظفين\n• إدارة البيانات\n• التقييم والأداء\n• الامتثال للقوانين\n\nكيف يمكنني مساعدتك؟`
        : `👥 **Employee Management Assistant:**\n\nI can help you with:\n• Employee registration\n• Data management\n• Performance evaluation\n• Compliance\n\nHow can I assist you?`,
      government: isArabic
        ? `🏛️ **مساعد التكامل الحكومي:**\n\nيمكنني مساعدتك في:\n• منصة قوى\n• وزارة العمل\n• التأمينات الاجتماعية\n• الإجراءات الحكومية\n\nأي خدمة حكومية تحتاج مساعدة بها؟`
        : `🏛️ **Government Integration Assistant:**\n\nI can help you with:\n• Qiwa platform\n• Ministry of Labor\n• GOSI\n• Government procedures\n\nWhich government service do you need help with?`
    };
    
    return moduleResponses[module as keyof typeof moduleResponses] || (isArabic
      ? `🤖 **مساعد عقل HR:**\n\nيمكنني مساعدتك في جميع أنواع استفسارات الموارد البشرية. يرجى تحديد ما تحتاج مساعدة به بالضبط.`
      : `🤖 **AqlHR Assistant:**\n\nI can help you with all types of HR inquiries. Please specify what you need help with.`);
  };

  // Comprehensive AI suggestions for ALL modules
  const getContextualSuggestions = () => {
    const suggestions = {
      'executive': {
        ar: [
          'اعرض التحليلات التنفيذية لهذا الشهر',
          'ما هي التوصيات الاستراتيجية؟',
          'أظهر حالة التكامل الحكومي',
          'تحليل مؤشرات الأداء الرئيسية',
          'تقرير الامتثال التنفيذي'
        ],
        en: [
          'Show executive analytics for this month',
          'What are the strategic recommendations?',
          'Display government integration status',
          'Analyze key performance indicators',
          'Executive compliance report'
        ]
      },
      'employees': {
        ar: [
          'كيف أسجل موظف سعودي جديد؟',
          'ما هي متطلبات التوظيف؟',
          'البحث عن سجلات الموظفين',
          'تحديث بيانات الموظف',
          'تقارير الموظفين'
        ],
        en: [
          'How to register a new Saudi employee?',
          'What are the hiring requirements?',
          'Search employee records',
          'Update employee data',
          'Employee reports'
        ]
      },
      'payroll': {
        ar: [
          'كيف أسجل موظف سعودي جديد؟',
          'ما هي المتطلبات الحكومية للتوظيف؟',
          'ما هي معدلات GOSI الحالية؟',
          'كيف أحسب مزايا نهاية الخدمة؟',
          'شرح نظام حماية الأجور WPS'
        ],
        en: [
          'How to register a new Saudi employee?',
          'What are the government requirements for hiring?',
          'What are the current GOSI rates?',
          'How to calculate end of service benefits?',
          'Explain Wage Protection System (WPS)'
        ]
      },
      'government': {
        ar: [
          'كيف أستخدم منصة قوى؟',
          'ما هي متطلبات وزارة العمل؟',
          'شرح نظام نطاقات',
          'تحديث بيانات التأمينات',
          'تجديد رخص العمل'
        ],
        en: [
          'How to use Qiwa platform?',
          'What are MOL requirements?',
          'Explain Nitaqat system',
          'Update GOSI data',
          'Renew work permits'
        ]
      },
      'analytics': {
        ar: [
          'إنشاء تقرير تحليلي',
          'تحليل أداء الموظفين',
          'مؤشرات الأداء الرئيسية',
          'توقعات الاحتفاظ بالموظفين',
          'تحليل التكاليف'
        ],
        en: [
          'Generate analytics report',
          'Analyze employee performance',
          'Key performance indicators',
          'Employee retention predictions',
          'Cost analysis'
        ]
      },
      'default': {
        ar: [
          'كيف أسجل موظف جديد؟',
          'ما هي متطلبات وزارة العمل؟',
          'شرح نظام نطاقات',
          'كيف أستخدم منصة قوى؟',
          'ما هي قوانين العمل السعودية؟'
        ],
        en: [
          'How to register a new employee?',
          'What are MOL requirements?',
          'Explain Nitaqat system',
          'How to use Qiwa platform?',
          'What are Saudi labor laws?'
        ]
      }
    };
    
    return suggestions[currentModule as keyof typeof suggestions] || suggestions.default;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      module: currentModule
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputValue.trim();
    setInputValue('');
    setIsLoading(true);
    setIsGatheringIntelligence(true);

    try {
      // Detect query language first
      const queryLanguage = detectQueryLanguage(currentQuery);
      
      // Enhanced context for better AI responses - use detected language and current route
      const aiContext = {
        module: currentModule,
        current_page: location.pathname,
        language: queryLanguage,
        company_id: companyId || 'demo-company',
        user_context: `HR Professional using ${currentModule} module on ${location.pathname} page`,
        user_location: 'saudi_arabia',
        specialization: 'comprehensive_hr_expert',
        page_expertise: getPageExpertise(currentModule)
      };

      let response;
      let responseSource = '';
      
      // Try multiple AI sources with proper fallback
      try {
        // Use the AI context with already detected language
        const contextWithLanguage = aiContext;

        // Always use AI orchestrator for all queries - no more translation handling
        try {
          // Use AI Agent Orchestrator with the enhanced context
          response = await queryAIAgent(currentQuery, {
            provider: 'gemini',
            module: currentModule,
            context: contextWithLanguage
          });
        } catch (aiAgentError) {
          console.log('AI Agent failed, trying next option:', aiAgentError);
          // Try without specific provider
          response = await queryAIAgent(currentQuery, {
            module: currentModule,
            context: contextWithLanguage
          });
        }
        responseSource = 'AI Agent Orchestrator';
      } catch (orchestratorError) {
        console.log('AI Orchestrator failed, trying document-aware AI:', orchestratorError);
        
        try {
          // Second try: Document-aware AI
          response = await queryWithDocuments(currentQuery, {
            includeAllDocs: true,
            language: isArabic ? 'ar' : 'en'
          });
          responseSource = 'Document-aware AI';
        } catch (documentAIError) {
          console.log('Document-aware AI failed, using local fallback:', documentAIError);
          
          // Final fallback: Local response generation
          response = {
            response: generateLocalFallbackResponse(currentQuery, isArabic, currentModule),
            provider: 'AqlHR Local Fallback',
            confidence: 75
          };
          responseSource = 'Local Fallback';
        }
      }

      // Ensure we have a valid response
      const responseText = response?.response || response?.answer || generateLocalFallbackResponse(currentQuery, isArabic, currentModule);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseText,
        timestamp: new Date(),
        module: currentModule,
        confidence: response?.confidence || 75
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Show success toast
      toast({
        title: isArabic ? "تم الإرسال بنجاح" : "Message sent successfully",
        description: isArabic ? `تم استلام الرد من ${responseSource}` : `Response received from ${responseSource}`,
        duration: 2000,
      });

    } catch (error) {
      console.error('AI query error:', error);
      
      // Provide helpful fallback response even in error case
      const fallbackResponse = generateLocalFallbackResponse(currentQuery, isArabic, currentModule);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
        module: currentModule,
        confidence: 50
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Show error toast
      toast({
        title: isArabic ? "استخدام النظام البديل" : "Using fallback system",
        description: isArabic ? "تم تقديم إجابة من النظام المحلي" : "Provided response from local system",
        variant: "default",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      setIsGatheringIntelligence(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const clearChat = () => {
    setMessages([]);
    // Re-initialize with welcome message
    const welcomeText = contextualGreetings[currentModule as keyof typeof contextualGreetings] || contextualGreetings['default'];
    const welcomeMessage: ChatMessage = {
      id: 'welcome-message-' + Date.now(),
      type: 'assistant',
      content: welcomeText[isArabic ? 'ar' : 'en'],
      timestamp: new Date(),
      module: currentModule
    };
    setMessages([welcomeMessage]);
  };

  const suggestions = getContextualSuggestions();
  const currentSuggestions = suggestions[isArabic ? 'ar' : 'en'];

  if (position === 'fixed') {
    // Fixed position version (original chat widget)
    if (isMinimized) {
      return (
        <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
          <Button
            onClick={() => setIsMinimized(false)}
            className="rounded-full w-14 h-14 bg-primary shadow-lg hover:bg-primary/90"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      );
    }

    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Card className={`w-96 h-[600px] bg-background border shadow-xl ${isExpanded ? 'w-[800px] h-[700px]' : ''}`}>
          <CardHeader className="pb-2 bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <CardTitle className="text-sm font-medium">
                  {isArabic ? 'مساعد عقل HR الذكي' : 'AqlHR AI Assistant'}
                </CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 w-8 p-0 hover:bg-primary-foreground/20"
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="h-8 w-8 p-0 hover:bg-primary-foreground/20"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[calc(100%-60px)]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground border'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    {message.confidence && (
                      <div className="text-xs opacity-70 mt-1">
                        {isArabic ? `الثقة: ${message.confidence}%` : `Confidence: ${message.confidence}%`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="text-sm">
                        {isGatheringIntelligence 
                          ? (isArabic ? 'جمع المعلومات...' : 'Gathering intelligence...') 
                          : (isArabic ? 'جاري التفكير...' : 'Thinking...')
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            {!isLoading && messages.length <= 1 && (
              <div className="p-4 border-t">
                <div className="text-sm font-medium mb-2 text-muted-foreground">
                  {isArabic ? 'اقتراحات سريعة:' : 'Quick suggestions:'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentSuggestions.slice(0, 3).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs h-8"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={isArabic ? 'اكتب رسالتك هنا...' : 'Type your message here...'}
                  className="min-h-[80px] resize-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="sm"
                    className="h-10 w-10 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={clearChat}
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Static version for embedding in pages
  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            <CardTitle>
              {isArabic ? 'مساعد عقل HR الذكي' : 'AqlHR AI Assistant'}
            </CardTitle>
          </div>
          <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
            {currentModule}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground border'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                {message.confidence && (
                  <div className="text-xs opacity-70 mt-1">
                    {isArabic ? `الثقة: ${message.confidence}%` : `Confidence: ${message.confidence}%`}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm">
                    {isGatheringIntelligence 
                      ? (isArabic ? 'جمع المعلومات...' : 'Gathering intelligence...') 
                      : (isArabic ? 'جاري التفكير...' : 'Thinking...')
                    }
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestions */}
        {!isLoading && messages.length <= 1 && (
          <div className="p-4 border-t">
            <div className="text-sm font-medium mb-3 text-muted-foreground">
              {isArabic ? 'اقتراحات سريعة:' : 'Quick suggestions:'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left justify-start h-auto p-3 text-sm"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isArabic ? 'اكتب رسالتك هنا...' : 'Type your message here...'}
              className="min-h-[100px] resize-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="h-12 w-12 p-0"
              >
                <Send className="h-5 w-5" />
              </Button>
              <Button
                onClick={clearChat}
                variant="outline"
                className="h-12 w-12 p-0"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AqlHRAIAssistant;