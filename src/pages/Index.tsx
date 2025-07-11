import { SimpleMetricCard } from "@/components/SimpleMetricCard";
import { SimpleRecentActivity } from "@/components/SimpleRecentActivity";
import { OfficialLogos } from "@/components/OfficialLogos";
import { CompanyDataUpload } from "@/components/CompanyDataUpload";
import { Users, Calendar, FileText, Clock, BookOpen, Check, ArrowUp, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useSimpleLanguage } from "@/contexts/SimpleLanguageContext";

const Index = () => {
  const { isArabic } = useSimpleLanguage();

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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SimpleMetricCard
          titleEn="Saudization Rate"
          titleAr="معدل السعودة"
          value="67.2%"
          descriptionEn="Green Nitaqat target"
          descriptionAr="هدف النطاق الأخضر"
          icon={<Calendar className="h-6 w-6" />}
          trend={{ valueEn: "+1.8%", valueAr: "+1.8%", isPositive: true }}
        />
        <SimpleMetricCard
          titleEn="Active Users"
          titleAr="المستخدمون النشطون"
          value="1,847"
          descriptionEn="Employee self-service"
          descriptionAr="الخدمة الذاتية للموظفين"
          icon={<Users className="h-6 w-6" />}
          trend={{ valueEn: "+156", valueAr: "+156", isPositive: true }}
        />
        <SimpleMetricCard
          titleEn="Documents Processed"
          titleAr="المستندات المعالجة"
          value="15,678"
          descriptionEn="AI-powered verification"
          descriptionAr="التحقق بالذكاء الاصطناعي"
          icon={<FileText className="h-6 w-6" />}
          trend={{ valueEn: "+1,234", valueAr: "+1,234", isPositive: true }}
        />
        <SimpleMetricCard
          titleEn="Training Hours"
          titleAr="ساعات التدريب"
          value="1,247"
          descriptionEn="Skills development completed"
          descriptionAr="تطوير المهارات مكتمل"
          icon={<BookOpen className="h-6 w-6" />}
          trend={{ valueEn: "+89h", valueAr: "+89 ساعة", isPositive: true }}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities - Takes 2 columns */}
        <div className="lg:col-span-2">
          <SimpleRecentActivity />
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <SimpleMetricCard
            titleEn="Monthly Payroll"
            titleAr="الراتب الشهري"
            value="SAR 456K"
            descriptionEn="December 2024 processed"
            descriptionAr="ديسمبر 2024 تم معالجته"
            icon={<Calendar className="h-6 w-6" />}
            variant="warning"
          />
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