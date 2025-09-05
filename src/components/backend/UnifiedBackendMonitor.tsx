import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Server, 
  Database, 
  Brain, 
  Shield, 
  Activity, 
  Users, 
  Zap,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { useUnifiedAPI } from '@/hooks/useUnifiedAPI';

interface BackendMetrics {
  apiLayer: {
    totalRequests: number;
    successRate: number;
    averageResponseTime: number;
    activeConnections: number;
  };
  businessLogic: {
    rulesExecuted: number;
    workflowsActive: number;
    automationRate: number;
    processingTime: number;
  };
  aiEngine: {
    requestsProcessed: number;
    averageConfidence: number;
    modelsActive: number;
    capabilities: string[];
  };
  dataLayer: {
    queriesExecuted: number;
    cacheHitRate: number;
    storageUsed: number;
    backupStatus: string;
  };
  security: {
    threatsBlocked: number;
    authenticationRate: number;
    encryptionLevel: string;
    complianceScore: number;
  };
  performance: {
    uptime: number;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
  };
}

export const UnifiedBackendMonitor: React.FC = () => {
  const { useUnifiedQuery } = useUnifiedAPI();
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  // Fetch backend metrics
  const { data: metrics, isLoading, error } = useUnifiedQuery<BackendMetrics>(
    ['backend', 'metrics', selectedTimeframe],
    '/system/backend/metrics',
    { timeframe: selectedTimeframe },
    { enabled: true, staleTime: 30000 } // Refresh every 30 seconds
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Backend Monitoring Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Unable to load backend metrics. Please check system status.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return <Badge variant="outline" className="text-green-600 border-green-600">Excellent</Badge>;
    if (value >= thresholds.warning) return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Good</Badge>;
    return <Badge variant="destructive">Needs Attention</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Unified Backend Monitor</h1>
          <p className="text-muted-foreground">Real-time monitoring of the unified backend architecture</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={selectedTimeframe} 
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="rounded-md border border-input px-3 py-2 text-sm"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Layer</CardTitle>
            <Server className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics.apiLayer.successRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.apiLayer.totalRequests.toLocaleString()} requests
            </p>
            <div className="mt-2">
              {getStatusBadge(metrics.apiLayer.successRate, { good: 99, warning: 95 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Logic</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.businessLogic.automationRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.businessLogic.rulesExecuted} rules executed
            </p>
            <div className="mt-2">
              {getStatusBadge(metrics.businessLogic.automationRate, { good: 85, warning: 70 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Engine</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {metrics.aiEngine.averageConfidence.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.aiEngine.requestsProcessed} AI requests
            </p>
            <div className="mt-2">
              {getStatusBadge(metrics.aiEngine.averageConfidence, { good: 85, warning: 70 })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {metrics.performance.uptime.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              System uptime
            </p>
            <div className="mt-2">
              {getStatusBadge(metrics.performance.uptime, { good: 99.9, warning: 99 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Monitoring Tabs */}
      <Tabs defaultValue="api" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="api">API Layer</TabsTrigger>
          <TabsTrigger value="business">Business Logic</TabsTrigger>
          <TabsTrigger value="ai">AI Engine</TabsTrigger>
          <TabsTrigger value="data">Data Layer</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* API Layer Tab */}
        <TabsContent value="api" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  API Performance
                </CardTitle>
                <CardDescription>Request handling and response metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Success Rate</span>
                  <span className={`font-medium ${getStatusColor(metrics.apiLayer.successRate, { good: 99, warning: 95 })}`}>
                    {metrics.apiLayer.successRate.toFixed(2)}%
                  </span>
                </div>
                <Progress value={metrics.apiLayer.successRate} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg Response Time</span>
                  <span className="font-medium">{metrics.apiLayer.averageResponseTime}ms</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Connections</span>
                  <span className="font-medium">{metrics.apiLayer.activeConnections}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Request Distribution
                </CardTitle>
                <CardDescription>API endpoint usage patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Employee Endpoints</span>
                    <Badge variant="outline">45%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Analytics Endpoints</span>
                    <Badge variant="outline">23%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Endpoints</span>
                    <Badge variant="outline">18%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Government Endpoints</span>
                    <Badge variant="outline">14%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Business Logic Tab */}
        <TabsContent value="business" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Workflow Engine
                </CardTitle>
                <CardDescription>Business rules and workflow execution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Workflows</span>
                  <span className="font-medium">{metrics.businessLogic.workflowsActive}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rules Executed</span>
                  <span className="font-medium">{metrics.businessLogic.rulesExecuted.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Automation Rate</span>
                  <span className={`font-medium ${getStatusColor(metrics.businessLogic.automationRate, { good: 85, warning: 70 })}`}>
                    {metrics.businessLogic.automationRate}%
                  </span>
                </div>
                <Progress value={metrics.businessLogic.automationRate} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Processing Metrics
                </CardTitle>
                <CardDescription>Business logic performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Processing Time</span>
                    <Badge variant="outline">{metrics.businessLogic.processingTime}ms</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Employee Workflows</span>
                    <Badge variant="secondary">87% Success</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compliance Rules</span>
                    <Badge variant="secondary">98% Applied</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Approval Workflows</span>
                    <Badge variant="secondary">94% Automated</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Engine Tab */}
        <TabsContent value="ai" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Processing
                </CardTitle>
                <CardDescription>Artificial intelligence engine metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Requests Processed</span>
                  <span className="font-medium">{metrics.aiEngine.requestsProcessed.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Confidence</span>
                  <span className={`font-medium ${getStatusColor(metrics.aiEngine.averageConfidence, { good: 85, warning: 70 })}`}>
                    {metrics.aiEngine.averageConfidence.toFixed(1)}%
                  </span>
                </div>
                <Progress value={metrics.aiEngine.averageConfidence} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Models</span>
                  <span className="font-medium">{metrics.aiEngine.modelsActive}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AI Capabilities
                </CardTitle>
                <CardDescription>Available AI services and capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metrics.aiEngine.capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{capability.replace('_', ' ')}</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Layer Tab */}
        <TabsContent value="data" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Performance
                </CardTitle>
                <CardDescription>Data layer metrics and storage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Queries Executed</span>
                  <span className="font-medium">{metrics.dataLayer.queriesExecuted.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cache Hit Rate</span>
                  <span className={`font-medium ${getStatusColor(metrics.dataLayer.cacheHitRate, { good: 90, warning: 75 })}`}>
                    {metrics.dataLayer.cacheHitRate}%
                  </span>
                </div>
                <Progress value={metrics.dataLayer.cacheHitRate} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Storage Used</span>
                  <span className="font-medium">{(metrics.dataLayer.storageUsed / 1024).toFixed(1)} GB</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Data Security
                </CardTitle>
                <CardDescription>Data protection and backup status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup Status</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {metrics.dataLayer.backupStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Encryption</span>
                    <Badge variant="outline">AES-256</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Row Level Security</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tenant Isolation</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Status
                </CardTitle>
                <CardDescription>System security and threat monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Threats Blocked</span>
                  <span className="font-medium">{metrics.security.threatsBlocked}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Authentication Rate</span>
                  <span className={`font-medium ${getStatusColor(metrics.security.authenticationRate, { good: 98, warning: 95 })}`}>
                    {metrics.security.authenticationRate}%
                  </span>
                </div>
                <Progress value={metrics.security.authenticationRate} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Compliance Score</span>
                  <span className="font-medium">{metrics.security.complianceScore}/100</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Access Control
                </CardTitle>
                <CardDescription>User access and permission monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Encryption Level</span>
                    <Badge variant="outline">{metrics.security.encryptionLevel}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2FA Enabled</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">89% Users</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Role-Based Access</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Session Monitoring</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Resources
                </CardTitle>
                <CardDescription>CPU, memory, and disk utilization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">CPU Usage</span>
                    <span className={`font-medium ${getStatusColor(100 - metrics.performance.cpuUsage, { good: 70, warning: 50 })}`}>
                      {metrics.performance.cpuUsage}%
                    </span>
                  </div>
                  <Progress value={metrics.performance.cpuUsage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Memory Usage</span>
                    <span className={`font-medium ${getStatusColor(100 - metrics.performance.memoryUsage, { good: 70, warning: 50 })}`}>
                      {metrics.performance.memoryUsage}%
                    </span>
                  </div>
                  <Progress value={metrics.performance.memoryUsage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Disk Usage</span>
                    <span className={`font-medium ${getStatusColor(100 - metrics.performance.diskUsage, { good: 70, warning: 50 })}`}>
                      {metrics.performance.diskUsage}%
                    </span>
                  </div>
                  <Progress value={metrics.performance.diskUsage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>System performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {metrics.performance.uptime.toFixed(3)}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Load Balancing</span>
                    <Badge variant="outline">Optimal</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto Scaling</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cache Performance</span>
                    <Badge variant="outline">High</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};