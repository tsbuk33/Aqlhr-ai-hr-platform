import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePlanAccess } from '@/hooks/usePlanAccess';
import { UpsellRibbon } from '@/components/plans/UpsellRibbon';
import { PlanUpsellModal } from '@/components/plans/PlanUpsellModal';
import { supabase } from '@/integrations/supabase/client';
import { Brain, BookOpen, Target, TrendingUp, Play, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';

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
  const { hasAccess, isTrialAccess, showUpsell, upsellOpen, hideUpsell, requestTrial, trialExpiresAt } = usePlanAccess('SKU_LEO');
  const { t, isRTL } = useLanguage();

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
      toast.success(t('leo.analysis_completed'));
    } catch (error) {
      console.error('Error running LEO analysis:', error);
      toast.error(t('leo.analysis_failed'));
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

  const getRiskText = (score: number) => {
    if (score >= 70) return t('leo.critical_risk');
    if (score >= 40) return t('leo.moderate_risk');
    return t('leo.low_risk');
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Upsell Ribbon */}
      {!hasAccess && (
        <UpsellRibbon
          title={t('leo.title')}
          description={t('leo.upgrade_description')}
          onRequestTrial={showUpsell}
        />
      )}
      
      {hasAccess && isTrialAccess && (
        <UpsellRibbon
          title={t('leo.trial_active')}
          description=""
          onRequestTrial={() => {}}
          isTrialAccess={true}
          trialExpiresAt={trialExpiresAt}
        />
      )}

      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Brain className="h-8 w-8 text-primary" />
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h2 className="text-2xl font-bold">{t('leo.title')}</h2>
            <p className="text-muted-foreground">{t('leo.subtitle')}</p>
          </div>
        </div>
        <Button 
          onClick={runLEOAnalysis} 
          disabled={loading || !hasAccess}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          {loading ? t('leo.analyzing') : t('leo.run_analysis')}
        </Button>
      </div>

      {data && (
        <>
          {/* Risk Score */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Target className="h-5 w-5" />
                {t('leo.skill_gap_risk_score')}
              </CardTitle>
              <CardDescription>
                {t('leo.risk_assessment_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-2xl font-bold">
                  {data.score}/100
                </span>
                <Badge variant={getScoreVariant(data.score)}>
                  {getRiskText(data.score)}
                </Badge>
              </div>
              <Progress value={data.score} className="h-2" />
              <p className={`text-sm text-muted-foreground mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('leo.last_computed')}: {data.computed_at ? new Date(data.computed_at).toLocaleString() : t('leo.never')}
              </p>
            </CardContent>
          </Card>

          {/* Skill Gaps */}
          {data.details.skill_gaps && data.details.skill_gaps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <BookOpen className="h-5 w-5" />
                  {t('leo.critical_skill_gaps')}
                </CardTitle>
                <CardDescription>
                  {t('leo.skills_attention_description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.details.skill_gaps.slice(0, 5).map((gap, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 bg-muted rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h4 className="font-medium">{gap.skill}</h4>
                        <p className="text-sm text-muted-foreground">{t('leo.grade')}: {gap.grade}</p>
                      </div>
                      <div className={isRTL ? 'text-left' : 'text-right'}>
                        <div className="font-medium text-warning">
                          {gap.hours_needed}{t('leo.hours_needed')}
                        </div>
                        {gap.last_training && (
                          <p className="text-xs text-muted-foreground">
                            {t('leo.last')}: {new Date(gap.last_training).toLocaleDateString()}
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
                <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <TrendingUp className="h-5 w-5" />
                  {t('leo.recommended_learning_paths')}
                </CardTitle>
                <CardDescription>
                  {t('leo.ai_generated_paths_description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.paths.slice(0, 4).map((path) => (
                    <div key={path.id} className="border rounded-lg p-4">
                      <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <h4 className="font-medium">{path.skill}</h4>
                        <Badge variant="outline">{path.grade}</Badge>
                      </div>
                      <div className="space-y-2">
                        {path.path.map((step, stepIndex) => (
                          <div key={stepIndex} className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span>{step.title}</span>
                            <span className="text-muted-foreground">({step.duration}{t('leo.minutes')})</span>
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

      {!data && !loading && !hasAccess && (
        <div className={`text-center py-12 ${isRTL ? 'rtl' : 'ltr'}`}>
          <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">{t('leo.premium_feature')}</h3>
          <p className="text-muted-foreground mb-4">
            {t('leo.premium_required')}
          </p>
        </div>
      )}

      {!data && !loading && hasAccess && (
        <Card>
          <CardContent className={`flex flex-col items-center justify-center py-12 ${isRTL ? 'rtl' : 'ltr'}`}>
            <Brain className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('leo.no_analysis_yet')}</h3>
            <p className="text-muted-foreground text-center mb-4">
              {t('leo.first_analysis_description')}
            </p>
            <Button onClick={runLEOAnalysis} disabled={loading}>
              <Play className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('leo.start_analysis')}
            </Button>
          </CardContent>
        </Card>
      )}
      
      <PlanUpsellModal
        isOpen={upsellOpen}
        onClose={hideUpsell}
        skuCode="SKU_LEO"
        featureName={t('leo.title')}
        description={t('leo.description')}
      />
    </div>
  );
};

export default LEOOverview;