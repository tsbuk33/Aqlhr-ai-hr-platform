import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Globe, Shield, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';

interface SurveyItem {
  id: string;
  order_no: number;
  framework: string;
  dimension: string;
  text_en: string;
  text_ar: string;
  scale_min: number;
  scale_max: number;
  reverse_scored: boolean;
}

interface Survey {
  id: string;
  name: string;
  anonymity_min_n: number;
}

interface SurveyResponse {
  [key: string]: any;
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

export default function Survey() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [items, setItems] = useState<SurveyItem[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<SurveyResponse>({});
  const [demographics, setDemographics] = useState({
    department_id: '',
    project_id: '',
    grade_id: '',
    nationality: '',
    gender: ''
  });
  const [currentValues, setCurrentValues] = useState<string[]>([]);
  const [desiredValues, setDesiredValues] = useState<string[]>([]);
  const [startTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [isRTL, setIsRTL] = useState(false);

  const surveyId = searchParams.get('id');
  const token = searchParams.get('token');

  useEffect(() => {
    setIsRTL(language === 'ar');
  }, [language]);

  useEffect(() => {
    if (!surveyId || !token) {
      toast.error('Invalid survey link');
      navigate('/');
      return;
    }
    loadSurvey();
  }, [surveyId, token]);

  const loadSurvey = async () => {
    try {
      // Load survey details
      const { data: surveyData, error: surveyError } = await supabase
        .from('cci_surveys')
        .select('*')
        .eq('id', surveyId)
        .single();

      if (surveyError) throw surveyError;
      setSurvey(surveyData);

      // Load survey items
      const { data: itemsData, error: itemsError } = await supabase
        .from('cci_survey_items')
        .select('*')
        .eq('survey_id', surveyId)
        .order('order_no');

      if (itemsError) throw itemsError;
      setItems(itemsData);
    } catch (error: any) {
      toast.error('Failed to load survey');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { name: { en: 'Demographics', ar: 'البيانات الديموغرافية' }, items: [] },
    { name: { en: 'Culture Framework', ar: 'إطار الثقافة' }, items: items.filter(i => i.framework === 'cvf') },
    { name: { en: 'Cultural Web', ar: 'الشبكة الثقافية' }, items: items.filter(i => i.framework === 'web') },
    { name: { en: 'Psychological Safety', ar: 'الأمان النفسي' }, items: items.filter(i => i.framework === 'psych_safety') },
    { name: { en: 'Local Context', ar: 'السياق المحلي' }, items: items.filter(i => i.framework === 'custom') },
    { name: { en: 'Values Alignment', ar: 'التوافق مع القيم' }, items: [] }
  ];

  const progress = ((currentSection + 1) / sections.length) * 100;

  const handleResponse = (itemId: string, value: string) => {
    setResponses(prev => ({ ...prev, [itemId]: value }));
  };

  const handleDemographicChange = (field: string, value: string) => {
    setDemographics(prev => ({ ...prev, [field]: value }));
  };

  const handleValueToggle = (value: string, type: 'current' | 'desired') => {
    const setter = type === 'current' ? setCurrentValues : setDesiredValues;
    const current = type === 'current' ? currentValues : desiredValues;
    
    if (current.includes(value)) {
      setter(current.filter(v => v !== value));
    } else if (current.length < 5) {
      setter([...current, value]);
    } else {
      toast.error(t('Maximum 5 values can be selected', 'يمكن اختيار 5 قيم كحد أقصى'));
    }
  };

  const canProceed = () => {
    if (currentSection === 0) return true; // Demographics optional
    if (currentSection === sections.length - 1) {
      return currentValues.length > 0 && desiredValues.length > 0;
    }
    
    const sectionItems = sections[currentSection].items;
    return sectionItems.every(item => responses[item.id]);
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      submitSurvey();
    }
  };

  const submitSurvey = async () => {
    try {
      const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
      
      // Generate anonymous hash
      const responseHash = await generateResponseHash();
      
      const answers = {
        ...responses,
        current_values: currentValues,
        desired_values: desiredValues,
        demographics
      };

      const { error } = await supabase
        .from('cci_responses')
        .insert({
          survey_id: surveyId,
          tenant_id: survey?.id, // Will be overridden by RLS
          respondent_hash: responseHash,
          answers,
          duration_seconds: durationSeconds,
          ...demographics
        });

      if (error) throw error;

      navigate('/cci/survey/thanks', { 
        state: { 
          surveyName: survey?.name,
          minN: survey?.anonymity_min_n 
        }
      });
    } catch (error: any) {
      toast.error('Failed to submit survey');
      console.error(error);
    }
  };

  const generateResponseHash = async () => {
    const data = `${surveyId}-${token}-${Date.now()}-${Math.random()}`;
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('Loading survey...', 'جاري تحميل الاستبيان...')}</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {t('Survey not found', 'الاستبيان غير موجود')}
            </p>
            <Button onClick={() => navigate('/')} className="w-full mt-4">
              {t('Go Home', 'الرئيسية')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderDemographics = () => (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          {t(
            'Your responses are completely anonymous. Demographic information helps us provide better insights while protecting your privacy.',
            'إجاباتك مجهولة تماماً. المعلومات الديموغرافية تساعدنا في تقديم رؤى أفضل مع حماية خصوصيتك.'
          )}
        </AlertDescription>
      </Alert>
      
      <div className="grid gap-4">
        <div>
          <Label>{t('Department (Optional)', 'القسم (اختياري)')}</Label>
          <Select value={demographics.department_id} onValueChange={(v) => handleDemographicChange('department_id', v)}>
            <SelectTrigger>
              <SelectValue placeholder={t('Select department', 'اختر القسم')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hr">{t('Human Resources', 'الموارد البشرية')}</SelectItem>
              <SelectItem value="finance">{t('Finance', 'المالية')}</SelectItem>
              <SelectItem value="it">{t('Information Technology', 'تقنية المعلومات')}</SelectItem>
              <SelectItem value="operations">{t('Operations', 'العمليات')}</SelectItem>
              <SelectItem value="sales">{t('Sales', 'المبيعات')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t('Nationality (Optional)', 'الجنسية (اختياري)')}</Label>
          <Select value={demographics.nationality} onValueChange={(v) => handleDemographicChange('nationality', v)}>
            <SelectTrigger>
              <SelectValue placeholder={t('Select nationality', 'اختر الجنسية')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="saudi">{t('Saudi', 'سعودي')}</SelectItem>
              <SelectItem value="expat">{t('Expatriate', 'مقيم')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t('Gender (Optional)', 'الجنس (اختياري)')}</Label>
          <Select value={demographics.gender} onValueChange={(v) => handleDemographicChange('gender', v)}>
            <SelectTrigger>
              <SelectValue placeholder={t('Select gender', 'اختر الجنس')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">{t('Male', 'ذكر')}</SelectItem>
              <SelectItem value="female">{t('Female', 'أنثى')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Alert>
        <Users className="h-4 w-4" />
        <AlertDescription>
          {t(
            `Results are hidden until at least ${survey.anonymity_min_n} responses per group are collected.`,
            `النتائج مخفية حتى يتم جمع ${survey.anonymity_min_n} إجابات على الأقل لكل مجموعة.`
          )}
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderLikertItem = (item: SurveyItem) => (
    <Card key={item.id} className="mb-4">
      <CardContent className="pt-6">
        <div className="mb-4">
          <p className="text-lg font-medium mb-2">
            {language === 'ar' ? item.text_ar : item.text_en}
          </p>
          <Badge variant="outline" className="text-xs">
            {item.framework} - {item.dimension}
          </Badge>
        </div>
        
        <RadioGroup
          value={responses[item.id] || ''}
          onValueChange={(value) => handleResponse(item.id, value)}
          className="flex flex-row justify-between"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <div key={value} className="flex flex-col items-center space-y-2">
              <RadioGroupItem value={value.toString()} id={`${item.id}-${value}`} />
              <Label htmlFor={`${item.id}-${value}`} className="text-xs text-center">
                {value === 1 && t('Strongly Disagree', 'أرفض بشدة')}
                {value === 2 && t('Disagree', 'أرفض')}
                {value === 3 && t('Neutral', 'محايد')}
                {value === 4 && t('Agree', 'أوافق')}
                {value === 5 && t('Strongly Agree', 'أوافق بشدة')}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );

  const renderValuesAlignment = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {t('Current Values - Select up to 5 values that best describe your organization TODAY:', 
             'القيم الحالية - اختر حتى 5 قيم تصف منظمتك اليوم:')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {VALUES_LIST.map((item) => (
            <div key={item.value} className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox
                id={`current-${item.value}`}
                checked={currentValues.includes(item.value)}
                onCheckedChange={() => handleValueToggle(item.value, 'current')}
                disabled={!currentValues.includes(item.value) && currentValues.length >= 5}
              />
              <Label htmlFor={`current-${item.value}`} className="text-sm">
                {language === 'ar' ? item.ar : item.en}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {t(`Selected: ${currentValues.length}/5`, `مختار: ${currentValues.length}/5`)}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">
          {t('Desired Values - Select up to 5 values you would like your organization to embrace MORE:', 
             'القيم المرغوبة - اختر حتى 5 قيم تريد من منظمتك تبنيها أكثر:')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {VALUES_LIST.map((item) => (
            <div key={item.value} className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox
                id={`desired-${item.value}`}
                checked={desiredValues.includes(item.value)}
                onCheckedChange={() => handleValueToggle(item.value, 'desired')}
                disabled={!desiredValues.includes(item.value) && desiredValues.length >= 5}
              />
              <Label htmlFor={`desired-${item.value}`} className="text-sm">
                {language === 'ar' ? item.ar : item.en}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {t(`Selected: ${desiredValues.length}/5`, `مختار: ${desiredValues.length}/5`)}
        </p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background to-muted ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {language === 'ar' ? 'تشخيص الثقافة المؤسسية' : survey.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>{t('Anonymous', 'مجهول')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{t('~15 minutes', '~15 دقيقة')}</span>
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            {language === 'ar' ? 'English' : 'العربية'}
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              {sections[currentSection]?.name[language] || ''}
            </span>
            <span className="text-sm text-muted-foreground">
              {currentSection + 1} / {sections.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {sections[currentSection]?.name[language] || ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentSection === 0 && renderDemographics()}
            {currentSection > 0 && currentSection < sections.length - 1 && (
              <div className="space-y-4">
                {sections[currentSection].items.map(renderLikertItem)}
              </div>
            )}
            {currentSection === sections.length - 1 && renderValuesAlignment()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
          >
            {t('Previous', 'السابق')}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentSection === sections.length - 1 
              ? t('Submit Survey', 'إرسال الاستبيان')
              : t('Next', 'التالي')
            }
          </Button>
        </div>
      </div>
    </div>
  );
}