import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

const TVTCIntegration = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <div className={`container mx-auto p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('tvtc.title')}</h1>
        <p className="text-muted-foreground">{t('tvtc.subtitle')}</p>
      </div>
      
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid w-full grid-cols-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger value="overview">{t('tvtc.overview')}</TabsTrigger>
          <TabsTrigger value="programs">{t('tvtc.programs')}</TabsTrigger>
          <TabsTrigger value="certificates">{t('tvtc.certificates')}</TabsTrigger>
          <TabsTrigger value="integration">{t('tvtc.integration_status')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('tvtc.total_beneficiaries')}</CardTitle>
                <CardDescription>منصة دروب</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-primary">1.8M</div>
                <p className="text-xs text-muted-foreground mt-2">مليون مستفيد</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('tvtc.training_programs')}</CardTitle>
                <CardDescription>البرامج المكتملة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-success">16.2M</div>
                <p className="text-xs text-muted-foreground mt-2">مليون برنامج تدريبي</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('tvtc.training_hours')}</CardTitle>
                <CardDescription>ساعات التدريب الإجمالية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-accent">10M</div>
                <p className="text-xs text-muted-foreground mt-2">مليون ساعة تدريبية</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('tvtc.completion_rate')}</CardTitle>
                <CardDescription>معدل إنجاز البرامج</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-warning">94.2%</div>
                <Badge className="mt-2 bg-status-success text-white">ممتاز</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>البرامج التدريبية النشطة</CardTitle>
              <CardDescription>البرامج المتاحة في منصة دروب</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">الصحة النفسية في بيئة العمل</h4>
                  <p className="text-sm text-muted-foreground">الجلسات التفاعلية</p>
                  <Badge variant="outline">متاح</Badge>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">القيادة التحولية في الرعاية الصحية</h4>
                  <p className="text-sm text-muted-foreground">الجلسات التفاعلية</p>
                  <Badge variant="outline">متاح</Badge>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">الرعاية الوقائية وتحسين جودة الحياة</h4>
                  <p className="text-sm text-muted-foreground">الجلسات التفاعلية</p>
                  <Badge variant="outline">متاح</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الشهادات المعتمدة</CardTitle>
              <CardDescription>الشهادات الصادرة من دروب</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>شهادات الإنجاز</span>
                  <Badge className="bg-status-success text-white">1,234</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>شهادات الحضور</span>
                  <Badge className="bg-status-info text-white">5,678</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>شهادات التميز</span>
                  <Badge className="bg-status-warning text-white">892</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>حالة التكامل مع دروب</CardTitle>
              <CardDescription>حالة اتصال النظام مع منصة دروب</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>حالة الاتصال</span>
                  <Badge className="bg-status-success text-white">متصل</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>مزامنة البيانات</span>
                  <Badge className="bg-status-success text-white">نشط</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>آخر تحديث</span>
                  <Badge variant="outline">منذ دقيقتين</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TVTCIntegration;