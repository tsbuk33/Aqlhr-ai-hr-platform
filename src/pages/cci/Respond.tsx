import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Clock, Shield, AlertTriangle, CheckCircle, Globe } from 'lucide-react';

interface SurveyItem {
  id: string;
  tenant_id: string;
  created_at: string;
  created_by: string;
  survey_id: string;
  framework: string;
  dimension: string;
  text_en: string;
  text_ar: string;
  scale_min: number;
  scale_max: number;
  reverse_scored: boolean;
  order_no: number;
}

interface Survey {
  id: string;
  name: string;
  language: string;
  anonymity_min_n: number;
  tenant_id: string;
}

interface Wave {
  id: string;
  tenant_id: string;
  created_at: string;
  created_by: string;
  survey_id: string;
  wave_no: number;
  period_start: string;
  period_end: string;
  is_baseline: boolean;
}

interface TokenData {
  id: string;
  token_hash: string;
  expires_at: string | null;
  redeemed_at: string | null;
}

const VALUES_LIST = [
  { en: 'Integrity', ar: 'نزاهة', value: 'integrity' },
  { en: 'Accountability', ar: 'مساءلة', value: 'accountability' },
  { en: 'Respect', ar: 'احترام', value: 'respect' },
  { en: 'Customer Focus', ar: 'تركيز على العميل', value: 'customer_focus' },
  { en: 'Innovation', ar: 'ابتكار', value: 'innovation' },
  { en: 'Teamwork', ar: 'عمل جماعي', value: 'teamwork' },
  { en: 'Learning', ar: 'تعلم', value: 'learning' },
  { en: 'Quality', ar: 'جودة', value: 'quality' },
  { en: 'Safety', ar: 'سلامة', value: 'safety' },
  { en: 'Agility', ar: 'رشاقة', value: 'agility' },
  { en: 'Fairness', ar: 'عدالة', value: 'fairness' },
  { en: 'Compliance', ar: 'امتثال', value: 'compliance' },
  { en: 'Service', ar: 'خدمة', value: 'service' },
  { en: 'Efficiency', ar: 'كفاءة', value: 'efficiency' },
  { en: 'Recognition', ar: 'تقدير', value: 'recognition' }
];

const NATIONALITY_OPTIONS = [
  { value: 'saudi', en: 'Saudi', ar: 'سعودي' },
  { value: 'gcc', en: 'GCC National', ar: 'مواطن خليجي' },
  { value: 'arab', en: 'Arab (Non-GCC)', ar: 'عربي (غير خليجي)' },
  { value: 'other', en: 'Other', ar: 'أخرى' }
];

const GENDER_OPTIONS = [
  { value: 'male', en: 'Male', ar: 'ذكر' },
  { value: 'female', en: 'Female', ar: 'أنثى' },
  { value: 'prefer_not_to_say', en: 'Prefer not to say', ar: 'أفضل عدم الإفصاح' }
];

// Hash function for consistent respondent identification
async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function CCIRespond() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // URL parameters
  const surveyId = searchParams.get('survey');
  const waveId = searchParams.get('wave');
  const token = searchParams.get('t');
  const langParam = searchParams.get('lang') || 'en';

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState<'en' | 'ar'>(langParam as 'en' | 'ar');
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [wave, setWave] = useState<Wave | null>(null);
  const [items, setItems] = useState<SurveyItem[]>([]);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [respondentHash, setRespondentHash] = useState<string>('');
  const [startTime] = useState(Date.now());
  const [currentPage, setCurrentPage] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [demographics, setDemographics] = useState({
    department_id: '',
    project_id: '',
    grade_id: '',
    nationality: '',
    gender: ''
  });
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [currentValues, setCurrentValues] = useState<string[]>([]);
  const [desiredValues, setDesiredValues] = useState<string[]>([]);

  const isRTL = language === 'ar';
  const itemsPerPage = 10;
  // All items are likert-style based on our seeded data structure
  const likertItems = items.filter(item => item.scale_min === 1 && item.scale_max === 5);
  // Values items would be handled separately - we'll add them as special cases
  const hasValuesItems = true; // Always include values selection
  const totalPages = Math.ceil(likertItems.length / itemsPerPage);

  // Load survey data and validate token
  useEffect(() => {
    async function loadSurvey() {
      if (!surveyId || !waveId) {
        toast({
          title: language === 'ar' ? 'خطأ' : 'Error',
          description: language === 'ar' ? 'معرف الاستطلاع أو الموجة مطلوب' : 'Survey and wave ID required',
          variant: 'destructive'
        });
        return;
      }

      try {
        // Load survey
        const { data: surveyData, error: surveyError } = await supabase
          .from('cci_surveys')
          .select('*')
          .eq('id', surveyId)
          .single();

        if (surveyError) throw surveyError;
        setSurvey(surveyData);

        // Load wave
        const { data: waveData, error: waveError } = await supabase
          .from('cci_waves')
          .select('*')
          .eq('id', waveId)
          .eq('survey_id', surveyId)
          .single();

        if (waveError) throw waveError;
        setWave(waveData);

        // Load survey items
        const { data: itemsData, error: itemsError } = await supabase
          .from('cci_survey_items')
          .select('*')
          .eq('survey_id', surveyId)
          .order('order_no');

        if (itemsError) throw itemsError;
        setItems(itemsData || []);

        // Validate token if provided
        if (token) {
          const tokenHash = await hashString(token);
          const { data: tokenData, error: tokenError } = await supabase
            .from('cci_invite_tokens')
            .select('*')
            .eq('token_hash', tokenHash)
            .eq('survey_id', surveyId)
            .eq('wave_id', waveId)
            .single();

          if (tokenError) {
            toast({
              title: language === 'ar' ? 'رمز غير صالح' : 'Invalid Token',
              description: language === 'ar' ? 'الرمز المقدم غير صالح أو منتهي الصلاحية' : 'The provided token is invalid or expired',
              variant: 'destructive'
            });
            return;
          }

          if (tokenData.redeemed_at) {
            toast({
              title: language === 'ar' ? 'رمز مستخدم' : 'Token Already Used',
              description: language === 'ar' ? 'تم استخدام هذا الرمز بالفعل' : 'This token has already been used',
              variant: 'destructive'
            });
            return;
          }

          if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
            toast({
              title: language === 'ar' ? 'رمز منتهي الصلاحية' : 'Token Expired',
              description: language === 'ar' ? 'انتهت صلاحية هذا الرمز' : 'This token has expired',
              variant: 'destructive'
            });
            return;
          }

          setTokenData(tokenData);
          // Generate respondent hash from token
          const respHash = await hashString(token + surveyId + waveId);
          setRespondentHash(respHash);
        } else {
          // Generate anonymous respondent ID and store in localStorage
          const storageKey = `cci_rid_${surveyId}_${waveId}`;
          let rid = localStorage.getItem(storageKey);
          if (!rid) {
            rid = crypto.randomUUID();
            localStorage.setItem(storageKey, rid);
          }
          const respHash = await hashString(rid);
          setRespondentHash(respHash);
        }

        // Set language from survey if not specified
        if (!langParam) {
          setLanguage(surveyData.language === 'ar' ? 'ar' : 'en');
        }

      } catch (error: any) {
        console.error('Error loading survey:', error);
        toast({
          title: language === 'ar' ? 'خطأ' : 'Error',
          description: language === 'ar' ? 'فشل في تحميل الاستطلاع' : 'Failed to load survey',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }

    loadSurvey();
  }, [surveyId, waveId, token, langParam, language, toast]);

  // Calculate completion percentage
  const getCompletionPercentage = useCallback(() => {
    const likertCount = likertItems.length;
    const answeredCount = Object.keys(responses).length;
    const valuesCompleted = (currentValues.length > 0 && desiredValues.length > 0) ? 1 : 0;
    const totalItems = likertCount + (hasValuesItems ? 1 : 0);
    return Math.round(((answeredCount + valuesCompleted) / totalItems) * 100);
  }, [responses, currentValues, desiredValues, likertItems.length, hasValuesItems]);

  // Calculate time spent
  const getTimeSpent = useCallback(() => {
    return Math.floor((Date.now() - startTime) / 1000);
  }, [startTime]);

  // Handle response change
  const handleResponseChange = useCallback((itemId: string, value: number) => {
    setResponses(prev => ({ ...prev, [itemId]: value }));
  }, []);

  // Handle values selection
  const handleValuesToggle = useCallback((type: 'current' | 'desired', value: string) => {
    if (type === 'current') {
      setCurrentValues(prev => {
        if (prev.includes(value)) {
          return prev.filter(v => v !== value);
        } else if (prev.length < 5) {
          return [...prev, value];
        }
        return prev;
      });
    } else {
      setDesiredValues(prev => {
        if (prev.includes(value)) {
          return prev.filter(v => v !== value);
        } else if (prev.length < 5) {
          return [...prev, value];
        }
        return prev;
      });
    }
  }, []);

  // Submit survey
  const handleSubmit = async () => {
    const completionPercentage = getCompletionPercentage();
    const timeSpent = getTimeSpent();

    // Client-side quality gates
    if (completionPercentage < 70) {
      toast({
        title: language === 'ar' ? 'استجابة غير مكتملة' : 'Incomplete Response',
        description: language === 'ar' 
          ? `يرجى الإجابة على 70% على الأقل من الأسئلة (${completionPercentage}% مكتمل حالياً)`
          : `Please answer at least 70% of questions (currently ${completionPercentage}% complete)`,
        variant: 'destructive'
      });
      return;
    }

    if (timeSpent < 60) {
      const proceed = confirm(
        language === 'ar' 
          ? 'تم إكمال الاستطلاع بسرعة كبيرة. هل تريد المتابعة؟'
          : 'Survey completed very quickly. Do you want to proceed?'
      );
      if (!proceed) return;
    }

    setSubmitting(true);

    try {
      // Prepare answers payload
      const answers: Record<string, any> = {};
      
      // Add Likert responses
      Object.entries(responses).forEach(([itemId, value]) => {
        answers[`item::${itemId}`] = value;
      });

      // Add values responses
      if (currentValues.length > 0) {
        answers['values_current'] = currentValues;
      }
      if (desiredValues.length > 0) {
        answers['values_desired'] = desiredValues;
      }

      // Insert response
      const { error: insertError } = await supabase
        .from('cci_responses')
        .insert({
          tenant_id: survey?.tenant_id,
          survey_id: surveyId,
          wave_id: waveId,
          respondent_hash: respondentHash,
          answers,
          duration_seconds: timeSpent,
          nationality: demographics.nationality || null,
          gender: demographics.gender || null,
          department_id: demographics.department_id || null,
          project_id: demographics.project_id || null,
          grade_id: demographics.grade_id || null,
          submitted_at: new Date().toISOString()
        });

      if (insertError) {
        if (insertError.code === '23505') { // Unique violation
          toast({
            title: language === 'ar' ? 'استجابة مكررة' : 'Duplicate Response',
            description: language === 'ar' 
              ? 'لقد قمت بالفعل بالرد على هذا الاستطلاع'
              : 'You have already responded to this survey',
            variant: 'destructive'
          });
          return;
        }
        throw insertError;
      }

      // Mark token as redeemed if used
      if (tokenData) {
        await supabase
          .from('cci_invite_tokens')
          .update({ redeemed_at: new Date().toISOString() })
          .eq('id', tokenData.id);
      }

      // Clear localStorage for anonymous users
      if (!token) {
        localStorage.removeItem(`cci_rid_${surveyId}_${waveId}`);
      }

      toast({
        title: language === 'ar' ? 'شكراً لك!' : 'Thank You!',
        description: language === 'ar' 
          ? 'تم تسجيل استجابتك بنجاح'
          : 'Your response has been recorded successfully',
      });

          // Navigate to thank you or close window
          setTimeout(() => {
            if (window.opener) {
              window.close();
            } else {
              navigate('/');
            }
          }, 2000);

    } catch (error: any) {
      console.error('Error submitting response:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل في إرسال الاستجابة' : 'Failed to submit response',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Render privacy notice
  const renderPrivacyNotice = () => (
    <div className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <Shield className="h-8 w-8 text-green-600" />
        <h2 className="text-2xl font-bold">
          {language === 'ar' ? 'إشعار الخصوصية' : 'Privacy Notice'}
        </h2>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription className={isRTL ? 'text-right' : ''}>
          {language === 'ar' 
            ? 'هذا الاستطلاع مجهول تماماً. لا يتم تخزين أي أسماء أو عناوين بريد إلكتروني أو عناوين IP. المجموعات الصغيرة (أقل من 7 أشخاص) مخفية لحماية الهوية.'
            : 'This survey is completely anonymous. No names, emails, or IP addresses are stored. Small groups (fewer than 7 people) are hidden to protect anonymity.'
          }
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-semibold">
              {language === 'ar' ? 'حماية البيانات' : 'Data Protection'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' 
                ? 'جميع الاستجابات محمية بموجب قانون حماية البيانات الشخصية السعودي'
                : 'All responses are protected under Saudi Personal Data Protection Law'
              }
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-semibold">
              {language === 'ar' ? 'استخدام البيانات' : 'Data Usage'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' 
                ? 'ستستخدم استجابتك فقط لأغراض التحليل الثقافي التنظيمي'
                : 'Your responses will only be used for organizational culture analysis'
              }
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-semibold">
              {language === 'ar' ? 'حماية الهوية' : 'Identity Protection'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' 
                ? 'لن يتم الإبلاغ عن النتائج للمجموعات الصغيرة لضمان عدم إمكانية تحديد الهوية'
                : 'Results for small groups will not be reported to ensure identification is impossible'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Checkbox 
          id="privacy-consent" 
          checked={privacyAccepted}
          onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
        />
        <Label htmlFor="privacy-consent" className="text-sm">
          {language === 'ar' 
            ? 'أفهم وأوافق على شروط الخصوصية المذكورة أعلاه'
            : 'I understand and agree to the privacy terms stated above'
          }
        </Label>
      </div>
    </div>
  );

  // Render demographics
  const renderDemographics = () => (
    <div className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
      <div>
        <h2 className="text-2xl font-bold mb-2">
          {language === 'ar' ? 'معلومات ديموغرافية (اختيارية)' : 'Demographics (Optional)'}
        </h2>
        <p className="text-muted-foreground">
          {language === 'ar' 
            ? 'هذه المعلومات تساعد في التحليل ولكنها اختيارية تماماً'
            : 'This information helps with analysis but is completely optional'
          }
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {language === 'ar' 
            ? 'تحذير: قد يتم إخفاء المجموعات الصغيرة جداً لحماية إخفاء الهوية'
            : 'Warning: Very small groups may be suppressed to protect anonymity'
          }
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">
            {language === 'ar' ? 'الجنسية' : 'Nationality'}
          </Label>
          <Select value={demographics.nationality} onValueChange={(value) => 
            setDemographics(prev => ({ ...prev, nationality: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder={language === 'ar' ? 'اختر الجنسية' : 'Select nationality'} />
            </SelectTrigger>
            <SelectContent>
              {NATIONALITY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {language === 'ar' ? option.ar : option.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">
            {language === 'ar' ? 'الجنس' : 'Gender'}
          </Label>
          <Select value={demographics.gender} onValueChange={(value) => 
            setDemographics(prev => ({ ...prev, gender: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder={language === 'ar' ? 'اختر الجنس' : 'Select gender'} />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {language === 'ar' ? option.ar : option.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // Render survey items
  const renderItems = () => {
    const pageItems = likertItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    
    return (
      <div className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {language === 'ar' ? 'أسئلة الاستطلاع' : 'Survey Questions'}
          </h2>
          <Badge variant="outline">
            {language === 'ar' 
              ? `صفحة ${currentPage + 1} من ${totalPages}`
              : `Page ${currentPage + 1} of ${totalPages}`
            }
          </Badge>
        </div>

        <div className="space-y-6">
          {pageItems.map((item, index) => (
            <Card key={item.id}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-relaxed">
                    {language === 'ar' ? item.text_ar : item.text_en}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {language === 'ar' ? item.dimension : item.framework}
                    </Badge>
                  </CardDescription>
                </div>
                  <Badge variant="outline" className="text-xs">
                    {currentPage * itemsPerPage + index + 1}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={responses[item.id]?.toString() || ''}
                  onValueChange={(value) => handleResponseChange(item.id, parseInt(value))}
                  className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between`}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex flex-col items-center space-y-2">
                      <RadioGroupItem value={value.toString()} id={`${item.id}-${value}`} />
                      <Label htmlFor={`${item.id}-${value}`} className="text-xs text-center">
                        {value === 1 && (language === 'ar' ? 'لا أوافق بشدة' : 'Strongly Disagree')}
                        {value === 2 && (language === 'ar' ? 'لا أوافق' : 'Disagree')}
                        {value === 3 && (language === 'ar' ? 'محايد' : 'Neutral')}
                        {value === 4 && (language === 'ar' ? 'أوافق' : 'Agree')}
                        {value === 5 && (language === 'ar' ? 'أوافق بشدة' : 'Strongly Agree')}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values Section */}
        {currentPage === totalPages - 1 && hasValuesItems && (
          <div className="space-y-6 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Values */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'ar' ? 'القيم الحالية للمنظمة' : 'Current Organization Values'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ar' 
                      ? 'اختر حتى 5 قيم تصف منظمتك كما هي اليوم'
                      : 'Select up to 5 values that describe your organization as it is today'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {VALUES_LIST.map((value) => (
                      <div key={value.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Checkbox
                          id={`current-${value.value}`}
                          checked={currentValues.includes(value.value)}
                          onCheckedChange={() => handleValuesToggle('current', value.value)}
                          disabled={!currentValues.includes(value.value) && currentValues.length >= 5}
                        />
                        <Label htmlFor={`current-${value.value}`} className="text-sm">
                          {language === 'ar' ? value.ar : value.en}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {language === 'ar' 
                      ? `تم اختيار ${currentValues.length} من 5`
                      : `Selected ${currentValues.length} of 5`
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Desired Values */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'ar' ? 'القيم المرغوبة للمنظمة' : 'Desired Organization Values'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ar' 
                      ? 'اختر حتى 5 قيم تود رؤيتها في منظمتك المثالية'
                      : 'Select up to 5 values you would like to see in your ideal organization'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {VALUES_LIST.map((value) => (
                      <div key={value.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Checkbox
                          id={`desired-${value.value}`}
                          checked={desiredValues.includes(value.value)}
                          onCheckedChange={() => handleValuesToggle('desired', value.value)}
                          disabled={!desiredValues.includes(value.value) && desiredValues.length >= 5}
                        />
                        <Label htmlFor={`desired-${value.value}`} className="text-sm">
                          {language === 'ar' ? value.ar : value.en}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {language === 'ar' 
                      ? `تم اختيار ${desiredValues.length} من 5`
                      : `Selected ${desiredValues.length} of 5`
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {language === 'ar' ? 'السابق' : 'Previous'}
          </Button>

          <div className="text-sm text-muted-foreground">
            {language === 'ar' 
              ? `سؤال ${currentPage * itemsPerPage + 1}-${Math.min((currentPage + 1) * itemsPerPage, likertItems.length)} من ${likertItems.length}`
              : `Questions ${currentPage * itemsPerPage + 1}-${Math.min((currentPage + 1) * itemsPerPage, likertItems.length)} of ${likertItems.length}`
            }
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
          >
            {language === 'ar' ? 'التالي' : 'Next'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  };

  // Render review
  const renderReview = () => {
    const completionPercentage = getCompletionPercentage();
    const timeSpent = getTimeSpent();

    return (
      <div className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {language === 'ar' ? 'مراجعة وإرسال' : 'Review & Submit'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'يرجى مراجعة استجابتك قبل الإرسال'
              : 'Please review your responses before submitting'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completionPercentage}%</div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'مكتمل' : 'Complete'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 flex items-center justify-center">
                  <Clock className="h-5 w-5 mr-1" />
                  {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'الوقت المستغرق' : 'Time Spent'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(responses).length + (currentValues.length > 0 ? 1 : 0) + (desiredValues.length > 0 ? 1 : 0)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'الإجابات' : 'Responses'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Progress value={completionPercentage} className="w-full" />

        {completionPercentage < 70 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {language === 'ar' 
                ? 'يرجى الإجابة على 70% على الأقل من الأسئلة قبل الإرسال'
                : 'Please answer at least 70% of questions before submitting'
              }
            </AlertDescription>
          </Alert>
        )}

        {timeSpent < 60 && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              {language === 'ar' 
                ? 'تم إكمال الاستطلاع بسرعة. يرجى التأكد من دقة الإجابات'
                : 'Survey completed quickly. Please ensure responses are accurate'
              }
            </AlertDescription>
          </Alert>
        )}

        <div className="pt-4">
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || completionPercentage < 70}
            className="w-full"
            size="lg"
          >
            {submitting ? (
              language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'
            ) : (
              language === 'ar' ? 'إرسال الاستجابة' : 'Submit Response'
            )}
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!survey || !wave) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">
              {language === 'ar' ? 'غير موجود' : 'Not Found'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'الاستطلاع المطلوب غير موجود أو غير متاح'
                : 'The requested survey is not found or unavailable'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const steps = [
    { id: 0, title: language === 'ar' ? 'إشعار الخصوصية' : 'Privacy Notice' },
    { id: 1, title: language === 'ar' ? 'معلومات ديموغرافية' : 'Demographics' },
    { id: 2, title: language === 'ar' ? 'أسئلة الاستطلاع' : 'Survey Questions' },
    { id: 3, title: language === 'ar' ? 'مراجعة وإرسال' : 'Review & Submit' }
  ];

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">{survey.name}</h1>
              <p className="text-muted-foreground">
                {language === 'ar' ? `الموجة ${wave.wave_no}` : `Wave ${wave.wave_no}`}
                {wave.is_baseline && (language === 'ar' ? ' (خط الأساس)' : ' (Baseline)')}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            >
              <Globe className="h-4 w-4 mr-1" />
              {language === 'ar' ? 'English' : 'العربية'}
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{steps[currentStep].title}</span>
              <span>{language === 'ar' ? `خطوة ${currentStep + 1} من ${steps.length}` : `Step ${currentStep + 1} of ${steps.length}`}</span>
            </div>
            <Progress value={(currentStep / (steps.length - 1)) * 100} />
          </div>
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            {currentStep === 0 && renderPrivacyNotice()}
            {currentStep === 1 && renderDemographics()}
            {currentStep === 2 && renderItems()}
            {currentStep === 3 && renderReview()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {language === 'ar' ? 'السابق' : 'Back'}
          </Button>

          <div className="text-sm text-muted-foreground">
            {currentStep === 2 && (
              <span>
                {language === 'ar' 
                  ? `${getCompletionPercentage()}% مكتمل`
                  : `${getCompletionPercentage()}% complete`
                }
              </span>
            )}
          </div>

          {currentStep < 3 && (
            <Button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={
                (currentStep === 0 && !privacyAccepted) ||
                (currentStep === 2 && currentPage < totalPages - 1)
              }
            >
              {language === 'ar' ? 'التالي' : 'Next'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}