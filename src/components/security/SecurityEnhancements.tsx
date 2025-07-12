import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle, 
  Globe, 
  Database,
  Activity,
  Clock,
  UserCheck,
  FileCheck,
  Zap,
  Bell,
  Settings
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SecurityFeature {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  enabled: boolean;
  level: 'basic' | 'advanced' | 'enterprise';
  category: 'authentication' | 'encryption' | 'monitoring' | 'compliance';
  status: 'active' | 'inactive' | 'warning';
}

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'data_access' | 'config_change' | 'threat_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  messageAr: string;
  timestamp: string;
  user?: string;
  ip?: string;
  resolved: boolean;
}

export const SecurityEnhancements = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const [securityScore, setSecurityScore] = useState(87);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);

  const [securityFeatures, setSecurityFeatures] = useState<SecurityFeature[]>([
    {
      id: 'mfa',
      name: 'Multi-Factor Authentication',
      nameAr: 'المصادقة متعددة العوامل',
      description: 'Require additional verification beyond passwords',
      descriptionAr: 'يتطلب تحقق إضافي بجانب كلمات المرور',
      enabled: true,
      level: 'enterprise',
      category: 'authentication',
      status: 'active'
    },
    {
      id: 'encryption',
      name: 'Data Encryption at Rest',
      nameAr: 'تشفير البيانات المخزنة',
      description: 'Encrypt all stored data using AES-256',
      descriptionAr: 'تشفير جميع البيانات المخزنة باستخدام AES-256',
      enabled: true,
      level: 'basic',
      category: 'encryption',
      status: 'active'
    },
    {
      id: 'ssl',
      name: 'SSL/TLS Encryption',
      nameAr: 'تشفير SSL/TLS',
      description: 'Secure data transmission with TLS 1.3',
      descriptionAr: 'تأمين نقل البيانات باستخدام TLS 1.3',
      enabled: true,
      level: 'basic',
      category: 'encryption',
      status: 'active'
    },
    {
      id: 'audit',
      name: 'Audit Logging',
      nameAr: 'سجلات المراجعة',
      description: 'Comprehensive logging of all system activities',
      descriptionAr: 'تسجيل شامل لجميع أنشطة النظام',
      enabled: true,
      level: 'advanced',
      category: 'monitoring',
      status: 'active'
    },
    {
      id: 'intrusion',
      name: 'Intrusion Detection',
      nameAr: 'كشف التسلل',
      description: 'Real-time monitoring for suspicious activities',
      descriptionAr: 'مراقبة في الوقت الفعلي للأنشطة المشبوهة',
      enabled: true,
      level: 'enterprise',
      category: 'monitoring',
      status: 'active'
    },
    {
      id: 'rbac',
      name: 'Role-Based Access Control',
      nameAr: 'التحكم في الوصول القائم على الأدوار',
      description: 'Granular permission management by user roles',
      descriptionAr: 'إدارة الصلاحيات التفصيلية حسب أدوار المستخدمين',
      enabled: true,
      level: 'advanced',
      category: 'authentication',
      status: 'active'
    },
    {
      id: 'backup_encryption',
      name: 'Backup Encryption',
      nameAr: 'تشفير النسخ الاحتياطية',
      description: 'Encrypt all backup data automatically',
      descriptionAr: 'تشفير جميع بيانات النسخ الاحتياطية تلقائياً',
      enabled: false,
      level: 'advanced',
      category: 'encryption',
      status: 'inactive'
    },
    {
      id: 'compliance',
      name: 'Saudi Data Protection Compliance',
      nameAr: 'الامتثال لحماية البيانات السعودية',
      description: 'Ensure compliance with Saudi data protection laws',
      descriptionAr: 'ضمان الامتثال لقوانين حماية البيانات السعودية',
      enabled: true,
      level: 'enterprise',
      category: 'compliance',
      status: 'active'
    }
  ]);

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'login_attempt',
      severity: 'low',
      message: 'Successful login from new device',
      messageAr: 'تسجيل دخول ناجح من جهاز جديد',
      timestamp: new Date().toISOString(),
      user: 'admin@sanadhr.com',
      ip: '192.168.1.100',
      resolved: false
    },
    {
      id: '2',
      type: 'config_change',
      severity: 'medium',
      message: 'Security configuration updated',
      messageAr: 'تم تحديث إعدادات الأمان',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      user: 'security@sanadhr.com',
      resolved: true
    },
    {
      id: '3',
      type: 'threat_detected',
      severity: 'high',
      message: 'Multiple failed login attempts detected',
      messageAr: 'تم اكتشاف محاولات تسجيل دخول فاشلة متعددة',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      ip: '45.123.456.789',
      resolved: true
    }
  ]);

  const toggleFeature = (featureId: string) => {
    setSecurityFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { 
            ...feature, 
            enabled: !feature.enabled,
            status: !feature.enabled ? 'active' : 'inactive'
          }
        : feature
    ));

    const feature = securityFeatures.find(f => f.id === featureId);
    if (feature) {
      toast({
        title: isRTL ? 'تم تحديث الأمان' : 'Security Updated',
        description: isRTL 
          ? `${feature.nameAr} ${!feature.enabled ? 'تم تفعيله' : 'تم إلغاؤه'}`
          : `${feature.name} ${!feature.enabled ? 'enabled' : 'disabled'}`,
      });
    }

    // Recalculate security score
    calculateSecurityScore();
  };

  const calculateSecurityScore = () => {
    const enabledFeatures = securityFeatures.filter(f => f.enabled);
    const totalWeight = securityFeatures.reduce((acc, f) => {
      return acc + (f.level === 'enterprise' ? 3 : f.level === 'advanced' ? 2 : 1);
    }, 0);
    
    const enabledWeight = enabledFeatures.reduce((acc, f) => {
      return acc + (f.level === 'enterprise' ? 3 : f.level === 'advanced' ? 2 : 1);
    }, 0);

    const score = Math.round((enabledWeight / totalWeight) * 100);
    setSecurityScore(score);
  };

  const runSecurityScan = async () => {
    setScanning(true);
    
    try {
      // Simulate security scan
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setLastScan(new Date().toISOString());
      calculateSecurityScore();
      
      // Add mock security event
      const newEvent: SecurityEvent = {
        id: Date.now().toString(),
        type: 'data_access',
        severity: 'low',
        message: 'Security scan completed successfully',
        messageAr: 'تم إكمال فحص الأمان بنجاح',
        timestamp: new Date().toISOString(),
        resolved: false
      };
      
      setSecurityEvents(prev => [newEvent, ...prev]);
      
      toast({
        title: isRTL ? 'تم الفحص الأمني' : 'Security Scan Complete',
        description: isRTL ? 'لم يتم العثور على تهديدات' : 'No threats detected',
      });
      
    } catch (error) {
      toast({
        title: isRTL ? 'فشل الفحص' : 'Scan Failed',
        description: isRTL ? 'حدث خطأ أثناء الفحص' : 'An error occurred during scan',
        variant: "destructive"
      });
    } finally {
      setScanning(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <UserCheck className="h-4 w-4" />;
      case 'encryption': return <Lock className="h-4 w-4" />;
      case 'monitoring': return <Eye className="h-4 w-4" />;
      case 'compliance': return <FileCheck className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: 'outline',
      medium: 'secondary',
      high: 'default',
      critical: 'destructive'
    } as const;

    const labels = {
      low: isRTL ? 'منخفض' : 'Low',
      medium: isRTL ? 'متوسط' : 'Medium',
      high: isRTL ? 'عالي' : 'High',
      critical: isRTL ? 'حرج' : 'Critical'
    };

    return (
      <Badge variant={variants[severity as keyof typeof variants]}>
        {labels[severity as keyof typeof labels]}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  useEffect(() => {
    calculateSecurityScore();
  }, [securityFeatures]);

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Security Dashboard */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {isRTL ? 'لوحة الأمان المتقدم' : 'Advanced Security Dashboard'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'مراقبة وإدارة أمان النظام' : 'Monitor and manage system security'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={runSecurityScan} 
                disabled={scanning}
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                {scanning ? (isRTL ? 'جاري الفحص...' : 'Scanning...') : (isRTL ? 'فحص أمني' : 'Security Scan')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(securityScore)}`}>
                {securityScore}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {isRTL ? 'نقاط الأمان' : 'Security Score'}
              </div>
              <Progress value={securityScore} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {securityFeatures.filter(f => f.enabled).length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {isRTL ? 'الميزات النشطة' : 'Active Features'}
              </div>
              <div className="text-xs text-muted-foreground">
                {isRTL ? `من أصل ${securityFeatures.length}` : `of ${securityFeatures.length} total`}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {securityEvents.filter(e => !e.resolved && e.severity !== 'low').length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {isRTL ? 'تنبيهات نشطة' : 'Active Alerts'}
              </div>
              {lastScan && (
                <div className="text-xs text-muted-foreground">
                  {isRTL ? 'آخر فحص:' : 'Last scan:'} {new Date(lastScan).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features & Events */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList className={`grid w-full grid-cols-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger value="features">{isRTL ? 'الميزات' : 'Features'}</TabsTrigger>
          <TabsTrigger value="events">{isRTL ? 'الأحداث' : 'Events'}</TabsTrigger>
          <TabsTrigger value="compliance">{isRTL ? 'الامتثال' : 'Compliance'}</TabsTrigger>
          <TabsTrigger value="settings">{isRTL ? 'الإعدادات' : 'Settings'}</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityFeatures.map((feature) => (
              <Card key={feature.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(feature.category)}
                      <div>
                        <CardTitle className="text-lg">
                          {isRTL ? feature.nameAr : feature.name}
                        </CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {feature.level.charAt(0).toUpperCase() + feature.level.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={() => toggleFeature(feature.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {isRTL ? feature.descriptionAr : feature.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant={feature.status === 'active' ? 'default' : 'secondary'}>
                      {feature.status === 'active' ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                    </Badge>
                    {feature.enabled && feature.status === 'active' && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="space-y-3">
            {securityEvents.map((event) => (
              <Alert key={event.id} className={
                event.severity === 'critical' ? 'border-destructive' :
                event.severity === 'high' ? 'border-warning' : 'border-info'
              }>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    {event.type === 'threat_detected' && <AlertTriangle className="h-4 w-4 text-destructive mt-1" />}
                    {event.type === 'login_attempt' && <UserCheck className="h-4 w-4 text-accent mt-1" />}
                    {event.type === 'config_change' && <Settings className="h-4 w-4 text-warning mt-1" />}
                    {event.type === 'data_access' && <Database className="h-4 w-4 text-info mt-1" />}
                    <div className="flex-1">
                      <AlertDescription className="font-medium">
                        {isRTL ? event.messageAr : event.message}
                      </AlertDescription>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{new Date(event.timestamp).toLocaleString()}</span>
                        {event.user && <span>{isRTL ? 'المستخدم:' : 'User:'} {event.user}</span>}
                        {event.ip && <span>IP: {event.ip}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(event.severity)}
                    <Badge variant={event.resolved ? "outline" : "secondary"}>
                      {event.resolved ? (isRTL ? 'تم الحل' : 'Resolved') : (isRTL ? 'نشط' : 'Active')}
                    </Badge>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                {isRTL ? 'حالة الامتثال' : 'Compliance Status'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'التحقق من الامتثال للمعايير السعودية والدولية' : 'Verification of Saudi and international standards compliance'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">{isRTL ? 'المعايير السعودية' : 'Saudi Standards'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="text-sm">{isRTL ? 'حماية البيانات الشخصية' : 'Personal Data Protection'}</span>
                      <Badge>✓ {isRTL ? 'متوافق' : 'Compliant'}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="text-sm">{isRTL ? 'الأمن السيبراني' : 'Cybersecurity Framework'}</span>
                      <Badge>✓ {isRTL ? 'متوافق' : 'Compliant'}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="text-sm">{isRTL ? 'التوطين والخصوصية' : 'Localization & Privacy'}</span>
                      <Badge>✓ {isRTL ? 'متوافق' : 'Compliant'}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">{isRTL ? 'المعايير الدولية' : 'International Standards'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="text-sm">ISO 27001</span>
                      <Badge>✓ {isRTL ? 'متوافق' : 'Compliant'}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="text-sm">SOC 2 Type II</span>
                      <Badge>✓ {isRTL ? 'متوافق' : 'Compliant'}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="text-sm">GDPR</span>
                      <Badge variant="secondary">{isRTL ? 'جاري التطبيق' : 'In Progress'}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {isRTL ? 'إعدادات الأمان' : 'Security Settings'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'تكوين إعدادات الأمان المتقدمة' : 'Configure advanced security settings'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">{isRTL ? 'إعدادات المصادقة' : 'Authentication Settings'}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'انتهاء صلاحية الجلسة' : 'Session Timeout'}</span>
                      <select className="text-sm border rounded p-1">
                        <option>30 {isRTL ? 'دقيقة' : 'minutes'}</option>
                        <option>1 {isRTL ? 'ساعة' : 'hour'}</option>
                        <option>4 {isRTL ? 'ساعات' : 'hours'}</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'محاولات تسجيل الدخول المسموحة' : 'Max Login Attempts'}</span>
                      <select className="text-sm border rounded p-1">
                        <option>3</option>
                        <option>5</option>
                        <option>10</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">{isRTL ? 'إعدادات التشفير' : 'Encryption Settings'}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'مستوى التشفير' : 'Encryption Level'}</span>
                      <Badge>AES-256</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'تدوير المفاتيح' : 'Key Rotation'}</span>
                      <Badge variant="outline">{isRTL ? 'تلقائي' : 'Auto'}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  {isRTL 
                    ? 'يتم تطبيق جميع الإعدادات وفقاً لمعايير الأمان السعودية والدولية'
                    : 'All settings are applied according to Saudi and international security standards'
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