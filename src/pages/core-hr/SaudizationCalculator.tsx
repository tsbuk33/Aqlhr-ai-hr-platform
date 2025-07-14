import React, { useState, useEffect } from 'react';
import { useLanguage } from "@/hooks/useLanguageCompat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SanadAIFileProcessor } from "@/components/sanad/SanadAIFileProcessor";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  Calculator,
  Target,
  Clock,
  FileBarChart,
  Settings,
  Brain,
  Zap,
  Upload
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';

const SaudizationCalculator = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { toast } = useToast();

  // Mock data - in real implementation, this would come from your database
  const [saudizationData, setSaudizationData] = useState({
    totalEmployees: 2847,
    saudiEmployees: 1423,
    nonSaudiEmployees: 1424,
    currentPercentage: 49.98,
    targetPercentage: 50.0,
    gap: 1,
    complianceStatus: 'yellow', // green, yellow, red
    lastUpdated: new Date(),
    departments: [
      { name: 'Engineering', total: 450, saudi: 180, target: 40, status: 'green' },
      { name: 'Healthcare', total: 320, saudi: 200, target: 60, status: 'yellow' },
      { name: 'Finance', total: 180, saudi: 120, target: 65, status: 'green' },
      { name: 'IT', total: 280, saudi: 98, target: 35, status: 'red' },
      { name: 'Operations', total: 520, saudi: 312, target: 60, status: 'green' },
      { name: 'Sales', total: 290, saudi: 174, target: 60, status: 'green' },
    ],
    visaData: {
      totalAllocated: 500,
      used: 324,
      available: 176,
      expiringSoon: 23,
      pendingApplications: 45
    },
    nationalityBreakdown: [
      { nationality: 'Saudi', count: 1423, percentage: 49.98 },
      { nationality: 'Indian', count: 450, percentage: 15.8 },
      { nationality: 'Pakistani', count: 320, percentage: 11.2 },
      { nationality: 'Egyptian', count: 280, percentage: 9.8 },
      { nationality: 'Bangladeshi', count: 200, percentage: 7.0 },
      { nationality: 'Filipino', count: 174, percentage: 6.1 }
    ]
  });

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'green': return 'text-green-600 bg-green-50';
      case 'yellow': return 'text-yellow-600 bg-yellow-50';
      case 'red': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getComplianceText = (status: string) => {
    const texts = {
      green: isRTL ? 'ممتاز - ملتزم' : 'Excellent - Compliant',
      yellow: isRTL ? 'تحذير - يحتاج تحسين' : 'Warning - Needs Improvement',
      red: isRTL ? 'خطر - غير ملتزم' : 'Critical - Non-Compliant'
    };
    return texts[status as keyof typeof texts] || '';
  };

  const calculateSaudizationGap = (department: any) => {
    const currentPercentage = (department.saudi / department.total) * 100;
    const gap = department.target - currentPercentage;
    const requiredSaudis = Math.ceil((department.target / 100) * department.total) - department.saudi;
    return { currentPercentage, gap, requiredSaudis };
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', '#8884d8', '#82ca9d'];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Calculator className="h-8 w-8 text-primary" />
            {isRTL ? 'حاسبة السعودة والتأشيرات' : 'Saudization & Visa Calculator'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isRTL ? 'حاسبة ذكية مدعومة بالذكاء الاصطناعي لإدارة السعودة وامتثال النطاقات' : 'AI-powered calculator for Saudization management and Nitaqat compliance'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            {isRTL ? 'مدعوم بالذكاء الاصطناعي' : 'AI-Powered'}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {isRTL ? 'فوري' : 'Real-time'}
          </Badge>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              {isRTL ? 'نسبة السعودة الحالية' : 'Current Saudization'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {saudizationData.currentPercentage}%
            </div>
            <Progress value={saudizationData.currentPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {isRTL ? `الهدف: ${saudizationData.targetPercentage}%` : `Target: ${saudizationData.targetPercentage}%`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              {isRTL ? 'الحالة الامتثالية' : 'Compliance Status'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getComplianceColor(saudizationData.complianceStatus)} variant="secondary">
              {getComplianceText(saudizationData.complianceStatus)}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              {isRTL ? `فجوة: ${saudizationData.gap} موظف` : `Gap: ${saudizationData.gap} employees`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileBarChart className="h-4 w-4 text-blue-600" />
              {isRTL ? 'التأشيرات المتاحة' : 'Available Visas'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {saudizationData.visaData.available}
            </div>
            <p className="text-xs text-muted-foreground">
              {isRTL ? `من أصل ${saudizationData.visaData.totalAllocated}` : `out of ${saudizationData.visaData.totalAllocated}`}
            </p>
            <Progress 
              value={(saudizationData.visaData.used / saudizationData.visaData.totalAllocated) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              {isRTL ? 'تأشيرات تنتهي قريباً' : 'Expiring Soon'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {saudizationData.visaData.expiringSoon}
            </div>
            <p className="text-xs text-muted-foreground">
              {isRTL ? 'خلال 90 يوم' : 'within 90 days'}
            </p>
            {saudizationData.visaData.expiringSoon > 20 && (
              <Badge variant="destructive" className="mt-2 text-xs">
                {isRTL ? 'يتطلب اهتمام' : 'Requires Attention'}
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="executive" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="executive">
            {isRTL ? 'المدير التنفيذي' : 'Executive View'}
          </TabsTrigger>
          <TabsTrigger value="department">
            {isRTL ? 'عرض الأقسام' : 'Department View'}
          </TabsTrigger>
          <TabsTrigger value="operations">
            {isRTL ? 'العمليات' : 'Operations'}
          </TabsTrigger>
          <TabsTrigger value="documents">
            {isRTL ? 'المستندات' : 'Documents'}
          </TabsTrigger>
        </TabsList>

        {/* Executive View */}
        <TabsContent value="executive" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {isRTL ? 'توزيع الجنسيات' : 'Nationality Distribution'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={saudizationData.nationalityBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="count"
                      nameKey="nationality"
                    >
                      {saudizationData.nationalityBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {isRTL ? 'اتجاهات السعودة' : 'Saudization Trends'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { month: 'Jan', percentage: 45.2 },
                    { month: 'Feb', percentage: 46.8 },
                    { month: 'Mar', percentage: 47.5 },
                    { month: 'Apr', percentage: 48.1 },
                    { month: 'May', percentage: 49.2 },
                    { month: 'Jun', percentage: 49.98 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="percentage" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                {isRTL ? 'توصيات الذكاء الاصطناعي' : 'AI Recommendations'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'توصيات ذكية لتحسين نسبة السعودة' : 'Smart recommendations to improve Saudization'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">
                        {isRTL ? 'توظيف فوري مطلوب' : 'Immediate Hiring Required'}
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {isRTL ? 'يحتاج قسم تقنية المعلومات إلى توظيف 42 مواطن سعودي للوصول للهدف المطلوب' : 'IT department needs to hire 42 Saudi nationals to meet target compliance'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">
                        {isRTL ? 'استراتيجية التدريب والتطوير' : 'Training & Development Strategy'}
                      </h4>
                      <p className="text-sm text-green-700 mt-1">
                        {isRTL ? 'تطوير برامج تدريبية متقدمة لرفع مهارات الموظفين السعوديين في التخصصات التقنية' : 'Develop advanced training programs to upskill Saudi employees in technical specializations'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Department View */}
        <TabsContent value="department" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {isRTL ? 'السعودة حسب القسم' : 'Saudization by Department'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {saudizationData.departments.map((dept, index) => {
                  const { currentPercentage, gap, requiredSaudis } = calculateSaudizationGap(dept);
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{dept.name}</h4>
                        <Badge className={getComplianceColor(dept.status)} variant="secondary">
                          {currentPercentage.toFixed(1)}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">{isRTL ? 'الإجمالي' : 'Total'}</p>
                          <p className="font-semibold">{dept.total}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">{isRTL ? 'سعوديين' : 'Saudis'}</p>
                          <p className="font-semibold text-green-600">{dept.saudi}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">{isRTL ? 'الهدف' : 'Target'}</p>
                          <p className="font-semibold">{dept.target}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">{isRTL ? 'مطلوب' : 'Required'}</p>
                          <p className="font-semibold text-orange-600">
                            {requiredSaudis > 0 ? `+${requiredSaudis}` : '✓'}
                          </p>
                        </div>
                      </div>
                      
                      <Progress value={currentPercentage} className="mb-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{currentPercentage.toFixed(1)}%</span>
                        <span>{isRTL ? `الهدف: ${dept.target}%` : `Target: ${dept.target}%`}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operations View */}
        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileBarChart className="h-5 w-5" />
                  {isRTL ? 'إدارة كتل التأشيرات' : 'Visa Block Management'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">{isRTL ? 'المخصص' : 'Allocated'}</span>
                    <span className="font-bold">{saudizationData.visaData.totalAllocated}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium">{isRTL ? 'المستخدم' : 'Used'}</span>
                    <span className="font-bold text-red-600">{saudizationData.visaData.used}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">{isRTL ? 'المتاح' : 'Available'}</span>
                    <span className="font-bold text-green-600">{saudizationData.visaData.available}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium">{isRTL ? 'طلبات معلقة' : 'Pending Applications'}</span>
                    <span className="font-bold text-orange-600">{saudizationData.visaData.pendingApplications}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Calculator className="h-4 w-4 mr-2" />
                    {isRTL ? 'حساب الفجوة التفصيلية' : 'Calculate Detailed Gap'}
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileBarChart className="h-4 w-4 mr-2" />
                    {isRTL ? 'تقرير الامتثال' : 'Generate Compliance Report'}
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {isRTL ? 'توقعات السعودة' : 'Saudization Forecast'}
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    {isRTL ? 'توصيات الذكاء الاصطناعي' : 'AI Recommendations'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents View */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {isRTL ? 'رفع مستندات السعودة' : 'Upload Saudization Documents'}
              </CardTitle>
              <CardDescription>
                {isRTL ? 'ارفع ملفات الموظفين، تقارير النطاقات، وثائق التأشيرات لمعالجتها بالذكاء الاصطناعي' : 'Upload employee files, Nitaqat reports, visa documents for AI processing'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SanadAIFileProcessor
                platform="saudization"
                moduleType="core-hr"
                onFileProcessed={(file) => {
                  toast({
                    title: isRTL ? "تم رفع الملف بنجاح" : "File uploaded successfully",
                    description: isRTL ? `تم رفع ${file.name} ومعالجته بالذكاء الاصطناعي` : `${file.name} uploaded and processed with AI`
                  });
                }}
                acceptedTypes={['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv']}
                maxFileSize={20}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? 'المستندات المرفوعة' : 'Uploaded Documents'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileBarChart className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {isRTL ? 'تقرير نطاقات Q1 2024.xlsx' : 'Nitaqat Report Q1 2024.xlsx'}
                    </span>
                  </div>
                  <Badge variant="secondary">{isRTL ? 'تم معالجته' : 'Processed'}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileBarChart className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {isRTL ? 'قائمة الموظفين الحالية.pdf' : 'Current Employee List.pdf'}
                    </span>
                  </div>
                  <Badge variant="secondary">{isRTL ? 'تم معالجته' : 'Processed'}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SaudizationCalculator;