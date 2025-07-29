import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAPITranslations } from '@/hooks/useAPITranslations';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'uploaded' | 'error';
  progress: number;
  url?: string;
}

interface ModuleDocumentUploaderProps {
  moduleKey: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  onFilesUploaded?: (files: UploadedFile[]) => void;
  className?: string;
}

const ModuleDocumentUploader: React.FC<ModuleDocumentUploaderProps> = ({
  moduleKey,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ],
  onFilesUploaded,
  className = ""
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { t } = useAPITranslations();
  const { language } = useLanguage();
  const { toast } = useToast();
  const isArabic = language === 'ar';

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > maxFiles) {
      toast({
        title: t('common.error'),
        description: t('upload.maxFilesExceeded'),
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
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Upload files one by one
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const fileRecord = newFiles[i];
      
      try {
        await uploadFile(file, fileRecord);
      } catch (error) {
        console.error('Upload failed:', error);
        updateFileStatus(fileRecord.id, 'error', 0);
        toast({
          title: t('common.error'),
          description: t('upload.failed'),
          variant: 'destructive',
        });
      }
    }
  }, [files.length, maxFiles, moduleKey, t, toast]);

  const uploadFile = async (file: File, fileRecord: UploadedFile) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${moduleKey}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setFiles(prev => prev.map(f => 
        f.id === fileRecord.id 
          ? { ...f, progress: Math.min(f.progress + 10, 90) }
          : f
      ));
    }, 200);

    const { data, error } = await supabase.storage
      .from('hr-documents')
      .upload(fileName, file);

    clearInterval(progressInterval);

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('hr-documents')
      .getPublicUrl(fileName);

    updateFileStatus(fileRecord.id, 'uploaded', 100, urlData.publicUrl);
    
    toast({
      title: t('common.success'),
      description: t('upload.success'),
    });
  };

  const updateFileStatus = (
    id: string, 
    status: UploadedFile['status'], 
    progress: number, 
    url?: string
  ) => {
    setFiles(prev => prev.map(file => 
      file.id === id 
        ? { ...file, status, progress, url }
        : file
    ));
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
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
          {t(`${moduleKey}.documentUpload.title`)}
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
              {t('upload.dropHere')}
            </p>
          ) : (
            <div className="space-y-2">
              <p className="font-medium">
                {t('upload.dragAndDrop')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('upload.maxFiles')}
              </p>
              <Button variant="outline" size="sm" disabled={files.length >= maxFiles}>
                {t('upload.browse')}
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
                  {file.status === 'uploading' && (
                    <File className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                  
                  {file.status === 'uploading' && (
                    <Progress value={file.progress} className="mt-1 h-2" />
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={
                    file.status === 'uploaded' ? 'default' :
                    file.status === 'error' ? 'destructive' : 'secondary'
                  }>
                    {t(`upload.status.${file.status}`)}
                  </Badge>
                  
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
      </CardContent>
    </Card>
  );
};

export default ModuleDocumentUploader;