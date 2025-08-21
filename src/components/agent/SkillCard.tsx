import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Activity,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AgentSkill, AgentSkillBinding } from '@/hooks/useAgentSkills';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SkillCardProps {
  skill: AgentSkill;
  binding: AgentSkillBinding | undefined;
  onToggle: (skillCode: string, enabled: boolean) => void;
  onExecute: (skillCode: string, dryRun?: boolean) => void;
  executionCount: number;
  lastExecution?: {
    status: string;
    started_at: string;
    metrics?: any;
  };
}

export const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  binding,
  onToggle,
  onExecute,
  executionCount,
  lastExecution
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const isEnabled = binding?.enabled || false;
  
  const getStatusIcon = (status?: string) => {
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

  const getCategoryColor = (category: string) => {
    const colors = {
      'culture_intelligence': 'bg-purple-100 text-purple-800 border-purple-200',
      'compliance': 'bg-red-100 text-red-800 border-red-200',
      'document_processing': 'bg-blue-100 text-blue-800 border-blue-200',
      'engagement': 'bg-green-100 text-green-800 border-green-200',
      'general': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getExecutionTypeColor = (type: string) => {
    const colors = {
      'scheduled': 'bg-blue-50 text-blue-700 border-blue-200',
      'triggered': 'bg-amber-50 text-amber-700 border-amber-200',
      'manual': 'bg-green-50 text-green-700 border-green-200'
    };
    return colors[type as keyof typeof colors] || colors.manual;
  };

  const handleExecute = async (dryRun = false) => {
    setIsExecuting(true);
    try {
      await onExecute(skill.code, dryRun);
    } finally {
      setIsExecuting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Card className={`transition-all duration-200 ${isEnabled ? 'border-primary/20 bg-primary/5' : 'border-border'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-base font-medium truncate">{skill.name}</CardTitle>
              <Badge variant="outline" className={getCategoryColor(skill.category)}>
                {skill.category.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className={getExecutionTypeColor(skill.execution_type)}>
                {skill.execution_type}
              </Badge>
            </div>
            <CardDescription className="text-sm text-muted-foreground">
              {skill.description}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-3 ml-4">
            {lastExecution && (
              <div className="flex items-center gap-1 text-sm">
                {getStatusIcon(lastExecution.status)}
                <span className="text-muted-foreground">
                  {executionCount > 0 ? executionCount : 'Never'}
                </span>
              </div>
            )}
            <Switch
              checked={isEnabled}
              onCheckedChange={(enabled) => onToggle(skill.code, enabled)}
              aria-label={`Toggle ${skill.name}`}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Last Execution Info */}
          {binding?.last_run_at && (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                {getStatusIcon(binding.last_run_status || undefined)}
                <div>
                  <p className="text-sm font-medium">
                    Last run: {formatDate(binding.last_run_at)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Status: {binding.last_run_status || 'Unknown'} • Runs: {binding.run_count}
                  </p>
                </div>
              </div>
              {binding.last_run_metrics && Object.keys(binding.last_run_metrics).length > 0 && (
                <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Metrics
                      {isExpanded ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              )}
            </div>
          )}

          {/* Metrics Expansion */}
          {binding?.last_run_metrics && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(binding.last_run_metrics).map(([key, value]) => (
                    <div key={key} className="p-2 bg-muted/30 rounded text-sm">
                      <div className="font-medium capitalize">{key.replace('_', ' ')}</div>
                      <div className="text-muted-foreground">
                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExecute(true)}
              disabled={!isEnabled || isExecuting}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              Test Run
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={() => handleExecute(false)}
              disabled={!isEnabled || isExecuting || skill.execution_type === 'scheduled'}
              className="flex-1"
            >
              {isExecuting ? (
                <Activity className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Execute
            </Button>

            <Button
              variant="ghost"
              size="sm"
              disabled={!isEnabled}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};