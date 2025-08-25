import React from 'react';

interface DevSeedingCTAProps {
  onSeed: () => void;
}

export function DevSeedingCTA({ onSeed }: DevSeedingCTAProps) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <div className="text-yellow-800 mb-4">
        <h3 className="text-lg font-medium mb-2">🚀 Dev Mode: No Employees Found</h3>
        <p className="text-sm">
          Click below to seed demo employee data for testing and development.
        </p>
      </div>
      <button
        onClick={onSeed}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Seed Demo Employees
      </button>
    </div>
  );
}