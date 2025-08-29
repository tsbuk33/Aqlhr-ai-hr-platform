import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContextClient } from '@/lib/ai/context/ContextClient';
import { aiConfigManager } from '@/config/aiOrchestrator';

// Mock dependencies
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    functions: {
      invoke: vi.fn()
    },
    auth: {
      getSession: vi.fn()
    }
  }))
}));

vi.mock('@/config/aiOrchestrator', () => ({
  aiConfigManager: {
    isFeatureEnabled: vi.fn(),
    getModuleConfig: vi.fn(),
    getCostTarget: vi.fn(),
    getMaxTokens: vi.fn(),
    getTimeout: vi.fn(),
    isStreamingEnabled: vi.fn(),
    getEnabledProviders: vi.fn()
  }
}));

vi.mock('@/lib/ai/context/moduleContext', () => ({
  detectModuleContext: vi.fn(() => 'general')
}));

describe('ContextClient', () => {
  let contextClient: ContextClient;

  beforeEach(() => {
    vi.clearAllMocks();
    contextClient = new ContextClient({
      supabaseUrl: 'https://test.supabase.co',
      supabaseAnonKey: 'test-key',
      debug: false
    });
  });

  describe('beginIntent', () => {
    it('should classify intent successfully', async () => {
      // Mock feature flag as enabled
      vi.mocked(aiConfigManager.isFeatureEnabled).mockReturnValue(true);

      // Mock successful supabase response
      const mockResponse = {
        intentId: 'test-intent-id',
        sessionId: 'test-session-id',
        intent: 'question',
        urgency: 0.7,
        complexity: 0.5,
        riskHints: [],
        confidence: 0.85
      };

      const mockSupabase = {
        functions: {
          invoke: vi.fn().mockResolvedValue({ data: mockResponse, error: null })
        }
      };

      // Replace the supabase instance
      (contextClient as any).supabase = mockSupabase;

      const result = await contextClient.beginIntent({
        query: 'How to register a new employee?',
        moduleContext: 'employee'
      });

      expect(result).toEqual(mockResponse);
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith(
        'context-intent-v1',
        expect.objectContaining({
          body: expect.objectContaining({
            query: 'How to register a new employee?',
            moduleContext: 'employee'
          })
        })
      );
    });

    it('should return default intent when feature is disabled', async () => {
      // Mock feature flag as disabled
      vi.mocked(aiConfigManager.isFeatureEnabled).mockReturnValue(false);

      const result = await contextClient.beginIntent({
        query: 'Test query',
        moduleContext: 'general'
      });

      expect(result.intent).toBe('general');
      expect(result.urgency).toBe(0.5);
      expect(result.complexity).toBe(0.5);
      expect(result.confidence).toBe(1.0);
    });

    it('should handle classification errors gracefully', async () => {
      vi.mocked(aiConfigManager.isFeatureEnabled).mockReturnValue(true);

      const mockSupabase = {
        functions: {
          invoke: vi.fn().mockResolvedValue({ 
            data: null, 
            error: { message: 'Classification failed' } 
          })
        }
      };

      (contextClient as any).supabase = mockSupabase;

      await expect(contextClient.beginIntent({
        query: 'Test query',
        moduleContext: 'general'
      })).rejects.toThrow('Intent classification failed: Classification failed');
    });
  });

  describe('getRoutingPlan', () => {
    it('should generate routing plan successfully', async () => {
      vi.mocked(aiConfigManager.isFeatureEnabled).mockReturnValue(true);
      vi.mocked(aiConfigManager.getCostTarget).mockReturnValue('balanced');
      vi.mocked(aiConfigManager.getMaxTokens).mockReturnValue(2048);
      vi.mocked(aiConfigManager.getTimeout).mockReturnValue(30000);
      vi.mocked(aiConfigManager.isStreamingEnabled).mockReturnValue(true);
      vi.mocked(aiConfigManager.getEnabledProviders).mockReturnValue(['genspark', 'openai']);

      const mockPlan = {
        providers: [{
          provider: 'genspark',
          model: 'genspark-1',
          priority: 1,
          maxTokens: 2048,
          temperature: 0.7,
          streaming: true
        }],
        costTarget: 'balanced',
        maxRetries: 2,
        timeoutMs: 30000,
        fallbackEnabled: true,
        streaming: true
      };

      const mockSupabase = {
        functions: {
          invoke: vi.fn().mockResolvedValue({ data: mockPlan, error: null })
        }
      };

      (contextClient as any).supabase = mockSupabase;

      const result = await contextClient.getRoutingPlan({
        intentId: 'test-intent-id'
      });

      expect(result).toEqual(mockPlan);
    });

    it('should return simple plan when routing optimization is disabled', async () => {
      vi.mocked(aiConfigManager.isFeatureEnabled).mockReturnValue(false);
      vi.mocked(aiConfigManager.getCostTarget).mockReturnValue('balanced');
      vi.mocked(aiConfigManager.getMaxTokens).mockReturnValue(2048);
      vi.mocked(aiConfigManager.getTimeout).mockReturnValue(30000);
      vi.mocked(aiConfigManager.isStreamingEnabled).mockReturnValue(true);

      const result = await contextClient.getRoutingPlan({
        intentId: 'test-intent-id'
      });

      expect(result.providers).toHaveLength(1);
      expect(result.providers[0].provider).toBe('genspark');
      expect(result.costTarget).toBe('balanced');
    });
  });

  describe('executeQuery', () => {
    it('should execute complete query workflow', async () => {
      // Mock all feature flags as enabled
      vi.mocked(aiConfigManager.isFeatureEnabled).mockReturnValue(true);
      vi.mocked(aiConfigManager.getCostTarget).mockReturnValue('balanced');
      vi.mocked(aiConfigManager.isStreamingEnabled).mockReturnValue(false);

      const mockIntent = {
        intentId: 'test-intent-id',
        sessionId: 'test-session-id',
        intent: 'question',
        urgency: 0.7,
        complexity: 0.5,
        riskHints: [],
        confidence: 0.85
      };

      const mockPlan = {
        providers: [{
          provider: 'genspark',
          model: 'genspark-1',
          priority: 1,
          maxTokens: 2048,
          temperature: 0.7,
          streaming: false
        }],
        costTarget: 'balanced',
        maxRetries: 2,
        timeoutMs: 30000,
        fallbackEnabled: true,
        streaming: false
      };

      const mockExecution = {
        content: 'This is a test response',
        provider: 'genspark',
        model: 'genspark-1',
        tokensUsed: 150,
        latencyMs: 1200,
        success: true
      };

      const mockSupabase = {
        functions: {
          invoke: vi.fn()
            .mockResolvedValueOnce({ data: mockIntent, error: null })
            .mockResolvedValueOnce({ data: mockPlan, error: null })
            .mockResolvedValueOnce({ data: mockExecution, error: null })
        }
      };

      (contextClient as any).supabase = mockSupabase;

      const result = await contextClient.executeQuery(
        'How to register an employee?',
        'employee'
      );

      expect(result.intent).toEqual(mockIntent);
      expect(result.result).toEqual(mockExecution);
      expect(mockSupabase.functions.invoke).toHaveBeenCalledTimes(3);
    });
  });

  describe('getIntentStats', () => {
    it('should retrieve intent statistics', async () => {
      const mockStats = {
        total_intents: 150,
        intent_distribution: [
          { intent: 'question', count: 80, percentage: 53.3 },
          { intent: 'task', count: 45, percentage: 30.0 },
          { intent: 'analysis', count: 25, percentage: 16.7 }
        ]
      };

      const mockSupabase = {
        rpc: vi.fn().mockResolvedValue({ data: mockStats, error: null })
      };

      (contextClient as any).supabase = mockSupabase;

      const result = await contextClient.getIntentStats();

      expect(result).toEqual(mockStats);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('get_intent_stats_v1', {});
    });

    it('should handle stats query errors', async () => {
      const mockSupabase = {
        rpc: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { message: 'Stats query failed' } 
        })
      };

      (contextClient as any).supabase = mockSupabase;

      await expect(contextClient.getIntentStats()).rejects.toThrow(
        'Intent stats query failed: Stats query failed'
      );
    });
  });
});