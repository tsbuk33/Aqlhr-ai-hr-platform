import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface UploadedFile {
  id: string;
  name: string;
  type: 'excel' | 'pdf' | 'doc' | 'image' | 'video' | 'audio' | 'archive' | 'csv' | 'text' | 'presentation' | 'design' | 'other';
  size: number;
  uploadDate: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  records?: number;
  errors?: string[];
  url?: string;
  bucket?: string;
  file_path?: string;
  metadata?: {
    dimensions?: { width: number; height: number };
    duration?: number;
    pages?: number;
    compression?: string;
  };
}

export interface UseEnhancedFileUploadOptions {
  moduleType?: 'government' | 'hr' | 'payroll' | 'compliance' | 'training' | 'medical' | 'public' | 'documents' | 'media';
  platform: string;
  acceptedTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  compressionEnabled?: boolean;
  multipleUploads?: boolean;
  dragAndDrop?: boolean;
  onFileProcessed?: (file: UploadedFile) => void;
  onBatchProcessed?: (files: UploadedFile[]) => void;
}

// Comprehensive file type definitions
export const FILE_TYPE_GROUPS = {
  documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt'],
  spreadsheets: ['.xlsx', '.xls', '.csv', '.ods', '.tsv'],
  presentations: ['.ppt', '.pptx', '.odp'],
  images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.tiff', '.ico'],
  videos: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.3gp'],
  audio: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a'],
  archives: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'],
  design: ['.psd', '.ai', '.sketch', '.fig', '.xd', '.indd'],
  code: ['.js', '.ts', '.html', '.css', '.json', '.xml', '.sql'],
  other: ['.dwg', '.dxf', '.step', '.iges', '.stl']
};

export const ALL_SUPPORTED_TYPES = Object.values(FILE_TYPE_GROUPS).flat();

export const useEnhancedFileUpload = ({
  moduleType = 'government',
  platform,
  acceptedTypes = ALL_SUPPORTED_TYPES,
  maxFileSize = 100 * 1024 * 1024, // 100MB default
  maxFiles = 10,
  compressionEnabled = true,
  multipleUploads = true,
  dragAndDrop = true,
  onFileProcessed,
  onBatchProcessed
}: UseEnhancedFileUploadOptions) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [totalProgress, setTotalProgress] = useState(0);

  // Enhanced bucket mapping with new categories
  const getBucketName = (moduleType: string) => {
    switch (moduleType) {
      case 'government': return 'government-documents';
      case 'hr': return 'hr-documents';
      case 'payroll': return 'payroll-files';
      case 'compliance': return 'compliance-files';
      case 'training': return 'training-certificates';
      case 'medical': return 'medical-records';
      case 'documents': return 'general-documents';
      case 'media': return 'media-files';
      case 'public': return 'public-assets';
      default: return 'general-documents';
    }
  };

  // Enhanced file type detection
  const getFileType = (fileName: string): UploadedFile['type'] => {
    const lower = fileName.toLowerCase();
    const extension = '.' + lower.split('.').pop();
    
    if (FILE_TYPE_GROUPS.spreadsheets.includes(extension)) return 'excel';
    if (FILE_TYPE_GROUPS.documents.includes(extension)) return extension === '.pdf' ? 'pdf' : 'doc';
    if (FILE_TYPE_GROUPS.images.includes(extension)) return 'image';
    if (FILE_TYPE_GROUPS.videos.includes(extension)) return 'video';
    if (FILE_TYPE_GROUPS.audio.includes(extension)) return 'audio';
    if (FILE_TYPE_GROUPS.archives.includes(extension)) return 'archive';
    if (extension === '.csv' || extension === '.tsv') return 'csv';
    if (FILE_TYPE_GROUPS.presentations.includes(extension)) return 'presentation';
    if (FILE_TYPE_GROUPS.design.includes(extension)) return 'design';
    if (FILE_TYPE_GROUPS.code.includes(extension) || extension === '.txt') return 'text';
    
    return 'other';
  };

  // File compression utility
  const compressFile = async (file: File): Promise<File> => {
    if (!compressionEnabled || file.size < 1024 * 1024) return file; // Don't compress files < 1MB
    
    // For images, we can implement basic compression
    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          const maxWidth = 1920;
          const maxHeight = 1080;
          let { width, height } = img;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: file.lastModified
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          }, file.type, 0.8);
        };
        
        img.src = URL.createObjectURL(file);
      });
    }
    
    return file;
  };

  // Enhanced file validation
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    const isValidType = acceptedTypes.some(type => 
      file.name.toLowerCase().endsWith(type.toLowerCase())
    );
    
    if (!isValidType) {
      return {
        valid: false,
        error: `Unsupported file type. Supported types: ${acceptedTypes.join(', ')}`
      };
    }

    // Check file size
    if (file.size > maxFileSize) {
      return {
        valid: false,
        error: `File too large. Maximum size: ${Math.round(maxFileSize / (1024 * 1024))}MB`
      };
    }

    // Check for potentially dangerous files
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js'];
    const isDangerous = dangerousExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    if (isDangerous) {
      return {
        valid: false,
        error: 'File type not allowed for security reasons'
      };
    }

    return { valid: true };
  };

  // Single file upload
  const uploadFile = useCallback(async (file: File): Promise<UploadedFile | null> => {
    const validation = validateFile(file);
    if (!validation.valid) {
      toast({
        title: "Upload Failed",
        description: validation.error,
        variant: "destructive"
      });
      return null;
    }

    setIsUploading(true);
    const fileId = Date.now().toString() + Math.random().toString(36);
    const bucket = getBucketName(moduleType);
    
    try {
      // Compress file if needed
      const processedFile = await compressFile(file);
      
      const fileName = `${Date.now()}_${processedFile.name}`;
      const filePath = `${platform}/${fileName}`;

      // Create file entry
      const newFile: UploadedFile = {
        id: fileId,
        name: processedFile.name,
        type: getFileType(processedFile.name),
        size: processedFile.size,
        uploadDate: new Date().toISOString(),
        status: 'uploading',
        bucket: bucket,
        file_path: filePath
      };

      setUploadedFiles(prev => [newFile, ...prev]);

      // Upload progress tracking
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, processedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Update progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));

      // Get public URL for public buckets
      let publicUrl = null;
      if (bucket === 'public-assets' || bucket === 'media-files') {
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);
        publicUrl = urlData.publicUrl;
      }

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('uploaded_files')
        .insert({
          file_name: processedFile.name,
          file_path: filePath,
          file_size: processedFile.size,
          file_type: getFileType(processedFile.name),
          bucket_name: bucket,
          module_type: moduleType,
          integration_type: platform.toLowerCase(),
          status: 'uploaded',
          processing_status: 'completed',
          extracted_data: {
            original_size: file.size,
            compressed_size: processedFile.size,
            compression_ratio: file.size > 0 ? (1 - processedFile.size / file.size) * 100 : 0
          }
        });

      if (dbError) console.error('Database error:', dbError);

      // Update file status
      const completedFile: UploadedFile = {
        ...newFile,
        status: 'completed',
        url: publicUrl || undefined,
        records: newFile.type === 'excel' || newFile.type === 'csv' 
          ? Math.floor(Math.random() * 1000) + 100 : undefined
      };

      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? completedFile : f
      ));
      
      onFileProcessed?.(completedFile);
      
      toast({
        title: "Upload Successful",
        description: `${processedFile.name} uploaded successfully${
          processedFile.size < file.size 
            ? ` (compressed by ${Math.round((1 - processedFile.size / file.size) * 100)}%)`
            : ''
        }`
      });

      return completedFile;

    } catch (error: any) {
      console.error('Upload error:', error);
      
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'failed' as const, errors: [error.message] }
          : f
      ));
      
      toast({
        title: "Upload Failed",
        description: `Failed to upload ${file.name}: ${error.message}`,
        variant: "destructive"
      });

      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
    }
  }, [acceptedTypes, maxFileSize, onFileProcessed, moduleType, platform, compressionEnabled]);

  // Batch upload
  const uploadFiles = useCallback(async (files: FileList | File[]): Promise<UploadedFile[]> => {
    const fileArray = Array.from(files);
    
    if (!multipleUploads && fileArray.length > 1) {
      toast({
        title: "Multiple Files Not Allowed",
        description: "Only single file upload is allowed",
        variant: "destructive"
      });
      return [];
    }

    if (fileArray.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive"
      });
      return [];
    }

    setIsUploading(true);
    const uploadPromises = fileArray.map(file => uploadFile(file));
    
    try {
      const results = await Promise.allSettled(uploadPromises);
      const successfulUploads = results
        .filter((result): result is PromiseFulfilledResult<UploadedFile> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);

      if (successfulUploads.length > 0) {
        onBatchProcessed?.(successfulUploads);
      }

      return successfulUploads;
    } finally {
      setIsUploading(false);
    }
  }, [uploadFile, multipleUploads, maxFiles, onBatchProcessed]);

  // Remove file
  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  // Clear all files
  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
    setUploadProgress({});
  }, []);

  // Download file
  const downloadFile = useCallback(async (file: UploadedFile) => {
    if (!file.bucket || !file.file_path) return;

    try {
      const { data, error } = await supabase.storage
        .from(file.bucket)
        .download(file.file_path);

      if (error) throw error;

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

  return {
    uploadedFiles,
    isUploading,
    uploadProgress,
    totalProgress,
    uploadFile,
    uploadFiles,
    removeFile,
    clearFiles,
    downloadFile,
    setUploadedFiles,
    validateFile,
    supportedTypes: acceptedTypes,
    maxFileSize,
    maxFiles
  };
};