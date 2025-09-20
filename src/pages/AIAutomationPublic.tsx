import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Zap, Bot, Cog, Workflow, Brain, Sparkles } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function AIAutomationPublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const automationFeatures = [
    {
      icon: Workflow,
      title: isArabic ? 'أتمتة سير العمل' : 'Workflow Automation',
      description: isArabic ? 'أتمتة العمليات الروتينية وسير العمل المعقد' : 'Automate routine processes and complex workflows'
    },
    {
      icon: Bot,
      title: isArabic ? 'المساعد الذكي للموارد البشرية' : 'HR AI Assistant',
      description: isArabic ? 'مساعد ذكي للإجابة على استفسارات الموظفين' : 'Intelligent assistant for employee inquiries'
    },
    {
      icon: Brain,
      title: isArabic ? 'التحليلات التنبؤية' : 'Predictive Analytics',
      description: isArabic ? 'تحليلات ذكية لتوقع الاتجاهات والمخاطر' : 'Smart analytics to predict trends and risks'
    },
    {
      icon: Cog,
      title: isArabic ? 'معالجة الوثائق الذكية' : 'Intelligent Document Processing',
      description: isArabic ? 'معالجة وتصنيف الوثائق تلقائياً' : 'Automatic document processing and classification'
    },
    {
      icon: Sparkles,
      title: isArabic ? 'التوصيات الذكية' : 'Smart Recommendations',
      description: isArabic ? 'توصيات مخصصة لتحسين الأداء والكفاءة' : 'Personalized recommendations for performance and efficiency'
    },
    {
      icon: Zap,
      title: isArabic ? 'الاستجابة السريعة' : 'Rapid Response',
      description: isArabic ? 'استجابة سريعة للأحداث والتغييرات' : 'Quick response to events and changes'
    }
  ];

  const aiCapabilities = [
    {
      title: isArabic ? 'معالجة اللغة الطبيعية' : 'Natural Language Processing',
      description: isArabic ? 'فهم ومعالجة النصوص العربية والإنجليزية' : 'Understanding and processing Arabic and English texts',
      level: 95
    },
    {
      title: isArabic ? 'التعلم الآلي' : 'Machine Learning',
      description: isArabic ? 'تحسين الأداء من خلال التعلم المستمر' : 'Performance improvement through continuous learning',
      level: 88
    },
    {
      title: isArabic ? 'الرؤية الحاسوبية' : 'Computer Vision',
      description: isArabic ? 'معالجة وتحليل الصور والوثائق المسحوبة ضوئياً' : 'Processing and analyzing images and scanned documents',
      level: 82
    },
    {
      title: isArabic ? 'التحليل التنبؤي' : 'Predictive Analysis',
      description: isArabic ? 'توقع النتائج والاتجاهات المستقبلية' : 'Predicting future outcomes and trends',
      level: 91
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'محرك الأتمتة بالذكاء الاصطناعي' : 'AI Automation Engine'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'قوة الذكاء الاصطناعي المتقدم لأتمتة العمليات وتحسين الكفاءة التشغيلية'
            : 'Advanced AI power to automate processes and improve operational efficiency'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {automationFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-primary/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Capabilities Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isArabic ? '🧠 قدرات الذكاء الاصطناعي' : '🧠 AI Capabilities'}
          </CardTitle>
          <CardDescription className="text-center">
            {isArabic 
              ? 'مستويات متقدمة من الذكاء الاصطناعي والتعلم الآلي'
              : 'Advanced levels of artificial intelligence and machine learning'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiCapabilities.map((capability, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{capability.title}</h4>
                  <span className="text-sm text-primary font-bold">{capability.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${capability.level}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">{capability.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Use Cases Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="text-xl text-purple-700">
              {isArabic ? '⚡ حالات الاستخدام' : '⚡ Use Cases'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-semibold mb-2">
                {isArabic ? 'أتمتة عملية التوظيف' : 'Recruitment Process Automation'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? 'فرز السير الذاتية، جدولة المقابلات، وإرسال التحديثات تلقائياً'
                  : 'Resume screening, interview scheduling, and automatic updates'
                }
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">
                {isArabic ? 'إدارة الإجازات الذكية' : 'Smart Leave Management'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? 'معالجة طلبات الإجازات وتحديث الأرصدة تلقائياً'
                  : 'Automatic leave request processing and balance updates'
                }
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-semibold mb-2">
                {isArabic ? 'تقارير الامتثال التلقائية' : 'Automated Compliance Reports'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? 'إنتاج تقارير الامتثال والتقديم للجهات الحكومية تلقائياً'
                  : 'Generate compliance reports and submit to government automatically'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="text-xl text-orange-700">
              {isArabic ? '📈 فوائد الأتمتة' : '📈 Automation Benefits'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="font-medium">{isArabic ? 'توفير الوقت' : 'Time Saved'}</span>
              <span className="text-orange-700 font-bold">75%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium">{isArabic ? 'تقليل الأخطاء' : 'Error Reduction'}</span>
              <span className="text-green-700 font-bold">90%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">{isArabic ? 'زيادة الكفاءة' : 'Efficiency Increase'}</span>
              <span className="text-blue-700 font-bold">65%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="font-medium">{isArabic ? 'رضا الموظفين' : 'Employee Satisfaction'}</span>
              <span className="text-purple-700 font-bold">85%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول لاستكشاف قوة الذكاء الاصطناعي الكاملة وتخصيص الأتمتة'
            : '🔒 Login to explore the full AI power and customize automation'
          }
        </p>
      </div>
    </div>
  );
}