import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, RefreshCw, Database, Zap, CheckCircle, Clock, Network, Activity, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AISyncEngine = () => {
  const { t, isRTL } = useLanguage();
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight pb-2">
          {t('ai_sync.title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('ai_sync.subtitle')}
        </p>
      </div>

      {/* Sync Process Visualization */}
      <Card className="p-8">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <RefreshCw className="h-6 w-6 text-brand-primary" />
            {t('ai_sync.how_title')}
          </CardTitle>
          <CardDescription>{t('ai_sync.how_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile Layout */}
          <div className="md:hidden space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t('ai_sync.event_detection')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ai_sync.event_detection_desc')}
              </p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {t('ai_sync.microsecond_detection')}
              </Badge>
            </div>
            
            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <Network className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t('ai_sync.smart_routing')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ai_sync.smart_routing_desc')}
              </p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {t('ai_sync.ai_prioritized')}
              </Badge>
            </div>
            
            <div className="flex justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t('ai_sync.atomic_updates')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ai_sync.atomic_updates_desc')}
              </p>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {t('ai_sync.success_rate')}
              </Badge>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className={`hidden md:flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Step 1 */}
            <div className="flex-1 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t('ai_sync.event_detection')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ai_sync.event_detection_desc')}
              </p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {t('ai_sync.microsecond_detection')}
              </Badge>
            </div>

            {/* Arrow 1 */}
            <div className="px-4">
              <ArrowRight className={`h-6 w-6 text-muted-foreground ${isRTL ? '' : 'rotate-180'}`} />
            </div>

            {/* Step 2 */}
            <div className="flex-1 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <Network className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t('ai_sync.smart_routing')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ai_sync.smart_routing_desc')}
              </p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {t('ai_sync.ai_prioritized')}
              </Badge>
            </div>

            {/* Arrow 2 */}
            <div className="px-4">
              <ArrowRight className={`h-6 w-6 text-muted-foreground ${isRTL ? '' : 'rotate-180'}`} />
            </div>

            {/* Step 3 */}
            <div className="flex-1 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
                <Database className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{t('ai_sync.atomic_updates')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('ai_sync.atomic_updates_desc')}
              </p>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {t('ai_sync.success_rate')}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-primary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">{t('ai_sync.daily_sync_events')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-primary">15,678</div>
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-brand-success" />
                <span className="text-brand-success">{t('ai_sync.real_time_processing')}</span>
              </div>
              <p className="text-xs text-muted-foreground">Peak: 2,341 events/hour</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-secondary opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">{t('ai_sync.sync_success_rate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-brand-success">99.97%</div>
              <Progress value={99.97} className="h-2" />
              <p className="text-xs text-muted-foreground">{t('ai_sync.monitoring_24_7')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-accent opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">{t('ai_sync.average_latency')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-accent">0.23s</div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-brand-accent" />
                <span className="text-muted-foreground">{t('ai_sync.lightning_fast')}</span>
              </div>
              <p className="text-xs text-muted-foreground">Target: &lt;0.5s</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-hero opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">{t('ai_sync.connected_modules')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand-warning">106</div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-brand-success" />
                <span className="text-brand-success">{t('ai_sync.all_systems_online')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sync Analysis */}
      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">{t('tabs.sync_status')}</TabsTrigger>
          <TabsTrigger value="architecture">{t('tabs.architecture')}</TabsTrigger>
          <TabsTrigger value="monitoring">{t('tabs.monitoring')}</TabsTrigger>
          <TabsTrigger value="performance">{t('tabs.performance')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>{t('status.module_sync_title')}</CardTitle>
              <CardDescription>{t('status.module_sync_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-center">{t('status.core_hr_modules')}</h4>
                  {[
                    { nameKey: "status.employee_data", status: "status.synced", latency: "0.12s", events: "1,234" },
                    { nameKey: "status.payroll_processing", status: "status.synced", latency: "0.18s", events: "892" },
                    { nameKey: "status.performance_management", status: "status.synced", latency: "0.21s", events: "567" },
                    { nameKey: "status.time_attendance", status: "status.synced", latency: "0.09s", events: "2,341" }
                  ].map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-brand-success rounded-full"></div>
                        <span className="font-medium">{t(module.nameKey)}</span>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-muted-foreground">{module.latency}</div>
                        <div className="text-xs text-muted-foreground">{module.events} {t('status.events_day')}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-center">{t('status.government_integrations')}</h4>
                  {[
                    { nameKey: "status.gosi_integration", status: "status.synced", latency: "0.31s", events: "234" },
                    { nameKey: "status.qiwa_platform", status: "status.synced", latency: "0.28s", events: "156" },
                    { nameKey: "status.mudad_integration", status: "status.synced", latency: "0.25s", events: "89" },
                    { nameKey: "status.zatca_compliance", status: "status.synced", latency: "0.33s", events: "67" }
                  ].map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-brand-success rounded-full"></div>
                        <span className="font-medium">{t(module.nameKey)}</span>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-muted-foreground">{module.latency}</div>
                        <div className="text-xs text-muted-foreground">{module.events} {t('status.events_day')}</div>
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
              <CardTitle>{t('arch.title')}</CardTitle>
              <CardDescription>{t('arch.desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    {t('arch.event_driven')}
                  </h4>
                  <p className="text-sm text-blue-700">{t('arch.event_driven_desc')}</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    {t('arch.distributed_db')}
                  </h4>
                  <p className="text-sm text-green-700">{t('arch.distributed_db_desc')}</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {t('arch.fault_tolerance')}
                  </h4>
                  <p className="text-sm text-purple-700">{t('arch.fault_tolerance_desc')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>{t('monitor.title')}</CardTitle>
              <CardDescription>{t('monitor.desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-success">100%</div>
                  <p className="text-sm text-muted-foreground">{t('monitor.system_uptime')}</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-primary">0.23s</div>
                  <p className="text-sm text-muted-foreground">{t('monitor.avg_sync_latency')}</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-brand-accent">3</div>
                  <p className="text-sm text-muted-foreground">{t('monitor.failed_syncs_today')}</p>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-medium mb-4 text-center">{t('monitor.recent_activity')}</h4>
                <div className="space-y-3">
                  {[
                    { time: "14:23:12", moduleKey: "monitor.employee_master", eventKey: "monitor.profile_update", status: "monitor.success" },
                    { time: "14:23:08", moduleKey: "monitor.payroll_system", eventKey: "monitor.salary_adjustment", status: "monitor.success" },
                    { time: "14:22:56", moduleKey: "monitor.time_attendance", eventKey: "monitor.clock_in_out", status: "monitor.success" },
                    { time: "14:22:45", moduleKey: "status.gosi_integration", eventKey: "monitor.contribution_update", status: "monitor.retry" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono">{activity.time}</span>
                        <span className="text-sm">{t(activity.moduleKey)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{t(activity.eventKey)}</span>
                        <Badge variant={activity.status === "monitor.success" ? "default" : "secondary"}>
                          {t(activity.status)}
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
              <CardTitle>{t('perf.title')}</CardTitle>
              <CardDescription>{t('perf.desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-center">{t('perf.trends')}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('perf.avg_latency')}</span>
                      <span className="text-sm font-medium text-brand-success">↓ 12% {t('perf.this_month')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('perf.success_rate')}</span>
                      <span className="text-sm font-medium text-brand-success">↑ 0.3% {t('perf.improvement')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('perf.throughput')}</span>
                      <span className="text-sm font-medium text-brand-primary">↑ 23% {t('perf.increase')}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-center">{t('perf.optimization')}</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                      <p className="text-sm text-blue-800">{t('perf.db_pooling')}</p>
                    </div>
                    <div className="p-3 bg-green-50 border-l-4 border-green-400">
                      <p className="text-sm text-green-800">{t('perf.ai_load_balancing')}</p>
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
          <CardTitle>{t('control.title')}</CardTitle>
          <CardDescription>{t('control.desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-gradient-primary hover:opacity-90">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('ai_sync.force_full_sync')}
            </Button>
            <Button variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              {t('ai_sync.view_sync_logs')}
            </Button>
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              {t('ai_sync.run_health_check')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISyncEngine;