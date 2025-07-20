import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { 
  Building, 
  Users, 
  Shield, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  DollarSign,
  FileText,
  Globe,
  Zap
} from 'lucide-react';

interface GovernmentIntegration {
  id: string;
  platform: 'HRSD' | 'Qiwa' | 'GOSI';
  status: 'connected' | 'syncing' | 'error' | 'pending';
  lastSync: string;
  nextSync: string;
  dataAccuracy: number;
  automationLevel: number;
  complianceRate: number;
  issuesDetected: number;
  totalRecords: number;
}

interface ComplianceAlert {
  id: string;
  platform: string;
  type: 'visa_expiry' | 'gosi_mismatch' | 'qiwa_violation' | 'hrsd_update';
  title: string;
  titleAr: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  daysUntilDeadline: number;
  affectedEmployees: number;
  recommendation: string;
  recommendationAr: string;
  autoFixable: boolean;
}

interface AIOptimization {
  id: string;
  platform: string;
  optimization: string;
  optimizationAr: string;
  impact: string;
  impactAr: string;
  savings: number;
  implementationTime: string;
  confidence: number;
  status: 'pending' | 'implementing' | 'completed';
}

const GovernmentAIIntegration = () => {
  const { language, t } = useLanguage();
  const isArabic = language === 'ar';
  
  const [integrations, setIntegrations] = useState<GovernmentIntegration[]>([
    {
      id: '1',
      platform: 'HRSD',
      status: 'connected',
      lastSync: '2024-01-15T14:30:00Z',
      nextSync: '2024-01-16T02:00:00Z',
      dataAccuracy: 98.5,
      automationLevel: 95,
      complianceRate: 99.2,
      issuesDetected: 2,
      totalRecords: 312
    },
    {
      id: '2',
      platform: 'Qiwa',
      status: 'syncing',
      lastSync: '2024-01-15T13:45:00Z',
      nextSync: '2024-01-15T18:00:00Z',
      dataAccuracy: 96.8,
      automationLevel: 92,
      complianceRate: 97.5,
      issuesDetected: 5,
      totalRecords: 312
    },
    {
      id: '3',
      platform: 'GOSI',
      status: 'connected',
      lastSync: '2024-01-15T15:00:00Z',
      nextSync: '2024-01-16T08:00:00Z',
      dataAccuracy: 99.1,
      automationLevel: 98,
      complianceRate: 99.8,
      issuesDetected: 1,
      totalRecords: 312
    }
  ]);

  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>([
    {
      id: '1',
      platform: 'HRSD',
      type: 'visa_expiry',
      title: 'Visa Expiry Alert - 5 Employees',
      titleAr: 'تنبيه انتهاء التأشيرة - 5 موظفين',
      severity: 'high',
      daysUntilDeadline: 30,
      affectedEmployees: 5,
      recommendation: 'Initiate visa renewal process immediately',
      recommendationAr: 'بدء عملية تجديد التأشيرة فوراً',
      autoFixable: false
    },
    {
      id: '2',
      platform: 'GOSI',
      type: 'gosi_mismatch',
      title: 'Salary Mismatch Detected',
      titleAr: 'تم اكتشاف عدم تطابق في الراتب',
      severity: 'medium',
      daysUntilDeadline: 15,
      affectedEmployees: 2,
      recommendation: 'Update GOSI records with correct salary information',
      recommendationAr: 'تحديث سجلات الجوسي بمعلومات الراتب الصحيحة',
      autoFixable: true
    },
    {
      id: '3',
      platform: 'Qiwa',
      type: 'qiwa_violation',
      title: 'Saudization Rate Below Threshold',
      titleAr: 'معدل السعودة أقل من الحد المطلوب',
      severity: 'critical',
      daysUntilDeadline: 7,
      affectedEmployees: 0,
      recommendation: 'Hire Saudi nationals or apply for exemption',
      recommendationAr: 'توظيف مواطنين سعوديين أو التقدم للإعفاء',
      autoFixable: false
    }
  ]);

  const [optimizations, setOptimizations] = useState<AIOptimization[]>([
    {
      id: '1',
      platform: 'HRSD',
      optimization: 'Automated Contract Updates',
      optimizationAr: 'تحديث العقود الآلي',
      impact: 'Reduces manual processing time by 80%',
      impactAr: 'يقلل وقت المعالجة اليدوية بنسبة 80%',
      savings: 45000,
      implementationTime: '2 weeks',
      confidence: 94.5,
      status: 'pending'
    },
    {
      id: '2',
      platform: 'Qiwa',
      optimization: 'Predictive Compliance Monitoring',
      optimizationAr: 'مراقبة الامتثال التنبؤية',
      impact: 'Prevents violations before they occur',
      impactAr: 'يمنع المخالفات قبل حدوثها',
      savings: 125000,
      implementationTime: '3 weeks',
      confidence: 91.2,
      status: 'implementing'
    },
    {
      id: '3',
      platform: 'GOSI',
      optimization: 'Smart Contribution Calculation',
      optimizationAr: 'حساب المساهمات الذكي',
      impact: 'Eliminates calculation errors completely',
      impactAr: 'يقضي على أخطاء الحساب تماماً',
      savings: 85000,
      implementationTime: '1 week',
      confidence: 98.7,
      status: 'completed'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-brand-success';
      case 'syncing': return 'bg-brand-primary';
      case 'error': return 'bg-brand-destructive';
      case 'pending': return 'bg-brand-warning';
      default: return 'bg-muted';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-muted';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'HRSD': return <Building className="w-5 h-5" />;
      case 'Qiwa': return <Users className="w-5 h-5" />;
      case 'GOSI': return <Shield className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isArabic ? 'ar-SA' : 'en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(isArabic ? 'ar-SA' : 'en-SA', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(dateString));
  };

  const handleSync = (platformId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === platformId 
        ? { ...integration, status: 'syncing' as const }
        : integration
    ));
    
    // Simulate sync completion
    setTimeout(() => {
      setIntegrations(prev => prev.map(integration => 
        integration.id === platformId 
          ? { 
              ...integration, 
              status: 'connected' as const,
              lastSync: new Date().toISOString()
            }
          : integration
      ));
    }, 3000);
  };

  const handleAutoFix = (alertId: string) => {
    setComplianceAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-primary/10 rounded-lg">
          <Globe className="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {isArabic ? 'تكامل الذكاء الاصطناعي الحكومي' : 'Government AI Integration'}
          </h2>
          <p className="text-muted-foreground">
            {isArabic ? 'تكامل ذكي مع المنصات الحكومية والمراقبة التنبؤية للامتثال' : 'Intelligent integration with government platforms and predictive compliance monitoring'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'المنصات المتصلة' : 'Connected Platforms'}
                </p>
                <p className="text-2xl font-bold text-brand-primary">
                  {integrations.filter(i => i.status === 'connected').length}/3
                </p>
              </div>
              <Globe className="w-8 h-8 text-brand-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'معدل الامتثال' : 'Compliance Rate'}
                </p>
                <p className="text-2xl font-bold text-brand-success">
                  {(integrations.reduce((acc, i) => acc + i.complianceRate, 0) / integrations.length).toFixed(1)}%
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-brand-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'التنبيهات الحرجة' : 'Critical Alerts'}
                </p>
                <p className="text-2xl font-bold text-brand-destructive">
                  {complianceAlerts.filter(a => a.severity === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-brand-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'التوفير المقدر' : 'Est. Savings'}
                </p>
                <p className="text-2xl font-bold text-brand-accent">
                  {formatCurrency(optimizations.reduce((acc, o) => acc + o.savings, 0))}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-brand-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="platforms" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platforms">
            {isArabic ? 'المنصات' : 'Platforms'}
          </TabsTrigger>
          <TabsTrigger value="compliance">
            {isArabic ? 'تنبيهات الامتثال' : 'Compliance Alerts'}
          </TabsTrigger>
          <TabsTrigger value="optimizations">
            {isArabic ? 'التحسينات الذكية' : 'Smart Optimizations'}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            {isArabic ? 'التحليلات' : 'Analytics'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-primary/10 rounded-lg">
                        {getPlatformIcon(integration.platform)}
                      </div>
                      <CardTitle className="text-lg">
                        {integration.platform}
                      </CardTitle>
                    </div>
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {isArabic ? 'آخر مزامنة: ' : 'Last sync: '} {formatDate(integration.lastSync)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{isArabic ? 'دقة البيانات' : 'Data Accuracy'}</p>
                      <p className="font-semibold text-brand-success">{integration.dataAccuracy}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{isArabic ? 'الأتمتة' : 'Automation'}</p>
                      <p className="font-semibold text-brand-primary">{integration.automationLevel}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{isArabic ? 'معدل الامتثال' : 'Compliance Rate'}</span>
                      <span>{integration.complianceRate}%</span>
                    </div>
                    <Progress value={integration.complianceRate} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-sm">
                      <p className="text-muted-foreground">{isArabic ? 'المشاكل المكتشفة' : 'Issues Detected'}</p>
                      <p className="font-semibold text-brand-warning">{integration.issuesDetected}</p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleSync(integration.id)}
                      disabled={integration.status === 'syncing'}
                      className="bg-brand-primary hover:bg-brand-primary/80"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${integration.status === 'syncing' ? 'animate-spin' : ''}`} />
                      {isArabic ? 'مزامنة' : 'Sync'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {complianceAlerts.map((alert) => (
              <Card key={alert.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {isArabic ? alert.titleAr : alert.title}
                    </CardTitle>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <CardDescription>
                    {alert.platform} • {alert.daysUntilDeadline} {isArabic ? 'يوم متبقي' : 'days remaining'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{isArabic ? 'الموظفون المتأثرون' : 'Affected Employees'}</p>
                      <p className="font-semibold text-brand-warning">{alert.affectedEmployees}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{isArabic ? 'الإصلاح التلقائي' : 'Auto-fixable'}</p>
                      <p className="font-semibold">
                        {alert.autoFixable ? (
                          <span className="text-brand-success">{isArabic ? 'نعم' : 'Yes'}</span>
                        ) : (
                          <span className="text-brand-destructive">{isArabic ? 'لا' : 'No'}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-2">
                      {isArabic ? 'التوصية:' : 'Recommendation:'}
                    </p>
                    <p className="text-sm">
                      {isArabic ? alert.recommendationAr : alert.recommendation}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    {alert.autoFixable && (
                      <Button 
                        size="sm" 
                        onClick={() => handleAutoFix(alert.id)}
                        className="bg-brand-success hover:bg-brand-success/80"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {isArabic ? 'إصلاح تلقائي' : 'Auto Fix'}
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      {isArabic ? 'تفاصيل' : 'Details'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optimizations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {optimizations.map((optimization) => (
              <Card key={optimization.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {isArabic ? optimization.optimizationAr : optimization.optimization}
                    </CardTitle>
                    <Badge className={getStatusColor(optimization.status)}>
                      {optimization.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {optimization.platform} • {optimization.implementationTime}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-2">
                      {isArabic ? 'التأثير:' : 'Impact:'}
                    </p>
                    <p className="text-sm">
                      {isArabic ? optimization.impactAr : optimization.impact}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{isArabic ? 'التوفير المقدر' : 'Est. Savings'}</p>
                      <p className="font-semibold text-brand-success">{formatCurrency(optimization.savings)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{isArabic ? 'الثقة' : 'Confidence'}</p>
                      <p className="font-semibold text-brand-primary">{optimization.confidence}%</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    {optimization.status === 'pending' && (
                      <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/80">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        {isArabic ? 'تنفيذ' : 'Implement'}
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      {isArabic ? 'التفاصيل' : 'Details'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? 'أداء التكامل' : 'Integration Performance'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'إجمالي المزامنات اليومية' : 'Total Daily Syncs'}</span>
                    <span className="font-bold text-brand-primary">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'متوسط وقت المعالجة' : 'Avg Processing Time'}</span>
                    <span className="font-bold text-brand-success">2.3s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'معدل نجاح المزامنة' : 'Sync Success Rate'}</span>
                    <span className="font-bold text-brand-accent">99.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {isArabic ? 'مقاييس الامتثال' : 'Compliance Metrics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'المخالفات المنعة' : 'Violations Prevented'}</span>
                    <span className="font-bold text-brand-success">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'الإجراءات التلقائية' : 'Automated Actions'}</span>
                    <span className="font-bold text-brand-primary">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{isArabic ? 'التوفير الإجمالي' : 'Total Savings'}</span>
                    <span className="font-bold text-brand-warning">{formatCurrency(255000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GovernmentAIIntegration;