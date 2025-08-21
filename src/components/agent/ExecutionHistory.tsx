import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertCircle, 
  Activity,
  Clock,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { AgentSkillExecution } from '@/hooks/useAgentSkills';

interface ExecutionHistoryProps {
  executions: AgentSkillExecution[];
  onRefresh: () => void;
  loading?: boolean;
}

export const ExecutionHistory: React.FC<ExecutionHistoryProps> = ({
  executions,
  onRefresh,
  loading = false
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDuration = (startedAt: string, completedAt: string | null) => {
    if (!completedAt) return 'Running...';
    
    const start = new Date(startedAt);
    const end = new Date(completedAt);
    const diffMs = end.getTime() - start.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ${diffSeconds % 60}s`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h ${diffMinutes % 60}m`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  if (!executions.length) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Execution History</CardTitle>
              <CardDescription>Recent skill execution logs</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No execution history found</p>
            <p className="text-sm">Execute skills to see their logs here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Execution History</CardTitle>
            <CardDescription>Recent skill execution logs ({executions.length} total)</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {executions.map((execution) => (
            <div
              key={execution.id}
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(execution.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{execution.skill_code}</h4>
                  <Badge variant="outline" className={getStatusColor(execution.status)}>
                    {execution.status}
                  </Badge>
                  {execution.dry_run && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Dry Run
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Started: {formatDate(execution.started_at)}</p>
                  <p>Duration: {formatDuration(execution.started_at, execution.completed_at)}</p>
                  
                  {execution.error_message && (
                    <p className="text-red-600 bg-red-50 p-2 rounded text-xs">
                      Error: {execution.error_message}
                    </p>
                  )}
                  
                  {execution.metrics && Object.keys(execution.metrics).length > 0 && (
                    <div className="bg-muted/50 p-2 rounded text-xs">
                      <p className="font-medium mb-1">Metrics:</p>
                      <div className="grid grid-cols-2 gap-1">
                        {Object.entries(execution.metrics).slice(0, 4).map(([key, value]) => (
                          <span key={key} className="truncate">
                            {key}: {typeof value === 'number' ? value.toLocaleString() : String(value)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Button variant="ghost" size="sm" title="View Details">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};