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

  let prompt = 'HR Analytics';
  let chartType = 'bar';
  let language = 'en';
  let dataSource = 'sample';

  try {
    const requestBody = await req.json();
    prompt = requestBody.prompt || 'HR Analytics';
    chartType = requestBody.chartType || 'bar';
    language = requestBody.language || 'en';
    dataSource = requestBody.dataSource || 'sample';

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = language === 'ar' 
      ? `أنت خبير في تحليل البيانات وإنشاء المخططات للموارد البشرية. اكتب مخطط بياني احترافي بصيغة JSON متوافق مع Chart.js`
      : `You are an expert data analyst and chart creator for HR analytics. Generate a professional chart in JSON format compatible with Chart.js`;

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Create a ${chartType} chart for: ${prompt}. Return ONLY valid JSON with this Chart.js structure:
            {
              "type": "${chartType}",
              "data": {
                "labels": ["Label1", "Label2"],
                "datasets": [{
                  "label": "Dataset Name",
                  "data": [10, 20],
                  "backgroundColor": ["#color1", "#color2"],
                  "borderColor": "#bordercolor"
                }]
              },
              "options": {
                "responsive": true,
                "plugins": {
                  "title": { "display": true, "text": "Chart Title" },
                  "legend": { "display": true }
                }
              }
            }`
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const chartContent = data.choices[0].message.content;
    
    let chartData;
    try {
      chartData = JSON.parse(chartContent);
    } catch (parseError) {
      // Fallback chart data
      chartData = {
        type: chartType,
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{
            label: 'HR Metrics',
            data: [12, 19, 3, 5, 2],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            borderColor: '#333',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Generated Chart' },
            legend: { display: true }
          }
        }
      };
    }

    // Generate HTML visualization
    const htmlVisualization = generateHTMLVisualization(chartData, language);

    return new Response(JSON.stringify({
      success: true,
      visualization: {
        chartData: chartData,
        html: htmlVisualization,
        type: chartType,
        language: language,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Visualization generation error:', error);
    
    // Fallback chart data
    const fallbackChartData = {
      type: chartType,
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'HR Analytics',
          data: [65, 75, 80, 85],
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)', 
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 205, 86, 1)', 
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { 
            display: true, 
            text: `${prompt || 'HR Analytics'} - Generated Chart`
          },
          legend: { display: true }
        },
        scales: chartType === 'bar' ? {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Values' }
          },
          x: {
            title: { display: true, text: 'Categories' }
          }
        } : undefined
      }
    };
    
    const htmlVisualization = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Chart Visualization</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .chart-container { width: 100%; max-width: 800px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="chart-container">
        <canvas id="chart"></canvas>
    </div>
    <script>
        const ctx = document.getElementById('chart').getContext('2d');
        new Chart(ctx, ${JSON.stringify(fallbackChartData)});
    </script>
</body>
</html>`;
    
    return new Response(JSON.stringify({
      success: true,
      visualization: {
        chartData: fallbackChartData,
        html: htmlVisualization,
        type: chartType,
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

function generateHTMLVisualization(chartData: any, language: string) {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AqlHR Data Visualization</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 40px; 
            background: #f8f9fa;
            direction: ${language === 'ar' ? 'rtl' : 'ltr'};
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            padding: 40px; 
            border-radius: 10px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header { 
            text-align: center; 
            margin-bottom: 40px; 
        }
        .header h1 { 
            color: #2c5282; 
            margin-bottom: 10px; 
        }
        .chart-container { 
            position: relative; 
            height: 500px; 
            margin: 20px 0; 
        }
        .footer { 
            text-align: center; 
            margin-top: 40px; 
            color: #666; 
            font-size: 14px; 
        }
        .insights { 
            background: #f7fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin-top: 30px; 
        }
        .insights h3 { 
            color: #2c5282; 
            margin-bottom: 15px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AqlHR Data Visualization</h1>
            <p>${language === 'ar' ? 'تم إنشاؤه بواسطة مساعد الذكاء الاصطناعي' : 'Generated by AI Assistant'}</p>
            <p>${new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
        </div>
        
        <div class="chart-container">
            <canvas id="hrChart"></canvas>
        </div>
        
        <div class="insights">
            <h3>${language === 'ar' ? 'رؤى البيانات:' : 'Data Insights:'}</h3>
            <ul>
                <li>${language === 'ar' ? 'تم إنشاء هذا المخطط باستخدام الذكاء الاصطناعي المتقدم' : 'This chart was generated using advanced AI technology'}</li>
                <li>${language === 'ar' ? 'البيانات قابلة للتفاعل والتحديث' : 'Data is interactive and updateable'}</li>
                <li>${language === 'ar' ? 'يمكن تصدير هذا المخطط بصيغ مختلفة' : 'Chart can be exported in various formats'}</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} AqlHR - ${language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'Powered by AI'}</p>
        </div>
    </div>

    <script>
        const ctx = document.getElementById('hrChart').getContext('2d');
        const chartData = ${JSON.stringify(chartData)};
        
        new Chart(ctx, chartData);
    </script>
</body>
</html>`;
}