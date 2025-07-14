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
        { value: 'hr', label: language === 'ar' ? 'الموارد البشرية' : 'Human Resources' },
        { value: 'it', label: language === 'ar' ? 'تكنولوجيا المعلومات' : 'Information Technology' },
        { value: 'finance', label: language === 'ar' ? 'المالية' : 'Finance' },
        { value: 'marketing', label: language === 'ar' ? 'التسويق' : 'Marketing' }
      ]
    },
    {
      name: 'position',
      label: 'Position',
      arabicLabel: 'المنصب',
      type: 'text' as const,
      required: true
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