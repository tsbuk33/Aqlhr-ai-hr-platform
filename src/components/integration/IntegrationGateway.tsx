import React, { useState } from 'react';
import { Globe, Zap, Shield, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface IntegrationGatewayProps {
  className?: string;
  tenantId?: string;
}

export const IntegrationGateway: React.FC<IntegrationGatewayProps> = ({ 
  className, 
  tenantId = 'demo-tenant' 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<string>('qiwa');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('employee_verification');
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const integrationSystems = [
    {
      id: 'qiwa',
      name: 'Qiwa Platform',
      description: 'Employee verification and Nitaqat compliance',
      status: 'connected',
      endpoints: [
        { id: 'employee_verification', name: 'Employee Verification' },
        { id: 'visa_status', name: 'Visa Status Check' },
        { id: 'nitaqat_compliance', name: 'Nitaqat Compliance' },
      ]
    },
    {
      id: 'gosi',
      name: 'GOSI Integration',
      description: 'Social insurance and contributions',
      status: 'connected',
      endpoints: [
        { id: 'contribution_status', name: 'Contribution Status' },
        { id: 'salary_certificate', name: 'Salary Certificate' },
      ]
    },
    {
      id: 'absher',
      name: 'Absher Platform',
      description: 'Government ID verification services',
      status: 'connected',
      endpoints: [
        { id: 'iqama_verification', name: 'Iqama Verification' },
        { id: 'dependent_information', name: 'Dependent Information' },
      ]
    },
    {
      id: 'mol',
      name: 'Ministry of Labor',
      description: 'Labor compliance and regulations',
      status: 'connected',
      endpoints: [
        { id: 'compliance_check', name: 'Compliance Check' },
        { id: 'violation_status', name: 'Violation Status' },
      ]
    },
    {
      id: 'internal',
      name: 'Internal Systems',
      description: 'Internal data synchronization',
      status: 'active',
      endpoints: [
        { id: 'sync_employee_data', name: 'Sync Employee Data' },
        { id: 'generate_reports', name: 'Generate Reports' },
        { id: 'update_compliance_status', name: 'Update Compliance' },
      ]
    }
  ];

  const handleIntegrationTest = async () => {
    setIsRunning(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('integration-gateway', {
        body: {
          system: selectedSystem,
          endpoint: selectedEndpoint,
          method: 'POST',
          payload: {
            employee_count: 10,
            test_mode: true
          },
          tenant_id: tenantId
        }
      });

      if (error) throw error;

      setResults(data.result);
      
      toast({
        title: "Integration Test Completed",
        description: `${selectedSystem.toUpperCase()} ${selectedEndpoint} integration successful.`,
      });
    } catch (error) {
      console.error('Integration test error:', error);
      toast({
        title: "Integration Test Failed",
        description: `Failed to test ${selectedSystem} integration.`,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const currentSystem = integrationSystems.find(s => s.id === selectedSystem);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Integration Gateway
        </CardTitle>
        <CardDescription>
          Government API integration and real-time data synchronization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Integration Systems Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Connected Systems</h4>
          <div className="grid grid-cols-1 gap-2">
            {integrationSystems.map((system) => (
              <div 
                key={system.id}
                className={`flex items-center justify-between p-2 rounded border ${
                  selectedSystem === system.id ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(system.status)}
                  <div>
                    <p className="text-sm font-medium">{system.name}</p>
                    <p className="text-xs text-muted-foreground">{system.description}</p>
                  </div>
                </div>
                <Badge variant={system.status === 'connected' || system.status === 'active' ? "default" : "secondary"}>
                  {system.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Test Controls */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Test Integration</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">System</label>
              <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {integrationSystems.map((system) => (
                    <SelectItem key={system.id} value={system.id}>
                      {system.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Endpoint</label>
              <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentSystem?.endpoints.map((endpoint) => (
                    <SelectItem key={endpoint.id} value={endpoint.id}>
                      {endpoint.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleIntegrationTest}
            disabled={isRunning}
            className="w-full"
          >
            <Zap className="h-4 w-4 mr-2" />
            {isRunning ? 'Testing Integration...' : 'Test Integration'}
          </Button>
        </div>

        {/* Results Display */}
        {results && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Integration Results</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">System</p>
                <Badge variant="outline">{results.system?.toUpperCase()}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Response Time</p>
                <Badge variant="outline">{results.response_time_ms}ms</Badge>
              </div>
            </div>

            {results.data && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs font-medium mb-2">Response Data:</p>
                <div className="text-xs space-y-1">
                  {Object.entries(results.data).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">
                        {key.replace('_', ' ')}:
                      </span>
                      <span>
                        {typeof value === 'object' 
                          ? Array.isArray(value) 
                            ? `${value.length} items`
                            : 'Object'
                          : String(value)
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Real-time integration with Saudi government systems for compliance, 
          verification, and automated data synchronization with audit trails.
        </div>
      </CardContent>
    </Card>
  );
};