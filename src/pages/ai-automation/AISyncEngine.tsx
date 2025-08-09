import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, RefreshCw, Database, Zap, CheckCircle, Clock, Network, Activity, Shield } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { AqlHRAIAssistant } from '@/components/ai';

const AISyncEngine = () => {
  const { language, isRTL } = useLanguage();

  const translations = {
    en: {
      title: "AI Sync Engine",
      subtitle: "Real-time synchronization across all HR modules with intelligent event processing",
      how_title: "How AI Sync Works",
      how_subtitle: "Intelligent real-time synchronization powered by advanced AI algorithms",
      event_detection: "Event Detection", 
      event_detection_desc: "AI monitors all system changes in real-time, detecting critical events instantly",
      microsecond_detection: "Microsecond Detection",
      smart_routing: "Smart Routing",
      smart_routing_desc: "Intelligent prioritization and routing of sync events based on business impact",
      ai_prioritized: "AI Prioritized",
      atomic_updates: "Atomic Updates",
      atomic_updates_desc: "Guaranteed data consistency with transactional integrity across all modules",
      success_rate: "99.97% Success Rate",
      daily_sync_events: "Daily Sync Events",
      real_time_processing: "Real-time Processing",
      sync_success_rate: "Sync Success Rate",
      monitoring_24_7: "24/7 Monitoring",
      average_latency: "Average Latency",
      lightning_fast: "Lightning Fast",
      connected_modules: "Connected Modules",
      all_systems_online: "All Systems Online",
      force_full_sync: "Force Full Sync",
      view_sync_logs: "View Sync Logs",
      run_health_check: "Run Health Check"
    },
    ar: {
      title: "محرك المزامنة الذكي",
      subtitle: "مزامنة فورية عبر جميع وحدات الموارد البشرية مع معالجة ذكية للأحداث",
      how_title: "كيف يعمل المحرك الذكي",
      how_subtitle: "مزامنة فورية ذكية مدعومة بخوارزميات ذكاء اصطناعي متقدمة",
      event_detection: "كشف الأحداث",
      event_detection_desc: "الذكاء الاصطناعي يراقب جميع تغييرات النظام فورياً، ويكتشف الأحداث الحرجة على الفور",
      microsecond_detection: "كشف بالميكروثانية",
      smart_routing: "التوجيه الذكي",
      smart_routing_desc: "ترتيب أولويات وتوجيه ذكي لأحداث المزامنة بناءً على التأثير التجاري",
      ai_prioritized: "مرتب بالذكاء الاصطناعي",
      atomic_updates: "التحديثات الذرية",
      atomic_updates_desc: "ضمان اتساق البيانات مع النزاهة المعاملية عبر جميع الوحدات",
      success_rate: "معدل نجاح 99.97%",
      daily_sync_events: "أحداث المزامنة اليومية",
      real_time_processing: "معالجة فورية",
      sync_success_rate: "معدل نجاح المزامنة",
      monitoring_24_7: "مراقبة 24/7",
      average_latency: "متوسط التأخير",
      lightning_fast: "سريع كالبرق",
      connected_modules: "الوحدات المتصلة",
      all_systems_online: "جميع الأنظمة متصلة",
      force_full_sync: "فرض مزامنة كاملة",
      view_sync_logs: "عرض سجلات المزامنة",
      run_health_check: "تشغيل فحص الصحة"
    }
  };

  const tabTranslations = {
    en: {
      sync_status: "Sync Status",
      architecture: "Architecture", 
      monitoring: "Monitoring",
      performance: "Performance"
    },
    ar: {
      sync_status: "حالة المزامنة",
      architecture: "المعمارية",
      monitoring: "المراقبة", 
      performance: "الأداء"
    }
  };

  const statusTranslations = {
    en: {
      module_sync_title: "Module Synchronization Status",
      module_sync_desc: "Real-time sync status across all HR modules and government integrations",
      core_hr_modules: "Core HR Modules",
      government_integrations: "Government Integrations",
      employee_data: "Employee Data",
      payroll_processing: "Payroll Processing",
      performance_management: "Performance Management",
      time_attendance: "Time & Attendance",
      gosi_integration: "GOSI Integration",
      qiwa_platform: "Qiwa Platform",
      mudad_integration: "Mudad Integration",
      
      synced: "Synced",
      events_day: "events/day"
    },
    ar: {
      module_sync_title: "حالة مزامنة الوحدات",
      module_sync_desc: "حالة المزامنة الفورية عبر جميع وحدات الموارد البشرية والتكاملات الحكومية",
      core_hr_modules: "وحدات الموارد البشرية الأساسية",
      government_integrations: "التكاملات الحكومية",
      employee_data: "بيانات الموظفين",
      payroll_processing: "معالجة كشوف المرتبات",
      performance_management: "إدارة الأداء",
      time_attendance: "الوقت والحضور",
      gosi_integration: "تكامل التأمينات الاجتماعية",
      qiwa_platform: "منصة قوى",
      mudad_integration: "تكامل مداد",
      
      synced: "متزامن",
      events_day: "حدث/يوم"
    }
  };

  const archTranslations = {
    en: {
      title: "Sync Architecture",
      desc: "Distributed, fault-tolerant architecture ensuring reliable data synchronization",
      event_driven: "Event-Driven Architecture",
      event_driven_desc: "Microservices communicate through events, ensuring loose coupling and high scalability",
      distributed_db: "Distributed Database",
      distributed_db_desc: "Data replicated across multiple regions for high availability and performance",
      fault_tolerance: "Fault Tolerance",
      fault_tolerance_desc: "Automatic failover and recovery mechanisms ensure 99.9% uptime"
    },
    ar: {
      title: "معمارية المزامنة",
      desc: "معمارية موزعة ومقاومة للأخطاء تضمن مزامنة موثوقة للبيانات",
      event_driven: "معمارية مدفوعة بالأحداث",
      event_driven_desc: "الخدمات المصغرة تتواصل من خلال الأحداث، مما يضمن الاقتران المرن وقابلية التوسع العالية",
      distributed_db: "قاعدة بيانات موزعة",
      distributed_db_desc: "البيانات مكررة عبر مناطق متعددة لتوفر عالي وأداء محسن",
      fault_tolerance: "مقاومة الأخطاء",
      fault_tolerance_desc: "آليات التبديل التلقائي والاسترداد تضمن وقت تشغيل 99.9%"
    }
  };

  const monitorTranslations = {
    en: {
      title: "Live Monitoring Dashboard",
      desc: "Real-time insights into sync performance and system health",
      system_uptime: "System Uptime",
      avg_sync_latency: "Avg Sync Latency", 
      failed_syncs_today: "Failed Syncs Today",
      recent_activity: "Recent Sync Activity",
      employee_master: "Employee Master",
      payroll_system: "Payroll System",
      profile_update: "Profile Update",
      salary_adjustment: "Salary Adjustment",
      clock_in_out: "Clock In/Out",
      contribution_update: "Contribution Update",
      success: "Success",
      retry: "Retry"
    },
    ar: {
      title: "لوحة المراقبة المباشرة",
      desc: "رؤى فورية حول أداء المزامنة وصحة النظام",
      system_uptime: "وقت تشغيل النظام",
      avg_sync_latency: "متوسط تأخير المزامنة",
      failed_syncs_today: "المزامنات الفاشلة اليوم",
      recent_activity: "نشاط المزامنة الأخير",
      employee_master: "ملف الموظف الرئيسي",
      payroll_system: "نظام كشوف المرتبات",
      profile_update: "تحديث الملف الشخصي",
      salary_adjustment: "تعديل الراتب",
      clock_in_out: "تسجيل الدخول/الخروج",
      contribution_update: "تحديث المساهمات",
      success: "نجح",
      retry: "إعادة محاولة"
    }
  };

  const perfTranslations = {
    en: {
      title: "Performance Analytics",
      desc: "Advanced metrics and optimization insights",
      trends: "Performance Trends",
      avg_latency: "Average Latency",
      this_month: "this month",
      success_rate: "Success Rate",
      improvement: "improvement",
      throughput: "Throughput",
      increase: "increase",
      optimization: "Auto Optimizations",
      db_pooling: "Database connection pooling optimized for peak load",
      ai_load_balancing: "AI-powered load balancing across sync nodes"
    },
    ar: {
      title: "تحليلات الأداء",
      desc: "مؤشرات متقدمة ورؤى للتحسين",
      trends: "اتجاهات الأداء",
      avg_latency: "متوسط التأخير",
      this_month: "هذا الشهر",
      success_rate: "معدل النجاح",
      improvement: "تحسن",
      throughput: "الإنتاجية",
      increase: "زيادة",
      optimization: "التحسينات التلقائية",
      db_pooling: "تم تحسين تجميع اتصالات قاعدة البيانات للذروة",
      ai_load_balancing: "توزيع الأحمال المدعوم بالذكاء الاصطناعي عبر عقد المزامنة"
    }
  };

  const controlTranslations = {
    en: {
      title: "Sync Control Center",
      desc: "Manual sync controls and health monitoring tools"
    },
    ar: {
      title: "مركز التحكم في المزامنة",
      desc: "أدوات التحكم اليدوي في المزامنة ومراقبة الصحة"
    }
  };

  const t = (key: string) => translations[language][key] || key;
  const tTabs = (key: string) => tabTranslations[language][key] || key;
  const tStatus = (key: string) => statusTranslations[language][key] || key;
  const tArch = (key: string) => archTranslations[language][key] || key;
  const tMonitor = (key: string) => monitorTranslations[language][key] || key;
  const tPerf = (key: string) => perfTranslations[language][key] || key;
  const tControl = (key: string) => controlTranslations[language][key] || key;
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight pb-2">
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Sync Process Visualization */}
      <Card className="p-8">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <RefreshCw className="h-6 w-6 text-brand-primary" />
            {t('how_title')}
          </CardTitle>
          <CardDescription>{t('how_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile Layout */}
          <div className="md:hidden space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t('event_detection')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('event_detection_desc')}
              </p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {t('microsecond_detection')}
              </Badge>
            </div>
            
            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <Network className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t('smart_routing')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('smart_routing_desc')}
              </p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {t('ai_prioritized')}
              </Badge>
            </div>
            
            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t('atomic_updates')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('atomic_updates_desc')}
              </p>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {t('success_rate')}
              </Badge>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className={`hidden md:flex items-stretch justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Step 1 */}
            <div className="flex-1 text-center space-y-4 flex flex-col justify-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t('event_detection')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('event_detection_desc')}
              </p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mx-auto">
                {t('microsecond_detection')}
              </Badge>
            </div>

            {/* Arrow 1 */}
            <div className="px-4 flex items-center">
              <ArrowRight className={`h-6 w-6 text-muted-foreground ${isRTL ? '' : 'rotate-180'}`} />
            </div>

            {/* Step 2 */}
            <div className="flex-1 text-center space-y-4 flex flex-col justify-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <Network className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t('smart_routing')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('smart_routing_desc')}
              </p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mx-auto">
                {t('ai_prioritized')}
              </Badge>
            </div>

            {/* Arrow 2 */}
            <div className="px-4 flex items-center">
              <ArrowRight className={`h-6 w-6 text-muted-foreground ${isRTL ? '' : 'rotate-180'}`} />
            </div>

            {/* Step 3 */}
            <div className="flex-1 text-center space-y-4 flex flex-col justify-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t('atomic_updates')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('atomic_updates_desc')}
              </p>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 mx-auto">
                {t('success_rate')}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-primary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">{t('daily_sync_events')}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-primary">15,678</div>
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-brand-success" />
                <span className="text-brand-success">{t('real_time_processing')}</span>
              </div>
              <p className="text-xs text-muted-foreground">Peak: 2,341 events/hour</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-secondary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">{t('sync_success_rate')}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-3">
              <div className="text-4xl font-bold text-brand-success">99.97%</div>
              <Progress value={99.97} className="h-2" />
              <p className="text-xs text-muted-foreground">{t('monitoring_24_7')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-accent opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">{t('average_latency')}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-accent">0.23s</div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-brand-accent" />
                <span className="text-muted-foreground">{t('lightning_fast')}</span>
              </div>
              <p className="text-xs text-muted-foreground">Target: &lt;0.5s</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-hero opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">{t('connected_modules')}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-warning">106</div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-brand-success" />
                <span className="text-brand-success">{t('all_systems_online')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sync Analysis */}
      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">{tTabs('sync_status')}</TabsTrigger>
          <TabsTrigger value="architecture">{tTabs('architecture')}</TabsTrigger>
          <TabsTrigger value="monitoring">{tTabs('monitoring')}</TabsTrigger>
          <TabsTrigger value="performance">{tTabs('performance')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>{tStatus('module_sync_title')}</CardTitle>
              <CardDescription>{tStatus('module_sync_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-center">{tStatus('core_hr_modules')}</h4>
                  {[
                    { nameKey: "employee_data", status: "synced", latency: "0.12s", events: "1,234" },
                    { nameKey: "payroll_processing", status: "synced", latency: "0.18s", events: "892" },
                    { nameKey: "performance_management", status: "synced", latency: "0.21s", events: "567" },
                    { nameKey: "time_attendance", status: "synced", latency: "0.09s", events: "2,341" }
                  ].map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-brand-success rounded-full"></div>
                        <span className="font-medium">{tStatus(module.nameKey)}</span>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-muted-foreground">{module.latency}</div>
                        <div className="text-xs text-muted-foreground">{module.events} {tStatus('events_day')}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-center">{tStatus('government_integrations')}</h4>
                  {[
                    { nameKey: "gosi_integration", status: "synced", latency: "0.31s", events: "234" },
                    { nameKey: "qiwa_platform", status: "synced", latency: "0.28s", events: "156" },
                    { nameKey: "mudad_integration", status: "synced", latency: "0.25s", events: "89" },
                    
                  ].map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-brand-success rounded-full"></div>
                        <span className="font-medium">{tStatus(module.nameKey)}</span>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-muted-foreground">{module.latency}</div>
                        <div className="text-xs text-muted-foreground">{module.events} {tStatus('events_day')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>{tArch('title')}</CardTitle>
              <CardDescription>{tArch('desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    {tArch('event_driven')}
                  </h4>
                  <p className="text-sm text-blue-700">{tArch('event_driven_desc')}</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    {tArch('distributed_db')}
                  </h4>
                  <p className="text-sm text-green-700">{tArch('distributed_db_desc')}</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {tArch('fault_tolerance')}
                  </h4>
                  <p className="text-sm text-purple-700">{tArch('fault_tolerance_desc')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>{tMonitor('title')}</CardTitle>
              <CardDescription>{tMonitor('desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-success">100%</div>
                  <p className="text-sm text-muted-foreground">{tMonitor('system_uptime')}</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-primary">0.23s</div>
                  <p className="text-sm text-muted-foreground">{tMonitor('avg_sync_latency')}</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-accent">3</div>
                  <p className="text-sm text-muted-foreground">{tMonitor('failed_syncs_today')}</p>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-medium mb-4 text-center">{tMonitor('recent_activity')}</h4>
                <div className="space-y-3">
                  {[
                    { time: "14:23:12", moduleKey: "employee_master", eventKey: "profile_update", status: "success" },
                    { time: "14:23:08", moduleKey: "payroll_system", eventKey: "salary_adjustment", status: "success" },
                    { time: "14:22:56", moduleKey: "time_attendance", eventKey: "clock_in_out", status: "success" },
                    { time: "14:22:45", moduleKey: "gosi_integration", eventKey: "contribution_update", status: "retry" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono">{activity.time}</span>
                        <span className="text-sm">{tMonitor(activity.moduleKey)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{tMonitor(activity.eventKey)}</span>
                        <Badge variant={activity.status === "success" ? "default" : "secondary"}>
                          {tMonitor(activity.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>{tPerf('title')}</CardTitle>
              <CardDescription>{tPerf('desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-center">{tPerf('trends')}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{tPerf('avg_latency')}</span>
                      <span className="text-sm font-medium text-brand-success">↓ 12% {tPerf('this_month')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{tPerf('success_rate')}</span>
                      <span className="text-sm font-medium text-brand-success">↑ 0.3% {tPerf('improvement')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{tPerf('throughput')}</span>
                      <span className="text-sm font-medium text-brand-primary">↑ 23% {tPerf('increase')}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-center">{tPerf('optimization')}</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                      <p className="text-sm text-blue-800">{tPerf('db_pooling')}</p>
                    </div>
                    <div className="p-3 bg-green-50 border-l-4 border-green-400">
                      <p className="text-sm text-green-800">{tPerf('ai_load_balancing')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Control Center */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle>{tControl('title')}</CardTitle>
          <CardDescription>{tControl('desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-gradient-primary hover:opacity-90">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('force_full_sync')}
            </Button>
            <Button variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              {t('view_sync_logs')}
            </Button>
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              {t('run_health_check')}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <AqlHRAIAssistant moduleContext="ai-automation.aiSyncEngine" />
    </div>
  );
};

export default AISyncEngine;