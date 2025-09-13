import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocale } from '@/i18n/locale';

export function HeroSection() {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-6">
        {/* Vision 2030 Badge */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-yellow-500 px-4 py-2 rounded-full text-white font-bold text-sm">
            رؤية2030
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            {isArabic ? 'نظام عقل للموارد البشرية' : 'AqlHR System'}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {isArabic 
              ? 'وجهة واحدة لإدارة وتطوير الموارد البشرية'
              : 'One destination for HR management and development'
            }
          </p>
        </div>

        {/* Why AqlHR Section */}
        <Card className="p-8 mb-12 bg-gradient-to-br from-surface to-surface-subtle">
          <h2 className="text-2xl font-bold mb-6">
            {isArabic ? 'لماذا اخترنا عقل HR' : 'Why we chose AqlHR'}
          </h2>
          <div className="space-y-4 text-left">
            <p className="text-muted-foreground leading-relaxed">
              {isArabic 
                ? 'اخترنا عقل HR لأنه يجمع بين فضيلة عربية عريقة والذكاء الاصطناعي من الجيل التالي:'
                : 'We selected AqlHR because it marries a time-honored Arabic virtue with next-generation AI:'
              }
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>"Aql" (عقل)</strong> {isArabic 
                ? 'يثير العقل البشري - الحكم المميز والمنطقي الذي يدعم الحكم الحكيم.'
                : 'evokes the human intellect—the discerning, reasoned judgment that underpins wise governance.'
              }
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {isArabic
                ? 'بإضافة "HR"، نشير إلى أن منصتنا لا تؤتمت المهام فحسب؛ بل تفكر وتتعلم وتوجه كل قرار امتثال وإدارة الأشخاص.'
                : 'By adding "HR," we signal that our platform doesn\'t merely automate tasks; it thinks, learns, and guides every compliance and people-management decision.'
              }
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {isArabic
                ? 'عقل HR يمثل عقلاً رقمياً - عقل يتوقع التحديات ويفسر البيانات بدقة ويقدم رؤى واضحة وقابلة للتنفيذ.'
                : 'AqlHR stands for a digital mind—one that anticipates challenges, interprets data with nuance, and delivers clear, actionable insights.'
              }
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {isArabic
                ? 'في اختيار عقل HR، نكرم قرون من التقاليد بينما نمكن مؤسستك بالبصيرة الذكية المطلوبة للتنقل في مشهد الموارد البشرية والامتثال المعقد اليوم.'
                : 'In choosing AqlHR, we honor centuries of tradition while empowering your organization with the intelligent foresight needed to navigate today\'s complex HR and compliance landscape.'
              }
            </p>
          </div>
        </Card>

        {/* Partnership Section */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-6 text-muted-foreground">
            {isArabic ? 'بالشراكة مع' : 'In partnership with'}
          </h3>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-yellow-500 px-4 py-2 rounded-lg">
              <span className="text-white font-bold">رؤية2030</span>
            </div>
            <div className="bg-surface-subtle px-4 py-2 rounded-lg">
              <span className="font-semibold">MOL</span>
            </div>
            <div className="bg-surface-subtle px-4 py-2 rounded-lg">
              <span className="font-semibold">QIWA</span>
            </div>
            <div className="bg-surface-subtle px-4 py-2 rounded-lg">
              <span className="font-semibold">GOSI</span>
            </div>
            <div className="bg-surface-subtle px-4 py-2 rounded-lg">
              <span className="font-semibold">ABSHER</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" className="px-8 py-3">
            {isArabic ? 'حجز موعد' : 'Book Appointment'}
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-3">
            {isArabic ? 'المساعد الافتراضي' : 'Virtual Assistant'}
          </Button>
        </div>
      </div>
    </div>
  );
}