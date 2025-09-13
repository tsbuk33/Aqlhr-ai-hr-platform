import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Activity,
  Shield,
  Cpu,
  Globe
} from 'lucide-react';
import { AutonomousModule } from '@/lib/autonomous/MasterOrchestrator';

interface SystemHealthIndicatorProps {
  modules: AutonomousModule[];
  className?: string;
}

const SystemHealthIndicator: React.FC<SystemHealthIndicatorProps> = ({ 
  modules, 
  className = '' 
}) => {
  // Calculate health metrics
  const totalModules = modules.length;
  const activeModules = modules.filter(m => m.status === 'active').length;
  const errorModules = modules.filter(m => m.status === 'error').length;
  const inactiveModules = modules.filter(m => m.status === 'inactive').length;
  
  const healthPercentage = totalModules > 0 ? Math.round((activeModules / totalModules) * 100) : 0;
  const averageSuccessRate = totalModules > 0 
    ? Math.round(modules.reduce((acc, m) => acc + m.metrics.successRate, 0) / totalModules)
    : 0;
  
  // Determine overall health status
  const getHealthStatus = () => {
    if (healthPercentage >= 90) return { status: 'healthy', color: 'text-green-600', icon: CheckCircle };
    if (healthPercentage >= 70) return { status: 'warning', color: 'text-yellow-600', icon: AlertTriangle };
    return { status: 'critical', color: 'text-red-600', icon: XCircle };
  };
  
  const healthStatus = getHealthStatus();
  const HealthIcon = healthStatus.icon;

  // Calculate category health
  const categoryHealth = modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = { total: 0, active: 0, error: 0 };
    }
    acc[module.category].total += 1;
    if (module.status === 'active') acc[module.category].active += 1;
    if (module.status === 'error') acc[module.category].error += 1;
    return acc;
  }, {} as Record<string, { total: number; active: number; error: number }>);

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          System Health Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Health */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <HealthIcon className={`w-6 h-6 ${healthStatus.color}`} />
            <div>
              <div className="font-semibold capitalize">{healthStatus.status}</div>
              <div className="text-sm text-muted-foreground">
                {activeModules}/{totalModules} modules active
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{healthPercentage}%</div>
            <div className="text-sm text-muted-foreground">Health Score</div>
          </div>
        </div>

        {/* Health Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>System Health</span>
            <span>{healthPercentage}%</span>
          </div>
          <Progress value={healthPercentage} className="h-3" />
        </div>

        {/* Module Status Breakdown */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">{activeModules}</div>
            <div className="text-xs text-green-700">Active</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded">
            <div className="text-lg font-bold text-yellow-600">{inactiveModules}</div>
            <div className="text-xs text-yellow-700">Inactive</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded">
            <div className="text-lg font-bold text-red-600">{errorModules}</div>
            <div className="text-xs text-red-700">Error</div>
          </div>
        </div>

        {/* Category Health */}
        <div className="space-y-2">
          <div className="font-medium text-sm">Category Health</div>
          {Object.entries(categoryHealth).map(([category, health]) => {
            const categoryHealthPercentage = Math.round((health.active / health.total) * 100);
            const categoryIcon = {
              'coreHR': Cpu,
              'government': Globe,
              'aiAnalytics': Activity,
              'testing': Shield
            }[category] || Activity;
            const CategoryIcon = categoryIcon;
            
            return (
              <div key={category} className="flex items-center gap-2">
                <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{category.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                    <span>{health.active}/{health.total}</span>
                  </div>
                  <Progress value={categoryHealthPercentage} className="h-1 mt-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Metrics */}
        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span>Average Success Rate</span>
            <Badge variant={averageSuccessRate >= 95 ? 'default' : averageSuccessRate >= 85 ? 'secondary' : 'destructive'}>
              {averageSuccessRate}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthIndicator;