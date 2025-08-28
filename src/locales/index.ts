// Basic translations structure for the new localization system
export const translations = {
  en: {
    common: {
      loading: 'Loading...',
      select: 'Select...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      import: 'Import',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      yes: 'Yes',
      no: 'No'
    },
    navigation: {
      dashboard: 'Dashboard',
      employees: 'Employees',
      policies: 'Policies',
      benchmarking: 'Salary Benchmarking',
      vision2030: 'Vision 2030',
      compliance: 'Compliance',
      reports: 'Reports',
      settings: 'Settings'
    },
    policy: {
      upload: {
        title: 'Upload HR Policy Document',
        description: 'Upload and analyze HR policies with AI-powered compliance checking',
        dragDrop: 'Drag and drop your document here or click to browse',
        dropHere: 'Drop your document here',
        browseFiles: 'Browse Files',
        supportedFormats: 'Supported formats: PDF, DOCX, DOC, TXT (Max 10MB)',
        uploading: 'Uploading document...',
        analyzing: 'Analyzing with AI...',
        success: 'Document uploaded and analyzed successfully!',
        aiAnalysis: {
          title: 'AI-Powered Policy Analysis',
          compliance: 'Saudi Labor Law Compliance',
          complianceDesc: 'Comprehensive compliance assessment against Saudi Labor Law',
          gaps: 'Gap Analysis',
          gapsDesc: 'Gap analysis with specific improvement recommendations',
          recommendations: 'AI Recommendations',
          recommendationsDesc: 'Actionable recommendations with implementation timelines',
          riskAssessment: 'Risk Assessment',
          riskAssessmentDesc: 'Risk assessment and mitigation strategies'
        }
      },
      dashboard: {
        title: 'Policy Review Dashboard',
        description: 'Manage and analyze HR policies with AI-powered insights'
      },
      overview: {
        title: 'Policy Overview',
        description: 'Review all uploaded policies and their compliance status'
      },
      metrics: {
        totalPolicies: 'Total Policies',
        avgCompliance: 'Average Compliance',
        highRisk: 'High Risk Policies',
        pending: 'Pending Reviews'
      },
      tabs: {
        upload: 'Upload Policy',
        overview: 'Overview',
        compliance: 'Compliance'
      },
      status: {
        pending: 'Pending',
        analyzing: 'Analyzing',
        completed: 'Completed',
        failed: 'Failed',
        compliant: 'Compliant',
        partial: 'Partially Compliant'
      },
      risk: {
        low: 'Low Risk',
        medium: 'Medium Risk',
        high: 'High Risk',
        critical: 'Critical Risk'
      },
      compliance: {
        saudiLaborLaw: 'Saudi Labor Law Compliance',
        description: 'Detailed compliance analysis for each category',
        workingHours: 'Working Hours',
        wages: 'Wages & Salaries',
        leaves: 'Leave Policies',
        termination: 'Termination Procedures',
        discrimination: 'Anti-Discrimination',
        safety: 'Health & Safety',
        saudization: 'Saudization'
      },
      uploadedOn: 'Uploaded on',
      complianceScore: 'Compliance',
      noPolicies: 'No policies uploaded yet',
      uploadFirst: 'Upload your first policy'
    },
    journey: {
      dashboard: {
        title: 'Employee Journey Dashboard',
        description: 'Track and optimize employee lifecycle journeys with AI-powered insights'
      },
      metrics: {
        activeJourneys: 'Active Journeys',
        avgProgress: 'Average Progress',
        onboarding: 'In Onboarding',
        cultural: 'Cultural Integration'
      },
      tabs: {
        overview: 'Overview',
        tasks: 'Tasks',
        cultural: 'Cultural Integration',
        insights: 'AI Insights'
      },
      status: {
        pending: 'Pending',
        inProgress: 'In Progress',
        completed: 'Completed',
        overdue: 'Overdue'
      },
      overview: {
        activeJourneys: 'Active Employee Journeys'
      },
      details: {
        title: 'Journey Details',
        currentStage: 'Current Stage',
        stageProgress: 'Stage Progress',
        culturalIntegration: 'Cultural Integration Status'
      },
      cultural: {
        orientation: 'Culture Orientation',
        completed: 'Completed',
        pending: 'Pending',
        buddy: 'Buddy System',
        orientationModules: 'Cultural Orientation Modules',
        buddySystem: 'Buddy System',
        recentMeetings: 'Recent Meetings',
        minutes: 'minutes',
        topics: 'Topics'
      },
      tasks: {
        title: 'Current Tasks',
        description: 'Active tasks for the current lifecycle stage',
        due: 'Due',
        priority: 'Priority',
        complete: 'Mark Complete'
      },
      insights: {
        title: 'AI Journey Insights',
        description: 'AI-powered recommendations and predictions for employee success',
        confidence: 'Confidence',
        impact: 'Impact',
        model: 'AI Model',
        actions: 'Recommended Actions'
      },
      currentStage: 'Current Stage',
      progress: 'Progress'
    },
    salary: {
      benchmarking: {
        title: 'Salary Benchmarking Engine',
        description: 'AI-powered salary analysis with HRSD integration and market intelligence',
        criteria: 'Benchmarking Criteria',
        position: 'Position',
        companySize: 'Company Size',
        region: 'Region',
        generate: 'Generate Benchmark',
        salaryRange: 'Salary Range Analysis',
        marketPosition: 'Market Position',
        median: 'Market Median',
        percentile: 'Percentile',
        noData: 'Select criteria to generate salary benchmark analysis'
      }
    }
  },
  ar: {
    common: {
      loading: 'جاري التحميل...',
      select: 'اختر...',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      view: 'عرض',
      search: 'بحث',
      filter: 'تصفية',
      export: 'تصدير',
      import: 'استيراد',
      next: 'التالي',
      previous: 'السابق',
      close: 'إغلاق',
      yes: 'نعم',
      no: 'لا'
    },
    navigation: {
      dashboard: 'لوحة التحكم',
      employees: 'الموظفون',
      policies: 'السياسات',
      benchmarking: 'مقارنة الرواتب',
      vision2030: 'رؤية 2030',
      compliance: 'الامتثال',
      reports: 'التقارير',
      settings: 'الإعدادات'
    },
    policy: {
      upload: {
        title: 'رفع وثيقة سياسة الموارد البشرية',
        description: 'رفع وتحليل سياسات الموارد البشرية مع فحص الامتثال بالذكاء الاصطناعي',
        dragDrop: 'اسحب وأفلت وثيقتك هنا أو انقر للتصفح',
        dropHere: 'أفلت وثيقتك هنا',
        browseFiles: 'تصفح الملفات',
        supportedFormats: 'الصيغ المدعومة: PDF, DOCX, DOC, TXT (حد أقصى 10 ميجابايت)',
        uploading: 'جاري رفع الوثيقة...',
        analyzing: 'جاري التحليل بالذكاء الاصطناعي...',
        success: 'تم رفع الوثيقة وتحليلها بنجاح!',
        aiAnalysis: {
          title: 'تحليل السياسات بالذكاء الاصطناعي',
          compliance: 'امتثال قانون العمل السعودي',
          complianceDesc: 'تقييم شامل للامتثال مع قانون العمل السعودي',
          gaps: 'تحليل الثغرات',
          gapsDesc: 'تحليل الثغرات مع توصيات محددة للتحسين',
          recommendations: 'توصيات الذكاء الاصطناعي',
          recommendationsDesc: 'توصيات قابلة للتنفيذ مع جداول زمنية للتطبيق',
          riskAssessment: 'تقييم المخاطر',
          riskAssessmentDesc: 'تقييم المخاطر واستراتيجيات التخفيف'
        }
      },
      dashboard: {
        title: 'لوحة تحكم مراجعة السياسات',
        description: 'إدارة وتحليل سياسات الموارد البشرية برؤى الذكاء الاصطناعي'
      },
      overview: {
        title: 'نظرة عامة على السياسات',
        description: 'مراجعة جميع السياسات المرفوعة وحالة امتثالها'
      },
      metrics: {
        totalPolicies: 'إجمالي السياسات',
        avgCompliance: 'متوسط الامتثال',
        highRisk: 'سياسات عالية المخاطر',
        pending: 'المراجعات المعلقة'
      },
      tabs: {
        upload: 'رفع السياسة',
        overview: 'نظرة عامة',
        compliance: 'الامتثال'
      },
      status: {
        pending: 'معلق',
        analyzing: 'جاري التحليل',
        completed: 'مكتمل',
        failed: 'فشل',
        compliant: 'متوافق',
        partial: 'متوافق جزئياً'
      },
      risk: {
        low: 'مخاطر منخفضة',
        medium: 'مخاطر متوسطة',
        high: 'مخاطر عالية',
        critical: 'مخاطر حرجة'
      },
      compliance: {
        saudiLaborLaw: 'امتثال قانون العمل السعودي',
        description: 'تحليل مفصل للامتثال لكل فئة',
        workingHours: 'ساعات العمل',
        wages: 'الأجور والرواتب',
        leaves: 'سياسات الإجازات',
        termination: 'إجراءات الفصل',
        discrimination: 'مكافحة التمييز',
        safety: 'الصحة والسلامة',
        saudization: 'السعودة'
      },
      uploadedOn: 'تم الرفع في',
      complianceScore: 'الامتثال',
      noPolicies: 'لم يتم رفع سياسات بعد',
      uploadFirst: 'ارفع سياستك الأولى'
    },
    journey: {
      dashboard: {
        title: 'لوحة تحكم رحلة الموظف',
        description: 'تتبع وتحسين رحلات دورة حياة الموظف برؤى الذكاء الاصطناعي'
      },
      metrics: {
        activeJourneys: 'الرحلات النشطة',
        avgProgress: 'متوسط التقدم',
        onboarding: 'في التأهيل',
        cultural: 'التكامل الثقافي'
      },
      tabs: {
        overview: 'نظرة عامة',
        tasks: 'المهام',
        cultural: 'التكامل الثقافي',
        insights: 'رؤى الذكاء الاصطناعي'
      },
      status: {
        pending: 'معلق',
        inProgress: 'قيد التنفيذ',
        completed: 'مكتمل',
        overdue: 'متأخر'
      },
      overview: {
        activeJourneys: 'رحلات الموظفين النشطة'
      },
      details: {
        title: 'تفاصيل الرحلة',
        currentStage: 'المرحلة الحالية',
        stageProgress: 'تقدم المرحلة',
        culturalIntegration: 'حالة التكامل الثقافي'
      },
      cultural: {
        orientation: 'التوجيه الثقافي',
        completed: 'مكتمل',
        pending: 'معلق',
        buddy: 'نظام الصديق',
        orientationModules: 'وحدات التوجيه الثقافي',
        buddySystem: 'نظام الصديق',
        recentMeetings: 'الاجتماعات الأخيرة',
        minutes: 'دقائق',
        topics: 'المواضيع'
      },
      tasks: {
        title: 'المهام الحالية',
        description: 'المهام النشطة لمرحلة دورة الحياة الحالية',
        due: 'الاستحقاق',
        priority: 'الأولوية',
        complete: 'تم الإكمال'
      },
      insights: {
        title: 'رؤى رحلة الذكاء الاصطناعي',
        description: 'توصيات وتوقعات مدعومة بالذكاء الاصطناعي لنجاح الموظف',
        confidence: 'الثقة',
        impact: 'التأثير',
        model: 'نموذج الذكاء الاصطناعي',
        actions: 'الإجراءات الموصى بها'
      },
      currentStage: 'المرحلة الحالية',
      progress: 'التقدم'
    },
    salary: {
      benchmarking: {
        title: 'محرك مقارنة الرواتب',
        description: 'تحليل الرواتب بالذكاء الاصطناعي مع تكامل وزارة الموارد البشرية وذكاء السوق',
        criteria: 'معايير المقارنة',
        position: 'المنصب',
        companySize: 'حجم الشركة',
        region: 'المنطقة',
        generate: 'إنشاء المقارنة',
        salaryRange: 'تحليل نطاق الراتب',
        marketPosition: 'موقف السوق',
        median: 'متوسط السوق',
        percentile: 'النسبة المئوية',
        noData: 'اختر المعايير لإنشاء تحليل مقارنة الرواتب'
      }
    }
  }
};