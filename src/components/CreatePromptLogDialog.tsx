import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { usePromptLogs, type PromptLog } from '@/hooks/usePromptLogs';
import { useToast } from '@/hooks/use-toast';

export function CreatePromptLogDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<{
    user_prompt: string;
    ai_response: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'in_progress' | 'completed' | 'archived';
    commit_hash: string;
    implementation_notes: string;
  }>({
    user_prompt: '',
    ai_response: '',
    category: 'general',
    priority: 'medium',
    status: 'pending',
    commit_hash: '',
    implementation_notes: ''
  });
  const { createLog } = usePromptLogs();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.user_prompt || !formData.ai_response) {
      toast({
        title: "Error",
        description: "User prompt and AI response are required",
        variant: "destructive",
      });
      return;
    }

    const { error } = await createLog(formData);
    
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Prompt log created successfully",
      });
      setIsOpen(false);
      setFormData({
        user_prompt: '',
        ai_response: '',
        category: 'general',
        priority: 'medium',
        status: 'pending',
        commit_hash: '',
        implementation_notes: ''
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Prompt Log
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Prompt Log</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user_prompt">User Prompt *</Label>
            <Textarea
              id="user_prompt"
              value={formData.user_prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, user_prompt: e.target.value }))}
              placeholder="Enter the user prompt..."
              className="min-h-[100px]"
              data-testid="user-prompt-input"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ai_response">AI Response *</Label>
            <Textarea
              id="ai_response"
              value={formData.ai_response}
              onChange={(e) => setFormData(prev => ({ ...prev, ai_response: e.target.value }))}
              placeholder="Enter the AI response..."
              className="min-h-[100px]"
              data-testid="ai-response-input"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger data-testid="category-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="bug_fix">Bug Fix</SelectItem>
                  <SelectItem value="feature_request">Feature Request</SelectItem>
                  <SelectItem value="optimization">Optimization</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="authentication">Authentication</SelectItem>
                  <SelectItem value="ui">UI/UX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger data-testid="priority-select">
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
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'pending' | 'in_progress' | 'completed' | 'archived') => setFormData(prev => ({ ...prev, status: value }))}>
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
            
            <div className="space-y-2">
              <Label htmlFor="commit_hash">Commit Hash</Label>
              <Input
                id="commit_hash"
                value={formData.commit_hash}
                onChange={(e) => setFormData(prev => ({ ...prev, commit_hash: e.target.value }))}
                placeholder="abc123def..."
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="implementation_notes">Implementation Notes</Label>
            <Textarea
              id="implementation_notes"
              value={formData.implementation_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, implementation_notes: e.target.value }))}
              placeholder="Add any implementation notes..."
              className="min-h-[80px]"
              data-testid="implementation-notes"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Log
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}