import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/lib/useTenant';
import { Key, Shield, Activity, FileText, Download, Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';

interface APIKey {
  id: string;
  name: string;
  key_hash: string;
  scopes: string[];
  active: boolean;
  expires_at?: string;
  last_used_at?: string;
  created_at: string;
}

interface APIScope {
  scope_key: string;
  scope_name: string;
  scope_description: string;
}

interface APIAuditLog {
  id: string;
  endpoint: string;
  method: string;
  response_status: number;
  response_time_ms: number;
  ip_address: string;
  created_at: string;
}

interface RateLimit {
  window_start: string;
  call_count: number;
}

const APIGateway: React.FC = () => {
  const { tenantInfo } = useTenant();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [expiresIn, setExpiresIn] = useState<string>('never');
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});

  // Fetch API keys
  const { data: apiKeys, isLoading: keysLoading } = useQuery({
    queryKey: ['api-keys', tenantInfo?.tenantId],
    queryFn: async () => {
      if (!tenantInfo?.tenantId) return [];
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('tenant_id', tenantInfo.tenantId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!tenantInfo?.tenantId,
  });

  // Fetch API scopes
  const { data: apiScopes } = useQuery({
    queryKey: ['api-scopes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_scopes')
        .select('*')
        .order('scope_key');
      if (error) throw error;
      return data as APIScope[];
    },
  });

  // Fetch audit logs
  const { data: auditLogs } = useQuery({
    queryKey: ['api-audit-logs', tenantInfo?.tenantId],
    queryFn: async () => {
      if (!tenantInfo?.tenantId) return [];
      const { data, error } = await supabase
        .from('api_audit_logs')
        .select('*')
        .eq('tenant_id', tenantInfo.tenantId)
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as APIAuditLog[];
    },
    enabled: !!tenantInfo?.tenantId,
  });

  // Fetch current rate limit usage
  const { data: rateLimitUsage } = useQuery({
    queryKey: ['rate-limit-usage', tenantInfo?.tenantId],
    queryFn: async () => {
      if (!tenantInfo?.tenantId) return [];
      const { data, error } = await supabase
        .from('api_rate_limits')
        .select('*')
        .eq('tenant_id', tenantInfo.tenantId)
        .gte('window_start', new Date(Date.now() - 5 * 60 * 1000).toISOString())
        .order('window_start', { ascending: false });
      if (error) throw error;
      return data as RateLimit[];
    },
    enabled: !!tenantInfo?.tenantId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Create API key mutation
  const createKeyMutation = useMutation({
    mutationFn: async () => {
      if (!tenantInfo?.tenantId || !newKeyName || selectedScopes.length === 0) {
        throw new Error('Missing required fields');
      }

      const expiresAt = expiresIn === 'never' ? null : 
        new Date(Date.now() + parseInt(expiresIn) * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .rpc('create_api_key', {
          p_tenant_id: tenantInfo.tenantId,
          p_key_name: newKeyName,
          p_scopes: selectedScopes,
          p_expires_at: expiresAt
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'API Key Created',
        description: 'Your new API key has been created successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      setNewKeyName('');
      setSelectedScopes([]);
      setExpiresIn('never');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Revoke API key mutation
  const revokeKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const { data, error } = await supabase
        .rpc('revoke_api_key', { p_key_id: keyId });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'API Key Revoked',
        description: 'The API key has been revoked successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleScopeChange = (scope: string, checked: boolean) => {
    if (checked) {
      setSelectedScopes([...selectedScopes, scope]);
    } else {
      setSelectedScopes(selectedScopes.filter(s => s !== scope));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard',
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowApiKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const currentUsage = rateLimitUsage?.reduce((sum, limit) => sum + limit.call_count, 0) || 0;
  const usagePercentage = Math.min((currentUsage / 600) * 100, 100);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">API Gateway</h1>
          <p className="text-muted-foreground">Manage API keys, monitor usage, and view audit logs</p>
        </div>
      </div>

      {/* Rate Limit Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Rate Limit Status
          </CardTitle>
          <CardDescription>
            Current usage: {currentUsage} / 600 calls per 5 minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-secondary rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all ${
                usagePercentage > 80 ? 'bg-destructive' : 
                usagePercentage > 60 ? 'bg-yellow-500' : 'bg-primary'
              }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {usagePercentage > 80 && 'Warning: Approaching rate limit'}
            {usagePercentage <= 80 && usagePercentage > 60 && 'Moderate usage'}
            {usagePercentage <= 60 && 'Normal usage'}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="scopes">Scopes</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="pdpl">PDPL Report</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          {/* Create New API Key */}
          <Card>
            <CardHeader>
              <CardTitle>Create New API Key</CardTitle>
              <CardDescription>
                Generate a new API key with specific scopes and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="My Application Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expires">Expires In</Label>
                  <Select value={expiresIn} onValueChange={setExpiresIn}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                      <SelectItem value="365">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Scopes</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {apiScopes?.map((scope) => (
                    <div key={scope.scope_key} className="flex items-center space-x-2">
                      <Checkbox
                        id={scope.scope_key}
                        checked={selectedScopes.includes(scope.scope_key)}
                        onCheckedChange={(checked) => 
                          handleScopeChange(scope.scope_key, checked as boolean)
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={scope.scope_key}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {scope.scope_name}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {scope.scope_description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => createKeyMutation.mutate()}
                disabled={!newKeyName || selectedScopes.length === 0 || createKeyMutation.isPending}
                className="w-full"
              >
                <Key className="h-4 w-4 mr-2" />
                {createKeyMutation.isPending ? 'Creating...' : 'Create API Key'}
              </Button>
            </CardContent>
          </Card>

          {/* Existing API Keys */}
          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                Manage your existing API keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              {keysLoading ? (
                <div className="text-center py-8">Loading API keys...</div>
              ) : apiKeys?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No API keys found. Create your first API key above.
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys?.map((key) => (
                    <div key={key.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{key.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={key.active ? "default" : "secondary"}>
                              {key.active ? 'Active' : 'Inactive'}
                            </Badge>
                            {key.expires_at && (
                              <Badge variant="outline">
                                Expires {format(new Date(key.expires_at), 'MMM dd, yyyy')}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleKeyVisibility(key.id)}
                          >
                            {showApiKey[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(key.key_hash)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => revokeKeyMutation.mutate(key.id)}
                            disabled={!key.active}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="font-mono text-sm bg-muted p-2 rounded">
                        {showApiKey[key.id] ? key.key_hash : '•'.repeat(key.key_hash.length)}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {key.scopes.map((scope) => (
                          <Badge key={scope} variant="secondary" className="text-xs">
                            {scope}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Created: {format(new Date(key.created_at), 'MMM dd, yyyy HH:mm')}
                        {key.last_used_at && (
                          <span className="ml-4">
                            Last used: {format(new Date(key.last_used_at), 'MMM dd, yyyy HH:mm')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scopes">
          <Card>
            <CardHeader>
              <CardTitle>Available Scopes</CardTitle>
              <CardDescription>
                API scopes define what actions can be performed with an API key
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {apiScopes?.map((scope) => (
                  <div key={scope.scope_key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{scope.scope_name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {scope.scope_description}
                        </p>
                      </div>
                      <Badge variant="outline">{scope.scope_key}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>API Audit Logs</CardTitle>
              <CardDescription>
                Last 100 API calls made to your endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              {auditLogs?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No API calls logged yet
                </div>
              ) : (
                <div className="space-y-2">
                  {auditLogs?.map((log) => (
                    <div key={log.id} className="border rounded p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={log.response_status < 400 ? "default" : "destructive"}
                            className="font-mono"
                          >
                            {log.response_status}
                          </Badge>
                          <span className="font-medium">{log.method}</span>
                          <span className="font-mono">{log.endpoint}</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <span>{log.response_time_ms}ms</span>
                          <span>{format(new Date(log.created_at), 'HH:mm:ss')}</span>
                        </div>
                      </div>
                      {log.ip_address && (
                        <div className="mt-1 text-muted-foreground">
                          From: {log.ip_address}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pdpl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                PDPL Compliance Report
              </CardTitle>
              <CardDescription>
                Personal Data Protection Law compliance overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">7 Years</div>
                  <div className="text-sm text-muted-foreground">Default Retention</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">Saudi Arabia</div>
                  <div className="text-sm text-muted-foreground">Data Residency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">Compliant</div>
                  <div className="text-sm text-muted-foreground">PDPL Status</div>
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold">Data Classification Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Public</div>
                    <div className="text-muted-foreground">0 fields</div>
                  </div>
                  <div>
                    <div className="font-medium">Internal</div>
                    <div className="text-muted-foreground">1 field</div>
                  </div>
                  <div>
                    <div className="font-medium">Confidential</div>
                    <div className="text-muted-foreground">2 fields</div>
                  </div>
                  <div>
                    <div className="font-medium">Restricted</div>
                    <div className="text-muted-foreground">2 fields</div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold">Compliance Notes</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• All personal data is stored within Saudi Arabia jurisdiction</li>
                  <li>• Data retention policies comply with Saudi labor law (7 years)</li>
                  <li>• Employee consent recorded for data processing</li>
                  <li>• Regular security audits and access logging enabled</li>
                  <li>• Data subject rights (access, rectification, erasure) supported</li>
                </ul>
              </div>

              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDPL Summary PDF
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIGateway;
