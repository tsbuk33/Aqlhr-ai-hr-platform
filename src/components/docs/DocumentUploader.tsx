import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getTenantIdOrDemo } from '@/lib/tenant/getTenantId';
import { Upload, FileText, X, Eye, Download, Tags, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { resolveLang } from '@/lib/i18n/localePath';

interface DocumentUploaderProps {
  tenantId?: string;
  module: string;
  entityId?: string;
  onUploadComplete?: (document: any) => void;
  className?: string;
}

interface UploadedDocument {
  id: string;
  title: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  tags: string[];
  ai_tags: string[];
  uploaded_at: string;
  uploaded_by: string;
  module: string;
  entity_id?: string;
}

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/csv': ['.csv'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  tenantId,
  module,
  entityId,
  onUploadComplete,
  className = '',
}) => {
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [filterTags, setFilterTags] = useState('');
  const [filterModule, setFilterModule] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isArabic = resolveLang() === 'ar';

  // Load documents on mount
  React.useEffect(() => {
    loadDocuments();
  }, [tenantId, module, entityId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const effectiveTenantId = tenantId || await getTenantIdOrDemo();
      
      let query = supabase
        .from('gov_documents')
        .select('*')
        .eq('tenant_id', effectiveTenantId)
        .order('uploaded_at', { ascending: false });

      if (module) {
        query = query.eq('module', module);
      }

      if (entityId) {
        query = query.eq('entity_id', entityId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error('Error loading documents:', error);
      toast({
        title: 'Error Loading Documents',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateChecksum = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const uploadFile = async (file: File, metadata: any = {}) => {
    try {
      setUploading(true);
      const effectiveTenantId = tenantId || await getTenantIdOrDemo();
      
      // Generate unique file path
      const fileExtension = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;
      const storagePath = `docs/${effectiveTenantId}/${module}${entityId ? `/${entityId}` : ''}/${fileName}`;
      
      // Calculate checksum for deduplication
      const checksum = await calculateChecksum(file);

      // Check for existing file with same checksum
      const { data: existingDoc } = await supabase
        .from('gov_documents')
        .select('id, title')
        .eq('tenant_id', effectiveTenantId)
        .eq('checksum', checksum)
        .single();

      if (existingDoc) {
        toast({
          title: 'Duplicate File',
          description: `File "${existingDoc.title}" already exists`,
          variant: 'destructive',
        });
        return;
      }

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Parse tags
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Insert document metadata
      const documentData = {
        tenant_id: effectiveTenantId,
        system: module, // Use module as system for backwards compatibility
        module,
        entity_id: entityId,
        title: title || file.name,
        storage_path: storagePath,
        mime_type: file.type,
        file_size: file.size,
        tags: tagArray,
        checksum,
        uploaded_by: (await supabase.auth.getUser()).data.user?.id,
        meta: {
          original_name: file.name,
          ...metadata
        }
      };

      const { data: docData, error: docError } = await supabase
        .from('gov_documents')
        .insert(documentData)
        .select()
        .single();

      if (docError) throw docError;

      // Call AI document processor if available
      try {
        const { data: aiResult, error: aiError } = await supabase.functions
          .invoke('ai-document-processor', {
            body: {
              documentId: docData.id,
              storagePath,
              mimeType: file.type,
              tenantId: effectiveTenantId
            }
          });

        if (!aiError && aiResult?.aiTags) {
          // Update document with AI tags
          await supabase
            .from('gov_documents')
            .update({ ai_tags: aiResult.aiTags })
            .eq('id', docData.id);
        }
      } catch (aiError) {
        console.log('AI processing not available or failed:', aiError);
      }

      toast({
        title: 'Upload Successful',
        description: `${title || file.name} uploaded successfully`,
      });

      // Reset form
      setTitle('');
      setTags('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Reload documents
      await loadDocuments();
      
      if (onUploadComplete) {
        onUploadComplete(docData);
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'File Too Large',
          description: `${file.name} exceeds 10MB limit`,
          variant: 'destructive',
        });
        continue;
      }
      await uploadFile(file);
    }
  }, [title, tags, module, entityId, tenantId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true
  });

  const handleManualUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => uploadFile(file));
    }
  };

  const deleteDocument = async (documentId: string, storagePath: string) => {
    try {
      // Delete from storage
      await supabase.storage
        .from('documents')
        .remove([storagePath]);

      // Delete from database
      const { error } = await supabase
        .from('gov_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: 'Document Deleted',
        description: 'Document deleted successfully',
      });

      await loadDocuments();
    } catch (error: any) {
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const downloadDocument = async (storagePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(storagePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: 'Download Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    if (filterTags && !doc.tags.some(tag => 
      tag.toLowerCase().includes(filterTags.toLowerCase())
    ) && !doc.ai_tags.some(tag => 
      tag.toLowerCase().includes(filterTags.toLowerCase())
    )) {
      return false;
    }
    if (filterModule && doc.module !== filterModule) {
      return false;
    }
    return true;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Area */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {isArabic ? 'رفع المستندات' : 'Upload Documents'}
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">
                {isArabic ? 'عنوان المستند' : 'Document Title'}
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isArabic ? 'أدخل عنوان المستند' : 'Enter document title'}
              />
            </div>
            <div>
              <Label htmlFor="tags">
                {isArabic ? 'العلامات (مفصولة بفاصلة)' : 'Tags (comma separated)'}
              </Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder={isArabic ? 'مثال: قانوني، عقد، مهم' : 'e.g., legal, contract, important'}
              />
            </div>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/10' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.gif,.xlsx,.csv,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              {isDragActive 
                ? (isArabic ? 'اسحب الملفات هنا...' : 'Drop files here...')
                : (isArabic ? 'اسحب الملفات أو انقر للرفع' : 'Drag files here or click to upload')
              }
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {isArabic 
                ? 'PDF، الصور، Excel، CSV، Word (حتى 10 ميجابايت)'
                : 'PDF, Images, Excel, CSV, Word (up to 10MB)'
              }
            </p>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={handleManualUpload}
              disabled={uploading}
            >
              {uploading 
                ? (isArabic ? 'جاري الرفع...' : 'Uploading...')
                : (isArabic ? 'اختيار الملفات' : 'Choose Files')
              }
            </Button>
          </div>
        </div>
      </Card>

      {/* Document List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {isArabic ? 'المستندات المرفوعة' : 'Uploaded Documents'}
          </h3>
          <div className="flex gap-2">
            <Input
              placeholder={isArabic ? 'البحث بالعلامات...' : 'Filter by tags...'}
              value={filterTags}
              onChange={(e) => setFilterTags(e.target.value)}
              className="w-48"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">
              {isArabic ? 'جاري التحميل...' : 'Loading documents...'}
            </p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-2 opacity-50" />
            <p>{isArabic ? 'لا توجد مستندات' : 'No documents found'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{doc.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(doc.uploaded_at), 'PPp', {
                          locale: isArabic ? ar : undefined
                        })}
                      </span>
                      <span>{formatFileSize(doc.file_size)}</span>
                      <Badge variant="secondary">{doc.module}</Badge>
                    </div>
                    
                    {(doc.tags.length > 0 || doc.ai_tags.length > 0) && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {doc.tags.map((tag, index) => (
                          <Badge key={`tag-${index}`} variant="outline" className="text-xs">
                            <Tags className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {doc.ai_tags.map((tag, index) => (
                          <Badge key={`ai-${index}`} variant="secondary" className="text-xs">
                            🤖 {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadDocument(doc.storage_path, doc.title)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteDocument(doc.id, doc.storage_path)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};