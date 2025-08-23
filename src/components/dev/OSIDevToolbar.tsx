import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getLang } from '@/lib/i18n/getLang';
import { useAuthOptional } from '@/lib/auth/useAuthOptional';
import { Loader2, Database, Play, History, Trash2, Code, Building2 } from 'lucide-react';
import * as osiAPI from '@/lib/api/osi';

interface OSIDevToolbarProps {
  tenantId?: string | null;
  onDataChanged?: () => void;
}

export const OSIDevToolbar: React.FC<OSIDevToolbarProps> = ({ tenantId, onDataChanged }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const lang = getLang();
  const { user } = useAuthOptional();

  // Check if dev mode is enabled or user is admin
  const urlParams = new URLSearchParams(window.location.search);
  const isDevMode = urlParams.get('dev') === '1';
  const isAdmin = user && ['admin', 'super_admin'].includes(user.user_metadata?.role);

  // Don't render if not in dev mode and not admin
  if (!isDevMode && !isAdmin) {
    return null;
  }

  const t = (key: string) => {
    const translations = {
      en: {
        title: 'OSI Dev Toolbar',
        subtitle: `Tenant: ${tenantId || 'Unknown'}`,
        seedDemo: 'Seed OSI Demo',
        computeNow: 'Compute OSI',
        backfill12m: 'Backfill 12m',
        clearData: 'Clear OSI Data',
        seedingDemo: 'Seeding OSI Demo...',
        computing: 'Computing OSI...',
        backfilling: 'Backfilling OSI...',
        clearing: 'Clearing OSI...',
        seedSuccess: 'OSI demo data seeded successfully',
        computeSuccess: 'OSI analysis computed successfully',
        backfillSuccess: 'OSI backfilled 12 months successfully',
        clearSuccess: 'OSI data cleared successfully',
        error: 'OSI operation failed',
        noTenant: 'No tenant ID available'
      },
      ar: {
        title: 'شريط أدوات OSI للمطور',
        subtitle: `المستأجر: ${tenantId || 'غير معروف'}`,
        seedDemo: 'توليد بيانات OSI تجريبية',
        computeNow: 'حساب OSI الآن',
        backfill12m: 'احتساب OSI آخر ١٢ شهرًا',
        clearData: 'مسح بيانات OSI',
        seedingDemo: 'جاري توليد بيانات OSI...',
        computing: 'جاري حساب OSI...',
        backfilling: 'جاري احتساب OSI...',
        clearing: 'جاري مسح OSI...',
        seedSuccess: 'تم توليد بيانات OSI التجريبية بنجاح',
        computeSuccess: 'تم حساب تحليل OSI بنجاح',
        backfillSuccess: 'تم احتساب OSI ١٢ شهرًا بنجاح',
        clearSuccess: 'تم مسح بيانات OSI بنجاح',
        error: 'فشلت عملية OSI',
        noTenant: 'معرف المستأجر غير متوفر'
      }
    };
    return translations[lang as 'en' | 'ar']?.[key as keyof typeof translations.en] || key;
  };

  const handleSeedDemo = async () => {
    if (!tenantId) {
      toast({
        title: t('error'),
        description: t('noTenant'),
        variant: 'destructive'
      });
      return;
    }

    setLoading('seed');
    try {
      const seedSuccess = await osiAPI.seedDemo(tenantId);
      if (seedSuccess) {
        const computeSuccess = await osiAPI.computeNow(tenantId);
        if (computeSuccess) {
          toast({
            title: t('seedSuccess'),
            description: t('computeSuccess')
          });
          onDataChanged?.();
        } else {
          throw new Error('OSI compute failed after seeding');
        }
      } else {
        throw new Error('OSI seeding failed');
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(null);
    }
  };

  const handleComputeNow = async () => {
    if (!tenantId) {
      toast({
        title: t('error'),
        description: t('noTenant'),
        variant: 'destructive'
      });
      return;
    }

    setLoading('compute');
    try {
      const success = await osiAPI.computeNow(tenantId);
      if (success) {
        toast({
          title: t('computeSuccess')
        });
        onDataChanged?.();
      } else {
        throw new Error('OSI compute failed');
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(null);
    }
  };

  const handleBackfill12m = async () => {
    if (!tenantId) {
      toast({
        title: t('error'),
        description: t('noTenant'),
        variant: 'destructive'
      });
      return;
    }

    setLoading('backfill');
    try {
      const success = await osiAPI.backfillMonths(tenantId, 12);
      if (success) {
        toast({
          title: t('backfillSuccess')
        });
        onDataChanged?.();
      } else {
        throw new Error('OSI backfill failed');
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(null);
    }
  };

  const handleClearData = async () => {
    if (!tenantId) {
      toast({
        title: t('error'),
        description: t('noTenant'),
        variant: 'destructive'
      });
      return;
    }

    setLoading('clear');
    try {
      const success = await osiAPI.clearData(tenantId);
      if (success) {
        toast({
          title: t('clearSuccess')
        });
        onDataChanged?.();
      } else {
        throw new Error('OSI clear failed');
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className={`mb-6 border-dashed border-blue-300 bg-blue-50 dark:bg-blue-950/20 ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Building2 className="h-4 w-4" />
          <Code className="h-4 w-4" />
          {t('title')}
        </CardTitle>
        <p className="text-sm text-blue-600 dark:text-blue-300">{t('subtitle')}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeedDemo}
            disabled={!!loading}
            className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20"
          >
            {loading === 'seed' ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                {t('seedingDemo')}
              </>
            ) : (
              <>
                <Database className="mr-1 h-3 w-3" />
                {t('seedDemo')}
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleComputeNow}
            disabled={!!loading}
            className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20"
          >
            {loading === 'compute' ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                {t('computing')}
              </>
            ) : (
              <>
                <Play className="mr-1 h-3 w-3" />
                {t('computeNow')}
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBackfill12m}
            disabled={!!loading}
            className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20"
          >
            {loading === 'backfill' ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                {t('backfilling')}
              </>
            ) : (
              <>
                <History className="mr-1 h-3 w-3" />
                {t('backfill12m')}
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearData}
            disabled={!!loading}
            className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/20"
          >
            {loading === 'clear' ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                {t('clearing')}
              </>
            ) : (
              <>
                <Trash2 className="mr-1 h-3 w-3" />
                {t('clearData')}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};