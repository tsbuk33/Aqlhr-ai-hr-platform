import React from 'react';
import { HRCoreManager } from '@/components/hr/HRCoreManager';
import { GovernmentIntegrationPanel } from '@/components/government/GovernmentIntegrationPanel';
import { UserManagementPanel } from '@/components/user/UserManagementPanel';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const CoreBusinessTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Core Business Logic Framework
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Phase 4: Comprehensive HR core modules, government integration, and user management system
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <HRCoreManager />
          </section>

          <section>
            <GovernmentIntegrationPanel />
          </section>

          <section>
            <UserManagementPanel />
          </section>
        </div>

        {/* AI Integration for Core Business Logic */}
        <UniversalAIIntegrator 
          pageType="platform" 
          moduleName="core-business-logic" 
          companyId="demo-company" 
          enabledFeatures={['intelligent-automation', 'government-integration', 'user-management', 'audit-trails']}
        />
      </div>
    </div>
  );
};

export default CoreBusinessTest;