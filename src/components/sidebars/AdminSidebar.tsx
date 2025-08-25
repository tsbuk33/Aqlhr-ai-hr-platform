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
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  FileText,
  UserCheck,
  TrendingUp,
  Shield,
} from 'lucide-react';

const adminItems = [
  { key: 'main_dashboard', url: '/', icon: LayoutDashboard },
  { key: 'admin_dashboard', url: '/admin', icon: LayoutDashboard },
  { key: 'employee_management', url: '/employees', icon: Users },
  { key: 'attendance_time', url: '/attendance', icon: Calendar },
  { key: 'payroll_management', url: '/payroll', icon: DollarSign },
  { key: 'hr_analytics', url: '/hr-analytics', icon: BarChart3 },
  { key: 'performance_reviews', url: '/performance', icon: TrendingUp },
  { key: 'compliance', url: '/compliance', icon: Shield },
  { key: 'reports', url: '/reports', icon: FileText },
  { key: 'user_roles', url: '/user-roles', icon: UserCheck },
  { key: 'company_settings', url: '/company-settings', icon: Settings },
  { key: 'system_health', url: '/_/health', icon: Shield },
];

export const AdminSidebar: React.FC = () => {
  const { open } = useSidebar();
  const location = useLocation();
  const lang = resolveLang();
  const { t } = useLocale();

  return (
    <Sidebar className={open ? "w-60" : "w-14"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation', 'administration')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
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
                      {open && <span>{t('navigation', item.key)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};