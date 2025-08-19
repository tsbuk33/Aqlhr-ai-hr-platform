-- Create a unique constraint on user_id in user_roles if it doesn't exist
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_user_id_unique ON user_roles(user_id);

-- Now set the default super admin role for demonstration  
INSERT INTO user_roles (user_id, role) 
VALUES (
  (SELECT id FROM auth.users LIMIT 1), 
  'super_admin'
) 
ON CONFLICT (user_id) 
DO UPDATE SET role = 'super_admin';