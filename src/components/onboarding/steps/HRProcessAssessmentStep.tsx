import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useOnboardingProfile } from '@/hooks/useOnboardingProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Users, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle,
  TrendingUp,
  FileSearch,
  UserCheck,
  Award
} from 'lucide-react';

interface HRProcessAssessmentStepProps {
  isArabic: boolean;
}

const RECRUITMENT_STEPS = [
  { id: 'job_posting', labelEn: 'Job Posting & Advertisement', labelAr: 'نشر وإعلان الوظائف' },
  { id: 'application_screening', labelEn: 'Application Screening', labelAr: 'فحص الطلبات' },
  { id: 'phone_screening', labelEn: 'Phone/Video Screening', labelAr: 'المقابلة الهاتفية/المرئية' },
  { id: 'technical_assessment', labelEn: 'Technical Assessment', labelAr: 'التقييم الفني' },
  { id: 'in_person_interview', labelEn: 'In-Person Interview', labelAr: 'المقابلة الشخصية' },
  { id: 'reference_check', labelEn: 'Reference Check', labelAr: 'فحص المراجع' },
  { id: 'background_verification', labelEn: 'Background Verification', labelAr: 'التحقق من الخلفية' },
  { id: 'offer_negotiation', labelEn: 'Offer Negotiation', labelAr: 'التفاوض على العرض' },
  { id: 'contract_signing', labelEn: 'Contract Signing', labelAr: 'توقيع العقد' },
  { id: 'onboarding', labelEn: 'Employee Onboarding', labelAr: 'إدماج الموظف' }
];

const RECRUITMENT_CHALLENGES = [
  { id: 'slow_process', labelEn: 'Recruitment process takes too long', labelAr: 'عملية التوظيف تستغرق وقتاً طويلاً' },
  { id: 'low_quality_candidates', labelEn: 'Low quality of candidates', labelAr: 'جودة منخفضة للمرشحين' },
  { id: 'high_dropout_rate', labelEn: 'High candidate dropout rate', labelAr: 'معدل تسرب عالي للمرشحين' },
  { id: 'salary_negotiations', labelEn: 'Difficult salary negotiations', labelAr: 'مفاوضات الراتب صعبة' },
  { id: 'reference_verification', labelEn: 'Reference verification challenges', labelAr: 'تحديات التحقق من المراجع' },
  { id: 'visa_work_permit', labelEn: 'Visa/work permit delays', labelAr: 'تأخير في التأشيرة/تصريح العمل' }
];

const PERFORMANCE_FREQUENCIES = [
  { value: 'monthly', labelEn: 'Monthly', labelAr: 'شهرياً' },
  { value: 'quarterly', labelEn: 'Quarterly', labelAr: 'كل ثلاثة أشهر' },
  { value: 'semi_annual', labelEn: 'Semi-Annual (Twice a year)', labelAr: 'نصف سنوياً (مرتان في السنة)' },
  { value: 'annual', labelEn: 'Annual', labelAr: 'سنوياً' },
  { value: 'ad_hoc', labelEn: 'Ad-hoc/As needed', labelAr: 'حسب الحاجة' },
  { value: 'no_formal_process', labelEn: 'No formal process', labelAr: 'لا توجد عملية رسمية' }
];

const LEAVE_COMPLEXITY_LEVELS = [
  { value: 'simple', labelEn: 'Simple (Basic annual leave only)', labelAr: 'بسيط (الإجازة السنوية الأساسية فقط)' },
  { value: 'moderate', labelEn: 'Moderate (Multiple leave types, basic approval)', labelAr: 'متوسط (أنواع إجازات متعددة، موافقة أساسية)' },
  { value: 'complex', labelEn: 'Complex (Multiple policies, multi-level approval)', labelAr: 'معقد (سياسات متعددة، موافقة متعددة المستويات)' },
  { value: 'very_complex', labelEn: 'Very Complex (Department-specific policies, integration needs)', labelAr: 'معقد جداً (سياسات خاصة بالأقسام، احتياجات تكامل)' }
];

const COMPLIANCE_CONCERNS = [
  { id: 'nitaqat_compliance', labelEn: 'Nitaqat compliance tracking', labelAr: 'تتبع امتثال نطاقات' },
  { id: 'labor_law_updates', labelEn: 'Keeping up with labor law changes', labelAr: 'مواكبة تغييرات قانون العمل' },
  { id: 'gosi_integration', labelEn: 'GOSI registration and compliance', labelAr: 'تسجيل GOSI والامتثال' },
  { id: 'qiwa_reporting', labelEn: 'Qiwa platform reporting', labelAr: 'تقارير منصة قوى' },
  { id: 'mol_inspections', labelEn: 'Ministry of Labor inspections', labelAr: 'تفتيش وزارة العمل' },
  { id: 'eos_calculations', labelEn: 'End of service calculations', labelAr: 'حسابات نهاية الخدمة' },
  { id: 'overtime_regulations', labelEn: 'Overtime regulations compliance', labelAr: 'امتثال أنظمة العمل الإضافي' },
  { id: 'employee_contracts', labelEn: 'Employee contract compliance', labelAr: 'امتثال عقود الموظفين' }
];

const PAIN_POINTS = [
  { id: 'manual_processes', labelEn: 'Manual/paper-based processes', labelAr: 'العمليات اليدوية/الورقية' },
  { id: 'data_accuracy', labelEn: 'Data accuracy and consistency', labelAr: 'دقة البيانات والاتساق' },
  { id: 'reporting_analytics', labelEn: 'Reporting and analytics', labelAr: 'التقارير والتحليلات' },
  { id: 'employee_self_service', labelEn: 'Employee self-service capabilities', labelAr: 'قدرات الخدمة الذاتية للموظفين' },
  { id: 'integration_systems', labelEn: 'Integration between systems', labelAr: 'التكامل بين الأنظمة' },
  { id: 'mobile_access', labelEn: 'Mobile access and usability', labelAr: 'الوصول عبر الجوال وسهولة الاستخدام' },
  { id: 'workflow_approval', labelEn: 'Workflow and approval processes', labelAr: 'سير العمل وعمليات الموافقة' },
  { id: 'document_management', labelEn: 'Document storage and management', labelAr: 'تخزين وإدارة الوثائق' }
];

export function HRProcessAssessmentStep({ isArabic }: HRProcessAssessmentStepProps) {
  const { data, saveProfile } = useOnboardingProfile();

  const { control, watch, setValue } = useForm({
    defaultValues: {
      recruitment_steps: data.recruitment_process?.steps || [],
      recruitment_timeline_weeks: data.recruitment_process?.timeline_weeks || 4,
      recruitment_challenges: data.recruitment_process?.current_challenges || [],
      performance_review_frequency: data.performance_review_frequency || '',
      leave_management_complexity: data.leave_management_complexity || '',
      compliance_concerns: data.compliance_concerns || [],
      pain_points_ranking: data.pain_points_ranking || {}
    }
  });

  const watchedValues = watch();

  const handleSave = async () => {
    try {
      await saveProfile({
        recruitment_process: {
          steps: watchedValues.recruitment_steps,
          timeline_weeks: watchedValues.recruitment_timeline_weeks,
          current_challenges: watchedValues.recruitment_challenges
        },
        performance_review_frequency: watchedValues.performance_review_frequency,
        leave_management_complexity: watchedValues.leave_management_complexity,
        compliance_concerns: watchedValues.compliance_concerns,
        pain_points_ranking: watchedValues.pain_points_ranking
      });
      toast.success(isArabic ? 'تم حفظ تقييم العمليات بنجاح' : 'Process assessment saved successfully');
    } catch (error) {
      toast.error(isArabic ? 'فشل في حفظ البيانات' : 'Failed to save data');
    }
  };

  const handleStepToggle = (stepId: string, checked: boolean) => {
    const current = watchedValues.recruitment_steps;
    const updated = checked 
      ? [...current, stepId]
      : current.filter(id => id !== stepId);
    setValue('recruitment_steps', updated);
  };

  const handleChallengeToggle = (challengeId: string, checked: boolean) => {
    const current = watchedValues.recruitment_challenges;
    const updated = checked 
      ? [...current, challengeId]
      : current.filter(id => id !== challengeId);
    setValue('recruitment_challenges', updated);
  };

  const handleComplianceToggle = (concernId: string, checked: boolean) => {
    const current = watchedValues.compliance_concerns;
    const updated = checked 
      ? [...current, concernId]
      : current.filter(id => id !== concernId);
    setValue('compliance_concerns', updated);
  };

  const handlePainPointRanking = (painPointId: string, rating: number) => {
    setValue('pain_points_ranking', {
      ...watchedValues.pain_points_ranking,
      [painPointId]: rating
    });
  };

  return (
    <div className="space-y-6">
      {/* Recruitment Process */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>
                {isArabic ? 'عملية التوظيف الحالية' : 'Current Recruitment Process'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'اختر الخطوات التي تتضمنها عملية التوظيف لديكم' 
                  : 'Select the steps included in your recruitment process'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recruitment Steps */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              {isArabic ? 'خطوات التوظيف' : 'Recruitment Steps'}
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RECRUITMENT_STEPS.map((step) => (
                <div key={step.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={step.id}
                    checked={watchedValues.recruitment_steps.includes(step.id)}
                    onCheckedChange={(checked) => 
                      handleStepToggle(step.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={step.id} className="text-sm flex-1 cursor-pointer">
                    {isArabic ? step.labelAr : step.labelEn}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <Controller
              name="recruitment_timeline_weeks"
              control={control}
              render={({ field }) => (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {isArabic ? 'المدة الزمنية المعتادة (أسابيع)' : 'Typical Timeline (weeks)'}
                    </Label>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {field.value} {isArabic ? 'أسابيع' : 'weeks'}
                    </Badge>
                  </div>
                  <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 {isArabic ? 'أسبوع' : 'week'}</span>
                    <span>10 {isArabic ? 'أسابيع' : 'weeks'}</span>
                    <span>20 {isArabic ? 'أسبوع' : 'weeks'}</span>
                  </div>
                </div>
              )}
            />
          </div>

          {/* Recruitment Challenges */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              {isArabic ? 'التحديات في التوظيف' : 'Recruitment Challenges'}
            </Label>
            <div className="grid grid-cols-1 gap-3">
              {RECRUITMENT_CHALLENGES.map((challenge) => (
                <div key={challenge.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={challenge.id}
                    checked={watchedValues.recruitment_challenges.includes(challenge.id)}
                    onCheckedChange={(checked) => 
                      handleChallengeToggle(challenge.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={challenge.id} className="text-sm flex-1 cursor-pointer">
                    {isArabic ? challenge.labelAr : challenge.labelEn}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>
                {isArabic ? 'مراجعات الأداء' : 'Performance Reviews'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'كم مرة تقومون بمراجعة أداء الموظفين؟' 
                  : 'How frequently do you conduct employee performance reviews?'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Controller
            name="performance_review_frequency"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isArabic ? 'اختر تكرار المراجعة' : 'Select review frequency'} />
                </SelectTrigger>
                <SelectContent>
                  {PERFORMANCE_FREQUENCIES.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {isArabic ? freq.labelAr : freq.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </CardContent>
      </Card>

      {/* Leave Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>
                {isArabic ? 'إدارة الإجازات' : 'Leave Management'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'ما مدى تعقيد نظام إدارة الإجازات الحالي؟' 
                  : 'How complex is your current leave management system?'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Controller
            name="leave_management_complexity"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isArabic ? 'اختر مستوى التعقيد' : 'Select complexity level'} />
                </SelectTrigger>
                <SelectContent>
                  {LEAVE_COMPLEXITY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {isArabic ? level.labelAr : level.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </CardContent>
      </Card>

      {/* Compliance Concerns */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>
                {isArabic ? 'مخاوف الامتثال' : 'Compliance Concerns'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'ما هي مجالات الامتثال التي تشعرون بالقلق حيالها؟' 
                  : 'What compliance areas are you most concerned about?'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {COMPLIANCE_CONCERNS.map((concern) => (
              <div key={concern.id} className="flex items-center space-x-2">
                <Checkbox
                  id={concern.id}
                  checked={watchedValues.compliance_concerns.includes(concern.id)}
                  onCheckedChange={(checked) => 
                    handleComplianceToggle(concern.id, checked as boolean)
                  }
                />
                <Label htmlFor={concern.id} className="text-sm flex-1 cursor-pointer">
                  {isArabic ? concern.labelAr : concern.labelEn}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pain Points Ranking */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>
                {isArabic ? 'ترتيب نقاط الألم' : 'Pain Points Ranking'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'قيم مستوى الألم من 1 (منخفض) إلى 10 (عالي جداً) لكل مجال' 
                  : 'Rate the pain level from 1 (low) to 10 (very high) for each area'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {PAIN_POINTS.map((painPoint) => (
              <div key={painPoint.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    {isArabic ? painPoint.labelAr : painPoint.labelEn}
                  </Label>
                  <Badge variant="outline" className="px-2 py-1">
                    {watchedValues.pain_points_ranking[painPoint.id] || 1}/10
                  </Badge>
                </div>
                <Slider
                  value={[watchedValues.pain_points_ranking[painPoint.id] || 1]}
                  onValueChange={(value) => handlePainPointRanking(painPoint.id, value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{isArabic ? 'منخفض' : 'Low'}</span>
                  <span>{isArabic ? 'متوسط' : 'Medium'}</span>
                  <span>{isArabic ? 'عالي' : 'High'}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <FileSearch className="h-4 w-4" />
          {isArabic ? 'حفظ تقييم العمليات' : 'Save Process Assessment'}
        </Button>
      </div>
    </div>
  );
}