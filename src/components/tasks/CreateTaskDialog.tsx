import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (taskData: {
    module: string;
    title: string;
    description?: string;
    due_at?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    owner_role?: string;
    metadata?: any;
  }) => Promise<string>;
  modules: string[];
}

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  open,
  onOpenChange,
  onCreate,
  modules
}) => {
  const [formData, setFormData] = useState({
    module: '',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    owner_role: '',
    source: 'manual'
  });
  const [dueDate, setDueDate] = useState<Date>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.module) {
      return;
    }

    setLoading(true);
    try {
      await onCreate({
        ...formData,
        description: formData.description || undefined,
        due_at: dueDate?.toISOString(),
        owner_role: formData.owner_role || undefined,
        metadata: {
          source: formData.source,
          created_via: 'task_center_ui'
        }
      });

      // Reset form
      setFormData({
        module: '',
        title: '',
        description: '',
        priority: 'medium',
        owner_role: '',
        source: 'manual'
      });
      setDueDate(undefined);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Module & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="module">Module *</Label>
              <Select 
                value={formData.module} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, module: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cci_playbook">CCI Playbook</SelectItem>
                  <SelectItem value="employee_management">Employee Management</SelectItem>
                  <SelectItem value="payroll">Payroll</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="recruitment">Recruitment</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  {modules.map(module => (
                    <SelectItem key={module} value={module}>{module}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title..."
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description..."
              rows={3}
            />
          </div>

          {/* Due Date & Assignee */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'PPP') : 'Select due date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="owner_role">Assign to Role</Label>
              <Select 
                value={formData.owner_role} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, owner_role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hr_manager">HR Manager</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="cci_analyst">CCI Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Source */}
          <div className="space-y-2">
            <Label htmlFor="source">Task Source</Label>
            <Select 
              value={formData.source} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual Entry</SelectItem>
                <SelectItem value="ai_generated">AI Generated</SelectItem>
                <SelectItem value="cci_playbook">CCI Playbook</SelectItem>
                <SelectItem value="workflow_automation">Workflow Automation</SelectItem>
                <SelectItem value="compliance_check">Compliance Check</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.title || !formData.module}>
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};