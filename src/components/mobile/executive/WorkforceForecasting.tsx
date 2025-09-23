import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users } from 'lucide-react';

interface WorkforceForecastingProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const WorkforceForecasting: React.FC<WorkforceForecastingProps> = ({ screenSize }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-6 w-6 text-yellow-500" />
        <div>
          <h3 className="text-lg font-semibold">Workforce Forecasting</h3>
          <p className="text-sm text-muted-foreground">Future workforce planning</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current vs Predicted Workforce</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Current Size:</span>
              <span className="font-bold">278 employees</span>
            </div>
            <div className="flex justify-between">
              <span>Predicted (6M):</span>
              <span className="font-bold text-blue-600">327 employees</span>
            </div>
            <div className="flex justify-between">
              <span>Growth Rate:</span>
              <span className="font-bold text-green-600">+17.6%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};