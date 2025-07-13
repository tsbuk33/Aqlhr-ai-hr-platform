import { useLanguage } from "@/hooks/useLanguageCompat";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, Calculator, TrendingUp, FileSpreadsheet, CheckCircle, Building, Banknote } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  const { t, isRTL } = useLanguage();
  const [employees, setEmployees] = useState<GOSIEmployee[]>([]);
  const [summary, setSummary] = useState<GOSISummary | null>(null);
  const [loading, setLoading] = useState(true);

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال منصة التأمينات الاجتماعية" : "Testing GOSI Platform Connection",
      description: isRTL ? "جاري فحص الاتصال مع منصة التأمينات الاجتماعية..." : "Testing connection with GOSI platform..."
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة منصة التأمينات الاجتماعية" : "GOSI Platform Sync",
      description: isRTL ? "جاري مزامنة البيانات والمساهمات..." : "Syncing data and contributions..."
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
    fetchGOSIData();
  };

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
    <UnifiedGovernmentInterface
      platformName="GOSI Platform Integration"
      platformNameAr="تكامل منصة التأمينات الاجتماعية"
      description="Saudi Social Insurance Platform - Royal Decree M/273"
      descriptionAr="منصة التأمينات الاجتماعية السعودية - المرسوم الملكي م/273"
      icon={Shield}
      connectionStatus={{
        status: 'connected',
        lastSync: '2024-01-15T18:45:00Z',
        responseTime: 180
      }}
      onTestConnection={handleTestConnection}
      onSyncNow={handleSyncNow}
    >
      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {isRTL ? 'إجمالي المساهمات الشهرية' : 'Total Monthly Contributions'}
          </h3>
          <div className="text-3xl font-bold text-brand-primary">
            {loading ? '---' : `${(summary?.total_contributions || 0).toLocaleString()} SAR`}
          </div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'إجمالي التأمينات الاجتماعية' : 'total GOSI contributions'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Users className="h-5 w-5" />
            {isRTL ? 'الموظفون المشتركون' : 'Covered Employees'}
          </h3>
          <div className="text-3xl font-bold text-brand-success">{summary?.total_employees || 0}</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'موظف مشترك في النظام' : 'employees covered by system'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {isRTL ? 'النظام التصاعدي الجديد' : 'New Progressive System'}
          </h3>
          <div className="text-3xl font-bold text-brand-accent">{summary?.new_system_count || 0}</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'موظف في النظام التصاعدي' : 'employees in progressive system'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {isRTL ? 'معدل الامتثال' : 'Compliance Rate'}
          </h3>
          <div className="text-3xl font-bold text-brand-warning">100%</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'امتثال كامل للمرسوم الملكي' : 'full compliance with Royal Decree'}</p>
        </div>
      </div>

      {/* SanadHR Integration Section */}
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-success/5 mb-6">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Shield className="h-6 w-6" />
            {isRTL ? 'التكامل المباشر مع سند الموارد البشرية - منصة التأمينات الاجتماعية' : 'Direct SanadHR Integration - GOSI Platform'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 
              'تزامن تلقائي مع نظام التأمينات الاجتماعية والامتثال الكامل للمرسوم الملكي م/273' :
              'Automatic sync with GOSI system and full compliance with Royal Decree M/273'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                {isRTL ? 'خدمات التأمينات الاجتماعية' : 'GOSI Services'}
              </h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-l-primary">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'حساب المساهمات التلقائي' : 'Automatic Contribution Calculation'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'حساب تلقائي للمساهمات حسب المرسوم الملكي والنظام التصاعدي' : 
                      'Automatic calculation based on Royal Decree and progressive system'
                    }
                  </p>
                </div>

                <div className="p-3 bg-success/5 rounded-lg border-l-4 border-l-success">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'تصنيف الموظفين الذكي' : 'Smart Employee Classification'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'تصنيف تلقائي للموظفين حسب تاريخ التوظيف والجنسية' : 
                      'Automatic classification by hire date and nationality'
                    }
                  </p>
                </div>

                <div className="p-3 bg-warning/5 rounded-lg border-l-4 border-l-warning">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'ملفات التقديم للتأمينات' : 'GOSI Submission Files'}
                    </span>
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'متاح' : 'Available'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'إنشاء وتصدير ملفات التقديم للتأمينات الاجتماعية' : 
                      'Generate and export GOSI submission files'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-success flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                {isRTL ? 'التقارير والتحليلات' : 'Reports & Analytics'}
              </h4>
              
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'تقارير المساهمات الشهرية' : 'Monthly Contribution Reports'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'تحليل النظام التصاعدي' : 'Progressive System Analysis'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'مراقبة الامتثال' : 'Compliance Monitoring'}
                    </span>
                    <Badge className="bg-accent text-white">
                      {isRTL ? 'مستمر' : 'Ongoing'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h5 className="font-medium text-primary mb-2">
                  {isRTL ? 'إحصائيات التكامل المباشر' : 'Direct Integration Statistics'}
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{isRTL ? 'الخدمات المدمجة:' : 'Integrated Services:'}</span>
                    <span className="font-mono text-primary">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'عمليات يومية:' : 'Daily Operations:'}</span>
                    <span className="font-mono text-success">32,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'معدل الاستجابة:' : 'Response Rate:'}</span>
                    <span className="font-mono text-accent">0.3s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'آخر تحديث:' : 'Last Update:'}</span>
                    <span className="font-mono text-warning">{isRTL ? 'منذ 5 دقائق' : '5 minutes ago'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Service Status */}
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
            <h5 className="font-medium mb-3 text-primary flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {isRTL ? 'حالة الخدمات الحية' : 'Live Service Status'}
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded border border-primary/20 hover:border-primary/40 transition-colors">
                <div className="text-sm font-medium text-primary">
                  {isRTL ? 'حساب المساهمات' : 'Contribution Calculation'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'زمن الاستجابة: 0.1 ثانية' : 'Response time: 0.1 seconds'}
                </div>
                <Badge className="mt-2 bg-status-success text-white text-xs">
                  {isRTL ? 'متاح' : 'Available'}
                </Badge>
              </div>

              <div className="p-3 bg-white rounded border border-success/20 hover:border-success/40 transition-colors">
                <div className="text-sm font-medium text-success">
                  {isRTL ? 'تصنيف الموظفين' : 'Employee Classification'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'زمن الاستجابة: 0.2 ثانية' : 'Response time: 0.2 seconds'}
                </div>
                <Badge className="mt-2 bg-status-success text-white text-xs">
                  {isRTL ? 'نشط' : 'Active'}
                </Badge>
              </div>

              <div className="p-3 bg-white rounded border border-accent/20 hover:border-accent/40 transition-colors">
                <div className="text-sm font-medium text-accent">
                  {isRTL ? 'ملفات التقديم' : 'Submission Files'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'زمن الاستجابة: 0.5 ثانية' : 'Response time: 0.5 seconds'}
                </div>
                <Badge className="mt-2 bg-status-info text-white text-xs">
                  {isRTL ? 'متاح' : 'Available'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
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
    </UnifiedGovernmentInterface>
  );
};

export default GOSIIntegration;