import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, TrendingUp } from 'lucide-react';

interface RiskAssessmentDashboardProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const RiskAssessmentDashboard: React.FC<RiskAssessmentDashboardProps> = ({ screenSize }) => {
  const risks = [
    { category: 'Talent Risk', level: 'Medium', score: 65, trend: 'improving' },
    { category: 'Financial Risk', level: 'Low', score: 25, trend: 'stable' },
    { category: 'Operational Risk', level: 'High', score: 85, trend: 'worsening' },
    { category: 'Compliance Risk', level: 'Low', score: 15, trend: 'improving' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-red-500" />
        <div>
          <h3 className="text-lg font-semibold">Risk Assessment</h3>
          <p className="text-sm text-muted-foreground">Enterprise risk monitoring</p>
        </div>
      </div>

      <div className="grid gap-4">
        {risks.map((risk, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{risk.category}</p>
                  <p className="text-xs text-muted-foreground">Risk Score: {risk.score}/100</p>
                </div>
                <Badge className={risk.level === 'High' ? 'bg-red-500' : risk.level === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}>
                  {risk.level}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};