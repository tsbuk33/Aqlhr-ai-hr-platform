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
  BarChart3,
  Target,
  ClipboardCheck,
  MessageSquare,
  TrendingUp,
  Smartphone,
} from 'lucide-react';

const managerItems = [
  { key: 'main_dashboard', url: '/', icon: LayoutDashboard },
  { key: 'manager_dashboard', url: '/manager-dashboard', icon: LayoutDashboard },
  { key: 'my_team', url: '/my-team', icon: Users },
  { key: 'team_attendance', url: '/team-attendance', icon: Calendar },
  { key: 'performance_reviews', url: '/team-performance', icon: TrendingUp },
  { key: 'team_goals', url: '/team-goals', icon: Target },
  { key: 'approve_requests', url: '/approve-requests', icon: ClipboardCheck },
  { key: 'team_analytics', url: '/team-analytics', icon: BarChart3 },
  { key: 'team_analytics_mobile', url: '/mobile/team-analytics', icon: Smartphone },
  { key: 'team_feedback', url: '/team-feedback', icon: MessageSquare },
];

export const ManagerSidebar: React.FC = () => {
  const { open } = useSidebar();
  const location = useLocation();
  const lang = resolveLang();
  const { t } = useLocale();

  return (
    <Sidebar className={open ? "w-60" : "w-14"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation', 'team_management')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managerItems.map((item) => (
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