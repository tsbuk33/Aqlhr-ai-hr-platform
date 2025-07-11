import { useEffect } from 'react';
import SystemEngineerDashboard from '@/components/SystemEngineerDashboard';

const SystemEngineerPage = () => {
  useEffect(() => {
    document.title = 'SanadHR System Engineer - Auto-Adaptive AI SuperIntelligence';
  }, []);

  return <SystemEngineerDashboard />;
};

export default SystemEngineerPage;