import React, { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';
import { Storage } from '@capacitor/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, Crown, Wifi, WifiOff, Download, Smartphone } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuthOptional } from '@/hooks/useAuthOptional';
import { EmployeeMobileApp } from './EmployeeMobileApp';
import { ManagerMobileApp } from './ManagerMobileApp';
import { ExecutiveMobileApp } from './ExecutiveMobileApp';

type UserRole = 'employee' | 'manager' | 'executive';

interface MobileCapabilities {
  biometric: boolean;
  camera: boolean;
  geolocation: boolean;
  pushNotifications: boolean;
  offline: boolean;
}

export const MobileAppShell: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuthOptional();
  const isArabic = language === 'ar';
  
  const [isOnline, setIsOnline] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>('employee');
  const [capabilities, setCapabilities] = useState<MobileCapabilities>({
    biometric: false,
    camera: false,
    geolocation: false,
    pushNotifications: false,
    offline: true
  });
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    checkCapabilities();
    setupNetworkListener();
    determineUserRole();
  }, [user]);

  const checkCapabilities = async () => {
    // Check if running in native app context
    const isNative = !!(window as any).Capacitor?.isNativePlatform?.();
    setIsNativeApp(isNative);

    const caps: MobileCapabilities = {
      biometric: isNative && 'BiometricAuth' in (window as any),
      camera: isNative && 'Camera' in (window as any),
      geolocation: 'geolocation' in navigator,
      pushNotifications: isNative && 'PushNotifications' in (window as any),
      offline: true // Service Worker support
    };

    setCapabilities(caps);

    // Store capabilities info
    await Storage.set({ 
      key: 'mobile_capabilities', 
      value: JSON.stringify(caps) 
    });
  };

  const setupNetworkListener = async () => {
    if (!isNativeApp) {
      // Web fallback
      setIsOnline(navigator.onLine);
      window.addEventListener('online', () => setIsOnline(true));
      window.addEventListener('offline', () => setIsOnline(false));
      return;
    }

    const status = await Network.getStatus();
    setIsOnline(status.connected);

    Network.addListener('networkStatusChange', (status) => {
      setIsOnline(status.connected);
    });
  };

  const determineUserRole = () => {
    // This should be determined from user profile/permissions
    // For demo purposes, we'll use a simple logic
    if (!user) {
      setUserRole('employee');
      return;
    }

    const email = user.email || '';
    if (email.includes('executive') || email.includes('ceo') || email.includes('manager')) {
      if (email.includes('executive') || email.includes('ceo')) {
        setUserRole('executive');
      } else {
        setUserRole('manager');
      }
    } else {
      setUserRole('employee');
    }
  };

  const switchRole = (role: UserRole) => {
    setUserRole(role);
    // Store user preference
    Storage.set({ key: 'preferred_role', value: role });
  };

  const downloadNativeApp = () => {
    // This would typically redirect to app stores
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      // Redirect to App Store
      window.open('https://apps.apple.com/app/aqlhr-platform', '_blank');
    } else if (userAgent.includes('android')) {
      // Redirect to Play Store
      window.open('https://play.google.com/store/apps/details?id=app.lovable.aqlhr', '_blank');
    } else {
      // Show download options
      alert(isArabic ? 
        'قم بتحميل التطبيق من متجر التطبيقات المناسب لجهازك' :
        'Download the app from your device\'s app store'
      );
    }
  };

  if (!isNativeApp) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center" dir={isArabic ? 'rtl' : 'ltr'}>
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-6">
            <div className="space-y-2">
              <Smartphone className="h-16 w-16 text-primary mx-auto" />
              <h1 className="text-2xl font-bold">
                {isArabic ? 'تطبيق عقل الموارد البشرية' : 'AqlHR Mobile App'}
              </h1>
              <p className="text-muted-foreground">
                {isArabic ? 
                  'احصل على التجربة الكاملة مع التطبيق الأصلي' :
                  'Get the full experience with our native app'
                }
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {isArabic ? 'مميزات التطبيق الأصلي:' : 'Native App Features:'}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  {isArabic ? 'مصادقة بيومترية' : 'Biometric Auth'}
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  {isArabic ? 'تتبع الموقع' : 'GPS Tracking'}
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  {isArabic ? 'العمل بدون إنترنت' : 'Offline Mode'}
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  {isArabic ? 'إشعارات فورية' : 'Push Notifications'}
                </div>
              </div>
            </div>

            <Button onClick={downloadNativeApp} className="w-full" size="lg">
              <Download className="h-5 w-5 mr-2" />
              {isArabic ? 'تحميل التطبيق' : 'Download App'}
            </Button>

            <div className="text-xs text-muted-foreground">
              {isArabic ? 
                'أو تابع استخدام الإصدار التجريبي أدناه' :
                'Or continue with the demo version below'
              }
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Network Status Bar */}
      <div className={`w-full px-4 py-2 text-center text-sm ${
        isOnline ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      }`}>
        <div className="flex items-center justify-center gap-2">
          {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          {isOnline ? 
            (isArabic ? 'متصل' : 'Online') : 
            (isArabic ? 'غير متصل - وضع العمل بدون إنترنت' : 'Offline - Working in offline mode')
          }
        </div>
      </div>

      {/* Role Selector */}
      <div className="bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isArabic ? 'اختر الدور' : 'Select Role'}
          </h2>
          
          <div className="flex items-center gap-2">
            {/* Capabilities Indicators */}
            {capabilities.biometric && <Badge variant="secondary" className="text-xs">Bio</Badge>}
            {capabilities.camera && <Badge variant="secondary" className="text-xs">Cam</Badge>}
            {capabilities.geolocation && <Badge variant="secondary" className="text-xs">GPS</Badge>}
            {capabilities.pushNotifications && <Badge variant="secondary" className="text-xs">Push</Badge>}
          </div>
        </div>
        
        <Tabs value={userRole} onValueChange={(value) => switchRole(value as UserRole)} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="employee" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {isArabic ? 'موظف' : 'Employee'}
            </TabsTrigger>
            <TabsTrigger value="manager" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {isArabic ? 'مدير' : 'Manager'}
            </TabsTrigger>
            <TabsTrigger value="executive" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              {isArabic ? 'تنفيذي' : 'Executive'}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* App Content */}
      <div className="flex-1">
        {userRole === 'employee' && <EmployeeMobileApp />}
        {userRole === 'manager' && <ManagerMobileApp />}
        {userRole === 'executive' && <ExecutiveMobileApp />}
      </div>
    </div>
  );
};