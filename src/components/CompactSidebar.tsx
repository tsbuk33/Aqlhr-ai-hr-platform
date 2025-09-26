import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  ChevronDown, ChevronUp, BarChart3, Crown, Users, Brain, 
  TrendingUp, Zap, Building, Heart, Scale, Shield, 
  Leaf, MessageCircle, Settings
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export function CompactSidebar() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  return (
    <div className="w-[320px] h-screen bg-[#1e293b] text-white flex flex-col">
      {/* Main Navigation */}
      <div className="flex-1 px-0 py-3 space-y-0">
        {/* Dashboard */}
        <NavLink to="/en/dashboard" className="flex items-center justify-between px-4 py-2.5 text-sm text-white hover:bg-slate-700/50 transition-colors">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-4 w-4 text-white" />
            <span className="text-white font-normal">{isArabic ? 'لوحة التحكم' : 'Dashboard'}</span>
          </div>
          <span className="bg-slate-600 text-white text-xs px-1.5 py-0.5 rounded font-medium min-w-[20px] text-center">1</span>
        </NavLink>

        {/* Executive Intelligence Center */}
        <NavLink to="/en/executive-center" className="flex items-center justify-between px-4 py-2.5 text-sm text-white hover:bg-slate-700/50 transition-colors">
          <div className="flex items-center gap-3">
            <Crown className="h-4 w-4 text-white" />
            <span className="text-white font-normal">{isArabic ? 'مركز ذكاء التنفيذيين' : 'Executive Intelligence Center'}</span>
          </div>
          <span className="bg-yellow-600 text-black text-xs px-2 py-0.5 rounded font-bold">PREMIUM</span>
        </NavLink>

        {/* Core HR */}
        <div className="flex items-center justify-between px-4 py-2.5 text-sm text-white hover:bg-slate-700/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-white" />
            <span className="text-white font-normal">{isArabic ? 'الموارد البشرية الأساسية' : 'Core HR'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-600 text-white text-xs px-1.5 py-0.5 rounded font-medium min-w-[20px] text-center">13</span>
            <ChevronDown className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* Skills Intelligence */}
        <NavLink to="/en/skills-intelligence" className="flex items-center justify-between px-4 py-2.5 text-sm text-white hover:bg-slate-700/50 transition-colors">
          <div className="flex items-center gap-3">
            <Brain className="h-4 w-4 text-white" />
            <span className="text-white font-normal">{isArabic ? 'ذكاء المهارات' : 'Skills Intelligence'}</span>
          </div>
          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded font-bold">NEW</span>
        </NavLink>

        {/* AI & Analytics */}
        <div className="flex items-center justify-between px-4 py-2.5 text-sm text-white hover:bg-slate-700/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-4 w-4 text-white" />
            <span className="text-white font-normal">{isArabic ? 'الذكاء الاصطناعي والتحليلات' : 'AI & Analytics'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-600 text-white text-xs px-1.5 py-0.5 rounded font-medium min-w-[20px] text-center">12</span>
            <ChevronDown className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* AI Automation Engine */}
        <div className="flex items-center justify-between px-4 py-2.5 text-sm text-white hover:bg-slate-700/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Zap className="h-4 w-4 text-white" />
            <span className="text-white font-normal">{isArabic ? 'محرك الأتمتة الذكية' : 'AI Automation Engine'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-600 text-white text-xs px-1.5 py-0.5 rounded font-medium min-w-[20px] text-center">6</span>
            <ChevronDown className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* Government Integrations */}
        <div className="flex items-center justify-between px-4 py-2.5 text-sm text-white hover:bg-slate-700/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Building className="h-4 w-4 text-white" />
            <span className="text-white font-normal">{isArabic ? 'التكاملات الحكومية' : 'Government Integrations'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-600 text-white text-xs px-1.5 py-0.5 rounded font-medium min-w-[20px] text-center">22</span>
            <ChevronDown className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* Employee-Welfare Consultancy */}
        <NavLink to="/en/employee-welfare" className="flex items-center justify-between px-4 py-2.5 text-sm text-white hover:bg-slate-700/50 transition-colors">
          <div className="flex items-center gap-3">
            <Heart className="h-4 w-4 text-white" />
            <span className="text-white font-normal">{isArabic ? 'استشارات رفاهية الموظفين' : 'Employee-Welfare Consultancy'}</span>
          </div>
          <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-bold">FLAGSHIP</span>
        </NavLink>

        {/* Legal Consultant AI */}
        <NavLink to="/en/legal-consultant" className="flex items-center justify-between px-4 py-2.5 text-sm text-white hover:bg-slate-700/50 transition-colors">
          <div className="flex items-center gap-3">
            <Scale className="h-4 w-4 text-white" />
            <span className="text-white font-normal">{isArabic ? 'المستشار القانوني الذكي' : 'Legal Consultant AI'}</span>
          </div>
          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded font-bold">NEW</span>
        </NavLink>

        {/* NRC Management */}
        <NavLink to="/en/nrc-management" className="flex items-center justify-between px-4 py-2.5 text-sm text-white hover:bg-slate-700/50 transition-colors">
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-white" />
            <span className="text-white font-normal">{isArabic ? 'إدارة شهادة عدم الممانعة' : 'NRC Management'}</span>
          </div>
          <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded font-bold">AI</span>
        </NavLink>

        {/* ISO Management AI */}
        <NavLink to="/en/iso-management" className="flex items-center justify-between px-4 py-2.5 text-sm text-white hover:bg-slate-700/50 transition-colors">
          <div className="flex items-center gap-3">
            <Settings className="h-4 w-4 text-white" />
            <span className="text-white font-normal">{isArabic ? 'إدارة الأيزو الذكية' : 'ISO Management AI'}</span>
          </div>
          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded font-bold">NEW</span>
        </NavLink>

        {/* Health, Safety & Environment */}
        <NavLink to="/en/hse" className="flex items-center justify-between px-4 py-2.5 text-sm text-white hover:bg-slate-700/50 transition-colors">
          <div className="flex items-center gap-3">
            <Leaf className="h-4 w-4 text-white" />
            <span className="text-white font-normal">{isArabic ? 'الصحة والسلامة والبيئة' : 'Health, Safety & Environment'}</span>
          </div>
          <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded font-bold">HSE</span>
        </NavLink>

        {/* Consulting Services */}
        <div className="flex items-center justify-between px-4 py-2.5 text-sm text-white hover:bg-slate-700/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-4 w-4 text-white" />
            <span className="text-white font-normal">{isArabic ? 'الخدمات الاستشارية' : 'Consulting Services'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-600 text-white text-xs px-1.5 py-0.5 rounded font-medium min-w-[20px] text-center">12</span>
            <ChevronUp className="h-3 w-3 text-white" />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-4 py-3 border-t border-slate-600/50">
        {/* Strategic Planning */}
        <div className="mb-3">
          <div className="text-xs text-slate-300 font-medium mb-2">
            {isArabic ? 'التخطيط الاستراتيجي' : 'Strategic Planning'}
          </div>
          <div className="h-8 bg-white rounded-lg"></div>
        </div>

        {/* Change Management */}
        <div className="text-xs text-slate-300 font-medium">
          {isArabic ? 'إدارة التغيير' : 'Change Management'}
        </div>
      </div>
    </div>
  );
}