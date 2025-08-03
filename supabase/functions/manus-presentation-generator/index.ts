import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, presentationType = 'performance', language = 'en', slideCount = 8 } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = language === 'ar' 
      ? `أنت خبير في إنشاء العروض التقديمية للموارد البشرية. اكتب عرض تقديمي احترافي مكون من ${slideCount} شرائح بصيغة JSON. كل شريحة يجب أن تحتوي على: title, content, bulletPoints, notes`
      : `You are an expert HR presentation creator. Generate a professional presentation with ${slideCount} slides in JSON format. Each slide should have: title, content, bulletPoints, notes`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Create a presentation about: ${prompt}. Return ONLY valid JSON with this structure:
            {
              "title": "Presentation Title",
              "slides": [
                {
                  "id": 1,
                  "title": "Slide Title",
                  "content": "Main content",
                  "bulletPoints": ["Point 1", "Point 2"],
                  "notes": "Speaker notes"
                }
              ]
            }`
          }
        ],
        temperature: 0.7,
        max_tokens: 2500
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const presentationContent = data.choices[0].message.content;
    
    let presentationData;
    try {
      presentationData = JSON.parse(presentationContent);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      presentationData = {
        title: "Generated Presentation",
        slides: [{
          id: 1,
          title: "Generated Content",
          content: presentationContent,
          bulletPoints: ["Content generated successfully"],
          notes: "AI-generated presentation content"
        }]
      };
    }

    // Generate HTML presentation
    const htmlPresentation = generateHTMLPresentation(presentationData, language);

    return new Response(JSON.stringify({
      success: true,
      presentation: {
        data: presentationData,
        html: htmlPresentation,
        type: presentationType,
        language: language,
        slideCount: presentationData.slides?.length || 1,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Presentation generation error:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function generateHTMLPresentation(data: any, language: string) {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${data.title}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 0; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            direction: ${language === 'ar' ? 'rtl' : 'ltr'};
        }
        .presentation-container { 
            display: flex; 
            flex-direction: column; 
            min-height: 100vh; 
        }
        .slide { 
            min-height: 100vh; 
            padding: 60px; 
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            background: white; 
            margin: 20px; 
            border-radius: 10px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            page-break-after: always;
        }
        .slide h1 { 
            color: #2c5282; 
            font-size: 2.5em; 
            margin-bottom: 20px; 
            text-align: center;
        }
        .slide h2 { 
            color: #2c5282; 
            font-size: 2em; 
            margin-bottom: 15px; 
        }
        .slide-content { 
            font-size: 1.2em; 
            line-height: 1.6; 
            margin-bottom: 20px; 
        }
        .bullet-points { 
            font-size: 1.1em; 
            margin: 20px 0; 
        }
        .bullet-points li { 
            margin: 10px 0; 
            padding: 8px 0; 
        }
        .slide-number { 
            position: absolute; 
            bottom: 20px; 
            right: 20px; 
            color: #666; 
            font-size: 14px; 
        }
        .title-slide { 
            text-align: center; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
        }
        .title-slide h1 { 
            color: white; 
            font-size: 3.5em; 
        }
        @media print {
            .slide { margin: 0; min-height: auto; }
        }
    </style>
</head>
<body>
    <div class="presentation-container">
        <div class="slide title-slide">
            <h1>${data.title}</h1>
            <p style="font-size: 1.5em; margin-top: 40px;">Generated by AqlHR AI</p>
            <p style="font-size: 1.2em;">${new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
        </div>
        
        ${data.slides?.map((slide: any, index: number) => `
            <div class="slide">
                <h2>${slide.title}</h2>
                <div class="slide-content">${slide.content}</div>
                ${slide.bulletPoints && slide.bulletPoints.length > 0 ? `
                    <ul class="bullet-points">
                        ${slide.bulletPoints.map((point: string) => `<li>${point}</li>`).join('')}
                    </ul>
                ` : ''}
                <div class="slide-number">${index + 2}</div>
            </div>
        `).join('') || ''}
    </div>
</body>
</html>`;
}