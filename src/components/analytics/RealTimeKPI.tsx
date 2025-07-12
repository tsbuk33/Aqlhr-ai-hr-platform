import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Bell,
  AlertTriangle,
  CheckCircle,
  Target
} from "lucide-react";

interface KPIAlert {
  id: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
  culturalContext?: string;
  culturalContextAr?: string;
}

interface RealTimeKPIData {
  id: string;
  title: string;
  titleAr: string;
  currentValue: number;
  targetValue: number;
  previousValue: number;
  unit: string;
  format: 'number' | 'percentage' | 'currency';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: number; // percentage change
  culturalBenchmark?: {
    value: number;
    label: string;
    labelAr: string;
  };
  lastUpdated: Date;
}

interface RealTimeKPIProps {
  kpis: RealTimeKPIData[];
  updateInterval?: number; // milliseconds
  showAlerts?: boolean;
}

export const RealTimeKPI = ({ 
  kpis: initialKPIs, 
  updateInterval = 30000, // 30 seconds
  showAlerts = true 
}: RealTimeKPIProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [kpis, setKPIs] = useState(initialKPIs);
  const [alerts, setAlerts] = useState<KPIAlert[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      updateKPIs();
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  const updateKPIs = () => {
    setIsUpdating(true);
    
    // Simulate real-time data updates
    setTimeout(() => {
      setKPIs(prevKPIs => {
        const updatedKPIs = prevKPIs.map(kpi => {
          // Simulate small random changes
          const change = (Math.random() - 0.5) * 0.1; // ±5% change
          const newValue = Math.max(0, kpi.currentValue * (1 + change));
          const newTrend = ((newValue - kpi.currentValue) / kpi.currentValue) * 100;
          
          // Check for alerts
          if (Math.abs(newTrend) > 5) { // Significant change
            const alert: KPIAlert = {
              id: `alert-${Date.now()}-${kpi.id}`,
              title: `${kpi.title} Alert`,
              titleAr: `تنبيه ${kpi.titleAr}`,
              message: `Significant change detected: ${newTrend.toFixed(1)}%`,
              messageAr: `تم اكتشاف تغيير كبير: ${newTrend.toFixed(1)}%`,
              severity: Math.abs(newTrend) > 10 ? 'critical' : 'warning',
              timestamp: new Date(),
              culturalContext: kpi.culturalBenchmark ? 
                `Compared to ${kpi.culturalBenchmark.label}: ${((newValue / kpi.culturalBenchmark.value - 1) * 100).toFixed(1)}%` : 
                undefined,
              culturalContextAr: kpi.culturalBenchmark ? 
                `مقارنة مع ${kpi.culturalBenchmark.labelAr}: ${((newValue / kpi.culturalBenchmark.value - 1) * 100).toFixed(1)}%` : 
                undefined
            };
            
            setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
          }

          return {
            ...kpi,
            previousValue: kpi.currentValue,
            currentValue: newValue,
            trend: newTrend,
            lastUpdated: new Date()
          };
        });
        
        return updatedKPIs;
      });
      
      setLastUpdate(new Date());
      setIsUpdating(false);
    }, 1000);
  };

  const formatValue = (value: number, format: string, unit: string) => {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'currency':
        return `${isRTL ? 'ر.س' : 'SAR'} ${value.toLocaleString()}`;
      default:
        return `${value.toLocaleString()} ${unit}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-primary';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      default: return <CheckCircle className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header with real-time status */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {isRTL ? 'مراقبة مؤشرات الأداء المباشرة' : 'Real-Time KPI Monitoring'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'آخر تحديث:' : 'Last updated:'} {lastUpdate.toLocaleTimeString()}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isUpdating ? "secondary" : "default"} className="gap-1">
                <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-warning animate-pulse' : 'bg-success'}`} />
                {isRTL ? (isUpdating ? 'جاري التحديث' : 'مباشر') : (isUpdating ? 'Updating' : 'Live')}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={updateKPIs} 
                disabled={isUpdating}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
                {isRTL ? 'تحديث' : 'Refresh'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Real-time alerts */}
      {showAlerts && alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-warning" />
              {isRTL ? 'التنبيهات الحية' : 'Live Alerts'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {alerts.slice(0, 5).map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.severity === 'critical' ? 'border-destructive bg-destructive/5' :
                    alert.severity === 'warning' ? 'border-warning bg-warning/5' :
                    'border-primary bg-primary/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getAlertIcon(alert.severity)}
                        <h4 className="font-medium text-sm">
                          {isRTL ? alert.titleAr : alert.title}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {isRTL ? alert.messageAr : alert.message}
                      </p>
                      {alert.culturalContext && (
                        <p className="text-xs text-primary mt-1">
                          {isRTL ? alert.culturalContextAr : alert.culturalContext}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => {
          const progress = (kpi.currentValue / kpi.targetValue) * 100;
          const trendIcon = kpi.trend > 0 ? TrendingUp : kpi.trend < 0 ? TrendingDown : Target;
          
          return (
            <Card key={kpi.id} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm font-medium">
                    {isRTL ? kpi.titleAr : kpi.title}
                  </CardTitle>
                  <Badge variant="outline" className={getStatusColor(kpi.status)}>
                    {isRTL ? 
                      (kpi.status === 'excellent' ? 'ممتاز' : 
                       kpi.status === 'good' ? 'جيد' : 
                       kpi.status === 'warning' ? 'تحذير' : 'حرج') :
                      kpi.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">
                    {formatValue(kpi.currentValue, kpi.format, kpi.unit)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isRTL ? 'الهدف:' : 'Target:'} {formatValue(kpi.targetValue, kpi.format, kpi.unit)}
                  </div>
                </div>

                <Progress value={Math.min(progress, 100)} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {React.createElement(trendIcon, { 
                      className: `h-4 w-4 ${kpi.trend > 0 ? 'text-success' : kpi.trend < 0 ? 'text-destructive' : 'text-muted-foreground'}` 
                    })}
                    <span className={`text-sm ${kpi.trend > 0 ? 'text-success' : kpi.trend < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {Math.abs(kpi.trend).toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {kpi.lastUpdated.toLocaleTimeString()}
                  </span>
                </div>

                {kpi.culturalBenchmark && (
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      {isRTL ? kpi.culturalBenchmark.labelAr : kpi.culturalBenchmark.label}:
                    </div>
                    <div className="text-sm font-medium">
                      {formatValue(kpi.culturalBenchmark.value, kpi.format, kpi.unit)}
                    </div>
                  </div>
                )}
              </CardContent>
              
              {/* Live indicator */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-success rounded-full animate-pulse" />
            </Card>
          );
        })}
      </div>
    </div>
  );
};