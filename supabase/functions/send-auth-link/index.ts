// deno-lint-ignore-file no-explicit-any
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@3'

// Strict CORS config
const APP_URL = Deno.env.get('APP_URL') || 'https://aqlhr.com'
const APP_URL_DEV = Deno.env.get('APP_URL_DEV') || ''
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'AqlHR <no-reply@aqlhr.com>'

const allowedOrigins = [
  APP_URL,
  APP_URL_DEV,
  'http://localhost:3000',
  'http://localhost:5173',
]
const lovableRegex = /^https:\/\/.*\.lovable\.(dev|app)$/i

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const resend = new Resend(Deno.env.get('RESEND_API_KEY')!) // Updated secret

interface AuthLinkRequest {
  email: string
  mode: 'signup' | 'magic'
  redirectTo?: string
}

function htmlTemplate(link: string, title: string, cta: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
      </head>
      <body style="font-family:Arial, sans-serif; line-height:1.6; color:#111; margin:0; padding:24px;">
        <div style="max-width:600px; margin:0 auto;">
          <div style="background:linear-gradient(135deg,#667eea,#764ba2); padding:24px; border-radius:12px 12px 0 0; text-align:center;">
            <h1 style="margin:0; color:#fff;">AqlHR</h1>
          </div>
          <div style="background:#fafafa; padding:24px; border-radius:0 0 12px 12px;">
            <h2 style="margin-top:0;">${title}</h2>
            <p>Click the button below to continue to your AqlHR dashboard.</p>
            <p style="text-align:center; margin:24px 0;">
              <a href="${link}" style="background:linear-gradient(135deg,#667eea,#764ba2); color:#fff; text-decoration:none; padding:12px 18px; border-radius:8px; font-weight:600; display:inline-block;">
                ${cta}
              </a>
            </p>
            <p>If the button doesn’t work, copy and paste this link into your browser:</p>
            <p style="word-break:break-all; font-family:monospace; background:#eee; padding:8px 12px; border-radius:6px;">${link}</p>
            <hr style="border:none; border-top:1px solid #e5e5e5; margin:24px 0;" />
            <p style="color:#666; font-size:12px; text-align:center;">© ${new Date().getFullYear()} AqlHR. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      status: 200,
      headers: corsHeaders 
    })
  }

  try {
    const { email, mode, redirectTo }: AuthLinkRequest = await req.json()

    if (!email) {
      return new Response(JSON.stringify({ error: 'email_required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const type = mode === 'signup' ? 'signup' : 'magiclink'
    const finalRedirect = redirectTo || `${APP_URL}/auth/callback`

    console.log('Generating link', { email, mode, finalRedirect })

    const { data, error } = await supabase.auth.admin.generateLink({
      type: type as any,
      email,
      options: { redirectTo: finalRedirect },
    })

    if (error) {
      console.error('generateLink error', error)
      throw error
    }

    const actionLink = (data as any).properties?.action_link ?? (data as any).action_link
    if (!actionLink) throw new Error('no_action_link')

    const subject = mode === 'signup' ? 'Confirm your AqlHR account' : 'Sign in to AqlHR'
    const title = subject

    const emailResp = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject,
      html: htmlTemplate(actionLink, title, 'Continue to AqlHR'),
    })

    if ((emailResp as any).error) {
      console.error('Resend error', (emailResp as any).error)
      throw (emailResp as any).error
    }

    // Structured logging after successful email send
    console.log("[send-auth-link] Email sent", {
      email,
      mode,
      redirectTo: finalRedirect,
      timestamp: new Date().toISOString(),
    });

    // Insert audit record into auth_email_events table
    try {
      await supabase.from('auth_email_events').insert({
        email,
        mode,
        sent_at: new Date().toISOString(),
        ip: req.headers.get('x-forwarded-for') ?? null,
        ua: req.headers.get('user-agent') ?? null,
      })
    } catch (auditErr) {
      console.warn('audit insert failed', auditErr)
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (err: any) {
    // Structured error logging
    console.error("[send-auth-link] ERROR", {
      email: email || 'unknown',
      mode: mode || 'unknown', 
      error: String(err),
      timestamp: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ error: err?.message || 'internal_error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})