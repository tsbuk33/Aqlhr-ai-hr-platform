/**
 * Vision 2030 Intelligence Dashboard - Types
 * Strategic alignment with Saudi Vision 2030 objectives
 */

export interface Vision2030Pillar {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  descriptionArabic: string;
  icon: string;
  color: string;
  objectives: Vision2030Objective[];
  currentProgress: number;
  targetDate: Date;
}

export interface Vision2030Objective {
  id: string;
  pillarId: string;
  title: string;
  titleArabic: string;
  description: string;
  kpis: Vision2030KPI[];
  hrAlignment: HRAlignmentArea[];
  currentStatus: 'on_track' | 'at_risk' | 'behind' | 'completed';
  progress: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface Vision2030KPI {
  id: string;
  name: string;
  nameArabic: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: Date;
  source: 'company' | 'government' | 'industry';
}

export interface HRAlignmentArea {
  category: 'talent_development' | 'saudization' | 'female_participation' | 'digital_skills' | 'leadership' | 'innovation';
  title: string;
  titleArabic: string;
  description: string;
  currentScore: number;
  benchmarkScore: number;
  improvementActions: string[];
  timeline: string;
}

export interface Vision2030Dashboard {
  overallAlignment: number;
  pillarProgress: Record<string, number>;
  criticalGaps: Vision2030Gap[];
  opportunities: Vision2030Opportunity[];
  recommendations: Vision2030Recommendation[];
  nextMilestones: Vision2030Milestone[];
  governmentSupport: GovernmentProgram[];
}

export interface Vision2030Gap {
  area: string;
  currentState: string;
  desiredState: string;
  gapSize: number;
  impact: 'high' | 'medium' | 'low';
  complexity: 'high' | 'medium' | 'low';
  recommendedActions: string[];
  estimatedTimeline: string;
  requiredResources: string[];
}

export interface Vision2030Opportunity {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  potentialImpact: number;
  implementationEffort: 'high' | 'medium' | 'low';
  timeframe: 'short' | 'medium' | 'long';
  governmentSupport: boolean;
  fundingAvailable: boolean;
  prerequisites: string[];
}

export interface Vision2030Recommendation {
  id: string;
  priority: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  category: 'policy' | 'training' | 'recruitment' | 'technology' | 'culture';
  title: string;
  titleArabic: string;
  description: string;
  expectedOutcome: string;
  resources: ResourceRequirement[];
  timeline: string;
  successMetrics: string[];
  riskFactors: string[];
}

export interface ResourceRequirement {
  type: 'budget' | 'personnel' | 'technology' | 'training' | 'external';
  description: string;
  quantity: string;
  estimatedCost?: number;
  timeline: string;
  criticality: 'essential' | 'important' | 'nice_to_have';
}

export interface Vision2030Milestone {
  id: string;
  title: string;
  targetDate: Date;
  status: 'upcoming' | 'in_progress' | 'completed' | 'overdue';
  progress: number;
  dependencies: string[];
  risks: string[];
  owner: string;
}

export interface GovernmentProgram {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  applicationProcess: string;
  deadline?: Date;
  contactInfo: string;
  relevantObjectives: string[];
}

export interface SectorAlignment {
  sectorName: string;
  vision2030Relevance: number;
  keyObjectives: string[];
  governmentSupport: number;
  marketOpportunity: number;
  skillsAlignment: number;
  recommendedActions: string[];
}

export interface DigitalTransformation {
  currentMaturity: number;
  targetMaturity: number;
  digitalSkillsGap: number;
  technologyAdoption: Record<string, number>;
  digitalInitiatives: DigitalInitiative[];
  investmentRequired: number;
  expectedROI: number;
}

export interface DigitalInitiative {
  name: string;
  description: string;
  vision2030Alignment: string[];
  timeline: string;
  investment: number;
  expectedBenefits: string[];
  riskLevel: 'low' | 'medium' | 'high';
  prerequisites: string[];
}