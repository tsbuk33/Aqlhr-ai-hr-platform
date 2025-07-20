import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, Settings } from "lucide-react";
import SimpleLanguageToggle from "@/components/SimpleLanguageToggle";
import { useSimpleLanguage } from "@/contexts/SimpleLanguageContext";
import { HijriCalendarWidget } from "@/components/calendar/HijriCalendarWidget";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DashboardHeader() {
  const { isArabic } = useSimpleLanguage();
  
  return (
    <header className="h-20 border-b border-border/40 dark:border-border bg-gradient-to-r from-surface via-surface-subtle to-surface dark:from-surface dark:via-surface-subtle dark:to-surface backdrop-blur-xl supports-[backdrop-filter]:bg-surface/90 dark:supports-[backdrop-filter]:bg-surface/90 shadow-sm">
      <div className={`flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 min-w-0 flex-shrink ${isArabic ? 'flex-row-reverse' : ''}`}>
          <SidebarTrigger className="text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent hover:text-accent-foreground dark:hover:text-accent-foreground rounded-lg p-2 transition-all duration-200 flex-shrink-0" />
          <div className="hidden lg:block min-w-0 max-w-xs">
            {isArabic ? (
              <div className="text-right min-w-0">
                <h1 className="text-lg font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent truncate">
                  عقل HR
                </h1>
                <p className="text-xs text-foreground-muted dark:text-foreground-muted mt-1 font-medium truncate">
                  منصة الموارد البشرية الذكية
                </p>
              </div>
            ) : (
              <div className="min-w-0">
                <h1 className="text-lg font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent truncate">
                  AqlHR System
                </h1>
                <p className="text-xs text-foreground-muted dark:text-foreground-muted mt-1 font-medium truncate">
                  Smart HR Platform
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={`flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <HijriCalendarWidget compact className="hidden lg:flex" />
          <ThemeToggle />
          <SimpleLanguageToggle />
          
          <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <Button variant="ghost" size="icon" className="text-foreground-muted dark:text-foreground-muted hover:text-foreground dark:hover:text-foreground hover:bg-accent dark:hover:bg-accent rounded-lg transition-all duration-200">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground-muted dark:text-foreground-muted hover:text-foreground dark:hover:text-foreground hover:bg-accent dark:hover:bg-accent rounded-lg transition-all duration-200 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-brand-danger rounded-full animate-pulse shadow-sm">
                <span className="absolute inset-0 rounded-full bg-brand-danger animate-ping"></span>
              </span>
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground-muted hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200">
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <div className={`flex items-center gap-4 pl-4 border-l border-border/60 ${isArabic ? 'flex-row-reverse pr-4 pl-0 border-r border-l-0' : ''}`}>
            <div className={`hidden sm:block ${isArabic ? 'text-left' : 'text-right'}`}>
              {isArabic ? (
                <>
                  <p className="text-sm font-semibold text-foreground">أحمد الراشد</p>
                  <p className="text-xs text-foreground-muted">مدير الموارد البشرية</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-foreground">Ahmed Al-Rashid</p>
                  <p className="text-xs text-foreground-muted">HR Administrator</p>
                </>
              )}
            </div>
            <Avatar className="h-10 w-10 ring-2 ring-border shadow-lg hover:ring-brand-primary transition-all duration-200">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Ahmed Al-Rashid" />
              <AvatarFallback className="bg-gradient-to-br from-brand-primary to-brand-accent text-white text-sm font-bold">
                AR
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}