import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const testData = {
      event_type: 'smoke_test',
      module_name: 'debug_api',
      session_id: `smoke_${Date.now()}`,
      user_id: null,
      event_data: { test: true, timestamp: new Date().toISOString() }
    };

    // Test 1: Insert test data
    const { data: insertData, error: insertError } = await supabase
      .from('analytics_events')
      .insert(testData)
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({
        success: false,
        error: 'Insert failed',
        details: insertError.message,
        tests: {
          insert: { passed: false, error: insertError.message },
          select: { passed: false, error: 'Skipped due to insert failure' }
        }
      });
    }

    // Test 2: Select the data back
    const { data: selectData, error: selectError } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('session_id', testData.session_id)
      .single();

    if (selectError) {
      return res.status(500).json({
        success: false,
        error: 'Select failed',
        details: selectError.message,
        tests: {
          insert: { passed: true, data: insertData },
          select: { passed: false, error: selectError.message }
        }
      });
    }

    // Test 3: Cleanup - delete the test data
    const { error: deleteError } = await supabase
      .from('analytics_events')
      .delete()
      .eq('session_id', testData.session_id);

    return res.status(200).json({
      success: true,
      message: 'All tests passed',
      tests: {
        insert: { passed: true, data: insertData },
        select: { passed: true, data: selectData },
        cleanup: { passed: !deleteError, error: deleteError?.message }
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error',
      tests: {
        insert: { passed: false, error: 'Exception thrown' },
        select: { passed: false, error: 'Exception thrown' }
      }
    });
  }
}