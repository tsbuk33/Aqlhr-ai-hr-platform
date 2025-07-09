import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useTestRunner } from '@/hooks/useTestRunner';
import { TestConfiguration } from '@/components/test-harness/TestConfiguration';
import { TestProgress } from '@/components/test-harness/TestProgress';
import { TestResults } from '@/components/test-harness/TestResults';
import { SystemMetrics } from '@/components/test-harness/SystemMetrics';

const TestHarness: React.FC = () => {
  const [isMounted, setIsMounted] = useState(true);
  const [seedAmount, setSeedAmount] = useState(1000);
  const [saudizationMix, setSaudizationMix] = useState(67);
  const [fullTestSuite, setFullTestSuite] = useState(false);
  
  const {
    isRunning,
    testResults,
    progress,
    runTests,
    resetTests,
    employees,
    getSyncStats
  } = useTestRunner();

  useEffect(() => {
    return () => setIsMounted(false);
  }, []);

  const handleRunTests = () => {
    if (!isMounted) return;
    runTests(seedAmount, saudizationMix, fullTestSuite);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">🛡️ SanadHR Pre-Release Test Suite</h1>
          <p className="text-muted-foreground">Comprehensive QA validation for production deployment</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setFullTestSuite(!fullTestSuite)} 
            variant={fullTestSuite ? "default" : "outline"}
            size="lg"
          >
            {fullTestSuite ? '🚀 Full Suite' : '⚡ Quick Tests'}
          </Button>
          <Button 
            onClick={handleRunTests} 
            disabled={isRunning}
            size="lg"
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            {isRunning ? 'Running Tests...' : (fullTestSuite ? 'Run Full Suite' : 'Run Quick Tests')}
          </Button>
        </div>
      </div>

      <TestConfiguration
        seedAmount={seedAmount}
        setSeedAmount={setSeedAmount}
        saudizationMix={saudizationMix}
        setSaudizationMix={setSaudizationMix}
        isRunning={isRunning}
      />

      {isRunning && <TestProgress progress={progress} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TestResults testResults={testResults} />
        <SystemMetrics employees={employees} getSyncStats={getSyncStats} />
      </div>
    </div>
  );
};

export default TestHarness;