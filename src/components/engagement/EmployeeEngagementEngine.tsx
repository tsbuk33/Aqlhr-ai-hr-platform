import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, TrendingUp, Users, MessageCircle, Target, BarChart3 } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export const EmployeeEngagementEngine: React.FC = () => {
  const { isRTL } = useUnifiedLocale();

  const mockData = {
    overallEngagement: 78,
    pulseResponses: 945,
    sentimentScore: 82,
    departmentEngagement: [
      { department: 'Engineering', score: 85, trend: '+5%' },
      { department: 'Marketing', score: 76, trend: '+2%' },
      { department: 'Sales', score: 72, trend: '-1%' },
      { department: 'HR', score: 89, trend: '+7%' }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Engagement</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overallEngagement}%</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pulse Responses</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.pulseResponses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">94% response rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.sentimentScore}%</div>
            <p className="text-xs text-muted-foreground">Positive sentiment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Surveys</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 closing soon</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Department Engagement Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.departmentEngagement.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{dept.department}</div>
                    <Badge variant={dept.score >= 80 ? 'default' : dept.score >= 70 ? 'secondary' : 'destructive'}>
                      {dept.score}%
                    </Badge>
                  </div>
                  <div className={`text-sm ${dept.trend.startsWith('+') ? 'text-green-600' : dept.trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                    {dept.trend}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Real-time Pulse Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Work-life Balance</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm font-medium">75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Career Development</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <span className="text-sm font-medium">68%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Manager Relationship</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                  <span className="text-sm font-medium">82%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Company Culture</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '79%' }}></div>
                  </div>
                  <span className="text-sm font-medium">79%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};