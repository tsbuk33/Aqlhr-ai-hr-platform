import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter, Users, UserCheck, Award, AlertTriangle, Database } from 'lucide-react';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { useLocale, formatNumber } from '@/i18n/locale';
import { useEmployeesData } from '@/hooks/useEmployeesData';
import { UniversalDocumentManager } from '@/components/common/UniversalDocumentManager';
import { DocumentUploader } from '@/components/docs/DocumentUploader';
import DevModeGuard from '@/lib/dev/DevModeGuard';

const EmployeeMasterDataPage = () => {
  const { t, locale } = useLocale();
  const { 
    totalActive, 
    saudiActive, 
    nonSaudiActive, 
    saudizationPct, 
    list, 
    loading, 
    error 
  } = useEmployeesData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [nationalityFilter, setNationalityFilter] = useState<string>('all');

  if (loading) {
    return (
      <DevModeGuard>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DevModeGuard>
    );
  }

  if (error) {
    return (
      <DevModeGuard>
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {t('employees', 'error_loading_data') || 'Error Loading Data'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {error}
                  </p>
                </div>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                >
                  {t('employees', 'retry') || 'Retry'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DevModeGuard>
    );
  }

  const filteredEmployees = list.filter(emp => {
    const matchesSearch = !searchTerm || 
      emp.full_name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.full_name_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_no?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || emp.employment_status === statusFilter;
    const matchesNationality = nationalityFilter === 'all' || 
      (nationalityFilter === 'saudi' && emp.is_saudi) ||
      (nationalityFilter === 'non_saudi' && !emp.is_saudi);
    
    return matchesSearch && matchesStatus && matchesNationality;
  });

  return (
    <DevModeGuard>
      <div className={`container mx-auto p-6 space-y-6 max-w-7xl ${locale === 'ar' ? 'rtl' : 'ltr'}`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t('employees', 'title')}
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
            {t('employees', 'subtitle')}
          </p>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('employees', 'add_employee')}
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder={t('employees', 'search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm" 
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {t('common', 'search') || 'Search'}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {t('employees', 'filters')}
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Status Filters */}
          <div className="flex gap-2">
            <Badge 
              variant={statusFilter === 'all' ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setStatusFilter('all')}
            >
              {locale === 'ar' ? 'الكل' : 'All'}
            </Badge>
            <Badge 
              variant={statusFilter === 'active' ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setStatusFilter('active')}
            >
              {locale === 'ar' ? 'نشط' : 'Active'}
            </Badge>
            <Badge 
              variant={statusFilter === 'probation' ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setStatusFilter('probation')}
            >
              {locale === 'ar' ? 'تحت التجربة' : 'Probation'}
            </Badge>
            <Badge 
              variant={statusFilter === 'terminated' ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setStatusFilter('terminated')}
            >
              {locale === 'ar' ? 'منتهي الخدمة' : 'Terminated'}
            </Badge>
            <Badge 
              variant={statusFilter === 'resigned' ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setStatusFilter('resigned')}
            >
              {locale === 'ar' ? 'مستقيل' : 'Resigned'}
            </Badge>
          </div>

          {/* Nationality Filters */}
          <div className="flex gap-2 border-l pl-3 ml-3">
            <Badge 
              variant={nationalityFilter === 'all' ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setNationalityFilter('all')}
            >
              {locale === 'ar' ? 'جميع الجنسيات' : 'All Nationalities'}
            </Badge>
            <Badge 
              variant={nationalityFilter === 'saudi' ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setNationalityFilter('saudi')}
            >
              {t('employees', 'saudi')}
            </Badge>
            <Badge 
              variant={nationalityFilter === 'non_saudi' ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setNationalityFilter('non_saudi')}
            >
              {t('employees', 'non_saudi')}
            </Badge>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('employees', 'total_employees')}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(totalActive, locale)}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('employees', 'active_workforce')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('employees', 'active_contracts')}
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(totalActive, locale)}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('employees', 'currently_employed')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('employees', 'saudization_rate')}
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(saudizationPct, locale)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {t('employees', 'saudi_nationals')}
              </p>  
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('employees', 'compliance_score')}
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(96.8, locale)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {t('employees', 'pdpl_compliant')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Employee Directory */}
        <Card>
          <CardHeader>
            <CardTitle>{t('employees', 'employee_directory')}</CardTitle>
            <CardDescription>
              {t('employees', 'directory_description') || 'Manage detailed employee profiles'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredEmployees && filteredEmployees.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  {formatNumber(filteredEmployees.length, locale)} {locale === 'ar' ? 'موظف معروض' : 'employees shown'}
                </div>
                
                <div className="grid gap-4">
                  {filteredEmployees.slice(0, 10).map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {employee.full_name_en?.charAt(0) || employee.full_name_ar?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {locale === 'ar' && employee.full_name_ar 
                              ? employee.full_name_ar 
                              : employee.full_name_en || 'Unknown'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {locale === 'ar' ? 'رقم الموظف' : 'ID'}: {employee.employee_no || 'N/A'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {employee.hr_departments?.name_ar && locale === 'ar' 
                              ? employee.hr_departments.name_ar 
                              : employee.hr_departments?.name_en || 'No Department'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Badge variant={employee.is_saudi ? 'default' : 'secondary'}>
                          {employee.is_saudi ? t('employees', 'saudi') : t('employees', 'non_saudi')}
                        </Badge>
                        <Badge variant="outline">
                          {employee.employment_status === 'active' ? (locale === 'ar' ? 'نشط' : 'Active') :
                           employee.employment_status === 'probation' ? (locale === 'ar' ? 'تحت التجربة' : 'Probation') :
                           employee.employment_status || 'unknown'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredEmployees.length > 10 && (
                  <div className="text-center pt-4">
                    <Button variant="outline">
                      {locale === 'ar' ? 'تحميل المزيد' : 'Load More'} ({formatNumber(filteredEmployees.length - 10, locale)} {locale === 'ar' ? 'أكثر' : 'more'})
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' || nationalityFilter !== 'all'
                    ? (locale === 'ar' ? 'لا يوجد موظفون يطابقون المرشح' : 'No employees match the current filter')
                    : (locale === 'ar' ? 'لا يوجد موظفون حتى الآن' : 'No employees yet')
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Management - Employee Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {locale === 'ar' ? 'مستندات الموظفين' : 'Employee Documents'}
            </CardTitle>
            <CardDescription>
              {locale === 'ar' 
                ? 'رفع وإدارة مستندات الموظفين مع الامتثال للائحة حماية البيانات الشخصية'
                : 'Upload and manage employee documents with PDPL compliance'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUploader 
              module="employee"
              className="border-primary/10"
            />
          </CardContent>
        </Card>

        {/* Document Management */}
        <UniversalDocumentManager
          moduleName={t('employees', 'title')}
          description={t('employees', 'documents_description') || 'Upload employee resumes, contracts, certifications, and personal documents'}
          platform="employees"
          moduleType="hr"
          acceptedTypes={['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.xlsx']}
          maxFileSize={25 * 1024 * 1024}
          maxFiles={15}
        />
        
        {/* PDPL Notice */}
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {locale === 'ar' ? 'إشعار الخصوصية' : 'Privacy Notice'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('employees', 'pdpl_notice')}
                  {t('employees', 'privacy_notice')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Integration for Employee Master Data */}
      <UniversalAIIntegrator 
        pageType="core-hr" 
        moduleName="employee-master-data" 
        companyId="demo-company" 
        enabledFeatures={['employee-management', 'data-visualization', 'contextual-help']}
      />
    </DevModeGuard>
  );
};

export default EmployeeMasterDataPage;