import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.1?dts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, email } = await req.json();

    console.log(`[debug-auth] ${action} request for email: ${email}`);

    let result: any = {};

    switch (action) {
      case 'check_user':
        // Check if user exists and their status
        const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
        
        if (userError) {
          console.error('[debug-auth] User lookup error:', userError);
          result = { error: userError.message, userExists: false };
        } else {
          result = {
            userExists: !!userData.user,
            userId: userData.user?.id,
            emailConfirmed: userData.user?.email_confirmed_at,
            lastSignIn: userData.user?.last_sign_in_at,
            createdAt: userData.user?.created_at,
            appMetadata: userData.user?.app_metadata,
            userMetadata: userData.user?.user_metadata
          };
        }
        break;

      case 'resend_confirmation':
        // Resend email confirmation
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: email,
          options: {
            emailRedirectTo: `${req.headers.get('origin')}/en/auth/callback`
          }
        });

        if (resendError) {
          console.error('[debug-auth] Resend confirmation error:', resendError);
          result = { error: resendError.message, success: false };
        } else {
          result = { success: true, message: 'Confirmation email resent' };
        }
        break;

      case 'check_session':
        // Get current session info
        const authHeader = req.headers.get('Authorization');
        if (authHeader) {
          const token = authHeader.replace('Bearer ', '');
          const { data: sessionData, error: sessionError } = await supabase.auth.getUser(token);
          
          if (sessionError) {
            result = { error: sessionError.message, hasValidSession: false };
          } else {
            result = {
              hasValidSession: true,
              userId: sessionData.user?.id,
              email: sessionData.user?.email,
              emailConfirmed: sessionData.user?.email_confirmed_at
            };
          }
        } else {
          result = { error: 'No authorization header', hasValidSession: false };
        }
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log(`[debug-auth] ${action} result:`, result);

    return new Response(JSON.stringify({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[debug-auth] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});