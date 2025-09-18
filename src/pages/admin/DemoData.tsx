import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, TrendingUp, Database, Loader2, Calendar, Building2, Play, RefreshCw } from 'lucide-react';
import { resolveTenantId } from '@/lib/useTenant';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

export default function DemoDataPage() {
  const { isArabic } = useSimpleLanguage();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [currentTenantId, setCurrentTenantId] = useState<string>('');

  // Resolve and display current tenant ID
  useEffect(() => {
    const getTenantId = async () => {
      try {
        const { tenantId } = await resolveTenantId(supabase);
        setCurrentTenantId(tenantId || 'Not resolved');
      } catch (error) {
        console.error('Error resolving tenant ID:', error);
        setCurrentTenantId('Error resolving');
      }
    };
    getTenantId();
  }, []);

  const seedHRDemo = async () => {
    try {
      setLoading({ hrSeed: true });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error(isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please log in first');
        return;
      }

      toast.info(isArabic ? 'بدء تحميل بيانات الموارد البشرية التجريبية...' : 'Starting HR demo data seeding...');

      const { data, error } = await supabase.functions.invoke('hr_seed_demo_1000_v1', {
        body: { tenantId: user.id }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(
          isArabic 
            ? `تم تحميل ${data.counts?.employees || 0} موظف بنجاح`
            : `Successfully seeded ${data.counts?.employees || 0} employees`
        );
        
        // Auto-backfill dashboard and compute KPIs after seeding
        await backfillDashboard();
        await computeKPIs();
      } else {
        throw new Error(data?.error || 'Failed to seed data');
      }
    } catch (err) {
      console.error('HR seed error:', err);
      toast.error(
        isArabic 
          ? 'خطأ في تحميل البيانات التجريبية'
          : 'Failed to seed demo data'
      );
    } finally {
      setLoading({ hrSeed: false });
    }
  };

  const backfillDashboard = async () => {
    try {
      setLoading({ dashboardBackfill: true });
      
      const { tenantId } = await resolveTenantId(supabase);
      if (!tenantId) {
        toast.error(isArabic ? 'لم يتم العثور على معرف المستأجر' : 'No tenant ID found');
        return;
      }

      toast.info(isArabic ? 'بدء إنشاء البيانات التاريخية للوحة القيادة (12 شهر)...' : 'Starting dashboard backfill (12 months)...');

      const { error } = await supabase.rpc('dashboard_backfill_v1' as any, {
        p_tenant: tenantId,
        p_days: 365
      });

      if (error) throw error;

      toast.success(
        isArabic 
          ? 'تم إنشاء البيانات التاريخية للوحة القيادة بنجاح (365 يوم)'
          : 'Dashboard backfill completed successfully (365 days)'
      );
    } catch (err: any) {
      console.error('Dashboard backfill error:', err);
      toast.error(
        isArabic 
          ? 'خطأ في إنشاء البيانات التاريخية'
          : 'Failed to backfill dashboard data'
      );
    } finally {
      setLoading({ dashboardBackfill: false });
    }
  };

  const computeKPIs = async () => {
    try {
      setLoading({ kpiCompute: true });
      
      const { tenantId } = await resolveTenantId(supabase);
      if (!tenantId) {
        toast.error(isArabic ? 'لم يتم العثور على معرف المستأجر' : 'No tenant ID found');
        return;
      }

      // Call the new dashboard computation function for today
      const { error } = await supabase.rpc('dashboard_compute_kpis_v1' as any, {
        p_tenant: tenantId,
        p_date: new Date().toISOString().split('T')[0]
      });

      if (error) throw error;

      toast.success(
        isArabic 
          ? 'تم حساب مؤشرات الأداء بنجاح'
          : 'KPIs computed successfully'
      );
    } catch (err: any) {
      console.error('KPI compute error:', err);
      toast.error(
        isArabic 
          ? 'خطأ في حساب مؤشرات الأداء'
          : 'Failed to compute KPIs'
      );
    } finally {
      setLoading({ kpiCompute: false });
    }
  };

  // HR Demo Bootstrap functions
  const seedHRBootstrap = async () => {
    try {
      setLoading({ hrBootstrapSeed: true });
      
      const { tenantId } = await resolveTenantId(supabase);
      if (!tenantId) {
        toast.error(isArabic ? 'لم يتم العثور على معرف المستأجر' : 'No tenant ID found');
        return;
      }

      toast.info(isArabic ? 'بدء تحميل 1000 موظف...' : 'Starting to seed 1,000 employees...');

      const { data, error } = await supabase.functions.invoke('hr_seed_demo_1000_v1', {
        body: { tenantId }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(
          isArabic 
            ? `تم تحميل ${data.inserted || 0} موظف بنجاح`
            : `Successfully seeded ${data.inserted || 0} employees`
        );
      } else {
        throw new Error(data?.error || 'Failed to seed HR data');
      }
    } catch (err: any) {
      console.error('HR Bootstrap seed error:', err);
      toast.error(
        isArabic 
          ? 'خطأ في تحميل بيانات الموارد البشرية'
          : 'Failed to seed HR demo data'
      );
    } finally {
      setLoading({ hrBootstrapSeed: false });
    }
  };

  const recomputeKPIsToday = async () => {
    try {
      setLoading({ recomputeKPIs: true });
      
      const { tenantId } = await resolveTenantId(supabase);
      if (!tenantId) {
        toast.error(isArabic ? 'لم يتم العثور على معرف المستأجر' : 'No tenant ID found');
        return;
      }

      toast.info(isArabic ? 'إعادة حساب مؤشرات الأداء لليوم...' : 'Recomputing KPIs for today...');

      const { error } = await supabase.rpc('dashboard_compute_kpis_v1' as any, {
        p_tenant: tenantId
      });

      if (error) throw error;

      toast.success(
        isArabic 
          ? 'تم إعادة حساب مؤشرات الأداء بنجاح'
          : 'KPIs recomputed successfully'
      );
    } catch (err: any) {
      console.error('Recompute KPIs error:', err);
      toast.error(
        isArabic 
          ? 'خطأ في إعادة حساب مؤشرات الأداء'
          : 'Failed to recompute KPIs'
      );
    } finally {
      setLoading({ recomputeKPIs: false });
    }
  };

  const backfill12Months = async () => {
    try {
      setLoading({ backfill12Months: true });
      
      const { tenantId } = await resolveTenantId(supabase);
      if (!tenantId) {
        toast.error(isArabic ? 'لم يتم العثور على معرف المستأجر' : 'No tenant ID found');
        return;
      }

      toast.info(isArabic ? 'بدء إنشاء البيانات التاريخية لـ12 شهر...' : 'Starting 12-month backfill...');

      const { error } = await supabase.rpc('dashboard_backfill_v1' as any, {
        p_tenant: tenantId,
        p_days: 365
      });

      if (error) throw error;

      toast.success(
        isArabic 
          ? 'تم إنشاء البيانات التاريخية لـ12 شهر بنجاح'
          : '12-month backfill completed successfully'
      );
    } catch (err: any) {
      console.error('12-month backfill error:', err);
      toast.error(
        isArabic 
          ? 'خطأ في إنشاء البيانات التاريخية'
          : 'Failed to complete 12-month backfill'
      );
    } finally {
      setLoading({ backfill12Months: false });
    }
  };

  return (
    <div className={`space-y-6 p-6 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className={isArabic ? 'text-right' : 'text-left'}>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'البيانات التجريبية' : 'Demo Data Management'}
        </h1>
        <p className="text-foreground-muted mt-2">
          {isArabic 
            ? 'إدارة البيانات التجريبية للنظام وحساب مؤشرات الأداء'
            : 'Manage system demo data and compute performance indicators'
          }
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <Users className="h-5 w-5 text-brand-primary" />
              {isArabic ? 'بيانات الموارد البشرية التجريبية (1,000)' : 'Seed HR Demo (1,000)'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={seedHRDemo}
              disabled={loading.hrSeed}
              className="w-full"
              size="lg"
            >
              {loading.hrSeed ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isArabic ? 'جاري التحميل...' : 'Seeding...'}
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  {isArabic ? 'تحميل البيانات التجريبية' : 'Seed Demo Data'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="h-5 w-5 text-brand-secondary" />
              {isArabic ? 'إعادة حساب مؤشرات الأداء' : 'Recompute Dashboard KPIs'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={computeKPIs}
              disabled={loading.kpiCompute}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {loading.kpiCompute ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isArabic ? 'جاري الحساب...' : 'Computing...'}
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  {isArabic ? 'حساب مؤشرات الأداء' : 'Compute KPIs'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <Calendar className="h-5 w-5 text-brand-accent" />
              {isArabic ? 'إنشاء البيانات التاريخية (12 شهر)' : 'Backfill Dashboard (12 months)'}
            </CardTitle>
            <CardDescription>
              {isArabic ? 'إنشاء 365 يوم من البيانات التاريخية لمؤشرات الأداء' : 'Generate 365 days of historical KPI data'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={backfillDashboard}
              disabled={loading.dashboardBackfill}
              variant="secondary"
              className="w-full"
              size="lg"
            >
              {loading.dashboardBackfill ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isArabic ? 'جاري الإنشاء...' : 'Backfilling...'}
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  {isArabic ? 'إنشاء البيانات التاريخية' : 'Backfill Dashboard'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tenant ID Display */}
      <div className={`p-4 bg-muted/50 rounded-lg ${isArabic ? 'text-right' : 'text-left'}`}>
        <div className="flex items-center gap-3">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {isArabic ? 'معرف المستأجر الحالي:' : 'Current Tenant ID:'}
          </span>
          <Badge variant="outline" className="font-mono text-xs">
            {currentTenantId || 'Loading...'}
          </Badge>
        </div>
      </div>

      {/* HR Demo Bootstrap Section */}
      <div className={isArabic ? 'text-right' : 'text-left'}>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {isArabic ? 'إعداد بيانات الموارد البشرية المتقدم' : 'HR Demo Bootstrap'}
        </h2>
        <p className="text-foreground-muted">
          {isArabic 
            ? 'أدوات متقدمة لإعداد وإدارة بيانات الموارد البشرية التجريبية'
            : 'Advanced tools for HR demo data setup and management'
          }
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <Play className="h-5 w-5 text-green-500" />
              {isArabic ? 'تحميل 1000 موظف' : 'Seed 1,000 Employees'}
            </CardTitle>
            <CardDescription>
              {isArabic ? 'تحميل 1000 موظف مع التوزيع الصحيح للجنسيات والأقسام' : 'Seed 1,000 employees with proper nationality and department distribution'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={seedHRBootstrap}
              disabled={loading.hrBootstrapSeed}
              className="w-full"
              size="lg"
            >
              {loading.hrBootstrapSeed ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isArabic ? 'جاري التحميل...' : 'Seeding...'}
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  {isArabic ? 'تحميل الموظفين' : 'Seed Employees'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <RefreshCw className="h-5 w-5 text-blue-500" />
              {isArabic ? 'إعادة حساب مؤشرات اليوم' : 'Recompute KPIs (Today)'}
            </CardTitle>
            <CardDescription>
              {isArabic ? 'إعادة حساب مؤشرات الأداء الرئيسية لليوم الحالي' : 'Recompute key performance indicators for today'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={recomputeKPIsToday}
              disabled={loading.recomputeKPIs}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {loading.recomputeKPIs ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isArabic ? 'جاري الحساب...' : 'Computing...'}
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {isArabic ? 'إعادة الحساب' : 'Recompute'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <Calendar className="h-5 w-5 text-purple-500" />
              {isArabic ? 'إنشاء بيانات 12 شهر' : 'Backfill 12 Months'}
            </CardTitle>
            <CardDescription>
              {isArabic ? 'إنشاء البيانات التاريخية لمدة 365 يوم' : 'Generate 365 days of historical dashboard data'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={backfill12Months}
              disabled={loading.backfill12Months}
              variant="secondary"
              className="w-full"
              size="lg"
            >
              {loading.backfill12Months ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isArabic ? 'جاري الإنشاء...' : 'Backfilling...'}
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  {isArabic ? 'إنشاء البيانات' : 'Backfill Data'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Integration for Demo Data Management */}
      <UniversalAIIntegrator 
        pageType="platform" 
        moduleName="demo-data-management" 
        companyId="demo-company" 
        enabledFeatures={['intelligent-automation', 'data-analysis', 'contextual-help']}
      />
    </div>
  );
}