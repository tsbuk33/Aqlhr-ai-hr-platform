import React from 'react';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RecruitmentDashboard from '@/components/recruitment/RecruitmentDashboard';

const RecruitmentOnboarding: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('recruitment.title')}</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('recruitment.dashboard')}</CardTitle>
        </CardHeader>
        <CardContent>
          <RecruitmentDashboard />
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruitmentOnboarding;