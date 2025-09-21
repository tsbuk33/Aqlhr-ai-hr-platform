import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Zap, Clock, CheckCircle, XCircle, Activity } from "lucide-react";
import { useAISync } from "@/hooks/useAISync";
import EduBox from "@/components/EduBox";

const AISyncDashboard: React.FC = () => {
  const { syncEvents, loading, triggerManualSync, processSyncEvent, getSyncStats } = useAISync();
  const stats = getSyncStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-brand-success" />;
      case 'failed': return <XCircle className="h-4 w-4 text-brand-danger" />;
      case 'processing': return <RefreshCw className="h-4 w-4 text-brand-primary animate-spin" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-brand-success text-primary-foreground';
      case 'failed': return 'bg-brand-danger text-primary-foreground';
      case 'processing': return 'bg-brand-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-brand-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-warning">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-brand-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-success">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Zap className="h-4 w-4 text-brand-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-accent">{stats.avgLatency}ms</div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Control */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                AI SYNC ENGINE Control
                <EduBox
                  title="AI SYNC ENGINE"
                  description="Automatically synchronizes data changes across all 105+ HR modules within 200ms latency"
                  howToUse="Monitor sync events or trigger manual sync when needed"
                  linkedFeatures={['All HR Modules', 'Real-time Updates', 'Data Consistency']}
                  userLevel="hr_admin"
                >
                  <></>
                </EduBox>
              </CardTitle>
              <CardDescription>
                Monitor and control real-time data synchronization across all HR modules
              </CardDescription>
            </div>
            <Button 
              onClick={triggerManualSync}
              disabled={loading}
              className="bg-brand-primary hover:bg-brand-primary/90 text-primary-foreground"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Manual Sync
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Recent Sync Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sync Events</CardTitle>
          <CardDescription>Latest data synchronization events across modules</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-brand-primary" />
              <span className="ml-2 text-muted-foreground">Loading sync events...</span>
            </div>
          ) : syncEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No sync events found
            </div>
          ) : (
            <div className="space-y-3">
              {syncEvents.slice(0, 10).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-surface-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(event.sync_status)}
                    <div>
                      <div className="font-medium text-foreground">
                        {event.event_type.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {event.affected_modules.join(', ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {event.sync_latency_ms && (
                      <span className="text-xs text-muted-foreground">
                        {event.sync_latency_ms}ms
                      </span>
                    )}
                    <Badge className={getStatusColor(event.sync_status)}>
                      {event.sync_status}
                    </Badge>
                    {event.sync_status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => processSyncEvent(event.id)}
                      >
                        Process
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AISyncDashboard;