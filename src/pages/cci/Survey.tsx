import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Users, 
  Globe, 
  Clock, 
  CheckCircle,
  AlertCircle,
  PlayCircle,
  Settings
} from 'lucide-react';

const Survey: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div className={`min-h-screen bg-background p-6 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isArabic ? 'أداة المسح والعينات' : 'Survey Instrument & Sampling'}
            </h1>
            <p className="text-muted-foreground">
              {isArabic ? 'عقل للموارد البشرية - تقييم الثقافة المؤسسية' : 'AqlHR — Corporate Culture Assessment'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <PlayCircle className="mr-2 h-4 w-4" />
              {isArabic ? 'إطلاق المسح' : 'Launch Survey'}
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              {isArabic ? 'إعدادات المسح' : 'Survey Settings'}
            </Button>
          </div>
        </div>

        {/* Survey Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isArabic ? 'حالة المسح' : 'Survey Status'}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isArabic ? 'جاهز' : 'Ready'}</div>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'آخر تحديث: اليوم' : 'Last updated: Today'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isArabic ? 'حجم العينة' : 'Sample Size'}
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'من أصل 850 موظف' : 'out of 850 employees'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isArabic ? 'اللغات' : 'Languages'}
              </CardTitle>
              <Globe className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'العربية والإنجليزية' : 'Arabic & English'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isArabic ? 'مدة الإكمال' : 'Completion Time'}
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'دقيقة متوسط' : 'minutes average'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Survey Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Survey Design */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {isArabic ? 'تصميم المسح' : 'Survey Design'}
              </CardTitle>
              <CardDescription>
                {isArabic ? 'هيكل الاستبيان والأسئلة' : 'Questionnaire structure and questions'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">
                      {isArabic ? 'إطار القيم المتنافسة (CVF)' : 'Competing Values Framework (CVF)'}
                    </span>
                    <p className="text-sm text-muted-foreground">24 {isArabic ? 'سؤال' : 'questions'}</p>
                  </div>
                  <Badge variant="default">
                    {isArabic ? 'نشط' : 'Active'}
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">
                      {isArabic ? 'الشبكة الثقافية' : 'Cultural Web'}
                    </span>
                    <p className="text-sm text-muted-foreground">18 {isArabic ? 'سؤال' : 'questions'}</p>
                  </div>
                  <Badge variant="default">
                    {isArabic ? 'نشط' : 'Active'}
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">
                      {isArabic ? 'نموذج باريت للقيم' : 'Barrett Values Model'}
                    </span>
                    <p className="text-sm text-muted-foreground">32 {isArabic ? 'سؤال' : 'questions'}</p>
                  </div>
                  <Badge variant="default">
                    {isArabic ? 'نشط' : 'Active'}
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">
                      {isArabic ? 'الأمان النفسي' : 'Psychological Safety'}
                    </span>
                    <p className="text-sm text-muted-foreground">15 {isArabic ? 'سؤال' : 'questions'}</p>
                  </div>
                  <Badge variant="default">
                    {isArabic ? 'نشط' : 'Active'}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">
                    {isArabic ? 'المجموع: 89 سؤال، مدة متوقعة: 12-15 دقيقة' : 'Total: 89 questions, estimated duration: 12-15 minutes'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sampling Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {isArabic ? 'استراتيجية العينات' : 'Sampling Strategy'}
              </CardTitle>
              <CardDescription>
                {isArabic ? 'توزيع المشاركين والتمثيل' : 'Participant distribution and representation'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      {isArabic ? 'الإدارة العليا' : 'Senior Management'}
                    </span>
                    <span className="text-sm text-muted-foreground">25/45</span>
                  </div>
                  <Progress value={56} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      {isArabic ? 'الإدارة الوسطى' : 'Middle Management'}
                    </span>
                    <span className="text-sm text-muted-foreground">78/120</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      {isArabic ? 'الموظفون' : 'Employees'}
                    </span>
                    <span className="text-sm text-muted-foreground">144/685</span>
                  </div>
                  <Progress value={21} className="h-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 border rounded-lg text-center">
                  <div className="text-lg font-bold">29%</div>
                  <div className="text-xs text-muted-foreground">
                    {isArabic ? 'معدل الاستجابة' : 'Response Rate'}
                  </div>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <div className="text-lg font-bold">95%</div>
                  <div className="text-xs text-muted-foreground">
                    {isArabic ? 'مستوى الثقة' : 'Confidence Level'}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {isArabic ? 'العينة ممثلة إحصائياً' : 'Sample is statistically representative'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Language Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {isArabic ? 'دعم اللغات' : 'Language Support'}
            </CardTitle>
            <CardDescription>
              {isArabic ? 'الاستبيان متاح بالعربية والإنجليزية مع دعم RTL' : 'Survey available in Arabic and English with RTL support'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{isArabic ? 'النسخة العربية' : 'Arabic Version'}</h4>
                  <Badge variant="default">{isArabic ? 'مفعل' : 'Enabled'}</Badge>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {isArabic ? 'دعم الكتابة من اليمين إلى اليسار (RTL)' : 'Right-to-left (RTL) text support'}</li>
                  <li>• {isArabic ? 'ترجمة ثقافية محلية' : 'Culturally localized translation'}</li>
                  <li>• {isArabic ? 'خطوط عربية مُحسنة' : 'Optimized Arabic fonts'}</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{isArabic ? 'النسخة الإنجليزية' : 'English Version'}</h4>
                  <Badge variant="default">{isArabic ? 'مفعل' : 'Enabled'}</Badge>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {isArabic ? 'تصميم مستجيب للأجهزة المختلفة' : 'Responsive design for all devices'}</li>
                  <li>• {isArabic ? 'اختبار قابلية الوصول' : 'Accessibility tested'}</li>
                  <li>• {isArabic ? 'تحسين لبيئة العمل الدولية' : 'Optimized for international workplace'}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Survey;