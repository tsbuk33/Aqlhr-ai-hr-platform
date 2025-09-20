import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { HelpCircle, BookOpen, MessageCircle, Video, Phone, Mail } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function HelpPublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const helpResources = [
    {
      icon: BookOpen,
      title: isArabic ? 'دليل المستخدم' : 'User Guide',
      description: isArabic ? 'دليل شامل لاستخدام النظام وجميع الميزات' : 'Comprehensive guide to using the system and all features'
    },
    {
      icon: Video,
      title: isArabic ? 'فيديوهات تعليمية' : 'Tutorial Videos',
      description: isArabic ? 'مقاطع فيديو تعليمية خطوة بخطوة' : 'Step-by-step tutorial videos'
    },
    {
      icon: MessageCircle,
      title: isArabic ? 'الأسئلة الشائعة' : 'FAQ',
      description: isArabic ? 'إجابات على الأسئلة الأكثر شيوعاً' : 'Answers to frequently asked questions'
    },
    {
      icon: Phone,
      title: isArabic ? 'الدعم الهاتفي' : 'Phone Support',
      description: isArabic ? 'دعم فني مباشر عبر الهاتف' : 'Direct technical support via phone'
    },
    {
      icon: Mail,
      title: isArabic ? 'الدعم عبر البريد' : 'Email Support',
      description: isArabic ? 'تواصل مع فريق الدعم عبر البريد الإلكتروني' : 'Contact support team via email'
    },
    {
      icon: HelpCircle,
      title: isArabic ? 'المساعدة التفاعلية' : 'Interactive Help',
      description: isArabic ? 'مساعد ذكي للإجابة على الاستفسارات' : 'Smart assistant to answer inquiries'
    }
  ];

  const contactInfo = [
    {
      label: isArabic ? 'الهاتف' : 'Phone',
      value: '+966 11 234 5678'
    },
    {
      label: isArabic ? 'البريد الإلكتروني' : 'Email',
      value: 'support@aqlhr.com'
    },
    {
      label: isArabic ? 'ساعات الدعم' : 'Support Hours',
      value: isArabic ? 'الأحد - الخميس: 8ص - 6م' : 'Sun - Thu: 8AM - 6PM'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'المساعدة والدعم' : 'Help & Support'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'مركز المساعدة الشامل للحصول على الدعم والإرشادات لاستخدام النظام'
            : 'Comprehensive help center for support and guidance on using the system'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {helpResources.map((resource, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100">
                  <resource.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {resource.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            {isArabic ? '📞 معلومات الاتصال' : '📞 Contact Information'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {contactInfo.map((info, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">{info.label}</h4>
                <p className="text-sm text-muted-foreground">{info.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="p-6 bg-muted rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول للوصول إلى الدعم المخصص والمتقدم'
            : '🔒 Login to access personalized and advanced support'
          }
        </p>
      </div>
    </div>
  );
}