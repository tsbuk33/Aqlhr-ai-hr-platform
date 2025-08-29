import { describe, it, expect } from 'vitest';
import {
  getIntentName,
  getIntentColor,
  formatUrgency,
  formatComplexity,
  formatConfidence,
  formatRiskLevel,
  getRiskLevel,
  formatProviderName,
  formatCostTarget,
  formatLatency,
  formatTokens,
  selectOptimalProvider
} from '@/lib/ai/context/utils';

describe('Context Utils', () => {
  describe('Intent formatting', () => {
    it('should return correct intent names in English', () => {
      expect(getIntentName('question', 'en')).toBe('Question');
      expect(getIntentName('task', 'en')).toBe('Task');
      expect(getIntentName('analysis', 'en')).toBe('Analysis');
      expect(getIntentName('generation', 'en')).toBe('Generation');
    });

    it('should return correct intent names in Arabic', () => {
      expect(getIntentName('question', 'ar')).toBe('سؤال');
      expect(getIntentName('task', 'ar')).toBe('مهمة');
      expect(getIntentName('analysis', 'ar')).toBe('تحليل');
      expect(getIntentName('generation', 'ar')).toBe('إنشاء');
    });

    it('should return default color for unknown intents', () => {
      expect(getIntentColor('unknown' as any)).toBe('#64748B');
      expect(getIntentColor('question')).toBe('#3B82F6');
    });
  });

  describe('Score formatting', () => {
    it('should format urgency levels correctly in English', () => {
      expect(formatUrgency(0.9, 'en')).toBe('Very Urgent');
      expect(formatUrgency(0.7, 'en')).toBe('Urgent');
      expect(formatUrgency(0.5, 'en')).toBe('Medium');
      expect(formatUrgency(0.3, 'en')).toBe('Low');
      expect(formatUrgency(0.1, 'en')).toBe('Not Urgent');
    });

    it('should format urgency levels correctly in Arabic', () => {
      expect(formatUrgency(0.9, 'ar')).toBe('عاجل جداً');
      expect(formatUrgency(0.7, 'ar')).toBe('عاجل');
      expect(formatUrgency(0.5, 'ar')).toBe('متوسط');
      expect(formatUrgency(0.3, 'ar')).toBe('منخفض');
      expect(formatUrgency(0.1, 'ar')).toBe('غير عاجل');
    });

    it('should format complexity levels correctly', () => {
      expect(formatComplexity(0.9, 'en')).toBe('Very Complex');
      expect(formatComplexity(0.5, 'en')).toBe('Medium');
      expect(formatComplexity(0.1, 'en')).toBe('Very Simple');
      
      expect(formatComplexity(0.9, 'ar')).toBe('معقد جداً');
      expect(formatComplexity(0.5, 'ar')).toBe('متوسط');
      expect(formatComplexity(0.1, 'ar')).toBe('بسيط جداً');
    });

    it('should format confidence levels correctly', () => {
      expect(formatConfidence(0.95, 'en')).toBe('Very High');
      expect(formatConfidence(0.8, 'en')).toBe('High');
      expect(formatConfidence(0.6, 'en')).toBe('Medium');
      expect(formatConfidence(0.4, 'en')).toBe('Low');
      expect(formatConfidence(0.2, 'en')).toBe('Very Low');
    });
  });

  describe('Risk assessment', () => {
    it('should detect high risk hints correctly', () => {
      expect(getRiskLevel(['pii', 'sensitive'])).toBe('high');
      expect(getRiskLevel(['financial', 'security'])).toBe('high');
      expect(getRiskLevel(['admin', 'confidential'])).toBe('high');
    });

    it('should detect medium risk hints correctly', () => {
      expect(getRiskLevel(['sensitive'])).toBe('medium');
      expect(getRiskLevel(['confidential'])).toBe('medium');
      expect(getRiskLevel(['internal'])).toBe('medium');
    });

    it('should detect low risk for safe hints', () => {
      expect(getRiskLevel(['general'])).toBe('low');
      expect(getRiskLevel(['public'])).toBe('low');
      expect(getRiskLevel([])).toBe('low');
    });

    it('should format risk levels correctly', () => {
      expect(formatRiskLevel(['pii'], 'en')).toBe('High Risk');
      expect(formatRiskLevel(['sensitive'], 'en')).toBe('Medium Risk');
      expect(formatRiskLevel(['general'], 'en')).toBe('Low Risk');
      
      expect(formatRiskLevel(['pii'], 'ar')).toBe('مخاطر عالية');
      expect(formatRiskLevel(['sensitive'], 'ar')).toBe('مخاطر متوسطة');
      expect(formatRiskLevel(['general'], 'ar')).toBe('مخاطر منخفضة');
    });
  });

  describe('Provider and cost formatting', () => {
    it('should format provider names correctly', () => {
      expect(formatProviderName('genspark')).toBe('GenSpark AI');
      expect(formatProviderName('openai')).toBe('OpenAI');
      expect(formatProviderName('manus')).toBe('Manus AI');
      expect(formatProviderName('gemini')).toBe('Google Gemini');
    });

    it('should format cost targets correctly', () => {
      expect(formatCostTarget('low', 'en')).toBe('Low Cost');
      expect(formatCostTarget('balanced', 'en')).toBe('Balanced');
      expect(formatCostTarget('high', 'en')).toBe('High Performance');
      
      expect(formatCostTarget('low', 'ar')).toBe('تكلفة منخفضة');
      expect(formatCostTarget('balanced', 'ar')).toBe('متوازن');
      expect(formatCostTarget('high', 'ar')).toBe('أداء عالي');
    });
  });

  describe('Number formatting', () => {
    it('should format latency correctly', () => {
      expect(formatLatency(500, 'en')).toBe('500ms');
      expect(formatLatency(1500, 'en')).toBe('1.5s');
      expect(formatLatency(65000, 'en')).toBe('1m 5s');
      
      expect(formatLatency(500, 'ar')).toBe('500 مللي ثانية');
      expect(formatLatency(1500, 'ar')).toBe('1.5 ثانية');
      expect(formatLatency(65000, 'ar')).toBe('1 دقيقة 5 ثانية');
    });

    it('should format token counts correctly', () => {
      expect(formatTokens(500, 'en')).toBe('500 tokens');
      expect(formatTokens(1500, 'en')).toBe('1.5K tokens');
      expect(formatTokens(1500000, 'en')).toBe('1.5M tokens');
      
      expect(formatTokens(500, 'ar')).toBe('500 رمز');
      expect(formatTokens(1500, 'ar')).toBe('1.5ألف رمز');
      expect(formatTokens(1500000, 'ar')).toBe('1.5مليون رمز');
    });
  });

  describe('Provider selection', () => {
    const mockProviders = [
      {
        provider: 'genspark' as const,
        model: 'genspark-1',
        priority: 1,
        maxTokens: 2048,
        temperature: 0.7,
        streaming: true
      },
      {
        provider: 'openai' as const,
        model: 'gpt-4',
        priority: 2,
        maxTokens: 2048,
        temperature: 0.7,
        streaming: true
      },
      {
        provider: 'manus' as const,
        model: 'manus-1',
        priority: 3,
        maxTokens: 1024,
        temperature: 0.8,
        streaming: false
      }
    ];

    it('should select genspark for high urgency requests', () => {
      const result = selectOptimalProvider({
        urgency: 0.9,
        complexity: 0.5,
        costTarget: 'balanced'
      }, mockProviders);

      expect(result?.provider).toBe('genspark');
    });

    it('should prioritize capable providers for complex tasks', () => {
      const result = selectOptimalProvider({
        urgency: 0.3,
        complexity: 0.9,
        costTarget: 'high'
      }, mockProviders);

      expect(result?.provider).toBe('genspark');
    });

    it('should consider cost target in selection', () => {
      const result = selectOptimalProvider({
        urgency: 0.3,
        complexity: 0.3,
        costTarget: 'low'
      }, mockProviders);

      // Should still prefer genspark due to priority, but manus gets cost bonus
      expect(result?.provider).toBe('genspark');
    });

    it('should handle empty provider list', () => {
      const result = selectOptimalProvider({
        urgency: 0.5,
        complexity: 0.5,
        costTarget: 'balanced'
      }, []);

      expect(result).toBeNull();
    });

    it('should consider streaming preference', () => {
      const result = selectOptimalProvider({
        urgency: 0.5,
        complexity: 0.5,
        costTarget: 'balanced',
        streaming: true
      }, mockProviders);

      expect(result?.streaming).toBe(true);
    });
  });
});