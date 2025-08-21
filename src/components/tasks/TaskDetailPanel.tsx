import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  User, 
  CheckCircle, 
  Mail, 
  Clock, 
  AlertCircle,
  X,
  MessageSquare
} from 'lucide-react';
import { Task } from '@/hooks/useTasks';

interface TaskDetailPanelProps {
  task: Task | null;
  onAssign: (taskId: string, ownerUserId?: string, ownerRole?: string) => Promise<void>;
  onComplete: (taskId: string, completionNotes?: string) => Promise<void>;
  onNotify: (taskId: string, channel?: 'email' | 'system' | 'sms', toUserId?: string, toEmail?: string, message?: string) => Promise<string>;
  onClose: () => void;
}

export const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({
  task,
  onAssign,
  onComplete,
  onNotify,
  onClose
}) => {
  const [completionNotes, setCompletionNotes] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [assigneeRole, setAssigneeRole] = useState('');
  const [loading, setLoading] = useState(false);

  if (!task) {
    return (
      <Card className="h-fit">
        <CardContent className="p-8 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Select a task to view details</p>
        </CardContent>
      </Card>
    );
  }

  const handleAssign = async () => {
    setLoading(true);
    try {
      await onAssign(task.id, undefined, assigneeRole);
      setAssigneeRole('');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await onComplete(task.id, completionNotes);
      setCompletionNotes('');
    } finally {
      setLoading(false);
    }
  };

  const handleNotify = async () => {
    setLoading(true);
    try {
      await onNotify(task.id, 'email', undefined, notificationEmail, notificationMessage);
      setNotificationEmail('');
      setNotificationMessage('');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'text-red-600 bg-red-100',
      high: 'text-orange-600 bg-orange-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-green-600 bg-green-100'
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      in_progress: 'text-blue-600 bg-blue-100',
      completed: 'text-green-600 bg-green-100',
      cancelled: 'text-gray-600 bg-gray-100',
      overdue: 'text-red-600 bg-red-100'
    };
    return colors[status] || colors.pending;
  };

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Task Details</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Task Header */}
        <div>
          <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={getPriorityColor(task.priority)}>
              <AlertCircle className="h-3 w-3 mr-1" />
              {task.priority.toUpperCase()}
            </Badge>
            <Badge className={getStatusColor(task.status)}>
              {task.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge variant="outline">{task.module}</Badge>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}
        </div>

        {/* Task Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Due: {task.due_at ? new Date(task.due_at).toLocaleDateString() : 'No due date'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Assigned: {task.owner_name || 'Unassigned'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        {task.status === 'pending' && (
          <div className="space-y-3">
            <Label>Assign Task</Label>
            <div className="flex gap-2">
              <Select value={assigneeRole} onValueChange={setAssigneeRole}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hr_manager">HR Manager</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAssign} disabled={!assigneeRole || loading}>
                Assign
              </Button>
            </div>
          </div>
        )}

        {(task.status === 'in_progress' || task.status === 'pending') && (
          <div className="space-y-3">
            <Label>Complete Task</Label>
            <Textarea
              placeholder="Add completion notes..."
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              rows={3}
            />
            <Button onClick={handleComplete} disabled={loading} className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
          </div>
        )}

        {/* Send Notification */}
        <div className="space-y-3">
          <Label>Send Notification</Label>
          <Input
            placeholder="Email address"
            type="email"
            value={notificationEmail}
            onChange={(e) => setNotificationEmail(e.target.value)}
          />
          <Textarea
            placeholder="Custom message (optional)"
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            rows={2}
          />
          <Button 
            variant="outline" 
            onClick={handleNotify} 
            disabled={!notificationEmail || loading}
            className="w-full"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Notification
          </Button>
        </div>

        {/* Metadata */}
        {task.metadata && Object.keys(task.metadata).length > 0 && (
          <div className="space-y-2">
            <Label>Additional Information</Label>
            <div className="text-xs bg-muted p-2 rounded-md">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(task.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};