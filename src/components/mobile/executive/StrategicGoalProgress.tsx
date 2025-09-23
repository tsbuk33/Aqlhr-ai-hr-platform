import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

interface StrategicGoalProgressProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const StrategicGoalProgress: React.FC<StrategicGoalProgressProps> = ({ screenSize }) => {
  const strategicGoals = [
    {
      id: 1,
      title: 'Revenue Growth Target',
      description: 'Achieve $60M annual revenue by Q4 2024',
      progress: 78,
      status: 'on-track',
      deadline: '2024-12-31',
      owner: 'CEO',
      milestones: [
        { name: 'Q1 Target', completed: true, date: '2024-03-31' },
        { name: 'Q2 Target', completed: true, date: '2024-06-30' },
        { name: 'Q3 Target', completed: false, date: '2024-09-30' },
        { name: 'Q4 Target', completed: false, date: '2024-12-31' }
      ]
    },
    {
      id: 2,
      title: 'Market Expansion',
      description: 'Enter 3 new regional markets',
      progress: 65,
      status: 'on-track',
      deadline: '2024-10-15',
      owner: 'VP Sales',
      milestones: [
        { name: 'Market Research', completed: true, date: '2024-02-15' },
        { name: 'Riyadh Launch', completed: true, date: '2024-05-01' },
        { name: 'Jeddah Launch', completed: false, date: '2024-08-01' },
        { name: 'Dammam Launch', completed: false, date: '2024-10-01' }
      ]
    },
    {
      id: 3,
      title: 'Digital Transformation',
      description: 'Complete AI integration across all processes',
      progress: 45,
      status: 'at-risk',
      deadline: '2024-11-30',
      owner: 'CTO',
      milestones: [
        { name: 'Infrastructure Setup', completed: true, date: '2024-01-31' },
        { name: 'Core Systems', completed: false, date: '2024-06-30' },
        { name: 'AI Integration', completed: false, date: '2024-09-30' },
        { name: 'Full Deployment', completed: false, date: '2024-11-30' }
      ]
    },
    {
      id: 4,
      title: 'Employee Satisfaction',
      description: 'Achieve 90% employee satisfaction score',
      progress: 87,
      status: 'ahead',
      deadline: '2024-08-31',
      owner: 'CHRO',
      milestones: [
        { name: 'Baseline Survey', completed: true, date: '2024-01-15' },
        { name: 'Improvement Plan', completed: true, date: '2024-03-15' },
        { name: 'Mid-year Review', completed: true, date: '2024-06-15' },
        { name: 'Final Assessment', completed: false, date: '2024-08-31' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'bg-green-500';
      case 'on-track': return 'bg-blue-500';
      case 'at-risk': return 'bg-yellow-500';
      case 'behind': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ahead': return <CheckCircle className="h-4 w-4" />;
      case 'on-track': return <Target className="h-4 w-4" />;
      case 'at-risk': return <Clock className="h-4 w-4" />;
      case 'behind': return <AlertTriangle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Target className="h-6 w-6 text-orange-500" />
        <div>
          <h3 className="text-lg font-semibold">Strategic Goal Progress</h3>
          <p className="text-sm text-muted-foreground">Company-wide objectives and milestones</p>
        </div>
      </div>

      {/* Overall Progress Summary */}
      <Card className="border-l-4 border-l-orange-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Overall Goal Completion</p>
              <p className="text-2xl font-bold text-orange-600">68.75%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Goals on Track</p>
              <p className="text-lg font-bold">3 of 4</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Goals */}
      <div className="space-y-4">
        {strategicGoals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium">{goal.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(goal.status)} text-white`}>
                    {getStatusIcon(goal.status)}
                    <span className="ml-1">{goal.status.replace('-', ' ').toUpperCase()}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-bold">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Goal Details */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Owner:</span>
                    <span className="ml-2 font-medium">{goal.owner}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Deadline:</span>
                    <span className="ml-2 font-medium">{new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Milestones</span>
                  <div className="space-y-1">
                    {goal.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <div className={`w-3 h-3 rounded-full border-2 ${
                          milestone.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300'
                        }`}>
                          {milestone.completed && (
                            <CheckCircle className="h-2 w-2 text-white" />
                          )}
                        </div>
                        <span className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                          {milestone.name}
                        </span>
                        <span className="text-muted-foreground">
                          ({new Date(milestone.date).toLocaleDateString()})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Update Progress
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};