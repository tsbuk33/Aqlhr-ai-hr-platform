import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key, Eye, EyeOff, Copy, Trash2 } from 'lucide-react';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const ApiKeys = () => {
  const apiKeys = [
    {
      id: '1',
      name: 'Production API Key',
      key: 'ak_prod_******************',
      status: 'active',
      created: '2024-01-15',
      lastUsed: '2024-08-23',
      permissions: ['read', 'write']
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'ak_dev_******************',
      status: 'active',
      created: '2024-03-10',
      lastUsed: '2024-08-22',
      permissions: ['read']
    },
    {
      id: '3',
      name: 'Integration Test Key',
      key: 'ak_test_*****************',
      status: 'inactive',
      created: '2024-02-01',
      lastUsed: '2024-07-15',
      permissions: ['read', 'write']
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">API Keys Management</h1>
          <p className="text-muted-foreground">Manage your API keys and access tokens</p>
        </div>
        <Button>
          <Key className="mr-2 h-4 w-4" />
          Generate New Key
        </Button>
      </div>
      
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Key className="mr-2 h-5 w-5" />
                    {apiKey.name}
                  </CardTitle>
                  <CardDescription>
                    Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                  </CardDescription>
                </div>
                <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                  {apiKey.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
                    {apiKey.key}
                  </code>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Permissions:</span>
                    {apiKey.permissions.map((permission) => (
                      <Badge key={permission} variant="outline">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* AI Integration for API Keys Management */}
      <UniversalAIIntegrator 
        pageType="platform" 
        moduleName="api-keys-management" 
        companyId="demo-company" 
        enabledFeatures={['security-monitoring', 'api-management', 'access-control', 'system-administration']}
      />
    </div>
  );
};

export default ApiKeys;