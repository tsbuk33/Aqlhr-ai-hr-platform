import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle, Brain, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useToast } from '@/hooks/use-toast';
import { useDocumentAwareAI } from '@/hooks/useDocumentAwareAI';
import { supabase } from '@/integrations/supabase/client';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'uploaded' | 'error';
  progress: number;
  url?: string;
  aiProcessed?: boolean;
  makeGlobal?: boolean;
}

interface EnhancedModuleDocumentUploaderProps {
  moduleKey: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  onFilesUploaded?: (files: UploadedFile[]) => void;
  className?: string;
  enableAIProcessing?: boolean;
  allowGlobalAccess?: boolean;
}

const EnhancedModuleDocumentUploader: React.FC<EnhancedModuleDocumentUploaderProps> = ({
  moduleKey,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.txt', '.csv', '.xlsx'],
  onFilesUploaded,
  className = "",
  enableAIProcessing = true,
  allowGlobalAccess = true
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { language } = useLanguage();
  const { toast } = useToast();
  const { uploadDocument, loadDocuments } = useDocumentAwareAI(moduleKey);
  const isArabic = language === 'ar';

  // Static translations for document uploader
  const getModuleTitle = (moduleKey: string) => {
    const translations = {
      'health-safety': {
        ar: 'رفع وثائق الصحة والسلامة المحسن',
        en: 'Enhanced Health & Safety Document Upload'
      },
      'analytics.performance': {
        ar: 'رفع وثائق تحليلات الأداء المحسن',
        en: 'Enhanced Performance Analytics Document Upload'
      },
      default: {
        ar: 'رفع الوثائق المحسن',
        en: 'Enhanced Document Upload'
      }
    };
    
    const moduleTranslations = translations[moduleKey as keyof typeof translations] || translations.default;
    return moduleTranslations[isArabic ? 'ar' : 'en'];
  };

  useEffect(() => {
    if (onFilesUploaded) {
      onFilesUploaded(files.filter(f => f.status === 'uploaded'));
    }
  }, [files, onFilesUploaded]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > maxFiles) {
      toast({
        title: isArabic ? 'خطأ' : 'Error',
        description: isArabic ? `الحد الأقصى للملفات هو ${maxFiles}` : `Maximum ${maxFiles} files allowed`,
        variant: 'destructive',
      });
      return;
    }

    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading' as const,
      progress: 0,
      makeGlobal: false
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Upload files one by one
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const fileRecord = newFiles[i];
      
      try {
        await uploadFileWithAI(file, fileRecord);
      } catch (error) {
        console.error('Upload failed:', error);
        updateFileStatus(fileRecord.id, 'error', 0);
        toast({
          title: isArabic ? 'خطأ' : 'Error',
          description: isArabic ? 'فشل في رفع الملف' : 'Upload failed',
          variant: 'destructive',
        });
      }
    }
  }, [files.length, maxFiles, moduleKey, toast]);

  const uploadFileWithAI = async (file: File, fileRecord: UploadedFile) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${moduleKey}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setFiles(prev => prev.map(f => 
        f.id === fileRecord.id 
          ? { ...f, progress: Math.min(f.progress + 10, 70) }
          : f
      ));
    }, 200);

    try {
      // Upload to storage
      const { data, error } = await supabase.storage
        .from('hr-documents')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('hr-documents')
        .getPublicUrl(fileName);

      updateFileStatus(fileRecord.id, 'processing', 80, urlData.publicUrl);
      clearInterval(progressInterval);

      if (enableAIProcessing) {
        // Upload document for AI processing
        const finalModuleKey = fileRecord.makeGlobal ? 'global' : moduleKey;
        await uploadDocument(file, finalModuleKey);

        updateFileStatus(fileRecord.id, 'uploaded', 100, urlData.publicUrl, true);
        
        toast({
          title: isArabic ? 'نجح' : 'Success',
          description: isArabic ? 'تم رفع الملف ومعالجته بالذكاء الاصطناعي بنجاح' : 'File uploaded and processed with AI successfully',
        });
      } else {
        updateFileStatus(fileRecord.id, 'uploaded', 100, urlData.publicUrl);
        
        toast({
          title: isArabic ? 'نجح' : 'Success',
          description: isArabic ? 'تم رفع الملف بنجاح' : 'File uploaded successfully',
        });
      }

      // Reload documents to update AI context
      await loadDocuments();

    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    }
  };

  const updateFileStatus = (
    id: string, 
    status: UploadedFile['status'], 
    progress: number, 
    url?: string,
    aiProcessed?: boolean
  ) => {
    setFiles(prev => prev.map(file => 
      file.id === id 
        ? { ...file, status, progress, url, aiProcessed }
        : file
    ));
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const toggleGlobalAccess = (id: string) => {
    setFiles(prev => prev.map(file => 
      file.id === id 
        ? { ...file, makeGlobal: !file.makeGlobal }
        : file
    ));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: maxSize * 1024 * 1024,
    disabled: files.length >= maxFiles,
  });

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {getModuleTitle(moduleKey)}
          {enableAIProcessing && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              AI Enhanced
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-primary bg-primary/10' 
              : 'border-muted-foreground/25 hover:border-primary/50'
            }
            ${files.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          
          {isDragActive ? (
            <p className="text-primary font-medium">
              {isArabic ? 'اسحب الملفات هنا' : 'Drop files here'}
            </p>
          ) : (
            <div className="space-y-2">
              <p className="font-medium">
                {isArabic ? 'اسحب الملفات هنا أو انقر للتحديد' : 'Drag & drop files here, or click to select'}
              </p>
              <p className="text-sm text-muted-foreground">
                {enableAIProcessing 
                  ? (isArabic ? 'تم تفعيل معالجة الذكاء الاصطناعي' : 'AI processing enabled')
                  : (isArabic ? `الحد الأقصى ${maxFiles} ملفات` : `Max ${maxFiles} files`)
                }
              </p>
              <Button variant="outline" size="sm" disabled={files.length >= maxFiles}>
                {isArabic ? 'تصفح الملفات' : 'Browse Files'}
              </Button>
            </div>
          )}
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {file.status === 'uploaded' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  {(file.status === 'uploading' || file.status === 'processing') && (
                    <File className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                  
                  {(file.status === 'uploading' || file.status === 'processing') && (
                    <div className="mt-1">
                      <Progress value={file.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {file.status === 'processing' ? (isArabic ? 'جاري المعالجة بالذكاء الاصطناعي...' : 'Processing with AI...') : (isArabic ? 'جاري الرفع...' : 'Uploading...')}
                      </p>
                    </div>
                  )}

                  {allowGlobalAccess && file.status === 'uploading' && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id={`global-${file.id}`}
                        checked={file.makeGlobal}
                        onCheckedChange={() => toggleGlobalAccess(file.id)}
                      />
                      <Label htmlFor={`global-${file.id}`} className="text-xs flex items-center gap-1">
                        <Database className="h-3 w-3" />
                        {isArabic ? 'جعله متاح لجميع الوحدات' : 'Make available to all modules'}
                      </Label>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <Badge variant={
                      file.status === 'uploaded' ? 'default' :
                      file.status === 'error' ? 'destructive' : 'secondary'
                    }>
                      {file.status === 'uploaded' ? (isArabic ? 'مرفوع' : 'Uploaded') :
                       file.status === 'error' ? (isArabic ? 'خطأ' : 'Error') :
                       file.status === 'processing' ? (isArabic ? 'معالجة' : 'Processing') :
                       (isArabic ? 'جاري الرفع' : 'Uploading')}
                    </Badge>
                    
                    {file.aiProcessed && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Brain className="h-3 w-3" />
                        {isArabic ? 'جاهز للذكاء الاصطناعي' : 'AI Ready'}
                      </Badge>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {enableAIProcessing && (
          <div className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4" />
              <span className="font-medium">{isArabic ? 'تم تفعيل معالجة الذكاء الاصطناعي' : 'AI Processing Enabled'}</span>
            </div>
            <p>
              {isArabic 
                ? 'سيتم معالجة الوثائق المرفوعة تلقائياً وإتاحتها للمساعد الذكي للتحليل الذكي والإجابة على الأسئلة عبر جميع وحدات عقل HR.'
                : 'Uploaded documents will be automatically processed and made available to the AI assistant for intelligent analysis and question answering across all AqlHR modules.'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedModuleDocumentUploader;