import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { 
  Camera, 
  Scan, 
  Upload, 
  FileText, 
  Check, 
  X,
  RotateCw,
  Crop,
  Download,
  Share,
  Eye
} from 'lucide-react';

interface DocumentScannerProps {
  onDocumentScanned?: (file: File) => void;
}

export const DocumentScanner: React.FC<DocumentScannerProps> = ({ onDocumentScanned }) => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [scanning, setScanning] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [scannedDocument, setScannedDocument] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleCameraCapture = async () => {
    setScanning(true);
    
    try {
      // Simulate camera capture with file input
      fileInputRef.current?.click();
    } catch (error) {
      console.error('Camera capture failed:', error);
    } finally {
      setScanning(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setScanning(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setScannedDocument(file);
    setPreviewUrl(URL.createObjectURL(file));
    setScanning(false);
    onDocumentScanned?.(file);
  };

  const documentTypes = [
    { 
      type: 'id', 
      nameEn: 'National ID',
      nameAr: 'الهوية الوطنية',
      icon: <FileText className="h-4 w-4" />
    },
    { 
      type: 'passport', 
      nameEn: 'Passport',
      nameAr: 'جواز السفر',
      icon: <FileText className="h-4 w-4" />
    },
    { 
      type: 'contract', 
      nameEn: 'Employment Contract',
      nameAr: 'عقد العمل',
      icon: <FileText className="h-4 w-4" />
    },
    { 
      type: 'certificate', 
      nameEn: 'Certificate',
      nameAr: 'شهادة',
      icon: <FileText className="h-4 w-4" />
    }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scan className="h-5 w-5 text-primary" />
            {isArabic ? 'ماسح المستندات' : 'Document Scanner'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Document Type Selection */}
          <div className="grid grid-cols-2 gap-2">
            {documentTypes.map((docType) => (
              <Button
                key={docType.type}
                variant="outline"
                className="h-auto p-3 flex flex-col items-center gap-1 text-xs"
                onClick={handleCameraCapture}
              >
                {docType.icon}
                <span>{isArabic ? docType.nameAr : docType.nameEn}</span>
              </Button>
            ))}
          </div>

          {/* Camera Capture */}
          <div className="space-y-3">
            <Button 
              onClick={handleCameraCapture}
              disabled={scanning}
              className="w-full h-12"
            >
              <Camera className="h-4 w-4 mr-2" />
              {isArabic ? 'التقاط بالكاميرا' : 'Capture with Camera'}
            </Button>

            <Button 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={scanning}
              className="w-full h-12"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isArabic ? 'رفع من الجهاز' : 'Upload from Device'}
            </Button>
          </div>

          {/* Upload Progress */}
          {scanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{isArabic ? 'جاري المعالجة...' : 'Processing...'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Document Preview */}
          {scannedDocument && previewUrl && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      {isArabic ? 'تم المسح' : 'Scanned'}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Crop className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="relative bg-gray-50 rounded-lg p-2 min-h-[200px] flex items-center justify-center">
                  <img 
                    src={previewUrl} 
                    alt="Scanned document"
                    className="max-w-full max-h-[180px] object-contain rounded"
                  />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    {isArabic ? 'حفظ' : 'Save'}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share className="h-4 w-4 mr-2" />
                    {isArabic ? 'مشاركة' : 'Share'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  {isArabic ? 
                    `الملف: ${scannedDocument.name} (${(scannedDocument.size / 1024 / 1024).toFixed(2)} MB)` :
                    `File: ${scannedDocument.name} (${(scannedDocument.size / 1024 / 1024).toFixed(2)} MB)`
                  }
                </p>
              </CardContent>
            </Card>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileUpload}
          />
        </CardContent>
      </Card>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            {isArabic ? 'عمليات المسح الأخيرة' : 'Recent Scans'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground text-sm py-4">
            {isArabic ? 'لا توجد عمليات مسح سابقة' : 'No recent scans'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};