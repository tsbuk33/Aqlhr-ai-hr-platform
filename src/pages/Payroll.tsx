import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  DollarSign, 
  Users, 
  Shield, 
  Calculator,
  CreditCard,
  Building,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  PieChart
} from "lucide-react";

interface GOSISummary {
  total_employees: number;
  old_system_count: number;
  new_system_count: number;
  saudi_count: number;
  expat_count: number;
  total_employee_contributions: number;
  total_employer_contributions: number;
  total_contributions: number;
}

const Payroll = () => {
  const { t, language } = useLanguage();
  const [gosiSummary, setGOSISummary] = useState<GOSISummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGOSISummary = async () => {
    try {
      setLoading(true);
      
      // Get first company for demo
      const { data: companies } = await supabase
        .from('companies')
        .select('id')
        .limit(1);
      
      if (!companies?.length) return;

      const { data, error } = await supabase.functions.invoke('gosi-engine/preview', {
        body: { company_id: companies[0].id }
      });

      if (error) throw error;
      setGOSISummary(data.summary);
    } catch (error) {
      console.error('Error fetching GOSI summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGOSISummary();
  }, []);

  const oldSystemPercentage = gosiSummary ? 
    (gosiSummary.old_system_count / gosiSummary.total_employees) * 100 : 0;

  const stats = [
    {
      title: language === 'ar' ? 'إجمالي مساهمات GOSI' : 'Total GOSI Contributions',
      value: `SAR ${loading ? '455,624' : (gosiSummary?.total_contributions || 455624).toLocaleString()}`,
      icon: DollarSign,
      variant: "primary" as const,
      trend: { value: "Progressive rates applied", isPositive: true }
    },
    {
      title: language === 'ar' ? 'حالة WPS' : 'WPS Compliance',
      value: language === 'ar' ? '100% متوافق' : '100% Compliant',
      icon: CheckCircle,
      variant: "success" as const
    },
    {
      title: language === 'ar' ? 'تكامل البنوك السعودية' : 'Saudi Bank Integration',
      value: language === 'ar' ? '5 بنوك' : '5 Banks',
      icon: Shield,
      variant: "accent" as const,
      trend: { value: "SARIE connected", isPositive: true }
    },
    {
      title: language === 'ar' ? 'امتثال الزكاة والضريبة' : 'ZATCA Compliance',
      value: '98.5%',
      icon: FileText,
      variant: "warning" as const,
      trend: { value: "VAT ready", isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: language === 'ar' ? 'معالجة الرواتب WPS' : 'WPS Payroll Processing',
      description: language === 'ar' ? 'حسابات الرواتب الآلية وإنشاء ملفات البنك' : 'Automated salary calculations and bank file generation',
      icon: CreditCard,
      color: "bg-blue-500",
      onClick: () => console.log('Navigate to WPS processing')
    },
    {
      title: language === 'ar' ? 'مزايا نهاية الخدمة' : 'End of Service Benefits',
      description: language === 'ar' ? 'حسابات EOSB وإدارة المسؤوليات' : 'EOSB calculations and liability management',
      icon: Calculator,
      color: "bg-green-500",
      onClick: () => console.log('Navigate to EOSB')
    },
    {
      title: language === 'ar' ? 'التكامل مع البنوك' : 'Bank Integration',
      description: language === 'ar' ? 'تكامل مع الأنظمة المصرفية' : 'Integration with banking systems',
      icon: Building,
      color: "bg-purple-500",
      onClick: () => console.log('Navigate to bank integration')
    },
    {
      title: language === 'ar' ? 'الامتثال الضريبي' : 'Tax Compliance',
      description: language === 'ar' ? 'إدارة الضرائب والامتثال' : 'Tax management and compliance',
      icon: FileText,
      color: "bg-orange-500",
      onClick: () => console.log('Navigate to tax compliance')
    }
  ];

  const documents = [
    {
      name: language === 'ar' ? 'كشف_رواتب_ديسمبر_2024.pdf' : 'payroll_summary_december_2024.pdf',
      type: language === 'ar' ? 'كشف الرواتب' : 'Payroll Summary',
      date: '2024-12-30',
      size: '4.2 MB'
    },
    {
      name: language === 'ar' ? 'تقرير_التأمينات_الاجتماعية.xlsx' : 'gosi_contributions_report.xlsx',
      type: language === 'ar' ? 'تقرير التأمينات' : 'GOSI Report',
      date: '2024-12-30',
      size: '2.8 MB'
    },
    {
      name: language === 'ar' ? 'ملف_البنك_WPS.txt' : 'wps_bank_file.txt',
      type: language === 'ar' ? 'ملف البنك' : 'Bank File',
      date: '2024-12-30',
      size: '125 KB'
    }
  ];

  const tabs = [
    {
      id: 'overview',
      label: language === 'ar' ? 'نظرة عامة' : 'Overview',
      content: (
        <div className="space-y-6">
          {/* GOSI Royal Decree M/273 Summary */}
          <div className="bg-gradient-subtle p-6 rounded-lg border">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold">
                {language === 'ar' ? 'نظام مساهمات التأمينات الاجتماعية (المرسوم الملكي م/273)' : 'GOSI Contribution System (Royal Decree M/273)'}
              </h2>
              <Badge variant="secondary">
                {language === 'ar' ? 'ساري المفعول 1 يوليو 2025' : 'Effective July 1, 2025'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    {language === 'ar' ? 'توزيع النظام' : 'System Distribution'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === 'ar' ? 'النظام القديم' : 'Old System'}</span>
                      <Badge variant="outline">{gosiSummary?.old_system_count || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === 'ar' ? 'النظام الجديد' : 'New System'}</span>
                      <Badge variant="default">{gosiSummary?.new_system_count || 0}</Badge>
                    </div>
                    <Progress value={oldSystemPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {oldSystemPercentage.toFixed(1)}% {language === 'ar' ? 'على النظام القديم' : 'on old system'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    {language === 'ar' ? 'مساهمات الموظفين' : 'Employee Contributions'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    SAR {loading ? '---' : (gosiSummary?.total_employee_contributions || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'الاستقطاعات الشهرية' : 'Monthly deductions'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    {language === 'ar' ? 'مساهمات صاحب العمل' : 'Employer Contributions'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    SAR {loading ? '---' : (gosiSummary?.total_employer_contributions || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'التزامات الشركة' : 'Company obligations'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    {language === 'ar' ? 'إجمالي التأمينات' : 'Total GOSI'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">
                    SAR {loading ? '---' : (gosiSummary?.total_contributions || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'المجموع الشهري' : 'Combined monthly'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  {language === 'ar' ? 'معالجة الرواتب WPS' : 'WPS Payroll Processing'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'حسابات الرواتب الآلية وإنشاء ملفات البنك' : 'Automated salary calculations and bank file generation'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? '100% حالة الامتثال' : '100% compliance status'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-success" />
                  {language === 'ar' ? 'مزايا نهاية الخدمة' : 'End of Service Benefits'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'حسابات EOSB وإدارة المسؤوليات' : 'EOSB calculations and liability management'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'إجمالي المسؤولية: ريال سعودي 2,340,000' : 'Total liability: SAR 2,340,000'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'processing',
      label: language === 'ar' ? 'المعالجة' : 'Processing',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'حالة معالجة الرواتب' : 'Payroll Processing Status'}</CardTitle>
              <CardDescription>
                {language === 'ar' ? 'مراقبة مباشرة لحالة معالجة الرواتب' : 'Real-time monitoring of payroll processing status'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="font-medium">
                      {language === 'ar' ? 'حساب الرواتب' : 'Salary Calculation'}
                    </span>
                  </div>
                  <Badge className="bg-success text-white">
                    {language === 'ar' ? 'مكتمل' : 'Complete'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="font-medium">
                      {language === 'ar' ? 'إنشاء ملف البنك' : 'Bank File Generation'}
                    </span>
                  </div>
                  <Badge className="bg-success text-white">
                    {language === 'ar' ? 'مكتمل' : 'Complete'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-warning" />
                    <span className="font-medium">
                      {language === 'ar' ? 'تقديم التأمينات الاجتماعية' : 'GOSI Submission'}
                    </span>
                  </div>
                  <Badge className="bg-warning text-white">
                    {language === 'ar' ? 'قيد المعالجة' : 'Processing'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  const headerActions = (
    <Button onClick={fetchGOSISummary} variant="outline">
      <TrendingUp className="h-4 w-4" />
      <span className="ml-2">
        {language === 'ar' ? 'تحديث بيانات التأمينات' : 'Refresh GOSI Data'}
      </span>
    </Button>
  );

  return (
    <EnhancedPageLayout
      title={language === 'ar' ? 'الرواتب والشؤون المالية' : 'Payroll & Financial'}
      description={language === 'ar' ? 'معالجة WPS والتأمينات الاجتماعية' : 'WPS processing and GOSI integration'}
      showUserInfo={true}
      showQuickActions={true}
      showTabs={true}
      stats={stats}
      quickActions={quickActions}
      documents={documents}
      tabs={tabs}
      headerActions={headerActions}
    />
  );
};

export default Payroll;