import React from 'react';
import { PartnerLogo } from './PartnerLogo';
import { useLanguage } from '@/contexts/LanguageContext';

export const GlobalFooter: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">SanadHR</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('footer.sanadhr_desc')}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('footer.all_rights')}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">{t('footer.quick_links')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/core-hr" className="hover:text-foreground transition-colors">{t('nav.core_hr')}</a></li>
              <li><a href="/payroll" className="hover:text-foreground transition-colors">{t('nav.payroll')}</a></li>
              <li><a href="/ai-features" className="hover:text-foreground transition-colors">{t('nav.ai_features')}</a></li>
              <li><a href="/government" className="hover:text-foreground transition-colors">{t('nav.government')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t('footer.riyadh')}</li>
              <li>info@sanadhr.com</li>
              <li>+966 11 XXX XXXX</li>
            </ul>
          </div>
        </div>

        {/* National Initiatives Section */}
        <section className="mt-8 space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground">
            {t('footer.national_initiatives')}
          </h4>

          <div className="flex flex-wrap gap-6 items-center">
            <PartnerLogo
              src="/partners/worldcup2034-official.svg"
              alt="FIFA World Cup 2034 Saudi Arabia"
              href="https://saudi2034.com.sa/"
            />
            <PartnerLogo
              src="/partners/expo2030-official.svg"
              alt="Expo 2030 Riyadh"
              href="https://www.expo2030riyadh.sa/"
            />
            <PartnerLogo
              src="/partners/vision2030.svg"
              alt="Saudi Vision 2030"
              href="https://vision2030.gov.sa/"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {t('footer.vision_support')}
          </p>
        </section>
      </div>
    </footer>
  );
};