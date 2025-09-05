import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, Users, Target, Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SaudizationMetrics {
  currentRatio: number;
  targetRatio: number;
  totalEmployees: number;
  saudiEmployees: number;
  nonSaudiEmployees: number;
  requiredHires: number;
  nitaqatColor: string;
  riskLevel: string;
}

interface AIRecommendation {
  priority: string;
  action: string;
  impact: string;
  timeline: string;
  costBenefit: string;
}

export default function SaudizationOptimizer() {
  const [metrics, setMetrics] = useState<SaudizationMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchOptimizationData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('saudization-optimization-engine', {
        body: { action: 'analyze' }
      });

      if (error) throw error;

      setMetrics(data.metrics);
      setRecommendations(data.recommendations);
      toast({
        title: "Analysis Complete",
        description: "Saudization optimization data updated successfully.",
      });
    } catch (error) {
      console.error('Error fetching optimization data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch optimization data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptimizationData();
  }, []);

  const getNitaqatColorVariant = (color: string) => {
    switch (color.toLowerCase()) {
      case 'green': return 'default';
      case 'yellow': return 'secondary'; 
      case 'red': return 'destructive';
      default: return 'outline';
    }
  };

  const getRiskLevelVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  if (!metrics) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading Saudization analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Saudization Optimizer</h2>
        <Button onClick={fetchOptimizationData} disabled={loading}>
          <Brain className="mr-2 h-4 w-4" />
          {loading ? 'Analyzing...' : 'Refresh Analysis'}
        </Button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.currentRatio}%</div>
            <p className="text-xs text-muted-foreground">
              Target: {metrics.targetRatio}%
            </p>
            <Progress value={metrics.currentRatio} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nitaqat Status</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={getNitaqatColorVariant(metrics.nitaqatColor)} className="text-sm">
              {metrics.nitaqatColor.toUpperCase()}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Compliance Band
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Required Hires</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.requiredHires}</div>
            <p className="text-xs text-muted-foreground">
              Saudi nationals needed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={getRiskLevelVariant(metrics.riskLevel)}>
              {metrics.riskLevel.toUpperCase()}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Compliance risk
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workforce Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Workforce Analysis</CardTitle>
          <CardDescription>
            Current workforce composition and optimization targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Employees</span>
              <span className="font-semibold">{metrics.totalEmployees}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Saudi Employees</span>
              <span className="font-semibold text-green-600">{metrics.saudiEmployees}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Non-Saudi Employees</span>
              <span className="font-semibold text-blue-600">{metrics.nonSaudiEmployees}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
          <CardDescription>
            Strategic insights for optimal Saudization compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={rec.priority === 'High' ? 'destructive' : 'secondary'}>
                    {rec.priority} Priority
                  </Badge>
                  <span className="text-sm text-muted-foreground">{rec.timeline}</span>
                </div>
                <h4 className="font-semibold mb-2">{rec.action}</h4>
                <p className="text-sm text-muted-foreground mb-2">{rec.impact}</p>
                <p className="text-sm font-medium text-green-600">{rec.costBenefit}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}