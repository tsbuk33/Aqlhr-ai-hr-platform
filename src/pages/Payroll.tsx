import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AqlHRAIAssistant } from "@/components/ai/AqlHRAIAssistant";
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import AIQueryInterface from "@/components/ai/AIQueryInterface";
import AIRecommendationCenter from "@/components/ai/AIRecommendationCenter";
import AutomationWorkflowEngine from "@/components/ai/AutomationWorkflowEngine";
import CrossModuleIntelligence from "@/components/ai/CrossModuleIntelligence";
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
  const { language } = useLanguage();
  const isArabic = language === 'ar';
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
      title: isArabic ? 'إجمالي مساهمات GOSI' : 'Total GOSI Contributions',
      value: `﷼ ${loading ? '455,624' : (gosiSummary?.total_contributions || 455624).toLocaleString()}`,
      icon: DollarSign,
      variant: "primary" as const,
      trend: { value: "Progressive rates applied", isPositive: true }
    },
    {
      title: isArabic ? 'حالة WPS' : 'WPS Compliance',
      value: isArabic ? '100% متوافق' : '100% Compliant',
      icon: CheckCircle,
      variant: "success" as const
    },
    {
      title: isArabic ? 'تكامل البنوك السعودية' : 'Saudi Bank Integration',
      value: isArabic ? '5 بنوك' : '5 Banks',
      icon: Shield,
      variant: "accent" as const,
      trend: { value: "SARIE connected", isPositive: true }
    },
    {
      title: isArabic ? 'الامتثال الحكومي' : 'Government Compliance',
      value: '98.5%',
      icon: FileText,
      variant: "warning" as const,
      trend: { value: "VAT ready", isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: isArabic ? 'معالجة الرواتب WPS' : 'WPS Payroll Processing',
      description: isArabic ? 'حسابات الرواتب الآلية وإنشاء ملفات البنك' : 'Automated salary calculations and bank file generation',
      icon: CreditCard,
      color: "bg-blue-500",
      onClick: () => console.log('Navigate to WPS processing')
    },
    {
      title: isArabic ? 'مزايا نهاية الخدمة' : 'End of Service Benefits',
      description: isArabic ? 'حسابات EOSB وإدارة المسؤوليات' : 'EOSB calculations and liability management',
      icon: Calculator,
      color: "bg-green-500",
      onClick: () => console.log('Navigate to EOSB')
    },
    {
      title: isArabic ? 'التكامل مع البنوك' : 'Bank Integration',
      description: isArabic ? 'تكامل مع الأنظمة المصرفية' : 'Integration with banking systems',
      icon: Building,
      color: "bg-purple-500",
      onClick: () => console.log('Navigate to bank integration')
    },
  ];



  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {isArabic ? 'الرواتب والشؤون المالية' : 'Payroll & Financial'}
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {isArabic ? 'نظام شامل لمعالجة الرواتب والتأمينات الاجتماعية مع أدوات الذكاء الاصطناعي المتقدمة' : 'Comprehensive payroll and GOSI processing system with advanced AI tools'}
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">
            {isArabic ? 'لوحة القيادة' : 'Dashboard'}
          </TabsTrigger>
          <TabsTrigger value="ai-assistant">
            {isArabic ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant'}
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            {isArabic ? 'التوصيات الذكية' : 'Smart Recommendations'}
          </TabsTrigger>
          <TabsTrigger value="ai-automation">
            {isArabic ? 'الأتمتة الذكية' : 'AI Automation'}
          </TabsTrigger>
          <TabsTrigger value="cross-intelligence">
            {isArabic ? 'الذكاء المتقاطع' : 'Cross-Module Intelligence'}
          </TabsTrigger>
          <TabsTrigger value="documents">
            {isArabic ? 'إدارة الوثائق' : 'Document Management'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    {stat.trend && (
                      <p className="text-xs text-muted-foreground">
                        {stat.trend.value}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* GOSI Royal Decree M/273 Summary */}
            <div className="bg-gradient-subtle p-6 rounded-lg border">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">
                  {isArabic ? 'نظام مساهمات التأمينات الاجتماعية (المرسوم الملكي م/273)' : 'GOSI Contribution System (Royal Decree M/273)'}
                </h2>
                <Badge variant="secondary">
                  {isArabic ? 'ساري المفعول 1 يوليو 2025' : 'Effective July 1, 2025'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      {isArabic ? 'توزيع النظام' : 'System Distribution'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{isArabic ? 'النظام القديم' : 'Old System'}</span>
                        <Badge variant="outline">{gosiSummary?.old_system_count || 0}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{isArabic ? 'النظام الجديد' : 'New System'}</span>
                        <Badge variant="default">{gosiSummary?.new_system_count || 0}</Badge>
                      </div>
                      <Progress value={oldSystemPercentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {oldSystemPercentage.toFixed(1)}% {isArabic ? 'على النظام القديم' : 'on old system'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      {isArabic ? 'مساهمات الموظفين' : 'Employee Contributions'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      ﷼ {loading ? '---' : (gosiSummary?.total_employee_contributions || 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isArabic ? 'الاستقطاعات الشهرية' : 'Monthly deductions'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      {isArabic ? 'مساهمات صاحب العمل' : 'Employer Contributions'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">
                      ﷼ {loading ? '---' : (gosiSummary?.total_employer_contributions || 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isArabic ? 'التزامات الشركة' : 'Company obligations'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      {isArabic ? 'إجمالي التأمينات' : 'Total GOSI'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent">
                      ﷼ {loading ? '---' : (gosiSummary?.total_contributions || 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isArabic ? 'المجموع الشهري' : 'Combined monthly'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={action.onClick}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <action.icon className="h-5 w-5" />
                      {action.title}
                    </CardTitle>
                    <CardDescription>
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-assistant">
          <AIQueryInterface 
            moduleContext="payroll"
            companyId="demo-company"
            className="mb-6"
          />
        </TabsContent>

        <TabsContent value="recommendations">
          <AIRecommendationCenter 
            companyId="demo-company"
          />
        </TabsContent>

        <TabsContent value="ai-automation">
          <AutomationWorkflowEngine />
        </TabsContent>

        <TabsContent value="cross-intelligence">
          <CrossModuleIntelligence />
        </TabsContent>

        <TabsContent value="documents">
          <ModuleDocumentUploader moduleKey="payroll" />
        </TabsContent>
      </Tabs>

      <AqlHRAIAssistant 
        moduleContext="payroll" 
        companyId="demo-company"
      />
    </div>
  );
};

export default Payroll;