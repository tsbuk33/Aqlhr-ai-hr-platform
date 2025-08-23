-- Per-tenant default locale
ALTER TABLE public.companies 
  ADD COLUMN IF NOT EXISTS default_locale text CHECK (default_locale IN ('en','ar')) DEFAULT 'en';

-- Per-user preferred locale  
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS language text CHECK (language IN ('en','ar'));

-- Helper: resolve user's locale with sane fallbacks
CREATE OR REPLACE FUNCTION public.get_user_locale()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    (SELECT language FROM public.profiles WHERE user_id = auth.uid()),
    (SELECT c.default_locale
       FROM public.companies c
       JOIN public.profiles p ON p.company_id = c.id
      WHERE p.user_id = auth.uid()
      LIMIT 1),
    'en'
  );
$$;