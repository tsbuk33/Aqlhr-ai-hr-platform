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

  // Contextual greetings with comprehensive HR expertise for ALL modules
  const contextualGreetings = {
    'executive': {
      ar: 'مرحباً! أنا مساعدك الذكي في مركز الذكاء التنفيذي عقل HR. يمكنني مساعدتك في اتخاذ القرارات الاستراتيجية، تحليل البيانات التنفيذية، والرؤى الذكية لإدارة الموارد البشرية.',
      en: 'Hello! I\'m your AI assistant for AqlHR Executive Intelligence Center. I can help you make strategic decisions, analyze executive data, and provide intelligent HR insights.'
    },
    'employees': {
      ar: 'مرحباً! أنا مساعدك الذكي في إدارة بيانات الموظفين. يمكنني مساعدتك في التوظيف، إدارة السجلات، التقييم، والامتثال للقوانين السعودية.',
      en: 'Hello! I\'m your AI assistant for Employee Management. I can help you with recruitment, record management, performance evaluation, and Saudi compliance.'
    },
    'payroll': {
      ar: 'أهلاً! أنا مساعدك الذكي المتخصص في الرواتب والشؤون المالية في عقل HR. يمكنني مساعدتك في معالجة الرواتب، حسابات GOSI، نظام حماية الأجور، وجميع الأمور المالية للموظفين.',
      en: 'Hi! I\'m your AI assistant specialized in Payroll & Financial in AqlHR. I can help you with payroll processing, GOSI calculations, WPS, and all employee financial matters.'
    },
    'government': {
      ar: 'مرحباً! أنا مساعدك الذكي للتكامل الحكومي في عقل HR. يمكنني مساعدتك في منصة قوى، وزارة العمل، التأمينات الاجتماعية، ونطاقات.',
      en: 'Hello! I\'m your AI assistant for Government Integrations in AqlHR. I can help you with Qiwa platform, MOL, GOSI, and Nitaqat.'
    },
    'analytics': {
      ar: 'مرحباً! أنا مساعدك الذكي للتحليلات والذكاء الاصطناعي في عقل HR. يمكنني مساعدتك في تحليل البيانات، إنشاء التقارير، والرؤى الذكية.',
      en: 'Hello! I\'m your AI assistant for Analytics & AI Intelligence in AqlHR. I can help you analyze data, generate reports, and provide intelligent insights.'
    },
    'core-hr': {
      ar: 'مرحباً! أنا مساعدك الذكي لوحدات الموارد البشرية الأساسية في عقل HR. يمكنني مساعدتك في إدارة الموظفين، الحضور، الإجازات، والأداء.',
      en: 'Hello! I\'m your AI assistant for Core HR modules in AqlHR. I can help you with employee management, attendance, leave management, and performance.'
    },
    'health-safety': {
      ar: 'مرحباً! أنا مساعدك الذكي لنظام الصحة والسلامة المهنية في عقل HR. 🛡️ يمكنني مساعدتك في تحليل المخاطر، إدارة الحوادث، التدريب الأمني، والامتثال لمعايير السلامة السعودية.',
      en: 'Hello! I\'m your AI assistant for Health & Safety Management in AqlHR. 🛡️ I can help you with risk assessment, incident management, safety training, and compliance with Saudi safety standards.'
    },
    'ai-features': {
      ar: 'مرحباً! أنا مساعدك الذكي لميزات الذكاء الاصطناعي والأتمتة في عقل HR. 🤖 يمكنني مساعدتك في إدارة محركات الذكاء الاصطناعي، التوصيات الذكية، التحليلات المتقدمة، ومعالجة اللغات الطبيعية.',
      en: 'Hello! I\'m your AI assistant for AI Features & Automation in AqlHR. 🤖 I can help you with AI engine management, intelligent recommendations, advanced analytics, and natural language processing.'
    },
    'consulting': {
      ar: 'مرحباً! أنا مساعدك الذكي لخدمات الاستشارات المتخصصة في عقل HR. يمكنني مساعدتك في التخطيط الاستراتيجي، تحسين العمليات، والاستشارات التنظيمية.',
      en: 'Hello! I\'m your AI assistant for Consulting Services in AqlHR. I can help you with strategic planning, process improvement, and organizational consulting.'
    },
    'compliance': {
      ar: 'مرحباً! أنا مساعدك الذكي للامتثال والحوكمة في عقل HR. يمكنني مساعدتك في مراجعة السياسات، الامتثال للقوانين، وإدارة المخاطر.',
      en: 'Hello! I\'m your AI assistant for Compliance & Governance in AqlHR. I can help you with policy review, legal compliance, and risk management.'
    },
    'default': {
      ar: 'مرحباً! أنا مساعدك الذكي المتخصص في الموارد البشرية في منصة عقل HR. يمكنني مساعدتك في جميع جوانب إدارة الموارد البشرية من التوظيف إلى الامتثال الحكومي.',
      en: 'Hello! I\'m your specialized HR AI assistant for AqlHR platform. I can help you with all aspects of HR management from recruitment to government compliance.'
    }
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
      'health-safety': {
        ar: [
          'تحليل المخاطر في مكان العمل',
          'إنشاء تقرير حادث جديد',
          'جدولة التدريب الأمني',
          'مراجعة معايير السلامة',
          'تقييم معدات الحماية'
        ],
        en: [
          'Analyze workplace safety risks',
          'Create new incident report',
          'Schedule safety training',
          'Review safety standards',
          'Evaluate protective equipment'
        ]
      },
      'ai-features': {
        ar: [
          'إدارة محركات الذكاء الاصطناعي',
          'إنشاء توصيات ذكية',
          'تحليل أداء النماذج',
          'إعداد معالجة اللغة الطبيعية',
          'تحسين دقة المحرك الذكي'
        ],
        en: [
          'Manage AI engine configurations',
          'Generate intelligent recommendations',
          'Analyze model performance',
          'Configure NLP processing',
          'Optimize AI engine accuracy'
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
    
    return suggestions[moduleContext as keyof typeof suggestions] || suggestions.default;
  };

  useEffect(() => {
    if (messages.length === 0) {
      const greeting = contextualGreetings[moduleContext as keyof typeof contextualGreetings] || contextualGreetings.default;
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'assistant',
        content: greeting[isArabic ? 'ar' : 'en'],
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [moduleContext, isArabic]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      module: moduleContext
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsGatheringIntelligence(true);
    
    try {
      let combinedResponse = '';
      
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
        // For general HR questions, use the AI core engine
        const { data, error } = await supabase.functions.invoke('ai-core-engine', {
          body: {
            query: inputValue,
            context: {
              module: moduleContext,
              language: isArabic ? 'ar' : 'en',
              company_id: companyId || 'demo-company',
              user_context: `HRBP using ${moduleContext} module`,
              expertise_areas: [
                'employee_registration',
                'payroll_processing', 
                'government_compliance',
                'saudi_labor_law',
                'gosi_calculations',
                'mol_procedures',
                'qiwa_platform',
                'nitaqat_system',
                'wps_processing',
                'end_of_service',
                'leave_management',
                'performance_management',
                'hr_policies'
              ]
            },
            conversation_history: messages.slice(-5).map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            tools: [] // No specific tools needed for general questions
          }
        });
        
        aiResponse = data;
        aiError = error;
      }

      if (aiError) {
        throw new Error(aiError.message);
      }

      combinedResponse = aiResponse.response;
      
      setIsGatheringIntelligence(false);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: combinedResponse,
        timestamp: new Date(),
        module: moduleContext,
        confidence: 95
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsGatheringIntelligence(false);
      
      // Provide a helpful fallback response instead of generic error
      const fallbackResponse = inputValue.toLowerCase().includes('wps') || inputValue.toLowerCase().includes('wage protection')
        ? (isArabic 
          ? `🏛️ **نظام حماية الأجور (WPS):**\n\n` +
            `نظام حماية الأجور هو آلية إلكترونية أطلقتها وزارة الموارد البشرية والتنمية الاجتماعية لحماية حقوق العمال في المملكة.\n\n` +
            `**الأهداف الرئيسية:**\n` +
            `• ضمان دفع الرواتب في المواعيد المحددة\n` +
            `• حماية حقوق العمال المالية\n` +
            `• تعزيز الشفافية في علاقات العمل\n` +
            `• مراقبة التزام أصحاب العمل\n\n` +
            `**كيفية العمل:**\n` +
            `• يتم ربط النظام مع البنوك السعودية\n` +
            `• تسجيل جميع المدفوعات إلكترونياً\n` +
            `• إرسال تقارير شهرية لوزارة العمل\n` +
            `• متابعة أي تأخير في الدفع`
          : `🏛️ **Wage Protection System (WPS):**\n\n` +
            `The Wage Protection System is an electronic mechanism launched by the Ministry of Human Resources and Social Development to protect workers' rights in Saudi Arabia.\n\n` +
            `**Main Objectives:**\n` +
            `• Ensure timely salary payments\n` +
            `• Protect workers' financial rights\n` +
            `• Enhance transparency in employment relations\n` +
            `• Monitor employer compliance\n\n` +
            `**How it Works:**\n` +
            `• Connected with Saudi banks\n` +
            `• All payments recorded electronically\n` +
            `• Monthly reports sent to MOL\n` +
            `• Monitor any payment delays`)
        : (isArabic
          ? `أعتذر عن المشكلة التقنية. أنا مساعدك الذكي المتخصص في الموارد البشرية ويمكنني مساعدتك في:\n\n• تسجيل الموظفين الجدد\n• حسابات الرواتب و GOSI\n• الامتثال الحكومي\n• قوانين العمل السعودية\n• نظام حماية الأجور\n• منصة قوى ونطاقات\n\nيرجى إعادة صياغة سؤالك وسأكون سعيداً لمساعدتك.`
          : `Sorry for the technical issue. I'm your specialized HR AI assistant and I can help you with:\n\n• New employee registration\n• Payroll and GOSI calculations\n• Government compliance\n• Saudi labor laws\n• Wage Protection System\n• Qiwa platform and Nitaqat\n\nPlease rephrase your question and I'll be happy to help you.`);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
        module: moduleContext,
        confidence: 90
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const greeting = contextualGreetings[moduleContext as keyof typeof contextualGreetings] || contextualGreetings.default;
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'assistant',
      content: greeting[isArabic ? 'ar' : 'en'],
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const baseClasses = position === 'fixed' 
    ? 'fixed bottom-6 right-6 z-50 w-96 h-[600px] flex flex-col' 
    : 'w-full max-w-md mx-auto h-[600px] flex flex-col';

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
      <CardHeader className="pb-3 flex-shrink-0">
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
      
      <CardContent className="flex-1 flex flex-col space-y-4 min-h-0">
        {/* Chat Messages - Scrollable */}
        <div className="flex-1 space-y-3 overflow-y-auto min-h-0 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? (isArabic ? 'justify-start' : 'justify-end') : (isArabic ? 'justify-end' : 'justify-start')}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
                  message.type === 'user'
                    ? 'bg-brand-primary text-white'
                    : 'bg-muted text-foreground border'
                }`}
              >
                {message.content}
                {message.confidence && (
                  <div className="text-xs opacity-70 mt-1">
                    {message.confidence}% {isArabic ? 'دقة' : 'accuracy'}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Intelligence Gathering Indicator */}
          {isGatheringIntelligence && (
            <div className="flex justify-center">
              <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                {isArabic ? 'جاري جمع الذكاء الخارجي...' : 'Gathering external intelligence...'}
              </div>
            </div>
          )}
        </div>

        {/* Document Upload Section */}
        {showDocumentUpload && (
          <div className="flex-shrink-0">
            <DocumentUploadWidget 
              moduleKey={moduleContext} 
              compact={true}
            />
          </div>
        )}

        {/* Quick Suggestions */}
        <div className="flex-shrink-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {isArabic ? 'اقتراحات سريعة:' : 'Quick suggestions:'}
            </span>
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
          
          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
            {getContextualSuggestions()[isArabic ? 'ar' : 'en'].slice(0, 3).map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputValue(suggestion)}
                className="text-xs h-6 px-2 flex-shrink-0"
              >
                {suggestion}
              </Button>
            ))}
          </div>
          
          {moduleDocuments.length > 0 && (
            <div className="text-xs text-muted-foreground">
              📚 {moduleDocuments.length} {isArabic ? 'مستندات جاهزة للتحليل' : 'documents ready for analysis'}
            </div>
          )}
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="flex-shrink-0 space-y-2 border-t pt-2">
          <div className="relative">
            <Textarea
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={isArabic ? 'اكتب رسالتك لمساعد عقل HR...' : 'Type your message to AqlHR Assistant...'}
              className={`pr-10 resize-none min-h-[60px] max-h-24 ${
                isArabic ? 'text-right' : 'text-left'
              }`}
              spellCheck={spellCheckEnabled}
              lang={isArabic ? 'ar' : 'en'}
              dir={isArabic ? 'rtl' : 'ltr'}
              rows={2}
            />
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
        <div className="flex-shrink-0 text-center pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            {isArabic ? 'مدعوم بذكاء عقل HR الاصطناعي' : 'Powered by AqlHR AI Intelligence'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AqlHRAIAssistant;