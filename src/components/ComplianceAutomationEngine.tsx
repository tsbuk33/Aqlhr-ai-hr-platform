import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Shield, CheckCircle, AlertTriangle, Clock, Activity, Zap, Globe, FileCheck } from "lucide-react";

interface ComplianceStatus {
  platform: string;
  status: 'connected' | 'syncing' | 'error' | 'pending';
  lastSync: string;
  compliance: number;
  issues: number;
  autoResolved: number;
  realTimeMonitoring: boolean;
}

interface ComplianceAlert {
  type: 'warning' | 'error' | 'info';
  platform: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoFixable: boolean;
  estimatedTime: string;
}

const ComplianceAutomationEngine = () => {
  const { t } = useLanguage();
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus[]>([]);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [overallCompliance, setOverallCompliance] = useState(96.8);
  const [isRunningFullScan, setIsRunningFullScan] = useState(false);

  useEffect(() => {
    loadComplianceData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadComplianceData, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadComplianceData = async () => {
    // Simulate Saudi government platform compliance data
    const mockStatus: ComplianceStatus[] = [
      {
        platform: "HRSD (Ministry of Human Resources)",
        status: 'connected',
        lastSync: new Date(Date.now() - 120000).toISOString(),
        compliance: 98.5,
        issues: 0,
        autoResolved: 3,
        realTimeMonitoring: true
      },
      {
        platform: "GOSI (General Organization for Social Insurance)",
        status: 'connected',
        lastSync: new Date(Date.now() - 180000).toISOString(),
        compliance: 97.2,
        issues: 1,
        autoResolved: 5,
        realTimeMonitoring: true
      },
      {
        platform: "Qiwa Platform",
        status: 'syncing',
        lastSync: new Date(Date.now() - 300000).toISOString(),
        compliance: 95.8,
        issues: 2,
        autoResolved: 2,
        realTimeMonitoring: true
      },
      {
        platform: "Mudad Platform",
        status: 'connected',
        lastSync: new Date(Date.now() - 240000).toISOString(),
        compliance: 96.4,
        issues: 1,
        autoResolved: 1,
        realTimeMonitoring: true
      },
      {
        platform: "Absher Platform",
        status: 'connected',
        lastSync: new Date(Date.now() - 150000).toISOString(),
        compliance: 99.1,
        issues: 0,
        autoResolved: 0,
        realTimeMonitoring: true
      },
      {
        platform: "ZATCA (Tax Authority)",
        status: 'connected',
        lastSync: new Date(Date.now() - 200000).toISOString(),
        compliance: 94.7,
        issues: 3,
        autoResolved: 4,
        realTimeMonitoring: true
      },
      {
        platform: "NCA Cybersecurity Framework",
        status: 'connected',
        lastSync: new Date(Date.now() - 100000).toISOString(),
        compliance: 97.8,
        issues: 1,
        autoResolved: 6,
        realTimeMonitoring: true
      },
      {
        platform: "Saudi Data Protection Law (PDPL)",
        status: 'connected',
        lastSync: new Date(Date.now() - 90000).toISOString(),
        compliance: 98.9,
        issues: 0,
        autoResolved: 2,
        realTimeMonitoring: true
      }
    ];

    const mockAlerts: ComplianceAlert[] = [
      {
        type: 'warning',
        platform: 'Qiwa',
        message: 'Saudization report due in 3 days',
        severity: 'medium',
        autoFixable: true,
        estimatedTime: '2 minutes'
      },
      {
        type: 'info',
        platform: 'GOSI',
        message: 'New contribution rates effective next month',
        severity: 'low',
        autoFixable: true,
        estimatedTime: '5 minutes'
      },
      {
        type: 'warning',
        platform: 'ZATCA',
        message: 'VAT calculation update required',
        severity: 'medium',
        autoFixable: true,
        estimatedTime: '1 minute'
      }
    ];

    setComplianceStatus(mockStatus);
    setAlerts(mockAlerts);
  };

  const runFullComplianceScan = async () => {
    setIsRunningFullScan(true);
    
    try {
      await supabase.functions.invoke('system-engineer-discovery', {
        body: { 
          action: 'full_compliance_scan',
          platforms: complianceStatus.map(s => s.platform),
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Compliance scan error:', error);
    }
    
    // Simulate comprehensive scan
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await loadComplianceData();
    setIsRunningFullScan(false);
  };

  const autoFixIssue = async (alert: ComplianceAlert) => {
    if (!alert.autoFixable) return;
    
    try {
      await supabase.functions.invoke('system-engineer-discovery', {
        body: { 
          action: 'auto_fix_compliance',
          platform: alert.platform,
          issue: alert.message,
          timestamp: new Date().toISOString()
        }
      });
      
      // Remove the alert from the list
      setAlerts(alerts.filter(a => a !== alert));
    } catch (error) {
      console.error('Auto-fix error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-status-success';
      case 'syncing': return 'bg-brand-primary';
      case 'error': return 'bg-status-error';
      case 'pending': return 'bg-status-warning';
      default: return 'bg-muted';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'connected': return 'default';
      case 'syncing': return 'secondary';
      case 'error': return 'destructive';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-status-error" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-status-warning" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-brand-primary" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-status-error bg-status-error/5';
      case 'high': return 'border-status-error bg-status-error/5';
      case 'medium': return 'border-status-warning bg-status-warning/5';
      case 'low': return 'border-brand-primary bg-brand-primary/5';
      default: return 'border-muted bg-muted/5';
    }
  };

  return (
    <div className="space-y-6">
      {/* Compliance Automation Header */}
      <Card className="bg-gradient-to-r from-status-success/10 to-brand-primary/10 border-2 border-status-success/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-r from-status-success to-brand-primary text-white">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-2xl">{t('system.compliance_automation')}</CardTitle>
                <CardDescription className="text-lg">
                  {t('system.saudi_compliance_desc')}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-status-success">{overallCompliance}%</div>
                <div className="text-sm text-muted-foreground">{t('system.overall_compliance')}</div>
              </div>
              <Button 
                onClick={runFullComplianceScan}
                disabled={isRunningFullScan}
                variant="outline"
              >
                {isRunningFullScan ? (
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileCheck className="h-4 w-4 mr-2" />
                )}
                {t('system.full_scan')}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Government Platform Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('system.government_platforms')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {complianceStatus.map((platform, index) => (
              <Card key={index} className="border-l-4" style={{ borderLeftColor: `hsl(var(--${getStatusColor(platform.status).replace('bg-', '')}))` }}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{platform.platform}</h4>
                      <Badge variant={getStatusBadgeVariant(platform.status)}>
                        {platform.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{t('system.compliance_score')}</span>
                        <span className="font-bold">{platform.compliance}%</span>
                      </div>
                      <Progress value={platform.compliance} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-status-warning" />
                          {platform.issues} {t('system.issues')}
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-status-success" />
                          {platform.autoResolved} {t('system.auto_fixed')}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(platform.lastSync).toLocaleString()}
                      </div>
                      
                      {platform.realTimeMonitoring && (
                        <div className="flex items-center gap-1 text-xs text-status-success">
                          <Activity className="h-3 w-3" />
                          {t('system.real_time_monitoring')}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {t('system.compliance_alerts')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <Card key={index} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <div className="font-medium text-sm">{alert.platform}</div>
                        <div className="text-sm text-muted-foreground">{alert.message}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {alert.severity.toUpperCase()}
                      </Badge>
                      {alert.autoFixable && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => autoFixIssue(alert)}
                          className="text-xs"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          {t('system.auto_fix')} ({alert.estimatedTime})
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {alerts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-status-success" />
                <div className="text-lg font-medium">{t('system.no_compliance_issues')}</div>
                <div className="text-sm">{t('system.all_platforms_compliant')}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceAutomationEngine;