import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Bot, Workflow, Brain, Settings, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { LinkL } from '@/lib/i18n/LinkL';

export default function AIAutomation() {
  const { lang } = useUnifiedLocale();
  const isAr = lang === 'ar';

  React.useEffect(() => {
    const title = isAr ? "محرك الأتمتة بالذكاء الاصطناعي" : "AI Automation Engine";
    const desc = isAr 
      ? "تنسيق سير العمل وأتمتة المهام بالذكاء الاصطناعي المتقدم"
      : "Advanced AI-powered workflow orchestration and task automation";
    document.title = `${title} · AqlHR`;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = desc;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = window.location.href;
  }, [isAr]);

  const automationModules = [
    {
      icon: Bot,
      titleEn: "AI Sync Engine",
      titleAr: "محرك المزامنة الذكي",
      descEn: "Intelligent data synchronization across all systems",
      descAr: "مزامنة البيانات الذكية عبر جميع الأنظمة",
      link: "/ai-automation/sync-engine",
      status: "active"
    },
    {
      icon: Brain,
      titleEn: "Smart Recommendations",
      titleAr: "التوصيات الذكية", 
      descEn: "AI-powered insights and actionable recommendations",
      descAr: "رؤى مدعومة بالذكاء الاصطناعي وتوصيات قابلة للتنفيذ",
      link: "/ai-automation/smart-recommendations",
      status: "active"
    },
    {
      icon: Workflow,
      titleEn: "Automated Workflow Engine",
      titleAr: "محرك سير العمل المؤتمت",
      descEn: "End-to-end workflow automation and orchestration",
      descAr: "أتمتة وتنسيق سير العمل من النهاية للنهاية",
      link: "/ai-automation/automated-workflow",
      status: "active"
    },
    {
      icon: Settings,
      titleEn: "Predictive Analytics Engine",
      titleAr: "محرك التحليلات التنبؤية",
      descEn: "Advanced predictive modeling for workforce planning",
      descAr: "نمذجة تنبؤية متقدمة لتخطيط القوى العاملة",
      link: "/ai-automation/predictive-analytics",
      status: "active"
    },
    {
      icon: Brain,
      titleEn: "Document Intelligence",
      titleAr: "ذكاء المستندات",
      descEn: "AI-powered document processing and analysis",
      descAr: "معالجة وتحليل المستندات بالذكاء الاصطناعي",
      link: "/ai-automation/document-intelligence",
      status: "active"
    },
    {
      icon: Bot,
      titleEn: "Arabic-English NLP",
      titleAr: "معالجة اللغة العربية-الإنجليزية",
      descEn: "Advanced bilingual natural language processing",
      descAr: "معالجة متقدمة للغة الطبيعية ثنائية اللغة",
      link: "/ai-automation/arabic-english-nlp",
      status: "active"
    }
  ];

  const stats = [
    {
      label: isAr ? "المهام المؤتمتة" : "Tasks Automated",
      value: "2,847",
      change: "+23%",
      icon: CheckCircle
    },
    {
      label: isAr ? "الوقت المحفوظ" : "Time Saved",
      value: "156hrs",
      change: "+18%",
      icon: Zap
    },
    {
      label: isAr ? "دقة التنبؤات" : "Prediction Accuracy", 
      value: "94.2%",
      change: "+2.1%",
      icon: Brain
    },
    {
      label: isAr ? "التحسينات النشطة" : "Active Optimizations",
      value: "47",
      change: "+12",
      icon: AlertTriangle
    }
  ];

  return (
    <main className="aqlhr-center-container py-10" role="main">
      <header className="aqlhr-page-header">
        <h1 className="aqlhr-page-title">
          {isAr ? "محرك الأتمتة بالذكاء الاصطناعي" : "AI Automation Engine"}
        </h1>
        <p className="aqlhr-page-description">
          {isAr 
            ? "تنسيق سير العمل وأتمتة المهام بالذكاء الاصطناعي المتقدم لتحسين الكفاءة التشغيلية"
            : "Advanced AI-powered workflow orchestration and task automation for enhanced operational efficiency"
          }
        </p>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Automation Modules */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isAr ? "وحدات الأتمتة المتاحة" : "Available Automation Modules"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {automationModules.map((module, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-full bg-primary/10 w-fit">
                    <module.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant={module.status === 'active' ? 'default' : 'secondary'}>
                    {isAr ? 'نشط' : 'Active'}
                  </Badge>
                </div>
                <CardTitle className="text-lg">
                  {isAr ? module.titleAr : module.titleEn}
                </CardTitle>
                <CardDescription>
                  {isAr ? module.descAr : module.descEn}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LinkL 
                  to={module.link}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    {isAr ? "فتح الوحدة" : "Open Module"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </LinkL>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>
              {isAr ? "إجراءات سريعة" : "Quick Actions"}
            </CardTitle>
            <CardDescription>
              {isAr 
                ? "ابدأ بأتمتة سير العمل والمهام الأكثر شيوعاً"
                : "Start automating your most common workflows and tasks"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 justify-center">
            <LinkL to="/ai-automation/workflow-automation">
              <Button variant="default">
                <Workflow className="h-4 w-4 mr-2" />
                {isAr ? "إنشاء سير عمل" : "Create Workflow"}
              </Button>
            </LinkL>
            <LinkL to="/ai-automation/sync-engine">
              <Button variant="outline">
                <Bot className="h-4 w-4 mr-2" />
                {isAr ? "مزامنة البيانات" : "Sync Data"}
              </Button>
            </LinkL>
            <LinkL to="/ai-automation/smart-recommendations">
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                {isAr ? "عرض التوصيات" : "View Recommendations"}
              </Button>
            </LinkL>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}