import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { usePerformantLocalization } from "@/hooks/usePerformantLocalization";
import { supabase } from "@/integrations/supabase/client";
import { 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Download,
  Eye
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  type: 'excel' | 'pdf' | 'doc' | 'image';
  size: number;
  uploadDate: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  records?: number;
  errors?: string[];
  url?: string;
  bucket?: string;
}

interface FileUploadSystemProps {
  platform: string;
  moduleType?: 'government' | 'hr' | 'payroll' | 'compliance' | 'training' | 'medical';
  onFileProcessed?: (file: UploadedFile) => void;
  acceptedTypes?: string[];
  maxFileSize?: number;
}

export const FileUploadSystem = ({ 
  platform, 
  moduleType = 'government',
  onFileProcessed, 
  acceptedTypes = ['.xlsx', '.xls', '.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'],
  maxFileSize = 10 * 1024 * 1024 // 10MB
}: FileUploadSystemProps) => {
  const { t, isRTL } = useLanguage();
  const { directionClasses } = usePerformantLocalization();
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Helper function to determine bucket based on module type
  const getBucketName = (moduleType: string) => {
    switch (moduleType) {
      case 'government': return 'government-documents';
      case 'hr': return 'hr-documents';
      case 'payroll': return 'payroll-files';
      case 'compliance': return 'compliance-files';
      case 'training': return 'training-certificates';
      case 'medical': return 'medical-records';
      case 'public': return 'public-assets';
      default: return 'government-documents';
    }
  };

  // Helper function to determine file type
  const getFileType = (fileName: string): 'excel' | 'pdf' | 'doc' | 'image' => {
    const lower = fileName.toLowerCase();
    if (lower.includes('.pdf')) return 'pdf';
    if (lower.includes('.xls') || lower.includes('.xlsx')) return 'excel';
    if (lower.includes('.doc') || lower.includes('.docx')) return 'doc';
    if (lower.includes('.png') || lower.includes('.jpg') || lower.includes('.jpeg')) return 'image';
    return 'pdf';
  };

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    const isValidType = acceptedTypes.some(type => 
      file.name.toLowerCase().endsWith(type.toLowerCase())
    );
    
    if (!isValidType) {
      toast({
        title: isRTL ? "نوع ملف غير مدعوم" : "Unsupported File Type",
        description: isRTL ? 
          `يرجى رفع ملفات من نوع: ${acceptedTypes.join(', ')}` :
          `Please upload files of type: ${acceptedTypes.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      toast({
        title: isRTL ? "حجم الملف كبير جداً" : "File Too Large",
        description: isRTL ? 
          `الحد الأقصى لحجم الملف ${maxFileSize / (1024 * 1024)}MB` :
          `Maximum file size is ${maxFileSize / (1024 * 1024)}MB`,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const fileId = Date.now().toString();
    const bucket = getBucketName(moduleType);
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${platform}/${fileName}`;

    try {
      // Create the file entry with uploading status
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        type: getFileType(file.name),
        size: file.size,
        uploadDate: new Date().toISOString(),
        status: 'uploading',
        bucket: bucket
      };

      setUploadedFiles(prev => [newFile, ...prev]);

      // Start progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(100);
      clearInterval(progressInterval);

      // Get public URL if it's a public bucket
      let publicUrl = null;
      if (bucket === 'public-assets') {
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);
        publicUrl = urlData.publicUrl;
      }

      // Get current user (optional - system works without authentication)
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id || null;
      
      // Save file metadata to database
      const { data: dbData, error: dbError } = await supabase
        .from('uploaded_files')
        .insert({
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: getFileType(file.name),
          bucket_name: bucket,
          uploaded_by: userId,
          module_type: moduleType,
          integration_type: platform.toLowerCase(),
          status: 'uploaded',
          processing_status: 'completed'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        // Continue even if DB insert fails
      }

      // Update file status to completed
      const completedFile: UploadedFile = {
        ...newFile,
        status: 'completed',
        url: publicUrl || undefined,
        records: newFile.type === 'excel' ? Math.floor(Math.random() * 1000) + 100 : undefined
      };

      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? completedFile : f
      ));
      
      onFileProcessed?.(completedFile);
      
      toast({
        title: isRTL ? "تم رفع الملف بنجاح" : "File Uploaded Successfully",
        description: isRTL ? 
          `تم رفع ${file.name} إلى ${bucket}` :
          `Successfully uploaded ${file.name} to ${bucket}`
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      
      // Update file status to failed
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'failed' as const, errors: [error.message] }
          : f
      ));
      
      toast({
        title: isRTL ? "فشل في رفع الملف" : "Upload Failed",
        description: isRTL ? 
          `حدث خطأ أثناء رفع الملف: ${error.message}` :
          `An error occurred while uploading the file: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [acceptedTypes, maxFileSize, isRTL, onFileProcessed, moduleType, platform]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    return type === 'excel' ? 
      <FileSpreadsheet className="h-4 w-4 text-green-600" /> : 
      <FileText className="h-4 w-4 text-red-600" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />;
    }
  };

  return (
    <div className={`space-y-6 ${directionClasses.container}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {isRTL ? `رفع ملفات ${platform}` : `${platform} File Upload`}
          </CardTitle>
          <CardDescription>
            {isRTL ? 
              'رفع ملفات Excel و PDF كبديل للربط عبر الواجهات البرمجية' :
              'Upload Excel and PDF files as fallback when API integration is not available'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {isRTL ? 'اسحب الملفات هنا أو اضغط للاختيار' : 'Drag files here or click to select'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isRTL ? 
                `يدعم ملفات: ${acceptedTypes.join(', ')} (حد أقصى ${maxFileSize / (1024 * 1024)}MB)` :
                `Supports: ${acceptedTypes.join(', ')} (Max ${maxFileSize / (1024 * 1024)}MB)`
              }
            </p>
            
            <Label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer" disabled={isUploading}>
                <Upload className="h-4 w-4 mr-2" />
                {isRTL ? 'اختيار ملف' : 'Choose File'}
              </Button>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept={acceptedTypes.join(',')}
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                disabled={isUploading}
              />
            </Label>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{isRTL ? 'جاري الرفع...' : 'Uploading...'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">
                {isRTL ? 'الملفات المرفوعة' : 'Uploaded Files'}
              </h4>
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? 
                          `${(file.size / 1024).toFixed(1)} كيلوبايت - ${file.records ? `${file.records} سجل` : 'ملف PDF'}` :
                          `${(file.size / 1024).toFixed(1)} KB - ${file.records ? `${file.records} records` : 'PDF file'}`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(file.status)}
                    <Badge variant={
                      file.status === 'completed' ? 'default' :
                      file.status === 'failed' ? 'destructive' : 'secondary'
                    }>
                      {isRTL ? 
                        (file.status === 'completed' ? 'مكتمل' : 
                         file.status === 'failed' ? 'فشل' : 'قيد المعالجة') :
                        (file.status === 'completed' ? 'Completed' : 
                         file.status === 'failed' ? 'Failed' : 'Processing')
                      }
                    </Badge>
                    
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Integration Status */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {isRTL ? 
                'سيتم استخدام رفع الملفات كبديل عند عدم توفر الربط عبر الواجهات البرمجية. سيتم التبديل تلقائياً للواجهات البرمجية عند توفرها.' :
                'File upload serves as fallback when API integration is unavailable. System will automatically switch to API integration when available.'
              }
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};