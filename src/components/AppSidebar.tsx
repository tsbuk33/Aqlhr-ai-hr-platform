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
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

// Platform modules based on SanadHR structure
const getPlatformModules = (t: (key: string) => string) => [
  { 
    titleKey: "nav.dashboard",
    title: t("nav.dashboard"), 
    url: "/", 
    icon: BookOpen,
    badge: "1"
  },
  { 
    titleKey: "nav.core_hr",
    title: t("nav.core_hr"), 
    url: "/core-hr", 
    icon: Users,
    badge: "12",
    subItems: [
      { titleKey: "nav.employee_master_data", title: t("nav.employee_master_data"), url: "/core-hr/master-data" },
      { titleKey: "nav.payroll_processing", title: t("nav.payroll_processing"), url: "/payroll" },
      { titleKey: "nav.benefits_administration", title: t("nav.benefits_administration"), url: "/core-hr/benefits" },
      { titleKey: "nav.performance_management", title: t("nav.performance_management"), url: "/core-hr/performance" },
      { titleKey: "nav.recruitment_hiring", title: t("nav.recruitment_hiring"), url: "/core-hr/recruitment" },
      { titleKey: "nav.training_development", title: t("nav.training_development"), url: "/core-hr/training" },
      { titleKey: "nav.time_attendance", title: t("nav.time_attendance"), url: "/core-hr/time-attendance" },
      { titleKey: "nav.leave_management", title: t("nav.leave_management"), url: "/core-hr/leave" },
      { titleKey: "nav.succession_planning", title: t("nav.succession_planning"), url: "/core-hr/succession-planning" },
      { titleKey: "nav.compensation_management", title: t("nav.compensation_management"), url: "/core-hr/compensation-management" },
      { titleKey: "nav.employee_self_service", title: t("nav.employee_self_service"), url: "/core-hr/self-service" },
      { titleKey: "nav.manager_dashboard", title: t("nav.manager_dashboard"), url: "/core-hr/organization" },
    ]
  },
  { 
    titleKey: "nav.ai_automation",
    title: t("nav.ai_automation"), 
    url: "/ai-automation", 
    icon: Check,
    badge: "6",
    subItems: [
      { titleKey: "nav.ai_sync_engine", title: t("nav.ai_sync_engine"), url: "/ai-automation/sync-engine" },
      { titleKey: "nav.smart_recommendations", title: t("nav.smart_recommendations"), url: "/ai-automation/smart-recommendations" },
      { titleKey: "nav.predictive_analytics", title: t("nav.predictive_analytics"), url: "/ai-automation/predictive-analytics" },
      { titleKey: "nav.document_intelligence", title: t("nav.document_intelligence"), url: "/ai-automation/document-intelligence" },
      { titleKey: "nav.arabic_english_nlp", title: t("nav.arabic_english_nlp"), url: "/ai-automation/arabic-english-nlp" },
      { titleKey: "nav.automated_workflows", title: t("nav.automated_workflows"), url: "/ai-automation/automated-workflow" },
    ]
  },
  { 
    titleKey: "nav.government",
    title: t("nav.government"), 
    url: "/government", 
    icon: FileText,
    badge: "22",
    subItems: [
      { titleKey: "nav.qiwa_integration", title: t("nav.qiwa_integration"), url: "/government/qiwa" },
      { titleKey: "nav.gosi_integration", title: t("nav.gosi_integration"), url: "/government/gosi" },
      { titleKey: "nav.mudad_platform", title: t("nav.mudad_platform"), url: "/government/mudad" },
      { titleKey: "nav.elm_platform", title: t("nav.elm_platform"), url: "/government/elm" },
      { titleKey: "nav.absher_platform", title: t("nav.absher_platform"), url: "/government/absher" },
      { titleKey: "nav.muqeem_platform", title: t("nav.muqeem_platform"), url: "/government/muqeem" },
      { titleKey: "nav.seha_platform", title: t("nav.seha_platform"), url: "/government/seha" },
      { titleKey: "nav.chi_platform", title: t("nav.chi_platform"), url: "/government/chi" },
      { titleKey: "nav.hrsd_integration", title: t("nav.hrsd_integration"), url: "/government/mol" },
      { titleKey: "nav.tvtc_doroob", title: t("nav.tvtc_doroob"), url: "/government/tvtc" },
      { titleKey: "nav.zatca_integration", title: t("nav.zatca_integration"), url: "/government/zatca" },
      { titleKey: "nav.qiyas_assessment", title: t("nav.qiyas_assessment"), url: "/government/qiyas" },
      { titleKey: "nav.ncaaa_accreditation", title: t("nav.ncaaa_accreditation"), url: "/government/ncaaa" },
      { titleKey: "nav.education_ministry", title: t("nav.education_ministry"), url: "/government/education" },
      { titleKey: "nav.taqat_hrdf", title: t("nav.taqat_hrdf"), url: "/government/taqat" },
      { titleKey: "nav.ncei_employment", title: t("nav.ncei_employment"), url: "/government/ncei" },
      { titleKey: "nav.interior_ministry", title: t("nav.interior_ministry"), url: "/government/interior" },
      { titleKey: "nav.esnad_notarization", title: t("nav.esnad_notarization"), url: "/government/esnad" },
      { titleKey: "nav.saudi_post", title: t("nav.saudi_post"), url: "/government/saudi-post" },
      { titleKey: "nav.tawakkalna_compliance", title: t("nav.tawakkalna_compliance"), url: "/government/tawakkalna" },
      { titleKey: "nav.umm_al_qura_calendar", title: t("nav.umm_al_qura_calendar"), url: "/government/umm-al-qura" },
      { titleKey: "nav.saudi_engineering_body", title: t("nav.saudi_engineering_body"), url: "/government/saudi-engineering" },
    ]
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { t } = useLanguage();
  const location = useLocation();
  const currentPath = location.pathname;
  const [expandedGroups, setExpandedGroups] = useState<string[]>([t("nav.core_hr")]);

  const platformModules = getPlatformModules(t);

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
                <p className="text-xs text-sidebar-foreground/70">{t('sidebar.complete_hr_platform')}</p>
              </div>
            )}
          </div>
          {state !== "collapsed" && (
            <div className="mt-4 flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-status-success rounded-full"></div>
              <span className="text-sidebar-foreground/70">{t('sidebar.all_systems_operational')}</span>
            </div>
          )}
        </div>

        {/* Platform Modules */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
            {t('sidebar.platform_modules')}
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
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          {state !== "collapsed" && (
                            <>
                              <span className="truncate flex-1">{item.title}</span>
                              <span className="text-xs bg-sidebar-accent text-sidebar-accent-foreground px-1.5 py-0.5 rounded flex-shrink-0">
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
              <LanguageToggle />
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}