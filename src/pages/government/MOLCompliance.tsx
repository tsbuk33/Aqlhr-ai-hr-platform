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
                <p className="text-xs text-muted-foreground mt-2">جميع المخالفات محلولة</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('mol.resolved_issues')}</CardTitle>
                <CardDescription>{t('mol.corrective_actions')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-accent">23</div>
                <p className="text-xs text-muted-foreground mt-2">خلال العام الحالي</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('mol.inspection_ready')}</CardTitle>
                <CardDescription>{t('mol.next_inspection')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-warning">✓</div>
                <Badge className="mt-2 bg-status-info text-white">مارس 2024</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('mol.compliance_status')}</CardTitle>
              <CardDescription>حالة الامتثال للوائح وزارة الموارد البشرية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{t('mol.employee_rights')}</span>
                  <Badge className="bg-status-success text-white">متوافق</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('mol.safety_standards')}</span>
                  <Badge className="bg-status-success text-white">متوافق</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('mol.training_requirements')}</span>
                  <Badge className="bg-status-success text-white">مكتمل</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>متطلبات السعودة</span>
                  <Badge className="bg-status-success text-white">محقق</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>نظام العمل والعمال</span>
                  <Badge className="bg-status-success text-white">متوافق</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inspections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('mol.inspection_history')}</CardTitle>
              <CardDescription>سجل التفتيشات والزيارات الحكومية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">آخر تفتيش</h4>
                  <p className="text-lg font-bold text-brand-success">سبتمبر 2023</p>
                  <p className="text-sm text-muted-foreground">لا توجد مخالفات</p>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">التفتيش القادم</h4>
                  <p className="text-lg font-bold text-brand-warning">مارس 2024</p>
                  <p className="text-sm text-muted-foreground">تفتيش دوري</p>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">الاستعداد</h4>
                  <p className="text-lg font-bold text-brand-accent">100%</p>
                  <p className="text-sm text-muted-foreground">جميع المتطلبات جاهزة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('mol.documentation')}</CardTitle>
              <CardDescription>الوثائق والسجلات المطلوبة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>سجلات الحضور والانصراف</span>
                  <Badge className="bg-status-success text-white">محدث</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>عقود العمل</span>
                  <Badge className="bg-status-success text-white">مكتملة</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>سجلات الرواتب</span>
                  <Badge className="bg-status-success text-white">محفوظة</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>شهادات التدريب</span>
                  <Badge className="bg-status-success text-white">موثقة</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>تقارير السلامة المهنية</span>
                  <Badge className="bg-status-success text-white">محدثة</Badge>
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