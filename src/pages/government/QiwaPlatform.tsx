import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GovDocSection } from '@/components/government/GovDocSection';
import { useGovAdapterStatus } from '@/hooks/useGovAdapterStatus';
import { 
  Building, 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';

const QiwaPlatform = () => {
  const { t } = useTranslation();
  const { status: adapterStatus, isLoading: statusLoading } = useGovAdapterStatus('QIWA');

  const qiwaDocTypes = [
    'Work Permit',
    'Visa Application', 
    'Labor Contract',
    'Wage Protection Certificate',
    'Employee Transfer Request',
    'Compliance Report',
    'Saudization Documentation',
    'Other QIWA Document'
  ];

  const mockQiwaDocuments = [
    {
      id: 'qiwa_001',
      fileName: 'work_permit_renewal_2024.pdf',
      fileUrl: '/mock/qiwa/work_permit.pdf',
      docType: 'Work Permit',
      uploadedAt: '2024-08-20T10:30:00Z',
      expiresOn: '2024-12-31',
      refId: 'QW-2024-001234',
      status: 'active' as const
    },
    {
      id: 'qiwa_002', 
      fileName: 'visa_application_form.pdf',
      fileUrl: '/mock/qiwa/visa_app.pdf',
      docType: 'Visa Application',
      uploadedAt: '2024-08-15T14:20:00Z',
      refId: 'QW-2024-001235',
      status: 'pending' as const
    }
  ];

  const handleDocumentUpload = (fileUrl: string, metadata: any) => {
    console.log('QIWA Document uploaded:', { fileUrl, metadata });
    // Handle QIWA-specific document upload logic
  };

  const handleDocumentView = (doc: any) => {
    console.log('Opening QIWA document:', doc);
    // Handle document viewing logic
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('government.qiwa.title')}
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              {t('government.qiwa.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {statusLoading ? (
              <Badge variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Checking...
              </Badge>
            ) : (
              <Badge 
                variant={adapterStatus === 'online' ? 'default' : 'destructive'}
                className="flex items-center gap-2"
              >
                {adapterStatus === 'online' ? (
                  <>
                    <Wifi className="h-4 w-4" />
                    {t('government.adapter.online', 'Online')}
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4" />
                    {t('government.adapter.offline', 'Offline')}
                  </>
                )}
              </Badge>
            )}
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('government.common.refresh')}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>
              {t('government.qiwa.description')}
            </CardDescription>
          </CardHeader>
        </Card>
        
        {/* Adapter Status Alert */}
        {adapterStatus === 'offline' && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              {t('government.adapter.offlineMessage', 'QIWA services are temporarily unavailable. Document upload is still available.')}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">{t('government.qiwa.features.title')}</TabsTrigger>
          <TabsTrigger value="documents">{t('government.documents.title')}</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Work Permits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('government.qiwa.features.workPermits')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Apply for and manage work permits for your employees
                </p>
                <Button size="sm" className="w-full">
                  {t('government.qiwa.actions.newApplication')}
                </Button>
              </CardContent>
            </Card>

            {/* Visa Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('government.qiwa.features.visaApplications')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Submit and track visa applications and renewals
                </p>
                <Button size="sm" className="w-full">
                  {t('government.qiwa.actions.checkStatus')}
                </Button>
              </CardContent>
            </Card>

            {/* Labor Contracts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {t('government.qiwa.features.laborContracts')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Manage and submit labor contract documentation
                </p>
                <Button size="sm" className="w-full">
                  {t('government.qiwa.actions.updateInfo')}
                </Button>
              </CardContent>
            </Card>

            {/* Employee Transfer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('government.qiwa.features.employeeTransfer')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Process employee transfer requests and approvals
                </p>
                <Button size="sm" className="w-full">
                  Submit Transfer
                </Button>
              </CardContent>
            </Card>

            {/* Compliance Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {t('government.qiwa.features.complianceReports')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Generate and submit mandatory compliance reports
                </p>
                <Button size="sm" className="w-full">
                  {t('government.qiwa.actions.submitReport')}
                </Button>
              </CardContent>
            </Card>

            {/* Wage Protection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {t('government.qiwa.features.wageProtection')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Ensure compliance with wage protection system
                </p>
                <Button size="sm" className="w-full">
                  View WPS Status
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <GovDocSection
            portalName="QIWA"
            portalIcon={<Building className="h-5 w-5" />}
            description={t('government.qiwa.description')}
            docTypes={qiwaDocTypes}
            existingDocs={mockQiwaDocuments}
            onDocumentUpload={handleDocumentUpload}
            onDocumentView={handleDocumentView}
            showUploader={true} // Always show uploader as per requirements
            adapterStatus={adapterStatus}
          />
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>
                Track your QIWA applications and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock applications */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Work Permit Application - John Doe</h4>
                    <p className="text-sm text-gray-600">Application ID: QW-2024-001234</p>
                    <p className="text-xs text-gray-500">Submitted: Aug 20, 2024</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      {t('government.qiwa.status.underReview')}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Visa Renewal - Sarah Ahmed</h4>
                    <p className="text-sm text-gray-600">Application ID: QW-2024-001235</p>
                    <p className="text-xs text-gray-500">Submitted: Aug 15, 2024</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {t('government.qiwa.status.approved')}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>
                Generate and download QIWA compliance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Monthly Compliance Report</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Employee Status Report</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <Building className="h-6 w-6 mb-2" />
                  <span>Saudization Report</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <CheckCircle className="h-6 w-6 mb-2" />
                  <span>WPS Compliance Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QiwaPlatform;