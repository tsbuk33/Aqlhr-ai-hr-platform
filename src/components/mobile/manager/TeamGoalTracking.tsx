import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  Clock, 
  Users,
  CheckCircle,
  AlertCircle,
  Plus,
  Calendar
} from 'lucide-react';

interface TeamGoal {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  progress: number;
  target: number;
  unit: string;
  unitAr: string;
  deadline: string;
  status: 'on_track' | 'at_risk' | 'behind' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assignedMembers: string[];
  category: 'performance' | 'training' | 'compliance' | 'efficiency';
  milestones: {
    id: string;
    title: string;
    completed: boolean;
    date: string;
  }[];
}

interface TeamGoalTrackingProps {
  isArabic: boolean;
}

export const TeamGoalTracking: React.FC<TeamGoalTrackingProps> = ({ isArabic }) => {
  const [goals, setGoals] = useState<TeamGoal[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'at_risk'>('active');

  useEffect(() => {
    loadGoalsData();
  }, []);

  const loadGoalsData = () => {
    setGoals([
      {
        id: 'goal_001',
        title: 'Increase Team Productivity',
        titleAr: 'زيادة إنتاجية الفريق',
        description: 'Achieve 95% task completion rate',
        descriptionAr: 'تحقيق معدل إنجاز المهام ٩٥٪',
        progress: 87,
        target: 95,
        unit: '%',
        unitAr: '٪',
        deadline: '2024-03-31',
        status: 'on_track',
        priority: 'high',
        assignedMembers: ['emp_001', 'emp_002', 'emp_003'],
        category: 'performance',
        milestones: [
          { id: 'm1', title: 'Baseline Assessment', completed: true, date: '2024-01-15' },
          { id: 'm2', title: 'Process Optimization', completed: true, date: '2024-02-15' },
          { id: 'm3', title: 'Team Training', completed: false, date: '2024-03-01' },
          { id: 'm4', title: 'Final Review', completed: false, date: '2024-03-25' }
        ]
      },
      {
        id: 'goal_002',
        title: 'Complete Compliance Training',
        titleAr: 'إكمال تدريب الامتثال',
        description: 'All team members certified',
        descriptionAr: 'جميع أعضاء الفريق حاصلون على الشهادة',
        progress: 12,
        target: 15,
        unit: 'members',
        unitAr: 'عضو',
        deadline: '2024-04-15',
        status: 'at_risk',
        priority: 'medium',
        assignedMembers: ['emp_001', 'emp_002', 'emp_003', 'emp_004', 'emp_005'],
        category: 'compliance',
        milestones: [
          { id: 'm5', title: 'Enroll Members', completed: true, date: '2024-02-01' },
          { id: 'm6', title: 'Module 1 Complete', completed: true, date: '2024-02-20' },
          { id: 'm7', title: 'Module 2 Complete', completed: false, date: '2024-03-10' },
          { id: 'm8', title: 'Final Assessment', completed: false, date: '2024-04-10' }
        ]
      },
      {
        id: 'goal_003',
        title: 'Reduce Response Time',
        titleAr: 'تقليل وقت الاستجابة',
        description: 'Customer response under 2 hours',
        descriptionAr: 'استجابة العملاء أقل من ساعتين',
        progress: 4.2,
        target: 2.0,
        unit: 'hours',
        unitAr: 'ساعة',
        deadline: '2024-05-01',
        status: 'behind',
        priority: 'high',
        assignedMembers: ['emp_002', 'emp_004'],
        category: 'efficiency',
        milestones: [
          { id: 'm9', title: 'Current State Analysis', completed: true, date: '2024-01-30' },
          { id: 'm10', title: 'Process Redesign', completed: false, date: '2024-03-15' },
          { id: 'm11', title: 'Tool Implementation', completed: false, date: '2024-04-15' },
          { id: 'm12', title: 'Performance Validation', completed: false, date: '2024-04-30' }
        ]
      }
    ]);
  };

  const getStatusColor = (status: TeamGoal['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'on_track':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'at_risk':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'behind':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: TeamGoal['category']) => {
    switch (category) {
      case 'performance':
        return <TrendingUp className="h-4 w-4" />;
      case 'training':
        return <Users className="h-4 w-4" />;
      case 'compliance':
        return <CheckCircle className="h-4 w-4" />;
      case 'efficiency':
        return <Clock className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: TeamGoal['status']) => {
    if (isArabic) {
      switch (status) {
        case 'completed': return 'مكتمل';
        case 'on_track': return 'على المسار الصحيح';
        case 'at_risk': return 'في خطر';
        case 'behind': return 'متأخر';
        default: return 'غير معروف';
      }
    } else {
      switch (status) {
        case 'completed': return 'Completed';
        case 'on_track': return 'On Track';
        case 'at_risk': return 'At Risk';
        case 'behind': return 'Behind';
        default: return 'Unknown';
      }
    }
  };

  const formatNumber = (num: number) => {
    if (isArabic) {
      return num.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
    }
    return num.toString();
  };

  const filteredGoals = goals.filter(goal => {
    switch (filter) {
      case 'active':
        return goal.status !== 'completed';
      case 'completed':
        return goal.status === 'completed';
      case 'at_risk':
        return goal.status === 'at_risk' || goal.status === 'behind';
      default:
        return true;
    }
  });

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {isArabic ? 'تتبع أهداف الفريق' : 'Team Goal Tracking'}
          </div>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            {isArabic ? 'إضافة هدف' : 'Add Goal'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: 'all', label: isArabic ? 'الكل' : 'All' },
              { key: 'active', label: isArabic ? 'نشط' : 'Active' },
              { key: 'completed', label: isArabic ? 'مكتمل' : 'Completed' },
              { key: 'at_risk', label: isArabic ? 'في خطر' : 'At Risk' }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={filter === tab.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(tab.key as any)}
                className="whitespace-nowrap"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Goals List */}
          <div className="space-y-3">
            {filteredGoals.map((goal) => {
              const progressPercent = Math.min((goal.progress / goal.target) * 100, 100);
              const daysLeft = getDaysUntilDeadline(goal.deadline);
              
              return (
                <Card key={goal.id} className="border">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getCategoryIcon(goal.category)}
                            <h4 className="font-medium text-sm">
                              {isArabic ? goal.titleAr : goal.title}
                            </h4>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {isArabic ? goal.descriptionAr : goal.description}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(goal.status)} text-xs`}>
                          {getStatusText(goal.status)}
                        </Badge>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {formatNumber(goal.progress)} / {formatNumber(goal.target)} {isArabic ? goal.unitAr : goal.unit}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(Math.round(progressPercent))}%
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>

                      {/* Timeline & Members */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {daysLeft > 0 
                              ? `${formatNumber(daysLeft)} ${isArabic ? 'يوم متبقي' : 'days left'}`
                              : `${formatNumber(Math.abs(daysLeft))} ${isArabic ? 'يوم متأخر' : 'days overdue'}`
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>
                            {formatNumber(goal.assignedMembers.length)} {isArabic ? 'أعضاء' : 'members'}
                          </span>
                        </div>
                      </div>

                      {/* Milestones */}
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          {isArabic ? 'المعالم الرئيسية' : 'Milestones'}
                        </p>
                        <div className="flex gap-1">
                          {goal.milestones.map((milestone) => (
                            <div
                              key={milestone.id}
                              className={`w-3 h-3 rounded-full ${
                                milestone.completed 
                                  ? 'bg-green-500' 
                                  : 'bg-gray-300'
                              }`}
                              title={milestone.title}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredGoals.length === 0 && (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {isArabic ? 'لا توجد أهداف في هذه الفئة' : 'No goals in this category'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};