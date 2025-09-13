import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Crown, Award } from 'lucide-react';
import { useLocale } from '@/i18n/locale';

export function PartnershipSection() {
  const { locale } = useLocale();
  const isArabic = locale === 'ar';

  const partnerships = [
    {
      name: isArabic ? 'رؤية السعودية 2030' : 'Saudi Vision 2030',
      description: isArabic 
        ? 'برنامج تحويل المملكة العربية السعودية'
        : 'Saudi Arabia\'s transformation program',
      url: 'https://vision2030.gov.sa/',
      type: 'vision',
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-r from-green-500 to-yellow-500',
    },
    {
      name: isArabic ? 'إكسبو 2030 الرياض' : 'Expo 2030 Riyadh',
      description: isArabic 
        ? 'معرض إكسبو العالمي 2030 في الرياض'
        : 'World Expo 2030 in Riyadh',
      url: 'https://www.expo2030riyadh.sa/',
      type: 'expo',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
    {
      name: isArabic ? 'كأس العالم FIFA 2034 السعودية' : 'FIFA World Cup 2034 Saudi Arabia',
      description: isArabic 
        ? 'بطولة كأس العالم FIFA 2034 في السعودية'
        : 'FIFA World Cup 2034 in Saudi Arabia',
      url: 'https://saudi2034.com.sa/',
      type: 'worldcup',
      icon: Award,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    },
  ];

  const governmentPartners = [
    {
      name: 'MOL',
      fullName: isArabic ? 'وزارة الموارد البشرية' : 'Ministry of Human Resources',
      description: isArabic ? 'الوزارة الرسمية للموارد البشرية' : 'Official HR Ministry',
    },
    {
      name: 'QIWA',
      fullName: isArabic ? 'منصة قوى' : 'Qiwa Platform',
      description: isArabic ? 'منصة الخدمات العمالية' : 'Labor services platform',
    },
    {
      name: 'GOSI',
      fullName: isArabic ? 'التأمينات الاجتماعية' : 'General Organization for Social Insurance',
      description: isArabic ? 'مؤسسة التأمينات الاجتماعية' : 'Social insurance organization',
    },
    {
      name: 'ABSHER',
      fullName: isArabic ? 'منصة أبشر' : 'Absher Platform',
      description: isArabic ? 'منصة الخدمات الحكومية' : 'Government services platform',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Official Saudi Arabia Initiatives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            {isArabic ? 'المبادرات الرسمية السعودية' : 'Official Saudi Arabia Initiatives'}
          </CardTitle>
          <p className="text-muted-foreground">
            {isArabic 
              ? 'شراكاتنا الحكومية الرسمية'
              : 'Our official government partnerships'
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnerships.map((partnership, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className={`h-2 ${partnership.bgColor}`}></div>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${partnership.bgColor.replace('bg-gradient-to-r', 'bg-gradient-to-br')} text-white flex-shrink-0`}>
                      <partnership.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {partnership.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {partnership.description}
                      </p>
                      <Badge variant="outline" className="mt-3">
                        {isArabic ? 'شراكة رسمية' : 'Official Partnership'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Government Partners */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {isArabic ? 'الشركاء الحكوميون' : 'Government Partners'}
          </CardTitle>
          <p className="text-muted-foreground">
            {isArabic 
              ? 'التكاملات مع الجهات الحكومية السعودية'
              : 'Integrations with Saudi government entities'
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {governmentPartners.map((partner, index) => (
              <Card key={index} className="p-4 text-center hover:shadow-md transition-shadow group cursor-pointer">
                <div className="mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <span className="font-bold text-lg text-primary">{partner.name}</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{partner.fullName}</h4>
                  <p className="text-xs text-muted-foreground">{partner.description}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {isArabic ? 'متكامل' : 'Integrated'}
                </Badge>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SanadHR Support Message */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">
            {isArabic 
              ? 'سندHR - دعم رؤية السعودية للمستقبل'
              : 'SanadHR - Supporting Saudi Arabia\'s Vision for the Future'
            }
          </h3>
          <p className="text-muted-foreground">
            {isArabic 
              ? 'نحن ملتزمون بدعم رؤية المملكة العربية السعودية 2030 من خلال تقنيات الموارد البشرية المبتكرة'
              : 'We are committed to supporting Saudi Arabia\'s Vision 2030 through innovative HR technologies'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}