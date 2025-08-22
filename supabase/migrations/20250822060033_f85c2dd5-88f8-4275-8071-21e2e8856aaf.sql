-- Insert sample data for plan gating (assuming basic structure exists)
-- This will fail gracefully if tables don't exist
INSERT INTO public.tenant_plans (tenant_id, plan_code, is_trial) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'starter', true)
ON CONFLICT (tenant_id, plan_code) DO NOTHING;