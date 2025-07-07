import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckInRequest {
  employee_id: string;
  device_info: {
    device_type: 'ios' | 'android' | 'harmony';
    device_name: string;
    os_version: string;
    app_version: string;
  };
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  photo_url?: string;
  notes?: string;
}

interface CheckOutRequest {
  session_id: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  photo_url?: string;
  notes?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authorization');
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    switch (path) {
      case 'check-in':
        return await handleCheckIn(req, supabase);
      case 'check-out':
        return await handleCheckOut(req, supabase);
      case 'break-start':
        return await handleBreakStart(req, supabase);
      case 'break-end':
        return await handleBreakEnd(req, supabase);
      case 'sync-offline':
        return await handleOfflineSync(req, supabase);
      case 'locations':
        return await getAttendanceLocations(req, supabase);
      case 'sessions':
        return await getAttendanceSessions(req, supabase);
      default:
        throw new Error('Invalid endpoint');
    }
  } catch (error) {
    console.error('Error in mobile-attendance function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleCheckIn(req: Request, supabase: any) {
  const body: CheckInRequest = await req.json();
  
  // Validate location is within geofence
  const { data: locations } = await supabase
    .from('attendance_locations')
    .select('*')
    .eq('is_active', true);

  const isWithinGeofence = locations?.some((location: any) => {
    const distance = calculateDistance(
      body.location.latitude,
      body.location.longitude,
      location.latitude,
      location.longitude
    );
    return distance <= location.radius_meters;
  });

  if (!isWithinGeofence) {
    throw new Error('Location is outside allowed attendance areas');
  }

  // Check for existing active session
  const { data: existingSession } = await supabase
    .from('mobile_attendance_sessions')
    .select('*')
    .eq('employee_id', body.employee_id)
    .eq('status', 'active')
    .single();

  if (existingSession) {
    throw new Error('Employee already has an active attendance session');
  }

  // Create new attendance session
  const { data: session, error } = await supabase
    .from('mobile_attendance_sessions')
    .insert({
      employee_id: body.employee_id,
      device_info: body.device_info,
      location_lat: body.location.latitude,
      location_lng: body.location.longitude,
      location_accuracy: body.location.accuracy,
      check_in_time: new Date().toISOString(),
      photo_check_in_url: body.photo_url,
      notes: body.notes,
      status: 'active'
    })
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ 
      success: true, 
      session_id: session.id,
      check_in_time: session.check_in_time
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleCheckOut(req: Request, supabase: any) {
  const body: CheckOutRequest = await req.json();
  
  const checkOutTime = new Date();
  
  // Get the session and calculate work hours
  const { data: session, error: sessionError } = await supabase
    .from('mobile_attendance_sessions')
    .select('*')
    .eq('id', body.session_id)
    .eq('status', 'active')
    .single();

  if (sessionError || !session) {
    throw new Error('Invalid or inactive session');
  }

  const checkInTime = new Date(session.check_in_time);
  const workHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
  const overtimeHours = Math.max(0, workHours - 8);

  // Update session with check-out information
  const { error } = await supabase
    .from('mobile_attendance_sessions')
    .update({
      check_out_time: checkOutTime.toISOString(),
      location_lat: body.location.latitude,
      location_lng: body.location.longitude,
      location_accuracy: body.location.accuracy,
      work_hours: parseFloat(workHours.toFixed(2)),
      overtime_hours: parseFloat(overtimeHours.toFixed(2)),
      photo_check_out_url: body.photo_url,
      notes: body.notes || session.notes,
      status: 'completed'
    })
    .eq('id', body.session_id);

  if (error) throw error;

  return new Response(
    JSON.stringify({ 
      success: true,
      work_hours: workHours.toFixed(2),
      overtime_hours: overtimeHours.toFixed(2),
      check_out_time: checkOutTime.toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleBreakStart(req: Request, supabase: any) {
  const { session_id, break_type = 'regular' } = await req.json();

  const { data, error } = await supabase
    .from('attendance_breaks')
    .insert({
      session_id,
      break_start: new Date().toISOString(),
      break_type
    })
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, break_id: data.id }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleBreakEnd(req: Request, supabase: any) {
  const { break_id, notes } = await req.json();

  const breakEndTime = new Date();

  // Get break start time to calculate duration
  const { data: breakData } = await supabase
    .from('attendance_breaks')
    .select('break_start')
    .eq('id', break_id)
    .single();

  const duration = breakData ? 
    Math.round((breakEndTime.getTime() - new Date(breakData.break_start).getTime()) / (1000 * 60)) : 0;

  const { error } = await supabase
    .from('attendance_breaks')
    .update({
      break_end: breakEndTime.toISOString(),
      duration_minutes: duration,
      notes
    })
    .eq('id', break_id);

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, duration_minutes: duration }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleOfflineSync(req: Request, supabase: any) {
  const { offline_sessions } = await req.json();
  
  const results = [];
  
  for (const session of offline_sessions) {
    try {
      const { data, error } = await supabase
        .from('mobile_attendance_sessions')
        .upsert({
          ...session,
          sync_status: 'synced'
        });
      
      results.push({ 
        local_id: session.local_id, 
        success: !error, 
        error: error?.message 
      });
    } catch (err) {
      results.push({ 
        local_id: session.local_id, 
        success: false, 
        error: err.message 
      });
    }
  }

  return new Response(
    JSON.stringify({ sync_results: results }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getAttendanceLocations(req: Request, supabase: any) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('company_id');

  const { data, error } = await supabase
    .from('attendance_locations')
    .select('*')
    .eq('company_id', companyId)
    .eq('is_active', true);

  if (error) throw error;

  return new Response(
    JSON.stringify({ locations: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getAttendanceSessions(req: Request, supabase: any) {
  const url = new URL(req.url);
  const employeeId = url.searchParams.get('employee_id');
  const startDate = url.searchParams.get('start_date');
  const endDate = url.searchParams.get('end_date');

  let query = supabase
    .from('mobile_attendance_sessions')
    .select(`
      *,
      attendance_breaks (*)
    `)
    .eq('employee_id', employeeId)
    .order('created_at', { ascending: false });

  if (startDate) {
    query = query.gte('created_at', startDate);
  }
  if (endDate) {
    query = query.lte('created_at', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;

  return new Response(
    JSON.stringify({ sessions: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Utility function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}