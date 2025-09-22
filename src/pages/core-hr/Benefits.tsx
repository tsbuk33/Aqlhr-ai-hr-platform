import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Shield } from "lucide-react";
import { CurrencyIcon } from '@/components/shared/CurrencyIcon';
import { useLocale } from "@/i18n/locale";
import PageHeader from "@/components/common/PageHeader";
import DashboardCard from "@/components/common/DashboardCard";

const Benefits = () => {
  const { locale, t } = useLocale();
  const isArabic = locale === 'ar';

  const benefitsData = {
    totalEmployees: 1247,
    benefitsCost: 2650000,
    healthInsurance: 98.5,
    retirementPlans: 87.2
  };

  const benefitsCards = [
    {
      title: isArabic ? 'إجمالي الموظفين' : 'Total Employees',
      subtitle: isArabic ? 'المشمولين بالمزايا' : 'Enrolled in Benefits',
      value: benefitsData.totalEmployees.toLocaleString(),
      icon: <Users className="h-8 w-8 text-primary" />
    },
    {
      title: isArabic ? 'تكلفة المزايا' : 'Benefits Cost',
      subtitle: isArabic ? 'شهرياً (ريال سعودي)' : 'Monthly (SAR)',
      value: `${(benefitsData.benefitsCost / 1000).toFixed(0)}K`,
      icon: <CurrencyIcon className="h-8 w-8 text-brand-success" />
    },
    {
      title: isArabic ? 'التأمين الصحي' : 'Health Insurance',
      subtitle: isArabic ? 'نسبة المشاركة' : 'Enrollment Rate',
      value: `${benefitsData.healthInsurance}%`,
      icon: <Heart className="h-8 w-8 text-red-500" />
    },
    {
      title: isArabic ? 'برامج التقاعد' : 'Retirement Plans',
      subtitle: isArabic ? 'نسبة المشاركة' : 'Participation Rate',
      value: `${benefitsData.retirementPlans}%`,
      icon: <Shield className="h-8 w-8 text-blue-500" />
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader 
        title={isArabic ? 'المزايا الوظيفية' : 'Employee Benefits'}
        description={isArabic ? 'إدارة وتتبع مزايا الموظفين والتأمينات' : 'Manage and track employee benefits and insurance'}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefitsCards.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            subtitle={card.subtitle}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className={isArabic ? 'text-right' : 'text-left'}>
              {isArabic ? 'برامج المزايا' : 'Benefits Programs'}
            </CardTitle>
            <CardDescription className={isArabic ? 'text-right' : 'text-left'}>
              {isArabic ? 'نظرة عامة على برامج المزايا المتاحة' : 'Overview of available benefits programs'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={isArabic ? 'text-right' : 'text-left'}>
                  {isArabic ? 'التأمين الصحي' : 'Health Insurance'}
                </span>
                <span className="font-semibold">98.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isArabic ? 'text-right' : 'text-left'}>
                  {isArabic ? 'تأمين الأسنان' : 'Dental Insurance'}
                </span>
                <span className="font-semibold">85.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isArabic ? 'text-right' : 'text-left'}>
                  {isArabic ? 'برنامج التقاعد' : 'Retirement Program'}
                </span>
                <span className="font-semibold">87.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isArabic ? 'text-right' : 'text-left'}>
                  {isArabic ? 'تأمين الحياة' : 'Life Insurance'}
                </span>
                <span className="font-semibold">92.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={isArabic ? 'text-right' : 'text-left'}>
              {isArabic ? 'تكاليف المزايا الشهرية' : 'Monthly Benefits Costs'}
            </CardTitle>
            <CardDescription className={isArabic ? 'text-right' : 'text-left'}>
              {isArabic ? 'تفصيل التكاليف حسب نوع المزايا' : 'Cost breakdown by benefit type'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={isArabic ? 'text-right' : 'text-left'}>
                  {isArabic ? 'التأمين الصحي' : 'Health Insurance'}
                </span>
                <span className="font-semibold">1,250,000 {isArabic ? 'ريال' : 'SAR'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isArabic ? 'text-right' : 'text-left'}>
                  {isArabic ? 'برنامج التقاعد' : 'Retirement Program'}
                </span>
                <span className="font-semibold">850,000 {isArabic ? 'ريال' : 'SAR'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isArabic ? 'text-right' : 'text-left'}>
                  {isArabic ? 'تأمين الحياة' : 'Life Insurance'}
                </span>
                <span className="font-semibold">350,000 {isArabic ? 'ريال' : 'SAR'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isArabic ? 'text-right' : 'text-left'}>
                  {isArabic ? 'مزايا أخرى' : 'Other Benefits'}
                </span>
                <span className="font-semibold">200,000 {isArabic ? 'ريال' : 'SAR'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Benefits;