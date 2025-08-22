import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useEntitlement } from "@/hooks/useEntitlement";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  TrendingUp, 
  Layers, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";

interface OSIData {
  headcount: number;
  managers: number;
  span_avg: number;
  span_p90: number;
  layers_depth: number;
  saudization: number;
  female_pct: number;
  cost_total: number;
  cost_to_manage: number;
  manager_overload_n: number;
  duplicate_titles_n: number;
  flags: string[];
  created_at: string;
}

interface OSIOverviewProps {
  caseId: string;
}

export const OSIOverview = ({ caseId }: OSIOverviewProps) => {
  const [data, setData] = useState<OSIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  const { hasEntitlement } = useEntitlement('SKU_OSI');

  useEffect(() => {
    fetchOSIData();
  }, [caseId]);

  const fetchOSIData = async () => {
    try {
      setLoading(true);
      const { data: osiData, error } = await supabase
        .rpc('osi_get_overview_v1', { p_case_id: caseId });

      if (error) throw error;
      setData(osiData as unknown as OSIData);
    } catch (error) {
      console.error('Error fetching OSI data:', error);
      toast({
        title: "Error",
        description: "Failed to load organizational data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runOSIAnalysis = async () => {
    if (!hasEntitlement) {
      toast({
        title: "Upgrade Required",
        description: "OSI analysis requires enterprise plan access",
        variant: "destructive"
      });
      return;
    }

    try {
      setGenerating(true);
      const { data: result, error } = await supabase.functions.invoke('osi-run-v1', {
        body: { caseId }
      });

      if (error) throw error;
      
      toast({
        title: "Analysis Complete",
        description: "OSI analysis has been generated successfully",
      });
      
      await fetchOSIData();
    } catch (error) {
      console.error('Error running OSI analysis:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to generate OSI analysis",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const getHealthScore = () => {
    if (!data || !data.flags) return 95;
    const flagCount = data.flags.length;
    if (flagCount === 0) return 95;
    if (flagCount <= 1) return 85;
    if (flagCount <= 3) return 70;
    return 50;
  };

  const getHealthColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getSeverityColor = (flag: string) => {
    if (['DEEP_LAYERS', 'HIGH_COST_TO_MANAGE'].includes(flag)) return 'destructive';
    return 'secondary';
  };

  const getFlagDescription = (flag: string) => {
    const descriptions = {
      'OVER_SPAN': 'Management spans exceed best practice',
      'DEEP_LAYERS': 'Too many organizational layers',
      'LOW_SAUDI_LAYER': 'Low Saudization in management',
      'HIGH_COST_TO_MANAGE': 'High cost-to-manage ratio',
      'DUP_ROLE_TITLES': 'Duplicate job titles detected'
    };
    return descriptions[flag as keyof typeof descriptions] || flag;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading organizational data...</div>
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Org Structure Intelligence
          </CardTitle>
          <CardDescription>
            Analyze your organizational structure for efficiency and compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Analysis Available</h3>
            <p className="text-muted-foreground mb-4">
              Run your first OSI analysis to get insights into your organizational structure
            </p>
            <Button onClick={runOSIAnalysis} disabled={generating}>
              <PlayCircle className="h-4 w-4 mr-2" />
              {generating ? "Generating..." : "Run OSI Analysis"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const healthScore = getHealthScore();

  return (
    <div className="space-y-6">
      {/* Health Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Organization Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${getHealthColor(healthScore)}`}>
              {healthScore}/100
            </div>
            <div className="flex-1">
              <Progress value={healthScore} className="h-2" />
              <p className="text-sm text-muted-foreground mt-1">
                {healthScore >= 85 ? "Excellent" : 
                 healthScore >= 70 ? "Good" : 
                 healthScore >= 50 ? "Needs Improvement" : "Critical"}
              </p>
            </div>
            <Button onClick={runOSIAnalysis} disabled={generating} variant="outline">
              <PlayCircle className="h-4 w-4 mr-2" />
              {generating ? "Updating..." : "Refresh"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Headcount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.headcount}</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Span of Control</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.span_avg}</div>
            <p className="text-xs text-muted-foreground">
              Target: 7 | P90: {data.span_p90}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Org Layers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.layers_depth}</div>
            <p className="text-xs text-muted-foreground">
              Target: ≤6 layers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cost to Manage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.cost_to_manage}%</div>
            <p className="text-xs text-muted-foreground">
              Target: 12-18%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Demographics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Saudization Rate</span>
              <span className="font-semibold">{data.saudization}%</span>
            </div>
            <div className="flex justify-between">
              <span>Female Representation</span>
              <span className="font-semibold">{data.female_pct}%</span>
            </div>
            <div className="flex justify-between">
              <span>Total Managers</span>
              <span className="font-semibold">{data.managers}</span>
            </div>
            <div className="flex justify-between">
              <span>Overloaded Managers</span>
              <span className="font-semibold text-amber-600">{data.manager_overload_n}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Structure Issues</CardTitle>
          </CardHeader>
          <CardContent>
            {data.flags && data.flags.length > 0 ? (
              <div className="space-y-2">
                {data.flags.map((flag, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <Badge variant={getSeverityColor(flag)} className="text-xs">
                      {getFlagDescription(flag)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">No critical issues detected</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline">
              <Layers className="h-4 w-4 mr-2" />
              View Org Chart
            </Button>
            <Button variant="outline">
              <DollarSign className="h-4 w-4 mr-2" />
              Cost Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};