import React, { useState } from 'react';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Scale, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  BookOpen,
  FileText,
  Bell
} from 'lucide-react';

export const SaudiLaborLawIntelligence: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [selectedUpdate, setSelectedUpdate] = useState(null);

  const legalUpdates = [
    {
      id: 1,
      title: isRTL ? 'تحديث قانون العمل الجديد 2024' : 'New Labor Law Update 2024',
      description: isRTL ? 'تحديثات جديدة على ساعات العمل المرنة' : 'New updates on flexible working hours',
      impact: 'high',
      date: '2024-01-15',
      status: 'active',
      articles: ['Article 101', 'Article 102', 'Article 103']
    },
    {
      id: 2,
      title: isRTL ? 'لوائح وزارة الموارد البشرية' : 'Ministry of Human Resources Regulations',
      description: isRTL ? 'لوائح جديدة للسعودة والتوطين' : 'New regulations for Saudization and localization',
      impact: 'medium',
      date: '2024-01-10',
      status: 'pending',
      articles: ['Article 45', 'Article 46']
    },
    {
      id: 3,
      title: isRTL ? 'تعديلات نظام التأمينات الاجتماعية' : 'Social Insurance System Amendments',
      description: isRTL ? 'تعديلات على نظام التأمينات للموظفين' : 'Amendments to employee social insurance system',
      impact: 'high',
      date: '2024-01-05',
      status: 'implemented',
      articles: ['Article 78', 'Article 79', 'Article 80']
    }
  ];

  const complianceRequirements = [
    {
      id: 1,
      requirement: isRTL ? 'تسجيل ساعات العمل الإضافية' : 'Overtime Hours Registration',
      status: 'compliant',
      deadline: '2024-02-01',
      priority: 'high'
    },
    {
      id: 2,
      requirement: isRTL ? 'تحديث عقود العمل' : 'Employment Contract Updates',
      status: 'pending',
      deadline: '2024-01-25',
      priority: 'critical'
    },
    {
      id: 3,
      requirement: isRTL ? 'تطبيق لوائح السعودة' : 'Saudization Regulations Implementation',
      status: 'in-progress',
      deadline: '2024-03-01',
      priority: 'medium'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Scale className="h-6 w-6" />
            {isRTL ? 'ذكاء قانون العمل السعودي' : 'Saudi Labor Law Intelligence'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {isRTL ? 'مراقبة وتحليل التحديثات القانونية في الوقت الفعلي' : 'Real-time legal updates monitoring and analysis'}
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <Bell className="h-3 w-3 mr-1" />
          {isRTL ? '3 تحديثات جديدة' : '3 New Updates'}
        </Badge>
      </div>

      <Tabs defaultValue="updates" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="updates">{isRTL ? 'التحديثات القانونية' : 'Legal Updates'}</TabsTrigger>
          <TabsTrigger value="compliance">{isRTL ? 'متطلبات الامتثال' : 'Compliance Requirements'}</TabsTrigger>
          <TabsTrigger value="analysis">{isRTL ? 'تحليل التأثير' : 'Impact Analysis'}</TabsTrigger>
          <TabsTrigger value="tracking">{isRTL ? 'تتبع التنفيذ' : 'Implementation Tracking'}</TabsTrigger>
        </TabsList>

        <TabsContent value="updates" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {isRTL ? 'التحديثات الأخيرة' : 'Recent Updates'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {legalUpdates.map((update) => (
                      <div
                        key={update.id}
                        className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedUpdate(update)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium mb-2">{update.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{update.description}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={getImpactColor(update.impact)}>
                                {isRTL ? 'تأثير' : 'Impact'}: {update.impact}
                              </Badge>
                              <Badge variant="outline">
                                <Clock className="h-3 w-3 mr-1" />
                                {update.date}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            {update.status === 'active' && <CheckCircle className="h-5 w-5 text-green-500" />}
                            {update.status === 'pending' && <Clock className="h-5 w-5 text-yellow-500" />}
                            {update.status === 'implemented' && <CheckCircle className="h-5 w-5 text-blue-500" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {isRTL ? 'تفاصيل التحديث' : 'Update Details'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedUpdate ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">{selectedUpdate.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{selectedUpdate.description}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">{isRTL ? 'المواد المتأثرة:' : 'Affected Articles:'}</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedUpdate.articles.map((article, index) => (
                          <Badge key={index} variant="secondary">{article}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button className="w-full">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {isRTL ? 'اقرأ النص الكامل' : 'Read Full Text'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {isRTL ? 'اختر تحديثاً لعرض التفاصيل' : 'Select an update to view details'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {isRTL ? 'متطلبات الامتثال' : 'Compliance Requirements'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceRequirements.map((req) => (
                  <div key={req.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{req.requirement}</h4>
                      <Badge className={getStatusColor(req.status)}>
                        {req.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {isRTL ? 'الموعد النهائي:' : 'Deadline:'} {req.deadline}
                      </span>
                      <Badge variant="outline" className={getImpactColor(req.priority)}>
                        {req.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{isRTL ? 'التحديثات عالية التأثير' : 'High Impact Updates'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">3</div>
                <p className="text-xs text-muted-foreground">{isRTL ? 'تتطلب اهتماماً فورياً' : 'Require immediate attention'}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{isRTL ? 'السياسات المتأثرة' : 'Affected Policies'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">12</div>
                <p className="text-xs text-muted-foreground">{isRTL ? 'تحتاج إلى مراجعة' : 'Need review'}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{isRTL ? 'معدل الامتثال' : 'Compliance Rate'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">85%</div>
                <p className="text-xs text-muted-foreground">{isRTL ? 'من إجمالي المتطلبات' : 'Of total requirements'}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'تتبع جدولة التنفيذ' : 'Implementation Timeline Tracking'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                  
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center relative z-10">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{isRTL ? 'تحديث نظام التأمينات' : 'Insurance System Update'}</h4>
                        <p className="text-sm text-muted-foreground">{isRTL ? 'مكتمل في 15 يناير 2024' : 'Completed on Jan 15, 2024'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center relative z-10">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{isRTL ? 'تحديث عقود العمل' : 'Employment Contracts Update'}</h4>
                        <p className="text-sm text-muted-foreground">{isRTL ? 'قيد التنفيذ - موعد الإنجاز 25 يناير' : 'In Progress - Due Jan 25'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center relative z-10">
                        <Clock className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{isRTL ? 'تطبيق لوائح السعودة' : 'Saudization Regulations'}</h4>
                        <p className="text-sm text-muted-foreground">{isRTL ? 'مجدول للبدء - 1 مارس 2024' : 'Scheduled to start - Mar 1, 2024'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};