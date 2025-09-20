import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Award, TrendingUp, User, Calendar, Target } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export const PersonalizedEngagementStrategies: React.FC = () => {
  const { isRTL } = useUnifiedLocale();

  const mockStrategies = [
    {
      type: 'Recognition',
      title: 'Peer Recognition Program',
      description: 'AI-generated recognition suggestions based on achievements',
      impact: 'High',
      status: 'Active',
      participants: 234
    },
    {
      type: 'Development',
      title: 'Personalized Career Paths',
      description: 'Custom development plans for each employee',
      impact: 'Very High',
      status: 'Planning',
      participants: 567
    },
    {
      type: 'Balance',
      title: 'Work-Life Balance Optimization',
      description: 'Flexible schedules based on performance patterns',
      impact: 'Medium',
      status: 'Active',
      participants: 189
    }
  ];

  const mockRecommendations = [
    {
      employee: 'Sarah Ahmed',
      recommendation: 'Offer leadership training opportunity',
      confidence: 92,
      reason: 'High performance + expressed interest in management'
    },
    {
      employee: 'Mohammed Ali',
      recommendation: 'Flexible work arrangement',
      confidence: 88,
      reason: 'Stress indicators + family commitments'
    },
    {
      employee: 'Fatima Hassan',
      recommendation: 'Cross-department project assignment',
      confidence: 85,
      reason: 'Seeking variety + strong collaboration skills'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {mockStrategies.map((strategy, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {strategy.title}
                </div>
                <Badge variant={strategy.status === 'Active' ? 'default' : 'secondary'}>
                  {strategy.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{strategy.description}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Impact:</span>
                <Badge variant={strategy.impact === 'Very High' ? 'default' : strategy.impact === 'High' ? 'secondary' : 'outline'}>
                  {strategy.impact}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Participants:</span>
                <span className="text-sm font-medium">{strategy.participants}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              AI-Generated Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{rec.employee}</span>
                    </div>
                    <Badge variant="outline">{rec.confidence}% confidence</Badge>
                  </div>
                  <p className="text-sm font-medium mb-1">{rec.recommendation}</p>
                  <p className="text-xs text-muted-foreground">{rec.reason}</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="default">Approve</Button>
                    <Button size="sm" variant="outline">Modify</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Team Building Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Innovation Workshop</h4>
                  <Badge>Scheduled</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Cross-functional collaboration session</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Next Friday
                  </div>
                  <div>24 participants</div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Remote Team Social</h4>
                  <Badge variant="secondary">Planning</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Virtual engagement for remote employees</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    TBD
                  </div>
                  <div>45 interested</div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Wellness Challenge</h4>
                  <Badge>Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">30-day health and wellness program</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    78% completion
                  </div>
                  <div>156 participants</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};