import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Scale, FileText, Shield, AlertTriangle, BookOpen, CheckCircle } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function LegalConsultantPublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const legalFeatures = [
    {
      icon: Scale,
      title: isArabic ? 'الاستشارة القانونية الذكية' : 'Smart Legal Consultation',
      description: isArabic ? 'استشارات قانونية مدعومة بالذكاء الاصطناعي' : 'AI-powered legal consultations'
    },
    {
      icon: FileText,
      title: isArabic ? 'مراجعة العقود' : 'Contract Review',
      description: isArabic ? 'مراجعة وتحليل العقود تلقائياً' : 'Automatic contract review and analysis'
    },
    {
      icon: Shield,
      title: isArabic ? 'الامتثال القانوني' : 'Legal Compliance',
      description: isArabic ? 'ضمان الامتثال للقوانين واللوائح' : 'Ensure compliance with laws and regulations'
    },
    {
      icon: AlertTriangle,
      title: isArabic ? 'تحليل المخاطر' : 'Risk Analysis',
      description: isArabic ? 'تحديد وتحليل المخاطر القانونية' : 'Identify and analyze legal risks'
    },
    {
      icon: BookOpen,
      title: isArabic ? 'قاعدة بيانات القوانين' : 'Legal Database',
      description: isArabic ? 'قاعدة بيانات شاملة للقوانين السعودية' : 'Comprehensive Saudi legal database'
    },
    {
      icon: CheckCircle,
      title: isArabic ? 'مراقبة التحديثات' : 'Updates Monitoring',
      description: isArabic ? 'مراقبة التحديثات القانونية والتشريعية' : 'Monitor legal and legislative updates'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'المستشار القانوني الذكي' : 'Legal Consultant AI'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'مساعد قانوني ذكي مدعوم بالذكاء الاصطناعي للاستشارات القانونية والامتثال'
            : 'AI-powered legal assistant for legal consultations and compliance'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {legalFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-amber-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100">
                  <feature.icon className="h-6 w-6 text-amber-600" />
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

      <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول للوصول إلى المستشار القانوني الذكي'
            : '🔒 Login to access the Legal Consultant AI'
          }
        </p>
      </div>
    </div>
  );
}