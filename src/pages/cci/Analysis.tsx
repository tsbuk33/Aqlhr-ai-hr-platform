import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Globe, 
  Layers,
  Brain,
  RefreshCw,
  Download
} from 'lucide-react';

const Analysis: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const cvfData = [
    { dimension: isArabic ? 'العشيرة' : 'Clan', current: 35, desired: 30, color: 'blue' },
    { dimension: isArabic ? 'الإبداع' : 'Adhocracy', current: 20, desired: 25, color: 'green' },
    { dimension: isArabic ? 'السوق' : 'Market', current: 30, desired: 25, color: 'orange' },
    { dimension: isArabic ? 'التسلسل الهرمي' : 'Hierarchy', current: 40, desired: 20, color: 'purple' }
  ];

  const culturalWebElements = [
    { element: isArabic ? 'القصص' : 'Stories', score: 72, risk: 'low' },
    { element: isArabic ? 'الرموز' : 'Symbols', score: 68, risk: 'medium' },
    { element: isArabic ? 'هياكل السلطة' : 'Power Structures', score: 45, risk: 'high' },
    { element: isArabic ? 'الهياكل التنظيمية' : 'Organisational Structures', score: 58, risk: 'medium' },
    { element: isArabic ? 'أنظمة التحكم' : 'Control Systems', score: 62, risk: 'medium' },
    { element: isArabic ? 'الطقوس والروتين' : 'Rituals & Routines', score: 71, risk: 'low' }
  ];

  const barrettValues = [
    { level: isArabic ? 'البقاء' : 'Survival', current: 25, optimal: 15, status: 'high' },
    { level: isArabic ? 'العلاقات' : 'Relationship', current: 30, optimal: 25, status: 'good' },
    { level: isArabic ? 'الاحترام الذاتي' : 'Self-esteem', current: 20, optimal: 25, status: 'low' },
    { level: isArabic ? 'التحول' : 'Transformation', current: 15, optimal: 20, status: 'low' },
    { level: isArabic ? 'التماسك الداخلي' : 'Internal Cohesion', current: 8, optimal: 10, status: 'low' },
    { level: isArabic ? 'إحداث فرق' : 'Making a Difference', current: 2, optimal: 5, status: 'critical' }
  ];

  const hofstedeData = [
    { dimension: isArabic ? 'مسافة السلطة' : 'Power Distance', score: 80, benchmark: 68 },
    { dimension: isArabic ? 'الفردية' : 'Individualism', score: 25, benchmark: 38 },
    { dimension: isArabic ? 'الذكورة' : 'Masculinity', score: 60, benchmark: 53 },
    { dimension: isArabic ? 'تجنب عدم اليقين' : 'Uncertainty Avoidance', score: 85, benchmark: 68 },
    { dimension: isArabic ? 'التوجه طويل المدى' : 'Long-term Orientation', score: 36, benchmark: 45 }
  ];

  return (
    <div className={`min-h-screen bg-background p-6 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isArabic ? 'التشخيصات الثقافية' : 'Cultural Diagnostics'}
            </h1>
            <p className="text-muted-foreground">
              {isArabic ? 'عقل للموارد البشرية - تحليل متعدد الأطر' : 'AqlHR — Multi-Framework Analysis'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <RefreshCw className="mr-2 h-4 w-4" />
              {isArabic ? 'تحديث التحليل' : 'Refresh Analysis'}
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {isArabic ? 'تصدير التقرير' : 'Export Report'}
            </Button>
          </div>
        </div>

        {/* Analysis Frameworks Tabs */}
        <Tabs defaultValue="cvf" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="cvf">CVF</TabsTrigger>
            <TabsTrigger value="cultural-web">{isArabic ? 'الشبكة الثقافية' : 'Cultural Web'}</TabsTrigger>
            <TabsTrigger value="barrett">{isArabic ? 'باريت' : 'Barrett'}</TabsTrigger>
            <TabsTrigger value="schein">{isArabic ? 'شاين' : 'Schein'}</TabsTrigger>
            <TabsTrigger value="hofstede">{isArabic ? 'هوفستيد' : 'Hofstede'}</TabsTrigger>
          </TabsList>

          {/* Competing Values Framework */}
          <TabsContent value="cvf" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {isArabic ? 'إطار القيم المتنافسة (CVF)' : 'Competing Values Framework (CVF)'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'تحليل الثقافة الحالية مقابل المرغوبة عبر أربعة أبعاد' : 'Current vs desired culture analysis across four dimensions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">{isArabic ? 'التوزيع الحالي مقابل المرغوب' : 'Current vs Desired Distribution'}</h4>
                    {cvfData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{item.dimension}</span>
                          <span className="text-sm text-muted-foreground">
                            {isArabic ? 'حالي' : 'Current'}: {item.current}% | {isArabic ? 'مرغوب' : 'Desired'}: {item.desired}%
                          </span>
                        </div>
                        <div className="space-y-1">
                          <Progress value={item.current} className="h-2" />
                          <Progress value={item.desired} className="h-1 opacity-50" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">{isArabic ? 'تحليل الفجوات' : 'Gap Analysis'}</h4>
                    <div className="space-y-3">
                      {cvfData.map((item, index) => {
                        const gap = item.current - item.desired;
                        return (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="font-medium">{item.dimension}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant={Math.abs(gap) > 10 ? 'destructive' : gap === 0 ? 'default' : 'secondary'}>
                                {gap > 0 ? '+' : ''}{gap}%
                              </Badge>
                              {Math.abs(gap) > 10 && <TrendingUp className="h-4 w-4 text-orange-500" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cultural Web */}
          <TabsContent value="cultural-web" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  {isArabic ? 'تحليل الشبكة الثقافية' : 'Cultural Web Analysis'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'تقييم العناصر الستة للشبكة الثقافية ومستوى المخاطر' : 'Assessment of six cultural web elements and risk levels'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {culturalWebElements.map((element, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">{element.element}</h5>
                            <Badge variant={
                              element.risk === 'high' ? 'destructive' : 
                              element.risk === 'medium' ? 'secondary' : 'default'
                            }>
                              {element.risk === 'high' ? (isArabic ? 'عالي' : 'High') :
                               element.risk === 'medium' ? (isArabic ? 'متوسط' : 'Medium') :
                               (isArabic ? 'منخفض' : 'Low')}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{isArabic ? 'النضج' : 'Maturity'}</span>
                              <span>{element.score}%</span>
                            </div>
                            <Progress value={element.score} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Barrett Values */}
          <TabsContent value="barrett" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {isArabic ? 'نموذج باريت للقيم السبع' : 'Barrett Seven Levels of Values'}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'توزيع القيم الحالي مقابل التوزيع الأمثل' : 'Current vs optimal values distribution'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {barrettValues.map((level, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">{level.level}</h5>
                        <Badge variant={
                          level.status === 'critical' ? 'destructive' :
                          level.status === 'low' ? 'secondary' :
                          level.status === 'high' ? 'secondary' : 'default'
                        }>
                          {level.status === 'critical' ? (isArabic ? 'حرج' : 'Critical') :
                           level.status === 'low' ? (isArabic ? 'منخفض' : 'Low') :
                           level.status === 'high' ? (isArabic ? 'مرتفع' : 'High') :
                           (isArabic ? 'جيد' : 'Good')}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">{isArabic ? 'الحالي' : 'Current'}</div>
                          <Progress value={level.current * 2} className="h-2" />
                          <div className="text-xs text-muted-foreground mt-1">{level.current}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">{isArabic ? 'الأمثل' : 'Optimal'}</div>
                          <Progress value={level.optimal * 2} className="h-2 opacity-50" />
                          <div className="text-xs text-muted-foreground mt-1">{level.optimal}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schein's Model */}
          <TabsContent value="schein" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  {isArabic ? 'نموذج شاين للثقافة التنظيمية' : "Schein's Organizational Culture Model"}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'تحليل المستويات الثلاثة للثقافة التنظيمية' : 'Analysis of three levels of organizational culture'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h5 className="font-medium mb-2">{isArabic ? 'الأدلة المرئية' : 'Artifacts'}</h5>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {isArabic ? 'مستوى النضج' : 'Maturity Level'}
                          </div>
                          <Progress value={78} className="h-2" />
                          <div className="text-xs">78%</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h5 className="font-medium mb-2">{isArabic ? 'القيم المعلنة' : 'Espoused Values'}</h5>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {isArabic ? 'مستوى النضج' : 'Maturity Level'}
                          </div>
                          <Progress value={65} className="h-2" />
                          <div className="text-xs">65%</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h5 className="font-medium mb-2">{isArabic ? 'الافتراضات الأساسية' : 'Basic Assumptions'}</h5>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {isArabic ? 'مستوى النضج' : 'Maturity Level'}
                          </div>
                          <Progress value={42} className="h-2" />
                          <div className="text-xs">42%</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hofstede */}
          <TabsContent value="hofstede" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {isArabic ? 'أبعاد هوفستيد الثقافية' : "Hofstede's Cultural Dimensions"}
                </CardTitle>
                <CardDescription>
                  {isArabic ? 'مقارنة الثقافة التنظيمية مع المعايير الإقليمية' : 'Organizational culture vs regional benchmarks'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hofstedeData.map((dimension, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">{dimension.dimension}</h5>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {isArabic ? 'المنظمة' : 'Org'}: {dimension.score}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {isArabic ? 'المعيار' : 'Benchmark'}: {dimension.benchmark}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Progress value={dimension.score} className="h-2" />
                        <Progress value={dimension.benchmark} className="h-1 opacity-50" />
                        <div className="text-xs text-muted-foreground">
                          {isArabic ? 'الفرق' : 'Difference'}: {dimension.score - dimension.benchmark > 0 ? '+' : ''}{dimension.score - dimension.benchmark}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analysis;