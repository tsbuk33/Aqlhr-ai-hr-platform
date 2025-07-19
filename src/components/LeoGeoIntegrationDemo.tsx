import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLeoGeoIntegration } from '@/hooks/useLeoGeoIntegration';
import { Brain, Heart, Zap, TrendingUp, Users, BookOpen } from 'lucide-react';

const LeoGeoIntegrationDemo: React.FC = () => {
  const {
    createLearningProgress,
    createEngagementMetrics,
    createCrossSystemRecommendation,
    getAggregatedInsights,
    loading
  } = useLeoGeoIntegration();

  const [demoInitialized, setDemoInitialized] = useState(false);

  // Initialize demo data
  const initializeDemoData = async () => {
    try {
      const demoCompanyId = '11111111-1111-1111-1111-111111111111';
      const demoEmployeeIds = [
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333',
        '44444444-4444-4444-4444-444444444444'
      ];

      // Create sample learning progress entries
      await Promise.all([
        createLearningProgress({
          company_id: demoCompanyId,
          employee_id: demoEmployeeIds[0],
          skill_name: 'AI & Machine Learning',
          skill_category: 'Technical',
          current_level: 75,
          target_level: 90,
          completion_percentage: 83,
          learning_streak_days: 12,
          engagement_correlation: 0.8,
          last_activity_date: new Date().toISOString().split('T')[0]
        }),
        createLearningProgress({
          company_id: demoCompanyId,
          employee_id: demoEmployeeIds[1],
          skill_name: 'Cultural Intelligence',
          skill_category: 'Cultural',
          current_level: 82,
          target_level: 95,
          completion_percentage: 86,
          learning_streak_days: 8,
          engagement_correlation: 0.9,
          last_activity_date: new Date().toISOString().split('T')[0]
        }),
        createLearningProgress({
          company_id: demoCompanyId,
          employee_id: demoEmployeeIds[2],
          skill_name: 'Digital Leadership',
          skill_category: 'Leadership',
          current_level: 68,
          target_level: 85,
          completion_percentage: 80,
          learning_streak_days: 5,
          engagement_correlation: 0.7,
          last_activity_date: new Date().toISOString().split('T')[0]
        })
      ]);

      // Create sample engagement metrics
      await Promise.all([
        createEngagementMetrics({
          company_id: demoCompanyId,
          employee_id: demoEmployeeIds[0],
          engagement_score: 87,
          pulse_response_rate: 94,
          recognition_given: 5,
          recognition_received: 3,
          connections_made: 8,
          collaboration_score: 89,
          learning_correlation: 0.8,
          measurement_date: new Date().toISOString().split('T')[0]
        }),
        createEngagementMetrics({
          company_id: demoCompanyId,
          employee_id: demoEmployeeIds[1],
          engagement_score: 82,
          pulse_response_rate: 88,
          recognition_given: 3,
          recognition_received: 7,
          connections_made: 12,
          collaboration_score: 91,
          learning_correlation: 0.9,
          measurement_date: new Date().toISOString().split('T')[0]
        }),
        createEngagementMetrics({
          company_id: demoCompanyId,
          employee_id: demoEmployeeIds[2],
          engagement_score: 78,
          pulse_response_rate: 85,
          recognition_given: 8,
          recognition_received: 2,
          connections_made: 6,
          collaboration_score: 85,
          learning_correlation: 0.7,
          measurement_date: new Date().toISOString().split('T')[0]
        })
      ]);

      // Create cross-system recommendations
      await Promise.all([
        // LEO to GEO recommendations
        createCrossSystemRecommendation({
          company_id: demoCompanyId,
          employee_id: demoEmployeeIds[0],
          source_system: 'leo',
          target_system: 'geo',
          recommendation_type: 'learning_based_engagement',
          recommendation_data: {
            title: 'Celebrate AI Learning Milestone',
            description: 'Employee has completed 83% of AI training - perfect time for recognition',
            suggested_action: 'public_recognition',
            learning_context: 'AI & Machine Learning - 12 day streak'
          },
          priority_score: 85,
          is_active: true
        }),
        createCrossSystemRecommendation({
          company_id: demoCompanyId,
          employee_id: demoEmployeeIds[1],
          source_system: 'leo',
          target_system: 'geo',
          recommendation_type: 'learning_based_engagement',
          recommendation_data: {
            title: 'Cultural Ambassador Recognition',
            description: 'High cultural intelligence progress suggests mentorship potential',
            suggested_action: 'mentor_opportunity',
            learning_context: 'Cultural Intelligence - 86% completion'
          },
          priority_score: 92,
          is_active: true
        }),
        // GEO to LEO recommendations
        createCrossSystemRecommendation({
          company_id: demoCompanyId,
          employee_id: demoEmployeeIds[0],
          source_system: 'geo',
          target_system: 'leo',
          recommendation_type: 'engagement_based_learning',
          recommendation_data: {
            title: 'Advanced AI Modules',
            description: 'High engagement score indicates readiness for advanced training',
            suggested_action: 'enroll_advanced_course',
            engagement_context: '87% engagement with strong collaboration'
          },
          priority_score: 88,
          is_active: true
        }),
        createCrossSystemRecommendation({
          company_id: demoCompanyId,
          employee_id: demoEmployeeIds[2],
          source_system: 'geo',
          target_system: 'leo',
          recommendation_type: 'engagement_based_learning',
          recommendation_data: {
            title: 'Leadership Development Path',
            description: 'Strong recognition-giving pattern suggests leadership potential',
            suggested_action: 'leadership_track',
            engagement_context: 'High recognition activity (8 given)'
          },
          priority_score: 79,
          is_active: true
        })
      ]);

      setDemoInitialized(true);
    } catch (error) {
      console.error('Error initializing demo data:', error);
    }
  };

  const aggregatedInsights = getAggregatedInsights();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading LEO-GEO Integration...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Integration Status */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>LEO</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">⚡</span>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span>GEO</span>
            </div>
            <Badge variant="secondary" className="ml-2">
              Integration Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{aggregatedInsights.overallLearningEngagement}%</div>
              <div className="text-sm text-muted-foreground">Learning-Engagement Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{aggregatedInsights.totalRecommendations}</div>
              <div className="text-sm text-muted-foreground">Cross-System Recommendations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{aggregatedInsights.activeLearningStreaks}</div>
              <div className="text-sm text-muted-foreground">Active Learning Streaks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{aggregatedInsights.highPerformers}</div>
              <div className="text-sm text-muted-foreground">High Performers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Actions */}
      {!demoInitialized && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              LEO-GEO Integration Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Initialize sample data to see how LEO and GEO systems share insights and create intelligent recommendations.
            </p>
            <Button onClick={initializeDemoData} className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Initialize Demo Data
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Integration Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-4 w-4 text-primary" />
              Learning → Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Skills Completion</span>
                <span className="text-sm font-medium">{aggregatedInsights.skillsCompletionRate}%</span>
              </div>
              <Progress value={aggregatedInsights.skillsCompletionRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Learning progress drives engagement initiatives
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="h-4 w-4 text-primary" />
              Engagement → Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Engagement Score</span>
                <span className="text-sm font-medium">{aggregatedInsights.engagementScore}%</span>
              </div>
              <Progress value={aggregatedInsights.engagementScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                High engagement suggests readiness for advanced learning
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-primary" />
              Smart Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Active Recommendations</span>
                <span className="text-sm font-medium">{aggregatedInsights.totalRecommendations}</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">LEO→GEO</Badge>
                <Badge variant="outline" className="text-xs">GEO→LEO</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                AI-powered cross-system insights
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {demoInitialized && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">Integration Successfully Initialized</span>
            </div>
            <p className="text-sm text-green-700">
              Sample data created! Switch between LEO and GEO pages to see cross-system insights in action.
              The systems now share data and provide intelligent recommendations based on both learning progress and engagement patterns.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeoGeoIntegrationDemo;