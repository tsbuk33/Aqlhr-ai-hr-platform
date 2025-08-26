import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import McKinseyPresentationGenerator from "@/components/executive/McKinseyPresentationGenerator";
import { 
  Presentation, 
  FileText, 
  Send, 
  Target, 
  TrendingUp,
  Users,
  Briefcase,
  Star
} from "lucide-react";

const StrategicPresentationCenter = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="strategic-presentation-center min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="hero-section text-center py-12 px-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-primary/20 rounded-full">
                <Presentation className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {isArabic ? '🎯 مركز العروض الاستراتيجية' : '🎯 Strategic Presentation Center'}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {isArabic 
                ? 'سلاح AqlHR النهائي لإغلاق الصفقات - تحويل التقييمات تلقائياً إلى عروض تنفيذية بجودة ماكنزي وتسليمها للرؤساء التنفيذيين ومديري الموارد البشرية'
                : "AqlHR's Ultimate Deal-Closing Weapon - Automatically transform assessments into McKinsey-quality executive presentations and deliver to CEOs and HR Directors"}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm rounded-lg px-4 py-2">
                <Target className="h-5 w-5 text-brand-success" />
                <span className="font-medium">
                  {isArabic ? '73% معدل التحويل' : '73% Conversion Rate'}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm rounded-lg px-4 py-2">
                <TrendingUp className="h-5 w-5 text-brand-accent" />
                <span className="font-medium">
                  {isArabic ? 'توليد فوري' : 'Instant Generation'}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm rounded-lg px-4 py-2">
                <Star className="h-5 w-5 text-brand-warning" />
                <span className="font-medium">
                  {isArabic ? 'جودة ماكنزي' : 'McKinsey Quality'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="feature-card border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                {isArabic ? 'توليد تلقائي للعروض' : 'Automated Generation'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isArabic 
                  ? 'تحويل بيانات التقييم تلقائياً إلى عروض تقديمية احترافية بجودة ماكنزي في أقل من 5 دقائق'
                  : 'Transform assessment data into McKinsey-quality presentations automatically in under 5 minutes'}
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card border-l-4 border-l-brand-success">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Send className="h-5 w-5 text-brand-success" />
                {isArabic ? 'تسليم ذكي' : 'Smart Delivery'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isArabic 
                  ? 'إرسال العروض تلقائياً للرؤساء التنفيذيين ومديري الموارد البشرية مع تتبع المشاركة'
                  : 'Automatically deliver presentations to CEOs and HR Directors with engagement tracking'}
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card border-l-4 border-l-brand-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="h-5 w-5 text-brand-accent" />
                {isArabic ? 'حجز المشاورات' : 'Consultation Booking'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isArabic 
                  ? 'تكامل مباشر مع نظام الحجز لتحويل العروض إلى مشاورات استراتيجية مدفوعة'
                  : 'Direct booking integration to convert presentations into paid strategic consultations'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Architecture Overview */}
        <Card className="system-overview">
          <CardHeader>
            <CardTitle className="text-2xl">
              {isArabic ? '🏗️ هيكل النظام' : '🏗️ System Architecture'}
            </CardTitle>
            <CardDescription>
              {isArabic 
                ? 'تدفق العمل الآلي من التقييم إلى إغلاق الصفقة'
                : 'Automated workflow from assessment to deal closure'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="workflow-steps grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="step-card text-center p-4 bg-primary/10 rounded-lg">
                <div className="step-number bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                <h4 className="font-semibold mb-2">{isArabic ? 'استلام التقييم' : 'Assessment Input'}</h4>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'معالجة بيانات التقييم فوراً' : 'Real-time assessment processing'}
                </p>
              </div>
              
              <div className="step-card text-center p-4 bg-brand-success/10 rounded-lg">
                <div className="step-number bg-brand-success text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                <h4 className="font-semibold mb-2">{isArabic ? 'التحليل الذكي' : 'AI Analysis'}</h4>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'تحليل الفجوات والحلول' : 'Gap analysis & solutions'}
                </p>
              </div>
              
              <div className="step-card text-center p-4 bg-brand-accent/10 rounded-lg">
                <div className="step-number bg-brand-accent text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                <h4 className="font-semibold mb-2">{isArabic ? 'توليد العروض' : 'Generate Presentations'}</h4>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'قوالب ماكنزي المخصصة' : 'Custom McKinsey templates'}
                </p>
              </div>
              
              <div className="step-card text-center p-4 bg-brand-warning/10 rounded-lg">
                <div className="step-number bg-brand-warning text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold">4</div>
                <h4 className="font-semibold mb-2">{isArabic ? 'التسليم التلقائي' : 'Auto Delivery'}</h4>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'إرسال مخصص للمدراء' : 'Personalized executive delivery'}
                </p>
              </div>
              
              <div className="step-card text-center p-4 bg-purple-500/10 rounded-lg">
                <div className="step-number bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 text-sm font-bold">5</div>
                <h4 className="font-semibold mb-2">{isArabic ? 'إغلاق الصفقة' : 'Deal Closure'}</h4>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'حجز المشاورات الفوري' : 'Instant consultation booking'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Presentation Templates Preview */}
        <Card className="templates-preview">
          <CardHeader>
            <CardTitle className="text-2xl">
              {isArabic ? '📊 قوالب العروض التقديمية' : '📊 Presentation Templates'}
            </CardTitle>
            <CardDescription>
              {isArabic 
                ? 'قوالب بجودة ماكنزي مخصصة للجماهير المختلفة'
                : 'McKinsey-quality templates customized for different audiences'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="templates-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="template-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {isArabic ? 'عرض الرئيس التنفيذي' : 'CEO Executive Presentation'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="slide-preview p-3 bg-muted/50 rounded border-l-4 border-l-primary">
                      <h5 className="font-medium">{isArabic ? 'الشرائح المتضمنة:' : 'Included Slides:'}</h5>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        <li>• {isArabic ? 'الملخص التنفيذي الاستراتيجي' : 'Strategic Executive Summary'}</li>
                        <li>• {isArabic ? 'تحليل الفجوات مقابل المعايير الرائدة' : 'Gap Analysis vs Elite Standards'}</li>
                        <li>• {isArabic ? 'هيكل الحلول والاستثمار' : 'Solution Architecture & Investment'}</li>
                        <li>• {isArabic ? 'خارطة طريق التحول' : 'Transformation Roadmap'}</li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{isArabic ? 'المدة:' : 'Duration:'}</span>
                      <span className="font-medium">{isArabic ? '15-20 دقيقة' : '15-20 minutes'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="template-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-brand-accent" />
                    {isArabic ? 'عرض مدير الموارد البشرية' : 'HR Director Presentation'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="slide-preview p-3 bg-muted/50 rounded border-l-4 border-l-brand-accent">
                      <h5 className="font-medium">{isArabic ? 'الشرائح المتضمنة:' : 'Included Slides:'}</h5>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        <li>• {isArabic ? 'نتائج التقييم التفصيلية' : 'Detailed Assessment Results'}</li>
                        <li>• {isArabic ? 'توصيات الوحدات والخدمات' : 'Module & Service Recommendations'}</li>
                        <li>• {isArabic ? 'خطة التنفيذ المرحلية' : 'Phased Implementation Plan'}</li>
                        <li>• {isArabic ? 'مقاييس النجاح والمتابعة' : 'Success Metrics & Follow-up'}</li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{isArabic ? 'المدة:' : 'Duration:'}</span>
                      <span className="font-medium">{isArabic ? '25-30 دقيقة' : '25-30 minutes'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Main Presentation Generator */}
        <McKinseyPresentationGenerator />

        {/* Success Metrics */}
        <Card className="success-metrics">
          <CardHeader>
            <CardTitle className="text-2xl">
              {isArabic ? '🎯 مقاييس النجاح المستهدفة' : '🎯 Target Success Metrics'}
            </CardTitle>
            <CardDescription>
              {isArabic 
                ? 'الأهداف الطموحة لنظام العروض الاستراتيجية'
                : 'Ambitious targets for the strategic presentation system'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="metrics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="metric-card text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                <div className="metric-value text-3xl font-bold text-primary mb-2">&lt;5min</div>
                <div className="metric-label text-sm text-muted-foreground">
                  {isArabic ? 'وقت التوليد' : 'Generation Time'}
                </div>
              </div>
              <div className="metric-card text-center p-4 bg-gradient-to-br from-brand-success/10 to-brand-success/5 rounded-lg">
                <div className="metric-value text-3xl font-bold text-brand-success mb-2">+70%</div>
                <div className="metric-label text-sm text-muted-foreground">
                  {isArabic ? 'معدل التحويل' : 'Conversion Rate'}
                </div>
              </div>
              <div className="metric-card text-center p-4 bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 rounded-lg">
                <div className="metric-value text-3xl font-bold text-brand-accent mb-2">+95%</div>
                <div className="metric-label text-sm text-muted-foreground">
                  {isArabic ? 'دقة المحتوى' : 'Content Accuracy'}
                </div>
              </div>
              <div className="metric-card text-center p-4 bg-gradient-to-br from-brand-warning/10 to-brand-warning/5 rounded-lg">
                <div className="metric-value text-3xl font-bold text-brand-warning mb-2">SAR 3.75M+</div>
                <div className="metric-label text-sm text-muted-foreground">
                  {isArabic ? 'الإيرادات السنوية' : 'Annual Revenue'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="cta-card bg-gradient-to-r from-primary/10 via-brand-accent/10 to-primary/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">
                {isArabic ? '🚀 ابدأ بتحويل تقييماتك إلى صفقات' : '🚀 Start Converting Assessments into Deals'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {isArabic 
                  ? 'استخدم نظام العروض الاستراتيجية لتحويل كل تقييم إلى فرصة عمل ذهبية'
                  : 'Use the strategic presentation system to convert every assessment into a golden business opportunity'}
              </p>
              <Button size="lg" className="px-8">
                <FileText className="h-5 w-5 mr-2" />
                {isArabic ? 'ابدأ الآن' : 'Get Started Now'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StrategicPresentationCenter;