import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { localePath, resolveLang } from '@/lib/i18n/localePath';
import { useLocale } from '@/i18n/locale';
import {
  LayoutDashboard, Users, Calendar, BarChart3, Target, ClipboardCheck, MessageSquare, TrendingUp, Smartphone,
  Clock, FileText, Settings, Bell, Mail, Award, Trophy, Medal, Star, Heart, Activity, PieChart,
  LineChart, Zap, Shield, BookOpen, GraduationCap, UserPlus, UserCheck, UserMinus, RefreshCw,
  Search, Filter, Download, Upload, Edit, Plus, CheckCircle, Eye, Bot, Brain, Lightbulb,
  Briefcase, Building, Globe, Database, HardDrive, Archive, Coins, Receipt, DollarSign
} from 'lucide-react';

const managerItems = [
  // Management Dashboards
  { key: 'main_dashboard', url: '/', icon: LayoutDashboard, group: 'dashboards' },
  { key: 'manager_dashboard', url: '/manager-dashboard', icon: LayoutDashboard, group: 'dashboards' },
  { key: 'team_performance_dashboard', url: '/team-performance-dashboard', icon: TrendingUp, group: 'dashboards' },
  { key: 'team_analytics_dashboard', url: '/team-analytics-dashboard', icon: BarChart3, group: 'dashboards' },
  { key: 'operational_dashboard', url: '/operational-dashboard', icon: Activity, group: 'dashboards' },
  
  // Team Management
  { key: 'my_team', url: '/my-team', icon: Users, group: 'team' },
  { key: 'team_structure', url: '/team-structure', icon: Building, group: 'team' },
  { key: 'team_directory', url: '/team-directory', icon: Users, group: 'team' },
  { key: 'team_roles', url: '/team-roles', icon: UserCheck, group: 'team' },
  { key: 'team_capacity', url: '/team-capacity', icon: BarChart3, group: 'team' },
  { key: 'team_workload', url: '/team-workload', icon: Activity, group: 'team' },
  { key: 'team_scheduling', url: '/team-scheduling', icon: Calendar, group: 'team' },
  
  // Performance Management
  { key: 'performance_reviews', url: '/team-performance', icon: TrendingUp, group: 'performance' },
  { key: 'performance_tracking', url: '/performance-tracking', icon: BarChart3, group: 'performance' },
  { key: 'team_goals', url: '/team-goals', icon: Target, group: 'performance' },
  { key: 'goal_tracking', url: '/goal-tracking', icon: Target, group: 'performance' },
  { key: 'kpi_monitoring', url: '/kpi-monitoring', icon: Activity, group: 'performance' },
  { key: 'performance_analytics', url: '/performance-analytics', icon: LineChart, group: 'performance' },
  { key: 'team_rankings', url: '/team-rankings', icon: Trophy, group: 'performance' },
  { key: 'achievement_tracking', url: '/achievement-tracking', icon: Award, group: 'performance' },
  
  // Attendance & Time Management
  { key: 'team_attendance', url: '/team-attendance', icon: Calendar, group: 'attendance' },
  { key: 'attendance_monitoring', url: '/attendance-monitoring', icon: Clock, group: 'attendance' },
  { key: 'time_tracking', url: '/team-time-tracking', icon: Clock, group: 'attendance' },
  { key: 'shift_management', url: '/shift-management', icon: Calendar, group: 'attendance' },
  { key: 'overtime_management', url: '/overtime-management', icon: Clock, group: 'attendance' },
  { key: 'attendance_reports', url: '/attendance-reports', icon: FileText, group: 'attendance' },
  
  // Approvals & Requests
  { key: 'approve_requests', url: '/approve-requests', icon: ClipboardCheck, group: 'approvals' },
  { key: 'leave_approvals', url: '/leave-approvals', icon: Calendar, group: 'approvals' },
  { key: 'expense_approvals', url: '/expense-approvals', icon: Receipt, group: 'approvals' },
  { key: 'overtime_approvals', url: '/overtime-approvals', icon: Clock, group: 'approvals' },
  { key: 'training_approvals', url: '/training-approvals', icon: BookOpen, group: 'approvals' },
  { key: 'approval_history', url: '/approval-history', icon: Activity, group: 'approvals' },
  { key: 'pending_approvals', url: '/pending-approvals', icon: ClipboardCheck, group: 'approvals' },
  
  // Team Development & Training
  { key: 'team_development', url: '/team-development', icon: TrendingUp, group: 'development' },
  { key: 'training_management', url: '/training-management', icon: BookOpen, group: 'development' },
  { key: 'skill_assessment', url: '/skill-assessment', icon: Star, group: 'development' },
  { key: 'career_planning', url: '/career-planning', icon: Target, group: 'development' },
  { key: 'mentoring_programs', url: '/mentoring-programs', icon: Users, group: 'development' },
  { key: 'succession_planning', url: '/succession-planning', icon: UserPlus, group: 'development' },
  { key: 'talent_development', url: '/talent-development', icon: Lightbulb, group: 'development' },
  
  // Analytics & Reporting
  { key: 'team_analytics', url: '/team-analytics', icon: BarChart3, group: 'analytics' },
  { key: 'productivity_analytics', url: '/productivity-analytics', icon: TrendingUp, group: 'analytics' },
  { key: 'engagement_analytics', url: '/engagement-analytics', icon: Heart, group: 'analytics' },
  { key: 'turnover_analytics', url: '/turnover-analytics', icon: LineChart, group: 'analytics' },
  { key: 'cost_analytics', url: '/cost-analytics', icon: DollarSign, group: 'analytics' },
  { key: 'team_reports', url: '/team-reports', icon: FileText, group: 'analytics' },
  { key: 'custom_analytics', url: '/custom-analytics', icon: Settings, group: 'analytics' },
  
  // Communication & Feedback
  { key: 'team_feedback', url: '/team-feedback', icon: MessageSquare, group: 'communication' },
  { key: 'one_on_one', url: '/one-on-one', icon: Users, group: 'communication' },
  { key: 'team_meetings', url: '/team-meetings', icon: Users, group: 'communication' },
  { key: 'team_announcements', url: '/team-announcements', icon: Bell, group: 'communication' },
  { key: 'internal_messaging', url: '/internal-messaging', icon: Mail, group: 'communication' },
  { key: 'feedback_surveys', url: '/feedback-surveys', icon: MessageSquare, group: 'communication' },
  { key: 'recognition_system', url: '/recognition-system', icon: Award, group: 'communication' },
  
  // Mobile Management Tools
  { key: 'manager_mobile', url: '/mobile/manager', icon: Smartphone, group: 'mobile' },
  { key: 'team_analytics_mobile', url: '/mobile/team-analytics', icon: Smartphone, group: 'mobile' },
  { key: 'mobile_approvals', url: '/mobile/approvals', icon: ClipboardCheck, group: 'mobile' },
  { key: 'mobile_team_dashboard', url: '/mobile/team-dashboard', icon: LayoutDashboard, group: 'mobile' },
  { key: 'mobile_notifications', url: '/mobile/notifications', icon: Bell, group: 'mobile' },
  
  // Recruitment & Hiring
  { key: 'team_recruitment', url: '/team-recruitment', icon: UserPlus, group: 'recruitment' },
  { key: 'interview_scheduling', url: '/interview-scheduling', icon: Calendar, group: 'recruitment' },
  { key: 'candidate_evaluation', url: '/candidate-evaluation', icon: CheckCircle, group: 'recruitment' },
  { key: 'hiring_requests', url: '/hiring-requests', icon: UserPlus, group: 'recruitment' },
  { key: 'onboarding_management', url: '/onboarding-management', icon: Users, group: 'recruitment' },
  
  // Budget & Resource Management
  { key: 'budget_management', url: '/budget-management', icon: DollarSign, group: 'budget' },
  { key: 'resource_allocation', url: '/resource-allocation', icon: BarChart3, group: 'budget' },
  { key: 'cost_center_management', url: '/cost-center-management', icon: Building, group: 'budget' },
  { key: 'expense_tracking', url: '/expense-tracking', icon: Receipt, group: 'budget' },
  { key: 'budget_reports', url: '/budget-reports', icon: FileText, group: 'budget' },
  
  // Configuration & Settings
  { key: 'team_settings', url: '/team-settings', icon: Settings, group: 'settings' },
  { key: 'workflow_management', url: '/workflow-management', icon: Zap, group: 'settings' },
  { key: 'notification_preferences', url: '/notification-preferences', icon: Bell, group: 'settings' },
  { key: 'dashboard_customization', url: '/dashboard-customization', icon: LayoutDashboard, group: 'settings' },
  { key: 'integration_settings', url: '/integration-settings', icon: Globe, group: 'settings' },
];

const managerGroups = [
  { key: 'dashboards', label: 'Management Dashboards', icon: LayoutDashboard },
  { key: 'team', label: 'Team Management', icon: Users },
  { key: 'performance', label: 'Performance Management', icon: TrendingUp },
  { key: 'attendance', label: 'Attendance & Time', icon: Clock },
  { key: 'approvals', label: 'Approvals & Requests', icon: ClipboardCheck },
  { key: 'development', label: 'Team Development', icon: BookOpen },
  { key: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
  { key: 'communication', label: 'Communication & Feedback', icon: MessageSquare },
  { key: 'mobile', label: 'Mobile Management', icon: Smartphone },
  { key: 'recruitment', label: 'Recruitment & Hiring', icon: UserPlus },
  { key: 'budget', label: 'Budget & Resources', icon: DollarSign },
  { key: 'settings', label: 'Manager Settings', icon: Settings },
];

export const ManagerSidebar: React.FC = () => {
  const { open } = useSidebar();
  const location = useLocation();
  const lang = resolveLang();
  const { t } = useLocale();

  return (
    <Sidebar className={open ? "w-60" : "w-14"}>
      <SidebarContent>
        {managerGroups.map((group) => {
          const groupItems = managerItems.filter(item => item.group === group.key);
          const GroupIcon = group.icon;
          
          return (
            <SidebarGroup key={group.key}>
              <SidebarGroupLabel>
                <GroupIcon className="h-4 w-4 mr-2" />
                {open && t('navigation', group.label)}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {groupItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={localePath(item.url, lang)}
                          className={({ isActive }) =>
                            isActive
                              ? "bg-primary text-primary-foreground font-medium"
                              : "hover:bg-muted/50"
                          }
                        >
                          <item.icon className="h-4 w-4" />
                          {open && <span className="text-sm">{t('navigation', item.key)}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
};