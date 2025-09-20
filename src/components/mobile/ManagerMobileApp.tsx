import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { 
  Users, 
  ClipboardCheck, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  FileText,
  MessageSquare,
  Bell,
  MapPin,
  Clock,
  UserCheck,
  UserX,
  Target,
  Award,
  DollarSign,
  Video,
  Phone,
  CheckCircle,
  XCircle,
  Star,
  Shield,
  AlertCircle,
  Activity,
  Briefcase
} from 'lucide-react';
import { BiometricAuth } from './BiometricAuth';
import { TeamApprovalWorkflow } from './manager/TeamApprovalWorkflow';
import { TeamAnalytics } from './manager/TeamAnalytics';
import { EmergencyTeamContact } from './manager/EmergencyTeamContact';
import { PerformanceQuickReview } from './manager/PerformanceQuickReview';
import { BudgetOverview } from './manager/BudgetOverview';
import { VideoCallIntegration } from './manager/VideoCallIntegration';

interface ManagerProfile {
  id: string;
  name: string;
  nameAr: string;
  employeeId: string;
  department: string;
  departmentAr: string;
  team: string[];
}

interface TeamMember {
  id: string;
  name: string;
  nameAr: string;
  status: 'present' | 'absent' | 'late' | 'on_leave';
  checkInTime?: string;
  location?: string;
}

interface ManagerAlert {
  id: string;
  type: 'attendance' | 'leave' | 'performance' | 'urgent';
  message: string;
  messageAr: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

export const ManagerMobileApp = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [manager, setManager] = useState<ManagerProfile | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [alerts, setAlerts] = useState<ManagerAlert[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (isAuthenticated) {
      loadManagerData();
    }
  }, [isAuthenticated]);

  const loadManagerData = () => {
    // Mock manager data
    setManager({
      id: 'mgr_001',
      name: 'Sarah Al-Mahmoud',
      nameAr: 'سارة المحمود',
      employeeId: 'MGR-2024-001',
      department: 'Human Resources',
      departmentAr: 'الموارد البشرية',
      team: ['emp_001', 'emp_002', 'emp_003', 'emp_004', 'emp_005']
    });

    // Mock team data
    setTeamMembers([
      {
        id: 'emp_001',
        name: 'Ahmed Al-Rashid',
        nameAr: 'أحمد الراشد',
        status: 'present',
        checkInTime: '08:30',
        location: 'Riyadh Office'
      },
      {
        id: 'emp_002',
        name: 'Fatima Al-Zahra',
        nameAr: 'فاطمة الزهراء',
        status: 'late',
        checkInTime: '09:15',
        location: 'Remote'
      },
      {
        id: 'emp_003',
        name: 'Mohammed Al-Saud',
        nameAr: 'محمد السعود',
        status: 'on_leave',
      },
      {
        id: 'emp_004',
        name: 'Nora Al-Qasimi',
        nameAr: 'نورا القاسمي',
        status: 'present',
        checkInTime: '08:45',
        location: 'Riyadh Office'
      },
      {
        id: 'emp_005',
        name: 'Omar Al-Harbi',
        nameAr: 'عمر الحربي',
        status: 'absent'
      }
    ]);

    // Mock alerts
    setAlerts([
      {
        id: 'alert_001',
        type: 'attendance',
        message: 'Fatima Al-Zahra checked in late (9:15 AM)',
        messageAr: 'فاطمة الزهراء تأخرت في الحضور (9:15 ص)',
        timestamp: new Date().toISOString(),
        priority: 'medium'
      },
      {
        id: 'alert_002',
        type: 'leave',
        message: 'New leave request from Ahmed Al-Rashid',
        messageAr: 'طلب إجازة جديد من أحمد الراشد',
        timestamp: new Date().toISOString(),
        priority: 'high'
      },
      {
        id: 'alert_003',
        type: 'urgent',
        message: 'Omar Al-Harbi is absent without notice',
        messageAr: 'عمر الحربي غائب بدون إشعار',
        timestamp: new Date().toISOString(),
        priority: 'high'
      }
    ]);
  };

  const handleAuthentication = (success: boolean, employeeData?: any) => {
    setIsAuthenticated(success);
  };

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'present':
        return 'bg-green-500';
      case 'late':
        return 'bg-yellow-500';
      case 'on_leave':
        return 'bg-blue-500';
      case 'absent':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: TeamMember['status']) => {
    if (isArabic) {
      switch (status) {
        case 'present':
          return 'حاضر';
        case 'late':
          return 'متأخر';
        case 'on_leave':
          return 'في إجازة';
        case 'absent':
          return 'غائب';
        default:
          return 'غير معروف';
      }
    } else {
      switch (status) {
        case 'present':
          return 'Present';
        case 'late':
          return 'Late';
        case 'on_leave':
          return 'On Leave';
        case 'absent':
          return 'Absent';
        default:
          return 'Unknown';
      }
    }
  };

  const getPriorityColor = (priority: ManagerAlert['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      case 'low':
        return 'border-green-500';
      default:
        return 'border-gray-500';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              {isArabic ? 'مدير - تسجيل الدخول' : 'Manager Login'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BiometricAuth
              onAuthenticated={handleAuthentication}
              isArabic={isArabic}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-medium">
              {isArabic ? manager?.nameAr : manager?.name}
            </h2>
            <p className="text-xs opacity-80">
              {isArabic ? 'مدير' : 'Manager'} - {manager?.employeeId}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="dashboard" className="text-xs">
              {isArabic ? 'الرئيسية' : 'Home'}
            </TabsTrigger>
            <TabsTrigger value="team" className="text-xs">
              {isArabic ? 'الفريق' : 'Team'}
            </TabsTrigger>
            <TabsTrigger value="approvals" className="text-xs">
              {isArabic ? 'الموافقات' : 'Approvals'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">
              {isArabic ? 'التحليلات' : 'Analytics'}
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-xs">
              {isArabic ? 'الأدوات' : 'Tools'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {teamMembers.filter(m => m.status === 'present').length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isArabic ? 'حاضر' : 'Present'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <UserX className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {teamMembers.filter(m => m.status === 'absent').length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isArabic ? 'غائب' : 'Absent'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {teamMembers.filter(m => m.status === 'late').length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isArabic ? 'متأخر' : 'Late'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {teamMembers.filter(m => m.status === 'on_leave').length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isArabic ? 'في إجازة' : 'On Leave'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4">
                  <BudgetOverview isArabic={isArabic} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <VideoCallIntegration isArabic={isArabic} />
                </CardContent>
              </Card>
            </div>

            {/* Recent Alerts & Emergency Contact */}
            <div className="grid grid-cols-1 gap-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {isArabic ? 'التنبيهات الحرجة' : 'Critical Alerts'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.slice(0, 2).map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${getPriorityColor(alert.priority)}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {isArabic ? alert.messageAr : alert.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge variant={alert.priority === 'high' ? 'destructive' : 'default'}>
                            {alert.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <EmergencyTeamContact isArabic={isArabic} />
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {isArabic ? 'حالة الفريق' : 'Team Status'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(member.status)}`}></div>
                        <div>
                          <p className="font-medium">
                            {isArabic ? member.nameAr : member.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getStatusText(member.status)}
                            {member.checkInTime && ` • ${member.checkInTime}`}
                            {member.location && ` • ${member.location}`}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {isArabic ? 'جميع التنبيهات' : 'All Alerts'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`p-4 border rounded-lg border-l-4 ${getPriorityColor(alert.priority)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">
                            {isArabic ? alert.messageAr : alert.message}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'default' : 'secondary'}>
                          {alert.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-4">
            <TeamApprovalWorkflow isArabic={isArabic} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <TeamAnalytics isArabic={isArabic} teamMembers={teamMembers} />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  {isArabic ? 'مراجعة الأداء السريعة' : 'Performance Quick Review'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceQuickReview isArabic={isArabic} teamMembers={teamMembers} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <BudgetOverview isArabic={isArabic} detailed={true} />
              <VideoCallIntegration isArabic={isArabic} expanded={true} />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    {isArabic ? 'أدوات الإدارة' : 'Management Tools'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start h-auto p-3">
                      <div className="flex flex-col items-start">
                        <FileText className="h-4 w-4 mb-1" />
                        <span className="text-xs">
                          {isArabic ? 'تقارير مخصصة' : 'Custom Reports'}
                        </span>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-3">
                      <div className="flex flex-col items-start">
                        <Target className="h-4 w-4 mb-1" />
                        <span className="text-xs">
                          {isArabic ? 'تتبع الأهداف' : 'Goal Tracking'}
                        </span>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-3">
                      <div className="flex flex-col items-start">
                        <Shield className="h-4 w-4 mb-1" />
                        <span className="text-xs">
                          {isArabic ? 'تقارير الامتثال' : 'Compliance Reports'}
                        </span>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-3">
                      <div className="flex flex-col items-start">
                        <Activity className="h-4 w-4 mb-1" />
                        <span className="text-xs">
                          {isArabic ? 'مراقبة النشاط' : 'Activity Monitor'}
                        </span>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};