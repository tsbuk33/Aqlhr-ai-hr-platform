import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGovernmentPortals, type GovernmentPortalStatus } from '@/hooks/useGovernmentPortals';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Database,
  FileText,
  Play,
  RefreshCw,
  Settings,
  Zap,
  Shield,
  Building,
  GraduationCap,
  Heart,
  Scale,
  Truck,
  Users,
  Wrench
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'labor': return <Users className="h-4 w-4" />;
    case 'health': return <Heart className="h-4 w-4" />;
    case 'education': return <GraduationCap className="h-4 w-4" />;
    case 'interior': return <Shield className="h-4 w-4" />;
    case 'justice': return <Scale className="h-4 w-4" />;
    case 'commerce': return <Building className="h-4 w-4" />;
    case 'professional': return <Wrench className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

const PortalCard = ({ 
  portal, 
  onConnect, 
  onDisconnect, 
  onTest, 
  onConfigure 
}: {
  portal: GovernmentPortalStatus;
  onConnect: (portalCode: string) => void;
  onDisconnect: (portalCode: string) => void;
  onTest: (portalCode: string) => void;
  onConfigure: (portalCode: string) => void;
}) => {
  const { isArabic } = useUnifiedLocale();

  const getStatusIcon = () => {
    switch (portal.connection_status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'demo': return <Zap className="h-4 w-4 text-warning" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (portal.connection_status) {
      case 'connected': return 'bg-success/10 text-success border-success/20';
      case 'demo': return 'bg-warning/10 text-warning border-warning/20';
      case 'error': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          {getCategoryIcon(portal.category)}
          <div>
            <CardTitle className="text-sm font-medium">
              {isArabic ? portal.portal_name_ar : portal.portal_name_en}
            </CardTitle>
            <p className="text-xs text-muted-foreground capitalize">{portal.category}</p>
          </div>
        </div>
        {getStatusIcon()}
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={getStatusColor()}>
            {portal.connection_status.toUpperCase()}
          </Badge>
          
          {portal.compliance_count > 0 && (
            <Badge variant="secondary">
              {portal.compliance_count} {isArabic ? 'امتثال' : 'Compliant'}
            </Badge>
          )}
        </div>
        
        {portal.last_sync_at && (
          <p className="text-xs text-muted-foreground">
            {isArabic ? 'آخر مزامنة:' : 'Last sync:'} {formatDistanceToNow(new Date(portal.last_sync_at), { addSuffix: true })}
          </p>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p>{isArabic ? 'العمليات المدعومة:' : 'Supported operations:'} {isArabic ? 'متعددة' : 'Multiple'}</p>
          <p>{isArabic ? 'الحد اليومي:' : 'Daily limit:'} {isArabic ? 'حسب النوع' : 'Varies by type'}</p>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onTest(portal.portal_code)}
            className="flex-1"
          >
            <Play className="h-3 w-3 mr-1" />
            {isArabic ? 'اختبار' : 'Test'}
          </Button>
          
          {portal.connection_status === 'connected' ? (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onDisconnect(portal.portal_code)}
              className="flex-1"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              {isArabic ? 'قطع' : 'Disconnect'}
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="default"
              onClick={() => onConnect(portal.portal_code)}
              className="flex-1"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {isArabic ? 'ربط' : 'Connect'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ConfigurationPanel = ({ 
  selectedPortal, 
  onSave, 
  onClose 
}: {
  selectedPortal: GovernmentPortalStatus | null;
  onSave: (portalCode: string, config: Record<string, any>) => void;
  onClose: () => void;
}) => {
  const { isArabic } = useUnifiedLocale();
  const [config, setConfig] = useState({
    api_key: '',
    endpoint_url: '',
    timeout: 30000,
    retry_count: 3,
    auto_sync: true
  });

  if (!selectedPortal) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {isArabic ? 'تكوين' : 'Configuration'} - {isArabic ? selectedPortal.portal_name_ar : selectedPortal.portal_name_en}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="api_key">{isArabic ? 'مفتاح API' : 'API Key'}</Label>
            <Input
              id="api_key"
              type="password"
              value={config.api_key}
              onChange={(e) => setConfig(prev => ({ ...prev, api_key: e.target.value }))}
              placeholder={isArabic ? 'أدخل مفتاح API' : 'Enter API key'}
            />
          </div>
          
          <div>
            <Label htmlFor="endpoint_url">{isArabic ? 'رابط النهاية' : 'Endpoint URL'}</Label>
            <Input
              id="endpoint_url"
              value={config.endpoint_url}
              onChange={(e) => setConfig(prev => ({ ...prev, endpoint_url: e.target.value }))}
              placeholder="https://api.example.com"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button onClick={() => onSave(selectedPortal.portal_code, config)}>
            {isArabic ? 'حفظ' : 'Save'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const CompleteGovernmentHub = () => {
  const { isArabic } = useUnifiedLocale();
  const { 
    portalStatus, 
    loading, 
    statistics,
    initializePortals,
    connectPortal,
    disconnectPortal,
    testPortalConnection,
    refetch
  } = useGovernmentPortals();

  const [selectedPortal, setSelectedPortal] = useState<GovernmentPortalStatus | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleConnect = async (portalCode: string) => {
    await connectPortal(portalCode);
  };

  const handleDisconnect = async (portalCode: string) => {
    await disconnectPortal(portalCode);
  };

  const handleTest = async (portalCode: string) => {
    await testPortalConnection(portalCode);
  };

  const handleConfigure = (portalCode: string) => {
    const portal = portalStatus.find(p => p.portal_code === portalCode);
    setSelectedPortal(portal || null);
    setActiveTab('configuration');
  };

  const handleSaveConfig = async (portalCode: string, config: Record<string, any>) => {
    await connectPortal(portalCode, config);
    setSelectedPortal(null);
    setActiveTab('overview');
  };

  const groupedPortals = portalStatus.reduce((acc, portal) => {
    const category = portal.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(portal);
    return acc;
  }, {} as Record<string, GovernmentPortalStatus[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>{isArabic ? 'جاري تحميل المنصات الحكومية...' : 'Loading government portals...'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isArabic ? 'مركز التكامل الحكومي الشامل' : 'Complete Government Integration Hub'}
          </h1>
          <p className="text-muted-foreground">
            {isArabic 
              ? 'تكامل شامل مع أكثر من 21 منصة حكومية سعودية' 
              : 'Comprehensive integration with 21+ Saudi government portals'
            }
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {isArabic ? 'تحديث' : 'Refresh'}
          </Button>
          
          <Button onClick={initializePortals} size="sm">
            <Database className="h-4 w-4 mr-2" />
            {isArabic ? 'تهيئة' : 'Initialize'}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{statistics.totalPortals}</CardTitle>
            <CardDescription>{isArabic ? 'إجمالي المنصات' : 'Total Portals'}</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-success">{statistics.connectedPortals}</CardTitle>
            <CardDescription>{isArabic ? 'متصلة' : 'Connected'}</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-warning">{statistics.demoPortals}</CardTitle>
            <CardDescription>{isArabic ? 'تجريبي' : 'Demo Mode'}</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-destructive">{statistics.errorPortals}</CardTitle>
            <CardDescription>{isArabic ? 'أخطاء' : 'Errors'}</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{statistics.connectionRate.toFixed(1)}%</CardTitle>
            <CardDescription>{isArabic ? 'معدل الاتصال' : 'Connection Rate'}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {isArabic ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="labor" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {isArabic ? 'العمل' : 'Labor'} ({statistics.categoryStats.labor || 0})
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            {isArabic ? 'الصحة' : 'Health'} ({statistics.categoryStats.health || 0})
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            {isArabic ? 'التعليم' : 'Education'} ({statistics.categoryStats.education || 0})
          </TabsTrigger>
          <TabsTrigger value="configuration" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {isArabic ? 'التكوين' : 'Configuration'}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {Object.entries(groupedPortals).map(([category, portals]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-2">
                {getCategoryIcon(category)}
                <h2 className="text-lg font-semibold capitalize">
                  {isArabic ? getCategoryNameArabic(category) : category} ({portals.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {portals.map((portal, index) => (
                  <PortalCard
                    key={portal.portal_code || index}
                    portal={portal}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                    onTest={handleTest}
                    onConfigure={handleConfigure}
                  />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Category-specific tabs */}
        {Object.entries(groupedPortals).map(([category, portals]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portals.map((portal, index) => (
                <PortalCard
                  key={portal.portal_code || index}
                  portal={portal}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                  onTest={handleTest}
                  onConfigure={handleConfigure}
                />
              ))}
            </div>
          </TabsContent>
        ))}

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-4">
          {selectedPortal ? (
            <ConfigurationPanel
              selectedPortal={selectedPortal}
              onSave={handleSaveConfig}
              onClose={() => setSelectedPortal(null)}
            />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {isArabic 
                    ? 'اختر منصة حكومية لتكوينها' 
                    : 'Select a government portal to configure'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function for Arabic category names
function getCategoryNameArabic(category: string): string {
  const arabicNames = {
    labor: 'العمل',
    health: 'الصحة',
    education: 'التعليم',
    interior: 'الداخلية',
    justice: 'العدل',
    commerce: 'التجارة',
    professional: 'المهني'
  };
  return arabicNames[category as keyof typeof arabicNames] || category;
}