import React, { useState } from 'react';
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Crown,
  Users,
  ChevronRight,
  ChevronDown,
  Brain,
  Database,
  UserPlus,
  DollarSign,
  Gift,
  Target,
  GraduationCap,
  Clock,
  Calendar,
  TrendingUp,
  Calculator,
  UserCheck,
  BarChart3,
  Circle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const coreHRItems = [
  { title: 'Employee Master Data', url: '/core-hr/employee-master-data', icon: Database },
  { title: 'Recruitment & Hiring', url: '/core-hr/recruitment-hiring', icon: UserPlus },
  { title: 'Payroll Processing', url: '/core-hr/payroll-processing', icon: DollarSign },
  { title: 'Benefits Administration', url: '/core-hr/benefits-administration', icon: Gift },
  { title: 'Performance Management', url: '/core-hr/performance-management', icon: Target },
  { title: 'Training & Development', url: '/core-hr/training-development', icon: GraduationCap },
  { title: 'Time & Attendance', url: '/core-hr/time-attendance', icon: Clock },
  { title: 'Leave Management', url: '/core-hr/leave-management', icon: Calendar },
  { title: 'Succession Planning', url: '/core-hr/succession-planning', icon: TrendingUp },
  { title: 'Compensation Management', url: '/core-hr/compensation-management', icon: DollarSign },
  { title: 'Saudization & Visa Calculator', url: '/core-hr/saudization-calculator', icon: Calculator },
  { title: 'Employee Self Service', url: '/core-hr/employee-self-service', icon: UserCheck },
  { title: 'Manager Dashboard', url: '/core-hr/manager-dashboard', icon: BarChart3 },
];

export const SuperAdminSidebar: React.FC = () => {
  const { open } = useSidebar();
  const location = useLocation();
  const [coreHRExpanded, setCoreHRExpanded] = useState(true);

  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (paths: string[]) => paths.some(path => location.pathname.startsWith(path));

  return (
    <Sidebar className={open ? "w-80" : "w-14"}>
      <SidebarContent>
        {/* Platform Header */}
        {open && (
          <div className="p-4 border-b">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/70 rounded-lg"></div>
              <div>
                <h3 className="font-semibold text-foreground">AqlHR</h3>
                <p className="text-xs text-muted-foreground">Smart HR Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Circle className="h-2 w-2 fill-green-500 text-green-500" />
              <span className="text-muted-foreground">All systems operational</span>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Platform Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted/50"
                    }
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {open && (
                      <div className="flex items-center justify-between w-full">
                        <span>Dashboard</span>
                        <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                          1
                        </Badge>
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Executive Intelligence Center */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/executive-center"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted/50"
                    }
                  >
                    <Crown className="h-4 w-4" />
                    {open && (
                      <div className="flex items-center justify-between w-full">
                        <span>AqlHR Executive Intelligence Center</span>
                        <Badge className="bg-yellow-600 hover:bg-yellow-600 text-xs px-2 py-0">
                          PREMIUM
                        </Badge>
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Core HR - Expandable */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setCoreHRExpanded(!coreHRExpanded)}
                  className={`hover:bg-muted/50 ${isGroupActive(['/core-hr']) ? 'bg-muted text-foreground font-medium' : ''}`}
                >
                  <Users className="h-4 w-4" />
                  {open && (
                    <div className="flex items-center justify-between w-full">
                      <span>Core HR</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-5 w-6 p-0 flex items-center justify-center text-xs">
                          13
                        </Badge>
                        {coreHRExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  )}
                </SidebarMenuButton>

                {/* Core HR Sub-items */}
                {open && coreHRExpanded && (
                  <SidebarMenuSub>
                    {coreHRItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink
                            to={item.url}
                            className={({ isActive }) =>
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted/30"
                            }
                          >
                            <item.icon className="h-3 w-3" />
                            <span className="text-sm">{item.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Skills Intelligence */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/skills-intelligence"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted/50"
                    }
                  >
                    <Brain className="h-4 w-4" />
                    {open && (
                      <div className="flex items-center justify-between w-full">
                        <span>Skills Intelligence</span>
                        <Badge className="bg-green-600 hover:bg-green-600 text-xs px-2 py-0">
                          NEW
                        </Badge>
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};