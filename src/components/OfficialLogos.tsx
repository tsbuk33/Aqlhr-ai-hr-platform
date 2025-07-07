import React from 'react';
import { PartnerLogo } from './PartnerLogo';

export const OfficialLogos: React.FC = () => {
  return (
    <div className="bg-surface rounded-xl p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
        Official Saudi Arabia Initiatives
      </h3>
      <div className="flex flex-wrap justify-center items-center gap-8">
        <div className="flex items-center justify-center">
          <img
            src="/partners/vision2030.svg"
            alt="Saudi Vision 2030"
            className="h-16 w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center">
          <img
            src="/partners/expo2030.png"
            alt="Expo 2030 Riyadh"
            className="h-16 w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center">
          <img
            src="/partners/worldcup2034.png"
            alt="FIFA World Cup 2034 Saudi Arabia"
            className="h-16 w-auto object-contain"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-4">
        SanadHR - Supporting Saudi Arabia's Vision for the Future
      </p>
    </div>
  );
};