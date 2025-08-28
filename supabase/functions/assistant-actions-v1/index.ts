// Deno Edge: unified actions for assistant UI (create_task, save_note, feedback)
// Phase 24: Evidence -> Action loop functionality
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const URL = Deno.env.get('SUPABASE_URL')!;
const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;

interface CreateTaskBody {
  op: 'create_task';
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
  due_at?: string | null;
  assignee?: string | null;
  labels?: string[] | null;
}

interface SaveNoteBody {
  op: 'save_note';
  title: string;
  content: string;
  lang?: 'en' | 'ar';
  citations?: any[];
}

interface FeedbackBody {
  op: 'feedback';
  session_id?: string | null;
  message_id?: string | null;
  question: string;
  answer: string;
  helpful: boolean;
  reason?: string | null;
}

type RequestBody = CreateTaskBody | SaveNoteBody | FeedbackBody;

Deno.serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'method_not_allowed' }, 405, corsHeaders);
    }

    const auth = req.headers.get('authorization') || undefined;
    const supabase = createClient(URL, ANON, { 
      global: { 
        headers: auth ? { Authorization: auth } : {} 
      }
    });

    const body = await safeJsonParse(req);
    
    if (!body?.op) {
      return jsonResponse({ ok: false, error: 'missing_operation' }, 400, corsHeaders);
    }

    switch (body.op) {
      case 'create_task': {
        const { 
          title, 
          description, 
          priority = 'medium', 
          due_at = null, 
          assignee = null, 
          labels = null 
        } = body;

        if (!title || !description) {
          return jsonResponse({ ok: false, error: 'missing_required_fields' }, 400, corsHeaders);
        }

        const { data, error } = await supabase.rpc('assistant_create_task_v1', {
          p_title: title,
          p_description: description,
          p_priority: priority,
          p_due_at: due_at ? new Date(due_at).toISOString() : null,
          p_assignee: assignee,
          p_labels: labels
        });

        if (error) {
          console.error('Task creation error:', error);
          return jsonResponse({ ok: false, error: error.message }, 400, corsHeaders);
        }

        return jsonResponse({ ok: true, id: data }, 200, corsHeaders);
      }

      case 'save_note': {
        const { 
          title, 
          content, 
          lang = 'en', 
          citations = [] 
        } = body;

        if (!title || !content) {
          return jsonResponse({ ok: false, error: 'missing_required_fields' }, 400, corsHeaders);
        }

        const { data, error } = await supabase.rpc('assistant_save_note_v1', {
          p_title: title,
          p_content: content,
          p_lang: lang,
          p_citations: JSON.stringify(citations)
        });

        if (error) {
          console.error('Note save error:', error);
          return jsonResponse({ ok: false, error: error.message }, 400, corsHeaders);
        }

        return jsonResponse({ ok: true, id: data }, 200, corsHeaders);
      }

      case 'feedback': {
        const { 
          session_id = null, 
          message_id = null, 
          question, 
          answer, 
          helpful, 
          reason = null 
        } = body;

        if (!question || !answer || typeof helpful !== 'boolean') {
          return jsonResponse({ ok: false, error: 'missing_required_fields' }, 400, corsHeaders);
        }

        const { error } = await supabase.rpc('assistant_log_feedback_v1', {
          p_session_id: session_id,
          p_message_id: message_id,
          p_question: question,
          p_answer: answer,
          p_helpful: helpful,
          p_reason: reason
        });

        if (error) {
          console.error('Feedback logging error:', error);
          return jsonResponse({ ok: false, error: error.message }, 400, corsHeaders);
        }

        return jsonResponse({ ok: true }, 200, corsHeaders);
      }

      default:
        return jsonResponse({ ok: false, error: 'unknown_operation' }, 400, corsHeaders);
    }
  } catch (e: any) {
    console.error('Assistant actions error:', e);
    return jsonResponse(
      { ok: false, error: String(e?.message || e) }, 
      500, 
      corsHeaders
    );
  }
});

function jsonResponse(obj: any, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}

async function safeJsonParse(req: Request) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}