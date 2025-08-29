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
      policyCompliance: 'Compliance',
      noPolicies: 'No policies uploaded yet',
      uploadFirst: 'Upload your first policy',
      // Policy Risk Analysis
      analyze: 'Analyze Policy',
      source: {
        upload: 'Use uploaded document',
        paste: 'Paste policy text',
        selectFile: 'Select a file to analyze',
        pasteText: 'Paste policy text here...'
      },
      analyzing: 'Analyzing Policy Risk...',
      analysisProgress: {
        initializing: 'Initializing analysis engine...',
        extracting: 'Extracting policy content...',
        searching: 'Searching relevant documents...',
        analyzing: 'Analyzing compliance dimensions...',
        scoring: 'Calculating risk scores...',
        generating: 'Generating mitigation strategies...',
        finalizing: 'Finalizing analysis report...'
      },
      results: {
        title: 'Policy Risk Analysis Results',
        overallScore: 'Overall Risk Score',
        riskMatrix: 'Risk Matrix',
        mitigationStrategies: 'Mitigation Strategies',
        citations: 'Supporting Evidence'
      },
      family: {
        compliance: 'Compliance Risk',
        business: 'Business Risk',
        implementation: 'Implementation Risk'
      },
      dim: {
        saudiLaborLaw: 'Saudi Labor Law',
        workplaceRights: 'Workplace Rights',
        discriminationPrevention: 'Discrimination Prevention',
        dataProtection: 'Data Protection',
        operationalComplexity: 'Operational Complexity',
        resourceRequirements: 'Resource Requirements',
        stakeholderImpact: 'Stakeholder Impact',
        financialImplications: 'Financial Implications',
        systemComplexity: 'System Complexity',
        changeResistance: 'Change Resistance',
        trainingRequirements: 'Training Requirements',
        monitoringDifficulty: 'Monitoring Difficulty'
      },
      mitigation: {
        priority: 'Priority',
        effort: 'Effort Level',
        impact: 'Expected Impact',
        timeline: 'Timeline',
        roi: 'ROI',
        createTask: 'Create Task',
        viewCitations: 'View Citations',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        weeks: 'weeks'
      },
      citations: {
        title: 'Supporting Citations',
        relevance: 'Relevance',
        source: 'Source',
        excerpt: 'Relevant Excerpt'
      }
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
        positionTitle: 'Position',
        companySize: 'Company Size',
        region: 'Region',
        generate: 'Generate Benchmark',
        generating: 'Generating Analysis...',
        salaryRange: 'Salary Range Analysis',
        marketPosition: 'Market Position',
        median: 'Market Median',
        percentile: 'Percentile',
        noData: 'Select criteria to generate salary benchmark analysis',
        noResults: 'No benchmark data available. Please generate analysis first.',
        selectPosition: 'Please select position title and HRSD code',
        error: 'Failed to generate salary benchmark',
        aiPowered: 'AI-Powered Analysis',
        aiDescription: 'Advanced AI models analyze HRSD data, market surveys, and economic factors',
        tabs: {
          criteria: 'Criteria',
          results: 'Results',
          comparison: 'Comparison',
          insights: 'AI Insights'
        },
        metrics: {
          positions: 'HRSD Positions',
          companies: 'Market Companies',
          dataPoints: 'Data Points',
          accuracy: 'AI Accuracy'
        },
        position: {
          details: 'Position Details',
          description: 'Define the role and requirements',
          title: 'Position Title',
          titlePlaceholder: 'e.g., Senior Software Engineer',
          hrsdCode: 'HRSD Position Code',
          selectCode: 'Select HRSD code',
          industry: 'Industry',
          selectIndustry: 'Select industry'
        },
        company: {
          details: 'Company & Location',
          description: 'Company size and location factors',
          size: 'Company Size'
        },
        location: {
          region: 'Saudi Region'
        },
        candidate: {
          profile: 'Candidate Profile',
          description: 'Experience and qualifications',
          experience: 'Experience Level',
          education: 'Education Level',
          nationality: 'Nationality'
        },
        results: {
          salaryOverview: 'Salary Analysis Overview'
        },
        baseSalary: 'Base Salary',
        totalCompensation: 'Total Compensation',
        confidence: 'AI Confidence Score',
        benefits: {
          title: 'Benefits Breakdown',
          housing: 'Housing Allowance',
          transportation: 'Transportation',
          medical: 'Medical Insurance',
          education: 'Education Allowance',
          annual: 'Annual Bonus',
          total: 'Total Benefits'
        },
        comparison: {
          title: 'Market Comparison',
          description: 'Compare with similar positions and companies',
          comingSoon: 'Market comparison features coming soon'
        },
        insights: {
          title: 'AI Market Insights',
          description: 'Advanced insights and recommendations from AI analysis',
          comingSoon: 'AI insights and recommendations coming soon'
        }
      }
    },
    // Common terms
    positions: {
      softwareEngineer: 'Software Engineer',
      dataScientist: 'Data Scientist',
      systemAnalyst: 'System Analyst',
      hrManager: 'HR Manager',
      financialAnalyst: 'Financial Analyst',
      marketingSpecialist: 'Marketing Specialist'
    },
    industries: {
      technology: 'Technology',
      finance: 'Finance',
      healthcare: 'Healthcare',
      retail: 'Retail',
      manufacturing: 'Manufacturing'
    },
    company: {
      size: {
        micro: 'Micro',
        small: 'Small',
        medium: 'Medium',
        large: 'Large',
        enterprise: 'Enterprise'
      }
    },
    regions: {
      riyadh: 'Riyadh',
      makkah: 'Makkah',
      eastern: 'Eastern Province',
      asir: 'Asir',
      madinah: 'Madinah',
      qassim: 'Qassim'
    },
    experience: {
      entry: 'Entry Level',
      junior: 'Junior',
      mid: 'Mid Level',
      senior: 'Senior',
      expert: 'Expert',
      executive: 'Executive',
      years: 'years'
    },
    education: {
      highSchool: 'High School',
      diploma: 'Diploma',
      bachelor: 'Bachelor\'s Degree',
      master: 'Master\'s Degree',
      phd: 'PhD',
      professional: 'Professional Certificate'
    },
    nationality: {
      saudi: 'Saudi',
      gcc: 'GCC National',
      arab: 'Arab',
      asian: 'Asian',
      western: 'Western',
      other: 'Other'
    },
    // AI Context Engineering Engine
    ai: {
      controlRoom: {
        title: 'AI Control Room',
        description: 'Monitor and configure AI system performance and settings',
        intentDistribution: 'Intent Distribution',
        intentDistributionDesc: 'Distribution of AI request intents across modules',
        providerMix: 'Provider Mix',
        providerMixDesc: 'AI provider usage distribution',
        latencyByProvider: 'Latency by Provider',
        successRateByProvider: 'Success Rate by Provider',
        errorDistribution: 'Error Distribution',
        hourlyActivity: 'Hourly Activity',
        hourlyActivityDesc: 'AI request volume throughout the day',
        totalRequests: 'Total Requests',
        avgLatency: 'Average Latency',
        successRate: 'Success Rate',
        estimatedCost: 'Estimated Cost',
        last7Days: 'Last 7 Days',
        p95Latency: 'p95: {{latency}}ms',
        reliability: 'Reliability',
        monthlyProjection: 'Monthly Projection',
        vsLastWeek: 'vs last week',
        autoRefresh: 'Auto Refresh',
        lastRefresh: 'Last refreshed',
        overview: 'Overview',
        performance: 'Performance',
        configuration: 'Configuration',
        logs: 'Logs',
        globalSettings: 'Global Settings',
        globalSettingsDesc: 'System-wide AI orchestrator configuration',
        moduleSettings: 'Module Settings',
        moduleSettingsDesc: 'Per-module configuration overrides',
        gensparkFirst: 'Genspark First',
        allowStreaming: 'Allow Streaming',
        enableAnalytics: 'Enable Analytics',
        enableControlRoom: 'Enable Control Room',
        defaultCostTarget: 'Default Cost Target',
        costTarget: 'Cost Target',
        streaming: 'Streaming',
        maxTokens: 'Max Tokens',
        realtimeLogs: 'Real-time Logs',
        realtimeLogsDesc: 'Live AI system activity and performance logs',
        adminAccess: 'Admin Access'
      },
      badges: {
        intent: 'Intent',
        urgency: 'Urgency',
        complexity: 'Complexity',
        confidence: 'Confidence',
        riskLevel: 'Risk Level'
      },
      intents: {
        question: 'Question',
        task: 'Task',
        analysis: 'Analysis',
        generation: 'Generation',
        search: 'Search',
        conversation: 'Conversation',
        troubleshooting: 'Troubleshooting',
        other: 'Other'
      },
      urgency: {
        veryUrgent: 'Very Urgent',
        urgent: 'Urgent',
        medium: 'Medium',
        low: 'Low',
        notUrgent: 'Not Urgent'
      },
      complexity: {
        veryComplex: 'Very Complex',
        complex: 'Complex',
        medium: 'Medium',
        simple: 'Simple',
        verySimple: 'Very Simple'
      },
      confidence: {
        veryHigh: 'Very High',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        veryLow: 'Very Low'
      },
      risk: {
        low: 'Low Risk',
        medium: 'Medium Risk',
        high: 'High Risk'
      },
      costTarget: {
        low: 'Low Cost',
        balanced: 'Balanced',
        high: 'High Performance'
      },
      providers: {
        genspark: 'GenSpark AI',
        openai: 'OpenAI',
        manus: 'Manus AI',
        gemini: 'Google Gemini'
      },
      modules: {
        'gov.qiwa': 'QIWA Integration',
        'gov.gosi': 'GOSI Integration', 
        'gov.mudad': 'Mudad Platform',
        'gov.absher': 'Absher Integration',
        'employee': 'Employee Management',
        'payroll': 'Payroll & Benefits',
        'policy': 'Policy Management',
        'compliance': 'Compliance & Legal',
        'analytics': 'Analytics & Insights',
        'reports': 'Reports & Documentation',
        'documents': 'Document Management',
        'ask-aql': 'Ask Aql Assistant',
        'general': 'General Assistant'
      },
      assistant: {
        askAql: 'Ask Aql',
        openAssistant: 'Open Assistant',
        closeAssistant: 'Close Assistant',
        policyIntelligence: 'Policy Intelligence Assistant',
        getHelp: 'Get intelligent assistance with policy analysis and compliance',
        classifyingIntent: 'Classifying intent...',
        generatingPlan: 'Generating routing plan...',
        executing: 'Executing query...',
        streamingResponse: 'Streaming response...',
        intentClassified: 'Intent classified',
        planGenerated: 'Plan generated',
        responseComplete: 'Response complete',
        querySuccessful: 'Query Successful',
        routedTo: 'Routed to {{provider}}',
        routedVia: 'Routed via {{provider}} with {{costTarget}} cost target',
        switchedToFallback: 'Switched to fallback system',
        warning: 'Warning',
        typePlaceholder: 'Type your message here...',
        aiAnalysis: 'AI Analysis',
        streaming: 'Streaming',
        batch: 'Batch'
      }
    },
    admin: {
      title: 'Administration',
      accessDenied: {
        title: 'Access Denied',
        description: 'You do not have permission to access this admin area.',
        requiredRole: 'Admin or Super-Admin access required',
        currentRole: 'Your current role: {{role}}'
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
      policyCompliance: 'الامتثال',
      noPolicies: 'لم يتم رفع سياسات بعد',
      uploadFirst: 'ارفع سياستك الأولى',
      // تحليل مخاطر السياسات
      analyze: 'تحليل السياسة',
      source: {
        upload: 'استخدم وثيقة مرفوعة',
        paste: 'ألصق نص السياسة',
        selectFile: 'اختر ملفاً للتحليل',
        pasteText: 'ألصق نص السياسة هنا...'
      },
      analyzing: 'جاري تحليل مخاطر السياسة...',
      analysisProgress: {
        initializing: 'جاري تهيئة محرك التحليل...',
        extracting: 'جاري استخراج محتوى السياسة...',
        searching: 'جاري البحث عن الوثائق ذات الصلة...',
        analyzing: 'جاري تحليل أبعاد الامتثال...',
        scoring: 'جاري حساب نتائج المخاطر...',
        generating: 'جاري إنشاء استراتيجيات التخفيف...',
        finalizing: 'جاري الانتهاء من تقرير التحليل...'
      },
      results: {
        title: 'نتائج تحليل مخاطر السياسة',
        overallScore: 'نتيجة المخاطر الإجمالية',
        riskMatrix: 'مصفوفة المخاطر',
        mitigationStrategies: 'استراتيجيات التخفيف',
        citations: 'الأدلة المساندة'
      },
      family: {
        compliance: 'مخاطر الامتثال',
        business: 'مخاطر الأعمال',
        implementation: 'مخاطر التنفيذ'
      },
      dim: {
        saudiLaborLaw: 'قانون العمل السعودي',
        workplaceRights: 'حقوق مكان العمل',
        discriminationPrevention: 'منع التمييز',
        dataProtection: 'حماية البيانات',
        operationalComplexity: 'التعقيد التشغيلي',
        resourceRequirements: 'متطلبات الموارد',
        stakeholderImpact: 'تأثير أصحاب المصلحة',
        financialImplications: 'الآثار المالية',
        systemComplexity: 'تعقيد النظام',
        changeResistance: 'مقاومة التغيير',
        trainingRequirements: 'متطلبات التدريب',
        monitoringDifficulty: 'صعوبة المراقبة'
      },
      mitigation: {
        priority: 'الأولوية',
        effort: 'مستوى الجهد',
        impact: 'التأثير المتوقع',
        timeline: 'الجدول الزمني',
        roi: 'عائد الاستثمار',
        createTask: 'إنشاء مهمة',
        viewCitations: 'عرض المراجع',
        high: 'عالي',
        medium: 'متوسط',
        low: 'منخفض',
        weeks: 'أسابيع'
      },
      citations: {
        title: 'المراجع المساندة',
        relevance: 'الصلة',
        source: 'المصدر',
        excerpt: 'المقتطف ذو الصلة'
      }
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
        positionTitle: 'المنصب',
        companySize: 'حجم الشركة',
        region: 'المنطقة',
        generate: 'إنشاء المقارنة',
        generating: 'جاري إنشاء التحليل...',
        salaryRange: 'تحليل نطاق الراتب',
        marketPosition: 'موقف السوق',
        median: 'متوسط السوق',
        percentile: 'النسبة المئوية',
        noData: 'اختر المعايير لإنشاء تحليل مقارنة الرواتب',
        noResults: 'لا توجد بيانات مقارنة متاحة. يرجى إنشاء التحليل أولاً.',
        selectPosition: 'يرجى اختيار عنوان المنصب ورمز وزارة الموارد البشرية',
        error: 'فشل في إنشاء مقارنة الراتب',
        aiPowered: 'تحليل مدعوم بالذكاء الاصطناعي',
        aiDescription: 'نماذج الذكاء الاصطناعي المتقدمة تحلل بيانات الوزارة ومسوحات السوق والعوامل الاقتصادية',
        tabs: {
          criteria: 'المعايير',
          results: 'النتائج',
          comparison: 'المقارنة',
          insights: 'رؤى الذكاء الاصطناعي'
        },
        metrics: {
          positions: 'مناصب وزارة الموارد البشرية',
          companies: 'شركات السوق',
          dataPoints: 'نقاط البيانات',
          accuracy: 'دقة الذكاء الاصطناعي'
        },
        position: {
          details: 'تفاصيل المنصب',
          description: 'حدد الدور والمتطلبات',
          title: 'عنوان المنصب',
          titlePlaceholder: 'مثال: مهندس برمجيات أول',
          hrsdCode: 'رمز منصب وزارة الموارد البشرية',
          selectCode: 'اختر رمز الوزارة',
          industry: 'الصناعة',
          selectIndustry: 'اختر الصناعة'
        },
        company: {
          details: 'الشركة والموقع',
          description: 'عوامل حجم الشركة والموقع',
          size: 'حجم الشركة'
        },
        location: {
          region: 'المنطقة السعودية'
        },
        candidate: {
          profile: 'ملف المرشح',
          description: 'الخبرة والمؤهلات',
          experience: 'مستوى الخبرة',
          education: 'مستوى التعليم',
          nationality: 'الجنسية'
        },
        results: {
          salaryOverview: 'نظرة عامة على تحليل الراتب'
        },
        baseSalary: 'الراتب الأساسي',
        totalCompensation: 'التعويض الإجمالي',
        confidence: 'نتيجة ثقة الذكاء الاصطناعي',
        benefits: {
          title: 'تفصيل المزايا',
          housing: 'بدل السكن',
          transportation: 'المواصلات',
          medical: 'التأمين الطبي',
          education: 'بدل التعليم',
          annual: 'المكافأة السنوية',
          total: 'إجمالي المزايا'
        },
        comparison: {
          title: 'مقارنة السوق',
          description: 'قارن مع المناصب والشركات المماثلة',
          comingSoon: 'ميزات مقارنة السوق قادمة قريباً'
        },
        insights: {
          title: 'رؤى السوق بالذكاء الاصطناعي',
          description: 'رؤى وتوصيات متقدمة من تحليل الذكاء الاصطناعي',
          comingSoon: 'رؤى وتوصيات الذكاء الاصطناعي قادمة قريباً'
        }
      }
    },
    // Common terms  
    positions: {
      softwareEngineer: 'مهندس برمجيات',
      dataScientist: 'عالم بيانات', 
      systemAnalyst: 'محلل نظم',
      hrManager: 'مدير موارد بشرية',
      financialAnalyst: 'محلل مالي',
      marketingSpecialist: 'أخصائي تسويق'
    },
    industries: {
      technology: 'التكنولوجيا',
      finance: 'الماليات',
      healthcare: 'الرعاية الصحية',
      retail: 'التجزئة',
      manufacturing: 'التصنيع'
    },
    company: {
      size: {
        micro: 'شركة ناشئة',
        small: 'صغيرة',
        medium: 'متوسطة',
        large: 'كبيرة',
        enterprise: 'مؤسسية'
      }
    },
    regions: {
      riyadh: 'الرياض',
      makkah: 'مكة المكرمة',
      eastern: 'المنطقة الشرقية',
      asir: 'عسير',
      madinah: 'المدينة المنورة',
      qassim: 'القصيم'
    },
    experience: {
      entry: 'مبتدئ',
      junior: 'مبتدئ متقدم',
      mid: 'متوسط',
      senior: 'أول',
      expert: 'خبير',
      executive: 'تنفيذي',
      years: 'سنوات'
    },
    education: {
      highSchool: 'الثانوية العامة',
      diploma: 'دبلوم',
      bachelor: 'بكالوريوس',
      master: 'ماجستير',
      phd: 'دكتوراه',
      professional: 'مهني'
    },
    nationality: {
      saudi: 'سعودي',
      gcc: 'خليجي',
      arab: 'عربي',
      asian: 'آسيوي',
      western: 'غربي',
      other: 'أخرى'
    },
    // محرك هندسة السياق للذكاء الاصطناعي
    ai: {
      controlRoom: {
        title: 'غرفة التحكم في الذكاء الاصطناعي',
        description: 'مراقبة وتكوين أداء نظام الذكاء الاصطناعي والإعدادات',
        intentDistribution: 'توزيع النوايا',
        intentDistributionDesc: 'توزيع نوايا طلبات الذكاء الاصطناعي عبر الوحدات',
        providerMix: 'مزج المزودين',
        providerMixDesc: 'توزيع استخدام مزودي الذكاء الاصطناعي',
        latencyByProvider: 'زمن الاستجابة حسب المزود',
        successRateByProvider: 'معدل النجاح حسب المزود',
        errorDistribution: 'توزيع الأخطاء',
        hourlyActivity: 'النشاط بالساعة',
        hourlyActivityDesc: 'حجم طلبات الذكاء الاصطناعي على مدار اليوم',
        totalRequests: 'إجمالي الطلبات',
        avgLatency: 'متوسط زمن الاستجابة',
        successRate: 'معدل النجاح',
        estimatedCost: 'التكلفة المقدرة',
        last7Days: 'آخر ٧ أيام',
        p95Latency: 'النسبة المئوية ٩٥: {{latency}} مللي ثانية',
        reliability: 'الموثوقية',
        monthlyProjection: 'الإسقاط الشهري',
        vsLastWeek: 'مقارنة بالأسبوع الماضي',
        autoRefresh: 'التحديث التلقائي',
        lastRefresh: 'آخر تحديث',
        overview: 'نظرة عامة',
        performance: 'الأداء',
        configuration: 'التكوين',
        logs: 'السجلات',
        globalSettings: 'الإعدادات العامة',
        globalSettingsDesc: 'تكوين منسق الذكاء الاصطناعي على مستوى النظام',
        moduleSettings: 'إعدادات الوحدة',
        moduleSettingsDesc: 'تجاوزات التكوين لكل وحدة',
        gensparkFirst: 'جين سبارك أولاً',
        allowStreaming: 'السماح بالتدفق',
        enableAnalytics: 'تمكين التحليلات',
        enableControlRoom: 'تمكين غرفة التحكم',
        defaultCostTarget: 'هدف التكلفة الافتراضي',
        costTarget: 'هدف التكلفة',
        streaming: 'التدفق',
        maxTokens: 'الحد الأقصى للرموز',
        realtimeLogs: 'السجلات المباشرة',
        realtimeLogsDesc: 'نشاط نظام الذكاء الاصطناعي المباشر وسجلات الأداء',
        adminAccess: 'وصول المسؤول'
      },
      badges: {
        intent: 'النية',
        urgency: 'الإلحاح',
        complexity: 'التعقيد',
        confidence: 'الثقة',
        riskLevel: 'مستوى المخاطر'
      },
      intents: {
        question: 'سؤال',
        task: 'مهمة',
        analysis: 'تحليل',
        generation: 'إنشاء',
        search: 'بحث',
        conversation: 'محادثة',
        troubleshooting: 'حل المشاكل',
        other: 'أخرى'
      },
      urgency: {
        veryUrgent: 'عاجل جداً',
        urgent: 'عاجل',
        medium: 'متوسط',
        low: 'منخفض',
        notUrgent: 'غير عاجل'
      },
      complexity: {
        veryComplex: 'معقد جداً',
        complex: 'معقد',
        medium: 'متوسط',
        simple: 'بسيط',
        verySimple: 'بسيط جداً'
      },
      confidence: {
        veryHigh: 'عالية جداً',
        high: 'عالية',
        medium: 'متوسطة',
        low: 'منخفضة',
        veryLow: 'منخفضة جداً'
      },
      risk: {
        low: 'مخاطر منخفضة',
        medium: 'مخاطر متوسطة',
        high: 'مخاطر عالية'
      },
      costTarget: {
        low: 'تكلفة منخفضة',
        balanced: 'متوازن',
        high: 'أداء عالي'
      },
      providers: {
        genspark: 'جين سبارك للذكاء الاصطناعي',
        openai: 'أوبن إيه آي',
        manus: 'مانوس للذكاء الاصطناعي',
        gemini: 'جوجل جيميناي'
      },
      modules: {
        'gov.qiwa': 'تكامل قوى',
        'gov.gosi': 'تكامل التأمينات الاجتماعية',
        'gov.mudad': 'منصة مداد',
        'gov.absher': 'تكامل أبشر',
        'employee': 'إدارة الموظفين',
        'payroll': 'الرواتب والمزايا',
        'policy': 'إدارة السياسات',
        'compliance': 'الامتثال والقانونية',
        'analytics': 'التحليلات والرؤى',
        'reports': 'التقارير والتوثيق',
        'documents': 'إدارة الوثائق',
        'ask-aql': 'مساعد اسأل عقل',
        'general': 'المساعد العام'
      },
      assistant: {
        askAql: 'اسأل عقل',
        openAssistant: 'فتح المساعد',
        closeAssistant: 'إغلاق المساعد',
        policyIntelligence: 'مساعد ذكاء السياسات',
        getHelp: 'احصل على مساعدة ذكية في تحليل السياسات وضمان الامتثال',
        classifyingIntent: 'جاري تصنيف النية...',
        generatingPlan: 'جاري إنشاء خطة التوجيه...',
        executing: 'جاري تنفيذ الاستعلام...',
        streamingResponse: 'جاري تدفق الاستجابة...',
        intentClassified: 'تم تصنيف النية',
        planGenerated: 'تم إنشاء الخطة',
        responseComplete: 'اكتملت الاستجابة',
        querySuccessful: 'تم الاستعلام بنجاح',
        routedTo: 'موجه إلى {{provider}}',
        routedVia: 'موجه عبر {{provider}} بتكلفة {{costTarget}}',
        switchedToFallback: 'تم التبديل إلى النظام الاحتياطي',
        warning: 'تحذير',
        typePlaceholder: 'اكتب رسالتك هنا...',
        aiAnalysis: 'تحليل بالذكاء الاصطناعي',
        streaming: 'بث مباشر',
        batch: 'دفعة واحدة'
      }
    },
    admin: {
      title: 'الإدارة',
      accessDenied: {
        title: 'تم رفض الوصول',
        description: 'ليس لديك إذن للوصول إلى هذه المنطقة الإدارية.',
        requiredRole: 'يتطلب وصول مسؤول أو مسؤول فائق',
        currentRole: 'دورك الحالي: {{role}}'
      }
    }
  }
};