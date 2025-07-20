import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { 
  Smartphone, 
  Mic, 
  Camera, 
  MapPin, 
  Bell, 
  Shield, 
  Zap, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Volume2,
  Eye,
  Hand
} from 'lucide-react';

interface MobileAIFeature {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ReactNode;
  status: 'active' | 'inactive' | 'beta';
  usageCount: number;
  accuracy: number;
  category: 'executive' | 'field' | 'safety' | 'general';
}

interface VoiceCommand {
  id: string;
  command: string;
  commandAr: string;
  response: string;
  responseAr: string;
  confidence: number;
  executionTime: number;
}

interface SafetyAlert {
  id: string;
  type: 'safety_violation' | 'equipment_check' | 'emergency' | 'compliance';
  title: string;
  titleAr: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  timestamp: string;
  resolved: boolean;
}

const MobileAIAssistant = () => {
  const { language, t } = useLanguage();
  const isArabic = language === 'ar';
  
  const [features, setFeatures] = useState<MobileAIFeature[]>([
    {
      id: '1',
      name: 'Voice-Activated Insights',
      nameAr: 'الرؤى المفعلة بالصوت',
      description: 'Get instant HR insights using voice commands',
      descriptionAr: 'احصل على رؤى فورية للموارد البشرية باستخدام الأوامر الصوتية',
      icon: <Mic className="w-5 h-5" />,
      status: 'active',
      usageCount: 2847,
      accuracy: 96.8,
      category: 'executive'
    },
    {
      id: '2',
      name: 'Safety Camera Recognition',
      nameAr: 'تعرف كاميرا السلامة',
      description: 'AI-powered safety compliance checking via camera',
      descriptionAr: 'فحص امتثال السلامة المدعوم بالذكاء الاصطناعي عبر الكاميرا',
      icon: <Camera className="w-5 h-5" />,
      status: 'active',
      usageCount: 1256,
      accuracy: 94.2,
      category: 'safety'
    },
    {
      id: '3',
      name: 'Location-Based Attendance',
      nameAr: 'الحضور القائم على الموقع',
      description: 'Smart attendance tracking with location verification',
      descriptionAr: 'تتبع ذكي للحضور مع التحقق من الموقع',
      icon: <MapPin className="w-5 h-5" />,
      status: 'active',
      usageCount: 5432,
      accuracy: 99.1,
      category: 'field'
    },
    {
      id: '4',
      name: 'Predictive Notifications',
      nameAr: 'الإشعارات التنبؤية',
      description: 'AI-generated alerts for critical events',
      descriptionAr: 'تنبيهات مُولدة بالذكاء الاصطناعي للأحداث الحرجة',
      icon: <Bell className="w-5 h-5" />,
      status: 'active',
      usageCount: 3891,
      accuracy: 92.5,
      category: 'general'
    },
    {
      id: '5',
      name: 'Offline AI Capabilities',
      nameAr: 'قدرات الذكاء الاصطناعي دون اتصال',
      description: 'Essential AI functions work without internet',
      descriptionAr: 'وظائف الذكاء الاصطناعي الأساسية تعمل بدون إنترنت',
      icon: <Shield className="w-5 h-5" />,
      status: 'beta',
      usageCount: 892,
      accuracy: 88.7,
      category: 'general'
    },
    {
      id: '6',
      name: 'Gesture Navigation',
      nameAr: 'التنقل بالإيماءات',
      description: 'Control AI features with hand gestures',
      descriptionAr: 'التحكم في ميزات الذكاء الاصطناعي بإيماءات اليد',
      icon: <Hand className="w-5 h-5" />,
      status: 'beta',
      usageCount: 234,
      accuracy: 85.3,
      category: 'executive'
    }
  ]);

  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([
    {
      id: '1',
      command: 'Show me today\'s attendance summary',
      commandAr: 'أظهر لي ملخص حضور اليوم',
      response: 'Today we have 287 employees present out of 312 total employees (92% attendance rate)',
      responseAr: 'اليوم لدينا 287 موظفًا حاضرًا من أصل 312 موظفًا إجماليًا (معدل حضور 92%)',
      confidence: 98.5,
      executionTime: 1.2
    },
    {
      id: '2',
      command: 'What\'s the Saudization rate for engineering?',
      commandAr: 'ما معدل السعودة لقسم الهندسة؟',
      response: 'Engineering department has 67% Saudization rate with 24 Saudi and 12 non-Saudi employees',
      responseAr: 'قسم الهندسة لديه معدل سعودة 67% مع 24 موظفًا سعوديًا و12 موظفًا غير سعودي',
      confidence: 96.2,
      executionTime: 0.8
    },
    {
      id: '3',
      command: 'Generate executive briefing for this week',
      commandAr: 'إنشاء إحاطة تنفيذية لهذا الأسبوع',
      response: 'Executive briefing generated covering workforce metrics, compliance status, and key performance indicators',
      responseAr: 'تم إنشاء الإحاطة التنفيذية التي تغطي مقاييس القوى العاملة وحالة الامتثال ومؤشرات الأداء الرئيسية',
      confidence: 94.8,
      executionTime: 2.1
    }
  ]);

  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([
    {
      id: '1',
      type: 'safety_violation',
      title: 'PPE Compliance Issue',
      titleAr: 'مشكلة امتثال معدات الحماية الشخصية',
      severity: 'high',
      location: 'Construction Site A - Zone 3',
      timestamp: '2024-01-15T14:30:00Z',
      resolved: false
    },
    {
      id: '2',
      type: 'equipment_check',
      title: 'Equipment Maintenance Due',
      titleAr: 'صيانة المعدات مستحقة',
      severity: 'medium',
      location: 'Warehouse B - Section 2',
      timestamp: '2024-01-15T10:15:00Z',
      resolved: false
    },
    {
      id: '3',
      type: 'compliance',
      title: 'Training Certificate Expiring',
      titleAr: 'شهادة التدريب تنتهي صلاحيتها',
      severity: 'low',
      location: 'Office Building - Floor 3',
      timestamp: '2024-01-15T09:00:00Z',
      resolved: true
    }
  ]);

  const [activeTab, setActiveTab] = useState('features');
  const [voiceInput, setVoiceInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-brand-success';
      case 'beta': return 'bg-brand-warning';
      case 'inactive': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-muted';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'executive': return <Users className="w-4 h-4" />;
      case 'field': return <MapPin className="w-4 h-4" />;
      case 'safety': return <Shield className="w-4 h-4" />;
      case 'general': return <Zap className="w-4 h-4" />;
      default: return <Smartphone className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(isArabic ? 'ar-SA' : 'en-SA', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(dateString));
  };

  const handleVoiceCommand = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setVoiceInput('Show me today\'s attendance summary');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-primary/10 rounded-lg">
          <Smartphone className="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {isArabic ? 'مساعد الذكاء الاصطناعي المحمول' : 'Mobile AI Assistant'}
          </h2>
          <p className="text-muted-foreground">
            {isArabic ? 'ذكاء اصطناعي متطور للمحمول مع قدرات صوتية وبصرية' : 'Advanced mobile AI with voice and visual capabilities'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'الميزات النشطة' : 'Active Features'}
                </p>
                <p className="text-2xl font-bold text-brand-primary">
                  {features.filter(f => f.status === 'active').length}
                </p>
              </div>
              <Zap className="w-8 h-8 text-brand-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'دقة الصوت' : 'Voice Accuracy'}
                </p>
                <p className="text-2xl font-bold text-brand-success">
                  {(voiceCommands.reduce((acc, cmd) => acc + cmd.confidence, 0) / voiceCommands.length).toFixed(1)}%
                </p>
              </div>
              <Mic className="w-8 h-8 text-brand-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'تنبيهات السلامة' : 'Safety Alerts'}
                </p>
                <p className="text-2xl font-bold text-brand-warning">
                  {safetyAlerts.filter(alert => !alert.resolved).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-brand-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'إجمالي الاستخدام' : 'Total Usage'}
                </p>
                <p className="text-2xl font-bold text-brand-accent">
                  {features.reduce((acc, f) => acc + f.usageCount, 0).toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-brand-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'ميزات الذكاء الاصطناعي المحمول' : 'Mobile AI Features'}
              </CardTitle>
              <CardDescription>
                {isArabic ? 'قدرات ذكية متقدمة محسّنة للأجهزة المحمولة' : 'Advanced intelligent capabilities optimized for mobile devices'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <Card key={feature.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-brand-primary/10 rounded-lg">
                          {feature.icon}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                              {isArabic ? feature.nameAr : feature.name}
                            </h4>
                            <Badge className={getStatusColor(feature.status)}>
                              {feature.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {isArabic ? feature.descriptionAr : feature.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              {getCategoryIcon(feature.category)}
                              <span>{feature.category}</span>
                            </div>
                            <div>
                              {isArabic ? 'الدقة: ' : 'Accuracy: '} {feature.accuracy}%
                            </div>
                            <div>
                              {isArabic ? 'الاستخدام: ' : 'Usage: '} {feature.usageCount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'الأوامر الصوتية' : 'Voice Commands'}
              </CardTitle>
              <CardDescription>
                {isArabic ? 'تفاعل مع النظام باستخدام الأوامر الصوتية الطبيعية' : 'Interact with the system using natural voice commands'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={isArabic ? 'اكتب أو اضغط على الميكروفون...' : 'Type or press microphone...'}
                  value={voiceInput}
                  onChange={(e) => setVoiceInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleVoiceCommand}
                  disabled={isListening}
                  className={`px-4 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-primary hover:bg-brand-primary/80'}`}
                >
                  <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
                </Button>
              </div>

              {isListening && (
                <div className="flex items-center gap-2 text-sm text-brand-primary">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  {isArabic ? 'جاري الاستماع...' : 'Listening...'}
                </div>
              )}

              <div className="space-y-3">
                {voiceCommands.map((cmd) => (
                  <div key={cmd.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Mic className="w-4 h-4 text-brand-primary" />
                        <span className="font-medium text-sm">
                          {isArabic ? cmd.commandAr : cmd.command}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline">
                          {cmd.confidence}% {isArabic ? 'ثقة' : 'confidence'}
                        </Badge>
                        <span className="text-muted-foreground">
                          {cmd.executionTime}s
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                      {isArabic ? cmd.responseAr : cmd.response}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'تنبيهات السلامة الذكية' : 'Smart Safety Alerts'}
              </CardTitle>
              <CardDescription>
                {isArabic ? 'مراقبة في الوقت الفعلي لمشاكل السلامة والامتثال' : 'Real-time monitoring for safety and compliance issues'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {safetyAlerts.map((alert) => (
                <div key={alert.id} className="p-3 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)} mt-1`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">
                          {isArabic ? alert.titleAr : alert.title}
                        </h4>
                        {alert.resolved ? (
                          <CheckCircle className="w-4 h-4 text-brand-success" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-brand-warning" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {alert.location}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'إحصائيات الأداء' : 'Performance Stats'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{isArabic ? 'وقت الاستجابة المتوسط' : 'Avg Response Time'}</span>
                  <span className="font-semibold text-brand-success">1.4s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{isArabic ? 'دقة التعرف على الصوت' : 'Voice Recognition Accuracy'}</span>
                  <span className="font-semibold text-brand-primary">96.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{isArabic ? 'دقة التعرف على الصور' : 'Image Recognition Accuracy'}</span>
                  <span className="font-semibold text-brand-accent">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{isArabic ? 'توفر دون اتصال' : 'Offline Availability'}</span>
                  <span className="font-semibold text-brand-warning">88.7%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MobileAIAssistant;