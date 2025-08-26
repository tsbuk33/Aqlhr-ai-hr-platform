import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import AIFloatingAssistant from '@/components/ai/AIFloatingAssistant';
import AIInsightCard from '@/components/ai/AIInsightCard';
import { AqlHRAIAssistant } from '@/components/ai';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const Employees = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {isArabic ? 'البيانات الأساسية للموظفين' : 'Employee Master Data'}
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
          {isArabic ? 'إدارة شاملة لملفات الموظفين' : 'Complete employee profile management'}
        </p>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {isArabic ? 'إضافة موظف' : 'Add Employee'}
        </Button>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <Input 
          placeholder={isArabic ? 'البحث عن الموظفين...' : 'Search employees...'}
          className="max-w-sm" 
        />
        <Button variant="outline" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          {isArabic ? 'بحث' : 'Search'}
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          {isArabic ? 'تصفية' : 'Filter'}
        </Button>
      </div>

      <AIInsightCard 
        moduleContext="employees"
        companyId="demo-company"
        className="mb-6"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'إجمالي الموظفين' : 'Total Employees'}</CardTitle>
            <CardDescription>
              {isArabic ? 'العدد الكلي للموظفين النشطين' : 'Total number of active employees'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-primary">2,847</p>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'موظف نشط' : 'active employees'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'العقود النشطة' : 'Active Contracts'}</CardTitle>
            <CardDescription>
              {isArabic ? 'عقود العمل الحالية' : 'Current employment contracts'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-success">2,847</p>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'عقد ساري' : 'active contracts'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'معدل السعودة' : 'Saudization Rate'}</CardTitle>
            <CardDescription>
              {isArabic ? 'نسبة الموظفين السعوديين' : 'Percentage of Saudi employees'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-accent">67.2%</p>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'امتثال نطاقات' : 'Nitaqat compliant'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'درجة الامتثال' : 'Compliance Score'}</CardTitle>
            <CardDescription>
              {isArabic ? 'مستوى الامتثال الإجمالي' : 'Overall compliance level'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-primary">96.8%</p>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'امتثال ممتاز' : 'excellent compliance'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isArabic ? 'دليل الموظفين' : 'Employee Directory'}</CardTitle>
          <CardDescription>
            {isArabic ? 'إدارة ملفات الموظفين التفصيلية' : 'Manage detailed employee profiles'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            {isArabic ? 'جدول الموظفين سيتم تطبيقه قريباً' : 'Employee table will be implemented soon'}
          </p>
        </CardContent>
      </Card>

      {/* Employee Document Management */}
      <UniversalDocumentManager
        moduleName={isArabic ? "البيانات الرئيسية للموظفين" : "Employee Master Data"}
        description={isArabic ? "رفع السير الذاتية للموظفين والعقود والشهادات والمستندات الشخصية" : "Upload employee resumes, contracts, certifications, and personal documents"}
        platform="employees"
        moduleType="hr"
        acceptedTypes={['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.xlsx']}
        maxFileSize={25 * 1024 * 1024}
        maxFiles={15}
      />

      <AIFloatingAssistant 
        moduleContext="employees"
        companyId="demo-company"
        currentPageData={{ totalEmployees: 2847, saudizationRate: 67.2 }}
      />

      <AqlHRAIAssistant 
        moduleContext="employees" 
        companyId="demo-company"
      />
      
      {/* AI Integration for Employee Management */}
      <UniversalAIIntegrator 
        pageType="core-hr" 
        moduleName="employee-management" 
        companyId="demo-company" 
        enabledFeatures={['employee-management', 'hr-processes', 'workforce-optimization', 'predictive-analytics']}
      />
    </div>
  );
};

export default Employees;