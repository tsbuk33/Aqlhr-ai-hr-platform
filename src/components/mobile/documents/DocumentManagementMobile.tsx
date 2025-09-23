import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { 
  FileText, 
  Scan, 
  PenTool,
  Search,
  Share,
  AlertCircle,
  BarChart3,
  Calendar,
  Building,
  Upload
} from 'lucide-react';
import { DocumentScanner } from './DocumentScanner';
import { DigitalSignature } from './DigitalSignature';

interface DocumentManagementMobileProps {
  user?: any;
}

export const DocumentManagementMobile: React.FC<DocumentManagementMobileProps> = ({ user }) => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  
  const [activeTab, setActiveTab] = useState('scanner');

  const quickActions = [
    {
      key: 'scanner',
      icon: <Scan className="h-5 w-5" />,
      labelEn: 'Scan Document',
      labelAr: 'مسح مستند',
      description: isArabic ? 'التقط وامسح المستندات' : 'Capture & scan documents'
    },
    {
      key: 'signature',
      icon: <PenTool className="h-5 w-5" />,
      labelEn: 'Digital Sign',
      labelAr: 'توقيع رقمي',
      description: isArabic ? 'وقع المستندات رقمياً' : 'Sign documents digitally'
    },
    {
      key: 'search',
      icon: <Search className="h-5 w-5" />,
      labelEn: 'Search Docs',
      labelAr: 'البحث',
      description: isArabic ? 'ابحث في المستندات' : 'Search documents'
    },
    {
      key: 'analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      labelEn: 'Analytics',
      labelAr: 'التحليلات',
      description: isArabic ? 'تحليل المستندات' : 'Document analytics'
    }
  ];

  const recentDocuments = [
    {
      id: '1',
      name: 'Employment Contract - Ahmed Mohamed',
      nameAr: 'عقد العمل - أحمد محمد',
      type: 'contract',
      status: 'pending_signature',
      date: '2025-09-23',
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Performance Review Form',
      nameAr: 'نموذج تقييم الأداء',
      type: 'form',
      status: 'completed',
      date: '2025-09-22',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Government Submission - GOSI',
      nameAr: 'تقديم حكومي - التأمينات',
      type: 'government',
      status: 'submitted',
      date: '2025-09-21',
      size: '3.2 MB'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending_signature':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    if (isArabic) {
      switch (status) {
        case 'completed': return 'مكتمل';
        case 'pending_signature': return 'بانتظار التوقيع';
        case 'submitted': return 'مُقدم';
        default: return 'غير معروف';
      }
    } else {
      switch (status) {
        case 'completed': return 'Completed';
        case 'pending_signature': return 'Pending Signature';
        case 'submitted': return 'Submitted';
        default: return 'Unknown';
      }
    }
  };

  const renderQuickActions = () => (
    <div className="grid grid-cols-2 gap-3">
      {quickActions.map((action) => (
        <Card 
          key={action.key}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setActiveTab(action.key)}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              {React.cloneElement(action.icon, { className: 'h-6 w-6 text-primary' })}
            </div>
            <h3 className="font-medium text-sm mb-1">
              {isArabic ? action.labelAr : action.labelEn}
            </h3>
            <p className="text-xs text-muted-foreground">
              {action.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderRecentDocuments = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5" />
          {isArabic ? 'المستندات الحديثة' : 'Recent Documents'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {isArabic ? doc.nameAr : doc.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getStatusColor(doc.status)}`}
                  >
                    {getStatusText(doc.status)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{doc.size}</span>
                </div>
              </div>
              <div className="text-right">
                <Button variant="ghost" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground">{doc.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderDocumentSearch = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          {isArabic ? 'البحث في المستندات' : 'Document Search'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={isArabic ? 'ابحث في المستندات...' : 'Search documents...'}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {/* Search Filters */}
          <div className="flex gap-2 flex-wrap">
            {['All', 'Contracts', 'Forms', 'Government', 'Certificates'].map((filter) => (
              <Button key={filter} variant="outline" size="sm" className="text-xs">
                {isArabic ? 
                  (filter === 'All' ? 'الكل' :
                   filter === 'Contracts' ? 'العقود' :
                   filter === 'Forms' ? 'النماذج' :
                   filter === 'Government' ? 'حكومية' : 'الشهادات') :
                  filter
                }
              </Button>
            ))}
          </div>

          {/* Search Results */}
          <div className="text-center text-muted-foreground py-8">
            {isArabic ? 'ابحث للعثور على المستندات' : 'Search to find documents'}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderDocumentAnalytics = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {isArabic ? 'تحليلات المستندات' : 'Document Analytics'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">247</div>
              <div className="text-xs text-muted-foreground">
                {isArabic ? 'إجمالي المستندات' : 'Total Documents'}
              </div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-xs text-muted-foreground">
                {isArabic ? 'معدل الإكمال' : 'Completion Rate'}
              </div>
            </div>
          </div>

          {/* Document Types */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">
              {isArabic ? 'أنواع المستندات' : 'Document Types'}
            </h4>
            {[
              { type: 'Contracts', count: 89, percentage: 36 },
              { type: 'Forms', count: 67, percentage: 27 },
              { type: 'Government', count: 45, percentage: 18 },
              { type: 'Certificates', count: 46, percentage: 19 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-sm">{item.type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{item.count}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Alerts */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {isArabic ? 'تنبيهات انتهاء الصلاحية' : 'Expiration Alerts'}
                  </p>
                  <p className="text-xs text-yellow-700">
                    {isArabic ? '12 مستند ينتهي خلال 30 يوم' : '12 documents expire in 30 days'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-medium">
              {isArabic ? 'إدارة المستندات' : 'Document Management'}
            </h2>
            <p className="text-xs opacity-80">
              {isArabic ? 'مسح ووقيع وإدارة المستندات' : 'Scan, sign & manage documents'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="scanner" className="text-xs">
              {isArabic ? 'مسح' : 'Scan'}
            </TabsTrigger>
            <TabsTrigger value="signature" className="text-xs">
              {isArabic ? 'توقيع' : 'Sign'}
            </TabsTrigger>
            <TabsTrigger value="search" className="text-xs">
              {isArabic ? 'بحث' : 'Search'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">
              {isArabic ? 'تحليل' : 'Analytics'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="space-y-4">
            <DocumentScanner />
            {renderRecentDocuments()}
          </TabsContent>

          <TabsContent value="signature" className="space-y-4">
            <DigitalSignature documentName="Employment Contract - New Employee" />
          </TabsContent>

          <TabsContent value="search" className="space-y-4">
            {renderDocumentSearch()}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {renderDocumentAnalytics()}
          </TabsContent>
        </Tabs>

        {/* Quick Actions - shown on all tabs */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">
            {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
          </h3>
          {renderQuickActions()}
        </div>
      </div>
    </div>
  );
};