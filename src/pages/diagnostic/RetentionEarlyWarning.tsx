import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Users, 
  TrendingDown, 
  FileText, 
  Calendar,
  Download,
  Play
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import REWOverview from "@/components/diagnostic/REWOverview";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

interface HighRiskManager {
  manager_id: string;
  manager_name: string;
  risk_factors: string[];
  team_size: number;
  risk_score: number;
}

const RetentionEarlyWarning = () => {
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);
  const [highRiskManagers, setHighRiskManagers] = useState<HighRiskManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingCase, setCreatingCase] = useState(false);
  const { toast } = useToast();
  
  // Feature gating for SKU_REW
  const { hasAccess, isLoading: accessLoading } = useFeatureAccess('rew');

  useEffect(() => {
    fetchOrCreateCase();
  }, []);

  const fetchOrCreateCase = async () => {
    try {
      setLoading(true);
      
      // Get user's company ID
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userRole) {
        toast({
          title: "Access Error",
          description: "Unable to determine your company access.",
          variant: "destructive",
        });
        return;
      }

      // Look for existing REW case
      const { data: existingCase } = await supabase
        .from('dx_cases')
        .select('id')
        .eq('tenant_id', userRole.company_id)
        .eq('module', 'rew')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingCase) {
        setCurrentCaseId(existingCase.id);
        await fetchHighRiskManagers(existingCase.id);
      } else {
        await createNewCase(userRole.company_id);
      }
    } catch (error) {
      console.error('Error fetching case:', error);
      toast({
        title: "Error",
        description: "Failed to load retention analysis data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewCase = async (tenantId: string) => {
    try {
      setCreatingCase(true);
      
      const { data: newCase, error } = await supabase
        .from('dx_cases')
        .insert({
          tenant_id: tenantId,
          module: 'rew',
          name: `REW Analysis - ${new Date().toLocaleDateString()}`,
          status: 'active',
          baseline_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentCaseId(newCase.id);
      toast({
        title: "Case Created",
        description: "New retention early warning case has been created.",
      });
    } catch (error) {
      console.error('Error creating case:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create new REW case.",
        variant: "destructive",
      });
    } finally {
      setCreatingCase(false);
    }
  };

  const fetchHighRiskManagers = async (caseId: string) => {
    try {
      const { data, error } = await supabase.rpc('rew_get_high_risk_managers_v1' as any, {
        p_case_id: caseId
      });

      if (error) {
        console.error('Error fetching high-risk managers:', error);
        return;
      }

      setHighRiskManagers((data as HighRiskManager[]) || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const exportREWReport = async () => {
    // Placeholder for export functionality
    toast({
      title: "Export Started",
      description: "REW executive report generation is in progress.",
    });
  };

  if (accessLoading || loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-4"></div>
          <div className="h-4 bg-muted rounded w-96 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Feature Not Available</h3>
          <p className="text-muted-foreground mb-6">
            Retention Early Warning (REW) analysis requires a premium subscription.
          </p>
          <Button variant="outline">Upgrade Plan</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Retention Early Warning</h1>
          <p className="text-muted-foreground">
            Proactive retention risk analysis and intervention planning
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportREWReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {currentCaseId ? (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="drivers">Risk Drivers</TabsTrigger>
            <TabsTrigger value="managers">High-Risk Managers</TabsTrigger>
            <TabsTrigger value="actions">Action Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <REWOverview caseId={currentCaseId} />
          </TabsContent>

          <TabsContent value="drivers">
            <Card>
              <CardHeader>
                <CardTitle>Risk Driver Deep Dive</CardTitle>
                <CardDescription>
                  Detailed analysis of factors contributing to retention risk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingDown className="mx-auto h-12 w-12 mb-4" />
                  <p>Risk driver analysis will be displayed here after running REW analysis.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="managers">
            <Card>
              <CardHeader>
                <CardTitle>High-Risk Managers</CardTitle>
                <CardDescription>
                  Managers with teams showing elevated retention risk indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                {highRiskManagers.length > 0 ? (
                  <div className="space-y-4">
                    {highRiskManagers.map((manager, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Users className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{manager.manager_name}</div>
                            <div className="text-sm text-muted-foreground">
                              Team Size: {manager.team_size} • Risk Score: {Math.round(manager.risk_score)}%
                            </div>
                            <div className="flex gap-1 mt-1">
                              {manager.risk_factors.map((factor, idx) => (
                                <Badge key={idx} variant="destructive">
                                  {factor.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="mx-auto h-12 w-12 mb-4" />
                    <p>No high-risk managers identified. Run REW analysis to populate this section.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>30/60/90 Day Action Plan</CardTitle>
                  <CardDescription>
                    Structured intervention timeline for retention improvement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        30 Days
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="p-2 border rounded">Immediate manager support</div>
                        <div className="p-2 border rounded">Contract renewal acceleration</div>
                        <div className="p-2 border rounded">Pulse survey deployment</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        60 Days
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="p-2 border rounded">Team restructuring</div>
                        <div className="p-2 border rounded">Training programs</div>
                        <div className="p-2 border rounded">Performance reviews</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        90 Days
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="p-2 border rounded">Compensation adjustments</div>
                        <div className="p-2 border rounded">Culture initiatives</div>
                        <div className="p-2 border rounded">Long-term retention strategy</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <Play className="h-4 w-4" />
                <AlertDescription>
                  Run REW analysis to generate a customized action plan with specific initiatives
                  based on your organization's risk profile.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active REW Case</h3>
          <p className="text-muted-foreground mb-6">
            Create a new retention early warning case to begin analysis.
          </p>
          <Button onClick={() => fetchOrCreateCase()} disabled={creatingCase}>
            {creatingCase ? 'Creating Case...' : 'Create New REW Case'}
          </Button>
        </div>
      )}
      
      {/* AI Integration for Retention Early Warning */}
      <UniversalAIIntegrator 
        pageType="diagnostic" 
        moduleName="retention-early-warning" 
        companyId="demo-company" 
        enabledFeatures={['retention-insights', 'predictive-analytics', 'early-warning-system', 'risk-assessment']}
      />
    </div>
  );
};

export default RetentionEarlyWarning;