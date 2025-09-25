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
  LayoutDashboard, Users, Calendar, BarChart3, Settings, FileText, UserCheck, TrendingUp, Shield, Target, Coins,
  Database, Server, Monitor, AlertTriangle, Lock, Key, Globe, Bot, Brain, Cpu, Cloud, Smartphone, Tablet,
  Building, MapPin, FileCheck, CreditCard, Receipt, PieChart, LineChart, TrendingDown, Activity, Zap,
  Mail, MessageSquare, Bell, Search, Filter, Download, Upload, Archive, Trash, Edit, Plus, Minus,
  CheckCircle, XCircle, Info, HelpCircle, BookOpen, GraduationCap, Briefcase, Clock, UserPlus,
  UserMinus, UserX, Eye, EyeOff, RotateCcw, RefreshCw, Power, Wifi, WifiOff, Bluetooth, Usb,
  HardDrive, MemoryStick, Printer, Camera, Mic, Speaker, Volume2, VolumeX,
  Play, Pause, SkipBack, SkipForward, Rewind, FastForward, Repeat, Shuffle, Heart,
  Star, Bookmark, Flag, Tag, Hash, AtSign, Percent, DollarSign, Euro, PoundSterling,
  Thermometer, Gauge, Compass, Navigation, Map, Route, Car, Truck, Plane, Ship, Train,
  Home, Store, Factory, Warehouse, School, Hospital, Hotel
} from 'lucide-react';

const adminItems = [
  // Core Dashboards & Overview
  { key: 'main_dashboard', url: '/', icon: LayoutDashboard, group: 'dashboards' },
  { key: 'admin_dashboard', url: '/admin', icon: LayoutDashboard, group: 'dashboards' },
  { key: 'executive_strategic_dashboard', url: '/executive/strategic-dashboard', icon: Target, group: 'dashboards' },
  { key: 'system_overview', url: '/system-overview', icon: Monitor, group: 'dashboards' },
  { key: 'real_time_monitoring', url: '/real-time-monitoring', icon: Activity, group: 'dashboards' },
  
  // System Management & Configuration
  { key: 'system_health', url: '/_/health', icon: Shield, group: 'system' },
  { key: 'system_configuration', url: '/system-config', icon: Settings, group: 'system' },
  { key: 'database_management', url: '/database-management', icon: Database, group: 'system' },
  { key: 'server_management', url: '/server-management', icon: Server, group: 'system' },
  { key: 'backup_recovery', url: '/backup-recovery', icon: Archive, group: 'system' },
  { key: 'system_logs', url: '/system-logs', icon: FileText, group: 'system' },
  { key: 'performance_monitoring', url: '/performance-monitoring', icon: Gauge, group: 'system' },
  { key: 'resource_management', url: '/resource-management', icon: HardDrive, group: 'system' },
  
  // User & Access Management
  { key: 'user_management', url: '/user-management', icon: Users, group: 'users' },
  { key: 'user_roles', url: '/user-roles', icon: UserCheck, group: 'users' },
  { key: 'access_control', url: '/access-control', icon: Lock, group: 'users' },
  { key: 'permission_management', url: '/permission-management', icon: Key, group: 'users' },
  { key: 'authentication_settings', url: '/auth-settings', icon: Shield, group: 'users' },
  { key: 'session_management', url: '/session-management', icon: Clock, group: 'users' },
  
  // Security & Compliance
  { key: 'security_dashboard', url: '/security-dashboard', icon: Shield, group: 'security' },
  { key: 'security_audit', url: '/security-audit', icon: FileCheck, group: 'security' },
  { key: 'compliance_management', url: '/compliance', icon: Shield, group: 'security' },
  { key: 'vulnerability_scanner', url: '/vulnerability-scanner', icon: Search, group: 'security' },
  { key: 'threat_detection', url: '/threat-detection', icon: AlertTriangle, group: 'security' },
  { key: 'incident_response', url: '/incident-response', icon: AlertTriangle, group: 'security' },
  { key: 'security_policies', url: '/security-policies', icon: FileText, group: 'security' },
  
  // Analytics & Reporting
  { key: 'analytics_dashboard', url: '/analytics-dashboard', icon: BarChart3, group: 'analytics' },
  { key: 'hr_analytics', url: '/hr-analytics', icon: BarChart3, group: 'analytics' },
  { key: 'usage_analytics', url: '/usage-analytics', icon: PieChart, group: 'analytics' },
  { key: 'performance_analytics', url: '/performance-analytics', icon: TrendingUp, group: 'analytics' },
  { key: 'financial_analytics', url: '/financial-analytics', icon: DollarSign, group: 'analytics' },
  { key: 'custom_reports', url: '/custom-reports', icon: FileText, group: 'analytics' },
  { key: 'automated_reports', url: '/automated-reports', icon: RefreshCw, group: 'analytics' },
  
  // Government & Integration
  { key: 'government_integration', url: '/government-integration', icon: Building, group: 'integration' },
  { key: 'moi_integration', url: '/moi-integration', icon: Globe, group: 'integration' },
  { key: 'mol_integration', url: '/mol-integration', icon: Briefcase, group: 'integration' },
  { key: 'gosi_integration', url: '/gosi-integration', icon: Shield, group: 'integration' },
  { key: 'zakat_tax_integration', url: '/zakat-tax-integration', icon: Receipt, group: 'integration' },
  { key: 'api_management', url: '/api-management', icon: Globe, group: 'integration' },
  { key: 'data_sync', url: '/data-sync', icon: RefreshCw, group: 'integration' },
  
  // AI & Automation
  { key: 'ai_dashboard', url: '/ai-dashboard', icon: Bot, group: 'ai' },
  { key: 'ai_recruitment', url: '/ai-recruitment', icon: Brain, group: 'ai' },
  { key: 'ai_performance', url: '/ai-performance', icon: TrendingUp, group: 'ai' },
  { key: 'ai_analytics', url: '/ai-analytics', icon: BarChart3, group: 'ai' },
  { key: 'automation_workflows', url: '/automation-workflows', icon: Zap, group: 'ai' },
  { key: 'ml_models', url: '/ml-models', icon: Brain, group: 'ai' },
  { key: 'predictive_analytics', url: '/predictive-analytics', icon: TrendingUp, group: 'ai' },
  
  // Mobile & Applications
  { key: 'mobile_app_management', url: '/mobile-app-management', icon: Smartphone, group: 'mobile' },
  { key: 'admin_mobile', url: '/mobile/admin', icon: Tablet, group: 'mobile' },
  { key: 'push_notifications', url: '/push-notifications', icon: Bell, group: 'mobile' },
  { key: 'app_distribution', url: '/app-distribution', icon: Download, group: 'mobile' },
  { key: 'mobile_analytics', url: '/mobile-analytics', icon: BarChart3, group: 'mobile' },
  
  // HR Core Management
  { key: 'employee_management', url: '/employee-management', icon: Users, group: 'hr' },
  { key: 'attendance_time', url: '/attendance', icon: Calendar, group: 'hr' },
  { key: 'payroll_management', url: '/payroll', icon: Coins, group: 'hr' },
  { key: 'performance_reviews', url: '/performance', icon: TrendingUp, group: 'hr' },
  { key: 'recruitment_management', url: '/recruitment-management', icon: UserPlus, group: 'hr' },
  { key: 'training_management', url: '/training-management', icon: GraduationCap, group: 'hr' },
  { key: 'leave_management', url: '/leave-management', icon: Calendar, group: 'hr' },
  
  // Document & Content Management
  { key: 'document_management', url: '/document-management', icon: FileText, group: 'documents' },
  { key: 'content_management', url: '/content-management', icon: BookOpen, group: 'documents' },
  { key: 'file_storage', url: '/file-storage', icon: Archive, group: 'documents' },
  { key: 'document_templates', url: '/document-templates', icon: FileText, group: 'documents' },
  { key: 'digital_signatures', url: '/digital-signatures', icon: Edit, group: 'documents' },
  
  // Communication & Notifications
  { key: 'communication_center', url: '/communication-center', icon: MessageSquare, group: 'communication' },
  { key: 'notification_management', url: '/notification-management', icon: Bell, group: 'communication' },
  { key: 'email_management', url: '/email-management', icon: Mail, group: 'communication' },
  { key: 'announcement_system', url: '/announcement-system', icon: Speaker, group: 'communication' },
  
  // Utilities & Tools
  { key: 'backup_tools', url: '/backup-tools', icon: Archive, group: 'utilities' },
  { key: 'import_export', url: '/import-export', icon: Upload, group: 'utilities' },
  { key: 'data_migration', url: '/data-migration', icon: RefreshCw, group: 'utilities' },
  { key: 'bulk_operations', url: '/bulk-operations', icon: Plus, group: 'utilities' },
  { key: 'scheduler', url: '/scheduler', icon: Clock, group: 'utilities' },
  
  // Emergency & Support
  { key: 'emergency_controls', url: '/emergency-controls', icon: AlertTriangle, group: 'emergency' },
  { key: 'system_maintenance', url: '/system-maintenance', icon: Settings, group: 'emergency' },
  { key: 'disaster_recovery', url: '/disaster-recovery', icon: Shield, group: 'emergency' },
  { key: 'support_tickets', url: '/support-tickets', icon: HelpCircle, group: 'emergency' },
];

const adminGroups = [
  { key: 'dashboards', label: 'Dashboards & Overview', icon: LayoutDashboard },
  { key: 'system', label: 'System Management', icon: Server },
  { key: 'users', label: 'User Management', icon: Users },
  { key: 'security', label: 'Security & Compliance', icon: Shield },
  { key: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
  { key: 'integration', label: 'Government & Integration', icon: Globe },
  { key: 'ai', label: 'AI & Automation', icon: Bot },
  { key: 'mobile', label: 'Mobile Management', icon: Smartphone },
  { key: 'hr', label: 'HR Core Management', icon: Briefcase },
  { key: 'documents', label: 'Document Management', icon: FileText },
  { key: 'communication', label: 'Communication', icon: MessageSquare },
  { key: 'utilities', label: 'Utilities & Tools', icon: Settings },
  { key: 'emergency', label: 'Emergency & Support', icon: AlertTriangle },
];

export const AdminSidebar: React.FC = () => {
  const { open } = useSidebar();
  const location = useLocation();
  const lang = resolveLang();
  const { t } = useLocale();

  return (
    <Sidebar className={open ? "w-60" : "w-14"}>
      <SidebarContent>
        {adminGroups.map((group) => {
          const groupItems = adminItems.filter(item => item.group === group.key);
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