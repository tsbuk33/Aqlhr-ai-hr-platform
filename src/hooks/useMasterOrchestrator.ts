import { useState, useEffect, useCallback } from 'react';
import { masterOrchestrator, SystemStatus, AutonomousModule } from '@/lib/autonomous/MasterOrchestrator';
import { supabase } from '@/integrations/supabase/client';

export interface OrchestratorState {
  isInitialized: boolean;
  isRunning: boolean;
  systemStatus: SystemStatus | null;
  modules: AutonomousModule[];
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

export const useMasterOrchestrator = () => {
  const [state, setState] = useState<OrchestratorState>({
    isInitialized: false,
    isRunning: false,
    systemStatus: null,
    modules: [],
    loading: true,
    error: null,
    lastUpdate: null
  });

  // Load system data
  const loadSystemData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const [systemStatus, modules] = await Promise.all([
        masterOrchestrator.getSystemStatus(),
        Promise.resolve(masterOrchestrator.getAllModules())
      ]);

      setState(prev => ({
        ...prev,
        systemStatus,
        modules,
        loading: false,
        lastUpdate: new Date(),
        isInitialized: true
      }));

    } catch (error) {
      console.error('Failed to load orchestrator data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  }, []);

  // Start orchestration
  const startOrchestration = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      await masterOrchestrator.startMasterOrchestration();
      
      setState(prev => ({ ...prev, isRunning: true, loading: false }));
      
      // Refresh data after starting
      await loadSystemData();
      
      return { success: true };
    } catch (error) {
      console.error('Failed to start orchestration:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to start orchestration'
      }));
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to start orchestration' 
      };
    }
  }, [loadSystemData]);

  // Stop orchestration
  const stopOrchestration = useCallback(() => {
    try {
      masterOrchestrator.stopOrchestration();
      setState(prev => ({ ...prev, isRunning: false }));
      
      return { success: true };
    } catch (error) {
      console.error('Failed to stop orchestration:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to stop orchestration' 
      };
    }
  }, []);

  // Execute autonomous compliance check
  const executeComplianceCheck = useCallback(async () => {
    try {
      await masterOrchestrator.executeAutonomousCompliance();
      await loadSystemData(); // Refresh after compliance check
      
      return { success: true };
    } catch (error) {
      console.error('Compliance check failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Compliance check failed' 
      };
    }
  }, [loadSystemData]);

  // Get module by name
  const getModule = useCallback((moduleName: string): AutonomousModule | undefined => {
    return state.modules.find(module => module.name === moduleName);
  }, [state.modules]);

  // Get modules by category
  const getModulesByCategory = useCallback((category: string): AutonomousModule[] => {
    return state.modules.filter(module => module.category === category);
  }, [state.modules]);

  // Get system health summary
  const getHealthSummary = useCallback(() => {
    if (!state.modules.length) return null;

    const total = state.modules.length;
    const active = state.modules.filter(m => m.status === 'active').length;
    const error = state.modules.filter(m => m.status === 'error').length;
    const inactive = state.modules.filter(m => m.status === 'inactive').length;

    const averageSuccessRate = state.modules.reduce((acc, m) => acc + m.metrics.successRate, 0) / total;
    const averageComplianceScore = state.modules.reduce((acc, m) => acc + m.metrics.complianceScore, 0) / total;

    return {
      total,
      active,
      error,
      inactive,
      healthPercentage: Math.round((active / total) * 100),
      averageSuccessRate: Math.round(averageSuccessRate),
      averageComplianceScore: Math.round(averageComplianceScore)
    };
  }, [state.modules]);

  // Subscribe to real-time updates
  useEffect(() => {
    const setupRealtimeSubscription = () => {
      return supabase
        .channel('orchestrator-updates')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'agent_actions' },
          (payload) => {
            console.log('New autonomous action:', payload.new);
            // Optionally refresh data on new actions
            if (payload.new.action_type === 'autonomous_compliance') {
              loadSystemData();
            }
          }
        )
        .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'automation_metrics' },
          (payload) => {
            console.log('Automation metrics updated:', payload.new);
            // Update relevant module metrics
          }
        )
        .subscribe();
    };

    const channel = setupRealtimeSubscription();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadSystemData]);

  // Auto-refresh system data
  useEffect(() => {
    loadSystemData();

    // Set up auto-refresh interval
    const interval = setInterval(() => {
      if (state.isRunning) {
        loadSystemData();
      }
    }, 30000); // Refresh every 30 seconds when running

    return () => clearInterval(interval);
  }, [loadSystemData, state.isRunning]);

  // Record system action
  const recordAction = useCallback(async (
    actionType: string, 
    payload: any, 
    tenantId: string = 'demo-company'
  ) => {
    try {
      const { error } = await supabase
        .from('agent_actions')
        .insert({
          tenant_id: tenantId,
          action_type: actionType,
          payload: {
            ...payload,
            timestamp: new Date().toISOString(),
            source: 'master_orchestrator'
          },
          status: 'started'
        });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to record action:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to record action' 
      };
    }
  }, []);

  // Log automation metric
  const logMetric = useCallback(async (
    action: string,
    success: boolean,
    automationScore: number,
    tenantId: string = 'demo-company'
  ) => {
    try {
      const { error } = await supabase
        .from('automation_metrics')
        .insert({
          tenant_id: tenantId,
          action,
          success,
          automation_score: automationScore,
          command_type: 'autonomous_orchestration',
          complexity: 'complex',
          autonomy_level: 95,
          tasks_completed: [`orchestrator_${action}`],
          metadata: {
            timestamp: new Date().toISOString(),
            source: 'master_orchestrator'
          }
        });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to log metric:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to log metric' 
      };
    }
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    loadSystemData,
    startOrchestration,
    stopOrchestration,
    executeComplianceCheck,
    
    // Utilities
    getModule,
    getModulesByCategory,
    getHealthSummary,
    recordAction,
    logMetric,
    
    // Computed values
    isHealthy: state.systemStatus ? state.systemStatus.performanceMetrics.errorRate < 1 : false,
    isCompliant: state.systemStatus?.complianceStatus === 'compliant',
    totalModules: state.modules.length,
    activeModules: state.modules.filter(m => m.status === 'active').length,
    errorModules: state.modules.filter(m => m.status === 'error').length
  };
};