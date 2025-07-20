import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAICore, AIRecommendation } from '@/hooks/useAICore';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Target,
  Lightbulb,
  BarChart3
} from 'lucide-react';

interface AIRecommendationCenterProps {
  companyId: string;
  className?: string;
}

const AIRecommendationCenter: React.FC<AIRecommendationCenterProps> = ({
  companyId,
  className = ''
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { getRecommendations, updateRecommendationStatus, loading } = useAICore();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState('pending');

  const isArabic = language === 'ar';

  useEffect(() => {
    fetchRecommendations();
  }, [companyId, activeTab]);

  const fetchRecommendations = async () => {
    try {
      const data = await getRecommendations(companyId, {
        status: activeTab === 'all' ? undefined : activeTab,
        limit: 20
      });
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleStatusUpdate = async (
    recommendationId: string, 
    status: 'accepted' | 'rejected' | 'implemented',
    feedback?: string
  ) => {
    try {
      const success = await updateRecommendationStatus(recommendationId, status, feedback);
      if (success) {
        await fetchRecommendations();
        toast({
          title: isArabic ? 'تم التحديث' : 'Updated Successfully',
          description: isArabic 
            ? 'تم تحديث حالة التوصية'
            : 'Recommendation status updated',
        });
      }
    } catch (error) {
      toast({
        title: isArabic ? 'خطأ' : 'Error',
        description: isArabic 
          ? 'فشل في تحديث التوصية'
          : 'Failed to update recommendation',
        variant: 'destructive',
      });
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Target className="h-4 w-4 text-yellow-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance_enhancement':
        return <BarChart3 className="h-4 w-4" />;
      case 'cost_optimization':
        return <TrendingUp className="h-4 w-4" />;
      case 'hiring_optimization':
        return <Target className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    if (!acc[rec.recommendation_type]) {
      acc[rec.recommendation_type] = [];
    }
    acc[rec.recommendation_type].push(rec);
    return acc;
  }, {} as Record<string, AIRecommendation[]>);

  const tabCounts = {
    pending: recommendations.filter(r => r.status === 'pending').length,
    accepted: recommendations.filter(r => r.status === 'accepted').length,
    implemented: recommendations.filter(r => r.status === 'implemented').length,
    rejected: recommendations.filter(r => r.status === 'rejected').length
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            {isArabic ? 'مركز التوصيات الذكية' : 'AI Recommendation Center'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pending" className="relative">
                {isArabic ? 'معلقة' : 'Pending'}
                {tabCounts.pending > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {tabCounts.pending}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="accepted">
                {isArabic ? 'مقبولة' : 'Accepted'}
                {tabCounts.accepted > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {tabCounts.accepted}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="implemented">
                {isArabic ? 'منفذة' : 'Implemented'}
                {tabCounts.implemented > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {tabCounts.implemented}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="rejected">
                {isArabic ? 'مرفوضة' : 'Rejected'}
              </TabsTrigger>
              <TabsTrigger value="all">
                {isArabic ? 'الكل' : 'All'}
              </TabsTrigger>
            </TabsList>

            {Object.entries({ pending: 'pending', accepted: 'accepted', implemented: 'implemented', rejected: 'rejected', all: 'all' }).map(([key, value]) => (
              <TabsContent key={key} value={value} className="mt-6">
                {recommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {isArabic ? 'لا توجد توصيات في هذه الفئة' : 'No recommendations in this category'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedRecommendations).map(([type, recs]) => (
                      <div key={type} className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {getTypeIcon(type)}
                          {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          <Badge variant="outline">{recs.length}</Badge>
                        </h3>
                        <div className="grid gap-4">
                          {recs.map((recommendation) => (
                            <Card key={recommendation.id} className="relative">
                              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getPriorityColor(recommendation.priority_level)}`} />
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                      {getPriorityIcon(recommendation.priority_level)}
                                      <h4 className="font-semibold">
                                        {isArabic 
                                          ? recommendation.title_ar || recommendation.title
                                          : recommendation.title
                                        }
                                      </h4>
                                      <Badge variant="outline" className="text-xs">
                                        {Math.round(recommendation.confidence_score * 100)}%
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {isArabic 
                                        ? recommendation.description_ar || recommendation.description
                                        : recommendation.description
                                      }
                                    </p>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {/* Expected Impact */}
                                {recommendation.expected_impact && (
                                  <div className="bg-primary/5 p-3 rounded-md">
                                    <p className="text-sm font-medium text-primary">
                                      {isArabic ? 'التأثير المتوقع:' : 'Expected Impact:'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {recommendation.expected_impact.value} {recommendation.expected_impact.metric}
                                      {' '}({recommendation.expected_impact.timeline})
                                    </p>
                                  </div>
                                )}

                                {/* Implementation Steps */}
                                {recommendation.implementation_steps && recommendation.implementation_steps.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium mb-2">
                                      {isArabic ? 'خطوات التنفيذ:' : 'Implementation Steps:'}
                                    </p>
                                    <ul className="space-y-1">
                                      {recommendation.implementation_steps.map((step, index) => (
                                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                          <span className="text-primary font-medium">{index + 1}.</span>
                                          {step}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                {recommendation.status === 'pending' && (
                                  <div className="flex gap-2 pt-2 border-t">
                                    <Button
                                      size="sm"
                                      onClick={() => handleStatusUpdate(recommendation.id, 'accepted')}
                                      disabled={loading}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      {isArabic ? 'قبول' : 'Accept'}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleStatusUpdate(recommendation.id, 'rejected')}
                                      disabled={loading}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      {isArabic ? 'رفض' : 'Reject'}
                                    </Button>
                                  </div>
                                )}

                                {recommendation.status === 'accepted' && (
                                  <div className="flex gap-2 pt-2 border-t">
                                    <Button
                                      size="sm"
                                      onClick={() => handleStatusUpdate(recommendation.id, 'implemented')}
                                      disabled={loading}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      {isArabic ? 'تم التنفيذ' : 'Mark Implemented'}
                                    </Button>
                                  </div>
                                )}

                                {/* Status Badge */}
                                <div className="flex items-center justify-between pt-2 border-t">
                                  <Badge
                                    variant={
                                      recommendation.status === 'implemented' ? 'default' :
                                      recommendation.status === 'accepted' ? 'secondary' :
                                      recommendation.status === 'rejected' ? 'destructive' :
                                      'outline'
                                    }
                                  >
                                    {recommendation.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                    {recommendation.status === 'accepted' && <CheckCircle className="h-3 w-3 mr-1" />}
                                    {recommendation.status === 'implemented' && <CheckCircle className="h-3 w-3 mr-1" />}
                                    {recommendation.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                                    {isArabic ? 
                                      (recommendation.status === 'pending' ? 'معلق' :
                                       recommendation.status === 'accepted' ? 'مقبول' :
                                       recommendation.status === 'implemented' ? 'منفذ' : 'مرفوض') :
                                      recommendation.status.charAt(0).toUpperCase() + recommendation.status.slice(1)
                                    }
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(recommendation.created_at).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIRecommendationCenter;