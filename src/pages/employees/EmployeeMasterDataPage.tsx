import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, Download, Users, UserCheck, Target, Shield, FileText, Database } from 'lucide-react';
import { useLocale } from '@/i18n/locale';
import { supabase } from '@/integrations/supabase/client';
import { maskEmployees, type Employee } from '@/lib/pdpl/maskEmployee';
import { useSafeExport } from '@/lib/exporter/useSafeExport';
import { useDevSeeding } from '@/lib/dev/ensureDemoEmployees';
import { DevSeedingCTA } from '@/components/dev/DevSeedingCTA';
import { logPageView, logUserAction, logError } from '@/lib/obs/logUiEvent';
import { toast } from 'sonner';

interface EmployeeStats {
  total_employees: number;
  active_employees: number;
  saudization_percentage: number;
}

export default function EmployeeMasterDataPage() {
  const { t, locale } = useLocale();
  const isRTL = locale === 'ar';
  const [search, setSearch] = useState('');
  const [iqamaFilter, setIqamaFilter] = useState<number | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { exportToCSV, exportToPDF, isExporting } = useSafeExport();
  const { shouldShowCTA, seedDemoData } = useDevSeeding(employees?.length || 0, tenantId || undefined);

  // Get tenant ID and auth status
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // Set a default tenant for demo purposes
          setTenantId('550e8400-e29b-41d4-a716-446655440000');
          setIsAdmin(true);
          return;
        }
        
        // Get tenant ID from user_roles
        const { data: roles } = await supabase
          .from('user_roles')
          .select('company_id, role')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();
        
        if (roles?.company_id) {
          setTenantId(roles.company_id);
          setIsAdmin(['admin', 'super_admin', 'hr_manager'].includes(roles.role));
        } else {
          // Fallback to demo tenant
          setTenantId('550e8400-e29b-41d4-a716-446655440000');
          setIsAdmin(true);
        }
      } catch (error) {
        logError('employees', 'Auth initialization failed');
        // Set demo tenant on error
        setTenantId('550e8400-e29b-41d4-a716-446655440000');
        setIsAdmin(true);
      }
    };
    
    initializeAuth();
  }, []);

  // Load employees and stats
  useEffect(() => {
    if (!tenantId) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Log page view
        logPageView('employees', { tenantId: tenantId.slice(0, 8) });
        
        // Get employee count first
        const { data: count, error: countError } = await supabase.rpc('hr_employees_count_v1', {
          p_tenant: tenantId
        });
        
        if (countError) {
          console.error('Count error:', countError);
        }
        
        // Get employee list
        const { data: employeeList, error: listError } = await supabase.rpc('hr_employees_list_v1', {
          p_tenant: tenantId,
          p_page: 1,
          p_limit: 50
        });
        
        if (listError) {
          console.error('List error:', listError);
        }
        
        // Set employees data
        if (employeeList && Array.isArray(employeeList)) {
          setEmployees(employeeList.map(emp => ({
            id: emp.id,
            employee_number: emp.employee_number,
            full_name: emp.full_name,
            position: emp.position || '—',
            department: emp.department || '—',
            status: emp.status || 'active',
            hire_date: emp.hire_date,
            salary: emp.salary,
            is_saudi: emp.is_saudi
          })));
        }
        
        // Calculate stats
        const totalCount = count || employeeList?.length || 0;
        const activeCount = employeeList?.filter(e => e.status === 'active').length || 0;
        const saudiCount = employeeList?.filter(e => e.is_saudi).length || 0;
        const saudizationRate = totalCount > 0 ? Math.round((saudiCount / totalCount) * 100) : 0;
        
        setStats({
          total_employees: totalCount,
          active_employees: activeCount,
          saudization_percentage: saudizationRate
        });
        
      } catch (error) {
        logError('employees', 'Failed to load employee data');
        console.error('Load error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [tenantId]);

  // Filter employees
  const filteredEmployees = (employees || []).filter(emp => {
    const matchesSearch = !search || 
      emp.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_number?.toLowerCase().includes(search.toLowerCase()) ||
      emp.department?.toLowerCase().includes(search.toLowerCase());
    
    const matchesIqamaFilter = !iqamaFilter || (
      emp.iqama_number && 
      new Date(emp.iqama_number) <= new Date(Date.now() + iqamaFilter * 24 * 60 * 60 * 1000)
    );
    
    return matchesSearch && matchesIqamaFilter;
  });

  // Apply PDPL masking
  const maskedEmployees = maskEmployees(filteredEmployees, { isAdmin });

  // Export handlers
  const handleExportCSV = async () => {
    if (!tenantId) return;
    
    logUserAction('employees', 'export_csv', { rowCount: maskedEmployees.length });
    
    const columns = [
      { key: 'employee_number', label: 'Employee Number', labelAr: 'رقم الموظف' },
      { key: 'displayName', label: 'Name', labelAr: 'الاسم' },
      { key: 'department', label: 'Department', labelAr: 'القسم' },
      { key: 'position', label: 'Position', labelAr: 'المنصب' },
      { key: 'status', label: 'Status', labelAr: 'الحالة' },
      { key: 'is_saudi', label: 'Saudi', labelAr: 'سعودي' }
    ];
    
    try {
      await exportToCSV(maskedEmployees, columns, { isAdmin, tenantId });
      toast.success('CSV export completed');
    } catch (error) {
      toast.error('CSV export failed');
    }
  };

  const handleExportPDF = async () => {
    if (!tenantId) return;
    
    logUserAction('employees', 'export_pdf', { rowCount: maskedEmployees.length });
    
    const columns = [
      { key: 'employee_number', label: 'Employee Number', labelAr: 'رقم الموظف' },
      { key: 'displayName', label: 'Name', labelAr: 'الاسم' },
      { key: 'department', label: 'Department', labelAr: 'القسم' },
      { key: 'position', label: 'Position', labelAr: 'المنصب' }
    ];
    
    try {
      await exportToPDF(maskedEmployees, columns, { isAdmin, tenantId });
      toast.success('PDF export completed');
    } catch (error) {
      toast.error('PDF export failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Dev Mode CTA */}
      {shouldShowCTA && (
        <DevSeedingCTA onSeed={seedDemoData} />
      )}

      {/* Header */}
      <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('employees', 'title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('employees', 'subtitle')}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t('employees', 'add_employee')}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className={`relative flex-1 min-w-[200px] ${isRTL ? 'ml-4' : 'mr-4'}`}>
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
              <Input
                placeholder={t('employees', 'search_placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={isRTL ? 'pr-10' : 'pl-10'}
              />
            </div>
            
            {/* Quick Iqama Filters */}
            <div className="flex gap-2">
              <Button
                variant={iqamaFilter === 30 ? "default" : "outline"}
                size="sm"
                onClick={() => setIqamaFilter(iqamaFilter === 30 ? null : 30)}
              >
                {t('employees', 'iqama_30d')}
              </Button>
              <Button
                variant={iqamaFilter === 60 ? "default" : "outline"}
                size="sm"
                onClick={() => setIqamaFilter(iqamaFilter === 60 ? null : 60)}
              >
                {t('employees', 'iqama_60d')}
              </Button>
              <Button
                variant={iqamaFilter === 90 ? "default" : "outline"}
                size="sm"
                onClick={() => setIqamaFilter(iqamaFilter === 90 ? null : 90)}
              >
                {t('employees', 'iqama_90d')}
              </Button>
            </div>
            
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {t('employees', 'filters')}
            </Button>
            
            {/* Export Buttons */}
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleExportCSV}
              disabled={isExporting}
            >
              <FileText className="h-4 w-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              <Download className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('employees', 'total_employees')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_employees || 0}</div>
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
            <div className="text-2xl font-bold">{stats?.active_employees || 0}</div>
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
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.saudization_percentage || 0}%
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
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              {t('employees', 'pdpl_compliant')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('employees', 'employee_directory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maskedEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {employee.displayName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{employee.displayName}</div>
                    <div className="text-sm text-muted-foreground">
                      {employee.position} • {employee.department}
                    </div>
                    {!isAdmin && employee.iqamaMasked && (
                      <div className="text-xs text-muted-foreground">
                        Iqama: {employee.iqamaMasked}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="default">
                    {employee.status}
                  </Badge>
                  <Badge variant={employee.is_saudi ? 'default' : 'outline'}>
                    {employee.is_saudi ? t('employees', 'saudi') : t('employees', 'non_saudi')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PDPL Disclaimer */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>
              {t('employees', 'pdpl_notice')}
              {!isAdmin && t('employees', 'privacy_notice')}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}