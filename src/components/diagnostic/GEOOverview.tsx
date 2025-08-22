import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePlanAccess } from '@/hooks/usePlanAccess';
import { UpsellRibbon } from '@/components/plans/UpsellRibbon';
import { PlanUpsellModal } from '@/components/plans/PlanUpsellModal';
import { supabase } from '@/integrations/supabase/client';
import { Zap, MessageSquare, Users, Send, TrendingUp, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface GEOData {
  score: number;
  details: {
    flags?: Array<{
      module: string;
      severity: string;
      created_at: string;
    }>;
    manager_spans?: Array<{
      manager_id: string;
      manager_name: string;
      span: number;
      target_span: number;
      overload: boolean;
    }>;
  };
  pulses: Array<{
    id: string;
    topic: string;
    content: {
      title: string;
      message: string;
      action_items: string[];
    };
    status: string;
    created_at: string;
    geo_reactions?: Array<{
      n_ok: number;
      n_issue: number;
      reaction_type: string;
    }>;
  }>;
  computed_at?: string;
  action_result?: string;
}

interface GEOOverviewProps {
  caseId: string;
}

const GEOOverview: React.FC<GEOOverviewProps> = ({ caseId }) => {
  const [data, setData] = useState<GEOData | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingPulses, setSendingPulses] = useState(false);
  const { hasAccess, isTrialAccess, showUpsell, upsellOpen, hideUpsell, requestTrial, trialExpiresAt } = usePlanAccess('SKU_GEO');

  const runGEOAnalysis = async () => {
    if (!hasAccess) {
      showUpsell();
      return;
    }

    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('geo-run-v1', {
        body: { case_id: caseId }
      });

      if (error) throw error;

      setData(result);
      toast.success('GEO analysis completed successfully');
    } catch (error) {
      console.error('Error running GEO analysis:', error);
      toast.error('Failed to run GEO analysis');
    } finally {
      setLoading(false);
    }
  };

  const sendPulses = async () => {
    if (!hasAccess) {
      showUpsell();
      return;
    }

    setSendingPulses(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('geo-run-v1', {
        body: { case_id: caseId, action: 'send_pulses' }
      });

      if (error) throw error;

      setData(result);
      toast.success(result.action_result || 'Pulses sent successfully');
    } catch (error) {
      console.error('Error sending pulses:', error);
      toast.error('Failed to send pulses');
    } finally {
      setSendingPulses(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-success';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreVariant = (score: number) => {
    if (score >= 70) return 'default';
    if (score >= 40) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Upsell Ribbon */}
      {!hasAccess && (
        <UpsellRibbon
          title="Generative Engagement Optimization"
          description="Combine diagnostics to get stronger decisions with automated engagement pulses"
          onRequestTrial={showUpsell}
        />
      )}
      
      {hasAccess && isTrialAccess && (
        <UpsellRibbon
          title="GEO Trial Active"
          description=""
          onRequestTrial={() => {}}
          isTrialAccess={true}
          trialExpiresAt={trialExpiresAt}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Generative Engagement Optimization</h2>
            <p className="text-muted-foreground">Automated engagement pulses and targeted interventions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runGEOAnalysis} 
            disabled={loading || !hasAccess}
            variant="outline"
            className="gap-2"
          >
            <Activity className="h-4 w-4" />
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </Button>
          {data && data.pulses.length > 0 && hasAccess && (
            <Button 
              onClick={sendPulses} 
              disabled={sendingPulses}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {sendingPulses ? 'Sending...' : 'Send Pulses'}
            </Button>
          )}
        </div>
      </div>

      {data && (
        <>
          {/* Engagement Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Engagement Health Score
              </CardTitle>
              <CardDescription>
                Overall team engagement and intervention effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold">
                  {data.score}/100
                </span>
                <Badge variant={getScoreVariant(data.score)}>
                  {data.score >= 70 ? 'Healthy' : data.score >= 40 ? 'At Risk' : 'Critical'} Engagement
                </Badge>
              </div>
              <Progress value={data.score} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                Last computed: {data.computed_at ? new Date(data.computed_at).toLocaleString() : 'Never'}
              </p>
            </CardContent>
          </Card>

          {/* Active Flags */}
          {data.details.flags && data.details.flags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Active Engagement Flags
                </CardTitle>
                <CardDescription>
                  Recent flags from CCI, REW, and OSI requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.details.flags.map((flag, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">{flag.module.replace(/_/g, ' ')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(flag.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={flag.severity === 'high' ? 'destructive' : 'secondary'}>
                        {flag.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Manager Overload */}
          {data.details.manager_spans && data.details.manager_spans.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Managers Requiring Support
                </CardTitle>
                <CardDescription>
                  Managers with team spans exceeding optimal limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.details.manager_spans.map((manager, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">{manager.manager_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Team span: {manager.span} / {manager.target_span} (target)
                        </p>
                      </div>
                      <Badge variant="destructive">Overloaded</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Pulses */}
          {data.pulses && data.pulses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Engagement Pulses
                </CardTitle>
                <CardDescription>
                  Generated interventions and their responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.pulses.map((pulse) => (
                    <div key={pulse.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{pulse.content.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {pulse.content.message}
                          </p>
                        </div>
                        <Badge variant={pulse.status === 'sent' ? 'default' : 'secondary'}>
                          {pulse.status}
                        </Badge>
                      </div>
                      
                      {pulse.content.action_items && pulse.content.action_items.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium mb-2">Action Items:</h5>
                          <ul className="text-sm space-y-1">
                            {pulse.content.action_items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {pulse.geo_reactions && pulse.geo_reactions.length > 0 && (
                        <div className="flex gap-4 text-sm">
                          <span className="text-success">
                            👍 {pulse.geo_reactions.reduce((sum, r) => sum + r.n_ok, 0)}
                          </span>
                          <span className="text-destructive">
                            👎 {pulse.geo_reactions.reduce((sum, r) => sum + r.n_issue, 0)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!data && !loading && !hasAccess && (
        <div className="text-center py-12">
          <Zap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Premium Feature</h3>
          <p className="text-muted-foreground mb-4">
            Generative Engagement Optimization requires a premium plan
          </p>
        </div>
      )}

      {!data && !loading && hasAccess && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No GEO Analysis Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Run your first Generative Engagement Optimization analysis to create targeted interventions.
            </p>
            <Button onClick={runGEOAnalysis} disabled={loading}>
              <Activity className="h-4 w-4 mr-2" />
              Start GEO Analysis
            </Button>
          </CardContent>
        </Card>
      )}
      
      <PlanUpsellModal
        isOpen={upsellOpen}
        onClose={hideUpsell}
        skuCode="SKU_GEO"
        featureName="Generative Engagement Optimization"
        description="Automated engagement pulses and targeted interventions for your teams"
      />
    </div>
  );
};

export default GEOOverview;