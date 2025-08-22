import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGovHub, type GovAdapter, type GovJob, type GovEvent } from '@/hooks/useGovHub';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Database,
  FileText,
  Play,
  RefreshCw,
  Settings,
  Zap
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const SystemCard = ({ adapter, onTest, onSwitch }: {
  adapter: GovAdapter;
  onTest: (system: string) => void;
  onSwitch: (system: string, status: 'demo' | 'connected') => void;
}) => {
  const getStatusIcon = () => {
    switch (adapter.status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'demo': return <Zap className="h-4 w-4 text-warning" />;
      default: return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getSystemName = (system: string) => {
    switch (system) {
      case 'qiwa': return 'Qiwa (MOL)';
      case 'gosi': return 'GOSI';
      case 'absher': return 'Absher';
      default: return system.toUpperCase();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {getSystemName(adapter.system)}
        </CardTitle>
        {getStatusIcon()}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant={adapter.status === 'connected' ? 'default' : 'secondary'}>
              {adapter.status.toUpperCase()} MODE
            </Badge>
            {adapter.mode && (
              <Badge variant="outline">{adapter.mode}</Badge>
            )}
          </div>
          
          {adapter.last_sync && (
            <p className="text-xs text-muted-foreground">
              Last sync: {formatDistanceToNow(new Date(adapter.last_sync), { addSuffix: true })}
            </p>
          )}
          
          {adapter.last_error && (
            <p className="text-xs text-destructive">
              Error: {adapter.last_error}
            </p>
          )}
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onTest(adapter.system)}
              className="flex-1"
            >
              <Play className="h-3 w-3 mr-1" />
              Test
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onSwitch(
                adapter.system, 
                adapter.status === 'demo' ? 'connected' : 'demo'
              )}
              className="flex-1"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              {adapter.status === 'demo' ? 'Go Live' : 'Demo'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const JobRow = ({ job }: { job: GovJob }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return <Badge variant="default" className="bg-success/10 text-success">Success</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
      case 'running': return <Badge variant="secondary">Running</Badge>;
      default: return <Badge variant="outline">Queued</Badge>;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{job.system.toUpperCase()}</span>
          <span className="text-sm text-muted-foreground">{job.job_type}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
        </p>
        {job.error && (
          <p className="text-xs text-destructive mt-1">{job.error}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {getStatusBadge(job.status)}
        {job.status === 'running' && (
          <RefreshCw className="h-3 w-3 animate-spin" />
        )}
      </div>
    </div>
  );
};

const EventRow = ({ event }: { event: GovEvent }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'error': return <Badge variant="destructive">Error</Badge>;
      case 'warn': return <Badge variant="secondary">Warning</Badge>;
      default: return <Badge variant="outline">Info</Badge>;
    }
  };

  return (
    <div className="flex items-start justify-between p-3 border-b">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{event.system.toUpperCase()}</span>
          <span className="text-sm text-muted-foreground">{event.kind}</span>
        </div>
        <p className="text-sm">{event.message}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(event.event_at), { addSuffix: true })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {getSeverityBadge(event.severity)}
      </div>
    </div>
  );
};

export const GovHubDashboard = () => {
  const { adapters, jobs, events, loading, testConnection, switchMode, queueJob, refetch } = useGovHub();

  const handleBulkSync = async () => {
    try {
      await Promise.all(
        adapters.map(adapter => queueJob(adapter.system, 'full_sync'))
      );
    } catch (error) {
      console.error('Bulk sync error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading Government Hub...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">KSA Government Integration Hub</h1>
          <p className="text-muted-foreground">
            Secure multi-adapter integration with MOL/Qiwa, GOSI, and Absher
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleBulkSync} size="sm">
            <Database className="h-4 w-4 mr-2" />
            Sync All
          </Button>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {adapters.map((adapter) => (
          <SystemCard 
            key={adapter.id}
            adapter={adapter}
            onTest={testConnection}
            onSwitch={switchMode}
          />
        ))}
      </div>

      {/* Tabs for Jobs and Events */}
      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Sync Jobs ({jobs.length})
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Events ({events.length})
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Sync Jobs
              </CardTitle>
              <CardDescription>
                Monitor synchronization jobs and their status
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {jobs.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No sync jobs yet. Start by testing a connection.
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {jobs.map((job) => (
                    <JobRow key={job.id} job={job} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Events
              </CardTitle>
              <CardDescription>
                Audit trail of government system interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {events.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No events recorded yet.
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {events.map((event) => (
                    <EventRow key={event.id} event={event} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>
                Configure credentials and endpoints for each system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adapters.map((adapter) => (
                  <div key={adapter.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{adapter.system.toUpperCase()}</h3>
                      <Badge variant="outline">
                        {adapter.status} mode
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Configuration: {Object.keys(adapter.config || {}).length} settings</p>
                      <p>Last updated: {formatDistanceToNow(new Date(adapter.updated_at), { addSuffix: true })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};