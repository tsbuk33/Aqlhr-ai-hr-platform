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
  { title: 'Main Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'My Dashboard', url: '/employee-dashboard', icon: LayoutDashboard },
  { title: 'My Profile', url: '/my-profile', icon: User },
  { title: 'Time & Attendance', url: '/my-attendance', icon: Clock },
  { title: 'Leave Requests', url: '/my-leave', icon: Calendar },
  { title: 'My Goals', url: '/my-goals', icon: Target },
  { title: 'Training Courses', url: '/my-training', icon: BookOpen },
  { title: 'Pay Slips', url: '/my-payslips', icon: FileText },
  { title: 'Feedback', url: '/my-feedback', icon: MessageSquare },
];

export const EmployeeSidebar: React.FC = () => {
  const { open } = useSidebar();
  const location = useLocation();
  const lang = resolveLang();

  return (
    <Sidebar className={open ? "w-60" : "w-14"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Employee Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {employeeItems.map((item) => (
                <SidebarMenuItem key={item.title}>
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
                      {open && <span>{item.title}</span>}
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