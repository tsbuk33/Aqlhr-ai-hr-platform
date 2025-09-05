import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Target, TrendingUp, Calendar, Award, Flag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Vision2030KPI {
  name: string;
  current: number;
  target: number;
  unit: string;
  progress: number;
  status: 'on_track' | 'at_risk' | 'behind';
  description: string;
}

interface StrategicInitiative {
  name: string;
  status: string;
  completion: number;
  impact: string;
  nextMilestone: string;
  dueDate: string;
}

interface AlignmentMetrics {
  overallAlignment: number;
  strategicGoals: Vision2030KPI[];
  initiatives: StrategicInitiative[];
  complianceScore: number;
  nationalRanking: number;
}

export default function Vision2030Dashboard() {
  const [metrics, setMetrics] = useState<AlignmentMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAlignmentData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('vision-2030-alignment-engine', {
        body: { action: 'analyze' }
      });

      if (error) throw error;

      setMetrics(data);
      toast({
        title: "Vision 2030 Analysis Updated",
        description: "Strategic alignment metrics refreshed successfully.",
      });
    } catch (error) {
      console.error('Error fetching Vision 2030 data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch Vision 2030 alignment data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlignmentData();
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on_track': return 'default';
      case 'at_risk': return 'secondary';
      case 'behind': return 'destructive';
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      default: return 'outline';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!metrics) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading Vision 2030 alignment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vision 2030 Dashboard</h2>
          <p className="text-muted-foreground">Strategic workforce alignment with national transformation goals</p>
        </div>
        <Button onClick={fetchAlignmentData} disabled={loading}>
          <Eye className="mr-2 h-4 w-4" />
          {loading ? 'Analyzing...' : 'Refresh Analysis'}
        </Button>
      </div>

      {/* Overall Alignment Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Alignment</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overallAlignment}%</div>
            <p className="text-xs text-muted-foreground">
              Vision 2030 alignment score
            </p>
            <Progress value={metrics.overallAlignment} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.complianceScore}%</div>
            <p className="text-xs text-muted-foreground">
              Regulatory compliance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">National Ranking</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{metrics.nationalRanking}</div>
            <p className="text-xs text-muted-foreground">
              Among Saudi companies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active KPIs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.strategicGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              Strategic objectives tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Vision 2030 Strategic Goals</CardTitle>
          <CardDescription>
            Key performance indicators aligned with national transformation objectives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.strategicGoals.map((kpi, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{kpi.name}</h4>
                  <Badge variant={getStatusVariant(kpi.status)}>
                    {kpi.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{kpi.description}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Progress: {kpi.current}{kpi.unit} / {kpi.target}{kpi.unit}</span>
                  <span className={`text-sm font-semibold ${getProgressColor(kpi.progress)}`}>
                    {kpi.progress}%
                  </span>
                </div>
                <Progress value={kpi.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Initiatives */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Initiatives</CardTitle>
          <CardDescription>
            Active transformation programs contributing to Vision 2030 goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.initiatives.map((initiative, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{initiative.name}</h4>
                  <Badge variant={getStatusVariant(initiative.status)}>
                    {initiative.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Completion:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={initiative.completion} className="h-2 flex-1" />
                      <span className="text-sm font-semibold">{initiative.completion}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Next Milestone:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{initiative.dueDate}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{initiative.nextMilestone}</p>
                <p className="text-sm font-medium text-blue-600">{initiative.impact}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}