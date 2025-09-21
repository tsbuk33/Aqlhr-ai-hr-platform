import React from 'react';
import { Coins } from 'lucide-react';

interface CurrencyIconProps {
  className?: string;
  currency?: 'SAR' | 'USD';
}

/**
 * Centralized currency icon component for AqlHR
 * Always displays Saudi Riyal coin icon for consistency
 */
export const CurrencyIcon: React.FC<CurrencyIconProps> = ({ 
  className = "h-4 w-4", 
  currency = 'SAR' 
}) => {
  // Always use Coins icon for Saudi Riyal (SAR) - no USD support in AqlHR
  return <Coins className={className} />;
};

export default CurrencyIcon;