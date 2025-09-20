import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, Cpu, Zap, Activity, Network, Settings, 
  CheckCircle, AlertCircle, Clock, RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { resolveTenantId } from '@/lib/useTenant';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

interface AIProvider {
  name: string;
  status: 'available' | 'busy' | 'error' | 'offline';
  model: string;
  lastUsed: string;
  responseTime: number;
}

interface AIServiceStatus {
  orchestrator: boolean;
  syncEngine: boolean;
  assistant: boolean;
  skillExecutor: boolean;
}

export function AIOrchestrationPanel() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [serviceStatus, setServiceStatus] = useState<AIServiceStatus>({
    orchestrator: false,
    syncEngine: false,
    assistant: false,
    skillExecutor: false
  });
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    checkAIServices();
    const interval = setInterval(checkAIServices, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkAIServices = async () => {
    setLoading(true);
    try {
      const { tenantId } = await resolveTenantId(supabase);
      if (!tenantId) return;

      // Check AI Agent Orchestrator status
      const orchestratorResponse = await supabase.functions.invoke('ai-agent-orchestrator', {
        body: { action: 'status' }
      });

      if (orchestratorResponse.data?.providers) {
        const providerList: AIProvider[] = Object.entries(orchestratorResponse.data.status).map(([name, info]: [string, any]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          status: info.available ? 'available' : 'offline',
          model: info.model,
          lastUsed: 'Just now',
          responseTime: Math.floor(Math.random() * 500) + 200 // Mock response time
        }));
        setProviders(providerList);
      }

      // Check other AI services
      const services = await Promise.allSettled([
        supabase.functions.invoke('ai-sync-engine'),
        supabase.functions.invoke('ai-assistant', { body: { prompt: 'status' } }),
        supabase.functions.invoke('agent-skill-executor', { body: { tenantId, skillCode: 'health_check' } })
      ]);

      setServiceStatus({
        orchestrator: orchestratorResponse.error === null,
        syncEngine: services[0].status === 'fulfilled',
        assistant: services[1].status === 'fulfilled',
        skillExecutor: services[2].status === 'fulfilled'
      });

    } catch (error) {
      console.error('AI service check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAITest = async () => {
    setLoading(true);
    try {
      const { tenantId } = await resolveTenantId(supabase);
      if (!tenantId) return;

      const testQuery = isArabic ? 
        'تحليل سريع للبيانات الحالية وتقديم ثلاث توصيات' :
        'Analyze current data quickly and provide three recommendations';

      const startTime = Date.now();
      
      const aiResponse = await supabase.functions.invoke('ai-agent-orchestrator', {
        body: {
          query: testQuery,
          context: {
            module: 'dashboard_test',
            language: lang,
            company_id: tenantId,
            user_context: 'AI system test'
          }
        }
      });

      const responseTime = Date.now() - startTime;

      setTestResults({
        success: !aiResponse.error,
        responseTime,
        provider: aiResponse.data?.provider,
        model: aiResponse.data?.model,
        confidence: aiResponse.data?.confidence,
        response: aiResponse.data?.response?.substring(0, 200) + '...'
      });

    } catch (error) {
      setTestResults({
        success: false,
        error: error.message,
        responseTime: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string | boolean) => {
    if (typeof status === 'boolean') {
      return status ? <CheckCircle className="h-4 w-4 text-green-400" /> : <AlertCircle className="h-4 w-4 text-red-400" />;
    }
    
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'busy': return <Clock className="h-4 w-4 text-orange-400" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string | boolean) => {
    if (typeof status === 'boolean') {
      return status ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400';
    }
    
    switch (status) {
      case 'available': return 'bg-green-600/20 text-green-400';
      case 'busy': return 'bg-orange-600/20 text-orange-400';
      case 'error': return 'bg-red-600/20 text-red-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Orchestration Status */}
      <Card className="aqlhr-card border-blue-500/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-blue-400" />
              <div>
                <CardTitle className="text-xl">
                  {isArabic ? 'منصة الذكاء الاصطناعي AqlHR' : 'AqlHR AI Orchestration Platform'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'إدارة وتنسيق خدمات الذكاء الاصطناعي المتقدمة' : 'Advanced AI Services Management & Coordination'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={runAITest}
              disabled={loading}
              className="gap-2"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {isArabic ? 'اختبار النظام' : 'Test System'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { name: isArabic ? 'منسق الذكاء الاصطناعي' : 'AI Orchestrator', status: serviceStatus.orchestrator, icon: Brain },
              { name: isArabic ? 'محرك المزامنة' : 'Sync Engine', status: serviceStatus.syncEngine, icon: RefreshCw },
              { name: isArabic ? 'المساعد الذكي' : 'AI Assistant', status: serviceStatus.assistant, icon: Cpu },
              { name: isArabic ? 'منفذ المهارات' : 'Skill Executor', status: serviceStatus.skillExecutor, icon: Settings }
            ].map((service, index) => (
              <div key={index} className="text-center p-4 bg-accent/10 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <service.icon className="h-5 w-5 text-muted-foreground mr-2" />
                  {getStatusIcon(service.status)}
                </div>
                <div className="text-sm font-medium">{service.name}</div>
                <Badge className={getStatusColor(service.status)}>
                  {service.status ? (isArabic ? 'متصل' : 'Online') : (isArabic ? 'غير متصل' : 'Offline')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Providers Status */}
      <Card className="aqlhr-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            {isArabic ? 'موفري الذكاء الاصطناعي' : 'AI Provider Status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {providers.map((provider, index) => (
              <div key={index} className="p-4 bg-accent/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{provider.name}</h4>
                  {getStatusIcon(provider.status)}
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>Model: {provider.model}</div>
                  <div>Response: {provider.responseTime}ms</div>
                  <div>Last Used: {provider.lastUsed}</div>
                </div>
                <Badge className={getStatusColor(provider.status)}>
                  {provider.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults && (
        <Card className="aqlhr-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-400" />
              {isArabic ? 'نتائج اختبار النظام' : 'System Test Results'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.success ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-600/10 rounded-lg">
                  <span className="font-medium text-green-400">
                    {isArabic ? 'الاختبار ناجح' : 'Test Successful'}
                  </span>
                  <Badge className="bg-green-600/20 text-green-400">
                    {testResults.responseTime}ms
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{isArabic ? 'الموفر:' : 'Provider:'}</span>
                    <div className="font-medium">{testResults.provider}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{isArabic ? 'النموذج:' : 'Model:'}</span>
                    <div className="font-medium">{testResults.model}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{isArabic ? 'الثقة:' : 'Confidence:'}</span>
                    <div className="font-medium">{Math.round(testResults.confidence * 100)}%</div>
                  </div>
                </div>
                <div className="p-3 bg-accent/10 rounded text-sm">
                  <span className="text-muted-foreground">{isArabic ? 'الاستجابة:' : 'Response:'}</span>
                  <p className="mt-1">{testResults.response}</p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-red-600/10 rounded-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">
                    {isArabic ? 'فشل الاختبار' : 'Test Failed'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {testResults.error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}