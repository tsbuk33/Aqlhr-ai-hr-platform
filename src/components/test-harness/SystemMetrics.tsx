import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu } from 'lucide-react';
import type { SafeEmployee } from '@/hooks/useEmployees';

interface SystemMetricsProps {
  employees: SafeEmployee[];
  getSyncStats: () => {
    total: number;
    avgLatency: number;
    failed: number;
  };
}

export const SystemMetrics: React.FC<SystemMetricsProps> = ({ employees, getSyncStats }) => {
  // Environment configuration
  const LATENCY_BUDGET = 200; // Removed VITE env var usage as per guidelines
  const RENDER_BUDGET = 3000;

  const syncStats = getSyncStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          System Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Total Employees</span>
            <Badge variant="outline">{employees.length}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>AI Sync Events</span>
            <Badge variant="outline">{syncStats.total}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Avg Sync Latency</span>
            <Badge variant="outline">{syncStats.avgLatency}ms</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Failed Events</span>
            <Badge variant={syncStats.failed > 0 ? "destructive" : "outline"}>
              {syncStats.failed}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Latency Budget</span>
            <Badge variant="secondary">{LATENCY_BUDGET}ms</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Render Budget</span>
            <Badge variant="secondary">{RENDER_BUDGET}ms</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};