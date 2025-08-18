import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@3.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthLinkRequest {
  email: string;
  mode: 'signup' | 'magic';
  redirectTo?: string;
}

function htmlTemplate(link: string, title: string, cta: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">AqlHR</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">${title}</h2>
        
        <p>Click the button below to continue to your AqlHR dashboard.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold; 
                    display: inline-block;
                    font-size: 16px;">
            ${cta}
          </a>
        </div>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #e9e9e9; padding: 10px; border-radius: 5px; font-family: monospace;">
          ${link}
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="color: #666; font-size: 14px;">
          If you didn't request this, you can safely ignore this email.
        </p>
        
        <p style="color: #666; font-size: 12px; text-align: center;">
          © 2025 AqlHR. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, mode, redirectTo }: AuthLinkRequest = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "email_required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Supabase admin client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Initialize Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);
    const fromEmail = Deno.env.get("FROM_EMAIL") || "AqlHR <no-reply@aqlhr.com>";
    const appUrl = Deno.env.get("APP_URL") || "https://aqlhr.com";
    
    const finalRedirectTo = redirectTo || `${appUrl}/auth/callback`;
    const type = mode === 'signup' ? 'signup' : 'magiclink';

    console.log(`Generating ${type} link for:`, email, "redirect:", finalRedirectTo);

    // Generate auth link using Supabase admin
    const { data, error } = await supabase.auth.admin.generateLink({
      type: type as any,
      email,
      options: { redirectTo: finalRedirectTo }
    });

    if (error) {
      console.error("Supabase generateLink error:", error);
      throw error;
    }

    // Extract action link
    const actionLink = (data as any).properties?.action_link ?? (data as any).action_link;
    
    if (!actionLink) {
      console.error("No action link returned from Supabase generateLink");
      throw new Error("No action link generated");
    }

    // Prepare email content
    const subject = mode === 'signup' 
      ? 'Confirm your AqlHR account' 
      : 'Sign in to AqlHR';
    
    const title = mode === 'signup' 
      ? 'Welcome to AqlHR!' 
      : 'Sign in to AqlHR';
    
    const cta = 'Continue to AqlHR';

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject,
      html: htmlTemplate(actionLink, title, cta)
    });

    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error);
      throw emailResponse.error;
    }

    console.log("Email sent successfully:", emailResponse.data?.id);

    // Log to audit table
    try {
      await supabase.from('auth_email_events').insert({
        email,
        mode,
        sent_at: new Date().toISOString(),
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent'),
        success: true
      });
    } catch (auditError) {
      console.warn("Failed to log audit event:", auditError);
      // Don't fail the request if audit logging fails
    }

    return new Response(
      JSON.stringify({ 
        ok: true, 
        mode, 
        email_id: emailResponse.data?.id 
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error("Error in send-auth-link:", error);
    
    // Log error to audit table
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      
      await supabase.from('auth_email_events').insert({
        email: "unknown",
        mode: "unknown",
        sent_at: new Date().toISOString(),
        success: false,
        error_message: error.message
      });
    } catch (auditError) {
      console.warn("Failed to log error audit event:", auditError);
    }

    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});