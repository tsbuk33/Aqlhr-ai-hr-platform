import React, { useState, useEffect } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Network } from '@capacitor/network';
import { Storage } from '@capacitor/storage';
import { PushNotifications } from '@capacitor/push-notifications';
// Biometric auth - will work when native plugin is available
const BiometricAuth = {
  isAvailable: async () => ({ isAvailable: false }),
  authenticate: async () => Promise.resolve()
};
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, MapPin, Wifi, WifiOff, Camera as CameraIcon, Fingerprint, Bell, Calendar, Target, User } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AttendanceSession {
  id: string;
  check_in_time: string;
  check_out_time?: string;
  status: 'active' | 'completed';
  work_hours?: number;
  overtime_hours?: number;
}

interface OfflineSession {
  local_id: string;
  employee_id: string;
  check_in_time: string;
  check_out_time?: string;
  location: { lat: number; lng: number; accuracy: number };
  photo_url?: string;
  notes?: string;
  sync_status: 'pending' | 'synced';
}

export const EmployeeMobileApp: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [isOnline, setIsOnline] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [offlineSessions, setOfflineSessions] = useState<OfflineSession[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);
  const [todaysHours, setTodaysHours] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);

  useEffect(() => {
    initializeApp();
    setupNetworkListener();
    setupPushNotifications();
    loadOfflineData();
  }, []);

  const initializeApp = async () => {
    // Check biometric availability
    try {
      const result = await BiometricAuth.isAvailable();
      setBiometricAvailable(result.isAvailable);
    } catch (error) {
      console.log('Biometric auth not available:', error);
    }

    // Get current location
    await getCurrentLocation();
    
    // Load active session
    await loadActiveSession();
  };

  const setupNetworkListener = async () => {
    const status = await Network.getStatus();
    setIsOnline(status.connected);

    Network.addListener('networkStatusChange', (status) => {
      setIsOnline(status.connected);
      if (status.connected) {
        syncOfflineData();
      }
    });
  };

  const setupPushNotifications = async () => {
    const permissionStatus = await PushNotifications.checkPermissions();
    
    if (permissionStatus.receive === 'prompt') {
      await PushNotifications.requestPermissions();
    }

    await PushNotifications.register();

    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      toast(notification.title || 'New Notification', {
        description: notification.body
      });
    });
  };

  const getCurrentLocation = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
      
      setCurrentLocation({
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
        accuracy: coordinates.coords.accuracy || 0
      });
    } catch (error) {
      console.error('Error getting location:', error);
      toast.error(isArabic ? 'فشل في الحصول على الموقع' : 'Failed to get location');
    }
  };

  const authenticateWithBiometric = async (): Promise<boolean> => {
    if (!biometricAvailable) {
      return true; // Skip if not available
    }

    try {
      await BiometricAuth.authenticate();
      return true;
    } catch (error) {
      toast.error(isArabic ? 'فشلت المصادقة البيومترية' : 'Biometric authentication failed');
      return false;
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });
      return image.dataUrl || null;
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  };

  const handleCheckIn = async () => {
    const authenticated = await authenticateWithBiometric();
    if (!authenticated) return;

    await getCurrentLocation();
    const photo = await takePhoto();

    const sessionData = {
      employee_id: 'current-user-id', // Replace with actual user ID
      device_info: {
        device_type: 'mobile' as const,
        device_name: navigator.userAgent,
        os_version: navigator.platform,
        app_version: '1.0.0'
      },
      location: currentLocation!,
      photo_url: photo,
      notes: ''
    };

    if (isOnline) {
      try {
        const response = await fetch('/functions/v1/mobile-attendance/check-in', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sessionData)
        });

        const result = await response.json();
        if (result.success) {
          setActiveSession({
            id: result.session_id,
            check_in_time: result.check_in_time,
            status: 'active'
          });
          toast.success(isArabic ? 'تم تسجيل الحضور بنجاح' : 'Check-in successful');
        }
      } catch (error) {
        console.error('Check-in error:', error);
        // Store offline
        await storeOfflineSession({ 
          ...sessionData, 
          local_id: Date.now().toString(), 
          check_in_time: new Date().toISOString(),
          sync_status: 'pending' as const
        });
      }
    } else {
      // Store offline
      await storeOfflineSession({ 
        ...sessionData, 
        local_id: Date.now().toString(), 
        check_in_time: new Date().toISOString(),
        sync_status: 'pending' as const
      });
      toast(isArabic ? 'تم حفظ البيانات محلياً' : 'Stored offline');
    }
  };

  const handleCheckOut = async () => {
    if (!activeSession) return;

    const authenticated = await authenticateWithBiometric();
    if (!authenticated) return;

    await getCurrentLocation();
    const photo = await takePhoto();

    const checkOutData = {
      session_id: activeSession.id,
      location: currentLocation!,
      photo_url: photo,
      notes: ''
    };

    if (isOnline) {
      try {
        const response = await fetch('/functions/v1/mobile-attendance/check-out', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(checkOutData)
        });

        const result = await response.json();
        if (result.success) {
          setActiveSession(null);
          setTodaysHours(parseFloat(result.work_hours));
          toast.success(isArabic ? 'تم تسجيل الانصراف بنجاح' : 'Check-out successful');
        }
      } catch (error) {
        console.error('Check-out error:', error);
        toast.error(isArabic ? 'فشل في تسجيل الانصراف' : 'Check-out failed');
      }
    } else {
      toast.error(isArabic ? 'يجب الاتصال بالإنترنت للانصراف' : 'Internet required for check-out');
    }
  };

  const storeOfflineSession = async (session: OfflineSession) => {
    const stored = await Storage.get({ key: 'offline_sessions' });
    const sessions: OfflineSession[] = stored.value ? JSON.parse(stored.value) : [];
    sessions.push(session);
    await Storage.set({ key: 'offline_sessions', value: JSON.stringify(sessions) });
    setOfflineSessions(sessions);
  };

  const loadOfflineData = async () => {
    const stored = await Storage.get({ key: 'offline_sessions' });
    if (stored.value) {
      setOfflineSessions(JSON.parse(stored.value));
    }
  };

  const syncOfflineData = async () => {
    if (offlineSessions.length === 0) return;

    const pendingSessions = offlineSessions.filter(s => s.sync_status === 'pending');
    if (pendingSessions.length === 0) return;

    setSyncProgress(0);
    const total = pendingSessions.length;

    try {
      const response = await fetch('/functions/v1/mobile-attendance/sync-offline', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ offline_sessions: pendingSessions })
      });

      const result = await response.json();
      let synced = 0;

      result.sync_results.forEach((syncResult: any, index: number) => {
        if (syncResult.success) {
          synced++;
          setSyncProgress((synced / total) * 100);
        }
      });

      // Update local storage
      const updatedSessions = offlineSessions.map(session => {
        const syncResult = result.sync_results.find((r: any) => r.local_id === session.local_id);
        return syncResult && syncResult.success ? { ...session, sync_status: 'synced' as const } : session;
      });

      await Storage.set({ key: 'offline_sessions', value: JSON.stringify(updatedSessions) });
      setOfflineSessions(updatedSessions);

      toast.success(isArabic ? `تم مزامنة ${synced} جلسة` : `Synced ${synced} sessions`);
    } catch (error) {
      console.error('Sync error:', error);
      toast.error(isArabic ? 'فشل في المزامنة' : 'Sync failed');
    }
  };

  const loadActiveSession = async () => {
    // Load from server or local storage
    // Implementation depends on your data structure
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">
              {isArabic ? 'تطبيق الموظف' : 'Employee App'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {format(new Date(), isArabic ? 'dd MMMM yyyy' : 'MMM dd, yyyy', { 
                locale: isArabic ? ar : undefined 
              })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Network Status */}
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          
          {/* Biometric Status */}
          {biometricAvailable && (
            <Fingerprint className="h-5 w-5 text-blue-500" />
          )}
          
          {/* Notifications */}
          <Bell className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'ساعات اليوم' : "Today's Hours"}
                </p>
                <p className="text-xl font-bold">{todaysHours.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'ساعات الأسبوع' : 'Weekly Hours'}
                </p>
                <p className="text-xl font-bold">{weeklyHours.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Status */}
      {currentLocation && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">
                  {isArabic ? 'الموقع الحالي' : 'Current Location'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? `دقة: ${currentLocation.accuracy}م` : `Accuracy: ${currentLocation.accuracy}m`}
                </p>
              </div>
              <Badge variant="secondary" className="mr-auto">
                {isArabic ? 'متصل' : 'Connected'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {isArabic ? 'تسجيل الحضور' : 'Attendance'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeSession ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {isArabic ? 'جلسة نشطة منذ' : 'Active session since'}
                </p>
                <p className="text-lg font-bold text-green-900 dark:text-green-100">
                  {format(new Date(activeSession.check_in_time), 'HH:mm')}
                </p>
              </div>
              
              <Button 
                onClick={handleCheckOut}
                className="w-full"
                variant="destructive"
              >
                <CameraIcon className="h-4 w-4 mr-2" />
                {isArabic ? 'تسجيل الانصراف' : 'Check Out'}
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleCheckIn}
              className="w-full"
              disabled={!currentLocation}
            >
              <CameraIcon className="h-4 w-4 mr-2" />
              {isArabic ? 'تسجيل الحضور' : 'Check In'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Offline Data Sync */}
      {offlineSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isArabic ? 'البيانات المحفوظة محلياً' : 'Offline Data'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {isArabic ? 'جلسات في انتظار المزامنة' : 'Sessions pending sync'}
              </span>
              <Badge variant="secondary">
                {offlineSessions.filter(s => s.sync_status === 'pending').length}
              </Badge>
            </div>
            
            {syncProgress > 0 && (
              <div>
                <Progress value={syncProgress} className="w-full" />
                <p className="text-xs text-center mt-1">
                  {isArabic ? 'جاري المزامنة...' : 'Syncing...'}
                </p>
              </div>
            )}
            
            <Button 
              onClick={syncOfflineData}
              variant="outline"
              className="w-full"
              disabled={!isOnline || offlineSessions.filter(s => s.sync_status === 'pending').length === 0}
            >
              {isArabic ? 'مزامنة البيانات' : 'Sync Data'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};