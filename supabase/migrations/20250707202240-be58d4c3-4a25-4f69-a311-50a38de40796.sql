-- Mobile attendance enhancement tables
CREATE TABLE public.mobile_attendance_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  device_info JSONB NOT NULL, -- device type, model, OS version
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  location_accuracy DECIMAL(8,2),
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  work_hours DECIMAL(4,2),
  overtime_hours DECIMAL(4,2) DEFAULT 0,
  break_duration DECIMAL(4,2) DEFAULT 0,
  photo_check_in_url TEXT,
  photo_check_out_url TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Mobile device registration
CREATE TABLE public.mobile_devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL UNIQUE, -- unique device identifier
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('ios', 'android', 'harmony')),
  os_version TEXT,
  app_version TEXT,
  push_token TEXT, -- for notifications
  is_active BOOLEAN DEFAULT true,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(employee_id, device_id)
);

-- Geofence locations for attendance
CREATE TABLE public.attendance_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ar TEXT,
  address TEXT NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  radius_meters INTEGER DEFAULT 100, -- geofence radius
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Break/pause tracking
CREATE TABLE public.attendance_breaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.mobile_attendance_sessions(id) ON DELETE CASCADE,
  break_start TIMESTAMP WITH TIME ZONE NOT NULL,
  break_end TIMESTAMP WITH TIME ZONE,
  break_type TEXT DEFAULT 'regular' CHECK (break_type IN ('regular', 'lunch', 'prayer', 'emergency')),
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mobile_attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mobile_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_breaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their mobile attendance sessions" ON public.mobile_attendance_sessions FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can manage their mobile devices" ON public.mobile_devices FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view attendance locations from their company" ON public.attendance_locations FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can manage attendance breaks" ON public.attendance_breaks FOR ALL USING (auth.uid() IS NOT NULL);

-- Indexes for performance
CREATE INDEX idx_mobile_attendance_employee_date ON public.mobile_attendance_sessions(employee_id, created_at);
CREATE INDEX idx_mobile_devices_employee ON public.mobile_devices(employee_id);
CREATE INDEX idx_attendance_locations_company ON public.attendance_locations(company_id);
CREATE INDEX idx_attendance_breaks_session ON public.attendance_breaks(session_id);

-- Triggers for timestamps
CREATE TRIGGER update_mobile_attendance_sessions_updated_at BEFORE UPDATE ON public.mobile_attendance_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert dummy data
-- Sample attendance locations
INSERT INTO public.attendance_locations (company_id, name, name_ar, address, latitude, longitude, radius_meters) 
SELECT 
  c.id,
  'Main Office - ' || c.name,
  'المكتب الرئيسي - ' || c.name,
  'Riyadh, Saudi Arabia',
  24.7136 + (RANDOM() * 0.1 - 0.05), -- Random coordinates around Riyadh
  46.6753 + (RANDOM() * 0.1 - 0.05),
  150
FROM public.companies c;

INSERT INTO public.attendance_locations (company_id, name, name_ar, address, latitude, longitude, radius_meters) 
SELECT 
  c.id,
  'Branch Office - ' || c.name,
  'المكتب الفرعي - ' || c.name,
  'Jeddah, Saudi Arabia',
  21.4858 + (RANDOM() * 0.1 - 0.05), -- Random coordinates around Jeddah
  39.1925 + (RANDOM() * 0.1 - 0.05),
  100
FROM public.companies c;

-- Sample mobile devices
INSERT INTO public.mobile_devices (employee_id, device_id, device_name, device_type, os_version, app_version, push_token)
SELECT 
  e.id,
  'device_' || e.employee_number || '_' || (CASE WHEN RANDOM() < 0.5 THEN 'ios' ELSE 'android' END),
  CASE 
    WHEN RANDOM() < 0.33 THEN 'iPhone 15 Pro'
    WHEN RANDOM() < 0.66 THEN 'Samsung Galaxy S24'
    ELSE 'Huawei Mate 60 Pro'
  END,
  CASE 
    WHEN RANDOM() < 0.4 THEN 'ios'
    WHEN RANDOM() < 0.8 THEN 'android'
    ELSE 'harmony'
  END,
  CASE 
    WHEN RANDOM() < 0.4 THEN '17.1.2'
    WHEN RANDOM() < 0.8 THEN '14.0'
    ELSE 'HarmonyOS 4.0'
  END,
  '1.0.0',
  'push_token_' || e.employee_number
FROM public.employees e
LIMIT 15; -- Sample devices for first 15 employees

-- Sample mobile attendance sessions (last 30 days)
INSERT INTO public.mobile_attendance_sessions (
  employee_id, device_info, location_lat, location_lng, location_accuracy, 
  check_in_time, check_out_time, work_hours, overtime_hours, status, sync_status
)
SELECT 
  e.id,
  jsonb_build_object(
    'device_type', md.device_type,
    'device_name', md.device_name,
    'os_version', md.os_version,
    'app_version', md.app_version
  ),
  al.latitude + (RANDOM() * 0.001 - 0.0005), -- Slight variation within geofence
  al.longitude + (RANDOM() * 0.001 - 0.0005),
  5.0 + RANDOM() * 10, -- 5-15m accuracy
  (CURRENT_DATE - INTERVAL '1 day' * FLOOR(RANDOM() * 30)) + INTERVAL '8 hours' + (RANDOM() * INTERVAL '2 hours'), -- Random check-in 8-10 AM
  (CURRENT_DATE - INTERVAL '1 day' * FLOOR(RANDOM() * 30)) + INTERVAL '16 hours' + (RANDOM() * INTERVAL '3 hours'), -- Random check-out 4-7 PM
  8.0 + RANDOM() * 2, -- 8-10 hours work
  CASE WHEN RANDOM() < 0.3 THEN RANDOM() * 2 ELSE 0 END, -- 30% chance of overtime
  'completed',
  'synced'
FROM public.employees e
JOIN public.mobile_devices md ON e.id = md.employee_id
CROSS JOIN public.attendance_locations al
WHERE al.company_id = e.company_id
LIMIT 100; -- 100 sample sessions

-- Sample breaks
INSERT INTO public.attendance_breaks (session_id, break_start, break_end, break_type, duration_minutes)
SELECT 
  mas.id,
  mas.check_in_time + INTERVAL '4 hours', -- Break 4 hours after check-in
  mas.check_in_time + INTERVAL '4 hours 30 minutes', -- 30-minute break
  CASE 
    WHEN RANDOM() < 0.4 THEN 'lunch'
    WHEN RANDOM() < 0.7 THEN 'prayer'
    ELSE 'regular'
  END,
  15 + FLOOR(RANDOM() * 45) -- 15-60 minute breaks
FROM public.mobile_attendance_sessions mas
WHERE mas.check_in_time IS NOT NULL
LIMIT 50;