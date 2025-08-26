import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { 
  CheckCircle, 
  AlertTriangle, 
  Settings, 
  Zap, 
  Building2, 
  Shield,
  Globe,
  Database,
  RefreshCw,
  Play
} from 'lucide-react';

const IntegrationsPage: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const isArabic = language === 'ar';

  const governmentIntegrations = [
    { name: isArabic ? 'قوى' : 'Qiwa', status: 'connected', api: 'REST API v2.1', lastSync: '2024-01-15 14:30' },
    { name: isArabic ? 'التأمينات الاجتماعية' : 'GOSI', status: 'connected', api: 'SOAP v1.5', lastSync: '2024-01-15 14:25' },
    { name: isArabic ? 'أبشر' : 'Absher', status: 'connected', api: 'REST API v3.0', lastSync: '2024-01-15 14:20' },
    { name: isArabic ? 'علم' : 'ELM', status: 'configuring', api: 'REST API v2.0', lastSync: null },
    { name: isArabic ? 'مقيم' : 'Muqeem', status: 'connected', api: 'REST API v1.8', lastSync: '2024-01-15 14:15' },
    { name: isArabic ? 'صحة' : 'Seha', status: 'available', api: 'REST API v2.2', lastSync: null },
  ];

  const businessTools = [
    { name: 'Microsoft Teams', status: 'connected', category: 'Communication', users: 245 },
    { name: 'Slack', status: 'connected', category: 'Communication', users: 89 },
    { name: 'SharePoint', status: 'connected', category: 'Documents', users: 156 },
    { name: 'Power BI', status: 'connected', category: 'Analytics', users: 34 },
    { name: 'Zapier', status: 'configuring', category: 'Automation', users: 0 },
    { name: 'DocuSign', status: 'available', category: 'Digital Signature', users: 0 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'configuring': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'available': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'configuring': return <Settings className="h-4 w-4" />;
      case 'available': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className={`container mx-auto p-6 space-y-8 max-w-7xl ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isArabic ? 'التكاملات والأدوات' : 'Integrations & Tools'}
            </h1>
            <p className="text-muted-foreground">
              {isArabic 
                ? 'إدارة التكاملات الحكومية والأدوات التجارية'
                : 'Manage government integrations and business tools'}
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">22</p>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'تكامل حكومي' : 'Gov Integrations'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">24</p>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'أدوات تجارية' : 'Business Tools'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">96.8%</p>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'معدل التشغيل' : 'Uptime Rate'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">ISO 27001</p>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'أمان البيانات' : 'Data Security'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            {isArabic ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="government">
            {isArabic ? 'التكاملات الحكومية' : 'Government'}
          </TabsTrigger>
          <TabsTrigger value="tools">
            {isArabic ? 'الأدوات التجارية' : 'Business Tools'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                {isArabic ? 'صحة النظام' : 'System Health'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'مراقبة الأداء في الوقت الفعلي'
                  : 'Real-time performance monitoring'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">38</div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'متصل وفعال' : 'Active Connections'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">6</div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'قيد الإعداد' : 'Configuring'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
                  <div className="text-sm text-muted-foreground">
                    {isArabic ? 'متاح للتفعيل' : 'Available'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-auto p-4 flex-col gap-2">
                  <RefreshCw className="h-6 w-6" />
                  {isArabic ? 'مزامنة جميع الأنظمة' : 'Sync All Systems'}
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Settings className="h-6 w-6" />
                  {isArabic ? 'إعدادات التكامل' : 'Integration Settings'}
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Play className="h-6 w-6" />
                  {isArabic ? 'تشغيل اختبارات' : 'Run Tests'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="government" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {isArabic ? 'التكاملات الحكومية' : 'Government Integrations'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'التكامل مع الأنظمة الحكومية السعودية'
                  : 'Integration with Saudi government systems'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {governmentIntegrations.map((integration, index) => (
                  <Card key={index} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-foreground">
                          {integration.name}
                        </h4>
                        <Badge className={getStatusColor(integration.status)}>
                          {getStatusIcon(integration.status)}
                          <span className="mr-1">
                            {isArabic 
                              ? (integration.status === 'connected' ? 'متصل' : 
                                 integration.status === 'configuring' ? 'إعداد' : 'متاح')
                              : integration.status}
                          </span>
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div>API: {integration.api}</div>
                        {integration.lastSync && (
                          <div>
                            {isArabic ? 'آخر مزامنة:' : 'Last Sync:'} {integration.lastSync}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                {isArabic ? 'الأدوات التجارية' : 'Business Tools'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'أدوات الإنتاجية والتعاون التجارية'
                  : 'Business productivity and collaboration tools'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businessTools.map((tool, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {tool.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {tool.category}
                          </p>
                        </div>
                        <Badge className={getStatusColor(tool.status)}>
                          {getStatusIcon(tool.status)}
                          <span className="mr-1">
                            {isArabic 
                              ? (tool.status === 'connected' ? 'متصل' : 
                                 tool.status === 'configuring' ? 'إعداد' : 'متاح')
                              : tool.status}
                          </span>
                        </Badge>
                      </div>
                      {tool.users > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {isArabic ? 'المستخدمون:' : 'Users:'} {tool.users}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationsPage;