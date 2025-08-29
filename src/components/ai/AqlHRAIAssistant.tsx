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
  Paperclip,
  User,
  Square,
  ChevronDown,
  ChevronUp,
  Eye,
  Target,
  Zap,
  Activity
} from 'lucide-react';
import { useLocale } from '@/i18n/locale';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useDocumentAwareAI } from '@/hooks/useDocumentAwareAI';
import { DocumentUploadWidget } from '@/components/DocumentUploadWidget';
import { useAIAgentOrchestrator } from '@/hooks/useAIAgentOrchestrator';
import { useToast } from '@/hooks/use-toast';
import { useRAGChat } from '@/hooks/useRAGChat';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
// Context Engineering Engine Integration
import { useContextEngine } from '@/hooks/useContextEngine';
import { detectModuleContext } from '@/lib/ai/context/moduleContext';
import { 
  getIntentName, 
  getIntentColor, 
  formatUrgency, 
  formatComplexity, 
  formatConfidence, 
  formatRiskLevel,
  getRiskColor,
  getUrgencyColor,
  getComplexityColor,
  getConfidenceColor
} from '@/lib/ai/context/utils';

interface AqlHRAIAssistantProps {
  moduleContext?: string;
  companyId?: string;
  position?: 'fixed' | 'static';
  className?: string;
}

interface Citation {
  docId: string;
  filename: string;
  score: number;
  portal?: string;
  employee_id?: string;
  doc_type?: string;
  chunk?: string;
  pageNumber?: number;
  uploadedAt?: string;
}

interface RAGFilters {
  portal?: string;
  employee_id?: string;
  doc_type?: string;
  uploadedAfter?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  module?: string;
  confidence?: number;
  citations?: Citation[];
  filters?: RAGFilters;
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
  const [useRAG, setUseRAG] = useState(true);
  const [ragFilters, setRAGFilters] = useState<RAGFilters>({});
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  
  // Context Engineering Engine Integration
  const contextEngineModule = detectModuleContext(location.pathname);
  const {
    intent,
    routingPlan,
    isClassifying,
    isRouting,
    isExecuting,
    executeQuery,
    reset: resetContextEngine
  } = useContextEngine({
    defaultCostTarget: 'balanced',
    defaultStreaming: true,
    autoExecute: false, // We'll control execution manually
    debug: false
  });
  
  // Intent badges display state
  const [showIntentBadges, setShowIntentBadges] = useState(false);
  
  // RAG Chat Integration
  const {
    messages: ragMessages,
    isStreaming: ragStreaming,
    error: ragError,
    partial: ragPartial,
    meta: ragMeta,
    citations: currentCitations,
    sendMessage: sendRAGMessage,
    clearChat: clearRAGChat,
    stopStream: stopRAGStream,
  } = useRAGChat();
  
  // AI Agent Orchestrator integration
  const { 
    queryAIAgent, 
    getBestResponse, 
    isLoading: aiOrchestratorLoading,
    availableProviders 
  } = useAIAgentOrchestrator();
  
  // Enhanced contextual greetings with page-specific expertise
  const contextualGreetings = {
    'policy': {
      ar: `🛡️ **مرحباً! أنا مساعدك الذكي في ذكاء السياسات والامتثال**

أساعدك في:
• تقييم وتحليل السياسات
• ضمان الامتثال للقوانين واللوائح
• إدارة المخاطر التنظيمية
• مراجعة وتحديث السياسات
• تحليل الفجوات في الامتثال
• التوجيه في أفضل الممارسات
• التكامل مع الأنظمة الحكومية

**أي سياسة أو إجراء امتثال تحتاج مساعدة به؟**`,
      en: `🛡️ **Hello! I'm your Policy Intelligence & Compliance AI Assistant**

I help you with:
• Policy assessment and analysis
• Regulatory compliance assurance
• Risk management and mitigation
• Policy review and updates
• Compliance gap analysis
• Best practices guidance
• Government systems integration

**Which policy or compliance matter do you need help with?**`
    },
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
    if (!inputValue.trim() || isLoading || ragStreaming || isClassifying || isRouting || isExecuting) return;

    const currentQuery = inputValue.trim();
    setInputValue('');
    
    // If using RAG, delegate to RAG system with CEE integration
    if (useRAG) {
      try {
        // Show intent badges as we process
        setShowIntentBadges(true);
        
        // Use Context Engineering Engine for RAG queries too
        await executeQuery(currentQuery, contextEngineModule, {
          costTarget: 'balanced',
          streaming: true,
          context: `RAG Query with filters: ${JSON.stringify(ragFilters)}`,
          metadata: { 
            useRAG: true, 
            ragFilters,
            moduleContext: contextEngineModule 
          }
        });
        
        // Also send through RAG system for document awareness
        await sendRAGMessage(currentQuery, ragFilters);
      } catch (error) {
        console.error('CEE+RAG message error:', error);
        toast({
          title: isArabic ? "خطأ في النظام الذكي" : "AI System Error",
          description: isArabic ? "حدث خطأ أثناء المعالجة الذكية للاستعلام" : "Error occurred during intelligent query processing",
          variant: "destructive",
        });
      }
      return;
    }
    
    // Enhanced AI Assistant flow with Context Engineering Engine
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentQuery,
      timestamp: new Date(),
      module: currentModule
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsGatheringIntelligence(true);
    setShowIntentBadges(true);

    try {
      // Use Context Engineering Engine with SSE streaming
      const { intent: intentResult, result } = await executeQuery(currentQuery, {
        moduleContext: contextEngineModule,
        companyId: companyId || 'demo-company',
        useStreaming: moduleConfig.streaming,
        lang: isArabic ? 'ar' : 'en',
        costTarget: moduleConfig.costTarget,
        temperature: moduleConfig.temperature,
        streamingOptions: {
          endpoint: '/functions/v1/ai-route-v1',
          method: 'POST',
          params: { stream: 'sse' },
          fallbackToNonStream: true
        },
        context: `HR Professional using ${currentModule} module on ${location.pathname} page`,
        metadata: {
          companyId: companyId || 'demo-company',
          userLocation: 'saudi_arabia',
          language: isArabic ? 'ar' : 'en',
          specialization: 'comprehensive_hr_expert',
          pageExpertise: getPageExpertise(currentModule)
        }
      });

      // Extract response from CEE result with enhanced metadata
      let responseText: string;
      let responseSource = 'Context Engineering Engine';
      let providerInfo = 'Unknown';
      
      if (result && typeof result === 'object' && 'response' in result) {
        const executeResult = result as any;
        responseText = executeResult.response || executeResult.content || executeResult.answer;
        providerInfo = executeResult.metadata?.provider || executeResult.provider || 'Unknown';
        responseSource = `${responseSource} (${providerInfo})`;
        
        // Show success toast with provider information
        toast({
          title: isArabic ? 'تم الاستعلام بنجاح' : 'Query Successful',
          description: isArabic 
            ? `موجه عبر ${providerInfo} بتكلفة ${moduleConfig.costTarget}`
            : `Routed via ${providerInfo} with ${moduleConfig.costTarget} cost target`,
        });
      } else {
        // Fallback to legacy system if CEE fails
        console.log('CEE did not return expected result, falling back to legacy system');
        
        // Show fallback warning
        toast({
          title: isArabic ? 'تحذير' : 'Warning',
          description: isArabic 
            ? 'تم التبديل إلى النظام الاحتياطي'
            : 'Switched to fallback system',
          variant: 'destructive'
        });
        
        const queryLanguage = detectQueryLanguage(currentQuery);
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

        try {
          const response = await queryAIAgent(currentQuery, {
            provider: 'gemini',
            module: currentModule,
            context: aiContext
          });
          responseText = response?.response || response?.answer || generateLocalFallbackResponse(currentQuery, isArabic, currentModule);
          responseSource = 'Legacy AI Agent Orchestrator (Fallback)';
        } catch (legacyError) {
          responseText = generateLocalFallbackResponse(currentQuery, isArabic, currentModule);
          responseSource = 'Local Fallback';
        }
      }

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
  
  // Document Preview Handler
  const handleDocumentPreview = async (docId: string) => {
    setSelectedDocumentId(docId);
    // Note: In a full implementation, you'd fetch document content here
    // For now, we'll just show the dialog with the document ID
  };
  
  // Citations Renderer
  const renderCitations = (citations?: Citation[]) => {
    if (!citations || citations.length === 0) return null;
    
    return (
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="mt-2 h-8 px-2 text-xs hover:bg-muted/50">
            <FileText className="w-3 h-3 mr-1" />
            {isArabic ? `المصادر (${citations.length})` : `Sources (${citations.length})`}
            <RefreshCw className="w-3 h-3 ml-1" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="text-xs space-y-2 max-h-48 overflow-y-auto">
            {citations.map((citation, idx) => (
              <div key={idx} className="border rounded-lg p-2 bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm truncate flex-1">
                    {citation.filename}
                  </span>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(citation.score * 100)}%
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleDocumentPreview(citation.docId)}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                  {citation.portal && (
                    <Badge variant="outline" className="text-xs">
                      {citation.portal}
                    </Badge>
                  )}
                  {citation.doc_type && (
                    <Badge variant="outline" className="text-xs">
                      {citation.doc_type}
                    </Badge>
                  )}
                  {citation.pageNumber && (
                    <span>Page {citation.pageNumber}</span>
                  )}
                </div>
                {citation.chunk && (
                  <div className="text-xs mt-1 p-1 bg-background rounded border-l-2 border-primary/20">
                    "{citation.chunk.substring(0, 100)}..."
                  </div>
                )}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };
  
  // Filter Controls Renderer
  const renderFilterControls = () => {
    if (!useRAG) return null;
    
    return (
      <div className="p-3 border-t bg-muted/20">
        <div className="text-xs font-medium mb-2 text-muted-foreground">
          {isArabic ? 'مرشحات البحث في المستندات:' : 'Document Search Filters:'}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Select
            value={ragFilters.portal || ''}
            onValueChange={(value) => setRAGFilters(prev => ({ ...prev, portal: value || undefined }))}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder={isArabic ? "البوابة" : "Portal"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="qiwa">{isArabic ? "قوى" : "Qiwa"}</SelectItem>
              <SelectItem value="gosi">{isArabic ? "جوسي" : "GOSI"}</SelectItem>
              <SelectItem value="absher">{isArabic ? "أبشر" : "Absher"}</SelectItem>
              <SelectItem value="mudad">{isArabic ? "مدد" : "Mudad"}</SelectItem>
              <SelectItem value="mol">{isArabic ? "وزارة العمل" : "MOL"}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={ragFilters.doc_type || ''}
            onValueChange={(value) => setRAGFilters(prev => ({ ...prev, doc_type: value || undefined }))}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder={isArabic ? "نوع المستند" : "Doc Type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contract">{isArabic ? "عقد" : "Contract"}</SelectItem>
              <SelectItem value="permit">{isArabic ? "تصريح" : "Permit"}</SelectItem>
              <SelectItem value="certificate">{isArabic ? "شهادة" : "Certificate"}</SelectItem>
              <SelectItem value="report">{isArabic ? "تقرير" : "Report"}</SelectItem>
              <SelectItem value="policy">{isArabic ? "سياسة" : "Policy"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRAGFilters({})}
            className="h-6 px-2 text-xs"
          >
            {isArabic ? 'مسح المرشحات' : 'Clear Filters'}
          </Button>
          
          {ragMeta && (
            <div className="text-xs text-muted-foreground">
              {isArabic ? `تم البحث في ${ragMeta.documentsSearched || 0} مستند` : `Searched ${ragMeta.documentsSearched || 0} docs`}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Get effective messages (RAG or legacy)
  const effectiveMessages = useRAG ? ragMessages : messages;
  const effectiveIsLoading = useRAG ? ragStreaming : isLoading;
  const effectivePartial = useRAG ? ragPartial : '';
  const effectiveCitations = useRAG ? currentCitations : [];
  
  const clearChat = () => {
    // Reset Context Engineering Engine
    resetContextEngine();
    setShowIntentBadges(false);
    
    if (useRAG) {
      clearRAGChat();
    } else {
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
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };



  const suggestions = getContextualSuggestions();
  const currentSuggestions = suggestions[isArabic ? 'ar' : 'en'];

  // Support Dialog mode for embedding in pages
  if (open !== undefined || onOpenChange) {
    const dialogContent = (
      <Card className="w-full h-[600px] max-w-4xl mx-auto" data-testid="ai-assistant-modal">
        <CardHeader className="pb-2 bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-sm font-medium">
                {isArabic ? 'مساعد عقل HR الذكي' : 'AqlHR AI Assistant'}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground text-xs" data-testid="module-badge">
                {currentModule === 'policy' ? (isArabic ? 'السياسات' : 'Policy') : currentModule}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col h-full">
          {/* CEE Intent Badges */}
          {showIntentBadges && intent && (
            <div className="p-3 bg-muted/20 border-b" data-testid="intent-badges">
              <div className="text-xs font-medium mb-2 text-muted-foreground">
                {isArabic ? 'تحليل النية والتعقيد:' : 'Intent & Complexity Analysis:'}
              </div>
              <div className="flex flex-wrap gap-2">
                {/* Intent Badge */}
                <Badge 
                  variant="outline"
                  style={{ borderColor: getIntentColor(intent.intent) }}
                  className="text-xs"
                  data-testid="intent-badge"
                >
                  <Target className="w-3 h-3 mr-1" style={{ color: getIntentColor(intent.intent) }} />
                  {getIntentName(intent.intent, isArabic ? 'ar' : 'en')}
                </Badge>

                {/* Urgency Badge */}
                <Badge 
                  variant="outline"
                  style={{ borderColor: getUrgencyColor(intent.urgency) }}
                  className="text-xs"
                  data-testid="urgency-badge"
                >
                  <Zap className="w-3 h-3 mr-1" style={{ color: getUrgencyColor(intent.urgency) }} />
                  {formatUrgency(intent.urgency, isArabic ? 'ar' : 'en')}
                </Badge>

                {/* Complexity Badge */}
                <Badge 
                  variant="outline"
                  style={{ borderColor: getComplexityColor(intent.complexity) }}
                  className="text-xs"
                  data-testid="complexity-badge"
                >
                  <Brain className="w-3 h-3 mr-1" style={{ color: getComplexityColor(intent.complexity) }} />
                  {formatComplexity(intent.complexity, isArabic ? 'ar' : 'en')}
                </Badge>

                {/* Confidence Badge */}
                <Badge 
                  variant="outline"
                  style={{ borderColor: getConfidenceColor(intent.confidence) }}
                  className="text-xs"
                  data-testid="confidence-badge"
                >
                  <Activity className="w-3 h-3 mr-1" style={{ color: getConfidenceColor(intent.confidence) }} />
                  {formatConfidence(intent.confidence, isArabic ? 'ar' : 'en')}
                </Badge>

                {/* Processing Status */}
                {(isClassifying || isRouting || isExecuting) && (
                  <Badge variant="secondary" className="text-xs animate-pulse">
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    {isClassifying 
                      ? (isArabic ? 'تصنيف النية...' : 'Classifying...') 
                      : isRouting 
                      ? (isArabic ? 'إنشاء الخطة...' : 'Planning...') 
                      : (isArabic ? 'التنفيذ...' : 'Executing...')
                    }
                  </Badge>
                )}
              </div>
              
              {/* Routing Plan */}
              {routingPlan && (
                <div className="mt-2 p-2 bg-background/50 rounded-lg" data-testid="routing-plan">
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    {isArabic ? 'خطة التوجيه:' : 'Routing Plan:'}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span data-testid="primary-provider">
                      {isArabic ? 'المزود الأساسي:' : 'Primary:'} {routingPlan.primaryProvider}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span data-testid="cost-target">
                      {isArabic ? 'هدف التكلفة:' : 'Cost:'} 
                      {routingPlan.costTarget === 'low' ? (isArabic ? 'منخفض' : 'Low') :
                       routingPlan.costTarget === 'high' ? (isArabic ? 'عالي' : 'High') : 
                       (isArabic ? 'متوازن' : 'Balanced')}
                    </span>
                    {routingPlan.streaming && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span data-testid="response-mode">{isArabic ? 'بث مباشر' : 'Streaming'}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="messages-area">
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
                  <div className="text-sm whitespace-pre-wrap" data-testid={message.type === 'assistant' ? 'ai-response' : 'user-message'}>
                    {message.content}
                  </div>
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
          
          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isArabic ? 'اكتب رسالتك هنا...' : 'Type your message here...'}
                className="min-h-[80px] resize-none"
                data-testid="ai-input"
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
                  data-testid="ai-submit"
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
    
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{isArabic ? 'مساعد عقل HR الذكي' : 'AqlHR AI Assistant'}</DialogTitle>
          </DialogHeader>
          {dialogContent}
        </DialogContent>
      </Dialog>
    );
  }
  
  if (position === 'fixed') {
    // Fixed position version (original chat widget)
    if (isMinimized) {
      return (
        <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
          <Button
            onClick={() => setIsMinimized(false)}
            className="rounded-full w-14 h-14 bg-primary shadow-lg hover:bg-primary/90"
            data-testid="ai-assistant-trigger"
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
              {effectiveMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    
                    {/* Message Content */}
                    <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`p-3 rounded-lg ${
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
                        
                        {/* Show filters used for user messages */}
                        {message.type === 'user' && message.filters && Object.keys(message.filters).length > 0 && (
                          <div className="text-xs opacity-70 mt-1 flex gap-1 flex-wrap">
                            {Object.entries(message.filters).map(([key, value]) => value && (
                              <Badge key={key} variant="secondary" className="text-xs">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Citations for assistant messages */}
                      {message.type === 'assistant' && message.citations && (
                        <div className="mt-1 w-full">
                          {renderCitations(message.citations)}
                        </div>
                      )}
                      
                      {/* Meta information */}
                      {message.type === 'assistant' && message.meta && (
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                          {message.meta.provider && (
                            <Badge variant="secondary" className="text-xs">
                              {message.meta.provider}
                            </Badge>
                          )}
                          {message.meta.documentsSearched && (
                            <span>
                              {isArabic ? `تم البحث في ${message.meta.documentsSearched} مستند` : `${message.meta.documentsSearched} docs searched`}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Streaming message for RAG */}
              {useRAG && ragStreaming && ragPartial && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mt-1 bg-muted text-muted-foreground">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="bg-muted text-foreground p-3 rounded-lg border">
                        <div className="text-sm whitespace-pre-wrap">
                          {ragPartial}
                          <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse ml-1" />
                        </div>
                      </div>
                      {ragMeta && (
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                            {ragMeta.provider || 'RAG'}
                          </Badge>
                          {ragMeta.documentsSearched && (
                            <span>
                              {isArabic ? `جاري البحث في ${ragMeta.documentsSearched} مستند...` : `Searching ${ragMeta.documentsSearched} docs...`}
                            </span>
                          )}
                        </div>
                      )}
                      {effectiveCitations.length > 0 && (
                        <div className="mt-1 w-full">
                          {renderCitations(effectiveCitations)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Legacy loading indicator */}
              {!useRAG && isLoading && (
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
            {!effectiveIsLoading && effectiveMessages.length <= 1 && (
              <div className="p-4 border-t">
                <div className="text-sm font-medium mb-2 text-muted-foreground">
                  {isArabic ? 'اقتراحات سريعة:' : 'Quick suggestions:'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {useRAG ? [
                    isArabic ? 'ما هي مستندات التوظيف المطلوبة؟' : 'What hiring documents are required?',
                    isArabic ? 'أظهر عقود الموظفين الجديدة' : 'Show new employee contracts',
                    isArabic ? 'ابحث عن تقارير GOSI' : 'Search for GOSI reports'
                  ].map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs h-8"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      {suggestion}
                    </Button>
                  )) : currentSuggestions.slice(0, 3).map((suggestion, index) => (
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
            
            {/* RAG Filters */}
            {useRAG && renderFilterControls()}

            {/* Input Area */}
            <div className="p-4 border-t">
              {/* Mode Toggle */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant={useRAG ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseRAG(true)}
                    className="h-7 px-3 text-xs"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    {t('documents', 'smart_search')}
                  </Button>
                  <Button
                    variant={!useRAG ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseRAG(false)}
                    className="h-7 px-3 text-xs"
                  >
                    <Bot className="w-3 h-3 mr-1" />
                    {t('documents', 'general_ai')}
                  </Button>
                </div>
                
                {useRAG && ragStreaming && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={stopRAGStream}
                    className="h-7 px-3 text-xs"
                  >
                    <Square className="w-3 h-3 mr-1" />
                    {isArabic ? 'إيقاف' : 'Stop'}
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    useRAG 
                      ? t('documents', 'ask_about_documents')
                      : t('common', 'type_message_here') || (isArabic ? 'اكتب رسالتك هنا...' : 'Type your message here...')
                  }
                  className="min-h-[80px] resize-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={effectiveIsLoading}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || effectiveIsLoading}
                    size="sm"
                    className="h-10 w-10 p-0"
                  >
                    {effectiveIsLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
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
            
            {/* Document Preview Dialog */}
            <Dialog open={!!selectedDocumentId} onOpenChange={() => setSelectedDocumentId(null)}>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>
                    {isArabic ? 'معاينة المستند' : 'Document Preview'}
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] w-full">
                  <div className="p-4 text-center text-muted-foreground">
                    {isArabic 
                      ? `معاينة المستند: ${selectedDocumentId}` 
                      : `Document Preview: ${selectedDocumentId}`}
                    <br />
                    <span className="text-xs">
                      {isArabic 
                        ? 'يتم تطوير معاينة المحتوى...' 
                        : 'Content preview coming soon...'}
                    </span>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Static version for embedding in pages  
  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`} data-testid="ai-assistant-static">
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

        {/* Intent Badges */}
        {showIntentBadges && intent && (
          <div className="px-4 py-2 border-t bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {isArabic ? 'تحليل الذكاء الاصطناعي:' : 'AI Analysis:'}
              </span>
              
              {/* Intent Badge */}
              <Badge 
                variant="outline" 
                style={{ borderColor: getIntentColor(intent.intent as any) }}
                className="text-xs"
              >
                <Target className="w-3 h-3 mr-1" style={{ color: getIntentColor(intent.intent as any) }} />
                {getIntentName(intent.intent as any, isArabic ? 'ar' : 'en')}
              </Badge>

              {/* Urgency Badge */}
              <Badge 
                variant="outline"
                style={{ borderColor: getUrgencyColor(intent.urgency) }}
                className="text-xs"
              >
                <Zap className="w-3 h-3 mr-1" style={{ color: getUrgencyColor(intent.urgency) }} />
                {formatUrgency(intent.urgency, isArabic ? 'ar' : 'en')}
              </Badge>

              {/* Complexity Badge */}
              <Badge 
                variant="outline"
                style={{ borderColor: getComplexityColor(intent.complexity) }}
                className="text-xs"
              >
                <Brain className="w-3 h-3 mr-1" style={{ color: getComplexityColor(intent.complexity) }} />
                {formatComplexity(intent.complexity, isArabic ? 'ar' : 'en')}
              </Badge>

              {/* Confidence Badge */}
              <Badge 
                variant="outline"
                style={{ borderColor: getConfidenceColor(intent.confidence) }}
                className="text-xs"
              >
                <Activity className="w-3 h-3 mr-1" style={{ color: getConfidenceColor(intent.confidence) }} />
                {formatConfidence(intent.confidence, isArabic ? 'ar' : 'en')}
              </Badge>

              {/* Risk Level Badge */}
              {intent.riskHints && intent.riskHints.length > 0 && (
                <Badge 
                  variant="outline"
                  style={{ borderColor: getRiskColor(intent.riskHints) }}
                  className="text-xs"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" style={{ color: getRiskColor(intent.riskHints) }} />
                  {formatRiskLevel(intent.riskHints, isArabic ? 'ar' : 'en')}
                </Badge>
              )}

              {/* Processing Status */}
              {(isClassifying || isRouting || isExecuting) && (
                <Badge variant="secondary" className="text-xs animate-pulse">
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  {isClassifying 
                    ? (isArabic ? 'تصنيف النية...' : 'Classifying...') 
                    : isRouting 
                    ? (isArabic ? 'إنشاء الخطة...' : 'Planning...') 
                    : (isArabic ? 'التنفيذ...' : 'Executing...')
                  }
                </Badge>
              )}
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
              data-testid="ai-input"
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
                data-testid="ai-submit"
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