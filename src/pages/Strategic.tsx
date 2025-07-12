import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useLocalization } from "@/hooks/useLocalization";
import { 
  Users, 
  TrendingUp, 
  Target, 
  Award,
  UserCheck,
  BookOpen,
  BarChart,
  Compass,
  Crown,
  Shield,
  Briefcase,
  Globe
} from "lucide-react";

const Strategic = () => {
  const { t, language } = useLanguage();
  const { number, percentage } = useLocalization();

  const stats = [
    {
      title: language === 'ar' ? 'هدف السعودة 2030' : 'Saudization Target 2030',
      value: `${percentage(75)} ${language === 'ar' ? 'مستهدف' : 'target'}`,
      icon: Users,
      variant: "primary" as const,
      trend: { value: "7.8% to go", isPositive: true }
    },
    {
      title: language === 'ar' ? 'تطوير المواهب السعودية' : 'Saudi Talent Development',
      value: number(456),
      icon: TrendingUp,
      variant: "success" as const,
      trend: { value: "23 this month", isPositive: true }
    },
    {
      title: language === 'ar' ? 'برامج التوطين' : 'Localization Programs',
      value: number(12),
      icon: Target,
      variant: "warning" as const,
      trend: { value: "3 new", isPositive: true }
    },
    {
      title: language === 'ar' ? 'خطط الإحلال السعودي' : 'Saudi Succession Plans',
      value: percentage(78),
      icon: Award,
      variant: "accent" as const,
      trend: { value: "8%", isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: language === 'ar' ? 'تخطيط القوى العاملة الاستراتيجي' : 'Strategic Workforce Planning',
      description: language === 'ar' ? 'نمذجة السيناريوهات والتخطيط' : 'Scenario modeling and planning',
      icon: Compass,
      color: "bg-blue-500",
      onClick: () => console.log('Navigate to workforce planning')
    },
    {
      title: language === 'ar' ? 'تطوير القيادة' : 'Leadership Development',
      description: language === 'ar' ? 'خط الأنابيب وتخطيط الخلافة' : 'Pipeline and succession planning',
      icon: Crown,
      color: "bg-green-500",
      onClick: () => console.log('Navigate to leadership development')
    },
    {
      title: language === 'ar' ? 'تتبع السعودة' : 'Saudization Tracking',
      description: language === 'ar' ? 'مراقبة امتثال نطاقات' : 'Nitaqat compliance monitoring',
      icon: Shield,
      color: "bg-purple-500",
      onClick: () => console.log('Navigate to saudization')
    },
    {
      title: language === 'ar' ? 'استراتيجية المواهب' : 'Talent Strategy',
      description: language === 'ar' ? 'استقطاب وتطوير المواهب' : 'Talent acquisition and development',
      icon: UserCheck,
      color: "bg-orange-500",
      onClick: () => console.log('Navigate to talent strategy')
    }
  ];

  const documents = [
    {
      name: language === 'ar' ? 'خطة_الموارد_البشرية_الاستراتيجية_2025.pdf' : 'strategic_hr_plan_2025.pdf',
      type: language === 'ar' ? 'خطة استراتيجية' : 'Strategic Plan',
      date: '2024-12-15',
      size: '6.4 MB'
    },
    {
      name: language === 'ar' ? 'تحليل_فجوات_المهارات.xlsx' : 'skills_gap_analysis.xlsx',
      type: language === 'ar' ? 'تحليل المهارات' : 'Skills Analysis',
      date: '2024-12-20',
      size: '2.8 MB'
    },
    {
      name: language === 'ar' ? 'مخطط_تطوير_القيادة.docx' : 'leadership_development_roadmap.docx',
      type: language === 'ar' ? 'مخطط التطوير' : 'Development Roadmap',
      date: '2024-12-25',
      size: '1.9 MB'
    }
  ];

  const tabs = [
    {
      id: 'planning',
      label: language === 'ar' ? 'التخطيط' : 'Planning',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-primary" />
                  {language === 'ar' ? 'تخطيط القوى العاملة الاستراتيجي' : 'Strategic Workforce Planning'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'نمذجة السيناريوهات والتخطيط' : 'Scenario modeling and planning'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {number(89)} {language === 'ar' ? 'فجوات مهارات محددة' : 'identified skills gaps'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-success" />
                  {language === 'ar' ? 'تطوير القيادة' : 'Leadership Development'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'خط الأنابيب وتخطيط الخلافة' : 'Pipeline and succession planning'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {number(156)} {language === 'ar' ? 'مناصب رئيسية متتبعة' : 'key positions tracked'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-accent" />
                  {language === 'ar' ? 'تتبع السعودة' : 'Saudization Tracking'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'مراقبة امتثال نطاقات' : 'Nitaqat compliance monitoring'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {percentage(67.2)} {language === 'ar' ? 'المعدل الحالي' : 'current rate'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'development',
      label: language === 'ar' ? 'التطوير' : 'Development',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'برامج التطوير الاستراتيجي' : 'Strategic Development Programs'}</CardTitle>
              <CardDescription>
                {language === 'ar' ? 'برامج شاملة لتطوير المواهب والقيادات' : 'Comprehensive talent and leadership development programs'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                  <Crown className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">
                    {language === 'ar' ? 'تطوير القيادة' : 'Leadership Development'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-success" />
                  <p className="text-sm font-medium">
                    {language === 'ar' ? 'تطوير المهارات' : 'Skills Development'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                  <UserCheck className="h-8 w-8 mx-auto mb-2 text-warning" />
                  <p className="text-sm font-medium">
                    {language === 'ar' ? 'إدارة المواهب' : 'Talent Management'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
                  <Award className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <p className="text-sm font-medium">
                    {language === 'ar' ? 'برامج الإنجاز' : 'Achievement Programs'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <EnhancedPageLayout
      title={language === 'ar' ? 'الموارد البشرية الاستراتيجية' : 'Strategic HR'}
      description={language === 'ar' ? 'تخطيط استراتيجي شامل للموارد البشرية والمواهب' : 'Comprehensive strategic planning for HR and talent'}
      showUserInfo={true}
      showQuickActions={true}
      showTabs={true}
      stats={stats}
      quickActions={quickActions}
      documents={documents}
      tabs={tabs}
    />
  );
};

export default Strategic;