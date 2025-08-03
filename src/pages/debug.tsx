import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

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

  const runSmokeTest = async (): Promise<SmokeTestResult> => {
    try {
      const testData = {
        event_type: 'smoke_test',
        module_name: 'debug_frontend',
        session_id: `smoke_${Date.now()}`,
        user_id: null,
        properties: { test: true, timestamp: new Date().toISOString() }
      };

      // Test 1: Insert test data
      const { data: insertData, error: insertError } = await (supabase as any)
        .from('analytics_events')
        .insert(testData)
        .select()
        .single();

      if (insertError) {
        return {
          success: false,
          error: 'Insert failed',
          details: insertError.message,
          tests: {
            insert: { passed: false, error: insertError.message },
            select: { passed: false, error: 'Skipped due to insert failure' }
          }
        };
      }

      // Test 2: Select the data back
      const { data: selectData, error: selectError } = await (supabase as any)
        .from('analytics_events')
        .select('*')
        .eq('session_id', testData.session_id)
        .single();

      if (selectError) {
        return {
          success: false,
          error: 'Select failed',
          details: selectError.message,
          tests: {
            insert: { passed: true, data: insertData },
            select: { passed: false, error: selectError.message }
          }
        };
      }

      // Test 3: Cleanup - delete the test data
      const { error: deleteError } = await (supabase as any)
        .from('analytics_events')
        .delete()
        .eq('session_id', testData.session_id);

      return {
        success: true,
        message: 'All tests passed',
        tests: {
          insert: { passed: true, data: insertData },
          select: { passed: true, data: selectData },
          cleanup: { passed: !deleteError, error: deleteError?.message }
        }
      };

    } catch (error) {
      return {
        success: false,
        error: 'Unexpected error',
        details: error instanceof Error ? error.message : 'Unknown error',
        tests: {
          insert: { passed: false, error: 'Exception thrown' },
          select: { passed: false, error: 'Exception thrown' }
        }
      };
    }
  };

  useEffect(() => {
    const runTest = async () => {
      try {
        const testResult = await runSmokeTest();
        setResult(testResult);
      } finally {
        setLoading(false);
      }
    };

    runTest();
  }, []);

  const handleRunTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const testResult = await runSmokeTest();
      setResult(testResult);
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
            onClick={handleRunTest}
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