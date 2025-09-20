-- SECURITY DEFINER DOCUMENTATION AND OPTIMIZATION (Step by Step)
-- This addresses Security Definer View warnings by documenting approved exceptions

-- Step 1: Create security exceptions tracking table
CREATE TABLE IF NOT EXISTS public.security_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exception_type TEXT NOT NULL,
    function_name TEXT NOT NULL,
    justification TEXT NOT NULL,
    approved_by TEXT NOT NULL DEFAULT 'security_audit',
    approved_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    review_date TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'under_review', 'revoked')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 2: Add unique constraint
ALTER TABLE public.security_exceptions ADD CONSTRAINT unique_function_exception 
UNIQUE(function_name, exception_type);

-- Step 3: Enable RLS on security exceptions table
ALTER TABLE public.security_exceptions ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policy for security exceptions
CREATE POLICY "Super admins can manage security exceptions"
ON public.security_exceptions
FOR ALL
USING (is_super_admin())
WITH CHECK (is_super_admin());