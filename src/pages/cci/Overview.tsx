import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { useCCIOverview } from '@/hooks/useCCIOverview';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Target, 
  Users, 
  BarChart3,
  FileText,
  Brain,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

const Overview: React.FC = () => {
  const isArabic = false; // TODO: Implement i18n
  
  // TODO: Get these from context/routing in real implementation
  const tenantId = "00000000-0000-0000-0000-000000000000"; // placeholder
  const surveyId = "00000000-0000-0000-0000-000000000000"; // placeholder  
  const waveId = "00000000-0000-0000-0000-000000000000"; // placeholder
  
  const { data, loading, error, computeScores } = useCCIOverview(tenantId, surveyId, waveId);
  
  // Helper function to show "—" for groups with n < 7 (anonymity protection)
  const safeDisplay = (value: number | null | undefined, defaultValue: string = "—") => {
    if (value === null || value === undefined) return defaultValue;
    if (!data || data.n < 7) return defaultValue;
    return Math.round(value);
  };

  const isAnonymityProtected = (value: number | null | undefined) => {
    return value === null || value === undefined || (data && data.n < 7);
  };

  const scoreCard = (title: string, value: string | number, delta: number, color: string, icon: React.ReactNode, tooltip: string) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                {typeof value === "string" && value === "—" 
                  ? "Hidden to protect anonymity (n < 7)" 
                  : tooltip}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full bg-${color}-100 text-${color}-600`}>
              {icon}
            </div>
            <div>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-16" /> : value}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {!loading && data && value !== "—" && (
                  <>
                    {delta > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    {Math.abs(delta)}% MoM
                  </>
                )}
                {!loading && data && value === "—" && (
                  <span className="text-xs">n&lt;7</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Dynamic data based on real CCI scores
  const competingValues = loading || !data || data.n < 7 ? [
    { name: isArabic ? 'العشيرة' : 'Clan', value: 0, color: 'blue', display: "—" },
    { name: isArabic ? 'الإبداع' : 'Adhocracy', value: 0, color: 'green', display: "—" },
    { name: isArabic ? 'السوق' : 'Market', value: 0, color: 'orange', display: "—" },
    { name: isArabic ? 'التسلسل الهرمي' : 'Hierarchy', value: 0, color: 'purple', display: "—" }
  ] : [
    { name: isArabic ? 'العشيرة' : 'Clan', value: Math.round(data.cvf?.Clan || 0), color: 'blue', display: Math.round(data.cvf?.Clan || 0) + "%" },
    { name: isArabic ? 'الإبداع' : 'Adhocracy', value: Math.round(data.cvf?.Adhocracy || 0), color: 'green', display: Math.round(data.cvf?.Adhocracy || 0) + "%" },
    { name: isArabic ? 'السوق' : 'Market', value: Math.round(data.cvf?.Market || 0), color: 'orange', display: Math.round(data.cvf?.Market || 0) + "%" },
    { name: isArabic ? 'التسلسل الهرمي' : 'Hierarchy', value: Math.round(data.cvf?.Hierarchy || 0), color: 'purple', display: Math.round(data.cvf?.Hierarchy || 0) + "%" }
  ];

  const topValues = [
    { current: isArabic ? 'الإنجاز' : 'Achievement', desired: isArabic ? 'الابتكار' : 'Innovation' },
    { current: isArabic ? 'الاستقرار' : 'Stability', desired: isArabic ? 'التعاون' : 'Collaboration' },
    { current: isArabic ? 'التحكم' : 'Control', desired: isArabic ? 'الشفافية' : 'Transparency' }
  ];

  const cultureOutcomeLinks = [
    { metric: isArabic ? 'معدل دوران الموظفين' : 'Turnover Rate', correlation: -0.72, impact: 'high' },
    { metric: isArabic ? 'تجربة الموظف' : 'Employee Experience', correlation: 0.84, impact: 'high' },
    { metric: isArabic ? 'السلامة والصحة المهنية' : 'HSE Performance', correlation: 0.65, impact: 'medium' },
    { metric: isArabic ? 'السعودة' : 'Saudization', correlation: 0.58, impact: 'medium' }
  ];

  return (
    <div className={`min-h-screen bg-background p-6 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isArabic ? 'ذكاء الثقافة المؤسسية' : 'Corporate Culture Intelligence'}
            </h1>
            <p className="text-muted-foreground">
              {isArabic ? 'عقل للموارد البشرية' : 'AqlHR — Intelligent HR Solutions'}
            </p>
            {data?.last_computed_at && (
              <p className="text-sm text-muted-foreground mt-1">
                {isArabic ? 'آخر حساب: ' : 'Last computed: '}
                {new Date(data.last_computed_at).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={computeScores} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              {isArabic ? 'احسب الآن' : 'Compute Now'}
            </Button>
            <Button asChild>
              <Link to="/cci/survey">
                <FileText className="mr-2 h-4 w-4" />
                {isArabic ? 'تشغيل التقييم الأساسي' : 'Run Baseline Assessment'}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/cci/playbook">
                <Brain className="mr-2 h-4 w-4" />
                {isArabic ? 'بدء خطة التغيير بالذكاء الاصطناعي' : 'Start AI Change Plan'}
              </Link>
            </Button>
          </div>
        </div>

        {/* Score Cards Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scoreCard(
            isArabic ? 'درجة التوازن الثقافي' : 'Culture Balance Score',
            safeDisplay(data?.balance_score),
            5.2,
            'blue',
            <Activity className="h-4 w-4" />,
            isArabic ? 'التعريف: مقياس شامل للصحة الثقافية • المصدر: تحليل CVF • آخر حساب: اليوم' : 'Definition: Comprehensive cultural health metric • Source: CVF Analysis • Last computed: Today'
          )}
          
          {scoreCard(
            isArabic ? 'مؤشر المخاطر الثقافية' : 'Cultural Risk Index',
            safeDisplay(data?.risk_index),
            -3.1,
            'orange',
            <AlertTriangle className="h-4 w-4" />,
            isArabic ? 'التعريف: احتمالية فشل المبادرات الثقافية • المصدر: نموذج التنبؤ بالذكاء الاصطناعي • آخر حساب: أمس' : 'Definition: Likelihood of cultural initiative failure • Source: AI Prediction Model • Last computed: Yesterday'
          )}
          
          {scoreCard(
            isArabic ? 'مؤشر الأمان النفسي' : 'Psychological Safety Index',
            safeDisplay(data?.psych_safety),
            7.3,
            'green',
            <Shield className="h-4 w-4" />,
            isArabic ? 'التعريف: راحة الموظفين في التعبير عن آرائهم • المصدر: مسح الأمان النفسي • آخر حساب: الأسبوع الماضي' : 'Definition: Employee comfort in speaking up • Source: Psychological Safety Survey • Last computed: Last week'
          )}
          
          {scoreCard(
            isArabic ? 'محاذاة القيم' : 'Values Alignment',
            safeDisplay(data?.barrett?.values_alignment),
            2.8,
            'purple',
            <Target className="h-4 w-4" />,
            isArabic ? 'التعريف: توافق القيم الحالية مع المرغوبة • المصدر: تحليل باريت • آخر حساب: منذ 3 أيام' : 'Definition: Current vs desired values alignment • Source: Barrett Analysis • Last computed: 3 days ago'
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Competing Values Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {isArabic ? 'ملف القيم المتنافسة' : 'Competing Values Profile'}
              </CardTitle>
              <CardDescription>
                {isArabic ? 'إطار القيم المتنافسة (CVF) - التوزيع الحالي' : 'Competing Values Framework (CVF) - Current Distribution'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competingValues.map((value, index) => (
                  <div key={index} className="space-y-2">
                     <div className="flex justify-between">
                       <span className="text-sm font-medium">{value.name}</span>
                       <span className="text-sm text-muted-foreground">{value.display}</span>
                     </div>
                    <Progress value={value.value} className="h-2" />
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'التوزيع المثالي: العشيرة 30% | الإبداع 25% | السوق 25% | التسلسل الهرمي 20%' : 'Ideal distribution: Clan 30% | Adhocracy 25% | Market 25% | Hierarchy 20%'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Values Alignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {isArabic ? 'محاذاة القيم (باريت)' : 'Values Alignment (Barrett)'}
              </CardTitle>
              <CardDescription>
                {isArabic ? 'مقارنة القيم الحالية مع المرغوبة' : 'Current vs Desired Values Comparison'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">{isArabic ? 'القيم الحالية' : 'Current Values'}</h4>
                    <div className="space-y-1">
                      {topValues.map((item, index) => (
                        <Badge key={index} variant="secondary" className="mr-1 mb-1">
                          {item.current}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">{isArabic ? 'القيم المرغوبة' : 'Desired Values'}</h4>
                    <div className="space-y-1">
                      {topValues.map((item, index) => (
                        <Badge key={index} variant="outline" className="mr-1 mb-1">
                          {item.desired}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? 'الفجوة: 35% من القيم المرغوبة غير محققة' : 'Gap: 35% of desired values not achieved'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Culture-Outcome Links */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {isArabic ? 'روابط الثقافة والنتائج' : 'Culture-Outcome Links'}
              </CardTitle>
              <CardDescription>
                {isArabic ? 'الارتباطات بين مقاييس الثقافة ونتائج الأعمال' : 'Correlations between culture metrics and business outcomes'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cultureOutcomeLinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={link.impact === 'high' ? 'destructive' : 'secondary'}>
                        {link.impact === 'high' ? (isArabic ? 'تأثير عالي' : 'High Impact') : (isArabic ? 'تأثير متوسط' : 'Medium Impact')}
                      </Badge>
                      <span className="font-medium">{link.metric}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${link.correlation > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {link.correlation > 0 ? '+' : ''}{link.correlation}
                      </span>
                      {link.correlation > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Overview;