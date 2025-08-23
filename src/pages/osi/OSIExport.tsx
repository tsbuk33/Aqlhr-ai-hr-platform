import React from 'react';
import { OSIExport as NewOSIExport } from '@/components/diagnostic/OSIExport';

export const OSIExport: React.FC<{ caseId?: string }> = () => {
  return <NewOSIExport />;
};
