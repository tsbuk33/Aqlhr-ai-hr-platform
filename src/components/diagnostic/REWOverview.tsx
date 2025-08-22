import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Users, Clock, TrendingUp, Shield, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface REWData {
  risk_score: number;
  top_drivers: Array<{
    driver: string;
    score: number;
    weight: number;
  }>;
  sample_size: number;
  created_at: string;
}

interface REWOverviewProps {
  caseId: string;
}

const REWOverview = ({ caseId }: REWOverviewProps) => {
  const [data, setData] = useState<REWData | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (caseId) {
      fetchREWData();
    }
  }, [caseId]);

  const fetchREWData = async () => {
    try {
      setLoading(true);
      const { data: rewData, error } = await supabase.rpc('rew_get_overview_v1', {
        p_case_id: caseId
      });

      if (error) {
        console.error('Error fetching REW data:', error);
        return;
      }

      setData(rewData ? (rewData as unknown as REWData) : null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const runREWAnalysis = async () => {
    try {
      setRunningAnalysis(true);
      
      const { data: result, error } = await supabase.functions.invoke('rew-run-v1', {
        body: { caseId }
      });

      if (error) throw error;

      toast({
        title: "REW Analysis Complete",
        description: `Risk analysis completed with ${result.initiativesCount} action items generated.`,
      });

      // Refresh data
      await fetchREWData();
    } catch (error) {
      console.error('Error running REW analysis:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to run retention early warning analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRunningAnalysis(false);
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: 'High', color: 'destructive' };
    if (score >= 40) return { level: 'Medium', color: 'warning' };
    return { level: 'Low', color: 'default' };
  };

  const getDriverIcon = (driver: string) => {
    switch (driver) {
      case 'psychological_safety': return <Shield className="h-4 w-4" />;
      case 'management_overload': return <Users className="h-4 w-4" />;
      case 'contract_expiry': return <Clock className="h-4 w-4" />;
      case 'compensation_gap': return <DollarSign className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getDriverName = (driver: string) => {
    const names: Record<string, string> = {
      psychological_safety: 'Psychological Safety',
      management_overload: 'Management Overload',
      attendance_patterns: 'Attendance Issues',
      grievances: 'Grievances',
      contract_expiry: 'Contract Expiry',
      compensation_gap: 'Compensation Gap'
    };
    return names[driver] || driver;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No REW Analysis Found</h3>
        <p className="text-muted-foreground mb-6">
          Run a retention early warning analysis to identify at-risk employees and departments.
        </p>
        <Button onClick={runREWAnalysis} disabled={runningAnalysis}>
          {runningAnalysis ? 'Running Analysis...' : 'Run REW Analysis'}
        </Button>
      </div>
    );
  }

  const risk = getRiskLevel(data.risk_score);
  const highRiskDrivers = data.top_drivers.filter(d => d.score > 30);

  return (
    <div className="space-y-6">
      {/* Risk Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{Math.round(data.risk_score)}%</div>
              <Badge variant={risk.color as any}>{risk.level}</Badge>
            </div>
            <Progress value={data.risk_score} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Risk Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-2xl font-bold">{highRiskDrivers.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sample Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{data.sample_size}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {new Date(data.created_at).toLocaleDateString()}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={runREWAnalysis}
              disabled={runningAnalysis}
            >
              {runningAnalysis ? 'Running...' : 'Refresh Analysis'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Risk Drivers Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Drivers Analysis</CardTitle>
          <CardDescription>
            Key factors contributing to retention risk across your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.top_drivers
              .sort((a, b) => b.score - a.score)
              .map((driver, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getDriverIcon(driver.driver)}
                    <div>
                      <div className="font-medium">{getDriverName(driver.driver)}</div>
                      <div className="text-sm text-muted-foreground">
                        Weight: {Math.round(driver.weight * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Progress value={driver.score} className="w-24" />
                    <span className="text-sm font-medium min-w-[3rem]">
                      {Math.round(driver.score)}%
                    </span>
                    {driver.score > 30 && (
                      <Badge variant="destructive">High Risk</Badge>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts for High Risk */}
      {data.risk_score > 70 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>High Retention Risk Detected:</strong> Immediate action required to address 
            {highRiskDrivers.length} critical risk factors. Review the playbook for specific action items.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default REWOverview;