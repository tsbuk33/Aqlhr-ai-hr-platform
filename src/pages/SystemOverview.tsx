import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building2, BarChart3, Users, Shield, Zap, Globe } from "lucide-react";
import { useUnifiedLocale } from "@/lib/i18n/unifiedLocaleSystem";
import { LinkL } from "@/lib/i18n/LinkL";

export default function SystemOverview() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === "ar";

  const modules = [
    {
      icon: Building2,
      titleEn: "Executive Intelligence Center",
      titleAr: "مركز الذكاء التنفيذي",
      descEn: "Strategic analytics and decision support",
      descAr: "تحليلات استراتيجية ودعم اتخاذ القرار",
      link: "/executive-center"
    },
    {
      icon: Users,
      titleEn: "Core HR",
      titleAr: "الموارد البشرية الأساسية",
      descEn: "Employee management, documents, workflows",
      descAr: "إدارة الموظفين، الوثائق، سير العمل",
      link: "/core-hr"
    },
    {
      icon: BarChart3,
      titleEn: "AI & Analytics",
      titleAr: "الذكاء الاصطناعي والتحليلات",
      descEn: "Workforce insights, predictive analytics",
      descAr: "رؤى القوى العاملة، التحليلات التنبؤية",
      link: "/analytics"
    },
    {
      icon: Shield,
      titleEn: "Compliance & Governance",
      titleAr: "الامتثال والحوكمة",
      descEn: "Policy management, audits, Saudization",
      descAr: "إدارة السياسات، التدقيق، السعودة",
      link: "/compliance"
    },
    {
      icon: Zap,
      titleEn: "AI Automation Engine",
      titleAr: "محرك الأتمتة بالذكاء الاصطناعي",
      descEn: "Workflow orchestration, task automation",
      descAr: "تنسيق سير العمل، أتمتة المهام",
      link: "/ai-automation"
    },
    {
      icon: Globe,
      titleEn: "Government Integrations",
      titleAr: "التكاملات الحكومية",
      descEn: "21+ portals (Qiwa, GOSI, Absher, etc.)",
      descAr: "أكثر من 21 بوابة (قوى، التأمينات، أبشر)",
      link: "/government"
    }
  ];

  return (
    <div className="aqlhr-center-container py-12">
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

      {/* Modules Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {modules.map((mod, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit">
                <mod.icon className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="mt-2">
                {isArabic ? mod.titleAr : mod.titleEn}
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                {isArabic ? mod.descAr : mod.descEn}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <LinkL
                to={mod.link}
                className="inline-flex items-center px-4 py-2 mt-3 text-sm rounded-md border hover:bg-muted"
              >
                {isArabic ? "انتقال" : "Go to Module"}
              </LinkL>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}