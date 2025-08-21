import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, TrendingUp, Database, Loader2 } from 'lucide-react';

export default function DemoDataPage() {
  const { isArabic } = useSimpleLanguage();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

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
        
        // Auto-compute KPIs after seeding
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

  const computeKPIs = async () => {
    try {
      setLoading({ kpiCompute: true });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error(isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please log in first');
        return;
      }

      // For demo, just create a sample KPI snapshot
      const { error } = await supabase.from('kpi_snapshots').upsert({
        company_id: user.id,
        snap_date: new Date().toISOString().split('T')[0],
        total_employees: 1000,
        saudization_rate: 68.5,
        hse_safety_score: 92.3,
        active_users: 0,
        docs_processed: 1250,
        training_hours: 890,
        compliance_score: 85.7,
        talent_pipeline_strength: 75,
        predictive_risk_high: 12,
        employee_experience_10: 8.7,
        workforce_forecast_accuracy: 0
      });

      if (error) throw error;

      toast.success(
        isArabic 
          ? 'تم حساب مؤشرات الأداء بنجاح'
          : 'KPIs computed successfully'
      );
    } catch (err) {
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

      <div className="grid gap-6 md:grid-cols-2">
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
      </div>
    </div>
  );
}