import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Database, FileText } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguageCompat';

interface QuickDocumentUploadProps {
  platform: string;
  moduleType?: 'government' | 'hr' | 'payroll' | 'compliance' | 'training' | 'medical' | 'public' | 'documents' | 'media';
  compact?: boolean;
  onUploadClick?: () => void;
}

export const QuickDocumentUpload: React.FC<QuickDocumentUploadProps> = ({
  platform,
  moduleType = 'documents',
  compact = false,
  onUploadClick
}) => {
  const { language, isRTL } = useLanguage();

  if (compact) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onUploadClick}
        className="gap-2 border-primary/20 hover:bg-primary/10"
      >
        <Upload className="h-4 w-4" />
        {language === 'ar' ? 'رفع مستند' : 'Upload Doc'}
      </Button>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 w-full max-w-4xl mx-auto">
      <CardContent className="p-4">
        <div className="flex items-center justify-between" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm">
                {language === 'ar' ? 'مركز إدارة المستندات' : 'Document Management Center'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {language === 'ar'
                  ? 'بناء قاعدة بيانات AqlHR الشاملة'
                  : 'Building comprehensive AqlHR database'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onUploadClick}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {language === 'ar' ? 'رفع مستندات' : 'Upload Documents'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickDocumentUpload;