import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import NitaqatComplianceEngine from '@/components/nrc/NitaqatComplianceEngine';
import WorkforceNationalizationPlanning from '@/components/nrc/WorkforceNationalizationPlanning';
import ComplianceMonitoring from '@/components/nrc/ComplianceMonitoring';
import GovernmentPortalIntegration from '@/components/nrc/GovernmentPortalIntegration';
import ReportingAnalytics from '@/components/nrc/ReportingAnalytics';
import { 
  Target, 
  Users, 
  Shield, 
  Globe, 
  BarChart,
  Building,
  TrendingUp,
  AlertTriangle,
  User,
  Crown
} from 'lucide-react';

const NRCManagement = () => {
  const { language, isRTL } = useLanguage();

  // Quick stats for overview
  const overviewStats = {
    saudizationRate: 24.5,
    targetRate: 25.0,
    womenPercentage: 36.3,
    womenInLeadership: 42.9,
    complianceScore: 85,
    riskLevel: 'medium'
  };

  return (
    <div className={`container mx-auto p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {language === 'ar' ? 'إدارة نطاقات والسعودة (AI)' : 'NRC Management (AI) - Nitaqat & Saudization'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'ar' 
              ? 'إدارة شاملة لامتثال نطاقات ومتطلبات السعودة مع التكامل الحكومي' 
              : 'Comprehensive Nitaqat compliance and Saudization management with government integration'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نسبة السعودة</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.saudizationRate}%</div>
            <p className="text-xs text-muted-foreground">
              الهدف: {overviewStats.targetRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">النساء في العمل</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.womenPercentage}%</div>
            <p className="text-xs text-muted-foreground">من إجمالي القوى العاملة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">النساء في القيادة</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.womenInLeadership}%</div>
            <p className="text-xs text-muted-foreground">من المناصب القيادية</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">درجة الامتثال</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.complianceScore}%</div>
            <p className="text-xs text-green-600">حالة جيدة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مستوى المخاطرة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">متوسط</div>
            <p className="text-xs text-muted-foreground">يحتاج مراقبة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التكامل الحكومي</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">4/4</div>
            <p className="text-xs text-muted-foreground">منصات متصلة</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="nitaqat-engine" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="nitaqat-engine" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            محرك نطاقات
          </TabsTrigger>
          <TabsTrigger value="workforce-planning" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            تخطيط القوى العاملة
          </TabsTrigger>
          <TabsTrigger value="compliance-monitoring" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            مراقبة الامتثال
          </TabsTrigger>
          <TabsTrigger value="government-integration" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            التكامل الحكومي
          </TabsTrigger>
          <TabsTrigger value="reporting-analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            التقارير والتحليلات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nitaqat-engine" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                محرك امتثال نطاقات
              </CardTitle>
              <p className="text-muted-foreground">
                مراقبة وحساب نسب السعودة في الوقت الفعلي مع تتبع نسب النساء في مكان العمل والقيادة
              </p>
            </CardHeader>
            <CardContent>
              <NitaqatComplianceEngine />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workforce-planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                التخطيط الاستراتيجي لتوطين القوى العاملة
              </CardTitle>
              <p className="text-muted-foreground">
                تخطيط استراتيجي للسعودة مع التركيز على تطوير النساء في القيادة
              </p>
            </CardHeader>
            <CardContent>
              <WorkforceNationalizationPlanning />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance-monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                مراقبة الامتثال
              </CardTitle>
              <p className="text-muted-foreground">
                متابعة يومية لحالة الامتثال مع نظام تنبيهات مبكر
              </p>
            </CardHeader>
            <CardContent>
              <ComplianceMonitoring />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="government-integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                التكامل مع البوابات الحكومية
              </CardTitle>
              <p className="text-muted-foreground">
                تكامل تلقائي مع قِوى، التأمينات الاجتماعية، أبشر، ووزارة العمل
              </p>
            </CardHeader>
            <CardContent>
              <GovernmentPortalIntegration />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporting-analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                التقارير والتحليلات
              </CardTitle>
              <p className="text-muted-foreground">
                تقارير شاملة وتحليلات متقدمة مع مقارنات معايير القطاع وتوقعات مستقبلية
              </p>
            </CardHeader>
            <CardContent>
              <ReportingAnalytics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NRCManagement;