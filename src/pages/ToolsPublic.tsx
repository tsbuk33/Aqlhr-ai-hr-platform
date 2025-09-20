import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Settings, Upload, Download, Database, Zap, FileText } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function ToolsPublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const tools = [
    {
      icon: Upload,
      title: isArabic ? 'استيراد البيانات' : 'Data Import',
      description: isArabic ? 'استيراد بيانات الموظفين من ملفات Excel وCSV' : 'Import employee data from Excel and CSV files'
    },
    {
      icon: Download,
      title: isArabic ? 'تصدير التقارير' : 'Export Reports',
      description: isArabic ? 'تصدير التقارير بصيغ مختلفة' : 'Export reports in various formats'
    },
    {
      icon: Database,
      title: isArabic ? 'نسخ احتياطي' : 'Data Backup',
      description: isArabic ? 'إنشاء نسخ احتياطية من البيانات' : 'Create data backups'
    },
    {
      icon: Settings,
      title: isArabic ? 'إعدادات النظام' : 'System Settings',
      description: isArabic ? 'تخصيص إعدادات النظام والتفضيلات' : 'Customize system settings and preferences'
    },
    {
      icon: Zap,
      title: isArabic ? 'أدوات الأتمتة' : 'Automation Tools',
      description: isArabic ? 'أدوات لأتمتة المهام المتكررة' : 'Tools to automate repetitive tasks'
    },
    {
      icon: FileText,
      title: isArabic ? 'قوالب الوثائق' : 'Document Templates',
      description: isArabic ? 'قوالب جاهزة للعقود والوثائق' : 'Ready templates for contracts and documents'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'الأدوات والمساعدات' : 'Tools & Utilities'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'مجموعة من الأدوات المساعدة لتحسين الكفاءة والإنتاجية في إدارة الموارد البشرية'
            : 'Collection of utility tools to improve efficiency and productivity in HR management'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tools.map((tool, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <tool.icon className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {tool.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-6 bg-muted rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول للوصول إلى جميع الأدوات والمساعدات'
            : '🔒 Login to access all tools and utilities'
          }
        </p>
      </div>
    </div>
  );
}