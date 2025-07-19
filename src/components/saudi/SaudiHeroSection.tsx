import React from 'react';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { Vision2030Logo } from './Vision2030Logo';
import { SaudiPartnerLogos } from './SaudiPartnerLogos';

export const SaudiHeroSection: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="relative overflow-hidden bg-[hsl(240_30%_15%)] dark:bg-[hsl(240_40%_8%)] min-h-[400px]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="text-center space-y-8">
          {/* Vision 2030 Logo */}
          <div className="flex justify-center">
            <Vision2030Logo size="lg" />
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white dark:text-white font-saudi-heading ${isArabic ? 'font-arabic text-center' : ''}`}>
              {isArabic ? 'نظام إيه كيو إل إتش ار للموارد البشرية' : 'AqlHR System'}
            </h1>
            <p className={`text-base md:text-lg text-white/90 dark:text-white/90 max-w-3xl mx-auto ${isArabic ? 'font-arabic' : ''}`}>
              {isArabic 
                ? 'وجهة واحدة لإدارة وتطوير الموارد البشرية'
                : 'One destination for HR management and development'
              }
            </p>
            
            {/* AqlHR Name Explanation - Arabic Only */}
            {isArabic && (
              <div className="mt-8 max-w-4xl mx-auto text-white/80 dark:text-white/85 text-sm md:text-base leading-relaxed font-arabic space-y-3">
                <p>لقد اخترنا اسم AqlHR (عقل HR) للأسباب التالية:</p>
                <p>"عقل" يرمز إلى القوة الإدراكية وحكمة القرار، وهو الأساس الذي تقوم عليه نظم الحوكمة الفعّالة.</p>
                <p>بإضافة "HR"، نُبرز أن منصتنا لا تكتفي بالأتمتة؛ بل تفكّر وتتعلم وتقود كل قرارٍ في إدارة الأفراد والالتزام التنظيمي.</p>
                <p>AqlHR تمثّل العقل الرقمي الذي يستشرف التحديات، يحلل البيانات بدقة، ويقدّم رؤىً عملية تسهّل اتخاذ القرارات السليمة في بيئة الموارد البشرية المعقدة.</p>
                <p>بهذا الاسم، نربط بين العراقة العربية في تقدير "العقل" وبين قوة الذكاء الاصطناعي لتمكين منظمتكم من تحقيق أفضل مستويات الحوكمة والامتثال.</p>
              </div>
            )}

            {/* AqlHR Name Explanation - English Only */}
            {!isArabic && (
              <div className="mt-8 max-w-4xl mx-auto text-white/80 dark:text-white/85 text-sm md:text-base leading-relaxed space-y-3">
                <p>Why we chose AqlHR</p>
                <p>We selected AqlHR because it marries a time-honored Arabic virtue with next-generation AI:</p>
                <p>"Aql" (عقل) evokes the human intellect—the discerning, reasoned judgment that underpins wise governance.</p>
                <p>By adding "HR," we signal that our platform doesn't merely automate tasks; it thinks, learns, and guides every compliance and people-management decision.</p>
                <p>AqlHR stands for a digital mind—one that anticipates challenges, interprets data with nuance, and delivers clear, actionable insights.</p>
                <p>In choosing AqlHR, we honor centuries of tradition while empowering your organization with the intelligent foresight needed to navigate today's complex HR and compliance landscape.</p>
              </div>
            )}
          </div>

          {/* Partner Logos */}
          <div className="pt-8">
            <p className={`text-white/70 dark:text-white/75 mb-6 ${isArabic ? 'font-arabic' : ''}`}>
              {isArabic ? 'بالتعاون مع' : 'In partnership with'}
            </p>
            <SaudiPartnerLogos showLabels={false} />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="px-8 py-3 bg-primary hover:bg-primary-hover text-primary-foreground dark:bg-primary dark:hover:bg-primary-hover dark:text-primary-foreground rounded-lg font-medium transition-all">
              {isArabic ? 'حجز موعد' : 'Book Appointment'}
            </button>
            <button className="px-8 py-3 bg-white/10 dark:bg-white/15 text-white dark:text-white border border-white/30 dark:border-white/40 rounded-lg font-medium hover:bg-white/20 dark:hover:bg-white/25 transition-all backdrop-blur-sm">
              {isArabic ? 'المساعد الافتراضي' : 'Virtual Assistant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};