import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Clock, Shield, Smile, Activity } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export const WellnessSatisfaction: React.FC = () => {
  const { isRTL } = useUnifiedLocale();

  const wellnessMetrics = {
    mentalHealthScore: 72,
    stressLevel: 35,
    workLifeBalance: 78,
    jobSatisfaction: 84
  };

  const mentalHealthCheckins = [
    {
      employee: 'Ahmad Khalil',
      status: 'Good',
      lastCheckin: '2 days ago',
      trend: 'stable',
      notes: 'Positive mood, engaged in work'
    },
    {
      employee: 'Layla Mohammed',
      status: 'Needs Support',
      lastCheckin: '1 day ago',
      trend: 'declining',
      notes: 'Reported increased stress levels'
    },
    {
      employee: 'Omar Hassan',
      status: 'Excellent',
      lastCheckin: '3 days ago',
      trend: 'improving',
      notes: 'Recent promotion boost in confidence'
    }
  ];

  const stressMonitoring = [
    {
      department: 'Engineering',
      avgStress: 42,
      trend: '+8%',
      factors: ['Tight deadlines', 'Technical challenges']
    },
    {
      department: 'Sales',
      avgStress: 38,
      trend: '-3%',
      factors: ['Market pressure', 'Target achievements']
    },
    {
      department: 'Marketing',
      avgStress: 29,
      trend: '-12%',
      factors: ['Campaign planning', 'Creative workload']
    }
  ];

  const satisfactionFactors = [
    { factor: 'Compensation', score: 78, change: '+5%' },
    { factor: 'Career Growth', score: 82, change: '+12%' },
    { factor: 'Work Environment', score: 88, change: '+3%' },
    { factor: 'Manager Relationship', score: 85, change: '+7%' },
    { factor: 'Work-Life Balance', score: 76, change: '-2%' },
    { factor: 'Company Culture', score: 91, change: '+8%' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mental Health Score</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{wellnessMetrics.mentalHealthScore}</div>
            <p className="text-xs text-muted-foreground">Company average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stress Level</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{wellnessMetrics.stressLevel}%</div>
            <p className="text-xs text-muted-foreground">Moderate range</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work-Life Balance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{wellnessMetrics.workLifeBalance}%</div>
            <p className="text-xs text-muted-foreground">+4% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Satisfaction</CardTitle>
            <Smile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{wellnessMetrics.jobSatisfaction}%</div>
            <p className="text-xs text-muted-foreground">Above industry benchmark</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Mental Health Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mentalHealthCheckins.map((checkin, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{checkin.employee}</h4>
                    <Badge variant={
                      checkin.status === 'Excellent' ? 'default' :
                      checkin.status === 'Good' ? 'secondary' :
                      'destructive'
                    }>
                      {checkin.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Last check-in: {checkin.lastCheckin}</span>
                    <Badge variant="outline" className={
                      checkin.trend === 'improving' ? 'text-green-600' :
                      checkin.trend === 'declining' ? 'text-red-600' :
                      'text-gray-600'
                    }>
                      {checkin.trend}
                    </Badge>
                  </div>
                  <p className="text-sm">{checkin.notes}</p>
                  {checkin.status === 'Needs Support' && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="default">Schedule Support</Button>
                      <Button size="sm" variant="outline">Contact Manager</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-500" />
              Stress Level Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stressMonitoring.map((dept, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{dept.department}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={dept.avgStress > 40 ? 'destructive' : dept.avgStress > 30 ? 'secondary' : 'default'}>
                        {dept.avgStress}% stress
                      </Badge>
                      <span className={`text-sm ${dept.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                        {dept.trend}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Main factors:</p>
                    <div className="flex flex-wrap gap-1">
                      {dept.factors.map((factor, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5" />
            Job Satisfaction Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {satisfactionFactors.map((factor, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{factor.factor}</h4>
                  <span className={`text-sm font-bold ${factor.change.startsWith('+') ? 'text-green-600' : factor.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                    {factor.change}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${factor.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-bold">{factor.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Wellness Programs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Meditation Sessions</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Fitness Challenge</span>
              <Badge variant="secondary">156 participants</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Mental Health Days</span>
              <Badge variant="outline">Available</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Support Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">EAP Sessions</span>
              <Badge variant="outline">23 this month</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Counseling Services</span>
              <Badge variant="default">Available 24/7</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Peer Support Groups</span>
              <Badge variant="secondary">4 active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Recent Interventions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <div className="font-medium">Engineering Team</div>
              <div className="text-muted-foreground">Stress reduction workshop</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Sarah A.</div>
              <div className="text-muted-foreground">Individual counseling session</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Remote Workers</div>
              <div className="text-muted-foreground">Virtual wellness program</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};