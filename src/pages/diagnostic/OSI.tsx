import { useState, useEffect } from 'react';
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

const OSI = () => {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { locale, t } = useLocale();
  const { user } = useAuthOptional();
  
  const lang = getLang();
  const isRTL = lang === 'ar';

  useEffect(() => {
    initializeTenant();
  }, []);

  const initializeTenant = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const resolvedTenantId = await getTenantIdOrDemo();
      if (!resolvedTenantId) {
        throw new Error('No tenant ID available');
      }
      
      setTenantId(resolvedTenantId);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize OSI');
      console.error('OSI initialization error:', err);
      toast({
        title: t('osi', 'error'),
        description: err.message || 'Failed to load OSI data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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

  if (error) {
    return (
      <div className="container mx-auto p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t('osi', 'initialization_error')}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {error}
            </p>
            <Button onClick={initializeTenant} variant="outline">
              {t('osi', 'retry')}
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
          <h1 className="text-2xl font-bold mb-2">{t('osi', 'access_required')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('osi', 'access_description')}
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
          {t('osi', 'org_structure_intel')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('osi', 'advanced_analysis')}
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">{t('osi', 'overview')}</span>
          </TabsTrigger>
          <TabsTrigger value="layers" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">{t('osi', 'layers')}</span>
          </TabsTrigger>
          <TabsTrigger value="saudization" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">{t('osi', 'saudization_by_layers')}</span>
          </TabsTrigger>
          <TabsTrigger value="span" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{t('osi', 'management_span')}</span>
          </TabsTrigger>
          <TabsTrigger value="cost" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">{t('osi', 'cost_of_management')}</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{t('osi', 'export')}</span>
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
          <OSIExport tenantId={tenantId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OSI;