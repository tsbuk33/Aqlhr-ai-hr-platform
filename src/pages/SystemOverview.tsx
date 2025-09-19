import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Home, Building2, BarChart3, Users, Shield, Zap, Globe, Sparkles, GraduationCap, Scale, Heart, Brain } from "lucide-react";
import { useUnifiedLocale } from "@/lib/i18n/unifiedLocaleSystem";
import { LinkL } from "@/lib/i18n/LinkL";
import { RBACDiagram } from "@/components/rbac/RBACDiagram";

type Mod = { icon: React.ComponentType<any>, titleEn: string, titleAr: string, descEn: string, descAr: string, link: string };

export default function SystemOverview() {
  const { lang } = useUnifiedLocale();
  const isAr = lang === "ar";

  React.useEffect(() => {
    const title = isAr ? "نظرة عامة على نظام AqlHR" : "AqlHR System Overview";
    const desc = isAr
      ? "كل الوحدات والأدوات في مكان واحد — الوصول السريع لكل ما تحتاجه"
      : "All modules and tools in one place — quick access to everything you need";
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
  }, [isAr]);

  const primary: Mod[] = [
    { icon: Building2, titleEn: "Executive Intelligence Center", titleAr: "مركز الذكاء التنفيذي", descEn: "Strategic analytics and decision support", descAr: "تحليلات استراتيجية ودعم اتخاذ القرار", link: "/executive-center" },
    { icon: Users,     titleEn: "Core HR",                     titleAr: "الموارد البشرية الأساسية", descEn: "Employee management, documents, workflows", descAr: "إدارة الموظفين والوثائق وسير العمل", link: "/core-hr" },
    { icon: BarChart3, titleEn: "AI & Analytics",              titleAr: "الذكاء الاصطناعي والتحليلات", descEn: "Workforce insights, predictive analytics", descAr: "رؤى القوى العاملة والتحليلات التنبؤية", link: "/analytics" },
    { icon: Shield,    titleEn: "Compliance & Governance",     titleAr: "الامتثال والحوكمة", descEn: "Policies, audits, Saudization compliance", descAr: "السياسات والتدقيق والامتثال للسعودة", link: "/compliance" },
    { icon: Zap,       titleEn: "AI Automation Engine",        titleAr: "محرك الأتمتة بالذكاء الاصطناعي", descEn: "Workflow orchestration, task automation", descAr: "تنسيق سير العمل وأتمتة المهام", link: "/ai-automation" },
    { icon: Globe,     titleEn: "Government Integrations",     titleAr: "التكاملات الحكومية", descEn: "21+ portals (Qiwa, GOSI, Absher...)", descAr: "أكثر من ٢١ بوابة (قوى، التأمينات، أبشر...)", link: "/government" },
  ];

  const learningEngagement: Mod[] = [
    { icon: GraduationCap, titleEn: "LEO – Learning Optimization",  titleAr: "LEO – تحسين التعلّم", descEn: "AI-driven learning optimization", descAr: "تحسين التعلّم بالذكاء الاصطناعي", link: "/leo" },
    { icon: Sparkles,      titleEn: "GEO – Engagement Optimization", titleAr: "GEO – تحسين المشاركة", descEn: "Generative engagement optimization", descAr: "تحسين المشاركة التوليدية", link: "/geo" },
    { icon: Brain,         titleEn: "Skills Intelligence",          titleAr: "ذكاء المهارات", descEn: "Skills maps & gaps", descAr: "خرائط المهارات والفجوات", link: "/skills-intelligence" },
  ];

  const flagship: Mod[] = [
    { icon: Heart, titleEn: "Employee-Welfare Consultancy", titleAr: "استشارات رفاهية الموظفين", descEn: "Wellbeing & worker welfare diagnostics", descAr: "تشخيص رفاهية العاملين", link: "/welfare-consultancy" },
    { icon: Scale, titleEn: "Legal Consultant AI",          titleAr: "المستشار القانوني الذكي", descEn: "AI legal aide & policy checks", descAr: "مُعين قانوني ذكي وفحص السياسات", link: "/legal-consultant" },
  ];

  const others: Mod[] = [
    { icon: Users,     titleEn: "Performance",     titleAr: "الأداء",        descEn: "KPIs and reviews",            descAr: "مؤشرات الأداء والتقييمات", link: "/performance" },
    { icon: Users,     titleEn: "Attendance",      titleAr: "الوقت والحضور", descEn: "Time & attendance",          descAr: "الوقت والحضور",          link: "/attendance" },
    { icon: Users,     titleEn: "Leave",           titleAr: "الإجازات",      descEn: "Leave management",           descAr: "إدارة الإجازات",          link: "/leave" },
    { icon: Users,     titleEn: "Payroll",         titleAr: "الرواتب",       descEn: "Payroll processing",         descAr: "معالجة الرواتب",          link: "/payroll" },
    { icon: Users,     titleEn: "Recruitment",     titleAr: "التوظيف",       descEn: "Recruitment & onboarding",   descAr: "التوظيف والتعيين",        link: "/recruitment" },
    { icon: Users,     titleEn: "Tools",           titleAr: "الأدوات",       descEn: "Utilities & imports",        descAr: "أدوات ومراكز الاستيراد",   link: "/tools" },
    { icon: Users,     titleEn: "Help",            titleAr: "مساعدة",        descEn: "Help & docs",                descAr: "مساعدة ووثائق",           link: "/help" },
  ];

  const Section: React.FC<{ titleEn:string; titleAr:string; items: Mod[] }> = ({ titleEn, titleAr, items }) => (
    <section className="max-w-6xl mx-auto my-8">
      <h2 className="text-xl font-bold mb-4 text-center">{isAr ? titleAr : titleEn}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((m, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit">
                <m.icon className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="mt-2">{isAr ? m.titleAr : m.titleEn}</CardTitle>
              <CardDescription className="text-sm mt-1">
                {isAr ? m.descAr : m.descEn}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <LinkL to={m.link} className="inline-flex items-center px-4 py-2 mt-2 text-sm rounded-md border hover:bg-muted">
                {isAr ? "فتح الصفحة" : "Open"}
              </LinkL>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );

  return (
    <main className="aqlhr-center-container py-10" role="main">
      <header className="aqlhr-page-header">
        <h1 className="aqlhr-page-title">{isAr ? "نظرة عامة على نظام AqlHR" : "AqlHR System Overview"}</h1>
        <p className="aqlhr-page-description">
          {isAr ? "كل الوحدات والأدوات في مكان واحد — الوصول السريع لكل ما تحتاجه"
               : "All modules and tools in one place — quick access to everything you need"}
        </p>
      </header>

      <Section titleEn="Primary Modules" titleAr="الوحدات الأساسية" items={primary} />
      <Section titleEn="Learning & Engagement" titleAr="التعلّم والمشاركة" items={learningEngagement} />
      <Section titleEn="Flagship & Specialized" titleAr="وحدات مميّزة ومتخصصة" items={flagship} />
      <Section titleEn="Other Modules" titleAr="وحدات أخرى" items={others} />

      {/* RBAC Diagram Section */}
      <section className="max-w-6xl mx-auto my-12">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isAr ? "مصفوفة التحكم في الوصول القائم على الأدوار" : "Role-Based Access Control Matrix"}
        </h2>
        <p className="text-muted-foreground text-center mb-6">
          {isAr 
            ? "عرض مرئي شامل لتحديد صلاحيات الوصول لكل دور وظيفي في النظام"
            : "Comprehensive visual mapping of access permissions for each functional role in the system"
          }
        </p>
        <RBACDiagram />
      </section>
    </main>
  );
}