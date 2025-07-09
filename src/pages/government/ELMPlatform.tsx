import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

const ELMPlatform = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <div className={`container mx-auto p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isRTL ? 'منصة مقيم' : 'Muqeem Platform'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'منصة إلكترونية متكاملة لإدارة شؤون المقيمين والجوازات' : 'Integrated Electronic Platform for Resident Affairs and Passport Management'}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-status-success text-white">
            {isRTL ? 'متصل' : 'Connected'}
          </Badge>
          <Button variant="outline">
            {isRTL ? 'اختبار الاتصال' : 'Test Connection'}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid w-full grid-cols-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="resident-services">{isRTL ? 'خدمات المقيمين' : 'Resident Services'}</TabsTrigger>
          <TabsTrigger value="passport-operations">{isRTL ? 'عمليات الجوازات' : 'Passport Operations'}</TabsTrigger>
          <TabsTrigger value="reports-analytics">{isRTL ? 'التقارير والتحليلات' : 'Reports & Analytics'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="min-h-[160px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? 'العمليات التفاعلية' : 'Interactive Operations'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isRTL ? 'إجمالي العمليات المنجزة' : 'Total completed operations'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-brand-primary">120M+</div>
                <p className="text-xs text-muted-foreground mt-2">
                  +2.5K {isRTL ? 'اليوم' : 'today'}
                </p>
              </CardContent>
            </Card>
            <Card className="min-h-[160px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? 'التقارير المتاحة' : 'Available Reports'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isRTL ? 'تقارير مفصلة متنوعة' : 'Detailed comprehensive reports'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-brand-success">34+</div>
                <Badge className="mt-2 bg-status-success text-white">
                  {isRTL ? 'متاح' : 'Available'}
                </Badge>
              </CardContent>
            </Card>
            <Card className="min-h-[160px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? 'معدل النجاح' : 'Success Rate'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isRTL ? 'معدل نجاح العمليات' : 'Operation success percentage'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-brand-accent">99.7%</div>
                <Progress value={99.7} className="mt-2" />
              </CardContent>
            </Card>
            <Card className="min-h-[160px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? 'المنشآت المسجلة' : 'Registered Establishments'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isRTL ? 'منشآت مسجلة في النظام' : 'Establishments registered in system'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-brand-warning">15.2K</div>
                <p className="text-xs text-muted-foreground mt-2">
                  +45 {isRTL ? 'هذا الشهر' : 'this month'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="resident-services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? 'خدمات المقيمين الشاملة' : 'Comprehensive Resident Services'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'إدارة شاملة لشؤون المقيمين والإقامات' : 'Comprehensive management of resident affairs and residence permits'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'تجديد الإقامات' : 'Residence Permit Renewal'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'تجديد إقامات الموظفين إلكترونياً' : 'Electronic renewal of employee residence permits'}
                    </p>
                  </div>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متاح' : 'Available'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'تأشيرات الخروج والعودة' : 'Exit Re-entry Visas'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'إصدار تأشيرات الخروج والعودة للمقيمين' : 'Issue exit re-entry visas for residents'}
                    </p>
                  </div>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متاح' : 'Available'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'نقل المعلومات' : 'Information Transfer'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'نقل معلومات المقيمين بين المنشآت' : 'Transfer resident information between establishments'}
                    </p>
                  </div>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متاح' : 'Available'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'إلغاء الإقامات' : 'Residence Cancellation'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'إلغاء إقامات الموظفين المغادرين' : 'Cancel residence permits for departing employees'}
                    </p>
                  </div>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متاح' : 'Available'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'تحديث البيانات' : 'Data Updates'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'تحديث بيانات المقيمين والمعلومات الشخصية' : 'Update resident data and personal information'}
                    </p>
                  </div>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متاح' : 'Available'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="passport-operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? 'عمليات الجوازات المتقدمة' : 'Advanced Passport Operations'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'إدارة شاملة لعمليات الجوازات والتأشيرات' : 'Comprehensive management of passport and visa operations'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'التحقق من التأشيرات' : 'Visa Verification'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'التحقق من صحة التأشيرات والوثائق' : 'Verify the validity of visas and documents'}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? '2,456 عملية اليوم' : '2,456 operations today'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'تصاريح دخول مكة' : 'Makkah Entry Permits'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'إصدار تصاريح دخول مكة المكرمة' : 'Issue permits for entering Makkah Al-Mukarramah'}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? '890 تصريح اليوم' : '890 permits today'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'توصيل الإقامات' : 'Residence Delivery'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'خدمة توصيل الإقامات المعالجة' : 'Delivery service for processed residence permits'}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-status-info text-white">
                      {isRTL ? 'متاح' : 'Available'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? '345 طلب اليوم' : '345 requests today'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'الباقات المتخصصة' : 'Specialized Packages'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'باقات مقيم الشاملة والمتخصصة' : 'Comprehensive and specialized Muqeem packages'}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-status-warning text-white">
                      {isRTL ? 'قريباً' : 'Coming Soon'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? '17 خدمة تفاعلية' : '17 interactive services'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports-analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? 'التقارير والتحليلات المتقدمة' : 'Advanced Reports & Analytics'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'تقارير شاملة ومفصلة لإدارة المقيمين' : 'Comprehensive and detailed reports for resident management'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'تقرير المقيمين' : 'Residents Report'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'تقرير شامل عن جميع المقيمين وحالاتهم' : 'Comprehensive report on all residents and their status'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {isRTL ? 'تحقق متاح' : 'Verification Available'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      {isRTL ? 'إنشاء' : 'Generate'}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'تقرير الزوار' : 'Visitors Report'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'تقرير مفصل عن الزوار وتأشيراتهم' : 'Detailed report on visitors and their visas'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {isRTL ? 'تحقق متاح' : 'Verification Available'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      {isRTL ? 'إنشاء' : 'Generate'}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'تقرير العمليات' : 'Operations Report'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'تقرير عن جميع العمليات المنجزة' : 'Report on all completed operations'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'تلقائي' : 'Automated'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      {isRTL ? 'عرض' : 'View'}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'تقرير الامتثال' : 'Compliance Report'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'تقرير الامتثال للوائح الجوازات' : 'Passport regulations compliance report'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-status-info text-white">
                      {isRTL ? 'أسبوعي' : 'Weekly'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      {isRTL ? 'تحميل' : 'Download'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ELMPlatform;