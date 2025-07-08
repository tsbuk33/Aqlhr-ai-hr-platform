import React from 'react';

interface ScreenReaderTextProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export const ScreenReaderText: React.FC<ScreenReaderTextProps> = ({ 
  children, 
  as: Component = 'span',
  className = '' 
}) => {
  return (
    <Component 
      className={`sr-only ${className}`}
      aria-live="polite"
    >
      {children}
    </Component>
  );
};