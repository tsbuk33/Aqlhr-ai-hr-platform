import { useEffect } from 'react';
import TestHarness from '@/components/TestHarness';

const TestHarnessPage = () => {
  useEffect(() => {
    document.title = 'SanadHR Test Harness - System Validation';
  }, []);

  return <TestHarness />;
};

export default TestHarnessPage;