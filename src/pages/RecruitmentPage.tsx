import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Search, Calendar, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import { getCurrentLang, isRTL } from '@/lib/i18n/localeDriver';
import { t } from '@/i18n/strings';
import { AqlHRAIAssistant } from '@/components/ai';

// Recruitment-specific translations
const recruitmentStrings = {
  // Page title and description
  page_title: { en: 'Recruitment & Talent Acquisition', ar: 'التوظيف واستقطاب المواهب' },
  page_description: { en: 'Comprehensive system for managing recruitment and talent acquisition processes', ar: 'نظام شامل لإدارة عمليات التوظيف واستقطاب المواهب' },
  
  // KPI labels  
  active_jobs: { en: 'Active Jobs', ar: 'الوظائف النشطة' },
  new_candidates: { en: 'New Candidates', ar: 'المرشحين الجدد' },
  scheduled_interviews: { en: 'Scheduled Interviews', ar: 'المقابلات المجدولة' },
  hires_this_month: { en: 'Hires This Month', ar: 'التوظيفات هذا الشهر' },
  
  // Module names
  job_management: { en: 'Job Management', ar: 'إدارة الوظائف' },
  talent_search: { en: 'Talent Search', ar: 'البحث عن المواهب' },
  interview_scheduling: { en: 'Interview Scheduling', ar: 'جدولة المقابلات' },
  candidate_assessment: { en: 'Candidate Assessment', ar: 'تقييم المرشحين' },
  candidate_management: { en: 'Candidate Management', ar: 'إدارة المرشحين' },
  recruitment_analytics: { en: 'Recruitment Analytics', ar: 'تحليلات التوظيف' },
  
  // Module descriptions
  job_management_desc: { en: 'Create and manage job openings', ar: 'إنشاء وإدارة الوظائف الشاغرة' },
  talent_search_desc: { en: 'Smart search for suitable candidates', ar: 'البحث الذكي عن المرشحين المناسبين' },
  interview_scheduling_desc: { en: 'Schedule and manage interviews', ar: 'جدولة وإدارة المقابلات الشخصية' },
  candidate_assessment_desc: { en: 'Comprehensive candidate evaluation', ar: 'تقييم شامل لقدرات المرشحين' },
  candidate_management_desc: { en: 'Track candidate status through hiring stages', ar: 'متابعة حالة المرشحين عبر مراحل التوظيف' },
  recruitment_analytics_desc: { en: 'Comprehensive recruitment analysis and reports', ar: 'تحليل وتقارير شاملة لعملية التوظيف' },
  
  // Actions
  open_module: { en: 'Open Module', ar: 'فتح الوحدة' },
  
  // Badges
  core: { en: 'Core', ar: 'أساسي' },
  ai: { en: 'AI', ar: 'ذكي' },
  process: { en: 'Process', ar: 'عملية' },
  assessment: { en: 'Assessment', ar: 'تقييم' },
  management: { en: 'Management', ar: 'إدارة' },
  analytics: { en: 'Analytics', ar: 'تحليلات' }
};

// Helper function for translations
const tr = (key: keyof typeof recruitmentStrings) => {
  const lang = getCurrentLang();
  return recruitmentStrings[key][lang];
};

// Formatting utilities
const formatNumber = (num: number) => {
  const lang = getCurrentLang();
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
    useGrouping: true
  }).format(num);
};

const RecruitmentPage: React.FC = () => {
  const lang = getCurrentLang();
  const isArabicRTL = isRTL();

  const recruitmentModules = [
    {
      title: tr('job_management'),
      description: tr('job_management_desc'),
      icon: FileText,
      badge: tr('core'),
      status: 'active'
    },
    {
      title: tr('talent_search'),
      description: tr('talent_search_desc'),
      icon: Search,
      badge: tr('ai'),
      status: 'active'
    },
    {
      title: tr('interview_scheduling'),
      description: tr('interview_scheduling_desc'),
      icon: Calendar,
      badge: tr('process'),
      status: 'active'
    },
    {
      title: tr('candidate_assessment'),
      description: tr('candidate_assessment_desc'),
      icon: CheckCircle,
      badge: tr('assessment'),
      status: 'active'
    },
    {
      title: tr('candidate_management'),
      description: tr('candidate_management_desc'),
      icon: Users,
      badge: tr('management'),
      status: 'active'
    },
    {
      title: tr('recruitment_analytics'),
      description: tr('recruitment_analytics_desc'),
      icon: TrendingUp,
      badge: tr('analytics'),
      status: 'active'
    }
  ];

  const stats = [
    { label: tr('active_jobs'), value: formatNumber(24), color: 'text-blue-600' },
    { label: tr('new_candidates'), value: formatNumber(156), color: 'text-green-600' },
    { label: tr('scheduled_interviews'), value: formatNumber(8), color: 'text-yellow-600' },
    { label: tr('hires_this_month'), value: formatNumber(12), color: 'text-purple-600' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isArabicRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">
          {tr('page_title')}
        </h1>
        <p className="text-muted-foreground">
          {tr('page_description')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recruitment Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recruitmentModules.map((module, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <module.icon className="h-8 w-8 text-primary" />
                <Badge variant="secondary">{module.badge}</Badge>
              </div>
              <CardTitle className="text-xl">{module.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm leading-relaxed">
                {module.description}
              </CardDescription>
              <Button className="w-full" variant="outline">
                {tr('open_module')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <AqlHRAIAssistant moduleContext="recruitment.management" />
    </div>
  );
};

export default RecruitmentPage;