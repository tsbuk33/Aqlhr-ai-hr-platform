import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Shield, Users, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function SurveyThanks() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  
  const { surveyName, minN } = location.state || {};

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background to-muted ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="container max-w-2xl mx-auto py-16 px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">
              {t('Thank You!', 'شكراً لك!')}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">
                {t(
                  'Your response has been submitted successfully.',
                  'تم إرسال إجابتك بنجاح.'
                )}
              </p>
              {surveyName && (
                <p className="text-sm text-muted-foreground mt-2">
                  {t('Survey:', 'الاستبيان:')} {surveyName}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>{t('Privacy Protection', 'حماية الخصوصية')}</strong>
                  <br />
                  {t(
                    'Your responses are completely anonymous and cannot be traced back to you. No personal identifying information has been collected or stored.',
                    'إجاباتك مجهولة تماماً ولا يمكن ربطها بك. لم يتم جمع أو تخزين أي معلومات شخصية تعريفية.'
                  )}
                </AlertDescription>
              </Alert>

              <Alert>
                <Users className="h-4 w-4" />
                <AlertDescription>
                  <strong>{t('Anonymity Threshold', 'حد إخفاء الهوية')}</strong>
                  <br />
                  {t(
                    `Results will only be shown when at least ${minN || 7} responses are collected for each group to ensure anonymity.`,
                    `ستظهر النتائج فقط عند جمع ${minN || 7} إجابات على الأقل لكل مجموعة لضمان إخفاء الهوية.`
                  )}
                </AlertDescription>
              </Alert>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <strong>{t('What Happens Next?', 'ما يحدث بعد ذلك؟')}</strong>
                  <br />
                  {t(
                    'Your organization will receive detailed culture insights and recommendations once sufficient responses are collected. Results are processed using advanced analytics while maintaining complete anonymity.',
                    'ستحصل منظمتك على رؤى وتوصيات ثقافية مفصلة بمجرد جمع إجابات كافية. تتم معالجة النتائج باستخدام تحليلات متقدمة مع الحفاظ على إخفاء الهوية الكامل.'
                  )}
                </AlertDescription>
              </Alert>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">
                {t('Data Compliance', 'الامتثال للبيانات')}
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  • {t('PDPL (Saudi Personal Data Protection Law) compliant', 'متوافق مع قانون حماية البيانات الشخصية السعودي')}
                </p>
                <p>
                  • {t('ISO 27001 security standards', 'معايير الأمان ISO 27001')}
                </p>
                <p>
                  • {t('Enterprise-grade encryption', 'تشفير بمستوى المؤسسات')}
                </p>
                <p>
                  • {t('No personal data retention', 'عدم الاحتفاظ بالبيانات الشخصية')}
                </p>
              </div>
            </div>

            <div className="text-center pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                {t(
                  'You can safely close this page. Your response has been securely recorded.',
                  'يمكنك إغلاق هذه الصفحة بأمان. تم تسجيل إجابتك بشكل آمن.'
                )}
              </p>
              
              <Button 
                onClick={() => window.close()} 
                variant="outline"
                className="mr-4"
              >
                {t('Close Window', 'إغلاق النافذة')}
              </Button>
              
              <Button onClick={() => navigate('/')}>
                {t('Return to Home', 'العودة للرئيسية')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}