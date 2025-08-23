import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Play, Clock, CheckCircle, AlertCircle, BarChart3, RefreshCw, Shield, Brain } from 'lucide-react';

export const AdminJobQueue: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const enqueueJob = async (type: string, description: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('core_enqueue' as any, {
        p_type: type,
        p_payload: { demo: true, description },
        p_run_at: new Date().toISOString()
      });

      if (error) throw error;

      toast({
        title: "Job Enqueued",
        description: `${description} job queued successfully (ID: ${data})`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const jobs = [
    {
      type: 'recompute_kpis',
      title: 'Recompute KPIs',
      description: 'Refresh dashboard KPIs and metrics',
      icon: BarChart3
    },
    {
      type: 'refresh_materialized_views',
      title: 'Refresh Views',
      description: 'Update materialized views and cached data',
      icon: RefreshCw
    },
    {
      type: 'compliance_run',
      title: 'Compliance Check',
      description: 'Run automated compliance audit',
      icon: Shield
    },
    {
      type: 'evidence_embed',
      title: 'Process Evidence',
      description: 'Generate AI embeddings for evidence',
      icon: Brain
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          AqlHR Kernel Job Queue
        </CardTitle>
        <CardDescription>
          Enqueue background jobs for testing the kernel worker
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job.type}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <job.icon className="w-5 h-5 mt-1 text-muted-foreground" />
                <div className="flex-1">
                  <h4 className="font-medium">{job.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {job.description}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => enqueueJob(job.type, job.title)}
                disabled={loading}
                size="sm"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Enqueuing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Enqueue Job
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Kernel Status</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Jobs are processed by the kernel-worker-v1 Edge Function every 2 minutes.
            Check <code>/_/health</code> for queue status and processing metrics.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
