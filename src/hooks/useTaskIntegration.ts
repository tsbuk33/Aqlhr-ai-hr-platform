import { useTasks } from './useTasks';

export const useTaskIntegration = () => {
  const { createTask, sendNotification } = useTasks();

  // CCI Playbook integration - creates tasks for initiatives
  const createCCITask = async (initiative: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: Date;
    ownerRole: string;
    category: string;
  }) => {
    try {
      const taskId = await createTask({
        module: 'cci_playbook',
        title: `CCI Initiative: ${initiative.title}`,
        description: initiative.description,
        due_at: initiative.dueDate?.toISOString(),
        priority: initiative.priority,
        owner_role: initiative.ownerRole,
        metadata: {
          source: 'cci_playbook',
          category: initiative.category,
          initiative_type: 'culture_improvement',
          auto_generated: true
        }
      });

      return taskId;
    } catch (error) {
      console.error('Failed to create CCI task:', error);
      throw error;
    }
  };

  // Workflow automation integration
  const createWorkflowTask = async (workflow: {
    title: string;
    description: string;
    module: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: Date;
    ownerRole?: string;
    workflowId: string;
    stepId: string;
  }) => {
    try {
      const taskId = await createTask({
        module: workflow.module,
        title: workflow.title,
        description: workflow.description,
        due_at: workflow.dueDate?.toISOString(),
        priority: workflow.priority || 'medium',
        owner_role: workflow.ownerRole,
        metadata: {
          source: 'workflow_automation',
          workflow_id: workflow.workflowId,
          step_id: workflow.stepId,
          auto_generated: true
        }
      });

      return taskId;
    } catch (error) {
      console.error('Failed to create workflow task:', error);
      throw error;
    }
  };

  // AI-generated task creation
  const createAITask = async (aiTask: {
    title: string;
    description: string;
    module: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: Date;
    ownerRole: string;
    aiModel: string;
    confidence: number;
  }) => {
    try {
      const taskId = await createTask({
        module: aiTask.module,
        title: `AI Generated: ${aiTask.title}`,
        description: aiTask.description,
        due_at: aiTask.dueDate?.toISOString(),
        priority: aiTask.priority,
        owner_role: aiTask.ownerRole,
        metadata: {
          source: 'ai_generated',
          ai_model: aiTask.aiModel,
          confidence_score: aiTask.confidence,
          auto_generated: true
        }
      });

      return taskId;
    } catch (error) {
      console.error('Failed to create AI task:', error);
      throw error;
    }
  };

  // Bulk task creation for compliance checks
  const createComplianceTasks = async (complianceItems: Array<{
    title: string;
    description: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    ownerRole: string;
    complianceType: string;
  }>) => {
    try {
      const taskIds = await Promise.all(
        complianceItems.map(item => createTask({
          module: 'compliance',
          title: `Compliance: ${item.title}`,
          description: item.description,
          due_at: item.dueDate.toISOString(),
          priority: item.priority,
          owner_role: item.ownerRole,
          metadata: {
            source: 'compliance_automation',
            compliance_type: item.complianceType,
            auto_generated: true
          }
        }))
      );

      return taskIds;
    } catch (error) {
      console.error('Failed to create compliance tasks:', error);
      throw error;
    }
  };

  return {
    createCCITask,
    createWorkflowTask,
    createAITask,
    createComplianceTasks,
    sendNotification
  };
};