import React from 'react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { HeroSection } from '@/components/landing/HeroSection';
import { ExecutiveDashboardSection } from '@/components/landing/ExecutiveDashboardSection';
import { DataUploadSection } from '@/components/landing/DataUploadSection';
import { RecentActivitiesSection } from '@/components/landing/RecentActivitiesSection';
import { AnnouncementsSection } from '@/components/landing/AnnouncementsSection';
import { PartnershipSection } from '@/components/landing/PartnershipSection';

export default function AqlHRLanding() {
  const { isRTL } = useUnifiedLocale();

  return (
    <div 
      className="min-h-screen bg-background text-foreground"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-surface-subtle to-surface">
        <HeroSection />
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Executive Dashboard Section */}
        <section>
          <ExecutiveDashboardSection />
        </section>

        {/* Two Column Layout for Activities and Announcements */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentActivitiesSection />
          <AnnouncementsSection />
        </section>

        {/* Data Upload Section */}
        <section>
          <DataUploadSection />
        </section>

        {/* Partnership Section */}
        <section>
          <PartnershipSection />
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-surface border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              {isRTL 
                ? '© 2024 عقل للموارد البشرية. جميع الحقوق محفوظة.'
                : '© 2024 AqlHR. All rights reserved.'
              }
            </p>
            <p className="text-xs mt-2">
              {isRTL 
                ? 'منصة ذكية لإدارة الموارد البشرية مدعومة بالذكاء الاصطناعي'
                : 'AI-Powered Smart HR Management Platform'
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}