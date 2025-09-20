import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, Clock, FileText, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function LeavePublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const leaveFeatures = [
    {
      icon: Calendar,
      title: isArabic ? 'طلبات الإجازات' : 'Leave Requests',
      description: isArabic ? 'تقديم ومتابعة طلبات الإجازات بسهولة' : 'Submit and track leave requests easily'
    },
    {
      icon: Clock,
      title: isArabic ? 'أرصدة الإجازات' : 'Leave Balances',
      description: isArabic ? 'متابعة أرصدة الإجازات المختلفة' : 'Track different leave balance types'
    },
    {
      icon: FileText,
      title: isArabic ? 'أنواع الإجازات' : 'Leave Types',
      description: isArabic ? 'إدارة أنواع الإجازات المختلفة' : 'Manage different leave types'
    },
    {
      icon: CheckCircle,
      title: isArabic ? 'الموافقات' : 'Approvals',
      description: isArabic ? 'سير عمل الموافقات التلقائي' : 'Automatic approval workflows'
    },
    {
      icon: TrendingUp,
      title: isArabic ? 'تحليلات الإجازات' : 'Leave Analytics',
      description: isArabic ? 'تحليلات وتقارير استخدام الإجازات' : 'Leave usage analytics and reports'
    },
    {
      icon: Users,
      title: isArabic ? 'إدارة الفريق' : 'Team Management',
      description: isArabic ? 'مراقبة إجازات الفريق والتخطيط' : 'Monitor team leave and planning'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'إدارة الإجازات' : 'Leave Management'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'نظام شامل لإدارة طلبات الإجازات والأرصدة مع سير عمل موافقات تلقائي'
            : 'Comprehensive system for managing leave requests and balances with automatic approval workflows'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {leaveFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <feature.icon className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
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

      <div className="p-6 bg-muted rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول للوصول إلى نظام إدارة الإجازات الكامل'
            : '🔒 Login to access the complete Leave Management system'
          }
        </p>
      </div>
    </div>
  );
}