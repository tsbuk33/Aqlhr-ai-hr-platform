export const kpiExplanations = {
  totalEmployees: {
    titleEn: "Total Employees",
    titleAr: "إجمالي الموظفين",
    descriptionEn: "The total number of employees currently working in your organization",
    descriptionAr: "العدد الإجمالي للموظفين العاملين حاليًا في مؤسستك",
    formulaEn: "Active Employees + On Leave Employees",
    formulaAr: "الموظفون النشطون + الموظفون في إجازة",
    importanceEn: "This metric helps you understand your workforce size, plan resources, calculate costs per employee, and track growth trends over time.",
    importanceAr: "يساعدك هذا المؤشر على فهم حجم القوى العاملة لديك، وتخطيط الموارد، وحساب التكاليف لكل موظف، وتتبع اتجاهات النمو مع مرور الوقت.",
    targetEn: "Depends on business goals, but steady controlled growth is ideal",
    targetAr: "يعتمد على أهداف العمل، لكن النمو المستقر والمحكوم مثالي",
    category: 'operational' as const
  },

  aiProcesses: {
    titleEn: "AI Processes",
    titleAr: "عمليات الذكاء الاصطناعي",
    descriptionEn: "Number of AI-powered tools and automated processes running in your HR system",
    descriptionAr: "عدد الأدوات المدعومة بالذكاء الاصطناعي والعمليات المؤتمتة في نظام الموارد البشرية",
    importanceEn: "AI processes reduce manual work, improve accuracy, speed up decision-making, and provide intelligent insights for better HR management.",
    importanceAr: "تقلل عمليات الذكاء الاصطناعي من العمل اليدوي، وتحسن الدقة، وتسرع اتخاذ القرارات، وتوفر رؤى ذكية لإدارة أفضل للموارد البشرية.",
    targetEn: "Higher numbers indicate more automation and efficiency",
    targetAr: "الأرقام الأعلى تشير إلى مزيد من الأتمتة والكفاءة",
    category: 'strategic' as const
  },

  govIntegrations: {
    titleEn: "Government Integrations",
    titleAr: "التكاملات الحكومية",
    descriptionEn: "Number of government platforms and regulatory systems your HR is connected to",
    descriptionAr: "عدد المنصات الحكومية والأنظمة التنظيمية المتصلة بنظام الموارد البشرية",
    importanceEn: "These integrations ensure compliance with Saudi labor laws, automate government reporting, and reduce manual paperwork and errors.",
    importanceAr: "تضمن هذه التكاملات الامتثال لقوانين العمل السعودية، وتؤتمت التقارير الحكومية، وتقلل من الأعمال الورقية اليدوية والأخطاء.",
    targetEn: "100% integration with all relevant government systems",
    targetAr: "تكامل 100% مع جميع الأنظمة الحكومية ذات الصلة",
    category: 'compliance' as const
  },

  complianceScore: {
    titleEn: "Compliance Score",
    titleAr: "نقاط الامتثال",
    descriptionEn: "Percentage showing how well your organization follows Saudi labor laws and regulations",
    descriptionAr: "النسبة المئوية التي تُظهر مدى التزام مؤسستك بقوانين العمل واللوائح السعودية",
    formulaEn: "(Compliant Processes / Total Processes) × 100",
    formulaAr: "(العمليات الملتزمة / إجمالي العمليات) × 100",
    importanceEn: "High compliance protects from legal issues, fines, and penalties. It also builds trust with employees and improves company reputation.",
    importanceAr: "الامتثال العالي يحمي من القضايا القانونية والغرامات والعقوبات. كما يبني الثقة مع الموظفين ويحسن سمعة الشركة.",
    targetEn: "95% or higher for excellent compliance",
    targetAr: "95% أو أعلى للامتثال الممتاز",
    category: 'compliance' as const
  },

  saudizationRate: {
    titleEn: "Saudization Rate",
    titleAr: "معدل السعودة",
    descriptionEn: "Percentage of Saudi nationals in your workforce, required by Nitaqat program",
    descriptionAr: "نسبة المواطنين السعوديين في القوى العاملة، المطلوبة بموجب برنامج نطاقات",
    formulaEn: "(Saudi Employees / Total Employees) × 100",
    formulaAr: "(الموظفون السعوديون / إجمالي الموظفين) × 100",
    importanceEn: "Meeting Saudization targets allows access to government services, avoids penalties, and may provide benefits like easier visa processing.",
    importanceAr: "تحقيق أهداف السعودة يتيح الوصول للخدمات الحكومية، ويتجنب العقوبات، وقد يوفر مزايا مثل تسهيل معالجة التأشيرات.",
    targetEn: "Varies by sector: Green (best), Yellow, Red categories",
    targetAr: "يختلف حسب القطاع: الأخضر (الأفضل)، الأصفر، الأحمر",
    category: 'compliance' as const
  },

  activeUsers: {
    titleEn: "Active Users",
    titleAr: "المستخدمون النشطون",
    descriptionEn: "Number of employees actively using the HR self-service system",
    descriptionAr: "عدد الموظفين الذين يستخدمون نظام الخدمة الذاتية للموارد البشرية بنشاط",
    formulaEn: "Employees who logged in during the last 30 days",
    formulaAr: "الموظفون الذين سجلوا الدخول خلال آخر 30 يومًا",
    importanceEn: "High user adoption means employees can handle their own requests, reducing HR workload and improving employee satisfaction.",
    importanceAr: "الاعتماد العالي للمستخدمين يعني أن الموظفين يمكنهم التعامل مع طلباتهم بأنفسهم، مما يقلل عبء العمل على الموارد البشرية ويحسن رضا الموظفين.",
    targetEn: "80% or higher usage rate is excellent",
    targetAr: "معدل استخدام 80% أو أعلى ممتاز",
    category: 'operational' as const
  },

  documentsProcessed: {
    titleEn: "Documents Processed",
    titleAr: "المستندات المعالجة",
    descriptionEn: "Number of employee documents processed and verified by AI systems",
    descriptionAr: "عدد وثائق الموظفين المعالجة والمتحقق منها بواسطة أنظمة الذكاء الاصطناعي",
    importanceEn: "Shows efficiency of document handling, reduces processing time, and ensures accuracy in employee record management.",
    importanceAr: "يُظهر كفاءة التعامل مع الوثائق، ويقلل وقت المعالجة، ويضمن الدقة في إدارة سجلات الموظفين.",
    targetEn: "Higher numbers with faster processing times",
    targetAr: "أرقام أعلى مع أوقات معالجة أسرع",
    category: 'operational' as const
  },

  trainingHours: {
    titleEn: "Training Hours",
    titleAr: "ساعات التدريب",
    descriptionEn: "Total hours employees spent in training and development programs",
    descriptionAr: "إجمالي الساعات التي قضاها الموظفون في برامج التدريب والتطوير",
    formulaEn: "Sum of all completed training hours by all employees",
    formulaAr: "مجموع جميع ساعات التدريب المكتملة لجميع الموظفين",
    importanceEn: "Training improves employee skills, job satisfaction, productivity, and helps career development while reducing turnover.",
    importanceAr: "التدريب يحسن مهارات الموظفين، والرضا الوظيفي، والإنتاجية، ويساعد في التطوير المهني بينما يقلل معدل دوران الموظفين.",
    targetEn: "40+ hours per employee per year is recommended",
    targetAr: "40+ ساعة لكل موظف سنويًا موصى به",
    category: 'strategic' as const
  },

  monthlyPayroll: {
    titleEn: "Monthly Payroll",
    titleAr: "الراتب الشهري",
    descriptionEn: "Total amount paid to all employees in salaries and benefits each month",
    descriptionAr: "المبلغ الإجمالي المدفوع لجميع الموظفين في الرواتب والمزايا كل شهر",
    formulaEn: "Sum of all employee salaries + benefits + allowances",
    formulaAr: "مجموع رواتب جميع الموظفين + المزايا + البدلات",
    importanceEn: "This is your biggest operational cost. Tracking it helps with budgeting, financial planning, and cost control decisions.",
    importanceAr: "هذه أكبر تكلفة تشغيلية لديك. تتبعها يساعد في وضع الميزانية، والتخطيط المالي، وقرارات التحكم في التكاليف.",
    targetEn: "Should align with budget and industry benchmarks",
    targetAr: "يجب أن تتماشى مع الميزانية ومعايير الصناعة",
    category: 'financial' as const
  },

  attendanceRate: {
    titleEn: "Attendance Rate",
    titleAr: "معدل الحضور",
    descriptionEn: "Percentage of scheduled work time that employees actually attend",
    descriptionAr: "نسبة وقت العمل المجدول الذي يحضر فيه الموظفون فعليًا",
    formulaEn: "(Hours Worked / Scheduled Hours) × 100",
    formulaAr: "(الساعات المعملة / الساعات المجدولة) × 100",
    importanceEn: "High attendance means better productivity, project continuity, and team collaboration. Low attendance can indicate problems.",
    importanceAr: "الحضور العالي يعني إنتاجية أفضل، واستمرارية المشاريع، وتعاون الفريق. الحضور المنخفض قد يشير إلى مشاكل.",
    targetEn: "95% or higher is considered excellent",
    targetAr: "95% أو أعلى يُعتبر ممتازًا",
    category: 'operational' as const
  }
};