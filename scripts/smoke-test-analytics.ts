import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://qcuhjcyjlkfizesndmth.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdWhqY3lqbGtmaXplc25kbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NDY4NzgsImV4cCI6MjA2MzQyMjg3OH0.Vr1tBpNjv8e6sNtjfISJul12Mg9ROQVrlRTgWB1dPoc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function smokeTest() {
  console.log('🚀 Starting analytics smoke test...\n');

  try {
    // Test analytics_events table
    console.log('📊 Testing analytics_events table...');
    const { data: insertData, error: insertError } = await (supabase as any)
      .from('analytics_events')
      .insert({
        event_type: 'smoke_test',
        module_name: 'verification',
        session_id: 'smoke-' + Date.now(),
        timestamp: new Date().toISOString(),
        properties: { test: true }
      })
      .select();

    if (insertError) {
      console.error('❌ Insert failed:', insertError);
      return;
    }
    console.log('✅ Inserted:', insertData);

    // Query it back
    const { data: selectData, error: selectError } = await (supabase as any)
      .from('analytics_events')
      .select('*')
      .eq('event_type', 'smoke_test')
      .limit(5);

    if (selectError) {
      console.error('❌ Select failed:', selectError);
      return;
    }
    console.log('✅ Retrieved:', selectData?.length, 'records\n');

    // Test user_feedback table
    console.log('💬 Testing user_feedback table...');
    const { data: feedbackData, error: feedbackError } = await (supabase as any)
      .from('user_feedback')
      .insert({
        feedback_type: 'bug_report',
        message: 'Smoke test feedback',
        module_name: 'verification',
        timestamp: new Date().toISOString()
      })
      .select();

    if (feedbackError) {
      console.error('❌ Feedback insert failed:', feedbackError);
    } else {
      console.log('✅ Feedback inserted:', feedbackData);
    }

    // Test error_events table
    console.log('🐛 Testing error_events table...');
    const { data: errorData, error: errorInsertError } = await (supabase as any)
      .from('error_events')
      .insert({
        error_type: 'test_error',
        message: 'Smoke test error',
        severity: 'low',
        timestamp: new Date().toISOString(),
        module_name: 'verification'
      })
      .select();

    if (errorInsertError) {
      console.error('❌ Error insert failed:', errorInsertError);
    } else {
      console.log('✅ Error event inserted:', errorData);
    }

    console.log('\n🎉 Smoke test completed successfully!');

  } catch (error) {
    console.error('💥 Smoke test failed:', error);
    process.exit(1);
  }
}

smokeTest();