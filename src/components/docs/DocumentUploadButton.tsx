import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/lib/useTenant';
import { useLocale } from '@/i18n/locale';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, 
  FileText, 
  X, 
  Building2, 
  User, 
  AlertCircle,
  Loader2,
  Check
} from 'lucide-react';

export interface DocumentUploadButtonProps {
  /** Document storage bucket - 'gov_docs' or 'employee_docs' */
  bucket: 'gov_docs' | 'employee_docs';
  /** Portal source for government docs (optional) */
  portal?: 'qiwa' | 'gosi' | 'absher' | 'mudad' | 'mol' | 'other';
  /** Employee ID for employee documents (optional) */
  employeeId?: string;
  /** Additional CSS classes */
  className?: string;
  /** Button variant */
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  /** Button size */
  size?: 'sm' | 'default' | 'lg';
  /** Custom button text */
  children?: React.ReactNode;
  /** Upload completion callback */
  onUploadComplete?: (documentId: string) => void;
  /** Upload progress callback */
  onUploadProgress?: (progress: number) => void;
  /** Upload error callback */
  onUploadError?: (error: string) => void;
  /** Disable the upload button */
  disabled?: boolean;
  /** Show upload progress in button */
  showProgress?: boolean;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  documentId?: string;
  error?: string;
}

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'text/plain': ['.txt'],
};

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB for government documents

export const DocumentUploadButton: React.FC<DocumentUploadButtonProps> = ({
  bucket,
  portal,
  employeeId,
  className = '',
  variant = 'default',
  size = 'default',
  children,
  onUploadComplete,
  onUploadProgress,
  onUploadError,
  disabled = false,
  showProgress = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('');
  const [notes, setNotes] = useState('');
  const [iqamaId, setIqamaId] = useState('');
  const [nationalId, setNationalId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { tenantId } = useTenant();
  const { locale, t } = useLocale();
  const { toast } = useToast();
  const isRTL = locale === 'ar';

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTitle('');
      setDocType('');
      setNotes('');
      setIqamaId('');
      setNationalId('');
      setUploads([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return isRTL 
        ? `حجم الملف ${file.name} يتجاوز الحد الأقصى 25 ميجابايت`
        : `File ${file.name} exceeds 25MB limit`;
    }

    const fileType = file.type;
    const isValidType = Object.keys(ACCEPTED_FILE_TYPES).includes(fileType);
    if (!isValidType) {
      return isRTL 
        ? `نوع الملف ${file.name} غير مدعوم`
        : `File type ${file.name} not supported`;
    }

    return null;
  };

  const uploadDocument = async (file: File): Promise<string> => {
    if (!tenantId) {
      throw new Error(isRTL ? 'معرف المستأجر مطلوب' : 'Tenant ID required');
    }

    // First, get signed upload URL
    const { data: signData, error: signError } = await supabase.functions.invoke('doc-upload-sign-v1', {
      body: {
        tenant_id: tenantId,
        bucket,
        filename: file.name,
        content_type: file.type,
        portal: bucket === 'gov_docs' ? portal : undefined,
      },
    });

    if (signError) throw signError;

    let uploadPath: string;
    
    if (signData.signed_url) {
      // Use signed URL upload
      const uploadResponse = await fetch(signData.signed_url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(isRTL ? 'فشل في رفع الملف' : 'Failed to upload file');
      }
      uploadPath = signData.storage_path;
    } else {
      // Fallback to direct upload
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(signData.storage_path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;
      uploadPath = uploadData.path;
    }

    // Process document with ingestion pipeline
    const { data: ingestData, error: ingestError } = await supabase.functions.invoke('doc-ingest-v1', {
      body: {
        tenant_id: tenantId,
        bucket,
        storage_path: uploadPath,
        metadata: {
          title: title || file.name,
          doc_type: docType,
          notes,
          iqama_id: iqamaId || undefined,
          national_id: nationalId || undefined,
          employee_id: employeeId,
          portal: bucket === 'gov_docs' ? portal : undefined,
        },
      },
    });

    if (ingestError) throw ingestError;
    
    return ingestData.document_id;
  };

  const handleFileUpload = async (files: File[]) => {
    if (!files.length || uploading) return;

    setUploading(true);
    const newUploads: UploadProgress[] = files.map(file => ({
      file,
      progress: 0,
      status: 'uploading',
    }));
    setUploads(newUploads);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
          throw new Error(validationError);
        }

        // Update progress: uploading
        setUploads(prev => prev.map((upload, index) => 
          index === i ? { ...upload, progress: 30, status: 'uploading' } : upload
        ));

        // Upload document
        const documentId = await uploadDocument(file);

        // Update progress: processing
        setUploads(prev => prev.map((upload, index) => 
          index === i ? { ...upload, progress: 80, status: 'processing' } : upload
        ));

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update progress: completed
        setUploads(prev => prev.map((upload, index) => 
          index === i ? { 
            ...upload, 
            progress: 100, 
            status: 'completed', 
            documentId 
          } : upload
        ));

        successCount++;
        onUploadComplete?.(documentId);

      } catch (error: any) {
        console.error('Upload error:', error);
        
        setUploads(prev => prev.map((upload, index) => 
          index === i ? { 
            ...upload, 
            status: 'error', 
            error: error.message 
          } : upload
        ));

        errorCount++;
        onUploadError?.(error.message);
      }
    }

    setUploading(false);

    // Show summary toast
    if (successCount > 0 && errorCount === 0) {
      toast({
        title: isRTL ? 'تم رفع المستندات بنجاح' : 'Documents uploaded successfully',
        description: isRTL 
          ? `تم رفع ${successCount} مستند بنجاح`
          : `${successCount} document(s) uploaded successfully`,
      });
      
      // Close dialog after successful upload
      setTimeout(() => handleOpenChange(false), 2000);
    } else if (errorCount > 0) {
      toast({
        title: isRTL ? 'بعض المستندات فشلت في الرفع' : 'Some documents failed to upload',
        description: isRTL
          ? `نجح: ${successCount}، فشل: ${errorCount}`
          : `Success: ${successCount}, Failed: ${errorCount}`,
        variant: errorCount === files.length ? 'destructive' : 'default',
      });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileUpload(acceptedFiles);
  }, [title, docType, notes, iqamaId, nationalId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
    disabled: uploading,
  });

  const handleManualUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileUpload(Array.from(files));
    }
  };

  const getDocumentTypeOptions = () => {
    if (bucket === 'gov_docs') {
      return [
        { value: 'iqama', label: isRTL ? 'إقامة' : 'Iqama' },
        { value: 'passport', label: isRTL ? 'جواز سفر' : 'Passport' },
        { value: 'visa', label: isRTL ? 'تأشيرة' : 'Visa' },
        { value: 'nitaqat_certificate', label: isRTL ? 'شهادة نطاقات' : 'Nitaqat Certificate' },
        { value: 'gosi_certificate', label: isRTL ? 'شهادة التأمينات الاجتماعية' : 'GOSI Certificate' },
        { value: 'labor_office_document', label: isRTL ? 'مستند مكتب العمل' : 'Labor Office Document' },
        { value: 'ministry_document', label: isRTL ? 'مستند الوزارة' : 'Ministry Document' },
        { value: 'other', label: isRTL ? 'أخرى' : 'Other' },
      ];
    } else {
      return [
        { value: 'contract', label: isRTL ? 'عقد عمل' : 'Employment Contract' },
        { value: 'offer_letter', label: isRTL ? 'خطاب عرض عمل' : 'Job Offer Letter' },
        { value: 'resignation', label: isRTL ? 'استقالة' : 'Resignation' },
        { value: 'disciplinary', label: isRTL ? 'إجراء تأديبي' : 'Disciplinary Action' },
        { value: 'performance_review', label: isRTL ? 'تقييم أداء' : 'Performance Review' },
        { value: 'training_certificate', label: isRTL ? 'شهادة تدريب' : 'Training Certificate' },
        { value: 'medical_report', label: isRTL ? 'تقرير طبي' : 'Medical Report' },
        { value: 'other', label: isRTL ? 'أخرى' : 'Other' },
      ];
    }
  };

  const getOverallProgress = () => {
    if (uploads.length === 0) return 0;
    const totalProgress = uploads.reduce((sum, upload) => sum + upload.progress, 0);
    return Math.round(totalProgress / uploads.length);
  };

  const buttonContent = () => {
    if (uploading && showProgress) {
      return (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {getOverallProgress()}%
        </span>
      );
    }

    if (children) return children;

    const icon = bucket === 'gov_docs' ? 
      <Building2 className="h-4 w-4" /> : 
      <User className="h-4 w-4" />;

    const text = bucket === 'gov_docs' ?
      (isRTL ? 'رفع مستندات حكومية' : 'Upload Gov Documents') :
      (isRTL ? 'رفع مستندات موظف' : 'Upload Employee Documents');

    return (
      <span className="flex items-center gap-2">
        {icon}
        {text}
      </span>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
          disabled={disabled || !tenantId}
        >
          {buttonContent()}
        </Button>
      </DialogTrigger>
      
      <DialogContent className={`sm:max-w-lg ${isRTL ? 'rtl' : 'ltr'}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {bucket === 'gov_docs' ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
            {bucket === 'gov_docs' ?
              (isRTL ? 'رفع المستندات الحكومية' : 'Upload Government Documents') :
              (isRTL ? 'رفع مستندات الموظف' : 'Upload Employee Documents')
            }
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Document Metadata Form */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">
                {isRTL ? 'عنوان المستند' : 'Document Title'}
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isRTL ? 'أدخل عنوان المستند' : 'Enter document title'}
                disabled={uploading}
              />
            </div>

            <div>
              <Label htmlFor="docType">
                {isRTL ? 'نوع المستند' : 'Document Type'}
              </Label>
              <Select value={docType} onValueChange={setDocType} disabled={uploading}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر نوع المستند' : 'Select document type'} />
                </SelectTrigger>
                <SelectContent>
                  {getDocumentTypeOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {bucket === 'employee_docs' && (
              <div>
                <Label htmlFor="iqamaId">
                  {isRTL ? 'رقم الإقامة' : 'Iqama ID'}
                </Label>
                <Input
                  id="iqamaId"
                  value={iqamaId}
                  onChange={(e) => setIqamaId(e.target.value)}
                  placeholder={isRTL ? 'رقم الإقامة (اختياري)' : 'Iqama ID (optional)'}
                  disabled={uploading}
                />
              </div>
            )}

            {bucket === 'gov_docs' && (
              <div>
                <Label htmlFor="nationalId">
                  {isRTL ? 'رقم الهوية الوطنية' : 'National ID'}
                </Label>
                <Input
                  id="nationalId"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder={isRTL ? 'رقم الهوية الوطنية (اختياري)' : 'National ID (optional)'}
                  disabled={uploading}
                />
              </div>
            )}

            <div className="col-span-2">
              <Label htmlFor="notes">
                {isRTL ? 'ملاحظات' : 'Notes'}
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isRTL ? 'ملاحظات إضافية (اختياري)' : 'Additional notes (optional)'}
                rows={2}
                disabled={uploading}
              />
            </div>
          </div>

          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/10' 
                : uploading
                ? 'border-muted-foreground/25 bg-muted/50 cursor-not-allowed'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.docx,.doc,.txt"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            
            <Upload className={`mx-auto h-8 w-8 mb-3 ${uploading ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
            <p className="font-medium mb-2">
              {uploading ? (
                isRTL ? 'جاري رفع المستندات...' : 'Uploading documents...'
              ) : isDragActive ? (
                isRTL ? 'اسحب الملفات هنا...' : 'Drop files here...'
              ) : (
                isRTL ? 'اسحب الملفات أو انقر للرفع' : 'Drag files here or click to upload'
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {isRTL 
                ? 'PDF، الصور، Word، النصوص (حتى 25 ميجابايت)'
                : 'PDF, Images, Word, Text files (up to 25MB)'
              }
            </p>
          </div>

          {/* Upload Progress */}
          {uploads.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">
                {isRTL ? 'حالة الرفع:' : 'Upload Status:'}
              </h4>
              {uploads.map((upload, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{upload.file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {upload.status === 'uploading' && <Loader2 className="h-3 w-3 animate-spin" />}
                    {upload.status === 'processing' && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
                    {upload.status === 'completed' && <Check className="h-3 w-3 text-green-500" />}
                    {upload.status === 'error' && <AlertCircle className="h-3 w-3 text-red-500" />}
                    
                    {upload.status === 'error' ? (
                      <Badge variant="destructive" className="text-xs">
                        {isRTL ? 'خطأ' : 'Error'}
                      </Badge>
                    ) : upload.status === 'completed' ? (
                      <Badge variant="default" className="text-xs bg-green-500">
                        {isRTL ? 'تم' : 'Done'}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {upload.progress}%
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Portal Info */}
          {bucket === 'gov_docs' && portal && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {isRTL ? `المصدر: ${portal.toUpperCase()}` : `Source: ${portal.toUpperCase()}`}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};