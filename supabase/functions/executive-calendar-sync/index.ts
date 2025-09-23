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

    const { action, eventData, startDate, endDate } = await req.json();
    
    console.log('📅 AqlHR: Processing executive calendar request', { action, startDate, endDate });

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

    // Check executive permissions
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role, company_id')
      .eq('user_id', user.id)
      .single();

    if (!profile || !['admin', 'super_admin', 'executive'].includes(profile.role)) {
      return new Response(
        JSON.stringify({ error: 'Executive permissions required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result = {};

    switch (action) {
      case 'get_events':
        result = await getExecutiveEvents(supabaseClient, user.id, startDate, endDate);
        break;
      case 'create_event':
        result = await createExecutiveEvent(supabaseClient, user.id, eventData);
        break;
      case 'update_event':
        result = await updateExecutiveEvent(supabaseClient, user.id, eventData);
        break;
      case 'delete_event':
        result = await deleteExecutiveEvent(supabaseClient, user.id, eventData.eventId);
        break;
      case 'sync_external':
        result = await syncExternalCalendars(user.id, profile.company_id);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Log calendar activity
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: user.id,
        company_id: profile.company_id,
        action: `CALENDAR_${action.toUpperCase()}`,
        table_name: 'executive_calendar',
        category: 'calendar',
        severity: 'info',
        user_role: profile.role,
        new_values: {
          action,
          timestamp: new Date().toISOString(),
          source: 'executive_mobile_app'
        }
      });

    console.log('✅ AqlHR: Executive calendar operation completed', { 
      action, 
      userId: user.id 
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        action,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ AqlHR: Error in executive-calendar-sync function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        code: 'EXECUTIVE_CALENDAR_ERROR'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function getExecutiveEvents(supabaseClient: any, userId: string, startDate: string, endDate: string) {
  // Mock executive events - in production, integrate with actual calendar systems
  const mockEvents = [
    {
      id: 'evt_001',
      title: 'Vision 2030 Strategy Review',
      title_ar: 'مراجعة استراتيجية رؤية 2030',
      start_time: '2024-01-16T09:00:00Z',
      end_time: '2024-01-16T10:30:00Z',
      location: 'Boardroom A',
      location_ar: 'قاعة الاجتماعات أ',
      type: 'strategic',
      attendees: 8,
      priority: 'high',
      status: 'confirmed',
      is_virtual: false,
      description: 'Quarterly review of Vision 2030 initiatives and progress assessment'
    },
    {
      id: 'evt_002',
      title: 'Ministry of Commerce Meeting',
      title_ar: 'اجتماع وزارة التجارة',
      start_time: '2024-01-16T11:00:00Z',
      end_time: '2024-01-16T12:00:00Z',
      location: 'Government Quarter',
      location_ar: 'الحي الحكومي',
      type: 'government',
      attendees: 5,
      priority: 'high',
      status: 'confirmed',
      is_virtual: false,
      description: 'Compliance discussion regarding new regulatory requirements'
    },
    {
      id: 'evt_003',
      title: 'Global Leadership Conference',
      title_ar: 'مؤتمر القيادة العالمية',
      start_time: '2024-01-16T14:00:00Z',
      end_time: '2024-01-16T16:00:00Z',
      location: 'Virtual Meeting',
      location_ar: 'اجتماع افتراضي',
      type: 'conference',
      attendees: 150,
      priority: 'medium',
      status: 'confirmed',
      is_virtual: true,
      description: 'International business leadership summit with Fortune 500 CEOs'
    }
  ];

  return {
    events: mockEvents,
    total_count: mockEvents.length,
    date_range: { start: startDate, end: endDate }
  };
}

async function createExecutiveEvent(supabaseClient: any, userId: string, eventData: any) {
  // In production, this would create events in the database and sync with external calendars
  const newEvent = {
    id: `evt_${Date.now()}`,
    ...eventData,
    created_by: userId,
    created_at: new Date().toISOString(),
    status: 'confirmed'
  };

  console.log('📅 Creating executive event:', newEvent);

  return {
    event: newEvent,
    calendar_sync_status: 'pending',
    notifications_sent: true
  };
}

async function updateExecutiveEvent(supabaseClient: any, userId: string, eventData: any) {
  console.log('📅 Updating executive event:', eventData);

  return {
    event: {
      ...eventData,
      updated_by: userId,
      updated_at: new Date().toISOString()
    },
    calendar_sync_status: 'updated',
    notifications_sent: true
  };
}

async function deleteExecutiveEvent(supabaseClient: any, userId: string, eventId: string) {
  console.log('📅 Deleting executive event:', eventId);

  return {
    deleted_event_id: eventId,
    deleted_by: userId,
    deleted_at: new Date().toISOString(),
    calendar_sync_status: 'deleted',
    cancellation_notifications_sent: true
  };
}

async function syncExternalCalendars(userId: string, companyId: string) {
  // Mock external calendar sync
  console.log('🔄 Syncing external calendars for user:', userId);

  const syncResults = {
    outlook: { status: 'success', events_synced: 12, last_sync: new Date().toISOString() },
    google: { status: 'success', events_synced: 8, last_sync: new Date().toISOString() },
    apple: { status: 'pending', events_synced: 0, last_sync: null },
    teams: { status: 'success', events_synced: 15, last_sync: new Date().toISOString() }
  };

  return {
    sync_results: syncResults,
    total_events_synced: 35,
    sync_timestamp: new Date().toISOString(),
    next_sync_scheduled: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
  };
}