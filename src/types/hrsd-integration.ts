/**
 * HRSD Partnership Integration - Types
 * Ministry of Human Resources and Social Development integration
 */

export interface HRSDEmployee {
  id: string;
  nationalId: string;
  passportNumber?: string;
  fullNameArabic: string;
  fullNameEnglish: string;
  nationality: 'saudi' | 'non_saudi';
  employmentStatus: 'active' | 'inactive' | 'terminated';
  saudizationContribution: boolean;
  nitaqatClassification: 'platinum' | 'green' | 'yellow' | 'red';
  workPermitNumber?: string;
  iqamaNumber?: string;
  contractType: 'permanent' | 'temporary' | 'part_time' | 'contract';
  jobTitleArabic: string;
  jobTitleEnglish: string;
  salaryRange: string;
  registrationDate: Date;
  lastUpdate: Date;
}

export interface SaudizationMetrics {
  totalEmployees: number;
  saudiEmployees: number;
  nonSaudiEmployees: number;
  saudizationPercentage: number;
  nitaqatBand: 'platinum' | 'green' | 'yellow' | 'red';
  requiredSaudiPercentage: number;
  complianceStatus: 'compliant' | 'warning' | 'non_compliant';
  improvementRequired: number;
  nextReviewDate: Date;
}

export interface NitaqatComplianceReport {
  companyId: string;
  reportDate: Date;
  currentBand: 'platinum' | 'green' | 'yellow' | 'red';
  targetBand: 'platinum' | 'green' | 'yellow' | 'red';
  metrics: SaudizationMetrics;
  recommendations: NitaqatRecommendation[];
  penaltiesRisk: PenaltyRisk[];
  incentivesEligible: IncentiveOpportunity[];
  complianceScore: number;
}

export interface NitaqatRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  type: 'hiring' | 'training' | 'promotion' | 'retention';
  description: string;
  descriptionArabic: string;
  expectedImpact: number;
  implementationTimeframe: string;
  estimatedCost: number;
  hrsdSupport: boolean;
}

export interface PenaltyRisk {
  type: 'visa_restriction' | 'fine' | 'service_suspension' | 'blacklist';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  potentialAmount?: number;
  mitigationSteps: string[];
  timeline: string;
}

export interface IncentiveOpportunity {
  type: 'visa_priority' | 'fee_reduction' | 'fast_track' | 'grants';
  description: string;
  eligibilityRequirements: string[];
  potentialBenefit: string;
  applicationDeadline?: Date;
  hrsdContactInfo: string;
}

export interface WorkforceAnalytics {
  demographicBreakdown: DemographicData;
  skillsAnalysis: SkillsMatrix[];
  salaryBenchmarks: SalaryBenchmark[];
  turnoverAnalysis: TurnoverMetrics;
  trainingNeeds: TrainingGap[];
}

export interface DemographicData {
  ageGroups: Record<string, number>;
  educationLevels: Record<string, number>;
  genderDistribution: Record<'male' | 'female', number>;
  nationalityBreakdown: Record<string, number>;
  regionDistribution: Record<string, number>;
}

export interface SkillsMatrix {
  category: string;
  requiredSkills: string[];
  currentCapability: number;
  gapPercentage: number;
  priority: 'high' | 'medium' | 'low';
  trainingRecommendation: string;
}

export interface SalaryBenchmark {
  jobFamily: string;
  positionLevel: string;
  marketMedian: number;
  currentAverage: number;
  variance: number;
  recommendation: 'increase' | 'maintain' | 'review';
  hrsdGuidance: string;
}

export interface TurnoverMetrics {
  overallRate: number;
  saudiTurnover: number;
  nonSaudiTurnover: number;
  voluntaryVsInvoluntary: Record<string, number>;
  costPerTurnover: number;
  retentionStrategies: string[];
}

export interface TrainingGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gapPercentage: number;
  trainingPrograms: string[];
  hrsdPrograms: string[];
  estimatedDuration: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}