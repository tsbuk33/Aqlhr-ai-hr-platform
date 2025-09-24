import React, { useState } from 'react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UserManagementInterface } from './admin/UserManagementInterface';
import { SystemConfigurationTools } from './admin/SystemConfigurationTools';
import { SecuritySettingsManagement } from './admin/SecuritySettingsManagement';
import { SystemPerformanceMonitoring } from './admin/SystemPerformanceMonitoring';
import { SystemHealthMonitoring } from './admin/SystemHealthMonitoring';
import { UsageAnalyticsDashboard } from './admin/UsageAnalyticsDashboard';
import { GovernmentIntegrationManagement } from './admin/GovernmentIntegrationManagement';
import { SecurityAuditInterface } from './admin/SecurityAuditInterface';
import { DataSyncManagement } from './admin/DataSyncManagement';
import { APIManagementTools } from './admin/APIManagementTools';
import { ModuleConfiguration } from './admin/ModuleConfiguration';
import { DatabaseManagementInterface } from './admin/DatabaseManagementInterface';
import { MobileAppManagement } from './admin/MobileAppManagement';
import { EmergencySystemControls } from './admin/EmergencySystemControls';
import { 
  Shield, 
  Settings, 
  Users, 
  Activity, 
  Database, 
  Smartphone,
  AlertTriangle,
  BarChart3,
  Lock,
  Zap
} from 'lucide-react';

interface AdminMobileAppProps {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export const AdminMobileApp: React.FC<AdminMobileAppProps> = ({ user }) => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemStatus, setSystemStatus] = useState({
    overall: 'healthy',
    users: 1247,
    activeModules: 14,
    apiCalls: 25847,
    alertsCount: 3
  });

  const tabs = [
    { id: 'dashboard', label: isArabic ? 'لوحة التحكم' : 'Dashboard', icon: BarChart3 },
    { id: 'users', label: isArabic ? 'إدارة المستخدمين' : 'Users', icon: Users },
    { id: 'system', label: isArabic ? 'إعدادات النظام' : 'System', icon: Settings },
    { id: 'security', label: isArabic ? 'الأمان' : 'Security', icon: Shield },
    { id: 'performance', label: isArabic ? 'الأداء' : 'Performance', icon: Activity },
    { id: 'modules', label: isArabic ? 'الوحدات' : 'Modules', icon: Database },
    { id: 'mobile', label: isArabic ? 'المحمول' : 'Mobile', icon: Smartphone },
    { id: 'emergency', label: isArabic ? 'طوارئ' : 'Emergency', icon: AlertTriangle }
  ];

  return (
    <div className="min-h-screen bg-background" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Admin Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {isArabic ? 'لوحة الإدارة' : 'Admin Panel'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'إدارة النظام الكاملة' : 'Complete System Management'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={systemStatus.overall === 'healthy' ? 'default' : 'destructive'}
                className="animate-pulse"
              >
                <Zap className="h-3 w-3 mr-1" />
                {systemStatus.overall === 'healthy' 
                  ? (isArabic ? 'سليم' : 'Healthy')
                  : (isArabic ? 'تحذير' : 'Warning')
                }
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{systemStatus.users.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{isArabic ? 'المستخدمين' : 'Users'}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{systemStatus.activeModules}</div>
              <div className="text-xs text-muted-foreground">{isArabic ? 'الوحدات' : 'Modules'}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{systemStatus.apiCalls.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{isArabic ? 'استدعاءات API' : 'API Calls'}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{systemStatus.alertsCount}</div>
              <div className="text-xs text-muted-foreground">{isArabic ? 'تنبيهات' : 'Alerts'}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-2">
          <div className="flex overflow-x-auto scrollbar-hide gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <SystemHealthMonitoring />
            <UsageAnalyticsDashboard />
          </div>
        )}
        {activeTab === 'users' && <UserManagementInterface />}
        {activeTab === 'system' && (
          <div className="space-y-4">
            <SystemConfigurationTools />
            <GovernmentIntegrationManagement />
          </div>
        )}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <SecuritySettingsManagement />
            <SecurityAuditInterface />
          </div>
        )}
        {activeTab === 'performance' && (
          <div className="space-y-4">
            <SystemPerformanceMonitoring />
            <DataSyncManagement />
            <APIManagementTools />
          </div>
        )}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            <ModuleConfiguration />
            <DatabaseManagementInterface />
          </div>
        )}
        {activeTab === 'mobile' && <MobileAppManagement />}
        {activeTab === 'emergency' && <EmergencySystemControls />}
      </div>
    </div>
  );
};