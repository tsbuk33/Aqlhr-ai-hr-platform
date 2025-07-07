import React from 'react';
import { PartnerLogo } from './PartnerLogo';

export const OfficialLogos: React.FC = () => {
  return (
    <div className="bg-surface rounded-xl p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
        Official Saudi Arabia Initiatives
      </h3>
      <div className="flex flex-wrap justify-center items-center gap-8">
        <PartnerLogo 
          src="/partners/vision2030.svg" 
          alt="Saudi Vision 2030" 
          href="https://vision2030.gov.sa"
        />
        <PartnerLogo 
          src="/partners/expo2030.svg" 
          alt="Expo 2030 Riyadh" 
          href="https://www.expo2030riyadh.sa/"
        />
        <PartnerLogo 
          src="/partners/worldcup2034.svg" 
          alt="FIFA World Cup 2034 Saudi Arabia" 
          href="https://saudi2034.com.sa/"
        />
      </div>
      <p className="text-xs text-muted-foreground text-center mt-4">
        SanadHR - Supporting Saudi Arabia's Vision for the Future
      </p>
    </div>
  );
};