-- Create user roles enum
CREATE TYPE public.app_role AS ENUM (
    'super_admin',
    'hrbp', 
    'hr_manager',
    'line_manager',
    'employee',
    'it_admin',
    'auditor'
);

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

-- Create permissions enum
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

-- Create module permissions table
CREATE TABLE public.module_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role public.app_role NOT NULL,
    module_name TEXT NOT NULL,
    permission_type public.permission_type NOT NULL,
    scope TEXT DEFAULT 'all', -- 'all', 'own_data', 'department', 'team'
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(role, module_name, permission_type, company_id)
);

-- Create integration permissions table
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

-- Create audit trail for permission changes
CREATE TABLE public.permission_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- 'role_assigned', 'role_removed', 'permission_changed'
    old_values JSONB,
    new_values JSONB,
    changed_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permission_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view roles from their company" ON public.user_roles
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view module permissions from their company" ON public.module_permissions
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view integration permissions from their company" ON public.integration_permissions
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view permission audit logs from their company" ON public.permission_audit_log
    FOR ALL USING (auth.uid() IS NOT NULL);

-- Create function to check user role
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

-- Insert default permissions for all roles
INSERT INTO public.module_permissions (role, module_name, permission_type, scope) VALUES
-- Super Admin - Full access to all modules
('super_admin', 'employee_master_data', 'create', 'all'),
('super_admin', 'employee_master_data', 'read', 'all'),
('super_admin', 'employee_master_data', 'update', 'all'),
('super_admin', 'employee_master_data', 'delete', 'all'),
('super_admin', 'employee_master_data', 'approve', 'all'),

('super_admin', 'payroll_processing', 'create', 'all'),
('super_admin', 'payroll_processing', 'read', 'all'),
('super_admin', 'payroll_processing', 'update', 'all'),
('super_admin', 'payroll_processing', 'delete', 'all'),
('super_admin', 'payroll_processing', 'approve', 'all'),

-- HRBP - Comprehensive HR access
('hrbp', 'employee_master_data', 'create', 'all'),
('hrbp', 'employee_master_data', 'read', 'all'),
('hrbp', 'employee_master_data', 'update', 'all'),
('hrbp', 'employee_master_data', 'approve', 'all'),

('hrbp', 'payroll_processing', 'create', 'all'),
('hrbp', 'payroll_processing', 'read', 'all'),
('hrbp', 'payroll_processing', 'update', 'all'),
('hrbp', 'payroll_processing', 'approve', 'all'),

-- Employee - Limited self-service access
('employee', 'employee_master_data', 'read', 'own_data'),
('employee', 'employee_master_data', 'update', 'own_data'),
('employee', 'payroll_processing', 'read', 'own_data'),
('employee', 'time_attendance', 'create', 'own_data'),
('employee', 'time_attendance', 'read', 'own_data'),
('employee', 'time_attendance', 'update', 'own_data'),
('employee', 'leave_management', 'create', 'own_data'),
('employee', 'leave_management', 'read', 'own_data'),
('employee', 'leave_management', 'update', 'own_data'),
('employee', 'performance_management', 'create', 'own_data'),
('employee', 'performance_management', 'read', 'own_data'),
('employee', 'performance_management', 'update', 'own_data');

-- Insert default integration permissions
INSERT INTO public.integration_permissions (role, integration_name, permission_type) VALUES
-- Super Admin - Full integration access
('super_admin', 'microsoft_teams', 'configure'),
('super_admin', 'microsoft_teams', 'manage'),
('super_admin', 'microsoft_teams', 'monitor'),
('super_admin', 'sharepoint', 'configure'),
('super_admin', 'sharepoint', 'manage'),
('super_admin', 'sharepoint', 'monitor'),
('super_admin', 'power_bi', 'configure'),
('super_admin', 'power_bi', 'manage'),
('super_admin', 'power_bi', 'monitor'),

-- IT Admin - Technical integration access
('it_admin', 'microsoft_teams', 'configure'),
('it_admin', 'microsoft_teams', 'manage'),
('it_admin', 'microsoft_teams', 'monitor'),
('it_admin', 'sharepoint', 'configure'),
('it_admin', 'sharepoint', 'manage'),
('it_admin', 'sharepoint', 'monitor'),

-- Employee - Basic tool usage
('employee', 'microsoft_teams', 'read'),
('employee', 'sharepoint', 'read'),
('employee', 'whatsapp_business', 'read');