import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from '@/hooks/useLanguageCompat';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Activity,
  BarChart3
} from 'lucide-react';

interface PaymentInsights {
  patterns: any;
  optimization: any;
  risk: any;
}

interface PerformanceMetrics {
  realTime: any;
  metrics: any;
  alerts: any[];
  recommendations: string[];
}

export const PaymentProcessingDashboard = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [insights, setInsights] = useState<PaymentInsights | null>(null);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    setLoading(true);
    try {
      const [insightsResponse, performanceResponse] = await Promise.all([
        supabase.functions.invoke('payment-processing-intelligence', {
          body: {
            action: 'analyze_payment_patterns',
            paymentData: {}
          }
        }),
        supabase.functions.invoke('payment-processing-intelligence', {
          body: {
            action: 'monitor_performance',
            companyId: 'demo-company'
          }
        })
      ]);

      if (insightsResponse.data) setInsights(insightsResponse.data.data);
      if (performanceResponse.data) setPerformance(performanceResponse.data.data);
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!insights || !performance) return null;

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {isArabic ? 'ذكاء معالجة المدفوعات' : 'Payment Processing Intelligence'}
        </h2>
        <p className="text-muted-foreground">
          {isArabic ? 'تحليلات متقدمة وتحسين الأداء' : 'Advanced Analytics & Performance Optimization'}
        </p>
      </div>

      {/* Real-time Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-brand-primary" />
            <span>{isArabic ? 'الحالة الفورية' : 'Real-time Status'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-brand-success">
                {performance.realTime.status}
              </div>
              <div className="text-sm text-muted-foreground">
                {isArabic ? 'الحالة' : 'Status'}
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-brand-accent">
                {performance.realTime.currentLoad}
              </div>
              <div className="text-sm text-muted-foreground">
                {isArabic ? 'الحمولة الحالية' : 'Current Load'}
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-brand-warning">
                {performance.realTime.queueSize}
              </div>
              <div className="text-sm text-muted-foreground">
                {isArabic ? 'حجم الطابور' : 'Queue Size'}
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-brand-primary">
                {performance.realTime.processingRate}
              </div>
              <div className="text-sm text-muted-foreground">
                {isArabic ? 'معدل المعالجة' : 'Processing Rate'}
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-foreground">
                {performance.realTime.uptime}
              </div>
              <div className="text-sm text-muted-foreground">
                {isArabic ? 'وقت التشغيل' : 'Uptime'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isArabic ? 'آخر 24 ساعة' : 'Last 24 Hours'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {isArabic ? 'إجمالي المدفوعات' : 'Total Payments'}
              </span>
              <span className="font-semibold">
                {performance.metrics.last24Hours.totalPayments}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {isArabic ? 'المدفوعات الناجحة' : 'Successful'}
              </span>
              <span className="font-semibold text-brand-success">
                {performance.metrics.last24Hours.successfulPayments}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {isArabic ? 'وقت المعالجة' : 'Avg Processing'}
              </span>
              <span className="font-semibold">
                {performance.metrics.last24Hours.avgProcessingTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {isArabic ? 'إجمالي القيمة' : 'Total Value'}
              </span>
              <span className="font-semibold">
                {performance.metrics.last24Hours.totalValue}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isArabic ? 'آخر 7 أيام' : 'Last 7 Days'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {isArabic ? 'إجمالي المدفوعات' : 'Total Payments'}
              </span>
              <span className="font-semibold">
                {performance.metrics.last7Days.totalPayments}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {isArabic ? 'معدل النجاح' : 'Success Rate'}
              </span>
              <span className="font-semibold text-brand-success">
                {performance.metrics.last7Days.successRate}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {isArabic ? 'وقت المعالجة' : 'Avg Processing'}
              </span>
              <span className="font-semibold">
                {performance.metrics.last7Days.avgProcessingTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {isArabic ? 'أفضل أداء' : 'Peak Performance'}
              </span>
              <span className="font-semibold">
                {performance.metrics.last7Days.peakPerformance}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isArabic ? 'آخر 30 يوم' : 'Last 30 Days'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {isArabic ? 'إجمالي المدفوعات' : 'Total Payments'}
              </span>
              <span className="font-semibold">
                {performance.metrics.last30Days.totalPayments}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {isArabic ? 'معدل النجاح' : 'Success Rate'}
              </span>
              <span className="font-semibold text-brand-success">
                {performance.metrics.last30Days.successRate}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {isArabic ? 'توفير التكلفة' : 'Cost Savings'}
              </span>
              <span className="font-semibold text-brand-accent">
                {performance.metrics.last30Days.costSavings}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {isArabic ? 'معدل الامتثال' : 'Compliance Rate'}
              </span>
              <span className="font-semibold">
                {performance.metrics.last30Days.complianceRate}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-brand-primary" />
              <span>{isArabic ? 'أنماط الذكاء الاصطناعي' : 'AI Pattern Analysis'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-medium mb-2">
                {isArabic ? 'أوقات الذروة' : 'Peak Hours'}
              </div>
              <div className="text-sm text-muted-foreground">
                {insights.patterns.peakHours.join(', ')}
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-medium mb-2">
                {isArabic ? 'التوصية المحسنة' : 'Optimization Recommendation'}
              </div>
              <div className="text-sm text-muted-foreground">
                {insights.optimization.recommendedSchedule}
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-medium mb-2">
                {isArabic ? 'توفير الوقت المتوقع' : 'Expected Time Savings'}
              </div>
              <div className="text-sm text-brand-success font-semibold">
                {insights.optimization.estimatedTimeSavings}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-brand-success" />
              <span>{isArabic ? 'تقييم المخاطر' : 'Risk Assessment'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {isArabic ? 'مستوى المخاطر' : 'Risk Level'}
              </span>
              <Badge 
                variant="default" 
                className={insights.risk.riskScore === 'LOW' ? 'bg-brand-success' : 'bg-brand-warning'}
              >
                {insights.risk.riskScore}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-sm">
                {isArabic ? 'عوامل المخاطر' : 'Risk Factors'}
              </div>
              {insights.risk.factors.map((factor: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-brand-success" />
                  <span className="text-muted-foreground">{factor}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="font-medium text-sm">
                {isArabic ? 'التخفيفات' : 'Mitigations'}
              </div>
              {insights.risk.mitigations.map((mitigation: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <Shield className="w-4 h-4 text-brand-accent" />
                  <span className="text-muted-foreground">{mitigation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {performance.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-brand-accent" />
              <span>{isArabic ? 'التوصيات الذكية' : 'Smart Recommendations'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {performance.recommendations.map((recommendation: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-brand-accent/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-brand-accent mt-0.5" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};