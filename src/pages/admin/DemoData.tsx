import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle, Database, Users, FileText, Zap } from 'lucide-react';

const DemoData = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);

  const handleSeedCCI = async () => {
    setIsSeeding(true);
    try {
      // Get current user's tenant/company ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('cci-seed-instrument-v1', {
        body: { tenantId: user.id } // Using user ID as tenant ID for now
      });

      if (error) {
        throw error;
      }

      setSeedResult(data);
      toast({
        title: isArabic ? 'تم بنجاح' : 'Success',
        description: isArabic 
          ? `تم إنشاء أداة CCI بنجاح مع ${data.itemCount} عنصر`
          : `CCI instrument seeded successfully with ${data.itemCount} items`,
      });

    } catch (error: any) {
      console.error('Error seeding CCI instrument:', error);
      toast({
        title: isArabic ? 'خطأ' : 'Error',
        description: error.message || (isArabic ? 'فشل في إنشاء أداة CCI' : 'Failed to seed CCI instrument'),
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const seedOptions = [
    {
      title: isArabic ? 'أداة تشخيص الثقافة المؤسسية (CCI)' : 'CCI Instrument (EN/AR)',
      description: isArabic 
        ? 'إنشاء مصرف أسئلة شامل باللغتين العربية والإنجليزية مع ~60 عنصر للتقييم الثقافي'
        : 'Create comprehensive bilingual item bank with ~60 items for culture assessment',
      icon: Database,
      action: handleSeedCCI,
      isLoading: isSeeding,
      color: 'text-blue-600',
      details: [
        isArabic ? 'إطار عمل القيم المتنافسة (20 عنصر)' : 'Competing Values Framework (20 items)',
        isArabic ? 'الشبكة الثقافية (18 عنصر)' : 'Cultural Web (18 items)', 
        isArabic ? 'الأمان النفسي (7 عناصر)' : 'Psychological Safety (7 items)',
        isArabic ? 'السياق السعودي (5 عناصر)' : 'KSA Context (5 items)',
        isArabic ? 'عناصر عكسية (10 عناصر)' : 'Reverse-scored fillers (10 items)',
        isArabic ? 'قيم باريت (2 عنصر)' : 'Barrett Values (2 items)'
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isArabic ? 'بيانات تجريبية' : 'Demo Data'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isArabic 
              ? 'إنشاء بيانات تجريبية لاختبار وإعداد النظام'
              : 'Generate demo data for testing and system setup'
            }
          </p>
        </div>
      </div>

      {/* Warning Card */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-orange-800">
              {isArabic ? 'تحذير مهم' : 'Important Warning'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-orange-700 text-sm">
            {isArabic 
              ? 'هذه العمليات تقوم بإنشاء بيانات تجريبية في قاعدة البيانات. يُنصح باستخدامها فقط في بيئات التطوير والاختبار.'
              : 'These operations create demo data in the database. Use only in development and testing environments.'
            }
          </p>
        </CardContent>
      </Card>

      {/* Seed Options */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">
          {isArabic ? 'خيارات إنشاء البيانات' : 'Data Seeding Options'}
        </h2>

        {seedOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Icon className={`h-6 w-6 ${option.color}`} />
                    <div>
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {option.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Button 
                    onClick={option.action}
                    disabled={option.isLoading}
                    className="shrink-0"
                  >
                    {option.isLoading ? (
                      <>
                        <Zap className="mr-2 h-4 w-4 animate-spin" />
                        {isArabic ? 'جاري الإنشاء...' : 'Seeding...'}
                      </>
                    ) : (
                      <>
                        <Database className="mr-2 h-4 w-4" />
                        {isArabic ? 'إنشاء البيانات' : 'Seed Data'}
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    {isArabic ? 'التفاصيل:' : 'Details:'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {option.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></div>
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Results */}
      {seedResult && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-800">
                {isArabic ? 'نتائج العملية' : 'Operation Results'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">
                    {isArabic ? 'معرف الاستطلاع' : 'Survey ID'}
                  </span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {seedResult.surveyId?.slice(0, 8)}...
                  </Badge>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">
                    {isArabic ? 'معرف الموجة' : 'Wave ID'}
                  </span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {seedResult.waveId?.slice(0, 8)}...
                  </Badge>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">
                    {isArabic ? 'عدد العناصر' : 'Item Count'}
                  </span>
                  <Badge variant="secondary">
                    {seedResult.itemCount}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-green-700 mt-3">
                {seedResult.message}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DemoData;