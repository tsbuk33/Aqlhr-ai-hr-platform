import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, Shield, TrendingUp, Users, FileText, AlertCircle } from "lucide-react";
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { useToast } from "@/hooks/use-toast";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const ComplianceOverview = () => {
  const { isArabic } = useSimpleLanguage();
  const { toast } = useToast();

  // Helper function to format numbers with commas
  const formatNumber = (num: number) => new Intl.NumberFormat(isArabic ? 'ar-SA' : 'en-US').format(num);

  // Mock compliance data
  const complianceData = {
    overallScore: 94.2,
    saudizationRatio: 67.5,
    nitaqatBand: 'yellow',
    activeAlerts: 2,
    auditTrails: 15678,
  };

  const getBadgeVariant = (band: string) => {
    switch (band.toLowerCase()) {
      case 'platinum': return 'default';
      case 'green': return 'secondary';
      case 'yellow': return 'outline';
      case 'red': return 'destructive';
      default: return 'outline';
    }
  };

  const translations = {
    en: {
      title: "Compliance & Governance Management",
      subtitle: "Comprehensive overview of organizational compliance status",
      createReport: "Create Report",
      overallCompliance: "Overall Compliance",
      saudizationRatio: "Saudization Ratio",
      nitaqatBand: "Nitaqat Band",
      activeAlerts: "Active Alerts",
      auditTrails: "Audit Trails",
      complianceModules: "Compliance Modules",
      regulatory: "Regulatory Compliance",
      riskManagement: "Risk Management",
      policyManagement: "Policy Management",
      auditTrailsModule: "Audit Trails",
      recentActivity: "Recent Activity",
      viewAll: "View All"
    },
    ar: {
      title: "إدارة الامتثال والحوكمة",
      subtitle: "نظرة شاملة على حالة الامتثال في المنظمة",
      createReport: "إنشاء تقرير",
      overallCompliance: "الامتثال العام",
      saudizationRatio: "نسبة السعودة",
      nitaqatBand: "النطاق",
      activeAlerts: "تنبيهات نشطة",
      auditTrails: "مسارات المراجعة",
      complianceModules: "وحدات الامتثال",
      regulatory: "الامتثال التنظيمي",
      riskManagement: "إدارة المخاطر",
      policyManagement: "إدارة السياسات",
      auditTrailsModule: "مسارات المراجعة",
      recentActivity: "النشاط الأخير",
      viewAll: "عرض الكل"
    }
  };

  const handleCreateReport = () => {
    toast({
      title: isArabic ? "تم إنشاء التقرير" : "Report Created",
      description: isArabic ? "سيتم توليد تقرير الامتثال قريباً" : "Compliance report will be generated shortly",
    });
  };

  const t = translations[isArabic ? 'ar' : 'en'];

  return (
    <div className={`container mx-auto p-6 space-y-6 ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex justify-between items-center ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={isArabic ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground mt-1">{t.subtitle}</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={handleCreateReport}
        >
          {t.createReport}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-lg flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
              <Shield className="h-5 w-5 text-primary" />
              {t.overallCompliance}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{complianceData.overallScore}%</div>
            <Progress value={complianceData.overallScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-lg flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
              <Users className="h-5 w-5 text-secondary" />
              {t.saudizationRatio}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{complianceData.saudizationRatio}%</div>
            <Badge variant={getBadgeVariant(complianceData.nitaqatBand)} className="mt-2">
              {t.nitaqatBand} {complianceData.nitaqatBand}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-lg flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
              <AlertCircle className="h-5 w-5 text-destructive" />
              {t.activeAlerts}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{complianceData.activeAlerts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={`text-lg flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
              <FileText className="h-5 w-5 text-accent" />
              {t.auditTrails}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{formatNumber(complianceData.auditTrails)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Modules */}
      <Card>
        <CardHeader>
          <CardTitle className={isArabic ? 'text-right' : 'text-left'}>{t.complianceModules}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Shield className="h-6 w-6 mb-2" />
              {t.regulatory}
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <AlertTriangle className="h-6 w-6 mb-2" />
              {t.riskManagement}
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <FileText className="h-6 w-6 mb-2" />
              {t.policyManagement}
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Clock className="h-6 w-6 mb-2" />
              {t.auditTrailsModule}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* AI Integration for Compliance Overview */}
      <UniversalAIIntegrator 
        pageType="compliance" 
        moduleName="compliance-overview" 
        companyId="demo-company" 
        enabledFeatures={['compliance-dashboard', 'regulatory-monitoring', 'audit-oversight', 'risk-management']}
      />
    </div>
  );
};

export default ComplianceOverview;
