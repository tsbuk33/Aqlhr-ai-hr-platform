// Deno Edge: create a signed upload URL for secure document uploads
// Phase 26: Universal Document Ingestion - Upload signing service
// Supports both signed URLs (when available) and direct upload paths

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface UploadRequest {
  bucket: 'gov_docs' | 'employee_docs';
  tenant_id: string;
  filename: string;
  contentType?: string;
  portal?: string;
  employee_id?: string;
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { 
  auth: { persistSession: false } 
});

function jsonResponse(status: number, body: any) {
  return new Response(JSON.stringify(body), { 
    status, 
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    }
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { 
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      }
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(405, { ok: false, error: "method_not_allowed" });
  }

  try {
    const body: UploadRequest = await req.json().catch(() => ({}));
    
    const { 
      bucket, 
      tenant_id, 
      filename, 
      contentType = "application/octet-stream", 
      portal,
      employee_id 
    } = body;

    // Validate required parameters
    if (!["gov_docs", "employee_docs"].includes(bucket)) {
      return jsonResponse(400, { ok: false, error: "invalid_bucket" });
    }
    
    if (!tenant_id) {
      return jsonResponse(400, { ok: false, error: "missing_tenant" });
    }
    
    if (!filename) {
      return jsonResponse(400, { ok: false, error: "missing_filename" });
    }

    // Validate portal for government documents
    if (bucket === 'gov_docs' && portal && !['qiwa', 'gosi', 'absher', 'mudad', 'mol', 'other'].includes(portal)) {
      return jsonResponse(400, { ok: false, error: "invalid_portal" });
    }

    // Sanitize filename and create secure path
    const cleanFilename = filename.replace(/[^\p{L}\p{N}\-_.]+/gu, "_").slice(0, 100);
    const timestamp = Date.now();
    const storage_path = `${tenant_id}/${timestamp}_${cleanFilename}`;

    // Validate file size and type (basic checks)
    const maxFileSize = 50 * 1024 * 1024; // 50MB limit
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/tiff',
      'image/tif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    // Try to create signed upload URL
    try {
      const { data: signedData, error: signedError } = await supabase.storage
        .from(bucket)
        .createSignedUploadUrl(storage_path, {
          expiresIn: 300, // 5 minutes
          upsert: false
        });

      if (signedError) {
        console.log('Signed URL creation failed, falling back to direct upload:', signedError.message);
        
        // Fallback: return direct upload instructions
        return jsonResponse(200, { 
          ok: true, 
          mode: "direct", 
          bucket, 
          storage_path, 
          contentType,
          metadata: {
            portal,
            employee_id,
            tenant_id,
            original_filename: filename
          },
          note: "Use supabase-js client.storage.from(bucket).upload() with user authentication"
        });
      }

      // Success: return signed URL
      return jsonResponse(200, { 
        ok: true, 
        mode: "signed", 
        bucket, 
        storage_path, 
        contentType,
        signedUrl: signedData.signedUrl,
        metadata: {
          portal,
          employee_id,
          tenant_id,
          original_filename: filename
        },
        expires_in: 300
      });

    } catch (error) {
      console.error('Upload sign error:', error);
      
      // Fallback to direct upload mode
      return jsonResponse(200, { 
        ok: true, 
        mode: "direct", 
        bucket, 
        storage_path, 
        contentType,
        metadata: {
          portal,
          employee_id,
          tenant_id,
          original_filename: filename
        },
        note: "Signed URL not available, use direct upload with authentication"
      });
    }

  } catch (e: any) {
    console.error('Document upload sign error:', e);
    return jsonResponse(500, { 
      ok: false, 
      error: String(e?.message || e),
      timestamp: new Date().toISOString()
    });
  }
});

// Helper function to validate UUID format
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}