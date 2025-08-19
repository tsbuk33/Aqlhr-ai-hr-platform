-- Set default super admin role for demonstration
INSERT INTO user_roles (user_id, role) 
VALUES (
  (SELECT id FROM auth.users LIMIT 1), 
  'super_admin'
) 
ON CONFLICT (user_id) 
DO UPDATE SET role = 'super_admin';