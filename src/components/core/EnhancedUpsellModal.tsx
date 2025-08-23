import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Zap, Check, Building2, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EnhancedUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  featureName?: string;
  description?: string;
  requiredPlan?: 'pro' | 'enterprise';
}

export const EnhancedUpsellModal: React.FC<EnhancedUpsellModalProps> = ({
  isOpen,
  onClose,
  feature,
  featureName,
  description,
  requiredPlan = 'pro',
}) => {
  const { lang } = useParams();
  const isArabic = lang === 'ar';

  const featureMap: Record<string, { name: { en: string; ar: string }; description: { en: string; ar: string } }> = {
    exports: {
      name: { en: 'Advanced Exports', ar: 'التصديرات المتقدمة' },
      description: { en: 'Export your data in multiple formats with custom templates', ar: 'صدّر بياناتك بتنسيقات متعددة مع قوالب مخصصة' }
    },
    osi: {
      name: { en: 'OSI Intelligence', ar: 'ذكاء الهيكل التنظيمي' },
      description: { en: 'Advanced organizational structure analysis and optimization', ar: 'تحليل وتحسين الهيكل التنظيمي المتقدم' }
    },
    retention: {
      name: { en: 'Retention Analytics', ar: 'تحليلات الاحتفاظ' },
      description: { en: 'Predict and prevent employee turnover with AI insights', ar: 'تنبؤ ومنع دوران الموظفين برؤى الذكاء الاصطناعي' }
    },
    compliance: {
      name: { en: 'Compliance Autopilot', ar: 'الامتثال الآلي' },
      description: { en: 'Automated compliance monitoring and reporting', ar: 'مراقبة وتقارير الامتثال الآلية' }
    },
    ask_aql: {
      name: { en: 'Ask Aql Advanced', ar: 'اسأل عقل المتقدم' },
      description: { en: 'Advanced AI assistant with deep HR insights', ar: 'مساعد ذكي متقدم برؤى عميقة للموارد البشرية' }
    }
  };

  const currentFeature = featureMap[feature] || {
    name: { en: featureName || feature, ar: featureName || feature },
    description: { en: description || 'Premium feature', ar: description || 'ميزة مميزة' }
  };

  const planDetails = {
    pro: {
      name: { en: 'Pro Plan', ar: 'الخطة الاحترافية' },
      price: { monthly: 99, yearly: 990 },
      features: [
        { en: 'Advanced Analytics', ar: 'التحليلات المتقدمة' },
        { en: 'Data Exports', ar: 'تصدير البيانات' },
        { en: 'Ask Aql AI Assistant', ar: 'مساعد اسأل عقل الذكي' },
        { en: 'Priority Support', ar: 'الدعم ذو الأولوية' }
      ]
    },
    enterprise: {
      name: { en: 'Enterprise Plan', ar: 'الخطة المؤسسية' },
      price: { monthly: 299, yearly: 2990 },
      features: [
        { en: 'Everything in Pro', ar: 'كل ما في الاحترافية' },
        { en: 'OSI Intelligence', ar: 'ذكاء الهيكل التنظيمي' },
        { en: 'Retention Analytics', ar: 'تحليلات الاحتفاظ' },
        { en: 'Compliance Autopilot', ar: 'الامتثال الآلي' },
        { en: '24/7 Dedicated Support', ar: 'دعم مخصص على مدار الساعة' }
      ]
    }
  };

  const plan = planDetails[requiredPlan];

  const handleUpgrade = () => {
    // Navigate to pricing page while preserving language
    window.open(`/${lang}/plans/pricing`, '_blank');
    onClose();
  };

  const handleContactSales = () => {
    const subject = encodeURIComponent(
      isArabic 
        ? `استفسار عن ${plan.name.ar}` 
        : `${plan.name.en} Inquiry`
    );
    const body = encodeURIComponent(
      isArabic 
        ? `مرحباً،\n\nأريد معرفة المزيد عن ${plan.name.ar} للوصول إلى ميزة ${currentFeature.name.ar}.\n\nشكراً لكم!`
        : `Hi there,\n\nI'm interested in learning more about the ${plan.name.en} to access the ${currentFeature.name.en} feature.\n\nThank you!`
    );
    window.open(`mailto:sales@aqlhr.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" dir={isArabic ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-6 w-6 text-primary" />
            <DialogTitle>
              {isArabic ? 'ترقية مطلوبة' : 'Upgrade Required'}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isArabic 
              ? `الوصول إلى ${currentFeature.name.ar} يتطلب ${plan.name.ar}`
              : `Access to ${currentFeature.name.en} requires the ${plan.name.en}`
            }
          </DialogDescription>
        </DialogHeader>
        
        {/* Feature Highlight */}
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-4">
              <Zap className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">{currentFeature.name[isArabic ? 'ar' : 'en']}</h4>
                <p className="text-sm text-muted-foreground">
                  {currentFeature.description[isArabic ? 'ar' : 'en']}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Details */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">{plan.name[isArabic ? 'ar' : 'en']}</h4>
              <div className="text-right">
                <div className="text-2xl font-bold">${plan.price.monthly}</div>
                <div className="text-sm text-muted-foreground">
                  {isArabic ? 'شهرياً' : 'per month'}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {plan.features.slice(0, 4).map((planFeature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{planFeature[isArabic ? 'ar' : 'en']}</span>
                </div>
              ))}
            </div>

            {requiredPlan === 'enterprise' && (
              <div className="mt-4 pt-4 border-t">
                <Badge variant="secondary" className="mb-2">
                  {isArabic ? 'تجربة مجانية متاحة' : 'Free Trial Available'}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {isArabic 
                    ? 'جرب جميع الميزات المؤسسية مجاناً لمدة 14 يوماً'
                    : 'Try all Enterprise features free for 14 days'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {isArabic ? 'ربما لاحقاً' : 'Maybe Later'}
          </Button>
          
          <Button onClick={handleUpgrade} className="flex-1">
            <Star className="h-4 w-4 me-2" />
            {isArabic 
              ? (requiredPlan === 'enterprise' ? 'بدء تجربة مجانية' : 'ترقية الآن')
              : (requiredPlan === 'enterprise' ? 'Start Free Trial' : 'Upgrade Now')
            }
          </Button>
          
          {requiredPlan === 'enterprise' && (
            <Button variant="outline" onClick={handleContactSales}>
              <Building2 className="h-4 w-4 me-2" />
              {isArabic ? 'المبيعات' : 'Sales'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};