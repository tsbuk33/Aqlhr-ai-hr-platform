import React from 'react';
import vision2030Logo from '@/assets/saudi-vision-2030.svg';
import worldCup2034Logo from '@/assets/saudi-2034-logo.png';
import expo2030Logo from '@/assets/expo-2030-riyadh-logo.png';

export const OfficialLogos: React.FC = () => {
  return (
    <div className="bg-surface rounded-xl p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
        Official Saudi Arabia Initiatives
      </h3>
      <div className="flex flex-wrap justify-center items-center gap-8">
        <div className="flex flex-col items-center space-y-2">
          <img 
            src={vision2030Logo} 
            alt="Saudi Vision 2030" 
            className="h-16 w-auto object-contain"
          />
          <span className="text-sm text-muted-foreground">Vision 2030</span>
        </div>
        
        <div className="flex flex-col items-center space-y-2">
          <img 
            src={expo2030Logo} 
            alt="Riyadh Expo 2030" 
            className="h-16 w-auto object-contain"
          />
          <span className="text-sm text-muted-foreground">Riyadh Expo 2030</span>
        </div>
        
        <div className="flex flex-col items-center space-y-2">
          <img 
            src={worldCup2034Logo} 
            alt="FIFA World Cup 2034 Saudi Arabia" 
            className="h-16 w-auto object-contain"
          />
          <span className="text-sm text-muted-foreground">World Cup 2034</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-4">
        SanadHR - Supporting Saudi Arabia's Vision for the Future
      </p>
    </div>
  );
};