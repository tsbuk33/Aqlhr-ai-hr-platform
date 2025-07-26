-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create translation_feedback table
CREATE TABLE IF NOT EXISTS public.translation_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id UUID,
  translation_key TEXT NOT NULL,
  original_text TEXT NOT NULL,
  suggested_text TEXT NOT NULL,
  context_url TEXT,
  screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'resolved', 'rejected')),
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  implemented_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pilot_group_users table
CREATE TABLE IF NOT EXISTS public.pilot_group_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pilot_features TEXT[] NOT NULL DEFAULT ARRAY['i18n_review'],
  access_level TEXT NOT NULL DEFAULT 'user' CHECK (access_level IN ('user', 'reviewer', 'admin')),
  company_id UUID,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, pilot_features)
);

-- Enable RLS
ALTER TABLE public.translation_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilot_group_users ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_translation_feedback_key ON public.translation_feedback(translation_key);
CREATE INDEX IF NOT EXISTS idx_translation_feedback_company ON public.translation_feedback(company_id);
CREATE INDEX IF NOT EXISTS idx_translation_feedback_status ON public.translation_feedback(status);
CREATE INDEX IF NOT EXISTS idx_pilot_group_users_user_id ON public.pilot_group_users(user_id);
CREATE INDEX IF NOT EXISTS idx_pilot_group_users_features ON public.pilot_group_users USING GIN(pilot_features);

-- Updated is_pilot_user function with security improvements
CREATE OR REPLACE FUNCTION public.is_pilot_user(user_uuid UUID, feature_name TEXT DEFAULT 'i18n_review')
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.pilot_group_users 
    WHERE user_id = user_uuid 
    AND is_active = true 
    AND feature_name = ANY(pilot_features)
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$;

-- Create updated_at trigger functions
CREATE OR REPLACE FUNCTION public.update_translation_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_pilot_group_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create notification function
CREATE OR REPLACE FUNCTION public.notify_translation_feedback_inserted()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'translation_feedback_inserted',
    json_build_object(
      'id', NEW.id,
      'translation_key', NEW.translation_key,
      'company_id', NEW.company_id
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_translation_feedback_updated_at
  BEFORE UPDATE ON public.translation_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_translation_feedback_updated_at();

CREATE TRIGGER update_pilot_group_users_updated_at
  BEFORE UPDATE ON public.pilot_group_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_pilot_group_users_updated_at();

CREATE TRIGGER notify_translation_feedback_inserted
  AFTER INSERT ON public.translation_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_translation_feedback_inserted();

-- RLS Policies for translation_feedback

-- SELECT: Users can see their own feedback or reviewers can see all for their company
CREATE POLICY "Users can view relevant translation feedback"
ON public.translation_feedback
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  (
    public.is_pilot_user(auth.uid(), 'i18n_review') 
    AND EXISTS (
      SELECT 1 FROM public.pilot_group_users 
      WHERE user_id = auth.uid() 
      AND access_level IN ('reviewer', 'admin')
      AND company_id = translation_feedback.company_id
    )
  )
);

-- INSERT: Authenticated users can create feedback
CREATE POLICY "Users can create translation feedback"
ON public.translation_feedback
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Only reviewers/admins can update status and review fields
CREATE POLICY "Reviewers can update translation feedback"
ON public.translation_feedback
FOR UPDATE
TO authenticated
USING (
  auth.uid() = reviewer_id
  OR
  (
    public.is_pilot_user(auth.uid(), 'i18n_review') 
    AND EXISTS (
      SELECT 1 FROM public.pilot_group_users 
      WHERE user_id = auth.uid() 
      AND access_level IN ('reviewer', 'admin')
      AND company_id = translation_feedback.company_id
    )
  )
)
WITH CHECK (
  auth.uid() = reviewer_id
  OR
  (
    public.is_pilot_user(auth.uid(), 'i18n_review') 
    AND EXISTS (
      SELECT 1 FROM public.pilot_group_users 
      WHERE user_id = auth.uid() 
      AND access_level IN ('reviewer', 'admin')
      AND company_id = translation_feedback.company_id
    )
  )
);

-- DELETE: Only admins can delete feedback
CREATE POLICY "Admins can delete translation feedback"
ON public.translation_feedback
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pilot_group_users 
    WHERE user_id = auth.uid() 
    AND access_level = 'admin'
    AND company_id = translation_feedback.company_id
  )
);

-- RLS Policies for pilot_group_users

-- SELECT: Users can only see their own pilot group entry
CREATE POLICY "Users can view their own pilot group status"
ON public.pilot_group_users
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- INSERT: Only admins can add users to pilot groups
CREATE POLICY "Admins can add pilot group users"
ON public.pilot_group_users
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pilot_group_users existing
    WHERE existing.user_id = auth.uid() 
    AND existing.access_level = 'admin'
    AND existing.is_active = true
  )
);

-- UPDATE: Only admins can update pilot group users
CREATE POLICY "Admins can update pilot group users"
ON public.pilot_group_users
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pilot_group_users existing
    WHERE existing.user_id = auth.uid() 
    AND existing.access_level = 'admin'
    AND existing.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pilot_group_users existing
    WHERE existing.user_id = auth.uid() 
    AND existing.access_level = 'admin'
    AND existing.is_active = true
  )
);

-- DELETE: Only admins can remove pilot group users
CREATE POLICY "Admins can remove pilot group users"
ON public.pilot_group_users
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.pilot_group_users existing
    WHERE existing.user_id = auth.uid() 
    AND existing.access_level = 'admin'
    AND existing.is_active = true
  )
);

-- Data retention reminder (comment for future implementation)
-- TODO: Implement data retention policy to purge translation_feedback older than 1 year
-- Example: DELETE FROM public.translation_feedback WHERE created_at < now() - interval '1 year';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.translation_feedback TO authenticated;
GRANT ALL ON public.pilot_group_users TO authenticated;