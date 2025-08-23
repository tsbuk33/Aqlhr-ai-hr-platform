import React from 'react';
import { OSILayers } from '@/components/diagnostic/OSILayers';
import { OSISpan } from '@/components/diagnostic/OSISpan';

export const OSISpansLayers: React.FC<{ caseId?: string }> = () => {
  return (
    <div className="space-y-6">
      <OSILayers />
      <OSISpan />
    </div>
  );
};
