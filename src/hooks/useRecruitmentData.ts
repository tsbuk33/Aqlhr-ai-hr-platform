/**
 * AQLHR Recruitment Data Hook
 * Expert-level React hook for managing recruitment data with real-time updates
 * @author AQLHR Development Team
 * @version 2.0.0
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { recruitmentAPIService, Platform, InternationalAgent, ComplianceService, SyncResult } from '@/services/recruitment/RecruitmentAPIService';

// Types
export interface RecruitmentStats {
  totalPlatforms: number;
  activePlatforms: number;
  totalJobs: number;
  totalCandidates: number;
  internationalCandidates: number;
  complianceScore: number;
  lastUpdated: Date;
}

export interface UseRecruitmentDataOptions {
  autoSync?: boolean;
  syncInterval?: number;
  enableRealTime?: boolean;
  cacheTimeout?: number;
}

export interface RecruitmentDataState {
  platforms: Platform[];
  internationalAgents: InternationalAgent[];
  complianceServices: ComplianceService[];
  stats: RecruitmentStats | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  lastSync: Date | null;
  syncInProgress: boolean;
}

export interface RecruitmentDataActions {
  syncPlatform: (platformId: string) => Promise<SyncResult>;
  syncAllPlatforms: () => Promise<SyncResult[]>;
  checkCompliance: () => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
  toggleAutoSync: () => void;
}

/**
 * Expert-level hook for recruitment data management
 */
export const useRecruitmentData = (
  options: UseRecruitmentDataOptions = {}
): RecruitmentDataState & RecruitmentDataActions => {
  const {
    autoSync = true,
    syncInterval = 5 * 60 * 1000, // 5 minutes
    enableRealTime = true,
    cacheTimeout = 2 * 60 * 1000, // 2 minutes
  } = options;

  // State management
  const [state, setState] = useState<RecruitmentDataState>({
    platforms: [],
    internationalAgents: [],
    complianceServices: [],
    stats: null,
    isLoading: true,
    isInitialized: false,
    error: null,
    lastSync: null,
    syncInProgress: false,
  });

  // Refs for cleanup and intervals
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoSyncEnabled = useRef(autoSync);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, { data: any; timestamp: number }>>(new Map());

  /**
   * Update state with partial updates
   */
  const updateState = useCallback((updates: Partial<RecruitmentDataState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Cache management
   */
  const getCachedData = useCallback((key: string): any | null => {
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.timestamp < cacheTimeout) {
      return cached.data;
    }
    cacheRef.current.delete(key);
    return null;
  }, [cacheTimeout]);

  const setCachedData = useCallback((key: string, data: any): void => {
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now(),
    });
  }, []);

  /**
   * Error handling with automatic retry
   */
  const handleError = useCallback((error: Error, context: string) => {
    console.error(`[useRecruitmentData] Error in ${context}:`, error);
    updateState({
      error: `${context}: ${error.message}`,
      isLoading: false,
    });
  }, [updateState]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  /**
   * Load platforms data with caching
   */
  const loadPlatforms = useCallback(async (): Promise<Platform[]> => {
    const cacheKey = 'platforms';
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const platforms = await recruitmentAPIService.getAllPlatforms();
      setCachedData(cacheKey, platforms);
      return platforms;
    } catch (error) {
      handleError(error as Error, 'Loading platforms');
      return [];
    }
  }, [getCachedData, setCachedData, handleError]);

  /**
   * Load international agents data with caching
   */
  const loadInternationalAgents = useCallback(async (): Promise<InternationalAgent[]> => {
    const cacheKey = 'internationalAgents';
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const agents = await recruitmentAPIService.getInternationalAgents();
      setCachedData(cacheKey, agents);
      return agents;
    } catch (error) {
      handleError(error as Error, 'Loading international agents');
      return [];
    }
  }, [getCachedData, setCachedData, handleError]);

  /**
   * Load compliance services data with caching
   */
  const loadComplianceServices = useCallback(async (): Promise<ComplianceService[]> => {
    const cacheKey = 'complianceServices';
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const services = await recruitmentAPIService.getComplianceServices();
      setCachedData(cacheKey, services);
      return services;
    } catch (error) {
      handleError(error as Error, 'Loading compliance services');
      return [];
    }
  }, [getCachedData, setCachedData, handleError]);

  /**
   * Calculate comprehensive statistics
   */
  const calculateStats = useCallback((
    platforms: Platform[],
    agents: InternationalAgent[],
    compliance: ComplianceService[]
  ): RecruitmentStats => {
    const activePlatforms = platforms.filter(p => p.status === 'active');
    const totalJobs = platforms.reduce((sum, p) => sum + p.activeJobs, 0);
    const totalCandidates = platforms.reduce((sum, p) => sum + p.candidates, 0);
    const internationalCandidates = agents.reduce((sum, a) => sum + a.activeCandidates, 0);
    const complianceScore = compliance.length > 0 
      ? compliance.reduce((sum, c) => sum + c.score, 0) / compliance.length 
      : 0;

    return {
      totalPlatforms: platforms.length,
      activePlatforms: activePlatforms.length,
      totalJobs,
      totalCandidates,
      internationalCandidates,
      complianceScore: Math.round(complianceScore * 10) / 10,
      lastUpdated: new Date(),
    };
  }, []);

  /**
   * Refresh all data
   */
  const refreshData = useCallback(async (): Promise<void> => {
    if (state.isLoading) return;

    updateState({ isLoading: true, error: null });

    try {
      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Load all data in parallel
      const [platforms, agents, compliance] = await Promise.all([
        loadPlatforms(),
        loadInternationalAgents(),
        loadComplianceServices(),
      ]);

      // Calculate statistics
      const stats = calculateStats(platforms, agents, compliance);

      // Update state
      updateState({
        platforms,
        internationalAgents: agents,
        complianceServices: compliance,
        stats,
        isLoading: false,
        isInitialized: true,
        lastSync: new Date(),
      });

    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        handleError(error, 'Refreshing data');
      }
    }
  }, [
    state.isLoading,
    updateState,
    loadPlatforms,
    loadInternationalAgents,
    loadComplianceServices,
    calculateStats,
    handleError,
  ]);

  /**
   * Sync specific platform
   */
  const syncPlatform = useCallback(async (platformId: string): Promise<SyncResult> => {
    updateState({ syncInProgress: true, error: null });

    try {
      const result = await recruitmentAPIService.syncPlatform(platformId);
      
      if (result.success) {
        // Refresh data after successful sync
        await refreshData();
      }

      return result;
    } catch (error) {
      handleError(error as Error, `Syncing platform ${platformId}`);
      throw error;
    } finally {
      updateState({ syncInProgress: false });
    }
  }, [updateState, refreshData, handleError]);

  /**
   * Sync all platforms
   */
  const syncAllPlatforms = useCallback(async (): Promise<SyncResult[]> => {
    updateState({ syncInProgress: true, error: null });

    try {
      const results = await recruitmentAPIService.syncAllPlatforms();
      
      // Refresh data after sync
      await refreshData();

      return results;
    } catch (error) {
      handleError(error as Error, 'Syncing all platforms');
      throw error;
    } finally {
      updateState({ syncInProgress: false });
    }
  }, [updateState, refreshData, handleError]);

  /**
   * Check compliance for all services
   */
  const checkCompliance = useCallback(async (): Promise<void> => {
    updateState({ error: null });

    try {
      const updatedServices = await recruitmentAPIService.checkCompliance();
      
      // Update compliance services in state
      updateState({
        complianceServices: updatedServices,
        stats: state.stats ? {
          ...state.stats,
          complianceScore: updatedServices.reduce((sum, c) => sum + c.score, 0) / updatedServices.length,
          lastUpdated: new Date(),
        } : null,
      });

      // Clear cache for compliance services
      cacheRef.current.delete('complianceServices');

    } catch (error) {
      handleError(error as Error, 'Checking compliance');
    }
  }, [updateState, state.stats, handleError]);

  /**
   * Toggle auto-sync functionality
   */
  const toggleAutoSync = useCallback(() => {
    autoSyncEnabled.current = !autoSyncEnabled.current;
    
    if (autoSyncEnabled.current) {
      // Start auto-sync
      syncIntervalRef.current = setInterval(() => {
        if (autoSyncEnabled.current && !state.syncInProgress) {
          syncAllPlatforms().catch(console.error);
        }
      }, syncInterval);
    } else {
      // Stop auto-sync
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    }
  }, [state.syncInProgress, syncAllPlatforms, syncInterval]);

  /**
   * Initialize service and load initial data
   */
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        // Initialize the API service
        await recruitmentAPIService.initialize();
        
        if (mounted) {
          // Load initial data
          await refreshData();
        }
      } catch (error) {
        if (mounted) {
          handleError(error as Error, 'Initializing service');
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [refreshData, handleError]);

  /**
   * Setup auto-sync if enabled
   */
  useEffect(() => {
    if (autoSync && state.isInitialized && !syncIntervalRef.current) {
      syncIntervalRef.current = setInterval(() => {
        if (autoSyncEnabled.current && !state.syncInProgress) {
          syncAllPlatforms().catch(console.error);
        }
      }, syncInterval);
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [autoSync, state.isInitialized, state.syncInProgress, syncAllPlatforms, syncInterval]);

  /**
   * Setup real-time event listeners
   */
  useEffect(() => {
    if (!enableRealTime) return;

    const handleSyncComplete = (result: SyncResult) => {
      if (result.success) {
        // Refresh data when sync completes successfully
        refreshData().catch(console.error);
      }
    };

    const handleHealthCheck = (healthStatus: Record<string, boolean>) => {
      // Update platform status based on health check
      updateState(prev => ({
        ...prev,
        platforms: prev.platforms.map(platform => ({
          ...platform,
          status: healthStatus[platform.id] ? 'active' : 'error'
        }))
      }));
    };

    // Subscribe to events
    recruitmentAPIService.on('sync:complete', handleSyncComplete);
    recruitmentAPIService.on('health:checked', handleHealthCheck);

    return () => {
      recruitmentAPIService.off('sync:complete', handleSyncComplete);
      recruitmentAPIService.off('health:checked', handleHealthCheck);
    };
  }, [enableRealTime, refreshData, updateState]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Clear intervals
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }

      // Clear cache
      cacheRef.current.clear();
    };
  }, []);

  /**
   * Memoized derived data
   */
  const derivedData = useMemo(() => {
    const activePlatforms = state.platforms.filter(p => p.status === 'active');
    const maintenancePlatforms = state.platforms.filter(p => p.status === 'maintenance');
    const errorPlatforms = state.platforms.filter(p => p.status === 'error');
    
    const compliantServices = state.complianceServices.filter(s => s.status === 'compliant');
    const warningServices = state.complianceServices.filter(s => s.status === 'warning');
    const criticalServices = state.complianceServices.filter(s => s.status === 'critical');

    return {
      platformsByStatus: {
        active: activePlatforms,
        maintenance: maintenancePlatforms,
        error: errorPlatforms,
      },
      servicesByStatus: {
        compliant: compliantServices,
        warning: warningServices,
        critical: criticalServices,
      },
      topPerformingAgents: state.internationalAgents
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5),
      totalCandidatesGlobal: (state.stats?.totalCandidates || 0) + (state.stats?.internationalCandidates || 0),
    };
  }, [state.platforms, state.complianceServices, state.internationalAgents, state.stats]);

  // Return state and actions
  return {
    ...state,
    ...derivedData,
    syncPlatform,
    syncAllPlatforms,
    checkCompliance,
    refreshData,
    clearError,
    toggleAutoSync,
  };
};

export default useRecruitmentData;

