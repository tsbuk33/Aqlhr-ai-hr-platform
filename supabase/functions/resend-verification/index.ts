import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
  redirectUrl?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectUrl }: VerificationRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // Determine a safe redirect URL
    const headerOrigin = req.headers.get("origin") || undefined;
    const referer = req.headers.get("referer") || undefined;
    let refererOrigin: string | undefined;
    try { refererOrigin = referer ? new URL(referer).origin : undefined; } catch {}

    const finalRedirect = (redirectUrl && redirectUrl.trim().length > 0)
      ? redirectUrl
      : headerOrigin || refererOrigin || "https://aqlhr.com/";

    console.log("Generating verification link for:", email, "redirect:", finalRedirect);

    // Try to generate a signup verification link first
    let link: string | null = null;
    let mode: "signup" | "magiclink" = "signup";

    const { data: signupData, error: signupError } = await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email,
      options: { redirectTo: finalRedirect },
    });

    if (signupError) {
      console.warn("Signup link error:", signupError?.message || signupError);
      // If user already exists, fall back to a magic link (which also verifies the email on click)
      const { data: magicData, error: magicError } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: { redirectTo: finalRedirect },
      });

      if (magicError) {
        console.error("Magic link error:", magicError);
        return new Response(
          JSON.stringify({ error: "Failed to generate verification/sign-in link" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      link = magicData?.properties?.action_link ?? null;
      mode = "magiclink";
    } else {
      link = signupData?.properties?.action_link ?? null;
      mode = "signup";
    }

    if (!link) {
      console.error("No action link returned from Supabase generateLink");
      return new Response(
        JSON.stringify({ error: "No link generated" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending ${mode} email via Resend to`, email);

    const subject = mode === "signup" ? "Verify your AqlHR account" : "Your secure AqlHR sign-in link";

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${mode === "signup" ? "Welcome to AqlHR!" : "Sign in to AqlHR"}</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">${mode === "signup" ? "Verify your email address" : "Use your secure sign-in link"}</h2>
          
          <p>${mode === "signup" 
            ? "Thanks for signing up! Click the button below to verify your email and activate your account." 
            : "Click the button below to sign in securely. This also confirms your email address."}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      font-weight: bold; 
                      display: inline-block;">
              ${mode === "signup" ? "Verify Email Address" : "Sign In"}
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
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "AqlHR <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
    });

    if (emailResponse.error) {
      console.error("Resend send error:", emailResponse.error);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Email sent:", emailResponse.data?.id);

    return new Response(
      JSON.stringify({ success: true, mode, email_id: emailResponse.data?.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in resend-verification:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
