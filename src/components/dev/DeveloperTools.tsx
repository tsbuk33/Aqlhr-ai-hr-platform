import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Database, Users, RefreshCw } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/lib/useTenant';

interface DeveloperToolsProps {
  demoMode?: boolean;
  onRefresh?: () => void;
  backfillHistoricalData?: (days?: number) => Promise<{ success: boolean }>;
}

export const DeveloperTools: React.FC<DeveloperToolsProps> = ({ onRefresh, backfillHistoricalData }) => {
  const { isArabic } = useSimpleLanguage();
  const { 
    tenantInfo, 
    impersonateTenant, 
    clearImpersonation,
    refetch: refetchTenant 
  } = useTenant();
  const [isExpanded, setIsExpanded] = useState(false);
  const [tenantId, setTenantId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTenantSwitch = async () => {
    if (!tenantId) return;
    
    try {
      setLoading(true);
      impersonateTenant(tenantId);
      onRefresh?.();
    } catch (error) {
      console.error('Error switching tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearImpersonation = () => {
    clearImpersonation();
    setTenantId('');
    onRefresh?.();
  };

  const handleBackfill = async () => {
    if (!backfillHistoricalData) return;
    
    try {
      setLoading(true);
      await backfillHistoricalData(365);
      onRefresh?.();
    } catch (error) {
      console.error('Error backfilling data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDemoTenantInfo = async () => {
    try {
      const { data } = await supabase.rpc('get_demo_tenant_id');
      if (data) {
        setTenantId(data);
      }
    } catch (error) {
      console.error('Error getting demo tenant:', error);
    }
  };

  // Only show for development environment or when in demo/impersonated mode
  if (process.env.NODE_ENV === 'production' && !tenantInfo?.mode) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="bg-background border-2 shadow-lg"
        >
          <Settings className="h-4 w-4 mr-2" />
          {isArabic ? 'أدوات المطور' : 'Dev Tools'}
        </Button>
      ) : (
        <Card className="w-80 shadow-lg border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {isArabic ? 'أدوات المطور' : 'Developer Tools'}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            <CardDescription className="text-xs">
              {isArabic ? 'أدوات التطوير والاختبار' : 'Development & testing tools'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mode Indicator */}
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">
                {isArabic ? 'الوضع الحالي' : 'Current Mode'}
              </Label>
              <div className="flex gap-1">
                {tenantInfo?.mode === 'demo' && (
                  <Badge variant="outline" className="text-xs">
                    {isArabic ? 'تجريبي' : 'Demo'}
                  </Badge>
                )}
                {tenantInfo?.mode === 'auth' && (
                  <Badge variant="default" className="text-xs">
                    {isArabic ? 'مصادق' : 'Auth'}
                  </Badge>
                )}
                {tenantInfo?.mode === 'impersonated' && (
                  <Badge variant="secondary" className="text-xs">
                    {isArabic ? 'مطور' : 'Dev'}
                  </Badge>
                )}
              </div>
            </div>

            {/* Current Tenant */}
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">
                {isArabic ? 'المستأجر' : 'Tenant'}
              </Label>
              <span className="text-xs font-mono text-muted-foreground">
                {tenantInfo?.tenantId?.slice(0, 8) || 'None'}...
              </span>
            </div>

            {/* Tenant Impersonation */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">
                {isArabic ? 'تبديل المستأجر' : 'Tenant Switch'}
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder={isArabic ? 'معرف المستأجر' : 'Tenant ID'}
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className="text-xs"
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={getDemoTenantInfo}
                  className="px-2"
                >
                  <Database className="h-3 w-3" />
                </Button>
              </div>
              <Button 
                size="sm" 
                onClick={handleTenantSwitch}
                disabled={!tenantId || loading}
                className="w-full text-xs"
              >
                {loading ? (
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Users className="h-3 w-3 mr-1" />
                )}
                {isArabic ? 'تبديل' : 'Switch'}
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">
                {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
              </Label>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={refetchTenant}
                  className="flex-1 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {isArabic ? 'تحديث' : 'Refresh'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => window.location.href = '/admin/demo-data'}
                  className="flex-1 text-xs"
                >
                  <Database className="h-3 w-3 mr-1" />
                  {isArabic ? 'البيانات' : 'Data'}
                </Button>
              </div>
              
              {/* Backfill Button */}
              {backfillHistoricalData && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleBackfill}
                  disabled={loading}
                  className="w-full text-xs"
                >
                  {loading ? (
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Database className="h-3 w-3 mr-1" />
                  )}
                  {isArabic ? 'ملء البيانات التاريخية' : 'Backfill Historical Data'}
                </Button>
              )}
              
              {tenantInfo?.mode === 'impersonated' && (
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={handleClearImpersonation}
                  className="w-full text-xs"
                >
                  {isArabic ? 'إلغاء الانتحال' : 'Clear Impersonation'}
                </Button>
              )}
            </div>

            {/* Environment Info */}
            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Env: {process.env.NODE_ENV}</div>
                <div>Mode: {tenantInfo?.mode || 'unknown'}</div>
                {tenantInfo?.mode === 'demo' && (
                  <div className="text-yellow-600">
                    {isArabic ? '⚠️ وضع التجربة نشط' : '⚠️ Demo mode active'}
                  </div>
                )}
                {tenantInfo?.mode === 'impersonated' && (
                  <div className="text-purple-600">
                    {isArabic ? '👤 وضع المطور نشط' : '👤 Dev mode active'}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};