import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GovDocSection } from '@/components/government/GovDocSection';
import { 
  Shield, 
  CreditCard, 
  Users, 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  DollarSign,
  AlertCircle,
  Download,
  Calculator,
  RefreshCw
} from 'lucide-react';

const SocialInsurancePlatform = () => {
  const { t } = useTranslation();

  const gosiDocTypes = [
    'Employee Registration Form',
    'Salary Certificate', 
    'Contribution Payment Receipt',
    'GOSI Certificate Request',
    'Annual Report',
    'Benefit Claim Form',
    'Employment Contract (GOSI)',
    'Other GOSI Document'
  ];

  const mockGosiDocuments = [
    {
      id: 'gosi_001',
      fileName: 'monthly_contributions_aug_2024.pdf',
      fileUrl: '/mock/gosi/contributions.pdf',
      docType: 'Contribution Payment Receipt',
      uploadedAt: '2024-08-01T09:00:00Z',
      refId: 'GOSI-2024-08-001',
      status: 'active' as const
    },
    {
      id: 'gosi_002',
      fileName: 'employee_registration_batch_15.xlsx',
      fileUrl: '/mock/gosi/registrations.xlsx',
      docType: 'Employee Registration Form',
      uploadedAt: '2024-07-28T16:45:00Z',
      refId: 'GOSI-REG-2024-15',
      status: 'active' as const
    }
  ];

  const handleDocumentUpload = (fileUrl: string, metadata: any) => {
    console.log('GOSI Document uploaded:', { fileUrl, metadata });
    // Handle GOSI-specific document upload logic
  };

  const handleDocumentView = (doc: any) => {
    console.log('Opening GOSI document:', doc);
    // Handle document viewing logic
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('government.gosi.title')}
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              {t('government.gosi.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {t('government.common.connected')}
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('government.common.refresh')}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>
              {t('government.gosi.description')}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contributions">{t('government.gosi.contributions.title')}</TabsTrigger>
          <TabsTrigger value="services">{t('government.gosi.features.title')}</TabsTrigger>
          <TabsTrigger value="documents">{t('government.documents.title')}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Registered Employees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-gray-600">Active registrations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {t('government.gosi.contributions.monthly')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">SAR 45,230</div>
                <p className="text-xs text-gray-600">{t('government.gosi.contributions.paid')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {t('government.gosi.contributions.due')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">SAR 12,450</div>
                <p className="text-xs text-gray-600">{t('government.gosi.contributions.nextDue')}: Sep 15</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">98%</div>
                <p className="text-xs text-gray-600">Up to date</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent GOSI Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Monthly Contribution Payment</p>
                      <p className="text-sm text-gray-600">SAR 45,230 for August 2024</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Employee Registration</p>
                      <p className="text-sm text-gray-600">15 new employees registered</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">GOSI Certificate Request</p>
                      <p className="text-sm text-gray-600">Certificate for employee ID: EMP-2024-150</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    Processing
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contributions Tab */}
        <TabsContent value="contributions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('government.gosi.contributions.title')}</CardTitle>
                <CardDescription>
                  Current month contribution summary
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Contribution Amount:</span>
                  <span className="font-bold">SAR 45,230</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Employee Portion (2%):</span>
                  <span>SAR 8,046</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Employer Portion (10%):</span>
                  <span>SAR 37,184</span>
                </div>
                <div className="pt-2 border-t">
                  <Button className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {t('government.gosi.actions.payContributions')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('government.gosi.contributions.paymentHistory')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">August 2024</p>
                      <p className="text-sm text-gray-600">SAR 45,230</p>
                    </div>
                    <Badge variant="default">Paid</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">July 2024</p>
                      <p className="text-sm text-gray-600">SAR 43,890</p>
                    </div>
                    <Badge variant="default">Paid</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">June 2024</p>
                      <p className="text-sm text-gray-600">SAR 42,150</p>
                    </div>
                    <Badge variant="default">Paid</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Download className="h-4 w-4 mr-2" />
                  {t('government.gosi.actions.downloadStatement')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contribution Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                {t('government.gosi.contributions.calculateContributions')}
              </CardTitle>
              <CardDescription>
                Calculate GOSI contributions for employee salaries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Monthly Salary (SAR)</label>
                  <input 
                    type="number" 
                    placeholder="25000" 
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Employee Type</label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option>Saudi National</option>
                    <option>GCC National</option>
                    <option>Non-Saudi</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">Calculate</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Employee Registration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('government.gosi.features.employeeRegistration')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Register new employees in GOSI system
                </p>
                <Button size="sm" className="w-full">
                  {t('government.gosi.actions.registerEmployee')}
                </Button>
              </CardContent>
            </Card>

            {/* Benefit Claims */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t('government.gosi.features.benefitClaims')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Process employee benefit claims and requests
                </p>
                <Button size="sm" className="w-full">
                  {t('government.gosi.actions.submitClaim')}
                </Button>
              </CardContent>
            </Card>

            {/* GOSI Certificates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('government.gosi.features.certificateRequests')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Request official GOSI certificates for employees
                </p>
                <Button size="sm" className="w-full">
                  {t('government.gosi.actions.generateCertificate')}
                </Button>
              </CardContent>
            </Card>

            {/* Salary Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t('government.gosi.features.salaryUpdates')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Update employee salary information in GOSI
                </p>
                <Button size="sm" className="w-full">
                  {t('government.gosi.actions.updateSalaries')}
                </Button>
              </CardContent>
            </Card>

            {/* Pension Calculations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  {t('government.gosi.features.pensionCalculation')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Calculate employee pension and retirement benefits
                </p>
                <Button size="sm" className="w-full">
                  {t('government.gosi.actions.viewPensions')}
                </Button>
              </CardContent>
            </Card>

            {/* Annual Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('government.gosi.features.annualReports')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Generate and submit annual GOSI reports
                </p>
                <Button size="sm" className="w-full">
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <GovDocSection
            portalName="GOSI"
            portalIcon={<Shield className="h-5 w-5" />}
            description={t('government.gosi.description')}
            docTypes={gosiDocTypes}
            existingDocs={mockGosiDocuments}
            onDocumentUpload={handleDocumentUpload}
            onDocumentView={handleDocumentView}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialInsurancePlatform;