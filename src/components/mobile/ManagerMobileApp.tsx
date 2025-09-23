import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { useAuthOptional } from '@/hooks/useAuthOptional';
import type { User } from '@supabase/supabase-js';
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
import { TeamApprovalWorkflow } from './manager/TeamApprovalWorkflow';
import { TeamAnalytics } from './manager/TeamAnalytics';
import { EmergencyTeamContact } from './manager/EmergencyTeamContact';
import { PerformanceQuickReview } from './manager/PerformanceQuickReview';
import { BudgetOverview } from './manager/BudgetOverview';
import { VideoCallIntegration } from './manager/VideoCallIntegration';
import { AttendanceTrends } from './manager/AttendanceTrends';
import { TeamGoalTracking } from './manager/TeamGoalTracking';
import { TaskAssignmentInterface } from './manager/TaskAssignmentInterface';
import { TeamWorkflowStatus } from './manager/TeamWorkflowStatus';
import { GovernmentComplianceStatus } from './manager/GovernmentComplianceStatus';
import { EmployeeOnboardingWorkflow } from './manager/EmployeeOnboardingWorkflow';
import { PerformanceReviewManagement } from './manager/PerformanceReviewManagement';
import { DisciplinaryActionProcessing } from './manager/DisciplinaryActionProcessing';
import { PolicyAcknowledgmentTracking } from './manager/PolicyAcknowledgmentTracking';
import EmployeeTransferWorkflow from './manager/EmployeeTransferWorkflow';
import TrainingProgramManagement from './manager/TrainingProgramManagement';
import CompensationChangeProcessing from './manager/CompensationChangeProcessing';
import GovernmentSubmissionWorkflows from './manager/GovernmentSubmissionWorkflows';
import DocumentApprovalProcesses from './manager/DocumentApprovalProcesses';
import HRComplianceMonitoring from './manager/HRComplianceMonitoring';
import { useManagerData } from '@/hooks/useManagerData';

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
  status: 'present' | 'absent' | 'late' | 'on_leave' | 'remote';
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

interface ManagerMobileAppProps {
  user?: User | null;
}

export const ManagerMobileApp: React.FC<ManagerMobileAppProps> = ({ user }) => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const [activeTab, setActiveTab] = useState('dashboard');
  const {
    profile: manager,
    teamMembers,
    alerts,
    approvals,
    loading,
    error,
    refetch,
    seedDemoData,
    markAlertAsRead,
    approveRequest,
    rejectRequest,
  } = useManagerData();


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
      case 'remote':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
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
        case 'remote':
          return 'عن بعد';
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
        case 'remote':
          return 'Remote';
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir={isArabic ? 'rtl' : 'ltr'}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              {isArabic ? 'مدير - مطلوب تسجيل الدخول' : 'Manager - Authentication Required'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              {isArabic ? 'يرجى تسجيل الدخول للوصول إلى تطبيق المدير' : 'Please authenticate to access the Manager app'}
            </p>
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
            {isArabic ? manager?.name_ar : manager?.name}
          </h2>
          <p className="text-xs opacity-80">
            {isArabic ? 'مدير' : 'Manager'} - {manager?.employee_id}
          </p>
        </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-4">
            <TabsTrigger value="dashboard" className="text-xs">
              {isArabic ? 'الرئيسية' : 'Home'}
            </TabsTrigger>
            <TabsTrigger value="team" className="text-xs">
              {isArabic ? 'الفريق' : 'Team'}
            </TabsTrigger>
            <TabsTrigger value="workflows" className="text-xs">
              {isArabic ? 'سير العمل' : 'Workflows'}
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
                        {teamMembers.filter(m => m.status === 'present' || m.status === 'remote').length}
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
                            {isArabic ? alert.message_ar || alert.message : alert.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(alert.created_at).toLocaleTimeString()}
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
                            {isArabic ? member.name_ar || member.name : member.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getStatusText(member.status)}
                            {member.check_in_time && ` • ${member.check_in_time}`}
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
                          {isArabic ? alert.message_ar || alert.message : alert.message}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(alert.created_at).toLocaleString()}
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

          <TabsContent value="workflows" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {isArabic ? 'سير العمل الموارد البشرية' : 'HR Workflows'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="grid grid-cols-2 gap-2">
                  <Card className="p-3">
                    <EmployeeOnboardingWorkflow />
                  </Card>
                  <Card className="p-3">
                    <PerformanceReviewManagement />
                  </Card>
                  <Card className="p-3">
                    <DisciplinaryActionProcessing />
                  </Card>
                  <Card className="p-3">
                    <PolicyAcknowledgmentTracking />
                  </Card>
                  <Card className="p-3">
                    <EmployeeTransferWorkflow />
                  </Card>
                  <Card className="p-3">
                    <TrainingProgramManagement />
                  </Card>
                  <Card className="p-3">
                    <CompensationChangeProcessing />
                  </Card>
                  <Card className="p-3">
                    <GovernmentSubmissionWorkflows />
                  </Card>
                  <Card className="p-3">
                    <DocumentApprovalProcesses />
                  </Card>
                  <Card className="p-3">
                    <HRComplianceMonitoring />
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-4">
            <TeamApprovalWorkflow isArabic={isArabic} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <TeamAnalytics isArabic={isArabic} teamMembers={teamMembers as any} />
            <AttendanceTrends isArabic={isArabic} />
            <TeamGoalTracking isArabic={isArabic} />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  {isArabic ? 'مراجعة الأداء السريعة' : 'Performance Quick Review'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceQuickReview isArabic={isArabic} teamMembers={teamMembers as any} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {isArabic ? 'لوحة تحكم المدير' : 'Manager Dashboard'}
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={seedDemoData}
                    disabled={loading}
                  >
                    {isArabic ? 'بيانات تجريبية' : 'Demo Data'}
                  </Button>
                </div>
                {error && (
                  <div className="text-red-500 text-sm mb-2">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <BudgetOverview isArabic={isArabic} detailed={true} />
              <VideoCallIntegration isArabic={isArabic} expanded={true} />
              <TaskAssignmentInterface isArabic={isArabic} />
              <TeamWorkflowStatus isArabic={isArabic} />
              <GovernmentComplianceStatus isArabic={isArabic} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};