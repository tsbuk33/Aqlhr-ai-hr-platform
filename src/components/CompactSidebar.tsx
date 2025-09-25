import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  ChevronDown, Smartphone, Wrench, Settings, 
  Globe, Database, Activity, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export function CompactSidebar() {
  const { lang, setLang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const [mobileAnalyticsOpen, setMobileAnalyticsOpen] = useState(false);
  
  const handleLanguageSwitch = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
  };

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col">
      {/* Language Toggle */}
      <div className="p-4">
        <Button
          onClick={handleLanguageSwitch}
          className="w-full bg-white/10 hover:bg-white/20 text-white border-0 rounded-xl px-4 py-2"
          variant="outline"
        >
          <Globe className="h-4 w-4 mr-2" />
          {isArabic ? 'English' : 'العربية'}
        </Button>
      </div>

      {/* AQL Logo Section */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AQL</span>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div className="text-slate-400 text-sm mb-1">AqlHR</div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-slate-300 text-sm">
            {isArabic ? 'المستشار القانوني' : 'Legal Consultant'}
          </span>
          <Badge className="text-xs px-2 py-0 bg-blue-600 text-white">NEW</Badge>
        </div>
        <div className="text-slate-400 text-xs mb-1">AI</div>
        <div className="text-green-400 text-sm">
          {isArabic ? 'الأنظمة تعمل' : 'Systems operational'}
        </div>
      </div>

      {/* Navigation Icon */}
      <div className="px-4 pb-4 flex justify-center">
        <Database className="h-6 w-6 text-blue-400" />
      </div>

      {/* Mobile Analytics Collapsible */}
      <div className="px-4 pb-4">
        <Collapsible open={mobileAnalyticsOpen} onOpenChange={setMobileAnalyticsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between text-left bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg px-4 py-3"
            >
              <span>{isArabic ? 'تحليلات الموبايل' : 'Mobile Analytics'}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileAnalyticsOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-1">
            <NavLink
              to="/mobile/analytics"
              className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isArabic ? 'تحليلات الأداء' : 'Performance Analytics'}
            </NavLink>
            <NavLink
              to="/mobile/users"
              className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isArabic ? 'إحصائيات المستخدمين' : 'User Statistics'}
            </NavLink>
            <NavLink
              to="/mobile/reports"
              className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isArabic ? 'التقارير المتنقلة' : 'Mobile Reports'}
            </NavLink>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Tools & Support Button */}
      <div className="px-4 pb-4">
        <NavLink to="/tools">
          <Button
            variant="ghost"
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl px-4 py-3"
          >
            <Wrench className="h-4 w-4 mr-2" />
            {isArabic ? 'الأدوات والدعم' : 'Tools & Support'}
          </Button>
        </NavLink>
      </div>

      {/* Settings Icon */}
      <div className="px-4 pb-6 flex justify-center">
        <NavLink to="/settings">
          <Settings className="h-5 w-5 text-slate-400 hover:text-white transition-colors" />
        </NavLink>
      </div>

      {/* Bottom Status - Auto margin top to push to bottom */}
      <div className="mt-auto px-4 pb-4 border-t border-slate-700 pt-4">
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