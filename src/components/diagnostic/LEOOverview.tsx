import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useFeatureGating } from '@/hooks/useFeatureGating';
import { supabase } from '@/integrations/supabase/client';
import { Brain, BookOpen, Target, TrendingUp, Play, Users } from 'lucide-react';
import { toast } from 'sonner';

interface LEOData {
  score: number;
  details: {
    skill_gaps?: Array<{
      skill: string;
      grade: string;
      hours_needed: number;
      last_training?: string;
    }>;
  };
  paths: Array<{
    id: string;
    skill: string;
    grade: string;
    path: Array<{
      type: string;
      title: string;
      duration: number;
    }>;
  }>;
  computed_at?: string;
}

interface LEOOverviewProps {
  caseId: string;
}

const LEOOverview: React.FC<LEOOverviewProps> = ({ caseId }) => {
  const [data, setData] = useState<LEOData | null>(null);
  const [loading, setLoading] = useState(false);
  const { hasAccess, showUpsell } = useFeatureGating('SKU_LEO');

  const runLEOAnalysis = async () => {
    if (!hasAccess) {
      showUpsell();
      return;
    }

    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('leo-run-v1', {
        body: { case_id: caseId }
      });

      if (error) throw error;

      setData(result);
      toast.success('LEO analysis completed successfully');
    } catch (error) {
      console.error('Error running LEO analysis:', error);
      toast.error('Failed to run LEO analysis');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-destructive';
    if (score >= 40) return 'text-warning';
    return 'text-success';
  };

  const getScoreVariant = (score: number) => {
    if (score >= 70) return 'destructive';
    if (score >= 40) return 'secondary';
    return 'default';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Learning Experience Optimization</h2>
            <p className="text-muted-foreground">AI-powered skill gap analysis and learning paths</p>
          </div>
        </div>
        <Button 
          onClick={runLEOAnalysis} 
          disabled={loading}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          {loading ? 'Analyzing...' : 'Run LEO Analysis'}
        </Button>
      </div>

      {data && (
        <>
          {/* Risk Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Skill Gap Risk Score
              </CardTitle>
              <CardDescription>
                Overall assessment of learning and skill development risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold">
                  {data.score}/100
                </span>
                <Badge variant={getScoreVariant(data.score)}>
                  {data.score >= 70 ? 'Critical' : data.score >= 40 ? 'Moderate' : 'Low'} Risk
                </Badge>
              </div>
              <Progress value={data.score} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                Last computed: {data.computed_at ? new Date(data.computed_at).toLocaleString() : 'Never'}
              </p>
            </CardContent>
          </Card>

          {/* Skill Gaps */}
          {data.details.skill_gaps && data.details.skill_gaps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Critical Skill Gaps
                </CardTitle>
                <CardDescription>
                  Skills requiring immediate attention across grades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.details.skill_gaps.slice(0, 5).map((gap, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">{gap.skill}</h4>
                        <p className="text-sm text-muted-foreground">Grade: {gap.grade}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-warning">
                          {gap.hours_needed}h needed
                        </div>
                        {gap.last_training && (
                          <p className="text-xs text-muted-foreground">
                            Last: {new Date(gap.last_training).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Learning Paths */}
          {data.paths && data.paths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recommended Learning Paths
                </CardTitle>
                <CardDescription>
                  AI-generated micro-learning paths for skill development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.paths.slice(0, 4).map((path) => (
                    <div key={path.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{path.skill}</h4>
                        <Badge variant="outline">{path.grade}</Badge>
                      </div>
                      <div className="space-y-2">
                        {path.path.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span>{step.title}</span>
                            <span className="text-muted-foreground">({step.duration}min)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!data && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No LEO Analysis Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Run your first Learning Experience Optimization analysis to identify skill gaps and learning opportunities.
            </p>
            <Button onClick={runLEOAnalysis} disabled={loading}>
              <Play className="h-4 w-4 mr-2" />
              Start LEO Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LEOOverview;