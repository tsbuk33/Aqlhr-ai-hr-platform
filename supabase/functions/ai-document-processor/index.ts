import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { documentText, documentType, companyContext } = await req.json()
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const systemPrompt = `You are an AI expert in HR process analysis and automation. Your task is to analyze uploaded documents and extract actionable process, workflow, or form definitions that can be implemented in an HR system.

Company Context: ${companyContext || 'General HR system'}

For each document, provide a structured analysis with:
1. Document type classification (process, workflow, form, policy)
2. Extracted fields and data structures
3. Workflow steps and approval chains
4. Required form fields with validation rules
5. Integration points with HR modules
6. Arabic and English bilingual support requirements
7. Implementation recommendations

Return the analysis in this JSON structure:
{
  "documentType": "process|workflow|form|policy",
  "title": {"en": "English Title", "ar": "Arabic Title"},
  "description": {"en": "English Description", "ar": "Arabic Description"},
  "implementation": {
    "category": "employee_management|payroll|benefits|performance|recruitment|training|attendance|leave|succession|compensation|saudization|hse|self_service|manager_dashboard",
    "priority": "high|medium|low",
    "complexity": "simple|moderate|complex"
  },
  "extractedData": {
    "processSteps": [
      {
        "step": 1,
        "name": {"en": "Step Name", "ar": "اسم الخطوة"},
        "description": {"en": "Description", "ar": "الوصف"},
        "assignee": "role_name",
        "requirements": ["requirement1", "requirement2"],
        "outputs": ["output1", "output2"]
      }
    ],
    "approvalChain": [
      {
        "level": 1,
        "role": "direct_manager",
        "conditions": ["condition1"],
        "escalation": {"timeHours": 24, "nextLevel": "senior_manager"}
      }
    ],
    "formFields": [
      {
        "fieldName": "field_id",
        "label": {"en": "Field Label", "ar": "تسمية الحقل"},
        "type": "text|number|date|select|checkbox|textarea",
        "required": true,
        "validation": {"pattern": "regex", "message": {"en": "Error", "ar": "خطأ"}},
        "options": [{"value": "val", "label": {"en": "Label", "ar": "التسمية"}}]
      }
    ],
    "integrationPoints": [
      {
        "module": "module_name",
        "action": "create|update|read|delete",
        "dataMapping": {"sourceField": "targetField"}
      }
    ],
    "businessRules": [
      {
        "rule": "Rule description",
        "condition": "if condition",
        "action": "then action"
      }
    ]
  },
  "recommendations": [
    {
      "type": "implementation|optimization|compliance",
      "description": {"en": "Recommendation", "ar": "التوصية"},
      "priority": "high|medium|low"
    }
  ]
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this document and extract HR process/workflow/form structure:\n\n${documentText}` }
        ],
        temperature: 0.3,
        max_tokens: 4000
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const analysis = data.choices[0].message.content

    let parsedAnalysis
    try {
      parsedAnalysis = JSON.parse(analysis)
    } catch (e) {
      // If JSON parsing fails, return structured response with raw analysis
      parsedAnalysis = {
        documentType: documentType || 'unknown',
        title: { en: 'Parsed Document', ar: 'مستند محلل' },
        description: { en: 'AI-analyzed document', ar: 'مستند محلل بالذكاء الاصطناعي' },
        implementation: { category: 'general', priority: 'medium', complexity: 'moderate' },
        extractedData: { rawAnalysis: analysis },
        recommendations: [
          {
            type: 'implementation',
            description: { en: 'Manual review required', ar: 'مراجعة يدوية مطلوبة' },
            priority: 'medium'
          }
        ]
      }
    }

    return new Response(JSON.stringify({
      success: true,
      analysis: parsedAnalysis,
      processingTime: Date.now()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in ai-document-processor:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})