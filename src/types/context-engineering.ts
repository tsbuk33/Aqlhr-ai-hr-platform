/**
 * Context Engineering Service - Types
 * Advanced prompt engineering and AI context optimization for HR workflows
 */

export interface ContextTemplate {
  id: string;
  name: string;
  category: 'hr_policy' | 'recruitment' | 'performance' | 'compliance' | 'training';
  description: string;
  basePrompt: string;
  variables: ContextVariable[];
  saudiCompliance: boolean;
  islamicConsiderations: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContextVariable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
  required: boolean;
  defaultValue?: string;
  options?: string[];
  description: string;
}

export interface ContextEngineering {
  id: string;
  templateId: string;
  title: string;
  generatedPrompt: string;
  variables: Record<string, any>;
  aiModel: 'gpt-4' | 'claude-3' | 'gemini-pro' | 'manus-ai';
  response?: string;
  effectiveness: number;
  saudiLawAlignment: number;
  culturalSensitivity: number;
  createdAt: Date;
}

export interface ContextOptimization {
  originalPrompt: string;
  optimizedPrompt: string;
  improvements: string[];
  saudiSpecificEnhancements: string[];
  islamicConsiderations: string[];
  estimatedImprovement: number;
}

export interface PromptLibrary {
  category: string;
  templates: ContextTemplate[];
  bestPractices: string[];
  saudiGuidelines: string[];
}