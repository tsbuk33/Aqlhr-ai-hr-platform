import { Initiative, Priority } from './types';

export function makeInitiatives(priority: Priority): Initiative[] {
  const baseKPIs = {
    psychSafetyPlus5: { name: 'Psychological Safety', targetDelta: +5, unit: 'pts' as const },
    approvalsMinus30: { name: 'Approval cycle time', targetDelta: -30, unit: '%' as const },
    crossTeamPlus20: { name: 'Cross-team tasks', targetDelta: +20, unit: '%' as const },
  };

  const common: Initiative[] = [
    {
      id: 'manager-safety-training',
      titleEN: 'Manager Psychological Safety Training',
      titleAR: 'تدريب المديرين على السلامة النفسية',
      descriptionEN: 'Targeted workshops and practice with feedback.',
      descriptionAR: 'ورش عمل مستهدفة وممارسة مع تغذية راجعة.',
      ownerRole: 'HR',
      durationDays: 30,
      priority,
      kpis: [baseKPIs.psychSafetyPlus5],
      milestones: [
        { titleEN: 'Design curriculum', titleAR: 'تصميم المنهج', dueInDays: 7 },
        { titleEN: 'Pilot with 2 teams', titleAR: 'تجربة على فريقين', dueInDays: 20 },
        { titleEN: 'Full roll-out', titleAR: 'إطلاق كامل', dueInDays: 30 },
      ],
    },
    {
      id: 'decision-rights-raci',
      titleEN: 'Decision Rights Reset (RACI)',
      titleAR: 'إعادة ضبط صلاحيات القرار (RACI)',
      descriptionEN: 'Clarify who is Responsible, Accountable, Consulted, Informed.',
      descriptionAR: 'توضيح من المسؤول والمحاسب والمستشار والمُخطر.',
      ownerRole: 'Executive',
      durationDays: 45,
      priority,
      kpis: [baseKPIs.approvalsMinus30],
      milestones: [
        { titleEN: 'Map current approvals', titleAR: 'حصر الموافقات الحالية', dueInDays: 10 },
        { titleEN: 'Publish RACI', titleAR: 'نشر RACI', dueInDays: 25 },
        { titleEN: 'Audit adoption', titleAR: 'مراجعة الالتزام', dueInDays: 45 },
      ],
    },
    {
      id: 'cross-team-rituals',
      titleEN: 'Cross‑Team Weekly Rituals',
      titleAR: 'طقوس أسبوعية بين الفرق',
      descriptionEN: 'Weekly huddles to unblock dependencies.',
      descriptionAR: 'اجتماعات قصيرة أسبوعياً لإزالة العوائق.',
      ownerRole: 'LineManager',
      durationDays: 60,
      priority,
      kpis: [baseKPIs.crossTeamPlus20],
      milestones: [
        { titleEN: 'Pick time & cadence', titleAR: 'تحديد الوقت والإيقاع', dueInDays: 7 },
        { titleEN: 'First 4 sessions', titleAR: 'أول ٤ جلسات', dueInDays: 28 },
        { titleEN: 'Retrospective', titleAR: 'مراجعة وتحسين', dueInDays: 60 },
      ],
    },
    {
      id: 'recognition-refresh',
      titleEN: 'Recognition Refresh',
      titleAR: 'تجديد برنامج التقدير',
      descriptionEN: 'Make recognition visible and fair.',
      descriptionAR: 'جعل التقدير مرئياً وعادلاً.',
      ownerRole: 'HR',
      durationDays: 30,
      priority,
      kpis: [],
      milestones: [
        { titleEN: 'Define criteria', titleAR: 'تحديد المعايير', dueInDays: 7 },
        { titleEN: 'Launch monthly awards', titleAR: 'إطلاق جوائز شهرية', dueInDays: 30 },
      ],
    },
    {
      id: 'lean-approvals-pilot',
      titleEN: 'Lean Approvals Pilot',
      titleAR: 'تجربة تقليل طبقات الموافقة',
      descriptionEN: 'Reduce layers where risk is low.',
      descriptionAR: 'تقليل الطبقات حين المخاطر منخفضة.',
      ownerRole: 'Executive',
      durationDays: 30,
      priority,
      kpis: [baseKPIs.approvalsMinus30],
      milestones: [
        { titleEN: 'Pick one process', titleAR: 'اختيار عملية واحدة', dueInDays: 5 },
        { titleEN: 'Pilot & measure', titleAR: 'تجربة وقياس', dueInDays: 25 },
      ],
    },
    {
      id: 'customer-voice-huddles',
      titleEN: 'Customer‑Voice Huddles',
      titleAR: 'جلسات صوت العميل',
      descriptionEN: 'Short weekly reviews of customer feedback.',
      descriptionAR: 'مراجعات قصيرة أسبوعياً لتعليقات العملاء.',
      ownerRole: 'LineManager',
      durationDays: 30,
      priority,
      kpis: [],
      milestones: [
        { titleEN: 'Collect inputs', titleAR: 'جمع المدخلات', dueInDays: 7 },
        { titleEN: 'Weekly cadence', titleAR: 'وتيرة أسبوعية', dueInDays: 30 },
      ],
    },
  ];

  // Priority tunes the selection & ordering
  switch (priority) {
    case 'low':
      return [common[3]];
    case 'medium':
      return [common[0], common[3]];
    case 'high':
      return [common[0], common[1], common[2]];
    case 'critical':
      return [common[0], common[1], common[2], common[4], common[5]];
    default:
      return (() => {
        const _x: never = priority;
        return [];
      })();
  }
}