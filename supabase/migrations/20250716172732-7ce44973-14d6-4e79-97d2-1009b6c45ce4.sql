-- Check if user_roles table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        -- Create user roles table
        CREATE TABLE public.user_roles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
            role public.app_role NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            created_by UUID,
            is_active BOOLEAN DEFAULT true,
            UNIQUE(user_id, company_id, role)
        );
        
        -- Enable RLS
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policy
        CREATE POLICY "Users can view roles from their company" ON public.user_roles
            FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
END
$$;

-- Check if permission_type enum exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'permission_type') THEN
        CREATE TYPE public.permission_type AS ENUM (
            'create',
            'read', 
            'update',
            'delete',
            'approve',
            'configure',
            'manage',
            'monitor'
        );
    END IF;
END
$$;

-- Check if module_permissions table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'module_permissions') THEN
        CREATE TABLE public.module_permissions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            role public.app_role NOT NULL,
            module_name TEXT NOT NULL,
            permission_type public.permission_type NOT NULL,
            scope TEXT DEFAULT 'all',
            company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            UNIQUE(role, module_name, permission_type, company_id)
        );
        
        -- Enable RLS
        ALTER TABLE public.module_permissions ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policy
        CREATE POLICY "Users can view module permissions from their company" ON public.module_permissions
            FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
END
$$;

-- Check if integration_permissions table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'integration_permissions') THEN
        CREATE TABLE public.integration_permissions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            role public.app_role NOT NULL,
            integration_name TEXT NOT NULL,
            permission_type public.permission_type NOT NULL,
            company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            UNIQUE(role, integration_name, permission_type, company_id)
        );
        
        -- Enable RLS
        ALTER TABLE public.integration_permissions ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policy
        CREATE POLICY "Users can view integration permissions from their company" ON public.integration_permissions
            FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
END
$$;

-- Check if permission_audit_log table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'permission_audit_log') THEN
        CREATE TABLE public.permission_audit_log (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
            action TEXT NOT NULL,
            old_values JSONB,
            new_values JSONB,
            changed_by UUID NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Enable RLS
        ALTER TABLE public.permission_audit_log ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policy
        CREATE POLICY "Users can view permission audit logs from their company" ON public.permission_audit_log
            FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
END
$$;

-- Update the has_role function to include company_id parameter
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role, _company_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
            AND role = _role
            AND is_active = true
            AND (
                _company_id IS NULL 
                OR company_id = _company_id
            )
    )
$$;

-- Create function to get user permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id UUID, _company_id UUID)
RETURNS TABLE (
    module_name TEXT,
    permission_type public.permission_type,
    scope TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT DISTINCT mp.module_name, mp.permission_type, mp.scope
    FROM public.module_permissions mp
    JOIN public.user_roles ur ON ur.role = mp.role
    WHERE ur.user_id = _user_id
        AND ur.company_id = _company_id
        AND ur.is_active = true
        AND mp.is_active = true
$$;