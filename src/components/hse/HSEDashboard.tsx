import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Users, Activity, Calendar, Upload, FileText, TrendingUp, Target, BarChart3, Award, RefreshCw, Filter, Download } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useEnhancedFileUpload } from "@/hooks/useEnhancedFileUpload";
import { useCallback } from "react";
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import EnhancedModuleAIChat from '@/components/universal/EnhancedModuleAIChat';

export const HSEDashboard = () => {
  const { language, isRTL } = useLanguage();
  const { uploadFile, isUploading, uploadProgress } = useEnhancedFileUpload({
    platform: 'web',
    onFileProcessed: (file) => {
      console.log('HSE file processed:', file);
    }
  });

  const contextData = {
    moduleName: language === 'ar' ? 'الصحة والسلامة المهنية' : 'Health & Safety',
    currentData: {
      daysWithoutIncident: 247,
      trainingCompliance: 95,
      riskLevel: 'Low',
      activePPE: 1234
    },
    uploadedDocs: [],
    translations: {
      aiChat: {
        title: language === 'ar' ? 'مساعد الذكي للصحة والسلامة' : 'Health & Safety AI Assistant',
        welcomeMessage: language === 'ar' ? 'مرحباً! أنا هنا لمساعدتك في إدارة الصحة والسلامة المهنية وتقديم التوصيات والتحليلات.' : 'Hello! I\'m here to help you manage occupational health & safety and provide recommendations and analytics.',
        placeholder: language === 'ar' ? 'اسأل عن الصحة والسلامة...' : 'Ask about health & safety...'
      }
    }
  };

  const hseStats = [
    {
      title: language === 'ar' ? "أيام بدون حوادث" : "Days Without Incident",
      value: "247",
      icon: Shield,
      variant: "default" as const,
      trend: language === 'ar' ? "+12% من الشهر الماضي" : "+12% from last month"
    },
    {
      title: language === 'ar' ? "الامتثال للتدريب" : "Training Compliance",
      value: "95%",
      icon: Users,
      variant: "success" as const,
      trend: language === 'ar' ? "+5% من الشهر الماضي" : "+5% from last month"
    },
    {
      title: language === 'ar' ? "مستوى المخاطر" : "Risk Level",
      value: language === 'ar' ? "منخفض" : "Low",
      icon: AlertTriangle,
      variant: "success" as const,
      trend: language === 'ar' ? "مستقر" : "Stable"
    },
    {
      title: language === 'ar' ? "معدات الحماية النشطة" : "Active PPE",
      value: "1,234",
      icon: Activity,
      variant: "default" as const,
      trend: language === 'ar' ? "+3% من الشهر الماضي" : "+3% from last month"
    }
  ];

  const recentIncidents = [
    {
      id: "INC-001",
      type: "Near Miss",
      date: "2024-01-15",
      severity: "Low",
      status: "Closed"
    },
    {
      id: "INC-002", 
      type: "Minor Injury",
      date: "2024-01-10",
      severity: "Medium",
      status: "Under Investigation"
    }
  ];

  const upcomingTraining = [
    {
      course: "Fire Safety Training",
      date: "2024-01-20",
      participants: 25,
      mandatory: true
    },
    {
      course: "PPE Usage Workshop",
      date: "2024-01-25", 
      participants: 15,
      mandatory: false
    }
  ];

  return (
    <div className={`container mx-auto p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="text-center lg:text-left space-y-2">
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {language === 'ar' ? 'الصحة والسلامة المهنية' : 'Health, Safety & Environment'}
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            {language === 'ar' ? 'إدارة شاملة لأمان مكان العمل والامتثال التنظيمي مع ذكاء اصطناعي متقدم' : 'Comprehensive workplace safety management and regulatory compliance with advanced AI intelligence'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {language === 'ar' ? 'تحديث البيانات' : 'Refresh Data'}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            {language === 'ar' ? 'الفلاتر' : 'Filters'}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>
          <Button size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            {language === 'ar' ? 'تقرير جديد' : 'New Report'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {hseStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className={`text-3xl font-bold ${
                  index === 0 ? 'text-green-600' : 
                  index === 1 ? 'text-blue-600' : 
                  index === 2 ? 'text-green-600' : 'text-orange-600'
                }`}>{stat.value}</div>
                <Badge variant="secondary" className={`${
                  index === 0 ? 'text-green-600 bg-green-50' : 
                  index === 1 ? 'text-blue-600 bg-blue-50' : 
                  index === 2 ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'
                }`}>
                  {index === 0 ? '+12%' : index === 1 ? '+5%' : index === 2 ? '✓' : '+3%'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {language === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {language === 'ar' ? 'الأقسام' : 'Departments'}
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {language === 'ar' ? 'الحوادث' : 'Incidents'}
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {language === 'ar' ? 'التدريب' : 'Training'}
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            {language === 'ar' ? 'الامتثال' : 'Compliance'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {language === 'ar' ? 'الحوادث الأخيرة' : 'Recent Incidents'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <div key={incident.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{incident.id}</div>
                        <div className="text-sm text-muted-foreground">{language === 'ar' ? 'حادث بسيط' : incident.type}</div>
                        <div className="text-xs text-muted-foreground">{incident.date}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={incident.severity === 'Low' ? 'default' : 'destructive'}>
                          {language === 'ar' ? (incident.severity === 'Low' ? 'منخفض' : 'متوسط') : incident.severity}
                        </Badge>
                        <Badge variant="outline">
                          {language === 'ar' ? (incident.status === 'Closed' ? 'مغلق' : 'قيد التحقيق') : incident.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {language === 'ar' ? 'التدريبات القادمة' : 'Upcoming Training'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTraining.map((training, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{language === 'ar' ? 'تدريب السلامة من الحرائق' : training.course}</div>
                        <div className="text-sm text-muted-foreground">{training.date}</div>
                        <div className="text-xs text-muted-foreground">
                          {training.participants} {language === 'ar' ? 'مشارك' : 'participants'}
                        </div>
                      </div>
                      <div>
                        {training.mandatory && (
                          <Badge variant="destructive">
                            {language === 'ar' ? 'إجباري' : 'Mandatory'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {language === 'ar' ? 'أداء السلامة العام' : 'Overall Safety Performance'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{language === 'ar' ? 'نسبة السلامة الإجمالية' : 'Overall Safety Rate'}</span>
                    <span className="font-bold text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{language === 'ar' ? 'الامتثال للبروتوكولات' : 'Protocol Compliance'}</span>
                    <span className="font-bold text-blue-600">97%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{language === 'ar' ? 'تقييم المخاطر' : 'Risk Assessment'}</span>
                    <span className="font-bold text-green-600">{language === 'ar' ? 'منخفض' : 'Low'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {language === 'ar' ? 'أفضل المؤدين في السلامة' : 'Top Safety Performers'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{language === 'ar' ? 'سالم أحمد' : 'Salem Ahmed'}</span>
                    <span className="font-bold text-yellow-600">100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{language === 'ar' ? 'نورا محمد' : 'Nora Mohamed'}</span>
                    <span className="font-bold text-yellow-600">98%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{language === 'ar' ? 'خالد علي' : 'Khalid Ali'}</span>
                    <span className="font-bold text-yellow-600">97%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          {/* Department Safety Performance Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {language === 'ar' ? 'أداء السلامة حسب القسم' : 'Department Safety Performance Breakdown'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Production Department */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">{language === 'ar' ? 'قسم الإنتاج' : 'Production Department'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'متوسط السلامة:' : 'Avg Safety Score:'}</span>
                      <span className="font-bold text-green-600">96%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'عدد الموظفين:' : 'Employees:'}</span>
                      <span>45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'أيام بدون حوادث:' : 'Days w/o incidents:'}</span>
                      <span className="font-bold text-blue-600">89</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">{language === 'ar' ? 'أفضل المؤدين:' : 'Top Safety Performers:'}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'سالم أحمد' : 'Salem Ahmed'}</span>
                          <span className="text-yellow-600">100%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'أمير سعد' : 'Amir Saad'}</span>
                          <span className="text-yellow-600">99%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'هالة محمد' : 'Hala Mohamed'}</span>
                          <span className="text-yellow-600">98%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Engineering Department */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">{language === 'ar' ? 'قسم الهندسة' : 'Engineering Department'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'متوسط السلامة:' : 'Avg Safety Score:'}</span>
                      <span className="font-bold text-green-600">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'عدد الموظفين:' : 'Employees:'}</span>
                      <span>28</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'أيام بدون حوادث:' : 'Days w/o incidents:'}</span>
                      <span className="font-bold text-blue-600">156</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">{language === 'ar' ? 'أفضل المؤدين:' : 'Top Safety Performers:'}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'نورا محمد' : 'Nora Mohamed'}</span>
                          <span className="text-yellow-600">98%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'يوسف خالد' : 'Youssef Khalid'}</span>
                          <span className="text-yellow-600">97%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'ريم علي' : 'Reem Ali'}</span>
                          <span className="text-yellow-600">96%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Maintenance Department */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">{language === 'ar' ? 'قسم الصيانة' : 'Maintenance Department'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'متوسط السلامة:' : 'Avg Safety Score:'}</span>
                      <span className="font-bold text-orange-600">91%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'عدد الموظفين:' : 'Employees:'}</span>
                      <span>22</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'أيام بدون حوادث:' : 'Days w/o incidents:'}</span>
                      <span className="font-bold text-blue-600">67</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">{language === 'ar' ? 'أفضل المؤدين:' : 'Top Safety Performers:'}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'خالد علي' : 'Khalid Ali'}</span>
                          <span className="text-yellow-600">97%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'أحمد حسن' : 'Ahmed Hassan'}</span>
                          <span className="text-yellow-600">95%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'فاطمة سالم' : 'Fatima Salem'}</span>
                          <span className="text-yellow-600">94%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Administration Department */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">{language === 'ar' ? 'قسم الإدارة' : 'Administration Department'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'متوسط السلامة:' : 'Avg Safety Score:'}</span>
                      <span className="font-bold text-green-600">98%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'عدد الموظفين:' : 'Employees:'}</span>
                      <span>16</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'أيام بدون حوادث:' : 'Days w/o incidents:'}</span>
                      <span className="font-bold text-blue-600">247</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">{language === 'ar' ? 'أفضل المؤدين:' : 'Top Safety Performers:'}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'مريم أحمد' : 'Mariam Ahmed'}</span>
                          <span className="text-yellow-600">100%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'عبدالله محمد' : 'Abdullah Mohamed'}</span>
                          <span className="text-yellow-600">99%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'ليلى سعد' : 'Layla Saad'}</span>
                          <span className="text-yellow-600">98%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Control Department */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">{language === 'ar' ? 'قسم مراقبة الجودة' : 'Quality Control Department'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'متوسط السلامة:' : 'Avg Safety Score:'}</span>
                      <span className="font-bold text-green-600">95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'عدد الموظفين:' : 'Employees:'}</span>
                      <span>12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'أيام بدون حوادث:' : 'Days w/o incidents:'}</span>
                      <span className="font-bold text-blue-600">134</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">{language === 'ar' ? 'أفضل المؤدين:' : 'Top Safety Performers:'}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'سارة محمود' : 'Sara Mahmoud'}</span>
                          <span className="text-yellow-600">98%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'محمد علي' : 'Mohamed Ali'}</span>
                          <span className="text-yellow-600">97%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'دينا حسن' : 'Dina Hassan'}</span>
                          <span className="text-yellow-600">96%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logistics Department */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">{language === 'ar' ? 'قسم اللوجستيات' : 'Logistics Department'}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'متوسط السلامة:' : 'Avg Safety Score:'}</span>
                      <span className="font-bold text-orange-600">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'عدد الموظفين:' : 'Employees:'}</span>
                      <span>19</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{language === 'ar' ? 'أيام بدون حوادث:' : 'Days w/o incidents:'}</span>
                      <span className="font-bold text-blue-600">43</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">{language === 'ar' ? 'أفضل المؤدين:' : 'Top Safety Performers:'}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'طارق سالم' : 'Tarek Salem'}</span>
                          <span className="text-yellow-600">95%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'هند عبدالله' : 'Hind Abdullah'}</span>
                          <span className="text-yellow-600">93%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'ar' ? 'عمر حسين' : 'Omar Hussein'}</span>
                          <span className="text-yellow-600">92%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Incident management system with full HRSD compliance and automated reporting.
            </AlertDescription>
          </Alert>
          <Card>
            <CardHeader>
              <CardTitle>Incident Management</CardTitle>
              <CardDescription>
                Report, investigate, and track workplace incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Incident management module will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Safety Training Management</CardTitle>
              <CardDescription>
                Manage safety training programs and certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Training management module will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Compliance</CardTitle>
              <CardDescription>
                HRSD and Saudi Labor Law compliance tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Document Upload Section */}
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                <div className="text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      {language === 'ar' ? 'رفع وثائق السلامة والصحة المهنية' : 'Upload HSE Documents'}
                    </h4>
                    <p className="text-muted-foreground text-sm mb-4">
                      {language === 'ar' 
                        ? 'ارفع تقارير الحوادث، شهادات التدريب، وثائق تقييم المخاطر، وملفات الامتثال'
                        : 'Upload incident reports, training certificates, risk assessments, and compliance documents'
                      }
                    </p>
                  </div>
                  
                  <input
                    type="file"
                    id="hse-file-upload"
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        Array.from(files).forEach(file => {
                          uploadFile(file);
                        });
                      }
                    }}
                  />
                  
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('hse-file-upload')?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    {isUploading 
                      ? `${language === 'ar' ? 'جاري الرفع' : 'Uploading'} ${uploadProgress}%`
                      : (language === 'ar' ? 'اختر الملفات' : 'Choose Files')
                    }
                  </Button>
                  
                  <div className="text-xs text-muted-foreground">
                    {language === 'ar' 
                      ? 'تنسيقات مدعومة: PDF, Word, Excel, الصور (حتى 10MB لكل ملف)'
                      : 'Supported formats: PDF, Word, Excel, Images (up to 10MB per file)'
                    }
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm">
                {language === 'ar' 
                  ? 'وحدة إدارة الامتثال الكاملة ستكون متاحة هنا قريباً.'
                  : 'Full compliance management module will be available here soon.'
                }
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ModuleDocumentUploader moduleKey="health-safety" />
      <EnhancedModuleAIChat 
        moduleKey="health-safety"
        context={contextData}
      />
    </div>
  );
};