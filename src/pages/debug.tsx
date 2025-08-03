import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SmokeTestResult {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
  tests?: {
    insert?: { passed: boolean; error?: string; data?: any };
    select?: { passed: boolean; error?: string; data?: any };
    cleanup?: { passed: boolean; error?: string };
  };
}

export default function DebugPage() {
  const [result, setResult] = useState<SmokeTestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runSmokeTest = async () => {
      try {
        const response = await fetch('/api/debug-smoke');
        const data = await response.json();
        setResult(data);
      } catch (error) {
        setResult({
          success: false,
          error: 'Failed to run smoke test',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        setLoading(false);
      }
    };

    runSmokeTest();
  }, []);

  const runTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/debug-smoke');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to run smoke test',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🐛 Debug & Analytics Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This page runs smoke tests against the analytics database to verify functionality.
          </p>
          <button 
            onClick={runTest}
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Running Test...' : 'Run Smoke Test'}
          </button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>
              {result.success ? '✅ Test Results' : '❌ Test Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.tests ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {result.tests.insert?.passed ? '✅' : '❌'}
                  <span>Insert Test: {result.tests.insert?.passed ? 'PASSED' : 'FAILED'}</span>
                  {result.tests.insert?.error && (
                    <span className="text-destructive text-sm">({result.tests.insert.error})</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {result.tests.select?.passed ? '✅' : '❌'}
                  <span>Select Test: {result.tests.select?.passed ? 'PASSED' : 'FAILED'}</span>
                  {result.tests.select?.error && (
                    <span className="text-destructive text-sm">({result.tests.select.error})</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {result.tests.cleanup?.passed ? '✅' : '❌'}
                  <span>Cleanup Test: {result.tests.cleanup?.passed ? 'PASSED' : 'FAILED'}</span>
                  {result.tests.cleanup?.error && (
                    <span className="text-destructive text-sm">({result.tests.cleanup.error})</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-destructive">
                <p>Error: {result.error}</p>
                {result.details && <p className="text-sm mt-2">Details: {result.details}</p>}
              </div>
            )}
            
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-muted-foreground">View Raw Results</summary>
              <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  );
}