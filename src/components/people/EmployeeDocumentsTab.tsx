import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, Download, Trash2, Eye, Shield, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Employee } from '@/hooks/useEmployees';

interface EmployeeDocumentsTabProps {
  employee: Employee;
}

interface DocumentEvent {
  id: string;
  document_type: string;
  file_name: string;
  file_size: number;
  virus_scan_status: string;
  created_at: string;
  uploaded_by: string;
  file_path: string;
}

export const EmployeeDocumentsTab: React.FC<EmployeeDocumentsTabProps> = ({ employee }) => {
  const [documents, setDocuments] = useState<DocumentEvent[]>([]);
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState<string>('');
  const { toast } = useToast();

  const documentTypes = [
    { value: 'resume', label: 'Resume/CV' },
    { value: 'contract', label: 'Employment Contract' },
    { value: 'id_copy', label: 'ID Copy' },
    { value: 'iqama', label: 'Iqama' },
    { value: 'passport', label: 'Passport' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'medical_report', label: 'Medical Report' },
    { value: 'visa', label: 'Visa' },
    { value: 'other', label: 'Other' }
  ];

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!documentType) {
      toast({
        title: "Document Type Required",
        description: "Please select a document type before uploading.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    for (const file of acceptedFiles) {
      try {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${employee.id}/${documentType}_${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('hr-employee-docs')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        // Log document event
        const { data: docEvent, error: docError } = await supabase
          .from('docs_events')
          .insert({
            company_id: employee.company_id,
            employee_id: employee.id,
            document_type: documentType,
            file_path: uploadData.path,
            file_name: file.name,
            file_size: file.size,
            mime_type: file.type,
            upload_metadata: {
              original_name: file.name,
              upload_timestamp: new Date().toISOString()
            }
          })
          .select()
          .single();

        if (docError) {
          throw docError;
        }

        // Add to local state
        setDocuments(prev => [docEvent as DocumentEvent, ...prev]);

        toast({
          title: "Document Uploaded",
          description: `${file.name} has been uploaded successfully and is being scanned.`
        });

      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}. Please try again.`,
          variant: "destructive"
        });
      }
    }
    
    setUploading(false);
    setDocumentType('');
  }, [documentType, employee, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const downloadDocument = async (document: DocumentEvent) => {
    try {
      const { data, error } = await supabase.storage
        .from('hr-employee-docs')
        .download(document.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.file_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getVirusScanBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: AlertCircle, text: 'Scanning' },
      clean: { variant: 'default' as const, icon: Shield, text: 'Clean' },
      infected: { variant: 'destructive' as const, icon: AlertCircle, text: 'Infected' },
      failed: { variant: 'secondary' as const, icon: AlertCircle, text: 'Scan Failed' }
    };
    
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="document-type">Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium">Drop files here or click to upload</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Supports: PDF, DOC, DOCX, PNG, JPG (Max: 10MB)
                </p>
              </div>
            )}
          </div>

          {uploading && (
            <div className="text-center text-muted-foreground">
              Uploading and scanning documents...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Employee Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents uploaded yet</p>
              <p className="text-sm">Upload documents using the form above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{doc.file_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {documentTypes.find(t => t.value === doc.document_type)?.label || doc.document_type}
                        • {formatFileSize(doc.file_size)}
                        • {new Date(doc.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getVirusScanBadge(doc.virus_scan_status)}
                    
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDocument(doc)}
                        disabled={doc.virus_scan_status === 'infected'}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {}} // View functionality
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {}} // Delete functionality
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm">
              <div className="font-medium">Security & Compliance</div>
              <div className="text-muted-foreground mt-1">
                All uploaded documents are automatically scanned for viruses and malware. 
                Sensitive documents are encrypted and access is logged for audit purposes.
                Only authorized HR personnel can view and manage employee documents.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};