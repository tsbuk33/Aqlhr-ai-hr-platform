import React from 'react';
import { AdvancedPayrollDashboard } from '@/components/payroll/AdvancedPayrollDashboard';
import { useLanguage } from '@/hooks/useLanguage';

export const AdvancedPayrollPage: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="min-h-screen" dir={isArabic ? 'rtl' : 'ltr'}>
      <AdvancedPayrollDashboard />
    </div>
  );
};

export default AdvancedPayrollPage;