import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCurrentLang, isRTL, setCurrentLang } from '@/lib/i18n/localeDriver';
import { useLocalePath } from '@/lib/i18n/LinkL';
import { 
  formatNumber, 
  formatCurrency, 
  formatPercent,
  formatDate,
  formatDateShort,
  formatDateLong,
  formatDatetime,
  formatRelativeTime 
} from '@/lib/i18n/format';

const I18nTest: React.FC = () => {
  const currentLang = getCurrentLang();
  const currentDir = isRTL() ? 'rtl' : 'ltr';
  const { switchLanguage } = useLocalePath();
  
  const sampleDate = new Date('2024-03-15T14:30:00');
  const sampleNumbers = [1234.56, 0.75, 1500000];

  const translations = {
    ar: {
      title: 'صفحة اختبار التدويل',
      subtitle: 'اختبار دعم اللغة العربية والتنسيق',
      currentLang: 'اللغة الحالية',
      direction: 'الاتجاه',
      sampleStrings: 'نصوص تجريبية',
      dateFormatting: 'تنسيق التاريخ',
      numberFormatting: 'تنسيق الأرقام',
      gregorian: 'ميلادي',
      hijri: 'هجري',
      arabicIndic: 'أرقام عربية-هندية',
      western: 'أرقام غربية',
      currency: 'عملة',
      percentage: 'نسبة مئوية',
      relative: 'وقت نسبي',
      switchLang: 'تبديل اللغة'
    },
    en: {
      title: 'Internationalization Test Page',
      subtitle: 'Testing Arabic language and formatting support',
      currentLang: 'Current Language',
      direction: 'Direction',
      sampleStrings: 'Sample Strings',
      dateFormatting: 'Date Formatting',
      numberFormatting: 'Number Formatting',
      gregorian: 'Gregorian',
      hijri: 'Hijri',
      arabicIndic: 'Arabic-Indic Numerals',
      western: 'Western Numerals',
      currency: 'Currency',
      percentage: 'Percentage',
      relative: 'Relative Time',
      switchLang: 'Switch Language'
    }
  };

  const t = translations[currentLang];

  return (
    <div className={`min-h-screen bg-background p-6 ${isRTL() ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
          <Button onClick={() => switchLanguage(currentLang === 'ar' ? 'en' : 'ar')}>
            {t.switchLang}
          </Button>
        </div>

        {/* Current State */}
        <Card>
          <CardHeader>
            <CardTitle>Current State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>{t.currentLang}:</span>
              <Badge>{currentLang.toUpperCase()}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>{t.direction}:</span>
              <Badge variant="outline">{currentDir.toUpperCase()}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>HTML Direction:</span>
              <Badge variant="secondary">{document.documentElement.dir}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>HTML Lang:</span>
              <Badge variant="secondary">{document.documentElement.lang}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Sample Strings */}
        <Card>
          <CardHeader>
            <CardTitle>{t.sampleStrings}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Welcome to AqlHR Platform | مرحباً بك في منصة عقل للموارد البشرية</p>
            <p>Employee Management | إدارة الموظفين</p>
            <p>Performance Analytics | تحليلات الأداء</p>
            <p>Corporate Culture Intelligence | ذكاء الثقافة المؤسسية</p>
          </CardContent>
        </Card>

        {/* Date Formatting */}
        <Card>
          <CardHeader>
            <CardTitle>{t.dateFormatting}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t.gregorian}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Short:</span>
                  <p>{formatDateShort(sampleDate, currentLang, false)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Long:</span>
                  <p>{formatDateLong(sampleDate, currentLang, false)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">DateTime:</span>
                  <p>{formatDatetime(sampleDate, currentLang, false)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">{t.relative}:</span>
                  <p>{formatRelativeTime(sampleDate, currentLang)}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">{t.hijri} (Umm Al-Qura)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Short:</span>
                  <p>{formatDateShort(sampleDate, currentLang, true)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Long:</span>
                  <p>{formatDateLong(sampleDate, currentLang, true)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">DateTime:</span>
                  <p>{formatDatetime(sampleDate, currentLang, true)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Number Formatting */}
        <Card>
          <CardHeader>
            <CardTitle>{t.numberFormatting}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t.western}</h4>
              <div className="space-y-2">
                {sampleNumbers.map((num, i) => (
                  <div key={i} className="flex justify-between">
                    <span>Number {i + 1}:</span>
                    <span>{formatNumber(num, currentLang, { arabicIndic: false })}</span>
                  </div>
                ))}
              </div>
            </div>

            {currentLang === 'ar' && (
              <div>
                <h4 className="font-semibold mb-2">{t.arabicIndic}</h4>
                <div className="space-y-2">
                  {sampleNumbers.map((num, i) => (
                    <div key={i} className="flex justify-between">
                      <span>رقم {i + 1}:</span>
                      <span>{formatNumber(num, currentLang, { arabicIndic: true })}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2">{t.currency}</h4>
              <div className="space-y-2">
                {sampleNumbers.map((num, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{t.currency} {i + 1}:</span>
                    <span>{formatCurrency(num, currentLang, 'SAR')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">{t.percentage}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t.percentage} 1:</span>
                  <span>{formatPercent(0.75, currentLang)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.percentage} 2:</span>
                  <span>{formatPercent(0.1234, currentLang)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded overflow-auto">
              {JSON.stringify({
                currentLang,
                currentDir,
                documentLang: document.documentElement.lang,
                documentDir: document.documentElement.dir,
                documentClasses: document.documentElement.className,
                userAgent: navigator.userAgent,
                languages: navigator.languages,
                pathname: window.location.pathname,
                search: window.location.search,
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default I18nTest;