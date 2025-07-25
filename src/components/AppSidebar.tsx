import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Users, Calendar, FileText, Clock, BookOpen, Check, ArrowUp, ArrowDown,
  Settings, Shield, Scale, Award, HelpCircle, Heart, BarChart3, Briefcase,
  Building2, Zap, Brain, Globe, FileCheck, Wrench, GraduationCap, TrendingUp,
  Star, Sparkles, Activity, Crown
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { useSimpleLanguage } from "@/contexts/SimpleLanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import aqlHRLogo from "/lovable-uploads/3f780701-d943-45bd-a797-f1141c6093d3.png";

const getPlatformModules = (isArabic: boolean) => [
  // Core Essentials
  { title: isArabic ? "لوحة التحكم" : "Dashboard", url: "/", icon: BarChart3, badge: "1", color: "blue" },
  // Executive Intelligence Center
  { title: isArabic ? "مركز الذكاء التنفيذي عقل HR" : "AqlHR Executive Intelligence Center", url: "/executive-center", icon: Crown, badge: "PREMIUM", color: "gold" },
  // Core HR Management
  { 
    title: isArabic ? "الموارد البشرية الأساسية" : "Core HR", url: "/core-hr", icon: Users, badge: "13", color: "emerald",
    subItems: [
      { title: isArabic ? "بيانات الموظفين الرئيسية" : "Employee Master Data", url: "/core-hr/master-data" },
      { title: isArabic ? "التوظيف والتعيين" : "Recruitment & Hiring", url: "/core-hr/recruitment" },
      { title: isArabic ? "معالجة الرواتب" : "Payroll Processing", url: "/payroll" },
      { title: isArabic ? "إدارة المزايا" : "Benefits Administration", url: "/core-hr/benefits" },
      { title: isArabic ? "إدارة الأداء" : "Performance Management", url: "/core-hr/performance" },
      { title: isArabic ? "التدريب والتطوير" : "Training & Development", url: "/core-hr/training" },
      { title: isArabic ? "الوقت والحضور" : "Time & Attendance", url: "/core-hr/time-attendance" },
      { title: isArabic ? "إدارة الإجازات" : "Leave Management", url: "/core-hr/leave" },
      { title: isArabic ? "تخطيط التعاقب" : "Succession Planning", url: "/core-hr/succession-planning" },
      { title: isArabic ? "إدارة التعويضات" : "Compensation Management", url: "/core-hr/compensation-management" },
      { title: isArabic ? "حاسبة السعودة والتأشيرات" : "Saudization & Visa Calculator", url: "/core-hr/saudization" },
      { title: isArabic ? "الخدمة الذاتية للموظفين" : "Employee Self Service", url: "/core-hr/self-service" },
      { title: isArabic ? "لوحة تحكم المدير" : "Manager Dashboard", url: "/core-hr/organization" },
    ]
  },
  // Skills Intelligence
  { title: isArabic ? "ذكاء المهارات وتحليل الوظائف" : "Skills Intelligence", url: "/skills-intelligence", icon: Star, badge: "NEW", color: "amber" },
  // LEO
  { title: isArabic ? "تحسين تجربة التعلم" : "Learning Experience Optimization", url: "/leo", icon: GraduationCap, badge: "LEO", color: "blue" },
  // GEO
  { title: isArabic ? "تحسين المشاركة التوليدية" : "Generative Engagement Optimization", url: "/geo", icon: Sparkles, badge: "GEO", color: "pink" },
  // AI & Analytics
  { 
    title: isArabic ? "الذكاء الاصطناعي والتحليلات" : "AI & Analytics", url: "/analytics", icon: TrendingUp, badge: "18", color: "purple",
    subItems: [
      { title: isArabic ? "التحليلات التنفيذية" : "Executive Analytics", url: "/analytics" },
      { title: isArabic ? "تحليلات القوى العاملة" : "Workforce Analytics", url: "/analytics/workforce" },
      { title: isArabic ? "الصحة والسلامة والبيئة (HSE)" : "Health & Safety (HSE)", url: "/health-safety" },
      { title: isArabic ? "ميزات الذكاء الاصطناعي" : "AI Features", url: "/ai-features" },
      { title: isArabic ? "التوصيات الذكية" : "Smart KPI Tool", url: "/additional/smart-kpi" },
      { title: isArabic ? "التحليلات التنبؤية" : "Predictive Analytics", url: "/ai-automation/predictive-analytics" },
      { title: isArabic ? "ذكاء المستندات" : "Document Intelligence", url: "/ai-automation/document-intelligence" },
      { title: isArabic ? "سير العمل الآلي" : "Automation Workflows", url: "/automation-workflows" },
      { title: isArabic ? "الذكاء متعدد الوحدات" : "Cross-Module Intelligence", url: "/cross-module-intelligence" },
      { title: isArabic ? "مساعد الذكاء الاصطناعي المحمول" : "Mobile AI Assistant", url: "/mobile-ai-assistant" },
      { title: isArabic ? "التكامل الحكومي الذكي" : "Government AI Integration", url: "/government-ai-integration" },
      { title: isArabic ? "الذكاء التنفيذي" : "AI Executive Intelligence", url: "/ai-executive-intelligence" },
    ]
  },
  // AI Automation Engine
  { 
    title: isArabic ? "محرك الأتمتة الذكي" : "AI Automation Engine", url: "/ai-automation", icon: Brain, badge: "6", color: "violet",
    subItems: [
      { title: isArabic ? "محرك المزامنة الذكي" : "AI Sync Engine", url: "/ai-automation/sync-engine" },
      { title: isArabic ? "التوصيات الذكية" : "Smart Recommendations", url: "/ai-automation/smart-recommendations" },
      { title: isArabic ? "معالجة اللغة العربية/الإنجليزية" : "Arabic/English NLP", url: "/ai-automation/arabic-english-nlp" },
      { title: isArabic ? "سير العمل التلقائي" : "Automated Workflows", url: "/ai-automation/automated-workflow" },
      { title: isArabic ? "مساعد التوظيف" : "Onboarding Assistant", url: "/ai-automation/onboarding-assistant" },
      { title: isArabic ? "محرك التوافق" : "Compliance Predictor", url: "/ai-automation/compliance-predictor" },
    ]
  },
  // Government Integrations
  { 
    title: isArabic ? "التكاملات الحكومية" : "Government Integrations", url: "/government", icon: Building2, badge: "22", color: "green",
    subItems: [
      { title: isArabic ? "تكامل قوى" : "Qiwa Integration", url: "/government/qiwa" },
      { title: isArabic ? "تكامل التأمينات الاجتماعية" : "GOSI Integration", url: "/government/gosi" },
      { title: isArabic ? "منصة أبشر" : "Absher Platform", url: "/government/absher" },
      { title: isArabic ? "منصة علم" : "ELM Platform", url: "/government/elm" },
      { title: isArabic ? "منصة مقيم" : "Muqeem Platform", url: "/government/muqeem" },
      { title: isArabic ? "منصة صحة" : "Seha Platform", url: "/government/seha" },
      { title: isArabic ? "منصة شي" : "CHI Platform", url: "/government/chi" },
      { title: isArabic ? "مدد" : "Mudad Platform", url: "/government/mudad" },
      { title: isArabic ? "تكامل وزارة الموارد البشرية" : "HRSD Integration", url: "/government/mol" },
      { title: isArabic ? "دروب التقني" : "TVTC Doroob", url: "/government/tvtc" },
      { title: isArabic ? "تقييم قياس" : "Qiyas Assessment", url: "/government/qiyas" },
      { title: isArabic ? "اعتماد هيئة تقويم التعليم" : "NCAAA Accreditation", url: "/government/ncaaa" },
      { title: isArabic ? "وزارة التعليم" : "Education Ministry", url: "/government/education" },
      { title: isArabic ? "طاقات صندوق تنمية الموارد البشرية" : "Taqat HRDF", url: "/government/taqat" },
      { title: isArabic ? "المركز الوطني للتوظيف" : "NCEI Employment", url: "/government/ncei" },
      { title: isArabic ? "وزارة الداخلية" : "Interior Ministry", url: "/government/interior" },
      { title: isArabic ? "توثيق إسناد" : "ESNAD Notarization", url: "/government/esnad" },
      { title: isArabic ? "البريد السعودي" : "Saudi Post", url: "/government/saudi-post" },
      { title: isArabic ? "امتثال توكلنا" : "Tawakkalna Compliance", url: "/government/tawakkalna" },
      { title: isArabic ? "تقويم أم القرى" : "Umm Al-Qura Calendar", url: "/government/umm-al-qura" },
      { title: isArabic ? "المجلس السعودي للمهندسين" : "Saudi Council of Engineers", url: "/government/saudi-engineering" },
    ]
  },
  // Professional Services
  { title: isArabic ? "الاستشارات المستقلة لرفاهية الموظفين" : "Employee-Welfare Consultancy", url: "/welfare-consultancy", icon: Heart, badge: "FLAGSHIP", color: "rose" },
  // AI-Powered Specialized Modules
  { title: isArabic ? "المستشار القانوني الذكي" : "Legal Consultant AI", url: "/legal-consultant", icon: Scale, badge: "NEW", color: "indigo" },
  { title: isArabic ? "إدارة لجنة الترشيحات والمكافآت" : "NRC Management", url: "/nrc-management", icon: Award, badge: "AI", color: "amber" },
  { title: isArabic ? "إدارة ISO بالذكاء الاصطناعي" : "ISO Management AI", url: "/iso-management", icon: Shield, badge: "NEW", color: "cyan" },
  // Health, Safety & Environment
  { title: isArabic ? "الصحة والسلامة والبيئة" : "Health, Safety & Environment", url: "/health-safety", icon: Activity, badge: "HSE", color: "red" },
  // Compliance & Governance
  { 
    title: isArabic ? "الامتثال والحوكمة" : "Compliance & Governance", 
    url: "/compliance", 
    icon: Shield,
    badge: "NEW",
    color: "blue"
  },
  // Consulting Services
  { 
    title: isArabic ? "الخدمات الاستشارية" : "Consulting Services", url: "/consulting", icon: GraduationCap, badge: "NEW", color: "teal",
    subItems: [
      { title: isArabic ? "التقييم الاستراتيجي الذكي" : "AI Strategic Assessment", url: "/consulting/ai-assessment", badge: "NEW" },
      { title: isArabic ? "التخطيط الاستراتيجي" : "Strategic Planning", url: "/consulting/strategic-planning" },
      { title: isArabic ? "التحول الرقمي" : "Digital Transformation", url: "/consulting/digital-transformation" },
      { title: isArabic ? "إدارة التغيير" : "Change Management", url: "/consulting/change-management" },
      { title: isArabic ? "تحليل المعايير المرجعية" : "Benchmarking Analysis", url: "/consulting/benchmarking" },
      { title: isArabic ? "تحويل الثقافة" : "Culture Transformation", url: "/consulting/culture-transformation" },
      { title: isArabic ? "تطوير القيادة" : "Leadership Development", url: "/consulting/leadership" },
      { title: isArabic ? "تحسين الموارد البشرية" : "HR Optimization", url: "/consulting/hr-optimization" },
      { title: isArabic ? "إعادة الهيكلة التنظيمية" : "Organizational Restructuring", url: "/consulting/restructuring" },
      { title: isArabic ? "دمج عمليات الاندماج" : "Merger Integration", url: "/consulting/merger-integration" },
      { title: isArabic ? "استراتيجية المواهب" : "Talent Strategy", url: "/consulting/talent-strategy" },
      { title: isArabic ? "التعويضات التنفيذية" : "Executive Compensation", url: "/consulting/executive-compensation" },
      { title: isArabic ? "تقييم المخاطر" : "Risk Assessment", url: "/consulting/risk-assessment" }
    ]
  },
  // Strategic Planning
  { 
    title: isArabic ? "التخطيط الاستراتيجي" : "Strategic Planning", url: "/strategic", icon: Star, badge: "10", color: "orange",
    subItems: [
      { title: isArabic ? "استراتيجية التعويضات" : "Compensation Strategy", url: "/strategic/compensation" },
      { title: isArabic ? "تخطيط القوى العاملة" : "Workforce Planning", url: "/strategic/workforce-planning" },
      { title: isArabic ? "تخطيط التعاقب" : "Succession Planning", url: "/strategic/succession" },
      { title: isArabic ? "التنوع والشمول" : "Diversity & Inclusion", url: "/strategic/diversity" },
      { title: isArabic ? "استراتيجية الأداء" : "Performance Strategy", url: "/strategic/performance" },
      { title: isArabic ? "تجربة الموظف" : "Employee Experience", url: "/strategic/employee-experience" },
      { title: isArabic ? "تطوير القيادة" : "Leadership Development", url: "/strategic/leadership" },
      { title: isArabic ? "التحول الرقمي للموارد البشرية" : "HR Transformation", url: "/strategic/hr-transformation" },
      { title: isArabic ? "إدارة التغيير" : "Change Management", url: "/strategic/change-management" },
      { title: isArabic ? "استراتيجية الثقافة" : "Culture Strategy", url: "/strategic/culture" },
    ]
  },
  // Operations & Forms
  { title: isArabic ? "العمليات والنماذج" : "Processes & Forms", url: "/processes-forms", icon: FileCheck, badge: "AI", color: "slate" },
  // Tools & Integrations
  { title: isArabic ? "الأدوات والتكاملات" : "Tools & Integrations", url: "/tools", icon: Wrench, badge: "24", color: "gray" },
  // Interactive Help
  { title: isArabic ? "المساعدة التفاعلية" : "Interactive Help", url: "/help", icon: HelpCircle, badge: "40", color: "blue" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { isArabic } = useSimpleLanguage();
  const location = useLocation();
  const currentPath = location.pathname;
  const [expandedGroups, setExpandedGroups] = useState<string[]>([isArabic ? "الموارد البشرية الأساسية" : "Core HR"]);
  const platformModules = getPlatformModules(isArabic);
  
  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (url: string) => currentPath.startsWith(url) && url !== "/";
  
  const getNavClasses = (isActive: boolean, isGroup = false, color?: string) => {
    const baseClasses = "w-full justify-start transition-all duration-200 text-sm relative overflow-hidden";
    if (isActive) {
      return isGroup 
        ? `${baseClasses} bg-primary text-primary-foreground font-medium shadow-sm`
        : `${baseClasses} bg-primary text-primary-foreground font-medium shadow-sm`;
    }
    return `${baseClasses} text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-[1.02] hover:shadow-sm`;
  };
  
  const getBadgeClasses = (badge: string, color?: string) => {
    const baseClasses = "text-xs px-1 py-0.5 rounded font-medium flex-shrink-0 whitespace-nowrap";
    if (badge === "NEW") return `${baseClasses} bg-emerald-500/20 text-emerald-400 border border-emerald-500/30`;
    if (badge === "AI") return `${baseClasses} bg-purple-500/20 text-purple-400 border border-purple-500/30`;
    if (badge === "FLAGSHIP") return `${baseClasses} bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-400 border border-rose-500/30`;
    if (badge === "PREMIUM") return `${baseClasses} bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30`;
    if (badge === "HSE") return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
    return `${baseClasses} bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border`;
  };
  
  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => 
      prev.includes(title) 
        ? prev.filter(g => g !== title)
        : [...prev, title]
    );
  };

  return (
    <Sidebar className="border-r border-sidebar-border w-72">
      <SidebarContent className="bg-sidebar">
        <div className="p-6 border-b border-sidebar-border">
          <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <img src={aqlHRLogo} alt="AqlHR Logo" className={state !== "collapsed" ? "h-10 w-auto object-contain flex-shrink-0" : "w-8 h-8 object-contain flex-shrink-0"} />
            {state !== "collapsed" && (
              <div className={`min-w-0 flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
                <h1 className="text-sm font-bold text-sidebar-primary-foreground leading-tight">
                  {isArabic ? 'عقل HR' : 'AqlHR'}
                </h1>
                <p className="text-xs text-sidebar-foreground/70 leading-tight mt-1 truncate">
                  {isArabic ? 'منصة الموارد البشرية الذكية' : 'Smart HR Platform'}
                </p>
              </div>
            )}
          </div>
          {state !== "collapsed" && (
            <div className={`mt-3 flex items-center gap-2 text-xs ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className="w-2 h-2 bg-status-success rounded-full flex-shrink-0"></div>
              <span className="text-sidebar-foreground/70 truncate">
                {isArabic ? 'جميع الأنظمة تعمل' : 'All systems operational'}
              </span>
            </div>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
            {isArabic ? 'وحدات المنصة' : 'Platform Modules'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {platformModules.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild={!item.subItems}
                    className={getNavClasses(isActive(item.url) || isGroupActive(item.url), !!item.subItems, item.color)}
                    onClick={item.subItems ? () => toggleGroup(item.title) : undefined}
                  >
                    {item.subItems ? (
                      <div className="w-full flex items-center group">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="relative flex-shrink-0">
                            <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                            {item.badge && state !== "collapsed" && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            )}
                          </div>
                          {state !== "collapsed" && (
                            <span className="font-medium text-sm leading-tight break-words flex-1">{item.title}</span>
                          )}
                        </div>
                        {state !== "collapsed" && (
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <span className={getBadgeClasses(item.badge, item.color)}>
                              {item.badge}
                            </span>
                            <div className={`transition-all duration-200 ${expandedGroups.includes(item.title) ? 'rotate-180' : ''}`}>
                              <ArrowDown className="h-3 w-3" />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <NavLink to={item.url} className="w-full flex items-center group">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="relative flex-shrink-0">
                            <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                            {item.badge && state !== "collapsed" && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            )}
                          </div>
                          {state !== "collapsed" && (
                            <span className="font-medium text-sm leading-tight break-words flex-1">{item.title}</span>
                          )}
                        </div>
                        {state !== "collapsed" && (
                          <span className={`${getBadgeClasses(item.badge, item.color)} flex-shrink-0 ml-2`}>
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    )}
                  </SidebarMenuButton>
                  {item.subItems && expandedGroups.includes(item.title) && state !== "collapsed" && (
                    <div className="ml-6 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {item.subItems.map((subItem, index) => (
                        <SidebarMenuButton 
                          key={subItem.title} 
                          asChild 
                          size="sm"
                          style={{ animationDelay: `${index * 50}ms` }}
                          className="animate-in fade-in-0 slide-in-from-left-1"
                        >
                          <NavLink 
                            to={subItem.url}
                            className={`${getNavClasses(isActive(subItem.url))} border-l-2 border-sidebar-border/50 pl-3 hover:border-primary/50 transition-all`}
                          >
                            <span className="text-xs text-sidebar-foreground/80 hover:text-sidebar-foreground">
                              {subItem.title}
                            </span>
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
