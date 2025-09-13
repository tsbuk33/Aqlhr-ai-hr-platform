import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Users, BarChart3, Crown, Star, GraduationCap, Sparkles, Brain, 
  Building2, Shield, Settings, ChevronDown, Home, Zap
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, SidebarHeader, SidebarFooter
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'core-hr': false,
    'ai-analytics': false,
    'government': false
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const mainModules = [
    {
      title: isArabic ? "لوحة التحكم" : "Dashboard",
      url: "/dashboard",
      icon: Home,
      color: "text-blue-500"
    },
    {
      title: isArabic ? "مركز الذكاء التنفيذي" : "Executive Intelligence",
      url: "/executive-center",
      icon: Crown,
      badge: "PREMIUM",
      color: "text-yellow-500"
    },
    {
      title: isArabic ? "ذكاء المهارات" : "Skills Intelligence",
      url: "/skills-intelligence",
      icon: Star,
      badge: "NEW",
      color: "text-amber-500"
    },
    {
      title: isArabic ? "تحسين التعلّم" : "Learning (LEO)",
      url: "/leo",
      icon: GraduationCap,
      badge: "LEO",
      color: "text-blue-600"
    },
    {
      title: isArabic ? "تحسين المشاركة" : "Engagement (GEO)",
      url: "/geo",
      icon: Sparkles,
      badge: "GEO",
      color: "text-pink-500"
    }
  ];

  const expandableGroups = [
    {
      id: 'core-hr',
      title: isArabic ? "الموارد البشرية الأساسية" : "Core HR",
      icon: Users,
      badge: "13",
      color: "text-emerald-500",
      items: [
        { title: isArabic ? "بيانات الموظفين" : "Employee Data", url: "/core-hr/master-data" },
        { title: isArabic ? "التوظيف" : "Recruitment", url: "/core-hr/recruitment" },
        { title: isArabic ? "الرواتب" : "Payroll", url: "/payroll" },
        { title: isArabic ? "الأداء" : "Performance", url: "/core-hr/performance" },
        { title: isArabic ? "الإجازات" : "Leave", url: "/core-hr/leave" }
      ]
    },
    {
      id: 'ai-analytics',
      title: isArabic ? "الذكاء الاصطناعي" : "AI & Analytics",
      icon: Brain,
      badge: "AI",
      color: "text-purple-500",
      items: [
        { title: isArabic ? "التحليلات التنفيذية" : "Executive Analytics", url: "/analytics" },
        { title: isArabic ? "تحليلات القوى العاملة" : "Workforce Analytics", url: "/analytics/workforce" },
        { title: isArabic ? "التحليلات التنبؤية" : "Predictive Analytics", url: "/ai-automation/predictive-analytics" },
        { title: isArabic ? "محرك الأتمتة" : "Automation Engine", url: "/ai-automation" }
      ]
    },
    {
      id: 'government',
      title: isArabic ? "التكاملات الحكومية" : "Government Integrations",
      icon: Building2,
      badge: "21",
      color: "text-green-500",
      items: [
        { title: isArabic ? "قوى" : "QIWA", url: "/government/qiwa" },
        { title: isArabic ? "التأمينات الاجتماعية" : "GOSI", url: "/government/gosi" },
        { title: isArabic ? "أبشر" : "ABSHER", url: "/government/absher" },
        { title: isArabic ? "وزارة الموارد البشرية" : "MOL", url: "/government/mol" }
      ]
    }
  ];

  return (
    <Sidebar className={`${collapsed ? 'w-14' : 'w-64'} border-r border-border/50 bg-gradient-to-b from-background via-surface-subtle to-background`}>
      {/* Header */}
      <SidebarHeader className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-gradient-to-br from-primary to-accent">
            <AvatarFallback className="text-white font-bold">AQL</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AqlHR
              </h2>
              <p className="text-xs text-muted-foreground">Smart HR Platform</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {/* Main Modules */}
        <SidebarGroup>
          <SidebarGroupLabel className={`px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide ${collapsed ? 'sr-only' : ''}`}>
            {isArabic ? 'الوحدات الرئيسية' : 'Main Modules'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainModules.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent/50 ${
                          isActive
                            ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                            : 'text-foreground hover:text-primary'
                        }`
                      }
                    >
                      <item.icon className={`h-4 w-4 ${item.color} flex-shrink-0`} />
                      {!collapsed && (
                        <>
                          <span className="font-medium text-sm truncate">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Expandable Groups */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {isArabic ? 'الوحدات المتقدمة' : 'Advanced Modules'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {expandableGroups.map((group) => (
                  <SidebarMenuItem key={group.id}>
                    <Collapsible open={openGroups[group.id]} onOpenChange={() => toggleGroup(group.id)}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent/50 text-foreground hover:text-primary w-full">
                          <group.icon className={`h-4 w-4 ${group.color} flex-shrink-0`} />
                          <span className="font-medium text-sm truncate flex-1 text-left">{group.title}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                              {group.badge}
                            </Badge>
                            <ChevronDown className={`h-3 w-3 transition-transform ${openGroups[group.id] ? 'rotate-180' : ''}`} />
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-7 mt-1 space-y-1">
                        {group.items.map((subItem) => (
                          <NavLink
                            key={subItem.url}
                            to={subItem.url}
                            className={({ isActive }) =>
                              `block px-3 py-1.5 text-sm rounded-md transition-colors ${
                                isActive
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                              }`
                            }
                          >
                            {subItem.title}
                          </NavLink>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel className={`px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide ${collapsed ? 'sr-only' : ''}`}>
            {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/compliance"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent/50 text-foreground hover:text-primary"
                  >
                    <Shield className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    {!collapsed && <span className="font-medium text-sm">{isArabic ? 'الامتثال' : 'Compliance'}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent/50 text-foreground hover:text-primary"
                  >
                    <Settings className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    {!collapsed && <span className="font-medium text-sm">{isArabic ? 'الإعدادات' : 'Settings'}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-border/50">
        {!collapsed && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'جميع الأنظمة تعمل' : 'All systems operational'}
            </p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Online</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}