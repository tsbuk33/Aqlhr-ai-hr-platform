import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Building2, Link, Database, RefreshCw } from 'lucide-react';

export const GovernmentIntegrationPanel: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<Record<string, 'disconnected' | 'connecting' | 'connected' | 'error'>>({
    gosi: 'connected',
    qiwa: 'connected',
    mol: 'connecting',
    hrsd: 'disconnected'
  });

  const [syncProgress, setSyncProgress] = useState<Record<string, number>>({
    gosi: 100,
    qiwa: 85,
    mol: 45,
    hrsd: 0
  });

  const integrations = [
    {
      id: 'gosi',
      name: 'GOSI',
      title: 'General Organization for Social Insurance',
      description: 'Social insurance and benefits management',
      icon: Building2,
      features: ['Employee Registration', 'Contribution Tracking', 'Benefits Claims']
    },
    {
      id: 'qiwa',
      name: 'QIWA',
      title: 'QIWA Platform',
      description: 'Ministry of Human Resources platform',
      icon: Link,
      features: ['Visa Processing', 'Work Permits', 'Compliance Reports']
    },
    {
      id: 'mol',
      name: 'MOL',
      title: 'Ministry of Labor',
      description: 'Labor law compliance and reporting',
      icon: Database,
      features: ['Labor Contracts', 'Dispute Resolution', 'Wage Protection']
    },
    {
      id: 'hrsd',
      name: 'HRSD',
      title: 'Human Resources & Social Development',
      description: 'Employment and social development services',
      icon: RefreshCw,
      features: ['Saudization Reports', 'Training Programs', 'Employment Data']
    }
  ];

  const handleConnect = (integrationId: string) => {
    setConnectionStatus(prev => ({ ...prev, [integrationId]: 'connecting' }));
    setSyncProgress(prev => ({ ...prev, [integrationId]: 0 }));
    
    // Simulate connection process
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        const current = prev[integrationId];
        if (current >= 100) {
          clearInterval(interval);
          setConnectionStatus(prevStatus => ({ ...prevStatus, [integrationId]: 'connected' }));
          return prev;
        }
        return { ...prev, [integrationId]: current + 10 };
      });
    }, 200);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'connected': return 'default';
      case 'connecting': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-l-primary pl-4">
        <h2 className="text-2xl font-bold text-foreground">Government Integration Framework</h2>
        <p className="text-muted-foreground">Real-time synchronization with Saudi government systems</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const status = connectionStatus[integration.id];
          const progress = syncProgress[integration.id];
          
          return (
            <Card key={integration.id} className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                  </div>
                  <Badge variant={getStatusVariant(status)}>
                    {status}
                  </Badge>
                </div>
                <CardDescription>
                  <div>
                    <p className="font-medium">{integration.title}</p>
                    <p className="text-sm">{integration.description}</p>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {status === 'connecting' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Connecting...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-foreground">Available Features:</h4>
                  <ul className="space-y-1">
                    {integration.features.map((feature) => (
                      <li key={feature} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {status === 'disconnected' && (
                  <Button 
                    className="w-full" 
                    onClick={() => handleConnect(integration.id)}
                  >
                    Connect to {integration.name}
                  </Button>
                )}
                
                {status === 'connected' && (
                  <Button variant="outline" className="w-full">
                    Sync Data
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default GovernmentIntegrationPanel;