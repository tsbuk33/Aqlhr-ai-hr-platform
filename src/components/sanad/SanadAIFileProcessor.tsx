import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FileProcessorProps {
  platform: string;
  moduleType: string;
  onFileProcessed?: (file: any) => void;
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

export const SanadAIFileProcessor: React.FC<FileProcessorProps> = ({
  platform,
  moduleType,
  onFileProcessed,
  acceptedTypes = ['.xlsx', '.xls', '.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'],
  maxFileSize = 10 * 1024 * 1024 // 10MB
}) => {
  const [processingFiles, setProcessingFiles] = useState<ProcessingFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processFileWithAI = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('platform', platform);
    formData.append('moduleType', moduleType);

    const response = await supabase.functions.invoke('ai-document-processing', {
      body: formData
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  };

  const uploadToStorage = async (file: File, processingId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${platform}/${moduleType}/${processingId}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('government-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    return data.path;
  };

  const updateFileProgress = (id: string, updates: Partial<ProcessingFile>) => {
    setProcessingFiles(prev => 
      prev.map(f => f.id === id ? { ...f, ...updates } : f)
    );
  };

  const processFile = async (file: File) => {
    const processingId = Date.now().toString();
    const newFile: ProcessingFile = {
      file,
      status: 'uploading',
      progress: 0,
      id: processingId
    };

    setProcessingFiles(prev => [...prev, newFile]);

    try {
      // Step 1: Upload to storage
      updateFileProgress(processingId, { progress: 25 });
      const filePath = await uploadToStorage(file, processingId);
      
      // Step 2: Process with AI
      updateFileProgress(processingId, { status: 'processing', progress: 50 });
      const aiResults = await processFileWithAI(file);
      
      // Step 3: Complete processing
      updateFileProgress(processingId, { 
        status: 'completed', 
        progress: 100, 
        aiResults 
      });

      toast({
        title: "File processed successfully",
        description: `${file.name} has been uploaded and processed with AI insights.`,
      });

      onFileProcessed?.({
        file,
        filePath,
        aiResults,
        platform,
        moduleType
      });

    } catch (error) {
      console.error('File processing error:', error);
      updateFileProgress(processingId, { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      toast({
        title: "Processing failed",
        description: `Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsProcessing(true);
    
    for (const file of acceptedFiles) {
      if (file.size > maxFileSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the maximum file size of ${Math.round(maxFileSize / 1024 / 1024)}MB`,
          variant: "destructive",
        });
        continue;
      }
      
      await processFile(file);
    }
    
    setIsProcessing(false);
  }, [maxFileSize, platform, moduleType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[`application/*`] = [type];
      acc[`image/*`] = [type];
      return acc;
    }, {} as Record<string, string[]>),
    disabled: isProcessing
  });

  const clearCompleted = () => {
    setProcessingFiles(prev => prev.filter(f => f.status !== 'completed'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {platform} File Upload
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload Excel and PDF files as fallback when API integration is not available
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              ${isProcessing ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop files here' : 'Drag files here or click to select'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports: {acceptedTypes.join(', ')} (Max {Math.round(maxFileSize / 1024 / 1024)}MB)
                </p>
              </div>
              <Button variant="outline" disabled={isProcessing}>
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              File upload serves as fallback when API integration is unavailable. System will automatically switch to API integration when available.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {processingFiles.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Processing Files</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearCompleted}
              disabled={processingFiles.every(f => f.status !== 'completed')}
            >
              Clear Completed
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {processingFiles.map((pFile) => (
              <div key={pFile.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">{pFile.file.name}</span>
                    <Badge variant={
                      pFile.status === 'completed' ? 'default' :
                      pFile.status === 'error' ? 'destructive' :
                      'secondary'
                    }>
                      {pFile.status === 'uploading' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                      {pFile.status === 'processing' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                      {pFile.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {pFile.status === 'error' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {pFile.status.charAt(0).toUpperCase() + pFile.status.slice(1)}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(pFile.file.size / 1024)}KB
                  </span>
                </div>
                
                {pFile.status !== 'completed' && pFile.status !== 'error' && (
                  <Progress value={pFile.progress} className="h-2" />
                )}
                
                {pFile.error && (
                  <Alert variant="destructive">
                    <AlertDescription>{pFile.error}</AlertDescription>
                  </Alert>
                )}
                
                {pFile.aiResults && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium mb-2">AI Processing Results:</p>
                    <div className="text-xs space-y-1">
                      <p>Language: {pFile.aiResults.language || 'Auto-detected'}</p>
                      <p>Confidence: {pFile.aiResults.confidence ? `${Math.round(pFile.aiResults.confidence * 100)}%` : 'N/A'}</p>
                      <p>Data extracted: {pFile.aiResults.extractedData ? 'Yes' : 'No'}</p>
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