import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useLocale } from '../LocaleDriver';
import { PolicyAnalysisService } from '../../services/policy-analysis.service';
import { PolicyDocument } from '../../types/policy-review';

interface PolicyUploadProps {
  onUploadSuccess?: (policy: PolicyDocument) => void;
}

export const PolicyUpload: React.FC<PolicyUploadProps> = ({ onUploadSuccess }) => {
  const { t, isRTL } = useLocale();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setIsUploading(true);
    setUploadStatus('uploading');
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Mock file upload - in real app would upload to storage
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('analyzing');

      // Create policy document object
      const policy: PolicyDocument = {
        id: `policy_${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        titleAr: file.name.replace(/\.[^/.]+$/, ""), // Would be translated in real app
        content: '', // Would be extracted from file
        fileUrl: URL.createObjectURL(file),
        fileType: file.type.includes('pdf') ? 'pdf' : file.type.includes('word') ? 'docx' : 'txt',
        uploadedAt: new Date(),
        uploadedBy: 'current-user-id',
        companyId: 'current-company-id',
        status: 'analyzing',
        complianceScore: 0,
        riskLevel: 'medium'
      };

      // Start AI analysis
      const analysisService = new PolicyAnalysisService();
      const analysis = await analysisService.analyzePolicy(policy);
      
      // Update policy with analysis results
      policy.status = 'completed';
      policy.complianceScore = analysis.overallScore;
      policy.riskLevel = analysis.riskAssessment.level;
      policy.lastAnalyzed = new Date();

      setUploadStatus('success');
      onUploadSuccess?.(policy);

    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload and analyze policy document');
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading
  });

  return (
    <div className={`policy-upload space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            {t('policy.upload.title')}
          </CardTitle>
          <CardDescription>
            {t('policy.upload.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
              }
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Upload className="h-12 w-12 text-primary" />
              </div>
              
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {isDragActive 
                    ? t('policy.upload.dropHere')
                    : t('policy.upload.dragDrop')
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('policy.upload.supportedFormats')}
                </p>
              </div>

              {!isDragActive && (
                <Button variant="outline" disabled={isUploading}>
                  <FileText className="h-4 w-4 mr-2" />
                  {t('policy.upload.browseFiles')}
                </Button>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">{uploadedFile?.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {uploadProgress}%
                </span>
              </div>
              
              <Progress value={uploadProgress} className="w-full" />
              
              <div className="text-sm text-muted-foreground">
                {uploadStatus === 'uploading' && t('policy.upload.uploading')}
                {uploadStatus === 'analyzing' && t('policy.upload.analyzing')}
              </div>
            </div>
          )}

          {/* Success State */}
          {uploadStatus === 'success' && (
            <Alert className="mt-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {t('policy.upload.success')}
              </AlertDescription>
            </Alert>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* AI Analysis Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <span>{t('policy.upload.aiAnalysis.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div>
                <h4 className="font-medium">{t('policy.upload.aiAnalysis.compliance')}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('policy.upload.aiAnalysis.complianceDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <h4 className="font-medium">{t('policy.upload.aiAnalysis.gaps')}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('policy.upload.aiAnalysis.gapsDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
              <div>
                <h4 className="font-medium">{t('policy.upload.aiAnalysis.recommendations')}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('policy.upload.aiAnalysis.recommendationsDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
              <div>
                <h4 className="font-medium">{t('policy.upload.aiAnalysis.riskAssessment')}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('policy.upload.aiAnalysis.riskAssessmentDesc')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};