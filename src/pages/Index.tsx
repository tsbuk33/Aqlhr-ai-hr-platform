import { SimpleMetricCard } from "@/components/SimpleMetricCard";
import { SimpleRecentActivity } from "@/components/SimpleRecentActivity";
import { OfficialLogos } from "@/components/OfficialLogos";
import { CompanyDataUpload } from "@/components/CompanyDataUpload";
import { KPIExplanationCard } from "@/components/KPIExplanationCard";
import { SaudiHeroSection } from "@/components/saudi/SaudiHeroSection";
import { AnnouncementsSection } from "@/components/saudi/AnnouncementsSection";
import { VirtualAssistant } from "@/components/saudi/VirtualAssistant";
import { 
  Users, 
  Calendar, 
  FileText, 
  Clock, 
  BookOpen, 
  Check, 
  ArrowUp, 
  Brain, 
  HelpCircle, 
  TrendingDown, 
  ArrowDownUp, 
  UserPlus, 
  Crown, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  AlertTriangle, 
  Star, 
  TrendingUp, 
  DollarSign, 
  UserCheck, 
  Activity, 
  Zap, 
  Award, 
  Eye, 
  Heart, 
  Shield, 
  BarChart3,
  Smartphone 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link } from "react-router-dom";
import { useSimpleLanguage } from "@/contexts/SimpleLanguageContext";
import { kpiExplanations } from "@/data/kpiExplanations";
import { useState } from "react";
import { useAIDashboard } from "@/hooks/useAIDashboard";

const Index = () => {
  const { isArabic } = useSimpleLanguage();
  const aiMetrics = useAIDashboard();
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [isPredictiveOpen, setIsPredictiveOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isProcessOpen, setIsProcessOpen] = useState(false);

  return (
    <div className={`min-h-screen bg-background ${isArabic ? 'rtl-container' : 'ltr-container'}`}>
      {/* Saudi Government Hero Section */}
      <SaudiHeroSection />
      
      {/* Executive Header */}
      <div className="bg-surface border-b border-border dark:bg-surface dark:border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
            <div className={`${isArabic ? 'text-right' : ''}`}>
              <h1 className="text-3xl font-bold text-foreground dark:text-foreground mb-2">
                {isArabic ? 'نظام إيه كيو إل إتش ار للموارد البشرية' : 'AqlHR Executive Dashboard'}
              </h1>
              <p className="text-foreground-muted dark:text-foreground-muted text-lg">
                {isArabic ? 'منصة ذكية ومتطورة لإدارة الموارد البشرية في المملكة العربية السعودية' : 'Advanced Intelligent Platform for Human Resources Management in Saudi Arabia'}
              </p>
            </div>
            <div className={`flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-status-success rounded-full"></div>
                <span className="text-sm text-foreground-muted dark:text-foreground-muted">
                  {isArabic ? 'جميع الأنظمة تعمل' : 'All Systems Operational'}
                </span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <Brain className="h-4 w-4" />
                    {isArabic ? 'رؤى الذكاء الاصطناعي' : 'AI Insights'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className={`text-lg font-semibold ${isArabic ? 'text-right' : ''}`}>
                      {isArabic ? 'رؤى الذكاء الاصطناعي للموارد البشرية' : 'AI-Powered HR Insights'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className={`p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg ${isArabic ? 'text-right' : ''}`}>
                      <h4 className="font-semibold mb-2">
                        {isArabic ? 'وظائف لوحة الموارد البشرية الرئيسية:' : 'Key HR Dashboard Functions:'}
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• {isArabic ? 'مراقبة الموارد البشرية - تتبع المقاييس الرئيسية وتحديد الاتجاهات' : 'HR Monitoring - Track key metrics and identify trends'}</li>
                        <li>• {isArabic ? 'معلومات الإدارة - رؤى حول ديناميكيات الفريق والقسم' : 'Management Information - Insights into team & department dynamics'}</li>
                        <li>• {isArabic ? 'التحليلات التنبؤية - توقع احتياجات الموارد البشرية المستقبلية' : 'Predictive Analytics - Forecast future HR needs'}</li>
                        <li>• {isArabic ? 'تحسين الأداء - تحديد فرص التحسين' : 'Performance Optimization - Identify improvement opportunities'}</li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        
        {/* Strategic Intelligence Panel - NEW TOP SECTION */}
        <section>
          <div className={`mb-8 ${isArabic ? 'text-right' : ''}`}>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isArabic ? 'لوحة الذكاء الاستراتيجي' : 'Strategic Intelligence Panel'}
            </h2>
            <p className="text-muted-foreground">
              {isArabic ? 'ذكاء تنبؤي وتحليلات استراتيجية متقدمة' : 'Predictive intelligence and advanced strategic analytics'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Workforce Forecast Accuracy - Teal */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border border-teal-200 p-6 hover:shadow-lg transition-all duration-300">
              <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-teal-500/10 rounded-lg">
                  <Target className="h-6 w-6 text-teal-600" />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-teal-600 hover:bg-teal-100">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{isArabic ? 'دقة التنبؤ بالقوى العاملة' : 'Workforce Forecast Accuracy'}</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                      {isArabic 
                        ? 'مقياس دقة التنبؤ بالاحتياجات المستقبلية للقوى العاملة. نسبة مئوية تشير إلى مدى دقة تنبؤات النظام للتوظيف والاستقالات.'
                        : 'Measures how accurately the system predicts future workforce needs. Percentage showing how precise our hiring and turnover forecasts are.'
                      }
                    </p>
                  </DialogContent>
                </Dialog>
              </div>
              <div className={`${isArabic ? 'text-right' : ''}`}>
                <h3 className="text-sm font-medium text-teal-800 mb-1">
                  {isArabic ? 'دقة التنبؤ بالقوى العاملة' : 'Workforce Forecast Accuracy'}
                </h3>
                <p className="text-3xl font-bold text-teal-700 mb-2">
                  {aiMetrics.loading ? '...' : `${aiMetrics.workforceForecasting}%`}
                </p>
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    +2.1%
                  </span>
                  <span className="text-xs text-teal-600">
                    {isArabic ? 'تحسن الشهر الماضي' : 'vs last month'}
                  </span>
                </div>
              </div>
            </div>

            {/* Talent Pipeline Strength - Navy */}
            <div className="bg-gradient-to-br from-blue-900/10 to-blue-800/20 rounded-xl border border-blue-800/30 p-6 hover:shadow-lg transition-all duration-300">
              <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-blue-900/10 rounded-lg">
                  <Star className="h-6 w-6 text-blue-800" />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-blue-800 hover:bg-blue-100">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{isArabic ? 'قوة خط المواهب' : 'Talent Pipeline Strength'}</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                      {isArabic 
                        ? 'عدد المرشحين ذوي الإمكانات العالية المؤهلين للترقية أو التوظيف في المناصب الأساسية. يساعد في التخطيط للخلافة.'
                        : 'Number of high-potential candidates qualified for promotion or hiring in key positions. Helps with succession planning.'
                      }
                    </p>
                  </DialogContent>
                </Dialog>
              </div>
              <div className={`${isArabic ? 'text-right' : ''}`}>
                <h3 className="text-sm font-medium text-blue-900 mb-1">
                  {isArabic ? 'قوة خط المواهب' : 'Talent Pipeline Strength'}
                </h3>
                <p className="text-3xl font-bold text-blue-800 mb-2">
                  {aiMetrics.loading ? '...' : aiMetrics.talentPipelineStrength}
                </p>
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {isArabic ? 'عالي الإمكانات' : 'high-potential'}
                  </span>
                  <span className="text-xs text-blue-800">
                    {isArabic ? 'مرشحين' : 'candidates'}
                  </span>
                </div>
              </div>
            </div>

            {/* Employee Experience Score - Coral */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200 p-6 hover:shadow-lg transition-all duration-300">
              <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:bg-red-100">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{isArabic ? 'نقاط تجربة الموظف' : 'Employee Experience Score'}</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                      {isArabic 
                        ? 'مقياس شامل لرضا الموظفين يتضمن بيئة العمل، والتطوير المهني، والتوازن بين العمل والحياة من 1-10.'
                        : 'Comprehensive employee satisfaction metric covering work environment, career development, and work-life balance on a 1-10 scale.'
                      }
                    </p>
                  </DialogContent>
                </Dialog>
              </div>
              <div className={`${isArabic ? 'text-right' : ''}`}>
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  {isArabic ? 'نقاط تجربة الموظف' : 'Employee Experience Score'}
                </h3>
                <p className="text-3xl font-bold text-red-600 mb-2">
                  {aiMetrics.loading ? '...' : `${(aiMetrics.employeeExperience / 10).toFixed(1)}/10`}
                </p>
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    +0.3
                  </span>
                  <span className="text-xs text-red-600">
                    {isArabic ? 'تحسن الربع' : 'quarterly improvement'}
                  </span>
                </div>
              </div>
            </div>

            {/* Predictive Risk Index - Red */}
            <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl border border-red-300 p-6 hover:shadow-lg transition-all duration-300">
              <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-red-600/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600 hover:bg-red-200">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{isArabic ? 'مؤشر المخاطر التنبؤي' : 'Predictive Risk Index'}</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                      {isArabic 
                        ? 'عدد الموظفين المعرضين لخطر الاستقالة بناءً على تحليل الذكاء الاصطناعي للأداء والرضا والسلوك.'
                        : 'Number of employees at risk of leaving based on AI analysis of performance, satisfaction, and behavioral patterns.'
                      }
                    </p>
                  </DialogContent>
                </Dialog>
              </div>
              <div className={`${isArabic ? 'text-right' : ''}`}>
                <h3 className="text-sm font-medium text-red-900 mb-1">
                  {isArabic ? 'مؤشر المخاطر التنبؤي' : 'Predictive Risk Index'}
                </h3>
                <p className="text-3xl font-bold text-red-700 mb-2">
                  {aiMetrics.loading ? '...' : aiMetrics.retentionRisk}
                </p>
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded-full">
                    {isArabic ? 'عالي المخاطر' : 'high-risk'}
                  </span>
                  <span className="text-xs text-red-700">
                    {isArabic ? 'موظفين' : 'employees'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Executive Summary - Key Metrics */}
        <section>
          <div className={`mb-8 ${isArabic ? 'text-right' : ''}`}>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isArabic ? 'الملخص التنفيذي' : 'Executive Summary'}
            </h2>
            <p className="text-muted-foreground">
              {isArabic ? 'نظرة عامة على مؤشرات الأداء الرئيسية للموارد البشرية' : 'Overview of key human resources performance indicators'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group">
              <div className="bg-surface dark:bg-surface rounded-xl border border-border dark:border-border p-6 hover:shadow-lg transition-all duration-300">
                <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                    <Users className="h-6 w-6 text-primary dark:text-primary" />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                          {isArabic ? kpiExplanations.totalEmployees.titleAr : kpiExplanations.totalEmployees.titleEn}
                        </DialogTitle>
                      </DialogHeader>
                      <KPIExplanationCard explanation={kpiExplanations.totalEmployees} />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className={`${isArabic ? 'text-right' : ''}`}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {isArabic ? 'إجمالي الموظفين' : 'Total Employees'}
                  </h3>
                  <p className="text-3xl font-bold text-foreground mb-2">
                    {aiMetrics.loading ? '...' : aiMetrics.totalEmployees.toLocaleString()}
                  </p>
                  <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs px-2 py-1 bg-status-success/10 text-status-success rounded-full">
                      +12%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isArabic ? 'من الشهر الماضي' : 'vs last month'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300">
                <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Brain className="h-6 w-6 text-accent" />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                          {isArabic ? kpiExplanations.aiProcesses.titleAr : kpiExplanations.aiProcesses.titleEn}
                        </DialogTitle>
                      </DialogHeader>
                      <KPIExplanationCard explanation={kpiExplanations.aiProcesses} />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className={`${isArabic ? 'text-right' : ''}`}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {isArabic ? 'عمليات الذكاء الاصطناعي' : 'AI Processes'}
                  </h3>
                  <p className="text-3xl font-bold text-foreground mb-2">
                    {aiMetrics.loading ? '...' : aiMetrics.aiRecommendations}
                  </p>
                  <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs px-2 py-1 bg-status-success/10 text-status-success rounded-full">
                      +24
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isArabic ? 'أدوات نشطة' : 'active tools'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300">
                <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-brand-secondary/10 rounded-lg">
                    <FileText className="h-6 w-6 text-brand-secondary" />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                          {isArabic ? kpiExplanations.govIntegrations.titleAr : kpiExplanations.govIntegrations.titleEn}
                        </DialogTitle>
                      </DialogHeader>
                      <KPIExplanationCard explanation={kpiExplanations.govIntegrations} />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className={`${isArabic ? 'text-right' : ''}`}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {isArabic ? 'التكاملات الحكومية' : 'Gov Integrations'}
                  </h3>
                  <p className="text-3xl font-bold text-foreground mb-2">
                    {aiMetrics.loading ? '...' : aiMetrics.syncEventsToday}
                  </p>
                  <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs px-2 py-1 bg-status-success/10 text-status-success rounded-full">
                      {isArabic ? 'مكتمل' : 'Complete'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isArabic ? '22 حكومي + 24 أداة' : '22 Gov + 24 Tools'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300">
                <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-status-success/10 rounded-lg">
                    <ArrowUp className="h-6 w-6 text-status-success" />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                          {isArabic ? kpiExplanations.complianceScore.titleAr : kpiExplanations.complianceScore.titleEn}
                        </DialogTitle>
                      </DialogHeader>
                      <KPIExplanationCard explanation={kpiExplanations.complianceScore} />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className={`${isArabic ? 'text-right' : ''}`}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {isArabic ? 'نقاط الامتثال' : 'Compliance Score'}
                  </h3>
                  <p className="text-3xl font-bold text-foreground mb-2">
                    {aiMetrics.loading ? '...' : `${aiMetrics.complianceScore}%`}
                  </p>
                  <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs px-2 py-1 bg-status-success/10 text-status-success rounded-full">
                      +2.1%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isArabic ? 'الامتثال التنظيمي' : 'regulatory compliance'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Executive Intelligence Center Integration */}
        <section className="mt-16">
          <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border-primary/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
            <CardHeader className="relative z-10">
              <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                    <Crown className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className={isArabic ? 'text-right' : ''}>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {isArabic ? 'مركز الذكاء التنفيذي' : 'Executive Intelligence Center'}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {isArabic ? 'رؤى استراتيجية متقدمة عبر جميع وحدات الموارد البشرية' : 'Advanced strategic insights across all HR modules'}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-600 border-yellow-500/30">
                  {isArabic ? 'متميز' : 'PREMIUM'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-primary/10">
                  <div className={`flex items-center gap-2 mb-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {isArabic ? 'تحليلات تنفيذية' : 'Executive Analytics'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? 'رؤى متقدمة للقيادة العليا' : 'Advanced insights for senior leadership'}
                  </p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-primary/10">
                  <div className={`flex items-center gap-2 mb-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {isArabic ? 'ذكاء اصطناعي متقدم' : 'Advanced AI'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? 'تحليلات ذكية وتوصيات فورية' : 'Smart analytics and real-time recommendations'}
                  </p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-primary/10">
                  <div className={`flex items-center gap-2 mb-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {isArabic ? 'دعم القرارات' : 'Decision Support'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? 'دعم اتخاذ القرارات الاستراتيجية' : 'Strategic decision-making support'}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <Link to="/executive-center">
                  <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
                    <Crown className="h-4 w-4 mr-2" />
                    {isArabic ? 'فتح المركز التنفيذي' : 'Open Executive Center'}
                  </Button>
                </Link>
                <Link to="/executive/mobile">
                  <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg">
                    <Smartphone className="h-4 w-4 mr-2" />
                    {isArabic ? 'التطبيق التنفيذي المحمول' : 'Mobile Executive App'}
                  </Button>
                </Link>
                <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <Zap className="h-3 w-3 text-primary" />
                  <span>{isArabic ? 'متاح في جميع الوحدات' : 'Available across all modules'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Operational Metrics */}
        <section>
          <div className={`mb-8 ${isArabic ? 'text-right' : ''}`}>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isArabic ? 'المؤشرات التشغيلية' : 'Operational Metrics'}
            </h2>
            <p className="text-muted-foreground">
              {isArabic ? 'مؤشرات الأداء التشغيلي الرئيسية' : 'Key operational performance indicators'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group">
              <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300">
                <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-brand-primary/10 rounded-lg">
                    <Calendar className="h-6 w-6 text-brand-primary" />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                          {isArabic ? kpiExplanations.saudizationRate.titleAr : kpiExplanations.saudizationRate.titleEn}
                        </DialogTitle>
                      </DialogHeader>
                      <KPIExplanationCard explanation={kpiExplanations.saudizationRate} />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className={`${isArabic ? 'text-right' : ''}`}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {isArabic ? 'معدل السعودة' : 'Saudization Rate'}
                  </h3>
                  <p className="text-3xl font-bold text-foreground mb-2">67.2%</p>
                  <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs px-2 py-1 bg-status-success/10 text-status-success rounded-full">
                      +1.8%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isArabic ? 'النطاق الأخضر' : 'Green Nitaqat'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* HSE Safety Score KPI */}
            <div className="relative group">
              <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300">
                <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-orange-500/10 rounded-lg">
                    <Shield className="h-6 w-6 text-orange-600" />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                          {isArabic ? kpiExplanations.hseSafetyScore.titleAr : kpiExplanations.hseSafetyScore.titleEn}
                        </DialogTitle>
                      </DialogHeader>
                      <KPIExplanationCard explanation={kpiExplanations.hseSafetyScore} />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className={`${isArabic ? 'text-right' : ''}`}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {isArabic ? 'نقاط السلامة والصحة المهنية' : 'HSE Safety Score'}
                  </h3>
                  <p className="text-3xl font-bold text-foreground mb-2">92.1%</p>
                  <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs px-2 py-1 bg-status-success/10 text-status-success rounded-full">
                      +3.2%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isArabic ? 'ممتاز' : 'Excellent'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300">
                <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                          {isArabic ? kpiExplanations.activeUsers.titleAr : kpiExplanations.activeUsers.titleEn}
                        </DialogTitle>
                      </DialogHeader>
                      <KPIExplanationCard explanation={kpiExplanations.activeUsers} />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className={`${isArabic ? 'text-right' : ''}`}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {isArabic ? 'المستخدمون النشطون' : 'Active Users'}
                  </h3>
                  <p className="text-3xl font-bold text-foreground mb-2">1,847</p>
                  <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs px-2 py-1 bg-status-success/10 text-status-success rounded-full">
                      +156
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isArabic ? 'الخدمة الذاتية' : 'self-service'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300">
                <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-brand-secondary/10 rounded-lg">
                    <FileText className="h-6 w-6 text-brand-secondary" />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                          {isArabic ? kpiExplanations.documentsProcessed.titleAr : kpiExplanations.documentsProcessed.titleEn}
                        </DialogTitle>
                      </DialogHeader>
                      <KPIExplanationCard explanation={kpiExplanations.documentsProcessed} />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className={`${isArabic ? 'text-right' : ''}`}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {isArabic ? 'المستندات المعالجة' : 'Documents Processed'}
                  </h3>
                  <p className="text-3xl font-bold text-foreground mb-2">15,678</p>
                  <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs px-2 py-1 bg-status-success/10 text-status-success rounded-full">
                      +1,234
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isArabic ? 'بالذكاء الاصطناعي' : 'AI-powered'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300">
                <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-brand-warning/10 rounded-lg">
                    <BookOpen className="h-6 w-6 text-brand-warning" />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                          {isArabic ? kpiExplanations.trainingHours.titleAr : kpiExplanations.trainingHours.titleEn}
                        </DialogTitle>
                      </DialogHeader>
                      <KPIExplanationCard explanation={kpiExplanations.trainingHours} />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className={`${isArabic ? 'text-right' : ''}`}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {isArabic ? 'ساعات التدريب' : 'Training Hours'}
                  </h3>
                  <p className="text-3xl font-bold text-foreground mb-2">1,247</p>
                  <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs px-2 py-1 bg-status-success/10 text-status-success rounded-full">
                      +89{isArabic ? ' ساعة' : 'h'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isArabic ? 'تطوير المهارات' : 'skills development'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HR Analytics - Professional Layout */}
        <section>
          <div className={`mb-8 ${isArabic ? 'text-right' : ''}`}>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isArabic ? 'تحليلات الموارد البشرية المتقدمة' : 'Advanced HR Analytics'}
            </h2>
            <p className="text-muted-foreground">
              {isArabic ? 'تحليلات شاملة لأداء الموارد البشرية والاتجاهات' : 'Comprehensive human resources performance analytics and trends'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Turnover Rate Card */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-6 hover:shadow-lg transition-all duration-300">
              <div className={`flex items-center justify-between mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-orange-600" />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-100">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                        {isArabic ? kpiExplanations.turnoverRate.titleAr : kpiExplanations.turnoverRate.titleEn}
                      </DialogTitle>
                    </DialogHeader>
                    <KPIExplanationCard explanation={kpiExplanations.turnoverRate} />
                  </DialogContent>
                </Dialog>
              </div>
              <div className={`${isArabic ? 'text-right' : ''}`}>
                <h3 className="text-lg font-semibold text-orange-900 mb-1">
                  {isArabic ? 'معدل دوران الموظفين' : 'Turnover Rate'}
                </h3>
                <p className="text-4xl font-bold text-orange-700 mb-3">8.2%</p>
                <p className="text-sm text-orange-600 mb-3">
                  {isArabic ? 'دوران الموظفين هذا العام' : 'Employee turnover this year'}
                </p>
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    -1.3%
                  </span>
                  <span className="text-sm text-orange-600">
                    {isArabic ? 'تحسن من العام الماضي' : 'improvement from last year'}
                  </span>
                </div>
              </div>
            </div>

            {/* Women Hiring Rate by Department */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6 hover:shadow-lg transition-all duration-300">
              <div className={`flex items-center justify-between mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <UserPlus className="h-6 w-6 text-purple-600" />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-100">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                        {isArabic ? kpiExplanations.womenHiringRate.titleAr : kpiExplanations.womenHiringRate.titleEn}
                      </DialogTitle>
                    </DialogHeader>
                    <KPIExplanationCard explanation={kpiExplanations.womenHiringRate} />
                  </DialogContent>
                </Dialog>
              </div>
              <div className={`${isArabic ? 'text-right' : ''}`}>
                <h3 className="text-lg font-semibold text-purple-900 mb-1">
                  {isArabic ? 'معدل توظيف النساء حسب القسم' : 'Women Hiring Rate by Dept'}
                </h3>
                <p className="text-4xl font-bold text-purple-700 mb-3">34.2%</p>
                <p className="text-sm text-purple-600 mb-3">
                  {isArabic ? 'تقنية المعلومات: 42% | الموارد البشرية: 68% | المالية: 29%' : 'IT: 42% | HR: 68% | Finance: 29%'}
                </p>
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    +4.8%
                  </span>
                  <span className="text-sm text-purple-600">
                    {isArabic ? 'زيادة هذا العام' : 'increase this year'}
                  </span>
                </div>
              </div>
            </div>

            {/* Women Turnover by Department */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-6 hover:shadow-lg transition-all duration-300">
              <div className={`flex items-center justify-between mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <ArrowDownUp className="h-6 w-6 text-emerald-600" />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-100">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                        {isArabic ? kpiExplanations.womenTurnoverRate.titleAr : kpiExplanations.womenTurnoverRate.titleEn}
                      </DialogTitle>
                    </DialogHeader>
                    <KPIExplanationCard explanation={kpiExplanations.womenTurnoverRate} />
                  </DialogContent>
                </Dialog>
              </div>
              <div className={`${isArabic ? 'text-right' : ''}`}>
                <h3 className="text-lg font-semibold text-emerald-900 mb-1">
                  {isArabic ? 'معدل دوران النساء حسب القسم' : 'Women Turnover by Dept'}
                </h3>
                <p className="text-4xl font-bold text-emerald-700 mb-3">6.1%</p>
                <p className="text-sm text-emerald-600 mb-3">
                  {isArabic ? 'متوسط عبر جميع الأقسام' : 'Average across all departments'}
                </p>
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    -2.3%
                  </span>
                  <span className="text-sm text-emerald-600">
                    {isArabic ? 'تحسن من العام الماضي' : 'improvement from last year'}
                  </span>
                </div>
              </div>
            </div>

            {/* Women in Leadership */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 p-6 hover:shadow-lg transition-all duration-300">
              <div className={`flex items-center justify-between mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 bg-amber-500/10 rounded-lg">
                  <Crown className="h-6 w-6 text-amber-600" />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-amber-600 hover:bg-amber-100">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                        {isArabic ? kpiExplanations.womenInLeadership.titleAr : kpiExplanations.womenInLeadership.titleEn}
                      </DialogTitle>
                    </DialogHeader>
                    <KPIExplanationCard explanation={kpiExplanations.womenInLeadership} />
                  </DialogContent>
                </Dialog>
              </div>
              <div className={`${isArabic ? 'text-right' : ''}`}>
                <h3 className="text-lg font-semibold text-amber-900 mb-1">
                  {isArabic ? 'النساء في المناصب القيادية' : 'Women in Leadership'}
                </h3>
                <p className="text-4xl font-bold text-amber-700 mb-3">28.6%</p>
                <p className="text-sm text-amber-600 mb-3">
                  {isArabic ? 'من إجمالي المناصب القيادية' : 'Of total leadership positions'}
                </p>
                <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    +5.2%
                  </span>
                  <span className="text-sm text-amber-600">
                    {isArabic ? 'زيادة هذا العام' : 'increase this year'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Predictive Analytics - NEW EXPANDABLE SECTION */}
        <Collapsible open={isPredictiveOpen} onOpenChange={setIsPredictiveOpen}>
          <section>
            <div className={`mb-8 ${isArabic ? 'text-right' : ''}`}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className={`flex items-center gap-2 text-2xl font-bold text-foreground mb-2 hover:bg-transparent p-0 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  {isArabic ? 'التحليلات التنبؤية' : 'Predictive Analytics'}
                  {isPredictiveOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </CollapsibleTrigger>
              <p className="text-muted-foreground">
                {isArabic ? 'ذكاء تنبؤي متقدم لاتخاذ قرارات استراتيجية' : 'Advanced predictive intelligence for strategic decisions'}
              </p>
            </div>
            
            <CollapsibleContent className="space-y-8">
              {/* Retention Intelligence */}
              <div>
                <h3 className={`text-lg font-semibold text-foreground mb-4 ${isArabic ? 'text-right' : ''}`}>
                  {isArabic ? 'ذكاء الاحتفاظ بالموظفين' : 'Retention Intelligence'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-900/10 to-blue-800/20 rounded-xl border border-blue-800/30 p-6">
                    <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <div className="p-3 bg-blue-900/10 rounded-lg">
                        <Brain className="h-6 w-6 text-blue-800" />
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-blue-800 hover:bg-blue-100">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{isArabic ? 'توقع الدوران' : 'Turnover Prediction'}</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-gray-600">
                            {isArabic 
                              ? 'دقة خوارزمية الذكاء الاصطناعي في التنبؤ بالموظفين المعرضين لخطر الاستقالة بناءً على البيانات التاريخية والسلوكية.'
                              : 'Accuracy of AI algorithm in predicting which employees are at risk of leaving based on historical and behavioral data.'
                            }
                          </p>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className={`${isArabic ? 'text-right' : ''}`}>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        {isArabic ? 'توقع الدوران' : 'Turnover Prediction'}
                      </h4>
                      <p className="text-3xl font-bold text-blue-800 mb-2">89.2%</p>
                      <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {isArabic ? 'دقة' : 'accuracy'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-6">
                    <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <Activity className="h-6 w-6 text-emerald-600" />
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-emerald-600 hover:bg-emerald-100">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{isArabic ? 'نجاح التدخل' : 'Intervention Success'}</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-gray-600">
                            {isArabic 
                              ? 'نسبة نجاح التدخلات الاستباقية في الاحتفاظ بالموظفين المعرضين لخطر الاستقالة مثل زيادة الراتب أو تغيير المنصب.'
                              : 'Success rate of proactive interventions in retaining employees at risk of leaving, such as salary increases or role changes.'
                            }
                          </p>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className={`${isArabic ? 'text-right' : ''}`}>
                      <h4 className="text-sm font-medium text-emerald-900 mb-1">
                        {isArabic ? 'نجاح التدخل' : 'Intervention Success'}
                      </h4>
                      <p className="text-3xl font-bold text-emerald-700 mb-2">73%</p>
                      <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          {isArabic ? 'احتفاظ' : 'retention'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 p-6">
                    <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <div className="p-3 bg-yellow-500/10 rounded-lg">
                        <DollarSign className="h-6 w-6 text-yellow-600" />
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-yellow-600 hover:bg-yellow-100">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{isArabic ? 'تجنب التكاليف' : 'Cost Avoidance'}</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-gray-600">
                            {isArabic 
                              ? 'المبلغ المالي الذي تم توفيره من خلال التدخلات الذكية للاحتفاظ بالموظفين بدلاً من تكلفة التوظيف الجديد.'
                              : 'Financial amount saved through smart interventions to retain employees instead of new hiring costs.'
                            }
                          </p>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className={`${isArabic ? 'text-right' : ''}`}>
                      <h4 className="text-sm font-medium text-yellow-900 mb-1">
                        {isArabic ? 'تجنب التكاليف' : 'Cost Avoidance'}
                      </h4>
                      <p className="text-3xl font-bold text-yellow-700 mb-2">SAR 1.8M</p>
                      <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          {isArabic ? 'محفوظ' : 'saved'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6">
                    <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <div className="p-3 bg-gray-500/10 rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-gray-600" />
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-600 hover:bg-gray-100">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{isArabic ? 'توزيع المخاطر' : 'Risk Distribution'}</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-gray-600">
                            {isArabic 
                              ? 'توزيع الموظفين حسب مستوى مخاطر الاستقالة: منخفض (156)، متوسط (89)، عالي (23). يساعد في تحديد أولويات التدخل.'
                              : 'Distribution of employees by turnover risk level: low (156), medium (89), high (23). Helps prioritize intervention efforts.'
                            }
                          </p>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className={`${isArabic ? 'text-right' : ''}`}>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {isArabic ? 'توزيع المخاطر' : 'Risk Distribution'}
                      </h4>
                      <p className="text-lg font-bold text-gray-700 mb-2">156 | 89 | 23</p>
                      <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          {isArabic ? 'منخفض' : 'low'}
                        </span>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                          {isArabic ? 'متوسط' : 'med'}
                        </span>
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                          {isArabic ? 'عالي' : 'high'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Retention Card - Duplicate */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                  <div className="bg-gradient-to-br from-blue-900/10 to-blue-800/20 rounded-xl border border-blue-800/30 p-6">
                    <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <div className="p-3 bg-blue-900/10 rounded-lg">
                        <Brain className="h-6 w-6 text-blue-800" />
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-blue-800 hover:bg-blue-100">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{isArabic ? 'توقع الدوران للسعوديين' : 'Saudi Turnover Prediction'}</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-gray-600">
                            {isArabic 
                              ? 'دقة خوارزمية الذكاء الاصطناعي في التنبؤ بالموظفين السعوديين المعرضين لخطر الاستقالة بناءً على البيانات التاريخية والسلوكية ومشاركة العمل.'
                              : 'Accuracy of AI algorithm in predicting which Saudi employees are at risk of leaving based on historical data, behavioral patterns, and work engagement metrics.'
                            }
                          </p>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className={`${isArabic ? 'text-right' : ''}`}>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        {isArabic ? 'السعوديين قد يتركون الشركة' : 'Saudis might leave the company'}
                      </h4>
                      <p className="text-3xl font-bold text-blue-800 mb-2">
                        {aiMetrics.loading ? '...' : `${Math.round((aiMetrics.retentionRisk * 0.7))}%`}
                      </p>
                      <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {isArabic ? 'تحليل تنبؤي' : 'predictive analysis'}
                        </span>
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                          {isArabic ? 'مشاركة العمل' : 'work engagement'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Intelligence */}
              <div>
                <h3 className={`text-lg font-semibold text-foreground mb-4 ${isArabic ? 'text-right' : ''}`}>
                  {isArabic ? 'ذكاء المهارات' : 'Skills Intelligence'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
                    <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <div className="p-3 bg-purple-500/10 rounded-lg">
                        <Target className="h-6 w-6 text-purple-600" />
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-purple-600 hover:bg-purple-100">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{isArabic ? 'تغطية فجوة المهارات' : 'Skills Gap Coverage'}</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-gray-600">
                            {isArabic 
                              ? 'نسبة تغطية الفجوات في المهارات المطلوبة في الشركة من خلال التدريب الداخلي والتوظيف الخارجي.'
                              : 'Percentage of required skill gaps filled through internal training and external hiring.'
                            }
                          </p>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className={`${isArabic ? 'text-right' : ''}`}>
                      <h4 className="text-sm font-medium text-purple-900 mb-1">
                        {isArabic ? 'تغطية فجوة المهارات' : 'Skills Gap Coverage'}
                      </h4>
                      <p className="text-3xl font-bold text-purple-700 mb-2">78.4%</p>
                      <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          +5.2%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
                    <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <div className="p-3 bg-blue-500/10 rounded-lg">
                        <UserCheck className="h-6 w-6 text-blue-600" />
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{isArabic ? 'التنقل الداخلي' : 'Internal Mobility'}</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-gray-600">
                            {isArabic 
                              ? 'نسبة الموظفين الذين انتقلوا إلى مناصب أخرى داخل الشركة (ترقية أو نقل) خلال العام الماضي.'
                              : 'Percentage of employees who moved to different positions within the company (promotions or transfers) in the past year.'
                            }
                          </p>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className={`${isArabic ? 'text-right' : ''}`}>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        {isArabic ? 'التنقل الداخلي' : 'Internal Mobility'}
                      </h4>
                      <p className="text-3xl font-bold text-blue-700 mb-2">34.7%</p>
                      <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          +8.1%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-6">
                    <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-emerald-600" />
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-emerald-600 hover:bg-emerald-100">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{isArabic ? 'عائد التعلم' : 'Learning ROI'}</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-gray-600">
                            {isArabic 
                              ? 'عائد الاستثمار في التدريب والتطوير المهني. يقاس بزيادة الإنتاجية والأداء مقابل تكلفة التدريب.'
                              : 'Return on investment in training and professional development. Measured by productivity and performance gains vs. training costs.'
                            }
                          </p>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className={`${isArabic ? 'text-right' : ''}`}>
                      <h4 className="text-sm font-medium text-emerald-900 mb-1">
                        {isArabic ? 'عائد التعلم' : 'Learning ROI'}
                      </h4>
                      <p className="text-3xl font-bold text-emerald-700 mb-2">280%</p>
                      <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          {isArabic ? 'عائد' : 'return'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-6">
                    <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <div className="p-3 bg-orange-500/10 rounded-lg">
                        <Zap className="h-6 w-6 text-orange-600" />
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-orange-600 hover:bg-orange-100">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{isArabic ? 'معدل الابتكار' : 'Innovation Rate'}</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-gray-600">
                            {isArabic 
                              ? 'متوسط عدد الأفكار والاقتراحات المبتكرة لكل موظف سنوياً. يقيس مستوى الإبداع والمشاركة في التطوير.'
                              : 'Average number of innovative ideas and suggestions per employee annually. Measures creativity and engagement in development.'
                            }
                          </p>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className={`${isArabic ? 'text-right' : ''}`}>
                      <h4 className="text-sm font-medium text-orange-900 mb-1">
                        {isArabic ? 'معدل الابتكار' : 'Innovation Rate'}
                      </h4>
                      <p className="text-3xl font-bold text-orange-700 mb-2">2.7</p>
                      <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                          {isArabic ? 'أفكار/موظف' : 'ideas/employee'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </section>
        </Collapsible>

        {/* Advanced Compliance - NEW SECTION */}
        <Collapsible open={isComplianceOpen} onOpenChange={setIsComplianceOpen}>
          <section>
            <div className={`mb-8 ${isArabic ? 'text-right' : ''}`}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className={`flex items-center gap-2 text-2xl font-bold text-foreground mb-2 hover:bg-transparent p-0 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  {isArabic ? 'الامتثال المتقدم' : 'Advanced Compliance'}
                  {isComplianceOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </CollapsibleTrigger>
              <p className="text-muted-foreground">
                {isArabic ? 'مراقبة وإدارة الامتثال التنظيمي المتقدم' : 'Advanced regulatory compliance monitoring and management'}
              </p>
            </div>
            
            <CollapsibleContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl border border-red-300 p-6">
                  <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="p-3 bg-red-600/10 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600 hover:bg-red-100">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>{isArabic ? 'مخاطر انتهاء التأشيرة' : 'Visa Expiration Risk'}</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-gray-600">
                          {isArabic 
                            ? 'عدد الموظفين الذين ستنتهي صلاحية تأشيراتهم خلال 30 يوماً. يتطلب متابعة عاجلة لتجديد التأشيرات.'
                            : 'Number of employees whose visas will expire within 30 days. Requires urgent follow-up for visa renewals.'
                          }
                        </p>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className={`${isArabic ? 'text-right' : ''}`}>
                    <h4 className="text-sm font-medium text-red-900 mb-1">
                      {isArabic ? 'مخاطر انتهاء التأشيرة' : 'Visa Expiration Risk'}
                    </h4>
                    <p className="text-3xl font-bold text-red-700 mb-2">12</p>
                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded-full">
                        {isArabic ? 'خلال 30 يوم' : 'within 30 days'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-6">
                  <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="p-3 bg-emerald-500/10 rounded-lg">
                      <Shield className="h-6 w-6 text-emerald-600" />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-emerald-600 hover:bg-emerald-100">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>{isArabic ? 'توقع النطاقات' : 'Nitaqat Forecast'}</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-gray-600">
                          {isArabic 
                            ? 'التنبؤ بنطاق النطاقات (أخضر/فضي/أصفر/أحمر) للـ12 شهراً القادمة بناءً على معدل السعودة الحالي والتوقعات.'
                            : 'Prediction of Nitaqat color band (Green/Silver/Yellow/Red) for the next 12 months based on current Saudization rate and projections.'
                          }
                        </p>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className={`${isArabic ? 'text-right' : ''}`}>
                    <h4 className="text-sm font-medium text-emerald-900 mb-1">
                      {isArabic ? 'توقع النطاقات' : 'Nitaqat Forecast'}
                    </h4>
                    <p className="text-3xl font-bold text-emerald-700 mb-2">Green</p>
                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {isArabic ? '12 شهر' : '12-month'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-6">
                  <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="p-3 bg-orange-500/10 rounded-lg">
                      <DollarSign className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className={`${isArabic ? 'text-right' : ''}`}>
                    <h4 className="text-sm font-medium text-orange-900 mb-1">
                      {isArabic ? 'مخاطر الغرامات' : 'Penalty Risk'}
                    </h4>
                    <p className="text-3xl font-bold text-orange-700 mb-2">SAR 890K</p>
                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                        {isArabic ? 'تعرض' : 'exposure'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 p-6">
                  <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="p-3 bg-yellow-500/10 rounded-lg">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className={`${isArabic ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <h4 className="text-sm font-medium text-yellow-900">
                        {isArabic ? 'عائد الامتثال' : 'Compliance ROI'}
                      </h4>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-0 h-auto text-yellow-600 hover:text-yellow-700">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{isArabic ? 'عائد الامتثال' : 'Compliance ROI'}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              {isArabic ? 'عائد الاستثمار من تطبيق معايير الامتثال والحوكمة' : 'Return on investment from implementing compliance and governance standards'}
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-3xl font-bold text-yellow-700 mb-2">SAR 3.2</p>
                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                        {isArabic ? 'محفوظ لكل 1 ريال' : 'saved per SAR 1'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </section>
        </Collapsible>

        {/* Employee Experience - NEW SECTION */}
        <Collapsible open={isExperienceOpen} onOpenChange={setIsExperienceOpen}>
          <section>
            <div className={`mb-8 ${isArabic ? 'text-right' : ''}`}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className={`flex items-center gap-2 text-2xl font-bold text-foreground mb-2 hover:bg-transparent p-0 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  {isArabic ? 'تجربة الموظف' : 'Employee Experience'}
                  {isExperienceOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </CollapsibleTrigger>
              <p className="text-muted-foreground">
                {isArabic ? 'قياس ومراقبة تجربة الموظف والرضا الوظيفي' : 'Employee experience measurement and job satisfaction monitoring'}
              </p>
            </div>
            
            <CollapsibleContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
                  <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <Star className="h-6 w-6 text-blue-600" />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>{isArabic ? 'مؤشر الموظف الصافي' : 'Employee NPS'}</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-gray-600">
                          {isArabic 
                            ? 'مقياس رضا وولاء الموظفين. يسأل: "ما مدى احتمالية أن توصي بشركتك كمكان عمل؟" من -100 إلى +100.'
                            : 'Employee satisfaction and loyalty metric. Asks: "How likely are you to recommend your company as a workplace?" Range: -100 to +100.'
                          }
                        </p>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className={`${isArabic ? 'text-right' : ''}`}>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      {isArabic ? 'مؤشر الموظف الصافي' : 'Employee NPS'}
                    </h4>
                    <p className="text-3xl font-bold text-blue-700 mb-2">+42</p>
                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {isArabic ? 'مقابل +31 في القطاع' : 'vs +31 industry'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-6">
                  <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="p-3 bg-emerald-500/10 rounded-lg">
                      <Heart className="h-6 w-6 text-emerald-600" />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-emerald-600 hover:bg-emerald-100">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>{isArabic ? 'رضا المسار المهني' : 'Career Satisfaction'}</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-gray-600">
                          {isArabic 
                            ? 'نسبة الموظفين الراضين عن مسارهم المهني وفرص التطوير والترقية المتاحة لهم في الشركة.'
                            : 'Percentage of employees satisfied with their career path and development/promotion opportunities within the company.'
                          }
                        </p>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className={`${isArabic ? 'text-right' : ''}`}>
                    <h4 className="text-sm font-medium text-emerald-900 mb-1">
                      {isArabic ? 'رضا المسار المهني' : 'Career Satisfaction'}
                    </h4>
                    <p className="text-3xl font-bold text-emerald-700 mb-2">76%</p>
                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {isArabic ? 'راضون' : 'satisfied'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
                  <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                      <Eye className="h-6 w-6 text-purple-600" />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-purple-600 hover:bg-purple-100">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>{isArabic ? 'فعالية المدير' : 'Manager Effectiveness'}</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-gray-600">
                          {isArabic 
                            ? 'تقييم متوسط فعالية المديرين من قبل الموظفين في القيادة والتوجيه والدعم، من 1 إلى 10.'
                            : 'Average rating of manager effectiveness by employees in leadership, guidance, and support, on a scale of 1 to 10.'
                          }
                        </p>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className={`${isArabic ? 'text-right' : ''}`}>
                    <h4 className="text-sm font-medium text-purple-900 mb-1">
                      {isArabic ? 'فعالية المدير' : 'Manager Effectiveness'}
                    </h4>
                    <p className="text-3xl font-bold text-purple-700 mb-2">8.1/10</p>
                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                        {isArabic ? 'تقييم' : 'rating'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6">
                  <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="p-3 bg-gray-500/10 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-gray-600" />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-600 hover:bg-gray-100">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>{isArabic ? 'توزيع الأداء' : 'Performance Distribution'}</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-gray-600">
                          {isArabic 
                            ? 'توزيع الموظفين حسب مستوى الأداء: 14% يتجاوزون التوقعات، 78% يحققون المتطلبات، 8% تحت المستوى المطلوب.'
                            : 'Distribution of employees by performance level: 14% exceed expectations, 78% meet requirements, 8% below expectations.'
                          }
                        </p>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className={`${isArabic ? 'text-right' : ''}`}>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {isArabic ? 'توزيع الأداء' : 'Performance Distribution'}
                    </h4>
                    <p className="text-lg font-bold text-gray-700 mb-2">14% | 78%</p>
                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {isArabic ? 'يتجاوز' : 'exceeds'}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {isArabic ? 'يحقق' : 'meets'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </section>
        </Collapsible>

        {/* Process Excellence - NEW SECTION */}
        <Collapsible open={isProcessOpen} onOpenChange={setIsProcessOpen}>
          <section>
            <div className={`mb-8 ${isArabic ? 'text-right' : ''}`}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className={`flex items-center gap-2 text-2xl font-bold text-foreground mb-2 hover:bg-transparent p-0 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  {isArabic ? 'تميز العمليات' : 'Process Excellence'}
                  {isProcessOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </CollapsibleTrigger>
              <p className="text-muted-foreground">
                {isArabic ? 'تحسين العمليات والأتمتة والكفاءة التشغيلية' : 'Process optimization, automation, and operational efficiency'}
              </p>
            </div>
            
            <CollapsibleContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-6">
                  <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="p-3 bg-emerald-500/10 rounded-lg">
                      <Zap className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className={`${isArabic ? 'text-right' : ''}`}>
                    <h4 className="text-sm font-medium text-emerald-900 mb-1">
                      {isArabic ? 'عائد الأتمتة' : 'Automation ROI'}
                    </h4>
                    <p className="text-3xl font-bold text-emerald-700 mb-2">SAR 2.3M</p>
                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {isArabic ? 'مدخرات' : 'savings'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
                  <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className={`${isArabic ? 'text-right' : ''}`}>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      {isArabic ? 'مؤشر الإنتاجية' : 'Productivity Index'}
                    </h4>
                    <p className="text-3xl font-bold text-blue-700 mb-2">112</p>
                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        +8%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
                  <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                      <UserCheck className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className={`${isArabic ? 'text-right' : ''}`}>
                    <h4 className="text-sm font-medium text-purple-900 mb-1">
                      {isArabic ? 'اعتماد الخدمة الذاتية' : 'Self-Service Adoption'}
                    </h4>
                    <p className="text-3xl font-bold text-purple-700 mb-2">78%</p>
                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                        {isArabic ? 'اعتماد' : 'adoption'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 p-6">
                  <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="p-3 bg-yellow-500/10 rounded-lg">
                      <DollarSign className="h-6 w-6 text-yellow-600" />
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-yellow-600 hover:bg-yellow-100">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>{isArabic ? 'الإيرادات لكل موظف' : 'Revenue per Employee'}</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-gray-600">
                          {isArabic 
                            ? 'متوسط الإيرادات المحققة لكل موظف سنوياً. مؤشر رئيسي لقياس إنتاجية العمالة وكفاءة استخدام الموارد البشرية.'
                            : 'Average revenue generated per employee annually. Key indicator for measuring workforce productivity and HR resource efficiency.'
                          }
                        </p>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className={`${isArabic ? 'text-right' : ''}`}>
                    <h4 className="text-sm font-medium text-yellow-900 mb-1">
                      {isArabic ? 'الإيرادات لكل موظف' : 'Revenue per Employee'}
                    </h4>
                    <p className="text-3xl font-bold text-yellow-700 mb-2">SAR 285K</p>
                    <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        +12%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </section>
        </Collapsible>

        {/* Company Data Upload */}
        <section className="mt-16">
          <div className="bg-white rounded-xl border border-border p-8">
            <div className={`mb-6 ${isArabic ? 'text-right' : ''}`}>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {isArabic ? 'رفع بيانات الشركة' : 'Company Data Upload'}
              </h2>
              <p className="text-muted-foreground">
                {isArabic ? 'ارفع ملفات بيانات الشركة للتحليل والمعالجة' : 'Upload company data files for analysis and processing'}
              </p>
            </div>
            <CompanyDataUpload />
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className={`mb-6 ${isArabic ? 'text-right' : ''}`}>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {isArabic ? 'النشاط الأخير' : 'Recent Activity'}
                </h2>
                <p className="text-muted-foreground">
                  {isArabic ? 'آخر الأنشطة والتحديثات في النظام' : 'Latest system activities and updates'}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-border p-6">
                <SimpleRecentActivity />
              </div>
            </section>

            {/* Official Announcements */}
            <section>
              <div className={`mb-6 ${isArabic ? 'text-right' : ''}`}>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {isArabic ? 'الإعلانات الرسمية' : 'Official Announcements'}
                </h2>
                <p className="text-muted-foreground">
                  {isArabic ? 'آخر الإعلانات والتحديثات من الجهات الحكومية' : 'Latest announcements and updates from government entities'}
                </p>
              </div>
              <AnnouncementsSection />
            </section>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-8">
            {/* Official Partnerships */}
            <section>
              <div className={`mb-6 ${isArabic ? 'text-right' : ''}`}>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {isArabic ? 'الشراكات الرسمية' : 'Official Partnerships'}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {isArabic ? 'شراكاتنا مع الجهات الحكومية' : 'Our government partnerships'}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-border p-6">
                <OfficialLogos />
              </div>
            </section>
          </div>
        </div>
      </div>
      
      {/* Virtual Assistant */}
      <VirtualAssistant />
    </div>
  );
};

export default Index;