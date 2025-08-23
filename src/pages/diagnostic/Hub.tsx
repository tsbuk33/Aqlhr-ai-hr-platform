import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getLang } from '@/lib/i18n/getLang';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';
import { LinkL } from '@/lib/i18n/LinkL';
import { supabase } from '@/integrations/supabase/client';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  Building2,
  CheckCircle,
  ExternalLink,
  Heart,
  MessageSquare,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';

interface DiagnosticOverview {
  tenant_id: string;
  cci_psych_safety: number;
  cci_balance_score: number;
  cci_risk_index: number;
  cci_cvf_balance: number;
  cci_sample_size: number;
  osi_total_layers: number;
  osi_highest_saudi_layer: number;
  osi_critical_layers: number;
  osi_layers_meeting_target: number;
  osi_span_outliers: number;
  osi_management_cost: number;
  retention_avg_risk: number;
  retention_employees_at_risk: number;
  retention_latest_period: string;
  compliance_iqama_expiring_30d: number;
  compliance_saudization_rate: number;
  compliance_nitaqat_status: string;
  overall_health_status: string;
  computed_at: string;
}

const Hub = () => {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [overview, setOverview] = useState<DiagnosticOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const lang = getLang();
  const isRTL = lang === 'ar';

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const resolvedTenantId = await getTenantIdOrDemo();
      if (!resolvedTenantId) {
        throw new Error('No tenant ID available');
      }
      
      setTenantId(resolvedTenantId);

      // Fetch diagnostic overview
      const { data, error: fetchError } = await supabase
        .from('diagnostic_overview_v1')
        .select('*')
        .eq('tenant_id', resolvedTenantId)
        .single();

      if (fetchError) {
        console.error('Diagnostic overview fetch error:', fetchError);
        // If no data found, continue with empty state
        if (fetchError.code === 'PGRST116') {
          setOverview(null);
        } else {
          throw fetchError;
        }
      } else {
        setOverview(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load diagnostic data');
      console.error('Hub initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const t = (key: string) => {
    const translations = {
      en: {
        title: 'Diagnostic Hub',
        description: 'Integrated view of organizational health across all diagnostic modules',
        overallHealth: 'Overall Health',
        cciModule: 'Culture Intelligence',
        osiModule: 'Organizational Structure',
        retentionModule: 'Retention Strategy',
        complianceModule: 'Compliance Status',
        psychSafety: 'Psychological Safety',
        balanceScore: 'Balance Score',
        riskIndex: 'Risk Index',
        totalLayers: 'Organization Layers',
        spanOutliers: 'Span Outliers',
        avgRisk: 'Average Risk',
        employeesAtRisk: 'Employees at Risk',
        iqamaExpiring: 'Iqama Expiring',
        saudizationRate: 'Saudization Rate',
        viewDetails: 'View Details',
        askAql: 'Ask Aql',
        generatePlan: 'Generate 90-day Plan',
        createTasks: 'Create Tasks',
        healthy: 'Healthy',
        warning: 'Warning',
        critical: 'Critical',
        unknown: 'Unknown',
        noData: 'No diagnostic data available',
        noDataDesc: 'Run diagnostic modules to see consolidated insights here',
        nextActions: 'Next Best Actions',
        green: 'Compliant',
        yellow: 'At Risk',
        red: 'Non-Compliant'
      },
      ar: {
        title: 'مركز التشخيص',
        description: 'عرض متكامل لصحة المؤسسة عبر جميع وحدات التشخيص',
        overallHealth: 'الصحة العامة',
        cciModule: 'ذكاء الثقافة المؤسسية',
        osiModule: 'الهيكل التنظيمي',
        retentionModule: 'استراتيجية الاحتفاظ',
        complianceModule: 'حالة الامتثال',
        psychSafety: 'الأمان النفسي',
        balanceScore: 'درجة التوازن',
        riskIndex: 'مؤشر المخاطر',
        totalLayers: 'طبقات المؤسسة',
        spanOutliers: 'نطاق الإشراف',
        avgRisk: 'متوسط المخاطر',
        employeesAtRisk: 'موظفون معرضون للخطر',
        iqamaExpiring: 'إقامات منتهية الصلاحية',
        saudizationRate: 'معدل السعودة',
        viewDetails: 'عرض التفاصيل',
        askAql: 'اسأل عقل',
        generatePlan: 'توليد خطة ٩٠ يوم',
        createTasks: 'إنشاء مهام',
        healthy: 'صحي',
        warning: 'تحذير',
        critical: 'حرج',
        unknown: 'غير معروف',
        noData: 'لا توجد بيانات تشخيصية',
        noDataDesc: 'قم بتشغيل وحدات التشخيص لرؤية الرؤى المتكاملة هنا',
        nextActions: 'أفضل الإجراءات التالية',
        green: 'متوافق',
        yellow: 'معرض للخطر',
        red: 'غير متوافق'
      }
    };
    return translations[lang as 'en' | 'ar']?.[key as keyof typeof translations.en] || key;
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const askAqlWithContext = (module: string, context: string) => {
    const intent = encodeURIComponent(`Analyze ${module}: ${context}`);
    window.open(`/assistant?intent=${intent}`, '_blank');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Activity className="h-8 w-8" />
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('description')}
        </p>
      </div>

      {error && (
        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!overview ? (
        <Card className="text-center py-12">
          <CardHeader>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Activity className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>{t('noData')}</CardTitle>
            <CardDescription className="max-w-md mx-auto">
              {t('noDataDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 justify-center">
              <LinkL to="/diagnostic/cci/overview">
                <Button variant="outline">
                  <Brain className="mr-2 h-4 w-4" />
                  {t('cciModule')}
                </Button>
              </LinkL>
              <LinkL to="/diagnostic/osi">
                <Button variant="outline">
                  <Building2 className="mr-2 h-4 w-4" />
                  {t('osiModule')}
                </Button>
              </LinkL>
              <LinkL to="/diagnostic/retention">
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  {t('retentionModule')}
                </Button>
              </LinkL>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Overall Health Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                {t('overallHealth')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={`${getHealthColor(overview.overall_health_status)} px-3 py-1`}>
                {getHealthIcon(overview.overall_health_status)}
                <span className="ml-2">{t(overview.overall_health_status)}</span>
              </Badge>
            </CardContent>
          </Card>

          {/* Module Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* CCI Module */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  {t('cciModule')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('psychSafety')}</span>
                    <span className="font-medium">{overview.cci_psych_safety}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('balanceScore')}</span>
                    <span className="font-medium">{overview.cci_balance_score}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('riskIndex')}</span>
                    <span className="font-medium">{overview.cci_risk_index}%</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <LinkL to="/diagnostic/cci/overview">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      {t('viewDetails')}
                    </Button>
                  </LinkL>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => askAqlWithContext('CCI', `Psych Safety: ${overview.cci_psych_safety}%, Balance: ${overview.cci_balance_score}%`)}
                  >
                    <MessageSquare className="mr-1 h-3 w-3" />
                    {t('askAql')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* OSI Module */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {t('osiModule')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('totalLayers')}</span>
                    <span className="font-medium">{overview.osi_total_layers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('spanOutliers')}</span>
                    <span className="font-medium">{overview.osi_span_outliers}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <LinkL to="/diagnostic/osi">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      {t('viewDetails')}
                    </Button>
                  </LinkL>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => askAqlWithContext('OSI', `${overview.osi_total_layers} layers, ${overview.osi_span_outliers} span outliers`)}
                  >
                    <MessageSquare className="mr-1 h-3 w-3" />
                    {t('askAql')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Retention Module */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t('retentionModule')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('avgRisk')}</span>
                    <span className="font-medium">{overview.retention_avg_risk}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('employeesAtRisk')}</span>
                    <span className="font-medium">{overview.retention_employees_at_risk}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <LinkL to="/diagnostic/retention">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      {t('viewDetails')}
                    </Button>
                  </LinkL>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => askAqlWithContext('Retention', `${overview.retention_avg_risk}% avg risk, ${overview.retention_employees_at_risk} at risk`)}
                  >
                    <MessageSquare className="mr-1 h-3 w-3" />
                    {t('askAql')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Module */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {t('complianceModule')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('iqamaExpiring')}</span>
                    <span className="font-medium">{overview.compliance_iqama_expiring_30d}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('saudizationRate')}</span>
                    <span className="font-medium">{overview.compliance_saudization_rate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Nitaqat</span>
                    <Badge variant="outline" className={`text-xs ${
                      overview.compliance_nitaqat_status === 'green' ? 'text-green-600 border-green-600' :
                      overview.compliance_nitaqat_status === 'yellow' ? 'text-yellow-600 border-yellow-600' :
                      'text-red-600 border-red-600'
                    }`}>
                      {t(overview.compliance_nitaqat_status)}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <LinkL to="/government/overview">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      {t('viewDetails')}
                    </Button>
                  </LinkL>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => askAqlWithContext('Compliance', `${overview.compliance_iqama_expiring_30d} iqama expiring, Nitaqat: ${overview.compliance_nitaqat_status}`)}
                  >
                    <MessageSquare className="mr-1 h-3 w-3" />
                    {t('askAql')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Best Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                {t('nextActions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {overview.cci_psych_safety < 70 && (
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Improve Psychological Safety</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Current score: {overview.cci_psych_safety}% - Consider team building initiatives
                    </p>
                    <Button size="sm" variant="outline" onClick={() => askAqlWithContext('Psychological Safety', 'Create improvement plan')}>
                      {t('generatePlan')} <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                {overview.retention_employees_at_risk > 5 && (
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="font-medium">Address Retention Risk</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {overview.retention_employees_at_risk} employees at risk
                    </p>
                    <LinkL to="/diagnostic/retention?tab=actions">
                      <Button size="sm" variant="outline">
                        {t('createTasks')} <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </LinkL>
                  </div>
                )}
                
                {overview.compliance_iqama_expiring_30d > 0 && (
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">Iqama Renewal Urgent</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {overview.compliance_iqama_expiring_30d} iqamas expiring soon
                    </p>
                    <LinkL to="/government/absher">
                      <Button size="sm" variant="outline">
                        Review Cases <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </LinkL>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Hub;