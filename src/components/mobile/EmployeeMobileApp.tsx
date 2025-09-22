import React, { useState, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { useAuthOptional } from '@/hooks/useAuthOptional';
import type { User } from '@supabase/supabase-js';
import { 
  Fingerprint, 
  MapPin, 
  Calendar, 
  FileText, 
  Bell,
  Languages,
  Clock,
  Phone,
  Camera as CameraIcon,
  Wifi,
  WifiOff,
  Sun,
  Moon
} from 'lucide-react';
import { GPSTimeTracker } from './GPSTimeTracker';
import { OfflineLeaveRequest } from './OfflineLeaveRequest';
import { DocumentScanner } from './DocumentScanner';
import { PrayerTimes } from './PrayerTimes';
import { HijriCalendar } from './HijriCalendar';
import { EmergencyContacts } from './EmergencyContacts';

interface EmployeeProfile {
  id: string;
  name: string;
  nameAr: string;
  employeeId: string;
  department: string;
  departmentAr: string;
  position: string;
  positionAr: string;
  avatar?: string;
}

interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: 'present' | 'absent' | 'late' | 'early_departure';
  workingHours?: number;
  overtimeHours?: number;
}

interface EmployeeMobileAppProps {
  user?: User | null;
}

export const EmployeeMobileApp: React.FC<EmployeeMobileAppProps> = ({ user }) => {
  const { lang, setLang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  // State management
  const [isOnline, setIsOnline] = useState(true);
  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Initialize mobile app
  useEffect(() => {
    initializeMobileApp();
  }, []);

  useEffect(() => {
    if (user) {
      loadEmployeeData();
    }
  }, [user]);

  const initializeMobileApp = async () => {
    try {
      // Check network status
      const status = await Network.getStatus();
      setIsOnline(status.connected);

      // Listen for network changes
      Network.addListener('networkStatusChange', (status) => {
        setIsOnline(status.connected);
      });

      // Initialize push notifications
      await initializePushNotifications();

      // Load offline data
      await loadOfflineData();

      console.log('Mobile app initialized successfully');
    } catch (error) {
      console.error('Error initializing mobile app:', error);
    }
  };

  const initializePushNotifications = async () => {
    try {
      // Request permission
      await PushNotifications.requestPermissions();

      // Register for push notifications
      await PushNotifications.register();

      // Listen for registration
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token:', token.value);
      });

      // Listen for push notifications
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed:', notification);
      });

    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  };

  const loadOfflineData = async () => {
    try {
      // Load employee profile
      const { value } = await Preferences.get({ key: 'employee_profile' });
      if (value) {
        setEmployee(JSON.parse(value));
      }

      // Load attendance records
      const { value: attendanceData } = await Preferences.get({ key: 'attendance_records' });
      if (attendanceData) {
        setAttendanceRecords(JSON.parse(attendanceData));
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  };

  const loadEmployeeData = () => {
    // Use actual user data
    const employeeData: EmployeeProfile = {
      id: user?.id || 'emp_001',
      name: user?.email?.split('@')[0] || 'Employee',
      nameAr: 'الموظف',
      employeeId: 'EMP-2024-001',
      department: 'IT Department',
      departmentAr: 'قسم تقنية المعلومات',
      position: 'Software Developer',
      positionAr: 'مطور برمجيات'
    };
    
    setEmployee(employeeData);
    saveOfflineData('employee_profile', employeeData);
  };

  const saveOfflineData = async (key: string, data: any) => {
    try {
      await Preferences.set({
        key,
        value: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const handleLanguageToggle = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
  };


  const handleCheckIn = async (location?: { latitude: number; longitude: number }) => {
    try {
      const now = new Date().toISOString();
      const newRecord: AttendanceRecord = {
        id: `attendance_${Date.now()}`,
        employeeId: employee?.id || '',
        date: new Date().toDateString(),
        checkIn: now,
        location,
        status: 'present'
      };

      const updatedRecords = [...attendanceRecords, newRecord];
      setAttendanceRecords(updatedRecords);
      await saveOfflineData('attendance_records', updatedRecords);

      // Show success notification
      console.log('Check-in successful');
    } catch (error) {
      console.error('Error during check-in:', error);
    }
  };

  const handleCheckOut = async (location?: { latitude: number; longitude: number }) => {
    try {
      const today = new Date().toDateString();
      const updatedRecords = attendanceRecords.map(record => {
        if (record.date === today && !record.checkOut) {
          return {
            ...record,
            checkOut: new Date().toISOString(),
            location: location || record.location
          };
        }
        return record;
      });

      setAttendanceRecords(updatedRecords);
      await saveOfflineData('attendance_records', updatedRecords);

      console.log('Check-out successful');
    } catch (error) {
      console.error('Error during check-out:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir={isArabic ? 'rtl' : 'ltr'}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Fingerprint className="h-6 w-6 text-primary" />
              {isArabic ? 'مطلوب تسجيل الدخول' : 'Authentication Required'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              {isArabic ? 'يرجى تسجيل الدخول للوصول إلى التطبيق' : 'Please authenticate to access the Employee app'}
            </p>
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLanguageToggle}
                className="flex items-center gap-2"
              >
                <Languages className="h-4 w-4" />
                {isArabic ? 'English' : 'العربية'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            {employee?.avatar ? (
              <img 
                src={employee.avatar} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <span className="text-sm font-medium">
                {employee?.name.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-medium text-sm">
              {isArabic ? employee?.nameAr : employee?.name}
            </h2>
            <p className="text-xs opacity-80">
              {employee?.employeeId}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Network Status */}
          <div className="flex items-center gap-1">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-400" />
            )}
          </div>
          
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLanguageToggle}
            className="h-8 w-8 p-0"
          >
            <Languages className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm">
          {isArabic ? 'وضع عدم الاتصال - سيتم مزامنة البيانات عند الاتصال' : 'Offline Mode - Data will sync when connected'}
        </div>
      )}

      {/* Main Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="dashboard" className="text-xs">
              {isArabic ? 'الرئيسية' : 'Home'}
            </TabsTrigger>
            <TabsTrigger value="attendance" className="text-xs">
              {isArabic ? 'الحضور' : 'Time'}
            </TabsTrigger>
            <TabsTrigger value="services" className="text-xs">
              {isArabic ? 'الخدمات' : 'Services'}
            </TabsTrigger>
            <TabsTrigger value="prayer" className="text-xs">
              {isArabic ? 'الصلاة' : 'Prayer'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4">
                <CardContent className="p-0">
                  <GPSTimeTracker
                    onCheckIn={handleCheckIn}
                    onCheckOut={handleCheckOut}
                    isArabic={isArabic}
                    attendanceRecords={attendanceRecords}
                  />
                </CardContent>
              </Card>
              
              <Card className="p-4">
                <CardContent className="p-0">
                  <DocumentScanner
                    isArabic={isArabic}
                    onDocumentScanned={(document) => {
                      console.log('Document scanned:', document);
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Today's Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {isArabic ? 'ملخص اليوم' : "Today's Summary"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HijriCalendar isArabic={isArabic} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <GPSTimeTracker
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              isArabic={isArabic}
              attendanceRecords={attendanceRecords}
              detailed={true}
            />
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <OfflineLeaveRequest
              isArabic={isArabic}
              employeeId={employee?.id || ''}
              isOnline={isOnline}
            />
            
            <EmergencyContacts isArabic={isArabic} />
          </TabsContent>

          <TabsContent value="prayer" className="space-y-4">
            <PrayerTimes isArabic={isArabic} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};