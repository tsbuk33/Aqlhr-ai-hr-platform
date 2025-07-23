import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Shield, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Globe,
  TrendingUp,
  BarChart3,
  Clock,
  RefreshCw,
  Bell,
  Target,
  Building,
  Activity,
  Zap,
  Download,
  Settings,
  ChevronRight,
  ExternalLink
} from "lucide-react";

const EnhancedComplianceOverview = () => {
  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'انتهاء صلاحية التأشيرات',
      titleEn: 'Visa Expiration Alert',
      description: '5 تأشيرات موظفين تنتهي خلال 30 يوماً',
      descriptionEn: '5 employee visas expire within 30 days',
      timestamp: new Date().toISOString(),
      priority: 'high'
    },
    {
      id: 2,
      type: 'warning',
      title: 'هدف السعودة',
      titleEn: 'Saudization Target',
      description: 'قسم الهندسة أقل من النسبة المطلوبة',
      descriptionEn: 'Engineering department below required ratio',
      timestamp: new Date().toISOString(),
      priority: 'medium'
    }
  ]);

  const [saudizationData, setSaudizationData] = useState({
    currentRatio: 67.5,
    targetRatio: 70.0,
    nitaqatBand: 'yellow',
    departments: [
      { name: 'الإدارة العامة', nameEn: 'General Management', ratio: 85.2, target: 80, status: 'good' },
      { name: 'الهندسة', nameEn: 'Engineering', ratio: 45.8, target: 60, status: 'warning' },
      { name: 'المبيعات', nameEn: 'Sales', ratio: 72.3, target: 70, status: 'good' },
      { name: 'التسويق', nameEn: 'Marketing', ratio: 68.9, target: 65, status: 'good' }
    ]
  });

  const [governmentIntegrations, setGovernmentIntegrations] = useState([
    { 
      platform: 'HRSD', 
      status: 'connected', 
      lastSync: '2025-01-23T10:30:00Z',
      description: 'وزارة الموارد البشرية والتنمية الاجتماعية',
      descriptionEn: 'Ministry of Human Resources and Social Development'
    },
    { 
      platform: 'Qiwa', 
      status: 'connected', 
      lastSync: '2025-01-23T10:25:00Z',
      description: 'منصة قوى',
      descriptionEn: 'Qiwa Platform'
    },
    { 
      platform: 'GOSI', 
      status: 'connected', 
      lastSync: '2025-01-23T10:20:00Z',
      description: 'المؤسسة العامة للتأمينات الاجتماعية',
      descriptionEn: 'General Organization for Social Insurance'
    },
    { 
      platform: 'Absher', 
      status: 'connected', 
      lastSync: '2025-01-23T10:15:00Z',
      description: 'منصة أبشر',
      descriptionEn: 'Absher Platform'
    },
    { 
      platform: 'MOL', 
      status: 'connected', 
      lastSync: '2025-01-23T10:10:00Z',
      description: 'وزارة العمل',
      descriptionEn: 'Ministry of Labor'
    }
  ]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} دقيقة`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ساعة`;
    return `${Math.floor(diffInMinutes / 1440)} يوم`;
  };

  const getNitaqatBandColor = (band) => {
    switch (band) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">نظرة عامة على الامتثال والحوكمة</h1>
          <p className="text-muted-foreground">منصة الموارد البشرية الأكثر شمولية للامتثال في المملكة العربية السعودية</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث البيانات
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 ml-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          {activeAlerts.map((alert) => (
            <Alert key={alert.id} className={`border-r-4 ${alert.type === 'critical' ? 'border-r-red-500 bg-red-50' : 'border-r-yellow-500 bg-yellow-50'}`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="flex items-center justify-between">
                <span>{alert.title}</span>
                <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'}>
                  {alert.priority === 'high' ? 'عاجل' : 'متوسط'}
                </Badge>
              </AlertTitle>
              <AlertDescription>
                {alert.description} - منذ {formatTimeAgo(alert.timestamp)}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-status-success">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-status-success" />
              الامتثال العام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-success">94.2%</div>
            <Progress value={94.2} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">+2.4% من الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              نسبة السعودة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{saudizationData.currentRatio}%</div>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-3 h-3 rounded-full ${getNitaqatBandColor(saudizationData.nitaqatBand)}`}></div>
              <span className="text-xs text-muted-foreground">النطاق الأصفر</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              التكامل الحكومي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">5/5</div>
            <p className="text-sm text-muted-foreground">منصات متصلة</p>
            <div className="flex gap-1 mt-2">
              {governmentIntegrations.map((integration, index) => (
                <div key={index} className={`w-2 h-2 rounded-full ${getStatusColor(integration.status)}`}></div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-warning" />
              التنبيهات النشطة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{activeAlerts.length}</div>
            <p className="text-sm text-muted-foreground">تحتاج إلى اهتمام</p>
          </CardContent>
        </Card>

        <Card className="border-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              مسارات التدقيق
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">15,678+</div>
            <p className="text-sm text-muted-foreground">سجلات كاملة</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="saudization">إدارة السعودة</TabsTrigger>
          <TabsTrigger value="integration">التكامل الحكومي</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Original Compliance Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  إدارة الامتثال التنظيمي
                </CardTitle>
                <CardDescription>مراقبة الامتثال لقانون العمل السعودي ونظام حماية البيانات الشخصية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">قانون العمل السعودي</span>
                    <Badge variant="secondary" className="bg-status-success text-white">98.2%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">امتثال حماية البيانات</span>
                    <Badge variant="secondary" className="bg-primary text-white">95.4%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">المراقبة المستمرة</span>
                    <Badge variant="secondary" className="bg-status-success text-white">24/7</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-success" />
                  نظام إدارة اللجان
                </CardTitle>
                <CardDescription>إشراف شامل على الحوكمة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">لجان مجلس الإدارة</span>
                    <Badge variant="secondary" className="bg-status-success text-white">3 نشطة</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">لجان الموارد البشرية</span>
                    <Badge variant="secondary" className="bg-primary text-white">4 نشطة</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">حضور الاجتماعات</span>
                    <Badge variant="secondary" className="bg-accent text-white">96%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-accent" />
                  إدارة مسارات التدقيق
                </CardTitle>
                <CardDescription>تسجيل وتتبع كامل للأنشطة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">فحوصات الامتثال اليومية</span>
                    <Badge variant="secondary" className="bg-status-success text-white">156</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">أنشطة المستخدمين المسجلة</span>
                    <Badge variant="secondary" className="bg-primary text-white">15,678+</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">سلامة البيانات</span>
                    <Badge variant="secondary" className="bg-accent text-white">99.8%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  إطار إدارة المخاطر
                </CardTitle>
                <CardDescription>تحديد وتخفيف المخاطر بشكل منهجي</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">تقييمات المخاطر النشطة</span>
                    <Badge variant="secondary" className="bg-status-success text-white">23</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">استراتيجيات التخفيف</span>
                    <Badge variant="secondary" className="bg-primary text-white">18</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">مستوى المخاطر</span>
                    <Badge variant="secondary" className="bg-status-success text-white">منخفض</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Compliance Modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  إدارة السياسات
                </CardTitle>
                <CardDescription>47 سياسة نشطة مع 98.7% إقرارات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">47</div>
                  <div className="text-sm text-muted-foreground">سياسة نشطة</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  إطار الحوكمة
                </CardTitle>
                <CardDescription>حوكمة منظمة ومساءلة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">100%</div>
                  <div className="text-sm text-muted-foreground">تغطية الإطار</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  تتبع الوثائق القانونية
                </CardTitle>
                <CardDescription>إدارة العقود والوثائق القانونية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">2,847</div>
                  <div className="text-sm text-muted-foreground">عقد نشط</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="saudization" className="space-y-6">
          {/* Saudization Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  نظرة عامة على السعودة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">النسبة الحالية</span>
                      <span className="text-2xl font-bold text-primary">{saudizationData.currentRatio}%</span>
                    </div>
                    <Progress value={saudizationData.currentRatio} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">الهدف المطلوب</span>
                      <span className="text-lg font-semibold text-muted-foreground">{saudizationData.targetRatio}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${getNitaqatBandColor(saudizationData.nitaqatBand)}`}></div>
                    <span className="text-sm">النطاق الأصفر - نتاقات</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  الاتجاهات الشهرية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">هذا الشهر</span>
                    <Badge variant="secondary" className="bg-green-500 text-white">+1.2%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">الشهر الماضي</span>
                    <Badge variant="secondary" className="bg-blue-500 text-white">+0.8%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">المتوسط السنوي</span>
                    <Badge variant="secondary" className="bg-purple-500 text-white">+0.9%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                تفصيل الأقسام
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {saudizationData.departments.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{dept.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{dept.ratio}%</span>
                        <Badge variant={dept.status === 'good' ? 'secondary' : 'destructive'} className={dept.status === 'good' ? 'bg-green-500 text-white' : ''}>
                          {dept.status === 'good' ? 'جيد' : 'يحتاج تحسين'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={dept.ratio} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground">الهدف: {dept.target}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          {/* Government Integration Hub */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {governmentIntegrations.map((integration, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      {integration.platform}
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(integration.status)}`}></div>
                  </CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">الحالة</span>
                      <Badge variant="secondary" className={integration.status === 'connected' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                        {integration.status === 'connected' ? 'متصل' : 'غير متصل'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">آخر مزامنة</span>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(integration.lastSync)}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <RefreshCw className="h-4 w-4 ml-2" />
                      مزامنة الآن
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Integration Status Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                ملخص حالة التكامل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-500">5</div>
                  <div className="text-sm text-muted-foreground">منصات متصلة</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">24/7</div>
                  <div className="text-sm text-muted-foreground">مراقبة مستمرة</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-500">99.9%</div>
                  <div className="text-sm text-muted-foreground">وقت التشغيل</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-500">15 ثانية</div>
                  <div className="text-sm text-muted-foreground">متوسط وقت الاستجابة</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">قسم التقارير المحسن</h3>
            <p className="text-gray-500 mb-4">تقارير شاملة للامتثال والسعودة والتكامل الحكومي</p>
            <Button variant="outline">
              <Settings className="h-4 w-4 ml-2" />
              قريباً...
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Enhanced PIF Partnership Readiness */}
      <Card className="border-primary bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            جاهزية الامتثال للشراكات الاستراتيجية
          </CardTitle>
          <CardDescription>منصة الموارد البشرية الأكثر امتثالاً في المملكة العربية السعودية ومعدة للشراكات الاستراتيجية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 border rounded-lg bg-white/50">
              <div className="text-2xl font-bold text-status-success">94.2%</div>
              <div className="text-sm text-muted-foreground">نقاط الامتثال العامة</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-white/50">
              <div className="text-2xl font-bold text-primary">{saudizationData.currentRatio}%</div>
              <div className="text-sm text-muted-foreground">نسبة السعودة</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-white/50">
              <div className="text-2xl font-bold text-accent">5/5</div>
              <div className="text-sm text-muted-foreground">التكامل الحكومي</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-white/50">
              <div className="text-2xl font-bold text-green-500">15</div>
              <div className="text-sm text-muted-foreground">وحدات الامتثال</div>
            </div>
            <div className="text-center p-4 border rounded-lg bg-white/50">
              <div className="text-2xl font-bold text-warning">مؤسسي</div>
              <div className="text-sm text-muted-foreground">درجة الأمان</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedComplianceOverview;
