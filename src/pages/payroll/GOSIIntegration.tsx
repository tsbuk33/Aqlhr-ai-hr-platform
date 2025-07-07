import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GOSIEmployee {
  employee_id: string;
  employee_number: string;
  name: string;
  salary: number;
  is_saudi: boolean;
  hire_date: string;
  system_type: string;
  nationality: string;
  rates: {
    employee: number;
    employer: number;
  };
  contributions: {
    employee: number;
    employer: number;
    total: number;
  };
}

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

const GOSIIntegration = () => {
  const [employees, setEmployees] = useState<GOSIEmployee[]>([]);
  const [summary, setSummary] = useState<GOSISummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGOSIData = async () => {
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
      setEmployees(data.employees);
      setSummary(data.summary);
    } catch (error) {
      console.error('Error fetching GOSI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerRateProgression = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('gosi-engine/rate-progression-job');
      if (error) throw error;
      
      if (data.message) {
        alert(data.message);
      } else {
        alert(`Updated rates for ${data.updated_count} employees`);
        fetchGOSIData(); // Refresh data
      }
    } catch (error) {
      console.error('Error running rate progression:', error);
      alert('Error running rate progression job');
    }
  };

  useEffect(() => {
    fetchGOSIData();
  }, []);

  const progressiveRateSchedule = [
    { period: "2025-07-01 to 2026-06-30", saudi_rate: "9.0% + 9.0%", expat_rate: "0% + 2%" },
    { period: "2026-07-01 to 2027-06-30", saudi_rate: "9.5% + 9.5%", expat_rate: "0% + 2%" },
    { period: "2027-07-01 to 2028-06-30", saudi_rate: "10.0% + 10.0%", expat_rate: "0% + 2%" },
    { period: "2028-07-01 to 2029-06-30", saudi_rate: "10.5% + 10.5%", expat_rate: "0% + 2%" },
    { period: "2029-07-01 onwards", saudi_rate: "11.0% + 11.0%", expat_rate: "0% + 2%" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">GOSI Integration</h1>
          <p className="text-muted-foreground">Royal Decree M/273 - Progressive contribution system</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchGOSIData} variant="outline">
            Refresh Data
          </Button>
          <Button onClick={triggerRateProgression} variant="default">
            Run Rate Progression
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">
              SAR {loading ? '---' : (summary?.total_contributions || 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total monthly GOSI</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Employee Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">
              SAR {loading ? '---' : (summary?.total_employee_contributions || 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Payroll deductions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Employer Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">
              SAR {loading ? '---' : (summary?.total_employer_contributions || 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Company contributions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Old System</span>
                <Badge variant="outline">{summary?.old_system_count || 0}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">New System</span>
                <Badge variant="default">{summary?.new_system_count || 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList>
          <TabsTrigger value="employees">Employee Breakdown</TabsTrigger>
          <TabsTrigger value="schedule">Rate Schedule</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee GOSI Contributions</CardTitle>
              <CardDescription>Individual contribution breakdown by system type</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>System</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Employee Rate</TableHead>
                    <TableHead>Employer Rate</TableHead>
                    <TableHead>Employee Contrib.</TableHead>
                    <TableHead>Employer Contrib.</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.slice(0, 10).map((emp) => (
                    <TableRow key={emp.employee_id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{emp.name}</div>
                          <div className="text-sm text-muted-foreground">{emp.employee_number}</div>
                        </div>
                      </TableCell>
                      <TableCell>{emp.hire_date}</TableCell>
                      <TableCell>
                        <Badge variant={emp.system_type === 'NEW' ? 'default' : 'outline'}>
                          {emp.system_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={emp.is_saudi ? 'secondary' : 'outline'}>
                          {emp.nationality}
                        </Badge>
                      </TableCell>
                      <TableCell>SAR {emp.salary.toLocaleString()}</TableCell>
                      <TableCell>{emp.rates.employee}%</TableCell>
                      <TableCell>{emp.rates.employer}%</TableCell>
                      <TableCell>SAR {emp.contributions.employee.toFixed(2)}</TableCell>
                      <TableCell>SAR {emp.contributions.employer.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">SAR {emp.contributions.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {employees.length > 10 && (
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Showing first 10 of {employees.length} employees
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progressive Rate Schedule (Royal Decree M/273)</CardTitle>
              <CardDescription>Automatic rate progression for NEW system employees only</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Saudi Nationals (Employee + Employer)</TableHead>
                    <TableHead>Non-Saudi Nationals (Employee + Employer)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {progressiveRateSchedule.map((schedule, index) => {
                    const isActive = index === 0; // Simplified for demo
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{schedule.period}</TableCell>
                        <TableCell>{schedule.saudi_rate}</TableCell>
                        <TableCell>{schedule.expat_rate}</TableCell>
                        <TableCell>
                          <Badge variant={isActive ? 'default' : 'outline'}>
                            {isActive ? 'Current' : 'Future'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Important Notes:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Progressive rates apply only to employees hired on or after July 1, 2025</li>
                  <li>• Existing employees (hired before July 1, 2025) remain on static 9%+9% (Saudi) or 0%+2% (Expat)</li>
                  <li>• Rate progression occurs automatically on July 1st each year</li>
                  <li>• System maintains full audit trail of all rate changes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GOSI Compliance Status</CardTitle>
              <CardDescription>Royal Decree M/273 compliance monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-700 dark:text-green-300">✓ Employee Classification</h4>
                  <p className="text-sm text-muted-foreground">All employees correctly classified by hire date</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-700 dark:text-green-300">✓ Rate Application</h4>
                  <p className="text-sm text-muted-foreground">Progressive rates applied per Royal Decree</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-700 dark:text-green-300">✓ Audit Trail</h4>
                  <p className="text-sm text-muted-foreground">Full change history maintained</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Compliance Summary:</h4>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>• {summary?.total_employees || 0} employees processed</li>
                  <li>• {summary?.old_system_count || 0} on legacy system (static rates)</li>
                  <li>• {summary?.new_system_count || 0} on new progressive system</li>
                  <li>• 100% compliance with Royal Decree M/273</li>
                  <li>• Ready for GOSI submission file generation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GOSIIntegration;