import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Calendar, TrendingUp, Eye, RefreshCw } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

interface ComplianceItem {
  id: string;
  title: string;
  category: string;
  status: 'compliant' | 'non_compliant' | 'pending' | 'warning';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  lastChecked: string;
  description: string;
  regulation: string;
  actions: string[];
  progress: number;
  responsible: string;
}

export default function HRComplianceMonitoring() {
  const { isRTL } = useUnifiedLocale();
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'monitoring' | 'reports'>('overview');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const mockComplianceItems: ComplianceItem[] = [
    {
      id: '1',
      title: 'تجديد تراخيص العمل',
      category: 'العمالة',
      status: 'warning',
      priority: 'high',
      dueDate: '2024-02-15',
      lastChecked: '2024-01-20',
      description: 'تجديد تراخيص العمل للعمالة الوافدة قبل انتهاء المدة',
      regulation: 'نظام العمل السعودي - المادة 39',
      actions: ['مراجعة تواريخ انتهاء التراخيص', 'تحضير الأوراق المطلوبة', 'تقديم طلبات التجديد'],
      progress: 65,
      responsible: 'مدير شؤون الموظفين'
    },
    {
      id: '2',
      title: 'نسبة السعودة المطلوبة',
      category: 'السعودة',
      status: 'compliant',
      priority: 'medium',
      dueDate: '2024-03-01',
      lastChecked: '2024-01-25',
      description: 'الحفاظ على نسبة السعودة المطلوبة حسب نشاط الشركة',
      regulation: 'برنامج نطاقات - وزارة الموارد البشرية',
      actions: ['مراقبة نسبة السعودة', 'تحديث بيانات قوى', 'توظيف سعوديين عند الحاجة'],
      progress: 95,
      responsible: 'مدير التوظيف'
    },
    {
      id: '3',
      title: 'سجلات السلامة المهنية',
      category: 'السلامة',
      status: 'non_compliant',
      priority: 'critical',
      dueDate: '2024-01-31',
      lastChecked: '2024-01-18',
      description: 'تحديث سجلات السلامة المهنية والتدريب الإلزامي',
      regulation: 'نظام الأمان الصناعي - المادة 7',
      actions: ['إجراء تدريب السلامة', 'تحديث سجلات الحوادث', 'فحص معدات السلامة'],
      progress: 30,
      responsible: 'مسؤول السلامة المهنية'
    }
  ];

  const complianceCategories = [
    { value: 'all', label: isRTL ? 'جميع الفئات' : 'All Categories' },
    { value: 'العمالة', label: isRTL ? 'العمالة' : 'Labor' },
    { value: 'السعودة', label: isRTL ? 'السعودة' : 'Saudization' },
    { value: 'السلامة', label: isRTL ? 'السلامة' : 'Safety' },
    { value: 'المالية', label: isRTL ? 'المالية' : 'Financial' },
    { value: 'التأمينات', label: isRTL ? 'التأمينات' : 'Insurance' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4" />;
      case 'non_compliant': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'non_compliant': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredItems = mockComplianceItems.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesCategory && matchesStatus;
  });

  const complianceScore = Math.round(
    (mockComplianceItems.filter(item => item.status === 'compliant').length / mockComplianceItems.length) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isRTL ? 'مراقبة الامتثال للموارد البشرية' : 'HR Compliance Monitoring'}
            </h1>
            <p className="text-muted-foreground">
              {isRTL ? 'مراقبة الامتثال للوائح والقوانين' : 'Monitor compliance with regulations and laws'}
            </p>
          </div>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            {isRTL ? 'تحديث' : 'Refresh'}
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'نظرة عامة' : 'Overview'}
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'issues'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'القضايا' : 'Issues'}
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'monitoring'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'المراقبة' : 'Monitoring'}
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'reports'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'التقارير' : 'Reports'}
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Compliance Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {isRTL ? 'نقاط الامتثال الإجمالية' : 'Overall Compliance Score'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{complianceScore}%</div>
                    <Progress value={complianceScore} className="w-48 h-3" />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                      {mockComplianceItems.filter(item => item.status === 'compliant').length}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-400">{isRTL ? 'متوافق' : 'Compliant'}</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                    <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">
                      {mockComplianceItems.filter(item => item.status === 'warning').length}
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">{isRTL ? 'تحذير' : 'Warning'}</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                    <p className="text-2xl font-bold text-red-800 dark:text-red-300">
                      {mockComplianceItems.filter(item => item.status === 'non_compliant').length}
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400">{isRTL ? 'غير متوافق' : 'Non-Compliant'}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                      {mockComplianceItems.filter(item => item.status === 'pending').length}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-400">{isRTL ? 'معلق' : 'Pending'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">{isRTL ? 'القضايا الحرجة' : 'Critical Issues'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockComplianceItems
                    .filter(item => item.priority === 'critical' || item.status === 'non_compliant')
                    .map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-800 dark:text-red-300">{item.title}</h4>
                          <p className="text-sm text-red-700 dark:text-red-400 mt-1">{item.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                            <Calendar className="h-4 w-4" />
                            <span>{isRTL ? 'مستحق:' : 'Due:'} {item.dueDate}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          {isRTL ? 'اتخاذ إجراء' : 'Take Action'}
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {(activeTab === 'issues' || activeTab === 'monitoring') && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {complianceCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={isRTL ? 'جميع الحالات' : 'All Status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
                  <SelectItem value="compliant">{isRTL ? 'متوافق' : 'Compliant'}</SelectItem>
                  <SelectItem value="warning">{isRTL ? 'تحذير' : 'Warning'}</SelectItem>
                  <SelectItem value="non_compliant">{isRTL ? 'غير متوافق' : 'Non-Compliant'}</SelectItem>
                  <SelectItem value="pending">{isRTL ? 'معلق' : 'Pending'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Compliance Items */}
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>{item.regulation}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(item.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(item.status)}
                            <span>
                              {isRTL ? 
                                (item.status === 'compliant' ? 'متوافق' : 
                                 item.status === 'non_compliant' ? 'غير متوافق' : 
                                 item.status === 'warning' ? 'تحذير' : 'معلق') 
                                : item.status}
                            </span>
                          </div>
                        </Badge>
                        <Badge className={getPriorityColor(item.priority)}>
                          {isRTL ? 
                            (item.priority === 'low' ? 'منخفضة' : 
                             item.priority === 'medium' ? 'متوسطة' : 
                             item.priority === 'high' ? 'عالية' : 'حرجة') 
                            : item.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{item.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{isRTL ? 'تاريخ الاستحقاق:' : 'Due Date:'}</span>
                        <span>{item.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{isRTL ? 'آخر فحص:' : 'Last Checked:'}</span>
                        <span>{item.lastChecked}</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{isRTL ? 'التقدم:' : 'Progress:'}</span>
                        <span>{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">{isRTL ? 'الإجراءات المطلوبة:' : 'Required Actions:'}</h4>
                      <div className="flex flex-wrap gap-1">
                        {item.actions.map((action, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        {isRTL ? 'عرض التفاصيل' : 'View Details'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        {isRTL ? 'تحديث الحالة' : 'Update Status'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'تقرير الامتثال الشهري' : 'Monthly Compliance Report'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{isRTL ? 'نسبة الامتثال العامة' : 'Overall Compliance Rate'}</span>
                    <span className="font-bold">{complianceScore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{isRTL ? 'القضايا المحلولة' : 'Issues Resolved'}</span>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{isRTL ? 'القضايا الجديدة' : 'New Issues'}</span>
                    <span className="font-bold">3</span>
                  </div>
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    {isRTL ? 'إنشاء تقرير' : 'Generate Report'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'اتجاهات الامتثال' : 'Compliance Trends'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{isRTL ? 'يناير 2024' : 'January 2024'}</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{isRTL ? 'ديسمبر 2023' : 'December 2023'}</span>
                        <span>91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{isRTL ? 'نوفمبر 2023' : 'November 2023'}</span>
                        <span>89%</span>
                      </div>
                      <Progress value={89} className="h-2" />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {isRTL ? 'عرض التفاصيل' : 'View Details'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}