import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database } from 'lucide-react';

interface TestConfigurationProps {
  seedAmount: number;
  setSeedAmount: (amount: number) => void;
  saudizationMix: number;
  setSaudizationMix: (mix: number) => void;
  isRunning: boolean;
}

export const TestConfiguration: React.FC<TestConfigurationProps> = ({
  seedAmount,
  setSeedAmount,
  saudizationMix,
  setSaudizationMix,
  isRunning
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Test Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="seedAmount">Employee Seed Amount</Label>
          <Input
            id="seedAmount"
            type="number"
            value={seedAmount}
            onChange={(e) => setSeedAmount(Number(e.target.value))}
            disabled={isRunning}
            aria-label="Number of employees to seed for testing"
          />
        </div>
        <div>
          <Label htmlFor="saudizationMix">Saudization Mix (%)</Label>
          <Input
            id="saudizationMix"
            type="number"
            value={saudizationMix}
            onChange={(e) => setSaudizationMix(Number(e.target.value))}
            disabled={isRunning}
            min="0"
            max="100"
            aria-label="Percentage of Saudi employees in the seed data"
          />
        </div>
      </CardContent>
    </Card>
  );
};