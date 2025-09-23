import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { 
  TrendingDown, 
  TrendingUp,
  AlertTriangle,
  Users,
  Target,
  Brain,
  Calendar,
  Zap,
  UserMinus,
  Shield,
  Activity
} from 'lucide-react';

interface RiskEmployee {
  id: string;
  name: string;
  nameAr: string;
  department: string;
  departmentAr: string;
  riskScore: number;
  riskLevel: 'high' | 'medium' | 'low';
  factors: string[];
  factorsAr: string[];
  tenure: number;
}

interface TurnoverPredictionDashboardProps {
  companyId?: string;
}

export const TurnoverPredictionDashboard: React.FC<TurnoverPredictionDashboardProps> = ({ companyId }) => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string | null>(null);

  const riskEmployees: RiskEmployee[] = [
    {
      id: '1',
      name: 'Ahmed Mohamed',
      nameAr: 'أحمد محمد',
      department: 'IT',
      departmentAr: 'تقنية المعلومات',
      riskScore: 85,
      riskLevel: 'high',
      factors: ['Low performance', 'Missed promotions', 'Salary below market'],
      factorsAr: ['أداء ضعيف', 'فقدان ترقيات', 'راتب أقل من السوق'],
      tenure: 18
    },
    {
      id: '2',
      name: 'Sara Ali',
      nameAr: 'سارة علي',
      department: 'Marketing',
      departmentAr: 'التسويق',
      riskScore: 72,
      riskLevel: 'high',
      factors: ['Work overload', 'Limited growth opportunities'],
      factorsAr: ['عبء عمل زائد', 'فرص نمو محدودة'],
      tenure: 24
    },
    {
      id: '3',
      name: 'Omar Hassan',
      nameAr: 'عمر حسن',
      department: 'Finance',
      departmentAr: 'المالية',
      riskScore: 58,
      riskLevel: 'medium',
      factors: ['Remote work issues', 'Team conflicts'],
      factorsAr: ['مشاكل العمل عن بُعد', 'صراعات الفريق'],
      tenure: 12
    }
  ];

  const predictiveMetrics = [
    {
      label: isArabic ? 'معدل التنبؤ بالدوران' : 'Predicted Turnover Rate',
      value: '12.3',
      unit: '%',
      trend: 'down',
      change: '-2.1%',
      description: isArabic ? 'الأشهر الـ6 القادمة' : 'Next 6 months'
    },
    {
      label: isArabic ? 'الموظفون عالي الخطر' : 'High Risk Employees',
      value: '8',
      unit: isArabic ? 'موظف' : 'employees',
      trend: 'up',
      change: '+3',
      description: isArabic ? 'يحتاجون تدخل فوري' : 'Require immediate action'
    },
    {
      label: isArabic ? 'دقة النموذج' : 'Model Accuracy',
      value: '89.5',
      unit: '%',
      trend: 'up',
      change: '+1.2%',
      description: isArabic ? 'آخر تحديث' : 'Last updated'
    },
    {
      label: isArabic ? 'تكلفة الاستبدال' : 'Replacement Cost',
      value: '145,000',
      unit: isArabic ? 'ريال' : 'SAR',
      trend: 'down',
      change: '-8%',
      description: isArabic ? 'متوسط لكل موظف' : 'Average per employee'
    }
  ];

  const riskFactors = [
    {
      factor: 'Performance Issues',
      factorAr: 'مشاكل الأداء',
      impact: 35,
      employees: 12,
      severity: 'high'
    },
    {
      factor: 'Compensation Gap',
      factorAr: 'فجوة التعويضات',
      impact: 28,
      employees: 8,
      severity: 'medium'
    },
    {
      factor: 'Career Stagnation',
      factorAr: 'ركود الوظيفة',
      impact: 22,
      employees: 15,
      severity: 'medium'
    },
    {
      factor: 'Work-Life Balance',
      factorAr: 'التوازن بين العمل والحياة',
      impact: 15,
      employees: 6,
      severity: 'low'
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskText = (level: string) => {
    if (isArabic) {
      switch (level) {
        case 'high': return 'عالي';
        case 'medium': return 'متوسط';
        case 'low': return 'منخفض';
        default: return 'غير معروف';
      }
    } else {
      switch (level) {
        case 'high': return 'High Risk';
        case 'medium': return 'Medium Risk';
        case 'low': return 'Low Risk';
        default: return 'Unknown';
      }
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            {isArabic ? 'لوحة تنبؤ دوران الموظفين' : 'Turnover Prediction Dashboard'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {['month', 'quarter', 'half-year', 'year'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="text-xs whitespace-nowrap"
              >
                {isArabic ? 
                  (period === 'month' ? 'شهر' : 
                   period === 'quarter' ? 'ربع' : 
                   period === 'half-year' ? '6 شهور' : 'سنة') :
                  period.charAt(0).toUpperCase() + period.slice(1).replace('-', ' ')
                }
              </Button>
            ))}
          </div>

          {/* Key Predictions */}
          <div className="grid grid-cols-2 gap-3">
            {predictiveMetrics.map((metric, index) => (
              <Card key={index} className="p-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                    {metric.trend === 'up' ? 
                      <TrendingUp className="h-3 w-3 text-red-500" /> :
                      <TrendingDown className="h-3 w-3 text-green-500" />
                    }
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold">{metric.value}</span>
                    <span className="text-xs text-muted-foreground">{metric.unit}</span>
                  </div>
                  <div className={`text-xs ${
                    metric.trend === 'up' && metric.label.includes('Risk') ? 'text-red-600' :
                    metric.trend === 'down' && metric.label.includes('Turnover') ? 'text-green-600' :
                    metric.trend === 'up' ? 'text-green-600' : 'text-green-600'
                  }`}>
                    {metric.change}
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Employees */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {isArabic ? 'الموظفون عالي الخطر' : 'High Risk Employees'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {riskEmployees.map((employee) => (
            <div key={employee.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <UserMinus className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {isArabic ? employee.nameAr : employee.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isArabic ? employee.departmentAr : employee.department} • {employee.tenure} {isArabic ? 'شهر' : 'months'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getRiskColor(employee.riskLevel)}>
                    {getRiskText(employee.riskLevel)}
                  </Badge>
                  <p className="text-lg font-bold text-red-600 mt-1">{employee.riskScore}%</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{isArabic ? 'مخاطر الترك:' : 'Risk Score:'}</span>
                  <span className="font-medium">{employee.riskScore}%</span>
                </div>
                
                <Progress value={employee.riskScore} className="h-2" />
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {isArabic ? 'عوامل الخطر:' : 'Risk Factors:'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(isArabic ? employee.factorsAr : employee.factors).map((factor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {isArabic ? 'جدولة لقاء' : 'Schedule Meeting'}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <Target className="h-3 w-3 mr-1" />
                    {isArabic ? 'خطة الاستبقاء' : 'Retention Plan'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Risk Factors Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5" />
            {isArabic ? 'تحليل عوامل الخطر' : 'Risk Factors Analysis'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {riskFactors.map((factor, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">
                    {isArabic ? factor.factorAr : factor.factor}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {factor.employees} {isArabic ? 'موظف متأثر' : 'employees affected'}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${getSeverityColor(factor.severity)}`}>
                    {factor.impact}%
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? 'تأثير' : 'impact'}
                  </p>
                </div>
              </div>
              
              <Progress value={factor.impact} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Predictive Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5" />
            {isArabic ? 'رؤى تنبؤية' : 'Predictive Insights'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {isArabic ? 'تحذير عاجل' : 'Urgent Warning'}
                  </p>
                  <p className="text-xs text-red-700">
                    {isArabic ? 
                      '3 موظفين من قسم التقنية معرضون لخطر الاستقالة خلال 30 يوم' :
                      '3 IT employees at risk of leaving within 30 days'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {isArabic ? 'اتجاه متزايد' : 'Rising Trend'}
                  </p>
                  <p className="text-xs text-yellow-700">
                    {isArabic ? 
                      'زيادة في مخاطر الدوران بقسم التسويق بنسبة 15%' :
                      'Marketing department turnover risk increased by 15%'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    {isArabic ? 'توصية وقائية' : 'Preventive Action'}
                  </p>
                  <p className="text-xs text-blue-700">
                    {isArabic ? 
                      'تنفيذ برنامج مراجعة الرواتب لتقليل مخاطر الدوران بنسبة 25%' :
                      'Implement salary review program to reduce turnover risk by 25%'
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