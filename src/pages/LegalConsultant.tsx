import React, { useState } from 'react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  FileText, 
  Scale, 
  Shield, 
  BookOpen, 
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Send,
  Upload,
  Download,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Star,
  ThumbsUp,
  MessageSquare,
  Settings,
  HelpCircle,
  Info,
  ExternalLink,
  ChevronRight,
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Database,
  Server,
  Cloud,
  Wifi,
  Smartphone,
  Laptop,
  Monitor,
  Printer,
  Camera,
  Mic,
  Speaker,
  Headphones,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Heart,
  Share2,
  Bookmark,
  Flag,
  Tag,
  Link2,
  Copy,
  Scissors
} from 'lucide-react';
import { AqlHRAIAssistant } from '@/components/ai';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const LegalConsultant: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [activeTab, setActiveTab] = useState('assistant');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: isArabic 
        ? 'مرحباً! أنا مساعدك القانوني الذكي المتخصص في القانون السعودي. كيف يمكنني مساعدتك اليوم؟'
        : 'Hello! I\'m your AI legal assistant specialized in Saudi law. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [caseFiles, setCaseFiles] = useState([]);

  const quickTopics = isArabic ? [
    'عقود العمل',
    'ساعات العمل',
    'الإجازات والعطل',
    'التأمينات الاجتماعية',
    'قانون العمل السعودي',
    'حقوق الموظفين',
    'الفصل التعسفي',
    'التعويضات'
  ] : [
    'Employment Contracts',
    'Working Hours',
    'Leave & Holidays',
    'Social Insurance',
    'Saudi Labor Law',
    'Employee Rights',
    'Wrongful Termination',
    'Compensations'
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: isArabic 
          ? 'شكراً لسؤالك. دعني أبحث في قاعدة البيانات القانونية السعودية لأقدم لك إجابة دقيقة ومفصلة...'
          : 'Thank you for your question. Let me search through the Saudi legal database to provide you with an accurate and detailed answer...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickTopic = (topic: string) => {
    setInputMessage(topic);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date()
      }));
      setCaseFiles([...caseFiles, ...newFiles]);
    }
  };

  return (
    <div className={`container mx-auto p-6 space-y-6 max-w-6xl ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isArabic ? 'مستشار قانوني ذكي' : 'AI Legal Consultant'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {isArabic 
              ? 'أداة شاملة للاستشارة القانونية المدعومة بالذكاء الاصطناعي للقانون السعودي'
              : 'Comprehensive AI-powered legal consultation tool for Saudi law'
            }
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          {isArabic ? 'نشط' : 'Active'}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                {isArabic ? 'المحادثة القانونية' : 'Legal Chat'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 mb-4 p-4 border rounded-lg">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 ${
                      message.type === 'user' 
                        ? isArabic ? 'text-left' : 'text-right'
                        : isArabic ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg max-w-[80%] ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={isArabic ? 'اكتب سؤالك القانوني هنا...' : 'Type your legal question here...'}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Topics */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'مواضيع قانونية سريعة' : 'Quick Legal Topics'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {quickTopics.map((topic, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickTopic(topic)}
                    className="justify-start text-left"
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AqlHRAIAssistant 
        moduleContext="legal-consultant" 
        companyId="demo-company"
      />
      
      {/* AI Integration for Legal Consultancy */}
      <UniversalAIIntegrator 
        pageType="consulting" 
        moduleName="legal-consultancy" 
        companyId="demo-company" 
        enabledFeatures={['legal-compliance', 'regulatory-guidance', 'expert-recommendations', 'risk-assessment']}
      />
    </div>
  );
};

export default LegalConsultant;