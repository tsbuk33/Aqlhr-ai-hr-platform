import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingDown, Users, Brain, Calendar, UserX } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export const RetentionIntelligence: React.FC = () => {
  const { isRTL } = useUnifiedLocale();

  const mockMetrics = {
    flightRisk: 23,
    retentionRate: 89.5,
    averageTenure: 3.2,
    exitInterviews: 12
  };

  const highRiskEmployees = [
    {
      name: 'Ahmed Mohammed',
      department: 'Engineering',
      riskScore: 87,
      factors: ['Low engagement', 'Missed promotions', 'High workload'],
      tenure: '2.5 years'
    },
    {
      name: 'Layla Khalil',
      department: 'Marketing',
      riskScore: 82,
      factors: ['Manager conflict', 'Limited growth', 'Market opportunities'],
      tenure: '1.8 years'
    },
    {
      name: 'Omar Hassan',
      department: 'Sales',
      riskScore: 78,
      factors: ['Compensation below market', 'Work-life balance', 'Team dynamics'],
      tenure: '3.1 years'
    }
  ];

  const interventions = [
    {
      type: 'Compensation Review',
      target: 'Omar Hassan',
      status: 'Scheduled',
      impact: 'High',
      timeline: '2 weeks'
    },
    {
      type: 'Career Development Plan',
      target: 'Ahmed Mohammed',
      status: 'In Progress',
      impact: 'Very High',
      timeline: '1 month'
    },
    {
      type: 'Manager Coaching',
      target: 'Layla Khalil',
      status: 'Recommended',
      impact: 'Medium',
      timeline: '3 weeks'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flight Risk Employees</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{mockMetrics.flightRisk}</div>
            <p className="text-xs text-muted-foreground">Immediate attention needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.retentionRate}%</div>
            <p className="text-xs text-muted-foreground">-2.1% from last quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Tenure</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.averageTenure} yrs</div>
            <p className="text-xs text-muted-foreground">Industry benchmark: 2.8 yrs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exit Interviews</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.exitInterviews}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-destructive" />
              High Flight Risk Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {highRiskEmployees.map((employee, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{employee.name}</h4>
                      <p className="text-sm text-muted-foreground">{employee.department} • {employee.tenure}</p>
                    </div>
                    <Badge variant="destructive">{employee.riskScore}% risk</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Risk Factors:</p>
                    <div className="flex flex-wrap gap-1">
                      {employee.factors.map((factor, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="default">Create Intervention</Button>
                    <Button size="sm" variant="outline">View Profile</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Active Interventions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interventions.map((intervention, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{intervention.type}</h4>
                    <Badge variant={
                      intervention.status === 'Scheduled' ? 'default' :
                      intervention.status === 'In Progress' ? 'secondary' :
                      'outline'
                    }>
                      {intervention.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Target: {intervention.target}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <span>Impact: <Badge variant="outline" className="text-xs">{intervention.impact}</Badge></span>
                    </div>
                    <span className="text-muted-foreground">Timeline: {intervention.timeline}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};