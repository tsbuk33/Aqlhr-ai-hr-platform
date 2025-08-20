export const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
export type Priority = typeof PRIORITIES[number];

export const GAP_KINDS = [
  'psych_safety_deficit',
  'over_hierarchy_vs_agility',
  'weak_cross_team_collab',
  'values_misalignment',
  'customer_voice_gap',
  'recognition_gap',
] as const;
export type GapKind = typeof GAP_KINDS[number];

export interface Gap {
  kind: GapKind;
  severity: number; // 0..100 (higher = worse)
  priority: Priority;
  evidence?: string[];
}

export interface KPI {
  name: string;
  targetDelta: number; // +5, -30, etc.
  unit: '%' | 'pts';
}

export interface Initiative {
  id: string;
  titleEN: string;
  titleAR: string;
  descriptionEN: string;
  descriptionAR: string;
  ownerRole: 'HR' | 'LineManager' | 'Executive' | 'HSE';
  durationDays: number;
  priority: Priority;
  kpis: KPI[];
  milestones: { titleEN: string; titleAR: string; dueInDays: number }[];
}

export interface Playbook {
  tenantId: string;
  surveyId: string;
  waveId: string;
  initiatives: Initiative[];
  pulses: { day: 30 | 60 | 90; questionsEN: string[]; questionsAR: string[] }[];
  summaryEN: string;
  summaryAR: string;
}

export function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${String(x)}`);
}

export function severityToPriority(sev: number): Priority {
  if (sev < 25) return 'low';
  if (sev < 50) return 'medium';
  if (sev < 75) return 'high';
  return 'critical';
}