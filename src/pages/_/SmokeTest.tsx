import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Globe, Filter, Play, RefreshCw } from 'lucide-react';
import { resolveLang } from '@/lib/i18n/localePath';

// Extended route list covering all major application routes
const ALL_ROUTES = [
  // Core Dashboard & Main
  { path: '/dashboard', module: 'dashboard', title: 'Dashboard', critical: true },
  { path: '/auth', module: 'auth', title: 'Authentication', critical: true, requiresAuth: false },
  
  // Employee Management
  { path: '/employees', module: 'hr', title: 'Employee Master Data', critical: true },
  { path: '/people/employees', module: 'hr', title: 'Employee List' },
  
  // Core HR Modules
  { path: '/recruitment', module: 'recruitment', title: 'Recruitment', critical: true },
  { path: '/payroll', module: 'payroll', title: 'Payroll', critical: true },
  { path: '/performance', module: 'performance', title: 'Performance Management' },
  { path: '/training', module: 'training', title: 'Training & Development' },
  
  // Diagnostic & Analytics
  { path: '/diagnostic/hub', module: 'diagnostic', title: 'Diagnostic Hub', critical: true },
  { path: '/diagnostic/retention', module: 'diagnostic', title: 'Retention Analysis', critical: true },
  { path: '/diagnostic/osi', module: 'diagnostic', title: 'OSI Overview', critical: true },
  { path: '/analytics', module: 'analytics', title: 'Analytics' },
  
  // Government Compliance
  { path: '/government', module: 'government', title: 'Government Compliance', critical: true },
  { path: '/integrations', module: 'integrations', title: 'Integrations' },
  
  // Executive & Management
  { path: '/executive-center', module: 'executive', title: 'Executive Intelligence Center' },
  { path: '/company', module: 'company', title: 'Company Settings' },
  
  // AI & Tools
  { path: '/ai-test', module: 'ai', title: 'AI System Testing' },
  { path: '/tools', module: 'tools', title: 'Tools & Utilities' },
  { path: '/help', module: 'help', title: 'Help & Support' },
  
  // AI Ecosystem
  { path: '/ai-ecosystem/workforce-optimizer', module: 'ai', title: 'Workforce Optimizer' },
  { path: '/ai-ecosystem/reporting-engine', module: 'ai', title: 'Reporting Engine' },
  
  // Admin & Settings
  { path: '/profile', module: 'profile', title: 'User Profile' },
  { path: '/admin/users', module: 'admin', title: 'User Management' },
  { path: '/admin/company', module: 'admin', title: 'Company Administration' },
  { path: '/admin/ai-integration', module: 'admin', title: 'AI Integration Dashboard' },
  
  // Health & Development
  { path: '/_/ping', module: 'dev', title: 'Health Check', requiresAuth: false },
  { path: '/_/route-audit', module: 'dev', title: 'Route Audit System' },
  { path: '/_/smoke', module: 'dev', title: 'Smoke Test', requiresAuth: false },
  
  // Additional commonly accessed routes
  { path: '/attendance', module: 'attendance', title: 'Attendance Management' },
  { path: '/leave', module: 'leave', title: 'Leave Management' },
  { path: '/documents', module: 'documents', title: 'Document Management' },
  { path: '/reports', module: 'reports', title: 'Reports & Insights' },
  { path: '/settings', module: 'settings', title: 'System Settings' },
  { path: '/notifications', module: 'notifications', title: 'Notifications' },
  { path: '/audit', module: 'audit', title: 'Audit Logs' },
  { path: '/compliance', module: 'compliance', title: 'Compliance Dashboard' },
  { path: '/workflow', module: 'workflow', title: 'Workflow Management' },
  { path: '/calendar', module: 'calendar', title: 'Calendar & Events' },
];

interface RouteStatus {
  path: string;
  lang: 'en' | 'ar';
  status: 'idle' | 'testing' | 'success' | 'error';
  statusCode?: number;
  responseTime?: number;
  error?: string;
  timestamp?: number;
}

export default function SmokeTest() {
  const [routeStatuses, setRouteStatuses] = useState<RouteStatus[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [filter, setFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const isArabic = resolveLang() === 'ar';

  // Initialize route statuses
  useEffect(() => {
    const initialStatuses: RouteStatus[] = [];
    
    ALL_ROUTES.forEach(route => {
      initialStatuses.push(
        { path: route.path, lang: 'en', status: 'idle' },
        { path: route.path, lang: 'ar', status: 'idle' }
      );
    });
    
    setRouteStatuses(initialStatuses);
  }, []);

  const testSingleRoute = async (path: string, lang: 'en' | 'ar'): Promise<void> => {
    const fullUrl = `${window.location.origin}/${lang}${path}${path.includes('?') ? '&dev=1' : '?dev=1'}`;
    const startTime = Date.now();
    
    setRouteStatuses(prev => prev.map(route => 
      route.path === path && route.lang === lang
        ? { ...route, status: 'testing', timestamp: startTime }
        : route
    ));

    try {
      const response = await fetch(fullUrl, { 
        method: 'HEAD',
        mode: 'cors',
        credentials: 'same-origin'
      });
      
      const responseTime = Date.now() - startTime;
      
      setRouteStatuses(prev => prev.map(route => 
        route.path === path && route.lang === lang
          ? { 
              ...route, 
              status: response.ok ? 'success' : 'error',
              statusCode: response.status,
              responseTime,
              error: response.ok ? undefined : `HTTP ${response.status}`
            }
          : route
      ));
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      setRouteStatuses(prev => prev.map(route => 
        route.path === path && route.lang === lang
          ? { 
              ...route, 
              status: 'error',
              responseTime,
              error: error.message || 'Network error'
            }
          : route
      ));
    }
  };

  const runFullSmokeTest = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    
    // Reset all statuses
    setRouteStatuses(prev => prev.map(route => ({ 
      ...route, 
      status: 'idle', 
      statusCode: undefined, 
      responseTime: undefined, 
      error: undefined 
    })));

    // Test all routes in batches to avoid overwhelming the server
    const batchSize = 5;
    const routes = ALL_ROUTES;
    
    for (let i = 0; i < routes.length; i += batchSize) {
      const batch = routes.slice(i, i + batchSize);
      
      // Test both EN and AR for each route in parallel
      const promises = batch.flatMap(route => [
        testSingleRoute(route.path, 'en'),
        testSingleRoute(route.path, 'ar')
      ]);
      
      await Promise.all(promises);
      
      // Small delay between batches
      if (i + batchSize < routes.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    setIsRunning(false);
  };

  const resetTests = () => {
    setRouteStatuses(prev => prev.map(route => ({ 
      ...route, 
      status: 'idle', 
      statusCode: undefined, 
      responseTime: undefined, 
      error: undefined 
    })));
  };

  // Filter routes based on current filters
  const filteredRoutes = routeStatuses.filter(route => {
    const routeConfig = ALL_ROUTES.find(r => r.path === route.path);
    if (!routeConfig) return false;

    // Status filter
    if (filter !== 'all' && route.status !== filter) return false;
    
    // Module filter
    if (moduleFilter && routeConfig.module !== moduleFilter) return false;
    
    // Search filter
    if (searchFilter && !routeConfig.title.toLowerCase().includes(searchFilter.toLowerCase()) 
        && !route.path.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Statistics
  const stats = {
    total: routeStatuses.length,
    success: routeStatuses.filter(r => r.status === 'success').length,
    error: routeStatuses.filter(r => r.status === 'error').length,
    testing: routeStatuses.filter(r => r.status === 'testing').length,
    idle: routeStatuses.filter(r => r.status === 'idle').length
  };

  const getStatusIcon = (status: RouteStatus['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'testing': return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      default: return <div className="h-4 w-4 rounded-full border-2 border-muted" />;
    }
  };

  const getStatusBadgeVariant = (status: RouteStatus['status']) => {
    switch (status) {
      case 'success': return 'default';
      case 'error': return 'destructive';
      case 'testing': return 'secondary';
      default: return 'outline';
    }
  };

  const allModules = [...new Set(ALL_ROUTES.map(r => r.module))].sort();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isArabic ? 'اختبار شامل للمسارات' : 'Comprehensive Route Smoke Test'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isArabic 
              ? 'اختبار جميع مسارات التطبيق في اللغتين الإنجليزية والعربية'
              : 'Test all application routes in both English and Arabic'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={resetTests} 
            variant="outline"
            disabled={isRunning}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {isArabic ? 'إعادة تعيين' : 'Reset'}
          </Button>
          <Button 
            onClick={runFullSmokeTest}
            disabled={isRunning}
            size="lg"
          >
            {isRunning ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-pulse" />
                {isArabic ? 'جاري الاختبار...' : 'Testing...'}
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                {isArabic ? 'تشغيل الاختبار الكامل' : 'Run Full Test'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">
              {isArabic ? 'المجموع' : 'Total'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.success}</div>
            <div className="text-sm text-muted-foreground">
              {isArabic ? 'نجح' : 'Success'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.error}</div>
            <div className="text-sm text-muted-foreground">
              {isArabic ? 'فشل' : 'Failed'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.testing}</div>
            <div className="text-sm text-muted-foreground">
              {isArabic ? 'جاري الاختبار' : 'Testing'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{Math.round((stats.success / stats.total) * 100) || 0}%</div>
            <div className="text-sm text-muted-foreground">
              {isArabic ? 'معدل النجاح' : 'Success Rate'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="all">{isArabic ? 'جميع الحالات' : 'All Status'}</option>
                <option value="success">{isArabic ? 'نجح' : 'Success'}</option>
                <option value="error">{isArabic ? 'فشل' : 'Error'}</option>
                <option value="testing">{isArabic ? 'جاري الاختبار' : 'Testing'}</option>
                <option value="idle">{isArabic ? 'في الانتظار' : 'Idle'}</option>
              </select>
            </div>
            
            <select 
              value={moduleFilter} 
              onChange={(e) => setModuleFilter(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">{isArabic ? 'جميع الوحدات' : 'All Modules'}</option>
              {allModules.map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
            
            <Input
              placeholder={isArabic ? 'البحث في المسارات...' : 'Search routes...'}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-64"
            />
          </div>
        </CardContent>
      </Card>

      {/* Route Tables */}
      <Tabs defaultValue="combined" className="space-y-4">
        <TabsList>
          <TabsTrigger value="combined">
            {isArabic ? 'مدمج' : 'Combined'}
          </TabsTrigger>
          <TabsTrigger value="english">
            {isArabic ? 'الإنجليزية فقط' : 'English Only'}
          </TabsTrigger>
          <TabsTrigger value="arabic">
            {isArabic ? 'العربية فقط' : 'Arabic Only'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="combined">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {isArabic ? 'جميع المسارات (إنجليزي + عربي)' : 'All Routes (EN + AR)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {ALL_ROUTES.map(route => {
                  const enRoute = routeStatuses.find(r => r.path === route.path && r.lang === 'en');
                  const arRoute = routeStatuses.find(r => r.path === route.path && r.lang === 'ar');
                  
                  return (
                    <div key={route.path} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{route.module}</Badge>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{route.path}</code>
                        <span className="font-medium">{route.title}</span>
                        {route.critical && (
                          <Badge variant="destructive" className="text-xs">
                            {isArabic ? 'حرج' : 'Critical'}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* English Status */}
                        <div className="flex items-center gap-2">
                          {getStatusIcon(enRoute?.status || 'idle')}
                          <Badge variant={getStatusBadgeVariant(enRoute?.status || 'idle')}>
                            EN
                          </Badge>
                          {enRoute?.responseTime && (
                            <span className="text-xs text-muted-foreground">
                              {enRoute.responseTime}ms
                            </span>
                          )}
                        </div>
                        
                        {/* Arabic Status */}
                        <div className="flex items-center gap-2">
                          {getStatusIcon(arRoute?.status || 'idle')}
                          <Badge variant={getStatusBadgeVariant(arRoute?.status || 'idle')}>
                            AR
                          </Badge>
                          {arRoute?.responseTime && (
                            <span className="text-xs text-muted-foreground">
                              {arRoute.responseTime}ms
                            </span>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            testSingleRoute(route.path, 'en');
                            testSingleRoute(route.path, 'ar');
                          }}
                          disabled={isRunning}
                        >
                          {isArabic ? 'اختبار' : 'Test'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="english">
          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? 'المسارات الإنجليزية' : 'English Routes'}</CardTitle>
            </CardHeader>
            <CardContent>
              <RouteTable 
                routes={filteredRoutes.filter(r => r.lang === 'en')} 
                isArabic={isArabic}
                onTest={(path) => testSingleRoute(path, 'en')}
                isRunning={isRunning}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arabic">
          <Card>
            <CardHeader>
              <CardTitle>{isArabic ? 'المسارات العربية' : 'Arabic Routes'}</CardTitle>
            </CardHeader>
            <CardContent>
              <RouteTable 
                routes={filteredRoutes.filter(r => r.lang === 'ar')} 
                isArabic={isArabic}
                onTest={(path) => testSingleRoute(path, 'ar')}
                isRunning={isRunning}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper component for route tables
interface RouteTableProps {
  routes: RouteStatus[];
  isArabic: boolean;
  onTest: (path: string) => void;
  isRunning: boolean;
}

const RouteTable: React.FC<RouteTableProps> = ({ routes, isArabic, onTest, isRunning }) => {
  const getStatusIcon = (status: RouteStatus['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'testing': return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      default: return <div className="h-4 w-4 rounded-full border-2 border-muted" />;
    }
  };

  const getStatusBadgeVariant = (status: RouteStatus['status']) => {
    switch (status) {
      case 'success': return 'default';
      case 'error': return 'destructive';
      case 'testing': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-2">
      {routes.map(route => {
        const routeConfig = ALL_ROUTES.find(r => r.path === route.path);
        return (
          <div key={`${route.path}-${route.lang}`} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Badge variant="outline">{routeConfig?.module}</Badge>
              <code className="text-sm bg-muted px-2 py-1 rounded">{route.path}</code>
              <span className="font-medium">{routeConfig?.title}</span>
              {routeConfig?.critical && (
                <Badge variant="destructive" className="text-xs">
                  {isArabic ? 'حرج' : 'Critical'}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {getStatusIcon(route.status)}
              <Badge variant={getStatusBadgeVariant(route.status)}>
                {route.lang.toUpperCase()}
              </Badge>
              {route.responseTime && (
                <span className="text-xs text-muted-foreground">
                  {route.responseTime}ms
                </span>
              )}
              {route.error && (
                <span className="text-xs text-red-600">
                  {route.error}
                </span>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onTest(route.path)}
                disabled={isRunning}
              >
                {isArabic ? 'اختبار' : 'Test'}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};