import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LinkL } from '@/lib/i18n/LinkL';
import { 
  BarChart3, Users, Crown, Brain, Building2, Shield, Settings, 
  ChevronDown, Home, Zap, Scale, Heart, Star, GraduationCap,
  Sparkles, FileText, Globe, Award, Briefcase, Activity, 
  Clock, Calculator, TrendingUp, UserPlus, Calendar, 
  Network, Layers, Target, BookOpen, LifeBuoy, Wrench,
  Database, PieChart, TreePine, GitBranch, MessageSquare,
  Bell, FileSpreadsheet, DollarSign, CheckCircle, AlertTriangle,
  MapPin, Plane, CreditCard, Smartphone, UserCheck, BookCheck,
  Search, Eye, Gauge, Filter, Presentation, LineChart,
  Bot, Workflow, Cog, MonitorSpeaker, Radio, Headphones,
  Mic, Timer, Phone, Mail, Map, Route, Compass, Navigation
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
  
  // State for collapsible groups
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    platform: true,
    coreOperations: true,
    payroll: false,
    government: false,
    aiAnalytics: false,
    aiEcosystem: false,
    consulting: false,
    compliance: false,
    welfare: false,
    localization: false,
    tools: false,
    learning: false,
    executive: false,
    culture: false,
    mobile: false,
    reports: false
  });
  
  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

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
        {/* Platform Core Modules */}
        <Collapsible open={openGroups.platform} onOpenChange={() => toggleGroup('platform')}>
          <SidebarGroup className="p-0">
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground bg-surface-subtle hover:bg-surface-hover cursor-pointer flex items-center justify-between">
                {isArabic ? 'وحدات المنصة الأساسية' : 'Platform Core Modules'}
                <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.platform ? 'rotate-180' : ''}`} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="p-2">
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/system-overview" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Home className="h-4 w-4" />
                        <span>{isArabic ? 'نظرة عامة على النظام' : 'System Overview'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <BarChart3 className="h-4 w-4" />
                        <span>{isArabic ? 'لوحة التحكم' : 'Dashboard'}</span>
                        <Badge variant="outline" className="ml-auto text-xs">1</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/executive-center" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <span className="truncate">{isArabic ? 'مركز الذكاء التنفيذي' : 'Executive Intelligence Center'}</span>
                        <Badge className="ml-auto text-xs bg-yellow-600 text-white">PREMIUM</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Core HR Operations */}
        <Collapsible open={openGroups.coreOperations} onOpenChange={() => toggleGroup('coreOperations')}>
          <SidebarGroup className="p-0">
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground bg-surface-subtle hover:bg-surface-hover cursor-pointer flex items-center justify-between">
                {isArabic ? 'عمليات الموارد البشرية الأساسية' : 'Core HR Operations'}
                <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.coreOperations ? 'rotate-180' : ''}`} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="p-2">
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/core-hr" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Users className="h-4 w-4 text-emerald-500" />
                        <span>{isArabic ? 'الموارد البشرية الأساسية' : 'Core HR'}</span>
                        <Badge variant="outline" className="ml-auto text-xs">13</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/employees" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Users className="h-4 w-4 text-blue-500" />
                        <span>{isArabic ? 'إدارة الموظفين' : 'Employees Management'}</span>
                        <Badge variant="outline" className="ml-auto text-xs">2,847</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/recruitment" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <UserPlus className="h-4 w-4 text-green-500" />
                        <span>{isArabic ? 'التوظيف والاستقطاب' : 'Recruitment & Hiring'}</span>
                        <Badge className="ml-auto text-xs bg-green-600 text-white">ACTIVE</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/performance" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Target className="h-4 w-4 text-orange-500" />
                        <span>{isArabic ? 'إدارة الأداء' : 'Performance Management'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/attendance" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Clock className="h-4 w-4 text-purple-500" />
                        <span>{isArabic ? 'الحضور والانصراف' : 'Attendance & Time'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/leave" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Calendar className="h-4 w-4 text-pink-500" />
                        <span>{isArabic ? 'إدارة الإجازات' : 'Leave Management'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/retention" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span>{isArabic ? 'تحليلات الاحتفاظ' : 'Retention Analytics'}</span>
                        <Badge className="ml-auto text-xs bg-green-600 text-white">LIVE</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Payroll & Financial */}
        <Collapsible open={openGroups.payroll} onOpenChange={() => toggleGroup('payroll')}>
          <SidebarGroup className="p-0">
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground bg-surface-subtle hover:bg-surface-hover cursor-pointer flex items-center justify-between">
                {isArabic ? 'الرواتب والمالية' : 'Payroll & Financial'}
                <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.payroll ? 'rotate-180' : ''}`} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="p-2">
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/payroll" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Calculator className="h-4 w-4 text-green-500" />
                        <span>{isArabic ? 'الرواتب' : 'Payroll'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/benefits" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Heart className="h-4 w-4 text-rose-500" />
                        <span>{isArabic ? 'المزايا والتعويضات' : 'Benefits & Compensation'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/expense-management" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <CreditCard className="h-4 w-4 text-blue-500" />
                        <span>{isArabic ? 'إدارة المصروفات' : 'Expense Management'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/financial-planning" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span>{isArabic ? 'التخطيط المالي' : 'Financial Planning'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Government Integrations */}
        <Collapsible open={openGroups.government} onOpenChange={() => toggleGroup('government')}>
          <SidebarGroup className="p-0">
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground bg-surface-subtle hover:bg-surface-hover cursor-pointer flex items-center justify-between">
                {isArabic ? 'التكاملات الحكومية' : 'Government Integrations'}
                <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.government ? 'rotate-180' : ''}`} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="p-2">
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/government" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Building2 className="h-4 w-4 text-green-500" />
                        <span>{isArabic ? 'نظرة عامة حكومية' : 'Government Overview'}</span>
                        <Badge variant="outline" className="ml-auto text-xs">21</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/gosi-integration" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span>{isArabic ? 'تكامل الجوسي' : 'GOSI Integration'}</span>
                        <Badge className="ml-auto text-xs bg-blue-600 text-white">LIVE</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/mol-integration" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Briefcase className="h-4 w-4 text-purple-500" />
                        <span>{isArabic ? 'تكامل وزارة العمل' : 'MOL Integration'}</span>
                        <Badge className="ml-auto text-xs bg-purple-600 text-white">ACTIVE</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/nitaqat-management" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{isArabic ? 'إدارة نطاقات' : 'Nitaqat Management'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/visa-management" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Plane className="h-4 w-4 text-orange-500" />
                        <span>{isArabic ? 'إدارة التأشيرات' : 'Visa Management'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/wps-integration" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <FileSpreadsheet className="h-4 w-4 text-indigo-500" />
                        <span>{isArabic ? 'نظام حماية الأجور' : 'WPS Integration'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* AI & Analytics Suite */}
        <Collapsible open={openGroups.aiAnalytics} onOpenChange={() => toggleGroup('aiAnalytics')}>
          <SidebarGroup className="p-0">
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground bg-surface-subtle hover:bg-surface-hover cursor-pointer flex items-center justify-between">
                {isArabic ? 'مجموعة الذكاء الاصطناعي والتحليلات' : 'AI & Analytics Suite'}
                <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.aiAnalytics ? 'rotate-180' : ''}`} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="p-2">
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/analytics" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Brain className="h-4 w-4 text-purple-500" />
                        <span>{isArabic ? 'الذكاء الاصطناعي والتحليلات' : 'AI & Analytics'}</span>
                        <Badge variant="outline" className="ml-auto text-xs">18</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/ai-automation" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Zap className="h-4 w-4 text-violet-500" />
                        <span>{isArabic ? 'محرك الأتمتة الذكي' : 'AI Automation Engine'}</span>
                        <Badge variant="outline" className="ml-auto text-xs">6</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/skills-intelligence" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Star className="h-4 w-4 text-amber-500" />
                        <span>{isArabic ? 'ذكاء المهارات' : 'Skills Intelligence'}</span>
                        <Badge className="ml-auto text-xs bg-amber-600 text-white">NEW</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/predictive-analytics" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span>{isArabic ? 'التحليلات التنبؤية' : 'Predictive Analytics'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/workforce-intelligence" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Brain className="h-4 w-4 text-blue-500" />
                        <span>{isArabic ? 'ذكاء القوى العاملة' : 'Workforce Intelligence'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Advanced AI Ecosystem */}
        <Collapsible open={openGroups.aiEcosystem} onOpenChange={() => toggleGroup('aiEcosystem')}>
          <SidebarGroup className="p-0">
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground bg-surface-subtle hover:bg-surface-hover cursor-pointer flex items-center justify-between">
                {isArabic ? 'النظام البيئي المتقدم للذكاء الاصطناعي' : 'Advanced AI Ecosystem'}
                <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.aiEcosystem ? 'rotate-180' : ''}`} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="p-2">
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/ai-ecosystem" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Bot className="h-4 w-4 text-cyan-500" />
                        <span>{isArabic ? 'النظام البيئي للذكاء الاصطناعي' : 'AI Ecosystem Hub'}</span>
                        <Badge className="ml-auto text-xs bg-cyan-600 text-white">ADMIN</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/autonomous-operations" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Workflow className="h-4 w-4 text-purple-500" />
                        <span>{isArabic ? 'العمليات المستقلة' : 'Autonomous Operations'}</span>
                        <Badge className="ml-auto text-xs bg-purple-600 text-white">BETA</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/intelligent-automation" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Cog className="h-4 w-4 text-indigo-500" />
                        <span>{isArabic ? 'الأتمتة الذكية' : 'Intelligent Automation'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Learning & Engagement */}
        <Collapsible open={openGroups.learning} onOpenChange={() => toggleGroup('learning')}>
          <SidebarGroup className="p-0">
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground bg-surface-subtle hover:bg-surface-hover cursor-pointer flex items-center justify-between">
                {isArabic ? 'التعلم والمشاركة' : 'Learning & Engagement'}
                <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.learning ? 'rotate-180' : ''}`} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="p-2">
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/leo" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <GraduationCap className="h-4 w-4 text-blue-500" />
                        <span>{isArabic ? 'تحسين تجربة التعلم' : 'Learning Experience Optimization'}</span>
                        <Badge className="ml-auto text-xs bg-blue-600 text-white">LEO</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <LinkL to="/geo" className={location.pathname.includes('/geo') ? 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 bg-primary/20 text-primary border border-primary/30' : 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent/50'}>
                        <Sparkles className="h-4 w-4 text-pink-500" />
                        <span>{isArabic ? 'تحسين المشاركة التوليدية' : 'Generative Engagement Optimization'}</span>
                        <Badge className="ml-auto text-xs bg-pink-600 text-white">GEO</Badge>
                      </LinkL>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/training-development" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <BookCheck className="h-4 w-4 text-emerald-500" />
                        <span>{isArabic ? 'التدريب والتطوير' : 'Training & Development'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Consulting Services */}
        <Collapsible open={openGroups.consulting} onOpenChange={() => toggleGroup('consulting')}>
          <SidebarGroup className="p-0">
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground bg-surface-subtle hover:bg-surface-hover cursor-pointer flex items-center justify-between">
                {isArabic ? 'الخدمات الاستشارية' : 'Consulting Services'}
                <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.consulting ? 'rotate-180' : ''}`} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="p-2">
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/consulting" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Briefcase className="h-4 w-4 text-blue-500" />
                        <span>{isArabic ? 'نظرة عامة على الاستشارات' : 'Consulting Overview'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/strategic-consulting" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Target className="h-4 w-4 text-purple-500" />
                        <span>{isArabic ? 'الاستشارات الاستراتيجية' : 'Strategic Consulting'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/change-management" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Workflow className="h-4 w-4 text-orange-500" />
                        <span>{isArabic ? 'إدارة التغيير' : 'Change Management'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Compliance & Governance */}
        <Collapsible open={openGroups.compliance} onOpenChange={() => toggleGroup('compliance')}>
          <SidebarGroup className="p-0">
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground bg-surface-subtle hover:bg-surface-hover cursor-pointer flex items-center justify-between">
                {isArabic ? 'الامتثال والحوكمة' : 'Compliance & Governance'}
                <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.compliance ? 'rotate-180' : ''}`} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="p-2">
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/compliance" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span>{isArabic ? 'نظرة عامة على الامتثال' : 'Compliance Overview'}</span>
                        <Badge className="ml-auto text-xs bg-blue-600 text-white">NEW</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/legal-consultant" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Scale className="h-4 w-4 text-indigo-500" />
                        <span>{isArabic ? 'المستشار القانوني الذكي' : 'Legal Consultant AI'}</span>
                        <Badge className="ml-auto text-xs bg-indigo-600 text-white">NEW</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/policy-management" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <FileText className="h-4 w-4 text-green-500" />
                        <span>{isArabic ? 'إدارة السياسات' : 'Policy Management'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/audit-management" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Eye className="h-4 w-4 text-purple-500" />
                        <span>{isArabic ? 'إدارة التدقيق' : 'Audit Management'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Employee Welfare */}
        <Collapsible open={openGroups.welfare} onOpenChange={() => toggleGroup('welfare')}>
          <SidebarGroup className="p-0">
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground bg-surface-subtle hover:bg-surface-hover cursor-pointer flex items-center justify-between">
                {isArabic ? 'رفاهية الموظفين' : 'Employee Welfare'}
                <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.welfare ? 'rotate-180' : ''}`} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="p-2">
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/welfare-consultancy" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Heart className="h-4 w-4 text-rose-500" />
                        <span>{isArabic ? 'الاستشارات المستقلة لرفاهية الموظفين' : 'Employee-Welfare Consultancy'}</span>
                        <Badge className="ml-auto text-xs bg-rose-600 text-white">FLAGSHIP</Badge>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/safety-management" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span>{isArabic ? 'إدارة السلامة' : 'Safety Management'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/wellness-programs" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Heart className="h-4 w-4 text-pink-500" />
                        <span>{isArabic ? 'برامج العافية' : 'Wellness Programs'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Tools & Utilities */}
        <Collapsible open={openGroups.tools} onOpenChange={() => toggleGroup('tools')}>
          <SidebarGroup className="p-0">
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground bg-surface-subtle hover:bg-surface-hover cursor-pointer flex items-center justify-between">
                {isArabic ? 'الأدوات والمرافق' : 'Tools & Utilities'}
                <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.tools ? 'rotate-180' : ''}`} />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent className="p-2">
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/tools" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <Wrench className="h-4 w-4 text-gray-500" />
                        <span>{isArabic ? 'نظرة عامة على الأدوات' : 'Tools Overview'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/document-generator" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span>{isArabic ? 'مولد المستندات' : 'Document Generator'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/communication-center" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <MessageSquare className="h-4 w-4 text-green-500" />
                        <span>{isArabic ? 'مركز الاتصالات' : 'Communication Center'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/help" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}>
                        <LifeBuoy className="h-4 w-4 text-blue-500" />
                        <span>{isArabic ? 'المساعدة والدعم' : 'Help & Support'}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

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
                    <Calculator className="h-4 w-4 text-emerald-500" />
                    <span className="truncate">{isArabic ? 'إدارة الرواتب' : 'Payroll Management'}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* OSI & Strategic Analysis */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground bg-surface-subtle">
            {isArabic ? 'مؤشر البنية التنظيمية والتحليل الاستراتيجي' : 'OSI & Strategic Analysis'}
          </SidebarGroupLabel>
          <SidebarGroupContent className="p-2">
            <SidebarMenu className="space-y-1">
              {/* OSI Overview */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/osi/overview"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Database className="h-4 w-4 text-blue-500" />
                    <span className="truncate">{isArabic ? 'نظرة عامة على مؤشر البنية التنظيمية' : 'OSI Overview'}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* OSI Spans & Layers */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/osi/spans-layers"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Layers className="h-4 w-4 text-purple-500" />
                    <span className="truncate">{isArabic ? 'النطاقات والطبقات' : 'Spans & Layers'}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* OSI Cost Management */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/osi/cost-manage"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <PieChart className="h-4 w-4 text-orange-500" />
                    <span className="truncate">{isArabic ? 'إدارة التكلفة' : 'Cost Management'}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* OSI Saudization Layer */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/osi/saudization-layer"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <Target className="h-4 w-4 text-green-500" />
                    <span className="truncate">{isArabic ? 'طبقة السعودة' : 'Saudization Layer'}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* OSI Export */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/osi/export"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <FileText className="h-4 w-4 text-teal-500" />
                    <span className="truncate">{isArabic ? 'تصدير البيانات' : 'Export Data'}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* OSI Playbook */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/osi/playbook"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`
                    }
                  >
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                    <span className="truncate">{isArabic ? 'دليل الاستراتيجيات' : 'Strategic Playbook'}</span>
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
                    <LifeBuoy className="h-4 w-4 text-indigo-500" />
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