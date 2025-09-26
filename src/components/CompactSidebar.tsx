import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  ChevronDown, ChevronUp, BarChart3, Crown, Users, Brain, 
  Activity, Zap, Building, Heart, Scale, Shield, 
  TreePine, MessageCircle, Target, RefreshCw, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export function CompactSidebar() {
  const { lang, setLang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  
  const [openSections, setOpenSections] = useState({
    coreHR: false,
    aiAnalytics: false,
    aiAutomation: false,
    governmentIntegrations: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const handleLanguageSwitch = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
  };

  return (
    <div className="w-80 h-screen bg-slate-900 text-white flex flex-col overflow-y-auto">
      {/* Language Toggle */}
      <div className="p-3">
        <Button
          onClick={handleLanguageSwitch}
          className="w-full bg-white/10 hover:bg-white/20 text-white border-0 rounded-lg px-3 py-2 text-sm"
          variant="outline"
        >
          <Globe className="h-4 w-4 mr-2" />
          {isArabic ? 'English' : 'العربية'}
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 space-y-1">
        {/* Dashboard */}
        <NavLink to="/en/dashboard" className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-800 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-4 w-4" />
            <span>{isArabic ? 'لوحة التحكم' : 'Dashboard'}</span>
          </div>
          <Badge className="bg-blue-600 text-white text-xs px-2 py-0">1</Badge>
        </NavLink>

        {/* Executive Intelligence Center */}
        <NavLink to="/en/executive-center" className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-800 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <Crown className="h-4 w-4" />
            <span>{isArabic ? 'مركز ذكاء التنفيذيين' : 'Executive Intelligence Center'}</span>
          </div>
          <Badge className="bg-yellow-600 text-white text-xs px-2 py-0">PREMIUM</Badge>
        </NavLink>

        {/* Core HR */}
        <Collapsible open={openSections.coreHR} onOpenChange={() => toggleSection('coreHR')}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between text-left px-4 py-3 text-sm hover:bg-slate-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4" />
                <span>{isArabic ? 'الموارد البشرية الأساسية' : 'Core HR'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-600 text-white text-xs px-2 py-0">13</Badge>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.coreHR ? 'rotate-180' : ''}`} />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-7 mt-1 space-y-1">
            <NavLink to="/en/employees" className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">
              Employee Management
            </NavLink>
            <NavLink to="/en/payroll" className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">
              Payroll System
            </NavLink>
            <NavLink to="/en/recruitment" className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">
              Recruitment
            </NavLink>
          </CollapsibleContent>
        </Collapsible>

        {/* Skills Intelligence */}
        <NavLink to="/en/skills-intelligence" className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-800 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <Brain className="h-4 w-4" />
            <span>{isArabic ? 'ذكاء المهارات' : 'Skills Intelligence'}</span>
          </div>
          <Badge className="bg-green-600 text-white text-xs px-2 py-0">NEW</Badge>
        </NavLink>

        {/* AI & Analytics */}
        <Collapsible open={openSections.aiAnalytics} onOpenChange={() => toggleSection('aiAnalytics')}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between text-left px-4 py-3 text-sm hover:bg-slate-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4" />
                <span>{isArabic ? 'الذكاء الاصطناعي والتحليلات' : 'AI & Analytics'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-600 text-white text-xs px-2 py-0">12</Badge>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.aiAnalytics ? 'rotate-180' : ''}`} />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-7 mt-1 space-y-1">
            <NavLink to="/en/ai-analytics" className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">
              Analytics Dashboard
            </NavLink>
            <NavLink to="/en/predictive-analytics" className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">
              Predictive Analytics
            </NavLink>
          </CollapsibleContent>
        </Collapsible>

        {/* AI Automation Engine */}
        <Collapsible open={openSections.aiAutomation} onOpenChange={() => toggleSection('aiAutomation')}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between text-left px-4 py-3 text-sm hover:bg-slate-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4" />
                <span>{isArabic ? 'محرك الأتمتة الذكية' : 'AI Automation Engine'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-600 text-white text-xs px-2 py-0">6</Badge>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.aiAutomation ? 'rotate-180' : ''}`} />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-7 mt-1 space-y-1">
            <NavLink to="/en/workflow-automation" className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">
              Workflow Automation
            </NavLink>
            <NavLink to="/en/ai-scheduler" className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">
              AI Scheduler
            </NavLink>
          </CollapsibleContent>
        </Collapsible>

        {/* Government Integrations */}
        <Collapsible open={openSections.governmentIntegrations} onOpenChange={() => toggleSection('governmentIntegrations')}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between text-left px-4 py-3 text-sm hover:bg-slate-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4" />
                <span>{isArabic ? 'التكاملات الحكومية' : 'Government Integrations'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-600 text-white text-xs px-2 py-0">22</Badge>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.governmentIntegrations ? 'rotate-180' : ''}`} />
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-7 mt-1 space-y-1">
            <NavLink to="/en/ministry-integration" className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">
              Ministry Integration
            </NavLink>
            <NavLink to="/en/gosi-integration" className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">
              GOSI Integration
            </NavLink>
          </CollapsibleContent>
        </Collapsible>

        {/* Employee-Welfare Consultancy */}
        <NavLink to="/en/employee-welfare" className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-800 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <Heart className="h-4 w-4" />
            <span>{isArabic ? 'استشارات رفاهية الموظفين' : 'Employee-Welfare Consultancy'}</span>
          </div>
          <Badge className="bg-red-600 text-white text-xs px-2 py-0">FLAGSHIP</Badge>
        </NavLink>

        {/* Legal Consultant AI */}
        <NavLink to="/en/legal-consultant" className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-800 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <Scale className="h-4 w-4" />
            <span>{isArabic ? 'المستشار القانوني الذكي' : 'Legal Consultant AI'}</span>
          </div>
          <Badge className="bg-green-600 text-white text-xs px-2 py-0">NEW</Badge>
        </NavLink>

        {/* NRC Management */}
        <NavLink to="/en/nrc-management" className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-800 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4" />
            <span>{isArabic ? 'إدارة شهادة عدم الممانعة' : 'NRC Management'}</span>
          </div>
          <Badge className="bg-purple-600 text-white text-xs px-2 py-0">AI</Badge>
        </NavLink>

        {/* ISO Management AI */}
        <NavLink to="/en/iso-management" className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-800 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <Target className="h-4 w-4" />
            <span>{isArabic ? 'إدارة الأيزو الذكية' : 'ISO Management AI'}</span>
          </div>
          <Badge className="bg-green-600 text-white text-xs px-2 py-0">NEW</Badge>
        </NavLink>

        {/* Health, Safety & Environment */}
        <NavLink to="/en/hse" className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-800 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <TreePine className="h-4 w-4" />
            <span>{isArabic ? 'الصحة والسلامة والبيئة' : 'Health, Safety & Environment'}</span>
          </div>
          <Badge className="bg-orange-600 text-white text-xs px-2 py-0">HSE</Badge>
        </NavLink>

        {/* Consulting Services */}
        <NavLink to="/en/consulting" className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-800 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-4 w-4" />
            <span>{isArabic ? 'الخدمات الاستشارية' : 'Consulting Services'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge className="bg-slate-600 text-white text-xs px-2 py-0">12</Badge>
            <ChevronUp className="h-3 w-3" />
          </div>
        </NavLink>

        {/* Strategic Planning */}
        <div className="px-4 py-2">
          <div className="text-xs text-slate-400 font-medium mb-2">
            {isArabic ? 'التخطيط الاستراتيجي' : 'Strategic Planning'}
          </div>
          <div className="h-8 bg-slate-800 rounded-lg"></div>
        </div>

        {/* Change Management */}
        <div className="px-4 py-2">
          <div className="text-xs text-slate-400 font-medium">
            {isArabic ? 'إدارة التغيير' : 'Change Management'}
          </div>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="px-4 pb-4 border-t border-slate-700 pt-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>{isArabic ? 'الاتصالات النشطة' : 'Active Connections'}</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-400 font-medium">47</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{isArabic ? 'حالة النظام' : 'System Status'}</span>
          <span className="text-green-400 font-medium">
            {isArabic ? 'متصل' : 'Online'}
          </span>
        </div>
        
        {/* Status Bar */}
        <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}