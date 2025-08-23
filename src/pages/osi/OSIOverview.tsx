import React from 'react';
import { OSIOverview as NewOSIOverview } from '@/components/diagnostic/OSIOverview';

export const OSIOverview: React.FC<{ caseId?: string }> = () => {
  return <NewOSIOverview />;
};
