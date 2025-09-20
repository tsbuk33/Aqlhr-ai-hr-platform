import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Globe, TrendingUp, Users, Calendar } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export const CommunicationOptimization: React.FC = () => {
  const { isRTL } = useUnifiedLocale();

  const newsletters = [
    {
      title: 'Monthly Company Update',
      recipients: 1250,
      openRate: 78,
      clickRate: 34,
      status: 'Sent',
      aiGenerated: true
    },
    {
      title: 'New Benefits Announcement',
      recipients: 1250,
      openRate: 92,
      clickRate: 67,
      status: 'Sent',
      aiGenerated: true
    },
    {
      title: 'Q4 Goals & Objectives',
      recipients: 850,
      openRate: 0,
      clickRate: 0,
      status: 'Scheduled',
      aiGenerated: true
    }
  ];

  const announcements = [
    {
      title: 'Remote Work Policy Update',
      target: 'All Employees',
      urgency: 'High',
      deliveryMethod: 'Push + Email',
      status: 'Delivered'
    },
    {
      title: 'New Employee Welcome',
      target: 'Engineering Team',
      urgency: 'Medium',
      deliveryMethod: 'Team Channel',
      status: 'Scheduled'
    },
    {
      title: 'Benefits Enrollment Reminder',
      target: 'Eligible Employees',
      urgency: 'High',
      deliveryMethod: 'Personalized Email',
      status: 'In Progress'
    }
  ];

  const surveyOptimizations = [
    {
      survey: 'Quarterly Engagement Survey',
      originalResponse: 67,
      optimizedResponse: 89,
      improvements: ['Timing optimization', 'Personalized invites', 'Mobile-friendly']
    },
    {
      survey: 'Benefits Feedback',
      originalResponse: 45,
      optimizedResponse: 72,
      improvements: ['Shortened questions', 'Progress indicators', 'Incentive program']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI-Generated Content</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Of all communications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">+15% from baseline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cultural Adaptation</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Languages supported</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91%</div>
            <p className="text-xs text-muted-foreground">Survey optimization</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              AI-Generated Newsletters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {newsletters.map((newsletter, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{newsletter.title}</h4>
                    <div className="flex gap-2">
                      {newsletter.aiGenerated && (
                        <Badge variant="secondary" className="text-xs">AI</Badge>
                      )}
                      <Badge variant={newsletter.status === 'Sent' ? 'default' : 'secondary'}>
                        {newsletter.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Recipients: {newsletter.recipients.toLocaleString()}
                  </p>
                  {newsletter.status === 'Sent' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-lg font-bold">{newsletter.openRate}%</div>
                        <p className="text-xs text-muted-foreground">Open Rate</p>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{newsletter.clickRate}%</div>
                        <p className="text-xs text-muted-foreground">Click Rate</p>
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
              <Send className="h-5 w-5" />
              Targeted Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{announcement.title}</h4>
                    <Badge variant={
                      announcement.status === 'Delivered' ? 'default' :
                      announcement.status === 'In Progress' ? 'secondary' :
                      'outline'
                    }>
                      {announcement.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target:</span>
                      <span>{announcement.target}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Urgency:</span>
                      <Badge variant={announcement.urgency === 'High' ? 'destructive' : 'secondary'}>
                        {announcement.urgency}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Method:</span>
                      <span>{announcement.deliveryMethod}</span>
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
            <TrendingUp className="h-5 w-5" />
            Survey Response Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {surveyOptimizations.map((optimization, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">{optimization.survey}</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-muted-foreground">{optimization.originalResponse}%</div>
                    <p className="text-xs text-muted-foreground">Original</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{optimization.optimizedResponse}%</div>
                    <p className="text-xs text-muted-foreground">Optimized</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium">Improvements:</p>
                  <div className="flex flex-wrap gap-1">
                    {optimization.improvements.map((improvement, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {improvement}
                      </Badge>
                    ))}
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
              <Calendar className="h-5 w-5 text-blue-500" />
              Scheduled Communications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Weekly Newsletter</span>
                <Badge variant="outline">Friday</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pulse Survey</span>
                <Badge variant="outline">Monthly</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Town Hall Invite</span>
                <Badge variant="destructive">Overdue</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Engagement Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Engagement</span>
                <span className="text-sm font-bold text-green-600">+24%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Survey Completion</span>
                <span className="text-sm font-bold text-green-600">+18%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Feedback Quality</span>
                <span className="text-sm font-bold text-green-600">+31%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-500" />
              Cultural Adaptation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Arabic Content</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cultural Context</span>
                <Badge variant="default">AI-Enhanced</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Local Holidays</span>
                <Badge variant="secondary">Integrated</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};