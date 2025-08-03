import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  BarChart3, Users, UserCheck, Calendar, DollarSign, TrendingUp,
  Brain, Building2, FileCheck, Wrench, HelpCircle, Settings,
  Target, Award, BookOpen, Shield, Clock, CreditCard,
  Briefcase, Globe, Heart, Zap, Database, MessageSquare,
  PieChart, Activity, CheckCircle, AlertTriangle, Search,
  FileText, BarChart, LineChart, Layers, Workflow,
  UserPlus, GraduationCap, Trophy, Star, Megaphone,
  Eye, Lock, Smartphone, Monitor, CloudLightning
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

// Get HRBP modules function
const getHRBPModules = (isArabic: boolean) => [
  // Executive Dashboard
  { 
    title: isArabic ? "لوحة التحكم التنفيذية" : "Executive Dashboard", 
    url: "/", 
    icon: BarChart3, 
    badge: "LIVE", 
    color: "blue",
    subItems: [
      { title: isArabic ? "نظرة عامة على القوى العاملة" : "Workforce Overview", url: "/analytics" },
      { title: isArabic ? "مؤشرات الأداء الرئيسية" : "Key Performance Indicators", url: "/analytics/kpi" },
      { title: isArabic ? "التحليلات التنفيذية" : "Executive Analytics", url: "/analytics/executive" },
      { title: isArabic ? "تقارير الزمن الفعلي" : "Real-time Reports", url: "/analytics/realtime" },
    ]
  },

  // People Management
  { 
    title: isArabic ? "إدارة الأشخاص" : "People Management", 
    url: "/employees", 
    icon: Users, 
    badge: "CORE", 
    color: "green",
    subItems: [
      { title: isArabic ? "دليل الموظفين" : "Employee Directory", url: "/employees" },
      { title: isArabic ? "بيانات الموظفين الرئيسية" : "Employee Master Data", url: "/core-hr/master-data" },
      { title: isArabic ? "التسلسل الهرمي التنظيمي" : "Organizational Chart", url: "/core-hr/organization" },
      { title: isArabic ? "إدارة الفرق" : "Team Management", url: "/core-hr/teams" },
      { title: isArabic ? "الخدمة الذاتية للموظفين" : "Employee Self Service", url: "/core-hr/self-service" },
    ]
  },

  // Talent Acquisition & Management
  { 
    title: isArabic ? "اكتساب وإدارة المواهب" : "Talent Acquisition & Management", 
    url: "/recruitment", 
    icon: UserPlus, 
    badge: "8", 
    color: "purple",
    subItems: [
      { title: isArabic ? "التوظيف والتعيين" : "Recruitment & Hiring", url: "/core-hr/recruitment" },
      { title: isArabic ? "إدارة المواهب" : "Talent Management", url: "/strategic/talent-acquisition" },
      { title: isArabic ? "التعيين والإدماج" : "Onboarding & Integration", url: "/core-hr/onboarding" },
      { title: isArabic ? "تخطيط التعاقب" : "Succession Planning", url: "/strategic/succession" },
      { title: isArabic ? "إدارة الأداء" : "Performance Management", url: "/core-hr/performance" },
    ]
  },

  // Performance & Analytics
  { 
    title: isArabic ? "الأداء والتحليلات" : "Performance & Analytics", 
    url: "/analytics", 
    icon: TrendingUp, 
    badge: "AI", 
    color: "violet",
    subItems: [
      { title: isArabic ? "تحليلات القوى العاملة" : "Workforce Analytics", url: "/analytics/workforce" },
      { title: isArabic ? "تحليلات الأداء" : "Performance Analytics", url: "/analytics/performance" },
      { title: isArabic ? "التحليلات التنبؤية" : "Predictive Analytics", url: "/ai-automation/predictive-analytics" },
      { title: isArabic ? "مؤشرات الاحتفاظ" : "Retention Metrics", url: "/analytics/retention" },
      { title: isArabic ? "تحليل الانخراط" : "Engagement Analysis", url: "/analytics/engagement" },
      { title: isArabic ? "تحليل التكاليف" : "Cost Analysis", url: "/analytics/costs" },
    ]
  },

  // Compensation & Benefits
  { 
    title: isArabic ? "التعويضات والمزايا" : "Compensation & Benefits", 
    url: "/payroll", 
    icon: DollarSign, 
    badge: "12", 
    color: "emerald",
    subItems: [
      { title: isArabic ? "معالجة الرواتب" : "Payroll Processing", url: "/payroll" },
      { title: isArabic ? "إدارة التعويضات" : "Compensation Management", url: "/core-hr/compensation-management" },
      { title: isArabic ? "إدارة المزايا" : "Benefits Administration", url: "/core-hr/benefits" },
      { title: isArabic ? "استراتيجية التعويضات" : "Compensation Strategy", url: "/strategic/compensation" },
      { title: isArabic ? "التعويضات التنفيذية" : "Executive Compensation", url: "/consulting/executive-compensation" },
      { title: isArabic ? "حاسبة السعودة" : "Saudization Calculator", url: "/core-hr/saudization-calculator" },
    ]
  },

  // Learning & Development
  { 
    title: isArabic ? "التعلم والتطوير" : "Learning & Development", 
    url: "/training", 
    icon: GraduationCap, 
    badge: "AI", 
    color: "blue",
    subItems: [
      { title: isArabic ? "التدريب والتطوير" : "Training & Development", url: "/core-hr/training" },
      { title: isArabic ? "تطوير القيادة" : "Leadership Development", url: "/strategic/leadership" },
      { title: isArabic ? "التطوير التنظيمي" : "Organizational Development", url: "/strategic/organizational-development" },
      { title: isArabic ? "إدارة المعرفة" : "Knowledge Management", url: "/training/knowledge" },
      { title: isArabic ? "التعلم الإلكتروني" : "E-Learning Platform", url: "/training/elearning" },
    ]
  },

  // Time & Attendance
  { 
    title: isArabic ? "الوقت والحضور" : "Time & Attendance", 
    url: "/time-attendance", 
    icon: Clock, 
    badge: "LIVE", 
    color: "orange",
    subItems: [
      { title: isArabic ? "إدارة الحضور والانصراف" : "Time & Attendance", url: "/core-hr/time-attendance" },
      { title: isArabic ? "إدارة الإجازات" : "Leave Management", url: "/core-hr/leave" },
      { title: isArabic ? "جداول العمل" : "Work Schedules", url: "/core-hr/schedules" },
      { title: isArabic ? "تتبع المشاريع" : "Project Tracking", url: "/core-hr/projects" },
    ]
  },

  // Employee Experience
  { 
    title: isArabic ? "تجربة الموظف" : "Employee Experience", 
    url: "/employee-experience", 
    icon: Heart, 
    badge: "NEW", 
    color: "rose",
    subItems: [
      { title: isArabic ? "تجربة الموظف" : "Employee Experience", url: "/strategic/employee-experience" },
      { title: isArabic ? "استطلاعات الانخراط" : "Engagement Surveys", url: "/employee/surveys" },
      { title: isArabic ? "التغذية الراجعة" : "Feedback Management", url: "/employee/feedback" },
      { title: isArabic ? "برامج الاعتراف" : "Recognition Programs", url: "/employee/recognition" },
      { title: isArabic ? "الرفاهية والصحة" : "Wellness & Health", url: "/employee/wellness" },
    ]
  },

  // Compliance & Legal
  { 
    title: isArabic ? "الامتثال والقانوني" : "Compliance & Legal", 
    url: "/government", 
    icon: Shield, 
    badge: "22", 
    color: "red",
    subItems: [
      { title: isArabic ? "امتثال وزارة العمل" : "MOL Compliance", url: "/government/mol-compliance" },
      { title: isArabic ? "تكامل قوى" : "Qiwa Integration", url: "/government/qiwa" },
      { title: isArabic ? "تكامل التأمينات" : "GOSI Integration", url: "/government/gosi" },
      { title: isArabic ? "امتثال نطاقات" : "Nitaqat Compliance", url: "/government/nitaqat" },
      { title: isArabic ? "منصة أبشر" : "Absher Platform", url: "/government/absher" },
      { title: isArabic ? "منصة علم" : "ELM Platform", url: "/government/elm" },
    ]
  },

  // AI-Powered HR
  { 
    title: isArabic ? "الموارد البشرية المدعومة بالذكاء الاصطناعي" : "AI-Powered HR", 
    url: "/ai-features", 
    icon: Brain, 
    badge: "18", 
    color: "indigo",
    subItems: [
      { title: isArabic ? "محرك التوصيات الذكي" : "Smart Recommendations", url: "/ai-automation/smart-recommendations" },
      { title: isArabic ? "محرك المزامنة الذكي" : "AI Sync Engine", url: "/ai-automation/sync-engine" },
      { title: isArabic ? "معالجة اللغة الطبيعية" : "Natural Language Processing", url: "/ai-automation/arabic-english-nlp" },
      { title: isArabic ? "التوصيات التنبؤية" : "Predictive Recommendations", url: "/ai-automation/predictive-analytics" },
      { title: isArabic ? "مساعد التوظيف الذكي" : "AI Recruitment Assistant", url: "/ai-automation/recruitment-ai" },
      { title: isArabic ? "محرك التوافق" : "Compliance Predictor", url: "/ai-automation/compliance-predictor" },
    ]
  },

  // Strategic Planning
  { 
    title: isArabic ? "التخطيط الاستراتيجي" : "Strategic Planning", 
    url: "/strategic", 
    icon: Target, 
    badge: "PREMIUM", 
    color: "slate",
    subItems: [
      { title: isArabic ? "تخطيط القوى العاملة" : "Workforce Planning", url: "/strategic/workforce-planning" },
      { title: isArabic ? "استراتيجية الأداء" : "Performance Strategy", url: "/strategic/performance" },
      { title: isArabic ? "التنوع والشمول" : "Diversity & Inclusion", url: "/strategic/diversity" },
      { title: isArabic ? "إدارة التغيير" : "Change Management", url: "/strategic/change-management" },
      { title: isArabic ? "استراتيجية الثقافة" : "Culture Strategy", url: "/strategic/culture" },
      { title: isArabic ? "التحول الرقمي" : "HR Transformation", url: "/strategic/hr-transformation" },
    ]
  },

  // Mobile & Self-Service
  { 
    title: isArabic ? "المحمول والخدمة الذاتية" : "Mobile & Self-Service", 
    url: "/mobile-hr", 
    icon: Smartphone, 
    badge: "APP", 
    color: "cyan",
    subItems: [
      { title: isArabic ? "تطبيق الموارد البشرية المحمول" : "Mobile HR App", url: "/core-hr/mobile" },
      { title: isArabic ? "الخدمة الذاتية للموظفين" : "Employee Self Service", url: "/core-hr/self-service" },
      { title: isArabic ? "لوحة تحكم المدير" : "Manager Dashboard", url: "/core-hr/manager-dashboard" },
      { title: isArabic ? "الموافقات المحمولة" : "Mobile Approvals", url: "/mobile/approvals" },
    ]
  },

  // Reports & Documentation
  { 
    title: isArabic ? "التقارير والوثائق" : "Reports & Documentation", 
    url: "/documents", 
    icon: FileText, 
    badge: "DOC", 
    color: "amber",
    subItems: [
      { title: isArabic ? "إدارة الوثائق" : "Document Management", url: "/documents" },
      { title: isArabic ? "منشئ التقارير" : "Report Builder", url: "/reports/builder" },
      { title: isArabic ? "التقارير المجدولة" : "Scheduled Reports", url: "/reports/scheduled" },
      { title: isArabic ? "لوحات المعلومات" : "Dashboards", url: "/reports/dashboards" },
      { title: isArabic ? "التصدير والاستيراد" : "Export & Import", url: "/reports/export" },
    ]
  },

  // System Administration
  { 
    title: isArabic ? "إدارة النظام" : "System Administration", 
    url: "/admin", 
    icon: Settings, 
    badge: "ADMIN", 
    color: "gray",
    subItems: [
      { title: isArabic ? "إدارة المستخدمين" : "User Management", url: "/admin/users" },
      { title: isArabic ? "الأدوار والصلاحيات" : "Roles & Permissions", url: "/admin/permissions" },
      { title: isArabic ? "إعدادات النظام" : "System Settings", url: "/admin/settings" },
      { title: isArabic ? "سجلات التدقيق" : "Audit Logs", url: "/admin/audit" },
      { title: isArabic ? "النسخ الاحتياطي" : "Backup & Recovery", url: "/admin/backup" },
    ]
  },

  // Test & Validation
  { 
    title: isArabic ? "الاختبار والتحقق" : "Test & Validation", 
    url: "/demo/test-page", 
    icon: CheckCircle, 
    badge: "QA", 
    color: "lime",
    subItems: [
      { title: isArabic ? "تحقق نظام الذكاء الاصطناعي" : "AI System Validation", url: "/demo/test-page" },
      { title: isArabic ? "مجموعة الاختبار الكامل" : "Full Test Suite", url: "/demo/test-page" },
      { title: isArabic ? "مراقبة الأداء" : "Performance Monitoring", url: "/admin/performance" },
    ]
  },

  // Help & Support
  { 
    title: isArabic ? "المساعدة والدعم" : "Help & Support", 
    url: "/help", 
    icon: HelpCircle, 
    badge: "24/7", 
    color: "blue",
    subItems: [
      { title: isArabic ? "المساعدة التفاعلية" : "Interactive Help", url: "/help" },
      { title: isArabic ? "قاعدة المعرفة" : "Knowledge Base", url: "/help/knowledge" },
      { title: isArabic ? "دعم الذكاء الاصطناعي" : "AI Support", url: "/help/ai-support" },
      { title: isArabic ? "التدريب المحدد للدور" : "Role-based Training", url: "/help/training" },
    ]
  },
];

export function HRBPSidebar() {
  const { state } = useSidebar();
  const { isArabic } = useSimpleLanguage();
  const location = useLocation();
  const currentPath = location.pathname;
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    isArabic ? "لوحة التحكم التنفيذية" : "Executive Dashboard"
  ]);
  
  const hrbpModules = getHRBPModules(isArabic);
  
  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (url: string) => currentPath.startsWith(url) && url !== "/";

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => 
      prev.includes(title) 
        ? prev.filter(g => g !== title)
        : [...prev, title]
    );
  };

  const getBadgeColor = (color: string) => {
    const colors = {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white", 
      purple: "bg-purple-500 text-white",
      violet: "bg-violet-500 text-white",
      emerald: "bg-emerald-500 text-white",
      orange: "bg-orange-500 text-white",
      rose: "bg-rose-500 text-white",
      red: "bg-red-500 text-white",
      indigo: "bg-indigo-500 text-white",
      slate: "bg-slate-500 text-white",
      cyan: "bg-cyan-500 text-white",
      amber: "bg-amber-500 text-white",
      gray: "bg-gray-500 text-white",
      lime: "bg-lime-500 text-white",
    };
    return colors[color as keyof typeof colors] || "bg-gray-500 text-white";
  };

  return (
    <Sidebar className="border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex flex-col">
          <h2 className="font-bold text-lg text-primary">
            {isArabic ? 'منصة أقل HR' : 'AqlHR Platform'}
          </h2>
          {state !== "collapsed" && (
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'لوحة تحكم شريك الموارد البشرية' : 'HRBP Dashboard'}
            </p>
          )}
        </div>
      </div>
      <SidebarContent className="gap-0">
        {hrbpModules.map((module) => {
          const isExpanded = expandedGroups.includes(module.title);
          const hasSubItems = module.subItems && module.subItems.length > 0;
          
          return (
            <SidebarGroup key={module.title} className="border-b border-border/20 py-0">
              <SidebarGroupLabel className="px-4 py-3 hover:bg-muted/50">
                <SidebarMenuButton
                  onClick={() => hasSubItems && toggleGroup(module.title)}
                  className={`w-full justify-between p-0 h-auto ${isActive(module.url) ? 'text-primary' : 'text-foreground'}`}
                >
                  <div className="flex items-center gap-3">
                    <module.icon className="h-4 w-4" />
                    {state !== "collapsed" && (
                      <>
                        <span className="font-medium text-sm">{module.title}</span>
                        {module.badge && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(module.color)}`}>
                            {module.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {hasSubItems && state !== "collapsed" && (
                    <div className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                      ▶
                    </div>
                  )}
                </SidebarMenuButton>
              </SidebarGroupLabel>

              {hasSubItems && isExpanded && state !== "collapsed" && (
                <SidebarGroupContent className="pb-2">
                  <SidebarMenu>
                    {module.subItems?.map((item) => (
                      <SidebarMenuItem key={item.title} className="pl-4">
                        <SidebarMenuButton asChild className="py-1.5">
                          <NavLink 
                            to={item.url} 
                            className={({ isActive }) =>
                              `w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                                isActive 
                                  ? 'bg-primary/10 text-primary font-medium' 
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                              }`
                            }
                          >
                            <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}