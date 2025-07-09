import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

const MOLCompliance = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <div className={`container mx-auto p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('mol.title')}</h1>
        <p className="text-muted-foreground">{t('mol.subtitle')}</p>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid w-full grid-cols-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger value="overview">{t('mol.overview')}</TabsTrigger>
          <TabsTrigger value="compliance">{t('mol.compliance_status')}</TabsTrigger>
          <TabsTrigger value="inspections">{t('mol.inspection_history')}</TabsTrigger>
          <TabsTrigger value="documentation">{t('mol.documentation')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('mol.compliance_score')}</CardTitle>
                <CardDescription>{t('mol.labor_law_compliance')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-primary">98.7%</div>
                <Badge className="mt-2 bg-status-success text-white">{t('mol.compliant')}</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('mol.active_violations')}</CardTitle>
                <CardDescription>{t('mol.pending_actions')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-success">0</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {isRTL ? 'جميع المخالفات محلولة' : 'All violations resolved'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('mol.resolved_issues')}</CardTitle>
                <CardDescription>{t('mol.corrective_actions')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-accent">23</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {isRTL ? 'خلال العام الحالي' : 'This year'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('mol.inspection_ready')}</CardTitle>
                <CardDescription>{t('mol.next_inspection')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-warning">✓</div>
                <Badge className="mt-2 bg-status-info text-white">
                  {isRTL ? 'مارس 2024' : 'March 2024'}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('mol.compliance_status')}</CardTitle>
              <CardDescription>
                {isRTL ? 'حالة الامتثال للوائح وزارة الموارد البشرية' : 'Ministry of Human Resources compliance status'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{t('mol.employee_rights')}</span>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متوافق' : 'Compliant'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('mol.safety_standards')}</span>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متوافق' : 'Compliant'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('mol.training_requirements')}</span>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'مكتمل' : 'Complete'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isRTL ? 'متطلبات السعودة' : 'Saudization Requirements'}</span>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'محقق' : 'Achieved'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isRTL ? 'نظام العمل والعمال' : 'Labor and Workers Law'}</span>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متوافق' : 'Compliant'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inspections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('mol.inspection_history')}</CardTitle>
              <CardDescription>
                {isRTL ? 'سجل التفتيشات والزيارات الحكومية' : 'Government inspections and visits log'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'آخر تفتيش' : 'Last Inspection'}
                  </h4>
                  <p className="text-lg font-bold text-brand-success">
                    {isRTL ? 'سبتمبر 2023' : 'September 2023'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'لا توجد مخالفات' : 'No violations found'}
                  </p>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'التفتيش القادم' : 'Next Inspection'}
                  </h4>
                  <p className="text-lg font-bold text-brand-warning">
                    {isRTL ? 'مارس 2024' : 'March 2024'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تفتيش دوري' : 'Routine inspection'}
                  </p>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'الاستعداد' : 'Readiness'}
                  </h4>
                  <p className="text-lg font-bold text-brand-accent">100%</p>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'جميع المتطلبات جاهزة' : 'All requirements ready'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('mol.documentation')}</CardTitle>
              <CardDescription>
                {isRTL ? 'الوثائق والسجلات المطلوبة' : 'Required documents and records'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{isRTL ? 'سجلات الحضور والانصراف' : 'Attendance Records'}</span>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'محدث' : 'Updated'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isRTL ? 'عقود العمل' : 'Employment Contracts'}</span>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'مكتملة' : 'Complete'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isRTL ? 'سجلات الرواتب' : 'Payroll Records'}</span>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'محفوظة' : 'Archived'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isRTL ? 'شهادات التدريب' : 'Training Certificates'}</span>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'موثقة' : 'Documented'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isRTL ? 'تقارير السلامة المهنية' : 'Occupational Safety Reports'}</span>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'محدثة' : 'Current'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MOLCompliance;