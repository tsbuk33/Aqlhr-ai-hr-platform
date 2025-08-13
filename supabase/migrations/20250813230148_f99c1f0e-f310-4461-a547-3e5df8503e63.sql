-- Create a profile for the existing authenticated user
-- This fixes the 406 error when trying to fetch user profile

INSERT INTO public.profiles (user_id, email)
SELECT 
  '63ae4d9a-0f5e-4fd3-8cc8-cab66528392b'::uuid,
  'tsbuk33@gmail.com'
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = '63ae4d9a-0f5e-4fd3-8cc8-cab66528392b'::uuid
);

-- Also ensure any future users automatically get profiles created
-- Update the trigger function to handle the case better
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;