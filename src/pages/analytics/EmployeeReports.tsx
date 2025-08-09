import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlHRAIAssistant } from '@/components/ai';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmployeeReports } from "@/hooks/useEmployeeReports";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePerformantLocalization } from "@/hooks/usePerformantLocalization";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Filter, Plus, BarChart3, Users, TrendingUp, Building } from "lucide-react";
import { EnhancedFormSystem } from "@/components/enhanced/EnhancedFormSystem";

const EmployeeReports = () => {
  const { language } = useLanguage();
  const { directionClasses } = usePerformantLocalization();
  const { reports, loading, generateReport, deleteReport } = useEmployeeReports();
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const filterFields = [
    {
      name: 'department',
      label: language === 'ar' ? 'القسم' : 'Department',
      type: 'text' as const,
      placeholder: language === 'ar' ? 'أدخل اسم القسم' : 'Enter department name'
    },
    {
      name: 'status',
      label: language === 'ar' ? 'الحالة' : 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: language === 'ar' ? 'نشط' : 'Active' },
        { value: 'inactive', label: language === 'ar' ? 'غير نشط' : 'Inactive' },
        { value: 'terminated', label: language === 'ar' ? 'منتهي الخدمة' : 'Terminated' },
        { value: 'on_leave', label: language === 'ar' ? 'في إجازة' : 'On Leave' }
      ]
    },
    {
      name: 'is_saudi',
      label: language === 'ar' ? 'الجنسية السعودية' : 'Saudi Nationality',
      type: 'select' as const,
      options: [
        { value: 'true', label: language === 'ar' ? 'سعودي' : 'Saudi' },
        { value: 'false', label: language === 'ar' ? 'غير سعودي' : 'Non-Saudi' }
      ]
    },
    {
      name: 'gender',
      label: language === 'ar' ? 'الجنس' : 'Gender',
      type: 'select' as const,
      options: [
        { value: 'male', label: language === 'ar' ? 'ذكر' : 'Male' },
        { value: 'female', label: language === 'ar' ? 'أنثى' : 'Female' }
      ]
    },
    {
      name: 'job_level',
      label: language === 'ar' ? 'مستوى الوظيفة' : 'Job Level',
      type: 'select' as const,
      options: [
        { value: 'junior', label: language === 'ar' ? 'مبتدئ' : 'Junior' },
        { value: 'senior', label: language === 'ar' ? 'أول' : 'Senior' },
        { value: 'manager', label: language === 'ar' ? 'مدير' : 'Manager' },
        { value: 'director', label: language === 'ar' ? 'مدير عام' : 'Director' },
        { value: 'cxo', label: language === 'ar' ? 'مدير تنفيذي' : 'CXO' }
      ]
    }
  ];

  const handleGenerateReport = async (filterData: Record<string, any>) => {
    try {
      const reportName = `${language === 'ar' ? 'تقرير شامل للموظفين' : 'Comprehensive Employee Report'} - ${new Date().toLocaleDateString()}`;
      await generateReport(undefined, filterData, reportName);
      
      toast({
        title: language === 'ar' ? 'تم إنشاء التقرير' : 'Report Generated',
        description: language === 'ar' ? 'تم إنشاء التقرير بنجاح' : 'Report generated successfully',
      });
      
      setShowFilters(false);
    } catch (error) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل في إنشاء التقرير' : 'Failed to generate report',
        variant: 'destructive',
      });
    }
  };

  const StatCard = ({ title, value, icon: Icon, description }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );

  const ReportDetailsDialog = ({ report }: { report: any }) => {
    const stats = report.report_data.summary_statistics;
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={directionClasses.text}>{report.report_name}</DialogTitle>
            <DialogDescription className={directionClasses.text}>
              {language === 'ar' ? 'تقرير شامل لبيانات الموظفين' : 'Comprehensive employee data report'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">{language === 'ar' ? 'الملخص' : 'Summary'}</TabsTrigger>
              <TabsTrigger value="breakdown">{language === 'ar' ? 'التفصيل' : 'Breakdown'}</TabsTrigger>
              <TabsTrigger value="employees">{language === 'ar' ? 'الموظفون' : 'Employees'}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title={language === 'ar' ? 'إجمالي الموظفين' : 'Total Employees'}
                  value={stats.total_employees}
                  icon={Users}
                />
                <StatCard
                  title={language === 'ar' ? 'الموظفون النشطون' : 'Active Employees'}
                  value={stats.active_employees}
                  icon={TrendingUp}
                />
                <StatCard
                  title={language === 'ar' ? 'السعوديون' : 'Saudi Nationals'}
                  value={stats.saudi_nationals}
                  icon={Building}
                />
                <StatCard
                  title={language === 'ar' ? 'متوسط الخبرة' : 'Avg Experience'}
                  value={`${stats.average_experience} ${language === 'ar' ? 'سنة' : 'years'}`}
                  icon={BarChart3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className={directionClasses.text}>
                      {language === 'ar' ? 'التوزيع حسب الجنس' : 'Gender Distribution'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'ذكر' : 'Male'}</span>
                      <Badge variant="secondary">{stats.by_gender.male}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'أنثى' : 'Female'}</span>
                      <Badge variant="secondary">{stats.by_gender.female}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'غير محدد' : 'Not Specified'}</span>
                      <Badge variant="outline">{stats.by_gender.not_specified}</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className={directionClasses.text}>
                      {language === 'ar' ? 'نطاقات الراتب' : 'Salary Ranges'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'الحد الأدنى' : 'Minimum'}</span>
                      <Badge variant="secondary">{stats.salary_ranges.min_salary?.toLocaleString()} {language === 'ar' ? 'ريال' : 'SAR'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'المتوسط' : 'Average'}</span>
                      <Badge variant="secondary">{stats.salary_ranges.avg_salary?.toLocaleString()} {language === 'ar' ? 'ريال' : 'SAR'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'الحد الأقصى' : 'Maximum'}</span>
                      <Badge variant="secondary">{stats.salary_ranges.max_salary?.toLocaleString()} {language === 'ar' ? 'ريال' : 'SAR'}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="breakdown" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className={directionClasses.text}>
                      {language === 'ar' ? 'التوزيع حسب القسم' : 'Department Breakdown'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(stats.department_breakdown || {}).map(([dept, count]) => (
                        <div key={dept} className="flex justify-between">
                          <span>{dept}</span>
                          <Badge variant="outline">{count as number}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className={directionClasses.text}>
                      {language === 'ar' ? 'التوزيع حسب مستوى الوظيفة' : 'Job Level Breakdown'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(stats.job_level_breakdown || {}).map(([level, count]) => (
                        <div key={level} className="flex justify-between">
                          <span>{level}</span>
                          <Badge variant="outline">{count as number}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="employees">
              <Card>
                <CardHeader>
                  <CardTitle className={directionClasses.text}>
                    {language === 'ar' ? 'تفاصيل الموظفين' : 'Employee Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{language === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                          <TableHead>{language === 'ar' ? 'القسم' : 'Department'}</TableHead>
                          <TableHead>{language === 'ar' ? 'المنصب' : 'Position'}</TableHead>
                          <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.report_data.employee_details.slice(0, 50).map((employee: any) => (
                          <TableRow key={employee.id}>
                            <TableCell>{`${employee.first_name} ${employee.last_name}`}</TableCell>
                            <TableCell>{employee.department || '-'}</TableCell>
                            <TableCell>{employee.position || '-'}</TableCell>
                            <TableCell>
                              <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                                {employee.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {report.report_data.employee_details.length > 50 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {language === 'ar' ? 'عرض أول 50 موظف من' : 'Showing first 50 employees of'} {report.report_data.employee_details.length}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold ${directionClasses.text}`}>
            {language === 'ar' ? 'تقارير الموظفين' : 'Employee Reports'}
          </h1>
          <p className={`text-muted-foreground ${directionClasses.text}`}>
            {language === 'ar' ? 'إنشاء وإدارة التقارير الشاملة للموظفين' : 'Generate and manage comprehensive employee reports'}
          </p>
        </div>
        <Button 
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {language === 'ar' ? 'إنشاء تقرير جديد' : 'Generate New Report'}
        </Button>
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className={directionClasses.text}>
              {language === 'ar' ? 'إنشاء تقرير جديد' : 'Generate New Report'}
            </CardTitle>
            <CardDescription className={directionClasses.text}>
              {language === 'ar' ? 'اختر المرشحات لإنشاء تقرير مخصص' : 'Select filters to generate a custom report'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnhancedFormSystem
              title=""
              fields={filterFields}
              onSubmit={handleGenerateReport}
              submitText={language === 'ar' ? 'إنشاء التقرير' : 'Generate Report'}
              showProgress={false}
            />
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowFilters(false)}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className={directionClasses.text}>
            {language === 'ar' ? 'التقارير المحفوظة' : 'Saved Reports'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {language === 'ar' ? 'لا توجد تقارير محفوظة' : 'No saved reports'}
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className={`font-medium ${directionClasses.text}`}>{report.report_name}</h3>
                      <p className={`text-sm text-muted-foreground ${directionClasses.text}`}>
                        {language === 'ar' ? 'تم الإنشاء في' : 'Generated on'} {new Date(report.generated_at).toLocaleDateString()}
                      </p>
                      <p className={`text-xs text-muted-foreground ${directionClasses.text}`}>
                        {report.report_data.report_metadata.total_records} {language === 'ar' ? 'موظف' : 'employees'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ReportDetailsDialog report={report} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteReport(report.id)}
                    >
                      {language === 'ar' ? 'حذف' : 'Delete'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AqlHRAIAssistant 
        moduleContext="analytics.employee-reports" 
        companyId="demo-company"
      />
    </div>
  );
};

export default EmployeeReports;