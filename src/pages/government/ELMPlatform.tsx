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
            {isRTL ? 'منصة مقيم' : 'Muqeem Platform - Resident Management System'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'منصة إلكترونية متكاملة لإدارة شؤون المقيمين والجوازات' : 'Comprehensive Electronic Platform for Resident Affairs Management and Passport Services Integration'}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-status-success text-white">
            {isRTL ? 'متصل' : 'API Connected'}
          </Badge>
          <Button variant="outline">
            {isRTL ? 'اختبار الاتصال' : 'Test Integration'}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid w-full grid-cols-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Dashboard Overview'}</TabsTrigger>
          <TabsTrigger value="resident-services">{isRTL ? 'خدمات المقيمين' : 'Workforce Management'}</TabsTrigger>
          <TabsTrigger value="passport-operations">{isRTL ? 'عمليات الجوازات' : 'Immigration Services'}</TabsTrigger>
          <TabsTrigger value="reports-analytics">{isRTL ? 'التقارير والتحليلات' : 'Compliance Reporting'}</TabsTrigger>
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
                {isRTL ? 'خدمات المقيمين الشاملة' : 'Enterprise Workforce Immigration Management'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'إدارة شاملة لشؤون المقيمين والإقامات' : 'End-to-end immigration lifecycle management for corporate workforce operations'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                     <span className="font-medium">
                       {isRTL ? 'تجديد الإقامات' : 'Automated Residence Permit Renewal'}
                     </span>
                     <p className="text-sm text-muted-foreground">
                       {isRTL ? 'تجديد إقامات الموظفين إلكترونياً' : 'Streamlined electronic renewal process for employee residence permits with bulk processing capabilities'}
                     </p>
                   </div>
                   <Badge className="bg-status-success text-white">
                     {isRTL ? 'متاح' : 'Available'}
                   </Badge>
                 </div>
                 <div className="flex justify-between items-center">
                   <div>
                     <span className="font-medium">
                       {isRTL ? 'تأشيرات الخروج والعودة' : 'Business Travel Visa Management'}
                     </span>
                     <p className="text-sm text-muted-foreground">
                       {isRTL ? 'إصدار تأشيرات الخروج والعودة للمقيمين' : 'Corporate travel authorization system for exit re-entry visas with approval workflows'}
                     </p>
                   </div>
                   <Badge className="bg-status-success text-white">
                     {isRTL ? 'متاح' : 'Available'}
                   </Badge>
                 </div>
                 <div className="flex justify-between items-center">
                   <div>
                     <span className="font-medium">
                       {isRTL ? 'نقل المعلومات' : 'Employee Transfer Management'}
                     </span>
                     <p className="text-sm text-muted-foreground">
                       {isRTL ? 'نقل معلومات المقيمين بين المنشآت' : 'Seamless employee transfer process between corporate entities with data migration support'}
                     </p>
                   </div>
                   <Badge className="bg-status-success text-white">
                     {isRTL ? 'متاح' : 'Available'}
                   </Badge>
                 </div>
                 <div className="flex justify-between items-center">
                   <div>
                     <span className="font-medium">
                       {isRTL ? 'إلغاء الإقامات' : 'Employee Offboarding Services'}
                     </span>
                     <p className="text-sm text-muted-foreground">
                       {isRTL ? 'إلغاء إقامات الموظفين المغادرين' : 'Automated termination processing for departing employees with compliance documentation'}
                     </p>
                   </div>
                   <Badge className="bg-status-success text-white">
                     {isRTL ? 'متاح' : 'Available'}
                   </Badge>
                 </div>
                 <div className="flex justify-between items-center">
                   <div>
                     <span className="font-medium">
                       {isRTL ? 'تحديث البيانات' : 'Employee Data Management'}
                     </span>
                     <p className="text-sm text-muted-foreground">
                       {isRTL ? 'تحديث بيانات المقيمين والمعلومات الشخصية' : 'Real-time employee profile updates with government database synchronization'}
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
                {isRTL ? 'عمليات الجوازات المتقدمة' : 'Enterprise Immigration & Compliance Operations'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'إدارة شاملة لعمليات الجوازات والتأشيرات' : 'Comprehensive immigration compliance management with automated workflows and real-time status tracking'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'التحقق من التأشيرات' : 'Enterprise Visa Verification System'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'التحقق من صحة التأشيرات والوثائق' : 'Real-time visa and document authentication with government database integration'}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'نشط' : 'Live API'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? '2,456 عملية اليوم' : '2,456 verifications today'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'تصاريح دخول مكة' : 'Religious Tourism Permits'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'إصدار تصاريح دخول مكة المكرمة' : 'Automated Makkah entry permit processing for religious tourism workforce'}
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
                    {isRTL ? 'توصيل الإقامات' : 'Document Logistics Service'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'خدمة توصيل الإقامات المعالجة' : 'Enterprise document delivery service for processed residence permits and corporate documentation'}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-status-info text-white">
                      {isRTL ? 'متاح' : 'Available'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? '345 طلب اليوم' : '345 deliveries today'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'الباقات المتخصصة' : 'Enterprise Service Packages'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'باقات مقيم الشاملة والمتخصصة' : 'Comprehensive immigration service packages with unlimited operations and priority support'}
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
                {isRTL ? 'التقارير والتحليلات المتقدمة' : 'Executive Immigration Reporting & Analytics'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'تقارير شاملة ومفصلة لإدارة المقيمين' : 'Enterprise-grade immigration analytics with government compliance verification and audit trail capabilities'}
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