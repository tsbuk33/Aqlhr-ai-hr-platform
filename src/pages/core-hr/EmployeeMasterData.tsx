import React from 'react';
import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { EnhancedFormSystem } from "@/components/enhanced/EnhancedFormSystem";
import { SanadAIFileProcessor } from "@/components/sanad/SanadAIFileProcessor";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, FileCheck, AlertTriangle, Search, Filter, Calendar, MapPin, Upload } from "lucide-react";

const EmployeeMasterData = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  const stats = [
    {
      title: language === 'ar' ? 'إجمالي الموظفين' : 'Total Employees',
      value: 2847,
      icon: Users,
      variant: "primary" as const,
      trend: { value: "12%", isPositive: true }
    },
    {
      title: language === 'ar' ? 'التوظيفات الجديدة هذا الشهر' : 'New Hires This Month',
      value: 67,
      icon: UserPlus,
      variant: "success" as const,
      trend: { value: "23%", isPositive: true }
    },
    {
      title: language === 'ar' ? 'معدل اكتمال البيانات' : 'Data Completion Rate',
      value: '94.2%',
      icon: FileCheck,
      variant: "accent" as const,
      trend: { value: "2%", isPositive: true }
    },
    {
      title: language === 'ar' ? 'التحديثات المعلقة' : 'Pending Updates',
      value: 23,
      icon: AlertTriangle,
      variant: "warning" as const
    }
  ];

  const quickActions = [
    {
      title: language === 'ar' ? 'إضافة موظف جديد' : 'Add New Employee',
      description: language === 'ar' ? 'تسجيل موظف جديد في النظام' : 'Register a new employee in the system',
      icon: UserPlus,
      color: "bg-blue-500",
      onClick: () => console.log('Add employee')
    },
    {
      title: language === 'ar' ? 'البحث في البيانات' : 'Search Employee Data',
      description: language === 'ar' ? 'البحث والفلترة المتقدمة' : 'Advanced search and filtering',
      icon: Search,
      color: "bg-green-500",
      onClick: () => console.log('Search employees')
    },
    {
      title: language === 'ar' ? 'تصدير التقارير' : 'Export Reports',
      description: language === 'ar' ? 'تصدير بيانات الموظفين' : 'Export employee data',
      icon: FileCheck,
      color: "bg-purple-500",
      onClick: () => console.log('Export data')
    },
    {
      title: language === 'ar' ? 'إدارة التنظيم' : 'Organization Management',
      description: language === 'ar' ? 'إدارة الأقسام والمناصب' : 'Manage departments and positions',
      icon: MapPin,
      color: "bg-orange-500",
      onClick: () => console.log('Manage org')
    }
  ];

  const employeeFormFields = [
    // Basic Information Section
    {
      name: 'first_name',
      label: 'First Name',
      arabicLabel: 'الاسم الأول',
      type: 'text' as const,
      required: true
    },
    {
      name: 'last_name',
      label: 'Last Name',
      arabicLabel: 'اسم العائلة',
      type: 'text' as const,
      required: true
    },
    {
      name: 'first_name_ar',
      label: 'First Name (Arabic)',
      arabicLabel: 'الاسم الأول (عربي)',
      type: 'text' as const
    },
    {
      name: 'last_name_ar',
      label: 'Last Name (Arabic)',
      arabicLabel: 'اسم العائلة (عربي)',
      type: 'text' as const
    },
    {
      name: 'employee_number',
      label: 'Employee Number',
      arabicLabel: 'رقم الموظف',
      type: 'text' as const,
      required: true
    },
    {
      name: 'gender',
      label: 'Gender',
      arabicLabel: 'الجنس',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'male', label: language === 'ar' ? 'ذكر' : 'Male' },
        { value: 'female', label: language === 'ar' ? 'أنثى' : 'Female' }
      ]
    },

    // Contact Information
    {
      name: 'personal_email',
      label: 'Personal Email Address',
      arabicLabel: 'البريد الإلكتروني الشخصي',
      type: 'email' as const,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: language === 'ar' ? 'تنسيق البريد الإلكتروني غير صحيح' : 'Invalid email format'
      }
    },
    {
      name: 'company_email',
      label: 'Company Email Address',
      arabicLabel: 'البريد الإلكتروني للشركة',
      type: 'email' as const,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: language === 'ar' ? 'تنسيق البريد الإلكتروني غير صحيح' : 'Invalid email format'
      }
    },
    {
      name: 'phone',
      label: 'Phone Number',
      arabicLabel: 'رقم الهاتف',
      type: 'text' as const,
      validation: {
        pattern: /^[\+]?[1-9][\d]{0,15}$/,
        message: language === 'ar' ? 'رقم هاتف غير صحيح' : 'Invalid phone number'
      }
    },
    {
      name: 'national_address',
      label: 'National Address',
      arabicLabel: 'العنوان الوطني',
      type: 'textarea' as const
    },

    // Identification
    {
      name: 'national_id',
      label: 'National ID',
      arabicLabel: 'رقم الهوية الوطنية',
      type: 'text' as const
    },
    {
      name: 'iqama_number',
      label: 'Iqama Number',
      arabicLabel: 'رقم الإقامة',
      type: 'text' as const
    },
    {
      name: 'passport_number',
      label: 'Passport Number',
      arabicLabel: 'رقم جواز السفر',
      type: 'text' as const
    },
    {
      name: 'nationality',
      label: 'Nationality',
      arabicLabel: 'الجنسية',
      type: 'select' as const,
      options: [
        { value: 'afghan', label: language === 'ar' ? 'أفغاني' : 'Afghan' },
        { value: 'albanian', label: language === 'ar' ? 'ألباني' : 'Albanian' },
        { value: 'algerian', label: language === 'ar' ? 'جزائري' : 'Algerian' },
        { value: 'american', label: language === 'ar' ? 'أمريكي' : 'American' },
        { value: 'andorran', label: language === 'ar' ? 'أندوري' : 'Andorran' },
        { value: 'angolan', label: language === 'ar' ? 'أنغولي' : 'Angolan' },
        { value: 'argentine', label: language === 'ar' ? 'أرجنتيني' : 'Argentine' },
        { value: 'armenian', label: language === 'ar' ? 'أرمني' : 'Armenian' },
        { value: 'australian', label: language === 'ar' ? 'أسترالي' : 'Australian' },
        { value: 'austrian', label: language === 'ar' ? 'نمساوي' : 'Austrian' },
        { value: 'azerbaijani', label: language === 'ar' ? 'أذربيجاني' : 'Azerbaijani' },
        { value: 'bahraini', label: language === 'ar' ? 'بحريني' : 'Bahraini' },
        { value: 'bangladeshi', label: language === 'ar' ? 'بنغلاديشي' : 'Bangladeshi' },
        { value: 'barbadian', label: language === 'ar' ? 'باربادوسي' : 'Barbadian' },
        { value: 'belarusian', label: language === 'ar' ? 'بيلاروسي' : 'Belarusian' },
        { value: 'belgian', label: language === 'ar' ? 'بلجيكي' : 'Belgian' },
        { value: 'belizean', label: language === 'ar' ? 'بليزي' : 'Belizean' },
        { value: 'beninese', label: language === 'ar' ? 'بنيني' : 'Beninese' },
        { value: 'bhutanese', label: language === 'ar' ? 'بوتاني' : 'Bhutanese' },
        { value: 'bolivian', label: language === 'ar' ? 'بوليفي' : 'Bolivian' },
        { value: 'bosnian', label: language === 'ar' ? 'بوسني' : 'Bosnian' },
        { value: 'botswanan', label: language === 'ar' ? 'بوتسواني' : 'Botswanan' },
        { value: 'brazilian', label: language === 'ar' ? 'برازيلي' : 'Brazilian' },
        { value: 'british', label: language === 'ar' ? 'بريطاني' : 'British' },
        { value: 'bruneian', label: language === 'ar' ? 'بروناي' : 'Bruneian' },
        { value: 'bulgarian', label: language === 'ar' ? 'بلغاري' : 'Bulgarian' },
        { value: 'burkinabe', label: language === 'ar' ? 'بوركينابي' : 'Burkinabe' },
        { value: 'burmese', label: language === 'ar' ? 'بورمي' : 'Burmese' },
        { value: 'burundian', label: language === 'ar' ? 'بوروندي' : 'Burundian' },
        { value: 'cambodian', label: language === 'ar' ? 'كمبودي' : 'Cambodian' },
        { value: 'cameroonian', label: language === 'ar' ? 'كاميروني' : 'Cameroonian' },
        { value: 'canadian', label: language === 'ar' ? 'كندي' : 'Canadian' },
        { value: 'cape_verdean', label: language === 'ar' ? 'رأس أخضر' : 'Cape Verdean' },
        { value: 'central_african', label: language === 'ar' ? 'أفريقي وسطي' : 'Central African' },
        { value: 'chadian', label: language === 'ar' ? 'تشادي' : 'Chadian' },
        { value: 'chilean', label: language === 'ar' ? 'تشيلي' : 'Chilean' },
        { value: 'chinese', label: language === 'ar' ? 'صيني' : 'Chinese' },
        { value: 'colombian', label: language === 'ar' ? 'كولومبي' : 'Colombian' },
        { value: 'comoran', label: language === 'ar' ? 'قمري' : 'Comoran' },
        { value: 'congolese', label: language === 'ar' ? 'كونغولي' : 'Congolese' },
        { value: 'costa_rican', label: language === 'ar' ? 'كوستاريكي' : 'Costa Rican' },
        { value: 'croatian', label: language === 'ar' ? 'كرواتي' : 'Croatian' },
        { value: 'cuban', label: language === 'ar' ? 'كوبي' : 'Cuban' },
        { value: 'cypriot', label: language === 'ar' ? 'قبرصي' : 'Cypriot' },
        { value: 'czech', label: language === 'ar' ? 'تشيكي' : 'Czech' },
        { value: 'danish', label: language === 'ar' ? 'دنماركي' : 'Danish' },
        { value: 'djiboutian', label: language === 'ar' ? 'جيبوتي' : 'Djiboutian' },
        { value: 'dominican', label: language === 'ar' ? 'دومينيكي' : 'Dominican' },
        { value: 'dutch', label: language === 'ar' ? 'هولندي' : 'Dutch' },
        { value: 'east_timorese', label: language === 'ar' ? 'تيموري شرقي' : 'East Timorese' },
        { value: 'ecuadorean', label: language === 'ar' ? 'إكوادوري' : 'Ecuadorean' },
        { value: 'egyptian', label: language === 'ar' ? 'مصري' : 'Egyptian' },
        { value: 'emirian', label: language === 'ar' ? 'إماراتي' : 'Emirian' },
        { value: 'equatorial_guinean', label: language === 'ar' ? 'غيني استوائي' : 'Equatorial Guinean' },
        { value: 'eritrean', label: language === 'ar' ? 'إريتري' : 'Eritrean' },
        { value: 'estonian', label: language === 'ar' ? 'إستوني' : 'Estonian' },
        { value: 'ethiopian', label: language === 'ar' ? 'إثيوبي' : 'Ethiopian' },
        { value: 'fijian', label: language === 'ar' ? 'فيجي' : 'Fijian' },
        { value: 'filipino', label: language === 'ar' ? 'فلبيني' : 'Filipino' },
        { value: 'finnish', label: language === 'ar' ? 'فنلندي' : 'Finnish' },
        { value: 'french', label: language === 'ar' ? 'فرنسي' : 'French' },
        { value: 'gabonese', label: language === 'ar' ? 'غابوني' : 'Gabonese' },
        { value: 'gambian', label: language === 'ar' ? 'غامبي' : 'Gambian' },
        { value: 'georgian', label: language === 'ar' ? 'جورجي' : 'Georgian' },
        { value: 'german', label: language === 'ar' ? 'ألماني' : 'German' },
        { value: 'ghanaian', label: language === 'ar' ? 'غاني' : 'Ghanaian' },
        { value: 'greek', label: language === 'ar' ? 'يوناني' : 'Greek' },
        { value: 'grenadian', label: language === 'ar' ? 'غرينادي' : 'Grenadian' },
        { value: 'guatemalan', label: language === 'ar' ? 'غواتيمالي' : 'Guatemalan' },
        { value: 'guinea_bissauan', label: language === 'ar' ? 'غيني بيساوي' : 'Guinea-Bissauan' },
        { value: 'guinean', label: language === 'ar' ? 'غيني' : 'Guinean' },
        { value: 'guyanese', label: language === 'ar' ? 'غياني' : 'Guyanese' },
        { value: 'haitian', label: language === 'ar' ? 'هايتي' : 'Haitian' },
        { value: 'herzegovinian', label: language === 'ar' ? 'هرسكي' : 'Herzegovinian' },
        { value: 'honduran', label: language === 'ar' ? 'هندوراسي' : 'Honduran' },
        { value: 'hungarian', label: language === 'ar' ? 'مجري' : 'Hungarian' },
        { value: 'icelandic', label: language === 'ar' ? 'آيسلندي' : 'Icelandic' },
        { value: 'indian', label: language === 'ar' ? 'هندي' : 'Indian' },
        { value: 'indonesian', label: language === 'ar' ? 'إندونيسي' : 'Indonesian' },
        { value: 'iranian', label: language === 'ar' ? 'إيراني' : 'Iranian' },
        { value: 'iraqi', label: language === 'ar' ? 'عراقي' : 'Iraqi' },
        { value: 'irish', label: language === 'ar' ? 'إيرلندي' : 'Irish' },
        { value: 'israeli', label: language === 'ar' ? 'إسرائيلي' : 'Israeli' },
        { value: 'italian', label: language === 'ar' ? 'إيطالي' : 'Italian' },
        { value: 'ivorian', label: language === 'ar' ? 'عاجي' : 'Ivorian' },
        { value: 'jamaican', label: language === 'ar' ? 'جامايكي' : 'Jamaican' },
        { value: 'japanese', label: language === 'ar' ? 'ياباني' : 'Japanese' },
        { value: 'jordanian', label: language === 'ar' ? 'أردني' : 'Jordanian' },
        { value: 'kazakhstani', label: language === 'ar' ? 'كازاخستاني' : 'Kazakhstani' },
        { value: 'kenyan', label: language === 'ar' ? 'كيني' : 'Kenyan' },
        { value: 'kittian_nevisian', label: language === 'ar' ? 'كيتي ونيفيسي' : 'Kittian and Nevisian' },
        { value: 'kuwaiti', label: language === 'ar' ? 'كويتي' : 'Kuwaiti' },
        { value: 'kyrgyz', label: language === 'ar' ? 'قيرغيزي' : 'Kyrgyz' },
        { value: 'laotian', label: language === 'ar' ? 'لاوسي' : 'Laotian' },
        { value: 'latvian', label: language === 'ar' ? 'لاتفي' : 'Latvian' },
        { value: 'lebanese', label: language === 'ar' ? 'لبناني' : 'Lebanese' },
        { value: 'liberian', label: language === 'ar' ? 'ليبيري' : 'Liberian' },
        { value: 'libyan', label: language === 'ar' ? 'ليبي' : 'Libyan' },
        { value: 'liechtensteiner', label: language === 'ar' ? 'ليختنشتايني' : 'Liechtensteiner' },
        { value: 'lithuanian', label: language === 'ar' ? 'ليتواني' : 'Lithuanian' },
        { value: 'luxembourgish', label: language === 'ar' ? 'لوكسمبورغي' : 'Luxembourgish' },
        { value: 'macedonian', label: language === 'ar' ? 'مقدوني' : 'Macedonian' },
        { value: 'malagasy', label: language === 'ar' ? 'مالاغاشي' : 'Malagasy' },
        { value: 'malawian', label: language === 'ar' ? 'ملاوي' : 'Malawian' },
        { value: 'malaysian', label: language === 'ar' ? 'ماليزي' : 'Malaysian' },
        { value: 'maldivan', label: language === 'ar' ? 'مالديفي' : 'Maldivan' },
        { value: 'malian', label: language === 'ar' ? 'مالي' : 'Malian' },
        { value: 'maltese', label: language === 'ar' ? 'مالطي' : 'Maltese' },
        { value: 'marshallese', label: language === 'ar' ? 'مارشالي' : 'Marshallese' },
        { value: 'mauritanian', label: language === 'ar' ? 'موريتاني' : 'Mauritanian' },
        { value: 'mauritian', label: language === 'ar' ? 'موريشيوسي' : 'Mauritian' },
        { value: 'mexican', label: language === 'ar' ? 'مكسيكي' : 'Mexican' },
        { value: 'micronesian', label: language === 'ar' ? 'ميكرونيزي' : 'Micronesian' },
        { value: 'moldovan', label: language === 'ar' ? 'مولدوفي' : 'Moldovan' },
        { value: 'monacan', label: language === 'ar' ? 'موناكي' : 'Monacan' },
        { value: 'mongolian', label: language === 'ar' ? 'منغولي' : 'Mongolian' },
        { value: 'moroccan', label: language === 'ar' ? 'مغربي' : 'Moroccan' },
        { value: 'mosotho', label: language === 'ar' ? 'ليسوتي' : 'Mosotho' },
        { value: 'motswana', label: language === 'ar' ? 'بوتسواني' : 'Motswana' },
        { value: 'mozambican', label: language === 'ar' ? 'موزمبيقي' : 'Mozambican' },
        { value: 'namibian', label: language === 'ar' ? 'ناميبي' : 'Namibian' },
        { value: 'nauruan', label: language === 'ar' ? 'ناوروي' : 'Nauruan' },
        { value: 'nepalese', label: language === 'ar' ? 'نيبالي' : 'Nepalese' },
        { value: 'new_zealander', label: language === 'ar' ? 'نيوزيلندي' : 'New Zealander' },
        { value: 'nicaraguan', label: language === 'ar' ? 'نيكاراغوي' : 'Nicaraguan' },
        { value: 'nigerien', label: language === 'ar' ? 'نيجيري' : 'Nigerien' },
        { value: 'nigerian', label: language === 'ar' ? 'نيجيري' : 'Nigerian' },
        { value: 'north_korean', label: language === 'ar' ? 'كوري شمالي' : 'North Korean' },
        { value: 'northern_irish', label: language === 'ar' ? 'أيرلندي شمالي' : 'Northern Irish' },
        { value: 'norwegian', label: language === 'ar' ? 'نرويجي' : 'Norwegian' },
        { value: 'omani', label: language === 'ar' ? 'عماني' : 'Omani' },
        { value: 'pakistani', label: language === 'ar' ? 'باكستاني' : 'Pakistani' },
        { value: 'palauan', label: language === 'ar' ? 'بالاوي' : 'Palauan' },
        { value: 'panamanian', label: language === 'ar' ? 'بنمي' : 'Panamanian' },
        { value: 'papua_new_guinean', label: language === 'ar' ? 'بابوا غيني جديد' : 'Papua New Guinean' },
        { value: 'paraguayan', label: language === 'ar' ? 'باراغوياني' : 'Paraguayan' },
        { value: 'peruvian', label: language === 'ar' ? 'بيروفي' : 'Peruvian' },
        { value: 'polish', label: language === 'ar' ? 'بولندي' : 'Polish' },
        { value: 'portuguese', label: language === 'ar' ? 'برتغالي' : 'Portuguese' },
        { value: 'qatari', label: language === 'ar' ? 'قطري' : 'Qatari' },
        { value: 'romanian', label: language === 'ar' ? 'روماني' : 'Romanian' },
        { value: 'russian', label: language === 'ar' ? 'روسي' : 'Russian' },
        { value: 'rwandan', label: language === 'ar' ? 'رواندي' : 'Rwandan' },
        { value: 'saint_lucian', label: language === 'ar' ? 'سانت لوسي' : 'Saint Lucian' },
        { value: 'salvadoran', label: language === 'ar' ? 'سلفادوري' : 'Salvadoran' },
        { value: 'samoan', label: language === 'ar' ? 'ساموي' : 'Samoan' },
        { value: 'san_marinese', label: language === 'ar' ? 'سان مارينو' : 'San Marinese' },
        { value: 'sao_tomean', label: language === 'ar' ? 'ساو تومي' : 'Sao Tomean' },
        { value: 'saudi', label: language === 'ar' ? 'سعودي' : 'Saudi' },
        { value: 'scottish', label: language === 'ar' ? 'اسكتلندي' : 'Scottish' },
        { value: 'senegalese', label: language === 'ar' ? 'سنغالي' : 'Senegalese' },
        { value: 'serbian', label: language === 'ar' ? 'صربي' : 'Serbian' },
        { value: 'seychellois', label: language === 'ar' ? 'سيشيلي' : 'Seychellois' },
        { value: 'sierra_leonean', label: language === 'ar' ? 'سيراليوني' : 'Sierra Leonean' },
        { value: 'singaporean', label: language === 'ar' ? 'سنغافوري' : 'Singaporean' },
        { value: 'slovakian', label: language === 'ar' ? 'سلوفاكي' : 'Slovakian' },
        { value: 'slovenian', label: language === 'ar' ? 'سلوفيني' : 'Slovenian' },
        { value: 'solomon_islander', label: language === 'ar' ? 'جزر سليمان' : 'Solomon Islander' },
        { value: 'somali', label: language === 'ar' ? 'صومالي' : 'Somali' },
        { value: 'south_african', label: language === 'ar' ? 'جنوب أفريقي' : 'South African' },
        { value: 'south_korean', label: language === 'ar' ? 'كوري جنوبي' : 'South Korean' },
        { value: 'spanish', label: language === 'ar' ? 'إسباني' : 'Spanish' },
        { value: 'sri_lankan', label: language === 'ar' ? 'سريلانكي' : 'Sri Lankan' },
        { value: 'sudanese', label: language === 'ar' ? 'سوداني' : 'Sudanese' },
        { value: 'surinamer', label: language === 'ar' ? 'سوريناميي' : 'Surinamer' },
        { value: 'swazi', label: language === 'ar' ? 'سوازي' : 'Swazi' },
        { value: 'swedish', label: language === 'ar' ? 'سويدي' : 'Swedish' },
        { value: 'swiss', label: language === 'ar' ? 'سويسري' : 'Swiss' },
        { value: 'syrian', label: language === 'ar' ? 'سوري' : 'Syrian' },
        { value: 'taiwanese', label: language === 'ar' ? 'تايواني' : 'Taiwanese' },
        { value: 'tajik', label: language === 'ar' ? 'طاجيكي' : 'Tajik' },
        { value: 'tanzanian', label: language === 'ar' ? 'تنزاني' : 'Tanzanian' },
        { value: 'thai', label: language === 'ar' ? 'تايلندي' : 'Thai' },
        { value: 'togolese', label: language === 'ar' ? 'توغولي' : 'Togolese' },
        { value: 'tongan', label: language === 'ar' ? 'تونغي' : 'Tongan' },
        { value: 'trinidadian_tobagonian', label: language === 'ar' ? 'ترينيداد وتوباغو' : 'Trinidadian or Tobagonian' },
        { value: 'tunisian', label: language === 'ar' ? 'تونسي' : 'Tunisian' },
        { value: 'turkish', label: language === 'ar' ? 'تركي' : 'Turkish' },
        { value: 'tuvaluan', label: language === 'ar' ? 'توفالو' : 'Tuvaluan' },
        { value: 'ugandan', label: language === 'ar' ? 'أوغندي' : 'Ugandan' },
        { value: 'ukrainian', label: language === 'ar' ? 'أوكراني' : 'Ukrainian' },
        { value: 'uruguayan', label: language === 'ar' ? 'أوروغوياني' : 'Uruguayan' },
        { value: 'uzbekistani', label: language === 'ar' ? 'أوزبكستاني' : 'Uzbekistani' },
        { value: 'venezuelan', label: language === 'ar' ? 'فنزويلي' : 'Venezuelan' },
        { value: 'vietnamese', label: language === 'ar' ? 'فيتنامي' : 'Vietnamese' },
        { value: 'welsh', label: language === 'ar' ? 'ويلزي' : 'Welsh' },
        { value: 'yemenite', label: language === 'ar' ? 'يمني' : 'Yemenite' },
        { value: 'zambian', label: language === 'ar' ? 'زامبي' : 'Zambian' },
        { value: 'zimbabwean', label: language === 'ar' ? 'زيمبابوي' : 'Zimbabwean' }
      ]
    },

    // Job Information
    {
      name: 'department',
      label: 'Department',
      arabicLabel: 'القسم',
      type: 'select' as const,
      required: true,
      options: [
        // Executive & Leadership
        { value: 'board_of_directors', label: language === 'ar' ? 'مجلس الإدارة' : 'Board of Directors' },
        { value: 'executive_management', label: language === 'ar' ? 'الإدارة التنفيذية' : 'Executive Management' },
        { value: 'ceo_office', label: language === 'ar' ? 'مكتب الرئيس التنفيذي' : 'CEO Office' },
        { value: 'strategic_planning', label: language === 'ar' ? 'التخطيط الاستراتيجي' : 'Strategic Planning' },
        
        // Administrative & Support
        { value: 'hr', label: language === 'ar' ? 'الموارد البشرية' : 'Human Resources' },
        { value: 'finance', label: language === 'ar' ? 'المالية' : 'Finance' },
        { value: 'accounting', label: language === 'ar' ? 'المحاسبة' : 'Accounting' },
        { value: 'legal', label: language === 'ar' ? 'الشؤون القانونية' : 'Legal Affairs' },
        { value: 'admin', label: language === 'ar' ? 'الشؤون الإدارية' : 'Administration' },
        { value: 'procurement', label: language === 'ar' ? 'المشتريات' : 'Procurement' },
        { value: 'supply_chain', label: language === 'ar' ? 'سلسلة التوريد' : 'Supply Chain' },
        { value: 'internal_audit', label: language === 'ar' ? 'التدقيق الداخلي' : 'Internal Audit' },
        { value: 'compliance', label: language === 'ar' ? 'الامتثال' : 'Compliance' },
        { value: 'risk_management', label: language === 'ar' ? 'إدارة المخاطر' : 'Risk Management' },
        
        // Technology & IT
        { value: 'it', label: language === 'ar' ? 'تكنولوجيا المعلومات' : 'Information Technology' },
        { value: 'cybersecurity', label: language === 'ar' ? 'الأمن السيبراني' : 'Cybersecurity' },
        { value: 'software_development', label: language === 'ar' ? 'تطوير البرمجيات' : 'Software Development' },
        { value: 'data_analytics', label: language === 'ar' ? 'تحليل البيانات' : 'Data Analytics' },
        { value: 'digital_transformation', label: language === 'ar' ? 'التحول الرقمي' : 'Digital Transformation' },
        { value: 'tech_support', label: language === 'ar' ? 'الدعم التقني' : 'Technical Support' },
        
        // Construction & Contracting
        { value: 'project_management', label: language === 'ar' ? 'إدارة المشاريع' : 'Project Management' },
        { value: 'construction_management', label: language === 'ar' ? 'إدارة الإنشاءات' : 'Construction Management' },
        { value: 'civil_engineering', label: language === 'ar' ? 'الهندسة المدنية' : 'Civil Engineering' },
        { value: 'mechanical_engineering', label: language === 'ar' ? 'الهندسة الميكانيكية' : 'Mechanical Engineering' },
        { value: 'electrical_engineering', label: language === 'ar' ? 'الهندسة الكهربائية' : 'Electrical Engineering' },
        { value: 'architectural_design', label: language === 'ar' ? 'التصميم المعماري' : 'Architectural Design' },
        { value: 'structural_engineering', label: language === 'ar' ? 'الهندسة الإنشائية' : 'Structural Engineering' },
        { value: 'site_supervision', label: language === 'ar' ? 'الإشراف الميداني' : 'Site Supervision' },
        { value: 'quantity_surveying', label: language === 'ar' ? 'المساحة الكمية' : 'Quantity Surveying' },
        { value: 'safety_engineering', label: language === 'ar' ? 'هندسة السلامة' : 'Safety Engineering' },
        { value: 'quality_control', label: language === 'ar' ? 'مراقبة الجودة' : 'Quality Control' },
        { value: 'materials_testing', label: language === 'ar' ? 'اختبار المواد' : 'Materials Testing' },
        { value: 'contract_administration', label: language === 'ar' ? 'إدارة العقود' : 'Contract Administration' },
        { value: 'cost_estimation', label: language === 'ar' ? 'تقدير التكاليف' : 'Cost Estimation' },
        
        // Oil & Gas
        { value: 'petroleum_engineering', label: language === 'ar' ? 'هندسة البترول' : 'Petroleum Engineering' },
        { value: 'drilling_operations', label: language === 'ar' ? 'عمليات الحفر' : 'Drilling Operations' },
        { value: 'production_engineering', label: language === 'ar' ? 'هندسة الإنتاج' : 'Production Engineering' },
        { value: 'reservoir_engineering', label: language === 'ar' ? 'هندسة المكامن' : 'Reservoir Engineering' },
        { value: 'process_engineering', label: language === 'ar' ? 'هندسة العمليات' : 'Process Engineering' },
        { value: 'pipeline_engineering', label: language === 'ar' ? 'هندسة الأنابيب' : 'Pipeline Engineering' },
        { value: 'refining_operations', label: language === 'ar' ? 'عمليات التكرير' : 'Refining Operations' },
        { value: 'petrochemicals', label: language === 'ar' ? 'البتروكيماويات' : 'Petrochemicals' },
        { value: 'hse_oil_gas', label: language === 'ar' ? 'الصحة والسلامة والبيئة' : 'HSE (Health, Safety & Environment)' },
        
        // Healthcare
        { value: 'medical_services', label: language === 'ar' ? 'الخدمات الطبية' : 'Medical Services' },
        { value: 'nursing', label: language === 'ar' ? 'التمريض' : 'Nursing' },
        { value: 'pharmacy', label: language === 'ar' ? 'الصيدلة' : 'Pharmacy' },
        { value: 'laboratory', label: language === 'ar' ? 'المختبر' : 'Laboratory' },
        { value: 'radiology', label: language === 'ar' ? 'الأشعة' : 'Radiology' },
        { value: 'emergency_medicine', label: language === 'ar' ? 'طب الطوارئ' : 'Emergency Medicine' },
        { value: 'medical_records', label: language === 'ar' ? 'السجلات الطبية' : 'Medical Records' },
        { value: 'biomedical_engineering', label: language === 'ar' ? 'الهندسة الطبية الحيوية' : 'Biomedical Engineering' },
        
        // Education
        { value: 'academic_affairs', label: language === 'ar' ? 'الشؤون الأكاديمية' : 'Academic Affairs' },
        { value: 'student_services', label: language === 'ar' ? 'خدمات الطلاب' : 'Student Services' },
        { value: 'faculty_development', label: language === 'ar' ? 'تطوير أعضاء هيئة التدريس' : 'Faculty Development' },
        { value: 'curriculum_development', label: language === 'ar' ? 'تطوير المناهج' : 'Curriculum Development' },
        { value: 'research_development', label: language === 'ar' ? 'البحث والتطوير' : 'Research & Development' },
        { value: 'library_services', label: language === 'ar' ? 'خدمات المكتبة' : 'Library Services' },
        { value: 'educational_technology', label: language === 'ar' ? 'التكنولوجيا التعليمية' : 'Educational Technology' },
        
        // Manufacturing & Industrial
        { value: 'production', label: language === 'ar' ? 'الإنتاج' : 'Production' },
        { value: 'manufacturing', label: language === 'ar' ? 'التصنيع' : 'Manufacturing' },
        { value: 'industrial_engineering', label: language === 'ar' ? 'الهندسة الصناعية' : 'Industrial Engineering' },
        { value: 'maintenance', label: language === 'ar' ? 'الصيانة' : 'Maintenance' },
        { value: 'quality_assurance', label: language === 'ar' ? 'ضمان الجودة' : 'Quality Assurance' },
        { value: 'operations', label: language === 'ar' ? 'العمليات' : 'Operations' },
        { value: 'logistics', label: language === 'ar' ? 'اللوجستيات' : 'Logistics' },
        { value: 'warehouse', label: language === 'ar' ? 'المستودعات' : 'Warehouse' },
        
        // Banking & Finance
        { value: 'corporate_banking', label: language === 'ar' ? 'الخدمات المصرفية للشركات' : 'Corporate Banking' },
        { value: 'retail_banking', label: language === 'ar' ? 'الخدمات المصرفية للأفراد' : 'Retail Banking' },
        { value: 'investment_banking', label: language === 'ar' ? 'الخدمات المصرفية الاستثمارية' : 'Investment Banking' },
        { value: 'islamic_banking', label: language === 'ar' ? 'المصرفية الإسلامية' : 'Islamic Banking' },
        { value: 'treasury', label: language === 'ar' ? 'الخزينة' : 'Treasury' },
        { value: 'credit_risk', label: language === 'ar' ? 'مخاطر الائتمان' : 'Credit Risk' },
        { value: 'financial_planning', label: language === 'ar' ? 'التخطيط المالي' : 'Financial Planning' },
        { value: 'wealth_management', label: language === 'ar' ? 'إدارة الثروات' : 'Wealth Management' },
        
        // Sales & Marketing
        { value: 'marketing', label: language === 'ar' ? 'التسويق' : 'Marketing' },
        { value: 'sales', label: language === 'ar' ? 'المبيعات' : 'Sales' },
        { value: 'digital_marketing', label: language === 'ar' ? 'التسويق الرقمي' : 'Digital Marketing' },
        { value: 'business_development', label: language === 'ar' ? 'تطوير الأعمال' : 'Business Development' },
        { value: 'customer_service', label: language === 'ar' ? 'خدمة العملاء' : 'Customer Service' },
        { value: 'public_relations', label: language === 'ar' ? 'العلاقات العامة' : 'Public Relations' },
        { value: 'brand_management', label: language === 'ar' ? 'إدارة العلامة التجارية' : 'Brand Management' },
        
        // Hospitality & Tourism
        { value: 'hotel_management', label: language === 'ar' ? 'إدارة الفنادق' : 'Hotel Management' },
        { value: 'front_office', label: language === 'ar' ? 'المكتب الأمامي' : 'Front Office' },
        { value: 'housekeeping', label: language === 'ar' ? 'خدمة التنظيف' : 'Housekeeping' },
        { value: 'food_beverage', label: language === 'ar' ? 'الطعام والشراب' : 'Food & Beverage' },
        { value: 'event_management', label: language === 'ar' ? 'إدارة الفعاليات' : 'Event Management' },
        { value: 'tourism_services', label: language === 'ar' ? 'خدمات السياحة' : 'Tourism Services' },
        { value: 'travel_services', label: language === 'ar' ? 'خدمات السفر' : 'Travel Services' },
        
        // Transportation & Logistics
        { value: 'fleet_management', label: language === 'ar' ? 'إدارة الأسطول' : 'Fleet Management' },
        { value: 'transportation', label: language === 'ar' ? 'النقل' : 'Transportation' },
        { value: 'aviation', label: language === 'ar' ? 'الطيران' : 'Aviation' },
        { value: 'maritime', label: language === 'ar' ? 'النقل البحري' : 'Maritime' },
        { value: 'rail_transport', label: language === 'ar' ? 'النقل بالسكك الحديدية' : 'Rail Transport' },
        { value: 'freight_forwarding', label: language === 'ar' ? 'شحن البضائع' : 'Freight Forwarding' },
        { value: 'customs_clearance', label: language === 'ar' ? 'التخليص الجمركي' : 'Customs Clearance' },
        
        // Agriculture & Food
        { value: 'agriculture', label: language === 'ar' ? 'الزراعة' : 'Agriculture' },
        { value: 'livestock', label: language === 'ar' ? 'الثروة الحيوانية' : 'Livestock' },
        { value: 'food_processing', label: language === 'ar' ? 'تصنيع الأغذية' : 'Food Processing' },
        { value: 'food_safety', label: language === 'ar' ? 'سلامة الغذاء' : 'Food Safety' },
        { value: 'aquaculture', label: language === 'ar' ? 'الاستزراع المائي' : 'Aquaculture' },
        { value: 'agricultural_research', label: language === 'ar' ? 'البحوث الزراعية' : 'Agricultural Research' },
        
        // Retail & Commerce
        { value: 'retail_operations', label: language === 'ar' ? 'عمليات التجزئة' : 'Retail Operations' },
        { value: 'merchandising', label: language === 'ar' ? 'عرض البضائع' : 'Merchandising' },
        { value: 'inventory_management', label: language === 'ar' ? 'إدارة المخزون' : 'Inventory Management' },
        { value: 'ecommerce', label: language === 'ar' ? 'التجارة الإلكترونية' : 'E-commerce' },
        { value: 'category_management', label: language === 'ar' ? 'إدارة الفئات' : 'Category Management' },
        { value: 'visual_merchandising', label: language === 'ar' ? 'عرض البضائع المرئي' : 'Visual Merchandising' },
        
        // Media & Communications
        { value: 'content_creation', label: language === 'ar' ? 'إنشاء المحتوى' : 'Content Creation' },
        { value: 'broadcasting', label: language === 'ar' ? 'البث' : 'Broadcasting' },
        { value: 'journalism', label: language === 'ar' ? 'الصحافة' : 'Journalism' },
        { value: 'graphic_design', label: language === 'ar' ? 'التصميم الجرافيكي' : 'Graphic Design' },
        { value: 'video_production', label: language === 'ar' ? 'إنتاج الفيديو' : 'Video Production' },
        { value: 'social_media', label: language === 'ar' ? 'وسائل التواصل الاجتماعي' : 'Social Media' },
        
        // Real Estate & Property
        { value: 'real_estate_development', label: language === 'ar' ? 'تطوير العقارات' : 'Real Estate Development' },
        { value: 'property_management', label: language === 'ar' ? 'إدارة الممتلكات' : 'Property Management' },
        { value: 'real_estate_sales', label: language === 'ar' ? 'مبيعات العقارات' : 'Real Estate Sales' },
        { value: 'facility_management', label: language === 'ar' ? 'إدارة المرافق' : 'Facility Management' },
        { value: 'urban_planning', label: language === 'ar' ? 'التخطيط العمراني' : 'Urban Planning' },
        
        // Government & Public Sector
        { value: 'public_administration', label: language === 'ar' ? 'الإدارة العامة' : 'Public Administration' },
        { value: 'government_relations', label: language === 'ar' ? 'العلاقات الحكومية' : 'Government Relations' },
        { value: 'regulatory_affairs', label: language === 'ar' ? 'الشؤون التنظيمية' : 'Regulatory Affairs' },
        { value: 'policy_development', label: language === 'ar' ? 'تطوير السياسات' : 'Policy Development' },
        { value: 'public_services', label: language === 'ar' ? 'الخدمات العامة' : 'Public Services' },
        
        // Security & Defense
        { value: 'security_services', label: language === 'ar' ? 'الخدمات الأمنية' : 'Security Services' },
        { value: 'physical_security', label: language === 'ar' ? 'الأمن المادي' : 'Physical Security' },
        { value: 'investigations', label: language === 'ar' ? 'التحقيقات' : 'Investigations' },
        { value: 'emergency_response', label: language === 'ar' ? 'الاستجابة للطوارئ' : 'Emergency Response' },
        
        // Environmental & Sustainability
        { value: 'environmental_services', label: language === 'ar' ? 'الخدمات البيئية' : 'Environmental Services' },
        { value: 'sustainability', label: language === 'ar' ? 'الاستدامة' : 'Sustainability' },
        { value: 'waste_management', label: language === 'ar' ? 'إدارة النفايات' : 'Waste Management' },
        { value: 'renewable_energy', label: language === 'ar' ? 'الطاقة المتجددة' : 'Renewable Energy' },
        { value: 'water_management', label: language === 'ar' ? 'إدارة المياه' : 'Water Management' },
        
        // Sports & Recreation
        { value: 'sports_management', label: language === 'ar' ? 'إدارة الرياضة' : 'Sports Management' },
        { value: 'fitness_wellness', label: language === 'ar' ? 'اللياقة والعافية' : 'Fitness & Wellness' },
        { value: 'recreation_services', label: language === 'ar' ? 'خدمات الترفيه' : 'Recreation Services' },
        
        // Arts & Culture
        { value: 'cultural_affairs', label: language === 'ar' ? 'الشؤون الثقافية' : 'Cultural Affairs' },
        { value: 'museum_management', label: language === 'ar' ? 'إدارة المتاحف' : 'Museum Management' },
        { value: 'heritage_preservation', label: language === 'ar' ? 'الحفاظ على التراث' : 'Heritage Preservation' },
        { value: 'performing_arts', label: language === 'ar' ? 'الفنون الأدائية' : 'Performing Arts' },
        
        // Vision 2030 Sectors
        { value: 'neom_development', label: language === 'ar' ? 'تطوير نيوم' : 'NEOM Development' },
        { value: 'smart_cities', label: language === 'ar' ? 'المدن الذكية' : 'Smart Cities' },
        { value: 'entertainment', label: language === 'ar' ? 'الترفيه' : 'Entertainment' },
        { value: 'gaming_esports', label: language === 'ar' ? 'الألعاب والرياضات الإلكترونية' : 'Gaming & Esports' },
        { value: 'artificial_intelligence', label: language === 'ar' ? 'الذكاء الاصطناعي' : 'Artificial Intelligence' },
        { value: 'robotics', label: language === 'ar' ? 'الروبوتات' : 'Robotics' },
        { value: 'space_technology', label: language === 'ar' ? 'تكنولوجيا الفضاء' : 'Space Technology' },
        { value: 'fintech', label: language === 'ar' ? 'التكنولوجيا المالية' : 'Financial Technology' },
        { value: 'healthtech', label: language === 'ar' ? 'التكنولوجيا الطبية' : 'Health Technology' },
        
        // Specialized Services
        { value: 'consulting', label: language === 'ar' ? 'الاستشارات' : 'Consulting' },
        { value: 'training_development', label: language === 'ar' ? 'التدريب والتطوير' : 'Training & Development' },
        { value: 'translation_services', label: language === 'ar' ? 'خدمات الترجمة' : 'Translation Services' },
        { value: 'market_research', label: language === 'ar' ? 'أبحاث السوق' : 'Market Research' },
        { value: 'innovation_lab', label: language === 'ar' ? 'مختبر الابتكار' : 'Innovation Lab' },
        { value: 'venture_capital', label: language === 'ar' ? 'رأس المال المغامر' : 'Venture Capital' },
        { value: 'private_equity', label: language === 'ar' ? 'الأسهم الخاصة' : 'Private Equity' },
        
        // Other/General
        { value: 'other', label: language === 'ar' ? 'أخرى' : 'Other' }
      ]
    },
    {
      name: 'position',
      label: 'Position',
      arabicLabel: 'المنصب',
      type: 'select' as const,
      required: true,
      options: [
        // Executive Leadership (C-Level & Directors)
        { value: 'ceo', label: language === 'ar' ? 'الرئيس التنفيذي' : 'Chief Executive Officer (CEO)' },
        { value: 'coo', label: language === 'ar' ? 'رئيس العمليات' : 'Chief Operating Officer (COO)' },
        { value: 'cfo', label: language === 'ar' ? 'المدير المالي التنفيذي' : 'Chief Financial Officer (CFO)' },
        { value: 'cto', label: language === 'ar' ? 'المدير التقني التنفيذي' : 'Chief Technology Officer (CTO)' },
        { value: 'cio', label: language === 'ar' ? 'مدير المعلومات التنفيذي' : 'Chief Information Officer (CIO)' },
        { value: 'chro', label: language === 'ar' ? 'مدير الموارد البشرية التنفيذي' : 'Chief Human Resources Officer (CHRO)' },
        { value: 'cmo', label: language === 'ar' ? 'مدير التسويق التنفيذي' : 'Chief Marketing Officer (CMO)' },
        { value: 'board_member', label: language === 'ar' ? 'عضو مجلس إدارة' : 'Board Member' },
        { value: 'executive_director', label: language === 'ar' ? 'مدير تنفيذي' : 'Executive Director' },
        { value: 'regional_director', label: language === 'ar' ? 'مدير إقليمي' : 'Regional Director' },
        
        // Directors & VPs
        { value: 'director_operations', label: language === 'ar' ? 'مدير العمليات' : 'Director of Operations' },
        { value: 'director_finance', label: language === 'ar' ? 'مدير المالية' : 'Director of Finance' },
        { value: 'director_hr', label: language === 'ar' ? 'مدير الموارد البشرية' : 'Director of Human Resources' },
        { value: 'director_it', label: language === 'ar' ? 'مدير تقنية المعلومات' : 'Director of IT' },
        { value: 'director_engineering', label: language === 'ar' ? 'مدير الهندسة' : 'Director of Engineering' },
        { value: 'director_sales', label: language === 'ar' ? 'مدير المبيعات' : 'Director of Sales' },
        { value: 'director_marketing', label: language === 'ar' ? 'مدير التسويق' : 'Director of Marketing' },
        { value: 'director_projects', label: language === 'ar' ? 'مدير المشاريع' : 'Director of Projects' },
        { value: 'director_construction', label: language === 'ar' ? 'مدير الإنشاءات' : 'Director of Construction' },
        { value: 'director_procurement', label: language === 'ar' ? 'مدير المشتريات' : 'Director of Procurement' },
        { value: 'vp_operations', label: language === 'ar' ? 'نائب رئيس العمليات' : 'Vice President Operations' },
        { value: 'vp_sales', label: language === 'ar' ? 'نائب رئيس المبيعات' : 'Vice President Sales' },
        
        // General Managers
        { value: 'general_manager', label: language === 'ar' ? 'مدير عام' : 'General Manager' },
        { value: 'deputy_general_manager', label: language === 'ar' ? 'نائب مدير عام' : 'Deputy General Manager' },
        { value: 'assistant_general_manager', label: language === 'ar' ? 'مساعد مدير عام' : 'Assistant General Manager' },
        { value: 'branch_manager', label: language === 'ar' ? 'مدير فرع' : 'Branch Manager' },
        { value: 'country_manager', label: language === 'ar' ? 'مدير الدولة' : 'Country Manager' },
        
        // Senior Management
        { value: 'senior_manager', label: language === 'ar' ? 'مدير أول' : 'Senior Manager' },
        { value: 'project_manager', label: language === 'ar' ? 'مدير مشروع' : 'Project Manager' },
        { value: 'site_manager', label: language === 'ar' ? 'مدير موقع' : 'Site Manager' },
        { value: 'operations_manager', label: language === 'ar' ? 'مدير العمليات' : 'Operations Manager' },
        { value: 'finance_manager', label: language === 'ar' ? 'مدير مالي' : 'Finance Manager' },
        { value: 'hr_manager', label: language === 'ar' ? 'مدير موارد بشرية' : 'HR Manager' },
        { value: 'it_manager', label: language === 'ar' ? 'مدير تقنية المعلومات' : 'IT Manager' },
        { value: 'sales_manager', label: language === 'ar' ? 'مدير مبيعات' : 'Sales Manager' },
        { value: 'marketing_manager', label: language === 'ar' ? 'مدير تسويق' : 'Marketing Manager' },
        { value: 'procurement_manager', label: language === 'ar' ? 'مدير مشتريات' : 'Procurement Manager' },
        { value: 'quality_manager', label: language === 'ar' ? 'مدير الجودة' : 'Quality Manager' },
        { value: 'safety_manager', label: language === 'ar' ? 'مدير السلامة' : 'Safety Manager' },
        { value: 'logistics_manager', label: language === 'ar' ? 'مدير اللوجستيات' : 'Logistics Manager' },
        { value: 'warehouse_manager', label: language === 'ar' ? 'مدير المستودع' : 'Warehouse Manager' },
        { value: 'construction_manager', label: language === 'ar' ? 'مدير الإنشاءات' : 'Construction Manager' },
        
        // Middle Management
        { value: 'assistant_manager', label: language === 'ar' ? 'مساعد مدير' : 'Assistant Manager' },
        { value: 'deputy_manager', label: language === 'ar' ? 'نائب مدير' : 'Deputy Manager' },
        { value: 'section_head', label: language === 'ar' ? 'رئيس قسم' : 'Section Head' },
        { value: 'department_head', label: language === 'ar' ? 'رئيس إدارة' : 'Department Head' },
        { value: 'team_leader', label: language === 'ar' ? 'قائد فريق' : 'Team Leader' },
        { value: 'project_coordinator', label: language === 'ar' ? 'منسق مشروع' : 'Project Coordinator' },
        { value: 'site_supervisor', label: language === 'ar' ? 'مشرف موقع' : 'Site Supervisor' },
        { value: 'shift_supervisor', label: language === 'ar' ? 'مشرف وردية' : 'Shift Supervisor' },
        { value: 'production_supervisor', label: language === 'ar' ? 'مشرف إنتاج' : 'Production Supervisor' },
        { value: 'quality_supervisor', label: language === 'ar' ? 'مشرف جودة' : 'Quality Supervisor' },
        { value: 'safety_supervisor', label: language === 'ar' ? 'مشرف سلامة' : 'Safety Supervisor' },
        
        // Senior Specialists
        { value: 'senior_engineer', label: language === 'ar' ? 'مهندس أول' : 'Senior Engineer' },
        { value: 'senior_consultant', label: language === 'ar' ? 'استشاري أول' : 'Senior Consultant' },
        { value: 'senior_analyst', label: language === 'ar' ? 'محلل أول' : 'Senior Analyst' },
        { value: 'senior_accountant', label: language === 'ar' ? 'محاسب أول' : 'Senior Accountant' },
        { value: 'senior_auditor', label: language === 'ar' ? 'مدقق أول' : 'Senior Auditor' },
        { value: 'senior_architect', label: language === 'ar' ? 'معماري أول' : 'Senior Architect' },
        { value: 'senior_developer', label: language === 'ar' ? 'مطور أول' : 'Senior Developer' },
        { value: 'senior_designer', label: language === 'ar' ? 'مصمم أول' : 'Senior Designer' },
        { value: 'senior_technician', label: language === 'ar' ? 'فني أول' : 'Senior Technician' },
        { value: 'senior_specialist', label: language === 'ar' ? 'أخصائي أول' : 'Senior Specialist' },
        
        // Engineering Positions
        { value: 'civil_engineer', label: language === 'ar' ? 'مهندس مدني' : 'Civil Engineer' },
        { value: 'mechanical_engineer', label: language === 'ar' ? 'مهندس ميكانيكي' : 'Mechanical Engineer' },
        { value: 'electrical_engineer', label: language === 'ar' ? 'مهندس كهربائي' : 'Electrical Engineer' },
        { value: 'chemical_engineer', label: language === 'ar' ? 'مهندس كيميائي' : 'Chemical Engineer' },
        { value: 'petroleum_engineer', label: language === 'ar' ? 'مهندس بترول' : 'Petroleum Engineer' },
        { value: 'industrial_engineer', label: language === 'ar' ? 'مهندس صناعي' : 'Industrial Engineer' },
        { value: 'environmental_engineer', label: language === 'ar' ? 'مهندس بيئي' : 'Environmental Engineer' },
        { value: 'software_engineer', label: language === 'ar' ? 'مهندس برمجيات' : 'Software Engineer' },
        { value: 'network_engineer', label: language === 'ar' ? 'مهندس شبكات' : 'Network Engineer' },
        { value: 'systems_engineer', label: language === 'ar' ? 'مهندس أنظمة' : 'Systems Engineer' },
        { value: 'architect', label: language === 'ar' ? 'معماري' : 'Architect' },
        { value: 'structural_engineer', label: language === 'ar' ? 'مهندس إنشائي' : 'Structural Engineer' },
        
        // Healthcare Positions
        { value: 'doctor', label: language === 'ar' ? 'طبيب' : 'Doctor' },
        { value: 'specialist_doctor', label: language === 'ar' ? 'طبيب اختصاصي' : 'Specialist Doctor' },
        { value: 'consultant_doctor', label: language === 'ar' ? 'طبيب استشاري' : 'Consultant Doctor' },
        { value: 'nurse', label: language === 'ar' ? 'ممرض/ممرضة' : 'Nurse' },
        { value: 'pharmacist', label: language === 'ar' ? 'صيدلاني' : 'Pharmacist' },
        { value: 'dentist', label: language === 'ar' ? 'طبيب أسنان' : 'Dentist' },
        { value: 'physiotherapist', label: language === 'ar' ? 'أخصائي علاج طبيعي' : 'Physiotherapist' },
        { value: 'radiologist', label: language === 'ar' ? 'أخصائي أشعة' : 'Radiologist' },
        { value: 'lab_technician', label: language === 'ar' ? 'فني مختبر' : 'Lab Technician' },
        { value: 'medical_technician', label: language === 'ar' ? 'فني طبي' : 'Medical Technician' },
        
        // Finance & Accounting
        { value: 'cpa', label: language === 'ar' ? 'محاسب قانوني' : 'Certified Public Accountant (CPA)' },
        { value: 'financial_analyst', label: language === 'ar' ? 'محلل مالي' : 'Financial Analyst' },
        { value: 'auditor', label: language === 'ar' ? 'مدقق' : 'Auditor' },
        { value: 'accountant', label: language === 'ar' ? 'محاسب' : 'Accountant' },
        { value: 'bookkeeper', label: language === 'ar' ? 'أمين دفاتر' : 'Bookkeeper' },
        { value: 'budget_analyst', label: language === 'ar' ? 'محلل ميزانية' : 'Budget Analyst' },
        { value: 'credit_analyst', label: language === 'ar' ? 'محلل ائتمان' : 'Credit Analyst' },
        { value: 'investment_advisor', label: language === 'ar' ? 'مستشار استثمار' : 'Investment Advisor' },
        { value: 'tax_specialist', label: language === 'ar' ? 'أخصائي ضرائب' : 'Tax Specialist' },
        
        // IT & Technology
        { value: 'it_specialist', label: language === 'ar' ? 'أخصائي تقنية معلومات' : 'IT Specialist' },
        { value: 'software_developer', label: language === 'ar' ? 'مطور برمجيات' : 'Software Developer' },
        { value: 'web_developer', label: language === 'ar' ? 'مطور مواقع' : 'Web Developer' },
        { value: 'mobile_developer', label: language === 'ar' ? 'مطور تطبيقات' : 'Mobile Developer' },
        { value: 'database_administrator', label: language === 'ar' ? 'مدير قواعد بيانات' : 'Database Administrator' },
        { value: 'network_administrator', label: language === 'ar' ? 'مدير شبكات' : 'Network Administrator' },
        { value: 'systems_administrator', label: language === 'ar' ? 'مدير أنظمة' : 'Systems Administrator' },
        { value: 'cybersecurity_specialist', label: language === 'ar' ? 'أخصائي أمن معلومات' : 'Cybersecurity Specialist' },
        { value: 'data_scientist', label: language === 'ar' ? 'عالم بيانات' : 'Data Scientist' },
        { value: 'business_analyst', label: language === 'ar' ? 'محلل أعمال' : 'Business Analyst' },
        { value: 'systems_analyst', label: language === 'ar' ? 'محلل أنظمة' : 'Systems Analyst' },
        { value: 'it_support', label: language === 'ar' ? 'دعم تقني' : 'IT Support' },
        
        // Sales & Marketing
        { value: 'sales_representative', label: language === 'ar' ? 'مندوب مبيعات' : 'Sales Representative' },
        { value: 'account_manager', label: language === 'ar' ? 'مدير حسابات' : 'Account Manager' },
        { value: 'business_development_manager', label: language === 'ar' ? 'مدير تطوير أعمال' : 'Business Development Manager' },
        { value: 'marketing_specialist', label: language === 'ar' ? 'أخصائي تسويق' : 'Marketing Specialist' },
        { value: 'digital_marketing_specialist', label: language === 'ar' ? 'أخصائي تسويق رقمي' : 'Digital Marketing Specialist' },
        { value: 'brand_manager', label: language === 'ar' ? 'مدير علامة تجارية' : 'Brand Manager' },
        { value: 'product_manager', label: language === 'ar' ? 'مدير منتج' : 'Product Manager' },
        { value: 'customer_service_representative', label: language === 'ar' ? 'ممثل خدمة عملاء' : 'Customer Service Representative' },
        { value: 'key_account_manager', label: language === 'ar' ? 'مدير الحسابات الرئيسية' : 'Key Account Manager' },
        
        // Construction & Engineering
        { value: 'project_engineer', label: language === 'ar' ? 'مهندس مشروع' : 'Project Engineer' },
        { value: 'site_engineer', label: language === 'ar' ? 'مهندس موقع' : 'Site Engineer' },
        { value: 'construction_foreman', label: language === 'ar' ? 'رئيس عمال بناء' : 'Construction Foreman' },
        { value: 'quantity_surveyor', label: language === 'ar' ? 'مساح كميات' : 'Quantity Surveyor' },
        { value: 'safety_engineer', label: language === 'ar' ? 'مهندس سلامة' : 'Safety Engineer' },
        { value: 'quality_engineer', label: language === 'ar' ? 'مهندس جودة' : 'Quality Engineer' },
        { value: 'planning_engineer', label: language === 'ar' ? 'مهندس تخطيط' : 'Planning Engineer' },
        { value: 'design_engineer', label: language === 'ar' ? 'مهندس تصميم' : 'Design Engineer' },
        { value: 'maintenance_engineer', label: language === 'ar' ? 'مهندس صيانة' : 'Maintenance Engineer' },
        { value: 'technical_office_engineer', label: language === 'ar' ? 'مهندس مكتب فني' : 'Technical Office Engineer' },
        
        // Human Resources
        { value: 'hr_specialist', label: language === 'ar' ? 'أخصائي موارد بشرية' : 'HR Specialist' },
        { value: 'recruitment_specialist', label: language === 'ar' ? 'أخصائي توظيف' : 'Recruitment Specialist' },
        { value: 'training_specialist', label: language === 'ar' ? 'أخصائي تدريب' : 'Training Specialist' },
        { value: 'compensation_specialist', label: language === 'ar' ? 'أخصائي تعويضات' : 'Compensation Specialist' },
        { value: 'hr_coordinator', label: language === 'ar' ? 'منسق موارد بشرية' : 'HR Coordinator' },
        { value: 'payroll_specialist', label: language === 'ar' ? 'أخصائي رواتب' : 'Payroll Specialist' },
        { value: 'employee_relations_specialist', label: language === 'ar' ? 'أخصائي علاقات موظفين' : 'Employee Relations Specialist' },
        
        // Operations & Logistics
        { value: 'operations_specialist', label: language === 'ar' ? 'أخصائي عمليات' : 'Operations Specialist' },
        { value: 'logistics_specialist', label: language === 'ar' ? 'أخصائي لوجستيات' : 'Logistics Specialist' },
        { value: 'supply_chain_specialist', label: language === 'ar' ? 'أخصائي سلسلة توريد' : 'Supply Chain Specialist' },
        { value: 'procurement_specialist', label: language === 'ar' ? 'أخصائي مشتريات' : 'Procurement Specialist' },
        { value: 'warehouse_supervisor', label: language === 'ar' ? 'مشرف مستودع' : 'Warehouse Supervisor' },
        { value: 'inventory_specialist', label: language === 'ar' ? 'أخصائي مخزون' : 'Inventory Specialist' },
        { value: 'dispatcher', label: language === 'ar' ? 'منسق شحن' : 'Dispatcher' },
        
        // Administrative & Support
        { value: 'executive_assistant', label: language === 'ar' ? 'مساعد تنفيذي' : 'Executive Assistant' },
        { value: 'administrative_assistant', label: language === 'ar' ? 'مساعد إداري' : 'Administrative Assistant' },
        { value: 'secretary', label: language === 'ar' ? 'سكرتير' : 'Secretary' },
        { value: 'receptionist', label: language === 'ar' ? 'موظف استقبال' : 'Receptionist' },
        { value: 'office_coordinator', label: language === 'ar' ? 'منسق مكتب' : 'Office Coordinator' },
        { value: 'data_entry_clerk', label: language === 'ar' ? 'موظف إدخال بيانات' : 'Data Entry Clerk' },
        { value: 'filing_clerk', label: language === 'ar' ? 'موظف أرشيف' : 'Filing Clerk' },
        
        // Legal & Compliance
        { value: 'lawyer', label: language === 'ar' ? 'محامي' : 'Lawyer' },
        { value: 'legal_advisor', label: language === 'ar' ? 'مستشار قانوني' : 'Legal Advisor' },
        { value: 'legal_consultant', label: language === 'ar' ? 'استشاري قانوني' : 'Legal Consultant' },
        { value: 'compliance_officer', label: language === 'ar' ? 'مسؤول امتثال' : 'Compliance Officer' },
        { value: 'paralegal', label: language === 'ar' ? 'مساعد قانوني' : 'Paralegal' },
        { value: 'contracts_specialist', label: language === 'ar' ? 'أخصائي عقود' : 'Contracts Specialist' },
        
        // Education & Training
        { value: 'teacher', label: language === 'ar' ? 'مدرس' : 'Teacher' },
        { value: 'trainer', label: language === 'ar' ? 'مدرب' : 'Trainer' },
        { value: 'education_coordinator', label: language === 'ar' ? 'منسق تعليم' : 'Education Coordinator' },
        { value: 'curriculum_specialist', label: language === 'ar' ? 'أخصائي مناهج' : 'Curriculum Specialist' },
        { value: 'academic_advisor', label: language === 'ar' ? 'مستشار أكاديمي' : 'Academic Advisor' },
        
        // Technical & Skilled Workers
        { value: 'technician', label: language === 'ar' ? 'فني' : 'Technician' },
        { value: 'maintenance_technician', label: language === 'ar' ? 'فني صيانة' : 'Maintenance Technician' },
        { value: 'electrical_technician', label: language === 'ar' ? 'فني كهرباء' : 'Electrical Technician' },
        { value: 'mechanical_technician', label: language === 'ar' ? 'فني ميكانيكا' : 'Mechanical Technician' },
        { value: 'hvac_technician', label: language === 'ar' ? 'فني تكييف' : 'HVAC Technician' },
        { value: 'plumber', label: language === 'ar' ? 'سباك' : 'Plumber' },
        { value: 'electrician', label: language === 'ar' ? 'كهربائي' : 'Electrician' },
        { value: 'welder', label: language === 'ar' ? 'لحام' : 'Welder' },
        { value: 'carpenter', label: language === 'ar' ? 'نجار' : 'Carpenter' },
        { value: 'mason', label: language === 'ar' ? 'بناء' : 'Mason' },
        { value: 'painter', label: language === 'ar' ? 'دهان' : 'Painter' },
        
        // Entry Level & Fresh Graduates
        { value: 'trainee_engineer', label: language === 'ar' ? 'مهندس متدرب' : 'Trainee Engineer' },
        { value: 'junior_engineer', label: language === 'ar' ? 'مهندس مبتدئ' : 'Junior Engineer' },
        { value: 'graduate_trainee', label: language === 'ar' ? 'متدرب خريج' : 'Graduate Trainee' },
        { value: 'management_trainee', label: language === 'ar' ? 'متدرب إداري' : 'Management Trainee' },
        { value: 'junior_analyst', label: language === 'ar' ? 'محلل مبتدئ' : 'Junior Analyst' },
        { value: 'junior_accountant', label: language === 'ar' ? 'محاسب مبتدئ' : 'Junior Accountant' },
        { value: 'junior_developer', label: language === 'ar' ? 'مطور مبتدئ' : 'Junior Developer' },
        { value: 'intern', label: language === 'ar' ? 'متدرب' : 'Intern' },
        { value: 'fresh_graduate', label: language === 'ar' ? 'خريج جديد' : 'Fresh Graduate' },
        { value: 'assistant', label: language === 'ar' ? 'مساعد' : 'Assistant' },
        { value: 'coordinator', label: language === 'ar' ? 'منسق' : 'Coordinator' },
        
        // General & Other
        { value: 'consultant', label: language === 'ar' ? 'استشاري' : 'Consultant' },
        { value: 'advisor', label: language === 'ar' ? 'مستشار' : 'Advisor' },
        { value: 'specialist', label: language === 'ar' ? 'أخصائي' : 'Specialist' },
        { value: 'officer', label: language === 'ar' ? 'موظف' : 'Officer' },
        { value: 'representative', label: language === 'ar' ? 'ممثل' : 'Representative' },
        { value: 'agent', label: language === 'ar' ? 'وكيل' : 'Agent' },
        { value: 'operator', label: language === 'ar' ? 'مشغل' : 'Operator' },
        { value: 'driver', label: language === 'ar' ? 'سائق' : 'Driver' },
        { value: 'security_guard', label: language === 'ar' ? 'حارس أمن' : 'Security Guard' },
        { value: 'cleaner', label: language === 'ar' ? 'عامل نظافة' : 'Cleaner' },
        { value: 'laborer', label: language === 'ar' ? 'عامل' : 'Laborer' },
        { value: 'helper', label: language === 'ar' ? 'مساعد عامل' : 'Helper' }
      ]
    },
    {
      name: 'actual_job_title',
      label: 'Actual Job Title',
      arabicLabel: 'المسمى الوظيفي الفعلي',
      type: 'text' as const
    },
    {
      name: 'actual_job_title_ar',
      label: 'Actual Job Title (Arabic)',
      arabicLabel: 'المسمى الوظيفي الفعلي (عربي)',
      type: 'text' as const
    },
    {
      name: 'iqama_title',
      label: 'Iqama Title',
      arabicLabel: 'المسمى في الإقامة',
      type: 'text' as const
    },
    {
      name: 'iqama_title_ar',
      label: 'Iqama Title (Arabic)',
      arabicLabel: 'المسمى في الإقامة (عربي)',
      type: 'text' as const
    },
    {
      name: 'job_location',
      label: 'Job Location',
      arabicLabel: 'مكان العمل',
      type: 'text' as const
    },
    {
      name: 'position_hired_for',
      label: 'Position Hired For',
      arabicLabel: 'المنصب المعين له',
      type: 'text' as const
    },
    {
      name: 'project_hired_for',
      label: 'Project Hired For',
      arabicLabel: 'المشروع المعين له',
      type: 'text' as const
    },
    {
      name: 'hired_request_number',
      label: 'Hired Request Number',
      arabicLabel: 'رقم طلب التوظيف',
      type: 'text' as const
    },

    // Recruitment Information
    {
      name: 'recruitment_type',
      label: 'Recruitment Type',
      arabicLabel: 'نوع التوظيف',
      type: 'select' as const,
      options: [
        { value: 'saudi_national', label: language === 'ar' ? 'سعودي الجنسية' : 'Saudi National' },
        { value: 'local', label: language === 'ar' ? 'محلي' : 'Local' },
        { value: 'international', label: language === 'ar' ? 'دولي' : 'International' }
      ]
    },

    // Family Information
    {
      name: 'family_status',
      label: 'Family Status',
      arabicLabel: 'الحالة العائلية',
      type: 'select' as const,
      options: [
        { value: 'family', label: language === 'ar' ? 'عائلي' : 'Family' },
        { value: 'non_family', label: language === 'ar' ? 'غير عائلي' : 'Non-Family' }
      ]
    },
    {
      name: 'number_of_wives',
      label: 'Number of Wives',
      arabicLabel: 'عدد الزوجات',
      type: 'number' as const,
      validation: {
        min: 0,
        max: 4
      }
    },
    {
      name: 'number_of_children',
      label: 'Number of Children',
      arabicLabel: 'عدد الأطفال',
      type: 'number' as const,
      validation: {
        min: 0
      }
    },

    // Salary and Benefits
    {
      name: 'basic_salary',
      label: 'Basic Salary (SAR)',
      arabicLabel: 'الراتب الأساسي (ريال سعودي)',
      type: 'number' as const,
      validation: {
        min: 3000
      }
    },
    {
      name: 'housing_allowance_percentage',
      label: 'Housing Allowance (%)',
      arabicLabel: 'بدل السكن (%)',
      type: 'number' as const,
      validation: {
        min: 0,
        max: 100
      }
    },
    {
      name: 'company_provides_transportation',
      label: 'Company Provides Transportation',
      arabicLabel: 'الشركة توفر المواصلات',
      type: 'checkbox' as const
    },
    {
      name: 'transportation_allowance_percentage',
      label: 'Transportation Allowance (%)',
      arabicLabel: 'بدل المواصلات (%)',
      type: 'number' as const,
      validation: {
        min: 0,
        max: 100
      }
    },
    {
      name: 'agreed_annual_bonus',
      label: 'Agreed Annual Bonus (SAR)',
      arabicLabel: 'المكافأة السنوية المتفق عليها (ريال)',
      type: 'number' as const,
      validation: {
        min: 0
      }
    },
    {
      name: 'other_benefits',
      label: 'Other Benefits',
      arabicLabel: 'مزايا أخرى',
      type: 'textarea' as const
    },

    // Annual Benefits
    {
      name: 'annual_tickets_type',
      label: 'Annual Tickets Type',
      arabicLabel: 'نوع التذاكر السنوية',
      type: 'select' as const,
      options: [
        { value: 'single', label: language === 'ar' ? 'فردي' : 'Single' },
        { value: 'family', label: language === 'ar' ? 'عائلي' : 'Family' }
      ]
    },
    {
      name: 'annual_tickets_count',
      label: 'Annual Tickets Count',
      arabicLabel: 'عدد التذاكر السنوية',
      type: 'number' as const,
      validation: {
        min: 0,
        max: 10
      }
    },

    // Company Benefits
    {
      name: 'company_sim_card',
      label: 'Company SIM Card',
      arabicLabel: 'شريحة الشركة',
      type: 'checkbox' as const
    },
    {
      name: 'schooling_fees_coverage',
      label: 'Schooling Fees Coverage',
      arabicLabel: 'تغطية رسوم المدارس',
      type: 'select' as const,
      options: [
        { value: 'none', label: language === 'ar' ? 'لا يوجد' : 'None' },
        { value: 'one_child', label: language === 'ar' ? 'طفل واحد' : 'One Child' },
        { value: 'two_children', label: language === 'ar' ? 'طفلان' : 'Two Children' },
        { value: 'all_children', label: language === 'ar' ? 'جميع الأطفال' : 'All Children' }
      ]
    },
    {
      name: 'parents_medical_insurance',
      label: 'Parents Medical Insurance',
      arabicLabel: 'التأمين الطبي للوالدين',
      type: 'checkbox' as const
    },

    // Additional comprehensive fields
    {
      name: 'line_manager_extension',
      label: 'Line Manager Extension Number',
      arabicLabel: 'رقم تحويل المدير المباشر',
      type: 'text' as const
    },
    {
      name: 'vacation_days_per_year',
      label: 'Vacation Days Per Year',
      arabicLabel: 'أيام الإجازة السنوية',
      type: 'number' as const,
      validation: {
        min: 21,
        max: 30
      }
    },
    {
      name: 'company_phone',
      label: 'Company Phone Number',
      arabicLabel: 'رقم هاتف الشركة',
      type: 'text' as const,
      validation: {
        pattern: /^[\+]?[1-9][\d]{0,15}$/,
        message: language === 'ar' ? 'رقم هاتف غير صحيح' : 'Invalid phone number'
      }
    },
    {
      name: 'iban_number',
      label: 'IBAN Number',
      arabicLabel: 'رقم الآيبان',
      type: 'text' as const,
      validation: {
        pattern: /^SA\d{22}$/,
        message: language === 'ar' ? 'رقم آيبان غير صحيح (يجب أن يبدأ بـ SA ويحتوي على 24 رقم)' : 'Invalid IBAN (must start with SA and contain 24 digits)'
      }
    },
    {
      name: 'emergency_contact_name',
      label: 'Emergency Contact Name',
      arabicLabel: 'اسم جهة الاتصال في الطوارئ',
      type: 'text' as const
    },
    {
      name: 'emergency_contact_number',
      label: 'Emergency Contact Number',
      arabicLabel: 'رقم جهة الاتصال في الطوارئ',
      type: 'text' as const,
      validation: {
        pattern: /^[\+]?[1-9][\d]{0,15}$/,
        message: language === 'ar' ? 'رقم هاتف غير صحيح' : 'Invalid phone number'
      }
    },
    {
      name: 'life_insurance_home_country',
      label: 'Life Insurance',
      arabicLabel: 'التأمين على الحياة',
      type: 'checkbox' as const
    },
    {
      name: 'visa_number',
      label: 'Visa Number (International Employees)',
      arabicLabel: 'رقم التأشيرة (للموظفين الدوليين)',
      type: 'text' as const
    },
    {
      name: 'job_description',
      label: 'Job Description',
      arabicLabel: 'الوصف الوظيفي',
      type: 'textarea' as const
    },
    {
      name: 'job_description_ar',
      label: 'Job Description (Arabic)',
      arabicLabel: 'الوصف الوظيفي (عربي)',
      type: 'textarea' as const
    },
    {
      name: 'kpis',
      label: 'Key Performance Indicators (KPIs)',
      arabicLabel: 'مؤشرات الأداء الرئيسية',
      type: 'textarea' as const
    },
    {
      name: 'kpis_ar',
      label: 'KPIs',
      arabicLabel: 'مؤشرات الأداء الرئيسية (عربي)',
      type: 'textarea' as const
    },
    {
      name: 'work_location',
      label: 'Work Location',
      arabicLabel: 'موقع العمل',
      type: 'text' as const
    },
    {
      name: 'work_location_ar',
      label: 'Work Location',
      arabicLabel: 'موقع العمل (عربي)',
      type: 'text' as const
    },
    {
      name: 'project_name',
      label: 'Project Name',
      arabicLabel: 'اسم المشروع',
      type: 'text' as const
    },
    {
      name: 'project_name_ar',
      label: 'Project Name',
      arabicLabel: 'اسم المشروع (عربي)',
      type: 'text' as const
    },
    {
      name: 'project_number',
      label: 'Project Number',
      arabicLabel: 'رقم المشروع',
      type: 'text' as const
    },
    {
      name: 'project_cost_number',
      label: 'Project Cost Number',
      arabicLabel: 'رقم تكلفة المشروع',
      type: 'text' as const
    },
    {
      name: 'overtime_eligible',
      label: 'Overtime Eligible',
      arabicLabel: 'مؤهل للعمل الإضافي',
      type: 'checkbox' as const
    },
    {
      name: 'joining_date',
      label: 'Joining Date',
      arabicLabel: 'تاريخ الانضمام',
      type: 'date' as const
    },
    {
      name: 'contract_type',
      label: 'Contract Type (HRSD Approved)',
      arabicLabel: 'نوع العقد (معتمد من وزارة الموارد البشرية)',
      type: 'select' as const,
      options: [
        { value: 'permanent', label: language === 'ar' ? 'دائم' : 'Permanent' },
        { value: 'temporary', label: language === 'ar' ? 'مؤقت' : 'Temporary' },
        { value: 'contract', label: language === 'ar' ? 'عقد محدد المدة' : 'Fixed-term Contract' },
        { value: 'part_time', label: language === 'ar' ? 'دوام جزئي' : 'Part-time' },
        { value: 'seasonal', label: language === 'ar' ? 'موسمي' : 'Seasonal' }
      ]
    },
    {
      name: 'shift_type',
      label: 'Shift Type',
      arabicLabel: 'نوع الوردية',
      type: 'select' as const,
      options: [
        { value: 'day', label: language === 'ar' ? 'نهاري' : 'Day Shift' },
        { value: 'night', label: language === 'ar' ? 'ليلي' : 'Night Shift' }
      ]
    },
    {
      name: 'company_housing',
      label: 'Company Provides Housing',
      arabicLabel: 'الشركة توفر السكن',
      type: 'checkbox' as const
    },
    {
      name: 'education_level',
      label: 'Level of Education',
      arabicLabel: 'المستوى التعليمي',
      type: 'select' as const,
      options: [
        { value: 'high_school', label: language === 'ar' ? 'ثانوية عامة' : 'High School' },
        { value: 'diploma', label: language === 'ar' ? 'دبلوم' : 'Diploma' },
        { value: 'bachelor', label: language === 'ar' ? 'بكالوريوس' : 'Bachelor\'s Degree' },
        { value: 'master', label: language === 'ar' ? 'ماجستير' : 'Master\'s Degree' },
        { value: 'phd', label: language === 'ar' ? 'دكتوراه' : 'PhD' }
      ]
    },
    {
      name: 'certificates',
      label: 'Certificates',
      arabicLabel: 'الشهادات',
      type: 'textarea' as const
    },
    {
      name: 'certificates_ar',
      label: 'Certificates (Arabic)',
      arabicLabel: 'الشهادات (عربي)',
      type: 'textarea' as const
    },
    {
      name: 'experience_years',
      label: 'Experience in Years',
      arabicLabel: 'سنوات الخبرة',
      type: 'number' as const,
      validation: {
        min: 0,
        max: 50
      }
    },
    {
      name: 'grade_level',
      label: 'Grade Level',
      arabicLabel: 'مستوى الدرجة',
      type: 'text' as const
    },
    {
      name: 'driver_license_number',
      label: 'Driver License Number',
      arabicLabel: 'رقم رخصة القيادة',
      type: 'text' as const
    },
    {
      name: 'company_job_title',
      label: 'Company Job Title',
      arabicLabel: 'المسمى الوظيفي في الشركة',
      type: 'text' as const
    },
    {
      name: 'company_job_title_ar',
      label: 'Company Job Title',
      arabicLabel: 'المسمى الوظيفي في الشركة (عربي)',
      type: 'text' as const
    },
    {
      name: 'job_level',
      label: 'Job Level',
      arabicLabel: 'مستوى الوظيفة',
      type: 'select' as const,
      options: [
        { value: 'junior', label: language === 'ar' ? 'مبتدئ' : 'Junior' },
        { value: 'senior', label: language === 'ar' ? 'أول' : 'Senior' },
        { value: 'manager', label: language === 'ar' ? 'مدير' : 'Manager' },
        { value: 'director', label: language === 'ar' ? 'مدير عام' : 'Director' },
        { value: 'cxo', label: language === 'ar' ? 'مستوى تنفيذي' : 'CxO Level' }
      ]
    },
    {
      name: 'salary_level',
      label: 'Salary Level',
      arabicLabel: 'مستوى الراتب',
      type: 'text' as const
    },
    {
      name: 'gosi_cost_per_month',
      label: 'GOSI Cost Per Month (SAR)',
      arabicLabel: 'تكلفة التأمينات الاجتماعية شهرياً (ريال)',
      type: 'number' as const,
      validation: {
        min: 0
      }
    },
    {
      name: 'passport_expiry_date',
      label: 'Passport Expiry Date',
      arabicLabel: 'تاريخ انتهاء جواز السفر',
      type: 'date' as const
    },
    {
      name: 'qiwa_contract',
      label: 'Qiwa Contract',
      arabicLabel: 'عقد قوى',
      type: 'checkbox' as const
    },
    {
      name: 'saudi_engineer_card_number',
      label: 'Saudi Engineer Card Number',
      arabicLabel: 'رقم بطاقة المهندس السعودي',
      type: 'text' as const
    },
    {
      name: 'medical_conditions',
      label: 'Medical Conditions',
      arabicLabel: 'الحالات الطبية',
      type: 'textarea' as const
    },
    {
      name: 'medical_conditions_ar',
      label: 'Medical Conditions (Arabic)',
      arabicLabel: 'الحالات الطبية (عربي)',
      type: 'textarea' as const
    }
  ];

  const documents = [
    {
      name: language === 'ar' ? 'كشف_بيانات_الموظفين_ديسمبر_2024.xlsx' : 'employee_data_export_december_2024.xlsx',
      type: language === 'ar' ? 'جدول بيانات' : 'Spreadsheet',
      date: '2024-12-30',
      size: '2.4 MB'
    },
    {
      name: language === 'ar' ? 'تقرير_البيانات_الناقصة.pdf' : 'incomplete_data_report.pdf',
      type: language === 'ar' ? 'تقرير' : 'Report',
      date: '2024-12-28',
      size: '890 KB'
    },
    {
      name: language === 'ar' ? 'قالب_بيانات_الموظف_الجديد.docx' : 'new_employee_data_template.docx',
      type: language === 'ar' ? 'قالب' : 'Template',
      date: '2024-12-20',
      size: '245 KB'
    }
  ];

  const tabs = [
    {
      id: 'overview',
      label: language === 'ar' ? 'نظرة عامة' : 'Overview',
      content: (
        <div className="space-y-6">
          {/* Employee Directory */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{language === 'ar' ? 'دليل الموظفين' : 'Employee Directory'}</CardTitle>
                  <CardDescription>
                    {language === 'ar' ? 'البحث والإطلاع على بيانات الموظفين' : 'Search and view employee information'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                    <span className="ml-2">{language === 'ar' ? 'فلترة' : 'Filter'}</span>
                  </Button>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4" />
                    <span className="ml-2">{language === 'ar' ? 'إضافة موظف' : 'Add Employee'}</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder={language === 'ar' ? 'البحث في بيانات الموظفين...' : 'Search employee data...'}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <Button>
                    <Search className="h-4 w-4" />
                    <span className="ml-2">{language === 'ar' ? 'بحث' : 'Search'}</span>
                  </Button>
                </div>
                
                {/* Sample Employee Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {language === 'ar' ? `موظف نموذجي ${i}` : `Sample Employee ${i}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {language === 'ar' ? 'قسم تكنولوجيا المعلومات' : 'IT Department'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'add-employee',
      label: language === 'ar' ? 'إضافة موظف' : 'Add Employee',
      content: (
        <EnhancedFormSystem
          title={language === 'ar' ? 'إضافة موظف جديد' : 'Add New Employee'}
          description={language === 'ar' ? 'أدخل بيانات الموظف الجديد' : 'Enter new employee information'}
          fields={employeeFormFields}
          onSubmit={(data) => console.log('Employee data:', data)}
          showProgress={true}
          allowFileUpload={true}
          submitText={language === 'ar' ? 'إضافة الموظف' : 'Add Employee'}
        />
      )
    },
    {
      id: 'reports',
      label: language === 'ar' ? 'التقارير' : 'Reports',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'تقارير البيانات' : 'Data Reports'}</CardTitle>
              <CardDescription>
                {language === 'ar' ? 'إنشاء وتصدير تقارير بيانات الموظفين' : 'Generate and export employee data reports'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col gap-2">
                  <FileCheck className="h-6 w-6" />
                  <span>{language === 'ar' ? 'تقرير شامل' : 'Complete Report'}</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>{language === 'ar' ? 'تقرير شهري' : 'Monthly Report'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <EnhancedPageLayout
      title={language === 'ar' ? 'البيانات الأساسية للموظفين' : 'Employee Master Data'}
      description={language === 'ar' ? 'إدارة شاملة لمعلومات الموظفين' : 'Complete employee information management'}
      showUserInfo={true}
      showQuickActions={true}
      showTabs={true}
      stats={stats}
      quickActions={quickActions}
      documents={documents}
      tabs={tabs}
    />
  );
};

export default EmployeeMasterData;