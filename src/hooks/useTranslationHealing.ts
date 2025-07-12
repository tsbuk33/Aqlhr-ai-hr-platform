import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from "@/hooks/useLanguageCompat";

interface HealingConfig {
  autoHeal: boolean;
  confidenceThreshold: number;
  maxRetries: number;
}

interface MissingTranslation {
  key: string;
  englishText?: string;
  context?: string;
}

export const useTranslationHealing = (config: HealingConfig = {
  autoHeal: true,
  confidenceThreshold: 0.8,
  maxRetries: 3
}) => {
  const [isHealing, setIsHealing] = useState(false);
  const [healingQueue, setHealingQueue] = useState<MissingTranslation[]>([]);
  const { language } = useLanguage();

  // Self-healing function that can be called when missing translations are detected
  const healMissingTranslation = useCallback(async (
    translationKey: string, 
    englishText?: string, 
    context?: string
  ): Promise<string | null> => {
    if (!config.autoHeal || language !== 'ar') {
      return null;
    }

    try {
      setIsHealing(true);

      // Check if we already have a cached patch
      const { data: existingPatch } = await supabase
        .from('translation_patches')
        .select('patched_text, confidence_score')
        .eq('translation_key', translationKey)
        .eq('language', 'ar')
        .eq('approval_status', 'approved')
        .order('applied_at', { ascending: false })
        .limit(1)
        .single();

      if (existingPatch && existingPatch.confidence_score >= config.confidenceThreshold) {
        return existingPatch.patched_text;
      }

      // Generate new translation using AI
      const { data, error } = await supabase.functions.invoke('ai-translation-engine', {
        body: {
          action: 'self_heal',
          translationKey,
          englishText: englishText || translationKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim(),
          context: context || 'HR system interface'
        }
      });

      if (error) {
        console.warn('Translation healing failed:', error);
        return null;
      }

      if (data.healedText && data.healingType !== 'none') {
        // Cache invalidation trigger
        await supabase
          .from('translation_cache_invalidations')
          .insert({
            invalidation_reason: 'self_healing_patch',
            affected_keys: [translationKey],
            triggered_by: 'auto_healing_engine'
          });

        return data.healedText;
      }

      return null;
    } catch (error) {
      console.error('Translation healing error:', error);
      return null;
    } finally {
      setIsHealing(false);
    }
  }, [config, language]);

  // Batch healing for multiple missing translations
  const healMissingTranslations = useCallback(async (missingKeys: MissingTranslation[]) => {
    if (!config.autoHeal || missingKeys.length === 0) {
      return;
    }

    try {
      setIsHealing(true);
      setHealingQueue(missingKeys);

      const { data, error } = await supabase.functions.invoke('ai-translation-engine', {
        body: {
          action: 'bulk_translate',
          auditFiles: missingKeys
        }
      });

      if (error) throw error;

      // Cache invalidation for all healed keys
      const healedKeys = data.bulkTranslationResults
        .filter((result: any) => result.success)
        .map((result: any) => result.key);

      if (healedKeys.length > 0) {
        await supabase
          .from('translation_cache_invalidations')
          .insert({
            invalidation_reason: 'bulk_healing_patch',
            affected_keys: healedKeys,
            triggered_by: 'auto_healing_engine'
          });
      }

      setHealingQueue([]);
      return data.bulkTranslationResults;
    } catch (error) {
      console.error('Batch translation healing error:', error);
      return null;
    } finally {
      setIsHealing(false);
    }
  }, [config]);

  // Enhanced translation function with self-healing
  const t = useCallback((key: string, fallback?: string, context?: string): string => {
    // This would integrate with the actual translation function
    // For now, it's a placeholder that demonstrates the healing concept
    
    // If translation is missing and auto-healing is enabled, trigger healing
    if (config.autoHeal && language === 'ar') {
      // Add to healing queue for batch processing
      setHealingQueue(prev => {
        const exists = prev.some(item => item.key === key);
        if (!exists) {
          return [...prev, { key, englishText: fallback, context }];
        }
        return prev;
      });
    }

    // Return fallback for now (in real implementation, this would return the actual translation)
    return fallback || key;
  }, [config.autoHeal, language]);

  // Process healing queue periodically
  useEffect(() => {
    if (healingQueue.length > 0 && !isHealing) {
      const timer = setTimeout(() => {
        healMissingTranslations(healingQueue);
      }, 2000); // Batch process after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [healingQueue, isHealing, healMissingTranslations]);

  // Monitor for missing translations in real-time
  const reportMissingTranslation = useCallback((key: string, englishText?: string, context?: string) => {
    if (config.autoHeal) {
      healMissingTranslation(key, englishText, context);
    }
  }, [healMissingTranslation, config.autoHeal]);

  return {
    healMissingTranslation,
    healMissingTranslations,
    reportMissingTranslation,
    isHealing,
    healingQueueLength: healingQueue.length,
    t // Enhanced translation function with self-healing
  };
};