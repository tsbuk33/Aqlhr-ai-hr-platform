import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { documentId } = await req.json();
    
    console.log('🔒 AqlHR: Processing secure document access request', { documentId });

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    // Check if user has executive privileges
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role, company_id')
      .eq('user_id', user.id)
      .single();

    if (!profile || !['admin', 'super_admin', 'executive'].includes(profile.role)) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions to access secure documents' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Simulate document access logging
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: user.id,
        company_id: profile.company_id,
        action: 'DOCUMENT_ACCESS',
        table_name: 'secure_documents',
        record_id: documentId,
        category: 'security',
        severity: 'info',
        user_role: profile.role,
        session_id: `session_${Date.now()}`,
        new_values: {
          document_id: documentId,
          access_type: 'executive_vault',
          timestamp: new Date().toISOString(),
          source: 'mobile_executive_app'
        }
      });

    // Generate secure access URL (in production, this would be a signed URL with expiration)
    const secureAccessUrl = `https://secure-docs.aqlhr.com/document/${documentId}?token=${generateSecureToken(user.id, documentId)}`;

    console.log('✅ AqlHR: Secure document access granted', { 
      documentId, 
      userId: user.id, 
      role: profile.role 
    });

    return new Response(
      JSON.stringify({
        success: true,
        accessUrl: secureAccessUrl,
        expiresIn: 3600, // 1 hour
        permissions: ['read', 'download'],
        classification: 'executive_access'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ AqlHR: Error in access-secure-document function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        code: 'SECURE_DOCUMENT_ACCESS_ERROR'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function generateSecureToken(userId: string, documentId: string): string {
  // In production, use proper JWT signing with secret
  const payload = {
    userId,
    documentId,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
    iss: 'aqlhr-secure-vault'
  };
  
  // This is a simplified token for demo purposes
  return btoa(JSON.stringify(payload));
}