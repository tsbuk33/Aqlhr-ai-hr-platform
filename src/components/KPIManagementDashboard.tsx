import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Activity, 
  ChevronRight,
  RefreshCw,
  Download,
  Filter,
  Search
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface KPI {
  id: string;
  kpi_name: string;
  kpi_order: number;
  current_value: number;
  target_value: number;
  unit: string;
}

interface Module {
  id: string;
  name: string;
  name_ar: string;
  category: {
    name: string;
    name_ar: string;
  };
  module_kpis: KPI[];
  performance_score?: number;
  performance_grade?: string;
}

const KPIManagementDashboard = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadModulesAndKPIs();
  }, []);

  const loadModulesAndKPIs = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('modules')
        .select(`
          id,
          name,
          name_ar,
          module_categories!inner(
            name,
            name_ar
          ),
          module_kpis(
            id,
            kpi_name,
            kpi_order,
            current_value,
            target_value,
            unit
          )
        `)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      const formattedModules = data?.map(module => ({
        id: module.id,
        name: module.name,
        name_ar: module.name_ar,
        category: {
          name: module.module_categories.name,
          name_ar: module.module_categories.name_ar
        },
        module_kpis: module.module_kpis.sort((a: any, b: any) => a.kpi_order - b.kpi_order)
      })) || [];

      setModules(formattedModules);
      await calculatePerformanceScores();
    } catch (error) {
      console.error('Error loading modules:', error);
      toast({
        title: "Error",
        description: "Failed to load KPI data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculatePerformanceScores = async () => {
    try {
      const response = await supabase.functions.invoke('kpi-engine/calculate-scores', {
        body: { company_id: 'current-company-id' } // This should come from context
      });

      if (response.error) throw response.error;

      setPerformanceData(response.data.performance_scores);
    } catch (error) {
      console.error('Error calculating performance scores:', error);
    }
  };

  const syncKPIData = async () => {
    try {
      setSyncing(true);
      
      const response = await supabase.functions.invoke('kpi-engine/sync-kpi-data', {
        body: { company_id: 'current-company-id' }
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: `KPI data synchronized successfully`,
      });

      await loadModulesAndKPIs();
    } catch (error) {
      console.error('Error syncing KPI data:', error);
      toast({
        title: "Error",
        description: "Failed to sync KPI data",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  const getKPIStatusColor = (current: number, target: number, unit: string) => {
    if (!current || !target) return 'bg-muted';
    
    const percentage = (current / target) * 100;
    
    if (unit === 'ms' || unit?.includes('Time')) {
      // Lower is better for latency/time metrics
      if (percentage <= 80) return 'bg-green-500';
      if (percentage <= 100) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      // Higher is better for most metrics
      if (percentage >= 95) return 'bg-green-500';
      if (percentage >= 85) return 'bg-yellow-500';
      return 'bg-red-500';
    }
  };

  const getPerformanceGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const categories = ['all', ...new Set(modules.map(m => m.category.name))];
  const filteredModules = selectedCategory === 'all' 
    ? modules 
    : modules.filter(m => m.category.name === selectedCategory);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading KPI Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            KPI Management Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor performance across all 106 AqlHR modules
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={syncKPIData}
            disabled={syncing}
            className="bg-gradient-primary hover:opacity-90"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync KPIs'}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Total Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">{modules.length}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Activity className="h-4 w-4" />
              <span>Active monitoring</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Total KPIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">
              {modules.reduce((sum, m) => sum + m.module_kpis.length, 0)}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Target className="h-4 w-4" />
              <span>Performance metrics</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Avg Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">
              {performanceData.length > 0 
                ? Math.round(performanceData.reduce((sum, p) => sum + p.overall_score, 0) / performanceData.length)
                : 0}%
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <TrendingUp className="h-4 w-4" />
              <span>Overall score</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">{categories.length - 1}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <BarChart3 className="h-4 w-4" />
              <span>Module categories</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-4">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={selectedCategory === category ? "bg-gradient-primary" : ""}
            >
              {category === 'all' ? 'All Categories' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredModules.map(module => {
          const performanceInfo = performanceData.find(p => p.module_id === module.id);
          
          return (
            <Card key={module.id} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-primary opacity-5 rounded-full -translate-y-12 translate-x-12"></div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{module.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {module.category.name}
                    </CardDescription>
                  </div>
                  {performanceInfo && (
                    <Badge 
                      variant="secondary" 
                      className={getPerformanceGradeColor(performanceInfo.performance_grade)}
                    >
                      {performanceInfo.performance_grade}
                    </Badge>
                  )}
                </div>
                
                {performanceInfo && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Overall Performance</span>
                      <span className="font-medium">{performanceInfo.overall_score}%</span>
                    </div>
                    <Progress 
                      value={performanceInfo.overall_score} 
                      className="h-2"
                    />
                  </div>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {module.module_kpis.slice(0, 3).map(kpi => (
                    <div key={kpi.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-3 h-3 rounded-full ${getKPIStatusColor(kpi.current_value, kpi.target_value, kpi.unit)}`}
                        ></div>
                        <span className="text-sm font-medium truncate max-w-[200px]">
                          {kpi.kpi_name}
                        </span>
                      </div>
                      <div className="text-sm font-mono">
                        {kpi.current_value || 0} {kpi.unit}
                      </div>
                    </div>
                  ))}
                  
                  {module.module_kpis.length > 3 && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>+{module.module_kpis.length - 3} more KPIs</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No modules found</h3>
          <p className="text-muted-foreground">Try adjusting your category filter</p>
        </div>
      )}
    </div>
  );
};

export default KPIManagementDashboard;