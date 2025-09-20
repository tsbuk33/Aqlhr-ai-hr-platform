import React, { useState } from 'react';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Edit,
  Plus,
  Search,
  Filter,
  Eye
} from 'lucide-react';

export const ContractIntelligence: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [selectedContract, setSelectedContract] = useState(null);
  const [contractType, setContractType] = useState('');

  const contractTemplates = [
    {
      id: 1,
      name: isRTL ? 'عقد عمل دائم' : 'Permanent Employment Contract',
      type: 'permanent',
      language: 'ar-en',
      status: 'active',
      lastUpdated: '2024-01-15',
      complianceScore: 95
    },
    {
      id: 2,
      name: isRTL ? 'عقد عمل مؤقت' : 'Temporary Employment Contract',
      type: 'temporary',
      language: 'ar-en',
      status: 'active',
      lastUpdated: '2024-01-10',
      complianceScore: 88
    },
    {
      id: 3,
      name: isRTL ? 'اتفاقية عدم إفشاء' : 'Non-Disclosure Agreement',
      type: 'nda',
      language: 'ar-en',
      status: 'draft',
      lastUpdated: '2024-01-05',
      complianceScore: 92
    }
  ];

  const contractAnalysis = [
    {
      id: 1,
      contractName: isRTL ? 'عقد أحمد محمد' : 'Ahmed Mohamed Contract',
      employee: 'Ahmed Mohamed',
      type: 'permanent',
      status: 'compliant',
      issues: 0,
      recommendations: 2,
      lastReview: '2024-01-15'
    },
    {
      id: 2,
      contractName: isRTL ? 'عقد فاطمة الزهراء' : 'Fatima Alzahra Contract',
      employee: 'Fatima Alzahra',
      type: 'temporary',
      status: 'needs-review',
      issues: 3,
      recommendations: 5,
      lastReview: '2024-01-10'
    },
    {
      id: 3,
      contractName: isRTL ? 'عقد محمد السالم' : 'Mohammed Alsalem Contract',
      employee: 'Mohammed Alsalem',
      type: 'permanent',
      status: 'pending-amendment',
      issues: 1,
      recommendations: 3,
      lastReview: '2024-01-08'
    }
  ];

  const terminationProcedures = [
    {
      id: 1,
      title: isRTL ? 'إنهاء الخدمة بسبب الأداء' : 'Termination Due to Performance',
      description: isRTL ? 'إجراءات إنهاء العمل بسبب ضعف الأداء' : 'Procedures for performance-based termination',
      steps: 5,
      estimatedTime: isRTL ? '30-45 يوم' : '30-45 days',
      riskLevel: 'medium'
    },
    {
      id: 2,
      title: isRTL ? 'إنهاء الخدمة بسبب انتهاك السياسات' : 'Termination Due to Policy Violation',
      description: isRTL ? 'إجراءات إنهاء العمل بسبب انتهاك سياسات الشركة' : 'Procedures for policy violation termination',
      steps: 7,
      estimatedTime: isRTL ? '15-30 يوم' : '15-30 days',
      riskLevel: 'high'
    },
    {
      id: 3,
      title: isRTL ? 'إنهاء الخدمة بالتراضي' : 'Mutual Agreement Termination',
      description: isRTL ? 'إجراءات إنهاء العمل بالتراضي بين الطرفين' : 'Procedures for mutual agreement termination',
      steps: 3,
      estimatedTime: isRTL ? '7-14 يوم' : '7-14 days',
      riskLevel: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'needs-review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pending-amendment': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {isRTL ? 'ذكاء العقود' : 'Contract Intelligence'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {isRTL ? 'إدارة وتحليل العقود والاتفاقيات القانونية' : 'Manage and analyze contracts and legal agreements'}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {isRTL ? 'عقد جديد' : 'New Contract'}
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">{isRTL ? 'قوالب العقود' : 'Contract Templates'}</TabsTrigger>
          <TabsTrigger value="analysis">{isRTL ? 'تحليل العقود' : 'Contract Analysis'}</TabsTrigger>
          <TabsTrigger value="termination">{isRTL ? 'إجراءات الإنهاء' : 'Termination Procedures'}</TabsTrigger>
          <TabsTrigger value="nda">{isRTL ? 'اتفاقيات السرية' : 'NDA Management'}</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <Input 
                placeholder={isRTL ? 'البحث في القوالب...' : 'Search templates...'}
                className="max-w-sm"
              />
            </div>
            <Select value={contractType} onValueChange={setContractType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={isRTL ? 'نوع العقد' : 'Contract Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="permanent">{isRTL ? 'دائم' : 'Permanent'}</SelectItem>
                <SelectItem value="temporary">{isRTL ? 'مؤقت' : 'Temporary'}</SelectItem>
                <SelectItem value="nda">{isRTL ? 'سرية' : 'NDA'}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {isRTL ? 'تصفية' : 'Filter'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contractTemplates.map((template) => (
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
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{isRTL ? 'نقاط الامتثال:' : 'Compliance Score:'}</span>
                    <span className="font-medium text-green-600">{template.complianceScore}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{isRTL ? 'آخر تحديث:' : 'Last Updated:'}</span>
                    <span>{template.lastUpdated}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      {isRTL ? 'عرض' : 'View'}
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

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                {isRTL ? 'تحليل الامتثال للعقود' : 'Contract Compliance Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contractAnalysis.map((contract) => (
                  <div key={contract.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{contract.contractName}</h4>
                        <p className="text-sm text-muted-foreground">{contract.employee}</p>
                      </div>
                      <Badge className={getStatusColor(contract.status)}>
                        {contract.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{isRTL ? 'المشاكل:' : 'Issues:'}</span>
                        <div className="font-medium text-red-600">{contract.issues}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{isRTL ? 'التوصيات:' : 'Recommendations:'}</span>
                        <div className="font-medium text-blue-600">{contract.recommendations}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{isRTL ? 'النوع:' : 'Type:'}</span>
                        <div className="font-medium">{contract.type}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{isRTL ? 'آخر مراجعة:' : 'Last Review:'}</span>
                        <div className="font-medium">{contract.lastReview}</div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        {isRTL ? 'مراجعة' : 'Review'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        {isRTL ? 'تقرير' : 'Report'}
                      </Button>
                      {contract.issues > 0 && (
                        <Button size="sm">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {isRTL ? 'إصلاح المشاكل' : 'Fix Issues'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="termination" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {isRTL ? 'إرشادات إجراءات الإنهاء' : 'Termination Procedure Guidance'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {terminationProcedures.map((procedure) => (
                  <div key={procedure.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{procedure.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{procedure.description}</p>
                      </div>
                      <Badge className={getRiskColor(procedure.riskLevel)}>
                        {procedure.riskLevel} risk
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">{isRTL ? 'عدد الخطوات:' : 'Steps:'}</span>
                        <div className="font-medium">{procedure.steps}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{isRTL ? 'الوقت المقدر:' : 'Estimated Time:'}</span>
                        <div className="font-medium">{procedure.estimatedTime}</div>
                      </div>
                    </div>

                    <Button size="sm" className="w-full">
                      <Eye className="h-3 w-3 mr-1" />
                      {isRTL ? 'عرض التفاصيل' : 'View Details'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nda" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {isRTL ? 'إدارة اتفاقيات عدم الإفشاء' : 'Non-Disclosure Agreement Management'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">{isRTL ? 'إدارة اتفاقيات السرية' : 'NDA Management System'}</h3>
                <p className="text-muted-foreground mb-4">
                  {isRTL ? 'إنشاء ومراقبة اتفاقيات عدم الإفشاء' : 'Create and monitor non-disclosure agreements'}
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {isRTL ? 'إنشاء اتفاقية جديدة' : 'Create New NDA'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};