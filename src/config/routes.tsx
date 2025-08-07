import { lazy } from 'react';

// Core modules
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const PromptLog = lazy(() => import('../pages/PromptLog'));
const EmployeesPage = lazy(() => import('../pages/EmployeesPage'));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage'));
const About = lazy(() => import('../pages/About'));
const CoreHR = lazy(() => import('../pages/CoreHR'));
const Employees = lazy(() => import('../pages/Employees'));
const Organization = lazy(() => import('../pages/Organization'));
const SelfService = lazy(() => import('../pages/SelfService'));
const Documents = lazy(() => import('../pages/Documents'));
const Payroll = lazy(() => import('../pages/Payroll'));
const AIFeatures = lazy(() => import('../pages/AIFeatures'));
const Government = lazy(() => import('../pages/Government'));
const Strategic = lazy(() => import('../pages/Strategic'));
const Consulting = lazy(() => import('../pages/Consulting'));
const Analytics = lazy(() => import('../pages/Analytics'));

// Analytics sub-pages
const KPIAnalytics = lazy(() => import('../pages/analytics/KPI'));
const ExecutiveAnalytics = lazy(() => import('../pages/analytics/Executive'));
const RealtimeAnalytics = lazy(() => import('../pages/analytics/Realtime'));

// Admin pages
const UsersPage = lazy(() => import('../pages/admin/Users'));

// Reports pages  
const ReportBuilder = lazy(() => import('../pages/reports/Builder'));

// Core HR sub-modules
const TimeAttendance = lazy(() => import('../pages/core-hr/TimeAttendance'));
const PerformanceManagement = lazy(() => import('../pages/core-hr/PerformanceManagement'));
const LeaveManagement = lazy(() => import('../pages/core-hr/LeaveManagement'));
const TrainingDevelopment = lazy(() => import('../pages/core-hr/TrainingDevelopment'));
const RecruitmentOnboarding = lazy(() => import('../pages/core-hr/RecruitmentOnboarding'));
const CompensationBenefits = lazy(() => import('../pages/core-hr/CompensationBenefits'));
const WorkflowAutomation = lazy(() => import('../pages/core-hr/WorkflowAutomation'));
const MobileHR = lazy(() => import('../pages/core-hr/MobileHR'));
const EmployeeMasterData = lazy(() => import('../pages/core-hr/EmployeeMasterData'));
const BenefitsAdministration = lazy(() => import('../pages/core-hr/BenefitsAdministration'));
const SuccessionPlanningCore = lazy(() => import('../pages/core-hr/SuccessionPlanningCore'));
const CompensationManagementCore = lazy(() => import('../pages/core-hr/CompensationManagementCore'));
const SaudizationCalculator = lazy(() => import('../pages/core-hr/SaudizationCalculator'));

// HSE Module
const HealthSafety = lazy(() => import('../pages/HealthSafety'));

// Payroll sub-modules
const WPSProcessing = lazy(() => import('../pages/payroll/WPSProcessing'));
const GOSIIntegration = lazy(() => import('../pages/payroll/GOSIIntegration'));
const EOSBCalculations = lazy(() => import('../pages/payroll/EOSBCalculations'));

const ExpenseManagement = lazy(() => import('../pages/payroll/ExpenseManagement'));
const PayrollAnalytics = lazy(() => import('../pages/payroll/PayrollAnalytics'));
const BankIntegration = lazy(() => import('../pages/payroll/BankIntegration'));
const BudgetForecasting = lazy(() => import('../pages/payroll/BudgetForecasting'));

// Government sub-modules
const QiwaIntegration = lazy(() => import('../pages/government/QiwaIntegration'));
const AbsherPlatform = lazy(() => import('../pages/government/AbsherPlatform'));
const MuqeemPlatform = lazy(() => import('../pages/government/MuqeemPlatform'));
const MudadPlatform = lazy(() => import('../pages/government/MudadPlatform'));
const NitaqatCompliance = lazy(() => import('../pages/government/NitaqatCompliance'));
const TVTCIntegration = lazy(() => import('../pages/government/TVTCIntegration'));
const MOLCompliance = lazy(() => import('../pages/government/MOLCompliance'));
const AIStrategicAssessment = lazy(() => import('../pages/consulting/AIStrategicAssessment'));
const ELMPlatform = lazy(() => import('../pages/government/ELMPlatform'));
const SehaPlatform = lazy(() => import('../pages/government/SehaPlatform'));
const CHIPlatform = lazy(() => import('../pages/government/CHIPlatform'));
const HealthInsurancePlatform = lazy(() => import('../pages/government/HealthInsurancePlatform'));
const MedicalInsurancePlatform = lazy(() => import('../pages/government/MedicalInsurancePlatform'));

// New Government Portals
const QiyasAssessment = lazy(() => import('../pages/government/QiyasAssessment'));
const NCAAAccreditation = lazy(() => import('../pages/government/NCAAAccreditation'));
const EducationMinistry = lazy(() => import('../pages/government/EducationMinistry'));
const TaqatHRDF = lazy(() => import('../pages/government/TaqatHRDF'));
const NCEIEmployment = lazy(() => import('../pages/government/NCEIEmployment'));
const InteriorMinistry = lazy(() => import('../pages/government/InteriorMinistry'));
const ESNADNotarization = lazy(() => import('../pages/government/ESNADNotarization'));
const SaudiPostVerification = lazy(() => import('../pages/government/SaudiPostVerification'));
const TawakkalnaCompliance = lazy(() => import('../pages/government/TawakkalnaCompliance'));
const UmmAlQuraCalendar = lazy(() => import('../pages/government/UmmAlQuraCalendar'));
const SaudiEngineeringBody = lazy(() => import('../pages/government/SaudiEngineeringBody'));

// Strategic HR modules
const WorkforcePlanning = lazy(() => import('../pages/strategic/WorkforcePlanning'));
const StrategicSuccessionPlanning = lazy(() => import('../pages/strategic/SuccessionPlanning'));
const TalentAcquisition = lazy(() => import('../pages/strategic/TalentAcquisition'));
const OrganizationalDevelopment = lazy(() => import('../pages/strategic/OrganizationalDevelopment'));
const PerformanceStrategy = lazy(() => import('../pages/strategic/PerformanceStrategy'));
const CompensationStrategy = lazy(() => import('../pages/strategic/CompensationStrategy'));
const DiversityInclusion = lazy(() => import('../pages/strategic/DiversityInclusion'));
const LeadershipDevelopment = lazy(() => import('../pages/strategic/LeadershipDevelopment'));
const EmployeeExperience = lazy(() => import('../pages/strategic/EmployeeExperience'));
const HRTransformation = lazy(() => import('../pages/strategic/HRTransformation'));
const ChangeManagement = lazy(() => import('../pages/strategic/ChangeManagement'));
const CultureStrategy = lazy(() => import('../pages/strategic/CultureStrategy'));

// Consulting modules
const ExecutiveCompensation = lazy(() => import('../pages/consulting/ExecutiveCompensation'));
const OrganizationalRestructuring = lazy(() => import('../pages/consulting/OrganizationalRestructuring'));
const CultureTransformation = lazy(() => import('../pages/consulting/CultureTransformation'));
const MergerIntegration = lazy(() => import('../pages/consulting/MergerIntegration'));
const DigitalTransformation = lazy(() => import('../pages/consulting/DigitalTransformation'));
const TalentStrategy = lazy(() => import('../pages/consulting/TalentStrategy'));
const LeadershipConsulting = lazy(() => import('../pages/consulting/LeadershipConsulting'));
const ChangeManagementConsulting = lazy(() => import('../pages/consulting/ChangeManagement'));
const HROptimization = lazy(() => import('../pages/consulting/HROptimization'));
const RiskAssessment = lazy(() => import('../pages/consulting/RiskAssessment'));
const BenchmarkingAnalysis = lazy(() => import('../pages/consulting/BenchmarkingAnalysis'));
const StrategicPlanning = lazy(() => import('../pages/consulting/StrategicPlanning'));

// Analytics modules
const WorkforceAnalytics = lazy(() => import('../pages/analytics/WorkforceAnalytics'));
const PredictiveModeling = lazy(() => import('../pages/analytics/PredictiveModeling'));
const RealtimeDashboards = lazy(() => import('../pages/analytics/RealtimeDashboards'));
const CostAnalytics = lazy(() => import('../pages/analytics/CostAnalytics'));
const ComplianceReportingAnalytics = lazy(() => import('../pages/analytics/ComplianceReporting'));
const PerformanceAnalytics = lazy(() => import('../pages/analytics/PerformanceAnalytics'));
const TurnoverAnalysis = lazy(() => import('../pages/analytics/TurnoverAnalysis'));
const BenchmarkingReports = lazy(() => import('../pages/analytics/BenchmarkingReports'));
const CustomReporting = lazy(() => import('../pages/analytics/CustomReporting'));
const DataVisualization = lazy(() => import('../pages/analytics/DataVisualization'));
const ExecutiveReporting = lazy(() => import('../pages/analytics/ExecutiveReporting'));
const EmployeeReports = lazy(() => import('../pages/analytics/EmployeeReports'));

// Compliance modules
const ComplianceOverview = lazy(() => import('../pages/compliance'));
const RegulatoryCompliance = lazy(() => import('../pages/compliance/RegulatoryCompliance'));
const CommitteeManagement = lazy(() => import('../pages/compliance/CommitteeManagement'));
const AuditTrails = lazy(() => import('../pages/compliance/AuditTrails'));
const PolicyManagement = lazy(() => import('../pages/compliance/PolicyManagement'));
const RiskManagement = lazy(() => import('../pages/compliance/RiskManagement'));
const GovernanceFramework = lazy(() => import('../pages/compliance/GovernanceFramework'));
const ComplianceReporting = lazy(() => import('../pages/compliance/ComplianceReporting'));
const LegalDocumentTracking = lazy(() => import('../pages/compliance/LegalDocumentTracking'));
const DocumentationManagement = lazy(() => import('../pages/compliance/DocumentationManagement'));
const EvidenceManagement = lazy(() => import('../pages/compliance/EvidenceManagement'));

// AI & Automation modules
const AISyncEngine = lazy(() => import('../pages/ai-automation/AISyncEngine'));
const SmartRecommendations = lazy(() => import('../pages/ai-automation/SmartRecommendations'));
const PredictiveAnalyticsEngine = lazy(() => import('../pages/ai-automation/PredictiveAnalyticsEngine'));
const DocumentIntelligence = lazy(() => import('../pages/ai-automation/DocumentIntelligence'));
const ArabicEnglishNLP = lazy(() => import('../pages/ai-automation/ArabicEnglishNLP'));
const AutomatedWorkflowEngine = lazy(() => import('../pages/ai-automation/AutomatedWorkflowEngine'));

// Employee Welfare & Safety modules
const WelfareComplianceDashboard = lazy(() => import('../pages/welfare-safety/WelfareComplianceDashboard'));
const GrievanceReporting = lazy(() => import('../pages/welfare-safety/GrievanceReporting'));
const FoodHousingTransport = lazy(() => import('../pages/welfare-safety/FoodHousingTransport'));
const WellbeingTracker = lazy(() => import('../pages/welfare-safety/WellbeingTracker'));
const EthicsScore = lazy(() => import('../pages/welfare-safety/EthicsScore'));
const AIDiagnosisRecommendations = lazy(() => import('../pages/welfare-safety/AIDiagnosisRecommendations'));
const ComplianceFramework = lazy(() => import('../pages/welfare-safety/ComplianceFramework'));
const MultiViewDashboards = lazy(() => import('../pages/welfare-safety/MultiViewDashboards'));

// Diagnostic Framework modules
const RetentionStrategyAssessment = lazy(() => import('../pages/diagnostic/RetentionStrategyAssessment'));
const HRProcessImprovement = lazy(() => import('../pages/diagnostic/HRProcessImprovement'));
const HRRoleOptimization = lazy(() => import('../pages/diagnostic/HRRoleOptimization'));
const HRValueChainAnalysis = lazy(() => import('../pages/diagnostic/HRValueChainAnalysis'));
const OrgStructureAssessment = lazy(() => import('../pages/diagnostic/OrgStructureAssessment'));
const CultureChangeTracker = lazy(() => import('../pages/diagnostic/CultureChangeTracker'));
const IPOReadinessDiagnostic = lazy(() => import('../pages/diagnostic/IPOReadinessDiagnostic'));

// Local Content Compliance modules
const WorkforceLocalizationTracker = lazy(() => import('../pages/local-content/WorkforceLocalizationTracker'));
const SupplierDevelopmentMonitor = lazy(() => import('../pages/local-content/SupplierDevelopmentMonitor'));
const InvestmentTrackingSystem = lazy(() => import('../pages/local-content/InvestmentTrackingSystem'));
const AILocalContentIntelligence = lazy(() => import('../pages/local-content/AILocalContentIntelligence'));
const RegulatoryComplianceMonitor = lazy(() => import('../pages/local-content/RegulatoryComplianceMonitor'));
const LocalizationStrategicPlanning = lazy(() => import('../pages/local-content/LocalizationStrategicPlanning'));

// Platform Features modules
const LanguageToggleFeature = lazy(() => import('../pages/platform-features/LanguageToggle'));
const MobileAppFeature = lazy(() => import('../pages/platform-features/MobileApp'));
const SecurityFramework = lazy(() => import('../pages/platform-features/SecurityFramework'));
const APIGateway = lazy(() => import('../pages/platform-features/APIGateway'));

// AI Ecosystem pages
const AICommandCenterPage = lazy(() => import('../pages/ai-ecosystem/AICommandCenterPage'));
const AqlMindCorePage = lazy(() => import('../pages/ai-ecosystem/AqlMindCorePage'));
const AIDecisionEnginePage = lazy(() => import('../pages/ai-ecosystem/AIDecisionEnginePage'));
const LearningEnginePage = lazy(() => import('../pages/ai-ecosystem/LearningEnginePage'));
const IntelligenceGathererPage = lazy(() => import('../pages/ai-ecosystem/IntelligenceGathererPage'));

// Additional modules
const SmartKPITool = lazy(() => import('../pages/additional/SmartKPITool'));
const AqlHRConnect = lazy(() => import('../pages/additional/AqlHRConnect'));
const TestHarness = lazy(() => import('../pages/TestHarness'));
const SystemEngineer = lazy(() => import('../pages/SystemEngineer'));
const ExecutiveCenter = lazy(() => import('../pages/executive/ExecutiveCenter'));
const StrategicPresentationCenter = lazy(() => import('../pages/executive/StrategicPresentationCenter'));
const SuperAdminDashboard = lazy(() => import('../pages/executive/SuperAdminDashboard'));
const ExecutiveMobileApp = lazy(() => import('../pages/executive/ExecutiveMobileApp'));
const AIEnhancedExecutiveIntelligence = lazy(() => import('../pages/ai/AIEnhancedExecutiveIntelligence'));
const AutomationWorkflowEngine = lazy(() => import('../components/ai/AutomationWorkflowEngine'));
const CrossModuleIntelligence = lazy(() => import('../components/ai/CrossModuleIntelligence'));
const MobileAIAssistant = lazy(() => import('../components/ai/MobileAIAssistant'));
const GovernmentAIIntegration = lazy(() => import('../components/ai/GovernmentAIIntegration'));

// LEO & GEO modules
const LearningExperienceOptimization = lazy(() => import('../pages/leo/LearningExperienceOptimization'));
const GenerativeEngagementOptimization = lazy(() => import('../pages/geo/GenerativeEngagementOptimization'));


// Tools & Integrations module
const Tools = lazy(() => import('../pages/Tools'));

// Legal Consultant module
const LegalConsultant = lazy(() => import('../pages/LegalConsultant'));

// NRC Management module
const NRCManagement = lazy(() => import('../pages/NRCManagement'));

// ISO Management module
const ISOManagement = lazy(() => import('../pages/ISOManagement'));

// Processes & Forms module
const ProcessesAndForms = lazy(() => import('../pages/ProcessesAndForms'));

// Skills Intelligence module
const SkillIntelligence = lazy(() => import('../pages/skills/SkillIntelligence'));

// Succession Planning module
const SuccessionPlanning = lazy(() => import('../pages/SuccessionPlanning'));

// Help module
const Help = lazy(() => import('../pages/Help'));

// Welfare Consultancy module
const WelfareConsultancy = lazy(() => import('../pages/WelfareConsultancy'));

// ESG-HR module
const EsgHrPage = lazy(() => import('../pages/esg-hr'));

// Debug page for testing
const DebugPage = lazy(() => import('../pages/debug'));

// Demo/Test page
const TestPage = lazy(() => import('../pages/TestHarness'));

export interface RouteConfig {
  path: string;
  element: React.LazyExoticComponent<React.ComponentType<any>>;
  auth?: boolean;
  adminOnly?: boolean;
}

export const ROUTES: RouteConfig[] = [
  // Core routes - no auth required
  { path: '/ai-executive-intelligence', element: AIEnhancedExecutiveIntelligence, auth: false },
  { path: '/prompt-log', element: PromptLog, auth: true },
  { path: '/', element: DashboardPage, auth: true },
  { path: '/employees', element: EmployeesPage, auth: true },
  { path: '/analytics', element: AnalyticsPage, auth: true },
  { path: '/attendance', element: TimeAttendance, auth: true },
  { path: '/leave', element: LeaveManagement, auth: true },
  { path: '/about', element: About },
  { path: '/tools', element: Tools },
  { path: '/help', element: Help },
  { path: '/debug', element: DebugPage, auth: true },
  { path: '/demo/test-page', element: TestPage, auth: false },
  
  // New main pages
  { path: '/ai', element: lazy(() => import('../pages/AIPage')), auth: true },
  { path: '/recruitment', element: lazy(() => import('../pages/RecruitmentPage')), auth: true },
  { path: '/company', element: lazy(() => import('../pages/Company')), auth: true },
  { path: '/settings', element: lazy(() => import('../pages/Settings')), auth: true },
  
  // AI Advanced Components Routes - auth required
  { path: '/automation-workflows', element: AutomationWorkflowEngine, auth: true },
  { path: '/cross-module-intelligence', element: CrossModuleIntelligence, auth: true },
  { path: '/mobile-ai-assistant', element: MobileAIAssistant, auth: true },
  { path: '/government-ai-integration', element: GovernmentAIIntegration, auth: true },
  { path: '/skills-intelligence', element: SkillIntelligence, auth: true },
  { path: '/succession-planning', element: SuccessionPlanning, auth: true },
  { path: '/welfare-consultancy', element: WelfareConsultancy },
  { path: '/legal-consultant', element: LegalConsultant },
  { path: '/nrc-management', element: NRCManagement },
  { path: '/iso-management', element: ISOManagement },
  { path: '/processes-forms', element: ProcessesAndForms },
  
  // Main modules - auth required
  { path: '/core-hr', element: CoreHR, auth: true },
  { path: '/core-hr/employees', element: Employees, auth: true },
  { path: '/core-hr/organization', element: Organization, auth: true },
  { path: '/core-hr/self-service', element: SelfService, auth: true },
  { path: '/core-hr/documents', element: Documents, auth: true },
  { path: '/payroll', element: Payroll, auth: true },
  { path: '/ai-features', element: AIFeatures, auth: true },
  { path: '/government', element: Government, auth: true },
  { path: '/strategic', element: Strategic, auth: true },
  { path: '/consulting', element: Consulting, auth: true },
  { path: '/analytics', element: Analytics, auth: true },
  { path: '/performance', element: PerformanceAnalytics, auth: true },
  
  // Compliance routes - admin only
  { path: '/compliance', element: ComplianceOverview, auth: true, adminOnly: true },
  { path: '/compliance/regulatory', element: RegulatoryCompliance, auth: true, adminOnly: true },
  { path: '/compliance/committees', element: CommitteeManagement, auth: true, adminOnly: true },
  { path: '/compliance/audit-trails', element: AuditTrails, auth: true, adminOnly: true },
  { path: '/compliance/risk-management', element: RiskManagement, auth: true, adminOnly: true },
  { path: '/compliance/policies', element: PolicyManagement, auth: true, adminOnly: true },
  { path: '/compliance/governance', element: GovernanceFramework, auth: true, adminOnly: true },
  { path: '/compliance/reporting', element: ComplianceReporting, auth: true, adminOnly: true },
  { path: '/compliance/legal-docs', element: LegalDocumentTracking, auth: true, adminOnly: true },
  { path: '/compliance/documentation', element: DocumentationManagement, auth: true, adminOnly: true },
  { path: '/compliance/evidence', element: EvidenceManagement, auth: true, adminOnly: true },
  
  // Core HR Extended Routes
  { path: '/core-hr/master-data', element: EmployeeMasterData, auth: true },
  { path: '/core-hr/benefits', element: BenefitsAdministration, auth: true },
  { path: '/core-hr/succession-planning', element: SuccessionPlanningCore, auth: true },
  { path: '/core-hr/compensation-management', element: CompensationManagementCore, auth: true },
  { path: '/core-hr/time-attendance', element: TimeAttendance, auth: true },
  { path: '/core-hr/performance', element: PerformanceManagement, auth: true },
  { path: '/core-hr/leave', element: LeaveManagement, auth: true },
  { path: '/core-hr/training', element: TrainingDevelopment, auth: true },
  { path: '/core-hr/recruitment', element: RecruitmentOnboarding, auth: true },
  { path: '/core-hr/compensation', element: CompensationBenefits, auth: true },
  { path: '/core-hr/workflow', element: WorkflowAutomation, auth: true },
  { path: '/core-hr/mobile', element: MobileHR, auth: true },
  { path: '/core-hr/saudization', element: SaudizationCalculator, auth: true },
  { path: '/health-safety', element: HealthSafety, auth: true },
  { path: '/hse', element: HealthSafety, auth: true },
  
  // AI Ecosystem Routes - admin only
  { path: '/ai-ecosystem/command-center', element: AICommandCenterPage, auth: true, adminOnly: true },
  { path: '/ai-ecosystem/aql-mind-core', element: AqlMindCorePage, auth: true, adminOnly: true },
  { path: '/ai-ecosystem/decision-engine', element: AIDecisionEnginePage, auth: true, adminOnly: true },
  { path: '/ai-ecosystem/learning-engine', element: LearningEnginePage, auth: true, adminOnly: true },
  { path: '/ai-ecosystem/intelligence-gatherer', element: IntelligenceGathererPage, auth: true, adminOnly: true },

  // AI & Automation Routes - admin only
  { path: '/ai-automation/sync-engine', element: AISyncEngine, auth: true, adminOnly: true },
  { path: '/ai-automation/smart-recommendations', element: SmartRecommendations, auth: true, adminOnly: true },
  { path: '/ai-automation/predictive-analytics', element: PredictiveAnalyticsEngine, auth: true, adminOnly: true },
  { path: '/ai-automation/document-intelligence', element: DocumentIntelligence, auth: true, adminOnly: true },
  { path: '/ai-automation/arabic-english-nlp', element: ArabicEnglishNLP, auth: true, adminOnly: true },
  { path: '/ai-automation/automated-workflow', element: AutomatedWorkflowEngine, auth: true, adminOnly: true },
  
  // Employee Welfare & Safety Routes
  { path: '/welfare-safety/compliance-dashboard', element: WelfareComplianceDashboard, auth: true },
  { path: '/welfare-safety/grievance-reporting', element: GrievanceReporting, auth: true },
  { path: '/welfare-safety/food-housing-transport', element: FoodHousingTransport, auth: true },
  { path: '/welfare-safety/wellbeing-tracker', element: WellbeingTracker, auth: true },
  { path: '/welfare-safety/ethics-score', element: EthicsScore, auth: true },
  { path: '/welfare-safety/ai-diagnosis', element: AIDiagnosisRecommendations, auth: true },
  { path: '/welfare-safety/compliance-framework', element: ComplianceFramework, auth: true },
  { path: '/welfare-safety/multi-view-dashboards', element: MultiViewDashboards, auth: true },
  
  // Diagnostic Framework Routes - admin only
  { path: '/diagnostic/retention-strategy', element: RetentionStrategyAssessment, auth: true, adminOnly: true },
  { path: '/diagnostic/hr-process-improvement', element: HRProcessImprovement, auth: true, adminOnly: true },
  { path: '/diagnostic/hr-role-optimization', element: HRRoleOptimization, auth: true, adminOnly: true },
  { path: '/diagnostic/hr-value-chain', element: HRValueChainAnalysis, auth: true, adminOnly: true },
  { path: '/diagnostic/org-structure', element: OrgStructureAssessment, auth: true, adminOnly: true },
  { path: '/diagnostic/culture-change', element: CultureChangeTracker, auth: true, adminOnly: true },
  { path: '/diagnostic/ipo-readiness', element: IPOReadinessDiagnostic, auth: true, adminOnly: true },
  
  // Local Content Compliance Routes
  { path: '/local-content/workforce-localization', element: WorkforceLocalizationTracker, auth: true },
  { path: '/local-content/supplier-development', element: SupplierDevelopmentMonitor, auth: true },
  { path: '/local-content/investment-tracking', element: InvestmentTrackingSystem, auth: true },
  { path: '/local-content/ai-intelligence', element: AILocalContentIntelligence, auth: true },
  { path: '/local-content/regulatory-compliance', element: RegulatoryComplianceMonitor, auth: true },
  { path: '/local-content/strategic-planning', element: LocalizationStrategicPlanning, auth: true },
  
  // Platform Features Routes - admin only
  { path: '/platform/language-toggle', element: LanguageToggleFeature, auth: true, adminOnly: true },
  { path: '/platform/mobile-app', element: MobileAppFeature, auth: true, adminOnly: true },
  { path: '/platform/security-framework', element: SecurityFramework, auth: true, adminOnly: true },
  { path: '/platform/api-gateway', element: APIGateway, auth: true, adminOnly: true },
  
  // Additional Modules Routes
  { path: '/tools/smart-kpi', element: SmartKPITool, auth: true },
  { path: '/additional/smart-kpi', element: SmartKPITool, auth: true }, // Alternative route
  { path: '/tools/aqlhr-connect', element: AqlHRConnect, auth: true },
  { path: '/test-harness', element: TestHarness, auth: true, adminOnly: true },
  
  // Government Integration Sub-routes
  { path: '/government/qiwa', element: QiwaIntegration, auth: true },
  { path: '/government/absher', element: AbsherPlatform, auth: true },
  { path: '/government/muqeem', element: MuqeemPlatform, auth: true },
  { path: '/government/mudad', element: MudadPlatform, auth: true },
  { path: '/government/nitaqat', element: NitaqatCompliance, auth: true },
  { path: '/government/tvtc', element: TVTCIntegration, auth: true },
  { path: '/government/mol', element: MOLCompliance, auth: true },
  
  { path: '/government/elm', element: ELMPlatform, auth: true },
  { path: '/government/seha', element: SehaPlatform, auth: true },
  { path: '/government/chi', element: CHIPlatform, auth: true },
  { path: '/government/gosi', element: GOSIIntegration, auth: true },
  { path: '/government/health-insurance', element: HealthInsurancePlatform, auth: true },
  { path: '/government/medical-insurance', element: MedicalInsurancePlatform, auth: true },
  
  // New Government Portal Routes
  { path: '/government/qiyas', element: QiyasAssessment, auth: true },
  { path: '/government/ncaaa', element: NCAAAccreditation, auth: true },
  { path: '/government/education', element: EducationMinistry, auth: true },
  { path: '/government/taqat', element: TaqatHRDF, auth: true },
  { path: '/government/ncei', element: NCEIEmployment, auth: true },
  { path: '/government/interior', element: InteriorMinistry, auth: true },
  { path: '/government/esnad', element: ESNADNotarization, auth: true },
  { path: '/government/saudi-post', element: SaudiPostVerification, auth: true },
  { path: '/government/tawakkalna', element: TawakkalnaCompliance, auth: true },
  { path: '/government/umm-al-qura', element: UmmAlQuraCalendar, auth: true },
  { path: '/government/saudi-engineering', element: SaudiEngineeringBody, auth: true },
  
  // Payroll Sub-routes - auth required
  { path: '/payroll/wps', element: WPSProcessing, auth: true },
  { path: '/payroll/gosi', element: GOSIIntegration, auth: true },
  { path: '/payroll/eosb', element: EOSBCalculations, auth: true },
  
  { path: '/payroll/expenses', element: ExpenseManagement, auth: true },
  { path: '/payroll/analytics', element: PayrollAnalytics, auth: true },
  { path: '/payroll/banking', element: BankIntegration, auth: true },
  { path: '/payroll/budgeting', element: BudgetForecasting, auth: true },
  
  // Strategic HR Sub-routes
  { path: '/strategic/workforce-planning', element: WorkforcePlanning, auth: true },
  { path: '/strategic/succession', element: StrategicSuccessionPlanning, auth: true },
  { path: '/strategic/talent-acquisition', element: TalentAcquisition, auth: true },
  { path: '/strategic/org-development', element: OrganizationalDevelopment, auth: true },
  { path: '/strategic/performance', element: PerformanceStrategy, auth: true },
  { path: '/strategic/compensation', element: CompensationStrategy, auth: true },
  { path: '/strategic/diversity', element: DiversityInclusion, auth: true },
  { path: '/strategic/leadership', element: LeadershipDevelopment, auth: true },
  { path: '/strategic/experience', element: EmployeeExperience, auth: true },
  { path: '/strategic/transformation', element: HRTransformation, auth: true },
  { path: '/strategic/change-management', element: ChangeManagement, auth: true },
  { path: '/strategic/culture', element: CultureStrategy, auth: true },
  
// Consulting Sub-routes - AI Assessment Tool as #1 priority
  { path: '/consulting/ai-assessment', element: AIStrategicAssessment, auth: true },
  { path: '/consulting/executive-compensation', element: ExecutiveCompensation, auth: true },
  { path: '/consulting/restructuring', element: OrganizationalRestructuring, auth: true },
  { path: '/consulting/culture', element: CultureTransformation, auth: true },
  { path: '/consulting/culture-transformation', element: CultureTransformation, auth: true },
  { path: '/consulting/merger', element: MergerIntegration, auth: true },
  { path: '/consulting/merger-integration', element: MergerIntegration, auth: true },
  { path: '/consulting/digital', element: DigitalTransformation, auth: true },
  { path: '/consulting/digital-transformation', element: DigitalTransformation, auth: true },
  { path: '/consulting/talent', element: TalentStrategy, auth: true },
  { path: '/consulting/talent-strategy', element: TalentStrategy, auth: true },
  { path: '/consulting/leadership', element: LeadershipConsulting, auth: true },
  { path: '/consulting/change', element: ChangeManagementConsulting, auth: true },
  { path: '/consulting/change-management', element: ChangeManagementConsulting, auth: true },
  { path: '/consulting/optimization', element: HROptimization, auth: true },
  { path: '/consulting/hr-optimization', element: HROptimization, auth: true },
  { path: '/consulting/risk', element: RiskAssessment, auth: true },
  { path: '/consulting/risk-assessment', element: RiskAssessment, auth: true },
  { path: '/consulting/benchmarking', element: BenchmarkingAnalysis, auth: true },
  { path: '/consulting/planning', element: StrategicPlanning, auth: true },
  { path: '/consulting/strategic-planning', element: StrategicPlanning, auth: true },
  
  // Analytics Sub-routes
  { path: '/analytics/workforce', element: WorkforceAnalytics, auth: true },
  { path: '/analytics/predictive', element: PredictiveModeling, auth: true },
  { path: '/analytics/realtime', element: RealtimeAnalytics, auth: true },
  { path: '/analytics/kpi', element: KPIAnalytics, auth: true },
  { path: '/analytics/executive', element: ExecutiveAnalytics, auth: true },
  { path: '/analytics/cost', element: CostAnalytics, auth: true },
  { path: '/analytics/compliance', element: ComplianceReportingAnalytics, auth: true },
  { path: '/analytics/performance', element: PerformanceAnalytics, auth: true },
  { path: '/analytics/turnover', element: TurnoverAnalysis, auth: true },
  { path: '/analytics/benchmarking', element: BenchmarkingReports, auth: true },
  { path: '/analytics/custom', element: CustomReporting, auth: true },
  { path: '/analytics/visualization', element: DataVisualization, auth: true },
  { path: '/analytics/employee-reports', element: EmployeeReports, auth: true, adminOnly: true },
  
  // Admin routes
  { path: '/admin/users', element: UsersPage, auth: true, adminOnly: true },
  
  // Reports routes
  { path: '/reports/builder', element: ReportBuilder, auth: true },
  
  // LEO & GEO Advanced Modules - auth required
  { path: '/leo', element: LearningExperienceOptimization, auth: true },
  { path: '/geo', element: GenerativeEngagementOptimization, auth: true },
  
  // ESG-HR Module - auth required
  { path: '/esg-hr', element: EsgHrPage, auth: true },
  
  // Executive Intelligence Center - admin only
  { path: '/executive-center', element: ExecutiveCenter, auth: true, adminOnly: true },
  { path: '/executive/mobile', element: ExecutiveMobileApp, auth: true, adminOnly: true },
  { path: '/executive/strategic-presentations', element: StrategicPresentationCenter, auth: true, adminOnly: true },
  { path: '/founder/super-admin', element: SuperAdminDashboard, auth: true, adminOnly: true },
  
  // System Engineering - admin only
  { path: '/system-engineer', element: SystemEngineer, auth: true, adminOnly: true },
];