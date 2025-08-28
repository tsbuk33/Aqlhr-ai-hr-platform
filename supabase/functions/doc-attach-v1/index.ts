// Deno Edge: manually attach document to employee when auto-linking fails
// Phase 26: Universal Document Ingestion - Manual attachment service

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface AttachRequest {
  document_id: string;
  employee_id: string;
  tenant_id: string;
  updates?: {
    title?: string;
    doc_type?: string;
    effective_date?: string;
    expiry_date?: string;
    iqama_id?: string;
    national_id?: string;
  };
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
      "Access-Control-Allow-Methods": "POST, PUT, GET, DELETE, OPTIONS",
    }
  });
}

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { 
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, PUT, GET, DELETE, OPTIONS",
      }
    });
  }

  try {
    const url = new URL(req.url);
    const documentId = url.searchParams.get('document_id');
    
    switch (req.method) {
      case "POST":
      case "PUT":
        return await handleAttachDocument(req);
        
      case "DELETE":
        return await handleDetachDocument(documentId, req);
        
      case "GET":
        return await handleGetDocumentInfo(documentId, req);
        
      default:
        return jsonResponse(405, { ok: false, error: "method_not_allowed" });
    }
    
  } catch (e: any) {
    console.error('Document attach operation error:', e);
    return jsonResponse(500, { 
      ok: false, 
      error: String(e?.message || e),
      timestamp: new Date().toISOString()
    });
  }
});

async function handleAttachDocument(req: Request) {
  const body: AttachRequest = await req.json().catch(() => ({}));
  
  const { document_id, employee_id, tenant_id, updates = {} } = body;

  // Validate required parameters
  if (!document_id || !isValidUUID(document_id)) {
    return jsonResponse(400, { ok: false, error: "invalid_document_id" });
  }
  
  if (!employee_id || !isValidUUID(employee_id)) {
    return jsonResponse(400, { ok: false, error: "invalid_employee_id" });
  }
  
  if (!tenant_id || !isValidUUID(tenant_id)) {
    return jsonResponse(400, { ok: false, error: "invalid_tenant_id" });
  }

  // Verify document exists and belongs to tenant
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id, tenant_id, employee_id, title, doc_type, storage_bucket, storage_path")
    .eq("id", document_id)
    .single();

  if (docError || !document) {
    return jsonResponse(404, { 
      ok: false, 
      error: "document_not_found",
      details: docError?.message
    });
  }

  if (document.tenant_id !== tenant_id) {
    return jsonResponse(403, { 
      ok: false, 
      error: "forbidden_tenant_mismatch"
    });
  }

  // Verify employee exists and belongs to tenant (optional check)
  const { data: employee, error: empError } = await supabase
    .from("employees")
    .select("id, tenant_id")
    .eq("id", employee_id)
    .eq("tenant_id", tenant_id)
    .single();

  if (empError) {
    console.log('Employee verification failed (may not be critical):', empError.message);
    // Continue with attachment even if employee table doesn't exist or query fails
  }

  // Prepare update data
  const updateData: any = {
    employee_id,
    updated_at: new Date().toISOString()
  };

  // Apply optional updates
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.doc_type !== undefined) updateData.doc_type = updates.doc_type;
  if (updates.effective_date !== undefined) updateData.effective_date = updates.effective_date;
  if (updates.expiry_date !== undefined) updateData.expiry_date = updates.expiry_date;
  if (updates.iqama_id !== undefined) updateData.iqama_id = updates.iqama_id;
  if (updates.national_id !== undefined) updateData.national_id = updates.national_id;

  // Update document
  const { data: updatedDoc, error: updateError } = await supabase
    .from("documents")
    .update(updateData)
    .eq("id", document_id)
    .eq("tenant_id", tenant_id)
    .select("*")
    .single();

  if (updateError) {
    return jsonResponse(500, { 
      ok: false, 
      error: "document_update_failed", 
      details: updateError.message 
    });
  }

  return jsonResponse(200, { 
    ok: true, 
    document: updatedDoc,
    operation: document.employee_id ? "reattached" : "attached",
    previous_employee_id: document.employee_id
  });
}

async function handleDetachDocument(documentId: string | null, req: Request) {
  if (!documentId || !isValidUUID(documentId)) {
    return jsonResponse(400, { ok: false, error: "invalid_document_id" });
  }

  const body = await req.json().catch(() => ({}));
  const { tenant_id } = body;

  if (!tenant_id || !isValidUUID(tenant_id)) {
    return jsonResponse(400, { ok: false, error: "invalid_tenant_id" });
  }

  // Verify document exists and belongs to tenant
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id, tenant_id, employee_id")
    .eq("id", documentId)
    .single();

  if (docError || !document) {
    return jsonResponse(404, { 
      ok: false, 
      error: "document_not_found",
      details: docError?.message
    });
  }

  if (document.tenant_id !== tenant_id) {
    return jsonResponse(403, { 
      ok: false, 
      error: "forbidden_tenant_mismatch"
    });
  }

  // Detach document from employee
  const { data: updatedDoc, error: updateError } = await supabase
    .from("documents")
    .update({ 
      employee_id: null,
      updated_at: new Date().toISOString()
    })
    .eq("id", documentId)
    .eq("tenant_id", tenant_id)
    .select("*")
    .single();

  if (updateError) {
    return jsonResponse(500, { 
      ok: false, 
      error: "document_detach_failed", 
      details: updateError.message 
    });
  }

  return jsonResponse(200, { 
    ok: true, 
    document: updatedDoc,
    operation: "detached",
    previous_employee_id: document.employee_id
  });
}

async function handleGetDocumentInfo(documentId: string | null, req: Request) {
  if (!documentId || !isValidUUID(documentId)) {
    return jsonResponse(400, { ok: false, error: "invalid_document_id" });
  }

  const url = new URL(req.url);
  const tenantId = url.searchParams.get('tenant_id');

  if (!tenantId || !isValidUUID(tenantId)) {
    return jsonResponse(400, { ok: false, error: "invalid_tenant_id" });
  }

  // Get document with employee info if attached
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select(`
      id,
      tenant_id,
      storage_bucket,
      storage_path,
      portal,
      doc_type,
      title,
      lang,
      employee_id,
      iqama_id,
      national_id,
      effective_date,
      expiry_date,
      processing_status,
      created_at,
      updated_at
    `)
    .eq("id", documentId)
    .eq("tenant_id", tenantId)
    .single();

  if (docError || !document) {
    return jsonResponse(404, { 
      ok: false, 
      error: "document_not_found",
      details: docError?.message
    });
  }

  // Try to get employee info if attached
  let employeeInfo = null;
  if (document.employee_id) {
    try {
      const { data: emp } = await supabase
        .from("employees")
        .select("id, name, iqama_id, national_id")
        .eq("id", document.employee_id)
        .eq("tenant_id", tenantId)
        .single();
      
      if (emp) {
        employeeInfo = emp;
      }
    } catch (e) {
      console.log('Employee info fetch failed (non-critical):', e);
    }
  }

  return jsonResponse(200, { 
    ok: true, 
    document: {
      ...document,
      employee_info: employeeInfo
    }
  });
}