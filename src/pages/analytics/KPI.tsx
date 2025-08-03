import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, Users, DollarSign, 
  Clock, Target, Award, AlertCircle, CheckCircle,
  BarChart3, Activity, Zap
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const KPIPage = () => {
  const { isArabic } = useSimpleLanguage();

  useEffect(() => {
    document.title = isArabic ? 'مؤشرات الأداء الرئيسية - سند' : 'Key Performance Indicators - SanadHR';
  }, [isArabic]);

  const kpis = [
    {
      id: 1,
      title: isArabic ? 'معدل دوران الموظفين' : 'Employee Turnover Rate',
      value: '12.5%',
      target: '15%',
      trend: -2.3,
      status: 'good',
      icon: Users,
      description: isArabic ? 'أقل من المستهدف بـ 2.5%' : '2.5% below target'
    },
    {
      id: 2,
      title: isArabic ? 'متوسط وقت التوظيف' : 'Average Time to Hire',
      value: '18',
      unit: isArabic ? 'يوم' : 'days',
      target: '21',
      trend: -3,
      status: 'excellent',
      icon: Clock,
      description: isArabic ? 'تحسن بـ 3 أيام هذا الشهر' : '3 days improvement this month'
    },
    {
      id: 3,
      title: isArabic ? 'رضا الموظفين' : 'Employee Satisfaction',
      value: '87%',
      target: '85%',
      trend: 5,
      status: 'excellent',
      icon: Award,
      description: isArabic ? 'أعلى من المستهدف بـ 2%' : '2% above target'
    },
    {
      id: 4,
      title: isArabic ? 'معدل الغياب' : 'Absenteeism Rate',
      value: '3.2%',
      target: '4%',
      trend: -0.8,
      status: 'good',
      icon: Activity,
      description: isArabic ? 'انخفاض مستمر' : 'Consistent decrease'
    },
    {
      id: 5,
      title: isArabic ? 'تكلفة الموظف الواحد' : 'Cost per Employee',
      value: '45,230',
      unit: isArabic ? 'ريال' : 'SAR',
      target: '48,000',
      trend: -2770,
      status: 'excellent',
      icon: DollarSign,
      description: isArabic ? 'توفير 5.8% عن المخطط' : '5.8% savings vs plan'
    },
    {
      id: 6,
      title: isArabic ? 'نسبة السعودة' : 'Saudization Rate',
      value: '73%',
      target: '70%',
      trend: 3,
      status: 'excellent',
      icon: Target,
      description: isArabic ? 'متجاوز المستهدف' : 'Exceeding target'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
      case 'poor':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isArabic ? '📊 مؤشرات الأداء الرئيسية' : '📊 Key Performance Indicators'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isArabic ? 'تتبع وتحليل مؤشرات الأداء الحيوية للموارد البشرية' : 'Track and analyze critical HR performance metrics'}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {isArabic ? 'تحديث فوري' : 'Real-time'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => {
          const IconComponent = kpi.icon;
          const progress = parseFloat(kpi.value.replace('%', '').replace(',', ''));
          const targetProgress = parseFloat(kpi.target.replace('%', '').replace(',', ''));
          const progressPercentage = Math.min((progress / targetProgress) * 100, 100);

          return (
            <Card key={kpi.id} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(kpi.status)} variant="secondary">
                    {getStatusIcon(kpi.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{kpi.value}</span>
                  {kpi.unit && <span className="text-sm text-muted-foreground">{kpi.unit}</span>}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {isArabic ? 'المستهدف:' : 'Target:'} {kpi.target}{kpi.unit || ''}
                    </span>
                    <div className="flex items-center gap-1">
                      {kpi.trend > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`text-xs ${kpi.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(kpi.trend)}%
                      </span>
                    </div>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <CardDescription className="text-xs">
                  {kpi.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional KPI Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {isArabic ? 'اتجاهات الأداء' : 'Performance Trends'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span>{isArabic ? 'الأداء العام' : 'Overall Performance'}</span>
                <Badge variant="outline" className="text-green-600">
                  {isArabic ? '⬆️ ممتاز' : '⬆️ Excellent'}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span>{isArabic ? 'كفاءة العمليات' : 'Operational Efficiency'}</span>
                <Badge variant="outline" className="text-blue-600">
                  {isArabic ? '📈 جيد' : '📈 Good'}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span>{isArabic ? 'رضا الموظفين' : 'Employee Satisfaction'}</span>
                <Badge variant="outline" className="text-green-600">
                  {isArabic ? '🎯 فوق المستهدف' : '🎯 Above Target'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {isArabic ? 'الأهداف الشهرية' : 'Monthly Targets'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kpis.slice(0, 3).map((kpi) => (
                <div key={`target-${kpi.id}`} className="flex justify-between items-center">
                  <span className="text-sm">{kpi.title}</span>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={Math.min((parseFloat(kpi.value.replace('%', '').replace(',', '')) / parseFloat(kpi.target.replace('%', '').replace(',', ''))) * 100, 100)} 
                      className="w-20 h-2" 
                    />
                    <span className="text-xs text-muted-foreground">
                      {Math.round((parseFloat(kpi.value.replace('%', '').replace(',', '')) / parseFloat(kpi.target.replace('%', '').replace(',', ''))) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KPIPage;