import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getLang } from '@/lib/i18n/getLang';
import { useAuthOptional } from '@/lib/auth/useAuthOptional';
import { Loader2, Database, Play, History, Trash2, Code } from 'lucide-react';
import * as retentionAPI from '@/lib/api/retention';

interface DevToolbarProps {
  tenantId?: string | null;
  onDataChanged?: () => void;
}

export const DevToolbar: React.FC<DevToolbarProps> = ({ tenantId, onDataChanged }) => {
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
        title: 'Dev Toolbar',
        subtitle: `Tenant: ${tenantId || 'Unknown'}`,
        seedDemo: 'Seed Demo',
        computeNow: 'Compute Now',
        backfill12m: 'Backfill 12m',
        clearData: 'Clear Data',
        seedingDemo: 'Seeding Demo...',
        computing: 'Computing...',
        backfilling: 'Backfilling...',
        clearing: 'Clearing...',
        seedSuccess: 'Demo data seeded successfully',
        computeSuccess: 'Analysis computed successfully',
        backfillSuccess: 'Backfilled 12 months successfully',
        clearSuccess: 'Data cleared successfully',
        error: 'Operation failed',
        noTenant: 'No tenant ID available'
      },
      ar: {
        title: 'شريط أدوات المطور',
        subtitle: `المستأجر: ${tenantId || 'غير معروف'}`,
        seedDemo: 'توليد بيانات تجريبية',
        computeNow: 'حساب الآن',
        backfill12m: 'احتساب آخر ١٢ شهرًا',
        clearData: 'مسح البيانات',
        seedingDemo: 'جاري توليد البيانات...',
        computing: 'جاري الحساب...',
        backfilling: 'جاري الاحتساب...',
        clearing: 'جاري المسح...',
        seedSuccess: 'تم توليد البيانات التجريبية بنجاح',
        computeSuccess: 'تم حساب التحليل بنجاح',
        backfillSuccess: 'تم احتساب ١٢ شهرًا بنجاح',
        clearSuccess: 'تم مسح البيانات بنجاح',
        error: 'فشلت العملية',
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
      const seedSuccess = await retentionAPI.seedDemo(tenantId);
      if (seedSuccess) {
        const computeSuccess = await retentionAPI.computeNow(tenantId);
        if (computeSuccess) {
          toast({
            title: t('seedSuccess'),
            description: t('computeSuccess')
          });
          onDataChanged?.();
        } else {
          throw new Error('Compute failed after seeding');
        }
      } else {
        throw new Error('Seeding failed');
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
      const success = await retentionAPI.computeNow(tenantId);
      if (success) {
        toast({
          title: t('computeSuccess')
        });
        onDataChanged?.();
      } else {
        throw new Error('Compute failed');
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
      const success = await retentionAPI.backfillMonths(tenantId, 12);
      if (success) {
        toast({
          title: t('backfillSuccess')
        });
        onDataChanged?.();
      } else {
        throw new Error('Backfill failed');
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
      const success = await retentionAPI.clearData(tenantId);
      if (success) {
        toast({
          title: t('clearSuccess')
        });
        onDataChanged?.();
      } else {
        throw new Error('Clear failed');
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
    <Card className={`mb-6 border-dashed border-orange-300 bg-orange-50 dark:bg-orange-950/20 ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
          <Code className="h-4 w-4" />
          {t('title')}
        </CardTitle>
        <p className="text-sm text-orange-600 dark:text-orange-300">{t('subtitle')}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeedDemo}
            disabled={!!loading}
            className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-900/20"
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
            className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-900/20"
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
            className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-900/20"
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