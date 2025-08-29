import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar, GitCommit, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

interface PromptEntry {
  id: string;
  timestamp: string;
  category: string;
  title: string;
  description: string;
  status: 'implemented' | 'in-progress' | 'pending' | 'blocked';
  priority: 'high' | 'medium' | 'low';
  relatedCommits?: string[];
  implementation_notes?: string;
}

const initialPrompts: PromptEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-15T10:00:00Z',
    category: 'AI Infrastructure',
    title: 'AI Agent Orchestrator Implementation',
    description: 'Create multi-provider AI orchestration system with fallback capabilities',
    status: 'implemented',
    priority: 'high',
    implementation_notes: 'useAIAgentOrchestrator hook created with OpenAI, Claude, Gemini support'
  },
  {
    id: '2',
    timestamp: '2024-01-16T14:30:00Z',
    category: 'Authentication',
    title: 'Supabase Authentication Setup',
    description: 'Implement user authentication with RLS policies',
    status: 'implemented',
    priority: 'high',
    implementation_notes: 'Auth components and policies in place'
  },
  {
    id: '3',
    timestamp: '2024-01-17T09:15:00Z',
    category: 'UI/UX',
    title: 'Arabic Language Support',
    description: 'Add RTL support and Arabic localization context',
    status: 'implemented',
    priority: 'medium',
    implementation_notes: 'SimpleLanguageContext with Arabic/English toggle'
  },
  {
    id: '4',
    timestamp: '2024-01-18T11:45:00Z',
    category: 'AI Features',
    title: 'AI Response Debugging',
    description: 'Fix AI assistant response display and formatting issues',
    status: 'in-progress',
    priority: 'high',
    implementation_notes: 'Investigating response formatting in AqlHRAIAssistant'
  },
  {
    id: '5',
    timestamp: '2024-01-19T16:20:00Z',
    category: 'System Architecture',
    title: 'Prompt Tracking System',
    description: 'Create comprehensive prompt log dashboard and API endpoint',
    status: 'in-progress',
    priority: 'medium',
    implementation_notes: 'Building PromptLog component and export API'
  }
];

const statusIcons = {
  implemented: <CheckCircle className="h-4 w-4 text-green-500" />,
  'in-progress': <Clock className="h-4 w-4 text-yellow-500" />,
  pending: <AlertCircle className="h-4 w-4 text-orange-500" />,
  blocked: <AlertCircle className="h-4 w-4 text-red-500" />
};

const priorityColors = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
};

export default function PromptLog() {
  const [prompts, setPrompts] = useState<PromptEntry[]>(initialPrompts);
  const [filter, setFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);

  const filteredPrompts = prompts.filter(prompt => 
    filter === 'all' || prompt.status === filter
  );

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('prompt-log-export');
      
      if (error) throw error;
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aqlhr-prompt-log-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Prompt log exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export prompt log');
    } finally {
      setIsExporting(false);
    }
  };

  const statusCounts = prompts.reduce((acc, prompt) => {
    acc[prompt.status] = (acc[prompt.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl" dir="ltr">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AqlHR Instruction Inventory</h1>
        <p className="text-muted-foreground">
          Comprehensive tracking of all prompts, instructions, and implementation status
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="p-4 flex items-center space-x-2">
              {statusIcons[status as keyof typeof statusIcons]}
              <div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground capitalize">{status.replace('-', ' ')}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All ({prompts.length})
          </Button>
          <Button
            variant={filter === 'implemented' ? 'default' : 'outline'}
            onClick={() => setFilter('implemented')}
            size="sm"
          >
            Implemented ({statusCounts.implemented || 0})
          </Button>
          <Button
            variant={filter === 'in-progress' ? 'default' : 'outline'}
            onClick={() => setFilter('in-progress')}
            size="sm"
          >
            In Progress ({statusCounts['in-progress'] || 0})
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            size="sm"
          >
            Pending ({statusCounts.pending || 0})
          </Button>
        </div>
        
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="ml-auto"
          size="sm"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export JSON'}
        </Button>
      </div>

      {/* Prompt List */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {filteredPrompts.map((prompt, index) => (
            <Card key={prompt.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {statusIcons[prompt.status]}
                      <CardTitle className="text-lg">{prompt.title}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(prompt.timestamp).toLocaleDateString()}</span>
                      <Separator orientation="vertical" className="h-3" />
                      <span>{prompt.category}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={priorityColors[prompt.priority]}>
                      {prompt.priority}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {prompt.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="mb-3">
                  {prompt.description}
                </CardDescription>
                
                {prompt.implementation_notes && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      <strong>Implementation Notes:</strong> {prompt.implementation_notes}
                    </p>
                  </div>
                )}
                
                {prompt.relatedCommits && (
                  <div className="mt-3 flex items-center space-x-2">
                    <GitCommit className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Related commits: {prompt.relatedCommits.join(', ')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
      
      <UniversalAIIntegrator 
        pageType="analytics" 
        moduleName="prompt-log" 
        companyId="demo-company" 
        enabledFeatures={['data-analysis', 'export-optimization', 'intelligent-insights', 'prompt-analytics']}
      />
      
      <AqlHRAIAssistant 
        moduleContext="analytics.prompt-log" 
        companyId="demo-company"
      />
    </div>
  );
}