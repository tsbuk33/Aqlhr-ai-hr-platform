import { useEffect } from 'react';
import TestHarness from '@/components/TestHarness';
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';

const TestHarnessPage = () => {
  useEffect(() => {
    document.title = 'SanadHR Test Harness - System Validation';
  }, []);

  return (
    <>
      <TestHarness />
      <AqlHRAIAssistant moduleContext="testHarness.validation" />
    </>
  );
};

export default TestHarnessPage;