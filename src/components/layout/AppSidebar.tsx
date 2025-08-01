import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Users,
  Clock,
  Calendar,
  TrendingUp,
  Shield,
  DollarSign,
  Briefcase,
  Brain,
  Settings,
  Home,
  Building2
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const navigationItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Employees', url: '/employees', icon: Users },
  { title: 'Attendance', url: '/attendance', icon: Clock },
  { title: 'Leave', url: '/leave', icon: Calendar },
  { title: 'Performance', url: '/performance', icon: TrendingUp },
  { title: 'HSE', url: '/hse', icon: Shield },
  { title: 'Payroll & GOSI', url: '/payroll', icon: DollarSign },
  { title: 'Recruitment', url: '/recruitment', icon: Briefcase },
];

const managementItems = [
  { title: 'AI Intelligence', url: '/ai', icon: Brain, adminOnly: true },
  { title: 'Company', url: '/company', icon: Building2 },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50";

  return (
    <Sidebar className={open ? "w-60" : "w-14"}>
      <SidebarContent>
        <div className="p-4">
          <h2 className={`font-bold text-lg ${open ? 'block' : 'hidden'}`}>
            AqlHR Platform
          </h2>
          <div className={`w-8 h-8 bg-primary rounded flex items-center justify-center ${open ? 'hidden' : 'block'}`}>
            <span className="text-primary-foreground font-bold">A</span>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={open ? 'block' : 'hidden'}>
            Core Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={open ? 'block' : 'hidden'}>
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
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
}