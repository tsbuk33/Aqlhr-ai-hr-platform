import React from 'react';
import { centerStyleObject } from '@/hooks/useForceCenterStyle';

interface ForceCenterWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const ForceCenterWrapper: React.FC<ForceCenterWrapperProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div 
      style={centerStyleObject} 
      className={`force-center ${className}`}
    >
      {children}
    </div>
  );
};