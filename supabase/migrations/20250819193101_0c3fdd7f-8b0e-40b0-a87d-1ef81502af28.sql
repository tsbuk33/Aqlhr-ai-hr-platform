-- Add super_admin to the app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'super_admin';

-- Set default super admin role for demonstration  
INSERT INTO user_roles (user_id, role) 
VALUES (
  (SELECT id FROM auth.users LIMIT 1), 
  'super_admin'
) 
ON CONFLICT (user_id) 
DO UPDATE SET role = 'super_admin';