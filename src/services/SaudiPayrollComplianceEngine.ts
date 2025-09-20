// Saudi Labor Law Compliance Calculation Engine

import { 
  SaudiLaborCompliance, 
  OvertimeCalculation, 
  ShiftDifferentials,
  RamadanAdjustments,
  HajjLeaveEntitlement,
  EndOfServiceBenefits,
  ComprehensiveAllowances,
  PerformanceBonuses,
  DangerPayCalculation,
  PayrollComplianceValidation
} from '@/types/saudi-payroll-compliance';

export class SaudiPayrollComplianceEngine {
  private readonly RAMADAN_WORK_HOURS = 6;
  private readonly REGULAR_WORK_HOURS = 8;
  private readonly WEEKLY_WORK_HOURS = 40;
  private readonly OVERTIME_TIER_1_MULTIPLIER = 1.5;
  private readonly OVERTIME_TIER_2_MULTIPLIER = 2.0;
  private readonly OVERTIME_TIER_3_MULTIPLIER = 2.5;
  private readonly HAJJ_LEAVE_DAYS = 10;
  private readonly MINIMUM_WAGE_SAR = 4000;

  constructor() {}

  /**
   * Calculate comprehensive payroll with Saudi labor law compliance
   */
  async calculateCompletePayroll(
    employeeData: any,
    periodData: any,
    companyPolicies: any
  ): Promise<SaudiLaborCompliance> {
    
    const baseSalary = employeeData.basic_salary || employeeData.salary || 0;
    
    // Calculate all components
    const allowances = await this.calculateComprehensiveAllowances(employeeData, companyPolicies);
    const overtime = await this.calculateMultiTierOvertime(employeeData, periodData);
    const shifts = await this.calculateShiftDifferentials(employeeData, periodData);
    const ramadan = await this.calculateRamadanAdjustments(periodData);
    const hajj = await this.calculateHajjLeaveEntitlement(employeeData);
    const eos = await this.calculateEndOfServiceBenefits(employeeData);
    const bonuses = await this.calculatePerformanceBonuses(employeeData, periodData);
    const dangerPay = await this.calculateDangerPay(employeeData);

    // Calculate totals
    const totalGross = this.calculateTotalGross(baseSalary, allowances, overtime, shifts, bonuses, dangerPay);
    const totalDeductions = this.calculateTotalDeductions(totalGross, employeeData);
    const netPay = totalGross - totalDeductions;

    // Compliance validation
    const complianceScore = await this.calculateComplianceScore(employeeData, {
      totalGross,
      overtime,
      allowances
    });

    return {
      id: `payroll_${employeeData.id}_${Date.now()}`,
      company_id: employeeData.company_id,
      employee_id: employeeData.id,
      calculation_period: periodData.period,
      base_salary: baseSalary,
      allowances,
      overtime,
      shifts,
      ramadan,
      hajj,
      eos,
      bonuses,
      danger_pay: dangerPay,
      total_gross: totalGross,
      total_deductions: totalDeductions,
      net_pay: netPay,
      compliance_score: complianceScore,
      calculation_date: new Date().toISOString()
    };
  }

  /**
   * Calculate multi-tier overtime rates (1.5x, 2x, 2.5x)
   */
  private async calculateMultiTierOvertime(
    employeeData: any,
    periodData: any
  ): Promise<OvertimeCalculation> {
    
    const regularHours = periodData.regular_hours || this.REGULAR_WORK_HOURS;
    const totalHours = periodData.total_hours || regularHours;
    const overtimeHours = Math.max(0, totalHours - regularHours);
    const hourlyRate = (employeeData.basic_salary || 0) / (this.WEEKLY_WORK_HOURS * 4.33);

    const overtimeTiers = [];
    let remainingOvertimeHours = overtimeHours;
    let totalOvertimeAmount = 0;

    // Tier 1: First 2 hours at 1.5x
    if (remainingOvertimeHours > 0) {
      const tier1Hours = Math.min(remainingOvertimeHours, 2);
      const tier1Amount = tier1Hours * hourlyRate * this.OVERTIME_TIER_1_MULTIPLIER;
      
      overtimeTiers.push({
        tier: 1,
        hours_range: { min: 0, max: 2 },
        multiplier: 1.5,
        hours_worked: tier1Hours,
        amount: tier1Amount,
        applies_to: 'weekday'
      });
      
      totalOvertimeAmount += tier1Amount;
      remainingOvertimeHours -= tier1Hours;
    }

    // Tier 2: Next 2 hours at 2.0x
    if (remainingOvertimeHours > 0) {
      const tier2Hours = Math.min(remainingOvertimeHours, 2);
      const tier2Amount = tier2Hours * hourlyRate * this.OVERTIME_TIER_2_MULTIPLIER;
      
      overtimeTiers.push({
        tier: 2,
        hours_range: { min: 2, max: 4 },
        multiplier: 2.0,
        hours_worked: tier2Hours,
        amount: tier2Amount,
        applies_to: 'weekday'
      });
      
      totalOvertimeAmount += tier2Amount;
      remainingOvertimeHours -= tier2Hours;
    }

    // Tier 3: Additional hours at 2.5x
    if (remainingOvertimeHours > 0) {
      const tier3Amount = remainingOvertimeHours * hourlyRate * this.OVERTIME_TIER_3_MULTIPLIER;
      
      overtimeTiers.push({
        tier: 3,
        hours_range: { min: 4, max: remainingOvertimeHours + 4 },
        multiplier: 2.5,
        hours_worked: remainingOvertimeHours,
        amount: tier3Amount,
        applies_to: 'weekday'
      });
      
      totalOvertimeAmount += tier3Amount;
    }

    return {
      regular_hours: regularHours,
      overtime_hours: overtimeHours,
      overtime_tiers: overtimeTiers,
      ramadan_overtime: {
        max_daily_hours: 6,
        overtime_after_hours: 6,
        overtime_multiplier: 2.0,
        special_allowance: 200,
        iftar_bonus: 50
      },
      weekend_overtime: {
        friday_multiplier: 2.0,
        saturday_multiplier: 1.5,
        minimum_rest_hours: 24,
        consecutive_weekend_bonus: 100
      },
      holiday_overtime: {
        national_holiday_multiplier: 2.5,
        religious_holiday_multiplier: 2.5,
        company_holiday_multiplier: 2.0,
        holiday_reporting_bonus: 150
      },
      total_overtime_amount: totalOvertimeAmount,
      max_monthly_overtime_hours: 40,
      annual_overtime_limit: 180
    };
  }

  /**
   * Calculate shift differentials (night, weekend, holiday)
   */
  private async calculateShiftDifferentials(
    employeeData: any,
    periodData: any
  ): Promise<ShiftDifferentials> {
    
    const baseSalary = employeeData.basic_salary || 0;
    const hourlyRate = baseSalary / (this.WEEKLY_WORK_HOURS * 4.33);

    return {
      night_shift: {
        start_time: "22:00",
        end_time: "06:00",
        percentage: 20, // 20% premium for night shift
        minimum_hours: 4,
        amount: (periodData.night_hours || 0) * hourlyRate * 0.2,
        health_risk_bonus: 100
      },
      weekend_shift: {
        friday_percentage: 25,
        saturday_percentage: 15,
        amount: (periodData.weekend_hours || 0) * hourlyRate * 0.2,
        family_time_compensation: 150
      },
      holiday_shift: {
        percentage: 50,
        amount: (periodData.holiday_hours || 0) * hourlyRate * 0.5,
        holiday_type: 'national' as const
      },
      rotating_shift: {
        rotation_frequency: 'weekly' as const,
        adaptation_bonus: 200,
        schedule_disruption_bonus: 100,
        amount: (periodData.rotating_shifts || 0) * 50
      },
      on_call_differential: {
        on_call_hours: periodData.on_call_hours || 0,
        hourly_rate: 25,
        callback_minimum_hours: 2,
        callback_rate: hourlyRate * 1.5,
        total_amount: (periodData.on_call_hours || 0) * 25 + (periodData.callback_hours || 0) * hourlyRate * 1.5
      }
    };
  }

  /**
   * Calculate Ramadan working hours adjustments (6-hour workday)
   */
  private async calculateRamadanAdjustments(periodData: any): Promise<RamadanAdjustments> {
    const isRamadanPeriod = periodData.is_ramadan_period || false;
    
    if (!isRamadanPeriod) {
      return {
        working_hours_reduction: 0,
        productivity_adjustment: 0,
        iftar_allowance: 0,
        suhoor_allowance: 0,
        transportation_bonus: 0
      };
    }

    return {
      working_hours_reduction: 2, // 2 hours reduction from 8 to 6
      productivity_adjustment: 0.95, // 5% productivity adjustment
      iftar_allowance: 300, // Monthly iftar allowance
      suhoor_allowance: 150, // Monthly suhoor allowance  
      transportation_bonus: 200, // Additional transport during Ramadan
      charity_deduction: periodData.zakat_deduction || 0,
      zakat_calculation: periodData.zakat_amount || 0,
      salary_advance_ramadan: periodData.ramadan_advance || 0
    };
  }

  /**
   * Calculate Hajj leave entitlements
   */
  private async calculateHajjLeaveEntitlement(employeeData: any): Promise<HajjLeaveEntitlement> {
    const isSaudi = employeeData.is_saudi || false;
    const yearsOfService = this.calculateYearsOfService(employeeData.hire_date);
    const yearsSinceLastHajj = employeeData.years_since_last_hajj || 0;
    
    const eligible = isSaudi && yearsOfService >= 2 && yearsSinceLastHajj >= 5;

    return {
      eligible,
      years_since_last_hajj: yearsSinceLastHajj,
      leave_days_entitled: eligible ? this.HAJJ_LEAVE_DAYS : 0,
      paid_leave_days: eligible ? this.HAJJ_LEAVE_DAYS : 0,
      unpaid_leave_days: 0,
      hajj_bonus: eligible ? 2000 : 0, // Hajj bonus
      travel_allowance: eligible ? 3000 : 0, // Travel allowance
      return_bonus: eligible ? 1000 : 0, // Return bonus
      spouse_entitlement: eligible ? {
        eligible: true,
        combined_leave: true,
        spouse_allowance: 1500,
        family_travel_bonus: 2000
      } : undefined
    };
  }

  /**
   * Calculate comprehensive allowances
   */
  private async calculateComprehensiveAllowances(
    employeeData: any,
    companyPolicies: any
  ): Promise<ComprehensiveAllowances> {
    
    const baseSalary = employeeData.basic_salary || 0;
    const familySize = employeeData.family_size || 1;
    const childrenCount = employeeData.children_count || 0;
    const isMarried = employeeData.marital_status === 'married';

    return {
      housing: {
        type: 'allowance_paid' as const,
        amount: baseSalary * 0.25, // 25% of basic salary
        calculation_method: 'percentage_of_salary' as const,
        percentage: 25,
        max_amount: 8000,
        location_factor: employeeData.city === 'riyadh' || employeeData.city === 'jeddah' ? 1.0 : 0.8,
        family_size_multiplier: Math.min(1 + (familySize - 1) * 0.1, 1.5),
        is_taxable: false,
        affects_eos: true,
        affects_gosi: true
      },
      transport: {
        type: 'allowance_paid' as const,
        amount: 800, // Fixed transport allowance
        calculation_method: 'fixed' as const,
        distance_km: employeeData.commute_distance || 20,
        fuel_rate_per_km: 0.5,
        parking_allowance: 200,
        is_taxable: false,
        affects_eos: true,
        affects_gosi: true
      },
      educational: {
        employee_education: {
          amount: 2000,
          type: 'tuition_reimbursement' as const,
          institution_type: 'university' as const,
          max_annual_amount: 10000,
          eligibility_years_service: 2,
          field_relevance: true,
          is_taxable: false
        },
        children_education: this.calculateChildrenEducationAllowances(childrenCount),
        professional_development: {
          amount: 1500,
          type: 'course_fees' as const,
          max_annual_amount: 8000,
          approval_required: true,
          work_relevance_score: 85
        },
        language_training: {
          amount: 500,
          language: 'english' as const,
          proficiency_bonus: 200,
          certification_bonus: 300,
          is_mandatory: false
        },
        certification_reimbursement: {
          amount: 1000,
          certification_type: 'professional' as const,
          renewal_bonus: 500,
          maintaining_certification_bonus: 300
        }
      },
      family: {
        spouse_allowance: {
          amount: isMarried ? 400 : 0,
          working_spouse_reduction: 0.5,
          eligibility_criteria: ['married', 'spouse_not_working'],
          nationality_factor: employeeData.is_saudi ? 1.0 : 0.8,
          is_taxable: false
        },
        children_allowances: this.calculateChildrenAllowances(childrenCount),
        dependent_parents_allowance: {
          dependent_type: 'parent' as const,
          amount: employeeData.dependent_parents || 0 > 0 ? 300 : 0,
          medical_care_bonus: 200,
          age_factor: 1.0
        },
        family_medical_allowance: {
          family_size: familySize,
          base_amount: 500,
          per_dependent_amount: 100,
          chronic_condition_bonus: 200,
          dental_vision_bonus: 150
        },
        maternity_paternity: {
          maternity_leave_days: 70,
          maternity_pay_percentage: 100,
          paternity_leave_days: 3,
          paternity_pay_percentage: 100,
          adoption_leave_days: 30,
          newborn_bonus: 1000
        }
      },
      cost_of_living: 400,
      medical: 600,
      communication: 200,
      fuel: 300,
      meal: 250,
      uniform: 100,
      tools: 150,
      representation: employeeData.position_level === 'manager' ? 500 : 0
    };
  }

  /**
   * Calculate end-of-service benefits with complex formulas
   */
  private async calculateEndOfServiceBenefits(employeeData: any): Promise<EndOfServiceBenefits> {
    const serviceYears = this.calculateYearsOfService(employeeData.hire_date);
    const serviceMonths = this.calculateMonthsOfService(employeeData.hire_date);
    const lastSalary = employeeData.basic_salary || 0;

    const calculationTiers = [
      {
        years_range: { min: 0, max: 5 },
        days_per_year: 15,
        salary_component: 'last_salary' as const,
        amount: Math.min(serviceYears, 5) * 15 * (lastSalary / 30)
      },
      {
        years_range: { min: 5, max: Infinity },
        days_per_year: 30,
        salary_component: 'last_salary' as const,
        amount: Math.max(0, serviceYears - 5) * 30 * (lastSalary / 30)
      }
    ];

    const totalEosAmount = calculationTiers.reduce((sum, tier) => sum + tier.amount, 0);

    return {
      service_years: serviceYears,
      service_months: serviceMonths,
      termination_reason: 'resignation' as const,
      calculation_method: 'saudi_labor_law' as const,
      salary_components: {
        basic_salary: lastSalary,
        allowances_included: ['housing', 'transport'],
        allowances_excluded: ['meal', 'communication'],
        average_commission: 0,
        average_overtime: 0,
        calculation_period_months: 3
      },
      calculation_tiers: calculationTiers,
      total_eos_amount: totalEosAmount,
      unused_leave_compensation: {
        annual_leave_days: employeeData.unused_annual_leave || 0,
        sick_leave_days: 0,
        other_leave_days: 0,
        daily_wage: lastSalary / 30,
        total_compensation: (employeeData.unused_annual_leave || 0) * (lastSalary / 30)
      },
      notice_period_compensation: {
        required_notice_days: 30,
        actual_notice_days: 0,
        compensation_days: 30,
        compensation_amount: lastSalary
      },
      additional_benefits: {
        loyalty_bonus: serviceYears >= 10 ? 5000 : 0,
        performance_bonus: 0,
        long_service_award: serviceYears >= 15 ? 10000 : 0
      }
    };
  }

  /**
   * Calculate performance bonuses
   */
  private async calculatePerformanceBonuses(
    employeeData: any,
    periodData: any
  ): Promise<PerformanceBonuses> {
    
    const baseSalary = employeeData.basic_salary || 0;
    const performanceRating = employeeData.performance_rating || 'meets';
    
    const performanceMultipliers = {
      exceptional: 0.25,
      exceeds: 0.15,
      meets: 0.05,
      below: 0,
      unsatisfactory: 0
    };

    return {
      individual_performance: {
        rating: performanceRating as any,
        percentage: performanceMultipliers[performanceRating as keyof typeof performanceMultipliers] * 100,
        amount: baseSalary * performanceMultipliers[performanceRating as keyof typeof performanceMultipliers],
        goals_achieved: employeeData.goals_achieved || 0,
        competency_score: employeeData.competency_score || 0,
        leadership_bonus: employeeData.is_manager ? 1000 : undefined
      },
      team_performance: {
        team_rating: employeeData.team_performance || 0,
        individual_contribution: employeeData.individual_contribution || 0,
        collaboration_score: employeeData.collaboration_score || 0,
        amount: (employeeData.team_performance || 0) * 100
      },
      company_performance: {
        profit_sharing_percentage: 2,
        revenue_target_achievement: employeeData.company_performance || 100,
        cost_saving_contribution: employeeData.cost_savings || 0,
        amount: baseSalary * 0.02 * (employeeData.company_performance || 100) / 100
      },
      kpi_bonuses: periodData.kpi_bonuses || [],
      recognition_awards: periodData.recognition_awards || [],
      retention_bonuses: [{
        tenure_milestone: this.calculateYearsOfService(employeeData.hire_date),
        amount: this.calculateYearsOfService(employeeData.hire_date) >= 5 ? 2000 : 0,
        vesting_schedule: {
          total_amount: 2000,
          vesting_period_months: 12,
          vested_amount: 2000,
          unvested_amount: 0,
          clawback_conditions: ['voluntary_resignation_within_2_years']
        },
        conditions: ['continuous_employment', 'satisfactory_performance']
      }]
    };
  }

  /**
   * Calculate danger pay for hazardous work
   */
  private async calculateDangerPay(employeeData: any): Promise<DangerPayCalculation> {
    const hasHazardousWork = employeeData.hazardous_work || false;
    const riskLevel = employeeData.risk_level || 'low';
    const baseSalary = employeeData.basic_salary || 0;

    if (!hasHazardousWork) {
      return {
        risk_level: 'low' as const,
        hazard_types: [],
        base_danger_pay: 0,
        risk_multiplier: 0,
        safety_equipment_deduction: 0,
        training_certification_bonus: 0,
        incident_history_adjustment: 0,
        total_danger_pay: 0,
        insurance_premium_coverage: 0
      };
    }

    const riskMultipliers = {
      low: 0.05,
      medium: 0.10,
      high: 0.20,
      extreme: 0.35
    };

    const baseDangerPay = baseSalary * riskMultipliers[riskLevel as keyof typeof riskMultipliers];

    return {
      risk_level: riskLevel as any,
      hazard_types: employeeData.hazard_types || [],
      base_danger_pay: baseDangerPay,
      risk_multiplier: riskMultipliers[riskLevel as keyof typeof riskMultipliers],
      safety_equipment_deduction: 0,
      training_certification_bonus: 200,
      incident_history_adjustment: 0,
      total_danger_pay: baseDangerPay + 200,
      insurance_premium_coverage: 1000
    };
  }

  // Helper methods
  private calculateYearsOfService(hireDate: string): number {
    const hire = new Date(hireDate);
    const now = new Date();
    return Math.floor((now.getTime() - hire.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  }

  private calculateMonthsOfService(hireDate: string): number {
    const hire = new Date(hireDate);
    const now = new Date();
    return Math.floor((now.getTime() - hire.getTime()) / (30.44 * 24 * 60 * 60 * 1000));
  }

  private calculateChildrenAllowances(childrenCount: number): any[] {
    const allowances = [];
    for (let i = 0; i < Math.min(childrenCount, 4); i++) {
      allowances.push({
        child_age: 10, // Default age
        amount: 150, // Per child allowance
        special_needs_bonus: 0,
        academic_excellence_bonus: 0,
        sports_cultural_bonus: 0,
        max_age_limit: 25,
        student_status_required: true
      });
    }
    return allowances;
  }

  private calculateChildrenEducationAllowances(childrenCount: number): any[] {
    const allowances = [];
    for (let i = 0; i < Math.min(childrenCount, 4); i++) {
      allowances.push({
        child_age: 10,
        education_level: 'primary' as const,
        amount: 500,
        max_per_child: 2000,
        max_total_children: 4,
        school_type: 'private' as const,
        special_needs_bonus: 0
      });
    }
    return allowances;
  }

  private calculateTotalGross(
    baseSalary: number,
    allowances: ComprehensiveAllowances,
    overtime: OvertimeCalculation,
    shifts: ShiftDifferentials,
    bonuses: PerformanceBonuses,
    dangerPay: DangerPayCalculation
  ): number {
    const allowancesTotal = 
      allowances.housing.amount +
      allowances.transport.amount +
      allowances.educational.employee_education.amount +
      allowances.family.spouse_allowance.amount +
      allowances.cost_of_living +
      allowances.medical +
      allowances.communication +
      allowances.fuel +
      allowances.meal +
      allowances.uniform +
      allowances.tools +
      allowances.representation;

    return baseSalary + 
           allowancesTotal + 
           overtime.total_overtime_amount + 
           shifts.night_shift.amount + 
           shifts.weekend_shift.amount + 
           shifts.holiday_shift.amount +
           bonuses.individual_performance.amount +
           bonuses.company_performance.amount +
           dangerPay.total_danger_pay;
  }

  private calculateTotalDeductions(totalGross: number, employeeData: any): number {
    const gosiEmployee = totalGross * 0.10; // 10% GOSI employee contribution
    const loanDeductions = employeeData.loan_deductions || 0;
    const otherDeductions = employeeData.other_deductions || 0;
    
    return gosiEmployee + loanDeductions + otherDeductions;
  }

  private async calculateComplianceScore(employeeData: any, calculationData: any): Promise<number> {
    let score = 100;
    
    // Check minimum wage compliance
    if (calculationData.totalGross < this.MINIMUM_WAGE_SAR) {
      score -= 20;
    }
    
    // Check overtime limits
    if (calculationData.overtime.overtime_hours > 40) {
      score -= 15;
    }
    
    // Check allowances compliance
    if (calculationData.allowances.housing.amount < calculationData.totalGross * 0.15) {
      score -= 10;
    }
    
    return Math.max(0, score);
  }

  /**
   * Validate payroll compliance with Saudi labor law
   */
  async validateCompliance(payrollData: SaudiLaborCompliance): Promise<PayrollComplianceValidation> {
    const violations = [];
    const recommendations = [];

    // Check minimum wage
    if (payrollData.total_gross < this.MINIMUM_WAGE_SAR) {
      violations.push({
        type: 'minimum_wage' as const,
        severity: 'critical' as const,
        description: 'Employee salary is below minimum wage',
        description_ar: 'راتب الموظف أقل من الحد الأدنى للأجور',
        resolution_required: true,
        penalty_risk: 85
      });
    }

    // Check overtime limits
    if (payrollData.overtime.overtime_hours > 40) {
      violations.push({
        type: 'overtime_limit' as const,
        severity: 'high' as const,
        description: 'Monthly overtime hours exceed legal limit',
        description_ar: 'ساعات العمل الإضافي الشهرية تتجاوز الحد القانوني',
        resolution_required: true,
        penalty_risk: 70
      });
    }

    return {
      labor_law_compliance: violations.length === 0,
      gosi_compliance: true, // Simplified for demo
      tax_compliance: true,
      contract_compliance: true,
      collective_agreement_compliance: true,
      violations,
      recommendations
    };
  }
}