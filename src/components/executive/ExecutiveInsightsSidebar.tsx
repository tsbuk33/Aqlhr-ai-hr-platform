import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Zap,
  RefreshCw,
  Clock,
  Target,
  Users,
  DollarSign,
  Award,
  Bell
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const realTimeInsights = [
  {
    type: 'alert',
    priority: 'high',
    title: 'Talent Flight Risk',
    content: 'AI detected 3 high-performers showing early flight risk indicators.',
    confidence: 87,
    action: 'Schedule retention meetings',
    timestamp: '2 minutes ago'
  },
  {
    type: 'opportunity',
    priority: 'medium',
    title: 'Recruitment Efficiency',
    content: 'Current hiring pace is 23% faster than Q3 average.',
    confidence: 92,
    action: 'Consider expanding recruitment',
    timestamp: '15 minutes ago'
  },
  {
    type: 'insight',
    priority: 'low',
    title: 'Skills Development',
    content: 'AI/ML training completion rates increased 34% this month.',
    confidence: 95,
    action: 'Scale successful programs',
    timestamp: '1 hour ago'
  }
];

const marketIntelligence = [
  {
    metric: 'Salary Inflation',
    value: '+8.2%',
    trend: 'up',
    impact: 'high',
    description: 'Tech salaries rising faster than budget projections'
  },
  {
    metric: 'Talent Availability',
    value: '-15%',
    trend: 'down',
    impact: 'high',
    description: 'AI/ML specialists increasingly scarce'
  },
  {
    metric: 'Remote Work Preference',
    value: '78%',
    trend: 'stable',
    impact: 'medium',
    description: 'Candidates prefer hybrid/remote options'
  }
];

const aiRecommendations = [
  {
    category: 'Retention',
    recommendation: 'Implement personalized career development plans for top 20% performers',
    impact: 'High',
    effort: 'Medium',
    roi: '340%',
    timeframe: '3 months'
  },
  {
    category: 'Recruitment',
    recommendation: 'Partner with 3 additional universities for AI/ML talent pipeline',
    impact: 'High',
    effort: 'High',
    roi: '180%',
    timeframe: '6 months'
  },
  {
    category: 'Development',
    recommendation: 'Launch internal AI certification program',
    impact: 'Medium',
    effort: 'Medium',
    roi: '210%',
    timeframe: '4 months'
  }
];

const executiveActions = [
  {
    action: 'Review Q4 compensation strategy',
    priority: 'Critical',
    dueDate: 'Tomorrow',
    assignee: 'Chief HR Officer',
    status: 'pending'
  },
  {
    action: 'Approve retention bonus budget',
    priority: 'High',
    dueDate: 'This week',
    assignee: 'CFO',
    status: 'in_progress'
  },
  {
    action: 'Sign partnership with Tech University',
    priority: 'Medium',
    dueDate: 'Next week',
    assignee: 'CEO',
    status: 'pending'
  }
];

export const ExecutiveInsightsSidebar: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const refreshInsights = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'Critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
      case 'High':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      default: return 'text-green-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'opportunity': return <TrendingUp className="w-4 h-4 text-green-500" />;
      default: return <Lightbulb className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              {isArabic ? 'الرؤى الذكية' : 'AI Insights'}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshInsights}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {isArabic ? 'آخر تحديث:' : 'Last updated:'} {lastUpdate.toLocaleTimeString()}
          </div>
        </CardHeader>
      </Card>

      {/* Real-time Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-yellow-500" />
            {isArabic ? 'رؤى فورية' : 'Real-time Insights'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          {realTimeInsights.map((insight, index) => (
            <div key={index} className={`p-3 rounded-lg border ${getPriorityColor(insight.priority)}`}>
              <div className="flex items-start gap-2 mb-2">
                {getTypeIcon(insight.type)}
                <div className="flex-1">
                  <div className="font-medium text-sm">{insight.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{insight.content}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <Badge variant="outline" className="text-xs">
                  {insight.confidence}% {isArabic ? 'ثقة' : 'confidence'}
                </Badge>
                <span className="text-gray-500">{insight.timestamp}</span>
              </div>
              <div className="text-xs font-medium text-blue-600 mt-2">
                → {insight.action}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Market Intelligence */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            {isArabic ? 'ذكاء السوق' : 'Market Intelligence'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          {marketIntelligence.map((item, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{item.metric}</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(item.trend)}
                  <span className="font-bold text-sm">{item.value}</span>
                </div>
              </div>
              <div className="text-xs text-gray-600 mb-2">{item.description}</div>
              <Badge variant="outline" className={`text-xs ${getImpactColor(item.impact)}`}>
                {item.impact} impact
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Lightbulb className="w-4 h-4 text-orange-500" />
            {isArabic ? 'توصيات الذكاء الاصطناعي' : 'AI Recommendations'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          {aiRecommendations.map((rec, index) => (
            <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">{rec.category}</Badge>
                <Badge variant="outline" className="text-xs text-green-600">
                  {rec.roi} ROI
                </Badge>
              </div>
              <div className="text-sm font-medium mb-2">{rec.recommendation}</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">{isArabic ? 'التأثير:' : 'Impact:'}</span>
                  <span className={`font-medium ${getImpactColor(rec.impact)}`}> {rec.impact}</span>
                </div>
                <div>
                  <span className="text-gray-600">{isArabic ? 'الجهد:' : 'Effort:'}</span>
                  <span className="font-medium"> {rec.effort}</span>
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                {isArabic ? 'الإطار الزمني:' : 'Timeframe:'} {rec.timeframe}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Executive Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bell className="w-4 h-4 text-red-500" />
            {isArabic ? 'إجراءات تنفيذية' : 'Executive Actions'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          {executiveActions.map((action, index) => (
            <div key={index} className="p-3 bg-white border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-sm font-medium">{action.action}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {isArabic ? 'المسؤول:' : 'Assignee:'} {action.assignee}
                  </div>
                </div>
                <Badge className={getPriorityColor(action.priority)}>
                  {action.priority}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  {isArabic ? 'موعد الاستحقاق:' : 'Due:'} {action.dueDate}
                </span>
                <Badge variant={action.status === 'pending' ? 'secondary' : 'default'}>
                  {action.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Award className="w-4 h-4 text-purple-500" />
            {isArabic ? 'إحصائيات سريعة' : 'Quick Stats'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{isArabic ? 'نماذج نشطة' : 'Active Models'}</span>
              <span className="font-bold text-sm">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{isArabic ? 'تنبؤات اليوم' : 'Today\'s Predictions'}</span>
              <span className="font-bold text-sm">47</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{isArabic ? 'دقة النظام' : 'System Accuracy'}</span>
              <span className="font-bold text-sm text-green-600">94.2%</span>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="text-xs text-gray-600 mb-2">{isArabic ? 'أداء النماذج' : 'Model Performance'}</div>
            <Progress value={94} className="h-2 mb-1" />
            <div className="text-xs text-gray-500">{isArabic ? 'متفوق على المعايير' : 'Exceeding benchmarks'}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};