export interface PolicyDocument {
  id: string;
  title: string;
  titleAr: string;
  content: string;
  contentAr?: string;
  fileUrl: string;
  fileType: 'pdf' | 'docx' | 'txt';
  uploadedAt: Date;
  uploadedBy: string;
  companyId: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  complianceScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastAnalyzed?: Date;
}

export interface ComplianceAnalysis {
  id: string;
  policyId: string;
  overallScore: number;
  riskAssessment: RiskAssessment;
  gapAnalysis: GapAnalysis[];
  recommendations: Recommendation[];
  saudiLaborLawCompliance: LaborLawCompliance;
  createdAt: Date;
  aiModel: 'manus' | 'openai' | 'gemini' | 'genspark';
}

export interface RiskAssessment {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  factors: RiskFactor[];
  mitigationStrategies: string[];
  mitigationStrategiesAr: string[];
}

export interface RiskFactor {
  category: string;
  categoryAr: string;
  description: string;
  descriptionAr: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  likelihood: number; // 0-100
}

export interface GapAnalysis {
  category: string;
  categoryAr: string;
  requirement: string;
  requirementAr: string;
  currentStatus: 'compliant' | 'partial' | 'non-compliant' | 'missing';
  gap: string;
  gapAr: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedEffort: string;
}

export interface Recommendation {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  categoryAr: string;
  implementation: {
    steps: string[];
    stepsAr: string[];
    timeframe: string;
    resources: string[];
    cost: 'low' | 'medium' | 'high';
  };
  impact: {
    complianceImprovement: number;
    riskReduction: number;
    description: string;
    descriptionAr: string;
  };
}

export interface LaborLawCompliance {
  overallCompliance: number;
  categories: {
    workingHours: ComplianceCategory;
    wages: ComplianceCategory;
    leaves: ComplianceCategory;
    termination: ComplianceCategory;
    discrimination: ComplianceCategory;
    safety: ComplianceCategory;
    saudization: ComplianceCategory;
  };
}

export interface ComplianceCategory {
  score: number;
  status: 'compliant' | 'partial' | 'non-compliant';
  issues: string[];
  issuesAr: string[];
  recommendations: string[];
  recommendationsAr: string[];
  requirements: LaborLawRequirement[];
}

export interface LaborLawRequirement {
  article: string;
  description: string;
  descriptionAr: string;
  compliance: boolean;
  evidence?: string;
  evidenceAr?: string;
}