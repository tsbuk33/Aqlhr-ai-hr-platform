import { useEffect } from 'react';
import SystemEngineerDashboard from '@/components/SystemEngineerDashboard';
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';

const SystemEngineerPage = () => {
  useEffect(() => {
    document.title = 'SanadHR System Engineer - Auto-Adaptive AI SuperIntelligence';
  }, []);

  return (
    <>
      <SystemEngineerDashboard />
      <AqlHRAIAssistant moduleContext="systemEngineer.dashboard" />
    </>
  );
};

export default SystemEngineerPage;