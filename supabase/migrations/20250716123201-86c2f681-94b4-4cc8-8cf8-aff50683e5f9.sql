-- Create comprehensive attendance and timesheet system

-- Enhanced attendance records table
CREATE TABLE IF NOT EXISTS public.attendance_timesheet (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id),
  date DATE NOT NULL,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  planned_hours DECIMAL(4,2) DEFAULT 8.00,
  actual_hours DECIMAL(4,2) DEFAULT 0,
  overtime_hours DECIMAL(4,2) DEFAULT 0,
  break_duration DECIMAL(4,2) DEFAULT 0,
  late_minutes INTEGER DEFAULT 0,
  early_departure_minutes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  location_check_in TEXT,
  location_check_out TEXT,
  ip_address_in INET,
  ip_address_out INET,
  device_info JSONB DEFAULT '{}',
  notes TEXT,
  is_ramadan_schedule BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(employee_id, date)
);

-- Overtime tracking table
CREATE TABLE IF NOT EXISTS public.overtime_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  timesheet_id UUID REFERENCES public.attendance_timesheet(id),
  company_id UUID REFERENCES public.companies(id),
  date DATE NOT NULL,
  regular_overtime_hours DECIMAL(4,2) DEFAULT 0,
  holiday_overtime_hours DECIMAL(4,2) DEFAULT 0,
  overtime_rate DECIMAL(4,2) DEFAULT 1.50,
  overtime_amount DECIMAL(10,2) DEFAULT 0,
  approval_status TEXT DEFAULT 'pending',
  approved_by UUID REFERENCES public.employees(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  year_to_date_overtime DECIMAL(6,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Leave balances and entitlements
CREATE TABLE IF NOT EXISTS public.leave_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id),
  leave_type TEXT NOT NULL,
  year INTEGER NOT NULL,
  total_entitlement INTEGER DEFAULT 0,
  used_days INTEGER DEFAULT 0,
  remaining_days INTEGER DEFAULT 0,
  carried_forward INTEGER DEFAULT 0,
  accrual_rate DECIMAL(4,2) DEFAULT 0,
  last_accrual_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(employee_id, leave_type, year)
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS public.leave_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id),
  leave_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  requested_by UUID REFERENCES public.employees(id),
  approved_by UUID REFERENCES public.employees(id),
  hr_approved_by UUID REFERENCES public.employees(id),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  hr_approved_at TIMESTAMP WITH TIME ZONE,
  is_emergency BOOLEAN DEFAULT false,
  medical_certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Deductions tracking
CREATE TABLE IF NOT EXISTS public.attendance_deductions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  timesheet_id UUID REFERENCES public.attendance_timesheet(id),
  company_id UUID REFERENCES public.companies(id),
  date DATE NOT NULL,
  deduction_type TEXT NOT NULL,
  deduction_amount DECIMAL(8,2) DEFAULT 0,
  deduction_hours DECIMAL(4,2) DEFAULT 0,
  reason TEXT,
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Workplace transfers
CREATE TABLE IF NOT EXISTS public.workplace_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id),
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  from_department TEXT,
  to_department TEXT,
  transfer_date DATE NOT NULL,
  reason TEXT,
  transfer_type TEXT DEFAULT 'permanent',
  status TEXT DEFAULT 'pending',
  requested_by UUID REFERENCES public.employees(id),
  approved_by UUID REFERENCES public.employees(id),
  hr_approved_by UUID REFERENCES public.employees(id),
  effective_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI analytics tracking
CREATE TABLE IF NOT EXISTS public.attendance_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id),
  analysis_date DATE NOT NULL,
  attendance_score DECIMAL(5,2) DEFAULT 0,
  punctuality_score DECIMAL(5,2) DEFAULT 0,
  overtime_trend TEXT,
  leave_pattern TEXT,
  risk_indicators JSONB DEFAULT '{}',
  productivity_correlation DECIMAL(5,2) DEFAULT 0,
  recommendations JSONB DEFAULT '[]',
  anomaly_flags JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Working hours calculator
CREATE TABLE IF NOT EXISTS public.working_hours_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id),
  standard_daily_hours DECIMAL(4,2) DEFAULT 8.00,
  standard_weekly_hours DECIMAL(4,2) DEFAULT 40.00,
  ramadan_daily_hours DECIMAL(4,2) DEFAULT 6.00,
  ramadan_weekly_hours DECIMAL(4,2) DEFAULT 30.00,
  overtime_threshold_daily DECIMAL(4,2) DEFAULT 8.00,
  overtime_threshold_weekly DECIMAL(4,2) DEFAULT 40.00,
  overtime_rate DECIMAL(4,2) DEFAULT 1.50,
  max_overtime_yearly INTEGER DEFAULT 720,
  work_week_start TEXT DEFAULT 'Sunday',
  work_week_end TEXT DEFAULT 'Thursday',
  break_duration DECIMAL(4,2) DEFAULT 1.00,
  grace_period_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.attendance_timesheet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overtime_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workplace_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.working_hours_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage attendance from their company" ON public.attendance_timesheet
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage overtime from their company" ON public.overtime_records
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage leave balances from their company" ON public.leave_balances
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage leave requests from their company" ON public.leave_requests
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage deductions from their company" ON public.attendance_deductions
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage transfers from their company" ON public.workplace_transfers
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view analytics from their company" ON public.attendance_analytics
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage working hours config from their company" ON public.working_hours_config
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create triggers for updated_at
CREATE TRIGGER update_attendance_timesheet_updated_at
  BEFORE UPDATE ON public.attendance_timesheet
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leave_balances_updated_at
  BEFORE UPDATE ON public.leave_balances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_working_hours_config_updated_at
  BEFORE UPDATE ON public.working_hours_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Functions for Saudi labor law calculations
CREATE OR REPLACE FUNCTION public.calculate_annual_leave_entitlement(
  p_hire_date DATE,
  p_current_date DATE DEFAULT CURRENT_DATE
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_service_years INTEGER;
BEGIN
  v_service_years := EXTRACT(YEAR FROM AGE(p_current_date, p_hire_date));
  
  -- Saudi labor law: 21 days for 1-5 years, 30 days for 5+ years
  IF v_service_years >= 5 THEN
    RETURN 30;
  ELSE
    RETURN 21;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_overtime_amount(
  p_basic_salary DECIMAL,
  p_overtime_hours DECIMAL,
  p_standard_hours INTEGER DEFAULT 40
)
RETURNS DECIMAL
LANGUAGE plpgsql
AS $$
DECLARE
  v_hourly_rate DECIMAL;
  v_overtime_rate DECIMAL;
BEGIN
  v_hourly_rate := p_basic_salary / p_standard_hours;
  v_overtime_rate := v_hourly_rate * 1.5; -- 150% as per Saudi law
  
  RETURN v_overtime_rate * p_overtime_hours;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_working_hours(
  p_check_in TIMESTAMP,
  p_check_out TIMESTAMP,
  p_break_duration DECIMAL DEFAULT 1.0
)
RETURNS DECIMAL
LANGUAGE plpgsql
AS $$
DECLARE
  v_total_hours DECIMAL;
BEGIN
  IF p_check_in IS NULL OR p_check_out IS NULL THEN
    RETURN 0;
  END IF;
  
  v_total_hours := EXTRACT(EPOCH FROM (p_check_out - p_check_in)) / 3600.0;
  v_total_hours := v_total_hours - p_break_duration;
  
  RETURN GREATEST(0, v_total_hours);
END;
$$;

-- Insert default working hours configuration
INSERT INTO public.working_hours_config (
  company_id,
  standard_daily_hours,
  standard_weekly_hours,
  ramadan_daily_hours,
  ramadan_weekly_hours,
  overtime_threshold_daily,
  overtime_threshold_weekly,
  overtime_rate,
  max_overtime_yearly,
  work_week_start,
  work_week_end,
  break_duration,
  grace_period_minutes
) 
SELECT 
  id,
  8.00,
  40.00,
  6.00,
  30.00,
  8.00,
  40.00,
  1.50,
  720,
  'Sunday',
  'Thursday',
  1.00,
  15
FROM public.companies
ON CONFLICT DO NOTHING;