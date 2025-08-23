import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';
import { getLang } from '@/lib/i18n/getLang';
import { useRetention } from '@/hooks/useRetention';
import { RetentionOverview } from '@/components/diagnostic/retention/RetentionOverview';
import { RetentionDrivers } from '@/components/diagnostic/retention/RetentionDrivers';
import { RetentionWatchlist } from '@/components/diagnostic/retention/RetentionWatchlist';
import { RetentionActions } from '@/components/diagnostic/retention/RetentionActions';
import { RetentionExport } from '@/components/diagnostic/retention/RetentionExport';
import { useAuthOptional } from '@/lib/auth/useAuthOptional';
import { supabase } from '@/integrations/supabase/client';

const Retention = () => {
  const lang = getLang();
  const [tenantId, setTenantId] = React.useState<string | null>(null);
  const { user } = useAuthOptional();
  const retentionData = useRetention(tenantId);

  // Get tenant ID and seed demo data if needed
  useEffect(() => {
    const initializeTenant = async () => {
      let id: string | null = null;
      try {
        id = await getTenantIdOrDemo();
        setTenantId(id);
        
        // Check if we're in dev mode and need to seed data
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('dev') === '1' && id) {
          // Check if we have any retention data first
          const { data: existingRisks } = await supabase
            .from('retention_risks')
            .select('id')
            .eq('tenant_id', id)
            .gte('period_month', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
            .limit(1);
          
          if (!existingRisks || existingRisks.length === 0) {
            console.log('Dev mode: seeding retention demo data...');
            
            // First seed demo data
            const { error: seedError } = await supabase.rpc('retention_seed_demo_v1', { 
              p_tenant: id 
            });
            
            if (seedError) {
              console.error('Seed error:', seedError);
            } else {
              // Then compute current month
              const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
              const { error: computeError } = await supabase.rpc('retention_compute_v1', {
                p_tenant: id,
                p_month: currentMonth
              });
              
              if (computeError) {
                console.error('Compute error:', computeError);
              } else {
                console.log('Dev mode: retention data seeded and computed successfully');
              }
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
  }, []);

  // Get translation function
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = {
      retention: {
        title: lang === 'ar' ? "استراتيجية الاحتفاظ" : "Retention Strategy",
        tabs: {
          overview: lang === 'ar' ? "نظرة عامة" : "Overview",
          drivers: lang === 'ar' ? "محركات الخطر" : "Drivers", 
          watchlist: lang === 'ar' ? "قائمة المراقبة" : "Watchlist",
          actions: lang === 'ar' ? "الإجراءات" : "Actions",
          export: lang === 'ar' ? "التصدير" : "Export"
        }
      }
    };
    
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <div className={`container mx-auto p-6 space-y-6 ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('retention.title')}</h1>
        <p className="text-muted-foreground">
          {lang === 'ar' 
            ? "تحليل شامل لمخاطر ترك الموظفين وتطوير استراتيجيات الاحتفاظ"
            : "Comprehensive employee turnover risk analysis and retention strategy development"
          }
        </p>
      </div>

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
          <RetentionExport {...retentionData} tenantId={tenantId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Retention;