import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Scan } from 'lucide-react';

interface DocumentScannerProps {
  isArabic: boolean;
  onDocumentScanned: (document: any) => void;
}

export const DocumentScanner: React.FC<DocumentScannerProps> = ({
  isArabic,
  onDocumentScanned
}) => {
  const handleScan = () => {
    console.log('Document scan initiated');
  };

  return (
    <div className="text-center space-y-3">
      <Scan className="h-8 w-8 mx-auto text-primary" />
      <Button onClick={handleScan} variant="outline" className="w-full">
        <Camera className="h-4 w-4 mr-2" />
        {isArabic ? 'مسح المستندات' : 'Scan Document'}
      </Button>
    </div>
  );
};