import { lazy } from 'react';

// Core modules
const Index = lazy(() => import('../pages/Index'));
const NotFound = lazy(() => import('../pages/NotFound'));
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

// Payroll sub-modules
const WPSProcessing = lazy(() => import('../pages/payroll/WPSProcessing'));
const GOSIIntegration = lazy(() => import('../pages/payroll/GOSIIntegration'));
const EOSBCalculations = lazy(() => import('../pages/payroll/EOSBCalculations'));
const TaxCompliance = lazy(() => import('../pages/payroll/TaxCompliance'));
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
const ZATCAIntegration = lazy(() => import('../pages/government/ZATCAIntegration'));
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

// Strategic HR modules
const WorkforcePlanning = lazy(() => import('../pages/strategic/WorkforcePlanning'));
const SuccessionPlanning = lazy(() => import('../pages/strategic/SuccessionPlanning'));
const TalentAcquisition = lazy(() => import('../pages/strategic/TalentAcquisition'));
const OrganizationalDevelopment = lazy(() => import('../pages/strategic/OrganizationalDevelopment'));
const PerformanceStrategy = lazy(() => import('../pages/strategic/PerformanceStrategy'));
const CompensationStrategy = lazy(() => import('../pages/strategic/CompensationStrategy'));
const DiversityInclusion = lazy(() => import('../pages/strategic/DiversityInclusion'));
const LeadershipDevelopment = lazy(() => import('../pages/strategic/LeadershipDevelopment'));
const EmployeeExperience = lazy(() => import('../pages/strategic/EmployeeExperience'));
const HRTransformation = lazy(() => import('../pages/strategic/HRTransformation'));

// Consulting modules
const ExecutiveCompensation = lazy(() => import('../pages/consulting/ExecutiveCompensation'));
const OrganizationalRestructuring = lazy(() => import('../pages/consulting/OrganizationalRestructuring'));
const CultureTransformation = lazy(() => import('../pages/consulting/CultureTransformation'));
const MergerIntegration = lazy(() => import('../pages/consulting/MergerIntegration'));
const DigitalTransformation = lazy(() => import('../pages/consulting/DigitalTransformation'));
const TalentStrategy = lazy(() => import('../pages/consulting/TalentStrategy'));
const LeadershipConsulting = lazy(() => import('../pages/consulting/LeadershipConsulting'));
const ChangeManagement = lazy(() => import('../pages/consulting/ChangeManagement'));
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

// Additional modules
const SmartKPITool = lazy(() => import('../pages/additional/SmartKPITool'));
const SanadHRConnect = lazy(() => import('../pages/additional/SanadHRConnect'));
const TestHarness = lazy(() => import('../pages/TestHarness'));

export interface RouteConfig {
  path: string;
  element: React.LazyExoticComponent<() => JSX.Element>;
  auth?: boolean;
  adminOnly?: boolean;
}

export const ROUTES: RouteConfig[] = [
  // Core routes - no auth required
  { path: '/', element: Index },
  { path: '/about', element: About },
  
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
  { path: '/tools/sanadhr-connect', element: SanadHRConnect, auth: true },
  { path: '/test-harness', element: TestHarness, auth: true, adminOnly: true },
  
  // Government Integration Sub-routes
  { path: '/government/qiwa', element: QiwaIntegration, auth: true },
  { path: '/government/absher', element: AbsherPlatform, auth: true },
  { path: '/government/muqeem', element: MuqeemPlatform, auth: true },
  { path: '/government/mudad', element: MudadPlatform, auth: true },
  { path: '/government/nitaqat', element: NitaqatCompliance, auth: true },
  { path: '/government/tvtc', element: TVTCIntegration, auth: true },
  { path: '/government/mol', element: MOLCompliance, auth: true },
  { path: '/government/zatca', element: ZATCAIntegration, auth: true },
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
  
  // Payroll Sub-routes - auth required
  { path: '/payroll/wps', element: WPSProcessing, auth: true },
  { path: '/payroll/gosi', element: GOSIIntegration, auth: true },
  { path: '/payroll/eosb', element: EOSBCalculations, auth: true },
  { path: '/payroll/tax', element: TaxCompliance, auth: true },
  { path: '/payroll/expenses', element: ExpenseManagement, auth: true },
  { path: '/payroll/analytics', element: PayrollAnalytics, auth: true },
  { path: '/payroll/banking', element: BankIntegration, auth: true },
  { path: '/payroll/budgeting', element: BudgetForecasting, auth: true },
  
  // Strategic HR Sub-routes
  { path: '/strategic/workforce-planning', element: WorkforcePlanning, auth: true },
  { path: '/strategic/succession', element: SuccessionPlanning, auth: true },
  { path: '/strategic/talent-acquisition', element: TalentAcquisition, auth: true },
  { path: '/strategic/org-development', element: OrganizationalDevelopment, auth: true },
  { path: '/strategic/performance', element: PerformanceStrategy, auth: true },
  { path: '/strategic/compensation', element: CompensationStrategy, auth: true },
  { path: '/strategic/diversity', element: DiversityInclusion, auth: true },
  { path: '/strategic/leadership', element: LeadershipDevelopment, auth: true },
  { path: '/strategic/experience', element: EmployeeExperience, auth: true },
  { path: '/strategic/transformation', element: HRTransformation, auth: true },
  
  // Consulting Sub-routes
  { path: '/consulting/executive-compensation', element: ExecutiveCompensation, auth: true },
  { path: '/consulting/restructuring', element: OrganizationalRestructuring, auth: true },
  { path: '/consulting/culture', element: CultureTransformation, auth: true },
  { path: '/consulting/merger', element: MergerIntegration, auth: true },
  { path: '/consulting/digital', element: DigitalTransformation, auth: true },
  { path: '/consulting/talent', element: TalentStrategy, auth: true },
  { path: '/consulting/leadership', element: LeadershipConsulting, auth: true },
  { path: '/consulting/change', element: ChangeManagement, auth: true },
  { path: '/consulting/optimization', element: HROptimization, auth: true },
  { path: '/consulting/risk', element: RiskAssessment, auth: true },
  { path: '/consulting/benchmarking', element: BenchmarkingAnalysis, auth: true },
  { path: '/consulting/planning', element: StrategicPlanning, auth: true },
  
  // Analytics Sub-routes
  { path: '/analytics/workforce', element: WorkforceAnalytics, auth: true },
  { path: '/analytics/predictive', element: PredictiveModeling, auth: true },
  { path: '/analytics/realtime', element: RealtimeDashboards, auth: true },
  { path: '/analytics/cost', element: CostAnalytics, auth: true },
  { path: '/analytics/compliance', element: ComplianceReportingAnalytics, auth: true },
  { path: '/analytics/performance', element: PerformanceAnalytics, auth: true },
  { path: '/analytics/turnover', element: TurnoverAnalysis, auth: true },
  { path: '/analytics/benchmarking', element: BenchmarkingReports, auth: true },
  { path: '/analytics/custom', element: CustomReporting, auth: true },
  { path: '/analytics/visualization', element: DataVisualization, auth: true },
  { path: '/analytics/executive', element: ExecutiveReporting, auth: true },
  { path: '/analytics/employee-reports', element: EmployeeReports, auth: true, adminOnly: true },
];