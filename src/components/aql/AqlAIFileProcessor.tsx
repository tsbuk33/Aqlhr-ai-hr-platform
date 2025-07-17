import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Upload, CheckCircle, AlertCircle, X, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FileProcessorProps {
  platform?: string;
  moduleType?: string;
  onFileProcessed?: (result: any) => void;
  acceptedTypes?: string[];
  maxFileSize?: number;
}

interface ProcessingFile {
  file: File;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  aiResults?: any;
  error?: string;
  id: string;
}

export const AqlAIFileProcessor: React.FC<FileProcessorProps> = ({
  platform = 'aqlhr',
  moduleType = 'general',
  onFileProcessed,
  acceptedTypes = [
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff',
    '.zip', '.rar', '.7z', '.tar', '.gz',
    '.ai', '.psd', '.sketch', '.fig',
    '.txt', '.csv', '.json', '.xml'
  ],
  maxFileSize = 50 * 1024 * 1024 // 50MB
}) => {
  const [processingFiles, setProcessingFiles] = useState<ProcessingFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Process file with AI
  const processFileWithAI = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('platform', platform);
    formData.append('moduleType', moduleType);

    const { data, error } = await supabase.functions.invoke('ai-document-processor', {
      body: formData
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  // Upload to storage
  const uploadToStorage = async (file: File, processingId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${platform}/${moduleType}/${processingId}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('company-documents')
      .upload(fileName, file);

    if (error) {
      throw new Error(error.message);
    }

    return data.path;
  };

  // Update file progress
  const updateFileProgress = (id: string, updates: Partial<ProcessingFile>) => {
    setProcessingFiles(prev => 
      prev.map(f => f.id === id ? { ...f, ...updates } : f)
    );
  };

  // Process individual file
  const processFile = async (file: File) => {
    const processingId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const processingFile: ProcessingFile = {
      file,
      status: 'uploading',
      progress: 0,
      id: processingId
    };

    setProcessingFiles(prev => [...prev, processingFile]);

    try {
      // Upload phase
      updateFileProgress(processingId, { progress: 25 });
      const filePath = await uploadToStorage(file, processingId);
      
      // Processing phase
      updateFileProgress(processingId, { 
        status: 'processing', 
        progress: 50 
      });
      
      const aiResults = await processFileWithAI(file);
      
      // Completion phase
      updateFileProgress(processingId, {
        status: 'completed',
        progress: 100,
        aiResults
      });

      onFileProcessed?.(aiResults);

    } catch (error) {
      updateFileProgress(processingId, {
        status: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : 'Processing failed'
      });
    }
  };

  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Process files sequentially to avoid overwhelming the system
      for (const file of acceptedFiles) {
        await processFile(file);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [platform, moduleType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: maxFileSize,
    disabled: isProcessing
  });

  // Clear completed files
  const clearCompleted = () => {
    setProcessingFiles(prev => 
      prev.filter(f => f.status !== 'completed')
    );
  };

  // Remove specific file
  const removeFile = (id: string) => {
    setProcessingFiles(prev => prev.filter(f => f.id !== id));
  };

  const getStatusIcon = (status: ProcessingFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            AqlHR AI Document Processor
          </CardTitle>
          <CardDescription>
            Upload company documents for intelligent processing and integration with AqlHR modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to select files
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {acceptedTypes.slice(0, 6).map(type => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
              {acceptedTypes.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{acceptedTypes.length - 6} more
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum file size: {Math.round(maxFileSize / (1024 * 1024))}MB
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Processing Files */}
      {processingFiles.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Processing Status</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearCompleted}
              disabled={!processingFiles.some(f => f.status === 'completed')}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Completed
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {processingFiles.map((file) => (
              <div key={file.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getStatusIcon(file.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {file.status}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {file.status !== 'completed' && (
                  <Progress 
                    value={file.progress} 
                    className="h-2"
                  />
                )}

                {file.error && (
                  <Alert className="border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {file.error}
                    </AlertDescription>
                  </Alert>
                )}

                {file.aiResults && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-2">
                    <h4 className="text-sm font-medium text-green-800 mb-2">
                      AI Processing Results
                    </h4>
                    <div className="text-xs text-green-700 space-y-1">
                      <p>• Document type: {file.aiResults.documentType}</p>
                      <p>• Confidence: {file.aiResults.confidence}%</p>
                      <p>• Data extracted: {file.aiResults.extractedFields} fields</p>
                      <p>• Processing time: {file.aiResults.processingTime}ms</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};