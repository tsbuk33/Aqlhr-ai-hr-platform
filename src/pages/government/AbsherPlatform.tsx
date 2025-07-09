import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

const AbsherPlatform = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <div className={`container mx-auto p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isRTL ? 'منصة أبشر أعمال' : 'Absher Business Platform'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'منصة إلكترونية متكاملة لخدمات الأعمال الحكومية' : 'Integrated electronic platform for government business services'}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-status-success text-white">
            {isRTL ? 'متصل' : 'Online'}
          </Badge>
          <Button variant="outline">
            {isRTL ? 'اختبار الاتصال' : 'Test Connection'}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid w-full grid-cols-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="business-services">{isRTL ? 'خدمات الأعمال' : 'Business Services'}</TabsTrigger>
          <TabsTrigger value="hr-services">{isRTL ? 'خدمات الموارد البشرية' : 'HR Services'}</TabsTrigger>
          <TabsTrigger value="certificates">{isRTL ? 'الشهادات والوثائق' : 'Certificates'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="min-h-[160px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? 'طلبات التحقق النشطة' : 'Active Verification Requests'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isRTL ? 'إجمالي طلبات التحقق اليوم' : 'Total verification requests today'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-brand-primary">1,234</div>
                <p className="text-xs text-muted-foreground mt-2">
                  +45 {isRTL ? 'اليوم' : 'today'}
                </p>
              </CardContent>
            </Card>
            <Card className="min-h-[160px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? 'معدل نجاح التحقق' : 'Verification Success Rate'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isRTL ? 'نسبة نجاح عمليات التحقق' : 'Success percentage of verifications'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-brand-success">99.2%</div>
                <Progress value={99.2} className="mt-2" />
              </CardContent>
            </Card>
            <Card className="min-h-[160px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? 'الشهادات المُصدرة' : 'Issued Certificates'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isRTL ? 'شهادات صادرة هذا الشهر' : 'Certificates issued this month'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-brand-accent">856</div>
                <Badge className="mt-2 bg-status-success text-white">
                  {isRTL ? 'نشط' : 'Active'}
                </Badge>
              </CardContent>
            </Card>
            <Card className="min-h-[160px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {isRTL ? 'الخدمات المتاحة' : 'Available Services'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {isRTL ? 'خدمات أبشر أعمال النشطة' : 'Active Absher Business services'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-brand-warning">47</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {isRTL ? 'خدمة متاحة' : 'services available'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="business-services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? 'خدمات الأعمال الحكومية' : 'Government Business Services'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'الخدمات الحكومية المتاحة للمؤسسات والشركات' : 'Government services available for organizations and companies'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'خدمات التجارة والاستثمار' : 'Trade & Investment Services'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تراخيص تجارية، سجل تجاري، شهادات الاستثمار' : 'Business licenses, commercial registration, investment certificates'}
                  </p>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متاح' : 'Available'}
                  </Badge>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'خدمات الموارد البشرية' : 'Human Resources Services'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تأشيرات العمل، رخص العمل، خدمات العمالة' : 'Work visas, work permits, labor services'}
                  </p>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متاح' : 'Available'}
                  </Badge>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'الخدمات المالية والضريبية' : 'Financial & Tax Services'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'شهادات ضريبية، تصاريح زكاة، خدمات مصرفية' : 'Tax certificates, zakat permits, banking services'}
                  </p>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متاح' : 'Available'}
                  </Badge>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'خدمات النقل والمواصلات' : 'Transportation Services'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تراخيص نقل، رخص قيادة تجارية، خدمات مرورية' : 'Transport licenses, commercial driving licenses, traffic services'}
                  </p>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متاح' : 'Available'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hr-services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? 'خدمات الموارد البشرية المتخصصة' : 'Specialized HR Services'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'خدمات إدارة الموارد البشرية والعمالة' : 'Human resources and workforce management services'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'خدمة التحقق من هوية الموظفين' : 'Employee Identity Verification Service'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'التحقق من صحة هويات الموظفين والمتقدمين للعمل' : 'Verify identity of employees and job applicants'}
                    </p>
                  </div>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'نشط' : 'Active'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'خدمة إصدار شهادة العمل' : 'Employment Certificate Service'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'إصدار شهادات عمل رسمية للموظفين' : 'Issue official employment certificates for employees'}
                    </p>
                  </div>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'نشط' : 'Active'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'خدمة التحقق من الشهادات' : 'Certificate Verification Service'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'التحقق من صحة الشهادات الأكاديمية والمهنية' : 'Verify academic and professional certificates'}
                    </p>
                  </div>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'نشط' : 'Active'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'خدمة إدارة الإقامات' : 'Residence Management Service'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'إدارة تجديد وتعديل الإقامات للموظفين' : 'Manage renewal and modification of employee residences'}
                    </p>
                  </div>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'نشط' : 'Active'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? 'الشهادات والوثائق الرسمية' : 'Official Certificates & Documents'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'الوثائق والشهادات المعتمدة من الجهات الحكومية' : 'Documents and certificates authorized by government entities'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'شهادة السجل التجاري' : 'Commercial Registration Certificate'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'شهادة رسمية لتسجيل الأعمال التجارية' : 'Official certificate for business registration'}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">856 {isRTL ? 'مُصدرة' : 'issued'}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? 'هذا الشهر' : 'this month'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'شهادة عدم ممانعة' : 'No Objection Certificate'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'شهادة عدم ممانعة للموظفين وأصحاب الأعمال' : 'No objection certificate for employees and business owners'}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">432 {isRTL ? 'مُصدرة' : 'issued'}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? 'هذا الشهر' : 'this month'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'شهادة التأمينات الاجتماعية' : 'Social Insurance Certificate'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'شهادة اشتراك في نظام التأمينات الاجتماعية' : 'Social insurance system subscription certificate'}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">234 {isRTL ? 'مُصدرة' : 'issued'}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? 'هذا الشهر' : 'this month'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'شهادة براءة الذمة' : 'Clearance Certificate'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'شهادة براءة ذمة مالية وإدارية' : 'Financial and administrative clearance certificate'}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">189 {isRTL ? 'مُصدرة' : 'issued'}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? 'هذا الشهر' : 'this month'}
                    </span>
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

export default AbsherPlatform;