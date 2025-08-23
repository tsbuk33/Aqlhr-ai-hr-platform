import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from '@/hooks/useUserCompany';
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Activity } from 'lucide-react';

const HealthPage: React.FC = () => {
  const { companyId } = useUserCompany();

  const { data: healthData, isLoading, error, refetch } = useQuery({
    queryKey: ['system-health', companyId],
    queryFn: async () => {
      if (!companyId) throw new Error('No tenant context');

      // Parallel health checks
      const [jobsResult, auditResult, latencyStart] = await Promise.all([
        // Job queue health
        supabase
          .from('job_queue')
          .select('status, created_at, attempts')
          .order('created_at', { ascending: false })
          .limit(100),
        
        // Recent audit events
        supabase
          .from('audit_log')
          .select('created_at, action, entity')
          .order('created_at', { ascending: false })
          .limit(10),
        
        // Latency test
        Date.now()
      ]);

      // Complete latency test
      const latency = Date.now() - latencyStart;

      if (jobsResult.error) throw jobsResult.error;
      if (auditResult.error) throw auditResult.error;

      const jobs = jobsResult.data || [];
      const auditEvents = auditResult.data || [];

      // Analyze job queue health
      const queueStats = {
        total: jobs.length,
        queued: jobs.filter(j => j.status === 'queued').length,
        processing: jobs.filter(j => j.status === 'processing').length,
        failed: jobs.filter(j => j.status === 'failed').length,
        dead: jobs.filter(j => j.status === 'dead').length,
        completed: jobs.filter(j => j.status === 'completed').length
      };

      // Check for stuck jobs (processing > 1 hour)
      const stuckJobs = jobs.filter(j => {
        if (j.status !== 'processing') return false;
        const age = Date.now() - new Date(j.created_at).getTime();
        return age > 60 * 60 * 1000; // 1 hour
      }).length;

      // Overall health score
      let healthScore = 100;
      if (stuckJobs > 0) healthScore -= 30;
      if (queueStats.failed > 5) healthScore -= 20;
      if (queueStats.dead > 0) healthScore -= 40;
      if (latency > 2000) healthScore -= 20;

      return {
        overall: {
          score: Math.max(0, healthScore),
          status: healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'critical'
        },
        queue: queueStats,
        stuckJobs,
        latency,
        lastAuditEvent: auditEvents[0]?.created_at,
        auditEventsCount: auditEvents.length
      };
    },
    enabled: !!companyId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500'; 
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              System Health Check Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error.message}</p>
            <Button onClick={() => refetch()} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Health</h1>
          <p className="text-muted-foreground">Real-time platform monitoring and diagnostics</p>
        </div>
        <Button 
          onClick={() => refetch()} 
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {healthData && getStatusIcon(healthData.overall.status)}
            Overall System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ) : healthData ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{healthData.overall.score}%</div>
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(healthData.overall.status)} text-white`}
                >
                  {healthData.overall.status.toUpperCase()}
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getStatusColor(healthData.overall.status)}`}
                  style={{ width: `${healthData.overall.score}%` }}
                ></div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Job Queue Health */}
        <Card>
          <CardHeader>
            <CardTitle>Job Queue</CardTitle>
            <CardDescription>Background task processing</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ) : healthData ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Queued:</span>
                  <Badge variant="outline">{healthData.queue.queued}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Processing:</span>
                  <Badge variant="outline">{healthData.queue.processing}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Failed:</span>
                  <Badge variant={healthData.queue.failed > 0 ? "destructive" : "outline"}>
                    {healthData.queue.failed}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Dead:</span>
                  <Badge variant={healthData.queue.dead > 0 ? "destructive" : "outline"}>
                    {healthData.queue.dead}
                  </Badge>
                </div>
                {healthData.stuckJobs > 0 && (
                  <div className="flex justify-between">
                    <span>Stuck Jobs:</span>
                    <Badge variant="destructive">{healthData.stuckJobs}</Badge>
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>System response times</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ) : healthData ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Database Latency:</span>
                  <Badge variant={healthData.latency > 1000 ? "destructive" : "outline"}>
                    {healthData.latency}ms
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={healthData.latency < 500 ? "default" : healthData.latency < 1000 ? "secondary" : "destructive"}>
                    {healthData.latency < 500 ? "Fast" : healthData.latency < 1000 ? "Normal" : "Slow"}
                  </Badge>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Audit Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Recent system events</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-4/5"></div>
              </div>
            ) : healthData ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Recent Events:</span>
                  <Badge variant="outline">{healthData.auditEventsCount}</Badge>
                </div>
                {healthData.lastAuditEvent && (
                  <div className="flex justify-between">
                    <span>Last Activity:</span>
                    <Badge variant="outline">
                      {new Date(healthData.lastAuditEvent).toLocaleTimeString()}
                    </Badge>
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthPage;