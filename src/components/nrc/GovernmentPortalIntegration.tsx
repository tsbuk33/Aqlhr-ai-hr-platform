import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  FileText,
  Users,
  Shield,
  CreditCard
} from 'lucide-react';

const GovernmentPortalIntegration = () => {
  // Mock data for government portals integration
  const portalsData = {
    qiwa: {
      status: 'connected',
      lastSync: '2024-01-20T10:15:00',
      pendingSubmissions: 2,
      workPermits: {
        active: 185,
        expiring: 12,
        pending: 3
      }
    },
    gosi: {
      status: 'connected',
      lastSync: '2024-01-20T09:30:00',
      totalRegistered: 245,
      monthlyContributions: 245000,
      pendingClaims: 1
    },
    absher: {
      status: 'connected',
      lastSync: '2024-01-20T08:45:00',
      verifiedEmployees: 240,
      pendingVerifications: 5,
      dependentsTracked: 89
    },
    mol: {
      status: 'connected',
      lastSync: '2024-01-20T07:20:00',
      complianceReports: 'current',
      violations: 0,
      inspections: 2
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'disconnected': return 'text-red-500';
      case 'syncing': return 'text-amber-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'متصل';
      case 'disconnected': return 'غير متصل';
      case 'syncing': return 'جاري المزامنة';
      default: return 'غير معروف';
    }
  };

  return (
    <div className="space-y-6">
      {/* Portal Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">منصة قِوى</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${getStatusColor(portalsData.qiwa.status)}`} />
              <span className="text-sm font-medium">{getStatusText(portalsData.qiwa.status)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              آخر مزامنة: {new Date(portalsData.qiwa.lastSync).toLocaleString('ar-SA')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التأمينات الاجتماعية</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${getStatusColor(portalsData.gosi.status)}`} />
              <span className="text-sm font-medium">{getStatusText(portalsData.gosi.status)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              آخر مزامنة: {new Date(portalsData.gosi.lastSync).toLocaleString('ar-SA')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أبشر</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${getStatusColor(portalsData.absher.status)}`} />
              <span className="text-sm font-medium">{getStatusText(portalsData.absher.status)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              آخر مزامنة: {new Date(portalsData.absher.lastSync).toLocaleString('ar-SA')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">وزارة العمل</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${getStatusColor(portalsData.mol.status)}`} />
              <span className="text-sm font-medium">{getStatusText(portalsData.mol.status)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              آخر مزامنة: {new Date(portalsData.mol.lastSync).toLocaleString('ar-SA')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* QIWA Integration Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            منصة قِوى - تفاصيل التكامل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>تصاريح العمل النشطة</span>
                <span className="font-semibold">{portalsData.qiwa.workPermits.active}</span>
              </div>
              <div className="flex justify-between">
                <span>تنتهي خلال 30 يوم</span>
                <span className="font-semibold text-amber-600">{portalsData.qiwa.workPermits.expiring}</span>
              </div>
              <div className="flex justify-between">
                <span>طلبات معلقة</span>
                <span className="font-semibold text-blue-600">{portalsData.qiwa.workPermits.pending}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{portalsData.qiwa.pendingSubmissions}</div>
                <p className="text-sm text-muted-foreground">تقارير معلقة للإرسال</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                مزامنة البيانات
              </Button>
              <Button variant="outline" className="w-full">
                إرسال التقارير المعلقة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GOSI Integration Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            التأمينات الاجتماعية - تفاصيل التكامل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>الموظفون المسجلون</span>
                <span className="font-semibold">{portalsData.gosi.totalRegistered}</span>
              </div>
              <div className="flex justify-between">
                <span>الاشتراكات الشهرية</span>
                <span className="font-semibold">{portalsData.gosi.monthlyContributions.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between">
                <span>المطالبات المعلقة</span>
                <span className="font-semibold">{portalsData.gosi.pendingClaims}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">100%</div>
                <p className="text-sm text-muted-foreground">معدل الامتثال</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                حساب الاشتراكات
              </Button>
              <Button variant="outline" className="w-full">
                تحميل كشف الراتب
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ABSHER Integration Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            أبشر - تفاصيل التكامل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>الموظفون المتحقق منهم</span>
                <span className="font-semibold">{portalsData.absher.verifiedEmployees}</span>
              </div>
              <Progress 
                value={(portalsData.absher.verifiedEmployees / 245) * 100} 
                className="mt-2" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>التحقق المعلق</span>
                <span className="font-semibold text-amber-600">{portalsData.absher.pendingVerifications}</span>
              </div>
              <div className="flex justify-between">
                <span>التابعين المتتبعين</span>
                <span className="font-semibold">{portalsData.absher.dependentsTracked}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                تحديث حالة التحقق
              </Button>
              <Button variant="outline" className="w-full">
                إدارة التابعين
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automated Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            المهام المؤتمتة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-medium">تقرير السعودة الشهري</h4>
                  <p className="text-sm text-muted-foreground">إرسال تلقائي كل شهر</p>
                </div>
              </div>
              <Badge variant="secondary">نشط</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-medium">تحديث بيانات التأمينات</h4>
                  <p className="text-sm text-muted-foreground">مزامنة يومية</p>
                </div>
              </div>
              <Badge variant="secondary">نشط</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <h4 className="font-medium">تنبيهات انتهاء التصاريح</h4>
                  <p className="text-sm text-muted-foreground">تنبيه قبل 30 يوم</p>
                </div>
              </div>
              <Badge variant="default">تحتاج مراجعة</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GovernmentPortalIntegration;