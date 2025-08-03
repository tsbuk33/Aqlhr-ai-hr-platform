import { createClient } from '@supabase/supabase-js';

async function testAnalytics() {
  const supabase = createClient(
    "https://qcuhjcyjlkfizesndmth.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdWhqY3lqbGtmaXplc25kbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NDY4NzgsImV4cCI6MjA2MzQyMjg3OH0.Vr1tBpNjv8e6sNtjfISJul12Mg9ROQVrlRTgWB1dPoc"
  );

  // 1) Insert a smoke event
  const { data: inserted, error: insertErr } = await (supabase as any)
    .from('analytics_events')
    .insert({ event_type: 'smoke', module_name: 'test', session_id: 'smoke' });
  console.log('Insert result:', inserted, insertErr);

  // 2) Query it back
  const { data: fetched, error: fetchErr } = await (supabase as any)
    .from('analytics_events')
    .select('*')
    .eq('event_type', 'smoke');
  console.log('Fetch result:', fetched, fetchErr);
}

testAnalytics().catch(console.error);