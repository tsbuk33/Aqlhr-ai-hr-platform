import React from 'react';
import { useParams } from 'react-router-dom';
import { useEntitlement } from '@/lib/core/useEntitlement';
import { EnhancedUpsellModal } from '@/components/core/EnhancedUpsellModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import ComplianceAutopilot from './ComplianceAutopilot';

const ComplianceAutopilotGated = () => {
  const { lang } = useParams();
  const isArabic = lang === 'ar';
  const [showUpsell, setShowUpsell] = React.useState(false);
  
  const { allowed: hasComplianceAccess, loading } = useEntitlement('compliance');

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded-lg w-1/3"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!hasComplianceAccess) {
    return (
      <div className="container mx-auto p-6 space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {isArabic ? 'الامتثال الآلي' : 'Compliance Autopilot'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isArabic 
                ? 'مراقبة وتقارير الامتثال الآلية'
                : 'Automated compliance monitoring and reporting'
              }
            </p>
          </div>
        </div>

        <Card className="text-center border-dashed">
          <CardContent className="p-12">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {isArabic ? 'الامتثال الآلي مقفل' : 'Compliance Autopilot Locked'}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {isArabic 
                ? 'الوصول إلى الامتثال الآلي يتطلب الترقية إلى الخطة المؤسسية. احصل على مراقبة آلية للامتثال والتقارير التلقائية.'
                : 'Access to Compliance Autopilot requires upgrading to the Enterprise plan. Get automated compliance monitoring and reporting.'
              }
            </p>
            <Button onClick={() => setShowUpsell(true)} size="lg">
              <Shield className="w-4 h-4 me-2" />
              {isArabic ? 'ترقية للوصول' : 'Upgrade to Access'}
            </Button>
          </CardContent>
        </Card>

        <EnhancedUpsellModal
          isOpen={showUpsell}
          onClose={() => setShowUpsell(false)}
          feature="compliance"
          requiredPlan="enterprise"
        />
      </div>
    );
  }

  return <ComplianceAutopilot />;
};

export default ComplianceAutopilotGated;