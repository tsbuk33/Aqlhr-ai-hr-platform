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
  ClipboardList,
  TrendingUp,
  BookOpen,
  UserPlus,
  FileText,
  Target,
} from 'lucide-react';

const hrManagerItems = [
  { key: 'main_dashboard', url: '/', icon: LayoutDashboard },
  { key: 'hr_dashboard', url: '/hr-dashboard', icon: LayoutDashboard },
  { key: 'employee_directory', url: '/employee-directory', icon: Users },
  { key: 'recruitment', url: '/recruitment', icon: UserPlus },
  { key: 'performance_management', url: '/performance-management', icon: TrendingUp },
  { key: 'training_development', url: '/training', icon: BookOpen },
  { key: 'leave_management', url: '/leave-management', icon: Calendar },
  { key: 'onboarding', url: '/onboarding', icon: ClipboardList },
  { key: 'goal_setting', url: '/goal-setting', icon: Target },
  { key: 'hr_reports', url: '/hr-reports', icon: FileText },
];

export const HRManagerSidebar: React.FC = () => {
  const { open } = useSidebar();
  const location = useLocation();
  const lang = resolveLang();
  const { t } = useLocale();

  return (
    <Sidebar className={open ? "w-60" : "w-14"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation', 'hr_management')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {hrManagerItems.map((item) => (
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