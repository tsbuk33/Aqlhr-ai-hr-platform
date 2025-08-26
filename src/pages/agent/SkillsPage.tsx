import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Search, 
  Filter, 
  Activity, 
  Settings, 
  RefreshCw,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { useAgentSkills } from '@/hooks/useAgentSkills';
import { SkillCard } from '@/components/agent/SkillCard';
import { ExecutionHistory } from '@/components/agent/ExecutionHistory';
import { useToast } from '@/hooks/use-toast';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const SkillsPage: React.FC = () => {
  const {
    skills,
    bindings,
    executions,
    loading,
    toggleSkillBinding,
    executeSkill,
    getSkillBinding,
    getSkillsByCategory,
    getExecutionsBySkill,
    fetchBindings,
    fetchExecutions
  } = useAgentSkills();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  const skillsByCategory = getSkillsByCategory();
  const categories = Object.keys(skillsByCategory);
  
  // Filter skills based on search and category
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const enabledSkillsCount = bindings.filter(b => b.enabled).length;
  const runningSkillsCount = executions.filter(e => e.status === 'running').length;
  const recentExecutions = executions.slice(0, 10);

  const handleRefresh = async () => {
    try {
      await Promise.all([fetchBindings(), fetchExecutions()]);
      toast({
        title: "Refreshed",
        description: "Skills data has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive"
      });
    }
  };

  const handleExecuteAll = async () => {
    const enabledBindings = bindings.filter(b => b.enabled && b.agent_skills?.execution_type === 'manual');
    
    if (enabledBindings.length === 0) {
      toast({
        title: "No Skills",
        description: "No manual skills are enabled for execution",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Executing Skills",
      description: `Starting execution of ${enabledBindings.length} enabled skills`,
    });

    for (const binding of enabledBindings) {
      try {
        await executeSkill(binding.skill_code, {}, false);
      } catch (error) {
        console.error(`Failed to execute ${binding.skill_code}:`, error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading AgentOS...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bot className="h-8 w-8 text-primary" />
            AgentOS
            <Badge variant="outline" className="text-xs">v1.0</Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            Autonomous HR Agent Skill Registry
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExecuteAll} disabled={runningSkillsCount > 0}>
            <Zap className="h-4 w-4 mr-2" />
            Execute All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Skills</p>
                <p className="text-2xl font-bold">{skills.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Enabled</p>
                <p className="text-2xl font-bold">{enabledSkillsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-yellow-500 animate-pulse" />
              <div>
                <p className="text-sm font-medium">Running</p>
                <p className="text-2xl font-bold">{runningSkillsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Recent Errors</p>
                <p className="text-2xl font-bold">
                  {executions.filter(e => e.status === 'error' && 
                    new Date(e.started_at).getTime() > Date.now() - 24 * 60 * 60 * 1000
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="skills" className="space-y-4">
        <TabsList>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Execution History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All ({skills.length})
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.replace('_', ' ')} ({skillsByCategory[category].length})
                </Button>
              ))}
            </div>
          </div>

          {/* Skills Grid */}
          {filteredSkills.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Skills Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms' : 'No skills match the selected category'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredSkills.map((skill) => {
                const binding = getSkillBinding(skill.code);
                const skillExecutions = getExecutionsBySkill(skill.code);
                const lastExecution = skillExecutions[0];
                
                return (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    binding={binding}
                    onToggle={toggleSkillBinding}
                    onExecute={executeSkill}
                    executionCount={skillExecutions.length}
                    lastExecution={lastExecution ? {
                      status: lastExecution.status,
                      started_at: lastExecution.started_at,
                      metrics: lastExecution.metrics
                    } : undefined}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <ExecutionHistory
            executions={recentExecutions}
            onRefresh={() => fetchExecutions(50)}
            loading={loading}
          />
        </TabsContent>
      </Tabs>

      {/* AI Integration for Agent Skills */}
      <UniversalAIIntegrator 
        pageType="ai-ecosystem" 
        moduleName="agent-skills" 
        companyId="demo-company" 
        enabledFeatures={['autonomous-operations', 'intelligent-automation', 'machine-learning']}
      />
    </div>
  );
};

export default SkillsPage;