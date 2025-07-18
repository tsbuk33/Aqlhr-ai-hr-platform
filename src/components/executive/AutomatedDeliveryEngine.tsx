import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Send, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Download,
  Calendar,
  Users,
  Target,
  TrendingUp,
  MessageSquare,
  Bell
} from "lucide-react";

interface DeliveryTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  audience: 'ceo' | 'hr_director' | 'board';
  language: 'ar' | 'en';
}

interface DeliverySchedule {
  id: string;
  presentationId: string;
  recipientEmail: string;
  recipientName: string;
  recipientRole: string;
  scheduledTime: string;
  status: 'scheduled' | 'sent' | 'opened' | 'engaged' | 'responded';
  deliveryTemplate: string;
  engagementData: {
    opened: boolean;
    openedAt?: string;
    viewTime?: number;
    downloaded: boolean;
    consultationBooked: boolean;
  };
}

const AutomatedDeliveryEngine: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [deliveryQueue, setDeliveryQueue] = useState<DeliverySchedule[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<DeliveryTemplate[]>([]);
  const [autoDeliveryEnabled, setAutoDeliveryEnabled] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Professional email templates
  const defaultEmailTemplates: DeliveryTemplate[] = [
    {
      id: 'ceo_arabic',
      name: 'CEO - Arabic',
      subject: 'تحليل استراتيجي شخصي لـ {CompanyName} - فرص تحول الموارد البشرية',
      audience: 'ceo',
      language: 'ar',
      content: `
المحترم/ة {RecipientName}،

السلام عليكم ورحمة الله وبركاته،

يسعدني أن أقدم لكم التحليل الاستراتيجي الشامل لـ {CompanyName} بناءً على التقييم الذي تم إجراؤه مؤخراً.

🎯 أبرز النتائج:
• النتيجة الحالية: {AssessmentScore}/100
• الإمكانات غير المستغلة: {GapValue} نقطة للوصول لمعايير الشركات الرائدة
• العائد المتوقع على الاستثمار: {ExpectedROI}%

📊 الفرص الاستراتيجية المحددة:
{StrategicOpportunities}

🚀 التوصيات التنفيذية:
بناءً على تحليلنا العميق، نوصي بتنفيذ حلول AqlHR الاستراتيجية التي ستمكن {CompanyName} من:
• تحقيق التميز التشغيلي في إدارة الموارد البشرية
• ضمان الامتثال الكامل للأنظمة السعودية
• تحسين الكفاءة بنسبة تصل إلى 40%

العرض التقديمي المرفق يحتوي على:
✅ التحليل التفصيلي لوضعكم الحالي
✅ خارطة طريق التحول الاستراتيجي
✅ دراسة الجدوى الاقتصادية المفصلة
✅ خطة التنفيذ المرحلية

أدعوكم لحجز جلسة استشارية استراتيجية لمناقشة كيفية تحويل هذه الرؤى إلى نتائج ملموسة.

[رابط حجز المشاورة الفورية]

مع أطيب التحيات،
طلال العبدالله
المؤسس والرئيس التنفيذي - AqlHR
talal@aqlhr.com | +966 50 123 4567
      `
    },
    {
      id: 'ceo_english',
      name: 'CEO - English',
      subject: 'Strategic Intelligence Report for {CompanyName} - HR Transformation Opportunities',
      audience: 'ceo',
      language: 'en',
      content: `
Dear {RecipientName},

I am pleased to present the comprehensive strategic analysis for {CompanyName} based on your recent organizational assessment.

🎯 Key Findings:
• Current Performance: {AssessmentScore}/100
• Untapped Potential: {GapValue} points to reach elite corporate standards
• Expected ROI: {ExpectedROI}%

📊 Strategic Opportunities Identified:
{StrategicOpportunities}

🚀 Executive Recommendations:
Based on our deep analysis, we recommend implementing AqlHR strategic solutions that will enable {CompanyName} to:
• Achieve operational excellence in HR management
• Ensure full compliance with Saudi regulations
• Improve efficiency by up to 40%

The attached presentation contains:
✅ Detailed analysis of your current state
✅ Strategic transformation roadmap
✅ Comprehensive business case analysis
✅ Phased implementation plan

I invite you to book a strategic consultation session to discuss how to transform these insights into tangible results.

[Instant Consultation Booking Link]

Best regards,
Talal AlAbdullah
Founder & CEO - AqlHR
talal@aqlhr.com | +966 50 123 4567
      `
    },
    {
      id: 'hr_arabic',
      name: 'HR Director - Arabic',
      subject: 'خطة التنفيذ التفصيلية لتحول الموارد البشرية في {CompanyName}',
      audience: 'hr_director',
      language: 'ar',
      content: `
المحترم/ة {RecipientName}،

تحية طيبة وبعد،

بصفتي مؤسس AqlHR، يسعدني مشاركتكم خطة التنفيذ التفصيلية لتحول الموارد البشرية في {CompanyName}.

📋 نتائج التقييم الشامل:
• النتيجة الإجمالية: {AssessmentScore}/100
• نقاط القوة المحددة: {IdentifiedStrengths}
• المجالات ذات الأولوية للتطوير: {PriorityAreas}

🔧 توصيات الوحدات والحلول:
{ModuleRecommendations}

📅 خطة التنفيذ المقترحة:
• المرحلة الأولى (الشهر 1-3): {Phase1Details}
• المرحلة الثانية (الشهر 4-6): {Phase2Details}
• المرحلة الثالثة (الشهر 7-12): {Phase3Details}

💡 الدعم والتدريب:
نحن ملتزمون بضمان نجاح التنفيذ من خلال:
• برامج تدريبية مخصصة لفريقكم
• دعم فني مستمر على مدار الساعة
• استشارات دورية لضمان تحقيق الأهداف

العرض التقديمي المرفق يحتوي على جميع التفاصيل الفنية والتنفيذية.

لمناقشة خطة التنفيذ بالتفصيل، يمكنكم حجز جلسة استشارية متخصصة.

[رابط حجز جلسة التنفيذ]

مع تقديري،
طلال العبدالله
AqlHR
      `
    },
    {
      id: 'hr_english',
      name: 'HR Director - English',
      subject: 'Detailed Implementation Plan for HR Transformation at {CompanyName}',
      audience: 'hr_director',
      language: 'en',
      content: `
Dear {RecipientName},

As the founder of AqlHR, I'm pleased to share the detailed implementation plan for HR transformation at {CompanyName}.

📋 Comprehensive Assessment Results:
• Overall Score: {AssessmentScore}/100
• Identified Strengths: {IdentifiedStrengths}
• Priority Development Areas: {PriorityAreas}

🔧 Module & Solution Recommendations:
{ModuleRecommendations}

📅 Proposed Implementation Plan:
• Phase 1 (Month 1-3): {Phase1Details}
• Phase 2 (Month 4-6): {Phase2Details}
• Phase 3 (Month 7-12): {Phase3Details}

💡 Support & Training:
We are committed to ensuring implementation success through:
• Customized training programs for your team
• 24/7 continuous technical support
• Regular consultations to ensure goal achievement

The attached presentation contains all technical and implementation details.

To discuss the implementation plan in detail, you can book a specialized consultation session.

[Implementation Session Booking Link]

Best regards,
Talal AlAbdullah
AqlHR
      `
    }
  ];

  // Mock delivery data
  const mockDeliveryQueue: DeliverySchedule[] = [
    {
      id: 'del_001',
      presentationId: 'pres_001',
      recipientEmail: 'ahmed.almohamed@company.com',
      recipientName: 'أحمد المحمد',
      recipientRole: 'CEO',
      scheduledTime: new Date().toISOString(),
      status: 'sent',
      deliveryTemplate: 'ceo_arabic',
      engagementData: {
        opened: true,
        openedAt: new Date(Date.now() - 3600000).toISOString(),
        viewTime: 780, // 13 minutes
        downloaded: true,
        consultationBooked: false
      }
    },
    {
      id: 'del_002',
      presentationId: 'pres_001',
      recipientEmail: 'fatima.alsaad@company.com',
      recipientName: 'فاطمة السعد',
      recipientRole: 'HR Director',
      scheduledTime: new Date().toISOString(),
      status: 'engaged',
      deliveryTemplate: 'hr_arabic',
      engagementData: {
        opened: true,
        openedAt: new Date(Date.now() - 7200000).toISOString(),
        viewTime: 1200, // 20 minutes
        downloaded: true,
        consultationBooked: true
      }
    }
  ];

  useEffect(() => {
    setEmailTemplates(defaultEmailTemplates);
    setDeliveryQueue(mockDeliveryQueue);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'scheduled': { variant: 'secondary' as const, icon: Clock, text: isArabic ? 'مجدول' : 'Scheduled' },
      'sent': { variant: 'default' as const, icon: Send, text: isArabic ? 'تم الإرسال' : 'Sent' },
      'opened': { variant: 'outline' as const, icon: Eye, text: isArabic ? 'تم الفتح' : 'Opened' },
      'engaged': { variant: 'default' as const, icon: Target, text: isArabic ? 'متفاعل' : 'Engaged' },
      'responded': { variant: 'default' as const, icon: MessageSquare, text: isArabic ? 'استجاب' : 'Responded' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const calculateEngagementScore = (engagement: any) => {
    let score = 0;
    if (engagement.opened) score += 25;
    if (engagement.viewTime > 300) score += 25; // 5+ minutes
    if (engagement.viewTime > 600) score += 25; // 10+ minutes
    if (engagement.downloaded) score += 15;
    if (engagement.consultationBooked) score += 10;
    return Math.min(score, 100);
  };

  return (
    <div className="automated-delivery-engine p-6 space-y-6">
      {/* Header */}
      <div className="header-section">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Send className="h-6 w-6 text-primary" />
              {isArabic ? 'محرك التسليم التلقائي' : 'Automated Delivery Engine'}
            </h2>
            <p className="text-muted-foreground mt-1">
              {isArabic 
                ? 'تسليم ذكي للعروض التقديمية مع تتبع المشاركة والمتابعة التلقائية'
                : 'Smart presentation delivery with engagement tracking and automated follow-up'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-delivery"
                checked={autoDeliveryEnabled}
                onCheckedChange={setAutoDeliveryEnabled}
              />
              <Label htmlFor="auto-delivery" className="text-sm">
                {isArabic ? 'التسليم التلقائي' : 'Auto Delivery'}
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? 'المرسلة اليوم' : 'Sent Today'}
                </p>
                <p className="text-2xl font-bold text-primary">8</p>
              </div>
              <Send className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? 'معدل الفتح' : 'Open Rate'}
                </p>
                <p className="text-2xl font-bold text-brand-success">87%</p>
              </div>
              <Eye className="h-6 w-6 text-brand-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? 'المشاورات المحجوزة' : 'Consultations Booked'}
                </p>
                <p className="text-2xl font-bold text-brand-accent">5</p>
              </div>
              <Calendar className="h-6 w-6 text-brand-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? 'متوسط وقت المشاهدة' : 'Avg. View Time'}
                </p>
                <p className="text-2xl font-bold text-brand-warning">16m</p>
              </div>
              <Clock className="h-6 w-6 text-brand-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="queue" className="delivery-tabs">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="queue">
            {isArabic ? 'قائمة التسليم' : 'Delivery Queue'}
          </TabsTrigger>
          <TabsTrigger value="templates">
            {isArabic ? 'قوالب البريد' : 'Email Templates'}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            {isArabic ? 'تحليلات المشاركة' : 'Engagement Analytics'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {isArabic ? 'قائمة التسليم النشطة' : 'Active Delivery Queue'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'العروض التقديمية المجدولة والمرسلة مع تتبع المشاركة'
                  : 'Scheduled and sent presentations with engagement tracking'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveryQueue.map((delivery) => (
                  <div key={delivery.id} className="delivery-item p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div>
                            <h4 className="font-semibold">{delivery.recipientName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {delivery.recipientRole} • {delivery.recipientEmail}
                            </p>
                          </div>
                          {getStatusBadge(delivery.status)}
                        </div>

                        {delivery.engagementData.opened && (
                          <div className="engagement-metrics grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                            <div className="metric">
                              <p className="text-xs text-muted-foreground">{isArabic ? 'تم الفتح' : 'Opened'}</p>
                              <p className="text-sm font-medium">
                                {new Date(delivery.engagementData.openedAt!).toLocaleString(isArabic ? 'ar-SA' : 'en-US')}
                              </p>
                            </div>
                            <div className="metric">
                              <p className="text-xs text-muted-foreground">{isArabic ? 'وقت المشاهدة' : 'View Time'}</p>
                              <p className="text-sm font-medium">
                                {Math.floor(delivery.engagementData.viewTime! / 60)}m {delivery.engagementData.viewTime! % 60}s
                              </p>
                            </div>
                            <div className="metric">
                              <p className="text-xs text-muted-foreground">{isArabic ? 'تم التحميل' : 'Downloaded'}</p>
                              <p className="text-sm font-medium">
                                {delivery.engagementData.downloaded 
                                  ? (isArabic ? '✓ نعم' : '✓ Yes') 
                                  : (isArabic ? '✗ لا' : '✗ No')
                                }
                              </p>
                            </div>
                            <div className="metric">
                              <p className="text-xs text-muted-foreground">{isArabic ? 'نتيجة المشاركة' : 'Engagement Score'}</p>
                              <p className="text-sm font-medium text-brand-success">
                                {calculateEngagementScore(delivery.engagementData)}%
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {delivery.engagementData.consultationBooked ? (
                          <Badge variant="default" className="bg-brand-success">
                            <Calendar className="h-3 w-3 mr-1" />
                            {isArabic ? 'تم الحجز' : 'Booked'}
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline">
                            <Bell className="h-4 w-4 mr-2" />
                            {isArabic ? 'متابعة' : 'Follow Up'}
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          {isArabic ? 'معاينة' : 'Preview'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {isArabic ? 'قوالب رسائل البريد الإلكتروني' : 'Email Message Templates'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'قوالب مخصصة لمختلف الجماهير والمناسبات'
                  : 'Customized templates for different audiences and occasions'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {emailTemplates.map((template) => (
                  <Card key={template.id} className="template-card">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{template.name}</span>
                        <Badge variant="outline">
                          {template.language.toUpperCase()}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">{isArabic ? 'الموضوع:' : 'Subject:'}</Label>
                          <p className="text-sm text-muted-foreground mt-1">{template.subject}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">{isArabic ? 'معاينة المحتوى:' : 'Content Preview:'}</Label>
                          <div className="text-xs text-muted-foreground mt-1 max-h-20 overflow-hidden">
                            {template.content.substring(0, 200)}...
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            {isArabic ? 'معاينة' : 'Preview'}
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            {isArabic ? 'تعديل' : 'Edit'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'إحصائيات التسليم' : 'Delivery Statistics'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'إجمالي المرسل' : 'Total Sent'}</span>
                    <span className="font-bold">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'معدل الفتح' : 'Open Rate'}</span>
                    <span className="font-bold text-brand-success">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'معدل التحميل' : 'Download Rate'}</span>
                    <span className="font-bold text-brand-accent">64%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'معدل حجز المشاورات' : 'Consultation Booking Rate'}</span>
                    <span className="font-bold text-brand-warning">42%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isArabic ? 'أداء القوالب' : 'Template Performance'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'CEO - عربي' : 'CEO - Arabic'}</span>
                    <Badge variant="default">92% {isArabic ? 'معدل فتح' : 'Open Rate'}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'HR - عربي' : 'HR - Arabic'}</span>
                    <Badge variant="default">88% {isArabic ? 'معدل فتح' : 'Open Rate'}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'CEO - إنجليزي' : 'CEO - English'}</span>
                    <Badge variant="secondary">76% {isArabic ? 'معدل فتح' : 'Open Rate'}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{isArabic ? 'HR - إنجليزي' : 'HR - English'}</span>
                    <Badge variant="secondary">73% {isArabic ? 'معدل فتح' : 'Open Rate'}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomatedDeliveryEngine;