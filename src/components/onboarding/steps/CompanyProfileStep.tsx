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
import { toast } from 'sonner';
import { 
  Building2, 
  Users, 
  Target, 
  Wrench, 
  Zap,
  TrendingUp,
  Globe,
  Factory,
  Stethoscope,
  DollarSign,
  ShoppingBag,
  GraduationCap,
  Hammer,
  Fuel,
  Phone,
  MoreHorizontal
} from 'lucide-react';
import { Coins } from 'lucide-react';

interface CompanyProfileStepProps {
  isArabic: boolean;
}

const INDUSTRIES = [
  { 
    value: 'technology', 
    labelEn: 'Technology & Software', 
    labelAr: 'التكنولوجيا والبرمجيات',
    icon: Zap
  },
  { 
    value: 'healthcare', 
    labelEn: 'Healthcare & Medical', 
    labelAr: 'الرعاية الصحية والطب',
    icon: Stethoscope
  },
  { 
    value: 'finance', 
    labelEn: 'Finance & Banking', 
    labelAr: 'المالية والمصرفية',
    icon: Coins
  },
  { 
    value: 'manufacturing', 
    labelEn: 'Manufacturing & Industrial', 
    labelAr: 'التصنيع والصناعة',
    icon: Factory
  },
  { 
    value: 'retail', 
    labelEn: 'Retail & E-commerce', 
    labelAr: 'البيع بالتجزئة والتجارة الإلكترونية',
    icon: ShoppingBag
  },
  { 
    value: 'education', 
    labelEn: 'Education & Training', 
    labelAr: 'التعليم والتدريب',
    icon: GraduationCap
  },
  { 
    value: 'construction', 
    labelEn: 'Construction & Real Estate', 
    labelAr: 'البناء والعقارات',
    icon: Hammer
  },
  { 
    value: 'energy', 
    labelEn: 'Energy & Oil', 
    labelAr: 'الطاقة والنفط',
    icon: Fuel
  },
  { 
    value: 'telecommunications', 
    labelEn: 'Telecommunications', 
    labelAr: 'الاتصالات',
    icon: Phone
  },
  { 
    value: 'consulting', 
    labelEn: 'Consulting & Professional Services', 
    labelAr: 'الاستشارات والخدمات المهنية',
    icon: Globe
  },
  { 
    value: 'other', 
    labelEn: 'Other', 
    labelAr: 'أخرى',
    icon: MoreHorizontal
  }
];

const COMPANY_SIZES = [
  { value: 'startup', labelEn: 'Startup (1-10 employees)', labelAr: 'شركة ناشئة (1-10 موظفين)' },
  { value: 'small', labelEn: 'Small (11-50 employees)', labelAr: 'صغيرة (11-50 موظف)' },
  { value: 'medium', labelEn: 'Medium (51-200 employees)', labelAr: 'متوسطة (51-200 موظف)' },
  { value: 'large', labelEn: 'Large (201-1000 employees)', labelAr: 'كبيرة (201-1000 موظف)' },
  { value: 'enterprise', labelEn: 'Enterprise (1000+ employees)', labelAr: 'مؤسسة (1000+ موظف)' }
];

const HR_CHALLENGES = [
  { 
    id: 'recruitment_sourcing', 
    labelEn: 'Finding qualified candidates', 
    labelAr: 'العثور على المرشحين المؤهلين' 
  },
  { 
    id: 'saudization_compliance', 
    labelEn: 'Meeting Saudization requirements', 
    labelAr: 'تلبية متطلبات السعودة' 
  },
  { 
    id: 'performance_management', 
    labelEn: 'Performance management & reviews', 
    labelAr: 'إدارة الأداء والمراجعات' 
  },
  { 
    id: 'employee_retention', 
    labelEn: 'Employee retention & engagement', 
    labelAr: 'الاحتفاظ بالموظفين والمشاركة' 
  },
  { 
    id: 'compliance_labor_law', 
    labelEn: 'Labor law compliance', 
    labelAr: 'الامتثال لقانون العمل' 
  },
  { 
    id: 'payroll_complexity', 
    labelEn: 'Payroll processing complexity', 
    labelAr: 'تعقيد معالجة كشوف المرتبات' 
  },
  { 
    id: 'leave_management', 
    labelEn: 'Leave and attendance tracking', 
    labelAr: 'تتبع الإجازات والحضور' 
  },
  { 
    id: 'employee_development', 
    labelEn: 'Employee training & development', 
    labelAr: 'تدريب وتطوير الموظفين' 
  },
  { 
    id: 'succession_planning', 
    labelEn: 'Succession planning', 
    labelAr: 'التخطيط للخلافة' 
  },
  { 
    id: 'data_analytics', 
    labelEn: 'HR data & analytics', 
    labelAr: 'بيانات وتحليلات الموارد البشرية' 
  },
  { 
    id: 'government_integration', 
    labelEn: 'Government systems integration (Qiwa, GOSI)', 
    labelAr: 'تكامل الأنظمة الحكومية (قوى، GOSI)' 
  },
  { 
    id: 'employee_communication', 
    labelEn: 'Internal communication & engagement', 
    labelAr: 'التواصل الداخلي والمشاركة' 
  },
  { 
    id: 'document_management', 
    labelEn: 'HR document management', 
    labelAr: 'إدارة وثائق الموارد البشرية' 
  },
  { 
    id: 'budget_optimization', 
    labelEn: 'HR budget optimization', 
    labelAr: 'تحسين ميزانية الموارد البشرية' 
  },
  { 
    id: 'remote_work_management', 
    labelEn: 'Remote work & hybrid management', 
    labelAr: 'إدارة العمل عن بُعد والمختلط' 
  }
];

const EXISTING_HR_TOOLS = [
  { id: 'excel_sheets', labelEn: 'Excel Spreadsheets', labelAr: 'جداول Excel' },
  { id: 'manual_processes', labelEn: 'Manual Paper Processes', labelAr: 'العمليات الورقية اليدوية' },
  { id: 'sap', labelEn: 'SAP SuccessFactors', labelAr: 'SAP SuccessFactors' },
  { id: 'workday', labelEn: 'Workday', labelAr: 'Workday' },
  { id: 'bamboohr', labelEn: 'BambooHR', labelAr: 'BambooHR' },
  { id: 'adp', labelEn: 'ADP', labelAr: 'ADP' },
  { id: 'oracle_hcm', labelEn: 'Oracle HCM Cloud', labelAr: 'Oracle HCM Cloud' },
  { id: 'darwinbox', labelEn: 'Darwinbox', labelAr: 'Darwinbox' },
  { id: 'qiwa_platform', labelEn: 'Qiwa Platform', labelAr: 'منصة قوى' },
  { id: 'local_payroll', labelEn: 'Local Payroll System', labelAr: 'نظام كشوف مرتبات محلي' },
  { id: 'attendance_system', labelEn: 'Attendance Management System', labelAr: 'نظام إدارة الحضور' },
  { id: 'custom_solution', labelEn: 'Custom/In-house Solution', labelAr: 'حل مخصص/داخلي' },
  { id: 'other', labelEn: 'Other', labelAr: 'أخرى' }
];

export function CompanyProfileStep({ isArabic }: CompanyProfileStepProps) {
  const { data, saveProfile } = useOnboardingProfile();

  const { control, watch, setValue } = useForm({
    defaultValues: {
      industry_type: data.industry_type || '',
      company_size: data.company_size || '',
      hr_challenges: data.hr_challenges || [],
      existing_hr_tools: data.existing_hr_tools || [],
      saudization_percentage_goal: data.saudization_percentage_goal || 50
    }
  });

  const watchedValues = watch();

  const handleSave = async () => {
    try {
      await saveProfile(watchedValues);
      toast.success(isArabic ? 'تم حفظ ملف الشركة بنجاح' : 'Company profile saved successfully');
    } catch (error) {
      toast.error(isArabic ? 'فشل في حفظ البيانات' : 'Failed to save data');
    }
  };

  const handleChallengeToggle = (challengeId: string, checked: boolean) => {
    const current = watchedValues.hr_challenges;
    const updated = checked 
      ? [...current, challengeId]
      : current.filter(id => id !== challengeId);
    setValue('hr_challenges', updated);
  };

  const handleToolToggle = (toolId: string, checked: boolean) => {
    const current = watchedValues.existing_hr_tools;
    const updated = checked 
      ? [...current, toolId]
      : current.filter(id => id !== toolId);
    setValue('existing_hr_tools', updated);
  };

  return (
    <div className="space-y-6">
      {/* Industry Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>
                {isArabic ? 'نوع الصناعة' : 'Industry Type'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'اختر الصناعة التي تعمل فيها شركتك' 
                  : 'Select the industry your company operates in'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Controller
            name="industry_type"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {INDUSTRIES.map((industry) => (
                  <div
                    key={industry.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors hover:border-primary ${
                      field.value === industry.value 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    }`}
                    onClick={() => field.onChange(industry.value)}
                  >
                    <div className="flex items-center gap-2">
                      <industry.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {isArabic ? industry.labelAr : industry.labelEn}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Company Size */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>
                {isArabic ? 'حجم الشركة' : 'Company Size'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'كم عدد الموظفين في شركتك حالياً؟' 
                  : 'How many employees does your company currently have?'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Controller
            name="company_size"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isArabic ? 'اختر حجم الشركة' : 'Select company size'} />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {isArabic ? size.labelAr : size.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </CardContent>
      </Card>

      {/* HR Challenges */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>
                {isArabic ? 'التحديات الحالية في الموارد البشرية' : 'Current HR Challenges'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'اختر التحديات الرئيسية التي تواجهها في إدارة الموارد البشرية (اختر عدة خيارات)' 
                  : 'Select the main challenges you face in HR management (select multiple)'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HR_CHALLENGES.map((challenge) => (
              <div key={challenge.id} className="flex items-center space-x-2">
                <Checkbox
                  id={challenge.id}
                  checked={watchedValues.hr_challenges.includes(challenge.id)}
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
          {watchedValues.hr_challenges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">
                {isArabic ? 'التحديات المختارة:' : 'Selected challenges:'}
              </span>
              {watchedValues.hr_challenges.map(challengeId => {
                const challenge = HR_CHALLENGES.find(c => c.id === challengeId);
                return challenge && (
                  <Badge key={challengeId} variant="secondary" className="text-xs">
                    {isArabic ? challenge.labelAr : challenge.labelEn}
                  </Badge>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing HR Tools */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>
                {isArabic ? 'أدوات الموارد البشرية الحالية' : 'Current HR Tools'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'ما هي الأنظمة أو الأدوات التي تستخدمها حالياً في إدارة الموارد البشرية؟' 
                  : 'What systems or tools do you currently use for HR management?'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EXISTING_HR_TOOLS.map((tool) => (
              <div key={tool.id} className="flex items-center space-x-2">
                <Checkbox
                  id={tool.id}
                  checked={watchedValues.existing_hr_tools.includes(tool.id)}
                  onCheckedChange={(checked) => 
                    handleToolToggle(tool.id, checked as boolean)
                  }
                />
                <Label htmlFor={tool.id} className="text-sm flex-1 cursor-pointer">
                  {isArabic ? tool.labelAr : tool.labelEn}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saudization Goal */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>
                {isArabic ? 'هدف نسبة السعودة' : 'Saudization Percentage Goal'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'ما هي نسبة السعودة التي تهدف إلى تحقيقها؟' 
                  : 'What Saudization percentage are you aiming to achieve?'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Controller
            name="saudization_percentage_goal"
            control={control}
            render={({ field }) => (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    {isArabic ? 'النسبة المستهدفة' : 'Target Percentage'}
                  </Label>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {field.value}%
                  </Badge>
                </div>
                <Slider
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          {isArabic ? 'حفظ ملف الشركة' : 'Save Company Profile'}
        </Button>
      </div>
    </div>
  );
}
