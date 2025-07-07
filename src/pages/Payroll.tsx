import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GOSISummary {
  total_employees: number;
  old_system_count: number;
  new_system_count: number;
  saudi_count: number;
  expat_count: number;
  total_employee_contributions: number;
  total_employer_contributions: number;
  total_contributions: number;
}

const Payroll = () => {
  const [gosiSummary, setGOSISummary] = useState<GOSISummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGOSISummary = async () => {
    try {
      setLoading(true);
      
      // Get first company for demo
      const { data: companies } = await supabase
        .from('companies')
        .select('id')
        .limit(1);
      
      if (!companies?.length) return;

      const { data, error } = await supabase.functions.invoke('gosi-engine/preview', {
        body: { company_id: companies[0].id }
      });

      if (error) throw error;
      setGOSISummary(data.summary);
    } catch (error) {
      console.error('Error fetching GOSI summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGOSISummary();
  }, []);

  const oldSystemPercentage = gosiSummary ? 
    (gosiSummary.old_system_count / gosiSummary.total_employees) * 100 : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payroll & Financial</h1>
          <p className="text-muted-foreground">WPS payroll processing and GOSI management (Royal Decree M/273)</p>
        </div>
        <Button onClick={fetchGOSISummary} variant="outline">
          Refresh GOSI Data
        </Button>
      </div>
      
      {/* GOSI Royal Decree M/273 Summary */}
      <div className="bg-gradient-subtle p-6 rounded-lg border">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">GOSI Contribution System (Royal Decree M/273)</h2>
          <Badge variant="secondary">Effective July 1, 2025</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">System Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Old System</span>
                  <Badge variant="outline">{gosiSummary?.old_system_count || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">New System</span>
                  <Badge variant="default">{gosiSummary?.new_system_count || 0}</Badge>
                </div>
                <Progress value={oldSystemPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {oldSystemPercentage.toFixed(1)}% on old system
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Employee Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-primary">
                SAR {loading ? '---' : (gosiSummary?.total_employee_contributions || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Monthly deductions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Employer Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-success">
                SAR {loading ? '---' : (gosiSummary?.total_employer_contributions || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Company obligations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total GOSI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-accent">
                SAR {loading ? '---' : (gosiSummary?.total_contributions || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Combined monthly</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Traditional Payroll Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>December 2024 Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">SAR 456,000</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employees Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">{gosiSummary?.total_employees || 2847}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">
                {gosiSummary?.saudi_count || 0} Saudi
              </Badge>
              <Badge variant="secondary">
                {gosiSummary?.expat_count || 0} Expat
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GOSI Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">
              SAR {loading ? '45,600' : (gosiSummary?.total_contributions || 45600).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Royal Decree M/273 compliant</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">SAR 18,500</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>WPS Payroll Processing</CardTitle>
            <CardDescription>Automated salary calculations and bank file generation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">100% compliance status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>End of Service Benefits</CardTitle>
            <CardDescription>EOSB calculations and liability management</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total liability: SAR 2,340,000</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payroll;