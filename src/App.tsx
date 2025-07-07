import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CoreHR from "./pages/CoreHR";
import Employees from "./pages/Employees";
import Organization from "./pages/Organization";
import SelfService from "./pages/SelfService";
import Documents from "./pages/Documents";
import Payroll from "./pages/Payroll";
// Core HR sub-modules
import TimeAttendance from "./pages/core-hr/TimeAttendance";
import PerformanceManagement from "./pages/core-hr/PerformanceManagement";
import LeaveManagement from "./pages/core-hr/LeaveManagement";
import TrainingDevelopment from "./pages/core-hr/TrainingDevelopment";
import RecruitmentOnboarding from "./pages/core-hr/RecruitmentOnboarding";
import CompensationBenefits from "./pages/core-hr/CompensationBenefits";
import WorkflowAutomation from "./pages/core-hr/WorkflowAutomation";
import MobileHR from "./pages/core-hr/MobileHR";
// Payroll sub-modules
import WPSProcessing from "./pages/payroll/WPSProcessing";
import GOSIIntegration from "./pages/payroll/GOSIIntegration";
import EOSBCalculations from "./pages/payroll/EOSBCalculations";
import TaxCompliance from "./pages/payroll/TaxCompliance";
import ExpenseManagement from "./pages/payroll/ExpenseManagement";
import PayrollAnalytics from "./pages/payroll/PayrollAnalytics";
import BankIntegration from "./pages/payroll/BankIntegration";
import BudgetForecasting from "./pages/payroll/BudgetForecasting";
// Government sub-modules
import QiwaIntegration from "./pages/government/QiwaIntegration";
import AbsherPlatform from "./pages/government/AbsherPlatform";
import MudadPlatform from "./pages/government/MudadPlatform";
import NitaqatCompliance from "./pages/government/NitaqatCompliance";
import TVTCIntegration from "./pages/government/TVTCIntegration";
import MOLCompliance from "./pages/government/MOLCompliance";
import ZATCAIntegration from "./pages/government/ZATCAIntegration";
import ELMPlatform from "./pages/government/ELMPlatform";
// Strategic HR modules
import WorkforcePlanning from "./pages/strategic/WorkforcePlanning";
import SuccessionPlanning from "./pages/strategic/SuccessionPlanning";
import TalentAcquisition from "./pages/strategic/TalentAcquisition";
import OrganizationalDevelopment from "./pages/strategic/OrganizationalDevelopment";
import PerformanceStrategy from "./pages/strategic/PerformanceStrategy";
import CompensationStrategy from "./pages/strategic/CompensationStrategy";
import DiversityInclusion from "./pages/strategic/DiversityInclusion";
import LeadershipDevelopment from "./pages/strategic/LeadershipDevelopment";
import EmployeeExperience from "./pages/strategic/EmployeeExperience";
import HRTransformation from "./pages/strategic/HRTransformation";
// Consulting modules
import ExecutiveCompensation from "./pages/consulting/ExecutiveCompensation";
import OrganizationalRestructuring from "./pages/consulting/OrganizationalRestructuring";
import CultureTransformation from "./pages/consulting/CultureTransformation";
import MergerIntegration from "./pages/consulting/MergerIntegration";
import DigitalTransformation from "./pages/consulting/DigitalTransformation";
import TalentStrategy from "./pages/consulting/TalentStrategy";
import LeadershipConsulting from "./pages/consulting/LeadershipConsulting";
import ChangeManagement from "./pages/consulting/ChangeManagement";
import HROptimization from "./pages/consulting/HROptimization";
import RiskAssessment from "./pages/consulting/RiskAssessment";
import BenchmarkingAnalysis from "./pages/consulting/BenchmarkingAnalysis";
import StrategicPlanning from "./pages/consulting/StrategicPlanning";
// Analytics modules
import WorkforceAnalytics from "./pages/analytics/WorkforceAnalytics";
import PredictiveModeling from "./pages/analytics/PredictiveModeling";
import RealtimeDashboards from "./pages/analytics/RealtimeDashboards";
import CostAnalytics from "./pages/analytics/CostAnalytics";
import ComplianceReportingAnalytics from "./pages/analytics/ComplianceReporting";
import PerformanceAnalytics from "./pages/analytics/PerformanceAnalytics";
import TurnoverAnalysis from "./pages/analytics/TurnoverAnalysis";
import BenchmarkingReports from "./pages/analytics/BenchmarkingReports";
import CustomReporting from "./pages/analytics/CustomReporting";
import DataVisualization from "./pages/analytics/DataVisualization";
import ExecutiveReporting from "./pages/analytics/ExecutiveReporting";
import AIFeatures from "./pages/AIFeatures";
import Government from "./pages/Government";
import Strategic from "./pages/Strategic";
import Consulting from "./pages/Consulting";
import Analytics from "./pages/Analytics";
import ComplianceOverview from "./pages/compliance";
import RegulatoryCompliance from "./pages/compliance/RegulatoryCompliance";
import CommitteeManagement from "./pages/compliance/CommitteeManagement";
import AuditTrails from "./pages/compliance/AuditTrails";
import PolicyManagement from "./pages/compliance/PolicyManagement";
import RiskManagement from "./pages/compliance/RiskManagement";
import GovernanceFramework from "./pages/compliance/GovernanceFramework";
import ComplianceReporting from "./pages/compliance/ComplianceReporting";
import LegalDocumentTracking from "./pages/compliance/LegalDocumentTracking";
import DocumentationManagement from "./pages/compliance/DocumentationManagement";
import EvidenceManagement from "./pages/compliance/EvidenceManagement";
// Core HR additional modules
import EmployeeMasterData from "./pages/core-hr/EmployeeMasterData";
import BenefitsAdministration from "./pages/core-hr/BenefitsAdministration";
import SuccessionPlanningCore from "./pages/core-hr/SuccessionPlanningCore";
import CompensationManagementCore from "./pages/core-hr/CompensationManagementCore";
// AI & Automation modules
import AISyncEngine from "./pages/ai-automation/AISyncEngine";
import SmartRecommendations from "./pages/ai-automation/SmartRecommendations";
import PredictiveAnalyticsEngine from "./pages/ai-automation/PredictiveAnalyticsEngine";
import DocumentIntelligence from "./pages/ai-automation/DocumentIntelligence";
import ArabicEnglishNLP from "./pages/ai-automation/ArabicEnglishNLP";
import AutomatedWorkflowEngine from "./pages/ai-automation/AutomatedWorkflowEngine";
// Employee Welfare & Safety modules
import WelfareComplianceDashboard from "./pages/welfare-safety/WelfareComplianceDashboard";
import GrievanceReporting from "./pages/welfare-safety/GrievanceReporting";
import FoodHousingTransport from "./pages/welfare-safety/FoodHousingTransport";
import WellbeingTracker from "./pages/welfare-safety/WellbeingTracker";
import EthicsScore from "./pages/welfare-safety/EthicsScore";
import AIDiagnosisRecommendations from "./pages/welfare-safety/AIDiagnosisRecommendations";
import ComplianceFramework from "./pages/welfare-safety/ComplianceFramework";
import MultiViewDashboards from "./pages/welfare-safety/MultiViewDashboards";
// Diagnostic Framework modules
import RetentionStrategyAssessment from "./pages/diagnostic/RetentionStrategyAssessment";
import HRProcessImprovement from "./pages/diagnostic/HRProcessImprovement";
import HRRoleOptimization from "./pages/diagnostic/HRRoleOptimization";
import HRValueChainAnalysis from "./pages/diagnostic/HRValueChainAnalysis";
import OrgStructureAssessment from "./pages/diagnostic/OrgStructureAssessment";
import CultureChangeTracker from "./pages/diagnostic/CultureChangeTracker";
import IPOReadinessDiagnostic from "./pages/diagnostic/IPOReadinessDiagnostic";
// Local Content Compliance modules
import WorkforceLocalizationTracker from "./pages/local-content/WorkforceLocalizationTracker";
import SupplierDevelopmentMonitor from "./pages/local-content/SupplierDevelopmentMonitor";
import InvestmentTrackingSystem from "./pages/local-content/InvestmentTrackingSystem";
import AILocalContentIntelligence from "./pages/local-content/AILocalContentIntelligence";
import RegulatoryComplianceMonitor from "./pages/local-content/RegulatoryComplianceMonitor";
import LocalizationStrategicPlanning from "./pages/local-content/LocalizationStrategicPlanning";
// Platform Features modules
import LanguageToggleFeature from "./pages/platform-features/LanguageToggle";
import MobileAppFeature from "./pages/platform-features/MobileApp";
import SecurityFramework from "./pages/platform-features/SecurityFramework";
import APIGateway from "./pages/platform-features/APIGateway";
// Additional modules
import SmartKPITool from "./pages/additional/SmartKPITool";
import SanadHRConnect from "./pages/additional/SanadHRConnect";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/core-hr" element={<CoreHR />} />
                    <Route path="/core-hr/employees" element={<Employees />} />
                    <Route path="/core-hr/organization" element={<Organization />} />
                    <Route path="/core-hr/self-service" element={<SelfService />} />
                    <Route path="/core-hr/documents" element={<Documents />} />
                    <Route path="/compliance" element={<ComplianceOverview />} />
                    <Route path="/compliance/regulatory" element={<RegulatoryCompliance />} />
                    <Route path="/compliance/committees" element={<CommitteeManagement />} />
                    <Route path="/compliance/audit-trails" element={<AuditTrails />} />
                    <Route path="/compliance/risk-management" element={<RiskManagement />} />
                    <Route path="/compliance/policies" element={<PolicyManagement />} />
                    <Route path="/compliance/governance" element={<GovernanceFramework />} />
                    <Route path="/compliance/reporting" element={<ComplianceReporting />} />
                    <Route path="/compliance/legal-docs" element={<LegalDocumentTracking />} />
                    <Route path="/compliance/documentation" element={<DocumentationManagement />} />
                    <Route path="/compliance/evidence" element={<EvidenceManagement />} />
                    <Route path="/payroll" element={<Payroll />} />
                    <Route path="/ai-features" element={<AIFeatures />} />
                    <Route path="/government" element={<Government />} />
                    <Route path="/strategic" element={<Strategic />} />
                    <Route path="/consulting" element={<Consulting />} />
                    <Route path="/analytics" element={<Analytics />} />
                    
                    {/* Core HR Extended Routes */}
                    <Route path="/core-hr/master-data" element={<EmployeeMasterData />} />
                    <Route path="/core-hr/benefits" element={<BenefitsAdministration />} />
                    <Route path="/core-hr/succession-planning" element={<SuccessionPlanningCore />} />
                    <Route path="/core-hr/compensation-management" element={<CompensationManagementCore />} />
                    
                    {/* AI & Automation Routes */}
                    <Route path="/ai-automation/sync-engine" element={<AISyncEngine />} />
                    <Route path="/ai-automation/smart-recommendations" element={<SmartRecommendations />} />
                    <Route path="/ai-automation/predictive-analytics" element={<PredictiveAnalyticsEngine />} />
                    <Route path="/ai-automation/document-intelligence" element={<DocumentIntelligence />} />
                    <Route path="/ai-automation/arabic-english-nlp" element={<ArabicEnglishNLP />} />
                    <Route path="/ai-automation/automated-workflow" element={<AutomatedWorkflowEngine />} />
                    
                    {/* Employee Welfare & Safety Routes */}
                    <Route path="/welfare-safety/compliance-dashboard" element={<WelfareComplianceDashboard />} />
                    <Route path="/welfare-safety/grievance-reporting" element={<GrievanceReporting />} />
                    <Route path="/welfare-safety/food-housing-transport" element={<FoodHousingTransport />} />
                    <Route path="/welfare-safety/wellbeing-tracker" element={<WellbeingTracker />} />
                    <Route path="/welfare-safety/ethics-score" element={<EthicsScore />} />
                    <Route path="/welfare-safety/ai-diagnosis" element={<AIDiagnosisRecommendations />} />
                    <Route path="/welfare-safety/compliance-framework" element={<ComplianceFramework />} />
                    <Route path="/welfare-safety/multi-view-dashboards" element={<MultiViewDashboards />} />
                    
                    {/* Diagnostic Framework Routes */}
                    <Route path="/diagnostic/retention-strategy" element={<RetentionStrategyAssessment />} />
                    <Route path="/diagnostic/hr-process-improvement" element={<HRProcessImprovement />} />
                    <Route path="/diagnostic/hr-role-optimization" element={<HRRoleOptimization />} />
                    <Route path="/diagnostic/hr-value-chain" element={<HRValueChainAnalysis />} />
                    <Route path="/diagnostic/org-structure" element={<OrgStructureAssessment />} />
                    <Route path="/diagnostic/culture-change" element={<CultureChangeTracker />} />
                    <Route path="/diagnostic/ipo-readiness" element={<IPOReadinessDiagnostic />} />
                    
                    {/* Local Content Compliance Routes */}
                    <Route path="/local-content/workforce-localization" element={<WorkforceLocalizationTracker />} />
                    <Route path="/local-content/supplier-development" element={<SupplierDevelopmentMonitor />} />
                    <Route path="/local-content/investment-tracking" element={<InvestmentTrackingSystem />} />
                    <Route path="/local-content/ai-intelligence" element={<AILocalContentIntelligence />} />
                    <Route path="/local-content/regulatory-compliance" element={<RegulatoryComplianceMonitor />} />
                    <Route path="/local-content/strategic-planning" element={<LocalizationStrategicPlanning />} />
                    
                    {/* Platform Features Routes */}
                    <Route path="/platform/language-toggle" element={<LanguageToggleFeature />} />
                    <Route path="/platform/mobile-app" element={<MobileAppFeature />} />
                    <Route path="/platform/security-framework" element={<SecurityFramework />} />
                    <Route path="/platform/api-gateway" element={<APIGateway />} />
                    
                    {/* Additional Modules Routes */}
                    <Route path="/tools/smart-kpi" element={<SmartKPITool />} />
                    <Route path="/tools/sanadhr-connect" element={<SanadHRConnect />} />
                    
                    {/* Government Integration Sub-routes */}
                    <Route path="/government/qiwa" element={<QiwaIntegration />} />
                    <Route path="/government/absher" element={<AbsherPlatform />} />
                    <Route path="/government/mudad" element={<MudadPlatform />} />
                    <Route path="/government/nitaqat" element={<NitaqatCompliance />} />
                    <Route path="/government/tvtc" element={<TVTCIntegration />} />
                    <Route path="/government/mol" element={<MOLCompliance />} />
                    <Route path="/government/zatca" element={<ZATCAIntegration />} />
                    <Route path="/government/elm" element={<ELMPlatform />} />
                    
                    {/* Payroll Sub-routes */}
                    <Route path="/payroll/wps" element={<WPSProcessing />} />
                    <Route path="/payroll/gosi" element={<GOSIIntegration />} />
                    <Route path="/payroll/eosb" element={<EOSBCalculations />} />
                    <Route path="/payroll/tax" element={<TaxCompliance />} />
                    <Route path="/payroll/expenses" element={<ExpenseManagement />} />
                    <Route path="/payroll/analytics" element={<PayrollAnalytics />} />
                    <Route path="/payroll/banking" element={<BankIntegration />} />
                    <Route path="/payroll/budgeting" element={<BudgetForecasting />} />
                    
                    {/* Core HR Additional Sub-routes */}
                    <Route path="/core-hr/time-attendance" element={<TimeAttendance />} />
                    <Route path="/core-hr/performance" element={<PerformanceManagement />} />
                    <Route path="/core-hr/leave" element={<LeaveManagement />} />
                    <Route path="/core-hr/training" element={<TrainingDevelopment />} />
                    <Route path="/core-hr/recruitment" element={<RecruitmentOnboarding />} />
                    <Route path="/core-hr/compensation" element={<CompensationBenefits />} />
                    <Route path="/core-hr/workflow" element={<WorkflowAutomation />} />
                    <Route path="/core-hr/mobile" element={<MobileHR />} />
                    
                    {/* Strategic HR Sub-routes */}
                    <Route path="/strategic/workforce-planning" element={<WorkforcePlanning />} />
                    <Route path="/strategic/succession" element={<SuccessionPlanning />} />
                    <Route path="/strategic/talent-acquisition" element={<TalentAcquisition />} />
                    <Route path="/strategic/org-development" element={<OrganizationalDevelopment />} />
                    <Route path="/strategic/performance" element={<PerformanceStrategy />} />
                    <Route path="/strategic/compensation" element={<CompensationStrategy />} />
                    <Route path="/strategic/diversity" element={<DiversityInclusion />} />
                    <Route path="/strategic/leadership" element={<LeadershipDevelopment />} />
                    <Route path="/strategic/experience" element={<EmployeeExperience />} />
                    <Route path="/strategic/transformation" element={<HRTransformation />} />
                    
                    {/* Consulting Sub-routes */}
                    <Route path="/consulting/executive-compensation" element={<ExecutiveCompensation />} />
                    <Route path="/consulting/restructuring" element={<OrganizationalRestructuring />} />
                    <Route path="/consulting/culture" element={<CultureTransformation />} />
                    <Route path="/consulting/merger" element={<MergerIntegration />} />
                    <Route path="/consulting/digital" element={<DigitalTransformation />} />
                    <Route path="/consulting/talent" element={<TalentStrategy />} />
                    <Route path="/consulting/leadership" element={<LeadershipConsulting />} />
                    <Route path="/consulting/change" element={<ChangeManagement />} />
                    <Route path="/consulting/optimization" element={<HROptimization />} />
                    <Route path="/consulting/risk" element={<RiskAssessment />} />
                    <Route path="/consulting/benchmarking" element={<BenchmarkingAnalysis />} />
                    <Route path="/consulting/planning" element={<StrategicPlanning />} />
                    
                    {/* Analytics Sub-routes */}
                    <Route path="/analytics/workforce" element={<WorkforceAnalytics />} />
                    <Route path="/analytics/predictive" element={<PredictiveModeling />} />
                    <Route path="/analytics/realtime" element={<RealtimeDashboards />} />
                    <Route path="/analytics/cost" element={<CostAnalytics />} />
                    <Route path="/analytics/compliance" element={<ComplianceReportingAnalytics />} />
                    <Route path="/analytics/performance" element={<PerformanceAnalytics />} />
                    <Route path="/analytics/turnover" element={<TurnoverAnalysis />} />
                    <Route path="/analytics/benchmarking" element={<BenchmarkingReports />} />
                    <Route path="/analytics/custom" element={<CustomReporting />} />
                    <Route path="/analytics/visualization" element={<DataVisualization />} />
                    <Route path="/analytics/executive" element={<ExecutiveReporting />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
