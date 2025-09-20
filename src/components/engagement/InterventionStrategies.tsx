import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Mail, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export const InterventionStrategies: React.FC = () => {
  const { isRTL } = useUnifiedLocale();

  const automatedCampaigns = [
    {
      name: 'New Employee Onboarding',
      status: 'Active',
      sent: 45,
      opened: 42,
      engaged: 38,
      type: 'Onboarding'
    },
    {
      name: 'Anniversary Recognition',
      status: 'Scheduled',
      sent: 0,
      opened: 0,
      engaged: 0,
      type: 'Recognition'
    },
    {
      name: 'Career Development Nudges',
      status: 'Active',
      sent: 123,
      opened: 98,
      engaged: 67,
      type: 'Development'
    }
  ];

  const managerRecommendations = [
    {
      manager: 'Sarah Al-Ahmad',
      team: 'Engineering Team A',
      recommendation: 'Increase 1-on-1 frequency',
      priority: 'High',
      reason: 'Team engagement dropped 12% this month'
    },
    {
      manager: 'Mohammed Khalil',
      team: 'Marketing Team',
      recommendation: 'Team building activity',
      priority: 'Medium',
      reason: 'Cross-team collaboration issues detected'
    },
    {
      manager: 'Fatima Hassan',
      team: 'Sales Team B',
      recommendation: 'Recognition program launch',
      priority: 'High',
      reason: 'Low recognition scores in recent surveys'
    }
  ];

  const interventionTypes = [
    {
      type: 'Compensation Adjustment',
      count: 8,
      success: 87,
      avgTime: '2 weeks'
    },
    {
      type: 'Role Modification',
      count: 12,
      success: 73,
      avgTime: '1 month'
    },
    {
      type: 'Career Development',
      count: 25,
      success: 91,
      avgTime: '3 months'
    },
    {
      type: 'Manager Coaching',
      count: 6,
      success: 67,
      avgTime: '6 weeks'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Automated Engagement Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {automatedCampaigns.map((campaign, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{campaign.name}</h4>
                    <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Type: {campaign.type}</p>
                  {campaign.status === 'Active' && (
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold">{campaign.sent}</div>
                        <p className="text-xs text-muted-foreground">Sent</p>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{campaign.opened}</div>
                        <p className="text-xs text-muted-foreground">Opened</p>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{campaign.engaged}</div>
                        <p className="text-xs text-muted-foreground">Engaged</p>
                      </div>
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
              <Users className="h-5 w-5" />
              Manager Coaching Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {managerRecommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{rec.manager}</h4>
                      <p className="text-sm text-muted-foreground">{rec.team}</p>
                    </div>
                    <Badge variant={rec.priority === 'High' ? 'destructive' : 'secondary'}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium mb-1">{rec.recommendation}</p>
                  <p className="text-xs text-muted-foreground mb-3">{rec.reason}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default">Send Coaching</Button>
                    <Button size="sm" variant="outline">Schedule Call</Button>
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
            <TrendingUp className="h-5 w-5" />
            Intervention Success Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {interventionTypes.map((intervention, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{intervention.type}</h4>
                  <Badge variant="outline">{intervention.count} active</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Success Rate:</span>
                    <span className="text-sm font-bold text-green-600">{intervention.success}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Avg Time:</span>
                    <span className="text-sm font-medium">{intervention.avgTime}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${intervention.success}%` }}
                    ></div>
                  </div>
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
              <Zap className="h-5 w-5 text-blue-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Launch Pulse Survey
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Team Update
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Schedule Town Hall
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Compensation Reviews</span>
                <Badge variant="destructive">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Manager Coaching</span>
                <Badge variant="secondary">5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Career Plans</span>
                <Badge variant="secondary">8</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Recent Successes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Ahmed M.</div>
                <div className="text-muted-foreground">Retained after promotion</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Marketing Team</div>
                <div className="text-muted-foreground">+15% engagement boost</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Remote Workers</div>
                <div className="text-muted-foreground">Virtual social success</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};