export interface SalaryBenchmark {
  id: string;
  positionTitle: string;
  positionTitleAr: string;
  hrsdPositionCode: string;
  industry: string;
  industryAr: string;
  companySize: CompanySize;
  region: SaudiRegion;
  experienceLevel: ExperienceLevel;
  educationLevel: EducationLevel;
  certifications: string[];
  skills: string[];
  nationality: 'saudi' | 'gcc' | 'arab' | 'asian' | 'western' | 'other';
  baseSalary: SalaryRange;
  totalCompensation: SalaryRange;
  benefits: BenefitPackage;
  marketPercentile: number; // 10th, 25th, 50th, 75th, 90th
  dataSource: 'hrsd' | 'market_survey' | 'company_data' | 'ai_prediction';
  lastUpdated: Date;
  confidence: number; // 0-100
}

export type CompanySize = 'micro' | 'small' | 'medium' | 'large' | 'enterprise';
export type SaudiRegion = 'riyadh' | 'makkah' | 'eastern' | 'asir' | 'madinah' | 'qassim' | 'tabuk' | 'hail' | 'northern_borders' | 'jazan' | 'najran' | 'bahah' | 'jouf';
export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'expert' | 'executive';
export type EducationLevel = 'high_school' | 'diploma' | 'bachelor' | 'master' | 'phd' | 'professional';

export interface SalaryRange {
  min: number;
  max: number;
  median: number;
  currency: 'SAR';
}

export interface BenefitPackage {
  housing: number;
  transportation: number;
  medical: number;
  education: number;
  annual_bonus: number;
  performance_bonus: number;
  end_of_service: number;
  other_allowances: number;
}

export interface UniversityRanking {
  id: string;
  name: string;
  nameAr: string;
  country: string;
  globalRank: number;
  localRank?: number;
  category: 'top_tier' | 'high_tier' | 'mid_tier' | 'standard';
  salaryMultiplier: number; // 0.8 - 1.5
}

export interface BenchmarkCriteria {
  positionTitle: string;
  hrsdPositionCode: string;
  companySize: CompanySize;
  region: SaudiRegion;
  experienceLevel: ExperienceLevel;
  educationLevel: EducationLevel;
  nationality: 'saudi' | 'gcc' | 'arab' | 'asian' | 'western' | 'other';
  university?: string;
  certifications?: string[];
  skills?: string[];
  industryFocus?: string;
}

export interface MarketAnalysis {
  id: string;
  benchmarkId: string;
  createdAt: Date;
  marketTrends: MarketTrend[];
  competitivePositioning: CompetitivePosition;
  talentSupplyDemand: TalentMarketData;
  salaryProjections: SalaryProjection[];
  aiInsights: BenchmarkingInsight[];
}

export interface MarketTrend {
  factor: string;
  factorAr: string;
  trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  impact: 'low' | 'medium' | 'high' | 'critical';
  timeframe: string;
  description: string;
  descriptionAr: string;
  supportingData: any[];
}

export interface CompetitivePosition {
  marketPercentile: number;
  competitorComparison: CompetitorData[];
  differentiators: string[];
  differentiatorsAr: string[];
  recommendations: string[];
  recommendationsAr: string[];
}

export interface CompetitorData {
  competitor: string;
  industry: string;
  size: CompanySize;
  salaryRange: SalaryRange;
  benefits: BenefitPackage;
  reputation: number; // 1-10
  growthRate: number;
}

export interface TalentMarketData {
  availability: 'scarce' | 'limited' | 'moderate' | 'abundant';
  demandLevel: 'low' | 'medium' | 'high' | 'critical';
  skillsGap: SkillsGapAnalysis[];
  sourcingDifficulty: number; // 1-10
  timeToFill: number; // days
  turnoverRate: number; // percentage
}

export interface SkillsGapAnalysis {
  skill: string;
  skillAr: string;
  currentSupply: number;
  marketDemand: number;
  gap: number;
  premiumRequired: number; // percentage
  developmentTime: number; // months
}

export interface SalaryProjection {
  year: number;
  projectedRange: SalaryRange;
  growthRate: number; // percentage
  confidenceLevel: number; // 0-100
  factors: ProjectionFactor[];
}

export interface ProjectionFactor {
  factor: string;
  factorAr: string;
  impact: number; // percentage
  likelihood: number; // 0-100
  description: string;
  descriptionAr: string;
}

export interface BenchmarkingInsight {
  id: string;
  type: 'salary_optimization' | 'market_positioning' | 'talent_strategy' | 'cost_analysis' | 'risk_assessment';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  impact: {
    financial: number;
    operational: number;
    strategic: number;
  };
  recommendations: ActionableRecommendation[];
  supportingData: any[];
  generatedAt: Date;
  aiModel: 'manus' | 'openai' | 'gemini' | 'genspark';
}

export interface ActionableRecommendation {
  action: string;
  actionAr: string;
  timeline: string;
  effort: 'low' | 'medium' | 'high';
  cost: 'low' | 'medium' | 'high';
  expectedOutcome: string;
  expectedOutcomeAr: string;
  successMetrics: string[];
  successMetricsAr: string[];
}

export interface HRSDIntegration {
  positionCode: string;
  officialTitle: string;
  officialTitleAr: string;
  salaryGrades: SalaryGrade[];
  requirementFramework: RequirementFramework;
  complianceStatus: ComplianceStatus;
  lastSync: Date;
}

export interface SalaryGrade {
  grade: string;
  minSalary: number;
  maxSalary: number;
  midPoint: number;
  progressionSteps: number;
  yearsToProgress: number;
}

export interface RequirementFramework {
  education: EducationRequirement[];
  experience: ExperienceRequirement[];
  certifications: CertificationRequirement[];
  skills: SkillRequirement[];
  languages: LanguageRequirement[];
}

export interface EducationRequirement {
  level: EducationLevel;
  field: string;
  fieldAr: string;
  required: boolean;
  preferred: boolean;
  equivalency: string[];
}

export interface ExperienceRequirement {
  minimumYears: number;
  preferredYears: number;
  industry: string;
  industryAr: string;
  role: string;
  roleAr: string;
  seniority: 'entry' | 'junior' | 'mid' | 'senior' | 'executive';
}

export interface CertificationRequirement {
  certification: string;
  certificationAr: string;
  provider: string;
  required: boolean;
  preferred: boolean;
  validityPeriod: number; // years
  renewalRequired: boolean;
}

export interface SkillRequirement {
  skill: string;
  skillAr: string;
  category: 'technical' | 'soft' | 'leadership' | 'language';
  proficiencyLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  required: boolean;
  assessmentMethod: string;
}

export interface LanguageRequirement {
  language: 'ar' | 'en' | 'other';
  proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
  speaking: boolean;
  reading: boolean;
  writing: boolean;
  required: boolean;
}

export interface ComplianceStatus {
  nitaqatCategory: 'platinum' | 'green' | 'yellow' | 'red';
  saudizationRate: number;
  requiredSaudizationRate: number;
  compliance: boolean;
  issues: ComplianceIssue[];
  recommendations: string[];
  recommendationsAr: string[];
}

export interface ComplianceIssue {
  issue: string;
  issueAr: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolution: string;
  resolutionAr: string;
  timeline: string;
}