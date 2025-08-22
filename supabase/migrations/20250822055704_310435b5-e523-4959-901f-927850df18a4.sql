-- Add self_sell_growth feature
INSERT INTO public.features (feature_key, name, description, category)
VALUES ('self_sell_growth', 'Self-Sell Growth Features', 'ROI tracking, weekly reports, and shareable snapshots', 'growth')
ON CONFLICT (feature_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Add plans with self_sell_growth feature
INSERT INTO public.plans (code, name, description, price_mo, features)
VALUES 
  ('starter', 'Starter Plan', 'Basic HR management features', 99, ARRAY['basic_hr']),
  ('growth', 'Growth Plan', 'Advanced features with ROI tracking and analytics', 299, ARRAY['basic_hr', 'self_sell_growth', 'advanced_analytics']),
  ('pro', 'Pro Plan', 'Full feature suite for growing companies', 599, ARRAY['basic_hr', 'self_sell_growth', 'advanced_analytics', 'compliance_automation']),
  ('enterprise', 'Enterprise Plan', 'Complete solution for large organizations', 1299, ARRAY['basic_hr', 'self_sell_growth', 'advanced_analytics', 'compliance_automation', 'white_label'])
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_mo = EXCLUDED.price_mo,
  features = EXCLUDED.features;