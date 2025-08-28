export const government = {
  en: {
    hub: {
      title: 'Government Integration Hub',
      subtitle: 'Seamless integration with Saudi government platforms',
      description: 'Centralized access to QIWA, GOSI, Absher, and other government services for comprehensive HR compliance and workforce management.',
      selectPlatform: 'Select a government platform to get started',
      recentActivity: 'Recent Integration Activity',
      noActivity: 'No recent integration activity',
      integrationStatus: 'Integration Status',
      connected: 'Connected',
      disconnected: 'Disconnected',
      syncing: 'Syncing...',
      lastSync: 'Last synced',
      syncNow: 'Sync Now',
      configure: 'Configure Integration'
    },
    qiwa: {
      title: 'QIWA Platform',
      subtitle: 'Ministry of Human Resources and Social Development',
      description: 'Manage work permits, visa applications, and workforce compliance through the official QIWA platform.',
      features: {
        title: 'Available Services',
        workPermits: 'Work Permit Applications',
        visaApplications: 'Visa Applications & Renewals',
        employeeTransfer: 'Employee Transfer Services',
        complianceReports: 'Compliance Reports',
        laborContracts: 'Labor Contract Management',
        wageProtection: 'Wage Protection System',
        saudization: 'Saudization Compliance',
        documentVerification: 'Document Verification'
      },
      actions: {
        newApplication: 'New Application',
        checkStatus: 'Check Application Status',
        downloadCertificate: 'Download Certificate',
        submitReport: 'Submit Compliance Report',
        updateInfo: 'Update Employee Information',
        uploadDocuments: 'Upload Required Documents',
        payFees: 'Pay Government Fees',
        requestSupport: 'Request Support'
      },
      status: {
        submitted: 'Application Submitted',
        underReview: 'Under Review',
        approved: 'Approved',
        rejected: 'Rejected',
        pending: 'Pending Documents',
        completed: 'Completed',
        expired: 'Expired',
        cancelled: 'Cancelled'
      }
    },
    gosi: {
      title: 'GOSI Platform',
      subtitle: 'General Organization for Social Insurance',
      description: 'Manage social insurance registrations, contributions, and benefit claims for your employees.',
      features: {
        title: 'Available Services',
        employeeRegistration: 'Employee Registration',
        contributionPayments: 'Contribution Payments',
        benefitClaims: 'Benefit Claims Processing',
        annualReports: 'Annual Reports Submission',
        salaryUpdates: 'Salary Updates & Adjustments',
        certificateRequests: 'GOSI Certificate Requests',
        complianceChecks: 'Compliance Verification',
        pensionCalculation: 'Pension Calculations'
      },
      actions: {
        registerEmployee: 'Register New Employee',
        payContributions: 'Pay Monthly Contributions',
        submitClaim: 'Submit Benefit Claim',
        updateSalaries: 'Update Employee Salaries',
        generateCertificate: 'Generate GOSI Certificate',
        downloadStatement: 'Download Contribution Statement',
        viewPensions: 'View Pension Details',
        contactSupport: 'Contact GOSI Support'
      },
      contributions: {
        title: 'Contribution Management',
        monthly: 'Monthly Contributions',
        due: 'Due Amount',
        paid: 'Paid This Month',
        overdue: 'Overdue Payments',
        nextDue: 'Next Payment Due',
        paymentHistory: 'Payment History',
        calculateContributions: 'Calculate Contributions'
      }
    },
    absher: {
      title: 'Absher Platform',
      subtitle: 'Ministry of Interior - Digital Government Services',
      description: 'Access essential government services including Iqama renewals, exit/re-entry permits, and identity verification.',
      features: {
        title: 'Available Services',
        iqamaRenewal: 'Iqama Renewal Services',
        exitReentry: 'Exit Re-entry Permits',
        identityVerification: 'Identity Verification',
        dependentServices: 'Dependent Services',
        addressUpdate: 'Address Update Services',
        certificateRequests: 'Official Certificate Requests',
        travelPermissions: 'Travel Permission Services',
        familyVisits: 'Family Visit Visa Services'
      },
      actions: {
        renewIqama: 'Renew Iqama',
        applyExitReentry: 'Apply for Exit Re-entry',
        verifyIdentity: 'Verify Employee Identity',
        updateAddress: 'Update Address Information',
        requestCertificate: 'Request Official Certificate',
        checkApplication: 'Check Application Status',
        downloadDocument: 'Download Document',
        scheduleAppointment: 'Schedule Appointment'
      },
      documents: {
        title: 'Document Management',
        iqama: 'Iqama (Residence Permit)',
        passport: 'Passport Copy',
        contract: 'Employment Contract',
        salaryCard: 'Salary Certificate',
        medicalInsurance: 'Medical Insurance',
        bankStatement: 'Bank Statement',
        familyCertificate: 'Family Certificate',
        birthCertificate: 'Birth Certificate'
      }
    },
    common: {
      loading: 'Loading platform data...',
      error: 'Failed to load platform information',
      retry: 'Retry',
      refresh: 'Refresh Data',
      configure: 'Configure',
      connect: 'Connect Platform',
      disconnect: 'Disconnect',
      settings: 'Platform Settings',
      help: 'Help & Support',
      documentation: 'View Documentation',
      contactSupport: 'Contact Support',
      apiStatus: 'API Status',
      connectionTest: 'Test Connection',
      credentials: 'API Credentials',
      permissions: 'Required Permissions',
      dataSync: 'Data Synchronization',
      compliance: 'Compliance Status',
      notifications: 'Platform Notifications',
      alerts: 'System Alerts'
    },
    documents: {
      title: 'Government Documents',
      upload: 'Upload Document',
      required: 'Required Documents',
      optional: 'Optional Documents',
      pending: 'Pending Review',
      approved: 'Approved',
      rejected: 'Rejected - Requires Attention',
      expired: 'Expired - Renewal Required',
      expiringSoon: 'Expiring within 30 days',
      category: 'Document Category',
      type: 'Document Type',
      issueDate: 'Issue Date',
      expiryDate: 'Expiry Date',
      reference: 'Reference Number',
      downloadOriginal: 'Download Original',
      viewPreview: 'View Preview',
      submitForReview: 'Submit for Review',
      requestRenewal: 'Request Renewal'
    }
  },
  ar: {
    hub: {
      title: 'مركز التكامل الحكومي',
      subtitle: 'تكامل سلس مع المنصات الحكومية السعودية',
      description: 'وصول موحد لمنصات قوى وجوسي وأبشر وغيرها من الخدمات الحكومية لإدارة شاملة للموارد البشرية والامتثال.',
      selectPlatform: 'اختر منصة حكومية للبدء',
      recentActivity: 'نشاط التكامل الحديث',
      noActivity: 'لا يوجد نشاط تكامل حديث',
      integrationStatus: 'حالة التكامل',
      connected: 'متصل',
      disconnected: 'غير متصل',
      syncing: 'جارٍ المزامنة...',
      lastSync: 'آخر مزامنة',
      syncNow: 'مزامنة الآن',
      configure: 'تكوين التكامل'
    },
    qiwa: {
      title: 'منصة قوى',
      subtitle: 'وزارة الموارد البشرية والتنمية الاجتماعية',
      description: 'إدارة تصاريح العمل وطلبات التأشيرات والامتثال للقوى العاملة من خلال منصة قوى الرسمية.',
      features: {
        title: 'الخدمات المتاحة',
        workPermits: 'طلبات تصاريح العمل',
        visaApplications: 'طلبات وتجديد التأشيرات',
        employeeTransfer: 'خدمات نقل الموظفين',
        complianceReports: 'تقارير الامتثال',
        laborContracts: 'إدارة عقود العمل',
        wageProtection: 'نظام حماية الأجور',
        saudization: 'امتثال السعودة',
        documentVerification: 'التحقق من الوثائق'
      },
      actions: {
        newApplication: 'طلب جديد',
        checkStatus: 'تحقق من حالة الطلب',
        downloadCertificate: 'تحميل الشهادة',
        submitReport: 'تقديم تقرير الامتثال',
        updateInfo: 'تحديث معلومات الموظف',
        uploadDocuments: 'رفع الوثائق المطلوبة',
        payFees: 'دفع الرسوم الحكومية',
        requestSupport: 'طلب الدعم'
      },
      status: {
        submitted: 'تم تقديم الطلب',
        underReview: 'قيد المراجعة',
        approved: 'موافق عليه',
        rejected: 'مرفوض',
        pending: 'في انتظار الوثائق',
        completed: 'مكتمل',
        expired: 'منتهي الصلاحية',
        cancelled: 'ملغي'
      }
    },
    gosi: {
      title: 'منصة التأمينات الاجتماعية',
      subtitle: 'المؤسسة العامة للتأمينات الاجتماعية',
      description: 'إدارة تسجيلات التأمينات الاجتماعية والمساهمات ومطالبات المزايا للموظفين.',
      features: {
        title: 'الخدمات المتاحة',
        employeeRegistration: 'تسجيل الموظفين',
        contributionPayments: 'مدفوعات المساهمات',
        benefitClaims: 'معالجة مطالبات المزايا',
        annualReports: 'تقديم التقارير السنوية',
        salaryUpdates: 'تحديثات وتعديلات الرواتب',
        certificateRequests: 'طلبات شهادات التأمينات',
        complianceChecks: 'التحقق من الامتثال',
        pensionCalculation: 'حسابات التقاعد'
      },
      actions: {
        registerEmployee: 'تسجيل موظف جديد',
        payContributions: 'دفع المساهمات الشهرية',
        submitClaim: 'تقديم مطالبة مزايا',
        updateSalaries: 'تحديث رواتب الموظفين',
        generateCertificate: 'إنشاء شهادة التأمينات',
        downloadStatement: 'تحميل كشف المساهمات',
        viewPensions: 'عرض تفاصيل التقاعد',
        contactSupport: 'اتصال بدعم التأمينات'
      },
      contributions: {
        title: 'إدارة المساهمات',
        monthly: 'المساهمات الشهرية',
        due: 'المبلغ المستحق',
        paid: 'مدفوع هذا الشهر',
        overdue: 'مدفوعات متأخرة',
        nextDue: 'الدفعة التالية مستحقة',
        paymentHistory: 'تاريخ المدفوعات',
        calculateContributions: 'احسب المساهمات'
      }
    },
    absher: {
      title: 'منصة أبشر',
      subtitle: 'وزارة الداخلية - خدمات الحكومة الرقمية',
      description: 'الوصول للخدمات الحكومية الأساسية بما في ذلك تجديد الإقامة وتصاريح الخروج والعودة والتحقق من الهوية.',
      features: {
        title: 'الخدمات المتاحة',
        iqamaRenewal: 'خدمات تجديد الإقامة',
        exitReentry: 'تصاريح الخروج والعودة',
        identityVerification: 'التحقق من الهوية',
        dependentServices: 'خدمات التابعين',
        addressUpdate: 'خدمات تحديث العنوان',
        certificateRequests: 'طلبات الشهادات الرسمية',
        travelPermissions: 'خدمات أذونات السفر',
        familyVisits: 'خدمات تأشيرة زيارة الأسرة'
      },
      actions: {
        renewIqama: 'تجديد الإقامة',
        applyExitReentry: 'طلب خروج وعودة',
        verifyIdentity: 'التحقق من هوية الموظف',
        updateAddress: 'تحديث معلومات العنوان',
        requestCertificate: 'طلب شهادة رسمية',
        checkApplication: 'تحقق من حالة الطلب',
        downloadDocument: 'تحميل الوثيقة',
        scheduleAppointment: 'حجز موعد'
      },
      documents: {
        title: 'إدارة الوثائق',
        iqama: 'الإقامة',
        passport: 'نسخة جواز السفر',
        contract: 'عقد العمل',
        salaryCard: 'شهادة راتب',
        medicalInsurance: 'التأمين الطبي',
        bankStatement: 'كشف حساب بنكي',
        familyCertificate: 'شهادة أسرة',
        birthCertificate: 'شهادة ميلاد'
      }
    },
    common: {
      loading: 'جارٍ تحميل بيانات المنصة...',
      error: 'فشل في تحميل معلومات المنصة',
      retry: 'إعادة المحاولة',
      refresh: 'تحديث البيانات',
      configure: 'تكوين',
      connect: 'ربط المنصة',
      disconnect: 'قطع الاتصال',
      settings: 'إعدادات المنصة',
      help: 'المساعدة والدعم',
      documentation: 'عرض الوثائق',
      contactSupport: 'اتصال بالدعم',
      apiStatus: 'حالة واجهة برمجة التطبيقات',
      connectionTest: 'اختبار الاتصال',
      credentials: 'بيانات اعتماد واجهة برمجة التطبيقات',
      permissions: 'الصلاحيات المطلوبة',
      dataSync: 'مزامنة البيانات',
      compliance: 'حالة الامتثال',
      notifications: 'إشعارات المنصة',
      alerts: 'تنبيهات النظام'
    },
    documents: {
      title: 'الوثائق الحكومية',
      upload: 'رفع وثيقة',
      required: 'وثائق مطلوبة',
      optional: 'وثائق اختيارية',
      pending: 'في انتظار المراجعة',
      approved: 'موافق عليها',
      rejected: 'مرفوضة - تتطلب انتباه',
      expired: 'منتهية الصلاحية - تتطلب تجديد',
      expiringSoon: 'تنتهي خلال 30 يوماً',
      category: 'فئة الوثيقة',
      type: 'نوع الوثيقة',
      issueDate: 'تاريخ الإصدار',
      expiryDate: 'تاريخ انتهاء الصلاحية',
      reference: 'الرقم المرجعي',
      downloadOriginal: 'تحميل الأصل',
      viewPreview: 'معاينة',
      submitForReview: 'تقديم للمراجعة',
      requestRenewal: 'طلب تجديد'
    }
  }
};