import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Download, 
  Play, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  FileText,
  Plus
} from 'lucide-react';
import { useComplianceAutopilot } from '@/hooks/useComplianceAutopilot';
import { useComplianceSettings } from '@/hooks/useComplianceSettings';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface SaudizationStatus {
  color: string;
  rate: number;
}

interface ComplianceRun {
  id: string;
  tenant_id: string;
  run_date: string;
  iqama_tasks: number;
  saudization_tasks: number;
  total_employees_checked: number;
  status: string;
  metadata: any;
  created_at: string;
  error?: string;
  ran_at?: string;
  stats?: any;
}

export default function ComplianceAutopilot() {
  const [saudizationStatus, setSaudizationStatus] = useState<SaudizationStatus | null>(null);
  const [complianceRuns, setComplianceRuns] = useState<ComplianceRun[]>([]);
  const [upcomingExpiries, setUpcomingExpiries] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { settings, loading: settingsLoading, updateSettings } = useComplianceSettings();
  const { toast } = useToast();

  // Fetch Saudization status
  const fetchSaudizationStatus = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      if (!userRoles?.company_id) return;

      const { data } = await supabase.rpc('saudization_color_v1', {
        p_tenant: userRoles.company_id
      });

      if (data && data.length > 0) {
        setSaudizationStatus(data[0]);
      }
    } catch (error) {
      console.error('Error fetching Saudization status:', error);
    }
  };

  // Fetch upcoming expiries
  const fetchUpcomingExpiries = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      if (!userRoles?.company_id) return;

      // Get employees with expiring Iqamas in next 90 days
      const ninetyDaysFromNow = new Date();
      ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

      const { data: employees } = await supabase
        .from('hr_employees')
        .select(`
          id, employee_no, full_name_en, full_name_ar, iqama_expiry,
          dept_id, employment_status
        `)
        .eq('company_id', userRoles.company_id)
        .eq('is_saudi', false)
        .eq('employment_status', 'active')
        .not('iqama_expiry', 'is', null)
        .gte('iqama_expiry', new Date().toISOString().split('T')[0])
        .lte('iqama_expiry', ninetyDaysFromNow.toISOString().split('T')[0])
        .order('iqama_expiry', { ascending: true });

      if (employees) {
        // Check for existing tasks and letters
        const enrichedEmployees = await Promise.all(
          employees.map(async (emp) => {
            // Check for compliance tasks
            const { data: tasks } = await supabase
              .from('tasks')
              .select('id, status')
              .eq('tenant_id', userRoles.company_id)
              .eq('module', 'compliance')
              .contains('metadata', { employee_id: emp.id });

            // Check for compliance letters
            const { data: letters } = await supabase
              .from('compliance_letters')
              .select('id, lang, storage_path')
              .eq('tenant_id', userRoles.company_id)
              .eq('employee_id', emp.id);

            const daysUntilExpiry = Math.ceil(
              (new Date(emp.iqama_expiry).getTime() - new Date().getTime()) / 
              (1000 * 60 * 60 * 24)
            );

            return {
              ...emp,
              days_until_expiry: daysUntilExpiry,
              has_task: tasks && tasks.length > 0,
              task_status: tasks?.[0]?.status || null,
              letters_generated: letters?.length || 0,
              letter_paths: letters || []
            };
          })
        );

        setUpcomingExpiries(enrichedEmployees);
      }
    } catch (error) {
      console.error('Error fetching upcoming expiries:', error);
    }
  };

  // Fetch compliance runs history
  const fetchComplianceRuns = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      if (!userRoles?.company_id) return;

      const { data } = await supabase
        .from('compliance_runs')
        .select('*')
        .eq('tenant_id', userRoles.company_id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) {
        // Transform data to match interface - handle both old and new schema
        const transformedData = data.map((run: any) => ({
          id: run.id,
          tenant_id: run.tenant_id,
          run_date: run.run_date || run.ran_at,
          iqama_tasks: run.iqama_tasks || 0,
          saudization_tasks: run.saudization_tasks || 0,
          total_employees_checked: run.total_employees_checked || 0,
          status: run.status,
          metadata: run.metadata || run.stats || {},
          created_at: run.created_at,
          error: run.error
        }));
        
        setComplianceRuns(transformedData);
      }
    } catch (error) {
      console.error('Error fetching compliance runs:', error);
    }
  };

  // Run compliance autopilot
  const runCompliance = async (dryRun = false) => {
    try {
      setIsRunning(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      if (!userRoles?.company_id) return;

      const { data, error } = await supabase.rpc('compliance_run_now_v1', {
        p_tenant: userRoles.company_id,
        p_dry: dryRun
      });

      if (error) {
        throw error;
      }

      toast({
        title: dryRun ? "تشغيل تجريبي مُجدول / Dry Run Scheduled" : "تم جدولة التشغيل / Run Scheduled",
        description: dryRun 
          ? "سيتم معاينة النتائج فقط / Preview results only"
          : "سيتم إنشاء المهام والرسائل / Tasks and letters will be created"
      });

      // Refresh data
      setTimeout(() => {
        fetchComplianceRuns();
        fetchUpcomingExpiries();
      }, 2000);

    } catch (error) {
      console.error('Error running compliance:', error);
      toast({
        title: "خطأ / Error",
        description: "فشل في تشغيل المطابقة / Failed to run compliance check",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Create task for employee
  const createTaskForEmployee = async (employeeId: string, employeeName: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      if (!userRoles?.company_id) return;

      // Check if task already exists
      const { data: existingTask } = await supabase
        .from('tasks')
        .select('id')
        .eq('tenant_id', userRoles.company_id)
        .eq('module', 'compliance')
        .contains('metadata', { employee_id: employeeId })
        .maybeSingle();

      if (existingTask) {
        toast({
          title: "المهمة موجودة / Task Exists",
          description: "توجد مهمة بالفعل لهذا الموظف / Task already exists for this employee"
        });
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          tenant_id: userRoles.company_id,
          module: 'compliance',
          title: `Iqama renewal – ${employeeName}`,
          description: `Manual compliance task created for employee ${employeeName}`,
          priority: 'high',
          owner_role: 'hr_manager',
          metadata: {
            source: 'manual_creation',
            employee_id: employeeId,
            created_from: 'compliance_autopilot_ui'
          }
        });

      if (error) throw error;

      toast({
        title: "تم إنشاء المهمة / Task Created",
        description: `تم إنشاء مهمة مطابقة لـ ${employeeName} / Compliance task created for ${employeeName}`
      });

      fetchUpcomingExpiries(); // Refresh data
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "خطأ / Error",
        description: "فشل في إنشاء المهمة / Failed to create task",
        variant: "destructive"
      });
    }
  };

  // Download letter
  const downloadLetter = async (letterPath: string, fileName: string) => {
    try {
      const { data } = await supabase.storage
        .from('compliance-letters')
        .createSignedUrl(letterPath, 3600); // 1 hour

      if (data?.signedUrl) {
        const a = document.createElement('a');
        a.href = data.signedUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading letter:', error);
      toast({
        title: "خطأ / Error",
        description: "فشل في تحميل الرسالة / Failed to download letter",
        variant: "destructive"
      });
    }
  };

  // Update settings
  const handleSettingsUpdate = async (newSettings: any) => {
    try {
      await updateSettings(newSettings);
      toast({
        title: "تم الحفظ / Settings Saved",
        description: "تم حفظ إعدادات المطابقة / Compliance settings saved"
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "خطأ / Error",
        description: "فشل في حفظ الإعدادات / Failed to save settings",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchSaudizationStatus();
    fetchUpcomingExpiries();
    fetchComplianceRuns();
  }, []);

  const getSaudizationBadgeColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityBadge = (daysUntilExpiry: number) => {
    if (daysUntilExpiry <= 7) return { label: 'عاجل / Urgent', color: 'bg-red-500' };
    if (daysUntilExpiry <= 30) return { label: 'عالي / High', color: 'bg-orange-500' };
    if (daysUntilExpiry <= 60) return { label: 'متوسط / Medium', color: 'bg-yellow-500' };
    return { label: 'منخفض / Low', color: 'bg-green-500' };
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir="auto">
      {/* Header with Saudization Status */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">مطابقة السعودة التلقائية / Compliance Autopilot</h1>
          <p className="text-muted-foreground">
            مراقبة آلية للسعودة وانتهاء صلاحيات الإقامة
            <br />
            Automated monitoring for Saudization and Iqama expiries
          </p>
        </div>
        
        {saudizationStatus && (
          <Card className="w-80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">حالة السعودة / Saudization Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${getSaudizationBadgeColor(saudizationStatus.color)} text-white`}>
                      {saudizationStatus.color.toUpperCase()}
                    </Badge>
                    <span className="text-2xl font-bold">{saudizationStatus.rate.toFixed(1)}%</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">النظرة العامة / Overview</TabsTrigger>
          <TabsTrigger value="expiries">انتهاء الإقامات / Expiries</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات / Settings</TabsTrigger>
          <TabsTrigger value="history">السجل / History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الإقامات المنتهية قريباً / Upcoming Expiries</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingExpiries.length}</div>
                <p className="text-xs text-muted-foreground">
                  في الـ 90 يوماً القادمة / In next 90 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المهام المكتملة / Completed Tasks</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {upcomingExpiries.filter(e => e.has_task && e.task_status === 'completed').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  من أصل {upcomingExpiries.filter(e => e.has_task).length} / of {upcomingExpiries.filter(e => e.has_task).length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الرسائل المُولدة / Generated Letters</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {upcomingExpiries.reduce((sum, e) => sum + e.letters_generated, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  رسائل عربية وإنجليزية / Arabic & English letters
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => runCompliance(false)}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'جارِ التشغيل... / Running...' : 'تشغيل الآن / Run Now'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => runCompliance(true)}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              تشغيل تجريبي / Dry Run
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="expiries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>انتهاء صلاحيات الإقامة - الـ 90 يوماً القادمة / Iqama Expiries - Next 90 Days</CardTitle>
              <CardDescription>
                قائمة الموظفين الذين تنتهي صلاحية إقامتهم قريباً
                <br />
                List of employees whose Iqama expires soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الموظف / Employee</TableHead>
                    <TableHead>رقم الموظف / Employee No.</TableHead>
                    <TableHead>تاريخ الانتهاء / Expiry Date</TableHead>
                    <TableHead>الأولوية / Priority</TableHead>
                    <TableHead>المهام / Tasks</TableHead>
                    <TableHead>الرسائل / Letters</TableHead>
                    <TableHead>الإجراءات / Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingExpiries.map((employee) => {
                    const priority = getPriorityBadge(employee.days_until_expiry);
                    return (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div dir="auto">
                            <div className="font-medium">{employee.full_name_en}</div>
                            <div className="text-sm text-muted-foreground font-arabic" dir="rtl">
                              {employee.full_name_ar}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.employee_no}</TableCell>
                        <TableCell>
                          <div dir="ltr">
                            {format(new Date(employee.iqama_expiry), 'yyyy-MM-dd')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ({employee.days_until_expiry} يوم / days)
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${priority.color} text-white`}>
                            {priority.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {employee.has_task ? (
                            <Badge variant={employee.task_status === 'completed' ? 'default' : 'secondary'}>
                              {employee.task_status === 'completed' ? 'مكتمل / Complete' : 'قيد التنفيذ / In Progress'}
                            </Badge>
                          ) : (
                            <Badge variant="outline">لا توجد / None</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {employee.letter_paths.map((letter: any, idx: number) => (
                              <Button
                                key={idx}
                                variant="outline" 
                                size="sm"
                                onClick={() => downloadLetter(letter.storage_path, `letter_${employee.employee_no}_${letter.lang}.pdf`)}
                                className="flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                                {letter.lang.toUpperCase()}
                              </Button>
                            ))}
                            {employee.letters_generated === 0 && (
                              <span className="text-sm text-muted-foreground">لا توجد / None</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {!employee.has_task && (
                            <Button
                              size="sm"
                              onClick={() => createTaskForEmployee(employee.id, employee.full_name_en)}
                              className="flex items-center gap-1"
                            >
                              <Plus className="h-3 w-3" />
                              إنشاء مهمة / Create Task
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات المطابقة / Compliance Settings
              </CardTitle>
              <CardDescription>
                تكوين عتبات التنبيهات وفترات التذكير
                <br />
                Configure alert thresholds and reminder periods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">عتبات السعودة / Saudization Thresholds</h3>
                      
                      <div className="space-y-2">
                        <Label>العتبة الخضراء / Green Threshold (%)</Label>
                        <Input
                          type="number"
                          value={settings.saudization_green_threshold}
                          onChange={(e) => handleSettingsUpdate({
                            saudization_green_threshold: parseFloat(e.target.value)
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>العتبة الصفراء / Yellow Threshold (%)</Label>
                        <Input
                          type="number"
                          value={settings.saudization_yellow_threshold}
                          onChange={(e) => handleSettingsUpdate({
                            saudization_yellow_threshold: parseFloat(e.target.value)
                          })}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">فترات التذكير / Reminder Periods</h3>
                      
                      <div className="space-y-2">
                        <Label>أيام التذكير بانتهاء الإقامة / Iqama Reminder Days</Label>
                        <Input
                          value={settings.iqama_reminders?.join(', ') || '60, 30, 7'}
                          onChange={(e) => {
                            const days = e.target.value.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d));
                            handleSettingsUpdate({ iqama_reminders: days });
                          }}
                          placeholder="60, 30, 7"
                        />
                        <p className="text-sm text-muted-foreground">
                          فصل بفواصل / Separate with commas
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">تذييل الرسائل / Letter Footers</h3>
                    
                    <div className="space-y-2">
                      <Label>التذييل الإنجليزي / English Footer</Label>
                      <Input
                        value={settings.letter_footer_en || ''}
                        onChange={(e) => handleSettingsUpdate({
                          letter_footer_en: e.target.value
                        })}
                        placeholder="This is an automated reminder from AqlHR system..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>التذييل العربي / Arabic Footer</Label>
                      <Input
                        value={settings.letter_footer_ar || ''}
                        onChange={(e) => handleSettingsUpdate({
                          letter_footer_ar: e.target.value
                        })}
                        placeholder="هذا تنبيه آلي من نظام AqlHR..."
                        dir="rtl"
                        className="font-arabic"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>سجل عمليات المطابقة / Compliance Run History</CardTitle>
              <CardDescription>
                آخر 10 عمليات تشغيل للمطابقة التلقائية
                <br />
                Last 10 compliance autopilot runs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ / Date</TableHead>
                    <TableHead>النوع / Type</TableHead>
                    <TableHead>المهام المُنشأة / Tasks Created</TableHead>
                    <TableHead>الموظفون المفحوصون / Employees Checked</TableHead>
                    <TableHead>الحالة / Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceRuns.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell>
                        <div dir="ltr">
                          {format(new Date(run.created_at), 'yyyy-MM-dd HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={run.status.includes('manual') ? 'default' : 'secondary'}>
                          {run.status.includes('manual') ? 'يدوي / Manual' : 'تلقائي / Automatic'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <span className="text-sm">
                            إقامة / Iqama: <strong>{run.iqama_tasks}</strong>
                          </span>
                          <span className="text-sm">
                            سعودة / Saudization: <strong>{run.saudization_tasks}</strong>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <strong>{run.total_employees_checked}</strong>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            run.status.includes('completed') ? 'default' :
                            run.status.includes('error') ? 'destructive' : 'secondary'
                          }
                        >
                          {run.status.includes('completed') ? 'مكتمل / Complete' :
                           run.status.includes('error') ? 'خطأ / Error' :
                           run.status.includes('requested') ? 'مُجدول / Scheduled' : run.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {complianceRuns.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        لا توجد عمليات تشغيل سابقة / No previous runs
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}