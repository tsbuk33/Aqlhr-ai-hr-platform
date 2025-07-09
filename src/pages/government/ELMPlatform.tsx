import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Database, 
  Users, 
  Activity, 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Monitor,
  CreditCard,
  UserCheck,
  Plane,
  Building,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

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

          {/* SanadHR Employee Immigration Integration */}
          <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-success/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-primary">
                    {isRTL ? 'التكامل المباشر مع نظام الموارد البشرية - سند' : 'Direct Employee Immigration Integration - SanadHR'}
                  </CardTitle>
                  <CardDescription>
                    {isRTL 
                      ? 'ربط ثنائي الاتجاه مع نظام إدارة الموارد البشرية لإدارة شؤون الموظفين المقيمين' 
                      : 'Bi-directional integration with HR system for comprehensive employee resident management'
                    }
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Employee Immigration Data Flow */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {isRTL ? 'تدفق بيانات إقامة الموظفين' : 'Employee Immigration Data Flow'}
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-l-primary">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {isRTL ? 'إدارة الإقامات والتأشيرات' : 'Residence Permits & Visa Management'}
                        </span>
                        <div className="flex items-center gap-2">
                          <Activity className="h-3 w-3 text-success animate-pulse" />
                          <span className="text-xs text-success">{isRTL ? 'مزامن تلقائياً' : 'Auto-Synced'}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isRTL 
                          ? 'تزامن مباشر لحالات الإقامة والتأشيرات مع ملفات الموظفين' 
                          : 'Real-time sync of residence and visa status with employee profiles'
                        }
                      </p>
                    </div>

                    <div className="p-3 bg-success/5 rounded-lg border-l-4 border-l-success">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {isRTL ? 'تجديد الإقامات التلقائي' : 'Automated Residence Renewal'}
                        </span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-success" />
                          <span className="text-xs text-success">{isRTL ? 'نشط' : 'Active'}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isRTL 
                          ? 'تجديد تلقائي للإقامات قبل انتهاء الصلاحية بـ 90 يوم' 
                          : 'Automatic renewal processing 90 days before expiration'
                        }
                      </p>
                    </div>

                    <div className="p-3 bg-warning/5 rounded-lg border-l-4 border-l-warning">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {isRTL ? 'إنهاء خدمات الموظفين' : 'Employee Exit Processing'}
                        </span>
                        <div className="flex items-center gap-2">
                          <Plane className="h-3 w-3 text-warning" />
                          <span className="text-xs text-warning">{isRTL ? 'آلي' : 'Automated'}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isRTL 
                          ? 'معالجة تلقائية لإلغاء الإقامات عند إنهاء خدمة الموظفين' 
                          : 'Automatic residence cancellation upon employee termination'
                        }
                      </p>
                    </div>

                    <div className="p-3 bg-accent/5 rounded-lg border-l-4 border-l-accent">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {isRTL ? 'تقارير الامتثال المباشرة' : 'Real-time Compliance Reports'}
                        </span>
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3 text-accent" />
                          <span className="text-xs text-accent">{isRTL ? 'مباشر' : 'Live'}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isRTL 
                          ? 'تقارير مباشرة لحالة امتثال جميع الموظفين المقيمين' 
                          : 'Live compliance status reports for all resident employees'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Integration Status & Monitoring */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-success flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    {isRTL ? 'مراقبة التكامل المباشر' : 'Live Integration Monitoring'}
                  </h4>
                  
                  <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-success">
                        {isRTL ? 'اتصال نظام مقيم' : 'Muqeem System Connection'}
                      </span>
                      <Badge className="bg-success text-white">
                        <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                        {isRTL ? 'متصل' : 'Connected'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{isRTL ? 'آخر مزامنة:' : 'Last Sync:'}</span>
                        <span className="font-mono">
                          {isRTL ? 'منذ 3 دقائق' : '3 min ago'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>{isRTL ? 'موظفين مسجلين:' : 'Registered Employees:'}</span>
                        <span className="font-mono text-primary">1,247</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>{isRTL ? 'إقامات نشطة:' : 'Active Residences:'}</span>
                        <span className="font-mono text-success">1,189</span>
                      </div>

                      <div className="flex justify-between">
                        <span>{isRTL ? 'تجديدات معلقة:' : 'Pending Renewals:'}</span>
                        <span className="font-mono text-warning">58</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h5 className="font-medium text-primary mb-2">
                      {isRTL ? 'الخدمات المتكاملة' : 'Integrated Services'}
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-success" />
                        <span className="text-sm">
                          {isRTL ? 'تجديد الإقامات التلقائي' : 'Automated Residence Renewal'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-success" />
                        <span className="text-sm">
                          {isRTL ? 'إدارة تأشيرات السفر' : 'Travel Visa Management'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-success" />
                        <span className="text-sm">
                          {isRTL ? 'نقل الكفالة الإلكتروني' : 'Electronic Sponsorship Transfer'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-success" />
                        <span className="text-sm">
                          {isRTL ? 'إنهاء الخدمة التلقائي' : 'Automated Exit Processing'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-success" />
                        <span className="text-sm">
                          {isRTL ? 'تقارير الامتثال المباشرة' : 'Real-time Compliance Reports'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions for Employee Immigration */}
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
                <h5 className="font-medium mb-3 text-primary">
                  {isRTL ? 'إجراءات سريعة لشؤون الموظفين' : 'Employee Immigration Quick Actions'}
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <button className="p-3 bg-white rounded border border-primary/20 hover:border-primary/40 transition-colors text-left">
                    <div className="font-medium text-sm text-primary">
                      {isRTL ? 'مزامنة فورية' : 'Instant Sync'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isRTL ? 'مزامنة بيانات الموظفين' : 'Sync employee data'}
                    </div>
                  </button>
                  
                  <button className="p-3 bg-white rounded border border-success/20 hover:border-success/40 transition-colors text-left">
                    <div className="font-medium text-sm text-success">
                      {isRTL ? 'تقرير الإقامات' : 'Residence Report'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isRTL ? 'حالة جميع الإقامات' : 'All residence status'}
                    </div>
                  </button>
                  
                  <button className="p-3 bg-white rounded border border-warning/20 hover:border-warning/40 transition-colors text-left">
                    <div className="font-medium text-sm text-warning">
                      {isRTL ? 'التجديدات المعلقة' : 'Pending Renewals'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isRTL ? 'عرض التجديدات المطلوبة' : 'View required renewals'}
                    </div>
                  </button>
                  
                  <button className="p-3 bg-white rounded border border-accent/20 hover:border-accent/40 transition-colors text-left">
                    <div className="font-medium text-sm text-accent">
                      {isRTL ? 'إعدادات التكامل' : 'Integration Settings'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isRTL ? 'تخصيص الإعدادات' : 'Customize settings'}
                    </div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
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