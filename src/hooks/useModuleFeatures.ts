import { useState, useEffect } from 'react';
import { useAPITranslations } from '@/hooks/useAPITranslations';
import { useLanguage } from '@/hooks/useLanguageCompat';

interface ModuleFeatureConfig {
  enableTooltips: boolean;
  enableHowToUse: boolean;
  enableDocumentUpload: boolean;
  enableAIDiagnostic: boolean;
  enableAIChat: boolean;
  autoRefreshDiagnostic: boolean;
  diagnosticInterval: number; // in seconds
}

interface ModuleFeatures {
  config: ModuleFeatureConfig;
  updateConfig: (updates: Partial<ModuleFeatureConfig>) => void;
  isFeatureEnabled: (feature: keyof ModuleFeatureConfig) => boolean;
  getTranslationKey: (section: string, key: string) => string;
}

const DEFAULT_CONFIG: ModuleFeatureConfig = {
  enableTooltips: true,
  enableHowToUse: true,
  enableDocumentUpload: true,
  enableAIDiagnostic: true,
  enableAIChat: true,
  autoRefreshDiagnostic: false,
  diagnosticInterval: 300,
};

export const useModuleFeatures = (moduleKey: string): ModuleFeatures => {
  const [config, setConfig] = useState<ModuleFeatureConfig>(DEFAULT_CONFIG);
  const { language } = useLanguage();
  const { t } = useAPITranslations();

  useEffect(() => {
    // Load module-specific config from localStorage or API
    const savedConfig = localStorage.getItem(`moduleFeatures_${moduleKey}`);
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig({ ...DEFAULT_CONFIG, ...parsedConfig });
      } catch (error) {
        console.error('Failed to parse module config:', error);
      }
    }
  }, [moduleKey]);

  const updateConfig = (updates: Partial<ModuleFeatureConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    
    // Save to localStorage
    localStorage.setItem(`moduleFeatures_${moduleKey}`, JSON.stringify(newConfig));
  };

  const isFeatureEnabled = (feature: keyof ModuleFeatureConfig): boolean => {
    return config[feature] as boolean;
  };

  const getTranslationKey = (section: string, key: string): string => {
    return `${moduleKey}.${section}.${key}`;
  };

  return {
    config,
    updateConfig,
    isFeatureEnabled,
    getTranslationKey,
  };
};

// Hook for managing module documentation
export interface ModuleDoc {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: Date;
}

export const useModuleDocs = (moduleKey: string) => {
  const [docs, setDocs] = useState<ModuleDoc[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDocs = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from Supabase
      const savedDocs = localStorage.getItem(`moduleDocs_${moduleKey}`);
      if (savedDocs) {
        const parsedDocs = JSON.parse(savedDocs).map((doc: any) => ({
          ...doc,
          uploadedAt: new Date(doc.uploadedAt),
        }));
        setDocs(parsedDocs);
      }
    } catch (error) {
      console.error('Failed to load module docs:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDoc = (doc: Omit<ModuleDoc, 'id' | 'uploadedAt'>) => {
    const newDoc: ModuleDoc = {
      ...doc,
      id: Math.random().toString(36).substr(2, 9),
      uploadedAt: new Date(),
    };
    
    const updatedDocs = [...docs, newDoc];
    setDocs(updatedDocs);
    localStorage.setItem(`moduleDocs_${moduleKey}`, JSON.stringify(updatedDocs));
  };

  const removeDoc = (id: string) => {
    const updatedDocs = docs.filter(doc => doc.id !== id);
    setDocs(updatedDocs);
    localStorage.setItem(`moduleDocs_${moduleKey}`, JSON.stringify(updatedDocs));
  };

  useEffect(() => {
    loadDocs();
  }, [moduleKey]);

  return {
    docs,
    loading,
    addDoc,
    removeDoc,
    reload: loadDocs,
  };
};

export default useModuleFeatures;