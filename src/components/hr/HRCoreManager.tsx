import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Database, Shield, CheckCircle } from 'lucide-react';

export const HRCoreManager: React.FC = () => {
  const [operationStatus, setOperationStatus] = useState<Record<string, 'idle' | 'running' | 'success' | 'error'>>({});

  const coreModules = [
    {
      id: 'employee-master',
      title: 'Employee Master Data',
      description: 'Centralized employee information management',
      icon: Users,
      operations: ['Create Employee', 'Update Profile', 'Data Validation']
    },
    {
      id: 'crud-operations',
      title: 'CRUD Operations',
      description: 'Basic create, read, update, delete operations',
      icon: Database,
      operations: ['Insert Records', 'Query Data', 'Update Records', 'Delete Records']
    },
    {
      id: 'audit-trail',
      title: 'Audit Trail',
      description: 'Track all changes and system activities',
      icon: Shield,
      operations: ['Log Changes', 'Generate Reports', 'Compliance Check']
    }
  ];

  const handleOperation = (moduleId: string, operation: string) => {
    const key = `${moduleId}-${operation}`;
    setOperationStatus(prev => ({ ...prev, [key]: 'running' }));
    
    // Simulate operation
    setTimeout(() => {
      setOperationStatus(prev => ({ ...prev, [key]: 'success' }));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-l-primary pl-4">
        <h2 className="text-2xl font-bold text-foreground">HR Core Engine</h2>
        <p className="text-muted-foreground">Foundation for all HR operations and data management</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {coreModules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                </div>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {module.operations.map((operation) => {
                  const key = `${module.id}-${operation}`;
                  const status = operationStatus[key] || 'idle';
                  
                  return (
                    <div key={operation} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{operation}</span>
                      <div className="flex items-center gap-2">
                        {status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        <Badge variant={status === 'success' ? 'default' : 'secondary'}>
                          {status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOperation(module.id, operation)}
                          disabled={status === 'running'}
                        >
                          Run
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HRCoreManager;