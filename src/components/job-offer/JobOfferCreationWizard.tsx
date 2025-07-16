import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LocationForm, 
  SectorActivityForm, 
  CompanySelect 
} from "@/components/forms/SaudiReferenceSelects";
import { 
  User, 
  Briefcase, 
  DollarSign, 
  FileText, 
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  Building,
  Phone,
  Mail,
  Calendar,
  Globe,
  CreditCard
} from "lucide-react";

interface JobOfferCreationWizardProps {
  onOfferCreated: (offerData: any) => void;
  onCancel: () => void;
}

interface OfferFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  nationalId: string;
  passportNumber: string;
  
  // Position Details
  position: string;
  department: string;
  region: string;
  city: string;
  sector: string;
  activity: string;
  company: string;
  
  // Compensation
  basicSalary: number;
  housingAllowance: number;
  transportationAllowance: number;
  foodAllowance: number;
  totalPackage: number;
  
  // Contract Terms
  contractType: string;
  probationPeriod: number;
  workingHours: string;
  annualLeave: number;
  
  // Benefits
  medicalInsurance: boolean;
  lifeInsurance: boolean;
  familyVisa: boolean;
  annualTickets: number;
  
  // Approval
  reportingManager: string;
  hrApprover: string;
  financeApprover: string;
}

const initialFormData: OfferFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  nationality: '',
  nationalId: '',
  passportNumber: '',
  position: '',
  department: '',
  region: '',
  city: '',
  sector: '',
  activity: '',
  company: '',
  basicSalary: 0,
  housingAllowance: 0,
  transportationAllowance: 0,
  foodAllowance: 0,
  totalPackage: 0,
  contractType: 'permanent',
  probationPeriod: 90,
  workingHours: '40',
  annualLeave: 21,
  medicalInsurance: true,
  lifeInsurance: false,
  familyVisa: false,
  annualTickets: 1,
  reportingManager: '',
  hrApprover: '',
  financeApprover: ''
};

export const JobOfferCreationWizard = ({ 
  onOfferCreated, 
  onCancel 
}: JobOfferCreationWizardProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OfferFormData>(initialFormData);

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { 
      id: 1, 
      title: language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information',
      icon: User 
    },
    { 
      id: 2, 
      title: language === 'ar' ? 'تفاصيل الوظيفة' : 'Position Details',
      icon: Briefcase 
    },
    { 
      id: 3, 
      title: language === 'ar' ? 'حزمة التعويضات' : 'Compensation Package',
      icon: DollarSign 
    },
    { 
      id: 4, 
      title: language === 'ar' ? 'شروط العقد' : 'Contract Terms',
      icon: FileText 
    },
    { 
      id: 5, 
      title: language === 'ar' ? 'سير الموافقة' : 'Approval Workflow',
      icon: UserCheck 
    },
    { 
      id: 6, 
      title: language === 'ar' ? 'المراجعة النهائية' : 'Final Review',
      icon: Check 
    }
  ];

  const updateFormData = (field: keyof OfferFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotalPackage = () => {
    const total = formData.basicSalary + formData.housingAllowance + 
                 formData.transportationAllowance + formData.foodAllowance;
    updateFormData('totalPackage', total);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onOfferCreated(formData);
    toast({
      title: language === 'ar' ? "تم إنشاء العرض" : "Offer Created",
      description: language === 'ar' ? 
        "تم إنشاء عرض العمل بنجاح وإرساله للموافقة." : 
        "Job offer has been created successfully and sent for approval.",
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {language === 'ar' ? 'الاسم الأول' : 'First Name'}
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل الاسم الأول' : 'Enter first name'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  {language === 'ar' ? 'اسم العائلة' : 'Last Name'}
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل اسم العائلة' : 'Enter last name'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter email address'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nationality" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {language === 'ar' ? 'الجنسية' : 'Nationality'}
                </Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => updateFormData('nationality', e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل الجنسية' : 'Enter nationality'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationalId">
                  {language === 'ar' ? 'رقم الهوية' : 'National ID'}
                </Label>
                <Input
                  id="nationalId"
                  value={formData.nationalId}
                  onChange={(e) => updateFormData('nationalId', e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل رقم الهوية' : 'Enter national ID'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passportNumber">
                  {language === 'ar' ? 'رقم جواز السفر' : 'Passport Number'}
                </Label>
                <Input
                  id="passportNumber"
                  value={formData.passportNumber}
                  onChange={(e) => updateFormData('passportNumber', e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل رقم جواز السفر' : 'Enter passport number'}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {language === 'ar' ? 'الموقع' : 'Location'}
              </h3>
              <LocationForm
                regionValue={formData.region}
                cityValue={formData.city}
                onRegionChange={(value) => updateFormData('region', value)}
                onCityChange={(value) => updateFormData('city', value)}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building className="h-5 w-5" />
                {language === 'ar' ? 'القطاع والنشاط' : 'Sector & Activity'}
              </h3>
              <SectorActivityForm
                sectorValue={formData.sector}
                activityValue={formData.activity}
                onSectorChange={(value) => updateFormData('sector', value)}
                onActivityChange={(value) => updateFormData('activity', value)}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {language === 'ar' ? 'الشركة والوظيفة' : 'Company & Position'}
              </h3>
              <CompanySelect
                value={formData.company}
                onValueChange={(value) => updateFormData('company', value)}
                showDetails={true}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">
                    {language === 'ar' ? 'المسمى الوظيفي' : 'Position Title'}
                  </Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => updateFormData('position', e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل المسمى الوظيفي' : 'Enter position title'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">
                    {language === 'ar' ? 'القسم' : 'Department'}
                  </Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => updateFormData('department', e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل اسم القسم' : 'Enter department name'}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  {language === 'ar' ? 'تفاصيل الراتب' : 'Salary Details'}
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="basicSalary">
                    {language === 'ar' ? 'الراتب الأساسي' : 'Basic Salary'}
                  </Label>
                  <Input
                    id="basicSalary"
                    type="number"
                    value={formData.basicSalary}
                    onChange={(e) => {
                      updateFormData('basicSalary', parseFloat(e.target.value) || 0);
                      calculateTotalPackage();
                    }}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="housingAllowance">
                    {language === 'ar' ? 'بدل السكن' : 'Housing Allowance'}
                  </Label>
                  <Input
                    id="housingAllowance"
                    type="number"
                    value={formData.housingAllowance}
                    onChange={(e) => {
                      updateFormData('housingAllowance', parseFloat(e.target.value) || 0);
                      calculateTotalPackage();
                    }}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transportationAllowance">
                    {language === 'ar' ? 'بدل المواصلات' : 'Transportation Allowance'}
                  </Label>
                  <Input
                    id="transportationAllowance"
                    type="number"
                    value={formData.transportationAllowance}
                    onChange={(e) => {
                      updateFormData('transportationAllowance', parseFloat(e.target.value) || 0);
                      calculateTotalPackage();
                    }}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foodAllowance">
                    {language === 'ar' ? 'بدل الطعام' : 'Food Allowance'}
                  </Label>
                  <Input
                    id="foodAllowance"
                    type="number"
                    value={formData.foodAllowance}
                    onChange={(e) => {
                      updateFormData('foodAllowance', parseFloat(e.target.value) || 0);
                      calculateTotalPackage();
                    }}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {language === 'ar' ? 'المزايا والخدمات' : 'Benefits & Services'}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>{language === 'ar' ? 'التأمين الطبي' : 'Medical Insurance'}</Label>
                    <input
                      type="checkbox"
                      checked={formData.medicalInsurance}
                      onChange={(e) => updateFormData('medicalInsurance', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>{language === 'ar' ? 'تأمين على الحياة' : 'Life Insurance'}</Label>
                    <input
                      type="checkbox"
                      checked={formData.lifeInsurance}
                      onChange={(e) => updateFormData('lifeInsurance', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>{language === 'ar' ? 'فيزا عائلية' : 'Family Visa'}</Label>
                    <input
                      type="checkbox"
                      checked={formData.familyVisa}
                      onChange={(e) => updateFormData('familyVisa', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="annualTickets">
                      {language === 'ar' ? 'التذاكر السنوية' : 'Annual Tickets'}
                    </Label>
                    <Input
                      id="annualTickets"
                      type="number"
                      value={formData.annualTickets}
                      onChange={(e) => updateFormData('annualTickets', parseInt(e.target.value) || 0)}
                      placeholder="1"
                    />
                  </div>
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-blue-600 mb-2">
                        {language === 'ar' ? 'إجمالي الحزمة الشهرية' : 'Total Monthly Package'}
                      </p>
                      <p className="text-2xl font-bold text-blue-800">
                        {formData.totalPackage.toLocaleString()} SAR
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {language === 'ar' ? 'تفاصيل العقد' : 'Contract Details'}
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="contractType">
                    {language === 'ar' ? 'نوع العقد' : 'Contract Type'}
                  </Label>
                  <select
                    id="contractType"
                    value={formData.contractType}
                    onChange={(e) => updateFormData('contractType', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="permanent">
                      {language === 'ar' ? 'دائم' : 'Permanent'}
                    </option>
                    <option value="temporary">
                      {language === 'ar' ? 'مؤقت' : 'Temporary'}
                    </option>
                    <option value="contract">
                      {language === 'ar' ? 'عقد محدد المدة' : 'Fixed-term Contract'}
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="probationPeriod">
                    {language === 'ar' ? 'فترة التجربة (أيام)' : 'Probation Period (days)'}
                  </Label>
                  <Input
                    id="probationPeriod"
                    type="number"
                    value={formData.probationPeriod}
                    onChange={(e) => updateFormData('probationPeriod', parseInt(e.target.value) || 90)}
                    placeholder="90"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workingHours">
                    {language === 'ar' ? 'ساعات العمل الأسبوعية' : 'Weekly Working Hours'}
                  </Label>
                  <Input
                    id="workingHours"
                    value={formData.workingHours}
                    onChange={(e) => updateFormData('workingHours', e.target.value)}
                    placeholder="40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualLeave">
                    {language === 'ar' ? 'الإجازة السنوية (أيام)' : 'Annual Leave (days)'}
                  </Label>
                  <Input
                    id="annualLeave"
                    type="number"
                    value={formData.annualLeave}
                    onChange={(e) => updateFormData('annualLeave', parseInt(e.target.value) || 21)}
                    placeholder="21"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
                </h3>
                
                <Card className="border-dashed">
                  <CardContent className="p-4">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{language === 'ar' ? 'الامتثال لقانون العمل السعودي' : 'Saudi Labor Law Compliance'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{language === 'ar' ? 'التسجيل في التأمينات الاجتماعية' : 'GOSI Registration'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{language === 'ar' ? 'إجراءات الفيزا والإقامة' : 'Visa & Iqama Processing'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{language === 'ar' ? 'السياسات الداخلية للشركة' : 'Company Internal Policies'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              {language === 'ar' ? 'سلسلة الموافقات' : 'Approval Chain'}
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportingManager">
                  {language === 'ar' ? 'المدير المباشر' : 'Reporting Manager'}
                </Label>
                <Input
                  id="reportingManager"
                  value={formData.reportingManager}
                  onChange={(e) => updateFormData('reportingManager', e.target.value)}
                  placeholder={language === 'ar' ? 'اختر المدير المباشر' : 'Select reporting manager'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hrApprover">
                  {language === 'ar' ? 'موافق الموارد البشرية' : 'HR Approver'}
                </Label>
                <Input
                  id="hrApprover"
                  value={formData.hrApprover}
                  onChange={(e) => updateFormData('hrApprover', e.target.value)}
                  placeholder={language === 'ar' ? 'اختر موافق الموارد البشرية' : 'Select HR approver'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="financeApprover">
                  {language === 'ar' ? 'موافق الشؤون المالية' : 'Finance Approver'}
                </Label>
                <Input
                  id="financeApprover"
                  value={formData.financeApprover}
                  onChange={(e) => updateFormData('financeApprover', e.target.value)}
                  placeholder={language === 'ar' ? 'اختر موافق الشؤون المالية' : 'Select finance approver'}
                />
              </div>
            </div>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <UserCheck className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">
                      {language === 'ar' ? 'سير العمل التلقائي' : 'Automated Workflow'}
                    </h4>
                    <p className="text-sm text-yellow-700">
                      {language === 'ar' ? 
                        'سيتم إرسال العرض تلقائياً للأشخاص المحددين للموافقة حسب التسلسل المحدد.' : 
                        'The offer will be automatically sent to specified approvers in the defined sequence.'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Check className="h-5 w-5" />
              {language === 'ar' ? 'مراجعة نهائية' : 'Final Review'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {language === 'ar' ? 'معلومات المرشح' : 'Candidate Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>{language === 'ar' ? 'الاسم:' : 'Name:'}</strong> {formData.firstName} {formData.lastName}</div>
                  <div><strong>{language === 'ar' ? 'البريد:' : 'Email:'}</strong> {formData.email}</div>
                  <div><strong>{language === 'ar' ? 'الهاتف:' : 'Phone:'}</strong> {formData.phone}</div>
                  <div><strong>{language === 'ar' ? 'الجنسية:' : 'Nationality:'}</strong> {formData.nationality}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {language === 'ar' ? 'تفاصيل الوظيفة' : 'Position Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>{language === 'ar' ? 'المسمى:' : 'Position:'}</strong> {formData.position}</div>
                  <div><strong>{language === 'ar' ? 'القسم:' : 'Department:'}</strong> {formData.department}</div>
                  <div><strong>{language === 'ar' ? 'الموقع:' : 'Location:'}</strong> {formData.city}</div>
                  <div><strong>{language === 'ar' ? 'الشركة:' : 'Company:'}</strong> {formData.company}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {language === 'ar' ? 'حزمة التعويضات' : 'Compensation Package'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>{language === 'ar' ? 'الراتب الأساسي:' : 'Basic Salary:'}</strong> {formData.basicSalary.toLocaleString()} SAR</div>
                  <div><strong>{language === 'ar' ? 'بدل السكن:' : 'Housing:'}</strong> {formData.housingAllowance.toLocaleString()} SAR</div>
                  <div><strong>{language === 'ar' ? 'بدل المواصلات:' : 'Transportation:'}</strong> {formData.transportationAllowance.toLocaleString()} SAR</div>
                  <div className="pt-2 border-t">
                    <strong>{language === 'ar' ? 'الإجمالي:' : 'Total:'}</strong> 
                    <span className="text-lg font-bold text-green-600 ml-2">
                      {formData.totalPackage.toLocaleString()} SAR
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {language === 'ar' ? 'شروط العقد' : 'Contract Terms'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>{language === 'ar' ? 'نوع العقد:' : 'Contract Type:'}</strong> {formData.contractType}</div>
                  <div><strong>{language === 'ar' ? 'فترة التجربة:' : 'Probation:'}</strong> {formData.probationPeriod} {language === 'ar' ? 'يوم' : 'days'}</div>
                  <div><strong>{language === 'ar' ? 'ساعات العمل:' : 'Working Hours:'}</strong> {formData.workingHours} {language === 'ar' ? 'ساعة/أسبوع' : 'hrs/week'}</div>
                  <div><strong>{language === 'ar' ? 'الإجازة السنوية:' : 'Annual Leave:'}</strong> {formData.annualLeave} {language === 'ar' ? 'يوم' : 'days'}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {language === 'ar' ? 'إنشاء عرض عمل جديد' : 'Create New Job Offer'}
            </CardTitle>
            <CardDescription>
              {steps.find(step => step.id === currentStep)?.title}
            </CardDescription>
          </div>
          <Badge variant="outline">
            {language === 'ar' ? `الخطوة ${currentStep} من ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
          </Badge>
        </div>
        
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {renderStepContent()}

        <div className="flex items-center justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={currentStep === 1 ? onCancel : prevStep}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {currentStep === 1 ? 
              (language === 'ar' ? 'إلغاء' : 'Cancel') : 
              (language === 'ar' ? 'السابق' : 'Previous')
            }
          </Button>

          <Button 
            onClick={currentStep === totalSteps ? handleSubmit : nextStep}
            className="flex items-center gap-2"
          >
            {currentStep === totalSteps ? 
              (language === 'ar' ? 'إنشاء العرض' : 'Create Offer') :
              (language === 'ar' ? 'التالي' : 'Next')
            }
            {currentStep !== totalSteps && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};