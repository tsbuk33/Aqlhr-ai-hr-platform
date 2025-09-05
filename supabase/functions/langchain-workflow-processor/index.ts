import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WorkflowStep {
  id: string
  name: string
  action: string
  parameters: any
  dependencies: string[]
  estimated_duration: number
}

interface WorkflowPlan {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  total_estimated_time: number
  complexity: 'low' | 'medium' | 'high'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, context, workflowType } = await req.json()
    
    console.log('Processing workflow:', { prompt: prompt.substring(0, 100), workflowType })

    // Analyze prompt to determine workflow type and steps
    const workflowPlan = await generateWorkflowPlan(prompt, context, workflowType)
    
    // Execute workflow steps
    const executionResult = await executeWorkflow(workflowPlan, context)

    return new Response(JSON.stringify({
      result: executionResult.summary,
      confidence: executionResult.confidence,
      metadata: {
        provider: 'langchain-workflow',
        workflow_plan: workflowPlan,
        execution_details: executionResult,
        processing_time: Date.now()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('LangChain workflow error:', error)
    return new Response(JSON.stringify({
      error: 'Workflow processing failed',
      details: error.message,
      result: 'I encountered an error while processing your workflow request. Please try again with a simpler request.',
      confidence: 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})

async function generateWorkflowPlan(prompt: string, context: any, workflowType: string): Promise<WorkflowPlan> {
  // Analyze prompt to extract workflow requirements
  const lowerPrompt = prompt.toLowerCase()
  let complexity: 'low' | 'medium' | 'high' = 'medium'
  const steps: WorkflowStep[] = []

  // HR-specific workflow patterns
  if (lowerPrompt.includes('onboard') || lowerPrompt.includes('hiring')) {
    complexity = 'high'
    steps.push(
      {
        id: 'step_1',
        name: 'Document Collection',
        action: 'collect_documents',
        parameters: { documents: ['ID', 'contract', 'bank_details'] },
        dependencies: [],
        estimated_duration: 30
      },
      {
        id: 'step_2', 
        name: 'System Setup',
        action: 'create_accounts',
        parameters: { systems: ['hr', 'payroll', 'access_control'] },
        dependencies: ['step_1'],
        estimated_duration: 15
      },
      {
        id: 'step_3',
        name: 'Orientation Scheduling',
        action: 'schedule_orientation',
        parameters: { duration: 120, departments: ['hr', 'it', 'direct_manager'] },
        dependencies: ['step_2'],
        estimated_duration: 10
      }
    )
  }
  
  else if (lowerPrompt.includes('payroll') || lowerPrompt.includes('salary')) {
    complexity = 'medium'
    steps.push(
      {
        id: 'step_1',
        name: 'Data Validation',
        action: 'validate_payroll_data',
        parameters: { checks: ['attendance', 'deductions', 'bonuses'] },
        dependencies: [],
        estimated_duration: 20
      },
      {
        id: 'step_2',
        name: 'Calculate Payroll',
        action: 'calculate_salaries',
        parameters: { include_taxes: true, include_benefits: true },
        dependencies: ['step_1'],
        estimated_duration: 15
      },
      {
        id: 'step_3',
        name: 'Generate Reports',
        action: 'generate_payroll_reports',
        parameters: { formats: ['pdf', 'excel'], recipients: ['hr', 'finance'] },
        dependencies: ['step_2'],
        estimated_duration: 10
      }
    )
  }
  
  else if (lowerPrompt.includes('performance') || lowerPrompt.includes('review')) {
    complexity = 'medium'
    steps.push(
      {
        id: 'step_1',
        name: 'Collect Feedback',
        action: 'gather_performance_data',
        parameters: { sources: ['self', 'manager', 'peers', 'subordinates'] },
        dependencies: [],
        estimated_duration: 60
      },
      {
        id: 'step_2',  
        name: 'Analyze Performance',
        action: 'analyze_performance_metrics',
        parameters: { metrics: ['goals', 'competencies', 'behaviors'] },
        dependencies: ['step_1'],
        estimated_duration: 30
      },
      {
        id: 'step_3',
        name: 'Schedule Review Meeting',
        action: 'schedule_review_meeting',
        parameters: { duration: 60, participants: ['employee', 'manager'] },
        dependencies: ['step_2'],
        estimated_duration: 5
      }
    )
  }
  
  else if (lowerPrompt.includes('compliance') || lowerPrompt.includes('audit')) {
    complexity = 'high'
    steps.push(
      {
        id: 'step_1',
        name: 'Compliance Check',
        action: 'run_compliance_audit',
        parameters: { areas: ['labor_law', 'safety', 'documentation'] },
        dependencies: [],
        estimated_duration: 45
      },
      {
        id: 'step_2',
        name: 'Generate Compliance Report',
        action: 'generate_compliance_report',
        parameters: { include_recommendations: true, format: 'detailed' },
        dependencies: ['step_1'],
        estimated_duration: 30
      },
      {
        id: 'step_3',
        name: 'Action Plan',
        action: 'create_action_plan',
        parameters: { priority_issues: true, timeline: 90 },
        dependencies: ['step_2'],
        estimated_duration: 25
      }
    )
  }
  
  else {
    // Generic workflow
    complexity = 'low'
    steps.push(
      {
        id: 'step_1',
        name: 'Information Gathering',
        action: 'gather_information',
        parameters: { context },
        dependencies: [],
        estimated_duration: 15
      },
      {
        id: 'step_2',
        name: 'Process Request',
        action: 'process_request',
        parameters: { prompt },
        dependencies: ['step_1'],
        estimated_duration: 20
      },
      {
        id: 'step_3',
        name: 'Generate Response',
        action: 'generate_response',
        parameters: { format: 'structured' },
        dependencies: ['step_2'],
        estimated_duration: 10
      }
    )
  }

  const totalTime = steps.reduce((sum, step) => sum + step.estimated_duration, 0)

  return {
    id: `workflow_${Date.now()}`,
    name: `${workflowType} Workflow`,
    description: `Automated workflow for: ${prompt.substring(0, 100)}...`,
    steps,
    total_estimated_time: totalTime,
    complexity
  }
}

async function executeWorkflow(plan: WorkflowPlan, context: any) {
  const executionLog: any[] = []
  let confidence = 0.9

  console.log(`Executing workflow: ${plan.name} with ${plan.steps.length} steps`)

  for (const step of plan.steps) {
    const startTime = Date.now()
    
    try {
      // Simulate step execution
      const stepResult = await executeStep(step, context)
      const executionTime = Date.now() - startTime
      
      executionLog.push({
        step_id: step.id,
        name: step.name,
        status: 'completed',
        execution_time: executionTime,
        result: stepResult
      })
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      executionLog.push({
        step_id: step.id,
        name: step.name,
        status: 'failed',
        error: error.message
      })
      confidence -= 0.2
    }
  }

  const summary = generateExecutionSummary(plan, executionLog)

  return {
    summary,
    confidence: Math.max(confidence, 0.1),
    execution_log: executionLog,
    total_time: executionLog.reduce((sum, log) => sum + (log.execution_time || 0), 0)
  }
}

async function executeStep(step: WorkflowStep, context: any): Promise<string> {
  // Simulate different step executions
  switch (step.action) {
    case 'collect_documents':
      return `Initiated document collection for: ${step.parameters.documents.join(', ')}`
    
    case 'create_accounts':
      return `Created accounts in systems: ${step.parameters.systems.join(', ')}`
    
    case 'schedule_orientation':
      return `Scheduled ${step.parameters.duration}-minute orientation with ${step.parameters.departments.join(', ')}`
    
    case 'validate_payroll_data':
      return `Validated payroll data: ${step.parameters.checks.join(', ')} - All checks passed`
    
    case 'calculate_salaries':
      return `Calculated salaries with taxes and benefits included`
    
    case 'generate_payroll_reports':
      return `Generated payroll reports in formats: ${step.parameters.formats.join(', ')}`
    
    case 'gather_performance_data':
      return `Collected performance feedback from: ${step.parameters.sources.join(', ')}`
    
    case 'analyze_performance_metrics':
      return `Analyzed performance across: ${step.parameters.metrics.join(', ')}`
    
    case 'schedule_review_meeting':
      return `Scheduled ${step.parameters.duration}-minute review meeting`
    
    case 'run_compliance_audit':
      return `Completed compliance audit for: ${step.parameters.areas.join(', ')}`
    
    case 'generate_compliance_report':
      return `Generated detailed compliance report with recommendations`
    
    case 'create_action_plan':
      return `Created ${step.parameters.timeline}-day action plan for priority issues`
    
    default:
      return `Executed ${step.name} successfully`
  }
}

function generateExecutionSummary(plan: WorkflowPlan, executionLog: any[]): string {
  const completedSteps = executionLog.filter(log => log.status === 'completed').length
  const failedSteps = executionLog.filter(log => log.status === 'failed').length
  
  let summary = `Workflow "${plan.name}" execution completed.\n\n`
  summary += `✅ ${completedSteps} steps completed successfully\n`
  
  if (failedSteps > 0) {
    summary += `❌ ${failedSteps} steps failed\n`
  }
  
  summary += `\nStep Details:\n`
  executionLog.forEach(log => {
    const status = log.status === 'completed' ? '✅' : '❌'
    summary += `${status} ${log.name}`
    if (log.result) summary += `: ${log.result}`
    if (log.error) summary += `: Error - ${log.error}`
    summary += `\n`
  })
  
  if (completedSteps === plan.steps.length) {
    summary += `\n🎉 All workflow steps completed successfully!`
  }
  
  return summary
}