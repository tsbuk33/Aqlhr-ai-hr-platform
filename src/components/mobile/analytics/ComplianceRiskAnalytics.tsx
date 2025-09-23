import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Building,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Zap
} from 'lucide-react';

interface ComplianceArea {
  id: string;
  name: string;
  nameAr: string;
  category: 'labor' | 'tax' | 'safety' | 'data' | 'govt';
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  complianceScore: number;
  lastReview: string;
  nextDeadline: string;
  violations: number;
  requirements: number;
}

interface ComplianceRiskAnalyticsProps {
  companyId?: string;
}

export const ComplianceRiskAnalytics: React.FC<ComplianceRiskAnalyticsProps> = ({ companyId }) => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');

  const complianceAreas: ComplianceArea[] = [
    {
      id: '1',
      name: 'Labor Law Compliance',
      nameAr: 'امتثال قانون العمل',
      category: 'labor',
      riskLevel: 'high',
      complianceScore: 72,
      lastReview: '2025-09-15',
      nextDeadline: '2025-10-15',
      violations: 3,
      requirements: 45
    },
    {
      id: '2',
      name: 'GOSI Registration',
      nameAr: 'تسجيل التأمينات الاجتماعية',
      category: 'govt',
      riskLevel: 'critical',
      complianceScore: 45,
      lastReview: '2025-09-10',
      nextDeadline: '2025-09-30',
      violations: 8,
      requirements: 32
    },
    {
      id: '3',
      name: 'Data Protection (PDPL)',
      nameAr: 'حماية البيانات الشخصية',
      category: 'data',
      riskLevel: 'medium',
      complianceScore: 85,
      lastReview: '2025-09-20',
      nextDeadline: '2025-11-20',
      violations: 1,
      requirements: 28
    },
    {
      id: '4',
      name: 'Workplace Safety',
      nameAr: 'السلامة المهنية',
      category: 'safety',
      riskLevel: 'low',
      complianceScore: 92,
      lastReview: '2025-09-18',
      nextDeadline: '2025-12-18',
      violations: 0,
      requirements: 38
    },
    {
      id: '5',
      name: 'Tax Compliance',
      nameAr: 'الامتثال الضريبي',
      category: 'tax',
      riskLevel: 'medium',
      complianceScore: 78,
      lastReview: '2025-09-12',
      nextDeadline: '2025-10-30',
      violations: 2,
      requirements: 22
    }
  ];

  const overallMetrics = [
    {
      label: isArabic ? 'درجة الامتثال العامة' : 'Overall Compliance Score',
      value: '74',
      unit: '%',
      trend: 'up',
      change: '+3%',
      description: isArabic ? 'تحسن هذا الشهر' : 'Improved this month'
    },
    {
      label: isArabic ? 'المخالفات النشطة' : 'Active Violations',
      value: '14',
      unit: isArabic ? 'مخالفة' : 'violations',
      trend: 'down',
      change: '-6',
      description: isArabic ? 'انخفاض من الشهر الماضي' : 'Reduced from last month'
    },
    {
      label: isArabic ? 'المواعيد المقبلة' : 'Upcoming Deadlines',
      value: '8',
      unit: isArabic ? 'موعد' : 'deadlines',
      trend: 'up',
      change: '+2',
      description: isArabic ? 'خلال 30 يوم' : 'Within 30 days'
    },
    {
      label: isArabic ? 'تقدير المخاطر' : 'Risk Assessment',
      value: 'Medium',
      valueAr: 'متوسط',
      unit: '',
      trend: 'down',
      change: isArabic ? 'تحسن' : 'Improved',
      description: isArabic ? 'انخفض من عالي' : 'Down from High'
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-600 text-white';
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
        case 'critical': return 'حرج';
        case 'high': return 'عالي';
        case 'medium': return 'متوسط';
        case 'low': return 'منخفض';
        default: return 'غير معروف';
      }
    } else {
      switch (level) {
        case 'critical': return 'Critical';
        case 'high': return 'High';
        case 'medium': return 'Medium';
        case 'low': return 'Low';
        default: return 'Unknown';
      }
    }
  };

  const getCategoryText = (category: string) => {
    if (isArabic) {
      switch (category) {
        case 'labor': return 'قانون العمل';
        case 'tax': return 'ضرائب';
        case 'safety': return 'سلامة';
        case 'data': return 'حماية البيانات';
        case 'govt': return 'حكومي';
        default: return 'عام';
      }
    } else {
      switch (category) {
        case 'labor': return 'Labor Law';
        case 'tax': return 'Tax';
        case 'safety': return 'Safety';
        case 'data': return 'Data Protection';
        case 'govt': return 'Government';
        default: return 'General';
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'labor': return <Users className="h-4 w-4" />;
      case 'tax': return <FileText className="h-4 w-4" />;
      case 'safety': return <Shield className="h-4 w-4" />;
      case 'data': return <Eye className="h-4 w-4" />;
      case 'govt': return <Building className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredAreas = complianceAreas.filter(area => {
    const categoryMatch = selectedCategory === 'all' || area.category === selectedCategory;
    const riskMatch = selectedRiskLevel === 'all' || area.riskLevel === selectedRiskLevel;
    return categoryMatch && riskMatch;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {isArabic ? 'تحليل مخاطر الامتثال' : 'Compliance Risk Analytics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {overallMetrics.map((metric, index) => (
              <Card key={index} className="p-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                    {metric.trend === 'up' ? 
                      <TrendingUp className={`h-3 w-3 ${metric.label.includes('Violation') || metric.label.includes('Deadline') ? 'text-red-500' : 'text-green-500'}`} /> :
                      <TrendingDown className={`h-3 w-3 ${metric.label.includes('Violation') ? 'text-green-500' : 'text-red-500'}`} />
                    }
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold">
                      {metric.valueAr && isArabic ? metric.valueAr : metric.value}
                    </span>
                    <span className="text-xs text-muted-foreground">{metric.unit}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.change} • {metric.description}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <div className="space-y-2">
            <div className="flex gap-2 overflow-x-auto">
              {['all', 'labor', 'tax', 'safety', 'data', 'govt'].map((category) => (
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
            
            <div className="flex gap-2 overflow-x-auto">
              {['all', 'critical', 'high', 'medium', 'low'].map((risk) => (
                <Button
                  key={risk}
                  variant={selectedRiskLevel === risk ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRiskLevel(risk)}
                  className="text-xs whitespace-nowrap"
                >
                  {risk === 'all' ? 
                    (isArabic ? 'جميع المستويات' : 'All Levels') : 
                    getRiskText(risk)
                  }
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isArabic ? 'مجالات الامتثال' : 'Compliance Areas'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredAreas.map((area) => (
            <div key={area.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                    {getCategoryIcon(area.category)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {isArabic ? area.nameAr : area.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getCategoryText(area.category)} • {area.requirements} {isArabic ? 'متطلب' : 'requirements'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getRiskColor(area.riskLevel)}>
                    {getRiskText(area.riskLevel)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{isArabic ? 'درجة الامتثال:' : 'Compliance Score:'}</span>
                  <span className={`text-lg font-bold ${getScoreColor(area.complianceScore)}`}>
                    {area.complianceScore}%
                  </span>
                </div>
                
                <Progress value={area.complianceScore} className="h-2" />

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">
                      {isArabic ? 'المخالفات النشطة:' : 'Active Violations:'}
                    </span>
                    <p className={`font-medium ${area.violations > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {area.violations}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      {isArabic ? 'الموعد النهائي التالي:' : 'Next Deadline:'}
                    </span>
                    <p className="font-medium">
                      {new Date(area.nextDeadline).toLocaleDateString(isArabic ? 'ar-SA' : 'en-SA')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    {isArabic ? 'عرض التفاصيل' : 'View Details'}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    {isArabic ? 'تحميل التقرير' : 'Download Report'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-orange-500" />
            {isArabic ? 'المواعيد النهائية القادمة' : 'Upcoming Deadlines'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {complianceAreas
              .filter(area => new Date(area.nextDeadline) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
              .sort((a, b) => new Date(a.nextDeadline).getTime() - new Date(b.nextDeadline).getTime())
              .map((area) => {
                const daysLeft = Math.ceil((new Date(area.nextDeadline).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
                return (
                  <div key={area.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${daysLeft <= 7 ? 'bg-red-500' : daysLeft <= 14 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {isArabic ? area.nameAr : area.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(area.nextDeadline).toLocaleDateString(isArabic ? 'ar-SA' : 'en-SA')}
                      </p>
                    </div>
                    <Badge variant={daysLeft <= 7 ? 'destructive' : daysLeft <= 14 ? 'secondary' : 'outline'}>
                      {daysLeft} {isArabic ? 'يوم' : 'days'}
                    </Badge>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Risk Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5" />
            {isArabic ? 'تحليل المخاطر' : 'Risk Insights'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {isArabic ? 'خطر حرج' : 'Critical Risk'}
                  </p>
                  <p className="text-xs text-red-700">
                    {isArabic ? 
                      'تسجيل التأمينات الاجتماعية غير مكتمل - قد يؤدي لغرامات' :
                      'GOSI registration incomplete - may result in penalties'
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
                    {isArabic ? 'تحذير مبكر' : 'Early Warning'}
                  </p>
                  <p className="text-xs text-yellow-700">
                    {isArabic ? 
                      '3 مواعيد نهائية لقانون العمل خلال الأسبوعين القادمين' :
                      '3 labor law deadlines within next 2 weeks'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    {isArabic ? 'أداء جيد' : 'Good Performance'}
                  </p>
                  <p className="text-xs text-green-700">
                    {isArabic ? 
                      'السلامة المهنية تحقق 92% امتثال - لا مخالفات' :
                      'Workplace safety achieving 92% compliance - no violations'
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