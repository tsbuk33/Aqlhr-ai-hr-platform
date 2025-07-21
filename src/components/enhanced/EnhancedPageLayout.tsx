import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { usePerformantLocalization } from "@/hooks/usePerformantLocalization";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Settings, 
  Bell, 
  FileText, 
  Download,
  Upload,
  LucideIcon
} from "lucide-react";

interface EnhancedPageLayoutProps {
  title: string;
  description?: string;
  showUserInfo?: boolean;
  showQuickActions?: boolean;
  showTabs?: boolean;
  tabs?: TabConfig[];
  quickActions?: QuickAction[];
  stats?: StatCard[];
  documents?: DocumentItem[];
  children?: React.ReactNode;
  headerActions?: React.ReactNode;
  onUpload?: (file: any) => void;
}

interface TabConfig {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

interface StatCard {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant: "default" | "primary" | "secondary" | "accent" | "success" | "warning" | "danger";
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
}

interface DocumentItem {
  id?: string;
  name: string;
  type: string;
  date: string;
  size: string;
  downloadUrl?: string;
  url?: string;
}

export const EnhancedPageLayout: React.FC<EnhancedPageLayoutProps> = ({
  title,
  description,
  showUserInfo = false,
  showQuickActions = false,
  showTabs = false,
  tabs = [],
  quickActions = [],
  stats = [],
  documents = [],
  children,
  headerActions,
  onUpload
}) => {
  const { language, isRTL } = useLanguage();
  const { formatters, directionClasses } = usePerformantLocalization();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUpload) {
      onUpload({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      });
    }
  };

  // Mock user data - in real app, fetch from Supabase auth
  const user = {
    name: language === 'ar' ? "أحمد محمد العلي" : "Ahmed Mohammed Al Ali",
    role: language === 'ar' ? "مدير الموارد البشرية" : "HR Manager",
    avatar: null
  };

  return (
    <div className={`w-full max-w-7xl mx-auto p-4 space-y-6 ${directionClasses.container}`}>
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className={`${showUserInfo ? 'flex items-center gap-4' : ''} ${directionClasses.flex}`}>
          {showUserInfo && (
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar || ''} alt={user.name} />
              <AvatarFallback className="text-sm font-bold">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          )}
          <div className={directionClasses.text}>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
            {showUserInfo && (
              <Badge variant="outline" className="mt-1">
                {user.role}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {headerActions}
          {!headerActions && (
            <>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
                {!isMobile && <span className="ml-2">{language === 'ar' ? 'الإعدادات' : 'Settings'}</span>}
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
                {!isMobile && <span className="ml-2">{language === 'ar' ? 'الإشعارات' : 'Notifications'}</span>}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className={`flex items-center gap-3 ${directionClasses.flex}`}>
                  <div className={`p-2 rounded-lg bg-${stat.variant === 'default' ? 'primary' : stat.variant}/10`}>
                    <stat.icon className={`h-5 w-5 text-${stat.variant === 'default' ? 'primary' : stat.variant}`} />
                  </div>
                  <div className={directionClasses.text}>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                    {stat.trend && (
                      <p className={`text-xs ${stat.trend.isPositive ? 'text-brand-success' : 'text-status-danger'}`}>
                        {stat.trend.isPositive ? '↗' : '↘'} {stat.trend.value}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {showQuickActions && quickActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className={directionClasses.text}>
              {language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={action.onClick}
                  className={`h-auto p-6 flex flex-col items-center gap-4 hover:bg-muted/50 transition-all duration-200 min-h-[140px] ${directionClasses.text}`}
                >
                  <div className={`p-3 rounded-lg ${action.color} text-white shadow-sm`}>
                    <action.icon className="h-8 w-8" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-semibold text-sm leading-tight">{action.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Management */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={directionClasses.text}>
                  {language === 'ar' ? 'المستندات' : 'Documents'}
                </CardTitle>
                <CardDescription className={directionClasses.text}>
                  {language === 'ar' ? 'إدارة المستندات والملفات' : 'Manage documents and files'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
                <Button size="sm" onClick={handleUploadClick}>
                  <Upload className="h-4 w-4" />
                  <span className="ml-2">{language === 'ar' ? 'رفع' : 'Upload'}</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div key={index} className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 ${directionClasses.flex}`}>
                  <div className={`flex items-center gap-3 ${directionClasses.flex}`}>
                    <FileText className="h-8 w-8 text-primary" />
                    <div className={directionClasses.text}>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.type} • {doc.size} • {doc.date}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      if (doc.url || doc.downloadUrl) {
                        window.open(doc.url || doc.downloadUrl, '_blank');
                      }
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs Content */}
      {showTabs && tabs.length > 0 ? (
        <Tabs defaultValue={tabs[0]?.id} className="w-full">
          <TabsList className={`grid w-full ${isMobile && tabs.length > 2 ? 'grid-cols-2' : `grid-cols-${Math.min(tabs.length, 4)}`}`}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        children
      )}
    </div>
  );
};