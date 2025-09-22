import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckSquare, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Lightbulb,
  Zap,
  Shield,
  BookOpen
} from 'lucide-react';

interface ActionItemRecommendationsProps {
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const ActionItemRecommendations: React.FC<ActionItemRecommendationsProps> = ({ screenSize }) => {
  const { t } = useTranslation();
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  // Dummy action items data
  const actionItems = [
    {
      id: 1,
      title: 'Address Support Team Overload',
      description: 'Support team showing 94% workload capacity. Consider redistributing tasks or hiring.',
      priority: 'high',
      category: 'workload',
      impact: 'high',
      effort: 'medium',
      deadline: '1 week',
      assignedTo: 'HR Team',
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 2,
      title: 'Implement Flexible Working Hours',
      description: 'Peak productivity occurs 10-11 AM. Allow flexible schedules to maximize efficiency.',
      priority: 'medium',
      category: 'productivity',
      impact: 'high',
      effort: 'low',
      deadline: '2 weeks',
      assignedTo: 'Management',
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 3,
      title: 'Reduce Meeting Frequency',
      description: 'Teams spending 20-25% time in meetings. Implement no-meeting days or shorter meetings.',
      priority: 'medium',
      category: 'time-management',
      impact: 'medium',
      effort: 'low',
      deadline: '1 week',
      assignedTo: 'Team Leaders',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 4,
      title: 'Launch Recognition Program',
      description: 'Top performers identified but no formal recognition system. Implement monthly awards.',
      priority: 'medium',
      category: 'engagement',
      impact: 'high',
      effort: 'medium',
      deadline: '3 weeks',
      assignedTo: 'HR Team',
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 5,
      title: 'Improve Career Development Paths',
      description: 'Engagement scores show growth opportunities as key concern. Create clear career ladders.',
      priority: 'high',
      category: 'development',
      impact: 'high',
      effort: 'high',
      deadline: '1 month',
      assignedTo: 'Leadership Team',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 6,
      title: 'Optimize Government Portal Integration',
      description: 'Manual processes detected in compliance workflows. Automate routine government submissions.',
      priority: 'low',
      category: 'automation',
      impact: 'medium',
      effort: 'high',
      deadline: '6 weeks',
      assignedTo: 'IT Team',
      icon: Shield,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      id: 7,
      title: 'Conduct Skills Assessment',
      description: 'Performance variations suggest skills gaps. Conduct comprehensive skills audit.',
      priority: 'medium',
      category: 'training',
      impact: 'medium',
      effort: 'medium',
      deadline: '2 weeks',
      assignedTo: 'HR Team',
      icon: BookOpen,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 8,
      title: 'Implement AI-Powered Analytics',
      description: 'Current insights are reactive. Deploy predictive analytics for proactive management.',
      priority: 'low',
      category: 'technology',
      impact: 'high',
      effort: 'high',
      deadline: '8 weeks',
      assignedTo: 'IT Team',
      icon: Zap,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200'
    }
  ];

  const recommendations = [
    {
      category: 'Immediate Actions',
      items: actionItems.filter(item => item.priority === 'high'),
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      category: 'Short Term Improvements',
      items: actionItems.filter(item => item.priority === 'medium'),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      category: 'Long Term Initiatives',
      items: actionItems.filter(item => item.priority === 'low'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  const impactMatrix = [
    { impact: 'High Impact, Low Effort', count: 3, color: '#22c55e' },
    { impact: 'High Impact, High Effort', count: 2, color: '#f59e0b' },
    { impact: 'Medium Impact, Low Effort', count: 2, color: '#3b82f6' },
    { impact: 'Medium Impact, High Effort', count: 1, color: '#8b5cf6' }
  ];

  const implementationStats = {
    totalItems: actionItems.length,
    completed: checkedItems.size,
    inProgress: 3,
    pending: actionItems.length - checkedItems.size - 3,
    completionRate: Math.round((checkedItems.size / actionItems.length) * 100)
  };

  const handleItemCheck = (id: number) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(id)) {
      newCheckedItems.delete(id);
    } else {
      newCheckedItems.add(id);
    }
    setCheckedItems(newCheckedItems);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Implementation Progress */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.completed')}</p>
                <p className="text-xl font-bold text-green-600">{implementationStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.in_progress')}</p>
                <p className="text-xl font-bold text-yellow-600">{implementationStats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.pending')}</p>
                <p className="text-xl font-bold text-red-600">{implementationStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('analytics.completion_rate')}</p>
                <p className="text-xl font-bold text-blue-600">{implementationStats.completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('analytics.implementation_progress')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('analytics.overall_completion')}</span>
              <span>{implementationStats.completionRate}%</span>
            </div>
            <Progress value={implementationStats.completionRate} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {implementationStats.completed} of {implementationStats.totalItems} action items completed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Items by Priority */}
      {recommendations.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${category.color}`}>
              <Lightbulb className="h-5 w-5" />
              {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.items.map((item) => {
                const Icon = item.icon;
                const isChecked = checkedItems.has(item.id);
                
                return (
                  <div 
                    key={item.id} 
                    className={`p-4 border rounded-lg ${item.borderColor} ${item.bgColor} ${isChecked ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => handleItemCheck(item.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-5 w-5 ${item.color}`} />
                            <h4 className={`font-medium ${isChecked ? 'line-through' : ''}`}>
                              {item.title}
                            </h4>
                          </div>
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge className={getImpactColor(item.impact)}>
                            {item.impact} impact
                          </Badge>
                          <Badge className={getEffortColor(item.effort)}>
                            {item.effort} effort
                          </Badge>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.deadline}
                          </Badge>
                          <Badge variant="outline">
                            <Users className="h-3 w-3 mr-1" />
                            {item.assignedTo}
                          </Badge>
                        </div>
                        
                        {!isChecked && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="default">
                              {t('analytics.assign')}
                            </Button>
                            <Button size="sm" variant="outline">
                              {t('analytics.schedule')}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Impact vs Effort Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.impact_effort_matrix')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {impactMatrix.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.impact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-2 rounded"
                    style={{ 
                      width: `${item.count * 30}px`,
                      backgroundColor: item.color
                    }}
                  />
                  <span className="text-sm font-bold min-w-[1.5rem]">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.key_recommendations')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-red-900">{t('analytics.urgent_attention_needed')}</p>
                <p className="text-sm text-red-700">
                  {t('analytics.urgent_attention_needed_insight')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-green-900">{t('analytics.quick_wins_available')}</p>
                <p className="text-sm text-green-700">
                  {t('analytics.quick_wins_available_insight')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-blue-900">{t('analytics.strategic_initiatives')}</p>
                <p className="text-sm text-blue-700">
                  {t('analytics.strategic_initiatives_insight')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};