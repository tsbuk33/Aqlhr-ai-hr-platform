import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SpellCheckRequest {
  text: string;
  language: 'en' | 'ar';
  autoFix?: boolean;
}

interface SpellCheckResponse {
  correctedText: string;
  suggestions: Array<{
    original: string;
    suggested: string;
    confidence: number;
    startIndex: number;
    endIndex: number;
  }>;
  hasErrors: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language = 'en', autoFix = false }: SpellCheckRequest = await req.json();

    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify({
        correctedText: '',
        suggestions: [],
        hasErrors: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use OpenAI for advanced spell checking and grammar correction
    const systemPrompt = language === 'ar' 
      ? `أنت مدقق إملائي ونحوي متخصص في اللغة العربية. قم بتحليل النص المرسل وإصلاح أي أخطاء إملائية أو نحوية. 
         ${autoFix ? 'قم بإرجاع النص المصحح فقط.' : 'قم بإرجاع النص الأصلي مع قائمة بالأخطاء والتصحيحات المقترحة.'}`
      : `You are a professional spell checker and grammar corrector for English text. Analyze the given text and fix any spelling or grammar errors.
         ${autoFix ? 'Return only the corrected text.' : 'Return the original text with a list of errors and suggested corrections.'}`;

    const userPrompt = language === 'ar'
      ? `النص للتدقيق: "${text}"\n\nالرجاء ${autoFix ? 'إرجاع النص المصحح فقط' : 'تحديد الأخطاء وتقديم التصحيحات'}.`
      : `Text to check: "${text}"\n\nPlease ${autoFix ? 'return only the corrected text' : 'identify errors and provide corrections'}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    let result: SpellCheckResponse;

    if (autoFix) {
      // Simple auto-fix mode - return corrected text
      result = {
        correctedText: aiResponse.trim(),
        suggestions: [],
        hasErrors: text !== aiResponse.trim()
      };
    } else {
      // Detailed analysis mode - parse AI response for specific corrections
      result = parseSpellCheckResponse(text, aiResponse);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Spell checker error:', error);
    
    // Fallback to basic spell checking if AI fails
    const basicResult = performBasicSpellCheck(await req.text());
    
    return new Response(JSON.stringify(basicResult), {
      status: error.message.includes('OpenAI API error') ? 429 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function parseSpellCheckResponse(originalText: string, aiResponse: string): SpellCheckResponse {
  // Parse AI response to extract specific corrections
  // This is a simplified parser - you might want to make it more robust
  const suggestions = [];
  let correctedText = originalText;
  let hasErrors = false;

  // Look for common correction patterns in AI response
  const correctionPatterns = [
    /replace\s+"([^"]+)"\s+with\s+"([^"]+)"/gi,
    /change\s+"([^"]+)"\s+to\s+"([^"]+)"/gi,
    /"([^"]+)"\s+should\s+be\s+"([^"]+)"/gi,
  ];

  correctionPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(aiResponse)) !== null) {
      const [, original, suggested] = match;
      const startIndex = originalText.indexOf(original);
      
      if (startIndex !== -1) {
        suggestions.push({
          original,
          suggested,
          confidence: 0.9,
          startIndex,
          endIndex: startIndex + original.length
        });
        
        correctedText = correctedText.replace(original, suggested);
        hasErrors = true;
      }
    }
  });

  return {
    correctedText,
    suggestions,
    hasErrors
  };
}

function performBasicSpellCheck(text: string): SpellCheckResponse {
  // Basic fallback spell checker
  const commonMisspellings = {
    'recieve': 'receive',
    'seperate': 'separate',
    'definately': 'definitely',
    'occured': 'occurred',
    'accomodate': 'accommodate',
    'neccessary': 'necessary',
    'beleive': 'believe',
    'begining': 'beginning',
    'untill': 'until',
    'wich': 'which'
  };

  let correctedText = text;
  const suggestions = [];
  let hasErrors = false;

  Object.entries(commonMisspellings).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    const matches = Array.from(text.matchAll(regex));
    
    matches.forEach(match => {
      suggestions.push({
        original: match[0],
        suggested: correct,
        confidence: 0.8,
        startIndex: match.index || 0,
        endIndex: (match.index || 0) + match[0].length
      });
      hasErrors = true;
    });
    
    correctedText = correctedText.replace(regex, correct);
  });

  return {
    correctedText,
    suggestions,
    hasErrors
  };
}