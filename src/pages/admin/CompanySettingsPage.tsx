import React, { useState } from 'react';
import { useCompanySetup } from '@/hooks/useCompanySetup';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Building2, Users, Settings, AlertTriangle, Sparkles, Database } from 'lucide-react';
import { RoleGuard } from '@/components/rbac/RoleGuard';

const INDUSTRIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'education', label: 'Education' },
  { value: 'construction', label: 'Construction' },
  { value: 'energy', label: 'Energy & Oil' },
  { value: 'telecommunications', label: 'Telecommunications' },
  { value: 'other', label: 'Other' }
];

const COMPANY_SIZES = [
  { value: 'startup', label: 'Startup (1-10 employees)' },
  { value: 'small', label: 'Small (11-50 employees)' },
  { value: 'medium', label: 'Medium (51-200 employees)' },
  { value: 'large', label: 'Large (201-1000 employees)' },
  { value: 'enterprise', label: 'Enterprise (1000+ employees)' }
];

export default function CompanySettingsPage() {
  const { companyInfo, setupStatus, createDemoCompany, loading } = useCompanySetup();
  const { profile } = useUserProfile();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);

  const handleCreateDemoData = async () => {
    setIsCreatingDemo(true);
    try {
      await createDemoCompany(companyInfo?.name + ' (Demo)');
      toast.success('Demo data created successfully!');
    } catch (error) {
      toast.error('Failed to create demo data');
    } finally {
      setIsCreatingDemo(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!companyInfo) {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No company information found. This is normal for new setups.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
          <p className="text-muted-foreground">
            Manage your company information and preferences
          </p>
        </div>
        {companyInfo.is_demo && (
          <Badge variant="secondary" className="text-sm">
            <Sparkles className="w-3 h-3 mr-1" />
            Demo Company
          </Badge>
        )}
      </div>

      <div className="grid gap-6">
        <RoleGuard requiredRoles={['admin']}>
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Basic information about your company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={companyInfo.name || 'Your Company'} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Company ID</Label>
                  <Input value={companyInfo.id || 'Not Set'} disabled className="font-mono text-sm" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select value={companyInfo.industry || 'other'} disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Company Size</Label>
                  <Select value={companyInfo.size_category || 'small'} disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={companyInfo.description || 'No description'} disabled />
              </div>

              <Button disabled variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Edit Company Info (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          {/* Company Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Company Statistics
              </CardTitle>
              <CardDescription>
                Overview of your company's current state
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {setupStatus?.employees_count || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Employees</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {setupStatus?.departments_count || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Departments</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {companyInfo.is_demo ? 'Demo' : 'Live'}
                  </div>
                  <div className="text-sm text-muted-foreground">Mode</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {setupStatus?.setup_completed ? 'Complete' : 'Pending'}
                  </div>
                  <div className="text-sm text-muted-foreground">Setup</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Data Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Demo Data
              </CardTitle>
              <CardDescription>
                Add sample data to test platform features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  Create demo data to explore AqlHR features with sample employees, departments, and analytics data.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={handleCreateDemoData}
                disabled={isCreatingDemo}
                variant="outline"
              >
                {isCreatingDemo ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Creating Demo Data...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Demo Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </RoleGuard>
      </div>
    </div>
  );
}