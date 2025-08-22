-- Create features table if it doesn't exist and add self_sell_growth
INSERT INTO public.features (code, name, description, category)
VALUES ('self_sell_growth', 'Self-Sell Growth Features', 'ROI tracking, weekly reports, and shareable snapshots', 'growth')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Add self_sell_growth feature to plans
INSERT INTO public.plan_features (plan_name, feature_key, is_enabled) 
VALUES 
  ('growth', 'self_sell_growth', true),
  ('pro', 'self_sell_growth', true),
  ('enterprise', 'self_sell_growth', true)
ON CONFLICT (plan_name, feature_key) DO UPDATE SET
  is_enabled = EXCLUDED.is_enabled;