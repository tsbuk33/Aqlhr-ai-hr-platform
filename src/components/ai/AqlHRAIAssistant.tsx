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
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
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
  const { isArabic } = useSimpleLanguage();
  const { toast } = useToast();
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
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generatedContentType, setGeneratedContentType] = useState<string>('');
  const [isScrapingKnowledge, setIsScrapingKnowledge] = useState(false);
  const [knowledgeBaseStatus, setKnowledgeBaseStatus] = useState<string>('');
  
  // AI Agent Orchestrator integration
  const { 
    queryAIAgent, 
    getBestResponse, 
    isLoading: aiOrchestratorLoading,
    availableProviders 
  } = useAIAgentOrchestrator();
  
  // Contextual greetings with comprehensive HR expertise for ALL modules
  const contextualGreetings = {
    'executive': {
      ar: `🎯 **مرحباً! أنا مساعدك الذكي في مركز الذكاء التنفيذي عقل HR**

يمكنني مساعدتك في:
• اتخاذ القرارات الاستراتيجية
• تحليل البيانات التنفيذية  
• الرؤى الذكية لإدارة الموارد البشرية
• مراقبة مؤشرات الأداء الرئيسية

**كيف يمكنني مساعدتك اليوم؟**`,
      en: `🎯 **Hello! I'm your AI assistant for AqlHR Executive Intelligence Center**

I can help you with:
• Strategic decision making
• Executive data analysis
• Intelligent HR insights
• Key performance indicators monitoring

**How can I help you today?**`
    },
    'employees': {
      ar: `👥 **مرحباً! أنا مساعدك الذكي في إدارة بيانات الموظفين**

يمكنني مساعدتك في:
• التوظيف وإدارة السجلات
• التقييم والأداء
• الامتثال للقوانين السعودية
• إدارة بيانات الموظفين

**ما الذي تحتاج مساعدة به؟**`,
      en: `👥 **Hello! I'm your AI assistant for Employee Management**

I can help you with:
• Recruitment and record management
• Performance evaluation
• Saudi compliance
• Employee data management

**What do you need help with?**`
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
    'health-safety': {
      ar: `⛑️ **مرحباً! أنا مساعدك الذكي للصحة والسلامة المهنية**

أساعدك في:
• تحليل مخاطر مكان العمل
• إنشاء تقارير الحوادث
• جدولة التدريب الأمني
• مراجعة معايير السلامة

**كيف يمكنني مساعدتك في تحسين السلامة؟**`,
      en: `⛑️ **Hello! I'm your AI assistant for Health & Safety**

I help you with:
• Workplace risk analysis
• Incident report creation
• Safety training scheduling
• Safety standards review

**How can I help you improve safety?**`
    },
    'default': {
      ar: `🤖 **مرحباً! أنا مساعدك الذكي المتخصص في منصة عقل HR**

أقدم خدمات شاملة في:
• إدارة الموظفين والتوظيف
• الرواتب والأمور المالية
• التكامل الحكومي والامتثال
• التحليلات والتقارير الذكية

**كيف يمكنني مساعدتك اليوم؟**`,
      en: `🤖 **Hello! I'm your specialized HR AI assistant for AqlHR platform**

I provide comprehensive services in:
• Employee management and recruitment
• Payroll and financial matters
• Government integration and compliance
• Analytics and intelligent reporting

**How can I help you today?**`
    }
  };
  
  // Initialize with welcome message based on module context
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeText = contextualGreetings[moduleContext as keyof typeof contextualGreetings] || contextualGreetings['default'];
      const welcomeMessage: ChatMessage = {
        id: 'welcome-message',
        type: 'assistant',
        content: welcomeText[isArabic ? 'ar' : 'en'],
        timestamp: new Date(),
        module: moduleContext
      };
      setMessages([welcomeMessage]);
    }
  }, [moduleContext, isArabic]);

  // Document-aware AI integration
  const { 
    queryWithDocuments, 
    documents, 
    moduleDocuments 
  } = useDocumentAwareAI(moduleContext);


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

  // Remove duplicate useEffect - welcome message is handled above

  // Multi-modal content generation functions
  const handleMultiModalGeneration = async (contentType: string, prompt: string) => {
    setIsGeneratingContent(true);
    setGeneratedContentType(contentType);
    
    try {
      let functionName = '';
      let requestBody: any = {
        prompt: prompt,
        language: isArabic ? 'ar' : 'en',
        companyName: 'AqlHR Company'
      };

      switch (contentType) {
        case 'image':
          functionName = 'manus-image-generator';
          requestBody = {
            ...requestBody,
            style: 'professional',
            format: 'png',
            size: '1024x1024'
          };
          break;
        case 'presentation':
          functionName = 'manus-presentation-generator';
          requestBody = {
            ...requestBody,
            presentationType: 'performance',
            slideCount: 8
          };
          break;
        case 'document':
          functionName = 'manus-document-generator';
          requestBody = {
            ...requestBody,
            documentType: 'policy'
          };
          break;
        case 'visualization':
          functionName = 'manus-visualization-generator';
          requestBody = {
            ...requestBody,
            chartType: 'bar',
            dataSource: 'sample'
          };
          break;
        default:
          throw new Error('Unknown content type');
      }

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: requestBody
      });

      if (error) {
        throw new Error(error.message);
      }

      // Create a response message with the generated content
      const contentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: formatGeneratedContent(data, contentType),
        timestamp: new Date(),
        module: moduleContext,
        confidence: 95
      };

      setMessages(prev => [...prev, contentMessage]);
      
    } catch (error) {
      console.error('Multi-modal generation error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: isArabic 
          ? `عذراً، واجهت مشكلة في إنشاء ${contentType}. يرجى المحاولة مرة أخرى.`
          : `Sorry, I encountered an issue generating ${contentType}. Please try again.`,
        timestamp: new Date(),
        module: moduleContext,
        confidence: 0
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGeneratingContent(false);
      setGeneratedContentType('');
    }
  };

  const formatGeneratedContent = (data: any, contentType: string) => {
    const timestamp = new Date().toLocaleString(isArabic ? 'ar-SA' : 'en-US');
    
    switch (contentType) {
      case 'image':
        return isArabic
          ? `🖼️ **تم إنشاء الصورة بنجاح!**\n\n` +
            `${data.image ? `![Generated Image](${data.image})` : 'تم إنشاء الصورة ولكن لا يمكن عرضها في الوقت الحالي.'}\n\n` +
            `**الوصف:** ${data.prompt}\n` +
            `**تاريخ الإنشاء:** ${timestamp}\n\n` +
            `يمكنك الآن تنزيل هذه الصورة واستخدامها في التقارير والعروض التقديمية.`
          : `🖼️ **Image Generated Successfully!**\n\n` +
            `${data.image ? `![Generated Image](${data.image})` : 'Image was generated but cannot be displayed at the moment.'}\n\n` +
            `**Description:** ${data.prompt}\n` +
            `**Generated:** ${timestamp}\n\n` +
            `You can now download this image and use it in reports and presentations.`;
      
      case 'presentation':
        return isArabic
          ? `📊 **تم إنشاء العرض التقديمي بنجاح!**\n\n` +
            `**العنوان:** ${data.presentation?.data?.title || 'عرض تقديمي جديد'}\n` +
            `**عدد الشرائح:** ${data.presentation?.slideCount || 1}\n` +
            `**اللغة:** ${data.presentation?.language === 'ar' ? 'العربية' : 'الإنجليزية'}\n` +
            `**تاريخ الإنشاء:** ${timestamp}\n\n` +
            `تم إنشاء عرض تقديمي احترافي يمكنك تنزيله واستخدامه في اجتماعاتك.`
          : `📊 **Presentation Generated Successfully!**\n\n` +
            `**Title:** ${data.presentation?.data?.title || 'New Presentation'}\n` +
            `**Slides:** ${data.presentation?.slideCount || 1}\n` +
            `**Language:** ${data.presentation?.language === 'ar' ? 'Arabic' : 'English'}\n` +
            `**Generated:** ${timestamp}\n\n` +
            `A professional presentation has been created for you to download and use in your meetings.`;
      
      case 'document':
        return isArabic
          ? `📄 **تم إنشاء المستند بنجاح!**\n\n` +
            `**نوع المستند:** ${data.document?.type || 'مستند'}\n` +
            `**اللغة:** ${data.document?.language === 'ar' ? 'العربية' : 'الإنجليزية'}\n` +
            `**تاريخ الإنشاء:** ${timestamp}\n\n` +
            `**محتوى المستند:**\n${data.document?.content?.substring(0, 300)}...\n\n` +
            `تم إنشاء مستند احترافي يمكنك تنزيله بصيغة HTML.`
          : `📄 **Document Generated Successfully!**\n\n` +
            `**Document Type:** ${data.document?.type || 'document'}\n` +
            `**Language:** ${data.document?.language === 'ar' ? 'Arabic' : 'English'}\n` +
            `**Generated:** ${timestamp}\n\n` +
            `**Document Preview:**\n${data.document?.content?.substring(0, 300)}...\n\n` +
            `A professional document has been created for you to download in HTML format.`;
      
      case 'visualization':
        return isArabic
          ? `📈 **تم إنشاء التصور البياني بنجاح!**\n\n` +
            `**نوع المخطط:** ${data.visualization?.type || 'مخطط بياني'}\n` +
            `**اللغة:** ${data.visualization?.language === 'ar' ? 'العربية' : 'الإنجليزية'}\n` +
            `**تاريخ الإنشاء:** ${timestamp}\n\n` +
            `تم إنشاء مخطط بياني تفاعلي يمكنك تنزيله واستخدامه في التقارير.`
          : `📈 **Visualization Generated Successfully!**\n\n` +
            `**Chart Type:** ${data.visualization?.type || 'chart'}\n` +
            `**Language:** ${data.visualization?.language === 'ar' ? 'Arabic' : 'English'}\n` +
            `**Generated:** ${timestamp}\n\n` +
            `An interactive chart has been created for you to download and use in reports.`;
      
      default:
        return isArabic
          ? `✅ تم إنشاء المحتوى بنجاح في ${timestamp}`
          : `✅ Content generated successfully at ${timestamp}`;
    }
  };

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
        // Use the AI Agent Orchestrator with proper context
        try {
          const { data, error } = await supabase.functions.invoke('ai-agent-orchestrator', {
            body: {
              query: inputValue,
              context: {
                module: moduleContext,
                language: isArabic ? 'ar' : 'en',
                company_id: companyId || 'demo-company',
                user_context: `HR Professional using ${moduleContext} module`,
                conversation_history: messages.slice(-5).map(msg => ({
                  role: msg.type === 'user' ? 'user' : 'assistant',
                  content: msg.content
                }))
              }
            }
          });
          
          aiResponse = data;
          aiError = error;
        } catch (error) {
          aiError = error;
          aiResponse = null;
        }
      }

      if (aiError) {
        console.error('Error sending message:', aiError);
        setIsGatheringIntelligence(false);
        
        // Show specific error based on the actual error
        const errorMessage = aiError.message || 'Unknown error';
        
        if (errorMessage.includes('OPENAI_API_KEY')) {
          toast({
            title: isArabic ? "مفتاح API غير موجود" : "API Key Missing",
            description: isArabic ? "يرجى إعداد مفتاح OpenAI API في إعدادات المشروع" : "Please configure OpenAI API key in project settings",
            variant: "destructive",
          });
        } else {
          toast({
            title: isArabic ? "خطأ في الاتصال" : "Connection Error", 
            description: isArabic ? "يرجى المحاولة مرة أخرى" : "Please try again",
            variant: "destructive",
          });
        }
        
        // Provide fallback response with contextual help
        const fallbackResponse = isArabic
          ? `عذراً، حدث خطأ مؤقت في الاتصال. يمكنني مساعدتك من خلال معرفتي المحفوظة:\n\n` +
            `**الوحدة الحالية: ${moduleContext}**\n` +
            `يمكنني مساعدتك في جميع جوانب إدارة الموارد البشرية. اسألني عن أي شيء تحتاج إليه!`
          : `Sorry, there was a temporary connection error. I can help you with my stored knowledge:\n\n` +
            `**Current Module: ${moduleContext}**\n` +
            `I can assist you with all aspects of HR management. Ask me anything you need!`;
            
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: fallbackResponse,
          timestamp: new Date(),
          module: moduleContext,
          confidence: 80
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        return;
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
      
      // Show user-friendly error notification
      toast({
        title: isArabic ? "خطأ مؤقت" : "Temporary Error",
        description: isArabic ? "سأقدم لك إجابة مفيدة من معرفتي" : "I'll provide a helpful response from my knowledge",
        variant: "default",
      });
      
      // Provide context-aware helpful responses based on the question and current page
      const getContextualResponse = () => {
        const query = inputValue.toLowerCase();
        
        // Check if asking about WPS
        if (query.includes('wps') || query.includes('wage protection')) {
          return isArabic 
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
              `• Monitor any payment delays`;
        }
        
        // Check if asking about how to use current page or looking for help
        if (query.includes('how') || query.includes('use') || query.includes('new') || query.includes('help') || 
            query.includes('explain') || query.includes('page') || query.includes('guide') || 
            query.includes('كيف') || query.includes('استخدم') || query.includes('جديد') || query.includes('مساعدة')) {
          
          const currentModule = moduleContext || 'default';
          
          // Performance Strategy page specific guidance
          if (currentModule.includes('performance') || currentModule.includes('strategic')) {
            return isArabic
              ? `🎯 **مرحباً بك في صفحة استراتيجية الأداء!**\n\n` +
                `**فهم مؤشرات الأداء الحالية:**\n\n` +
                `🏆 **الموظفون المتميزون (567):**\n` +
                `• هؤلاء الموظفون الذين حققوا أداءً استثنائياً\n` +
                `• يمكن استخدامهم كقدوة للآخرين\n` +
                `• قم بدراسة ممارساتهم لتطبيقها على الفرق الأخرى\n\n` +
                `⭐ **متوسط التقييم (4.2/5):**\n` +
                `• مؤشر جيد يعكس الأداء العام\n` +
                `• هدف تحسينه للوصول إلى 4.5+\n` +
                `• راجع التقييمات المنخفضة لتحديد نقاط التحسين\n\n` +
                `🎯 **تحقيق الأهداف (89%):**\n` +
                `• نسبة ممتازة تقترب من الهدف المثالي 95%\n` +
                `• حدد الأهداف غير المحققة (11%) لوضع خطط محددة\n` +
                `• ضع استراتيجيات لتحسين الـ 6% المتبقية\n\n` +
                `💰 **عائد الاستثمار في الأداء (23%):**\n` +
                `• عائد ممتاز يفوق المعدل الصناعي (15-20%)\n` +
                `• استمر في الاستثمار في برامج التطوير\n` +
                `• قم بقياس ROI لكل برنامج منفصلاً\n\n` +
                `**خطوات للبدء:**\n` +
                `1. **راجع الأرقام أعلاه** وحدد نقاط القوة والضعف\n` +
                `2. **استخدم أداة رفع الوثائق** لإضافة تقارير الأداء\n` +
                `3. **اسأل المساعد الذكي** عن استراتيجيات محددة\n` +
                `4. **ضع خطة تحسين** بناءً على البيانات\n\n` +
                `💡 **نصائح متقدمة:**\n` +
                `• قارن الأداء بين الأقسام المختلفة\n` +
                `• حدد الموظفين الذين يحتاجون دعماً إضافياً\n` +
                `• ضع برامج تطوير مخصصة لكل مستوى أداء\n` +
                `• اربط الأداء بأهداف الشركة الاستراتيجية`
              : `🎯 **Welcome to Performance Strategy Page!**\n\n` +
                `**Understanding Your Current Performance Metrics:**\n\n` +
                `🏆 **High Performers (567):**\n` +
                `• These are your top-performing employees\n` +
                `• Use them as mentors and role models\n` +
                `• Study their best practices to replicate across teams\n\n` +
                `⭐ **Average Rating (4.2/5):**\n` +
                `• Good overall performance indicator\n` +
                `• Target improvement to reach 4.5+\n` +
                `• Review lower ratings to identify improvement areas\n\n` +
                `🎯 **Goal Achievement (89%):**\n` +
                `• Excellent rate approaching the ideal 95%\n` +
                `• Identify the unmet goals (11%) for targeted planning\n` +
                `• Develop strategies to improve the remaining 6%\n\n` +
                `💰 **Performance ROI (23%):**\n` +
                `• Excellent return exceeding industry average (15-20%)\n` +
                `• Continue investing in development programs\n` +
                `• Measure ROI for each program separately\n\n` +
                `**Getting Started Steps:**\n` +
                `1. **Review the numbers above** and identify strengths/weaknesses\n` +
                `2. **Use the document uploader** to add performance reports\n` +
                `3. **Ask the AI assistant** about specific strategies\n` +
                `4. **Create improvement plan** based on the data\n\n` +
                `💡 **Advanced Tips:**\n` +
                `• Compare performance across departments\n` +
                `• Identify employees needing additional support\n` +
                `• Create customized development programs for each performance level\n` +
                `• Link performance to strategic company objectives`;
          }
          
          switch (currentModule) {
            case 'payroll':
              return isArabic
                ? `📊 **دليل استخدام صفحة الرواتب:**\n\n` +
                  `**الميزات الرئيسية:**\n` +
                  `• **نظرة عامة على الرواتب:** عرض إجمالي الرواتب والتكاليف الشهرية\n` +
                  `• **معلومات GOSI:** متابعة اشتراكات التأمينات الاجتماعية\n` +
                  `• **نظام WPS:** مراقبة نظام حماية الأجور والامتثال\n` +
                  `• **التقارير المالية:** إنشاء تقارير مفصلة للرواتب\n\n` +
                  `**كيفية الاستخدام:**\n` +
                  `• استعرض البيانات في الأقسام المختلفة\n` +
                  `• استخدم المرشحات لتصفية المعلومات\n` +
                  `• اضغط على "إنشاء تقرير" للحصول على تقارير مفصلة\n` +
                  `• راجع حالة WPS للتأكد من الامتثال\n\n` +
                  `**نصائح مهمة:**\n` +
                  `• تأكد من تحديث بيانات الموظفين قبل معالجة الرواتب\n` +
                  `• راجع حسابات GOSI بانتظام للامتثال\n` +
                  `• استخدم التقارير لمتابعة الأداء المالي`
                : `📊 **Payroll Page Usage Guide:**\n\n` +
                  `**Main Features:**\n` +
                  `• **Payroll Overview:** View total salaries and monthly costs\n` +
                  `• **GOSI Information:** Track social insurance contributions\n` +
                  `• **WPS System:** Monitor Wage Protection System compliance\n` +
                  `• **Financial Reports:** Generate detailed payroll reports\n\n` +
                  `**How to Use:**\n` +
                  `• Browse data in different sections\n` +
                  `• Use filters to refine information\n` +
                  `• Click "Generate Report" for detailed reports\n` +
                  `• Review WPS status to ensure compliance\n\n` +
                  `**Important Tips:**\n` +
                  `• Update employee data before processing payroll\n` +
                  `• Review GOSI calculations regularly for compliance\n` +
                  `• Use reports to track financial performance`;
            
            case 'employees':
              return isArabic
                ? `👥 **دليل استخدام إدارة الموظفين:**\n\n` +
                  `• إضافة موظفين جدد وإدارة بياناتهم\n` +
                  `• تتبع الحضور والانصراف\n` +
                  `• إدارة الإجازات والعطل\n` +
                  `• متابعة الأداء والتقييمات`
                : `👥 **Employee Management Guide:**\n\n` +
                  `• Add new employees and manage their data\n` +
                  `• Track attendance and time records\n` +
                  `• Manage leaves and holidays\n` +
                  `• Monitor performance and evaluations`;
            
            default:
              return isArabic
                ? `🏢 **مرحباً بك في منصة AqlHR:**\n\n` +
                  `منصة شاملة لإدارة الموارد البشرية تتوافق مع القوانين السعودية.\n\n` +
                  `**الميزات المتاحة:**\n` +
                  `• إدارة الموظفين والرواتب\n` +
                  `• نظام حماية الأجور (WPS)\n` +
                  `• حسابات GOSI والامتثال\n` +
                  `• التكامل مع الأنظمة الحكومية\n` +
                  `• التحليلات والتقارير المتقدمة`
                : `🏢 **Welcome to AqlHR Platform:**\n\n` +
                  `A comprehensive HR management platform compliant with Saudi regulations.\n\n` +
                  `**Available Features:**\n` +
                  `• Employee and payroll management\n` +
                  `• Wage Protection System (WPS)\n` +
                  `• GOSI calculations and compliance\n` +
                  `• Government systems integration\n` +
                  `• Advanced analytics and reporting`;
          }
        }
        
        // Generic fallback
        return isArabic
          ? `أعتذر عن المشكلة التقنية. أنا مساعدك الذكي المتخصص في الموارد البشرية ويمكنني مساعدتك في:\n\n• تسجيل الموظفين الجدد\n• حسابات الرواتب و GOSI\n• الامتثال الحكومي\n• قوانين العمل السعودية\n• نظام حماية الأجور\n• منصة قوى ونطاقات\n\nيرجى إعادة صياغة سؤالك وسأكون سعيداً لمساعدتك.`
          : `Sorry for the technical issue. I'm your specialized HR AI assistant and I can help you with:\n\n• New employee registration\n• Payroll and GOSI calculations\n• Government compliance\n• Saudi labor laws\n• Wage Protection System\n• Qiwa platform and Nitaqat\n\nPlease rephrase your question and I'll be happy to help you.`;
      };
      
      const fallbackResponse = getContextualResponse();
      
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
    ? 'fixed bottom-6 right-6 z-50 w-[420px] h-[550px] flex flex-col' 
    : 'w-full max-w-xl mx-auto h-[550px] flex flex-col';

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
                className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap leading-relaxed ${
                  message.type === 'user'
                    ? 'bg-brand-primary text-white'
                    : 'bg-muted text-foreground border'
                }`}
              >
                <div className="space-y-2">
                  {message.content.split('\n').map((line, idx) => (
                    <div key={idx} className={line.trim() === '' ? 'h-2' : ''}>
                      {line || ''}
                    </div>
                  ))}
                </div>
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

          {/* Manus-style Multi-Modal Tools */}
          <div className="space-y-2 border-t pt-2">
            <div className="text-xs font-medium text-muted-foreground">
              {isArabic ? 'أدوات متعددة الوسائط:' : 'Multi-Modal Tools:'}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMultiModalGeneration('image', isArabic ? 'إنشاء صورة احترافية لتقرير الموظفين مع مخططات وإحصائيات' : 'Generate professional employee report image with charts and statistics')}
                disabled={isGeneratingContent}
                className="h-8 text-xs flex items-center gap-1"
              >
                <Image className="h-3 w-3" />
                {isArabic ? 'صورة' : 'Image'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMultiModalGeneration('presentation', isArabic ? 'إنشاء عرض تقديمي شامل عن أداء الموظفين وإنجازات الشركة' : 'Create comprehensive presentation about employee performance and company achievements')}
                disabled={isGeneratingContent}
                className="h-8 text-xs flex items-center gap-1"
              >
                <Presentation className="h-3 w-3" />
                {isArabic ? 'عرض' : 'Slides'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMultiModalGeneration('visualization', isArabic ? 'إنشاء جدول بيانات تفاعلي للرواتب والمزايا' : 'Create interactive payroll and benefits spreadsheet')}
                disabled={isGeneratingContent}
                className="h-8 text-xs flex items-center gap-1"
              >
                <Table className="h-3 w-3" />
                {isArabic ? 'جدول' : 'Sheet'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMultiModalGeneration('visualization', isArabic ? 'إنشاء مخطط بياني لمؤشرات الأداء والإنتاجية' : 'Create performance and productivity KPI chart')}
                disabled={isGeneratingContent}
                className="h-8 text-xs flex items-center gap-1"
              >
                <BarChart className="h-3 w-3" />
                {isArabic ? 'تمثيل مرئي' : 'Chart'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMultiModalGeneration('document', isArabic ? 'إنشاء صفحة ويب تفاعلية لسياسات الموظفين والإجراءات' : 'Create interactive webpage for employee policies and procedures')}
                disabled={isGeneratingContent}
                className="h-8 text-xs flex items-center gap-1"
              >
                <Globe className="h-3 w-3" />
                {isArabic ? 'صفحة' : 'Page'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMultiModalGeneration('document', isArabic ? 'إنشاء مستند سياسة شاملة للموارد البشرية وفقاً للقوانين السعودية' : 'Create comprehensive HR policy document compliant with Saudi regulations')}
                disabled={isGeneratingContent}
                className="h-8 text-xs flex items-center gap-1"
              >
                <FileText className="h-3 w-3" />
                {isArabic ? 'مستند' : 'Doc'}
              </Button>
            </div>
            
            {/* Quality Settings & Provider Status */}
            <div className="flex items-center justify-between text-xs pt-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {isArabic ? 'الجودة:' : 'Quality:'}
                </span>
                <Badge variant="outline" className="text-xs">
                  {isArabic ? 'عالية' : 'High'}
                </Badge>
              </div>
              {availableProviders.length > 0 && (
                <div className="text-muted-foreground flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  {availableProviders.length} {isArabic ? 'مزودين' : 'providers'}
                </div>
              )}
            </div>
          </div>
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
export { AqlHRAIAssistant };