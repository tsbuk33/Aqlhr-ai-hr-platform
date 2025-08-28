export interface EmployeeJourney {
  id: string;
  employeeId: string;
  companyId: string;
  currentStage: LifecycleStage;
  stages: LifecycleStageData[];
  createdAt: Date;
  updatedAt: Date;
  personalizedPlan: PersonalizedPlan;
  culturalIntegration: CulturalIntegration;
}

export type LifecycleStage = 
  | 'application'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'onboarding'
  | 'probation'
  | 'active'
  | 'development'
  | 'performance'
  | 'promotion'
  | 'transfer'
  | 'exit'
  | 'alumni';

export interface LifecycleStageData {
  stage: LifecycleStage;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped' | 'failed';
  startDate: Date;
  endDate?: Date;
  assignedTo: string[];
  tasks: LifecycleTask[];
  documents: LifecycleDocument[];
  milestones: LifecycleMilestone[];
  feedback: LifecycleFeedback[];
  aiInsights: AIInsight[];
  completionPercentage: number;
}

export interface LifecycleTask {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  assignedTo: string;
  assignedToRole: 'employee' | 'manager' | 'hr' | 'mentor' | 'buddy';
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dependencies: string[];
  estimatedHours: number;
  actualHours?: number;
  completedAt?: Date;
  completedBy?: string;
  notes: string;
  notesAr: string;
  category: 'administrative' | 'training' | 'cultural' | 'technical' | 'social';
}

export interface LifecycleDocument {
  id: string;
  title: string;
  titleAr: string;
  type: 'contract' | 'policy' | 'handbook' | 'form' | 'certificate' | 'id' | 'visa';
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
  required: boolean;
  signed: boolean;
  signedAt?: Date;
  expiryDate?: Date;
}

export interface LifecycleMilestone {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  targetDate: Date;
  completedDate?: Date;
  status: 'pending' | 'completed' | 'overdue';
  criteria: MilestoneCriteria[];
  rewards?: string[];
  rewardsAr?: string[];
}

export interface MilestoneCriteria {
  criterion: string;
  criterionAr: string;
  met: boolean;
  evidence?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface LifecycleFeedback {
  id: string;
  fromUserId: string;
  fromUserRole: 'employee' | 'manager' | 'hr' | 'mentor' | 'buddy' | 'peer';
  toUserId: string;
  stage: LifecycleStage;
  rating: number; // 1-5
  feedback: string;
  feedbackAr: string;
  categories: FeedbackCategory[];
  providedAt: Date;
  anonymous: boolean;
}

export interface FeedbackCategory {
  category: 'performance' | 'communication' | 'cultural_fit' | 'technical_skills' | 'leadership' | 'teamwork';
  rating: number;
  comments?: string;
  commentsAr?: string;
}

export interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'alert' | 'trend' | 'opportunity';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  confidence: number; // 0-100
  impact: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  actions?: string[];
  actionsAr?: string[];
  generatedAt: Date;
  aiModel: 'manus' | 'openai' | 'gemini' | 'genspark';
}

export interface PersonalizedPlan {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  culturalBackground: string;
  languagePreference: 'ar' | 'en' | 'bilingual';
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'expert';
  skillGaps: SkillGap[];
  careerAspirations: string[];
  careerAspirationsAr: string[];
  mentorshipPreferences: MentorshipPreferences;
  developmentGoals: DevelopmentGoal[];
}

export interface SkillGap {
  skill: string;
  skillAr: string;
  currentLevel: number; // 1-10
  targetLevel: number; // 1-10
  priority: 'low' | 'medium' | 'high' | 'critical';
  developmentPlan: string;
  developmentPlanAr: string;
  estimatedTimeframe: string;
}

export interface MentorshipPreferences {
  preferredMentorProfile: string;
  preferredMentorProfileAr: string;
  meetingFrequency: 'weekly' | 'biweekly' | 'monthly';
  communicationStyle: 'formal' | 'informal' | 'mixed';
  focusAreas: string[];
  focusAreasAr: string[];
}

export interface DevelopmentGoal {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: 'technical' | 'leadership' | 'communication' | 'cultural' | 'business';
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'paused';
  milestones: GoalMilestone[];
  resources: LearningResource[];
  measurableOutcome: string;
  measurableOutcomeAr: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  titleAr: string;
  targetDate: Date;
  completed: boolean;
  completedDate?: Date;
  evidence?: string;
}

export interface LearningResource {
  type: 'course' | 'book' | 'video' | 'workshop' | 'mentoring' | 'project';
  title: string;
  titleAr: string;
  url?: string;
  provider: string;
  duration: string;
  cost?: number;
  required: boolean;
  completed: boolean;
  completedDate?: Date;
  rating?: number;
  notes?: string;
}

export interface CulturalIntegration {
  saudiCultureOrientation: CultureOrientationModule[];
  islamicWorkplaceEtiquette: IslamicEtiquette[];
  localCustomsTraining: LocalCustoms[];
  languageDevelopment: LanguageDevelopment;
  socialIntegration: SocialIntegration;
}

export interface CultureOrientationModule {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  duration: string;
  completed: boolean;
  completedDate?: Date;
  assessment?: CultureAssessment;
}

export interface IslamicEtiquette {
  category: 'prayer_times' | 'ramadan' | 'dress_code' | 'interactions' | 'holidays';
  guidelines: string[];
  guidelinesAr: string[];
  importance: 'high' | 'medium' | 'low';
  understood: boolean;
  acknowledgedAt?: Date;
}

export interface LocalCustoms {
  custom: string;
  customAr: string;
  context: string;
  contextAr: string;
  doAndDonts: {
    dos: string[];
    dosAr: string[];
    donts: string[];
    dontsAr: string[];
  };
  businessRelevance: string;
  businessRelevanceAr: string;
}

export interface LanguageDevelopment {
  currentLevel: {
    arabic: 'beginner' | 'intermediate' | 'advanced' | 'native';
    english: 'beginner' | 'intermediate' | 'advanced' | 'native';
  };
  targetLevel: {
    arabic: 'beginner' | 'intermediate' | 'advanced' | 'native';
    english: 'beginner' | 'intermediate' | 'advanced' | 'native';
  };
  learningPlan: LanguageLearningPlan[];
  progress: LanguageProgress[];
}

export interface LanguageLearningPlan {
  language: 'ar' | 'en';
  skill: 'speaking' | 'listening' | 'reading' | 'writing';
  activities: string[];
  activitiesAr: string[];
  schedule: string;
  resources: LearningResource[];
}

export interface LanguageProgress {
  language: 'ar' | 'en';
  skill: 'speaking' | 'listening' | 'reading' | 'writing';
  assessmentDate: Date;
  score: number; // 0-100
  level: 'beginner' | 'intermediate' | 'advanced' | 'native';
  notes: string;
  notesAr: string;
}

export interface SocialIntegration {
  teamIntroductions: TeamIntroduction[];
  networkingOpportunities: NetworkingOpportunity[];
  culturalEvents: CulturalEvent[];
  buddySystem: BuddySystem;
  communityInvolvement: CommunityInvolvement[];
}

export interface TeamIntroduction {
  teamMember: {
    id: string;
    name: string;
    role: string;
    department: string;
  };
  introduced: boolean;
  introducedDate?: Date;
  relationshipType: 'peer' | 'manager' | 'direct_report' | 'collaborator';
  notes?: string;
}

export interface NetworkingOpportunity {
  event: string;
  eventAr: string;
  date: Date;
  type: 'internal' | 'industry' | 'community';
  relevance: string;
  relevanceAr: string;
  attended: boolean;
  followUpActions?: string[];
}

export interface CulturalEvent {
  event: string;
  eventAr: string;
  date: Date;
  type: 'national' | 'religious' | 'company' | 'local';
  description: string;
  descriptionAr: string;
  significance: string;
  significanceAr: string;
  participation: 'mandatory' | 'optional' | 'encouraged';
  participated: boolean;
}

export interface BuddySystem {
  buddy: {
    id: string;
    name: string;
    role: string;
    department: string;
    experience: string;
  };
  matchingCriteria: string[];
  matchingCriteriaAr: string[];
  meetings: BuddyMeeting[];
  relationship: 'active' | 'completed' | 'paused';
  feedback: BuddyFeedback[];
}

export interface BuddyMeeting {
  date: Date;
  duration: number; // minutes
  topics: string[];
  topicsAr: string[];
  outcomes: string[];
  outcomesAr: string[];
  nextMeeting?: Date;
}

export interface BuddyFeedback {
  date: Date;
  fromBuddy: boolean;
  rating: number; // 1-5
  comments: string;
  commentsAr: string;
  suggestions?: string[];
  suggestionsAr?: string[];
}

export interface CommunityInvolvement {
  activity: string;
  activityAr: string;
  type: 'volunteer' | 'professional' | 'cultural' | 'sports';
  organization: string;
  description: string;
  descriptionAr: string;
  timeCommitment: string;
  benefits: string[];
  benefitsAr: string[];
  interested: boolean;
  participating: boolean;
  startDate?: Date;
}

export interface CultureAssessment {
  questions: CultureQuestion[];
  score: number; // 0-100
  completedDate: Date;
  feedback: string;
  feedbackAr: string;
  recommendations: string[];
  recommendationsAr: string[];
}

export interface CultureQuestion {
  question: string;
  questionAr: string;
  category: 'customs' | 'business' | 'social' | 'religious' | 'legal';
  correctAnswer: string;
  userAnswer?: string;
  correct: boolean;
  explanation: string;
  explanationAr: string;
}