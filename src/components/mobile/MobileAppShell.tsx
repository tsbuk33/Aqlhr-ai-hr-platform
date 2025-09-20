import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';
import { PushNotifications } from '@capacitor/push-notifications';
import { useAuthOptional } from '@/hooks/useAuthOptional';
import { EmployeeMobileApp } from './EmployeeMobileApp';
import { ManagerMobileApp } from './ManagerMobileApp';
import { ExecutiveMobileApp } from './ExecutiveMobileApp';
import { BiometricAuth } from './BiometricAuth';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Download, 
  Wifi, 
  WifiOff, 
  MapPin, 
  Camera as CameraIcon,
  Bell,
  Fingerprint,
  Users,
  BarChart3,
  User
} from 'lucide-react';

type UserRole = 'employee' | 'manager' | 'executive';

interface MobileCapabilities {
  biometric: boolean;
  camera: boolean;
  geolocation: boolean;
  pushNotifications: boolean;
}

interface MobileAppShellProps {
  user?: {
    id: string;
    email: string;
    role?: UserRole;
  };
}

export const MobileAppShell: React.FC<MobileAppShellProps> = ({ user: propUser }) => {
  const { user, isLoading } = useAuthOptional();
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  
  const [isOnline, setIsOnline] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>('employee');
  const [capabilities, setCapabilities] = useState<MobileCapabilities>({
    biometric: false,
    camera: false,
    geolocation: false,
    pushNotifications: false
  });
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkCapabilities();
    setupNetworkListener();
    determineUserRole();
  }, [user, propUser]);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const checkCapabilities = async () => {
    const isNative = Capacitor.isNativePlatform();
    setIsNativeApp(isNative);

    try {
      // Check biometric availability
      const biometric = isNative; // Simplified check

      // Check camera availability
      let camera = false;
      try {
        await Camera.checkPermissions();
        camera = true;
      } catch (e) {
        camera = false;
      }

      // Check geolocation availability
      let geolocation = false;
      try {
        await Geolocation.checkPermissions();
        geolocation = true;
      } catch (e) {
        geolocation = false;
      }

      // Check push notifications availability
      let pushNotifications = false;
      try {
        await PushNotifications.checkPermissions();
        pushNotifications = isNative;
      } catch (e) {
        pushNotifications = false;
      }

      setCapabilities({
        biometric,
        camera,
        geolocation,
        pushNotifications
      });

      console.log('Mobile capabilities detected:', {
        biometric,
        camera,
        geolocation,
        pushNotifications,
        isNative
      });
    } catch (error) {
      console.error('Error checking capabilities:', error);
    }
  };

  const setupNetworkListener = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const status = await Network.getStatus();
        setIsOnline(status.connected);

        Network.addListener('networkStatusChange', (status) => {
          setIsOnline(status.connected);
        });
      } else {
        // Web fallback
        setIsOnline(navigator.onLine);
        window.addEventListener('online', () => setIsOnline(true));
        window.addEventListener('offline', () => setIsOnline(false));
      }
    } catch (error) {
      console.error('Error setting up network listener:', error);
    }
  };

  const determineUserRole = () => {
    const currentUser = user || propUser;
    if (currentUser?.email?.includes('manager') || currentUser?.role === 'manager') {
      setUserRole('manager');
    } else if (currentUser?.email?.includes('executive') || currentUser?.email?.includes('admin') || currentUser?.role === 'executive') {
      setUserRole('executive');
    } else {
      setUserRole('employee');
    }
  };

  const switchRole = (role: UserRole) => {
    setUserRole(role);
    // Store preference
    localStorage.setItem('mobile_app_role', role);
  };

  const downloadNativeApp = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('android')) {
      window.open('https://play.google.com/store/apps/details?id=app.lovable.1e2511c6d68f465bbce5a3f16026d868', '_blank');
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      window.open('https://apps.apple.com/app/aqlhr-mobile/id123456789', '_blank');
    } else {
      // Desktop - show QR code or links
      alert('Download the AqlHR mobile app from your device\'s app store');
    }
  };

  const handleAuthentication = (success: boolean) => {
    setIsAuthenticated(success);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isArabic ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir={isArabic ? 'rtl' : 'ltr'}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Smartphone className="h-6 w-6 text-primary" />
              {isArabic ? 'اقل للموارد البشرية' : 'AqlHR Mobile'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BiometricAuth
              onAuthenticated={handleAuthentication}
              isArabic={isArabic}
            />
            {!isNativeApp && (
              <div className="mt-6 space-y-4 border-t pt-4">
                <p className="text-center text-sm text-muted-foreground">
                  {isArabic ? 'احصل على التجربة الكاملة مع التطبيق المحمول' : 'Get the full experience with our mobile app'}
                </p>
                <Button onClick={downloadNativeApp} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {isArabic ? 'تحميل التطبيق' : 'Download App'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Network Status Bar */}
      <div className={`px-4 py-2 text-center text-sm ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        <div className="flex items-center justify-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4" />
              Connected
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              Offline Mode
            </>
          )}
        </div>
      </div>

      {/* Role Selector for Demo */}
      <div className="p-4 border-b bg-muted/50">
        <Tabs value={userRole} onValueChange={(value) => switchRole(value as UserRole)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="employee" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Employee
            </TabsTrigger>
            <TabsTrigger value="manager" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Manager
            </TabsTrigger>
            <TabsTrigger value="executive" className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              Executive
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* App Content Based on Role */}
      {userRole === 'employee' && <EmployeeMobileApp user={user} />}
      {userRole === 'manager' && <ManagerMobileApp user={user} />}
      {userRole === 'executive' && <ExecutiveMobileApp user={user} />}

      {/* Capabilities Badges */}
      <div className="fixed bottom-4 left-4 space-y-1">
        {capabilities.biometric && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Fingerprint className="h-3 w-3" />
            Biometric
          </Badge>
        )}
        {capabilities.camera && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <CameraIcon className="h-3 w-3" />
            Camera
          </Badge>
        )}
        {capabilities.geolocation && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            GPS
          </Badge>
        )}
        {capabilities.pushNotifications && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            Push
          </Badge>
        )}
      </div>
    </div>
  );
};