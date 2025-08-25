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
  Calendar,
  Clock,
  FileText,
  User,
  Target,
  BookOpen,
  MessageSquare,
} from 'lucide-react';

const employeeItems = [
  { key: 'main_dashboard', url: '/', icon: LayoutDashboard },
  { key: 'my_dashboard', url: '/employee-dashboard', icon: LayoutDashboard },
  { key: 'my_profile', url: '/my-profile', icon: User },
  { key: 'time_attendance', url: '/my-attendance', icon: Clock },
  { key: 'leave_requests', url: '/my-leave', icon: Calendar },
  { key: 'my_goals', url: '/my-goals', icon: Target },
  { key: 'training_courses', url: '/my-training', icon: BookOpen },
  { key: 'pay_slips', url: '/my-payslips', icon: FileText },
  { key: 'feedback', url: '/my-feedback', icon: MessageSquare },
];

export const EmployeeSidebar: React.FC = () => {
  const { open } = useSidebar();
  const location = useLocation();
  const lang = resolveLang();
  const { t } = useLocale();

  return (
    <Sidebar className={open ? "w-60" : "w-14"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation', 'employee_portal')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {employeeItems.map((item) => (
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