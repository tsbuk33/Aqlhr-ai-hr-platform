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
  { title: 'HR Dashboard', url: '/hr-dashboard', icon: LayoutDashboard },
  { title: 'Employee Directory', url: '/employee-directory', icon: Users },
  { title: 'Recruitment', url: '/recruitment', icon: UserPlus },
  { title: 'Performance Management', url: '/performance-management', icon: TrendingUp },
  { title: 'Training & Development', url: '/training', icon: BookOpen },
  { title: 'Leave Management', url: '/leave-management', icon: Calendar },
  { title: 'Onboarding', url: '/onboarding', icon: ClipboardList },
  { title: 'Goal Setting', url: '/goal-setting', icon: Target },
  { title: 'HR Reports', url: '/hr-reports', icon: FileText },
];

export const HRManagerSidebar: React.FC = () => {
  const { open } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar className={open ? "w-60" : "w-14"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>HR Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {hrManagerItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
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