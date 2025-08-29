import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export type Citation = {
  n: number; doc_id: string; title: string; portal?: string|null; doc_type?: string|null;
  created_at?: string; storage_bucket: string; storage_path: string;
};

export function useRAGStream() {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [text, setText] = useState('');
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function ask(question: string, lang: 'en'|'ar', options?: { filters?: any }) {
    setCitations([]); setText(''); setRunning(true);
    abort();

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const tok = (await supabase.auth.getSession()).data.session?.access_token;
    const r = await fetch('/functions/v1/rag-answer-v1', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Accept':'text/event-stream', ...(tok ? { Authorization: `Bearer ${tok}` } : {}) },
      body: JSON.stringify({ question, lang, stream: true, filters: options?.filters ?? {} }),
      signal: ctrl.signal
    });

    if (!r.ok || !r.body) { setRunning(false); return; }

    const reader = r.body.getReader();
    const dec = new TextDecoder();

    // very light SSE client
    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += dec.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || '';
      for (const chunk of parts) {
        const lines = chunk.split('\n');
        const evtLine = lines.find(l => l.startsWith('event:'));
        const dataLine = lines.find(l => l.startsWith('data:'));
        const evt = evtLine ? evtLine.replace('event:', '').trim() : 'message';
        const data = dataLine ? JSON.parse(dataLine.replace('data:', '').trim()) : null;

        if (evt === 'citations' && data?.citations) setCitations(data.citations);
        else if (evt === 'token' && data?.token) setText(prev => prev + data.token);
        else if (evt === 'done') setRunning(false);
      }
    }
    setRunning(false);
  }

  function abort(){ if (abortRef.current) { abortRef.current.abort(); abortRef.current = null; } }

  return { ask, citations, text, running, abort };
}