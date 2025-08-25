import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Users,
  Clock,
  Calendar,
  TrendingUp,
  Shield,
  DollarSign,
  Briefcase,
  Brain,
  Settings,
  Home,
  Building2
} from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { localePath, resolveLang } from '@/lib/i18n/localePath';
import { useLocale } from '@/i18n/locale';

const navigationItems = [
  { key: 'dashboard', url: '/', icon: Home },
  { key: 'employees', url: '/employees', icon: Users },
  { key: 'attendance', url: '/attendance', icon: Clock },
  { key: 'leave', url: '/leave', icon: Calendar },
  { key: 'performance', url: '/performance', icon: TrendingUp },
  { key: 'hse', url: '/hse', icon: Shield },
  { key: 'payroll', url: '/payroll', icon: DollarSign },
  { key: 'recruitment', url: '/recruitment', icon: Briefcase },
];

const managementItems = [
  { key: 'analytics', url: '/analytics', icon: TrendingUp },
  { key: 'ai_intelligence', url: '/ai', icon: Brain, adminOnly: true },
  { key: 'company', url: '/company', icon: Building2 },
  { key: 'settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const lang = resolveLang();
  const { t, locale } = useLocale();
  const isArabic = locale === 'ar';

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50";

  return (
    <Sidebar className={open ? "w-60" : "w-14"}>
      <SidebarContent>
        <div className="p-4">
          <h2 className={`font-bold text-lg ${open ? 'block' : 'hidden'}`}>
            {isArabic ? 'منصة عقل للموارد البشرية' : 'AqlHR Platform'}
          </h2>
          <div className={`w-8 h-8 bg-primary rounded flex items-center justify-center ${open ? 'hidden' : 'block'}`}>
            <span className="text-primary-foreground font-bold">A</span>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={open ? 'block' : 'hidden'}>
            {t('navigation', 'core_modules')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton asChild>
                      <NavLink to={localePath(item.url, lang)} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {open && <span>{t('navigation', item.key)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={open ? 'block' : 'hidden'}>
            {t('navigation', 'management')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton asChild>
                      <NavLink to={localePath(item.url, lang)} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {open && <span>{t('navigation', item.key)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}