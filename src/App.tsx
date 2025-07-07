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
