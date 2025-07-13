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
  ArrowDown,
  Settings 
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
import { useSimpleLanguage } from "@/contexts/SimpleLanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

// Platform modules based on SanadHR structure
const getPlatformModules = (isArabic: boolean) => [
  { 
    title: isArabic ? "لوحة التحكم" : "Dashboard", 
    url: "/", 
    icon: BookOpen,
    badge: "1"
  },
  { 
    title: isArabic ? "الموارد البشرية الأساسية" : "Core HR", 
    url: "/core-hr", 
    icon: Users,
    badge: "12",
    subItems: [
      { title: isArabic ? "بيانات الموظفين الرئيسية" : "Employee Master Data", url: "/core-hr/master-data" },
      { title: isArabic ? "معالجة الرواتب" : "Payroll Processing", url: "/payroll" },
      { title: isArabic ? "إدارة المزايا" : "Benefits Administration", url: "/core-hr/benefits" },
      { title: isArabic ? "إدارة الأداء" : "Performance Management", url: "/core-hr/performance" },
      { title: isArabic ? "التوظيف والتعيين" : "Recruitment & Hiring", url: "/core-hr/recruitment" },
      { title: isArabic ? "التدريب والتطوير" : "Training & Development", url: "/core-hr/training" },
      { title: isArabic ? "الوقت والحضور" : "Time & Attendance", url: "/core-hr/time-attendance" },
      { title: isArabic ? "إدارة الإجازات" : "Leave Management", url: "/core-hr/leave" },
      { title: isArabic ? "تخطيط التعاقب" : "Succession Planning", url: "/core-hr/succession-planning" },
      { title: isArabic ? "إدارة التعويضات" : "Compensation Management", url: "/core-hr/compensation-management" },
      { title: isArabic ? "الخدمة الذاتية للموظفين" : "Employee Self Service", url: "/core-hr/self-service" },
      { title: isArabic ? "لوحة تحكم المدير" : "Manager Dashboard", url: "/core-hr/organization" },
    ]
  },
  { 
    title: isArabic ? "الأتمتة بالذكاء الاصطناعي" : "AI Automation", 
    url: "/ai-automation", 
    icon: Check,
    badge: "6",
    subItems: [
      { title: isArabic ? "محرك المزامنة الذكي" : "AI Sync Engine", url: "/ai-automation/sync-engine" },
      { title: isArabic ? "التوصيات الذكية" : "Smart Recommendations", url: "/ai-automation/smart-recommendations" },
      { title: isArabic ? "التحليلات التنبؤية" : "Predictive Analytics", url: "/ai-automation/predictive-analytics" },
      { title: isArabic ? "ذكاء المستندات" : "Document Intelligence", url: "/ai-automation/document-intelligence" },
      { title: isArabic ? "معالجة اللغة العربية/الإنجليزية" : "Arabic/English NLP", url: "/ai-automation/arabic-english-nlp" },
      { title: isArabic ? "سير العمل التلقائي" : "Automated Workflows", url: "/ai-automation/automated-workflow" },
    ]
  },
  { 
    title: isArabic ? "التكاملات الحكومية" : "Government", 
    url: "/government", 
    icon: FileText,
    badge: "22",
    subItems: [
      { title: isArabic ? "تكامل قوى" : "Qiwa Integration", url: "/government/qiwa" },
      { title: isArabic ? "تكامل التأمينات الاجتماعية" : "GOSI Integration", url: "/government/gosi" },
      { title: isArabic ? "مدد" : "Mudad Platform", url: "/government/mudad" },
      { title: isArabic ? "منصة علم" : "ELM Platform", url: "/government/elm" },
      { title: isArabic ? "منصة أبشر" : "Absher Platform", url: "/government/absher" },
      { title: isArabic ? "منصة مقيم" : "Muqeem Platform", url: "/government/muqeem" },
      { title: isArabic ? "منصة صحة" : "Seha Platform", url: "/government/seha" },
      { title: isArabic ? "منصة شي" : "CHI Platform", url: "/government/chi" },
      { title: isArabic ? "تكامل وزارة الموارد البشرية" : "HRSD Integration", url: "/government/mol" },
      { title: isArabic ? "دروب التقني" : "TVTC Doroob", url: "/government/tvtc" },
      { title: isArabic ? "تكامل زاتكا" : "ZATCA Integration", url: "/government/zatca" },
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
      { title: isArabic ? "الهيئة السعودية للمهندسين" : "Saudi Engineering Body", url: "/government/saudi-engineering" },
    ]
  },
  { 
    title: isArabic ? "الأدوات والتكاملات" : "Tools & Integrations", 
    url: "/tools", 
    icon: Settings,
    badge: "24"
  },
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
                <p className="text-xs text-sidebar-foreground/70">{isArabic ? 'منصة الموارد البشرية الشاملة' : 'Complete HR Platform'}</p>
              </div>
            )}
          </div>
          {state !== "collapsed" && (
            <div className="mt-4 flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-status-success rounded-full"></div>
              <span className="text-sidebar-foreground/70">{isArabic ? 'جميع الأنظمة تعمل بشكل طبيعي' : 'All systems operational'}</span>
            </div>
          )}
        </div>

        {/* Platform Modules */}
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