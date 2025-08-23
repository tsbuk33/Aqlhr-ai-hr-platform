import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';
import { getLang } from '@/lib/i18n/getLang';
import { useRetention } from '@/hooks/useRetention';
import { RetentionOverview } from '@/components/diagnostic/retention/RetentionOverview';
import { RetentionDrivers } from '@/components/diagnostic/retention/RetentionDrivers';
import { RetentionWatchlist } from '@/components/diagnostic/retention/RetentionWatchlist';
import { RetentionActions } from '@/components/diagnostic/retention/RetentionActions';
import { RetentionExport } from '@/components/diagnostic/retention/RetentionExport';
import { CrossLinksCard } from '@/components/diagnostic/CrossLinksCard';
import { DevToolbar } from '@/components/dev/DevToolbar';
import { useAuthOptional } from '@/lib/auth/useAuthOptional';
import { useEntitlement } from '@/lib/core/useEntitlement';
import { EnhancedUpsellModal } from '@/components/core/EnhancedUpsellModal';
import { supabase } from '@/integrations/supabase/client';
import * as retentionAPI from '@/lib/api/retention';
import { Database, Target, Shield } from 'lucide-react';

const Retention = () => {
  const { lang } = useParams();
  const isArabic = lang === 'ar';
  
  const [tenantId, setTenantId] = React.useState<string | null>(null);
  const [showUpsell, setShowUpsell] = useState(false);
  const { user } = useAuthOptional();
  const retentionData = useRetention(tenantId);
  const [autoSeeding, setAutoSeeding] = useState(false);
  
  // Check entitlement for retention feature
  const { allowed: hasRetentionAccess, loading: entitlementLoading } = useEntitlement('retention');

  // Get tenant ID and seed demo data if needed
  useEffect(() => {
    const initializeTenant = async () => {
      if (!hasRetentionAccess && !entitlementLoading) return;
      
      let id: string | null = null;
      try {
        id = await getTenantIdOrDemo();
        setTenantId(id);
        
        // Check if we're in dev mode and need to seed data
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('dev') === '1' && id && hasRetentionAccess) {
          // Check if we have any retention overview data
          const overview = await retentionAPI.getOverview(id);
          
          if (!overview || overview.total_employees === 0) {
            console.log('Dev mode: auto-seeding retention data...');
            setAutoSeeding(true);
            
            try {
              const seedSuccess = await retentionAPI.seedDemo(id);
              if (seedSuccess) {
                const computeSuccess = await retentionAPI.computeNow(id);
                if (computeSuccess) {
                  console.log('Dev mode: auto-seed completed successfully');
                  // Trigger a refetch
                  retentionData.refetch();
                } else {
                  console.error('Auto-compute failed after seeding');
                }
              } else {
                console.error('Auto-seeding failed');
              }
            } catch (error) {
              console.error('Auto-seed error:', error);
              // Log to ui_events
              await supabase.from('ui_events').insert({
                tenant_id: id,
                event_type: 'error',
                level: 'error',
                page: '/diagnostic/retention',
                message: 'Auto-seed failed in dev mode',
                metadata: { error: error instanceof Error ? error.message : String(error) }
              });
            } finally {
              setAutoSeeding(false);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing tenant:', error);
        // Log to ui_events
        if (tenantId || id) {
          await supabase.from('ui_events').insert({
            tenant_id: tenantId || id,
            event_type: 'error',
            level: 'error',
            page: '/diagnostic/retention',
            message: 'Failed to initialize retention module',
            metadata: { error: error instanceof Error ? error.message : String(error) }
          });
        }
      }
    };

    initializeTenant();
  }, [hasRetentionAccess, entitlementLoading]);

  // Get translation function
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = {
      retention: {
        title: isArabic ? "تحليلات الاحتفاظ" : "Retention Analytics",
        description: isArabic 
          ? "تحليل شامل لمخاطر ترك الموظفين وتطوير استراتيجيات الاحتفاظ"
          : "Comprehensive employee turnover risk analysis and retention strategy development",
        tabs: {
          overview: isArabic ? "نظرة عامة" : "Overview",
          drivers: isArabic ? "محركات الخطر" : "Drivers", 
          watchlist: isArabic ? "قائمة المراقبة" : "Watchlist",
          actions: isArabic ? "الإجراءات" : "Actions",
          export: isArabic ? "التصدير" : "Export"
        },
        noData: {
          title: isArabic ? "لا توجد بيانات حتى الآن" : "No data yet",
          description: isArabic 
            ? "لم يتم العثور على بيانات تحليل الاحتفاظ لهذا المستأجر."
            : "No retention analysis data found for this tenant.",
          seedButton: isArabic ? "توليد بيانات تجريبية" : "Seed Demo Data"
        }
      }
    };
    
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const handleDataChanged = () => {
    retentionData.refetch();
  };

  const handleActionClick = (actionType: string) => {
    if (!hasRetentionAccess) {
      setShowUpsell(true);
      return;
    }
    // Handle action logic here
  };

  if (entitlementLoading) {
    return (
      <div className={`container mx-auto p-6 space-y-6 ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded-lg w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show upsell if no access
  if (!hasRetentionAccess) {
    return (
      <div className={`container mx-auto p-6 space-y-6 ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {t('retention.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('retention.description')}
            </p>
          </div>
        </div>

        <Card className="text-center border-dashed">
          <CardContent className="p-12">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {isArabic ? 'تحليلات الاحتفاظ مقفلة' : 'Retention Analytics Locked'}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {isArabic 
                ? 'الوصول إلى تحليلات الاحتفاظ يتطلب الترقية إلى الخطة المؤسسية. احصل على رؤى قوية حول مخاطر دوران الموظفين وإجراءات الاحتفاظ.'
                : 'Access to Retention Analytics requires upgrading to the Enterprise plan. Get powerful insights into employee turnover risks and retention actions.'
              }
            </p>
            <div className="space-y-2">
              <Button onClick={() => setShowUpsell(true)} size="lg">
                <Shield className="w-4 h-4 me-2" />
                {isArabic ? 'ترقية للوصول' : 'Upgrade to Access'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <EnhancedUpsellModal
          isOpen={showUpsell}
          onClose={() => setShowUpsell(false)}
          feature="retention"
          requiredPlan="enterprise"
        />
      </div>
    );
  }

  // Show empty state if no data and not loading
  const showEmptyState = !retentionData.loading && !autoSeeding && 
    (!retentionData.overview || retentionData.overview.total_employees === 0);

  const urlParams = new URLSearchParams(window.location.search);
  const isDevMode = urlParams.get('dev') === '1';

  return (
    <div className={`container mx-auto p-6 space-y-6 ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('retention.title')}</h1>
        <p className="text-muted-foreground">
          {t('retention.description')}
        </p>
      </div>

      <DevToolbar tenantId={tenantId} onDataChanged={handleDataChanged} />

      {showEmptyState ? (
        <Card className="text-center py-12">
          <CardHeader>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Database className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>{t('retention.noData.title')}</CardTitle>
            <CardDescription className="max-w-md mx-auto">
              {t('retention.noData.description')}
            </CardDescription>
          </CardHeader>
          {isDevMode && (
            <CardContent>
              <Button 
                onClick={async () => {
                  setAutoSeeding(true);
                  try {
                    if (tenantId) {
                      await retentionAPI.seedDemo(tenantId);
                      await retentionAPI.computeNow(tenantId);
                      handleDataChanged();
                    }
                  } finally {
                    setAutoSeeding(false);
                  }
                }}
                disabled={autoSeeding}
                className="mx-auto"
              >
                <Target className="mr-2 h-4 w-4" />
                {autoSeeding ? (isArabic ? "جاري التوليد..." : "Seeding...") : t('retention.noData.seedButton')}
              </Button>
            </CardContent>
          )}
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t('retention.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="drivers">{t('retention.tabs.drivers')}</TabsTrigger>
            <TabsTrigger value="watchlist">{t('retention.tabs.watchlist')}</TabsTrigger>
            <TabsTrigger value="actions">{t('retention.tabs.actions')}</TabsTrigger>
            <TabsTrigger value="export">{t('retention.tabs.export')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <RetentionOverview {...retentionData} tenantId={tenantId} />
          </TabsContent>

          <TabsContent value="drivers" className="mt-6">
            <RetentionDrivers {...retentionData} tenantId={tenantId} />
          </TabsContent>

          <TabsContent value="watchlist" className="mt-6">
            <RetentionWatchlist {...retentionData} tenantId={tenantId} />
          </TabsContent>

          <TabsContent value="actions" className="mt-6">
            <RetentionActions {...retentionData} tenantId={tenantId} />
          </TabsContent>

        <TabsContent value="export" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RetentionExport {...retentionData} tenantId={tenantId} />
            </div>
            <div className="lg:col-span-1">
              <CrossLinksCard 
                module="retention"
                context={`${retentionData.overview?.avg_risk || 0}% avg risk, ${retentionData.overview?.pct_high || 0}% high risk`}
                recommendations={[
                  'Focus on high-risk departments',
                  'Implement stay interviews', 
                  'Review compensation gaps'
                ]}
              />
            </div>
          </div>
        </TabsContent>
        </Tabs>
      )}
      
      {/* Upsell Modal */}
      <EnhancedUpsellModal
        isOpen={showUpsell}
        onClose={() => setShowUpsell(false)}
        feature="retention"
        requiredPlan="enterprise"
      />
    </div>
  );
};

export default Retention;