import React from 'react';
import { OSISaudizationByLayers } from '@/components/diagnostic/OSISaudizationByLayers';

export const OSISaudizationLayer: React.FC<{ caseId?: string }> = () => {
  return <OSISaudizationByLayers />;
};
