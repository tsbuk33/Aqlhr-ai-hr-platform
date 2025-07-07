import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Monitor } from 'lucide-react';
import type { TestResult } from '@/hooks/useTestRunner';

interface TestResultsProps {
  testResults: TestResult[];
}

export const TestResults: React.FC<TestResultsProps> = ({ testResults }) => {
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running': return <Clock className="h-4 w-4 text-amber-600 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return 'text-emerald-600 border-emerald-200';
      case 'failed': return 'text-red-600 border-red-200';
      case 'running': return 'text-amber-600 border-amber-200';
      default: return 'text-muted-foreground border-muted';
    }
  };

  const passedTests = testResults.filter(t => t.status === 'passed').length;
  const failedTests = testResults.filter(t => t.status === 'failed').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Test Results
        </CardTitle>
        <CardDescription>
          {passedTests} passed, {failedTests} failed, {testResults.length - passedTests - failedTests} pending
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {testResults.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded border">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <p className="font-medium">{test.name}</p>
                  {test.details && (
                    <p className="text-sm text-muted-foreground">{test.details}</p>
                  )}
                </div>
              </div>
              <Badge variant="outline" className={getStatusColor(test.status)}>
                {test.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};