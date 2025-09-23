import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users,
  Calculator,
  Target,
  Award,
  AlertTriangle,
  BarChart3,
  PieChart,
  Zap
} from 'lucide-react';

interface CompensationBand {
  level: string;
  levelAr: string;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  employeeCount: number;
  marketPercentile: number;
}

interface CompensationAnalysisProps {
  companyId?: string;
}

export const CompensationAnalysis: React.FC<CompensationAnalysisProps> = ({ companyId }) => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedView, setSelectedView] = useState('overview');

  const compensationBands: CompensationBand[] = [
    {
      level: 'Executive',
      levelAr: 'تنفيذي',
      minSalary: 25000,
      maxSalary: 50000,
      avgSalary: 37500,
      employeeCount: 8,
      marketPercentile: 75
    },
    {
      level: 'Senior Manager',
      levelAr: 'مدير أول',
      minSalary: 18000,
      maxSalary: 28000,
      avgSalary: 23000,
      employeeCount: 15,
      marketPercentile: 68
    },
    {
      level: 'Manager',
      levelAr: 'مدير',
      minSalary: 12000,
      maxSalary: 20000,
      avgSalary: 16000,
      employeeCount: 32,
      marketPercentile: 62
    },
    {
      level: 'Specialist',
      levelAr: 'أخصائي',
      minSalary: 8000,
      maxSalary: 15000,
      avgSalary: 11500,
      employeeCount: 85,
      marketPercentile: 55
    },
    {
      level: 'Junior',
      levelAr: 'مبتدئ',
      minSalary: 4500,
      maxSalary: 8000,
      avgSalary: 6250,
      employeeCount: 45,
      marketPercentile: 52
    }
  ];

  const metrics = [
    {
      label: isArabic ? 'إجمالي التكلفة الشهرية' : 'Total Monthly Cost',
      value: '2,847,500',
      unit: isArabic ? 'ريال' : 'SAR',
      trend: 'up',
      change: '+3.2%'
    },
    {
      label: isArabic ? 'متوسط الراتب' : 'Average Salary',
      value: '15,390',
      unit: isArabic ? 'ريال' : 'SAR',
      trend: 'up',
      change: '+1.8%'
    },
    {
      label: isArabic ? 'نسبة المكافآت' : 'Bonus Ratio',
      value: '12.5',
      unit: '%',
      trend: 'stable',
      change: '0%'
    },
    {
      label: isArabic ? 'فجوة الأجور' : 'Pay Gap',
      value: '2.3',
      unit: '%',
      trend: 'down',
      change: '-0.5%'
    }
  ];

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat(isArabic ? 'ar-SA' : 'en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMarketPositionColor = (percentile: number) => {
    if (percentile >= 75) return 'text-green-600 bg-green-50';
    if (percentile >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getMarketPositionText = (percentile: number) => {
    if (percentile >= 75) return isArabic ? 'متميز' : 'Excellent';
    if (percentile >= 50) return isArabic ? 'جيد' : 'Good';
    return isArabic ? 'ضعيف' : 'Below Market';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            {isArabic ? 'تحليل التعويضات' : 'Compensation Analysis'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                    {metric.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                    {metric.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                    {metric.trend === 'stable' && <BarChart3 className="h-3 w-3 text-blue-500" />}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold">{metric.value}</span>
                    <span className="text-xs text-muted-foreground">{metric.unit}</span>
                  </div>
                  <div className={`text-xs ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {metric.change}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Department Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'it', 'hr', 'finance', 'sales', 'operations'].map((dept) => (
              <Button
                key={dept}
                variant={selectedDepartment === dept ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDepartment(dept)}
                className="text-xs whitespace-nowrap"
              >
                {isArabic ? 
                  (dept === 'all' ? 'الكل' : 
                   dept === 'it' ? 'تقنية' :
                   dept === 'hr' ? 'موارد بشرية' :
                   dept === 'finance' ? 'مالية' :
                   dept === 'sales' ? 'مبيعات' : 'عمليات') :
                  dept.charAt(0).toUpperCase() + dept.slice(1)
                }
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compensation Bands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isArabic ? 'نطاقات التعويض' : 'Compensation Bands'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {compensationBands.map((band, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {isArabic ? band.levelAr : band.level}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {band.employeeCount} {isArabic ? 'موظف' : 'employees'}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className={getMarketPositionColor(band.marketPercentile)}
                >
                  {getMarketPositionText(band.marketPercentile)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{isArabic ? 'النطاق:' : 'Range:'}</span>
                  <span className="font-medium">
                    {formatSalary(band.minSalary)} - {formatSalary(band.maxSalary)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{isArabic ? 'المتوسط:' : 'Average:'}</span>
                  <span className="font-medium text-primary">
                    {formatSalary(band.avgSalary)}
                  </span>
                </div>
                
                <Progress 
                  value={(band.avgSalary - band.minSalary) / (band.maxSalary - band.minSalary) * 100} 
                  className="h-2"
                />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{isArabic ? 'موقع السوق:' : 'Market Position:'}</span>
                  <span>{band.marketPercentile}{isArabic ? 'المئوي' : 'th percentile'}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Analysis Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5" />
            {isArabic ? 'رؤى التحليل' : 'Analysis Insights'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    {isArabic ? 'أداء تنافسي جيد' : 'Competitive Performance'}
                  </p>
                  <p className="text-xs text-green-700">
                    {isArabic ? 
                      'متوسط الرواتب أعلى بنسبة 8% من السوق في المستويات التنفيذية' :
                      'Average salaries are 8% above market for executive levels'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {isArabic ? 'فجوة في المستويات المتوسطة' : 'Mid-Level Gap'}
                  </p>
                  <p className="text-xs text-yellow-700">
                    {isArabic ? 
                      'رواتب المديرين المتوسطين أقل من السوق بنسبة 5%' :
                      'Middle management salaries are 5% below market average'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    {isArabic ? 'توصية للتحسين' : 'Improvement Recommendation'}
                  </p>
                  <p className="text-xs text-blue-700">
                    {isArabic ? 
                      'زيادة ميزانية التعويضات بنسبة 3% لتحسين الاستبقاء' :
                      'Increase compensation budget by 3% to improve retention'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pay Equity Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isArabic ? 'تحليل المساواة في الأجور' : 'Pay Equity Analysis'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">2.3%</div>
              <div className="text-sm text-muted-foreground">
                {isArabic ? 'فجوة الأجور بين الجنسين' : 'Gender Pay Gap'}
              </div>
              <Badge variant="secondary" className="mt-1 text-green-600">
                {isArabic ? 'ضمن المعدل الطبيعي' : 'Within Normal Range'}
              </Badge>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">94%</div>
              <div className="text-sm text-muted-foreground">
                {isArabic ? 'نسبة المساواة' : 'Equity Ratio'}
              </div>
              <Badge variant="secondary" className="mt-1 text-blue-600">
                {isArabic ? 'ممتاز' : 'Excellent'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};