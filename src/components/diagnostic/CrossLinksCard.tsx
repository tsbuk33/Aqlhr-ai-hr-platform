import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LinkL } from '@/lib/i18n/LinkL';
import { getLang } from '@/lib/i18n/getLang';
import { 
  MessageSquare, 
  ExternalLink, 
  Calendar,
  CheckSquare,
  FileText,
  ArrowRight,
  Brain,
  Building2,
  Users,
  Shield,
  Zap
} from 'lucide-react';

interface CrossLinksCardProps {
  module: 'cci' | 'osi' | 'retention' | 'compliance';
  context?: string;
  recommendations?: string[];
  onAskAql?: (intent: string) => void;
}

export const CrossLinksCard: React.FC<CrossLinksCardProps> = ({ 
  module, 
  context = '', 
  recommendations = [],
  onAskAql 
}) => {
  const lang = getLang();

  const t = (key: string) => {
    const translations = {
      en: {
        actions: 'Next Best Actions',
        askAql: 'Ask Aql',
        generate90day: 'Generate 90-day Plan',
        createTasks: 'Create Tasks',
        viewHub: 'View Diagnostic Hub',
        exportReport: 'Export Report',
        askAqlAbout: 'Ask Aql about this analysis',
        generatePlan: 'Generate improvement plan',
        createActionTasks: 'Create action items',
        viewCrossSignals: 'View cross-module signals',
        cci: 'Culture Intelligence',
        osi: 'Organizational Structure',
        retention: 'Retention Strategy',
        compliance: 'Compliance Status',
        recommendations: 'Recommendations',
        otherModules: 'Related Modules'
      },
      ar: {
        actions: 'أفضل الإجراءات التالية',
        askAql: 'اسأل عقل',
        generate90day: 'توليد خطة ٩٠ يوم',
        createTasks: 'إنشاء مهام',
        viewHub: 'عرض مركز التشخيص',
        exportReport: 'تصدير التقرير',
        askAqlAbout: 'اسأل عقل حول هذا التحليل',
        generatePlan: 'توليد خطة تحسين',
        createActionTasks: 'إنشاء عناصر العمل',
        viewCrossSignals: 'عرض إشارات متعددة الوحدات',
        cci: 'ذكاء الثقافة المؤسسية',
        osi: 'الهيكل التنظيمي',
        retention: 'استراتيجية الاحتفاظ',
        compliance: 'حالة الامتثال',
        recommendations: 'التوصيات',
        otherModules: 'الوحدات ذات الصلة'
      }
    };
    return translations[lang as 'en' | 'ar']?.[key as keyof typeof translations.en] || key;
  };

  const handleAskAql = (intent: string) => {
    if (onAskAql) {
      onAskAql(intent);
    } else {
      // Default: open assistant in new tab
      const encodedIntent = encodeURIComponent(`${t(module)}: ${intent} ${context}`);
      window.open(`/assistant?intent=${encodedIntent}`, '_blank');
    }
  };

  const getModuleLinks = () => {
    const allModules = [
      { key: 'cci', path: '/diagnostic/cci/overview', icon: Brain },
      { key: 'osi', path: '/diagnostic/osi', icon: Building2 },
      { key: 'retention', path: '/diagnostic/retention', icon: Users },
      { key: 'compliance', path: '/government/overview', icon: Shield }
    ];

    return allModules.filter(m => m.key !== module);
  };

  return (
    <Card className={`${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          {t('actions')}
        </CardTitle>
        <CardDescription>
          {t('askAqlAbout')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ask Aql Section */}
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAskAql(t('generatePlan'))}
            className="w-full justify-start"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {t('askAql')}
          </Button>
          
          {module !== 'compliance' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAskAql(t('generate90day'))}
              className="w-full justify-start"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {t('generate90day')}
            </Button>
          )}

          {(module === 'retention' || module === 'cci') && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAskAql(t('createActionTasks'))}
              className="w-full justify-start"
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              {t('createTasks')}
            </Button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <LinkL to="/diagnostic/hub">
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full justify-start"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {t('viewHub')}
            </Button>
          </LinkL>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">{t('recommendations')}</h4>
            {recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className="text-xs text-muted-foreground p-2 bg-muted/30 rounded">
                {rec}
              </div>
            ))}
          </div>
        )}

        {/* Other Modules */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">{t('otherModules')}</h4>
          <div className="flex flex-wrap gap-2">
            {getModuleLinks().map(({ key, path, icon: Icon }) => (
              <LinkL key={key} to={path}>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  <Icon className="mr-1 h-3 w-3" />
                  {t(key)}
                </Badge>
              </LinkL>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
