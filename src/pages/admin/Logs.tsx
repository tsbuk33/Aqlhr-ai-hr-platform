import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Activity, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';

interface AgentAction {
  id: string;
  tenant_id: string | null;
  action_type: string;
  function_name: string | null;
  request_id: string | null;
  start_time: string;
  end_time: string | null;
  duration_ms: number | null;
  status: 'pending' | 'success' | 'error' | 'timeout';
  error_message: string | null;
  metadata: any;
  created_at: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-destructive" />;
    case 'timeout':
      return <Clock className="h-4 w-4 text-warning" />;
    default:
      return <Activity className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  const variants = {
    pending: 'default',
    success: 'default',
    error: 'destructive',
    timeout: 'secondary'
  } as const;

  return (
    <Badge variant={variants[status as keyof typeof variants] || 'default'}>
      {status}
    </Badge>
  );
};

const Logs: React.FC = () => {
  const { t } = useTranslation();

  const { data: agentActions, isLoading, error } = useQuery({
    queryKey: ['agent-actions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tool_usage_analytics') // Using existing table as fallback
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="h-6 w-6" />
          <h1 className="text-2xl font-bold">{t('admin_logs')}</h1>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">{t('error_loading_logs')}</h2>
            <p className="text-muted-foreground">{t('please_try_again')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6" />
          <h1 className="text-2xl font-bold">{t('admin_logs')}</h1>
        </div>
        <Badge variant="outline" className="text-sm">
          {t('auto_refreshing')} • 30s
        </Badge>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>{t('recent_actions')} (50)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentActions?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('no_recent_actions')}</p>
                </div>
              ) : (
                agentActions?.map((action: any) => (
                  <div
                    key={action.id}
                    className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(action.success ? 'success' : 'error')}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium truncate">
                          {action.action_type || action.tool_name}
                        </h3>
                        {getStatusBadge(action.success ? 'success' : 'error')}
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(action.created_at), 'MMM d, HH:mm:ss')}</span>
                          </span>
                          {action.execution_time_ms && (
                            <span className="flex items-center space-x-1">
                              <Activity className="h-3 w-3" />
                              <span>{action.execution_time_ms}ms</span>
                            </span>
                          )}
                        </div>
                        
                        {action.error_message && (
                          <div className="text-destructive text-xs bg-destructive/10 p-2 rounded">
                            {action.error_message}
                          </div>
                        )}
                        
                        {action.metadata && Object.keys(action.metadata).length > 0 && (
                          <details className="text-xs">
                            <summary className="cursor-pointer hover:text-foreground">
                              {t('view_metadata')}
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                              {JSON.stringify(action.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Logs;