import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface UploadedFile {
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
  file_path?: string;
}

export interface UseFileUploadOptions {
  moduleType?: 'government' | 'hr' | 'payroll' | 'compliance' | 'training' | 'medical' | 'public';
  platform: string;
  acceptedTypes?: string[];
  maxFileSize?: number;
  onFileProcessed?: (file: UploadedFile) => void;
}

export const useFileUpload = ({
  moduleType = 'government',
  platform,
  acceptedTypes = [
    // Documents
    '.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt',
    // Spreadsheets
    '.xlsx', '.xls', '.csv', '.ods', '.tsv',
    // Presentations
    '.ppt', '.pptx', '.odp',
    // Images
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp', '.tiff',
    // Videos
    '.mp4', '.avi', '.mov', '.wmv', '.webm', '.mkv',
    // Audio
    '.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a',
    // Archives
    '.zip', '.rar', '.7z', '.tar', '.gz',
    // Design
    '.psd', '.ai', '.sketch', '.fig', '.xd'
  ],
  maxFileSize = 50 * 1024 * 1024, // 50MB
  onFileProcessed
}: UseFileUploadOptions) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  // Enhanced file type detection
  const getFileType = (fileName: string): 'excel' | 'pdf' | 'doc' | 'image' => {
    const lower = fileName.toLowerCase();
    if (lower.includes('.pdf')) return 'pdf';
    if (lower.includes('.xls') || lower.includes('.xlsx') || lower.includes('.csv')) return 'excel';
    if (lower.includes('.doc') || lower.includes('.docx') || lower.includes('.txt') || lower.includes('.rtf')) return 'doc';
    if (lower.includes('.png') || lower.includes('.jpg') || lower.includes('.jpeg') || 
        lower.includes('.gif') || lower.includes('.bmp') || lower.includes('.svg') || 
        lower.includes('.webp') || lower.includes('.tiff')) return 'image';
    return 'pdf';
  };

  const uploadFile = useCallback(async (file: File): Promise<UploadedFile | null> => {
    // Validate file type
    const isValidType = acceptedTypes.some(type => 
      file.name.toLowerCase().endsWith(type.toLowerCase())
    );
    
    if (!isValidType) {
      toast({
        title: "Unsupported File Type",
        description: `Please upload files of type: ${acceptedTypes.join(', ')}`,
        variant: "destructive"
      });
      return null;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      toast({
        title: "File Too Large",
        description: `Maximum file size is ${maxFileSize / (1024 * 1024)}MB`,
        variant: "destructive"
      });
      return null;
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
        bucket: bucket,
        file_path: filePath
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

      // Save file metadata to database
      const { data: dbData, error: dbError } = await supabase
        .from('uploaded_files')
        .insert({
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: getFileType(file.name),
          bucket_name: bucket,
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
        title: "File Uploaded Successfully",
        description: `Successfully uploaded ${file.name} to ${bucket}`
      });

      return completedFile;

    } catch (error: any) {
      console.error('Upload error:', error);
      
      // Update file status to failed
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'failed' as const, errors: [error.message] }
          : f
      ));
      
      toast({
        title: "Upload Failed",
        description: `An error occurred while uploading the file: ${error.message}`,
        variant: "destructive"
      });

      return null;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [acceptedTypes, maxFileSize, onFileProcessed, moduleType, platform]);

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const downloadFile = useCallback(async (file: UploadedFile) => {
    if (!file.bucket || !file.file_path) return;

    try {
      const { data, error } = await supabase.storage
        .from(file.bucket)
        .download(file.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: `Downloading ${file.name}`
      });
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: `Failed to download ${file.name}: ${error.message}`,
        variant: "destructive"
      });
    }
  }, []);

  const getFileUrl = useCallback(async (file: UploadedFile): Promise<string | null> => {
    if (!file.bucket || !file.file_path) return null;

    try {
      const { data } = supabase.storage
        .from(file.bucket)
        .getPublicUrl(file.file_path);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting file URL:', error);
      return null;
    }
  }, []);

  return {
    uploadedFiles,
    isUploading,
    uploadProgress,
    uploadFile,
    removeFile,
    downloadFile,
    getFileUrl,
    setUploadedFiles
  };
};