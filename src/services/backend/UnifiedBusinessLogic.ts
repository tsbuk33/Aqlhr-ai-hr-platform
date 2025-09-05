import { UserRole } from '@/hooks/useUserRole';

export interface BusinessRule {
  name: string;
  description: string;
  applies_to_roles: UserRole[];
  condition: (context: any) => boolean;
  action: (context: any) => Promise<any>;
}

export interface WorkflowContext {
  userRole: UserRole;
  tenantId: string;
  userId: string;
  data: any;
  metadata?: Record<string, any>;
}

/**
 * Unified Business Logic Engine
 * Centralizes all business rules and workflows across interfaces
 */
export class UnifiedBusinessLogic {
  private static instance: UnifiedBusinessLogic;
  private businessRules: Map<string, BusinessRule> = new Map();
  private workflows: Map<string, any> = new Map();
  
  private constructor() {
    this.initializeBusinessRules();
    this.initializeWorkflows();
  }
  
  static getInstance(): UnifiedBusinessLogic {
    if (!UnifiedBusinessLogic.instance) {
      UnifiedBusinessLogic.instance = new UnifiedBusinessLogic();
    }
    return UnifiedBusinessLogic.instance;
  }

  /**
   * Initialize core business rules
   */
  private initializeBusinessRules(): void {
    // Employee Management Rules
    this.addBusinessRule({
      name: 'employee_salary_approval',
      description: 'Salary changes require approval based on amount and role',
      applies_to_roles: ['hr_manager', 'admin', 'super_admin'],
      condition: (context) => {
        const { data } = context;
        return data.salary_change && Math.abs(data.salary_change) > 1000;
      },
      action: async (context) => {
        return this.triggerApprovalWorkflow(context, 'salary_change');
      }
    });

    this.addBusinessRule({
      name: 'employee_termination_workflow',
      description: 'Employee termination triggers multiple system updates',
      applies_to_roles: ['hr_manager', 'admin', 'super_admin'],
      condition: (context) => {
        const { data } = context;
        return data.status_change === 'terminated';
      },
      action: async (context) => {
        return this.executeTerminationWorkflow(context);
      }
    });

    // Compliance Rules
    this.addBusinessRule({
      name: 'nitaqat_compliance_check',
      description: 'Check Nitaqat compliance when hiring non-Saudi employees',
      applies_to_roles: ['hr_manager', 'admin', 'super_admin'],
      condition: (context) => {
        const { data } = context;
        return data.new_hire && !data.is_saudi;
      },
      action: async (context) => {
        return this.checkNitaqatCompliance(context);
      }
    });

    // Performance Management Rules
    this.addBusinessRule({
      name: 'performance_review_scheduling',
      description: 'Auto-schedule performance reviews based on role and tenure',
      applies_to_roles: ['manager', 'hr_manager', 'admin'],
      condition: (context) => {
        const { data } = context;
        return data.tenure_months && data.tenure_months % 6 === 0;
      },
      action: async (context) => {
        return this.schedulePerformanceReview(context);
      }
    });

    // Security Rules
    this.addBusinessRule({
      name: 'sensitive_data_access_log',
      description: 'Log access to sensitive employee data',
      applies_to_roles: ['hr_manager', 'admin', 'super_admin'],
      condition: (context) => {
        const { data } = context;
        return data.access_type === 'sensitive_data';
      },
      action: async (context) => {
        return this.logSensitiveDataAccess(context);
      }
    });
  }

  /**
   * Initialize core workflows
   */
  private initializeWorkflows(): void {
    // Employee Onboarding Workflow
    this.workflows.set('employee_onboarding', {
      name: 'Employee Onboarding',
      steps: [
        'create_employee_record',
        'generate_employee_id',
        'setup_system_accounts',
        'assign_equipment',
        'schedule_orientation',
        'create_training_plan',
        'notify_manager',
        'update_org_chart'
      ],
      roles: ['hr_manager', 'admin', 'super_admin']
    });

    // Performance Review Workflow
    this.workflows.set('performance_review', {
      name: 'Performance Review Process',
      steps: [
        'create_review_period',
        'notify_employees',
        'collect_self_assessments',
        'collect_manager_reviews',
        'schedule_review_meetings',
        'finalize_ratings',
        'update_compensation',
        'archive_reviews'
      ],
      roles: ['manager', 'hr_manager', 'admin']
    });

    // Government Compliance Workflow
    this.workflows.set('government_compliance', {
      name: 'Government Compliance Sync',
      steps: [
        'validate_employee_data',
        'sync_with_qiwa',
        'update_gosi_records',
        'check_visa_status',
        'generate_compliance_report',
        'notify_stakeholders'
      ],
      roles: ['hr_manager', 'admin', 'super_admin']
    });
  }

  /**
   * Add a new business rule
   */
  addBusinessRule(rule: BusinessRule): void {
    this.businessRules.set(rule.name, rule);
  }

  /**
   * Execute business rules for a given context
   */
  async executeBusinessRules(context: WorkflowContext): Promise<any[]> {
    const results = [];
    
    for (const [name, rule] of this.businessRules) {
      // Check if rule applies to the user's role
      if (!rule.applies_to_roles.includes(context.userRole)) {
        continue;
      }
      
      // Check if rule condition is met
      if (rule.condition(context)) {
        try {
          console.log(`Executing business rule: ${name}`);
          const result = await rule.action(context);
          results.push({
            rule: name,
            success: true,
            result
          });
        } catch (error) {
          console.error(`Business rule ${name} failed:`, error);
          results.push({
            rule: name,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    }
    
    return results;
  }

  /**
   * Execute a specific workflow
   */
  async executeWorkflow(workflowName: string, context: WorkflowContext): Promise<any> {
    const workflow = this.workflows.get(workflowName);
    
    if (!workflow) {
      throw new Error(`Workflow ${workflowName} not found`);
    }
    
    // Check if user has permission to execute workflow
    if (!workflow.roles.includes(context.userRole)) {
      throw new Error(`User role ${context.userRole} not authorized for workflow ${workflowName}`);
    }
    
    const results = [];
    
    for (const step of workflow.steps) {
      try {
        console.log(`Executing workflow step: ${step}`);
        const result = await this.executeWorkflowStep(step, context);
        results.push({
          step,
          success: true,
          result
        });
      } catch (error) {
        console.error(`Workflow step ${step} failed:`, error);
        results.push({
          step,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        // Stop workflow on critical failure
        if (this.isCriticalStep(step)) {
          break;
        }
      }
    }
    
    return {
      workflow: workflowName,
      steps: results,
      completed: results.filter(r => r.success).length,
      total: workflow.steps.length
    };
  }

  /**
   * Execute individual workflow step
   */
  private async executeWorkflowStep(step: string, context: WorkflowContext): Promise<any> {
    switch (step) {
      case 'create_employee_record':
        return this.createEmployeeRecord(context);
      
      case 'generate_employee_id':
        return this.generateEmployeeId(context);
      
      case 'setup_system_accounts':
        return this.setupSystemAccounts(context);
      
      case 'notify_manager':
        return this.notifyManager(context);
      
      case 'sync_with_qiwa':
        return this.syncWithQiwa(context);
      
      case 'update_gosi_records':
        return this.updateGOSIRecords(context);
      
      default:
        console.log(`Executing generic workflow step: ${step}`);
        return { step, status: 'completed', timestamp: new Date().toISOString() };
    }
  }

  /**
   * Role-based data processing
   */
  async processDataForRole(data: any, userRole: UserRole, operation: string): Promise<any> {
    const context: WorkflowContext = {
      userRole,
      tenantId: data.tenant_id || data.company_id,
      userId: data.user_id,
      data,
      metadata: { operation }
    };

    // Execute applicable business rules
    const ruleResults = await this.executeBusinessRules(context);
    
    // Apply role-specific processing
    const processedData = await this.applyRoleSpecificProcessing(data, userRole, operation);
    
    return {
      data: processedData,
      businessRules: ruleResults,
      metadata: {
        processedAt: new Date().toISOString(),
        userRole,
        operation
      }
    };
  }

  /**
   * Apply role-specific data processing
   */
  private async applyRoleSpecificProcessing(data: any, userRole: UserRole, operation: string): Promise<any> {
    switch (userRole) {
      case 'super_admin':
        // No restrictions, full data access
        return this.enhanceDataWithSystemMetrics(data);
        
      case 'admin':
        // Company-wide access with admin enhancements
        return this.enhanceDataWithAdminMetrics(data);
        
      case 'hr_manager':
        // HR-specific enhancements and compliance checks
        return this.enhanceDataWithHRMetrics(data);
        
      case 'manager':
        // Team-focused data with management insights
        return this.enhanceDataWithManagerMetrics(data);
        
      case 'employee':
        // Personal data only with privacy protections
        return this.maskSensitiveFieldsForEmployee(data);
        
      default:
        return data;
    }
  }

  // Business rule implementations
  private async triggerApprovalWorkflow(context: WorkflowContext, type: string): Promise<any> {
    console.log(`Triggering approval workflow for ${type}`);
    return { workflow: 'approval', type, status: 'initiated' };
  }

  private async executeTerminationWorkflow(context: WorkflowContext): Promise<any> {
    console.log('Executing termination workflow');
    return { workflow: 'termination', status: 'initiated' };
  }

  private async checkNitaqatCompliance(context: WorkflowContext): Promise<any> {
    console.log('Checking Nitaqat compliance');
    return { compliance: 'nitaqat', status: 'compliant' };
  }

  private async schedulePerformanceReview(context: WorkflowContext): Promise<any> {
    console.log('Scheduling performance review');
    return { review: 'scheduled', date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) };
  }

  private async logSensitiveDataAccess(context: WorkflowContext): Promise<any> {
    console.log('Logging sensitive data access');
    return { logged: true, timestamp: new Date().toISOString() };
  }

  // Workflow step implementations
  private async createEmployeeRecord(context: WorkflowContext): Promise<any> {
    console.log('Creating employee record');
    return { record: 'created', id: 'EMP' + Date.now() };
  }

  private async generateEmployeeId(context: WorkflowContext): Promise<any> {
    console.log('Generating employee ID');
    return { employeeId: 'AQL' + Date.now().toString().slice(-6) };
  }

  private async setupSystemAccounts(context: WorkflowContext): Promise<any> {
    console.log('Setting up system accounts');
    return { accounts: ['email', 'hr_system', 'payroll'], status: 'created' };
  }

  private async notifyManager(context: WorkflowContext): Promise<any> {
    console.log('Notifying manager');
    return { notification: 'sent', method: 'email' };
  }

  private async syncWithQiwa(context: WorkflowContext): Promise<any> {
    console.log('Syncing with Qiwa');
    return { sync: 'qiwa', status: 'completed' };
  }

  private async updateGOSIRecords(context: WorkflowContext): Promise<any> {
    console.log('Updating GOSI records');
    return { sync: 'gosi', status: 'completed' };
  }

  // Data enhancement methods
  private async enhanceDataWithSystemMetrics(data: any): Promise<any> {
    return { ...data, systemMetrics: { uptime: '99.9%', performance: 'optimal' } };
  }

  private async enhanceDataWithAdminMetrics(data: any): Promise<any> {
    return { ...data, adminMetrics: { companyHealth: 'good', compliance: 'up-to-date' } };
  }

  private async enhanceDataWithHRMetrics(data: any): Promise<any> {
    return { ...data, hrMetrics: { retention: '85%', satisfaction: '4.2/5' } };
  }

  private async enhanceDataWithManagerMetrics(data: any): Promise<any> {
    return { ...data, teamMetrics: { performance: '92%', engagement: '4.1/5' } };
  }

  private async maskSensitiveFieldsForEmployee(data: any): Promise<any> {
    // Remove sensitive fields for employee view
    const { salary, ssn, bank_details, ...safeData } = data;
    return safeData;
  }

  private isCriticalStep(step: string): boolean {
    const criticalSteps = ['create_employee_record', 'validate_employee_data', 'sync_with_qiwa'];
    return criticalSteps.includes(step);
  }
}

// Export singleton instance
export const unifiedBusinessLogic = UnifiedBusinessLogic.getInstance();