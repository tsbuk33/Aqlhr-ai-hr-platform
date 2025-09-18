import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from '@/hooks/useUserCompany';
import { getLang } from '@/lib/i18n/getLang';
import {
  Settings,
  Play,
  Pause,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Globe,
  Shield,
  RefreshCw,
  MonitorSpeaker
} from 'lucide-react';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

const GovernmentIntegration = () => {
  const { lang } = useParams();
  const isArabic = lang === 'ar';
  const { companyId } = useUserCompany();
  const { toast } = useToast();

  const [adapters, setAdapters] = useState<any[]>([]);
  const [simulatorConfigs, setSimulatorConfigs] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<string | null>(null);

  // Translation helper
  const t = (key: string) => {
    const translations: Record<string, any> = {
      'title': isArabic ? 'وحدة تحكم التكامل الحكومي' : 'Government Integration Console',
      'description': isArabic ? 'إدارة ومحاكاة تكاملات قوى، مؤسسة العامة للتأمينات، وأبشر' : 'Manage and simulate Qiwa, GOSI, and Absher integrations',
      'qiwa': isArabic ? 'قوى' : 'Qiwa',
      'gosi': isArabic ? 'التأمينات الاجتماعية' : 'GOSI',
      'absher': isArabic ? 'أبشر' : 'Absher',
      'status': isArabic ? 'الحالة' : 'Status',
      'connected': isArabic ? 'متصل' : 'Connected',
      'simulation': isArabic ? 'محاكاة' : 'Simulation',
      'disconnected': isArabic ? 'غير متصل' : 'Disconnected',
      'last_sync': isArabic ? 'آخر مزامنة' : 'Last Sync',
      'test_connection': isArabic ? 'اختبار الاتصال' : 'Test Connection',
      'simulator_settings': isArabic ? 'إعدادات المحاكي' : 'Simulator Settings',
      'success_rate': isArabic ? 'معدل النجاح' : 'Success Rate',
      'response_delay': isArabic ? 'تأخير الاستجابة (مللي ثانية)' : 'Response Delay (ms)',
      'enabled': isArabic ? 'مفعل' : 'Enabled',
      'workflows': isArabic ? 'سير العمل' : 'Workflows',
      'logs': isArabic ? 'السجلات' : 'Logs',
      'orchestration': isArabic ? 'التنسيق' : 'Orchestration',
      'save_settings': isArabic ? 'حفظ الإعدادات' : 'Save Settings',
      'create_workflow': isArabic ? 'إنشاء سير عمل' : 'Create Workflow',
      'recent_activity': isArabic ? 'النشاط الأخير' : 'Recent Activity'
    };
    return translations[key] || key;
  };

  // Load data
  useEffect(() => {
    if (companyId) {
      loadAdapters();
      loadSimulatorConfigs();
      loadWorkflows();
      loadRecentLogs();
    }
  }, [companyId]);

  const loadAdapters = async () => {
    try {
      const { data, error } = await supabase.rpc('gov_get_status_v1' as any, {
        p_tenant: companyId
      });

      if (error) throw error;
      setAdapters((data as any[]) || []);
    } catch (error) {
      console.error('Error loading adapters:', error);
    }
  };

  const loadSimulatorConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('gov_simulator_configs')
        .select('*')
        .eq('tenant_id', companyId);

      if (error) throw error;
      setSimulatorConfigs(data || []);
    } catch (error) {
      console.error('Error loading simulator configs:', error);
    }
  };

  const loadWorkflows = async () => {
    try {
      const { data, error } = await supabase
        .from('gov_integration_workflows')
        .select('*')
        .eq('tenant_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkflows(data || []);
    } catch (error) {
      console.error('Error loading workflows:', error);
    }
  };

  const loadRecentLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('gov_sync_logs')
        .select('*')
        .eq('tenant_id', companyId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentLogs(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading logs:', error);
      setLoading(false);
    }
  };

  const testConnection = async (system: string) => {
    setTesting(system);
    try {
      const { data, error } = await supabase.functions.invoke('gov-simulator', {
        body: {
          system,
          endpoint: 'health_check',
          tenantId: companyId,
          payload: {}
        }
      });

      if (error) throw error;

      toast({
        title: t('test_connection'),
        description: data?.status === 'success' 
          ? `${system} connection successful`
          : `${system} connection failed`,
        variant: data?.status === 'success' ? 'default' : 'destructive'
      });
    } catch (error) {
      toast({
        title: 'Test Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setTesting(null);
    }
  };

  const updateSimulatorConfig = async (system: string, config: any) => {
    try {
      const { error } = await supabase
        .from('gov_simulator_configs')
        .upsert({
          tenant_id: companyId,
          system,
          ...config
        });

      if (error) throw error;

      toast({
        title: t('save_settings'),
        description: `${system} simulator settings updated`
      });

      loadSimulatorConfigs();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'simulation':
        return <MonitorSpeaker className="h-4 w-4 text-blue-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getConfigForSystem = (system: string) => {
    return simulatorConfigs.find(c => c.system === system) || {
      enabled: true,
      success_rate: 0.95,
      response_delay_ms: 1000
    };
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-6 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="simulators">
            <Settings className="h-4 w-4 mr-2" />
            Simulators
          </TabsTrigger>
          <TabsTrigger value="workflows">
            <Zap className="h-4 w-4 mr-2" />
            {t('workflows')}
          </TabsTrigger>
          <TabsTrigger value="logs">
            <MonitorSpeaker className="h-4 w-4 mr-2" />
            {t('logs')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Government Systems Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['qiwa', 'gosi', 'absher'].map((system) => {
              const adapter = adapters.find(a => a.system === system) || {
                system,
                status: 'simulation',
                last_sync: null
              };
              
              return (
                <Card key={system}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(adapter.status)}
                        {t(system)}
                      </div>
                      <Badge variant={adapter.status === 'connected' ? 'default' : 
                                   adapter.status === 'simulation' ? 'secondary' : 'destructive'}>
                        {t(adapter.status)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        {t('last_sync')}: {adapter.last_sync ? 
                          new Date(adapter.last_sync).toLocaleString() : 
                          'Never'}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => testConnection(system)}
                        disabled={testing === system}
                        className="w-full"
                      >
                        {testing === system ? (
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        {t('test_connection')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>{t('recent_activity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.status)}
                      <div>
                        <div className="font-medium">{log.system.toUpperCase()} - {log.sync_type}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant={log.status === 'completed' ? 'default' : 'destructive'}>
                      {log.status}
                    </Badge>
                  </div>
                ))}
                {recentLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activity
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulators" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['qiwa', 'gosi', 'absher'].map((system) => {
              const config = getConfigForSystem(system);
              
              return (
                <Card key={system}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {t(system)} {t('simulator_settings')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">{t('enabled')}</label>
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={(enabled) => 
                          updateSimulatorConfig(system, { ...config, enabled })
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {t('success_rate')}: {Math.round(config.success_rate * 100)}%
                      </label>
                      <Slider
                        value={[config.success_rate * 100]}
                        onValueChange={([value]) => 
                          updateSimulatorConfig(system, { ...config, success_rate: value / 100 })
                        }
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {t('response_delay')}: {config.response_delay_ms}ms
                      </label>
                      <Slider
                        value={[config.response_delay_ms]}
                        onValueChange={([value]) => 
                          updateSimulatorConfig(system, { ...config, response_delay_ms: value })
                        }
                        max={5000}
                        min={100}
                        step={100}
                        className="w-full"
                      />
                    </div>

                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection(system)}
                      disabled={testing === system}
                      className="w-full"
                    >
                      {testing === system ? (
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      Test Simulator
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Integration {t('workflows')}</CardTitle>
                <CardDescription>
                  Automated workflows for government system orchestration
                </CardDescription>
              </div>
              <Button>
                <Zap className="h-4 w-4 mr-2" />
                {t('create_workflow')}
              </Button>
            </CardHeader>
            <CardContent>
              {workflows.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No workflows configured yet
                </div>
              ) : (
                <div className="space-y-3">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{workflow.workflow_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {workflow.description}
                        </div>
                      </div>
                      <Badge variant={workflow.is_active ? 'default' : 'secondary'}>
                        {workflow.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sync {t('logs')}</CardTitle>
              <CardDescription>
                Detailed logs of government API interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(log.status)}
                        <span className="font-medium">{log.system.toUpperCase()}</span>
                        <Badge variant="outline">{log.sync_type}</Badge>
                        {log.test_mode && <Badge variant="secondary">Simulation</Badge>}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                    
                    {log.error_message && (
                      <div className="text-sm text-red-500 mb-2">
                        Error: {log.error_message}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Processed:</span> {log.records_processed || 0}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created:</span> {log.records_created || 0}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Updated:</span> {log.records_updated || 0}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Failed:</span> {log.records_failed || 0}
                      </div>
                    </div>
                  </div>
                ))}
                
                {recentLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No logs available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <UniversalAIIntegrator 
        pageType="government" 
        moduleName="government-integration-admin" 
        companyId="demo-company" 
        enabledFeatures={['government-integration', 'api-management', 'compliance-monitoring', 'system-administration']}
      />
      
      <AqlHRAIAssistant 
        moduleContext="admin.government-integration" 
        companyId="demo-company"
      />
    </div>
  );
};

export default GovernmentIntegration;