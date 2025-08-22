import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OSIOverview } from "@/components/diagnostic/OSIOverview";
import ModuleDiagnosticPanel from "@/components/universal/ModuleDiagnosticPanel";
import { AqlHRAIAssistant } from "@/components/ai";
import { useEntitlement } from "@/hooks/useEntitlement";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Settings,
  Crown,
  Lock
} from "lucide-react";

const OrgStructureIntelligence = () => {
  const [currentCase, setCurrentCase] = useState<string | null>(null);
  const { hasEntitlement, isLoading: entitlementLoading } = useEntitlement('SKU_OSI');
  const { toast } = useToast();

  useEffect(() => {
    createOrGetCase();
  }, []);

  const createOrGetCase = async () => {
    try {
      // Get current user's company ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: userRole } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      if (!userRole?.company_id) throw new Error('No company found for user');

      // Check for existing OSI case
      const { data: existingCases, error: fetchError } = await supabase
        .from('dx_cases')
        .select('id')
        .eq('module', 'osi')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      if (existingCases && existingCases.length > 0) {
        setCurrentCase(existingCases[0].id);
        return;
      }

      // Create new OSI case
      const { data: newCase, error: createError } = await supabase
        .from('dx_cases')
        .insert({
          tenant_id: userRole.company_id,
          module: 'osi',
          name: 'Organization Structure Analysis',
          status: 'active',
          baseline_date: new Date().toISOString().split('T')[0]
        })
        .select('id')
        .single();

      if (createError) throw createError;
      setCurrentCase(newCase.id);

    } catch (error) {
      console.error('Error managing OSI case:', error);
      toast({
        title: "Setup Error",
        description: "Failed to initialize OSI analysis case",
        variant: "destructive"
      });
    }
  };

  if (entitlementLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!hasEntitlement) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">OSI Access Required</h1>
          <p className="text-muted-foreground mb-6">
            Organization Structure Intelligence requires enterprise plan access
          </p>
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                Upgrade to Enterprise
              </CardTitle>
              <CardDescription>
                Unlock advanced organizational analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-left">
                <li>• Advanced span of control analysis</li>
                <li>• Cost-to-manage optimization</li>
                <li>• AI-powered organizational recommendations</li>
                <li>• Compliance monitoring</li>
                <li>• Executive-ready reports</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentCase) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse text-center">
          <Building2 className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p>Setting up OSI analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          Organization Structure Intelligence
        </h1>
        <p className="text-muted-foreground">
          Advanced organizational design and effectiveness analysis
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="spans" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Spans & Layers
          </TabsTrigger>
          <TabsTrigger value="costs" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Cost Analysis
          </TabsTrigger>
          <TabsTrigger value="playbook" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Playbook
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Diagnostics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OSIOverview caseId={currentCase} />
        </TabsContent>

        <TabsContent value="spans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spans & Layers Analysis</CardTitle>
              <CardDescription>
                Management structure and reporting hierarchy analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Coming soon: Interactive span and layer visualization
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost-to-Manage Analysis</CardTitle>
              <CardDescription>
                Organizational cost efficiency and optimization opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Coming soon: Cost analysis dashboard
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playbook" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>OSI Playbook</CardTitle>
              <CardDescription>
                AI-generated recommendations and action plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Coming soon: Interactive playbook with task creation
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostics" className="space-y-6">
          <ModuleDiagnosticPanel
            moduleKey="osi"
            contextData={{ case_id: currentCase }}
            autoRefresh={true}
            refreshInterval={300000} // 5 minutes
          />
        </TabsContent>
      </Tabs>

      <AqlHRAIAssistant moduleContext="diagnostic.orgStructureIntelligence" />
    </div>
  );
};

export default OrgStructureIntelligence;