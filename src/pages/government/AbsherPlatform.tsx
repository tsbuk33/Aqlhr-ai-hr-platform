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
            {isRTL ? 'منصة إلكترونية متكاملة لخدمات الأعمال الحكومية' : 'Integrated Digital Platform for Government Business Services'}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-status-success text-white">
            {isRTL ? 'متصل' : 'Connected'}
          </Badge>
          <Button variant="outline">
            {isRTL ? 'اختبار الاتصال' : 'Test API Connection'}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid w-full grid-cols-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="identity-services">{isRTL ? 'خدمات الهوية' : 'Identity Services'}</TabsTrigger>
          <TabsTrigger value="business-operations">{isRTL ? 'العمليات التجارية' : 'Business Operations'}</TabsTrigger>
          <TabsTrigger value="compliance">{isRTL ? 'الامتثال والأمان' : 'Compliance & Security'}</TabsTrigger>
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
        
        <TabsContent value="identity-services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? 'خدمات التحقق من الهوية' : 'Identity Verification Services'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'خدمات التحقق من هوية الأفراد والموظفين' : 'Individual and employee identity verification services'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'التحقق من الهوية الوطنية' : 'National ID Verification'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'التحقق من صحة أرقام الهوية الوطنية للمواطنين السعوديين' : 'Verify the validity of national ID numbers for Saudi citizens'}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? '1,876 عملية اليوم' : '1,876 verifications today'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'التحقق من الإقامة' : 'Residence Permit Verification'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'التحقق من صحة أرقام الإقامة للمقيمين' : 'Verify residence permit numbers for residents'}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? '580 عملية اليوم' : '580 verifications today'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'التحقق من جواز السفر' : 'Passport Verification'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'التحقق من صحة بيانات جوازات السفر' : 'Verify passport document information'}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? '234 عملية اليوم' : '234 verifications today'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'التحقق من الحالة الوظيفية' : 'Employment Status Verification'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'التحقق من الحالة الوظيفية للموظفين' : 'Verify employment status of workers'}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? '456 عملية اليوم' : '456 verifications today'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="business-operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? 'العمليات التجارية المتكاملة' : 'Integrated Business Operations'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'إدارة شاملة للعمليات التجارية والموارد البشرية' : 'Comprehensive management of business operations and human resources'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'إدارة تأشيرات العمل' : 'Work Visa Management'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'إصدار وتجديد وإلغاء تأشيرات العمل للموظفين' : 'Issue, renew and cancel work visas for employees'}
                    </p>
                  </div>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متاح' : 'Available'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'خدمات نقل الكفالة' : 'Sponsorship Transfer Services'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'نقل كفالة الموظفين بين أصحاب العمل' : 'Transfer employee sponsorship between employers'}
                    </p>
                  </div>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متاح' : 'Available'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'خدمات الخروج والعودة' : 'Exit Re-entry Services'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'إصدار تأشيرات الخروج والعودة للموظفين' : 'Issue exit re-entry visas for employees'}
                    </p>
                  </div>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متاح' : 'Available'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'إدارة رخص العمل' : 'Work Permit Management'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'إصدار وتجديد رخص العمل للمؤسسات' : 'Issue and renew work permits for establishments'}
                    </p>
                  </div>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متاح' : 'Available'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {isRTL ? 'تقارير العمالة' : 'Labor Reports'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? 'تقارير شاملة عن وضع العمالة والامتثال' : 'Comprehensive reports on labor status and compliance'}
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
        
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? 'الامتثال والأمان' : 'Compliance & Security Framework'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'ضمان الامتثال للوائح وحماية البيانات' : 'Ensuring regulatory compliance and data protection'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'تشفير البيانات' : 'Data Encryption'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تشفير متقدم لحماية البيانات الحساسة' : 'Advanced encryption to protect sensitive data'}
                  </p>
                  <Badge className="bg-status-success text-white">AES-256</Badge>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'أمان واجهة برمجة التطبيقات' : 'API Security'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'حماية متقدمة لواجهات برمجة التطبيقات' : 'Advanced protection for application programming interfaces'}
                  </p>
                  <Badge className="bg-status-success text-white">OAuth 2.0</Badge>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'قانون حماية البيانات الشخصية' : 'Personal Data Protection Law'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'الامتثال لقانون حماية البيانات الشخصية السعودي' : 'Compliance with Saudi Personal Data Protection Law'}
                  </p>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'متوافق' : 'Compliant'}
                  </Badge>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'سجلات التدقيق' : 'Audit Trails'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تتبع شامل لجميع العمليات والتغييرات' : 'Comprehensive tracking of all operations and changes'}
                  </p>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'نشط' : 'Active'}
                  </Badge>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'المراقبة في الوقت الفعلي' : 'Real-time Monitoring'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'مراقبة مستمرة للأنشطة والأمان' : 'Continuous monitoring of activities and security'}
                  </p>
                  <Badge className="bg-status-success text-white">24/7</Badge>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">
                    {isRTL ? 'النسخ الاحتياطي للبيانات' : 'Data Backup'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'نسخ احتياطية آمنة ومتعددة المواقع' : 'Secure and multi-location data backups'}
                  </p>
                  <Badge className="bg-status-success text-white">
                    {isRTL ? 'آمن' : 'Secure'}
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

export default AbsherPlatform;