import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  File, 
  Check, 
  AlertCircle,
  X 
} from 'lucide-react';
import { useDocumentAwareAI } from '@/hooks/useDocumentAwareAI';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { toast } from 'sonner';

interface DocumentUploadWidgetProps {
  moduleKey: string;
  compact?: boolean;
  className?: string;
}

export const DocumentUploadWidget: React.FC<DocumentUploadWidgetProps> = ({
  moduleKey,
  compact = false,
  className = ''
}) => {
  const { isArabic } = useSimpleLanguage();
  const { uploadDocument, loading } = useDocumentAwareAI(moduleKey);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string;
    status: 'uploading' | 'processing' | 'complete' | 'error';
    id?: string;
  }>>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      // Add to upload queue
      setUploadedFiles(prev => [...prev, {
        name: file.name,
        status: 'uploading'
      }]);

      try {
        // Simulate upload progress
        setUploadProgress(0);
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 20, 90));
        }, 200);

        // Update status to processing
        setUploadedFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, status: 'processing' } : f
        ));

        const documentId = await uploadDocument(file, moduleKey);
        
        clearInterval(progressInterval);
        setUploadProgress(100);

        // Update status to complete
        setUploadedFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, status: 'complete', id: documentId } : f
        ));

        toast.success(
          isArabic 
            ? `تم رفع ${file.name} بنجاح وتم معالجته بواسطة الذكاء الاصطناعي`
            : `${file.name} uploaded successfully and processed by AI`
        );

      } catch (error) {
        console.error('Upload error:', error);
        setUploadedFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, status: 'error' } : f
        ));
        
        toast.error(
          isArabic 
            ? `فشل في رفع ${file.name}`
            : `Failed to upload ${file.name}`
        );
      }
    }
  }, [uploadDocument, moduleKey, isArabic]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/csv': ['.csv']
    },
    multiple: true,
    disabled: loading
  });

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <Check className="h-4 w-4 text-brand-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-brand-danger" />;
      default:
        return null;
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  if (compact) {
    return (
      <div className={`${className}`} dir={isArabic ? 'rtl' : 'ltr'}>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-brand-primary bg-brand-primary/5' : 'border-border hover:border-brand-primary/50'}
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex items-center justify-center gap-2">
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isArabic ? 'رفع المستندات' : 'Upload Documents'}
            </span>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-2 space-y-1">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                {getFileIcon(file.name)}
                <span className="flex-1 truncate">{file.name}</span>
                <Badge variant="outline" className="text-xs">
                  {file.status === 'uploading' && (isArabic ? 'جاري الرفع' : 'Uploading')}
                  {file.status === 'processing' && (isArabic ? 'معالجة' : 'Processing')}
                  {file.status === 'complete' && (isArabic ? 'مكتمل' : 'Complete')}
                  {file.status === 'error' && (isArabic ? 'خطأ' : 'Error')}
                </Badge>
                {getStatusIcon(file.status)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.name)}
                  className="h-4 w-4 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`${className}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-brand-primary bg-brand-primary/5' : 'border-border hover:border-brand-primary/50'}
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          
          <h3 className="text-lg font-semibold mb-2">
            {isArabic ? 'رفع المستندات للذكاء الاصطناعي' : 'Upload Documents for AI Analysis'}
          </h3>
          
          <p className="text-muted-foreground mb-4">
            {isDragActive
              ? (isArabic ? 'اسحب الملفات هنا...' : 'Drop files here...')
              : (isArabic 
                  ? 'اسحب وأفلت الملفات هنا أو انقر للاختيار' 
                  : 'Drag & drop files here or click to select')
            }
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge variant="outline">PDF</Badge>
            <Badge variant="outline">Excel</Badge>
            <Badge variant="outline">Word</Badge>
            <Badge variant="outline">CSV</Badge>
          </div>

          <p className="text-xs text-muted-foreground">
            {isArabic 
              ? 'سيتم معالجة جميع المستندات بواسطة الذكاء الاصطناعي لتحليل أفضل'
              : 'All documents will be AI-processed for better analysis'
            }
          </p>
        </div>

        {loading && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {isArabic ? 'جاري المعالجة بواسطة الذكاء الاصطناعي...' : 'AI Processing...'}
            </p>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-medium">
              {isArabic ? 'الملفات المرفوعة' : 'Uploaded Files'}
            </h4>
            
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                {getFileIcon(file.name)}
                <div className="flex-1">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? `وحدة: ${moduleKey}` : `Module: ${moduleKey}`}
                  </p>
                </div>
                <Badge variant="outline">
                  {file.status === 'uploading' && (isArabic ? 'جاري الرفع' : 'Uploading')}
                  {file.status === 'processing' && (isArabic ? 'معالجة بالذكاء الاصطناعي' : 'AI Processing')}
                  {file.status === 'complete' && (isArabic ? 'جاهز للتحليل' : 'Ready for Analysis')}
                  {file.status === 'error' && (isArabic ? 'خطأ في المعالجة' : 'Processing Error')}
                </Badge>
                {getStatusIcon(file.status)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.name)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};