import React, { useState } from 'react';
import { Database, Activity, Shield, Zap, Settings, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DatabaseOrchestratorProps {
  className?: string;
  tenantId?: string;
}

export const DatabaseOrchestrator: React.FC<DatabaseOrchestratorProps> = ({ 
  className, 
  tenantId = 'demo-tenant' 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<string | null>(null);
  const [healthScore, setHealthScore] = useState(95);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleDatabaseOperation = async (operationType: string) => {
    setIsRunning(true);
    setCurrentOperation(operationType);
    
    try {
      const { data, error } = await supabase.functions.invoke('database-orchestrator', {
        body: {
          operation: { type: operationType },
          tenant_id: tenantId
        }
      });

      if (error) throw error;

      setResults(data.result);
      setHealthScore(data.result.health_score || data.result.overall_score || healthScore);
      
      toast({
        title: "Database Operation Completed",
        description: `${operationType.replace('_', ' ')} operation completed successfully.`,
      });
    } catch (error) {
      console.error('Database operation error:', error);
      toast({
        title: "Operation Failed",
        description: `Failed to perform ${operationType} operation.`,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
      setCurrentOperation(null);
    }
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'health_check': return <Activity className="h-4 w-4" />;
      case 'backup': return <Shield className="h-4 w-4" />;
      case 'analytics': return <Database className="h-4 w-4" />;
      case 'optimization': return <Zap className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const operations = [
    {
      id: 'health_check',
      name: 'Health Check',
      description: 'Comprehensive database health analysis',
      category: 'monitoring'
    },
    {
      id: 'backup',
      name: 'Create Backup',
      description: 'Full database backup with metadata',
      category: 'protection'
    },
    {
      id: 'analytics',
      name: 'Setup Analytics',
      description: 'Configure analytics database and views',
      category: 'intelligence'
    },
    {
      id: 'optimization',
      name: 'Optimize Performance',
      description: 'Analyze and optimize database performance',
      category: 'performance'
    }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Orchestrator
        </CardTitle>
        <CardDescription>
          Advanced database management and automation platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Database Health Score</span>
            <Badge variant={healthScore >= 90 ? "default" : healthScore >= 70 ? "secondary" : "destructive"}>
              {healthScore}%
            </Badge>
          </div>
          <Progress value={healthScore} className="h-2" />
        </div>

        {/* Current Operation */}
        {currentOperation && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Current Operation:</p>
            <p className="text-sm font-medium flex items-center gap-2">
              {getOperationIcon(currentOperation)}
              {currentOperation.replace('_', ' ').toUpperCase()}
            </p>
          </div>
        )}

        {/* Operations Grid */}
        <div className="grid grid-cols-2 gap-3">
          {operations.map((operation) => (
            <Button
              key={operation.id}
              variant="outline"
              className="h-auto p-3 flex flex-col items-start gap-2"
              onClick={() => handleDatabaseOperation(operation.id)}
              disabled={isRunning}
            >
              <div className="flex items-center gap-2 w-full">
                {getOperationIcon(operation.id)}
                <span className="text-sm font-medium">{operation.name}</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                {operation.description}
              </span>
            </Button>
          ))}
        </div>

        {/* Results Display */}
        {results && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Operation Results</h4>
            
            {results.checks && (
              <div className="space-y-2">
                {Object.entries(results.checks).map(([check, status]: [string, any]) => (
                  <div key={check} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{check.replace('_', ' ')}</span>
                    {typeof status === 'boolean' ? (
                      status ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )
                    ) : (
                      <Badge variant="outline">
                        {typeof status === 'object' ? 'Complex' : String(status)}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}

            {results.recommendations && (
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground">Recommendations</h5>
                <ul className="text-xs space-y-1">
                  {results.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.backup_id && (
              <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Backup Created Successfully
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Backup ID: {results.backup_id}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Advanced database operations including health monitoring, automated backups, 
          analytics setup, and performance optimization for Saudi compliance requirements.
        </div>
      </CardContent>
    </Card>
  );
};