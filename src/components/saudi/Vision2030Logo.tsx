import React from 'react';

interface Vision2030LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Vision2030Logo: React.FC<Vision2030LogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-16',
    md: 'h-12 w-24',
    lg: 'h-16 w-32'
  };

  return (
    <div className={`flex items-center ${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 200 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vision 2030 Logo Background */}
        <rect width="200" height="100" fill="url(#visionGradient)" rx="8"/>
        
        {/* Arabic Text - رؤية */}
        <text
          x="100"
          y="35"
          textAnchor="middle"
          className="font-arabic text-white"
          fontSize="24"
          fontWeight="700"
        >
          رؤية
        </text>
        
        {/* 2030 Text */}
        <text
          x="100"
          y="65"
          textAnchor="middle"
          className="text-white"
          fontSize="28"
          fontWeight="800"
          letterSpacing="2"
        >
          2030
        </text>
        
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="visionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(120 100% 25%)" />
            <stop offset="50%" stopColor="hsl(45 100% 50%)" />
            <stop offset="100%" stopColor="hsl(120 100% 30%)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};