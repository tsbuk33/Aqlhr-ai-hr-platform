import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  Users,
  Star,
  ArrowRight,
  Lightbulb,
  Heart,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';

interface SmartRecommendation {
  id: string;
  type: 'learning_to_engagement' | 'engagement_to_learning' | 'combined_insight';
  title: string;
  description: string;
  actions: string[];
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  source_system: 'leo' | 'geo';
  target_system: 'leo' | 'geo';
  created_at: string;
}

interface AnalysisInsights {
  learning_engagement_correlation: number;
  trend_analysis: {
    learning_trend: string;
    engagement_trend: string;
    streak_status: number;
  };
  priority_actions: string[];
}

interface SmartRecommendationEngineProps {
  employeeId?: string;
  companyId?: string;
  autoRefresh?: boolean;
}

const SmartRecommendationEngine: React.FC<SmartRecommendationEngineProps> = ({
  employeeId = '22222222-2222-2222-2222-222222222222',
  companyId = '11111111-1111-1111-1111-111111111111',
  autoRefresh = false
}) => {
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [insights, setInsights] = useState<AnalysisInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Fetch existing recommendations
  const fetchRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('cross_system_recommendations')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('priority_score', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedRecommendations = data?.map(rec => {
        const recData = typeof rec.recommendation_data === 'object' && rec.recommendation_data !== null 
          ? rec.recommendation_data as any 
          : {};
        
        return {
          id: rec.id,
          type: rec.recommendation_type as 'learning_to_engagement' | 'engagement_to_learning' | 'combined_insight',
          title: recData.title || 'Smart Recommendation',
          description: recData.description || 'AI-generated recommendation',
          actions: Array.isArray(recData.actions) ? recData.actions : [],
          confidence: typeof recData.confidence === 'number' ? recData.confidence : 0.5,
          priority: recData.priority || 'medium',
          source_system: rec.source_system as 'leo' | 'geo',
          target_system: rec.target_system as 'leo' | 'geo',
          created_at: rec.created_at
        };
      }) || [];

      setRecommendations(formattedRecommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to fetch recommendations');
    }
  };

  // Generate new AI recommendations
  const generateAIRecommendations = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('leo-geo-ai-recommendations', {
        body: {
          employee_id: employeeId,
          company_id: companyId,
          analysis_type: 'full'
        }
      });

      if (error) throw error;

      if (data.success) {
        setInsights(data.insights);
        await fetchRecommendations(); // Refresh recommendations
        toast.success('AI recommendations generated successfully!');
      } else {
        throw new Error(data.error || 'Failed to generate recommendations');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate AI recommendations');
    } finally {
      setGenerating(false);
    }
  };

  // Apply recommendation action
  const applyRecommendation = async (recommendationId: string, actionIndex: number) => {
    try {
      const recommendation = recommendations.find(r => r.id === recommendationId);
      if (!recommendation) return;

      // In a real implementation, this would trigger specific actions
      // For now, we'll just mark it as applied
      toast.success(`Applied: ${recommendation.actions[actionIndex]}`);
    } catch (error) {
      console.error('Error applying recommendation:', error);
      toast.error('Failed to apply recommendation');
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  // Get system icon
  const getSystemIcon = (system: string) => {
    return system === 'leo' ? BookOpen : Heart;
  };

  useEffect(() => {
    fetchRecommendations();
  }, [employeeId, companyId]);

  return (
    <div className="space-y-6">
      {/* AI Engine Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Smart Recommendation Engine
            <Badge variant="secondary" className="ml-2">
              <Zap className="h-3 w-3 mr-1" />
              AI Phase 2
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              AI-powered cross-system analysis for intelligent recommendations
            </div>
            <Button 
              onClick={generateAIRecommendations} 
              disabled={generating}
              className="flex items-center gap-2"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4" />
                  Generate AI Insights
                </>
              )}
            </Button>
          </div>

          {insights && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-background/60 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {Math.round(insights.learning_engagement_correlation * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">L-E Correlation</div>
              </div>
              <div className="text-center p-3 bg-background/60 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {insights.trend_analysis.streak_status}
                </div>
                <div className="text-xs text-muted-foreground">Learning Streak</div>
              </div>
              <div className="text-center p-3 bg-background/60 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {insights.priority_actions.length}
                </div>
                <div className="text-xs text-muted-foreground">Priority Actions</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Smart Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((recommendation) => {
          const SourceIcon = getSystemIcon(recommendation.source_system);
          const TargetIcon = getSystemIcon(recommendation.target_system);
          
          return (
            <Card key={recommendation.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <SourceIcon className="h-4 w-4 text-primary" />
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <TargetIcon className="h-4 w-4 text-primary" />
                    </div>
                    {recommendation.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={getPriorityColor(recommendation.priority)}>
                      {recommendation.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(recommendation.confidence * 100)}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {recommendation.description}
                </p>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Suggested Actions:
                  </h5>
                  {recommendation.actions.map((action, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span className="text-sm">{action}</span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => applyRecommendation(recommendation.id, index)}
                        className="text-xs"
                      >
                        Apply
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-border/50">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Confidence: {Math.round(recommendation.confidence * 100)}%</span>
                    <span>{new Date(recommendation.created_at).toLocaleDateString()}</span>
                  </div>
                  <Progress 
                    value={recommendation.confidence * 100} 
                    className="h-1 mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Priority Actions Summary */}
      {insights?.priority_actions && insights.priority_actions.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Priority Actions Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.priority_actions.map((action, index) => (
                <div key={index} className="flex items-center gap-2 text-orange-700">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">{action}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {recommendations.length === 0 && !generating && (
        <Card className="text-center py-12">
          <CardContent>
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No AI Recommendations Yet</h3>
            <p className="text-muted-foreground mb-4">
              Generate intelligent cross-system recommendations based on learning and engagement patterns.
            </p>
            <Button onClick={generateAIRecommendations} className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Generate First Recommendations
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartRecommendationEngine;