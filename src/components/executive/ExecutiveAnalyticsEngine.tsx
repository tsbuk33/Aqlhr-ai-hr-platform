import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Users, 
  Target, 
  AlertTriangle, 
  Calendar,
  DollarSign,
  Star,
  Brain,
  Activity,
  UserCheck,
  Clock,
  Award,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const workforceData = [
  { month: 'Jan', current: 850, projected: 870, budget: 900 },
  { month: 'Feb', current: 845, projected: 875, budget: 905 },
  { month: 'Mar', current: 860, projected: 885, budget: 910 },
  { month: 'Apr', current: 875, projected: 895, budget: 915 },
  { month: 'May', current: 890, projected: 910, budget: 920 },
  { month: 'Jun', current: 905, projected: 925, budget: 925 }
];

const skillGapData = [
  { skill: 'AI/ML', current: 15, required: 25, gap: 10, priority: 'high' },
  { skill: 'Data Analytics', current: 20, required: 30, gap: 10, priority: 'high' },
  { skill: 'Cloud Computing', current: 25, required: 32, gap: 7, priority: 'medium' },
  { skill: 'Cybersecurity', current: 18, required: 22, gap: 4, priority: 'medium' },
  { skill: 'Project Management', current: 35, required: 38, gap: 3, priority: 'low' }
];

const pipelineData = [
  { stage: 'Sourced', count: 245, quality: 'high' },
  { stage: 'Screened', count: 156, quality: 'high' },
  { stage: 'Interviewed', count: 89, quality: 'high' },
  { stage: 'Final Round', count: 34, quality: 'high' },
  { stage: 'Offers', count: 18, quality: 'high' }
];

const experienceMetrics = [
  { category: 'Onboarding', score: 8.9, trend: 'up', benchmark: 8.2 },
  { category: 'Career Development', score: 8.5, trend: 'up', benchmark: 7.8 },
  { category: 'Work-Life Balance', score: 8.7, trend: 'stable', benchmark: 8.1 },
  { category: 'Manager Effectiveness', score: 8.4, trend: 'up', benchmark: 7.9 },
  { category: 'Recognition', score: 8.2, trend: 'down', benchmark: 8.0 }
];

const riskEmployees = [
  { id: 1, name: 'Ahmed Al-Salem', department: 'Engineering', riskScore: 87, factors: ['Performance Decline', 'Low Engagement'], tenure: '3.2 years' },
  { id: 2, name: 'Sarah Johnson', department: 'Sales', riskScore: 82, factors: ['Manager Change', 'Missed Promotions'], tenure: '2.8 years' },
  { id: 3, name: 'Mohammed Ali', department: 'Marketing', riskScore: 79, factors: ['Workload Stress', 'Skill Mismatch'], tenure: '4.1 years' },
  { id: 4, name: 'Lisa Chen', department: 'Finance', riskScore: 76, factors: ['Career Stagnation', 'Low Recognition'], tenure: '2.1 years' }
];

export const ExecutiveAnalyticsEngine: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [selectedMetric, setSelectedMetric] = useState('workforce-planning');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Strategic Workforce Planning */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            {isArabic ? 'التخطيط الاستراتيجي للقوى العاملة' : 'Strategic Workforce Planning'}
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {isArabic ? 'دقة 94.2%' : '94.2% Accuracy'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Workforce Forecast Chart */}
          <div className="h-80">
            <h4 className="text-sm font-medium mb-4">
              {isArabic ? 'توقعات القوى العاملة (6 أشهر)' : 'Workforce Forecast (6 Months)'}
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={workforceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={2} name="Current" />
                <Line type="monotone" dataKey="projected" stroke="#10b981" strokeWidth={2} name="Projected" />
                <Line type="monotone" dataKey="budget" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Budget" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Gap Analysis */}
          <div>
            <h4 className="text-sm font-medium mb-4">
              {isArabic ? 'تحليل فجوات المهارات (6-24 شهر)' : 'Skill Gap Projections (6-24 months)'}
            </h4>
            <div className="space-y-3">
              {skillGapData.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{skill.skill}</span>
                      <Badge variant={skill.priority === 'high' ? 'destructive' : skill.priority === 'medium' ? 'secondary' : 'outline'}>
                        {skill.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{isArabic ? 'الحالي:' : 'Current:'} {skill.current}</span>
                      <span>{isArabic ? 'المطلوب:' : 'Required:'} {skill.required}</span>
                      <span className="text-red-600 font-medium">
                        {isArabic ? 'الفجوة:' : 'Gap:'} {skill.gap}
                      </span>
                    </div>
                  </div>
                  <div className="w-24">
                    <Progress value={(skill.current / skill.required) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Impact Analysis */}
          <Alert>
            <DollarSign className="w-4 h-4" />
            <AlertDescription>
              <strong>{isArabic ? 'تحليل تأثير الميزانية:' : 'Budget Impact Analysis:'}</strong>
              {isArabic 
                ? ' زيادة متوقعة في التكاليف بنسبة 12% للعام القادم بسبب نمو القوى العاملة وزيادة الرواتب.'
                : ' Projected 12% increase in costs for next year due to workforce growth and salary increases.'
              }
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Talent Pipeline Intelligence */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            {isArabic ? 'ذكاء خط المواهب' : 'Talent Pipeline Intelligence'}
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {isArabic ? '76 مرشح عالي الإمكانات' : '76 High-potential'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pipeline Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pipelineData.map((stage, index) => (
              <div key={index} className="text-center">
                <div className="relative">
                  <div className={`w-16 h-16 mx-auto rounded-full ${getQualityColor(stage.quality)} flex items-center justify-center text-white font-bold text-lg mb-2`}>
                    {stage.count}
                  </div>
                  {index < pipelineData.length - 1 && (
                    <div className="absolute top-8 left-16 w-full h-0.5 bg-gray-300 hidden md:block"></div>
                  )}
                </div>
                <p className="text-sm font-medium">{stage.stage}</p>
                <p className="text-xs text-gray-500">{stage.quality} quality</p>
              </div>
            ))}
          </div>

          {/* Pipeline Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">{isArabic ? 'جاهزية الترقية الداخلية' : 'Internal Promotion Readiness'}</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">87%</div>
              <div className="text-xs text-gray-600">{isArabic ? 'من المناصب القيادية' : 'of leadership positions'}</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">{isArabic ? 'تقييم المرشحين الخارجيين' : 'External Candidate Quality'}</span>
              </div>
              <div className="text-2xl font-bold text-green-600">8.4/10</div>
              <div className="text-xs text-gray-600">{isArabic ? 'متوسط التقييم' : 'average rating'}</div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium">{isArabic ? 'توقع الوقت للملء' : 'Time-to-fill Prediction'}</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">32</div>
              <div className="text-xs text-gray-600">{isArabic ? 'يوم في المتوسط' : 'days average'}</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">{isArabic ? 'تكلفة التوظيف' : 'Cost-per-hire'}</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">$4,250</div>
              <div className="text-xs text-gray-600">{isArabic ? 'انخفاض 15%' : '15% decrease'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Experience Analytics */}
      <Card className="border-2 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            {isArabic ? 'تحليلات تجربة الموظف' : 'Employee Experience Analytics'}
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
              {isArabic ? 'نقاط 8.7/10' : 'Score 8.7/10'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {experienceMetrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{metric.category}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{isArabic ? 'النقاط:' : 'Score:'} <strong>{metric.score}</strong></span>
                  <span>{isArabic ? 'المعيار:' : 'Benchmark:'} {metric.benchmark}</span>
                </div>
              </div>
              <div className="w-32">
                <Progress value={metric.score * 10} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Risk Management Dashboard */}
      <Card className="border-2 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            {isArabic ? 'لوحة إدارة المخاطر' : 'Risk Management Dashboard'}
            <Badge variant="destructive">
              {isArabic ? '12 موظف عالي المخاطر' : '12 High-risk Employees'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {riskEmployees.map((employee) => (
            <div key={employee.id} className={`p-4 rounded-lg border-l-4 border-red-500 ${getRiskColor(employee.riskScore)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{employee.name}</span>
                  <Badge variant="outline">{employee.department}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{isArabic ? 'نقاط المخاطر:' : 'Risk Score:'}</span>
                  <span className="font-bold">{employee.riskScore}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex flex-wrap gap-1">
                  {employee.factors.map((factor, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                </div>
                <span className="text-gray-600">{isArabic ? 'مدة الخدمة:' : 'Tenure:'} {employee.tenure}</span>
              </div>
            </div>
          ))}

          <Alert>
            <Brain className="w-4 h-4" />
            <AlertDescription>
              <strong>{isArabic ? 'تحليل أنماط مقابلات الإنهاء:' : 'Exit Interview Pattern Analysis:'}</strong>
              {isArabic 
                ? ' أشار 73% من الموظفين المغادرين إلى نقص فرص التطوير كسبب رئيسي للمغادرة.'
                : ' 73% of departing employees cited lack of development opportunities as primary reason for leaving.'
              }
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};