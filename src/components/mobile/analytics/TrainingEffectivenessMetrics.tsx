import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { 
  GraduationCap, 
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Award,
  Target,
  BookOpen,
  BarChart3,
  Star,
  PlayCircle,
  CheckCircle,
  Zap
} from 'lucide-react';

interface TrainingProgram {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  enrollments: number;
  completions: number;
  completionRate: number;
  avgScore: number;
  duration: number;
  satisfaction: number;
  costPerEmployee: number;
  roiScore: number;
}

interface TrainingEffectivenessMetricsProps {
  companyId?: string;
}

export const TrainingEffectivenessMetrics: React.FC<TrainingEffectivenessMetricsProps> = ({ companyId }) => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState('quarter');

  const trainingPrograms: TrainingProgram[] = [
    {
      id: '1',
      name: 'Digital Skills Foundation',
      nameAr: 'أساسيات المهارات الرقمية',
      category: 'Technical',
      categoryAr: 'تقني',
      enrollments: 45,
      completions: 38,
      completionRate: 84,
      avgScore: 87,
      duration: 24,
      satisfaction: 4.3,
      costPerEmployee: 1200,
      roiScore: 145
    },
    {
      id: '2',
      name: 'Leadership Excellence',
      nameAr: 'التميز القيادي',
      category: 'Leadership',
      categoryAr: 'قيادة',
      enrollments: 22,
      completions: 20,
      completionRate: 91,
      avgScore: 92,
      duration: 40,
      satisfaction: 4.7,
      costPerEmployee: 2800,
      roiScore: 178
    },
    {
      id: '3',
      name: 'Customer Service Mastery',
      nameAr: 'إتقان خدمة العملاء',
      category: 'Soft Skills',
      categoryAr: 'مهارات شخصية',
      enrollments: 67,
      completions: 52,
      completionRate: 78,
      avgScore: 83,
      duration: 16,
      satisfaction: 4.1,
      costPerEmployee: 800,
      roiScore: 132
    },
    {
      id: '4',
      name: 'Safety & Compliance',
      nameAr: 'السلامة والامتثال',
      category: 'Compliance',
      categoryAr: 'امتثال',
      enrollments: 156,
      completions: 148,
      completionRate: 95,
      avgScore: 89,
      duration: 8,
      satisfaction: 4.0,
      costPerEmployee: 400,
      roiScore: 95
    },
    {
      id: '5',
      name: 'Data Analytics Fundamentals',
      nameAr: 'أساسيات تحليل البيانات',
      category: 'Technical',
      categoryAr: 'تقني',
      enrollments: 28,
      completions: 21,
      completionRate: 75,
      avgScore: 81,
      duration: 32,
      satisfaction: 4.2,
      costPerEmployee: 1800,
      roiScore: 118
    }
  ];

  const overallMetrics = [
    {
      label: isArabic ? 'متوسط معدل الإكمال' : 'Avg Completion Rate',
      value: '84.6',
      unit: '%',
      trend: 'up',
      change: '+5.2%',
      description: isArabic ? 'تحسن هذا الربع' : 'Improved this quarter'
    },
    {
      label: isArabic ? 'درجة الرضا' : 'Satisfaction Score',
      value: '4.3',
      unit: '/5.0',
      trend: 'up',
      change: '+0.2',
      description: isArabic ? 'من أصل 5' : 'Out of 5'
    },
    {
      label: isArabic ? 'إجمالي المشاركين' : 'Total Participants',
      value: '318',
      unit: isArabic ? 'موظف' : 'employees',
      trend: 'up',
      change: '+42',
      description: isArabic ? 'هذا الربع' : 'This quarter'
    },
    {
      label: isArabic ? 'عائد الاستثمار' : 'Training ROI',
      value: '134',
      unit: '%',
      trend: 'up',
      change: '+12%',
      description: isArabic ? 'متوسط العائد' : 'Average return'
    }
  ];

  const learningOutcomes = [
    {
      outcome: 'Skill Proficiency Increase',
      outcomeAr: 'زيادة إتقان المهارات',
      percentage: 78,
      impact: 'high'
    },
    {
      outcome: 'Job Performance Improvement',
      outcomeAr: 'تحسن أداء العمل',
      percentage: 65,
      impact: 'high'
    },
    {
      outcome: 'Employee Engagement',
      outcomeAr: 'مشاركة الموظفين',
      percentage: 71,
      impact: 'medium'
    },
    {
      outcome: 'Career Development',
      outcomeAr: 'التطوير المهني',
      percentage: 58,
      impact: 'medium'
    },
    {
      outcome: 'Knowledge Retention',
      outcomeAr: 'الاحتفاظ بالمعرفة',
      percentage: 82,
      impact: 'high'
    }
  ];

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSatisfactionColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getROIColor = (roi: number) => {
    if (roi >= 150) return 'text-green-600';
    if (roi >= 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryText = (category: string) => {
    if (isArabic) {
      switch (category) {
        case 'Technical': return 'تقني';
        case 'Leadership': return 'قيادة';
        case 'Soft Skills': return 'مهارات شخصية';
        case 'Compliance': return 'امتثال';
        default: return 'عام';
      }
    }
    return category;
  };

  const filteredPrograms = selectedCategory === 'all' 
    ? trainingPrograms 
    : trainingPrograms.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            {isArabic ? 'مقاييس فعالية التدريب' : 'Training Effectiveness Metrics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {['quarter', 'half-year', 'year'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="text-xs whitespace-nowrap"
              >
                {isArabic ? 
                  (period === 'quarter' ? 'ربع سنوي' : 
                   period === 'half-year' ? 'نصف سنوي' : 'سنوي') :
                  period.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                }
              </Button>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {overallMetrics.map((metric, index) => (
              <Card key={index} className="p-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                    {metric.trend === 'up' ? 
                      <TrendingUp className="h-3 w-3 text-green-500" /> :
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    }
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold">{metric.value}</span>
                    <span className="text-xs text-muted-foreground">{metric.unit}</span>
                  </div>
                  <div className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'Technical', 'Leadership', 'Soft Skills', 'Compliance'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs whitespace-nowrap"
              >
                {category === 'all' ? 
                  (isArabic ? 'الكل' : 'All') : 
                  getCategoryText(category)
                }
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isArabic ? 'البرامج التدريبية' : 'Training Programs'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredPrograms.map((program) => (
            <div key={program.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {isArabic ? program.nameAr : program.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isArabic ? program.categoryAr : program.category} • {program.duration}h
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={getROIColor(program.roiScore)}>
                  ROI {program.roiScore}%
                </Badge>
              </div>

              <div className="space-y-3">
                {/* Completion Rate */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{isArabic ? 'معدل الإكمال:' : 'Completion Rate:'}</span>
                    <span className={`font-medium ${getCompletionColor(program.completionRate)}`}>
                      {program.completionRate}% ({program.completions}/{program.enrollments})
                    </span>
                  </div>
                  <Progress value={program.completionRate} className="h-2" />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <div className={`text-lg font-bold ${getSatisfactionColor(program.satisfaction)}`}>
                      {program.satisfaction}
                    </div>
                    <div className="text-muted-foreground">
                      {isArabic ? 'الرضا' : 'Satisfaction'}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <div className="text-lg font-bold text-blue-600">
                      {program.avgScore}%
                    </div>
                    <div className="text-muted-foreground">
                      {isArabic ? 'متوسط الدرجة' : 'Avg Score'}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <div className="text-lg font-bold text-green-600">
                      {(program.costPerEmployee / 1000).toFixed(1)}K
                    </div>
                    <div className="text-muted-foreground">
                      {isArabic ? 'التكلفة' : 'Cost'}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    {isArabic ? 'التفاصيل' : 'Details'}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <PlayCircle className="h-3 w-3 mr-1" />
                    {isArabic ? 'المحتوى' : 'Content'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Learning Outcomes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5" />
            {isArabic ? 'نتائج التعلم' : 'Learning Outcomes'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {learningOutcomes.map((outcome, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm mb-1">
                  {isArabic ? outcome.outcomeAr : outcome.outcome}
                </p>
                <Progress value={outcome.percentage} className="h-2" />
              </div>
              <div className="text-right ml-4">
                <div className={`text-lg font-bold ${getImpactColor(outcome.impact)}`}>
                  {outcome.percentage}%
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getImpactColor(outcome.impact)}`}
                >
                  {outcome.impact === 'high' ? (isArabic ? 'عالي' : 'High') :
                   outcome.impact === 'medium' ? (isArabic ? 'متوسط' : 'Medium') :
                   (isArabic ? 'منخفض' : 'Low')}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Training Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5" />
            {isArabic ? 'رؤى التدريب' : 'Training Insights'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Award className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    {isArabic ? 'أداء ممتاز' : 'Excellent Performance'}
                  </p>
                  <p className="text-xs text-green-700">
                    {isArabic ? 
                      'برنامج التميز القيادي حقق 91% معدل إكمال و4.7 رضا' :
                      'Leadership Excellence achieved 91% completion with 4.7 satisfaction'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    {isArabic ? 'تحسن مستمر' : 'Continuous Improvement'}
                  </p>
                  <p className="text-xs text-blue-700">
                    {isArabic ? 
                      'متوسط معدل الإكمال ارتفع بنسبة 5.2% هذا الربع' :
                      'Average completion rate increased by 5.2% this quarter'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {isArabic ? 'فرصة للتحسين' : 'Improvement Opportunity'}
                  </p>
                  <p className="text-xs text-yellow-700">
                    {isArabic ? 
                      'تحليل البيانات يحتاج تحسين معدل الإكمال من 75% إلى 85%' :
                      'Data Analytics needs completion rate improvement from 75% to 85%'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};