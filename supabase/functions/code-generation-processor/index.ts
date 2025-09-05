import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.6.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { description, context, language = 'python' } = await req.json()
    
    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    if (!hfToken) {
      throw new Error('Hugging Face token not configured')
    }

    const hf = new HfInference(hfToken)
    console.log('Generating code:', { description: description.substring(0, 100), language })

    // Create comprehensive prompt for code generation
    const codePrompt = buildCodePrompt(description, context, language)
    
    let generatedCode = ''
    let confidence = 0.8

    try {
      // Try CodeT5 for better code generation
      const response = await hf.textGeneration({
        model: 'Salesforce/codet5-base',
        inputs: codePrompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.2,
          do_sample: true,
          stop: ['```', '###', 'END']
        }
      })
      generatedCode = response.generated_text
      confidence = 0.85
    } catch (error) {
      console.log('CodeT5 not available, using StarCoder')
      try {
        // Fallback to StarCoder
        const response = await hf.textGeneration({
          model: 'bigcode/starcoder',
          inputs: codePrompt,
          parameters: {
            max_new_tokens: 400,
            temperature: 0.1,
            stop: ['```', '###']
          }
        })
        generatedCode = response.generated_text
        confidence = 0.9
      } catch (starcoderError) {
        console.log('StarCoder not available, using general model')
        // Final fallback to general text generation
        const response = await hf.textGeneration({
          model: 'microsoft/DialoGPT-medium',
          inputs: `Generate ${language} code for: ${description}`,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.3
          }
        })
        generatedCode = response.generated_text
        confidence = 0.6
      }
    }

    // Clean and format the generated code
    const cleanedCode = cleanGeneratedCode(generatedCode, language)
    
    // Add code analysis and suggestions
    const analysis = analyzeGeneratedCode(cleanedCode, description, language)

    const result = {
      code: cleanedCode,
      language,
      description,
      analysis,
      suggestions: generateCodeSuggestions(cleanedCode, context),
      usage_example: generateUsageExample(cleanedCode, language)
    }

    return new Response(JSON.stringify({
      result: formatCodeResponse(result),
      confidence,
      metadata: {
        provider: 'codet5-generator',
        language,
        code_length: cleanedCode.length,
        analysis_summary: analysis.summary,
        processing_time: Date.now()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Code generation error:', error)
    return new Response(JSON.stringify({
      error: 'Code generation failed',
      details: error.message,
      result: 'I apologize, but I encountered an error generating code. Please try with a more specific description.',
      confidence: 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})

function buildCodePrompt(description: string, context: any, language: string): string {
  let prompt = `Generate ${language} code for the following requirement:\n\n`
  prompt += `Description: ${description}\n\n`
  
  if (context.module) {
    prompt += `Context: This is for the ${context.module} module of an HR system.\n`
  }
  
  if (language === 'python') {
    prompt += `Requirements:\n`
    prompt += `- Use proper Python conventions\n`
    prompt += `- Include error handling\n`
    prompt += `- Add comments for clarity\n`
    prompt += `- Follow PEP 8 style guide\n\n`
  } else if (language === 'javascript') {
    prompt += `Requirements:\n`
    prompt += `- Use modern ES6+ syntax\n`
    prompt += `- Include error handling\n`
    prompt += `- Add JSDoc comments\n`
    prompt += `- Use async/await where appropriate\n\n`
  }
  
  prompt += `Code:\n\`\`\`${language}\n`
  
  return prompt
}

function cleanGeneratedCode(code: string, language: string): string {
  // Remove markdown formatting
  let cleaned = code.replace(/```[\w]*\n?/g, '')
  
  // Remove extra whitespace and normalize line endings
  cleaned = cleaned.trim().replace(/\r\n/g, '\n')
  
  // Remove prompt echoing
  const lines = cleaned.split('\n')
  const codeStartIndex = lines.findIndex(line => 
    line.includes('def ') || 
    line.includes('function ') || 
    line.includes('import ') ||
    line.includes('class ') ||
    line.includes('const ') ||
    line.includes('let ') ||
    line.includes('var ')
  )
  
  if (codeStartIndex > 0) {
    cleaned = lines.slice(codeStartIndex).join('\n')
  }
  
  return cleaned
}

function analyzeGeneratedCode(code: string, description: string, language: string) {
  const lines = code.split('\n').filter(line => line.trim())
  const analysis: any = {
    line_count: lines.length,
    has_error_handling: false,
    has_comments: false,
    complexity: 'low',
    summary: ''
  }
  
  // Check for error handling
  if (language === 'python') {
    analysis.has_error_handling = code.includes('try:') || code.includes('except')
    analysis.has_comments = code.includes('#')
    if (code.includes('class ') || code.includes('def ')) {
      analysis.complexity = code.split('def ').length > 3 ? 'high' : 'medium'
    }
  } else if (language === 'javascript') {
    analysis.has_error_handling = code.includes('try') || code.includes('catch')
    analysis.has_comments = code.includes('//')
    if (code.includes('function') || code.includes('class')) {
      analysis.complexity = code.split('function').length > 3 ? 'high' : 'medium'
    }
  }
  
  analysis.summary = `Generated ${lines.length} lines of ${language} code with ${analysis.complexity} complexity`
  
  return analysis
}

function generateCodeSuggestions(code: string, context: any): string[] {
  const suggestions: string[] = []
  
  if (!code.includes('try') && !code.includes('except') && !code.includes('catch')) {
    suggestions.push('Consider adding error handling for robustness')
  }
  
  if (code.split('\n').filter(line => line.includes('#') || line.includes('//')).length < 3) {
    suggestions.push('Add more comments to improve code documentation')
  }
  
  if (context.module === 'hr' || context.module === 'payroll') {
    suggestions.push('Ensure sensitive data is properly handled and encrypted')
    suggestions.push('Consider adding logging for audit trails')
  }
  
  if (code.length > 1000) {
    suggestions.push('Consider breaking this into smaller, more manageable functions')
  }
  
  return suggestions
}

function generateUsageExample(code: string, language: string): string {
  if (language === 'python') {
    if (code.includes('def ')) {
      const funcMatch = code.match(/def\s+(\w+)\s*\(/);
      if (funcMatch) {
        return `# Usage example:\nresult = ${funcMatch[1]}()\nprint(result)`
      }
    }
    if (code.includes('class ')) {
      const classMatch = code.match(/class\s+(\w+)/);
      if (classMatch) {
        return `# Usage example:\ninstance = ${classMatch[1]}()\nresult = instance.method()`
      }
    }
  } else if (language === 'javascript') {
    if (code.includes('function')) {
      const funcMatch = code.match(/function\s+(\w+)\s*\(/);
      if (funcMatch) {
        return `// Usage example:\nconst result = ${funcMatch[1]}();\nconsole.log(result);`
      }
    }
    if (code.includes('const ') && code.includes('=>')) {
      const arrowMatch = code.match(/const\s+(\w+)\s*=/);
      if (arrowMatch) {
        return `// Usage example:\nconst result = ${arrowMatch[1]}();\nconsole.log(result);`
      }
    }
  }
  
  return `// Usage example would depend on your specific implementation`
}

function formatCodeResponse(result: any): string {
  let response = `I've generated ${result.language} code for your request:\n\n`
  response += `\`\`\`${result.language}\n${result.code}\n\`\`\`\n\n`
  
  response += `**Analysis:**\n`
  response += `- ${result.analysis.line_count} lines of code\n`
  response += `- Complexity: ${result.analysis.complexity}\n`
  response += `- Error handling: ${result.analysis.has_error_handling ? '✅' : '❌'}\n`
  response += `- Comments: ${result.analysis.has_comments ? '✅' : '❌'}\n\n`
  
  if (result.suggestions.length > 0) {
    response += `**Suggestions for improvement:**\n`
    result.suggestions.forEach(suggestion => {
      response += `- ${suggestion}\n`
    })
    response += `\n`
  }
  
  if (result.usage_example) {
    response += `**Usage Example:**\n`
    response += `\`\`\`${result.language}\n${result.usage_example}\n\`\`\`\n`
  }
  
  return response
}