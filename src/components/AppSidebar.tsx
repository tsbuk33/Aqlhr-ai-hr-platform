import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  FileText, 
  Clock, 
  BookOpen, 
  Check, 
  ArrowUp, 
  ArrowDown 
} from "lucide-react";
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
} from "@/components/ui/sidebar";

// Platform modules based on SanadHR structure
const platformModules = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: BookOpen,
    badge: "1"
  },
  { 
    title: "Core HR Modules", 
    url: "/core-hr", 
    icon: Users,
    badge: "12",
    subItems: [
      { title: "Employee Master Data", url: "/core-hr/employees" },
      { title: "Organizational Structure", url: "/core-hr/organization" },
      { title: "Employee Self-Service", url: "/core-hr/self-service" },
      { title: "Document Management", url: "/core-hr/documents" },
    ]
  },
  { 
    title: "Compliance & Governance", 
    url: "/compliance", 
    icon: FileText,
    badge: "10",
    subItems: [
      { title: "Regulatory Compliance", url: "/compliance/regulatory" },
      { title: "Committee Management", url: "/compliance/committees" },
      { title: "Audit Trail Management", url: "/compliance/audit-trails" },
      { title: "Risk Management", url: "/compliance/risk-management" },
      { title: "Policy Management", url: "/compliance/policies" },
      { title: "Governance Framework", url: "/compliance/governance" },
      { title: "Compliance Reporting", url: "/compliance/reporting" },
      { title: "Legal Document Tracking", url: "/compliance/legal-docs" },
      { title: "Documentation Management", url: "/compliance/documentation" },
      { title: "Evidence Management", url: "/compliance/evidence" },
    ]
  },
  { 
    title: "Payroll & Financial", 
    url: "/payroll", 
    icon: Calendar,
    badge: "8"
  },
  { 
    title: "AI Features", 
    url: "/ai-features", 
    icon: Check,
    badge: "8"
  },
  { 
    title: "Government Integrations", 
    url: "/government", 
    icon: FileText,
    badge: "8"
  },
  { 
    title: "Strategic HR", 
    url: "/strategic", 
    icon: ArrowUp,
    badge: "10"
  },
  { 
    title: "Premium Consulting", 
    url: "/consulting", 
    icon: Clock,
    badge: "12"
  },
  { 
    title: "Advanced Analytics", 
    url: "/analytics", 
    icon: ArrowDown,
    badge: "11"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Core HR Modules"]);

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (url: string) => currentPath.startsWith(url) && url !== "/";
  
  const getNavClasses = (isActive: boolean, isGroup = false) => {
    const baseClasses = "w-full justify-start transition-colors text-sm";
    if (isActive) {
      return isGroup 
        ? `${baseClasses} bg-primary text-primary-foreground font-medium`
        : `${baseClasses} bg-primary text-primary-foreground font-medium`;
    }
    return `${baseClasses} text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`;
  };

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => 
      prev.includes(title) 
        ? prev.filter(g => g !== title)
        : [...prev, title]
    );
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            {state !== "collapsed" && (
              <div>
                <h1 className="text-lg font-bold text-sidebar-primary-foreground">SanadHR</h1>
                <p className="text-xs text-sidebar-foreground/70">Complete HR Management Platform</p>
              </div>
            )}
          </div>
          {state !== "collapsed" && (
            <div className="mt-4 flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-status-success rounded-full"></div>
              <span className="text-sidebar-foreground/70">All Systems Operational</span>
            </div>
          )}
        </div>

        {/* Platform Modules */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
            Platform Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {platformModules.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild={!item.subItems}
                    className={getNavClasses(isActive(item.url) || isGroupActive(item.url), !!item.subItems)}
                    onClick={item.subItems ? () => toggleGroup(item.title) : undefined}
                  >
                    {item.subItems ? (
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          {state !== "collapsed" && (
                            <>
                              <span>{item.title}</span>
                              <span className="text-xs bg-sidebar-accent text-sidebar-accent-foreground px-1.5 py-0.5 rounded">
                                {item.badge}
                              </span>
                            </>
                          )}
                        </div>
                        {state !== "collapsed" && (
                          <div className={`transition-transform ${expandedGroups.includes(item.title) ? 'rotate-180' : ''}`}>
                            <ArrowDown className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <NavLink to={item.url} className="w-full flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        {state !== "collapsed" && (
                          <>
                            <span>{item.title}</span>
                            <span className="text-xs bg-sidebar-accent text-sidebar-accent-foreground px-1.5 py-0.5 rounded">
                              {item.badge}
                            </span>
                          </>
                        )}
                      </NavLink>
                    )}
                  </SidebarMenuButton>
                  
                  {/* Sub-items */}
                  {item.subItems && expandedGroups.includes(item.title) && state !== "collapsed" && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <SidebarMenuButton key={subItem.title} asChild size="sm">
                          <NavLink 
                            to={subItem.url}
                            className={getNavClasses(isActive(subItem.url))}
                          >
                            <span className="text-xs">{subItem.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      ))}
                    </div>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Language Selector */}
        {state !== "collapsed" && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-center">
              <button className="bg-brand-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-secondary/90 transition-colors">
                🌐 العربية / English
              </button>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}