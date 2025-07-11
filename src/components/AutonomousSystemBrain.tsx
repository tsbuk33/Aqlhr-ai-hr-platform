import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Zap, Shield, TrendingUp, Activity, CheckCircle, AlertTriangle, Cpu } from "lucide-react";

interface SystemHealth {
  overallScore: number;
  components: {
    name: string;
    score: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    issues: string[];
    autoHealed: number;
  }[];
  predictiveAlerts: {
    type: string;
    probability: number;
    timeframe: string;
    mitigation: string;
  }[];
  autonomousActions: {
    action: string;
    timestamp: string;
    success: boolean;
    impact: string;
  }[];
}

const AutonomousSystemBrain = () => {
  const { t } = useLanguage();
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [autonomousMode, setAutonomousMode] = useState(true);

  useEffect(() => {
    loadSystemHealth();
    
    // Auto-refresh every 30 seconds in autonomous mode
    const interval = setInterval(() => {
      if (autonomousMode) {
        runAutonomousDiagnostics();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [autonomousMode]);

  const loadSystemHealth = async () => {
    // Simulate advanced system health analytics
    const mockHealth: SystemHealth = {
      overallScore: 97.3,
      components: [
        {
          name: "Core HR Modules",
          score: 98.5,
          status: 'excellent',
          issues: [],
          autoHealed: 3
        },
        {
          name: "Government Integrations",
          score: 96.2,
          status: 'excellent',
          issues: [],
          autoHealed: 1
        },
        {
          name: "AI Translation Engine",
          score: 99.1,
          status: 'excellent',
          issues: [],
          autoHealed: 0
        },
        {
          name: "Security Framework",
          score: 95.8,
          status: 'good',
          issues: ["Minor SSL certificate renewal needed"],
          autoHealed: 2
        },
        {
          name: "Performance Optimization",
          score: 94.7,
          status: 'good',
          issues: ["Database query optimization pending"],
          autoHealed: 5
        }
      ],
      predictiveAlerts: [
        {
          type: "Saudization Compliance",
          probability: 0.12,
          timeframe: "Next 30 days",
          mitigation: "Automated recruitment pipeline activated"
        },
        {
          type: "System Load Increase",
          probability: 0.23,
          timeframe: "Next 7 days",
          mitigation: "Auto-scaling resources prepared"
        }
      ],
      autonomousActions: [
        {
          action: "Database connection pool optimized",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          success: true,
          impact: "Response time improved by 15%"
        },
        {
          action: "Security certificates auto-renewed",
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          success: true,
          impact: "Prevented security vulnerability"
        },
        {
          action: "Translation cache invalidated and rebuilt",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          success: true,
          impact: "Bilingual accuracy improved to 99.1%"
        }
      ]
    };

    setSystemHealth(mockHealth);
  };

  const runAutonomousDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    
    // Simulate advanced autonomous diagnostics
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Call the system engineer discovery function
    try {
      await supabase.functions.invoke('system-engineer-discovery', {
        body: { action: 'autonomous_diagnostics', timestamp: new Date().toISOString() }
      });
    } catch (error) {
      console.error('Autonomous diagnostics error:', error);
    }
    
    await loadSystemHealth();
    setIsRunningDiagnostics(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-status-success';
      case 'good': return 'bg-brand-primary';
      case 'warning': return 'bg-status-warning';
      case 'critical': return 'bg-status-error';
      default: return 'bg-muted';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'warning': return 'outline';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  if (!systemHealth) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-64 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Autonomous System Brain Header */}
      <Card className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 border-2 border-brand-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent text-white">
                <Brain className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-2xl">{t('system.autonomous_brain')}</CardTitle>
                <CardDescription className="text-lg">
                  {t('system.autonomous_brain_desc')}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-brand-primary">{systemHealth.overallScore}%</div>
                <div className="text-sm text-muted-foreground">{t('system.system_health')}</div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={runAutonomousDiagnostics}
                  disabled={isRunningDiagnostics}
                  variant="outline"
                  size="sm"
                >
                  {isRunningDiagnostics ? (
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Cpu className="h-4 w-4 mr-2" />
                  )}
                  {t('system.run_diagnostics')}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* System Components Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('system.component_health')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemHealth.components.map((component, index) => (
              <Card key={index} className="border-l-4" style={{ borderLeftColor: `hsl(var(--${getStatusColor(component.status).replace('bg-', '')}))` }}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{component.name}</h4>
                    <Badge variant={getStatusBadgeVariant(component.status)}>
                      {component.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{t('system.health_score')}</span>
                      <span className="font-bold">{component.score}%</span>
                    </div>
                    <Progress value={component.score} className="h-2" />
                    {component.autoHealed > 0 && (
                      <div className="flex items-center gap-1 text-xs text-status-success">
                        <CheckCircle className="h-3 w-3" />
                        {component.autoHealed} {t('system.auto_healed')}
                      </div>
                    )}
                    {component.issues.length > 0 && (
                      <div className="space-y-1">
                        {component.issues.map((issue, i) => (
                          <div key={i} className="flex items-center gap-1 text-xs text-status-warning">
                            <AlertTriangle className="h-3 w-3" />
                            {issue}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('system.predictive_analytics')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemHealth.predictiveAlerts.map((alert, index) => (
              <Card key={index} className="border border-brand-accent/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{alert.type}</h4>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(alert.probability * 100)}% {t('system.probability')}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t('system.timeframe')}: </span>
                      <span>{alert.timeframe}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t('system.mitigation')}: </span>
                      <span className="text-status-success">{alert.mitigation}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Autonomous Actions Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {t('system.autonomous_actions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemHealth.autonomousActions.map((action, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${action.success ? 'bg-status-success/20 text-status-success' : 'bg-status-error/20 text-status-error'}`}>
                    {action.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{action.action}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(action.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-status-success font-medium">{action.impact}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutonomousSystemBrain;