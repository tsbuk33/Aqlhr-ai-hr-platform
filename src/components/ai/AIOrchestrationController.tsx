import React, { useState } from 'react';
import { Bot, Settings, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIOrchestrationControllerProps {
  className?: string;
}

export const AIOrchestrationController: React.FC<AIOrchestrationControllerProps> = ({ className }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStartOrchestration = async () => {
    setIsRunning(true);
    setCurrentTask('Initializing AI orchestration...');
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-orchestration-engine', {
        body: {
          action: 'start',
          context: 'user-initiated'
        }
      });

      if (error) throw error;

      setCurrentTask('AI orchestration active');
      toast({
        title: "AI Orchestration Started",
        description: "The AI orchestration engine is now active and monitoring workflows.",
      });
    } catch (error) {
      console.error('AI orchestration error:', error);
      setIsRunning(false);
      setCurrentTask(null);
      toast({
        title: "Orchestration Failed",
        description: "Failed to start AI orchestration engine.",
        variant: "destructive",
      });
    }
  };

  const handleStopOrchestration = () => {
    setIsRunning(false);
    setCurrentTask(null);
    toast({
      title: "AI Orchestration Stopped",
      description: "The AI orchestration engine has been deactivated.",
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentTask(null);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Orchestration Engine
        </CardTitle>
        <CardDescription>
          Autonomous workflow management and task orchestration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant={isRunning ? "default" : "secondary"}>
            {isRunning ? 'Active' : 'Idle'}
          </Badge>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={isRunning}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            {!isRunning ? (
              <Button onClick={handleStartOrchestration} className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Start Orchestration
              </Button>
            ) : (
              <Button onClick={handleStopOrchestration} variant="destructive" className="flex-1">
                <Pause className="h-4 w-4 mr-2" />
                Stop Orchestration
              </Button>
            )}
          </div>

          {currentTask && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Current Task:</p>
              <p className="text-sm font-medium">{currentTask}</p>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          The AI orchestration engine manages autonomous workflows, decision processes, and task coordination across the platform.
        </div>
      </CardContent>
    </Card>
  );
};