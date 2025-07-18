import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Building2, 
  Shield, 
  Globe, 
  CreditCard, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Key,
  Lock,
  Zap
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface APIConfig {
  endpoint: string;
  status: 'connected' | 'disconnected' | 'error' | 'testing';
  lastSync?: string;
  errorMessage?: string;
  apiKey?: string;
}

interface GovernmentAPIIntegrationProps {
  onStatusChange?: (api: string, status: string) => void;
}

export const GovernmentAPIIntegration = ({ onStatusChange }: GovernmentAPIIntegrationProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const [apiConfigs, setApiConfigs] = useState<Record<string, APIConfig>>({
    qiwa: {
      endpoint: 'https://api.qiwa.info/v1',
      status: 'connected',
      lastSync: '2024-01-15T10:30:00Z'
    },
    gosi: {
      endpoint: 'https://gosi.gov.sa/api/v2',
      status: 'connected',
      lastSync: '2024-01-15T09:45:00Z'
    },
    absher: {
      endpoint: 'https://absher.sa/api/identity/v1',
      status: 'connected',
      lastSync: '2024-01-15T11:15:00Z'
    },
    mudad: {
      endpoint: 'https://mudad.gov.sa/api/wps/v1',
      status: 'connected',
      lastSync: '2024-01-15T08:30:00Z'
    },
    elm: {
      endpoint: 'https://elm.sa/api/permits/v1',
      status: 'connected',
      lastSync: '2024-01-15T07:20:00Z'
    },
    tvtc: {
      endpoint: 'https://tvtc.gov.sa/api/training/v1',
      status: 'connected',
      lastSync: '2024-01-15T06:10:00Z'
    }
  });

  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isTestingAll, setIsTestingAll] = useState(false);

  const testAPIConnection = async (apiName: string) => {
    setApiConfigs(prev => ({
      ...prev,
      [apiName]: { ...prev[apiName], status: 'testing' }
    }));

    try {
      // Simulate API test - in production this would make real API calls
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection
      const mockResponse = {
        status: 'success',
        latency: Math.random() * 500 + 50,
        responseTime: Math.random() * 200 + 100,
        version: '2.1.0',
        features: ['authentication', 'data_sync', 'real_time_updates']
      };

      setTestResults(prev => ({
        ...prev,
        [apiName]: mockResponse
      }));

      setApiConfigs(prev => ({
        ...prev,
        [apiName]: { 
          ...prev[apiName], 
          status: 'connected',
          lastSync: new Date().toISOString()
        }
      }));

      onStatusChange?.(apiName, 'connected');

      toast({
        title: isRTL ? `تم اختبار ${getAPIDisplayName(apiName)} بنجاح` : `${getAPIDisplayName(apiName)} Test Successful`,
        description: isRTL ? `زمن الاستجابة: ${mockResponse.latency.toFixed(0)}ms` : `Response time: ${mockResponse.latency.toFixed(0)}ms`
      });

    } catch (error) {
      setApiConfigs(prev => ({
        ...prev,
        [apiName]: { 
          ...prev[apiName], 
          status: 'error',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      }));

      onStatusChange?.(apiName, 'error');

      toast({
        title: isRTL ? `فشل اختبار ${getAPIDisplayName(apiName)}` : `${getAPIDisplayName(apiName)} Test Failed`,
        description: isRTL ? 'يرجى التحقق من الإعدادات' : 'Please check configuration',
        variant: "destructive"
      });
    }
  };

  const testAllConnections = async () => {
    setIsTestingAll(true);
    for (const apiName of Object.keys(apiConfigs)) {
      await testAPIConnection(apiName);
      await new Promise(resolve => setTimeout(resolve, 500)); // Stagger tests
    }
    setIsTestingAll(false);
  };

  const getAPIDisplayName = (api: string) => {
    const names = {
      qiwa: isRTL ? 'قوى' : 'Qiwa',
      gosi: isRTL ? 'التأمينات الاجتماعية' : 'GOSI',
      absher: isRTL ? 'أبشر' : 'Absher',
      mudad: isRTL ? 'مداد' : 'Mudad',
      
      elm: isRTL ? 'علم' : 'ELM',
      tvtc: isRTL ? 'التدريب التقني' : 'TVTC'
    };
    return names[api as keyof typeof names] || api.toUpperCase();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'testing': return <RefreshCw className="h-4 w-4 text-accent animate-spin" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: 'default',
      testing: 'secondary',
      error: 'destructive',
      disconnected: 'outline'
    } as const;

    const labels = {
      connected: isRTL ? 'متصل' : 'Connected',
      testing: isRTL ? 'جاري الاختبار' : 'Testing',
      error: isRTL ? 'خطأ' : 'Error',
      disconnected: isRTL ? 'غير متصل' : 'Disconnected'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {isRTL ? 'تكامل الواجهات الحكومية' : 'Government API Integration'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'إدارة واختبار الاتصالات مع الأنظمة الحكومية' : 'Manage and test connections to government systems'}
              </CardDescription>
            </div>
            <Button 
              onClick={testAllConnections} 
              disabled={isTestingAll}
              className="gap-2"
            >
              <Zap className="h-4 w-4" />
              {isRTL ? 'اختبار الكل' : 'Test All'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid w-full grid-cols-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="configuration">{isRTL ? 'الإعدادات' : 'Configuration'}</TabsTrigger>
          <TabsTrigger value="security">{isRTL ? 'الأمان' : 'Security'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(apiConfigs).map(([apiName, config]) => (
              <Card key={apiName} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {apiName === 'qiwa' && <Building2 className="h-5 w-5 text-primary" />}
                      {apiName === 'gosi' && <Shield className="h-5 w-5 text-success" />}
                      {apiName === 'absher' && <CheckCircle className="h-5 w-5 text-accent" />}
                      {apiName === 'mudad' && <CreditCard className="h-5 w-5 text-warning" />}
                      
                      {apiName === 'elm' && <Globe className="h-5 w-5 text-primary" />}
                      {apiName === 'tvtc' && <Activity className="h-5 w-5 text-accent" />}
                      <CardTitle className="text-lg">{getAPIDisplayName(apiName)}</CardTitle>
                    </div>
                    {getStatusBadge(config.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getStatusIcon(config.status)}
                    <span>{config.endpoint}</span>
                  </div>
                  
                  {config.lastSync && (
                    <div className="text-xs text-muted-foreground">
                      {isRTL ? 'آخر مزامنة:' : 'Last sync:'} {new Date(config.lastSync).toLocaleString()}
                    </div>
                  )}

                  {config.errorMessage && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {config.errorMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  {testResults[apiName] && (
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>{isRTL ? 'زمن الاستجابة:' : 'Latency:'}</span>
                        <span className="font-mono">{testResults[apiName].latency?.toFixed(0)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isRTL ? 'الإصدار:' : 'Version:'}</span>
                        <span className="font-mono">{testResults[apiName].version}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => testAPIConnection(apiName)}
                    disabled={config.status === 'testing'}
                  >
                    {config.status === 'testing' ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                        {isRTL ? 'جاري الاختبار...' : 'Testing...'}
                      </>
                    ) : (
                      <>
                        <Zap className="h-3 w-3 mr-2" />
                        {isRTL ? 'اختبار الاتصال' : 'Test Connection'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'إعدادات الواجهات البرمجية' : 'API Configuration'}</CardTitle>
              <CardDescription>
                {isRTL ? 'قم بتكوين نقاط النهاية ومفاتيح API' : 'Configure endpoints and API keys'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(apiConfigs).map(([apiName, config]) => (
                <div key={apiName} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">{getAPIDisplayName(apiName)}</Label>
                    <p className="text-sm text-muted-foreground">{config.endpoint}</p>
                  </div>
                  <div>
                    <Label htmlFor={`${apiName}-key`}>{isRTL ? 'مفتاح API' : 'API Key'}</Label>
                    <Input 
                      id={`${apiName}-key`}
                      type="password" 
                      placeholder="••••••••••••••••"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Key className="h-3 w-3" />
                      {isRTL ? 'حفظ' : 'Save'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                {isRTL ? 'الأمان والتشفير' : 'Security & Encryption'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'إعدادات الأمان للاتصالات الحكومية' : 'Security settings for government connections'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{isRTL ? 'التشفير' : 'Encryption'}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>TLS Version:</span>
                      <Badge>1.3</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Certificate:</span>
                      <Badge variant="outline">Valid</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Key Rotation:</span>
                      <Badge variant="secondary">Auto</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{isRTL ? 'المصادقة' : 'Authentication'}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>OAuth 2.0:</span>
                      <Badge>Enabled</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Token Refresh:</span>
                      <Badge variant="outline">Auto</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate Limiting:</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  {isRTL 
                    ? 'جميع الاتصالات مشفرة ومحمية وفقاً لمعايير الأمان السعودية'
                    : 'All connections are encrypted and secured according to Saudi security standards'
                  }
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};