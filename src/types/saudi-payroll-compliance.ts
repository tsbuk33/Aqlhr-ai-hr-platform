// Saudi Labor Law Compliance Types for Payroll Calculations

export interface SaudiLaborCompliance {
  id: string;
  company_id: string;
  employee_id: string;
  calculation_period: string;
  base_salary: number;
  allowances: ComprehensiveAllowances;
  overtime: OvertimeCalculation;
  shifts: ShiftDifferentials;
  ramadan: RamadanAdjustments;
  hajj: HajjLeaveEntitlement;
  eos: EndOfServiceBenefits;
  bonuses: PerformanceBonuses;
  danger_pay: DangerPayCalculation;
  total_gross: number;
  total_deductions: number;
  net_pay: number;
  compliance_score: number;
  calculation_date: string;
}

export interface ComprehensiveAllowances {
  housing: HousingAllowance;
  transport: TransportAllowance;
  educational: EducationalAllowance;
  family: FamilyAllowances;
  cost_of_living: number;
  medical: number;
  communication: number;
  fuel: number;
  meal: number;
  uniform: number;
  tools: number;
  representation: number;
}

export interface HousingAllowance {
  type: 'company_provided' | 'allowance_paid' | 'rent_subsidy';
  amount: number;
  calculation_method: 'fixed' | 'percentage_of_salary' | 'market_rate';
  percentage?: number;
  max_amount?: number;
  location_factor: number; // Riyadh/Jeddah = 1.0, other cities vary
  family_size_multiplier: number;
  actual_rent?: number;
  is_taxable: boolean;
  affects_eos: boolean;
  affects_gosi: boolean;
}

export interface TransportAllowance {
  type: 'company_transport' | 'allowance_paid' | 'fuel_subsidy';
  amount: number;
  calculation_method: 'fixed' | 'distance_based' | 'fuel_cost';
  distance_km?: number;
  fuel_rate_per_km?: number;
  public_transport_subsidy?: number;
  parking_allowance?: number;
  is_taxable: boolean;
  affects_eos: boolean;
  affects_gosi: boolean;
}

export interface EducationalAllowance {
  employee_education: EducationBenefit;
  children_education: ChildrenEducationBenefit[];
  professional_development: ProfessionalDevelopmentBenefit;
  language_training: LanguageTrainingBenefit;
  certification_reimbursement: CertificationBenefit;
}

export interface EducationBenefit {
  amount: number;
  type: 'tuition_reimbursement' | 'scholarship' | 'study_leave_pay';
  institution_type: 'university' | 'institute' | 'online' | 'professional';
  max_annual_amount: number;
  eligibility_years_service: number;
  grade_requirement?: string;
  field_relevance: boolean;
  is_taxable: boolean;
}

export interface ChildrenEducationBenefit {
  child_age: number;
  education_level: 'kindergarten' | 'primary' | 'intermediate' | 'secondary' | 'university';
  amount: number;
  max_per_child: number;
  max_total_children: number;
  school_type: 'public' | 'private' | 'international';
  special_needs_bonus?: number;
}

export interface ProfessionalDevelopmentBenefit {
  amount: number;
  type: 'course_fees' | 'conference_attendance' | 'workshop_fees';
  max_annual_amount: number;
  approval_required: boolean;
  work_relevance_score: number;
}

export interface LanguageTrainingBenefit {
  amount: number;
  language: 'arabic' | 'english' | 'other';
  proficiency_bonus: number;
  certification_bonus: number;
  is_mandatory: boolean;
}

export interface CertificationBenefit {
  amount: number;
  certification_type: 'professional' | 'technical' | 'safety' | 'management';
  renewal_bonus: number;
  maintaining_certification_bonus: number;
}

export interface FamilyAllowances {
  spouse_allowance: SpouseAllowance;
  children_allowances: ChildAllowance[];
  dependent_parents_allowance: DependentAllowance;
  family_medical_allowance: FamilyMedicalAllowance;
  maternity_paternity: MaternityPaternityBenefits;
}

export interface SpouseAllowance {
  amount: number;
  working_spouse_reduction: number;
  eligibility_criteria: string[];
  nationality_factor: number;
  is_taxable: boolean;
}

export interface ChildAllowance {
  child_age: number;
  amount: number;
  special_needs_bonus?: number;
  academic_excellence_bonus?: number;
  sports_cultural_bonus?: number;
  max_age_limit: number;
  student_status_required: boolean;
}

export interface DependentAllowance {
  dependent_type: 'parent' | 'disabled_sibling' | 'other';
  amount: number;
  medical_care_bonus: number;
  age_factor: number;
}

export interface FamilyMedicalAllowance {
  family_size: number;
  base_amount: number;
  per_dependent_amount: number;
  chronic_condition_bonus: number;
  dental_vision_bonus: number;
}

export interface MaternityPaternityBenefits {
  maternity_leave_days: number;
  maternity_pay_percentage: number;
  paternity_leave_days: number;
  paternity_pay_percentage: number;
  adoption_leave_days: number;
  newborn_bonus: number;
}

export interface OvertimeCalculation {
  regular_hours: number;
  overtime_hours: number;
  overtime_tiers: OvertimeTier[];
  ramadan_overtime: RamadanOvertimeRules;
  weekend_overtime: WeekendOvertimeRules;
  holiday_overtime: HolidayOvertimeRules;
  total_overtime_amount: number;
  max_monthly_overtime_hours: number;
  annual_overtime_limit: number;
}

export interface OvertimeTier {
  tier: 1 | 2 | 3;
  hours_range: { min: number; max: number };
  multiplier: 1.5 | 2.0 | 2.5;
  hours_worked: number;
  amount: number;
  applies_to: 'weekday' | 'weekend' | 'holiday' | 'ramadan';
}

export interface RamadanOvertimeRules {
  max_daily_hours: 6;
  overtime_after_hours: 6;
  overtime_multiplier: 2.0;
  special_allowance: number;
  iftar_bonus: number;
}

export interface WeekendOvertimeRules {
  friday_multiplier: 2.0;
  saturday_multiplier: 1.5;
  minimum_rest_hours: 24;
  consecutive_weekend_bonus: number;
}

export interface HolidayOvertimeRules {
  national_holiday_multiplier: 2.5;
  religious_holiday_multiplier: 2.5;
  company_holiday_multiplier: 2.0;
  holiday_reporting_bonus: number;
}

export interface ShiftDifferentials {
  night_shift: NightShiftDifferential;
  weekend_shift: WeekendShiftDifferential;
  holiday_shift: HolidayShiftDifferential;
  rotating_shift: RotatingShiftDifferential;
  on_call_differential: OnCallDifferential;
}

export interface NightShiftDifferential {
  start_time: string; // "22:00"
  end_time: string; // "06:00"
  percentage: number; // 15-25% of basic salary
  minimum_hours: number; // minimum hours to qualify
  amount: number;
  health_risk_bonus: number;
}

export interface WeekendShiftDifferential {
  friday_percentage: number;
  saturday_percentage: number;
  amount: number;
  family_time_compensation: number;
}

export interface HolidayShiftDifferential {
  percentage: number; // 50-100% premium
  amount: number;
  holiday_type: 'national' | 'religious' | 'company';
}

export interface RotatingShiftDifferential {
  rotation_frequency: 'weekly' | 'bi_weekly' | 'monthly';
  adaptation_bonus: number;
  schedule_disruption_bonus: number;
  amount: number;
}

export interface OnCallDifferential {
  on_call_hours: number;
  hourly_rate: number;
  callback_minimum_hours: number;
  callback_rate: number;
  total_amount: number;
}

export interface RamadanAdjustments {
  working_hours_reduction: number; // 2 hours reduction
  productivity_adjustment: number;
  iftar_allowance: number;
  suhoor_allowance: number;
  transportation_bonus: number;
  charity_deduction?: number;
  zakat_calculation?: number;
  salary_advance_ramadan?: number;
}

export interface HajjLeaveEntitlement {
  eligible: boolean;
  years_since_last_hajj: number;
  leave_days_entitled: number;
  paid_leave_days: number;
  unpaid_leave_days: number;
  hajj_bonus: number;
  travel_allowance: number;
  return_bonus: number;
  spouse_entitlement?: HajjSpouseEntitlement;
}

export interface HajjSpouseEntitlement {
  eligible: boolean;
  combined_leave: boolean;
  spouse_allowance: number;
  family_travel_bonus: number;
}

export interface EndOfServiceBenefits {
  service_years: number;
  service_months: number;
  termination_reason: 'resignation' | 'termination_with_cause' | 'termination_without_cause' | 'retirement' | 'death' | 'disability';
  calculation_method: 'saudi_labor_law' | 'contract_terms' | 'collective_agreement';
  salary_components: EOSSalaryComponents;
  calculation_tiers: EOSCalculationTier[];
  total_eos_amount: number;
  unused_leave_compensation: UnusedLeaveCompensation;
  notice_period_compensation: NoticePeriodCompensation;
  additional_benefits: EOSAdditionalBenefits;
}

export interface EOSSalaryComponents {
  basic_salary: number;
  allowances_included: string[];
  allowances_excluded: string[];
  average_commission: number;
  average_overtime: number;
  calculation_period_months: number;
}

export interface EOSCalculationTier {
  years_range: { min: number; max: number };
  days_per_year: number;
  salary_component: 'last_salary' | 'average_salary' | 'basic_salary';
  amount: number;
}

export interface UnusedLeaveCompensation {
  annual_leave_days: number;
  sick_leave_days: number;
  other_leave_days: number;
  daily_wage: number;
  total_compensation: number;
}

export interface NoticePeriodCompensation {
  required_notice_days: number;
  actual_notice_days: number;
  compensation_days: number;
  compensation_amount: number;
}

export interface EOSAdditionalBenefits {
  loyalty_bonus: number;
  performance_bonus: number;
  long_service_award: number;
  early_retirement_bonus?: number;
  disability_compensation?: number;
}

export interface PerformanceBonuses {
  individual_performance: IndividualPerformanceBonus;
  team_performance: TeamPerformanceBonus;
  company_performance: CompanyPerformanceBonus;
  kpi_bonuses: KPIBonus[];
  recognition_awards: RecognitionAward[];
  retention_bonuses: RetentionBonus[];
}

export interface IndividualPerformanceBonus {
  rating: 'exceptional' | 'exceeds' | 'meets' | 'below' | 'unsatisfactory';
  percentage: number;
  amount: number;
  goals_achieved: number;
  competency_score: number;
  leadership_bonus?: number;
}

export interface TeamPerformanceBonus {
  team_rating: number;
  individual_contribution: number;
  collaboration_score: number;
  amount: number;
}

export interface CompanyPerformanceBonus {
  profit_sharing_percentage: number;
  revenue_target_achievement: number;
  cost_saving_contribution: number;
  amount: number;
}

export interface KPIBonus {
  kpi_name: string;
  target_value: number;
  actual_value: number;
  achievement_percentage: number;
  bonus_amount: number;
  weight: number;
}

export interface RecognitionAward {
  award_type: 'employee_of_month' | 'innovation' | 'customer_service' | 'safety' | 'leadership';
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annual';
  nomination_based: boolean;
}

export interface RetentionBonus {
  tenure_milestone: number;
  amount: number;
  vesting_schedule: VestingSchedule;
  conditions: string[];
}

export interface VestingSchedule {
  total_amount: number;
  vesting_period_months: number;
  vested_amount: number;
  unvested_amount: number;
  clawback_conditions: string[];
}

export interface DangerPayCalculation {
  risk_level: 'low' | 'medium' | 'high' | 'extreme';
  hazard_types: HazardType[];
  base_danger_pay: number;
  risk_multiplier: number;
  safety_equipment_deduction: number;
  training_certification_bonus: number;
  incident_history_adjustment: number;
  total_danger_pay: number;
  insurance_premium_coverage: number;
}

export interface HazardType {
  type: 'chemical' | 'biological' | 'physical' | 'environmental' | 'psychological';
  severity: number;
  exposure_hours: number;
  protective_measures: string[];
  additional_compensation: number;
}

export interface PayrollComplianceValidation {
  labor_law_compliance: boolean;
  gosi_compliance: boolean;
  tax_compliance: boolean;
  contract_compliance: boolean;
  collective_agreement_compliance: boolean;
  violations: ComplianceViolation[];
  recommendations: ComplianceRecommendation[];
}

export interface ComplianceViolation {
  type: 'overtime_limit' | 'minimum_wage' | 'working_hours' | 'leave_entitlement' | 'discrimination';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  description_ar: string;
  resolution_required: boolean;
  deadline?: string;
  penalty_risk: number;
}

export interface ComplianceRecommendation {
  category: 'cost_optimization' | 'risk_mitigation' | 'process_improvement' | 'employee_satisfaction';
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  estimated_impact: number;
  implementation_effort: 'low' | 'medium' | 'high';
  priority: number;
}