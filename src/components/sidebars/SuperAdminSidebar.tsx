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
  Building2,
  Settings,
  BarChart3,
  Brain,
  Shield,
  Zap,
  Target,
  FileText,
  Globe,
  Wrench,
} from 'lucide-react';

const superAdminItems = [
  { title: 'Main Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Super Admin Dashboard', url: '/super-admin', icon: LayoutDashboard },
  { title: 'System Management', url: '/system-management', icon: Settings },
  { title: 'Company Management', url: '/company-management', icon: Building2 },
  { title: 'User Management', url: '/user-management', icon: Users },
  { title: 'AI Engine Control', url: '/ai-engine', icon: Brain },
  { title: 'Security Center', url: '/security-center', icon: Shield },
  { title: 'System Analytics', url: '/system-analytics', icon: BarChart3 },
  { title: 'Performance Monitor', url: '/performance-monitor', icon: Zap },
  { title: 'Compliance Hub', url: '/compliance-hub', icon: FileText },
  { title: 'Integration Center', url: '/integration-center', icon: Globe },
  { title: 'Strategic Planning', url: '/strategic-planning', icon: Target },
  { title: 'System Tools', url: '/system-tools', icon: Wrench },
];

export const SuperAdminSidebar: React.FC = () => {
  const { open } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={open ? "w-60" : "w-14"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Super Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {superAdminItems.map((item) => (
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