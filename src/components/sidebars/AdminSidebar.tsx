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
  DollarSign,
  BarChart3,
  Settings,
  FileText,
  UserCheck,
  TrendingUp,
  Shield,
} from 'lucide-react';

const adminItems = [
  { title: 'Admin Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Employee Management', url: '/employees', icon: Users },
  { title: 'Attendance & Time', url: '/attendance', icon: Calendar },
  { title: 'Payroll Management', url: '/payroll', icon: DollarSign },
  { title: 'HR Analytics', url: '/hr-analytics', icon: BarChart3 },
  { title: 'Performance Reviews', url: '/performance', icon: TrendingUp },
  { title: 'Compliance', url: '/compliance', icon: Shield },
  { title: 'Reports', url: '/reports', icon: FileText },
  { title: 'User Roles', url: '/user-roles', icon: UserCheck },
  { title: 'Company Settings', url: '/company-settings', icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  const { open } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar className={open ? "w-60" : "w-14"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
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