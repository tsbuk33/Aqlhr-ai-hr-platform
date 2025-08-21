export const disclaimerEN = 
  'Diagnostic frameworks used: Competing Values (CVF), Cultural Web, and Schein. Hofstede figures provide national cultural context only and are not a measure of company culture. Results are directional, not clinical psychometrics. Anonymity is enforced (groups with n<7 are suppressed). No PII is exported; only aggregated metrics. Government logos/integrations shown for identification; no endorsement implied.';

export const disclaimerAR = 
  'الأطر التشخيصية المستخدمة: نموذج القيم المتنافسة (CVF) و«النسيج الثقافي» و«شاين». تمثل أرقام هوفستد سياقًا وطنيًا فقط وليست قياسًا لثقافة الشركة. النتائج إرشادية وليست اختبارات نفسية سريرية. تُطبق السرية (إخفاء المجموعات ذات n<7). لا يتم تصدير أي بيانات شخصية؛ المؤشرات المصدَّرة مجمّعة فقط. الشعارات الحكومية لغرض التعريف ولا تعني تأييدًا رسميًا.';

export function footerFor(lang: 'en' | 'ar'): string {
  return lang === 'ar' ? disclaimerAR : disclaimerEN;
}

export const translations = {
  en: {
    corporateCultureIntelligence: 'Corporate Culture Intelligence',
    survey: 'Survey',
    wave: 'Wave',
    asOf: 'As of',
    balanceScore: 'Balance Score',
    culturalRiskIndex: 'Cultural Risk Index',
    psychologicalSafety: 'Psychological Safety',
    valuesAlignment: 'Values Alignment',
    topInitiatives: 'Top Initiatives',
    owner: 'Owner',
    priority: 'Priority',
    noInitiativesFound: 'No initiatives found',
    methodAnonymity: 'Method & Anonymity',
    anonymityEnforced: 'Anonymity enforced (n<7 suppressed). PDPL-compliant; no PII exported.',
    keyScores: 'Key Scores',
    competingValues: 'Competing Values (CVF)',
    heatmapByDepartment: 'Heatmap by Department',
    aiChangePlan: 'AI Change Plan — Top Initiatives',
    pulseSchedule: 'Pulse Schedule (30/60/90)',
    pulseDescription: 'Short pulse surveys scheduled at day 30, 60 and 90 with auto-tracking.',
    nextSteps: 'Next Steps',
    nextStepsDescription: 'Apply plan, monitor pulses, re-compute scores, and review adoption.',
    balance: 'Balance',
    risk: 'Risk',
    psychSafety: 'Psych Safety'
  },
  ar: {
    corporateCultureIntelligence: 'ذكاء الثقافة المؤسسية',
    survey: 'المسح',
    wave: 'الموجة',
    asOf: 'التاريخ',
    balanceScore: 'التوازن الثقافي',
    culturalRiskIndex: 'مؤشر المخاطر الثقافية',
    psychologicalSafety: 'السلامة النفسية',
    valuesAlignment: 'توافق القيم',
    topInitiatives: 'أفضل المبادرات',
    owner: 'المالك',
    priority: 'الأولوية',
    noInitiativesFound: 'لا توجد مبادرات',
    methodAnonymity: 'المنهجية والسرية',
    anonymityEnforced: 'تُطبق السرية (إخفاء المجموعات n<7). متوافق مع PDPL؛ لا بيانات شخصية في التصدير.',
    keyScores: 'المؤشرات الأساسية',
    competingValues: 'نموذج القيم المتنافسة (CVF)',
    heatmapByDepartment: 'الخريطة الحرارية حسب الإدارة',
    aiChangePlan: 'خطة التغيير بالذكاء الاصطناعي — أهم المبادرات',
    pulseSchedule: 'نبضات المتابعة (30/60/90)',
    pulseDescription: 'استبيانات قصيرة مجدولة في الأيام 30 و60 و90 مع تتبع تلقائي.',
    nextSteps: 'الخطوات التالية',
    nextStepsDescription: 'تطبيق الخطة، متابعة النبضات، إعادة احتساب المؤشرات، ومراجعة التبنّي.',
    balance: 'التوازن',
    risk: 'المخاطر',
    psychSafety: 'السلامة النفسية'
  }
};

export function t(key: keyof typeof translations.en, lang: 'en' | 'ar'): string {
  return translations[lang][key];
}