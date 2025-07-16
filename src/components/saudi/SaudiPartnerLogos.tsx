import React from 'react';
import { Vision2030Logo } from './Vision2030Logo';

interface SaudiPartnerLogosProps {
  className?: string;
  showLabels?: boolean;
}

export const SaudiPartnerLogos: React.FC<SaudiPartnerLogosProps> = ({ 
  className = '',
  showLabels = true 
}) => {
  const partners = [
    { name: 'وزارة العمل', nameEn: 'Ministry of Labor', logo: 'MOL' },
    { name: 'نظام قوى', nameEn: 'Qiwa Platform', logo: 'QIWA' },
    { name: 'التأمينات الاجتماعية', nameEn: 'GOSI', logo: 'GOSI' },
    { name: 'أبشر', nameEn: 'Absher', logo: 'ABSHER' }
  ];

  const PartnerLogo = ({ partner }: { partner: typeof partners[0] }) => (
    <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-xs">{partner.logo}</span>
      </div>
      {showLabels && (
        <div className="text-center">
          <p className="text-white text-xs font-arabic">{partner.name}</p>
          <p className="text-white/70 text-xs">{partner.nameEn}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
      <Vision2030Logo size="sm" />
      <div className="flex flex-wrap gap-3">
        {partners.map((partner, index) => (
          <PartnerLogo key={index} partner={partner} />
        ))}
      </div>
    </div>
  );
};