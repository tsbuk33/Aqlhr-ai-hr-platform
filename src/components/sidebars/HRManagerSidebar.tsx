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
  LayoutDashboard, Users, Calendar, ClipboardList, TrendingUp, BookOpen, UserPlus, FileText, Target,
  BarChart3, Shield, Coins, Clock, MessageSquare, Settings, Database, Globe, Bot, Smartphone,
  Building, CreditCard, Receipt, PieChart, LineChart, Activity, Zap, Mail, Bell, Search,
  CheckCircle, Eye, RefreshCw, HardDrive, Archive, Upload, Download, Edit, Plus, Heart,
  Star, Bookmark, GraduationCap, Briefcase, UserCheck, UserMinus, UserX, Filter, Tag,
  Award, Trophy, Medal, Flame, Lightbulb, Rocket, Sparkles, Crown, Diamond, Gem, Flag
} from 'lucide-react';

const hrManagerItems = [
  // Core HR Dashboards
  { key: 'main_dashboard', url: '/', icon: LayoutDashboard, group: 'dashboards' },
  { key: 'hr_dashboard', url: '/hr-dashboard', icon: LayoutDashboard, group: 'dashboards' },
  { key: 'hr_analytics_dashboard', url: '/hr-analytics-dashboard', icon: BarChart3, group: 'dashboards' },
  { key: 'executive_hr_dashboard', url: '/executive-hr-dashboard', icon: Target, group: 'dashboards' },
  { key: 'workforce_analytics', url: '/workforce-analytics', icon: PieChart, group: 'dashboards' },
  
  // Employee Management
  { key: 'employee_directory', url: '/employee-directory', icon: Users, group: 'employees' },
  { key: 'employee_profiles', url: '/employee-profiles', icon: UserCheck, group: 'employees' },
  { key: 'organizational_chart', url: '/organizational-chart', icon: Building, group: 'employees' },
  { key: 'employee_lifecycle', url: '/employee-lifecycle', icon: RefreshCw, group: 'employees' },
  { key: 'employee_documents', url: '/employee-documents', icon: FileText, group: 'employees' },
  { key: 'employee_contracts', url: '/employee-contracts', icon: ClipboardList, group: 'employees' },
  { key: 'employee_benefits', url: '/employee-benefits', icon: Heart, group: 'employees' },
  
  // Recruitment & Onboarding
  { key: 'recruitment', url: '/recruitment', icon: UserPlus, group: 'recruitment' },
  { key: 'job_postings', url: '/job-postings', icon: Briefcase, group: 'recruitment' },
  { key: 'candidate_management', url: '/candidate-management', icon: Users, group: 'recruitment' },
  { key: 'interview_scheduling', url: '/interview-scheduling', icon: Calendar, group: 'recruitment' },
  { key: 'ai_recruitment', url: '/ai-recruitment', icon: Bot, group: 'recruitment' },
  { key: 'onboarding', url: '/onboarding', icon: ClipboardList, group: 'recruitment' },
  { key: 'onboarding_workflows', url: '/onboarding-workflows', icon: Zap, group: 'recruitment' },
  { key: 'new_hire_portal', url: '/new-hire-portal', icon: Star, group: 'recruitment' },
  
  // Performance & Development
  { key: 'performance_management', url: '/performance-management', icon: TrendingUp, group: 'performance' },
  { key: 'performance_reviews', url: '/performance-reviews', icon: Award, group: 'performance' },
  { key: 'goal_setting', url: '/goal-setting', icon: Target, group: 'performance' },
  { key: 'kpi_management', url: '/kpi-management', icon: BarChart3, group: 'performance' },
  { key: 'career_development', url: '/career-development', icon: Rocket, group: 'performance' },
  { key: 'succession_planning', url: '/succession-planning', icon: Crown, group: 'performance' },
  { key: 'talent_management', url: '/talent-management', icon: Diamond, group: 'performance' },
  { key: 'employee_recognition', url: '/employee-recognition', icon: Trophy, group: 'performance' },
  
  // Training & Learning
  { key: 'training_development', url: '/training', icon: BookOpen, group: 'training' },
  { key: 'learning_management', url: '/learning-management', icon: GraduationCap, group: 'training' },
  { key: 'course_catalog', url: '/course-catalog', icon: BookOpen, group: 'training' },
  { key: 'training_calendar', url: '/training-calendar', icon: Calendar, group: 'training' },
  { key: 'certification_tracking', url: '/certification-tracking', icon: Medal, group: 'training' },
  { key: 'skills_assessment', url: '/skills-assessment', icon: Lightbulb, group: 'training' },
  { key: 'training_analytics', url: '/training-analytics', icon: BarChart3, group: 'training' },
  
  // Attendance & Time Management
  { key: 'attendance_management', url: '/attendance-management', icon: Clock, group: 'attendance' },
  { key: 'time_tracking', url: '/time-tracking', icon: Clock, group: 'attendance' },
  { key: 'shift_management', url: '/shift-management', icon: Calendar, group: 'attendance' },
  { key: 'leave_management', url: '/leave-management', icon: Calendar, group: 'attendance' },
  { key: 'overtime_management', url: '/overtime-management', icon: Clock, group: 'attendance' },
  { key: 'attendance_analytics', url: '/attendance-analytics', icon: BarChart3, group: 'attendance' },
  { key: 'biometric_integration', url: '/biometric-integration', icon: Eye, group: 'attendance' },
  
  // Payroll & Compensation
  { key: 'payroll_management', url: '/payroll-management', icon: Coins, group: 'payroll' },
  { key: 'salary_structure', url: '/salary-structure', icon: BarChart3, group: 'payroll' },
  { key: 'bonus_management', url: '/bonus-management', icon: Award, group: 'payroll' },
  { key: 'deduction_management', url: '/deduction-management', icon: Receipt, group: 'payroll' },
  { key: 'payroll_reports', url: '/payroll-reports', icon: FileText, group: 'payroll' },
  { key: 'tax_management', url: '/tax-management', icon: Receipt, group: 'payroll' },
  { key: 'payroll_compliance', url: '/payroll-compliance', icon: Shield, group: 'payroll' },
  
  // HR Analytics & Reports
  { key: 'hr_analytics', url: '/hr-analytics', icon: BarChart3, group: 'analytics' },
  { key: 'workforce_planning', url: '/workforce-planning', icon: Target, group: 'analytics' },
  { key: 'turnover_analysis', url: '/turnover-analysis', icon: LineChart, group: 'analytics' },
  { key: 'engagement_surveys', url: '/engagement-surveys', icon: MessageSquare, group: 'analytics' },
  { key: 'diversity_analytics', url: '/diversity-analytics', icon: Users, group: 'analytics' },
  { key: 'hr_reports', url: '/hr-reports', icon: FileText, group: 'analytics' },
  { key: 'custom_analytics', url: '/custom-analytics', icon: Settings, group: 'analytics' },
  { key: 'predictive_hr_analytics', url: '/predictive-hr-analytics', icon: TrendingUp, group: 'analytics' },
  
  // Government Compliance & Integration
  { key: 'mol_compliance', url: '/mol-compliance', icon: Building, group: 'compliance' },
  { key: 'gosi_management', url: '/gosi-management', icon: Shield, group: 'compliance' },
  { key: 'saudization_tracking', url: '/saudization-tracking', icon: Flag, group: 'compliance' },
  { key: 'labor_law_compliance', url: '/labor-law-compliance', icon: FileText, group: 'compliance' },
  { key: 'visa_management', url: '/visa-management', icon: Globe, group: 'compliance' },
  { key: 'work_permit_tracking', url: '/work-permit-tracking', icon: UserCheck, group: 'compliance' },
  { key: 'government_reporting', url: '/government-reporting', icon: FileText, group: 'compliance' },
  
  // Communication & Engagement
  { key: 'employee_communication', url: '/employee-communication', icon: MessageSquare, group: 'communication' },
  { key: 'internal_messaging', url: '/internal-messaging', icon: Mail, group: 'communication' },
  { key: 'announcement_system', url: '/announcement-system', icon: Bell, group: 'communication' },
  { key: 'feedback_management', url: '/feedback-management', icon: MessageSquare, group: 'communication' },
  { key: 'employee_surveys', url: '/employee-surveys', icon: ClipboardList, group: 'communication' },
  { key: 'grievance_management', url: '/grievance-management', icon: Shield, group: 'communication' },
  
  // Mobile HR Management
  { key: 'hr_mobile_dashboard', url: '/mobile/hr-dashboard', icon: Smartphone, group: 'mobile' },
  { key: 'mobile_approvals', url: '/mobile/approvals', icon: CheckCircle, group: 'mobile' },
  { key: 'mobile_analytics', url: '/mobile/hr-analytics', icon: BarChart3, group: 'mobile' },
  { key: 'mobile_employee_directory', url: '/mobile/employee-directory', icon: Users, group: 'mobile' },
  
  // Document & Content Management
  { key: 'document_management', url: '/document-management', icon: FileText, group: 'documents' },
  { key: 'policy_management', url: '/policy-management', icon: BookOpen, group: 'documents' },
  { key: 'contract_management', url: '/contract-management', icon: ClipboardList, group: 'documents' },
  { key: 'template_management', url: '/template-management', icon: Edit, group: 'documents' },
  { key: 'digital_signatures', url: '/digital-signatures', icon: Edit, group: 'documents' },
  
  // System Configuration
  { key: 'hr_settings', url: '/hr-settings', icon: Settings, group: 'settings' },
  { key: 'workflow_configuration', url: '/workflow-configuration', icon: Zap, group: 'settings' },
  { key: 'approval_workflows', url: '/approval-workflows', icon: CheckCircle, group: 'settings' },
  { key: 'notification_settings', url: '/notification-settings', icon: Bell, group: 'settings' },
  { key: 'integration_settings', url: '/integration-settings', icon: Globe, group: 'settings' },
];

const hrManagerGroups = [
  { key: 'dashboards', label: 'HR Dashboards', icon: LayoutDashboard },
  { key: 'employees', label: 'Employee Management', icon: Users },
  { key: 'recruitment', label: 'Recruitment & Onboarding', icon: UserPlus },
  { key: 'performance', label: 'Performance & Development', icon: TrendingUp },
  { key: 'training', label: 'Training & Learning', icon: BookOpen },
  { key: 'attendance', label: 'Attendance & Time', icon: Clock },
  { key: 'payroll', label: 'Payroll & Compensation', icon: Coins },
  { key: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
  { key: 'compliance', label: 'Government Compliance', icon: Shield },
  { key: 'communication', label: 'Communication & Engagement', icon: MessageSquare },
  { key: 'mobile', label: 'Mobile HR Tools', icon: Smartphone },
  { key: 'documents', label: 'Documents & Policies', icon: FileText },
  { key: 'settings', label: 'HR Configuration', icon: Settings },
];

export const HRManagerSidebar: React.FC = () => {
  const { open } = useSidebar();
  const location = useLocation();
  const lang = resolveLang();
  const { t } = useLocale();

  return (
    <Sidebar className={open ? "w-60" : "w-14"}>
      <SidebarContent>
        {hrManagerGroups.map((group) => {
          const groupItems = hrManagerItems.filter(item => item.group === group.key);
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