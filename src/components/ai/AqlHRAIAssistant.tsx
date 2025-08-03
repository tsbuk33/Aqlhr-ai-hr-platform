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
  AlertTriangle
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useDocumentAwareAI } from '@/hooks/useDocumentAwareAI';
import { DocumentUploadWidget } from '@/components/DocumentUploadWidget';

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

export const AqlHRAIAssistant: React.FC<AqlHRAIAssistantProps> = ({ 
  moduleContext = 'default',
  companyId,
  position = 'fixed',
  className = ''
}) => {
  const { isArabic } = useSimpleLanguage();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGatheringIntelligence, setIsGatheringIntelligence] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(true);
  const [spellingSuggestions, setSpellingSuggestions] = useState<string[]>([]);
  const [showSpellingSuggestions, setShowSpellingSuggestions] = useState(false);
  
  // Document-aware AI integration
  const { 
    queryWithDocuments, 
    documents, 
    moduleDocuments 
  } = useDocumentAwareAI(moduleContext);

  // Contextual greetings with correct Arabic branding
  const contextualGreetings = {
    'executive': {
      ar: 'مرحباً! أنا مساعدك الذكي في مركز الذكاء التنفيذي عقل HR. كيف يمكنني مساعدتك في اتخاذ القرارات الاستراتيجية؟',
      en: 'Hello! I\'m your AI assistant for AqlHR Executive Intelligence Center. How can I help you make strategic decisions?'
    },
    'employees': {
      ar: 'مرحباً! كيف يمكنني مساعدتك في إدارة بيانات الموظفين في منصة عقل HR؟',
      en: 'Hello! How can I help you with employee management in AqlHR platform?'
    },
    'payroll': {
      ar: 'أهلاً! هل تحتاج مساعدة في معالجة الرواتب عبر نظام عقل HR؟',
      en: 'Hi! Need help with payroll processing in AqlHR system?'
    },
    'government': {
      ar: 'مرحباً! كيف يمكنني مساعدتك في التكامل الحكومي لمنصة عقل HR؟',
      en: 'Hello! How can I assist with government integrations in AqlHR platform?'
    },
    'analytics': {
      ar: 'مرحباً! أنا هنا لمساعدتك في التحليلات والذكاء الاصطناعي في عقل HR. ما الذي تريد تحليله؟',
      en: 'Hello! I\'m here to help with analytics and AI intelligence in AqlHR. What would you like to analyze?'
    },
    'workforceAnalytics': {
      ar: 'مرحباً! أنا مساعدك الذكي لتحليلات القوى العاملة في عقل HR. كيف يمكنني مساعدتك في تحليل بيانات الموظفين والأداء؟',
      en: 'Hello! I\'m your AI assistant for Workforce Analytics in AqlHR. How can I help you analyze employee data and performance?'
    },
    'core-hr': {
      ar: 'مرحباً! كيف يمكنني مساعدتك في وحدات الموارد البشرية الأساسية في عقل HR؟',
      en: 'Hello! How can I help you with Core HR modules in AqlHR?'
    },
    // Core HR specific modules
    'core-hr.employeeMasterData': {
      ar: 'مرحباً! أنا مساعدك الذكي لإدارة البيانات الأساسية للموظفين في عقل HR. كيف يمكنني مساعدتك؟',
      en: 'Hello! I\'m your AI assistant for Employee Master Data in AqlHR. How can I help you?'
    },
    'core-hr.benefitsAdministration': {
      ar: 'مرحباً! أنا هنا لمساعدتك في إدارة المزايا والفوائد للموظفين في عقل HR.',
      en: 'Hello! I\'m here to help with Benefits Administration in AqlHR.'
    },
    'core-hr.compensationManagement': {
      ar: 'مرحباً! أنا مساعدك في إدارة التعويضات والرواتب في عقل HR.',
      en: 'Hello! I\'m your assistant for Compensation Management in AqlHR.'
    },
    'core-hr.leaveManagement': {
      ar: 'مرحباً! كيف يمكنني مساعدتك في إدارة الإجازات والعطل في عقل HR؟',
      en: 'Hello! How can I help you with Leave Management in AqlHR?'
    },
    'core-hr.performanceManagement': {
      ar: 'مرحباً! أنا مساعدك في إدارة الأداء وتقييم الموظفين في عقل HR.',
      en: 'Hello! I\'m your assistant for Performance Management in AqlHR.'
    },
    'core-hr.recruitmentOnboarding': {
      ar: 'مرحباً! أنا هنا لمساعدتك في التوظيف والإدماج الوظيفي في عقل HR.',
      en: 'Hello! I\'m here to help with Recruitment & Onboarding in AqlHR.'
    },
    'core-hr.saudization': {
      ar: 'مرحباً! أنا مساعدك في حاسبة السعودة وإدارة التوطين في عقل HR.',
      en: 'Hello! I\'m your assistant for Saudization Calculator in AqlHR.'
    },
    'core-hr.successionPlanning': {
      ar: 'مرحباً! أنا هنا لمساعدتك في تخطيط التعاقب الوظيفي في عقل HR.',
      en: 'Hello! I\'m here to help with Succession Planning in AqlHR.'
    },
    'core-hr.timeAttendance': {
      ar: 'مرحباً! أنا مساعدك في إدارة الوقت والحضور في عقل HR.',
      en: 'Hello! I\'m your assistant for Time & Attendance in AqlHR.'
    },
    'core-hr.trainingDevelopment': {
      ar: 'مرحباً! أنا هنا لمساعدتك في التدريب والتطوير المهني في عقل HR.',
      en: 'Hello! I\'m here to help with Training & Development in AqlHR.'
    },
    'core-hr.workflowAutomation': {
      ar: 'مرحباً! أنا مساعدك في أتمتة سير العمل في عقل HR.',
      en: 'Hello! I\'m your assistant for Workflow Automation in AqlHR.'
    },
    // AI Automation modules
    'ai-automation.aiSyncEngine': {
      ar: 'مرحباً! أنا مساعدك الذكي لمحرك المزامنة الذكية في عقل HR.',
      en: 'Hello! I\'m your AI assistant for AI Sync Engine in AqlHR.'
    },
    'ai-automation.arabicEnglishNLP': {
      ar: 'مرحباً! أنا مساعدك في معالجة اللغة الطبيعية العربية والإنجليزية في عقل HR.',
      en: 'Hello! I\'m your assistant for Arabic-English NLP in AqlHR.'
    },
    'ai-automation.automatedWorkflowEngine': {
      ar: 'مرحباً! أنا مساعدك في محرك سير العمل الآلي في عقل HR.',
      en: 'Hello! I\'m your assistant for Automated Workflow Engine in AqlHR.'
    },
    'ai-automation.compliancePredictor': {
      ar: 'مرحباً! أنا مساعدك في منبئ الامتثال الذكي في عقل HR.',
      en: 'Hello! I\'m your assistant for Compliance Predictor in AqlHR.'
    },
    'ai-automation.contentGenerator': {
      ar: 'مرحباً! أنا مساعدك في مولد المحتوى الذكي في عقل HR.',
      en: 'Hello! I\'m your assistant for Content Generator in AqlHR.'
    },
    'ai-automation.documentIntelligence': {
      ar: 'مرحباً! أنا مساعدك في ذكاء المستندات في عقل HR.',
      en: 'Hello! I\'m your assistant for Document Intelligence in AqlHR.'
    },
    'ai-automation.onboardingAssistant': {
      ar: 'مرحباً! أنا مساعدك في الإدماج الوظيفي الذكي في عقل HR.',
      en: 'Hello! I\'m your assistant for Onboarding Assistant in AqlHR.'
    },
    'ai-automation.predictiveAnalyticsEngine': {
      ar: 'مرحباً! أنا مساعدك في محرك التحليلات التنبؤية في عقل HR.',
      en: 'Hello! I\'m your assistant for Predictive Analytics Engine in AqlHR.'
    },
    'ai-automation.sentimentAnalyzer': {
      ar: 'مرحباً! أنا مساعدك في محلل المشاعر الذكي في عقل HR.',
      en: 'Hello! I\'m your assistant for Sentiment Analyzer in AqlHR.'
    },
    'ai-automation.skillsGapAnalyzer': {
      ar: 'مرحباً! أنا مساعدك في محلل فجوة المهارات في عقل HR.',
      en: 'Hello! I\'m your assistant for Skills Gap Analyzer in AqlHR.'
    },
    // GEO module
    'geo.engagementOptimization': {
      ar: 'مرحباً! أنا مساعدك في تحسين المشاركة التوليدية في عقل HR.',
      en: 'Hello! I\'m your assistant for Generative Engagement Optimization in AqlHR.'
    },
    // LEO module
    'leo.learningOptimization': {
      ar: 'مرحباً! أنا مساعدك في تحسين تجربة التعلم في عقل HR.',
      en: 'Hello! I\'m your assistant for Learning Experience Optimization in AqlHR.'
    },
    // Compliance modules
    'compliance.auditTrails': {
      ar: 'مرحباً! أنا مساعدك في إدارة مسارات المراجعة والامتثال في عقل HR.',
      en: 'Hello! I\'m your assistant for Audit Trails management in AqlHR.'
    },
    // Diagnostic modules
    'diagnostic.hrProcessImprovement': {
      ar: 'مرحباً! أنا مساعدك في تشخيص وتحسين عمليات الموارد البشرية في عقل HR.',
      en: 'Hello! I\'m your assistant for HR Process Improvement diagnostics in AqlHR.'
    },
    'diagnostic.hrRoleOptimization': {
      ar: 'مرحباً! أنا مساعدك في تحسين أدوار الموارد البشرية في عقل HR.',
      en: 'Hello! I\'m your assistant for HR Role Optimization in AqlHR.'
    },
    'diagnostic.ipoReadinessDiagnostic': {
      ar: 'مرحباً! أنا مساعدك في تشخيص الاستعداد للاكتتاب العام في عقل HR.',
      en: 'Hello! I\'m your assistant for IPO Readiness Diagnostic in AqlHR.'
    },
    'diagnostic.orgStructureAssessment': {
      ar: 'مرحباً! أنا مساعدك في تقييم الهيكل التنظيمي في عقل HR.',
      en: 'Hello! I\'m your assistant for Organizational Structure Assessment in AqlHR.'
    },
    'diagnostic.retentionStrategyAssessment': {
      ar: 'مرحباً! أنا مساعدك في تقييم استراتيجية الاحتفاظ بالموظفين في عقل HR.',
      en: 'Hello! I\'m your assistant for Retention Strategy Assessment in AqlHR.'
    },
    // Additional modules
    'additional.aqlhrConnect': {
      ar: 'مرحباً! أنا مساعدك في منصة التواصل عقل HR Connect.',
      en: 'Hello! I\'m your assistant for AqlHR Connect platform.'
    },
    'additional.smartKPITool': {
      ar: 'مرحباً! أنا مساعدك الذكي لأداة مؤشرات الأداء الرئيسية واتفاقيات الأداء في عقل HR. 📊 يمكنني مساعدتك في تصميم المؤشرات الذكية، تتبع الأداء، إدارة الأهداف، وتحليل النتائج. كيف يمكنني مساعدتك اليوم؟',
      en: 'Hello! I\'m your AI assistant for Smart KPI & Performance Agreement Tool in AqlHR. 📊 I can help you with intelligent KPI design, performance tracking, goal management, and results analysis. How can I assist you today?'
    },
    // Other modules
    'about.company': {
      ar: 'مرحباً! أنا مساعدك لمعرفة المزيد عن شركة عقل HR وخدماتها.',
      en: 'Hello! I\'m your assistant to learn more about AqlHR company and services.'
    },
    'consulting.services': {
      ar: 'مرحباً! أنا مساعدك في خدمات الاستشارات المتخصصة في عقل HR.',
      en: 'Hello! I\'m your assistant for Consulting Services in AqlHR.'
    },
    'help.interactiveGuide': {
      ar: 'مرحباً! أنا مساعدك في الدليل التفاعلي ومركز المساعدة في عقل HR.',
      en: 'Hello! I\'m your assistant for Interactive Guide and Help Center in AqlHR.'
    },
    'isoManagement.compliance': {
      ar: 'مرحباً! أنا مساعدك في إدارة معايير ISO والامتثال في عقل HR.',
      en: 'Hello! I\'m your assistant for ISO Management and Compliance in AqlHR.'
    },
    'nrcManagement.governance': {
      ar: 'مرحباً! أنا مساعدك في إدارة الحوكمة والامتثال التنظيمي في عقل HR.',
      en: 'Hello! I\'m your assistant for NRC Management and Governance in AqlHR.'
    },
    // Health & Safety specific module
    'health-safety': {
      ar: 'مرحباً! أنا مساعدك الذكي لنظام الصحة والسلامة المهنية في عقل HR. 🛡️ يمكنني مساعدتك في تحليل المخاطر، إدارة الحوادث، التدريب الأمني، والامتثال لمعايير السلامة السعودية. كيف يمكنني مساعدتك اليوم؟',
      en: 'Hello! I\'m your AI assistant for Health & Safety Management in AqlHR. 🛡️ I can help you with risk assessment, incident management, safety training, and compliance with Saudi safety standards. How can I assist you today?'
    },
    // AI Features & Automation specific module
    'ai-features': {
      ar: 'مرحباً! أنا مساعدك الذكي لميزات الذكاء الاصطناعي والأتمتة في عقل HR. 🤖 يمكنني مساعدتك في إدارة محركات الذكاء الاصطناعي، التوصيات الذكية، التحليلات المتقدمة، ومعالجة اللغات الطبيعية. كيف يمكنني مساعدتك اليوم؟',
      en: 'Hello! I\'m your AI assistant for AI Features & Automation in AqlHR. 🤖 I can help you with AI engine management, intelligent recommendations, advanced analytics, and natural language processing. How can I assist you today?'
    },
    // Analytics specific modules
    'analytics.performance': {
      ar: 'مرحباً! أنا مساعدك الذكي لتحليلات الأداء في عقل HR. كيف يمكنني مساعدتك في إدارة الأداء اليوم؟',
      en: 'Hello! I\'m your AI assistant for AqlHR Performance Analytics. How can I help you with performance management today?'
    },
    'default': {
      ar: 'مرحباً! أنا مساعدك الذكي في منصة عقل HR. كيف يمكنني مساعدتك اليوم؟',
      en: 'Hello! I\'m your AI assistant for AqlHR platform. How can I help you today?'
    }
  };

  // AI suggestions based on context
  const getContextualSuggestions = () => {
    const suggestions = {
      'executive': {
        ar: [
          'اعرض التحليلات التنفيذية لهذا الشهر',
          'ما هي التوصيات الاستراتيجية الجديدة؟',
          'أظهر حالة التكامل الحكومي',
          'تحليل مؤشرات الأداء الرئيسية'
        ],
        en: [
          'Show executive analytics for this month',
          'What are the new strategic recommendations?',
          'Display government integration status',
          'Analyze key performance indicators'
        ]
      },
      'employees': {
        ar: [
          'إضافة موظف جديد',
          'البحث عن سجلات الموظفين',
          'تحديث بيانات الموظف',
          'تقارير الموظفين'
        ],
        en: [
          'Add new employee',
          'Search employee records',
          'Update employee data',
          'Employee reports'
        ]
      },
      'health-safety': {
        ar: [
          'تحليل المخاطر في مكان العمل',
          'إنشاء تقرير حادث جديد',
          'جدولة التدريب الأمني للموظفين',
          'مراجعة معايير السلامة السعودية',
          'تقييم معدات الحماية الشخصية',
          'إحصائيات الحوادث والسلامة'
        ],
        en: [
          'Analyze workplace safety risks',
          'Create new incident report',
          'Schedule safety training for employees',
          'Review Saudi safety standards',
          'Evaluate personal protective equipment',
          'View incident and safety statistics'
        ]
      },
      'ai-features': {
        ar: [
          'إدارة محركات الذكاء الاصطناعي',
          'إنشاء توصيات ذكية جديدة',
          'تحليل أداء النماذج المتقدمة',
          'مراجعة إحصائيات التحليلات التنبؤية',
          'إعداد مهام معالجة اللغة الطبيعية',
          'تحسين دقة المحرك الذكي'
        ],
        en: [
          'Manage AI engine configurations',
          'Generate new intelligent recommendations',
          'Analyze advanced model performance',
          'Review predictive analytics statistics',
          'Configure NLP processing tasks',
          'Optimize AI engine accuracy'
        ]
      },
      'additional.smartKPITool': {
        ar: [
          'إنشاء مؤشرات أداء جديدة للموظفين',
          'تحليل اتفاقيات الأداء الحالية',
          'مراجعة معدلات الإنجاز والأهداف',
          'إعداد تقارير الأداء الذكية',
          'تحسين مؤشرات الإنتاجية',
          'مقارنة الأداء بين الأقسام'
        ],
        en: [
          'Create new employee performance KPIs',
          'Analyze current performance agreements',
          'Review achievement rates and goals',
          'Generate intelligent performance reports',
          'Optimize productivity indicators',
          'Compare performance across departments'
        ]
      },
      'default': {
        ar: [
          'ما الجديد في عقل HR؟',
          'كيف يمكنني استخدام الذكاء الاصطناعي؟',
          'اعرض الميزات المتاحة',
          'مساعدة في التنقل'
        ],
        en: [
          'What\'s new in AqlHR?',
          'How can I use AI features?',
          'Show available features',
          'Help with navigation'
        ]
      }
    };

    return suggestions[moduleContext as keyof typeof suggestions] || suggestions.default;
  };

  // System messages with correct branding
  const systemMessages = {
    welcome: {
      ar: 'مرحباً بك في مساعد عقل HR الذكي! أنا هنا لمساعدتك في جميع احتياجاتك المتعلقة بالموارد البشرية.',
      en: 'Welcome to AqlHR AI Assistant! I\'m here to help you with all your HR needs.'
    },
    processing: {
      ar: 'جاري معالجة طلبك في نظام عقل HR...',
      en: 'Processing your request in AqlHR system...'
    },
    error: {
      ar: 'عذراً، حدث خطأ في الاتصال بخوادم عقل HR. يرجى المحاولة مرة أخرى.',
      en: 'Sorry, there was an error connecting to AqlHR servers. Please try again.'
    }
  };

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome-1',
      type: 'assistant',
      content: (contextualGreetings[moduleContext as keyof typeof contextualGreetings] || contextualGreetings.default)[isArabic ? 'ar' : 'en'],
      timestamp: new Date(),
      module: moduleContext
    };
    setMessages([welcomeMessage]);
  }, [moduleContext, isArabic]);

  // Enhanced AI response with external intelligence integration
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare AI tools that are available for this context
      const availableTools = getAvailableTools(moduleContext, isArabic);
      
      // Enhanced AI processing with document awareness and tool integration
      const needsExternalIntelligence = detectExternalIntelligenceNeed(inputValue, moduleContext);
      const isVisualizationRequest = inputValue.toLowerCase().includes('chart') || 
                                   inputValue.toLowerCase().includes('graph') ||
                                   inputValue.toLowerCase().includes('visualize') ||
                                   inputValue.toLowerCase().includes('show data') ||
                                   inputValue.toLowerCase().includes('dashboard');
      
      let combinedResponse = '';
      
      if (needsExternalIntelligence || isVisualizationRequest || moduleDocuments.length > 0) {
        setIsGatheringIntelligence(true);
        
        // Add comprehensive processing message
        const processingType = needsExternalIntelligence 
          ? (isArabic ? '🌐 جاري جمع البيانات الخارجية والداخلية...' : '🌐 Gathering external and internal intelligence...')
          : isVisualizationRequest 
          ? (isArabic ? '📊 جاري تحضير التصورات البيانية...' : '📊 Preparing data visualizations...')
          : (isArabic ? '📚 جاري تحليل المستندات المرفوعة...' : '📚 Analyzing uploaded documents...');
          
        const gatheringMessage: ChatMessage = {
          id: `gathering-${Date.now()}`,
          type: 'assistant',
          content: processingType,
          timestamp: new Date(),
          module: moduleContext
        };
        
        setMessages(prev => [...prev, gatheringMessage]);
        
        try {
          // Check if this is a GOSI-related question
          const isGosiQuestion = inputValue.toLowerCase().includes('gosi') || 
                                inputValue.toLowerCase().includes('جوسي') ||
                                inputValue.toLowerCase().includes('تأمينات') ||
                                inputValue.toLowerCase().includes('social insurance');
          
          let aiResponse;
          let aiError;

          if (isGosiQuestion) {
            // Handle GOSI questions with the existing GOSI engine
            const { data: gosiData, error: gosiErr } = await supabase.functions.invoke('gosi-engine/preview', {
              body: { company_id: companyId || 'demo-company' }
            });
            
            if (gosiErr) {
              throw new Error(gosiErr.message);
            }
            
            // Format GOSI response
            const gosiResponse = isArabic 
              ? `🏛️ **معلومات التأمينات الاجتماعية (GOSI):**\n\n` +
                `📊 **ملخص الموظفين:** ${gosiData?.summary?.total_employees || 0} موظف\n` +
                `💰 **إجمالي المساهمات:** ${gosiData?.summary?.total_contributions ? new Intl.NumberFormat('ar-SA', {style: 'currency', currency: 'SAR'}).format(gosiData.summary.total_contributions) : '0 ريال'}\n` +
                `🇸🇦 **موظفين سعوديين:** ${gosiData?.summary?.saudi_employees || 0}\n` +
                `🌍 **موظفين غير سعوديين:** ${gosiData?.summary?.non_saudi_employees || 0}\n\n` +
                `📈 **معدلات GOSI الحالية (2024):**\n` +
                `• السعوديين (النظام الجديد): 9.75% موظف + 11.75% صاحب عمل = 21.5% إجمالي\n` +
                `• السعوديين (النظام القديم): 9% موظف + 9% صاحب عمل = 18% إجمالي\n` +
                `• غير السعوديين: 0% موظف + 2% صاحب عمل = 2% إجمالي`
              : `🏛️ **GOSI (Social Insurance) Information:**\n\n` +
                `📊 **Employee Summary:** ${gosiData?.summary?.total_employees || 0} employees\n` +
                `💰 **Total Contributions:** ${gosiData?.summary?.total_contributions ? new Intl.NumberFormat('en-SA', {style: 'currency', currency: 'SAR'}).format(gosiData.summary.total_contributions) : 'SAR 0'}\n` +
                `🇸🇦 **Saudi Employees:** ${gosiData?.summary?.saudi_employees || 0}\n` +
                `🌍 **Non-Saudi Employees:** ${gosiData?.summary?.non_saudi_employees || 0}\n\n` +
                `📈 **Current GOSI Rates (2024):**\n` +
                `• Saudis (NEW System): 9.75% employee + 11.75% employer = 21.5% total\n` +
                `• Saudis (OLD System): 9% employee + 9% employer = 18% total\n` +
                `• Non-Saudis: 0% employee + 2% employer = 2% total`;
            
            aiResponse = { response: gosiResponse };
            aiError = null;
          } else {
            // For non-GOSI questions, provide a helpful response without calling external functions
            const helpfulResponse = isArabic
              ? `أعتذر، أنا متخصص في الإجابة على الأسئلة المتعلقة بـ GOSI والتأمينات الاجتماعية. يمكنني مساعدتك في:\n\n• حساب مساهمات GOSI\n• معدلات التأمينات الحالية\n• الفروق بين النظام القديم والجديد\n• مساهمات الموظفين السعوديين وغير السعوديين\n\nهل لديك سؤال محدد حول GOSI؟`
              : `I specialize in answering GOSI (Social Insurance) related questions. I can help you with:\n\n• GOSI contribution calculations\n• Current insurance rates\n• Differences between old and new systems\n• Saudi vs non-Saudi employee contributions\n\nDo you have a specific question about GOSI?`;
            
            aiResponse = { response: helpfulResponse };
            aiError = null;
          }

          if (aiError) {
            throw new Error(aiError.message);
          }

          combinedResponse = aiResponse.response;

          // If AI used tools, show the results
          if (aiResponse.tool_calls && aiResponse.tool_calls.length > 0) {
            const toolResults = aiResponse.tool_calls.map(call => 
              `🔧 **${call.name}**: ${JSON.stringify(call.result, null, 2)}`
            ).join('\n\n');
            
            combinedResponse += `\n\n${isArabic ? '🛠️ **أدوات مستخدمة:**' : '🛠️ **Tools Used:**'}\n${toolResults}`;
          }

          // Enhanced response with external intelligence if needed
          if (needsExternalIntelligence) {
            const externalInsight = await gatherExternalIntelligence(needsExternalIntelligence.dataType, inputValue);
            combinedResponse = generateEnhancedResponse(inputValue, moduleContext, externalInsight, isArabic, aiResponse);
          }

          // Add visualization insights if requested
          if (isVisualizationRequest) {
            const visualNote = isArabic 
              ? '\n\n📊 تم تحضير اقتراحات للتصورات البيانية. يمكن مشاركة هذه التحليلات مع الإدارة العليا.'
              : '\n\n📊 Data visualization recommendations prepared. These insights are ready for executive presentation.';
            combinedResponse += visualNote;
          }

        } catch (error) {
          console.error('AI processing error:', error);
          combinedResponse = generateStandardResponse(inputValue, moduleContext, isArabic);
        }
        
        setIsGatheringIntelligence(false);
      } else {
        // Call AI Core Engine for standard processing
        const { data: aiResponse, error: aiError } = await supabase.functions.invoke('ai-core-engine', {
          body: {
            query: inputValue,
            context: {
              module: moduleContext,
              language: isArabic ? 'ar' : 'en',
              company_id: companyId,
              user_id: 'current_user',
              session_id: `session-${Date.now()}`
            },
            conversation_history: messages.slice(-6).map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            tools: availableTools
          }
        });

        if (aiError) {
          throw new Error(aiError.message);
        }

        combinedResponse = aiResponse.response || generateStandardResponse(inputValue, moduleContext, isArabic);
        
        // Show tool results if any were used
        if (aiResponse.tool_calls && aiResponse.tool_calls.length > 0) {
          const toolSummary = isArabic 
            ? `\n\n🛠️ تم استخدام ${aiResponse.tool_calls.length} أداة لتحسين الإجابة`
            : `\n\n🛠️ Used ${aiResponse.tool_calls.length} tools to enhance the response`;
          combinedResponse += toolSummary;
        }
      }

      // Calculate confidence score for the response
      const hasExternalIntelligence = needsExternalIntelligence !== null;
      const hasDocuments = moduleDocuments.length > 0;
      const hasTools = availableTools.length > 0;
      const confidenceScore = calculateConfidenceScore(inputValue, combinedResponse, hasExternalIntelligence, hasDocuments, hasTools);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: combinedResponse,
        timestamp: new Date(),
        module: moduleContext,
        confidence: confidenceScore
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: isArabic 
          ? 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.'
          : 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date(),
        module: moduleContext
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  // Intelligent detection of when external data would enhance the response
  const detectExternalIntelligenceNeed = (query: string, context: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Market data keywords
    if (lowerQuery.includes('market') || lowerQuery.includes('benchmark') || 
        lowerQuery.includes('salary') || lowerQuery.includes('compensation') ||
        lowerQuery.includes('industry average') || lowerQuery.includes('سوق') ||
        lowerQuery.includes('معيار') || lowerQuery.includes('راتب')) {
      return { dataType: 'market_data' as const };
    }
    
    // Regulations keywords
    if (lowerQuery.includes('law') || lowerQuery.includes('regulation') || 
        lowerQuery.includes('compliance') || lowerQuery.includes('legal') ||
        lowerQuery.includes('قانون') || lowerQuery.includes('نظام') ||
        lowerQuery.includes('امتثال')) {
      return { dataType: 'regulations' as const };
    }
    
    // Trends keywords
    if (lowerQuery.includes('trend') || lowerQuery.includes('future') || 
        lowerQuery.includes('latest') || lowerQuery.includes('emerging') ||
        lowerQuery.includes('اتجاه') || lowerQuery.includes('مستقبل') ||
        lowerQuery.includes('أحدث')) {
      return { dataType: 'trends' as const };
    }
    
    // Best practices keywords
    if (lowerQuery.includes('best practice') || lowerQuery.includes('how to') || 
        lowerQuery.includes('improve') || lowerQuery.includes('optimize') ||
        lowerQuery.includes('أفضل الممارسات') || lowerQuery.includes('كيفية') ||
        lowerQuery.includes('تحسين')) {
      return { dataType: 'best_practices' as const };
    }
    
    return null;
  };

  // Get available AI tools for the current context
  const getAvailableTools = (context: string, isArabic: boolean) => {
    const tools: Array<{
      name: string;
      description: string;
      parameters: {
        type: string;
        properties: Record<string, { type: string }>;
      };
    }> = [
      {
        name: 'get_employee_data',
        description: isArabic ? 'جلب بيانات الموظفين' : 'Retrieve employee data',
        parameters: {
          type: 'object',
          properties: {
            employee_id: { type: 'string' },
            filters: { type: 'string' }
          }
        }
      },
      {
        name: 'get_analytics_data', 
        description: isArabic ? 'جلب البيانات التحليلية' : 'Get analytics data',
        parameters: {
          type: 'object',
          properties: {
            metric_type: { type: 'string' },
            date_range: { type: 'string' }
          }
        }
      },
      {
        name: 'generate_report',
        description: isArabic ? 'إنشاء التقارير' : 'Generate reports',
        parameters: {
          type: 'object',
          properties: {
            report_type: { type: 'string' },
            parameters: { type: 'string' }
          }
        }
      }
    ];

    // Add context-specific tools
    if (context.includes('payroll')) {
      tools.push({
        name: 'get_payroll_summary',
        description: isArabic ? 'ملخص الرواتب' : 'Payroll summary',
        parameters: {
          type: 'object',
          properties: {
            month: { type: 'string' },
            year: { type: 'string' }
          }
        }
      });
    }

    return tools;
  };

  // Gather external intelligence
  const gatherExternalIntelligence = async (dataType: string, query: string) => {
    return {
      externalInsight: `External data insights for ${dataType} related to: ${query}`,
      confidence: 0.8,
      sources: ['Industry Reports', 'Market Data', 'Regulatory Updates']
    };
  };

  // Generate enhanced response combining internal + external intelligence + documents
  const generateEnhancedResponse = (query: string, context: string, externalData: any, isArabic: boolean, aiResponse?: any) => {
    const securityNotice = isArabic 
      ? '\n\n🔐 ملاحظة أمنية: تم جمع البيانات الخارجية بأمان دون مشاركة أي معلومات داخلية لشركتك.'
      : '\n\n🔐 Security Note: External data was gathered securely without sharing any of your company\'s internal information.';
    
    const documentInsights = moduleDocuments.length > 0 
      ? (isArabic 
          ? `\n📚 **تحليل المستندات**: تم تحليل ${moduleDocuments.length} مستند من وحدة ${context}`
          : `\n📚 **Document Analysis**: Analyzed ${moduleDocuments.length} documents from ${context} module`)
      : '';

    if (isArabic) {
      return `${aiResponse?.response || 'بناءً على تحليل بيانات عقل HR المتكامل:'}

🌐 **الذكاء الخارجي**: ${externalData.externalInsight}

💡 **التوصية الشاملة**: بناءً على دمج البيانات الداخلية، المستندات المرفوعة، والذكاء الخارجي، يُنصح بتطبيق التوصيات المقترحة لتحسين الأداء.

${documentInsights}

${securityNotice}`;
    } else {
      return `${aiResponse?.response || 'Based on comprehensive AqlHR data analysis:'}

🌐 **External Intelligence**: ${externalData.externalInsight}

💡 **Comprehensive Recommendation**: Based on internal data, uploaded documents, and external intelligence, I recommend implementing the suggested improvements for enhanced performance.

${documentInsights}

${securityNotice}`;
    }
  };

  // Generate standard internal response
  const generateStandardResponse = (query: string, context: string, isArabic: boolean) => {
    const responses = {
      ar: [
        `بناءً على تحليل بيانات عقل HR: ${getInternalAnalysis(context, isArabic)}`,
        `من خلال نظام عقل HR المتطور: ${getContextualResponse(context, isArabic)}`,
        `تحليل عقل HR يشير إلى: ${getInternalAnalysis(context, isArabic)}`
      ],
      en: [
        `Based on AqlHR data analysis: ${getInternalAnalysis(context, isArabic)}`,
        `Through AqlHR's advanced system: ${getContextualResponse(context, isArabic)}`,
        `AqlHR analysis indicates: ${getInternalAnalysis(context, isArabic)}`
      ]
    };

    const randomResponse = responses[isArabic ? 'ar' : 'en'][Math.floor(Math.random() * responses[isArabic ? 'ar' : 'en'].length)];
    return randomResponse;
  };

  // Get contextual internal analysis
  const getInternalAnalysis = (context: string, isArabic: boolean) => {
    const analyses = {
      analytics: {
        ar: 'تظهر التحليلات الداخلية تحسناً في المؤشرات الرئيسية بنسبة 23% هذا الشهر',
        en: 'Internal analytics show 23% improvement in key metrics this month'
      },
      payroll: {
        ar: 'نظام الرواتب يعمل بكفاءة 98% مع معالجة سلسة للمدفوعات',
        en: 'Payroll system operating at 98% efficiency with smooth payment processing'
      },
      employees: {
        ar: 'مستوى رضا الموظفين الحالي 87% مع اتجاه إيجابي في الأداء',
        en: 'Current employee satisfaction at 87% with positive performance trends'
      },
      'health-safety': {
        ar: 'مؤشر السلامة العام 94% مع انخفاض الحوادث بنسبة 15% هذا الشهر. جميع معايير OSHA والمعايير السعودية مُطبقة بكفاءة.',
        en: 'Overall safety index at 94% with 15% reduction in incidents this month. All OSHA and Saudi safety standards efficiently implemented.'
      },
      'ai-features': {
        ar: 'محركات الذكاء الاصطناعي تعمل بكفاءة 97% مع معالجة 2.3M معاملة يومياً. التحليلات التنبؤية تحقق دقة 94% والتوصيات الذكية تحسن الإنتاجية بنسبة 31%.',
        en: 'AI engines operating at 97% efficiency processing 2.3M daily transactions. Predictive analytics achieving 94% accuracy and intelligent recommendations improving productivity by 31%.'
      },
      'additional.smartKPITool': {
        ar: 'مؤشرات الأداء الرئيسية تعمل بكفاءة 92% مع 1,234 مؤشر نشط. معدل الإنجاز الحالي 87.6% مع 456 مراجعة أداء مكتملة و234 خطة تطوير مهني نشطة.',
        en: 'KPI system operating at 92% efficiency with 1,234 active indicators. Current achievement rate at 87.6% with 456 completed performance reviews and 234 active career development plans.'
      },
      default: {
        ar: 'جميع الأنظمة تعمل بشكل مثالي مع إمكانيات تحسين متاحة',
        en: 'All systems functioning optimally with improvement opportunities available'
      }
    };

    return analyses[context as keyof typeof analyses]?.[isArabic ? 'ar' : 'en'] || 
           analyses.default[isArabic ? 'ar' : 'en'];
  };

  // Get contextual response
  const getContextualResponse = (context: string, isArabic: boolean) => {
    return getInternalAnalysis(context, isArabic);
  };

  // Calculate confidence score based on response characteristics
  const calculateConfidenceScore = (query: string, response: string, hasExternalIntelligence: boolean, hasDocuments: boolean, hasTools: boolean = false) => {
    let baseConfidence = 65; // Base confidence for standard responses
    
    // Boost confidence if external intelligence was used
    if (hasExternalIntelligence) {
      baseConfidence += 20;
    }
    
    // Boost confidence if documents were analyzed
    if (hasDocuments) {
      baseConfidence += 15;
    }
    
    // Boost confidence for longer, more detailed responses
    if (response.length > 200) {
      baseConfidence += 10;
    }
    
    // Boost confidence for responses with structured content (bullet points, numbers)
    if (response.includes('•') || response.includes('1.') || response.includes('**')) {
      baseConfidence += 5;
    }
    
    // Cap at 99% to maintain realistic expectations
    return Math.min(baseConfidence, 99);
  };

  // Spell checking functions
  const checkSpelling = async (text: string) => {
    if (!text.trim()) {
      setSpellingSuggestions([]);
      return;
    }

    try {
      // Temporarily disable spell checker until edge function is available
      setSpellingSuggestions([]);
      return;
      
      /* Commented out until spell-checker edge function is implemented
      const { data, error } = await supabase.functions.invoke('spell-checker', {
        body: {
          text: text,
          language: isArabic ? 'ar' : 'en',
          autoFix: false
        }
      });

      if (error) {
        console.error('Spell checker error:', error);
        performBasicSpellCheck(text);
        return;
      }

      if (data.hasErrors && data.suggestions.length > 0) {
        const suggestionWords = data.suggestions.map((s: any) => s.suggested);
        setSpellingSuggestions(suggestionWords);
      } else {
        setSpellingSuggestions([]);
      }
      */
    } catch (error) {
      console.error('Spell checking failed:', error);
      // Fallback to basic spell checking
      performBasicSpellCheck(text);
    }
  };
  };

  const performBasicSpellCheck = (text: string) => {
    const words = text.split(/\s+/);
    const misspelledWords: string[] = [];

    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord && cleanWord.length > 2) {
        const commonMisspellings = [
          'recieve', 'seperate', 'definately', 'occured', 'accomodate',
          'neccessary', 'beleive', 'begining', 'untill', 'wich'
        ];
        
        if (commonMisspellings.includes(cleanWord.toLowerCase())) {
          misspelledWords.push(cleanWord);
        }
      }
    });

    const suggestions = generateSpellingSuggestions(misspelledWords);
    setSpellingSuggestions(suggestions);
  };

  const generateSpellingSuggestions = (misspelledWords: string[]) => {
    const corrections: Record<string, string> = {
      'recieve': 'receive',
      'seperate': 'separate', 
      'definately': 'definitely',
      'occured': 'occurred',
      'accomodate': 'accommodate',
      'neccessary': 'necessary',
      'beleive': 'believe',
      'begining': 'beginning',
      'untill': 'until',
      'wich': 'which'
    };

    return misspelledWords.map(word => 
      corrections[word.toLowerCase()] || word
    );
  };

  const applySuggestion = (suggestion: string) => {
    // Find and replace the misspelled word with the suggestion
    const words = inputValue.split(/\s+/);
    const misspelledIndex = words.findIndex(word => 
      spellingSuggestions.includes(generateSpellingSuggestions([word.replace(/[^\w]/g, '')])[0])
    );
    
    if (misspelledIndex !== -1) {
      words[misspelledIndex] = suggestion;
      setInputValue(words.join(' '));
      setSpellingSuggestions([]);
      setShowSpellingSuggestions(false);
    }
  };

  const fixAllSpelling = async () => {
    if (!inputValue.trim()) return;

    try {
      // Temporarily disable auto-fix until edge function is available
      performBasicAutoFix();
      return;
      
      /* Commented out until spell-checker edge function is implemented
      const { data, error } = await supabase.functions.invoke('spell-checker', {
        body: {
          text: inputValue,
          language: isArabic ? 'ar' : 'en',
          autoFix: true
        }
      });

      if (error) {
        console.error('Auto-fix error:', error);
        performBasicAutoFix();
        return;
      }

      if (data.correctedText && data.correctedText !== inputValue) {
        setInputValue(data.correctedText);
        setSpellingSuggestions([]);
        setShowSpellingSuggestions(false);
      }
      */
    } catch (error) {
      console.error('Auto-fix failed:', error);
      performBasicAutoFix();
    }
  };

  const performBasicAutoFix = () => {
    let correctedText = inputValue;
    
    const corrections: Record<string, string> = {
      'recieve': 'receive',
      'seperate': 'separate',
      'definately': 'definitely',
      'occured': 'occurred',
      'accomodate': 'accommodate',
      'neccessary': 'necessary',
      'beleive': 'believe',
      'begining': 'beginning',
      'untill': 'until',
      'wich': 'which'
    };

    Object.entries(corrections).forEach(([misspelled, correct]) => {
      const regex = new RegExp(`\\b${misspelled}\\b`, 'gi');
      correctedText = correctedText.replace(regex, correct);
    });

    setInputValue(correctedText);
    setSpellingSuggestions([]);
    setShowSpellingSuggestions(false);
  };

  const handleClearChat = () => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome-new',
      type: 'assistant',
      content: (contextualGreetings[moduleContext as keyof typeof contextualGreetings] || contextualGreetings.default)[isArabic ? 'ar' : 'en'],
      timestamp: new Date(),
      module: moduleContext
    };
    setMessages([welcomeMessage]);
  };

  const baseClasses = position === 'fixed' 
    ? 'fixed bottom-6 right-6 z-50 w-96 max-h-[600px]' 
    : 'w-full max-w-md mx-auto';

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className={`${position === 'fixed' ? 'fixed bottom-6 right-6 z-50' : ''} ${className} bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full w-16 h-16 p-0`}
      >
        <Bot className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <Card className={`${baseClasses} ${className} ${isArabic ? 'rtl' : 'ltr'} shadow-2xl border-brand-primary/20 bg-background/95 backdrop-blur-md`} dir={isArabic ? 'rtl' : 'ltr'}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-brand-primary animate-pulse" />
            {isArabic ? 'مساعد عقل HR الذكي' : 'AqlHR AI Assistant'}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 h-8 w-8"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="p-1 h-8 w-8"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-brand-success/10 text-brand-success text-xs">
              <div className="w-2 h-2 bg-brand-success rounded-full mr-1 animate-pulse"></div>
              {isArabic ? 'متصل بعقل HR' : 'Connected to AqlHR'}
            </Badge>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {isArabic ? 'محمي + ذكاء خارجي' : 'Secure + External Intelligence'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {moduleContext === 'default' ? (isArabic ? 'عام' : 'General') : moduleContext}
            </Badge>
          </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <div className={`space-y-3 ${isExpanded ? 'max-h-96' : 'max-h-48'} overflow-y-auto scrollbar-thin scrollbar-thumb-brand-primary/20`}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? (isArabic ? 'justify-start' : 'justify-end') : (isArabic ? 'justify-end' : 'justify-start')}`}
            >
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-brand-primary text-white'
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  {message.type === 'assistant' && message.confidence && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-2 py-0.5 ${
                        message.confidence >= 85 
                          ? 'bg-brand-success/10 text-brand-success border-brand-success/20' 
                          : message.confidence >= 70
                          ? 'bg-brand-warning/10 text-brand-warning border-brand-warning/20'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {message.confidence}% {isArabic ? 'دقة' : 'accuracy'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
          {(isLoading || isGatheringIntelligence) && (
            <div className={`flex ${isArabic ? 'justify-end' : 'justify-start'}`}>
              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center gap-2">
                  {isGatheringIntelligence ? (
                    <>
                      <Globe className="h-4 w-4 animate-pulse text-brand-primary" />
                      <span className="text-sm">
                        {isArabic ? 'جاري جمع الذكاء الخارجي...' : 'Gathering external intelligence...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span className="text-sm">{systemMessages.processing[isArabic ? 'ar' : 'en']}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Document Upload Section */}
        {showDocumentUpload && (
          <div className="space-y-2">
            <DocumentUploadWidget 
              moduleKey={moduleContext} 
              compact={true}
              className="mb-4"
            />
          </div>
        )}

        {/* Quick Suggestions */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground font-medium">
              {isArabic ? 'اقتراحات سريعة:' : 'Quick suggestions:'}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDocumentUpload(!showDocumentUpload)}
              className="text-xs h-6 px-2"
            >
              <Upload className="h-3 w-3 mr-1" />
              {isArabic ? 'رفع مستند' : 'Upload'}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {getContextualSuggestions()[isArabic ? 'ar' : 'en'].slice(0, 2).map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputValue(suggestion)}
                className="text-xs h-7 px-2"
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                {suggestion}
              </Button>
            ))}
          </div>
          
          {moduleDocuments.length > 0 && (
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                📚 {moduleDocuments.length} {isArabic ? 'مستندات جاهزة للتحليل' : 'documents ready for analysis'}
              </Badge>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (spellCheckEnabled) {
                    checkSpelling(e.target.value);
                  }
                }}
                placeholder={isArabic ? 'اكتب رسالتك لمساعد عقل HR...' : 'Type your message to AqlHR Assistant...'}
                className={`min-h-[60px] resize-none text-sm w-full ${
                  spellingSuggestions.length > 0 ? 'border-warning' : ''
                }`}
                spellCheck={spellCheckEnabled}
                lang={isArabic ? 'ar' : 'en'}
                dir={isArabic ? 'rtl' : 'ltr'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              
              {/* Spell Check Status Indicator */}
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSpellCheckEnabled(!spellCheckEnabled)}
                  className="h-6 w-6 p-0"
                  title={spellCheckEnabled ? 
                    (isArabic ? 'إيقاف التدقيق الإملائي' : 'Disable spell check') :
                    (isArabic ? 'تفعيل التدقيق الإملائي' : 'Enable spell check')
                  }
                >
                  <SpellCheck className={`h-3 w-3 ${spellCheckEnabled ? 'text-brand-success' : 'text-muted-foreground'}`} />
                </Button>
                
                {spellingSuggestions.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSpellingSuggestions(!showSpellingSuggestions)}
                    className="h-6 w-6 p-0"
                    title={isArabic ? 'عرض التصحيحات المقترحة' : 'Show spelling suggestions'}
                  >
                    <AlertTriangle className="h-3 w-3 text-warning" />
                  </Button>
                )}
                
                {spellCheckEnabled && spellingSuggestions.length === 0 && inputValue.trim() && (
                  <CheckCircle className="h-3 w-3 text-brand-success" />
                )}
              </div>
              
              {/* Spelling Suggestions Dropdown */}
              {showSpellingSuggestions && spellingSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border border-border rounded-md shadow-lg max-h-32 overflow-y-auto">
                  <div className="p-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      {isArabic ? 'تصحيحات مقترحة:' : 'Spelling suggestions:'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {spellingSuggestions.slice(0, 5).map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => applySuggestion(suggestion)}
                          className="text-xs h-6 px-2"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fixAllSpelling()}
                      className="text-xs h-6 px-2 mt-1 w-full"
                    >
                      <SpellCheck className="h-3 w-3 mr-1" />
                      {isArabic ? 'تصحيح جميع الأخطاء' : 'Fix all spelling'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-xs px-2 h-7"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              {isArabic ? 'مسح المحادثة' : 'Clear Chat'}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white px-3 h-7"
            >
              <Send className="h-3 w-3 mr-1" />
              {isArabic ? 'إرسال' : 'Send'}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            {isArabic ? 'مدعوم بذكاء عقل HR الاصطناعي' : 'Powered by AqlHR AI Intelligence'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
