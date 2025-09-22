import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/i18n/locale';
import { getLang } from '@/lib/i18n/getLang';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';
import { useAuthOptional } from '@/lib/auth/useAuthOptional';
import { OSIOverview } from '@/components/diagnostic/OSIOverview';
import { OSILayers } from '@/components/diagnostic/OSILayers';
import { OSISaudizationByLayers } from '@/components/diagnostic/OSISaudizationByLayers';
import { OSISpan } from '@/components/diagnostic/OSISpan';
import { OSICost } from '@/components/diagnostic/OSICost';
import { OSIExport } from '@/components/diagnostic/OSIExport';
import { OSIDevToolbar } from '@/components/dev/OSIDevToolbar';
import { CrossLinksCard } from '@/components/diagnostic/CrossLinksCard';
import { useEntitlement } from '@/lib/core/useEntitlement';
import { EnhancedUpsellModal } from '@/components/core/EnhancedUpsellModal';
import * as osiAPI from '@/lib/api/osi';
import {
  Building2,
  TrendingUp,
  Layers,
  Target,
  Users,
  DollarSign,
  Download,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';

const OSI = () => {
  const { lang } = useParams();
  const isArabic = lang === 'ar';
  
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoSeeding, setAutoSeeding] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  
  const { toast } = useToast();
  const { locale, t } = useLocale();
  const { user } = useAuthOptional();
  
  // Check entitlement for OSI feature
  const { allowed: hasOSIAccess, loading: entitlementLoading } = useEntitlement('osi');
  
  const isRTL = isArabic;

  useEffect(() => {
    if (hasOSIAccess) {
      initializeTenant();
    } else if (!entitlementLoading) {
      setLoading(false);
    }
  }, [hasOSIAccess, entitlementLoading]);

  const initializeTenant = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const resolvedTenantId = await getTenantIdOrDemo();
      if (!resolvedTenantId) {
        throw new Error('No tenant ID available');
      }
      
      setTenantId(resolvedTenantId);

      // Check if we're in dev mode and need to seed data
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('dev') === '1') {
        // Check if we have any OSI overview data
        const overview = await osiAPI.getOverview(resolvedTenantId);
        
        if (!overview || overview.total_layers === 0) {
          console.log('Dev mode: auto-seeding OSI data...');
          setAutoSeeding(true);
          
          try {
            const seedSuccess = await osiAPI.seedDemo(resolvedTenantId);
            if (seedSuccess) {
              const computeSuccess = await osiAPI.computeNow(resolvedTenantId);
              if (computeSuccess) {
                console.log('Dev mode: OSI auto-seed completed successfully');
              } else {
                console.error('OSI auto-compute failed after seeding');
              }
            } else {
              console.error('OSI auto-seeding failed');
            }
          } catch (error) {
            console.error('OSI auto-seed error:', error);
          } finally {
            setAutoSeeding(false);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize OSI');
      console.error('OSI initialization error:', err);
      toast({
        title: isArabic ? 'خطأ' : 'Error',
        description: err.message || 'Failed to load OSI data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDataChanged = () => {
    // Trigger refresh of OSI data
    initializeTenant();
  };

  if (loading || entitlementLoading) {
    return (
      <div className="container mx-auto p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  // Show upsell if no access
  if (!hasOSIAccess) {
    return (
      <div className="container mx-auto p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {isArabic ? 'ذكاء الهيكل التنظيمي (OSI)' : 'Organizational Structure Intelligence (OSI)'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isArabic 
                ? 'تحليل متقدم للهيكل التنظيمي وتحسين الأداء'
                : 'Advanced organizational analysis and performance optimization'
              }
            </p>
          </div>
        </div>

        <Card className="text-center border-dashed">
          <CardContent className="p-12">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {isArabic ? 'ذكاء الهيكل التنظيمي مقفل' : 'OSI Intelligence Locked'}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {isArabic 
                ? 'الوصول إلى ذكاء الهيكل التنظيمي يتطلب الترقية إلى الخطة المؤسسية. احصل على رؤى عميقة حول هيكل مؤسستك وتحسينات الأداء.'
                : 'Access to OSI Intelligence requires upgrading to the Enterprise plan. Get deep insights into your organizational structure and performance optimizations.'
              }
            </p>
            <div className="space-y-2">
              <Button onClick={() => setShowUpsell(true)} size="lg">
                <Building2 className="w-4 h-4 me-2" />
                {isArabic ? 'ترقية للوصول' : 'Upgrade to Access'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <EnhancedUpsellModal
          isOpen={showUpsell}
          onClose={() => setShowUpsell(false)}
          feature="osi"
          requiredPlan="enterprise"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isArabic ? 'خطأ في التهيئة' : 'Initialization Error'}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {error}
            </p>
            <Button onClick={initializeTenant} variant="outline">
              {isArabic ? 'إعادة المحاولة' : 'Retry'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tenantId) {
    return (
      <div className="container mx-auto p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center py-12">
          <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">{isArabic ? 'الوصول مطلوب' : 'Access Required'}</h1>
          <p className="text-muted-foreground mb-6">
            {isArabic ? 'يجب تسجيل الدخول للوصول إلى هذه الميزة' : 'Please log in to access this feature'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'} key={locale}>
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          {isArabic ? 'ذكاء الهيكل التنظيمي' : 'Organizational Structure Intelligence'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isArabic ? 'تحليل متقدم للهيكل التنظيمي وتحسين الأداء' : 'Advanced organizational analysis and performance optimization'}
        </p>
      </div>

      <OSIDevToolbar tenantId={tenantId} onDataChanged={handleDataChanged} />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">{isArabic ? 'نظرة عامة' : 'Overview'}</span>
          </TabsTrigger>
          <TabsTrigger value="layers" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">{isArabic ? 'الطبقات' : 'Layers'}</span>
          </TabsTrigger>
          <TabsTrigger value="saudization" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">{isArabic ? 'السعودة حسب الطبقات' : 'Saudization by Layers'}</span>
          </TabsTrigger>
          <TabsTrigger value="span" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{isArabic ? 'نطاق الإدارة' : 'Management Span'}</span>
          </TabsTrigger>
          <TabsTrigger value="cost" className="flex items-center gap-2">
            <CurrencyIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{isArabic ? 'تكلفة الإدارة' : 'Cost of Management'}</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{isArabic ? 'التصدير' : 'Export'}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OSIOverview tenantId={tenantId} />
        </TabsContent>

        <TabsContent value="layers" className="space-y-6">
          <OSILayers tenantId={tenantId} />
        </TabsContent>

        <TabsContent value="saudization" className="space-y-6">
          <OSISaudizationByLayers tenantId={tenantId} />
        </TabsContent>

        <TabsContent value="span" className="space-y-6">
          <OSISpan tenantId={tenantId} />
        </TabsContent>

        <TabsContent value="cost" className="space-y-6">
          <OSICost tenantId={tenantId} />
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <OSIExport tenantId={tenantId} />
            </div>
            <div className="lg:col-span-1">
              <CrossLinksCard 
                module="osi"
                context="Organizational structure analysis"
                recommendations={[
                  'Review span of control',
                  'Optimize layer structure', 
                  'Improve saudization by layer'
                ]}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upsell Modal */}
      <EnhancedUpsellModal
        isOpen={showUpsell}
        onClose={() => setShowUpsell(false)}
        feature="osi"
        requiredPlan="enterprise"
      />
    </div>
  );
};

export default OSI;