import { SimpleMetricCard } from "@/components/SimpleMetricCard";
import { SimpleRecentActivity } from "@/components/SimpleRecentActivity";
import { OfficialLogos } from "@/components/OfficialLogos";
import { CompanyDataUpload } from "@/components/CompanyDataUpload";
import { KPIExplanationCard } from "@/components/KPIExplanationCard";
import { Users, Calendar, FileText, Clock, BookOpen, Check, ArrowUp, Brain, HelpCircle, TrendingDown, ArrowDownUp, UserPlus, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useSimpleLanguage } from "@/contexts/SimpleLanguageContext";
import { kpiExplanations } from "@/data/kpiExplanations";
import { useState } from "react";

const Index = () => {
  const { isArabic } = useSimpleLanguage();
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);

  return (
    <div className={`min-h-screen bg-background ${isArabic ? 'rtl-container' : 'ltr-container'}`}>
      {/* Executive Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
            <div className={`${isArabic ? 'text-right' : ''}`}>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {isArabic ? 'نظام سند للموارد البشرية' : 'SanadHR Executive Dashboard'}
              </h1>
              <p className="text-muted-foreground text-lg">
                {isArabic ? 'منصة ذكية ومتطورة لإدارة الموارد البشرية في المملكة العربية السعودية' : 'Advanced Intelligent Platform for Human Resources Management in Saudi Arabia'}
              </p>
            </div>
            <div className={`flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-status-success rounded-full"></div>
                <span className="text-sm text-muted-foreground">
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
              <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300">
                <div className={`flex items-center justify-between mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
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
                  <p className="text-3xl font-bold text-foreground mb-2">2,847</p>
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
                  <p className="text-3xl font-bold text-foreground mb-2">34</p>
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
                  <p className="text-3xl font-bold text-foreground mb-2">46</p>
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
                  <p className="text-3xl font-bold text-foreground mb-2">96.8%</p>
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

        {/* Recent Activity */}
        <section>
          <div className={`mb-8 ${isArabic ? 'text-right' : ''}`}>
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

        {/* Official Logos */}
        <section>
          <div className={`mb-8 ${isArabic ? 'text-right' : ''}`}>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isArabic ? 'الشراكات الرسمية' : 'Official Partnerships'}
            </h2>
            <p className="text-muted-foreground">
              {isArabic ? 'شراكاتنا مع الجهات الحكومية والمؤسسات الرسمية' : 'Our partnerships with government entities and official institutions'}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-border p-8">
            <OfficialLogos />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;