import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserCompany } from '@/hooks/useUserCompany';

export interface AgentSkill {
  id: string;
  code: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
  execution_type: string;
  default_config: any;
  created_at: string;
  updated_at: string;
}

export interface AgentSkillBinding {
  id: string;
  tenant_id: string;
  skill_code: string;
  config: any;
  enabled: boolean;
  last_run_at: string | null;
  last_run_status: string | null;
  last_run_metrics: any;
  next_run_at: string | null;
  run_count: number;
  created_at: string;
  updated_at: string;
  agent_skills?: AgentSkill;
}

export interface AgentSkillExecution {
  id: string;
  tenant_id: string;
  skill_code: string;
  execution_id: string;
  started_at: string;
  completed_at: string | null;
  status: string;
  input_data: any;
  output_data: any;
  metrics: any;
  error_message: string | null;
  dry_run: boolean;
  created_at: string;
}

export const useAgentSkills = () => {
  const [skills, setSkills] = useState<AgentSkill[]>([]);
  const [bindings, setBindings] = useState<AgentSkillBinding[]>([]);
  const [executions, setExecutions] = useState<AgentSkillExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { companyId } = useUserCompany();

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_skills')
        .select('*')
        .eq('enabled', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching agent skills:', error);
      toast({
        title: "Error",
        description: "Failed to load agent skills",
        variant: "destructive"
      });
    }
  };

  const fetchBindings = async () => {
    if (!companyId) return;
    
    try {
      const { data, error } = await supabase
        .from('agent_skill_bindings')
        .select(`
          *,
          agent_skills (*)
        `)
        .eq('tenant_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBindings(data || []);
    } catch (error) {
      console.error('Error fetching skill bindings:', error);
      toast({
        title: "Error",
        description: "Failed to load skill bindings",
        variant: "destructive"
      });
    }
  };

  const fetchExecutions = async (limit = 50) => {
    if (!companyId) return;
    
    try {
      const { data, error } = await supabase
        .from('agent_skill_executions')
        .select('*')
        .eq('tenant_id', companyId)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setExecutions(data || []);
    } catch (error) {
      console.error('Error fetching skill executions:', error);
      toast({
        title: "Error",
        description: "Failed to load skill executions",
        variant: "destructive"
      });
    }
  };

  const toggleSkillBinding = async (skillCode: string, enabled: boolean, config = {}) => {
    if (!companyId) return;

    try {
      const existingBinding = bindings.find(b => b.skill_code === skillCode);
      
      if (existingBinding) {
        // Update existing binding
        const { error } = await supabase
          .from('agent_skill_bindings')
          .update({ 
            enabled,
            config: { ...existingBinding.config, ...config },
            updated_at: new Date().toISOString()
          })
          .eq('id', existingBinding.id);

        if (error) throw error;
      } else {
        // Create new binding
        const skill = skills.find(s => s.code === skillCode);
        if (!skill) throw new Error('Skill not found');

        const { error } = await supabase
          .from('agent_skill_bindings')
          .insert({
            tenant_id: companyId,
            skill_code: skillCode,
            enabled,
            config: { ...skill.default_config, ...config }
          });

        if (error) throw error;
      }

      await fetchBindings();
      toast({
        title: "Success",
        description: `Skill ${enabled ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling skill binding:', error);
      toast({
        title: "Error",
        description: "Failed to update skill binding",
        variant: "destructive"
      });
    }
  };

  const executeSkill = async (skillCode: string, input = {}, dryRun = false) => {
    if (!companyId) return null;

    try {
      const { data, error } = await supabase.functions.invoke('agent-skill-executor', {
        body: {
          tenantId: companyId,
          skillCode,
          input,
          dryRun
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Skill executed successfully${dryRun ? ' (dry run)' : ''}`,
      });

      // Refresh executions and bindings
      await Promise.all([fetchExecutions(), fetchBindings()]);
      
      return data;
    } catch (error) {
      console.error('Error executing skill:', error);
      toast({
        title: "Error",
        description: "Failed to execute skill",
        variant: "destructive"
      });
      return null;
    }
  };

  const getSkillBinding = (skillCode: string) => {
    return bindings.find(b => b.skill_code === skillCode);
  };

  const getSkillsByCategory = () => {
    const categorized: Record<string, AgentSkill[]> = {};
    skills.forEach(skill => {
      if (!categorized[skill.category]) {
        categorized[skill.category] = [];
      }
      categorized[skill.category].push(skill);
    });
    return categorized;
  };

  const getExecutionsBySkill = (skillCode: string) => {
    return executions.filter(exec => exec.skill_code === skillCode);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSkills(),
        fetchBindings(),
        fetchExecutions()
      ]);
      setLoading(false);
    };

    loadData();
  }, [companyId]);

  return {
    skills,
    bindings,
    executions,
    loading,
    fetchSkills,
    fetchBindings,
    fetchExecutions,
    toggleSkillBinding,
    executeSkill,
    getSkillBinding,
    getSkillsByCategory,
    getExecutionsBySkill
  };
};