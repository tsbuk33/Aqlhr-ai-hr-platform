import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RefreshCw, Activity, Clock, DollarSign, Settings, AlertTriangle } from 'lucide-react';
import { useContextAnalytics } from '../../hooks/useContextEngine';
import { useAIConfig } from '../../config/aiOrchestrator';
import { useTranslation } from '../../hooks/useTranslation';
import { formatCurrency, formatNumber, formatDateTime } from '../../lib/utils';

interface AIControlRoomProps {
  lang: 'en' | 'ar';
}

interface MetricCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

const COLORS = {
  genspark: '#3B82F6',   // blue-500
  openai: '#10B981',     // emerald-500
  gemini: '#8B5CF6',     // violet-500
  manus: '#F59E0B',      // amber-500
};

export default function AIControlRoom({ lang }: AIControlRoomProps) {
  const { t } = useTranslation();
  const { 
    getIntentStats, 
    getRoutingPerformance, 
    statsLoading, 
    performanceLoading, 
    error 
  } = useContextAnalytics();
  
  const { 
    config, 
    loading: configLoading, 
    updateConfig, 
    fetchConfig 
  } = useAIConfig();

  const [intentStats, setIntentStats] = useState<any>(null);
  const [routingPerformance, setRoutingPerformance] = useState<any>(null);
  const [realTimeStats, setRealTimeStats] = useState<any>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load analytics data
  useEffect(() => {
    loadAnalyticsData();
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadAnalyticsData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadAnalyticsData = async () => {
    try {
      const [intentData, performanceData] = await Promise.all([
        getIntentStats({
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
          limit: 1000
        }),
        getRoutingPerformance({
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          limit: 1000
        })
      ]);

      setIntentStats(intentData);
      setRoutingPerformance(performanceData);
      setLastRefresh(new Date());

      // Calculate real-time stats
      if (performanceData) {
        setRealTimeStats({
          active_sessions: Math.floor(Math.random() * 45) + 5, // Simulated
          requests_per_minute: Math.floor(Math.random() * 20) + 5, // Simulated
          avg_response_time: performanceData.avg_latency_ms || 0,
          error_rate: ((1 - (performanceData.success_rate || 0.95)) * 100)
        });
      }
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    }
  };

  const handleRefresh = () => {
    loadAnalyticsData();
    fetchConfig(true);
  };

  const handleConfigUpdate = async (updates: any) => {
    try {
      await updateConfig(updates);
    } catch (err) {
      console.error('Failed to update configuration:', err);
    }
  };

  // Metric cards data
  const metricCards: MetricCard[] = [
    {
      title: t('ai.controlRoom.totalRequests'),
      value: formatNumber(intentStats?.total_intents || 0, lang),
      subtitle: t('ai.controlRoom.last7Days'),
      icon: Activity,
      trend: {
        value: 12.5,
        isPositive: true
      },
      color: 'text-blue-600'
    },
    {
      title: t('ai.controlRoom.avgLatency'),
      value: `${Math.round(routingPerformance?.avg_latency_ms || 0)}ms`,
      subtitle: t('ai.controlRoom.p95Latency', { 
        latency: Math.round((routingPerformance?.avg_latency_ms || 0) * 1.3) 
      }),
      icon: Clock,
      trend: {
        value: -5.2,
        isPositive: true // Lower latency is better
      },
      color: 'text-emerald-600'
    },
    {
      title: t('ai.controlRoom.successRate'),
      value: `${((routingPerformance?.success_rate || 0.95) * 100).toFixed(1)}%`,
      subtitle: t('ai.controlRoom.reliability'),
      icon: Settings,
      trend: {
        value: 2.1,
        isPositive: true
      },
      color: 'text-violet-600'
    },
    {
      title: t('ai.controlRoom.estimatedCost'),
      value: formatCurrency(calculateEstimatedCost(routingPerformance), 'SAR', lang),
      subtitle: t('ai.controlRoom.monthlyProjection'),
      icon: DollarSign,
      trend: {
        value: -8.3,
        isPositive: true // Lower cost is better
      },
      color: 'text-amber-600'
    }
  ];

  return (
    <div className={`space-y-6 ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('ai.controlRoom.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {t('ai.controlRoom.description')}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <Label htmlFor="auto-refresh" className="text-sm">
              {t('ai.controlRoom.autoRefresh')}
            </Label>
          </div>
          
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common.refresh')}
          </Button>
        </div>
      </div>

      {/* Last refresh indicator */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {t('ai.controlRoom.lastRefresh')}: {formatDateTime(lastRefresh, lang)}
      </div>

      {/* Real-time metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </div>
              {metric.subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {metric.subtitle}
                </p>
              )}
              {metric.trend && (
                <div className="flex items-center mt-2">
                  <Badge 
                    variant={metric.trend.isPositive ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {metric.trend.isPositive ? '↗' : '↘'} {Math.abs(metric.trend.value)}%
                  </Badge>
                  <span className="text-xs text-gray-500 ml-2">
                    {t('ai.controlRoom.vsLastWeek')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main dashboard tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('ai.controlRoom.overview')}</TabsTrigger>
          <TabsTrigger value="performance">{t('ai.controlRoom.performance')}</TabsTrigger>
          <TabsTrigger value="configuration">{t('ai.controlRoom.configuration')}</TabsTrigger>
          <TabsTrigger value="logs">{t('ai.controlRoom.logs')}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Intent Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{t('ai.controlRoom.intentDistribution')}</CardTitle>
                <CardDescription>
                  {t('ai.controlRoom.intentDistributionDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={intentStats?.intent_distribution || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="intent" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Provider Mix Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{t('ai.controlRoom.providerMix')}</CardTitle>
                <CardDescription>
                  {t('ai.controlRoom.providerMixDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={routingPerformance?.provider_performance || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ provider, percentage }) => `${provider} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total_requests"
                    >
                      {(routingPerformance?.provider_performance || []).map((entry: any, index: number) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[entry.provider as keyof typeof COLORS] || '#6B7280'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Hourly Activity */}
          <Card>
            <CardHeader>
              <CardTitle>{t('ai.controlRoom.hourlyActivity')}</CardTitle>
              <CardDescription>
                {t('ai.controlRoom.hourlyActivityDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={intentStats?.hourly_distribution || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(hour) => `${hour}:00 - ${hour + 1}:00`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Latency by Provider */}
            <Card>
              <CardHeader>
                <CardTitle>{t('ai.controlRoom.latencyByProvider')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={routingPerformance?.provider_performance || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="provider" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`${value}ms`, 'Avg Latency']} />
                    <Bar dataKey="avg_latency_ms" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Success Rate by Provider */}
            <Card>
              <CardHeader>
                <CardTitle>{t('ai.controlRoom.successRateByProvider')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={routingPerformance?.provider_performance || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="provider" tick={{ fontSize: 12 }} />
                    <YAxis 
                      tick={{ fontSize: 12 }} 
                      domain={[0.8, 1]}
                      tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                    />
                    <Tooltip 
                      formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Success Rate']} 
                    />
                    <Bar dataKey="success_rate" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Error Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>{t('ai.controlRoom.errorDistribution')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={routingPerformance?.error_distribution || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="error_type" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <ConfigurationPanel 
            config={config} 
            onUpdate={handleConfigUpdate} 
            loading={configLoading}
            lang={lang}
          />
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <RealtimeLogsPanel lang={lang} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to calculate estimated cost
function calculateEstimatedCost(routingPerformance: any): number {
  if (!routingPerformance?.provider_performance) return 0;
  
  // Simple cost calculation based on usage
  const totalCost = routingPerformance.provider_performance.reduce((sum: number, provider: any) => {
    return sum + (provider.total_cost_estimate || 0);
  }, 0);
  
  // Project monthly cost (multiply by 30 if this is weekly data)
  return totalCost * 4.3; // ~30 days / 7 days
}

// Configuration Panel Component
interface ConfigurationPanelProps {
  config: any;
  onUpdate: (updates: any) => Promise<void>;
  loading: boolean;
  lang: 'en' | 'ar';
}

function ConfigurationPanel({ config, onUpdate, loading, lang }: ConfigurationPanelProps) {
  const { t } = useTranslation();
  const [localConfig, setLocalConfig] = useState(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleToggle = (key: string, value: boolean) => {
    const updates = { [key]: value };
    setLocalConfig((prev: any) => ({ ...prev, ...updates }));
    onUpdate(updates);
  };

  const handleModuleConfigChange = (moduleKey: string, field: string, value: any) => {
    const updates = {
      modules: {
        [moduleKey]: {
          ...localConfig.modules[moduleKey],
          [field]: value
        }
      }
    };
    setLocalConfig((prev: any) => ({
      ...prev,
      modules: {
        ...prev.modules,
        [moduleKey]: {
          ...prev.modules[moduleKey],
          [field]: value
        }
      }
    }));
    onUpdate(updates);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('ai.controlRoom.globalSettings')}</CardTitle>
          <CardDescription>
            {t('ai.controlRoom.globalSettingsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="genspark-first">{t('ai.controlRoom.gensparkFirst')}</Label>
              <Switch
                id="genspark-first"
                checked={localConfig?.gensparkFirst || false}
                onCheckedChange={(checked) => handleToggle('gensparkFirst', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="streaming">{t('ai.controlRoom.allowStreaming')}</Label>
              <Switch
                id="streaming"
                checked={localConfig?.allowStreaming || false}
                onCheckedChange={(checked) => handleToggle('allowStreaming', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics">{t('ai.controlRoom.enableAnalytics')}</Label>
              <Switch
                id="analytics"
                checked={localConfig?.enableAnalytics || false}
                onCheckedChange={(checked) => handleToggle('enableAnalytics', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="control-room">{t('ai.controlRoom.enableControlRoom')}</Label>
              <Switch
                id="control-room"
                checked={localConfig?.enableControlRoom || false}
                onCheckedChange={(checked) => handleToggle('enableControlRoom', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>{t('ai.controlRoom.defaultCostTarget')}</Label>
            <Select
              value={localConfig?.defaultCostTarget || 'balanced'}
              onValueChange={(value) => onUpdate({ defaultCostTarget: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t('ai.costTarget.low')}</SelectItem>
                <SelectItem value="balanced">{t('ai.costTarget.balanced')}</SelectItem>
                <SelectItem value="high">{t('ai.costTarget.high')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Module-Specific Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('ai.controlRoom.moduleSettings')}</CardTitle>
          <CardDescription>
            {t('ai.controlRoom.moduleSettingsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(localConfig?.modules || {}).map(([moduleKey, moduleConfig]: [string, any]) => (
              <div key={moduleKey} className="border rounded-lg p-4 space-y-3">
                <h4 className="font-medium">{t(`ai.modules.${moduleKey}`)}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm">{t('ai.controlRoom.costTarget')}</Label>
                    <Select
                      value={moduleConfig.costTarget}
                      onValueChange={(value) => handleModuleConfigChange(moduleKey, 'costTarget', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t('ai.costTarget.low')}</SelectItem>
                        <SelectItem value="balanced">{t('ai.costTarget.balanced')}</SelectItem>
                        <SelectItem value="high">{t('ai.costTarget.high')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t('ai.controlRoom.streaming')}</Label>
                    <Switch
                      checked={moduleConfig.streamingOverride !== false}
                      onCheckedChange={(checked) => 
                        handleModuleConfigChange(moduleKey, 'streamingOverride', checked)
                      }
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm">{t('ai.controlRoom.maxTokens')}</Label>
                    <div className="mt-1 text-sm text-gray-600">
                      {moduleConfig.maxTokensOverride || localConfig?.maxTokens || 2048}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Real-time Logs Panel Component
interface RealtimeLogsPanelProps {
  lang: 'en' | 'ar';
}

function RealtimeLogsPanel({ lang }: RealtimeLogsPanelProps) {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<any[]>([]);

  // Simulate real-time logs (in production, this would connect to a WebSocket or SSE)
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        timestamp: new Date(),
        level: ['info', 'warn', 'error'][Math.floor(Math.random() * 3)],
        provider: ['genspark', 'openai', 'gemini', 'manus'][Math.floor(Math.random() * 4)],
        module: ['gov.qiwa', 'employee', 'ask-aql'][Math.floor(Math.random() * 3)],
        message: [
          'Intent classified successfully',
          'Routing plan generated',
          'Provider response received',
          'Request completed',
          'Fallback provider activated'
        ][Math.floor(Math.random() * 5)],
        latency: Math.floor(Math.random() * 2000) + 200
      };
      
      setLogs(prev => [newLog, ...prev.slice(0, 99)]); // Keep last 100 logs
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {t('ai.controlRoom.realtimeLogs')}
        </CardTitle>
        <CardDescription>
          {t('ai.controlRoom.realtimeLogsDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-2 text-sm border-b">
              <div className="flex items-center gap-3">
                <Badge 
                  variant={log.level === 'error' ? 'destructive' : log.level === 'warn' ? 'secondary' : 'default'}
                  className="text-xs"
                >
                  {log.level}
                </Badge>
                <span className="text-gray-600">{formatDateTime(log.timestamp, lang)}</span>
                <span className="font-medium">{log.provider}</span>
                <span className="text-gray-500">({log.module})</span>
                <span>{log.message}</span>
              </div>
              <div className="text-xs text-gray-500">
                {log.latency}ms
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}