-- Add self_sell_growth feature to plans
INSERT INTO public.plan_features (plan_name, feature_key, is_enabled) 
VALUES 
  ('growth', 'self_sell_growth', true),
  ('pro', 'self_sell_growth', true),
  ('enterprise', 'self_sell_growth', true)
ON CONFLICT (plan_name, feature_key) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled;

-- Add to plans table if needed
INSERT INTO public.plans (code, name, price_mo, features, is_active)
VALUES 
  ('growth', 'Growth Plan', 299, ARRAY['self_sell_growth', 'advanced_analytics', 'roi_tracking'], true)
ON CONFLICT (code) DO UPDATE SET
  features = EXCLUDED.features,
  is_active = EXCLUDED.is_active;