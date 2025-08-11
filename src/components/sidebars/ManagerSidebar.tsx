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
  BarChart3,
  Target,
  ClipboardCheck,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';

const managerItems = [
  { title: 'Manager Dashboard', url: '/manager-dashboard', icon: LayoutDashboard },
  { title: 'My Team', url: '/my-team', icon: Users },
  { title: 'Team Attendance', url: '/team-attendance', icon: Calendar },
  { title: 'Performance Reviews', url: '/team-performance', icon: TrendingUp },
  { title: 'Team Goals', url: '/team-goals', icon: Target },
  { title: 'Approve Requests', url: '/approve-requests', icon: ClipboardCheck },
  { title: 'Team Analytics', url: '/team-analytics', icon: BarChart3 },
  { title: 'Team Feedback', url: '/team-feedback', icon: MessageSquare },
];

export const ManagerSidebar: React.FC = () => {
  const { open } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar className={open ? "w-60" : "w-14"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Team Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managerItems.map((item) => (
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