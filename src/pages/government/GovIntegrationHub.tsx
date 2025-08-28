import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GovHubDashboard } from '@/components/government/GovHubDashboard';
import { GovDocSection } from '@/components/government/GovDocSection';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';
import { Building, FileText, Settings } from 'lucide-react';

export const GovIntegrationHub = () => {
  const { t } = useTranslation();

  const govHubDocTypes = [
    'Multi-Platform Document',
    'Compliance Certificate',
    'Integration Report',
    'API Configuration',
    'System Audit Log',
    'Cross-Platform Report',
    'Government Correspondence',
    'Other Government Document'
  ];

  const mockGovHubDocuments = [
    {
      id: 'hub_001',
      fileName: 'qiwa_gosi_integration_report.pdf',
      fileUrl: '/mock/gov-hub/integration_report.pdf',
      docType: 'Integration Report',
      uploadedAt: '2024-08-28T10:00:00Z',
      refId: 'HUB-2024-RPT-001',
      status: 'active' as const
    },
    {
      id: 'hub_002',
      fileName: 'compliance_certificate_multi_platform.pdf',
      fileUrl: '/mock/gov-hub/compliance_cert.pdf',
      docType: 'Compliance Certificate',
      uploadedAt: '2024-08-25T14:30:00Z',
      expiresOn: '2024-12-31',
      refId: 'HUB-2024-COMP-002',
      status: 'active' as const
    }
  ];

  const handleDocumentUpload = (fileUrl: string, metadata: any) => {
    console.log('Government Hub Document uploaded:', { fileUrl, metadata });
  };

  const handleDocumentView = (doc: any) => {
    console.log('Opening Government Hub document:', doc);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('government.hub.title')}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {t('government.hub.subtitle')}
          </p>
          <p className="text-gray-600 mt-1">
            {t('government.hub.description')}
          </p>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="platforms" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Platforms
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('government.documents.title')}
          </TabsTrigger>
          <TabsTrigger value="ai">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <GovHubDashboard />
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick access to individual platforms */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Building className="h-5 w-5" />
                QIWA Platform
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Ministry of Human Resources and Social Development services
              </p>
              <a 
                href="/government/qiwa" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Access Platform →
              </a>
            </div>

            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Building className="h-5 w-5" />
                GOSI Platform
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                General Organization for Social Insurance services
              </p>
              <a 
                href="/government/social-insurance" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Access Platform →
              </a>
            </div>

            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Building className="h-5 w-5" />
                Absher Platform
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Ministry of Interior digital government services
              </p>
              <a 
                href="/government/absher" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Access Platform →
              </a>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <GovDocSection
            portalName="Government Integration Hub"
            portalIcon={<Building className="h-5 w-5" />}
            description={t('government.hub.description')}
            docTypes={govHubDocTypes}
            existingDocs={mockGovHubDocuments}
            onDocumentUpload={handleDocumentUpload}
            onDocumentView={handleDocumentView}
          />
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          {/* AI Integration for Government Hub */}
          <UniversalAIIntegrator 
            pageType="government" 
            moduleName="gov-integration-hub" 
            companyId="demo-company" 
            enabledFeatures={['compliance-monitoring', 'government-integration', 'saudi-regulations', 'regulatory-compliance']}
          />
          
          <AqlHRAIAssistant 
            moduleContext="government.integration-hub" 
            companyId="demo-company"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};