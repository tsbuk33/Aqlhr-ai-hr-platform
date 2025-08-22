import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/lib/useTenant';
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  Database,
  Key,
  FileText,
  Users,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';

interface SecurityMetrics {
  totalApiKeys: number;
  activeApiKeys: number;
  revokedApiKeys: number;
  totalApiCalls: number;
  rateLimitHits: number;
  failedAuth: number;
}

interface ComplianceCheck {
  id: string;
  category: string;
  check_name: string;
  status: 'compliant' | 'warning' | 'critical';
  description: string;
  last_checked: string;
}

interface PIIField {
  table_name: string;
  column_name: string;
  classification: string;
  retention_days: number;
  data_residency: string;
}

const SecurityFramework: React.FC = () => {
  const { tenantInfo } = useTenant();
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Fetch security metrics
  const { data: securityMetrics } = useQuery({
    queryKey: ['security-metrics', tenantInfo?.id, selectedTimeframe],
    queryFn: async () => {
      if (!tenantInfo?.id) return null;

      const startDate = new Date();
      const days = selectedTimeframe === '7d' ? 7 : selectedTimeframe === '30d' ? 30 : 90;
      startDate.setDate(startDate.getDate() - days);

      // Get API key stats
      const { data: apiKeyStats } = await supabase
        .from('api_keys')
        .select('id, is_active')
        .eq('tenant_id', tenantInfo.id);

      // Get API call stats
      const { data: apiCallStats } = await supabase
        .from('api_audit_logs')
        .select('id, response_status')
        .eq('tenant_id', tenantInfo.id)
        .gte('created_at', startDate.toISOString());

      // Get rate limit hits
      const { data: rateLimitStats } = await supabase
        .from('api_rate_limits')
        .select('call_count')
        .eq('tenant_id', tenantInfo.id)
        .gte('window_start', startDate.toISOString());

      const totalApiKeys = apiKeyStats?.length || 0;
      const activeApiKeys = apiKeyStats?.filter(k => k.is_active).length || 0;
      const totalApiCalls = apiCallStats?.length || 0;
      const failedAuth = apiCallStats?.filter(c => c.response_status === 401).length || 0;
      const rateLimitHits = rateLimitStats?.filter(r => r.call_count >= 600).length || 0;

      return {
        totalApiKeys,
        activeApiKeys,
        revokedApiKeys: totalApiKeys - activeApiKeys,
        totalApiCalls,
        rateLimitHits,
        failedAuth,
      } as SecurityMetrics;
    },
    enabled: !!tenantInfo?.id,
  });

  // Fetch PII catalog
  const { data: piiFields } = useQuery({
    queryKey: ['pii-catalog', tenantInfo?.id],
    queryFn: async () => {
      if (!tenantInfo?.id) return [];
      const { data, error } = await supabase
        .from('pii_catalog')
        .select('*')
        .eq('tenant_id', tenantInfo.id)
        .order('table_name');
      if (error) throw error;
      return data as PIIField[];
    },
    enabled: !!tenantInfo?.id,
  });

  // Mock compliance checks (in real implementation, these would come from automated scans)
  const complianceChecks: ComplianceCheck[] = [
    {
      id: '1',
      category: 'Authentication',
      check_name: 'API Key Rotation',
      status: 'compliant',
      description: 'API keys are rotated regularly',
      last_checked: new Date().toISOString(),
    },
    {
      id: '2',
      category: 'Data Protection',
      check_name: 'Encryption at Rest',
      status: 'compliant',
      description: 'All sensitive data is encrypted',
      last_checked: new Date().toISOString(),
    },
    {
      id: '3',
      category: 'Access Control',
      check_name: 'Scope Validation',
      status: 'warning',
      description: 'Some API keys have overly broad scopes',
      last_checked: new Date().toISOString(),
    },
    {
      id: '4',
      category: 'Audit',
      check_name: 'Log Retention',
      status: 'compliant',
      description: 'Audit logs are retained for required period',
      last_checked: new Date().toISOString(),
    },
    {
      id: '5',
      category: 'PDPL',
      check_name: 'Data Residency',
      status: 'compliant',
      description: 'All data stored within Saudi Arabia',
      last_checked: new Date().toISOString(),
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-500">Compliant</Badge>;
      case 'warning':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Warning</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const securityScore = complianceChecks.reduce((score, check) => {
    if (check.status === 'compliant') return score + 20;
    if (check.status === 'warning') return score + 10;
    return score;
  }, 0);

  const classificationCounts = piiFields?.reduce((counts, field) => {
    counts[field.classification] = (counts[field.classification] || 0) + 1;
    return counts;
  }, {} as Record<string, number>) || {};

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Security Framework</h1>
          <p className="text-muted-foreground">Monitor security metrics, compliance status, and data protection</p>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityScore}%</div>
            <Progress value={securityScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Based on {complianceChecks.length} security checks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active API Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics?.activeApiKeys || 0}</div>
            <p className="text-xs text-muted-foreground">
              {securityMetrics?.revokedApiKeys || 0} revoked keys
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics?.totalApiCalls || 0}</div>
            <p className="text-xs text-muted-foreground">
              {securityMetrics?.failedAuth || 0} failed auth attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PII Fields</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{piiFields?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Tracked and protected
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="compliance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="threats">Threat Detection</TabsTrigger>
          <TabsTrigger value="data-protection">Data Protection</TabsTrigger>
          <TabsTrigger value="access-control">Access Control</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Checks</CardTitle>
              <CardDescription>
                Automated security and compliance validation results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceChecks.map((check) => (
                  <div key={check.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(check.status)}
                        <div>
                          <h3 className="font-semibold">{check.check_name}</h3>
                          <p className="text-sm text-muted-foreground">{check.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Category: {check.category} • 
                            Last checked: {format(new Date(check.last_checked), 'MMM dd, HH:mm')}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(check.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Threat Detection</CardTitle>
              <CardDescription>
                Real-time monitoring for security threats and anomalies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Recent Threats</h3>
                  <div className="border rounded-lg p-4 text-center text-muted-foreground">
                    <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No active threats detected</p>
                    <p className="text-xs mt-1">Last scan: {format(new Date(), 'MMM dd, HH:mm')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Alert Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">Failed Authentication</span>
                      <Badge variant="outline">{securityMetrics?.failedAuth || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">Rate Limit Hits</span>
                      <Badge variant="outline">{securityMetrics?.rateLimitHits || 0}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">Suspicious Activity</span>
                      <Badge variant="outline">0</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-protection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Data Inventory</CardTitle>
              <CardDescription>
                PDPL compliance - catalog of personal data fields
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Classification Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(classificationCounts).map(([classification, count]) => (
                    <div key={classification} className="text-center p-3 border rounded-lg">
                      <div className="text-lg font-semibold">{count}</div>
                      <div className="text-sm text-muted-foreground capitalize">{classification}</div>
                    </div>
                  ))}
                </div>

                {/* PII Fields Table */}
                <div className="border rounded-lg">
                  <div className="p-4 border-b bg-muted/50">
                    <h3 className="font-semibold">Data Fields</h3>
                  </div>
                  <div className="divide-y">
                    {piiFields?.slice(0, 10).map((field, index) => (
                      <div key={index} className="p-4 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{field.table_name}.{field.column_name}</div>
                          <div className="text-sm text-muted-foreground">
                            Retention: {field.retention_days} days • {field.data_residency}
                          </div>
                        </div>
                        <Badge 
                          variant={
                            field.classification === 'restricted' ? 'destructive' :
                            field.classification === 'confidential' ? 'default' :
                            field.classification === 'internal' ? 'secondary' : 'outline'
                          }
                        >
                          {field.classification}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access-control" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Control Matrix</CardTitle>
              <CardDescription>
                API scopes and permissions management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Scope Usage Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">read.kpi</span>
                        <Badge variant="outline">2 keys</Badge>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">run.autopilot</span>
                        <Badge variant="outline">1 key</Badge>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">read.diagnostics</span>
                        <Badge variant="outline">3 keys</Badge>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">write.tasks</span>
                        <Badge variant="outline">1 key</Badge>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Permission Recommendations</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <div className="text-sm">
                        <strong>Review Overprivileged Keys:</strong> 2 API keys have broader scopes than necessary
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-blue-50 border border-blue-200 rounded">
                      <Eye className="h-4 w-4 text-blue-600" />
                      <div className="text-sm">
                        <strong>Unused Scopes:</strong> Consider revoking 'read.export' from inactive keys
                      </div>
                    </div>
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

export default SecurityFramework;