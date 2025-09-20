import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LinkL } from '@/lib/i18n/LinkL';
import { 
  BarChart3, Users, Crown, Brain, Building2, Shield, Settings, 
  ChevronDown, Home, Zap, Scale, Heart, Star, GraduationCap,
  Sparkles, FileText, Globe, Award, Briefcase, Activity
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, SidebarHeader
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  return (
    <Sidebar className="aqlhr-sidebar w-64 min-w-64">
      {/* Header - Exact Production Match */}
      <SidebarHeader className="p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AQL</span>
          </div>
          {!collapsed && (
            <div className="flex-1">
              <div className="text-sm font-bold text-foreground">AqlHR</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-xs text-muted-foreground">Legal Consultant</span>
                <Badge className="text-xs px-1 py-0 bg-blue-600 text-white">NEW</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">AI</div>
              <div className="text-xs text-green-400 mt-1">Systems operational</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0">
        {/* Platform Modules - Exact Production Structure */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground bg-surface-subtle">
            Platform Modules
          </SidebarGroupLabel>
          <SidebarGroupContent className="p-2">
            <SidebarMenu className="space-y-1">
              {/* System Overview */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/system-overview"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Home className="h-4 w-4" />
                    <span>{isArabic ? 'نظرة عامة على النظام' : 'System Overview'}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>{isArabic ? 'لوحة التحكم' : 'Dashboard'}</span>
                    <Badge variant="outline" className="ml-auto text-xs">1</Badge>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* AqlHR Executive Intelligence Center */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/executive-center"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span className="truncate">{isArabic ? 'مركز الذكاء التنفيذي عقل HR' : 'AqlHR Executive Intelligence Center'}</span>
                    <Badge className="ml-auto text-xs bg-yellow-600 text-white">PREMIUM</Badge>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Core HR */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/core-hr"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Users className="h-4 w-4 text-emerald-500" />
                    <span className="truncate">{isArabic ? 'الموارد البشرية الأساسية' : 'Core HR'}</span>
                    <Badge variant="outline" className="ml-auto text-xs">13</Badge>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Skills Intelligence */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/skills-intelligence"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Star className="h-4 w-4 text-amber-500" />
                    <span className="truncate">{isArabic ? 'ذكاء المهارات' : 'Skills Intelligence'}</span>
                    <Badge className="ml-auto text-xs bg-amber-600 text-white">NEW</Badge>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Learning Experience Optimization */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/leo"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <GraduationCap className="h-4 w-4 text-blue-500" />
                    <span className="truncate">{isArabic ? 'تحسين تجربة التعلم' : 'Learning Experience Optimization'}</span>
                    <Badge className="ml-auto text-xs bg-blue-600 text-white">LEO</Badge>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Generative Engagement Optimization */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <LinkL
                    to="/geo"
                    className={
                      location.pathname.includes('/geo')
                        ? 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 bg-primary/20 text-primary border border-primary/30'
                        : 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }
                  >
                    <Sparkles className="h-4 w-4 text-pink-500" />
                    <span className="truncate">{isArabic ? 'تحسين المشاركة التوليدية' : 'Generative Engagement Optimization'}</span>
                    <Badge className="ml-auto text-xs bg-pink-600 text-white">GEO</Badge>
                  </LinkL>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* AI & Analytics */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/analytics"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span className="truncate">{isArabic ? 'الذكاء الاصطناعي والتحليلات' : 'AI & Analytics'}</span>
                    <Badge variant="outline" className="ml-auto text-xs">18</Badge>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* AI Automation Engine */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/ai-automation"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Zap className="h-4 w-4 text-violet-500" />
                    <span className="truncate">{isArabic ? 'محرك الأتمتة الذكي' : 'AI Automation Engine'}</span>
                    <Badge variant="outline" className="ml-auto text-xs">6</Badge>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Government Integrations */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/government"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Building2 className="h-4 w-4 text-green-500" />
                    <span className="truncate">{isArabic ? 'التكاملات الحكومية' : 'Government Integrations'}</span>
                    <Badge variant="outline" className="ml-auto text-xs">21</Badge>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Employee-Welfare Consultancy */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/welfare-consultancy"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Heart className="h-4 w-4 text-rose-500" />
                    <span className="truncate">{isArabic ? 'الاستشارات المستقلة لرفاهية الموظفين' : 'Employee-Welfare Consultancy'}</span>
                    <Badge className="ml-auto text-xs bg-rose-600 text-white">FLAGSHIP</Badge>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Legal Consultant AI */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/legal-consultant"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Scale className="h-4 w-4 text-indigo-500" />
                    <span className="truncate">{isArabic ? 'المستشار القانوني الذكي' : 'Legal Consultant AI'}</span>
                    <Badge className="ml-auto text-xs bg-indigo-600 text-white">NEW</Badge>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Compliance & Governance */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/compliance"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="truncate">{isArabic ? 'الامتثال والحوكمة' : 'Compliance & Governance'}</span>
                    <Badge className="ml-auto text-xs bg-blue-600 text-white">NEW</Badge>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Core Operations */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground bg-surface-subtle">
            {isArabic ? 'العمليات الأساسية' : 'Core Operations'}
          </SidebarGroupLabel>
          <SidebarGroupContent className="p-2">
            <SidebarMenu className="space-y-1">
              {/* Performance Management */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/performance"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Award className="h-4 w-4 text-orange-500" />
                    <span className="truncate">{isArabic ? 'إدارة الأداء' : 'Performance Management'}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Recruitment */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/recruitment"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Briefcase className="h-4 w-4 text-cyan-500" />
                    <span className="truncate">{isArabic ? 'التوظيف والتعيين' : 'Recruitment & Hiring'}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Time & Attendance */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/attendance"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Activity className="h-4 w-4 text-teal-500" />
                    <span className="truncate">{isArabic ? 'الوقت والحضور' : 'Time & Attendance'}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Leave Management */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/leave"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <FileText className="h-4 w-4 text-lime-500" />
                    <span className="truncate">{isArabic ? 'إدارة الإجازات' : 'Leave Management'}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Payroll */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/payroll"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Building2 className="h-4 w-4 text-emerald-500" />
                    <span className="truncate">{isArabic ? 'إدارة الرواتب' : 'Payroll Management'}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools & Support */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground bg-surface-subtle">
            {isArabic ? 'الأدوات والدعم' : 'Tools & Support'}
          </SidebarGroupLabel>
          <SidebarGroupContent className="p-2">
            <SidebarMenu className="space-y-1">
              {/* Tools */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/tools"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{isArabic ? 'الأدوات والمساعدات' : 'Tools & Utilities'}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Help & Support */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/help"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Users className="h-4 w-4 text-indigo-500" />
                    <span className="truncate">{isArabic ? 'المساعدة والدعم' : 'Help & Support'}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}