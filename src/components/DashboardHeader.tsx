import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, Settings } from "lucide-react";
import SimpleLanguageToggle from "@/components/SimpleLanguageToggle";
import { useSimpleLanguage } from "@/contexts/SimpleLanguageContext";
import { HijriCalendarWidget } from "@/components/calendar/HijriCalendarWidget";

export function DashboardHeader() {
  const { isArabic } = useSimpleLanguage();
  
  return (
    <header className="h-16 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className={`flex h-full items-center justify-between px-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
          <div className="hidden md:block">
            {isArabic ? (
              <>
                <h1 className="text-xl font-semibold text-foreground text-right">نظام إيه كيو إل إتش ار للموارد البشرية</h1>
                <p className="text-sm text-muted-foreground text-right">منصة ذكية ومتطورة لإدارة الموارد البشرية في المملكة العربية السعودية</p>
              </>
            ) : (
              <>
                <h1 className="text-xl font-semibold text-foreground">AqlHR System</h1>
                <p className="text-sm text-muted-foreground">Advanced Intelligent Platform for Human Resources Management in Saudi Arabia</p>
              </>
            )}
          </div>
        </div>

        <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <HijriCalendarWidget compact className="hidden lg:flex" />
          <SimpleLanguageToggle />
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-brand-danger rounded-full text-xs"></span>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" />
          </Button>
          <div className={`flex items-center gap-3 pl-3 border-l border-border ${isArabic ? 'flex-row-reverse pr-3 pl-0 border-r border-l-0' : ''}`}>
            <div className={`hidden sm:block ${isArabic ? 'text-left' : 'text-right'}`}>
              {isArabic ? (
                <>
                  <p className="text-sm font-medium text-foreground">أحمد الراشد</p>
                  <p className="text-xs text-muted-foreground">مدير الموارد البشرية</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-foreground">Ahmed Al-Rashid</p>
                  <p className="text-xs text-muted-foreground">HR Administrator</p>
                </>
              )}
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Ahmed Al-Rashid" />
              <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                AR
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}