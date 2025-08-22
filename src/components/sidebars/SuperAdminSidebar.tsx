import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Crown,
  Users,
  ChevronRight,
  ChevronDown,
  Brain,
  Database,
  UserPlus,
  DollarSign,
  Gift,
  Target,
  GraduationCap,
  Clock,
  Calendar,
  TrendingUp,
  Calculator,
  UserCheck,
  BarChart3,
  Circle,
  Shield,
  FileText,
  Layers,
  Activity,
  Building2,
  Link,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const coreHRItems = [
  { title: 'Employee Master Data', url: '/core-hr/master-data', icon: Database },
  { title: 'Recruitment & Hiring', url: '/core-hr/recruitment', icon: UserPlus },
  { title: 'Payroll Processing', url: '/payroll', icon: DollarSign },
  { title: 'Benefits Administration', url: '/core-hr/benefits', icon: Gift },
  { title: 'Performance Management', url: '/core-hr/performance', icon: Target },
  { title: 'Training & Development', url: '/core-hr/training', icon: GraduationCap },
  { title: 'Time & Attendance', url: '/core-hr/time-attendance', icon: Clock },
  { title: 'Leave Management', url: '/core-hr/leave', icon: Calendar },
  { title: 'Succession Planning', url: '/core-hr/succession-planning', icon: TrendingUp },
  { title: 'Compensation Management', url: '/core-hr/compensation-management', icon: DollarSign },
  { title: 'Saudization & Visa Calculator', url: '/core-hr/saudization', icon: Calculator },
  { title: 'Employee Self Service', url: '/core-hr/self-service', icon: UserCheck },
  { title: 'Manager Dashboard', url: '/core-hr/organization', icon: BarChart3 },
];

// Additional groups
const aiPlatformItems = [
  { title: 'AI Command Center', url: '/ai-ecosystem/command-center', icon: Brain },
  { title: 'Aql Mind Core', url: '/ai-ecosystem/aql-mind-core', icon: Brain },
  { title: 'Decision Engine', url: '/ai-ecosystem/decision-engine', icon: Target },
  { title: 'Learning Engine', url: '/ai-ecosystem/learning-engine', icon: GraduationCap },
  { title: 'Intelligence Gatherer', url: '/ai-ecosystem/intelligence-gatherer', icon: Activity },
  { title: 'AI Sync Engine', url: '/ai-automation/sync-engine', icon: Activity },
  { title: 'Smart Recommendations', url: '/ai-automation/smart-recommendations', icon: Target },
  { title: 'Predictive Analytics', url: '/ai-automation/predictive-analytics', icon: TrendingUp },
  { title: 'Document Intelligence', url: '/ai-automation/document-intelligence', icon: FileText },
  { title: 'Arabic-English NLP', url: '/ai-automation/arabic-english-nlp', icon: FileText },
  { title: 'Automated Workflow', url: '/ai-automation/automated-workflow', icon: Layers },
  { title: 'Automation Workflows', url: '/automation-workflows', icon: Layers },
  { title: 'Cross-Module Intelligence', url: '/cross-module-intelligence', icon: Brain },
  { title: 'Mobile AI Assistant', url: '/mobile-ai-assistant', icon: Users },
  { title: 'Govt. AI Integration', url: '/government-ai-integration', icon: Shield },
];

const governmentItems = [
  { title: 'Qiwa Integration', url: '/government/qiwa', icon: Shield },
  { title: 'Absher Platform', url: '/government/absher', icon: Shield },
  { title: 'Muqeem Platform', url: '/government/muqeem', icon: Shield },
  { title: 'Mudad Platform', url: '/government/mudad', icon: Shield },
  { title: 'Nitaqat Compliance', url: '/government/nitaqat', icon: Shield },
  { title: 'TVTC Integration', url: '/government/tvtc', icon: Shield },
  { title: 'MOL Compliance', url: '/government/mol', icon: Shield },
  { title: 'ELM Platform', url: '/government/elm', icon: Building2 },
  { title: 'Seha Platform', url: '/government/seha', icon: Building2 },
  { title: 'CHI Platform', url: '/government/chi', icon: Building2 },
  { title: 'GOSI Integration', url: '/government/gosi', icon: Shield },
  { title: 'Health Insurance', url: '/government/health-insurance', icon: Shield },
  { title: 'Medical Insurance', url: '/government/medical-insurance', icon: Shield },
  { title: 'Qiyas Assessment', url: '/government/qiyas', icon: FileText },
  { title: 'NCAAA Accreditation', url: '/government/ncaaa', icon: FileText },
  { title: 'Ministry of Education', url: '/government/education', icon: Building2 },
  { title: 'TAQAT / HRDF', url: '/government/taqat', icon: Shield },
  { title: 'NCEI Employment', url: '/government/ncei', icon: Shield },
  { title: 'Ministry of Interior', url: '/government/interior', icon: Shield },
  { title: 'ESNAD Notarization', url: '/government/esnad', icon: FileText },
  { title: 'Saudi Post Verify', url: '/government/saudi-post', icon: FileText },
  { title: 'Tawakkalna', url: '/government/tawakkalna', icon: Shield },
  { title: 'Umm Al-Qura Calendar', url: '/government/umm-al-qura', icon: Calendar },
  { title: 'Saudi Engineering Body', url: '/government/saudi-engineering', icon: Shield },
];

const complianceItems = [
  { title: 'Compliance Overview', url: '/compliance', icon: Shield },
  { title: 'Regulatory Compliance', url: '/compliance/regulatory', icon: Shield },
  { title: 'Committee Management', url: '/compliance/committees', icon: Users },
  { title: 'Audit Trails', url: '/compliance/audit-trails', icon: FileText },
  { title: 'Policy Management', url: '/compliance/policies', icon: FileText },
  { title: 'Risk Management', url: '/compliance/risk-management', icon: Shield },
  { title: 'Governance Framework', url: '/compliance/governance', icon: Shield },
  { title: 'Compliance Reporting', url: '/compliance/reporting', icon: FileText },
  { title: 'Legal Documents', url: '/compliance/legal-docs', icon: FileText },
  { title: 'Documentation', url: '/compliance/documentation', icon: FileText },
  { title: 'Evidence Management', url: '/compliance/evidence', icon: FileText },
  { title: 'ESG-HR', url: '/esg-hr', icon: Shield },
];

const analyticsItems = [
  { title: 'Analytics Home', url: '/analytics', icon: BarChart3 },
  { title: 'Workforce Analytics', url: '/analytics/workforce', icon: BarChart3 },
  { title: 'Predictive Modeling', url: '/analytics/predictive', icon: TrendingUp },
  { title: 'Realtime Analytics', url: '/analytics/realtime', icon: Activity },
  { title: 'KPI Analytics', url: '/analytics/kpi', icon: BarChart3 },
  { title: 'Executive Analytics', url: '/analytics/executive', icon: BarChart3 },
  { title: 'Cost Analytics', url: '/analytics/cost', icon: Calculator },
  { title: 'Compliance Reporting', url: '/analytics/compliance', icon: FileText },
  { title: 'Performance Analytics', url: '/analytics/performance', icon: TrendingUp },
  { title: 'Turnover Analysis', url: '/analytics/turnover', icon: TrendingUp },
  { title: 'Benchmarking', url: '/analytics/benchmarking', icon: BarChart3 },
  { title: 'Custom Reporting', url: '/analytics/custom', icon: FileText },
  { title: 'Data Visualization', url: '/analytics/visualization', icon: BarChart3 },
  { title: 'Report Builder', url: '/reports/builder', icon: FileText },
];

const payrollItems = [
  { title: 'Payroll Home', url: '/payroll', icon: DollarSign },
  { title: 'WPS Processing', url: '/payroll/wps', icon: DollarSign },
  { title: 'GOSI Integration', url: '/payroll/gosi', icon: Shield },
  { title: 'EOSB Calculations', url: '/payroll/eosb', icon: Calculator },
  { title: 'Expenses', url: '/payroll/expenses', icon: DollarSign },
  { title: 'Payroll Analytics', url: '/payroll/analytics', icon: BarChart3 },
  { title: 'Bank Integration', url: '/payroll/banking', icon: DollarSign },
  { title: 'Budget Forecasting', url: '/payroll/budgeting', icon: Calculator },
];

const welfareItems = [
  { title: 'Compliance Dashboard', url: '/welfare-safety/compliance-dashboard', icon: Shield },
  { title: 'Grievance Reporting', url: '/welfare-safety/grievance-reporting', icon: FileText },
  { title: 'Food/Housing/Transport', url: '/welfare-safety/food-housing-transport', icon: Building2 },
  { title: 'Wellbeing Tracker', url: '/welfare-safety/wellbeing-tracker', icon: Activity },
  { title: 'Ethics Score', url: '/welfare-safety/ethics-score', icon: Target },
  { title: 'AI Diagnosis', url: '/welfare-safety/ai-diagnosis', icon: Brain },
  { title: 'Compliance Framework', url: '/welfare-safety/compliance-framework', icon: Shield },
  { title: 'Multi-View Dashboards', url: '/welfare-safety/multi-view-dashboards', icon: BarChart3 },
];

const diagnosticItems = [
  { title: 'Corporate Culture Intelligence (CCI)', url: '/cci/overview', icon: Brain },
  { title: 'CCI Survey Links & Tokens', url: '/cci/admin/links', icon: Link },
  { title: 'Retention Strategy', url: '/diagnostic/retention-strategy', icon: Target },
  { title: 'HR Process Improvement', url: '/diagnostic/hr-process-improvement', icon: Layers },
  { title: 'HR Role Optimization', url: '/diagnostic/hr-role-optimization', icon: Users },
  { title: 'HR Value Chain', url: '/diagnostic/hr-value-chain', icon: Layers },
  { title: 'Org Structure Assessment', url: '/diagnostic/org-structure-assessment', icon: Building2 },
  { title: 'OSI v1', url: '/diagnostic/org-structure-intelligence', icon: Building2 },
  { title: 'Culture Change Tracker', url: '/diagnostic/culture-change', icon: Activity },
  { title: 'IPO Readiness', url: '/diagnostic/ipo-readiness', icon: FileText },
];

const localContentItems = [
  { title: 'Workforce Localization', url: '/local-content/workforce-localization', icon: Users },
  { title: 'Supplier Development', url: '/local-content/supplier-development', icon: Users },
  { title: 'Investment Tracking', url: '/local-content/investment-tracking', icon: DollarSign },
  { title: 'AI Intelligence', url: '/local-content/ai-intelligence', icon: Brain },
  { title: 'Regulatory Compliance', url: '/local-content/regulatory-compliance', icon: Shield },
  { title: 'Strategic Planning', url: '/local-content/strategic-planning', icon: Target },
];

const platformFeatureItems = [
  { title: 'Language Toggle', url: '/platform/language-toggle', icon: FileText },
  { title: 'Mobile App', url: '/platform/mobile-app', icon: Users },
  { title: 'Security Framework', url: '/platform/security-framework', icon: Shield },
  { title: 'API Gateway', url: '/platform/api-gateway', icon: Layers },
];

const leoGeoItems = [
  { title: 'Learning Experience Optimization (LEO)', url: '/leo', icon: GraduationCap },
  { title: 'Generative Engagement Optimization (GEO)', url: '/geo', icon: Activity },
];

const toolsItems = [
  { title: 'Tools Home', url: '/tools', icon: Layers },
  { title: 'Smart KPI Tool', url: '/tools/smart-kpi', icon: BarChart3 },
  { title: 'Smart KPI (Alt)', url: '/additional/smart-kpi', icon: BarChart3 },
  { title: 'AqlHR Connect', url: '/tools/aqlhr-connect', icon: Users },
  { title: 'Processes & Forms', url: '/processes-forms', icon: FileText },
  { title: 'Legal Consultant', url: '/legal-consultant', icon: FileText },
  { title: 'NRC Management', url: '/nrc-management', icon: Layers },
  { title: 'ISO Management', url: '/iso-management', icon: Layers },
  { title: 'Help & Support', url: '/help', icon: FileText },
];

export const SuperAdminSidebar: React.FC = () => {
  const { open } = useSidebar();
  const location = useLocation();
const [coreHRExpanded, setCoreHRExpanded] = useState(true);
  const [aiExpanded, setAiExpanded] = useState(true);
  const [govExpanded, setGovExpanded] = useState(false);
  const [complianceExpanded, setComplianceExpanded] = useState(false);
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false);
  const [payrollExpanded, setPayrollExpanded] = useState(false);
  const [welfareExpanded, setWelfareExpanded] = useState(false);
  const [diagnosticExpanded, setDiagnosticExpanded] = useState(false);
  const [localExpanded, setLocalExpanded] = useState(false);
  const [platformExpanded, setPlatformExpanded] = useState(false);
  const [leoGeoExpanded, setLeoGeoExpanded] = useState(false);
  const [toolsExpanded, setToolsExpanded] = useState(true);

  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (paths: string[]) => paths.some(path => location.pathname.startsWith(path));

  return (
    <Sidebar className={open ? "w-80" : "w-14"}>
      <SidebarContent>
        {/* Platform Header */}
        {open && (
          <div className="p-4 border-b">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/70 rounded-lg"></div>
              <div>
                <h3 className="font-semibold text-foreground">AqlHR</h3>
                <p className="text-xs text-muted-foreground">Smart HR Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Circle className="h-2 w-2 fill-green-500 text-green-500" />
              <span className="text-muted-foreground">All systems operational</span>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground">Platform Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted/50 text-foreground"
                    }
                  >
                    <LayoutDashboard className="h-4 w-4 text-foreground" />
                    {open && (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-foreground">Dashboard</span>
                        <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                          1
                        </Badge>
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Diagnostic Framework */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setDiagnosticExpanded(!diagnosticExpanded)}
                  className={`hover:bg-muted/50 text-foreground ${isGroupActive(diagnosticItems.map(i => i.url)) ? 'bg-muted text-foreground font-medium' : ''}`}
                >
                  <Activity className="h-4 w-4" />
                  {open && (
                    <div className="flex items-center justify-between w-full">
                      <span>Diagnostic Framework</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-5 w-6 p-0 flex items-center justify-center text-xs">
                          {diagnosticItems.length}
                        </Badge>
                        {diagnosticExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  )}
                </SidebarMenuButton>

                {/* Diagnostic Framework Sub-items */}
                {open && diagnosticExpanded && (
                  <SidebarMenuSub>
                    {diagnosticItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink
                            to={item.url}
                            className={({ isActive }) =>
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted/30 text-foreground"
                            }
                          >
                            <item.icon className="h-3 w-3" />
                            <span className="text-sm">{item.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Executive Intelligence Center */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/executive-center"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted/50 text-foreground"
                    }
                  >
                    <Crown className="h-4 w-4 text-foreground" />
                    {open && (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-foreground">AqlHR Executive Intelligence Center</span>
                        <Badge className="bg-yellow-600 hover:bg-yellow-600 text-xs px-2 py-0">
                          PREMIUM
                        </Badge>
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Core HR - Expandable */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setCoreHRExpanded(!coreHRExpanded)}
                  className={`hover:bg-muted/50 ${isGroupActive(coreHRItems.map(i => i.url)) ? 'bg-muted text-foreground font-medium' : ''}`}
                >
                  <Users className="h-4 w-4" />
                  {open && (
                    <div className="flex items-center justify-between w-full">
                      <span>Core HR</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-5 w-6 p-0 flex items-center justify-center text-xs">
                          {coreHRItems.length}
                        </Badge>
                        {coreHRExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  )}
                </SidebarMenuButton>

                {/* Core HR Sub-items */}
                {open && coreHRExpanded && (
                  <SidebarMenuSub>
                    {coreHRItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink
                            to={item.url}
                            className={({ isActive }) =>
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted/30"
                            }
                          >
                            <item.icon className="h-3 w-3" />
                            <span className="text-sm">{item.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* AI Intelligence Platform */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setAiExpanded(!aiExpanded)}
                  className={`hover:bg-muted/50 ${isGroupActive(aiPlatformItems.map(i => i.url)) ? 'bg-muted text-foreground font-medium' : ''}`}
                >
                  <Brain className="h-4 w-4" />
                  {open && (
                    <div className="flex items-center justify-between w-full">
                      <span>AI Intelligence Platform</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-5 px-1 p-0 flex items-center justify-center text-xs">
                          {aiPlatformItems.length}
                        </Badge>
                        {aiExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  )}
                </SidebarMenuButton>
                {open && aiExpanded && (
                  <SidebarMenuSub>
                    {aiPlatformItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink to={item.url} className={({ isActive }) => isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/30"}>
                            <item.icon className="h-3 w-3" />
                            <span className="text-sm">{item.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Government Integration */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setGovExpanded(!govExpanded)}
                  className={`hover:bg-muted/50 ${isGroupActive(governmentItems.map(i => i.url)) ? 'bg-muted text-foreground font-medium' : ''}`}
                >
                  <Building2 className="h-4 w-4" />
                  {open && (
                    <div className="flex items-center justify-between w-full">
                      <span>Government Integration</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-5 px-1 p-0 flex items-center justify-center text-xs">
                          {governmentItems.length}
                        </Badge>
                        {govExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  )}
                </SidebarMenuButton>
                {open && govExpanded && (
                  <SidebarMenuSub>
                    {governmentItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink to={item.url} className={({ isActive }) => isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/30"}>
                            <item.icon className="h-3 w-3" />
                            <span className="text-sm">{item.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Compliance & ESG */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setComplianceExpanded(!complianceExpanded)}
                  className={`hover:bg-muted/50 ${isGroupActive(complianceItems.map(i => i.url)) ? 'bg-muted text-foreground font-medium' : ''}`}
                >
                  <Shield className="h-4 w-4" />
                  {open && (
                    <div className="flex items-center justify-between w-full">
                      <span>Compliance & ESG</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-5 px-1 p-0 flex items-center justify-center text-xs">
                          {complianceItems.length}
                        </Badge>
                        {complianceExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  )}
                </SidebarMenuButton>
                {open && complianceExpanded && (
                  <SidebarMenuSub>
                    {complianceItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink to={item.url} className={({ isActive }) => isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/30"}>
                            <item.icon className="h-3 w-3" />
                            <span className="text-sm">{item.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Analytics & Reports */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setAnalyticsExpanded(!analyticsExpanded)}
                  className={`hover:bg-muted/50 ${isGroupActive(analyticsItems.map(i => i.url)) ? 'bg-muted text-foreground font-medium' : ''}`}
                >
                  <BarChart3 className="h-4 w-4" />
                  {open && (
                    <div className="flex items-center justify-between w-full">
                      <span>Analytics & Reports</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-5 px-1 p-0 flex items-center justify-center text-xs">
                          {analyticsItems.length}
                        </Badge>
                        {analyticsExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  )}
                </SidebarMenuButton>
                {open && analyticsExpanded && (
                  <SidebarMenuSub>
                    {analyticsItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink to={item.url} className={({ isActive }) => isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/30"}>
                            <item.icon className="h-3 w-3" />
                            <span className="text-sm">{item.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Payroll */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setPayrollExpanded(!payrollExpanded)}
                  className={`hover:bg-muted/50 ${isGroupActive(payrollItems.map(i => i.url)) ? 'bg-muted text-foreground font-medium' : ''}`}
                >
                  <DollarSign className="h-4 w-4" />
                  {open && (
                    <div className="flex items-center justify-between w-full">
                      <span>Payroll</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-5 px-1 p-0 flex items-center justify-center text-xs">
                          {payrollItems.length}
                        </Badge>
                        {payrollExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  )}
                </SidebarMenuButton>
                {open && payrollExpanded && (
                  <SidebarMenuSub>
                    {payrollItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink to={item.url} className={({ isActive }) => isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/30"}>
                            <item.icon className="h-3 w-3" />
                            <span className="text-sm">{item.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Welfare & Safety */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setWelfareExpanded(!welfareExpanded)}
                  className={`hover:bg-muted/50 ${isGroupActive(welfareItems.map(i => i.url)) ? 'bg-muted text-foreground font-medium' : ''}`}
                >
                  <Shield className="h-4 w-4" />
                  {open && (
                    <div className="flex items-center justify-between w-full">
                      <span>Welfare & Safety</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-5 px-1 p-0 flex items-center justify-center text-xs">
                          {welfareItems.length}
                        </Badge>
                        {welfareExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  )}
                </SidebarMenuButton>
                {open && welfareExpanded && (
                  <SidebarMenuSub>
                    {welfareItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink to={item.url} className={({ isActive }) => isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/30"}>
                            <item.icon className="h-3 w-3" />
                            <span className="text-sm">{item.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>


              {/* Local Content Compliance */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setLocalExpanded(!localExpanded)}
                  className={`hover:bg-muted/50 ${isGroupActive(localContentItems.map(i => i.url)) ? 'bg-muted text-foreground font-medium' : ''}`}
                >
                  <Users className="h-4 w-4" />
                  {open && (
                    <div className="flex items-center justify-between w-full">
                      <span>Local Content Compliance</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-5 px-1 p-0 flex items-center justify-center text-xs">
                          {localContentItems.length}
                        </Badge>
                        {localExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  )}
                </SidebarMenuButton>
                {open && localExpanded && (
                  <SidebarMenuSub>
                    {localContentItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink to={item.url} className={({ isActive }) => isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/30"}>
                            <item.icon className="h-3 w-3" />
                            <span className="text-sm">{item.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Platform Features */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setPlatformExpanded(!platformExpanded)}
                  className={`hover:bg-muted/50 ${isGroupActive(platformFeatureItems.map(i => i.url)) ? 'bg-muted text-foreground font-medium' : ''}`}
                >
                  <FileText className="h-4 w-4" />
                  {open && (
                    <div className="flex items-center justify-between w-full">
                      <span>Platform Features</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-5 px-1 p-0 flex items-center justify-center text-xs">
                          {platformFeatureItems.length}
                        </Badge>
                        {platformExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  )}
                </SidebarMenuButton>
                {open && platformExpanded && (
                  <SidebarMenuSub>
                    {platformFeatureItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink to={item.url} className={({ isActive }) => isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/30"}>
                            <item.icon className="h-3 w-3" />
                            <span className="text-sm">{item.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* LEO & GEO */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setLeoGeoExpanded(!leoGeoExpanded)}
                  className={`hover:bg-muted/50 ${isGroupActive(leoGeoItems.map(i => i.url)) ? 'bg-muted text-foreground font-medium' : ''}`}
                >
                  <GraduationCap className="h-4 w-4" />
                  {open && (
                    <div className="flex items-center justify-between w-full">
                      <span>LEO & GEO</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-5 px-1 p-0 flex items-center justify-center text-xs">
                          {leoGeoItems.length}
                        </Badge>
                        {leoGeoExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  )}
                </SidebarMenuButton>
                {open && leoGeoExpanded && (
                  <SidebarMenuSub>
                    {leoGeoItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink to={item.url} className={({ isActive }) => isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/30"}>
                            <item.icon className="h-3 w-3" />
                            <span className="text-sm">{item.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Tools & Integrations */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setToolsExpanded(!toolsExpanded)}
                  className={`hover:bg-muted/50 ${isGroupActive(toolsItems.map(i => i.url)) ? 'bg-muted text-foreground font-medium' : ''}`}
                >
                  <Layers className="h-4 w-4" />
                  {open && (
                    <div className="flex items-center justify-between w-full">
                      <span>Advanced Tools & Integrations</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="h-5 px-1 p-0 flex items-center justify-center text-xs">
                          {toolsItems.length}
                        </Badge>
                        {toolsExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  )}
                </SidebarMenuButton>
                {open && toolsExpanded && (
                  <SidebarMenuSub>
                    {toolsItems.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink to={item.url} className={({ isActive }) => isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/30"}>
                            <item.icon className="h-3 w-3" />
                            <span className="text-sm">{item.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Skills Intelligence */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/skills-intelligence"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted/50"
                    }
                  >
                    <Brain className="h-4 w-4" />
                    {open && (
                      <div className="flex items-center justify-between w-full">
                        <span>Skills Intelligence</span>
                        <Badge className="bg-green-600 hover:bg-green-600 text-xs px-2 py-0">
                          NEW
                        </Badge>
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};