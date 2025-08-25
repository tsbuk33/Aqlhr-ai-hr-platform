import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckCircle, Clock, ExternalLink, Play, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Import types and functions separately to avoid circular dependencies
import type { RouteAuditResult } from '@/lib/dev/routeSentinel';
import type { RouteInfo } from '@/lib/dev/routesIndex';

// Simple interface for UI events to avoid complex Supabase type inference
interface UiEventData {
  id: string;
  created_at: string;
  page: string;
  level: string;
  message: string;
  details: any;
  event_type: string;
}

export default function RouteAudit() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<RouteAuditResult[]>([]);
  const [filters, setFilters] = useState({
    module: 'all',
    status: 'all',
    hasI18nIssues: false,
    hideOk: false
  });

  // Auto-run audit if ?dev=1&auto=1
  useEffect(() => {
    const isDevMode = searchParams.has('dev');
    const isAutoMode = searchParams.has('auto');
    
    if (isDevMode && isAutoMode && results.length === 0) {
      handleRunBothAudits();
    }
  }, [searchParams]);

  // Load previous results from ui_events
  useEffect(() => {
    loadPreviousResults();
  }, []);

  const loadPreviousResults = async () => {
    try {
      const response = await supabase
        .from('ui_events')
        .select('id, created_at, page, level, message, details')
        .eq('page', 'route_audit')
        .order('created_at', { ascending: false })
        .limit(100);

      if (response.error) throw response.error;

      const data = response.data || [];
      const latestResults: RouteAuditResult[] = [];
      const seenRoutes = new Set<string>();

      data.forEach((event: any) => {
        const details = event.details;
        if (!details || !details.route || !details.lang) return;

        const routeKey = `${details.route}-${details.lang}`;
        if (seenRoutes.has(routeKey)) return;
        seenRoutes.add(routeKey);

        latestResults.push({
          route: details.route,
          lang: details.lang,
          status: details.status || 'error',
          mountMs: details.mountMs || 0,
          errorMessage: details.errorMessage,
          i18nMissingCount: details.i18nMissingCount || 0,
          rtlOk: details.rtlOk !== false
        });
      });

      setResults(latestResults);
    } catch (error) {
      console.error('Failed to load previous results:', error);
    }
  };

  const handleRunAudit = async (lang: 'en' | 'ar') => {
    setIsRunning(true);
    try {
      // Dynamic import to avoid circular dependencies
      const { runRouteAudit } = await import('@/lib/dev/routeSentinel');
      const auditResults = await runRouteAudit({ lang });
      
      // Merge with existing results (replace same route+lang)
      setResults(prev => {
        const filtered = prev.filter(r => !(auditResults.some(ar => ar.route === r.route && ar.lang === r.lang)));
        return [...filtered, ...auditResults];
      });
      
      toast({
        title: `${lang.toUpperCase()} Audit Complete`,
        description: `Tested ${auditResults.length} routes. ${auditResults.filter(r => r.status === 'ok').length} passed.`
      });
    } catch (error) {
      toast({
        title: 'Audit Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunBothAudits = async () => {
    setIsRunning(true);
    try {
      await handleRunAudit('en');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause
      await handleRunAudit('ar');
    } catch (error) {
      toast({
        title: 'Audit Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleQuickTest = async (routeInfo: RouteInfo, lang: 'en' | 'ar') => {
    setIsRunning(true);
    try {
      // Dynamic import to avoid circular dependencies
      const { testSingleRoute } = await import('@/lib/dev/routeSentinel');
      const result = await testSingleRoute(routeInfo, lang);
      
      // Update results
      setResults(prev => {
        const filtered = prev.filter(r => !(r.route === result.route && r.lang === result.lang));
        return [...filtered, result];
      });
      
      toast({
        title: 'Quick Test Complete',
        description: `${routeInfo.path} (${lang}): ${result.status}`
      });
    } catch (error) {
      toast({
        title: 'Test Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getRouteResult = (route: string, lang: string) => {
    return results.find(r => r.route === route && r.lang === lang);
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'ok': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'timeout': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <div className="h-4 w-4 bg-gray-300 rounded" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    const variant = status === 'ok' ? 'default' : status === 'error' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{status || 'untested'}</Badge>;
  };

  // Get routes data
  const [routesData, setRoutesData] = useState<{ routes: RouteInfo[], modules: string[] }>({ 
    routes: [], 
    modules: [] 
  });

  useEffect(() => {
    // Dynamic import to get route data
    import('@/lib/dev/routesIndex').then(({ NAVIGABLE_ROUTES, getAllModules }) => {
      setRoutesData({
        routes: NAVIGABLE_ROUTES,
        modules: getAllModules()
      });
    });
  }, []);

  // Apply filters
  const filteredRoutes = routesData.routes.filter(route => {
    if (filters.module !== 'all' && route.module !== filters.module) return false;
    
    const enResult = getRouteResult(route.path, 'en');
    const arResult = getRouteResult(route.path, 'ar');
    
    if (filters.status !== 'all') {
      const hasStatus = enResult?.status === filters.status || arResult?.status === filters.status;
      if (!hasStatus) return false;
    }
    
    if (filters.hasI18nIssues) {
      const hasIssues = (enResult?.i18nMissingCount || 0) > 0 || (arResult?.i18nMissingCount || 0) > 0;
      if (!hasIssues) return false;
    }
    
    if (filters.hideOk) {
      const allOk = enResult?.status === 'ok' && arResult?.status === 'ok';
      if (allOk) return false;
    }
    
    return true;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Route Audit System
          </CardTitle>
          <CardDescription>
            Automated testing of all application routes for render status, timing, and i18n compliance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Control Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => handleRunAudit('en')} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Run EN Audit
            </Button>
            <Button 
              onClick={() => handleRunAudit('ar')} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Run AR Audit
            </Button>
            <Button 
              onClick={handleRunBothAudits} 
              disabled={isRunning}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Run Both
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-center flex-wrap">
            <Select value={filters.module} onValueChange={(value) => setFilters(prev => ({ ...prev, module: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {routesData.modules.map(module => (
                  <SelectItem key={module} value={module}>{module}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ok">OK</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="timeout">Timeout</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="i18n-issues" 
                checked={filters.hasI18nIssues}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasI18nIssues: !!checked }))}
              />
              <label htmlFor="i18n-issues" className="text-sm">Has i18n Issues</label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hide-ok" 
                checked={filters.hideOk}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hideOk: !!checked }))}
              />
              <label htmlFor="hide-ok" className="text-sm">Hide OK</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Route Test Results ({filteredRoutes.length} routes)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredRoutes.map(route => {
              const enResult = getRouteResult(route.path, 'en');
              const arResult = getRouteResult(route.path, 'ar');
              
              return (
                <div key={route.path} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{route.path}</div>
                      <div className="text-sm text-muted-foreground">{route.module} • {route.title}</div>
                    </div>
                    
                    {/* EN Status */}
                    <div className="flex items-center gap-2">
                      {getStatusIcon(enResult?.status)}
                      <span className="text-sm font-mono">{enResult?.mountMs || 0}ms</span>
                      {(enResult?.i18nMissingCount || 0) > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {enResult?.i18nMissingCount} i18n
                        </Badge>
                      )}
                    </div>
                    
                    {/* AR Status */}
                    <div className="flex items-center gap-2">
                      {getStatusIcon(arResult?.status)}
                      <span className="text-sm font-mono">{arResult?.mountMs || 0}ms</span>
                      {!arResult?.rtlOk && <Badge variant="outline" className="text-xs">RTL</Badge>}
                      {(arResult?.i18nMissingCount || 0) > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {arResult?.i18nMissingCount} i18n
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleQuickTest(route, 'en')}
                      disabled={isRunning}
                    >
                      Test EN
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleQuickTest(route, 'ar')}
                      disabled={isRunning}
                    >
                      Test AR
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`/en${route.path}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}