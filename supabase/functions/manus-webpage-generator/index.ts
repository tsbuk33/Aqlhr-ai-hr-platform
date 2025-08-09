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

  let prompt = 'HR Web Page';
  let pageType = 'portal';
  let language = 'en';
  let companyName = 'AqlHR Company';

  try {
    const requestBody = await req.json();
    prompt = requestBody.prompt || 'HR Web Page';
    pageType = requestBody.pageType || 'portal';
    language = requestBody.language || 'en';
    companyName = requestBody.companyName || 'AqlHR Company';

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = language === 'ar' 
      ? `أنت خبير في تطوير صفحات الويب للموارد البشرية. اكتب صفحة ويب احترافية بـ HTML و CSS و JavaScript`
      : `You are an expert web developer for HR portals. Create a professional web page with HTML, CSS, and JavaScript`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `${systemPrompt}. Create a complete HTML page with embedded CSS and JavaScript. Make it responsive and professional.`
          },
          {
            role: 'user',
            content: `Create a web page for: ${prompt}. Company: ${companyName}. Make it interactive and professional with proper styling.`
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const pageContent = data.choices[0].message.content;

    return new Response(JSON.stringify({
      success: true,
      webpage: {
        html: pageContent,
        type: pageType,
        language: language,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Web page generation error:', error);
    
    // Fallback web page content
    const fallbackHTML = `<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${companyName} - ${pageType} Portal</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .header h1 {
            color: #2c5282;
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #666;
            font-size: 1.1rem;
        }
        
        .main-content {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }
        
        .feature-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 25px;
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
        }
        
        .feature-icon {
            width: 60px;
            height: 60px;
            background: #2c5282;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            color: white;
            font-size: 1.5rem;
        }
        
        .btn {
            background: #2c5282;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s ease;
            margin: 10px;
        }
        
        .btn:hover {
            background: #2a4973;
        }
        
        .fallback-notice {
            background: #e3f2fd;
            color: #1976d2;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #1976d2;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .container {
                padding: 10px;
            }
            
            .main-content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${companyName}</h1>
            <p>${language === 'ar' ? 'بوابة الموارد البشرية' : 'Human Resources Portal'}</p>
        </div>
        
        <div class="main-content">
            <div class="fallback-notice">
                <strong>${language === 'ar' ? 'ملاحظة:' : 'Note:'}</strong> 
                ${language === 'ar' 
                  ? 'تم إنشاء هذه الصفحة باستخدام نموذج افتراضي بسبب محدودية API. يرجى تخصيصها حسب احتياجاتكم.'
                  : 'This page was generated using a fallback template due to API limitations. Please customize as needed.'}
            </div>
            
            <h2>${language === 'ar' ? 'مرحباً بكم في بوابة الموارد البشرية' : 'Welcome to HR Portal'}</h2>
            <p>${language === 'ar' 
              ? 'هذه الصفحة تم إنشاؤها بناءً على طلبكم: ' + prompt
              : 'This page was generated based on your request: ' + prompt}</p>
            
            <div class="features">
                <div class="feature-card">
                    <div class="feature-icon">👥</div>
                    <h3>${language === 'ar' ? 'إدارة الموظفين' : 'Employee Management'}</h3>
                    <p>${language === 'ar' ? 'إدارة بيانات الموظفين والتوظيف' : 'Manage employee data and recruitment'}</p>
                    <button class="btn">${language === 'ar' ? 'الدخول' : 'Access'}</button>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">💰</div>
                    <h3>${language === 'ar' ? 'الرواتب' : 'Payroll'}</h3>
                    <p>${language === 'ar' ? 'معالجة الرواتب والمزايا' : 'Process payroll and benefits'}</p>
                    <button class="btn">${language === 'ar' ? 'الدخول' : 'Access'}</button>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3>${language === 'ar' ? 'التحليلات' : 'Analytics'}</h3>
                    <p>${language === 'ar' ? 'تقارير وتحليلات الموارد البشرية' : 'HR reports and analytics'}</p>
                    <button class="btn">${language === 'ar' ? 'الدخول' : 'Access'}</button>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Simple interactivity
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('click', function() {
                this.style.background = '#e8f4fd';
                setTimeout(() => {
                    this.style.background = '#f8f9fa';
                }, 200);
            });
        });
        
        console.log('${companyName} HR Portal loaded successfully');
    </script>
</body>
</html>`;

    return new Response(JSON.stringify({
      success: true,
      webpage: {
        html: fallbackHTML,
        type: pageType,
        language: language,
        timestamp: new Date().toISOString(),
        fallback: true
      },
      note: "Generated using fallback template due to API limitations"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});