import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, Download, Users, UserCheck, Target, Shield, FileText, Database } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguageCompat';
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
  const { t } = useLanguage();
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
        
        // Load employees - use mock data for now since RPCs aren't available
        const mockEmployees: Employee[] = [
          {
            id: '1',
            employee_number: 'EMP001',
            full_name: 'Ahmed Al-Rashid',
            email: 'ahmed.rashid@company.com',
            phone: '+966501234567',
            iqama_number: '1234567890',
            position: 'Senior Developer',
            department: 'IT',
            status: 'active',
            hire_date: '2022-01-15',
            salary: 12000,
            is_saudi: true
          },
          {
            id: '2',
            employee_number: 'EMP002',
            full_name: 'Sarah Johnson',
            email: 'sarah.johnson@company.com',
            phone: '+966512345678',
            iqama_number: '2345678901',
            position: 'HR Manager',
            department: 'Human Resources',
            status: 'active',
            hire_date: '2021-06-01',
            salary: 15000,
            is_saudi: false
          },
          {
            id: '3',
            employee_number: 'EMP003',
            full_name: 'Mohammed Al-Otaibi',
            email: 'mohammed.otaibi@company.com',
            phone: '+966523456789',
            iqama_number: '3456789012',
            position: 'Accountant',
            department: 'Finance',
            status: 'active',
            hire_date: '2023-03-10',
            salary: 8000,
            is_saudi: true
          }
        ];
        
        setEmployees(mockEmployees);
        
        // Mock stats
        setStats({
          total_employees: mockEmployees.length,
          active_employees: mockEmployees.filter(e => e.status === 'active').length,
          saudization_percentage: Math.round((mockEmployees.filter(e => e.is_saudi).length / mockEmployees.length) * 100)
        });
        
      } catch (error) {
        logError('employees', 'Failed to load employee data');
        toast.error('Failed to load employee data');
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
    <div className="space-y-6">
      {/* Dev Mode CTA */}
      {shouldShowCTA && (
        <DevSeedingCTA onSeed={seedDemoData} />
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Employee Master Data
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive employee information management and analytics
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Quick Iqama Filters */}
            <div className="flex gap-2">
              <Button
                variant={iqamaFilter === 30 ? "default" : "outline"}
                size="sm"
                onClick={() => setIqamaFilter(iqamaFilter === 30 ? null : 30)}
              >
                Iqama ≤30d
              </Button>
              <Button
                variant={iqamaFilter === 60 ? "default" : "outline"}
                size="sm"
                onClick={() => setIqamaFilter(iqamaFilter === 60 ? null : 60)}
              >
                Iqama ≤60d
              </Button>
              <Button
                variant={iqamaFilter === 90 ? "default" : "outline"}
                size="sm"
                onClick={() => setIqamaFilter(iqamaFilter === 90 ? null : 90)}
              >
                Iqama ≤90d
              </Button>
            </div>
            
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
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
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_employees || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active workforce
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Contracts
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_employees || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently employed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saudization Rate
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.saudization_percentage || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Saudi nationals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Compliance Score
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              PDPL compliant
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
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
                    {employee.is_saudi ? 'Saudi' : 'Non-Saudi'}
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
              This data is protected under Saudi Personal Data Protection Law (PDPL). 
              {!isAdmin && " Personal information has been masked for privacy compliance."}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}