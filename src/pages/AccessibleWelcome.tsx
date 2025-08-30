import React, { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Users, BarChart3, Shield, Zap } from 'lucide-react';
import { LinkL } from '@/lib/i18n/LinkL';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

// Accessible, self-contained welcome page with full-width header/footer
// and centered main content. No dependency on CenteredLayout.
export default function AccessibleWelcome() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  // SEO: title, description, canonical, and JSON-LD
  const seo = useMemo(() => {
    const title = isArabic
      ? 'AqlHR – مستقبل الموارد البشرية'
      : 'AqlHR – The Future of HR';
    const description = isArabic
      ? 'منصة موارد بشرية ذكية مصممة للسوق السعودي مع قدرات ذكاء اصطناعي متقدمة.'
      : 'Smart HR platform for Saudi organizations with advanced AI capabilities.';
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'AqlHR',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'SAR' }
    };
    return { title, description, jsonLd };
  }, [isArabic]);

  useEffect(() => {
    document.title = seo.title;

    // Meta description
    let meta = document.head.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', seo.description);

    // Canonical
    const href = window.location.href;
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', href);

    // JSON-LD
    let ldEl = document.getElementById('structured-data-welcome') as HTMLScriptElement | null;
    if (!ldEl) {
      ldEl = document.createElement('script');
      ldEl.id = 'structured-data-welcome';
      ldEl.type = 'application/ld+json';
      document.head.appendChild(ldEl);
    }
    ldEl.textContent = JSON.stringify(seo.jsonLd);
  }, [seo]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Skip link for a11y */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 px-3 py-2 rounded border bg-background">
        {isArabic ? 'تجاوز إلى المحتوى' : 'Skip to content'}
      </a>

      {/* Header */}
      <header role="banner" className="w-full border-b">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3" aria-label={isArabic ? 'الصفحة الرئيسية' : 'Homepage'}>
            <span aria-hidden className="rounded-lg bg-primary/10 p-2">
              <Building2 className="h-6 w-6 text-primary" />
            </span>
            <div className="leading-tight">
              <span className="block text-xl font-bold">AqlHR</span>
              <span className="block text-xs text-muted-foreground">{isArabic ? 'منصة ذكية للموارد البشرية' : 'Smart HR Platform'}</span>
            </div>
          </div>
          <nav aria-label={isArabic ? 'تبديل اللغة' : 'Language switcher'}>
            {/* We keep LanguageToggle simple: the project already has a component; use LinkL-based switch if needed */}
            {/* Using LinkL: /en/* and /ar/* are handled globally */}
            <LinkL to={isArabic ? window.location.pathname.replace('/ar', '/en') : window.location.pathname.replace('/en', '/ar')} className="inline-flex items-center gap-2 px-3 py-1 rounded border hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring">
              <span aria-hidden>🌐</span>
              <span className="text-sm font-medium">{isArabic ? 'English' : 'عربي'}</span>
              <span className="text-xs opacity-60">({isArabic ? 'EN' : 'AR'})</span>
            </LinkL>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main id="main" role="main" className="flex-1 w-full">
        <section className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {isArabic ? 'مستقبل الموارد البشرية' : 'The Future of HR'}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            {isArabic
              ? 'منصة شاملة لإدارة الموارد البشرية مصممة خصيصاً للسوق السعودي مع قدرات ذكاء اصطناعي متقدمة.'
              : 'A comprehensive HR platform designed for the Saudi market with advanced AI capabilities.'}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" aria-label={isArabic ? 'ابدأ الآن' : 'Get started now'}>
              <LinkL to="/auth">{isArabic ? 'ابدأ الآن' : 'Get Started'}</LinkL>
            </Button>
            <Button variant="outline" size="lg">{isArabic ? 'تعرف أكثر' : 'Learn More'}</Button>
          </div>
        </section>

        <section aria-labelledby="features-heading" className="mx-auto max-w-5xl px-4 pb-20">
          <h2 id="features-heading" className="sr-only">{isArabic ? 'الميزات' : 'Features'}</h2>
          <ul className="grid gap-6 sm:grid-cols-2" role="list">
            {[{
              Icon: Users,
              title: isArabic ? 'إدارة الموظفين' : 'Employee Management',
              desc: isArabic ? 'إدارة شاملة للبيانات والهيكل التنظيمي.' : 'Comprehensive data and org structure.'
            },{
              Icon: BarChart3,
              title: isArabic ? 'التحليلات' : 'Analytics',
              desc: isArabic ? 'رؤى قابلة للتنفيذ لاتخاذ قرارات أفضل.' : 'Actionable insights for better decisions.'
            },{
              Icon: Shield,
              title: isArabic ? 'الامتثال' : 'Compliance',
              desc: isArabic ? 'التزام كامل بأنظمة العمل السعودية.' : 'Full compliance with Saudi labor laws.'
            },{
              Icon: Zap,
              title: isArabic ? 'الأتمتة' : 'Automation',
              desc: isArabic ? 'أتمتة المهام الروتينية بكفاءة.' : 'Automate routine tasks efficiently.'
            }].map(({ Icon, title, desc }, i) => (
              <li key={i} className="rounded-lg border p-5 text-start focus-within:ring-2 focus-within:ring-ring">
                <div className="flex items-start gap-3">
                  <span aria-hidden className="mt-1 rounded-md bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="w-full border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2025 AqlHR • {isArabic ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</p>
        </div>
      </footer>
    </div>
  );
}

