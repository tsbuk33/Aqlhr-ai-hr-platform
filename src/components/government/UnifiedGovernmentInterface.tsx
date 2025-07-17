import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { usePerformantLocalization } from "@/hooks/usePerformantLocalization";
import { AqlAIFileProcessor } from "@/components/aql/AqlAIFileProcessor";
import { 
  Activity, 
  CheckCircle, 
  Clock, 
  Shield, 
  Zap,
  AlertTriangle,
  Globe,
  Wifi,
  WifiOff,
  RefreshCw
} from "lucide-react";

interface ConnectionStatus {
  status: 'connected' | 'disconnected' | 'testing' | 'error';
  lastSync?: string;
  responseTime?: number;
  errorMessage?: string;
}

interface UnifiedGovernmentInterfaceProps {
  platformName: string;
  platformNameAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ComponentType<any>;
  connectionStatus: ConnectionStatus;
  onTestConnection: () => Promise<void>;
  onSyncNow: () => Promise<void>;
  children?: React.ReactNode;
}

export const UnifiedGovernmentInterface = ({
  platformName,
  platformNameAr,
  description,
  descriptionAr,
  icon: Icon,
  connectionStatus,
  onTestConnection,
  onSyncNow,
  children
}: UnifiedGovernmentInterfaceProps) => {
  const { t, isRTL } = useLanguage();
  const { directionClasses, formatters } = usePerformantLocalization();
  
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      await onTestConnection();
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      await onSyncNow();
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'testing': return <RefreshCw className="h-4 w-4 text-accent animate-spin" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <WifiOff className="h-4 w-4 text-muted-foreground" />;
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
      connected: isRTL ? 'متصل' : 'API Connected',
      testing: isRTL ? 'جاري الاختبار' : 'Testing',
      error: isRTL ? 'خطأ في الاتصال' : 'Connection Error',
      disconnected: isRTL ? 'غير متصل' : 'API Disconnected'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {getStatusIcon(status)}
        <span className="ml-1">{labels[status as keyof typeof labels] || status}</span>
      </Badge>
    );
  };

  const displayName = isRTL ? platformNameAr : platformName;
  const displayDescription = isRTL ? descriptionAr : description;

  return (
    <div className={`container mx-auto p-6 space-y-6 ${directionClasses.container}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex justify-between items-center ${directionClasses.flex}`}>
        <div className={directionClasses.text}>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Icon className="h-8 w-8" />
            {displayName}
          </h1>
          <p className="text-muted-foreground mt-2">{displayDescription}</p>
        </div>
        <div className={`flex gap-2 ${directionClasses.flex}`}>
          {getStatusBadge(connectionStatus.status)}
          <Button 
            variant="outline" 
            onClick={handleTestConnection}
            disabled={isTestingConnection}
          >
            {isTestingConnection ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                {isRTL ? 'جاري الاختبار...' : 'Testing...'}
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                {isRTL ? 'اختبار الاتصال' : 'Test Integration'}
              </>
            )}
          </Button>
          {connectionStatus.status === 'connected' && (
            <Button 
              variant="default" 
              onClick={handleSyncNow}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {isRTL ? 'جاري المزامنة...' : 'Syncing...'}
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {isRTL ? 'مزامنة الآن' : 'Sync Now'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Connection Status Details */}
      {connectionStatus.status === 'connected' && connectionStatus.responseTime && (
        <Card className="border-success">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">
                  {isRTL ? 'حالة الاتصال: نشط' : 'Connection Status: Active'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {connectionStatus.lastSync && (
                  <span>
                    {isRTL ? 'آخر مزامنة:' : 'Last sync:'} {new Date(connectionStatus.lastSync).toLocaleString()}
                  </span>
                )}
                <span>
                  {isRTL ? 'زمن الاستجابة:' : 'Response time:'} {connectionStatus.responseTime}ms
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {connectionStatus.status === 'error' && connectionStatus.errorMessage && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {isRTL ? 'خطأ في الاتصال:' : 'Connection Error:'} {connectionStatus.errorMessage}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid w-full grid-cols-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="api-integration">{isRTL ? 'تكامل الواجهات' : 'API Integration'}</TabsTrigger>
          <TabsTrigger value="file-upload">{isRTL ? 'رفع الملفات' : 'File Upload'}</TabsTrigger>
          <TabsTrigger value="configuration">{isRTL ? 'الإعدادات' : 'Configuration'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {children}
        </TabsContent>

        <TabsContent value="api-integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {isRTL ? 'تكامل الواجهات البرمجية' : 'API Integration Management'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 
                  'إدارة الاتصال المباشر مع الأنظمة الحكومية عبر الواجهات البرمجية' :
                  'Manage direct connection to government systems through official APIs'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{isRTL ? 'حالة الواجهة البرمجية' : 'API Status'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{isRTL ? 'الحالة:' : 'Status:'}</span>
                      {getStatusBadge(connectionStatus.status)}
                    </div>
                    {connectionStatus.responseTime && (
                      <div className="flex justify-between">
                        <span className="text-sm">{isRTL ? 'زمن الاستجابة:' : 'Response Time:'}</span>
                        <span className="text-sm font-mono">{connectionStatus.responseTime}ms</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm">{isRTL ? 'التشفير:' : 'Encryption:'}</span>
                      <Badge variant="outline">TLS 1.3</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{isRTL ? 'إحصائيات الاستخدام' : 'Usage Statistics'}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{isRTL ? 'الطلبات اليوم:' : 'Requests Today:'}</span>
                      <span className="font-mono">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isRTL ? 'معدل النجاح:' : 'Success Rate:'}</span>
                      <span className="font-mono text-success">99.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isRTL ? 'الحد المسموح:' : 'Rate Limit:'}</span>
                      <span className="font-mono">5000/hour</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="file-upload" className="space-y-6">
          <AqlAIFileProcessor 
            platform={displayName}
            moduleType="government"
            onFileProcessed={(file) => {
              console.log('File processed:', file);
            }}
          />
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'إعدادات التكامل' : 'Integration Settings'}</CardTitle>
              <CardDescription>
                {isRTL ? 
                  'تكوين خيارات التكامل والمزامنة' :
                  'Configure integration and synchronization options'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isRTL ? 'وضع التشغيل:' : 'Operation Mode:'}
                  </label>
                  <div className="flex gap-2">
                    <Badge variant={connectionStatus.status === 'connected' ? 'default' : 'outline'}>
                      {isRTL ? 'واجهة برمجية' : 'API Integration'}
                    </Badge>
                    <Badge variant={connectionStatus.status !== 'connected' ? 'default' : 'outline'}>
                      {isRTL ? 'رفع ملفات' : 'File Upload'}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isRTL ? 'تكرار المزامنة:' : 'Sync Frequency:'}
                  </label>
                  <Badge variant="secondary">
                    {isRTL ? 'كل 15 دقيقة' : 'Every 15 minutes'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};