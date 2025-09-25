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
  LayoutDashboard, Calendar, Clock, FileText, User, Target, BookOpen, MessageSquare,
  Smartphone, Settings, Bell, Mail, Download, Upload, Edit, Heart, Star, Award,
  Trophy, Medal, TrendingUp, BarChart3, PieChart, Activity, Shield, Lock,
  CreditCard, Receipt, Coins, DollarSign, Users, UserCheck, RefreshCw, Search,
  Filter, Tag, Bookmark, Eye, HelpCircle, Phone, Video, Camera, Mic, ClipboardList, Car
} from 'lucide-react';

const employeeItems = [
  // Personal Dashboards
  { key: 'main_dashboard', url: '/', icon: LayoutDashboard, group: 'dashboards' },
  { key: 'my_dashboard', url: '/employee-dashboard', icon: LayoutDashboard, group: 'dashboards' },
  { key: 'my_analytics', url: '/my-analytics', icon: BarChart3, group: 'dashboards' },
  { key: 'my_performance_dashboard', url: '/my-performance-dashboard', icon: TrendingUp, group: 'dashboards' },
  
  // Profile & Personal Information
  { key: 'my_profile', url: '/my-profile', icon: User, group: 'profile' },
  { key: 'personal_information', url: '/personal-information', icon: User, group: 'profile' },
  { key: 'emergency_contacts', url: '/emergency-contacts', icon: Phone, group: 'profile' },
  { key: 'bank_details', url: '/bank-details', icon: CreditCard, group: 'profile' },
  { key: 'documents_upload', url: '/documents-upload', icon: Upload, group: 'profile' },
  { key: 'profile_settings', url: '/profile-settings', icon: Settings, group: 'profile' },
  { key: 'privacy_settings', url: '/privacy-settings', icon: Shield, group: 'profile' },
  
  // Time & Attendance
  { key: 'time_attendance', url: '/my-attendance', icon: Clock, group: 'attendance' },
  { key: 'clock_in_out', url: '/clock-in-out', icon: Clock, group: 'attendance' },
  { key: 'my_timesheet', url: '/my-timesheet', icon: Calendar, group: 'attendance' },
  { key: 'overtime_requests', url: '/overtime-requests', icon: Clock, group: 'attendance' },
  { key: 'attendance_history', url: '/attendance-history', icon: Activity, group: 'attendance' },
  { key: 'work_schedule', url: '/work-schedule', icon: Calendar, group: 'attendance' },
  
  // Leave Management
  { key: 'leave_requests', url: '/my-leave', icon: Calendar, group: 'leave' },
  { key: 'leave_balance', url: '/leave-balance', icon: BarChart3, group: 'leave' },
  { key: 'leave_history', url: '/leave-history', icon: Activity, group: 'leave' },
  { key: 'leave_calendar', url: '/leave-calendar', icon: Calendar, group: 'leave' },
  { key: 'comp_time', url: '/comp-time', icon: Clock, group: 'leave' },
  
  // Performance & Goals
  { key: 'my_goals', url: '/my-goals', icon: Target, group: 'performance' },
  { key: 'performance_reviews', url: '/my-performance-reviews', icon: Award, group: 'performance' },
  { key: 'self_evaluation', url: '/self-evaluation', icon: Edit, group: 'performance' },
  { key: 'achievements', url: '/my-achievements', icon: Trophy, group: 'performance' },
  { key: 'skills_assessment', url: '/my-skills-assessment', icon: Star, group: 'performance' },
  { key: 'career_development', url: '/my-career-development', icon: TrendingUp, group: 'performance' },
  { key: 'feedback_received', url: '/feedback-received', icon: MessageSquare, group: 'performance' },
  
  // Learning & Development
  { key: 'training_courses', url: '/my-training', icon: BookOpen, group: 'learning' },
  { key: 'learning_paths', url: '/learning-paths', icon: Target, group: 'learning' },
  { key: 'certifications', url: '/my-certifications', icon: Medal, group: 'learning' },
  { key: 'training_history', url: '/training-history', icon: Activity, group: 'learning' },
  { key: 'recommended_courses', url: '/recommended-courses', icon: Star, group: 'learning' },
  { key: 'learning_calendar', url: '/learning-calendar', icon: Calendar, group: 'learning' },
  
  // Payroll & Benefits
  { key: 'pay_slips', url: '/my-payslips', icon: FileText, group: 'payroll' },
  { key: 'salary_details', url: '/salary-details', icon: Coins, group: 'payroll' },
  { key: 'tax_documents', url: '/tax-documents', icon: Receipt, group: 'payroll' },
  { key: 'benefits_enrollment', url: '/benefits-enrollment', icon: Heart, group: 'payroll' },
  { key: 'reimbursements', url: '/reimbursements', icon: DollarSign, group: 'payroll' },
  { key: 'bonus_history', url: '/bonus-history', icon: Award, group: 'payroll' },
  
  // Communication & Collaboration
  { key: 'feedback', url: '/my-feedback', icon: MessageSquare, group: 'communication' },
  { key: 'internal_messages', url: '/internal-messages', icon: Mail, group: 'communication' },
  { key: 'team_directory', url: '/team-directory', icon: Users, group: 'communication' },
  { key: 'announcements', url: '/announcements', icon: Bell, group: 'communication' },
  { key: 'company_news', url: '/company-news', icon: FileText, group: 'communication' },
  { key: 'employee_surveys', url: '/employee-surveys', icon: MessageSquare, group: 'communication' },
  
  // Requests & Approvals
  { key: 'my_requests', url: '/my-requests', icon: ClipboardList, group: 'requests' },
  { key: 'travel_requests', url: '/travel-requests', icon: Car, group: 'requests' },
  { key: 'expense_reports', url: '/expense-reports', icon: Receipt, group: 'requests' },
  { key: 'it_requests', url: '/it-requests', icon: Settings, group: 'requests' },
  { key: 'document_requests', url: '/document-requests', icon: FileText, group: 'requests' },
  { key: 'request_history', url: '/request-history', icon: Activity, group: 'requests' },
  
  // Mobile Applications
  { key: 'mobile_dashboard', url: '/mobile/employee', icon: Smartphone, group: 'mobile' },
  { key: 'mobile_attendance', url: '/mobile/attendance', icon: Clock, group: 'mobile' },
  { key: 'mobile_leave', url: '/mobile/leave', icon: Calendar, group: 'mobile' },
  { key: 'mobile_payslips', url: '/mobile/payslips', icon: FileText, group: 'mobile' },
  { key: 'mobile_notifications', url: '/mobile/notifications', icon: Bell, group: 'mobile' },
  
  // Tools & Resources
  { key: 'employee_handbook', url: '/employee-handbook', icon: BookOpen, group: 'resources' },
  { key: 'company_policies', url: '/company-policies', icon: FileText, group: 'resources' },
  { key: 'organization_chart', url: '/organization-chart', icon: Users, group: 'resources' },
  { key: 'employee_directory', url: '/employee-directory', icon: Users, group: 'resources' },
  { key: 'help_support', url: '/help-support', icon: HelpCircle, group: 'resources' },
  { key: 'system_tutorials', url: '/system-tutorials', icon: Video, group: 'resources' },
];

const employeeGroups = [
  { key: 'dashboards', label: 'My Dashboards', icon: LayoutDashboard },
  { key: 'profile', label: 'Profile & Settings', icon: User },
  { key: 'attendance', label: 'Time & Attendance', icon: Clock },
  { key: 'leave', label: 'Leave Management', icon: Calendar },
  { key: 'performance', label: 'Performance & Goals', icon: Target },
  { key: 'learning', label: 'Learning & Development', icon: BookOpen },
  { key: 'payroll', label: 'Payroll & Benefits', icon: Coins },
  { key: 'communication', label: 'Communication', icon: MessageSquare },
  { key: 'requests', label: 'Requests & Approvals', icon: ClipboardList },
  { key: 'mobile', label: 'Mobile Tools', icon: Smartphone },
  { key: 'resources', label: 'Resources & Help', icon: HelpCircle },
];

export const EmployeeSidebar: React.FC = () => {
  const { open } = useSidebar();
  const location = useLocation();
  const lang = resolveLang();
  const { t } = useLocale();

  return (
    <Sidebar className={open ? "w-60" : "w-14"}>
      <SidebarContent>
        {employeeGroups.map((group) => {
          const groupItems = employeeItems.filter(item => item.group === group.key);
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