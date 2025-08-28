import React, { useState } from 'react';
import { FileText, Plus, ExternalLink, Calendar, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DocumentUploader, DocumentMetadata } from '@/components/documents/DocumentUploader';
import { useTranslation } from 'react-i18next';
import type { AdapterState } from '@/hooks/useGovAdapterStatus';

interface DocumentRecord {
  id: string;
  fileName: string;
  fileUrl: string;
  docType: string;
  uploadedAt: string;
  expiresOn?: string;
  refId?: string;
  status?: 'active' | 'expired' | 'pending';
}

export interface GovDocSectionProps {
  portalName: string;
  portalIcon?: React.ReactNode;
  description?: string;
  docTypes?: string[];
  existingDocs?: DocumentRecord[];
  onDocumentUpload?: (fileUrl: string, metadata: DocumentMetadata) => void;
  onDocumentView?: (doc: DocumentRecord) => void;
  onExcelImport?: (data: any[], context: 'government' | 'employee') => void;
  showUploader?: boolean;
  adapterStatus?: AdapterState;
  className?: string;
}

export function GovDocSection({
  portalName,
  portalIcon = <FileText className="h-5 w-5" />,
  description,
  docTypes = [
    'Employment Contract',
    'Work Permit',
    'Health Certificate',
    'Insurance Certificate',
    'Tax Document',
    'Compliance Report',
    'Other'
  ],
  existingDocs = [],
  onDocumentUpload,
  onDocumentView,
  onExcelImport,
  showUploader = true,
  adapterStatus = 'unknown',
  className = '',
}: GovDocSectionProps) {
  const { t } = useTranslation();
  const [uploaderVisible, setUploaderVisible] = useState(false);
  const [documents, setDocuments] = useState<DocumentRecord[]>(existingDocs);
  
  // Always show uploader as per Phase 18 requirements
  const shouldShowUploader = showUploader;
  
  const handleExcelImport = (data: any[], context: 'government' | 'employee') => {
    onExcelImport?.(data, context);
    // Optionally close uploader after import
    setUploaderVisible(false);
  };

  const handleUploadSuccess = (fileUrl: string, metadata: DocumentMetadata) => {
    // Create new document record
    const newDoc: DocumentRecord = {
      id: `doc_${Date.now()}`,
      fileName: fileUrl.split('/').pop() || 'Unknown File',
      fileUrl,
      docType: metadata.docType,
      uploadedAt: new Date().toISOString(),
      expiresOn: metadata.expiresOn,
      refId: metadata.refId,
      status: 'active',
    };

    setDocuments(prev => [newDoc, ...prev]);
    setUploaderVisible(false);
    onDocumentUpload?.(fileUrl, metadata);
  };

  const getDocumentStatus = (doc: DocumentRecord): 'active' | 'expired' | 'pending' => {
    if (doc.status) return doc.status;
    
    if (doc.expiresOn) {
      const expiryDate = new Date(doc.expiresOn);
      const today = new Date();
      return expiryDate < today ? 'expired' : 'active';
    }
    
    return 'active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {portalIcon}
              <div>
                <h3 className="text-lg font-semibold">{portalName}</h3>
                {description && (
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
              </div>
            </div>
            {shouldShowUploader && (
              <Button
                onClick={() => setUploaderVisible(!uploaderVisible)}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {t('documents.uploader.title', 'Add Document')}
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        {/* Adapter Status Alert */}
        {adapterStatus === 'offline' && (
          <CardContent className="border-t border-orange-200 bg-orange-50">
            <Alert className="border-orange-200">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                {t('government.adapter.offlineMessage', 
                `${portalName} services are temporarily unavailable. Document upload is still available.`)}
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
        
        {/* Document Upload Section */}
        {shouldShowUploader && uploaderVisible && (
          <CardContent className="border-t">
            <div className="pt-4">
              <DocumentUploader
                govPortal={portalName}
                docTypes={docTypes}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={(error) => {
                  console.error('Document upload error:', error);
                  // Handle error state
                }}
                onExcelImport={handleExcelImport}
                acceptedTypes={['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.xlsx', '.xls']}
                maxSize={10}
                allowAIParsing={true}
                context="gov"
              />
            </div>
          </CardContent>
        )}

        {/* Existing Documents List */}
        <CardContent className={uploaderVisible ? 'border-t' : ''}>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-12 w-12 mb-3 text-gray-300" />
              <p>No documents uploaded yet</p>
              <p className="text-sm">Click "Add Document" to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 mb-3">
                Recent Documents ({documents.length})
              </h4>
              
              {documents.map((doc) => {
                const status = getDocumentStatus(doc);
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 truncate">
                            {doc.fileName}
                          </p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getStatusColor(status)}`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {doc.docType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(doc.uploadedAt)}
                          </span>
                          {doc.expiresOn && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Expires: {formatDate(doc.expiresOn)}
                            </span>
                          )}
                          {doc.refId && (
                            <span className="text-xs">
                              Ref: {doc.refId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDocumentView?.(doc)}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}