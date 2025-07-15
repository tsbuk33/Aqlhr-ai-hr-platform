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
    <div className={`p-6 space-y-6 bg-background min-h-full ${isArabic ? 'rtl-container' : 'ltr-container'}`}>
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-2xl p-8 text-white">
        <div className="max-w-4xl">
          {isArabic ? (
            <>
              <h1 className="text-3xl font-bold mb-2 text-right">نظام سند للموارد البشرية</h1>
              <p className="text-white/90 text-lg mb-4 text-right">
                منصة ذكية ومتطورة لإدارة الموارد البشرية في المملكة العربية السعودية
              </p>
              <div className="flex items-center gap-6 text-sm flex-row-reverse">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <div className="w-2 h-2 bg-status-success rounded-full"></div>
                  <span>جميع الأنظمة تعمل بشكل طبيعي</span>
                </div>
                <div className="flex items-center gap-2 flex-row-reverse">
                  <div className="w-2 h-2 bg-status-success rounded-full"></div>
                  <span><span className="number-display">106</span> وحدة نشطة</span>
                </div>
                <div className="flex items-center gap-2 flex-row-reverse">
                  <div className="w-2 h-2 bg-status-success rounded-full"></div>
                  <span>التكاملات الحكومية مفعلة</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">SanadHR System</h1>
              <p className="text-white/90 text-lg mb-4">
                Advanced Intelligent Platform for Human Resources Management in Saudi Arabia
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-status-success rounded-full"></div>
                  <span>All systems operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-status-success rounded-full"></div>
                  <span>106 modules active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-status-success rounded-full"></div>
                  <span>Government integrations live</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Key Metrics with Explanations */}
      <div className="space-y-4">
        <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
          <h2 className={`text-xl font-semibold text-foreground ${isArabic ? 'text-right' : ''}`}>
            {isArabic ? 'مؤشرات الأداء الرئيسية' : 'Key Performance Indicators'}
          </h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <HelpCircle className="h-4 w-4" />
                {isArabic ? 'شرح المؤشرات' : 'Explain KPIs'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className={`text-lg font-semibold ${isArabic ? 'text-right' : ''}`}>
                  {isArabic ? 'شرح مؤشرات الأداء الرئيسية' : 'Key Performance Indicators Explained'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4">
                  {Object.entries(kpiExplanations).map(([key, explanation]) => (
                    <KPIExplanationCard key={key} explanation={explanation} />
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative group">
            <SimpleMetricCard
              titleEn="Total Employees"
              titleAr="إجمالي الموظفين"
              value="2,847"
              descriptionEn="Complete profile management"
              descriptionAr="إدارة ملفات شخصية كاملة"
              icon={<Users className="h-6 w-6" />}
              variant="primary"
              trend={{ valueEn: "+12%", valueAr: "+12%", isPositive: true }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
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

          <div className="relative group">
            <SimpleMetricCard
              titleEn="AI Processes"
              titleAr="عمليات الذكاء الاصطناعي"
              value="34"
              descriptionEn="AI Tools + Tool Integrations"
              descriptionAr="أدوات الذكاء الاصطناعي + التكاملات"
              icon={<Check className="h-6 w-6" />}
              variant="secondary"
              trend={{ valueEn: "+24", valueAr: "+24", isPositive: true }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
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

          <div className="relative group">
            <SimpleMetricCard
              titleEn="Gov Integrations"
              titleAr="التكاملات الحكومية"
              value="46"
              descriptionEn="22 Gov + 24 Tools"
              descriptionAr="22 حكومي + 24 أداة"
              icon={<FileText className="h-6 w-6" />}
              variant="accent"
              trend={{ valueEn: "All Tools Integrated", valueAr: "جميع الأدوات متكاملة", isPositive: true }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
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

          <div className="relative group">
            <SimpleMetricCard
              titleEn="Compliance Score"
              titleAr="نقاط الامتثال"
              value="96.8%"
              descriptionEn="Regulatory compliance"
              descriptionAr="الامتثال التنظيمي"
              icon={<ArrowUp className="h-6 w-6" />}
              variant="success"
              trend={{ valueEn: "+2.1%", valueAr: "+2.1%", isPositive: true }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
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
        </div>
      </div>

      {/* Secondary Metrics with Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative group">
          <SimpleMetricCard
            titleEn="Saudization Rate"
            titleAr="معدل السعودة"
            value="67.2%"
            descriptionEn="Green Nitaqat target"
            descriptionAr="هدف النطاق الأخضر"
            icon={<Calendar className="h-6 w-6" />}
            trend={{ valueEn: "+1.8%", valueAr: "+1.8%", isPositive: true }}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
              >
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

        <div className="relative group">
          <SimpleMetricCard
            titleEn="Active Users"
            titleAr="المستخدمون النشطون"
            value="1,847"
            descriptionEn="Employee self-service"
            descriptionAr="الخدمة الذاتية للموظفين"
            icon={<Users className="h-6 w-6" />}
            trend={{ valueEn: "+156", valueAr: "+156", isPositive: true }}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
              >
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

        <div className="relative group">
          <SimpleMetricCard
            titleEn="Documents Processed"
            titleAr="المستندات المعالجة"
            value="15,678"
            descriptionEn="AI-powered verification"
            descriptionAr="التحقق بالذكاء الاصطناعي"
            icon={<FileText className="h-6 w-6" />}
            trend={{ valueEn: "+1,234", valueAr: "+1,234", isPositive: true }}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
              >
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

        <div className="relative group">
          <SimpleMetricCard
            titleEn="Training Hours"
            titleAr="ساعات التدريب"
            value="1,247"
            descriptionEn="Skills development completed"
            descriptionAr="تطوير المهارات مكتمل"
            icon={<BookOpen className="h-6 w-6" />}
            trend={{ valueEn: "+89h", valueAr: "+89 ساعة", isPositive: true }}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
              >
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
      </div>

      {/* Enhanced HR Analytics Section - Based on Dashboard Image */}
      <div className="space-y-6">
        <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
          <h2 className={`text-xl font-semibold text-foreground ${isArabic ? 'text-right' : ''}`}>
            {isArabic ? 'تحليلات الموارد البشرية المتقدمة' : 'Advanced HR Analytics'}
          </h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <Brain className="h-4 w-4" />
                {isArabic ? 'الذكاء الاصطناعي' : 'AI Insights'}
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
                    <li>• {isArabic ? 'تتبع المشاكل - تحديد معدلات الدوران وتحديات الاحتفاظ' : 'Problem Tracking - Identify turnover rates & retention challenges'}</li>
                    <li>• {isArabic ? 'اتخاذ القرارات الاستراتيجية - مواءمة القرارات مع الأهداف التنظيمية' : 'Strategic Decision-Making - Align decisions with organizational goals'}</li>
                    <li>• {isArabic ? 'التواصل المحسن - تحسين الحوار مع القيادة والمساهمين' : 'Enhanced Communication - Improve dialogue with leadership & stakeholders'}</li>
                  </ul>
          </div>

          <div className="relative group">
            <SimpleMetricCard
              titleEn="Women in Leadership"
              titleAr="النساء في القيادة"
              value="28.6%"
              descriptionEn="Women in management positions"
              descriptionAr="النساء في المناصب الإدارية"
              icon={<Crown className="h-6 w-6" />}
              variant="primary"
              trend={{ valueEn: "+6.2%", valueAr: "+6.2%", isPositive: true }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
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
        </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* First Row - Core HR Metrics */}
          <div className="relative group">
          <div className="relative group">
            <SimpleMetricCard
              titleEn="Turnover Rate"
              titleAr="معدل دوران الموظفين"
              value="8.2%"
              descriptionEn="Employee turnover this year"
              descriptionAr="دوران الموظفين هذا العام"
              icon={<ArrowDownUp className="h-6 w-6" />}
              variant="warning"
              trend={{ valueEn: "-1.3%", valueAr: "-1.3%", isPositive: true }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
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

          <div className="relative group">
            <SimpleMetricCard
              titleEn="Women Hiring Rate by Dept"
              titleAr="معدل توظيف النساء حسب القسم"
              value="34.2%"
              descriptionEn="IT: 42% | HR: 68% | Finance: 29%"
              descriptionAr="تقنية: 42% | موارد: 68% | مالية: 29%"
              icon={<UserPlus className="h-6 w-6" />}
              variant="accent"
              trend={{ valueEn: "+4.8%", valueAr: "+4.8%", isPositive: true }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
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

          <div className="relative group">
            <SimpleMetricCard
              titleEn="Women Turnover by Dept"
              titleAr="دوران النساء حسب القسم"
              value="6.1%"
              descriptionEn="Average across all departments"
              descriptionAr="المتوسط عبر جميع الأقسام"
              icon={<TrendingDown className="h-6 w-6" />}
              variant="success"
              trend={{ valueEn: "-2.3%", valueAr: "-2.3%", isPositive: true }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
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

          <div className="relative group">
            <SimpleMetricCard
              titleEn="New Hires"
              titleAr="التعيينات الجديدة"
              value="234"
              descriptionEn="New employees this quarter"
              descriptionAr="موظفون جدد هذا الربع"
              icon={<Users className="h-6 w-6" />}
              variant="success"
              trend={{ valueEn: "+45", valueAr: "+45", isPositive: true }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                    {isArabic ? kpiExplanations.newHiresRate.titleAr : kpiExplanations.newHiresRate.titleEn}
                  </DialogTitle>
                </DialogHeader>
                <KPIExplanationCard explanation={kpiExplanations.newHiresRate} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative group">
            <SimpleMetricCard
              titleEn="Absenteeism Rate"
              titleAr="معدل الغياب"
              value="2.1%"
              descriptionEn="Employee absence rate"
              descriptionAr="معدل غياب الموظفين"
              icon={<Calendar className="h-6 w-6" />}
              variant="default"
              trend={{ valueEn: "-0.3%", valueAr: "-0.3%", isPositive: true }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                    {isArabic ? kpiExplanations.absenteeismRate.titleAr : kpiExplanations.absenteeismRate.titleEn}
                  </DialogTitle>
                </DialogHeader>
                <KPIExplanationCard explanation={kpiExplanations.absenteeismRate} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative group">
            <SimpleMetricCard
              titleEn="Time to Fill"
              titleAr="وقت ملء المنصب"
              value="28 days"
              descriptionEn="Average hiring time"
              descriptionAr="متوسط وقت التوظيف"
              icon={<Clock className="h-6 w-6" />}
              variant="accent"
              trend={{ valueEn: "-5 days", valueAr: "-5 أيام", isPositive: true }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                    {isArabic ? kpiExplanations.timeToFill.titleAr : kpiExplanations.timeToFill.titleEn}
                  </DialogTitle>
                </DialogHeader>
                <KPIExplanationCard explanation={kpiExplanations.timeToFill} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Second Row - Financial & Diversity Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative group">
            <SimpleMetricCard
              titleEn="Cost of Absence"
              titleAr="تكلفة الغياب"
              value="SAR 127K"
              descriptionEn="Monthly absence cost"
              descriptionAr="تكلفة الغياب الشهرية"
              icon={<FileText className="h-6 w-6" />}
              variant="warning"
              trend={{ valueEn: "-SAR 23K", valueAr: "-23 ألف ريال", isPositive: true }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                    {isArabic ? kpiExplanations.costOfAbsence.titleAr : kpiExplanations.costOfAbsence.titleEn}
                  </DialogTitle>
                </DialogHeader>
                <KPIExplanationCard explanation={kpiExplanations.costOfAbsence} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative group">
            <SimpleMetricCard
              titleEn="Recruitment Cost"
              titleAr="تكلفة التوظيف"
              value="SAR 8,450"
              descriptionEn="Cost per hire"
              descriptionAr="التكلفة لكل توظيف"
              icon={<Users className="h-6 w-6" />}
              variant="primary"
              trend={{ valueEn: "-SAR 1,200", valueAr: "-1,200 ريال", isPositive: true }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                    {isArabic ? kpiExplanations.recruitmentCost.titleAr : kpiExplanations.recruitmentCost.titleEn}
                  </DialogTitle>
                </DialogHeader>
                <KPIExplanationCard explanation={kpiExplanations.recruitmentCost} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative group">
            <SimpleMetricCard
              titleEn="Gender Distribution"
              titleAr="التوزيع الجنسي"
              value="62% M / 38% F"
              descriptionEn="Male/Female ratio"
              descriptionAr="نسبة الذكور/الإناث"
              icon={<Users className="h-6 w-6" />}
              variant="secondary"
              trend={{ valueEn: "+3% F", valueAr: "+3% إ", isPositive: true }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                    {isArabic ? kpiExplanations.employeesByGender.titleAr : kpiExplanations.employeesByGender.titleEn}
                  </DialogTitle>
                </DialogHeader>
                <KPIExplanationCard explanation={kpiExplanations.employeesByGender} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative group">
            <SimpleMetricCard
              titleEn="Labor Cost/Employee"
              titleAr="تكلفة العمالة/موظف"
              value="SAR 12,890"
              descriptionEn="Monthly cost per employee"
              descriptionAr="التكلفة الشهرية لكل موظف"
              icon={<ArrowUp className="h-6 w-6" />}
              variant="accent"
              trend={{ valueEn: "+2.5%", valueAr: "+2.5%", isPositive: false }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                    {isArabic ? kpiExplanations.costOfLabor.titleAr : kpiExplanations.costOfLabor.titleEn}
                  </DialogTitle>
                </DialogHeader>
                <KPIExplanationCard explanation={kpiExplanations.costOfLabor} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities - Takes 2 columns */}
        <div className="lg:col-span-2">
          <SimpleRecentActivity />
        </div>

        {/* Quick Stats with Explanations */}
        <div className="space-y-6">
          <div className="relative group">
            <SimpleMetricCard
              titleEn="Monthly Payroll"
              titleAr="الراتب الشهري"
              value="SAR 456K"
              descriptionEn="December 2024 processed"
              descriptionAr="ديسمبر 2024 تم معالجته"
              icon={<Calendar className="h-6 w-6" />}
              variant="warning"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                    {isArabic ? kpiExplanations.monthlyPayroll.titleAr : kpiExplanations.monthlyPayroll.titleEn}
                  </DialogTitle>
                </DialogHeader>
                <KPIExplanationCard explanation={kpiExplanations.monthlyPayroll} />
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="relative group">
            <SimpleMetricCard
              titleEn="Attendance Rate"
              titleAr="معدل الحضور"
              value="98.2%"
              descriptionEn="Real-time tracking"
              descriptionAr="تتبع في الوقت الفعلي"
              icon={<Clock className="h-6 w-6" />}
              variant="default"
              trend={{ valueEn: "+0.5%", valueAr: "+0.5%", isPositive: true }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className={`${isArabic ? 'text-right' : ''}`}>
                    {isArabic ? kpiExplanations.attendanceRate.titleAr : kpiExplanations.attendanceRate.titleEn}
                  </DialogTitle>
                </DialogHeader>
                <KPIExplanationCard explanation={kpiExplanations.attendanceRate} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Platform Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl p-6 border border-border">
          {isArabic ? (
            <>
              <h3 className="text-lg font-semibold text-foreground mb-4 text-right">نظرة عامة على حالة المنصة</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-status-success number-display">12</div>
                  <div className="text-sm text-muted-foreground">وحدات الموارد البشرية الأساسية</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-primary number-display">8</div>
                  <div className="text-sm text-muted-foreground">وحدات الرواتب</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-accent number-display">10</div>
                  <div className="text-sm text-muted-foreground">ميزات الذكاء الاصطناعي</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-secondary number-display">109</div>
                  <div className="text-sm text-muted-foreground">سير العمل النشط</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-foreground mb-4">Platform Status Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-status-success">12</div>
                  <div className="text-sm text-muted-foreground">Core HR Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-primary">8</div>
                  <div className="text-sm text-muted-foreground">Payroll Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-accent">10</div>
                  <div className="text-sm text-muted-foreground">AI Features</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-secondary">109</div>
                  <div className="text-sm text-muted-foreground">Active Workflows</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Official Logos */}
        <OfficialLogos />
      </div>

      {/* System Engineer Dashboard */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
        <CardHeader>
          <CardTitle className={`flex items-center gap-3 text-xl ${isArabic ? 'flex-row-reverse text-right' : ''}`}>
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
              <Brain className="h-6 w-6" />
            </div>
            {isArabic ? 'مهندس النظام الذكي' : 'System Engineer AI'}
          </CardTitle>
          <CardDescription className={isArabic ? 'text-right' : ''}>
            {isArabic 
              ? 'نظام ذكي متطور للتشخيص الذاتي والإصلاح التلقائي وتحسين الأداء'
              : 'Advanced intelligent system for self-diagnosis, auto-healing, and performance optimization'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
            <div className={`flex gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {isArabic ? 'تكيف تلقائي' : 'Auto-Adaptive'}
              </Badge>
              <Badge variant="outline" className="text-green-600 border-green-200">
                {isArabic ? 'مقاوم للمستقبل' : 'Future-Proof'}
              </Badge>
              <Badge variant="outline" className="text-purple-600 border-purple-200">
                {isArabic ? 'مراقبة مستمرة' : 'Continuous Monitoring'}
              </Badge>
            </div>
            <Link to="/system-engineer">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                {isArabic ? 'فتح لوحة التحكم' : 'Open Dashboard'}
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Company Data Integration */}
      <div className="flex justify-center">
        <CompanyDataUpload />
      </div>
    </div>
  );
};

export default Index;