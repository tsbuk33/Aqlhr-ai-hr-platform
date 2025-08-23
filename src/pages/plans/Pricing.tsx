import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Users, Building2, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from '@/hooks/useUserCompany';
import { toast } from 'sonner';

const Pricing = () => {
  const { lang } = useParams();
  const isArabic = lang === 'ar';
  const { companyId } = useUserCompany();
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      code: 'starter',
      name: { en: 'Starter', ar: 'المبتدئ' },
      description: { en: 'Essential HR features for small teams', ar: 'ميزات الموارد البشرية الأساسية للفرق الصغيرة' },
      price: { monthly: 0, yearly: 0 },
      icon: Users,
      color: 'bg-primary/10 text-primary',
      popular: false,
      features: [
        { en: 'Employee Management', ar: 'إدارة الموظفين', code: 'basic_hr' },
        { en: 'Basic Reporting', ar: 'التقارير الأساسية', code: 'employee_management' },
        { en: 'Up to 50 employees', ar: 'حتى 50 موظف', code: 'basic_limit' },
        { en: 'Email Support', ar: 'الدعم عبر البريد الإلكتروني', code: 'email_support' },
      ]
    },
    {
      code: 'pro',
      name: { en: 'Pro', ar: 'المحترف' },
      description: { en: 'Advanced HR analytics and automation', ar: 'تحليلات وأتمتة متقدمة للموارد البشرية' },
      price: { monthly: 99, yearly: 990 },
      icon: Zap,
      color: 'bg-primary/20 text-primary',
      popular: true,
      features: [
        { en: 'Everything in Starter', ar: 'كل ما في المبتدئ', code: 'starter_features' },
        { en: 'Advanced Analytics', ar: 'التحليلات المتقدمة', code: 'analytics' },
        { en: 'Data Exports (CSV, PDF)', ar: 'تصدير البيانات (CSV, PDF)', code: 'exports' },
        { en: 'Ask Aql AI Assistant', ar: 'مساعد اسأل عقل الذكي', code: 'ask_aql' },
        { en: 'Up to 500 employees', ar: 'حتى 500 موظف', code: 'pro_limit' },
        { en: 'Priority Support', ar: 'الدعم ذو الأولوية', code: 'priority_support' },
      ]
    },
    {
      code: 'enterprise',
      name: { en: 'Enterprise', ar: 'المؤسسي' },
      description: { en: 'Full suite with compliance and governance', ar: 'مجموعة كاملة مع الامتثال والحوكمة' },
      price: { monthly: 299, yearly: 2990 },
      icon: Crown,
      color: 'bg-primary/30 text-primary',
      popular: false,
      features: [
        { en: 'Everything in Pro', ar: 'كل ما في المحترف', code: 'pro_features' },
        { en: 'OSI (Organizational Structure Intelligence)', ar: 'ذكاء الهيكل التنظيمي (OSI)', code: 'osi' },
        { en: 'Retention Risk Analytics', ar: 'تحليلات مخاطر الاحتفاظ', code: 'retention' },
        { en: 'Compliance Autopilot', ar: 'الامتثال الآلي', code: 'compliance' },
        { en: 'Advanced AI Insights', ar: 'رؤى الذكاء الاصطناعي المتقدمة', code: 'advanced_analytics' },
        { en: 'Unlimited employees', ar: 'موظفون غير محدودون', code: 'unlimited' },
        { en: '24/7 Dedicated Support', ar: 'دعم مخصص على مدار الساعة', code: 'dedicated_support' },
        { en: 'Custom Integrations', ar: 'التكاملات المخصصة', code: 'custom_integrations' },
      ]
    }
  ];

  const handleContactSales = () => {
    const subject = encodeURIComponent(isArabic ? 'استفسار عن خطة المؤسسة' : 'Enterprise Plan Inquiry');
    const body = encodeURIComponent(
      isArabic 
        ? 'مرحباً،\n\nأريد معرفة المزيد عن الخطة المؤسسية وميزاتها.\n\nشكراً لكم!'
        : 'Hi there,\n\nI would like to learn more about the Enterprise plan and its features.\n\nThank you!'
    );
    window.open(`mailto:sales@aqlhr.com?subject=${subject}&body=${body}`, '_blank');
  };

  const handleStartTrial = async (planCode: string) => {
    if (!companyId) {
      toast.error(isArabic ? 'يرجى تسجيل الدخول' : 'Please log in');
      return;
    }

    setLoading(planCode);
    try {
      const { error } = await supabase.rpc('enable_enterprise_trial' as any, {
        p_tenant_id: companyId,
        p_days: 14
      });

      if (error) throw error;

      toast.success(isArabic ? 'تم بدء التجربة المجانية!' : 'Trial started successfully!');
      // Refresh the page to show new entitlements
      window.location.reload();
    } catch (error) {
      console.error('Error starting trial:', error);
      toast.error(isArabic ? 'فشل في بدء التجربة' : 'Failed to start trial');
    } finally {
      setLoading(null);
    }
  };

  // Dev mode admin controls
  const isDevMode = new URLSearchParams(window.location.search).get('dev') === '1';

  return (
    <div className="min-h-screen bg-background" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {isArabic ? 'خطط التسعير' : 'Pricing Plans'}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {isArabic 
              ? 'اختر الخطة المناسبة لاحتياجات مؤسستك' 
              : 'Choose the right plan for your organization'
            }
          </p>

          {/* Dev mode admin controls */}
          {isDevMode && (
            <Card className="mb-8 border-dashed border-warning">
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-4">
                  <Badge variant="outline" className="text-warning">
                    {isArabic ? 'وضع المطور' : 'Dev Mode'}
                  </Badge>
                  <Button
                    onClick={() => handleStartTrial('enterprise')}
                    disabled={loading === 'enterprise'}
                    size="sm"
                    className="gap-2"
                  >
                    <Star className="h-4 w-4" />
                    {loading === 'enterprise' 
                      ? (isArabic ? 'جارِ التفعيل...' : 'Enabling...')
                      : (isArabic ? 'تفعيل تجربة مؤسسية (14 يوم)' : 'Enable Enterprise Trial (14d)')
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const PlanIcon = plan.icon;
            return (
              <Card 
                key={plan.code} 
                className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      {isArabic ? 'الأكثر شيوعاً' : 'Most Popular'}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className={`w-12 h-12 rounded-full ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                    <PlanIcon className="h-6 w-6" />
                  </div>
                  
                  <CardTitle className="text-2xl">
                    {plan.name[isArabic ? 'ar' : 'en']}
                  </CardTitle>
                  
                  <CardDescription className="text-base">
                    {plan.description[isArabic ? 'ar' : 'en']}
                  </CardDescription>
                  
                  <div className="mt-4">
                    <div className="text-4xl font-bold">
                      {plan.price.monthly === 0 
                        ? (isArabic ? 'مجاني' : 'Free')
                        : `$${plan.price.monthly}`
                      }
                    </div>
                    {plan.price.monthly > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {isArabic ? 'شهرياً، أو ' : 'per month, or '}
                        <span className="font-semibold text-primary">
                          ${plan.price.yearly}
                        </span>
                        {isArabic ? ' سنوياً' : ' yearly'}
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">
                          {feature[isArabic ? 'ar' : 'en']}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    {plan.code === 'starter' && (
                      <Button className="w-full" variant="outline">
                        {isArabic ? 'ابدأ مجاناً' : 'Get Started Free'}
                      </Button>
                    )}
                    
                    {plan.code === 'pro' && (
                      <Button className="w-full">
                        {isArabic ? 'ابدأ التجربة المجانية' : 'Start Free Trial'}
                      </Button>
                    )}
                    
                    {plan.code === 'enterprise' && (
                      <>
                        <Button 
                          className="w-full" 
                          onClick={() => handleStartTrial('enterprise')}
                          disabled={loading === 'enterprise'}
                        >
                          {loading === 'enterprise' 
                            ? (isArabic ? 'جارِ بدء التجربة...' : 'Starting Trial...')
                            : (isArabic ? 'تجربة مجانية 14 يوم' : '14-Day Free Trial')
                          }
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={handleContactSales}
                        >
                          <Building2 className="h-4 w-4 me-2" />
                          {isArabic ? 'تواصل مع المبيعات' : 'Contact Sales'}
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            {isArabic 
              ? 'هل لديك أسئلة؟ ' 
              : 'Have questions? '
            }
            <Button 
              variant="link" 
              className="p-0 h-auto font-normal"
              onClick={handleContactSales}
            >
              {isArabic ? 'تواصل معنا' : 'Contact us'}
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;