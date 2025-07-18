import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedFileUpload } from '@/components/enhanced/EnhancedFileUpload';
import { Database, FileText, Upload } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguageCompat';

interface UniversalDocumentManagerProps {
  moduleName: string;
  moduleNameAr?: string;
  description?: string;
  descriptionAr?: string;
  platform: string;
  moduleType?: 'government' | 'hr' | 'payroll' | 'compliance' | 'training' | 'medical' | 'public' | 'documents' | 'media';
  acceptedTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  showAsCard?: boolean;
}

export const UniversalDocumentManager: React.FC<UniversalDocumentManagerProps> = ({
  moduleName,
  moduleNameAr,
  description,
  descriptionAr,
  platform,
  moduleType = 'documents',
  acceptedTypes,
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  maxFiles = 20,
  showAsCard = true
}) => {
  const { language, isRTL } = useLanguage();
  
  const displayName = language === 'ar' && moduleNameAr ? moduleNameAr : moduleName;
  const displayDescription = language === 'ar' && descriptionAr ? descriptionAr : description;

  const defaultDescription = language === 'ar'
    ? `رفع وإدارة المستندات الخاصة بـ ${displayName}`
    : `Upload and manage documents for ${displayName}`;

  const documentManager = (
    <EnhancedFileUpload
      title={language === 'ar' ? `مركز مستندات ${displayName}` : `${displayName} Document Center`}
      description={displayDescription || defaultDescription}
      moduleType={moduleType}
      platform={platform}
      acceptedTypes={acceptedTypes || ['.pdf', '.doc', '.docx', '.xlsx', '.xls', '.pptx', '.jpg', '.jpeg', '.png', '.csv']}
      maxFileSize={maxFileSize}
      maxFiles={maxFiles}
      compressionEnabled={true}
      multipleUploads={true}
      showPresets={true}
      showUploadMethods={true}
    />
  );

  if (!showAsCard) {
    return documentManager;
  }

  return (
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            {language === 'ar' ? `مركز إدارة مستندات ${displayName}` : `${displayName} Document Management`}
          </CardTitle>
          <CardDescription>
            {displayDescription || defaultDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documentManager}
          
          {/* AqlHR Database Info */}
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-2">
                  {language === 'ar' ? 'قاعدة بيانات AqlHR' : 'AqlHR Database Integration'}
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>
                    {language === 'ar' 
                      ? '• تكامل تلقائي مع جميع وحدات AqlHR الـ 105'
                      : '• Automatic integration with all 105+ AqlHR modules'
                    }
                  </li>
                  <li>
                    {language === 'ar'
                      ? '• تحليل المستندات بالذكاء الاصطناعي واستخراج البيانات'
                      : '• AI-powered document analysis and data extraction'
                    }
                  </li>
                  <li>
                    {language === 'ar'
                      ? '• تصنيف تلقائي وفهرسة ذكية للمستندات'
                      : '• Automatic categorization and intelligent document indexing'
                    }
                  </li>
                  <li>
                    {language === 'ar'
                      ? '• نظام أمان متقدم ونسخ احتياطي تلقائي'
                      : '• Advanced security system with automatic backups'
                    }
                  </li>
                  <li>
                    {language === 'ar'
                      ? '• ربط مباشر مع مركز الذكاء التنفيذي'
                      : '• Direct integration with Executive Intelligence Center'
                    }
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversalDocumentManager;