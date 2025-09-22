import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  FileText,
  Users,
  Calendar,
  Building,
  ExternalLink
} from 'lucide-react';

interface ComplianceItem {
  id: string;
  portal: string;
  portalAr: string;
  requirement: string;
  requirementAr: string;
  status: 'compliant' | 'pending' | 'non_compliant' | 'expired';
  lastUpdated: string;
  dueDate?: string;
  responsible: string[];
  impact: 'high' | 'medium' | 'low';
  category: 'labor' | 'safety' | 'financial' | 'regulatory';
  progress: number;
  documents: {
    id: string;
    name: string;
    nameAr: string;
    status: 'valid' | 'expired' | 'missing';
  }[];
}

interface GovernmentComplianceStatusProps {
  isArabic: boolean;
}

export const GovernmentComplianceStatus: React.FC<GovernmentComplianceStatusProps> = ({ isArabic }) => {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'compliant' | 'pending' | 'expired'>('all');
  const [stats, setStats] = useState({
    total: 0,
    compliant: 0,
    pending: 0,
    nonCompliant: 0,
    overallScore: 0
  });

  useEffect(() => {
    loadComplianceData();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [complianceItems]);

  const loadComplianceData = () => {
    setComplianceItems([
      {
        id: 'comp_001',
        portal: 'Ministry of Labor (MOL)',
        portalAr: 'وزارة العمل',
        requirement: 'Monthly Labor Statistics Report',
        requirementAr: 'تقرير إحصائيات العمل الشهري',
        status: 'compliant',
        lastUpdated: '2024-02-28',
        dueDate: '2024-03-31',
        responsible: ['emp_001', 'emp_002'],
        impact: 'high',
        category: 'labor',
        progress: 100,
        documents: [
          { id: 'doc_001', name: 'February Report', nameAr: 'تقرير فبراير', status: 'valid' },
          { id: 'doc_002', name: 'Employee Records', nameAr: 'سجلات الموظفين', status: 'valid' }
        ]
      },
      {
        id: 'comp_002',
        portal: 'General Authority of Zakat and Tax (GAZT)',
        portalAr: 'الهيئة العامة للزكاة والضريبة',
        requirement: 'VAT Return Filing',
        requirementAr: 'تقديم إقرار ضريبة القيمة المضافة',
        status: 'pending',
        lastUpdated: '2024-02-15',
        dueDate: '2024-03-15',
        responsible: ['emp_003'],
        impact: 'high',
        category: 'financial',
        progress: 65,
        documents: [
          { id: 'doc_003', name: 'VAT Calculations', nameAr: 'حسابات ضريبة القيمة المضافة', status: 'valid' },
          { id: 'doc_004', name: 'Supporting Documents', nameAr: 'الوثائق المساندة', status: 'missing' }
        ]
      },
      {
        id: 'comp_003',
        portal: 'General Organization for Social Insurance (GOSI)',
        portalAr: 'المؤسسة العامة للتأمينات الاجتماعية',
        requirement: 'Employee Social Insurance Registration',
        requirementAr: 'تسجيل التأمينات الاجتماعية للموظفين',
        status: 'non_compliant',
        lastUpdated: '2024-01-30',
        dueDate: '2024-02-29',
        responsible: ['emp_004'],
        impact: 'high',
        category: 'labor',
        progress: 30,
        documents: [
          { id: 'doc_005', name: 'Registration Forms', nameAr: 'نماذج التسجيل', status: 'expired' },
          { id: 'doc_006', name: 'Employee Certificates', nameAr: 'شهادات الموظفين', status: 'missing' }
        ]
      },
      {
        id: 'comp_004',
        portal: 'Saudi Central Bank (SAMA)',
        portalAr: 'البنك المركزي السعودي',
        requirement: 'Financial Reporting Compliance',
        requirementAr: 'امتثال التقارير المالية',
        status: 'compliant',
        lastUpdated: '2024-02-20',
        dueDate: '2024-06-30',
        responsible: ['emp_005'],
        impact: 'medium',
        category: 'financial',
        progress: 100,
        documents: [
          { id: 'doc_007', name: 'Financial Statements', nameAr: 'البيانات المالية', status: 'valid' },
          { id: 'doc_008', name: 'Audit Report', nameAr: 'تقرير المراجعة', status: 'valid' }
        ]
      },
      {
        id: 'comp_005',
        portal: 'Ministry of Commerce (MOC)',
        portalAr: 'وزارة التجارة',
        requirement: 'Commercial Registration Renewal',
        requirementAr: 'تجديد السجل التجاري',
        status: 'expired',
        lastUpdated: '2023-12-31',
        dueDate: '2024-01-31',
        responsible: ['emp_001'],
        impact: 'high',
        category: 'regulatory',
        progress: 0,
        documents: [
          { id: 'doc_009', name: 'Registration Certificate', nameAr: 'شهادة التسجيل', status: 'expired' },
          { id: 'doc_010', name: 'Renewal Application', nameAr: 'طلب التجديد', status: 'missing' }
        ]
      }
    ]);
  };

  const calculateStats = () => {
    const total = complianceItems.length;
    const compliant = complianceItems.filter(item => item.status === 'compliant').length;
    const pending = complianceItems.filter(item => item.status === 'pending').length;
    const nonCompliant = complianceItems.filter(item => item.status === 'non_compliant' || item.status === 'expired').length;
    const overallScore = total > 0 ? Math.round((compliant / total) * 100) : 0;

    setStats({
      total,
      compliant,
      pending,
      nonCompliant,
      overallScore
    });
  };

  const getStatusColor = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'non_compliant':
        return 'bg-red-500 text-white';
      case 'expired':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getImpactColor = (impact: ComplianceItem['impact']) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getDocumentStatusColor = (status: ComplianceItem['documents'][0]['status']) => {
    switch (status) {
      case 'valid':
        return 'text-green-600';
      case 'expired':
        return 'text-red-600';
      case 'missing':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatNumber = (num: number) => {
    if (isArabic) {
      return num.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
    }
    return num.toString();
  };

  const filteredItems = complianceItems.filter(item => {
    switch (filter) {
      case 'compliant':
        return item.status === 'compliant';
      case 'pending':
        return item.status === 'pending';
      case 'expired':
        return item.status === 'expired' || item.status === 'non_compliant';
      default:
        return true;
    }
  });

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {isArabic ? 'حالة الامتثال الحكومي' : 'Government Compliance Status'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Compliance Score */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {formatNumber(stats.overallScore)}%
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {isArabic ? 'معدل الامتثال الإجمالي' : 'Overall Compliance Score'}
                </p>
                <Progress value={stats.overallScore} className="h-2" />
                
                <div className="grid grid-cols-3 gap-3 mt-4 text-xs">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{formatNumber(stats.compliant)}</div>
                    <div className="text-muted-foreground">{isArabic ? 'متوافق' : 'Compliant'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">{formatNumber(stats.pending)}</div>
                    <div className="text-muted-foreground">{isArabic ? 'معلق' : 'Pending'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{formatNumber(stats.nonCompliant)}</div>
                    <div className="text-muted-foreground">{isArabic ? 'غير متوافق' : 'Non-Compliant'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: 'all', label: isArabic ? 'الكل' : 'All' },
              { key: 'compliant', label: isArabic ? 'متوافق' : 'Compliant' },
              { key: 'pending', label: isArabic ? 'معلق' : 'Pending' },
              { key: 'expired', label: isArabic ? 'منتهي' : 'Expired' }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={filter === tab.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(tab.key as any)}
                className="whitespace-nowrap"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Compliance Items */}
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const daysUntilDue = item.dueDate ? getDaysUntilDue(item.dueDate) : null;
              
              return (
                <Card key={item.id} className="border">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium text-sm">
                              {isArabic ? item.portalAr : item.portal}
                            </h4>
                          </div>
                          <p className="text-sm font-medium">
                            {isArabic ? item.requirementAr : item.requirement}
                          </p>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>

                      {/* Progress */}
                      {item.status === 'pending' && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {isArabic ? 'التقدم' : 'Progress'}: {formatNumber(item.progress)}%
                            </span>
                            {daysUntilDue !== null && (
                              <span className="text-sm text-muted-foreground">
                                {daysUntilDue > 0 
                                  ? `${formatNumber(daysUntilDue)} ${isArabic ? 'يوم متبقي' : 'days left'}`
                                  : `${formatNumber(Math.abs(daysUntilDue))} ${isArabic ? 'يوم متأخر' : 'days overdue'}`
                                }
                              </span>
                            )}
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      )}

                      {/* Details */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{formatNumber(item.responsible.length)} {isArabic ? 'مسؤول' : 'responsible'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {isArabic ? 'آخر تحديث' : 'Updated'}: {new Date(item.lastUpdated).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Badge className={`${getImpactColor(item.impact)} text-xs`}>
                          {item.impact} {isArabic ? 'تأثير' : 'impact'}
                        </Badge>
                      </div>

                      {/* Documents */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {isArabic ? 'الوثائق المطلوبة' : 'Required Documents'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                          {item.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-2 bg-background rounded border">
                              <span className="text-xs">
                                {isArabic ? doc.nameAr : doc.name}
                              </span>
                              <div className={`text-xs font-medium ${getDocumentStatusColor(doc.status)}`}>
                                {doc.status}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {item.status !== 'compliant' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {isArabic ? 'فتح البوابة' : 'Open Portal'}
                          </Button>
                          <Button size="sm" variant="default" className="flex-1">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {isArabic ? 'تحديث الحالة' : 'Update Status'}
                          </Button>
                        </div>
                      )}

                      {/* Alerts */}
                      {(item.status === 'expired' || (daysUntilDue !== null && daysUntilDue <= 7)) && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium text-red-800">
                              {item.status === 'expired' 
                                ? (isArabic ? 'منتهي الصلاحية - تحديث فوري مطلوب' : 'Expired - Immediate Action Required')
                                : (isArabic ? 'اقتراب موعد الانتهاء' : 'Due Date Approaching')
                              }
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {isArabic ? 'لا توجد عناصر امتثال في هذه الفئة' : 'No compliance items in this category'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};