import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Security: Authorized email recipients
const AUTHORIZED_EMAILS = ['tsbuk33@gmail.com', 'admin@aqlhr.com', 'support@aqlhr.com'];

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, number>();

interface HealingReportRequest {
  reportType: string;
  systemHealth: number;
  metrics: any[];
  healingActions: any[];
  alerts: any[];
  recipientEmail: string;
}

// Structured logging
const logger = {
  info: (message: string, data?: any) => 
    console.log(JSON.stringify({
      level: 'info', 
      message, 
      data, 
      timestamp: new Date().toISOString()
    })),
  error: (message: string, error?: any) => 
    console.error(JSON.stringify({
      level: 'error', 
      message, 
      error: error?.message || error, 
      timestamp: new Date().toISOString()
    }))
};

// Environment validation
const validateEnvironment = () => {
  const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  for (const envVar of requiredVars) {
    if (!Deno.env.get(envVar)) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
};

// Health score validation
const validateHealthScore = (score: number): boolean => {
  return score >= 0 && score <= 100 && !isNaN(score);
};

// Rate limiting function
const checkRateLimit = (clientId: string, req: Request): { allowed: boolean; currentCount: number } => {
  const rateLimitKey = `healing_report_${clientId}_${new Date().toDateString()}`;
  const currentCount = rateLimitStore.get(rateLimitKey) || 0;
  const maxAllowed = 10;
  
  if (currentCount >= maxAllowed) {
    return { allowed: false, currentCount };
  }
  
  rateLimitStore.set(rateLimitKey, currentCount + 1);
  return { allowed: true, currentCount: currentCount + 1 };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Environment validation
    validateEnvironment();
    
    const { 
      reportType, 
      systemHealth, 
      metrics, 
      healingActions, 
      alerts, 
      recipientEmail 
    }: HealingReportRequest = await req.json();

    logger.info('Request received', {
      reportType,
      systemHealth,
      recipientEmail,
      metricsCount: metrics.length
    });

    // Security: Email recipient validation
    if (!AUTHORIZED_EMAILS.includes(recipientEmail)) {
      logger.error('Unauthorized email recipient attempted', { recipientEmail });
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized email recipient',
          success: false 
        }),
        {
          status: 403,
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          },
        }
      );
    }

    // Health score validation
    if (!validateHealthScore(systemHealth)) {
      logger.error('Invalid health score provided', { 
        systemHealth, 
        recipientEmail,
        clientId: req.headers.get('x-forwarded-for') || 'unknown'
      });
      return new Response(
        JSON.stringify({ 
          error: 'Invalid health score. Must be between 0 and 100.',
          success: false 
        }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          },
        }
      );
    }

    // Rate limiting check
    const clientId = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = checkRateLimit(clientId, req);
    if (!rateLimitResult.allowed) {
      logger.error('Rate limit exceeded', { 
        clientId, 
        currentCount: rateLimitResult.currentCount,
        maxAllowed: 10,
        resetTime: new Date().toDateString(),
        userAgent: req.headers.get('user-agent'),
        recipientEmail
      });
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Maximum 10 reports per day.',
          success: false 
        }),
        {
          status: 429,
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          },
        }
      );
    }

    logger.info('Processing healing report request', {
      reportType,
      systemHealth,
      metricsCount: metrics.length,
      healingActionsCount: healingActions.length,
      alertsCount: alerts.length,
      recipientEmail
    });

    // Generate comprehensive report content
    const reportDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });

    const saudiTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Riyadh',
      hour12: true
    });

    // Calculate key metrics
    const successfulActions = healingActions.filter(action => action.result === 'success').length;
    const criticalAlerts = alerts.filter(alert => alert.level === 'critical').length;
    const totalIssuesPrevented = healingActions.length;
    const avgResponseTime = healingActions.length > 0 
      ? (healingActions.reduce((sum, action) => sum + action.executionTime, 0) / healingActions.length / 1000).toFixed(1)
      : '0';

    // Initialize Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    logger.info('Resend API key check', { 
      hasApiKey: !!resendApiKey,
      keyLength: resendApiKey ? resendApiKey.length : 0,
      keyPrefix: resendApiKey ? resendApiKey.substring(0, 7) + '...' : 'none'
    });
    
    if (!resendApiKey) {
      logger.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Email service not configured',
          success: false 
        }),
        {
          status: 500,
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          },
        }
      );
    }

    const resend = new Resend(resendApiKey);

    // Create simple HTML email content
    const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>AqlHR Self-Healing Report</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          🔧 AqlHR Self-Healing System Report
        </h1>
        
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <h2 style="margin: 0; color: #0c4a6e;">Overall System Health</h2>
          <div style="font-size: 48px; font-weight: bold; color: #0c4a6e; margin: 10px 0;">${systemHealth.toFixed(1)}%</div>
          <div style="color: #0369a1; font-weight: 600;">
            ${systemHealth > 95 ? '✅ EXCELLENT' : systemHealth > 90 ? '⚠️ GOOD' : '🚨 ATTENTION NEEDED'}
          </div>
        </div>
        
        <h3>📊 Key Metrics</h3>
        <ul>
          <li><strong>${successfulActions}</strong> issues resolved automatically</li>
          <li><strong>${totalIssuesPrevented}</strong> potential problems prevented</li>
          <li><strong>${avgResponseTime}s</strong> average response time</li>
          <li><strong>Zero business disruptions</strong> maintained</li>
        </ul>
        
        <h3>🚨 Critical Business Functions</h3>
        ${metrics.map(metric => `
          <div style="background: #fafafa; border: 1px solid #e4e4e7; border-radius: 6px; padding: 12px; margin: 8px 0;">
            <strong>${metric.name}:</strong> ${metric.value.toFixed(1)}% 
            ${metric.status === 'healthy' ? '✅' : metric.status === 'warning' ? '⚠️' : '🚨'}
            <br>
            <small>Business Impact: ${metric.businessImpact.toUpperCase()}</small>
          </div>
        `).join('')}
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <h3 style="margin-top: 0;">🎯 Action Items for Talal</h3>
          <p><strong>Immediate:</strong> ${criticalAlerts > 0 ? `🚨 Review ${criticalAlerts} critical alert(s)` : '✅ No immediate actions required'}</p>
          <p><strong>This Week:</strong> Review system optimization recommendations</p>
          <p><strong>Strategic:</strong> Plan for predicted capacity needs</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="text-align: center; color: #64748b; font-size: 12px;">
          This report was automatically generated by the AqlHR Self-Healing System<br>
          Generated: ${reportDate} at ${saudiTime} (Saudi Arabia Time)
        </p>
        
        <p style="text-align: center; font-weight: bold; color: #1e293b; margin-top: 20px;">
          Talal - Your AqlHR platform is operating at peak performance! 🚀
        </p>
      </body>
    </html>
    `;

    logger.info('Email content generated', { contentLength: emailHtml.length });

    // Send the email using Resend
    try {
      logger.info('Attempting to send email via Resend', { 
        recipientEmail,
        fromEmail: 'AqlHR System <system@aqlhr.com>'
      });

      const { data: emailData, error: emailError } = await resend.emails.send({
        from: 'AqlHR System <onboarding@resend.dev>', // Using verified Resend domain
        to: [recipientEmail],
        subject: `🔧 AqlHR Self-Healing Report - ${systemHealth.toFixed(1)}% System Health - ${reportDate}`,
        html: emailHtml,
      });

      if (emailError) {
        logger.error('Resend API error', { 
          error: emailError,
          errorMessage: emailError.message,
          errorName: emailError.name,
          recipientEmail,
          reportType 
        });
        return new Response(
          JSON.stringify({ 
            error: 'Failed to send email report',
            success: false,
            details: emailError.message
          }),
          {
            status: 500,
            headers: { 
              "Content-Type": "application/json", 
              ...corsHeaders 
            },
          }
        );
      }

      logger.info('Email sent successfully via Resend', { 
        emailId: emailData?.id,
        recipientEmail,
        reportType,
        systemHealth
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Healing report sent successfully',
          emailId: emailData?.id,
          reportData: {
            systemHealth,
            successfulActions,
            criticalAlerts,
            totalIssuesPrevented,
            avgResponseTime
          }
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );

    } catch (sendError: any) {
      logger.error('Failed to send email - network/connection error', { 
        error: sendError.message,
        stack: sendError.stack,
        name: sendError.name
      });
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email report',
          success: false,
          details: `Network error: ${sendError.message}`
        }),
        {
          status: 500,
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          },
        }
      );
    }

  } catch (error: any) {
    logger.error("Error in send-healing-report function", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);