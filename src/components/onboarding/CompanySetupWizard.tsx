import React, { useState } from 'react';
import { useCompanySetup } from '@/hooks/useCompanySetup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Building2, Users, Sparkles, Rocket, CheckCircle } from 'lucide-react';

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

export function CompanySetupWizard() {
  const { createDemoCompany, createCompany, loading } = useCompanySetup();
  const [formData, setFormData] = useState({
    name: '',
    industry: 'technology',
    size_category: 'small'
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateDemo = async () => {
    setIsCreating(true);
    try {
      await createDemoCompany('AqlHR Demo Company');
      toast.success('Demo company created successfully!');
    } catch (error) {
      toast.error('Failed to create demo company');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    setIsCreating(true);
    try {
      await createCompany(formData.name, formData.industry, formData.size_category);
      toast.success('Company created successfully!');
    } catch (error) {
      toast.error('Failed to create company');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Building2 className="h-12 w-12 text-primary" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Welcome to AqlHR
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Let's set up your HR intelligence platform
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Demo Company Option */}
          <Card className="relative overflow-hidden border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Try Demo Company
                    <Badge variant="secondary" className="text-xs">
                      Recommended
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Explore AqlHR with pre-loaded sample data
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  8 sample employees with realistic data
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  5 departments and organizational structure
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  30 days of analytics and KPI data
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Instant access to all features
                </div>
              </div>
              
              <Button 
                onClick={handleCreateDemo}
                disabled={isCreating || loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                size="lg"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating Demo...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Demo Company
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Real Company Setup */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-600">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>Set Up Your Company</CardTitle>
                  <CardDescription>
                    Create your company profile and start managing your team
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCompany} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    placeholder="Enter your company name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                  >
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
                  <Label htmlFor="size">Company Size</Label>
                  <Select
                    value={formData.size_category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, size_category: value }))}
                  >
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

                <Button 
                  type="submit"
                  disabled={isCreating || loading || !formData.name.trim()}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                  size="lg"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating Company...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-4 w-4" />
                      Create Company
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            You can always switch between demo and real data later in your settings.
          </p>
        </div>
      </div>
    </div>
  );
}