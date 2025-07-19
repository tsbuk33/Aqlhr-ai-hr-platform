import React from 'react';
import { cn } from '@/lib/utils';

interface DarkModeTextProps {
  children: React.ReactNode;
  variant?: 'default' | 'muted' | 'subtle' | 'heading';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const DarkModeText: React.FC<DarkModeTextProps> = ({ 
  children, 
  variant = 'default', 
  className = '',
  as: Component = 'div'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'heading':
        return 'text-foreground dark:text-foreground';
      case 'muted':
        return 'text-foreground-muted dark:text-foreground-muted';
      case 'subtle':
        return 'text-foreground-subtle dark:text-foreground-subtle';
      default:
        return 'text-foreground dark:text-foreground';
    }
  };

  return (
    <Component className={cn(getVariantClasses(), className)}>
      {children}
    </Component>
  );
};

// Utility function to get consistent dark mode text classes
export const getDarkModeTextClasses = (variant: 'default' | 'muted' | 'subtle' | 'heading' = 'default') => {
  switch (variant) {
    case 'heading':
      return 'text-foreground dark:text-foreground';
    case 'muted':
      return 'text-foreground-muted dark:text-foreground-muted';
    case 'subtle':
      return 'text-foreground-subtle dark:text-foreground-subtle';
    default:
      return 'text-foreground dark:text-foreground';
  }
};