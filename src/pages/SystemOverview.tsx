import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  Building2, BarChart3, Users, Shield, Zap, Globe, Crown, 
  GraduationCap, Sparkles, Star, Heart, Scale, Activity,
  Clock, Calendar, DollarSign, UserPlus, Wrench, HelpCircle, Home
} from "lucide-react";
import { useUnifiedLocale } from "@/lib/i18n/unifiedLocaleSystem";
import { LinkL } from "@/lib/i18n/LinkL";
import { Badge } from "@/components/ui/badge";

export default function SystemOverview() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === "ar";

  React.useEffect(() => {
    const title = isArabic ? "نظرة عامة على نظام عقل HR" : "AqlHR System Overview";
    const desc = isArabic
      ? "كل الأدوات والأنظمة الأساسية لإدارة الموارد البشرية في مكان واحد"
      : "All modules and tools for HR management in one place";
    document.title = `${title} · AqlHR`;
    // description
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = desc;
    // canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = window.location.href;
  }, [isArabic]);

  // Primary modules
  const primaryModules = [
    {
      icon: Crown,
      titleEn: "Executive Intelligence Center",
      titleAr: "مركز الذكاء التنفيذي",
      descEn: "Strategic analytics and decision support",
      descAr: "تحليلات استراتيجية ودعم اتخاذ القرار",
      link: "/executive-center",
      badge: "PREMIUM"
    },
    {
      icon: Users,
      titleEn: "Core HR",
      titleAr: "الموارد البشرية الأساسية",
      descEn: "Employee management, documents, workflows",
      descAr: "إدارة الموظفين والوثائق وسير العمل",
      link: "/core-hr"
    },
    {
      icon: BarChart3,
      titleEn: "AI & Analytics",
      titleAr: "الذكاء الاصطناعي والتحليلات",
      descEn: "Workforce insights, predictive analytics",
      descAr: "رؤى القوى العاملة والتحليلات التنبؤية",
      link: "/analytics"
    },
    {
      icon: Shield,
      titleEn: "Compliance & Governance",
      titleAr: "الامتثال والحوكمة",
      descEn: "Policies, audits, Saudization compliance",
      descAr: "السياسات والتدقيق والامتثال للسعودة",
      link: "/compliance"
    },
    {
      icon: Zap,
      titleEn: "AI Automation Engine",
      titleAr: "محرك الأتمتة بالذكاء الاصطناعي",
      descEn: "Workflow orchestration, task automation",
      descAr: "تنسيق سير العمل وأتمتة المهام",
      link: "/ai-automation"
    },
    {
      icon: Globe,
      titleEn: "Government Integrations",
      titleAr: "التكاملات الحكومية",
      descEn: "21+ portals (Qiwa, GOSI, Absher…)",
      descAr: "أكثر من ٢١ بوابة (قوى، التأمينات، أبشر…)",
      link: "/government",
      badge: "21"
    }
  ];

  // Learning & Engagement modules
  const learningEngagementModules = [
    {
      icon: GraduationCap,
      titleEn: "LEO – Learning Optimization",
      titleAr: "LEO – تحسين التعلّم",
      descEn: "AI-driven learning optimization",
      descAr: "تحسين التعلّم بالذكاء الاصطناعي",
      link: "/leo",
      badge: "LEO"
    },
    {
      icon: Sparkles,
      titleEn: "GEO – Engagement Optimization",
      titleAr: "GEO – تحسين المشاركة",
      descEn: "Generative engagement optimization",
      descAr: "تحسين المشاركة التوليدية",
      link: "/geo",
      badge: "GEO"
    }
  ];

  // Flagship modules
  const flagshipModules = [
    {
      icon: Star,
      titleEn: "Skills Intelligence",
      titleAr: "ذكاء المهارات",
      descEn: "Skills maps & gaps",
      descAr: "خرائط المهارات والفجوات",
      link: "/skills-intelligence",
      badge: "NEW"
    },
    {
      icon: Heart,
      titleEn: "Employee-Welfare Consultancy",
      titleAr: "استشارات رفاهية الموظفين",
      descEn: "Wellbeing & worker welfare diagnostics",
      descAr: "تشخيص رفاهية العاملين",
      link: "/welfare-consultancy",
      badge: "FLAGSHIP"
    },
    {
      icon: Scale,
      titleEn: "Legal Consultant AI",
      titleAr: "المستشار القانوني الذكي",
      descEn: "AI legal aide & policy checks",
      descAr: "مُعين قانوني ذكي وفحص السياسات",
      link: "/legal-consultant",
      badge: "NEW"
    }
  ];

  // Other tools
  const otherTools = [
    {
      icon: Activity,
      titleEn: "Performance",
      titleAr: "الأداء",
      link: "/performance"
    },
    {
      icon: Clock,
      titleEn: "Attendance",
      titleAr: "الوقت والحضور",
      link: "/attendance"
    },
    {
      icon: Calendar,
      titleEn: "Leave",
      titleAr: "الإجازات",
      link: "/leave"
    },
    {
      icon: DollarSign,
      titleEn: "Payroll",
      titleAr: "الرواتب",
      link: "/payroll"
    },
    {
      icon: UserPlus,
      titleEn: "Recruitment",
      titleAr: "التوظيف",
      link: "/recruitment"
    },
    {
      icon: Wrench,
      titleEn: "Tools",
      titleAr: "الأدوات",
      link: "/tools"
    },
    {
      icon: HelpCircle,
      titleEn: "Help",
      titleAr: "المساعدة",
      link: "/help"
    }
  ];

  const renderModuleCard = (mod: any, index: number) => (
    <Card key={index} className="hover:shadow-lg transition-shadow">
      <CardHeader className="text-center">
        <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit">
          <mod.icon className="h-7 w-7 text-primary" />
        </div>
        <CardTitle className="mt-2">
          {isArabic ? mod.titleAr : mod.titleEn}
        </CardTitle>
        {mod.descEn && (
          <CardDescription className="text-sm mt-1">
            {isArabic ? mod.descAr : mod.descEn}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex items-center justify-center gap-2">
          <LinkL
            to={mod.link}
            className="inline-flex items-center px-4 py-2 mt-3 text-sm rounded-md border hover:bg-muted"
          >
            {isArabic ? "انتقال" : "Go to Module"}
          </LinkL>
          {mod.badge && (
            <Badge variant="outline" className="text-xs">
              {mod.badge}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <main className="aqlhr-center-container py-12" role="main">
      {/* Page Header */}
      <header className="aqlhr-page-header">
        <h1 className="aqlhr-page-title">
          {isArabic ? "نظرة عامة على نظام عقل HR" : "AqlHR System Overview"}
        </h1>
        <p className="aqlhr-page-description">
          {isArabic
            ? "كل الأدوات والأنظمة الأساسية لإدارة الموارد البشرية في مكان واحد"
            : "All modules and tools for HR management in one place"}
        </p>
      </header>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Primary Modules */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-6">
            {isArabic ? "الوحدات الأساسية" : "Primary Modules"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {primaryModules.map(renderModuleCard)}
          </div>
        </section>

        {/* Learning & Engagement */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-6">
            {isArabic ? "التعلم والمشاركة" : "Learning & Engagement"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {learningEngagementModules.map(renderModuleCard)}
          </div>
        </section>

        {/* Flagship */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-6">
            {isArabic ? "المنتجات الرائدة" : "Flagship"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {flagshipModules.map(renderModuleCard)}
          </div>
        </section>

        {/* Others */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-6">
            {isArabic ? "أدوات أخرى" : "Others"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {otherTools.map(renderModuleCard)}
          </div>
        </section>
      </div>
    </main>
  );
}