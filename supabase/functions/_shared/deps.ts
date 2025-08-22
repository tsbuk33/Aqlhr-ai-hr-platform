// Shared dependencies for Supabase Edge Functions
// This prevents esm.sh graph errors by centralizing imports

export { serve } from "https://deno.land/std@0.224.0/http/server.ts";
export { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.1?dts";
export * as PDFLib from "https://esm.sh/pdf-lib@1.17.1?bundle"; // simple text PDF

// Common CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// XHR polyfill (if needed for compatibility)
import "https://deno.land/x/xhr@0.1.0/mod.ts";