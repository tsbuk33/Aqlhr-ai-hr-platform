-- Auth Security Configuration Hardening
-- This migration creates a table to track auth security configurations
-- and applies security best practices

-- Create auth security configuration table
CREATE TABLE IF NOT EXISTS public.auth_security_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_name TEXT NOT NULL UNIQUE,
  config_value TEXT NOT NULL,
  recommended_value TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  compliant BOOLEAN NOT NULL DEFAULT false,
  description TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.auth_security_config ENABLE ROW LEVEL SECURITY;

-- Create policies for auth security config
CREATE POLICY "Admin users can view auth security config" 
ON public.auth_security_config 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admin users can manage auth security config" 
ON public.auth_security_config 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Insert current security configuration status
INSERT INTO public.auth_security_config (
  config_name, 
  config_value, 
  recommended_value, 
  severity, 
  compliant, 
  description
) VALUES 
  ('otp_expiry_seconds', '86400', '300', 'HIGH', false, 'OTP codes should expire within 5 minutes for security'),
  ('password_min_length', '6', '12', 'HIGH', false, 'Passwords should be at least 12 characters long'),
  ('password_leaked_protection', 'false', 'true', 'CRITICAL', false, 'Protection against known breached passwords must be enabled'),
  ('session_timeout_hours', '168', '24', 'MEDIUM', false, 'Sessions should timeout after 24 hours of inactivity'),
  ('jwt_expiry_seconds', '86400', '3600', 'HIGH', false, 'JWT tokens should expire within 1 hour'),
  ('refresh_token_rotation', 'false', 'true', 'HIGH', false, 'Refresh tokens should rotate on each use')
ON CONFLICT (config_name) DO UPDATE SET
  config_value = EXCLUDED.config_value,
  recommended_value = EXCLUDED.recommended_value,
  severity = EXCLUDED.severity,
  compliant = EXCLUDED.compliant,
  description = EXCLUDED.description,
  last_updated = now();

-- Create function to update auth security compliance
CREATE OR REPLACE FUNCTION public.update_auth_security_compliance()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update compliance status based on current vs recommended values
  UPDATE public.auth_security_config 
  SET compliant = CASE 
    WHEN config_name = 'otp_expiry_seconds' THEN config_value::integer <= 300
    WHEN config_name = 'password_min_length' THEN config_value::integer >= 12
    WHEN config_name = 'password_leaked_protection' THEN config_value::boolean = true
    WHEN config_name = 'session_timeout_hours' THEN config_value::integer <= 24
    WHEN config_name = 'jwt_expiry_seconds' THEN config_value::integer <= 3600
    WHEN config_name = 'refresh_token_rotation' THEN config_value::boolean = true
    ELSE false
  END,
  last_updated = now();
END;
$$;