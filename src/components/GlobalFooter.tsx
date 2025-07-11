import React from 'react';
import { PartnerLogo } from './PartnerLogo';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { HijriCalendarWidget } from '@/components/calendar/HijriCalendarWidget';
export const GlobalFooter: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  return <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-6 py-8">
        {/* Calendar Widget - Mobile Only */}
        <div className="lg:hidden mb-6">
          <HijriCalendarWidget />
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {isArabic ? 'منصة ذكية ومتطورة لإدارة الموارد البشرية في المملكة العربية السعودية' : 'Advanced intelligent platform for Human Resources Management in Saudi Arabia'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'جميع الحقوق محفوظة © 2024' : 'All rights reserved © 2024'}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">{isArabic ? 'روابط سريعة' : 'Quick Links'}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/core-hr" className="hover:text-foreground transition-colors">{isArabic ? 'الموارد البشرية الأساسية' : 'Core HR'}</a></li>
              <li><a href="/payroll" className="hover:text-foreground transition-colors">{isArabic ? 'الرواتب' : 'Payroll'}</a></li>
              <li><a href="/ai-automation" className="hover:text-foreground transition-colors">{isArabic ? 'الأتمتة بالذكاء الاصطناعي' : 'AI Automation'}</a></li>
              <li><a href="/government" className="hover:text-foreground transition-colors">{isArabic ? 'التكاملات الحكومية' : 'Government'}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">{isArabic ? 'تواصل معنا' : 'Contact'}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{isArabic ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}</li>
              <li>info@sanadhr.com</li>
              <li>+966 11 XXX XXXX</li>
            </ul>
          </div>
        </div>

        {/* National Initiatives Section */}
        <section className="mt-8 space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground">
            {isArabic ? 'المبادرات الوطنية' : 'National Initiatives'}
          </h4>

          <div className="flex flex-wrap gap-6 items-center">
            <PartnerLogo src="/partners/worldcup2034-official.svg" alt="FIFA World Cup 2034 Saudi Arabia" href="https://saudi2034.com.sa/" />
            <PartnerLogo src="/partners/expo2030-official.svg" alt="Expo 2030 Riyadh" href="https://www.expo2030riyadh.sa/" />
            <PartnerLogo src="/partners/vision2030.svg" alt="Saudi Vision 2030" href="https://vision2030.gov.sa/" />
          </div>
          <p className="text-xs text-muted-foreground">
            {isArabic ? 'دعم رؤية المملكة 2030 من خلال حلول الموارد البشرية المتقدمة' : 'Supporting Saudi Vision 2030 through advanced HR solutions'}
          </p>
        </section>
      </div>
    </footer>;
};