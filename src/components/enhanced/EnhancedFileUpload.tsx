import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEnhancedFileUpload, FILE_TYPE_GROUPS, UploadedFile } from '@/hooks/useEnhancedFileUpload';
import { 
  Upload, 
  X, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Image, 
  Video, 
  Music, 
  Archive, 
  FileCode,
  Presentation,
  Palette,
  Link,
  Cloud,
  HardDrive,
  Smartphone
} from 'lucide-react';

interface EnhancedFileUploadProps {
  title?: string;
  description?: string;
  moduleType?: 'government' | 'hr' | 'payroll' | 'compliance' | 'training' | 'medical' | 'public' | 'documents' | 'media';
  platform: string;
  acceptedTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  compressionEnabled?: boolean;
  multipleUploads?: boolean;
  showPresets?: boolean;
  showUploadMethods?: boolean;
  onFileProcessed?: (file: UploadedFile) => void;
  onBatchProcessed?: (files: UploadedFile[]) => void;
}

const getFileIcon = (type: UploadedFile['type']) => {
  switch (type) {
    case 'excel': case 'csv': return FileSpreadsheet;
    case 'pdf': case 'doc': return FileText;
    case 'image': return Image;
    case 'video': return Video;
    case 'audio': return Music;
    case 'archive': return Archive;
    case 'text': return FileCode;
    case 'presentation': return Presentation;
    case 'design': return Palette;
    default: return FileText;
  }
};

const FILE_TYPE_PRESETS = {
  'Documents': FILE_TYPE_GROUPS.documents.concat(FILE_TYPE_GROUPS.spreadsheets, FILE_TYPE_GROUPS.presentations),
  'Media Files': FILE_TYPE_GROUPS.images.concat(FILE_TYPE_GROUPS.videos, FILE_TYPE_GROUPS.audio),
  'Design Files': FILE_TYPE_GROUPS.design.concat(FILE_TYPE_GROUPS.images),
  'Data Files': FILE_TYPE_GROUPS.spreadsheets.concat(['.csv', '.json', '.xml']),
  'Archive Files': FILE_TYPE_GROUPS.archives,
  'All Files': Object.values(FILE_TYPE_GROUPS).flat()
};

export const EnhancedFileUpload = ({
  title = "Enhanced File Upload",
  description = "Upload files with advanced features and multiple format support",
  moduleType = 'documents',
  platform,
  acceptedTypes,
  maxFileSize = 100 * 1024 * 1024,
  maxFiles = 10,
  compressionEnabled = true,
  multipleUploads = true,
  showPresets = true,
  showUploadMethods = true,
  onFileProcessed,
  onBatchProcessed
}: EnhancedFileUploadProps) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('All Files');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'local' | 'url' | 'cloud'>('local');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentAcceptedTypes = acceptedTypes || FILE_TYPE_PRESETS[selectedPreset] || FILE_TYPE_PRESETS['All Files'];

  const {
    uploadedFiles,
    isUploading,
    uploadProgress,
    uploadFile,
    uploadFiles,
    removeFile,
    clearFiles,
    downloadFile,
    validateFile
  } = useEnhancedFileUpload({
    moduleType,
    platform,
    acceptedTypes: currentAcceptedTypes,
    maxFileSize,
    maxFiles,
    compressionEnabled,
    multipleUploads,
    onFileProcessed,
    onBatchProcessed
  });

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    uploadFiles(files);
  }, [uploadFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleUrlUpload = useCallback(async () => {
    if (!urlInput.trim()) return;

    try {
      const response = await fetch(urlInput);
      if (!response.ok) throw new Error('Failed to fetch file from URL');

      const blob = await response.blob();
      const filename = urlInput.split('/').pop() || 'downloaded-file';
      const file = new File([blob], filename, { type: blob.type });

      await uploadFile(file);
      setUrlInput('');
    } catch (error: any) {
      console.error('URL upload error:', error);
    }
  }, [urlInput, uploadFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-brand-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* File Type Presets */}
        {showPresets && (
          <div className="space-y-2">
            <label className="text-sm font-medium">File Type Preset:</label>
            <Tabs value={selectedPreset} onValueChange={setSelectedPreset} className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                {Object.keys(FILE_TYPE_PRESETS).map((preset) => (
                  <TabsTrigger key={preset} value={preset} className="text-xs">
                    {preset.replace(' Files', '')}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Upload Methods */}
        {showUploadMethods && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Method:</label>
            <div className="flex gap-2">
              <Button
                variant={uploadMethod === 'local' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUploadMethod('local')}
                className="flex items-center gap-2"
              >
                <HardDrive className="h-4 w-4" />
                Local Files
              </Button>
              <Button
                variant={uploadMethod === 'url' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUploadMethod('url')}
                className="flex items-center gap-2"
              >
                <Link className="h-4 w-4" />
                From URL
              </Button>
              <Button
                variant={uploadMethod === 'cloud' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setUploadMethod('cloud')}
                className="flex items-center gap-2"
              >
                <Cloud className="h-4 w-4" />
                Cloud Storage
              </Button>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="space-y-4">
          {uploadMethod === 'local' && (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                isDragOver 
                  ? 'border-brand-primary bg-brand-primary/5 scale-105' 
                  : 'border-muted-foreground/25 hover:border-brand-primary/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {isUploading ? (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-brand-primary animate-bounce" />
                  <div>
                    <p className="font-medium">Uploading Files...</p>
                    <p className="text-sm text-muted-foreground">
                      Processing {Object.keys(uploadProgress).length} file(s)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {Object.entries(FILE_TYPE_GROUPS).slice(0, 4).map(([category, types]) => {
                      const Icon = category === 'images' ? Image : 
                                 category === 'documents' ? FileText :
                                 category === 'spreadsheets' ? FileSpreadsheet : FileCode;
                      return <Icon key={category} className="h-8 w-8 text-muted-foreground" />;
                    })}
                  </div>
                  <div>
                    <p className="font-medium text-lg mb-2">
                      {multipleUploads ? 'Drop files here or click to browse' : 'Drop file here or click to browse'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports: {currentAcceptedTypes.slice(0, 5).join(', ')}
                      {currentAcceptedTypes.length > 5 && ` +${currentAcceptedTypes.length - 5} more`}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Max size: {formatFileSize(maxFileSize)} • Max files: {maxFiles}
                      {compressionEnabled && ' • Auto-compression enabled'}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept={currentAcceptedTypes.join(',')}
                      multiple={multipleUploads}
                      onChange={(e) => handleFileSelect(e.target.files)}
                    />
                    <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                      <Upload className="h-4 w-4" />
                      Browse Files
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {uploadMethod === 'url' && (
            <div className="space-y-4 p-6 border rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Link className="h-5 w-5 text-brand-primary" />
                <h3 className="font-medium">Upload from URL</h3>
              </div>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Enter file URL (e.g., https://example.com/file.pdf)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <Button 
                  onClick={handleUrlUpload}
                  disabled={!urlInput.trim() || isUploading}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>
          )}

          {uploadMethod === 'cloud' && (
            <div className="space-y-4 p-6 border rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Cloud className="h-5 w-5 text-brand-primary" />
                <h3 className="font-medium">Cloud Storage Integration</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="flex items-center gap-2 h-12">
                  <Cloud className="h-5 w-5" />
                  Google Drive
                </Button>
                <Button variant="outline" className="flex items-center gap-2 h-12">
                  <Cloud className="h-5 w-5" />
                  OneDrive
                </Button>
                <Button variant="outline" className="flex items-center gap-2 h-12">
                  <Cloud className="h-5 w-5" />
                  Dropbox
                </Button>
                <Button variant="outline" className="flex items-center gap-2 h-12">
                  <Smartphone className="h-5 w-5" />
                  Mobile Camera
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Cloud integrations coming soon
              </p>
            </div>
          )}
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Uploaded Files ({uploadedFiles.length})</h3>
              <Button variant="outline" size="sm" onClick={clearFiles}>
                Clear All
              </Button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {uploadedFiles.map((file) => {
                const Icon = getFileIcon(file.type);
                const progress = uploadProgress[file.id] || (file.status === 'completed' ? 100 : 0);
                
                return (
                  <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Icon className="h-8 w-8 text-brand-primary flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{file.name}</p>
                        <Badge variant={
                          file.status === 'completed' ? 'default' :
                          file.status === 'failed' ? 'destructive' :
                          'secondary'
                        }>
                          {file.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span className="capitalize">{file.type}</span>
                        {file.records && (
                          <>
                            <span>•</span>
                            <span>{file.records} records</span>
                          </>
                        )}
                      </div>
                      
                      {file.status === 'uploading' && (
                        <div className="mt-2">
                          <Progress value={progress} className="h-1" />
                        </div>
                      )}
                      
                      {file.errors && file.errors.length > 0 && (
                        <p className="text-sm text-red-600 mt-1">{file.errors[0]}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-1">
                      {file.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadFile(file)}
                          className="p-2"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload Info */}
        <div className="p-4 bg-brand-primary/5 rounded-lg">
          <div className="flex items-start gap-3">
            <Upload className="h-5 w-5 text-brand-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Enhanced Upload Features</h4>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                <li>• Supports {Object.values(FILE_TYPE_GROUPS).flat().length}+ file formats</li>
                <li>• Automatic file compression and optimization</li>
                <li>• Batch upload with progress tracking</li>
                <li>• Drag & drop, URL, and cloud storage support</li>
                <li>• Real-time integration with AqlHR modules</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};