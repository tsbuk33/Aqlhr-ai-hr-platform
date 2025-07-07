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
      { title: "Employee Master Data", url: "/core-hr/master-data" },
      { title: "Payroll Processing", url: "/payroll" },
      { title: "Benefits Administration", url: "/core-hr/benefits" },
      { title: "Performance Management", url: "/core-hr/performance" },
      { title: "Recruitment & Hiring", url: "/core-hr/recruitment" },
      { title: "Training & Development", url: "/core-hr/training" },
      { title: "Time & Attendance", url: "/core-hr/time-attendance" },
      { title: "Leave Management", url: "/core-hr/leave" },
      { title: "Succession Planning", url: "/core-hr/succession-planning" },
      { title: "Compensation Management", url: "/core-hr/compensation-management" },
      { title: "Employee Self-Service", url: "/core-hr/self-service" },
      { title: "Manager Dashboard", url: "/core-hr/organization" },
    ]
  },
  { 
    title: "AI & Automation", 
    url: "/ai-automation", 
    icon: Check,
    badge: "6",
    subItems: [
      { title: "AI Sync Engine", url: "/ai-automation/sync-engine" },
      { title: "Smart Recommendations", url: "/ai-automation/smart-recommendations" },
      { title: "Predictive Analytics", url: "/ai-automation/predictive-analytics" },
      { title: "Document Intelligence", url: "/ai-automation/document-intelligence" },
      { title: "Arabic-English NLP", url: "/ai-automation/arabic-english-nlp" },
      { title: "Automated Workflows", url: "/ai-automation/automated-workflow" },
    ]
  },
  { 
    title: "Government Integrations", 
    url: "/government", 
    icon: FileText,
    badge: "8",
    subItems: [
      { title: "Qiwa Integration", url: "/government/qiwa" },
      { title: "GOSI Integration", url: "/government/gosi" },
      { title: "Mudad Platform", url: "/government/mudad" },
      { title: "Muqeem/ELM Platform", url: "/government/elm" },
      { title: "Absher Platform", url: "/government/absher" },
      { title: "HRSD Integration", url: "/government/mol" },
      { title: "TVTC/Doroob", url: "/government/tvtc" },
      { title: "Health Insurance", url: "/government/zatca" },
    ]
  },
  { 
    title: "Employee Welfare & Safety", 
    url: "/welfare-safety", 
    icon: ArrowUp,
    badge: "8",
    subItems: [
      { title: "Welfare Compliance Dashboard", url: "/welfare-safety/compliance-dashboard" },
      { title: "Grievance & Harassment Reporting", url: "/welfare-safety/grievance-reporting" },
      { title: "Food, Housing & Transport", url: "/welfare-safety/food-housing-transport" },
      { title: "Wellbeing Tracker", url: "/welfare-safety/wellbeing-tracker" },
      { title: "Ethics Score", url: "/welfare-safety/ethics-score" },
      { title: "AI Diagnosis & Recommendations", url: "/welfare-safety/ai-diagnosis" },
      { title: "Compliance Framework", url: "/welfare-safety/compliance-framework" },
      { title: "Multi-View Dashboards", url: "/welfare-safety/multi-view-dashboards" },
    ]
  },
  { 
    title: "Diagnostic Frameworks", 
    url: "/diagnostic", 
    icon: ArrowDown,
    badge: "7",
    subItems: [
      { title: "Retention Strategy Assessment", url: "/diagnostic/retention-strategy" },
      { title: "HR Process Improvement", url: "/diagnostic/hr-process-improvement" },
      { title: "HR Role Optimization", url: "/diagnostic/hr-role-optimization" },
      { title: "HR Value Chain Analysis", url: "/diagnostic/hr-value-chain" },
      { title: "Org Structure Assessment", url: "/diagnostic/org-structure" },
      { title: "Culture Change Tracker", url: "/diagnostic/culture-change" },
      { title: "IPO Readiness Diagnostic", url: "/diagnostic/ipo-readiness" },
    ]
  },
  { 
    title: "Local Content Compliance", 
    url: "/local-content", 
    icon: Clock,
    badge: "6",
    subItems: [
      { title: "Workforce Localization Tracker", url: "/local-content/workforce-localization" },
      { title: "Supplier Development Monitor", url: "/local-content/supplier-development" },
      { title: "Investment Tracking System", url: "/local-content/investment-tracking" },
      { title: "AI Local Content Intelligence", url: "/local-content/ai-intelligence" },
      { title: "Regulatory Compliance Monitor", url: "/local-content/regulatory-compliance" },
      { title: "Localization Strategic Planning", url: "/local-content/strategic-planning" },
    ]
  },
  { 
    title: "Payroll & Financial", 
    url: "/payroll", 
    icon: Calendar,
    badge: "8",
    subItems: [
      { title: "WPS Processing", url: "/payroll/wps" },
      { title: "GOSI Integration", url: "/payroll/gosi" },
      { title: "EOSB Calculations", url: "/payroll/eosb" },
      { title: "Tax Compliance", url: "/payroll/tax" },
      { title: "Expense Management", url: "/payroll/expenses" },
      { title: "Payroll Analytics", url: "/payroll/analytics" },
      { title: "Bank Integration", url: "/payroll/banking" },
      { title: "Budget Forecasting", url: "/payroll/budgeting" },
    ]
  },
  { 
    title: "Strategic HR", 
    url: "/strategic", 
    icon: ArrowUp,
    badge: "10",
    subItems: [
      { title: "Workforce Planning", url: "/strategic/workforce-planning" },
      { title: "Succession Planning", url: "/strategic/succession" },
      { title: "Talent Acquisition", url: "/strategic/talent-acquisition" },
      { title: "Organizational Development", url: "/strategic/org-development" },
      { title: "Performance Strategy", url: "/strategic/performance" },
      { title: "Compensation Strategy", url: "/strategic/compensation" },
      { title: "Diversity & Inclusion", url: "/strategic/diversity" },
      { title: "Leadership Development", url: "/strategic/leadership" },
      { title: "Employee Experience", url: "/strategic/experience" },
      { title: "HR Transformation", url: "/strategic/transformation" },
    ]
  },
  { 
    title: "Premium Consulting", 
    url: "/consulting", 
    icon: Clock,
    badge: "12",
    subItems: [
      { title: "Executive Compensation", url: "/consulting/executive-compensation" },
      { title: "Organizational Restructuring", url: "/consulting/restructuring" },
      { title: "Culture Transformation", url: "/consulting/culture" },
      { title: "M&A Integration", url: "/consulting/merger" },
      { title: "Digital Transformation", url: "/consulting/digital" },
      { title: "Talent Strategy", url: "/consulting/talent" },
      { title: "Leadership Consulting", url: "/consulting/leadership" },
      { title: "Change Management", url: "/consulting/change" },
      { title: "HR Optimization", url: "/consulting/optimization" },
      { title: "Risk Assessment", url: "/consulting/risk" },
      { title: "Benchmarking Analysis", url: "/consulting/benchmarking" },
      { title: "Strategic Planning", url: "/consulting/planning" },
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
    title: "Advanced Analytics", 
    url: "/analytics", 
    icon: ArrowDown,
    badge: "11",
    subItems: [
      { title: "Workforce Analytics", url: "/analytics/workforce" },
      { title: "Predictive Modeling", url: "/analytics/predictive" },
      { title: "Realtime Dashboards", url: "/analytics/realtime" },
      { title: "Cost Analytics", url: "/analytics/cost" },
      { title: "Compliance Reporting", url: "/analytics/compliance" },
      { title: "Performance Analytics", url: "/analytics/performance" },
      { title: "Turnover Analysis", url: "/analytics/turnover" },
      { title: "Benchmarking Reports", url: "/analytics/benchmarking" },
      { title: "Custom Reporting", url: "/analytics/custom" },
      { title: "Data Visualization", url: "/analytics/visualization" },
      { title: "Executive Reporting", url: "/analytics/executive" },
    ]
  },
  { 
    title: "Platform Features", 
    url: "/platform", 
    icon: Check,
    badge: "4",
    subItems: [
      { title: "Language Toggle (AR/EN)", url: "/platform/language-toggle" },
      { title: "Mobile App", url: "/platform/mobile-app" },
      { title: "Security Framework", url: "/platform/security-framework" },
      { title: "API Gateway", url: "/platform/api-gateway" },
    ]
  },
  { 
    title: "Additional Tools", 
    url: "/tools", 
    icon: ArrowUp,
    badge: "2",
    subItems: [
      { title: "Smart KPI Tool", url: "/tools/smart-kpi" },
      { title: "SanadHR Connect", url: "/tools/sanadhr-connect" },
    ]
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