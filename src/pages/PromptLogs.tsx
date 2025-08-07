import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Eye, Edit, Search, Trash2 } from 'lucide-react';
import { usePromptLogs, type PromptLogFilters } from '@/hooks/usePromptLogs';
import { PageSection } from '@/components/layout/PageLayout';
import { useToast } from '@/hooks/use-toast';
import { CreatePromptLogDialog } from '@/components/CreatePromptLogDialog';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  archived: 'bg-gray-100 text-gray-800 border-gray-200'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700'
};

const PromptLogs: React.FC = () => {
  const { logs, loading, fetchLogs, updateLog, deleteLog, exportLogs } = usePromptLogs();
  const [filters, setFilters] = useState<PromptLogFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleFilterChange = (key: keyof PromptLogFilters, value: string) => {
    const newFilters = { ...filters, [key]: value === 'all' ? undefined : value };
    setFilters(newFilters);
    fetchLogs(newFilters);
  };

  const handleUpdateLog = async (id: string, updates: any) => {
    const { error } = await updateLog(id, updates);
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Log updated successfully",
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this log?')) return;
    
    const { error } = await deleteLog(id);
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Log deleted successfully",
      });
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    const { error } = await exportLogs(format);
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Logs exported as ${format.toUpperCase()}`,
      });
    }
  };

  const filteredLogs = logs.filter(log =>
    searchTerm === '' || 
    log.user_prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusCounts = logs.reduce((acc, log) => {
    acc[log.status] = (acc[log.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
  return (
    <PageSection className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Prompt Logs</h1>
        <p className="text-muted-foreground">Track and manage AI prompt interactions</p>
      </div>
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading logs...</div>
      </div>
    </PageSection>
  );
  }

  return (
    <PageSection className="space-y-6" data-testid="prompt-logs-page">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Prompt Logs</h1>
          <p className="text-muted-foreground">Track and manage AI prompt interactions and implementation status</p>
        </div>
        <CreatePromptLogDialog />
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground capitalize">
                    {status.replace('_', ' ')}
                  </p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                <Badge className={statusColors[status as keyof typeof statusColors]}>
                  {status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Filter & Search</CardTitle>
            <div className="flex gap-2">
              <Button onClick={() => handleExport('json')} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
              <Button onClick={() => handleExport('csv')} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Select onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('priority', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="feature_request">Feature Request</SelectItem>
                <SelectItem value="bug_fix">Bug Fix</SelectItem>
                <SelectItem value="enhancement">Enhancement</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                data-testid="search-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <Card key={log.id} className="hover:shadow-sm transition-shadow" data-testid="log-item">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg leading-tight">
                      {log.summary || log.user_prompt.substring(0, 100) + '...'}
                    </h3>
                    <div className="flex gap-2 ml-4">
                      <Badge className={priorityColors[log.priority]}>
                        {log.priority}
                      </Badge>
                      <Badge className={statusColors[log.status]}>
                        {log.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Category:</span> {log.category}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Created:</span> {new Date(log.created_at).toLocaleString()}
                    </p>
                    {log.commit_hash && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Commit:</span> 
                        <code className="ml-1 px-1 py-0.5 bg-muted rounded text-xs">
                          {log.commit_hash}
                        </code>
                      </p>
                    )}
                    {log.implementation_notes && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Notes:</span> {log.implementation_notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Prompt Log Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">User Prompt</label>
                          <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                            {log.user_prompt}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">AI Response</label>
                          <div className="mt-1 p-3 bg-muted rounded-md text-sm max-h-64 overflow-y-auto">
                            {log.ai_response}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Log</DialogTitle>
                      </DialogHeader>
                      {selectedLog && <EditLogForm log={selectedLog} onSave={handleUpdateLog} />}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteLog(log.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredLogs.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No logs found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageSection>
  );
};

const EditLogForm: React.FC<{ log: any; onSave: (id: string, updates: any) => void }> = ({ log, onSave }) => {
  const [status, setStatus] = useState(log.status);
  const [priority, setPriority] = useState(log.priority);
  const [implementationNotes, setImplementationNotes] = useState(log.implementation_notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(log.id, {
      status,
      priority,
      implementation_notes: implementationNotes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Priority</label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Implementation Notes</label>
        <Textarea
          value={implementationNotes}
          onChange={(e) => setImplementationNotes(e.target.value)}
          placeholder="Add implementation notes..."
          className="mt-1"
        />
      </div>

      <Button type="submit" className="w-full">
        Save Changes
      </Button>
    </form>
  );
};

export default PromptLogs;