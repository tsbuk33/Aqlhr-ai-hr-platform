import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  PieChart,
  BarChart3,
  Calculator,
  Target
} from 'lucide-react';

interface BudgetCategory {
  id: string;
  name: string;
  nameAr: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'on_track' | 'warning' | 'over_budget';
  trend: 'up' | 'down' | 'stable';
  lastMonth: number;
}

interface BudgetOverviewProps {
  isArabic: boolean;
  detailed?: boolean;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ 
  isArabic, 
  detailed = false 
}) => {
  const [budgetPeriod, setBudgetPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [budgetData] = useState<BudgetCategory[]>([
    {
      id: 'salaries',
      name: 'Salaries & Benefits',
      nameAr: 'الرواتب والمزايا',
      allocated: 450000,
      spent: 387500,
      remaining: 62500,
      percentage: 86.1,
      status: 'warning',
      trend: 'up',
      lastMonth: 375000
    },
    {
      id: 'training',
      name: 'Training & Development',
      nameAr: 'التدريب والتطوير',
      allocated: 50000,
      spent: 32000,
      remaining: 18000,
      percentage: 64.0,
      status: 'on_track',
      trend: 'up',
      lastMonth: 28000
    },
    {
      id: 'recruitment',
      name: 'Recruitment & Hiring',
      nameAr: 'التوظيف والاستقطاب',
      allocated: 75000,
      spent: 45000,
      remaining: 30000,
      percentage: 60.0,
      status: 'on_track',
      trend: 'down',
      lastMonth: 52000
    },
    {
      id: 'equipment',
      name: 'Equipment & Software',
      nameAr: 'المعدات والبرمجيات',
      allocated: 120000,
      spent: 95000,
      remaining: 25000,
      percentage: 79.2,
      status: 'on_track',
      trend: 'stable',
      lastMonth: 88000
    },
    {
      id: 'events',
      name: 'Events & Activities',
      nameAr: 'الفعاليات والأنشطة',
      allocated: 30000,
      spent: 35000,
      remaining: -5000,
      percentage: 116.7,
      status: 'over_budget',
      trend: 'up',
      lastMonth: 25000
    }
  ]);

  const totalAllocated = budgetData.reduce((sum, item) => sum + item.allocated, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overallPercentage = (totalSpent / totalAllocated) * 100;

  const getStatusColor = (status: BudgetCategory['status']) => {
    switch (status) {
      case 'on_track':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'over_budget':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: BudgetCategory['status']) => {
    switch (status) {
      case 'on_track':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'over_budget':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: BudgetCategory['status']) => {
    if (isArabic) {
      switch (status) {
        case 'on_track':
          return 'في المسار الصحيح';
        case 'warning':
          return 'تحذير';
        case 'over_budget':
          return 'تجاوز الميزانية';
        default:
          return 'غير محدد';
      }
    } else {
      switch (status) {
        case 'on_track':
          return 'On Track';
        case 'warning':
          return 'Warning';
        case 'over_budget':
          return 'Over Budget';
        default:
          return 'Unknown';
      }
    }
  };

  const getTrendIcon = (trend: BudgetCategory['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-green-500" />;
      case 'stable':
        return <div className="h-3 w-3 border-b border-blue-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isArabic ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const getPeriodText = () => {
    if (isArabic) {
      switch (budgetPeriod) {
        case 'monthly':
          return 'شهرياً';
        case 'quarterly':
          return 'ربع سنوي';
        case 'yearly':
          return 'سنوياً';
      }
    } else {
      switch (budgetPeriod) {
        case 'monthly':
          return 'Monthly';
        case 'quarterly':
          return 'Quarterly';
        case 'yearly':
          return 'Yearly';
      }
    }
  };

  if (!detailed) {
    // Compact version for dashboard
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium">
            {isArabic ? 'نظرة عامة على الميزانية' : 'Budget Overview'}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>{isArabic ? 'المصروف' : 'Spent'}</span>
            <span className="font-medium">{overallPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={overallPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(totalSpent)}</span>
            <span>{formatCurrency(totalAllocated)}</span>
          </div>
        </div>

        <div className={`text-xs flex items-center gap-1 ${
          totalRemaining < 0 ? 'text-red-500' : totalRemaining < totalAllocated * 0.2 ? 'text-yellow-500' : 'text-green-500'
        }`}>
          {totalRemaining < 0 ? (
            <AlertTriangle className="h-3 w-3" />
          ) : (
            <CheckCircle className="h-3 w-3" />
          )}
          <span>
            {totalRemaining < 0 
              ? (isArabic ? 'تجاوز بمبلغ' : 'Over by')
              : (isArabic ? 'متبقي' : 'Remaining')
            } {formatCurrency(totalRemaining)}
          </span>
        </div>
      </div>
    );
  }

  // Detailed version
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {isArabic ? 'نظرة شاملة على الميزانية' : 'Comprehensive Budget Overview'}
          </div>
          <Badge variant="secondary">{getPeriodText()}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Budget Summary */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'المخصص' : 'Allocated'}
              </p>
              <p className="text-lg font-bold text-blue-500">
                {formatCurrency(totalAllocated)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'المصروف' : 'Spent'}
              </p>
              <p className="text-lg font-bold text-green-500">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'المتبقي' : 'Remaining'}
              </p>
              <p className={`text-lg font-bold ${totalRemaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                {formatCurrency(totalRemaining)}
              </p>
            </div>
          </div>
          
          <div className="mt-3">
            <Progress value={overallPercentage} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span className="font-medium">{overallPercentage.toFixed(1)}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            {isArabic ? 'فئات الميزانية' : 'Budget Categories'}
          </h4>
          
          {budgetData.map((category) => (
            <div key={category.id} className="p-3 border rounded-lg">
              <div className="space-y-3">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(category.status)}
                    <span className="font-medium text-sm">
                      {isArabic ? category.nameAr : category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      category.status === 'on_track' ? 'default' :
                      category.status === 'warning' ? 'secondary' : 'destructive'
                    }>
                      {getStatusText(category.status)}
                    </Badge>
                    {getTrendIcon(category.trend)}
                  </div>
                </div>

                {/* Progress and Values */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {formatCurrency(category.spent)} / {formatCurrency(category.allocated)}
                    </span>
                    <span className={getStatusColor(category.status)}>
                      {category.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(category.percentage, 100)} 
                    className="h-2"
                  />
                </div>

                {/* Additional Info */}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {isArabic ? 'المتبقي: ' : 'Remaining: '}
                    <span className={category.remaining < 0 ? 'text-red-500' : 'text-green-500'}>
                      {formatCurrency(category.remaining)}
                    </span>
                  </span>
                  <span>
                    {isArabic ? 'الشهر الماضي: ' : 'Last Month: '}
                    {formatCurrency(category.lastMonth)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Budget Alerts */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {isArabic ? 'تنبيهات الميزانية' : 'Budget Alerts'}
          </h4>
          
          {budgetData
            .filter(cat => cat.status === 'warning' || cat.status === 'over_budget')
            .map((category) => (
              <div 
                key={category.id} 
                className={`p-3 rounded-lg border-l-4 ${
                  category.status === 'over_budget' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(category.status)}
                  <span className="font-medium text-sm">
                    {isArabic ? category.nameAr : category.name}
                  </span>
                </div>
                <p className="text-xs mt-1">
                  {category.status === 'over_budget' 
                    ? (isArabic 
                        ? `تجاوز الميزانية بنسبة ${(category.percentage - 100).toFixed(1)}%`
                        : `Over budget by ${(category.percentage - 100).toFixed(1)}%`
                      )
                    : (isArabic 
                        ? `اقتراب من حد الميزانية - ${category.percentage.toFixed(1)}% مستخدم`
                        : `Approaching budget limit - ${category.percentage.toFixed(1)}% used`
                      )
                  }
                </p>
              </div>
            ))
          }
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline">
            <Calculator className="h-3 w-3 mr-1" />
            {isArabic ? 'تحليل مفصل' : 'Detailed Analysis'}
          </Button>
          <Button size="sm" variant="outline">
            <Target className="h-3 w-3 mr-1" />
            {isArabic ? 'تعديل الميزانية' : 'Adjust Budget'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};