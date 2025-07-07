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
