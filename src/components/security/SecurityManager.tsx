import React, { useState } from 'react';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SecurityManagerProps {
  className?: string;
  tenantId?: string;
}

export const SecurityManager: React.FC<SecurityManagerProps> = ({ 
  className, 
  tenantId = 'demo-tenant' 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<string | null>(null);
  const [securityScore, setSecurityScore] = useState(92);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleSecurityOperation = async (operationType: string) => {
    setIsRunning(true);
    setCurrentOperation(operationType);
    
    try {
      const { data, error } = await supabase.functions.invoke('security-manager', {
        body: {
          operation: { type: operationType },
          tenant_id: tenantId
        }
      });

      if (error) throw error;

      setResults(data.result);
      setSecurityScore(data.result.overall_score || data.result.overall_compliance_score || securityScore);
      
      toast({
        title: "Security Operation Completed",
        description: `${operationType.replace('_', ' ')} completed successfully.`,
      });
    } catch (error) {
      console.error('Security operation error:', error);
      toast({
        title: "Security Operation Failed",
        description: `Failed to perform ${operationType}.`,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
      setCurrentOperation(null);
    }
  };

  const securityOperations = [
    {
      id: 'audit',
      name: 'Security Audit',
      description: 'Comprehensive security assessment',
      icon: <Eye className="h-4 w-4" />,
      category: 'assessment'
    },
    {
      id: 'encrypt',
      name: 'Data Encryption',
      description: 'Encrypt sensitive data and manage keys',
      icon: <Lock className="h-4 w-4" />,
      category: 'protection'
    },
    {
      id: 'compliance_check',
      name: 'Compliance Check',
      description: 'Saudi PDPL and cybersecurity compliance',
      icon: <CheckCircle className="h-4 w-4" />,
      category: 'compliance'
    },
    {
      id: 'access_review',
      name: 'Access Review',
      description: 'Review user access and permissions',
      icon: <Shield className="h-4 w-4" />,
      category: 'access'
    },
    {
      id: 'threat_scan',
      name: 'Threat Scanner',
      description: 'Scan for security threats and vulnerabilities',
      icon: <Scan className="h-4 w-4" />,
      category: 'monitoring'
    }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Manager
        </CardTitle>
        <CardDescription>
          Saudi PDPL compliance and advanced security management
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Security Score</span>
            <Badge variant={securityScore >= 90 ? "default" : securityScore >= 70 ? "secondary" : "destructive"}>
              {securityScore}%
            </Badge>
          </div>
          <Progress value={securityScore} className="h-2" />
        </div>

        {/* Current Operation */}
        {currentOperation && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Current Operation:</p>
            <p className="text-sm font-medium">
              {currentOperation.replace('_', ' ').toUpperCase()}
            </p>
          </div>
        )}

        <Tabs defaultValue="operations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="operations" className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {securityOperations.map((operation) => (
                <Button
                  key={operation.id}
                  variant="outline"
                  className="h-auto p-3 flex items-center justify-start gap-3"
                  onClick={() => handleSecurityOperation(operation.id)}
                  disabled={isRunning}
                >
                  {operation.icon}
                  <div className="text-left">
                    <p className="text-sm font-medium">{operation.name}</p>
                    <p className="text-xs text-muted-foreground">{operation.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-3">
            {results ? (
              <div className="space-y-4">
                {/* Compliance Results */}
                {results.frameworks && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Compliance Frameworks</h4>
                    {Object.entries(results.frameworks).map(([framework, data]: [string, any]) => (
                      <div key={framework} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">
                            {framework.replace('_', ' ')}
                          </span>
                          <Badge variant={data.score >= 90 ? "default" : "secondary"}>
                            {data.score}%
                          </Badge>
                        </div>
                        <Progress value={data.score} className="h-1" />
                        <p className="text-xs text-muted-foreground">
                          {data.requirements_met}/{data.total_requirements} requirements met
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Security Audit Categories */}
                {results.category_scores && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Security Categories</h4>
                    {Object.entries(results.category_scores).map(([category, data]: [string, any]) => (
                      <div key={category} className="flex items-center justify-between text-sm">
                        <span className="capitalize">{category.replace('_', ' ')}</span>
                        <Badge variant={data.score >= 90 ? "default" : data.score >= 70 ? "secondary" : "destructive"}>
                          {data.score}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {/* Encryption Results */}
                {results.encryption_targets && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Encryption Status</h4>
                    <div className="text-xs space-y-1">
                      <p>Targets: {results.encryption_targets.join(', ')}</p>
                      <p>Records Encrypted: {results.total_records_encrypted?.toLocaleString()}</p>
                      <p>Algorithm: {results.encryption_standards?.at_rest}</p>
                    </div>
                  </div>
                )}

                {/* Access Review */}
                {results.access_review && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Access Review</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Total Users: {results.access_review.total_users}</div>
                      <div>Active: {results.access_review.active_users}</div>
                      <div>Privileged: {results.access_review.privileged_users}</div>
                      <div>Risk Level: <Badge variant="outline">{results.risk_level}</Badge></div>
                    </div>
                  </div>
                )}

                {/* Threat Scan */}
                {results.threat_scan && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Threat Scan Results</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Threats: {results.threat_scan.threats_detected}</div>
                      <div>Vulnerabilities: {results.threat_scan.vulnerabilities}</div>
                    </div>
                    {results.threat_scan.findings && (
                      <div className="space-y-1">
                        {results.threat_scan.findings.map((finding: any, index: number) => (
                          <div key={index} className="p-2 border rounded text-xs">
                            <div className="flex items-center gap-2">
                              <Badge variant={finding.severity === 'high' ? "destructive" : finding.severity === 'medium' ? "secondary" : "outline"}>
                                {finding.severity}
                              </Badge>
                              <span className="font-medium">{finding.category}</span>
                            </div>
                            <p className="text-muted-foreground mt-1">{finding.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Recommendations */}
                {results.recommendations && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recommendations</h4>
                    <ul className="text-xs space-y-1">
                      {results.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Saudi Compliance Status */}
                {results.saudi_pdpl_compliance && (
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                      Saudi PDPL Compliance
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(results.saudi_pdpl_compliance).map(([key, status]: [string, any]) => (
                        <div key={key} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="capitalize">{key.replace('_', ' ')}: {status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Run a security operation to see results
              </p>
            )}
          </TabsContent>
        </Tabs>

        <div className="text-xs text-muted-foreground">
          Advanced security management with Saudi PDPL compliance, encryption, 
          threat detection, and comprehensive audit capabilities.
        </div>
      </CardContent>
    </Card>
  );
};