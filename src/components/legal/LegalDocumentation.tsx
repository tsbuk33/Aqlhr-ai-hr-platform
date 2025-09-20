import React, { useState } from 'react';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Download, 
  Upload, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  User,
  Building,
  Scale
} from 'lucide-react';

export const LegalDocumentation: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [documentType, setDocumentType] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);

  const documentTemplates = [
    {
      id: 1,
      name: isRTL ? 'إشعار قانوني' : 'Legal Notice',
      type: 'legal-notice',
      description: isRTL ? 'قالب إشعار قانوني موحد' : 'Standard legal notice template',
      category: 'notices',
      lastUpdated: '2024-01-15',
      status: 'active',
      downloads: 45
    },
    {
      id: 2,
      name: isRTL ? 'خطاب إنهاء خدمة' : 'Termination Letter',
      type: 'termination',
      description: isRTL ? 'خطاب إنهاء خدمة حسب القانون السعودي' : 'Termination letter per Saudi law',
      category: 'termination',
      lastUpdated: '2024-01-12',
      status: 'active',
      downloads: 62
    },
    {
      id: 3,
      name: isRTL ? 'خطاب إنذار' : 'Warning Letter',
      type: 'warning',
      description: isRTL ? 'قالب خطاب إنذار للموظفين' : 'Employee warning letter template',
      category: 'disciplinary',
      lastUpdated: '2024-01-10',
      status: 'active',
      downloads: 38
    },
    {
      id: 4,
      name: isRTL ? 'اتفاقية تسوية' : 'Settlement Agreement',
      type: 'settlement',
      description: isRTL ? 'اتفاقية تسوية النزاعات العمالية' : 'Labor dispute settlement agreement',
      category: 'agreements',
      lastUpdated: '2024-01-08',
      status: 'draft',
      downloads: 12
    }
  ];

  const generatedDocuments = [
    {
      id: 1,
      documentName: isRTL ? 'إشعار قانوني - أحمد محمد' : 'Legal Notice - Ahmed Mohamed',
      employee: 'Ahmed Mohamed',
      type: 'legal-notice',
      generatedDate: '2024-01-15',
      status: 'sent',
      template: 'Legal Notice Template'
    },
    {
      id: 2,
      documentName: isRTL ? 'خطاب إنهاء - فاطمة الزهراء' : 'Termination Letter - Fatima Alzahra',
      employee: 'Fatima Alzahra',
      type: 'termination',
      generatedDate: '2024-01-12',
      status: 'draft',
      template: 'Termination Letter Template'
    },
    {
      id: 3,
      documentName: isRTL ? 'خطاب إنذار - محمد السالم' : 'Warning Letter - Mohammed Alsalem',
      employee: 'Mohammed Alsalem',
      type: 'warning',
      generatedDate: '2024-01-10',
      status: 'pending-review',
      template: 'Warning Letter Template'
    }
  ];

  const courtFilingPrep = [
    {
      id: 1,
      caseTitle: isRTL ? 'قضية نزاع عمالي - شركة التقنية المتقدمة' : 'Labor Dispute Case - Advanced Tech Co.',
      caseNumber: 'LCD-2024-001',
      type: 'labor-dispute',
      status: 'preparing',
      filingDeadline: '2024-02-15',
      documentsRequired: 8,
      documentsCompleted: 5,
      assignedLawyer: isRTL ? 'المحامي أحمد القانوني' : 'Lawyer Ahmed Alqanouni'
    },
    {
      id: 2,
      caseTitle: isRTL ? 'دعوى فصل تعسفي - موظف المبيعات' : 'Wrongful Termination Lawsuit - Sales Employee',
      caseNumber: 'WTL-2024-002',
      type: 'wrongful-termination',
      status: 'under-review',
      filingDeadline: '2024-01-30',
      documentsRequired: 12,
      documentsCompleted: 12,
      assignedLawyer: isRTL ? 'المحامية فاطمة العدل' : 'Lawyer Fatima Aladl'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending-review': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'preparing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'under-review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {isRTL ? 'التوثيق القانوني' : 'Legal Documentation'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {isRTL ? 'إنشاء وإدارة الوثائق القانونية الآلية' : 'Generate and manage automated legal documents'}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {isRTL ? 'مستند جديد' : 'New Document'}
        </Button>
      </div>

      <Tabs defaultValue="generation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generation">{isRTL ? 'إنشاء الوثائق' : 'Document Generation'}</TabsTrigger>
          <TabsTrigger value="templates">{isRTL ? 'القوالب' : 'Templates'}</TabsTrigger>
          <TabsTrigger value="automation">{isRTL ? 'الأتمتة' : 'Automation'}</TabsTrigger>
          <TabsTrigger value="court-filing">{isRTL ? 'إعداد المحكمة' : 'Court Filing Prep'}</TabsTrigger>
        </TabsList>

        <TabsContent value="generation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {isRTL ? 'إنشاء مستند جديد' : 'Generate New Document'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {isRTL ? 'نوع المستند' : 'Document Type'}
                  </label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? 'اختر نوع المستند' : 'Select document type'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="legal-notice">{isRTL ? 'إشعار قانوني' : 'Legal Notice'}</SelectItem>
                      <SelectItem value="termination">{isRTL ? 'خطاب إنهاء' : 'Termination Letter'}</SelectItem>
                      <SelectItem value="warning">{isRTL ? 'خطاب إنذار' : 'Warning Letter'}</SelectItem>
                      <SelectItem value="settlement">{isRTL ? 'اتفاقية تسوية' : 'Settlement Agreement'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {isRTL ? 'اسم الموظف' : 'Employee Name'}
                  </label>
                  <Input placeholder={isRTL ? 'أدخل اسم الموظف' : 'Enter employee name'} />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {isRTL ? 'السبب/التفاصيل' : 'Reason/Details'}
                  </label>
                  <Textarea 
                    placeholder={isRTL ? 'أدخل التفاصيل أو السبب' : 'Enter details or reason'}
                    rows={4}
                  />
                </div>

                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  {isRTL ? 'إنشاء المستند' : 'Generate Document'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {isRTL ? 'المستندات المُنشأة مؤخراً' : 'Recently Generated Documents'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {generatedDocuments.map((doc) => (
                      <div key={doc.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{doc.documentName}</h4>
                            <p className="text-xs text-muted-foreground">{doc.employee}</p>
                          </div>
                          <Badge className={getStatusColor(doc.status)} variant="secondary">
                            {doc.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>{doc.generatedDate}</span>
                          <span>{doc.template}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                            <Eye className="h-3 w-3 mr-1" />
                            {isRTL ? 'عرض' : 'View'}
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                            <Download className="h-3 w-3 mr-1" />
                            {isRTL ? 'تحميل' : 'Download'}
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                            <Edit className="h-3 w-3 mr-1" />
                            {isRTL ? 'تعديل' : 'Edit'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <Input 
                placeholder={isRTL ? 'البحث في القوالب...' : 'Search templates...'}
                className="max-w-sm"
              />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={isRTL ? 'فئة القالب' : 'Template Category'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="notices">{isRTL ? 'الإشعارات' : 'Notices'}</SelectItem>
                <SelectItem value="termination">{isRTL ? 'الإنهاء' : 'Termination'}</SelectItem>
                <SelectItem value="disciplinary">{isRTL ? 'التأديبية' : 'Disciplinary'}</SelectItem>
                <SelectItem value="agreements">{isRTL ? 'الاتفاقيات' : 'Agreements'}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {isRTL ? 'تصفية' : 'Filter'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge className={getStatusColor(template.status)}>
                      {template.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{isRTL ? 'التحميلات:' : 'Downloads:'}</span>
                    <span className="font-medium">{template.downloads}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{isRTL ? 'آخر تحديث:' : 'Last Updated:'}</span>
                    <span>{template.lastUpdated}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      {isRTL ? 'استخدام' : 'Use'}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="h-3 w-3 mr-1" />
                      {isRTL ? 'تحميل' : 'Download'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {isRTL ? 'أتمتة الإشعارات القانونية' : 'Legal Notice Automation'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{isRTL ? 'الإشعارات التلقائية' : 'Automatic Notices'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">12</div>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'هذا الشهر' : 'This month'}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{isRTL ? 'خطابات الإنهاء' : 'Termination Letters'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">5</div>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'تم إنشاؤها' : 'Generated'}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{isRTL ? 'خطابات الإنذار' : 'Warning Letters'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">8</div>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'تم إرسالها' : 'Sent'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="court-filing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                {isRTL ? 'إعداد الملفات للمحكمة' : 'Court Filing Preparation'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courtFilingPrep.map((filing) => (
                  <div key={filing.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{filing.caseTitle}</h4>
                          <Badge variant="outline">{filing.caseNumber}</Badge>
                          <Badge className={getStatusColor(filing.status)}>
                            {filing.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'نوع القضية:' : 'Case Type:'}</span>
                            <div className="font-medium">{filing.type}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'الموعد النهائي:' : 'Filing Deadline:'}</span>
                            <div className="font-medium">{filing.filingDeadline}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'المحامي المسؤول:' : 'Assigned Lawyer:'}</span>
                            <div className="font-medium">{filing.assignedLawyer}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{isRTL ? 'المستندات:' : 'Documents:'} {filing.documentsCompleted}/{filing.documentsRequired}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{isRTL ? 'تقدم الإعداد' : 'Preparation Progress'}</span>
                        <span className="text-sm font-medium">
                          {Math.round((filing.documentsCompleted / filing.documentsRequired) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(filing.documentsCompleted / filing.documentsRequired) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        {isRTL ? 'تفاصيل' : 'Details'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        {isRTL ? 'المستندات' : 'Documents'}
                      </Button>
                      <Button size="sm">
                        <Upload className="h-3 w-3 mr-1" />
                        {isRTL ? 'رفع مستند' : 'Upload Document'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};