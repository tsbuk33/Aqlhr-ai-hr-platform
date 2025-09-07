/**
 * Enhanced Decision Engine Types for 99.9% Accuracy
 * Advanced interfaces for autonomous decision making
 */

export interface ModelPrediction {
  model: string;
  prediction: string;
  confidence: number;
  weight: number;
  accuracy: number;
  features: string[];
}

export interface ValidatedPrediction {
  predictions: ModelPrediction[];
  confidence: number;
  validationScore: number;
  uncertaintyScore: number;
  consensusScore: number;
  isHighConfidence: boolean;
}

export interface EnhancedDecision {
  primaryDecision: string;
  confidence: number;
  reasoning: string[];
  alternatives: Alternative[];
  recommendations: string[];
  riskAssessment: RiskAssessment;
  modelContributions: ModelContribution[];
  processingSteps: string[];
}

export interface Alternative {
  decision: string;
  confidence: number;
  pros: string[];
  cons: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: RiskFactor[];
  mitigationStrategies: string[];
  confidence: number;
}

export interface RiskFactor {
  factor: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  impact: string;
  mitigation: string;
}

export interface ModelContribution {
  model: string;
  contribution: number;
  accuracy: number;
}

export interface ProcessingStep {
  step: string;
  status: 'completed' | 'failed' | 'skipped';
  duration: number;
  details?: string;
}