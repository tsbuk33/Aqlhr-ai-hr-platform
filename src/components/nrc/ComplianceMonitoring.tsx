import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Eye } from 'lucide-react';

const ComplianceMonitoring = () => {
  // Mock data for compliance monitoring
  const complianceData = {
    overallStatus: {
      score: 85,
      status: 'good',
      lastUpdate: '2024-01-20T10:30:00',
      nextInspection: '2024-03-15'
    },
    alerts: [
      {
        id: 1,
        severity: 'high',
        type: 'quota_violation',
        message: 'نسبة السعودة أقل من المطلوب بـ 0.5%',
        timestamp: '2024-01-20T09:15:00',
        actionRequired: true
      },
      {
        id: 2,
        severity: 'medium',
        type: 'document_expiry',
        message: 'انتهاء صلاحية 3 تصاريح عمل خلال 30 يوم',
        timestamp: '2024-01-20T08:45:00',
        actionRequired: true
      },
      {
        id: 3,
        severity: 'low',
        type: 'info',
        message: 'تحديث جديد في لوائح وزارة العمل',
        timestamp: '2024-01-19T16:20:00',
        actionRequired: false
      }
    ],
    inspectionHistory: [
      {
        id: 1,
        date: '2024-01-10',
        type: 'routine',
        result: 'passed',
        score: 92,
        inspector: 'مكتب العمل - الرياض'
      },
      {
        id: 2,
        date: '2023-10-15',
        type: 'complaint',
        result: 'passed',
        score: 88,
        inspector: 'مكتب العمل - الرياض'
      }
    ],
    documentation: [
      {
        id: 1,
        name: 'تقرير السعودة الشهري',
        status: 'current',
        lastUpdated: '2024-01-15',
        expiryDate: '2024-02-15'
      },
      {
        id: 2,
        name: 'سجل الموظفين',
        status: 'current',
        lastUpdated: '2024-01-20',
        expiryDate: null
      },
      {
        id: 3,
        name: 'تصاريح العمل',
        status: 'expiring_soon',
        lastUpdated: '2024-01-01',
        expiryDate: '2024-02-20'
      }
    ]
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return 'غير محدد';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'secondary';
      case 'expiring_soon': return 'default';
      case 'expired': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'current': return 'ساري';
      case 'expiring_soon': return 'ينتهي قريباً';
      case 'expired': return 'منتهي الصلاحية';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            حالة الامتثال العامة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{complianceData.overallStatus.score}%</div>
              <p className="text-sm text-muted-foreground">درجة الامتثال</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                جيد
              </div>
              <p className="text-sm text-muted-foreground">الحالة العامة</p>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">
                {new Date(complianceData.overallStatus.lastUpdate).toLocaleDateString('ar-SA')}
              </div>
              <p className="text-sm text-muted-foreground">آخر تحديث</p>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">
                {new Date(complianceData.overallStatus.nextInspection).toLocaleDateString('ar-SA')}
              </div>
              <p className="text-sm text-muted-foreground">التفتيش القادم</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            التنبيهات النشطة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceData.alerts.map((alert) => (
              <Alert key={alert.id} className={alert.severity === 'high' ? 'border-red-500' : alert.severity === 'medium' ? 'border-amber-500' : 'border-blue-500'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex justify-between items-center">
                  <span>{alert.message}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {getSeverityText(alert.severity)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString('ar-SA')}
                    </span>
                  </div>
                </AlertTitle>
                {alert.actionRequired && (
                  <AlertDescription className="mt-2">
                    <Button size="sm" className="mr-2">
                      اتخاذ إجراء
                    </Button>
                    <Button size="sm" variant="outline">
                      عرض التفاصيل
                    </Button>
                  </AlertDescription>
                )}
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            حالة الوثائق والمستندات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceData.documentation.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{doc.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      آخر تحديث: {new Date(doc.lastUpdated).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(doc.status)}>
                    {getStatusText(doc.status)}
                  </Badge>
                  {doc.expiryDate && (
                    <span className="text-xs text-muted-foreground">
                      ينتهي: {new Date(doc.expiryDate).toLocaleDateString('ar-SA')}
                    </span>
                  )}
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inspection History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            تاريخ التفتيشات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceData.inspectionHistory.map((inspection) => (
              <div key={inspection.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">
                    {inspection.type === 'routine' ? 'تفتيش دوري' : 'تفتيش بناء على شكوى'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {inspection.inspector} - {new Date(inspection.date).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold">{inspection.score}%</div>
                    <p className="text-xs text-muted-foreground">النتيجة</p>
                  </div>
                  <Badge variant={inspection.result === 'passed' ? 'secondary' : 'destructive'}>
                    {inspection.result === 'passed' ? 'نجح' : 'فشل'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceMonitoring;