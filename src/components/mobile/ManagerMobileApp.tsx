import React, { useState, useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Network } from '@capacitor/network';
import { Storage } from '@capacitor/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, CheckCircle, XCircle, Clock, TrendingUp, AlertTriangle, Shield, Wifi, WifiOff, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  status: 'present' | 'absent' | 'late';
  check_in_time?: string;
  location?: string;
}

interface LeaveRequest {
  id: string;
  employee_name: string;
  type: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent';
  timestamp: string;
  read: boolean;
}

export const ManagerMobileApp: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [isOnline, setIsOnline] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [teamStats, setTeamStats] = useState({
    totalMembers: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    initializeApp();
    setupNetworkListener();
    setupPushNotifications();
    loadTeamData();
  }, []);

  const initializeApp = async () => {
    // Load cached data first
    await loadCachedData();
  };

  const setupNetworkListener = async () => {
    const status = await Network.getStatus();
    setIsOnline(status.connected);

    Network.addListener('networkStatusChange', (status) => {
      setIsOnline(status.connected);
      if (status.connected) {
        loadTeamData();
      }
    });
  };

  const setupPushNotifications = async () => {
    const permissionStatus = await PushNotifications.checkPermissions();
    
    if (permissionStatus.receive === 'prompt') {
      await PushNotifications.requestPermissions();
    }

    await PushNotifications.register();

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: notification.title || 'New Notification',
        message: notification.body || '',
        type: 'info',
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      toast(notification.title || 'New Notification', {
        description: notification.body
      });
    });
  };

  const loadTeamData = async () => {
    if (!isOnline) {
      await loadCachedData();
      return;
    }

    try {
      // Fetch team attendance data
      const { data: attendanceData } = await supabase
        .from('mobile_attendance_sessions')
        .select(`
          *,
          hr_employees (
            id,
            first_name,
            last_name,
            position,
            employment_status
          )
        `)
        .gte('created_at', format(new Date(), 'yyyy-MM-dd'))
        .eq('status', 'active');

      // Fetch leave requests
      const { data: leaveData } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      // Process team members data
      const members: TeamMember[] = attendanceData?.map(session => ({
        id: session.employee_id,
        name: `${session.hr_employees?.first_name} ${session.hr_employees?.last_name}`,
        position: session.hr_employees?.position || 'Employee',
        status: 'present' as const,
        check_in_time: session.check_in_time,
        location: 'Office'
      })) || [];

      setTeamMembers(members);
      setLeaveRequests(leaveData || []);

      // Calculate stats
      const stats = {
        totalMembers: 15, // This should come from your team data
        presentToday: members.length,
        absentToday: 15 - members.length,
        lateToday: members.filter(m => {
          if (!m.check_in_time) return false;
          const checkInTime = new Date(m.check_in_time);
          const expectedTime = new Date();
          expectedTime.setHours(9, 0, 0, 0); // 9 AM
          return checkInTime > expectedTime;
        }).length,
        pendingRequests: leaveData?.length || 0
      };

      setTeamStats(stats);

      // Cache the data
      await Storage.set({ key: 'manager_team_data', value: JSON.stringify({ members, leaveData, stats }) });

    } catch (error) {
      console.error('Error loading team data:', error);
      toast.error(isArabic ? 'فشل في تحميل بيانات الفريق' : 'Failed to load team data');
    }
  };

  const loadCachedData = async () => {
    const cached = await Storage.get({ key: 'manager_team_data' });
    if (cached.value) {
      const data = JSON.parse(cached.value);
      setTeamMembers(data.members || []);
      setLeaveRequests(data.leaveData || []);
      setTeamStats(data.stats || {});
    }
  };

  const handleLeaveRequest = async (requestId: string, action: 'approve' | 'reject') => {
    if (!isOnline) {
      toast.error(isArabic ? 'يجب الاتصال بالإنترنت لمعالجة الطلبات' : 'Internet required to process requests');
      return;
    }

    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ 
          status: action === 'approve' ? 'approved' : 'rejected',
          processed_at: new Date().toISOString(),
          processed_by: 'current-manager-id' // Replace with actual manager ID
        })
        .eq('id', requestId);

      if (error) throw error;

      // Update local state
      setLeaveRequests(prev => prev.filter(req => req.id !== requestId));
      setTeamStats(prev => ({ ...prev, pendingRequests: prev.pendingRequests - 1 }));

      toast.success(isArabic ? 
        (action === 'approve' ? 'تم الموافقة على الطلب' : 'تم رفض الطلب') :
        (action === 'approve' ? 'Request approved' : 'Request rejected')
      );

    } catch (error) {
      console.error('Error processing leave request:', error);
      toast.error(isArabic ? 'فشل في معالجة الطلب' : 'Failed to process request');
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">
              {isArabic ? 'تطبيق المدير' : 'Manager App'}
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
          
          {/* Notifications */}
          <div className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {notifications.filter(n => !n.read).length > 0 && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'حاضر اليوم' : 'Present Today'}
                </p>
                <p className="text-xl font-bold text-green-600">
                  {teamStats.presentToday}/{teamStats.totalMembers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'متأخر' : 'Late'}
                </p>
                <p className="text-xl font-bold text-yellow-600">{teamStats.lateToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests Alert */}
      {teamStats.pendingRequests > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  {isArabic ? 'طلبات في انتظار الموافقة' : 'Pending Requests'}
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {isArabic ? `${teamStats.pendingRequests} طلب إجازة` : `${teamStats.pendingRequests} leave requests`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="team" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="team">
            {isArabic ? 'الفريق' : 'Team'}
          </TabsTrigger>
          <TabsTrigger value="requests">
            {isArabic ? 'الطلبات' : 'Requests'}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            {isArabic ? 'التنبيهات' : 'Notifications'}
          </TabsTrigger>
        </TabsList>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {isArabic ? 'حالة الفريق' : 'Team Status'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${
                      member.status === 'present' ? 'bg-green-500' :
                      member.status === 'late' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {member.check_in_time && (
                      <p className="text-sm font-medium">
                        {format(new Date(member.check_in_time), 'HH:mm')}
                      </p>
                    )}
                    <Badge variant={
                      member.status === 'present' ? 'default' :
                      member.status === 'late' ? 'secondary' : 'destructive'
                    }>
                      {isArabic ? 
                        (member.status === 'present' ? 'حاضر' : 
                         member.status === 'late' ? 'متأخر' : 'غائب') :
                        member.status
                      }
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {isArabic ? 'طلبات الإجازة' : 'Leave Requests'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaveRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{request.employee_name}</p>
                      <p className="text-sm text-muted-foreground">{request.type}</p>
                    </div>
                    <Badge variant="secondary">
                      {isArabic ? 'في انتظار الموافقة' : 'Pending'}
                    </Badge>
                  </div>
                  
                  <div className="text-sm">
                    <p><strong>{isArabic ? 'من:' : 'From:'}</strong> {format(new Date(request.start_date), 'MMM dd, yyyy')}</p>
                    <p><strong>{isArabic ? 'إلى:' : 'To:'}</strong> {format(new Date(request.end_date), 'MMM dd, yyyy')}</p>
                    <p><strong>{isArabic ? 'السبب:' : 'Reason:'}</strong> {request.reason}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleLeaveRequest(request.id, 'approve')}
                      disabled={!isOnline}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {isArabic ? 'موافقة' : 'Approve'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleLeaveRequest(request.id, 'reject')}
                      disabled={!isOnline}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      {isArabic ? 'رفض' : 'Reject'}
                    </Button>
                  </div>
                </div>
              ))}
              
              {leaveRequests.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {isArabic ? 'لا توجد طلبات في انتظار الموافقة' : 'No pending requests'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {isArabic ? 'التنبيهات' : 'Notifications'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    notification.read ? 'bg-muted/50' : 'bg-background border-primary/20'
                  }`}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground ml-2">
                      {format(new Date(notification.timestamp), 'HH:mm')}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                  )}
                </div>
              ))}
              
              {notifications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {isArabic ? 'لا توجد تنبيهات' : 'No notifications'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};