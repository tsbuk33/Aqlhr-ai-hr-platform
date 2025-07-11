import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Upload, FileSpreadsheet, FileText, Building2, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const CompanyDataUpload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const { uploadFile, isUploading, uploadProgress } = useFileUpload({
    moduleType: 'hr',
    platform: 'company_integration',
    acceptedTypes: [
      // Documents
      '.pdf', '.doc', '.docx', '.txt', '.rtf',
      // Spreadsheets  
      '.xlsx', '.xls', '.csv', '.ods', '.tsv',
      // Presentations
      '.ppt', '.pptx', '.odp',
      // Images
      '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp',
      // Archives
      '.zip', '.rar', '.7z',
      // Design
      '.psd', '.ai', '.sketch', '.fig'
    ],
    maxFileSize: 100 * 1024 * 1024, // 100MB
    onFileProcessed: (file) => {
      toast({
        title: t('upload.integration_complete'),
        description: t('upload.integration_complete_desc').replace('{filename}', file.name)
      });
    }
  });

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    uploadFile(file);
  }, [uploadFile]);

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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-brand-primary" />
          {t('upload.company_data_integration')}
        </CardTitle>
        <CardDescription>
          {t('upload.company_data_integration_desc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-brand-primary bg-brand-primary/5' 
              : 'border-muted-foreground/25 hover:border-brand-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isUploading ? (
            <div className="space-y-4">
              <Zap className="h-12 w-12 mx-auto text-brand-primary animate-pulse" />
              <div>
                <p className="font-medium">{t('upload.processing_data')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('upload.integrating_systems')}
                </p>
                <div className="w-full bg-secondary rounded-full h-2 mt-3">
                  <div 
                    className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {uploadProgress}% {t('upload.complete')}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                <FileText className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-lg mb-2">
                  {t('upload.drag_drop_files')}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('upload.supported_formats')}
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.rtf,.xlsx,.xls,.csv,.ods,.tsv,.ppt,.pptx,.odp,.png,.jpg,.jpeg,.gif,.bmp,.svg,.webp,.zip,.rar,.7z,.psd,.ai,.sketch,.fig"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
                <Button
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {t('upload.browse_files')}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-brand-primary/5 rounded-lg">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-brand-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">{t('upload.ai_powered_integration')}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {t('upload.ai_powered_integration_desc')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};