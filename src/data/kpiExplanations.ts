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
  },

  // Additional HR Metrics from Dashboard Image
  turnoverRate: {
    titleEn: "Turnover Rate",
    titleAr: "معدل دوران الموظفين",
    descriptionEn: "Percentage of employees who leave the company within a specific period",
    descriptionAr: "نسبة الموظفين الذين يتركون الشركة خلال فترة محددة",
    formulaEn: "(Number of Departures / Average Number of Employees) × 100",
    formulaAr: "(عدد الموظفين المغادرين / متوسط عدد الموظفين) × 100",
    importanceEn: "High turnover indicates potential issues with job satisfaction, management, or company culture. It's costly due to recruitment and training expenses.",
    importanceAr: "معدل الدوران العالي يشير إلى مشاكل محتملة في الرضا الوظيفي أو الإدارة أو ثقافة الشركة. إنه مكلف بسبب نفقات التوظيف والتدريب.",
    targetEn: "Industry average is 10-15% annually, lower is better",
    targetAr: "متوسط الصناعة 10-15% سنوياً، الأقل أفضل",
    category: 'operational' as const
  },

  newHiresRate: {
    titleEn: "New Hires Rate",
    titleAr: "معدل التوظيف الجديد",
    descriptionEn: "Number of new employees hired within a specific period",
    descriptionAr: "عدد الموظفين الجدد المعينين خلال فترة محددة",
    formulaEn: "Total New Hires / Total Employees × 100",
    formulaAr: "إجمالي التعيينات الجديدة / إجمالي الموظفين × 100",
    importanceEn: "Shows company growth, replacement needs, and recruitment effectiveness. Helps plan onboarding resources and training programs.",
    importanceAr: "يُظهر نمو الشركة واحتياجات الاستبدال وفعالية التوظيف. يساعد في تخطيط موارد التأهيل وبرامج التدريب.",
    targetEn: "Should align with business growth plans and turnover replacement",
    targetAr: "يجب أن يتماشى مع خطط نمو الأعمال واستبدال المغادرين",
    category: 'strategic' as const
  },

  absenteeismRate: {
    titleEn: "Absenteeism Rate",
    titleAr: "معدل الغياب",
    descriptionEn: "Percentage of scheduled work time that employees are absent",
    descriptionAr: "نسبة وقت العمل المجدول الذي يغيب فيه الموظفون",
    formulaEn: "(Total Absent Days / Total Scheduled Work Days) × 100",
    formulaAr: "(إجمالي أيام الغياب / إجمالي أيام العمل المجدولة) × 100",
    importanceEn: "High absenteeism affects productivity, increases costs, and may indicate health issues, low morale, or poor management.",
    importanceAr: "الغياب العالي يؤثر على الإنتاجية، ويزيد التكاليف، وقد يشير إلى مشاكل صحية أو معنويات منخفضة أو إدارة سيئة.",
    targetEn: "2-3% is considered normal, above 5% needs attention",
    targetAr: "2-3% يُعتبر طبيعياً، أعلى من 5% يحتاج انتباه",
    category: 'operational' as const
  },

  timeToFill: {
    titleEn: "Time to Fill",
    titleAr: "وقت ملء المنصب",
    descriptionEn: "Average number of days to fill a vacant position from posting to hiring",
    descriptionAr: "متوسط عدد الأيام لملء منصب شاغر من النشر إلى التوظيف",
    formulaEn: "Total Days to Fill All Positions / Number of Positions Filled",
    formulaAr: "إجمالي أيام ملء جميع المناصب / عدد المناصب المملوءة",
    importanceEn: "Longer times mean lost productivity, increased workload on existing staff, and potentially losing good candidates to competitors.",
    importanceAr: "الأوقات الأطول تعني فقدان الإنتاجية، وزيادة عبء العمل على الموظفين الحاليين، وربما فقدان المرشحين الجيدين للمنافسين.",
    targetEn: "30-40 days is average, 20-30 days is excellent",
    targetAr: "30-40 يوماً متوسط، 20-30 يوماً ممتاز",
    category: 'operational' as const
  },

  costOfAbsence: {
    titleEn: "Cost of Absence",
    titleAr: "تكلفة الغياب",
    descriptionEn: "Total financial impact of employee absences including lost productivity and replacement costs",
    descriptionAr: "التأثير المالي الإجمالي لغياب الموظفين بما في ذلك فقدان الإنتاجية وتكاليف الاستبدال",
    importanceEn: "Helps quantify the real cost of absenteeism and justify investments in employee wellness and engagement programs.",
    importanceAr: "يساعد في تحديد التكلفة الحقيقية للغياب وتبرير الاستثمارات في برامج العافية ومشاركة الموظفين.",
    targetEn: "Minimize through wellness programs and flexible work arrangements",
    targetAr: "التقليل من خلال برامج العافية وترتيبات العمل المرنة",
    category: 'financial' as const
  },

  recruitmentCost: {
    titleEn: "Recruitment Cost",
    titleAr: "تكلفة التوظيف",
    descriptionEn: "Total cost per hire including advertising, screening, interviewing, and onboarding",
    descriptionAr: "إجمالي التكلفة لكل توظيف بما في ذلك الإعلان والفحص والمقابلات والتأهيل",
    formulaEn: "Total Recruitment Expenses / Number of Hires",
    formulaAr: "إجمالي نفقات التوظيف / عدد التعيينات",
    importanceEn: "Understanding recruitment costs helps optimize hiring processes, budget planning, and ROI of different recruitment channels.",
    importanceAr: "فهم تكاليف التوظيف يساعد في تحسين عمليات التوظيف وتخطيط الميزانية والعائد على الاستثمار لقنوات التوظيف المختلفة.",
    targetEn: "Industry average varies, aim to reduce while maintaining quality",
    targetAr: "متوسط الصناعة يختلف، يهدف للتقليل مع الحفاظ على الجودة",
    category: 'financial' as const
  },

  employeesByAge: {
    titleEn: "Employees by Age",
    titleAr: "الموظفون حسب العمر",
    descriptionEn: "Distribution of employees across different age groups",
    descriptionAr: "توزيع الموظفين عبر الفئات العمرية المختلفة",
    importanceEn: "Age diversity brings different perspectives, experiences, and skills. Helps with succession planning and knowledge transfer strategies.",
    importanceAr: "التنوع العمري يجلب وجهات نظر وخبرات ومهارات مختلفة. يساعد في تخطيط التعاقب واستراتيجيات نقل المعرفة.",
    targetEn: "Balanced distribution across age groups for optimal team dynamics",
    targetAr: "توزيع متوازن عبر الفئات العمرية لديناميكيات فريق مثلى",
    category: 'strategic' as const
  },

  employeesByGender: {
    titleEn: "Employees by Gender",
    titleAr: "الموظفون حسب الجنس",
    descriptionEn: "Distribution of male and female employees across the organization",
    descriptionAr: "توزيع الموظفين الذكور والإناث عبر المؤسسة",
    importanceEn: "Gender diversity improves decision-making, innovation, and reflects societal demographics. Important for compliance and company image.",
    importanceAr: "التنوع الجنسي يحسن اتخاذ القرارات والابتكار ويعكس التركيبة المجتمعية. مهم للامتثال وصورة الشركة.",
    targetEn: "Balanced representation aligned with Vision 2030 goals",
    targetAr: "تمثيل متوازن متماشي مع أهداف رؤية 2030",
    category: 'compliance' as const
  },

  costOfLabor: {
    titleEn: "Cost of Labor",
    titleAr: "تكلفة العمالة",
    descriptionEn: "Total cost of employing staff including salaries, benefits, and overhead",
    descriptionAr: "التكلفة الإجمالية لتوظيف الموظفين بما في ذلك الرواتب والمزايا والمصاريف العامة",
    formulaEn: "Total Compensation + Benefits + Payroll Taxes + Overhead",
    formulaAr: "إجمالي التعويضات + المزايا + ضرائب الرواتب + المصاريف العامة",
    importanceEn: "Critical for budgeting, profitability analysis, and strategic decision-making about workforce size and compensation levels.",
    importanceAr: "أساسي لوضع الميزانية وتحليل الربحية واتخاذ القرارات الاستراتيجية حول حجم القوى العاملة ومستويات التعويض.",
    targetEn: "Should be optimized for productivity and competitiveness",
    targetAr: "يجب تحسينه للإنتاجية والقدرة التنافسية",
    category: 'financial' as const
  },

  womenHiringRate: {
    titleEn: "Women Hiring Rate",
    titleAr: "معدل توظيف النساء",
    descriptionEn: "Percentage of women hired across all departments in the organization",
    descriptionAr: "نسبة النساء المعينات في جميع الأقسام في المؤسسة",
    formulaEn: "(Women Hired / Total New Hires) × 100",
    formulaAr: "(النساء المعينات / إجمالي التعيينات الجديدة) × 100",
    importanceEn: "Essential for promoting gender diversity, achieving Vision 2030 goals, and creating inclusive workplace culture. Helps track progress in women's workforce participation.",
    importanceAr: "ضروري لتعزيز التنوع الجنسي وتحقيق أهداف رؤية 2030 وخلق ثقافة مكان عمل شاملة. يساعد في تتبع التقدم في مشاركة المرأة في القوى العاملة.",
    targetEn: "Align with Vision 2030: 30% women workforce participation by 2030",
    targetAr: "التماشي مع رؤية 2030: 30% مشاركة المرأة في القوى العاملة بحلول 2030",
    category: 'strategic' as const
  },

  womenTurnoverRate: {
    titleEn: "Women Turnover Rate by Department",
    titleAr: "معدل دوران النساء حسب القسم",
    descriptionEn: "Percentage of women employees who leave each department within a specific period",
    descriptionAr: "نسبة الموظفات اللاتي يتركن كل قسم خلال فترة محددة",
    formulaEn: "(Women Who Left Department / Average Women in Department) × 100",
    formulaAr: "(النساء اللاتي تركن القسم / متوسط النساء في القسم) × 100",
    importanceEn: "Identifies departments with retention challenges for women, helps improve work environment, career development opportunities, and work-life balance policies.",
    importanceAr: "يحدد الأقسام التي تواجه تحديات في الاحتفاظ بالنساء، ويساعد في تحسين بيئة العمل وفرص التطوير المهني وسياسات التوازن بين العمل والحياة.",
    targetEn: "Lower than overall turnover rate, ideally below 10% annually",
    targetAr: "أقل من معدل الدوران الإجمالي، ويفضل أقل من 10% سنوياً",
    category: 'strategic' as const
  }
};