import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, Settings } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

export function DashboardHeader() {
  const { t } = useLanguage();
  
  return (
    <header className="h-16 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-foreground">{t('dashboard.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('dashboard.subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle />
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
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">Ahmed Al-Rashid</p>
              <p className="text-xs text-muted-foreground">HR Administrator</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Ahmed Al-Rashid" />
              <AvatarFallback className="bg-gradient-primary text-white text-sm font-medium">
                AR
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}