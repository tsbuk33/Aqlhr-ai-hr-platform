import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { TrendingUp, TrendingDown, Scale, AlertTriangle, Users, Target, BarChart3, Shield } from "lucide-react";

const CompensationManagementCore = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      compensation_management: "Compensation Management",
      compensation_management_desc: "Manage salary structures and compensation strategies",
      compensation_bands: "Compensation Bands",
      merit_increase: "Merit Increase",
      market_alignment: "Market Alignment",
      budget_variance: "Budget Variance",
      salary_competitiveness: "Salary Competitiveness Index",
      pay_equity_score: "Pay Equity Score",
      salary_benchmark_intelligence: "Salary Benchmark Intelligence",
      market_position_analysis: "Market Position Analysis",
      overall_market_position: "Overall Market Position",
      competitive: "competitive",
      above_75th: "Above 75th Percentile",
      percentile_50_75: "50th-75th Percentile",
      percentile_25_50: "25th-50th Percentile",
      below_25th: "Below 25th Percentile",
      role_specific_benchmarks: "Role-Specific Benchmarks",
      job_title: "Job Title",
      current_avg: "Current Avg",
      market_median: "Market Median",
      competitiveness: "Competitiveness",
      risk_level: "Risk Level",
      pay_equity_dashboard: "Pay Equity Dashboard",
      gender_pay_gap: "Gender Pay Gap",
      nationality_equity: "Nationality Equity",
      experience_adjusted: "Experience-Adjusted",
      performance_adjusted: "Performance-Adjusted",
      competitive_risk_assessment: "Competitive Risk Assessment",
      high_risk_roles: "High Risk Roles",
      flight_risk_employees: "Flight Risk Employees",
      market_movement: "Market Movement",
      retention_impact: "Retention Impact",
      positions: "positions",
      individuals: "individuals",
      annual_increase: "annual increase",
      turnover_risk: "turnover risk",
      vs_industry: "vs industry",
      compliance: "compliance",
      fair_pay: "fair pay",
      merit_based: "merit-based",
      low: "Low",
      medium: "Medium",
      high: "High"
    },
    ar: {
      compensation_management: "إدارة التعويضات",
      compensation_management_desc: "إدارة هياكل الرواتب واستراتيجيات التعويض",
      compensation_bands: "نطاقات التعويض",
      merit_increase: "زيادة الجدارة",
      market_alignment: "التوافق مع السوق",
      budget_variance: "تباين الميزانية",
      salary_competitiveness: "مؤشر تنافسية الراتب",
      pay_equity_score: "نقاط عدالة الأجور",
      salary_benchmark_intelligence: "ذكاء معايير الراتب",
      market_position_analysis: "تحليل الموقف السوقي",
      overall_market_position: "الموقف السوقي العام",
      competitive: "تنافسي",
      above_75th: "أعلى من المئين 75",
      percentile_50_75: "المئين 50-75",
      percentile_25_50: "المئين 25-50",
      below_25th: "أقل من المئين 25",
      role_specific_benchmarks: "معايير الأدوار المحددة",
      job_title: "المسمى الوظيفي",
      current_avg: "المتوسط الحالي",
      market_median: "متوسط السوق",
      competitiveness: "التنافسية",
      risk_level: "مستوى المخاطر",
      pay_equity_dashboard: "لوحة عدالة الأجور",
      gender_pay_gap: "فجوة الأجور بين الجنسين",
      nationality_equity: "عدالة الجنسية",
      experience_adjusted: "معدل حسب الخبرة",
      performance_adjusted: "معدل حسب الأداء",
      competitive_risk_assessment: "تقييم المخاطر التنافسية",
      high_risk_roles: "الأدوار عالية المخاطر",
      flight_risk_employees: "الموظفون معرضون للمغادرة",
      market_movement: "حركة السوق",
      retention_impact: "تأثير الاحتفاظ",
      positions: "مناصب",
      individuals: "أفراد",
      annual_increase: "زيادة سنوية",
      turnover_risk: "خطر دوران العمل",
      vs_industry: "مقابل الصناعة",
      compliance: "امتثال",
      fair_pay: "أجر عادل",
      merit_based: "قائم على الجدارة",
      low: "منخفض",
      medium: "متوسط",
      high: "عالي"
    }
  };

  const t = (key: string) => translations[language][key] || key;

  const benchmarkData = [
    { title: "CEO", currentAvg: "SAR 45K", marketMedian: "SAR 48K", competitiveness: "94%", riskLevel: "low" },
    { title: "HR Manager", currentAvg: "SAR 18K", marketMedian: "SAR 19K", competitiveness: "95%", riskLevel: "low" },
    { title: "Software Engineer", currentAvg: "SAR 15K", marketMedian: "SAR 17K", competitiveness: "88%", riskLevel: "medium" },
    { title: "Sales Manager", currentAvg: "SAR 20K", marketMedian: "SAR 22K", competitiveness: "91%", riskLevel: "low" },
    { title: "Accountant", currentAvg: "SAR 12K", marketMedian: "SAR 14K", competitiveness: "86%", riskLevel: "medium" }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-brand-success";
      case "medium": return "text-brand-warning";
      case "high": return "text-brand-danger";
      default: return "text-muted-foreground";
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "low": return "default";
      case "medium": return "secondary";
      case "high": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header - MAINTAIN EXACTLY */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('compensation_management')}</h1>
        <p className="text-muted-foreground">{t('compensation_management_desc')}</p>
      </div>
      
      {/* Expanded 6-Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current 4 Cards - MAINTAIN EXACTLY */}
        <Card>
          <CardHeader>
            <CardTitle>{t('compensation_bands')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">47</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('merit_increase')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">8.5%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('market_alignment')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">92%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('budget_variance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">-2.1%</div>
          </CardContent>
        </Card>

        {/* New 2 Cards */}
        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              {t('salary_competitiveness')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-teal-600">87.3%</div>
              <Badge variant="secondary" className="text-xs bg-teal-100 text-teal-700">
                +2.4%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-indigo-600" />
              {t('pay_equity_score')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-indigo-600">94.8%</div>
              <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-700">
                +1.2%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Benchmark Intelligence Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-brand-primary" />
          <h2 className="text-2xl font-bold text-foreground">{t('salary_benchmark_intelligence')}</h2>
        </div>

        {/* Market Position Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>{t('market_position_analysis')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-primary mb-2">87.3%</div>
              <p className="text-lg text-muted-foreground">{t('overall_market_position')} - {t('competitive')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-green-200 bg-green-50 dark:bg-green-950">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">15%</div>
                  <p className="text-sm text-green-600">{t('above_75th')}</p>
                </CardContent>
              </Card>
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-700">58%</div>
                  <p className="text-sm text-blue-600">{t('percentile_50_75')}</p>
                </CardContent>
              </Card>
              <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-700">23%</div>
                  <p className="text-sm text-yellow-600">{t('percentile_25_50')}</p>
                </CardContent>
              </Card>
              <Card className="border-red-200 bg-red-50 dark:bg-red-950">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-700">4%</div>
                  <p className="text-sm text-red-600">{t('below_25th')}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Role-Specific Benchmarks Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('role_specific_benchmarks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('job_title')}</TableHead>
                  <TableHead>{t('current_avg')}</TableHead>
                  <TableHead>{t('market_median')}</TableHead>
                  <TableHead>{t('competitiveness')}</TableHead>
                  <TableHead>{t('risk_level')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {benchmarkData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.title}</TableCell>
                    <TableCell>{row.currentAvg}</TableCell>
                    <TableCell>{row.marketMedian}</TableCell>
                    <TableCell className={getRiskColor(row.riskLevel)}>{row.competitiveness}</TableCell>
                    <TableCell>
                      <Badge variant={getRiskBadgeVariant(row.riskLevel)}>
                        {t(row.riskLevel)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Pay Equity Dashboard Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-brand-primary" />
          <h2 className="text-2xl font-bold text-foreground">{t('pay_equity_dashboard')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-green-200 bg-green-50 dark:bg-green-950">
            <CardHeader>
              <CardTitle className="text-green-700">{t('gender_pay_gap')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">2.1%</div>
              <p className="text-sm text-green-600">({t('vs_industry')}: 5.3%)</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
            <CardHeader>
              <CardTitle className="text-blue-700">{t('nationality_equity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">96.2%</div>
              <p className="text-sm text-blue-600">{t('compliance')}</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950">
            <CardHeader>
              <CardTitle className="text-purple-700">{t('experience_adjusted')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">97.1%</div>
              <p className="text-sm text-purple-600">{t('fair_pay')}</p>
            </CardContent>
          </Card>

          <Card className="border-teal-200 bg-teal-50 dark:bg-teal-950">
            <CardHeader>
              <CardTitle className="text-teal-700">{t('performance_adjusted')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-700">95.8%</div>
              <p className="text-sm text-teal-600">{t('merit_based')}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Competitive Risk Assessment Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-brand-primary" />
          <h2 className="text-2xl font-bold text-foreground">{t('competitive_risk_assessment')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-red-200 bg-red-50 dark:bg-red-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                {t('high_risk_roles')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">8</div>
              <p className="text-sm text-red-600">{t('positions')}</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Users className="h-5 w-5" />
                {t('flight_risk_employees')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">23</div>
              <p className="text-sm text-orange-600">{t('individuals')}</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <TrendingUp className="h-5 w-5" />
                {t('market_movement')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">+3.2%</div>
              <p className="text-sm text-blue-600">{t('annual_increase')}</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Target className="h-5 w-5" />
                {t('retention_impact')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">12%</div>
              <p className="text-sm text-purple-600">{t('turnover_risk')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompensationManagementCore;