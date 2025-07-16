import React from 'react';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { Vision2030Logo } from './Vision2030Logo';
import { SaudiPartnerLogos } from './SaudiPartnerLogos';

export const SaudiHeroSection: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="relative overflow-hidden bg-[hsl(240_30%_15%)] min-h-[400px]">
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
            <h1 className={`text-4xl md:text-6xl font-bold text-white font-saudi-heading ${isArabic ? 'font-arabic' : ''}`}>
              {isArabic ? 'نظام إيه كيو إل إتش ار للموارد البشرية' : 'AqlHR System'}
            </h1>
            <p className={`text-xl md:text-2xl text-white/90 max-w-3xl mx-auto ${isArabic ? 'font-arabic' : ''}`}>
              {isArabic 
                ? 'وجهة واحدة لإدارة وتطوير الموارد البشرية'
                : 'One destination for HR management and development'
              }
            </p>
          </div>

          {/* Partner Logos */}
          <div className="pt-8">
            <p className={`text-white/70 mb-6 ${isArabic ? 'font-arabic' : ''}`}>
              {isArabic ? 'بالتعاون مع' : 'In partnership with'}
            </p>
            <SaudiPartnerLogos showLabels={false} />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="px-8 py-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg font-medium transition-all">
              {isArabic ? 'حجز موعد' : 'Book Appointment'}
            </button>
            <button className="px-8 py-3 bg-white/10 text-white border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-all backdrop-blur-sm">
              {isArabic ? 'المساعد الافتراضي' : 'Virtual Assistant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};