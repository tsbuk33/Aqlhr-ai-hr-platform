import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Brain, CheckCircle } from 'lucide-react';
import { useLocale } from '@/i18n/locale';

export function DataUploadSection() {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Handle file drop logic here
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          {isArabic ? 'رفع بيانات الشركة' : 'Company Data Upload'}
        </CardTitle>
        <p className="text-muted-foreground">
          {isArabic 
            ? 'رفع ملفات بيانات الشركة للتحليل والمعالجة'
            : 'Upload company data files for analysis and processing'
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {isArabic ? 'تكامل بيانات الشركة' : 'Company Data Integration'}
          </h3>
          <p className="text-muted-foreground text-sm">
            {isArabic 
              ? 'رفع ملفات الشركة للتكامل التلقائي مع جميع أنظمة الموارد البشرية'
              : 'Upload company files for automatic integration with all HR systems'
            }
          </p>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragOver 
                ? 'border-primary bg-primary/5 scale-105' 
                : 'border-border hover:border-primary/50 hover:bg-accent/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  {isArabic ? 'اسحب وأفلت الملفات هنا' : 'Drag and drop files here'}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {isArabic 
                    ? 'يدعم جميع تنسيقات المستندات والملفات'
                    : 'Supports all document and file formats'
                  }
                </p>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  {isArabic ? 'تصفح الملفات' : 'Browse Files'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Integration Info */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  {isArabic ? 'التكامل المدعوم بالذكاء الاصطناعي' : 'AI-Powered Integration'}
                  <CheckCircle className="h-4 w-4 text-success" />
                </h4>
                <p className="text-sm text-muted-foreground">
                  {isArabic 
                    ? 'يستخدم الذكاء الاصطناعي لتحليل البيانات تلقائياً وتكاملها مع جميع وحدات النظام'
                    : 'Uses AI to automatically analyze and integrate data with all system modules'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supported Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
            <h5 className="font-semibold mb-1">
              {isArabic ? 'معالجة المستندات' : 'Document Processing'}
            </h5>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'PDF, Word, Excel' : 'PDF, Word, Excel'}
            </p>
          </Card>
          
          <Card className="p-4 text-center">
            <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h5 className="font-semibold mb-1">
              {isArabic ? 'تحليل ذكي' : 'Smart Analysis'}
            </h5>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'معالجة تلقائية' : 'Automatic processing'}
            </p>
          </Card>
          
          <Card className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
            <h5 className="font-semibold mb-1">
              {isArabic ? 'تكامل فوري' : 'Instant Integration'}
            </h5>
            <p className="text-xs text-muted-foreground">
              {isArabic ? 'تزامن مباشر' : 'Real-time sync'}
            </p>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}