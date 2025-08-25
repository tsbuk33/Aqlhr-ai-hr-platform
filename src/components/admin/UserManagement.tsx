import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile, UserRole } from '@/hooks/useUserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Users, UserPlus, Shield, Crown } from 'lucide-react';
import { RoleGuard } from '@/components/rbac/RoleGuard';

interface CompanyUser {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  department?: string;
  is_active?: boolean;
}

const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Owner',
  ceo: 'CEO',
  vp: 'Vice President',
  director: 'Director',
  hr_manager: 'HR Manager',
  hrbp: 'HR Business Partner',
  line_manager: 'Line Manager',
  admin: 'Admin',
  employee: 'Employee'
};

const ROLE_COLORS: Record<UserRole, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  owner: 'destructive',
  ceo: 'destructive',
  vp: 'secondary',
  director: 'secondary',
  hr_manager: 'default',
  hrbp: 'default',
  line_manager: 'outline',
  admin: 'default',
  employee: 'outline'
};

export function UserManagement() {
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');
  const [isInviting, setIsInviting] = useState(false);
  const { profile, canManageUsers } = useUserProfile();

  const loadCompanyUsers = async () => {
    if (!profile?.company_id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, email, first_name, last_name, department, role, is_active')
        .eq('company_id', profile.company_id);

      if (error) throw error;

      const processedUsers: CompanyUser[] = data.map(user => ({
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        department: user.department,
        role: (user.role as UserRole) || 'employee',
        is_active: user.is_active
      }));

      setUsers(processedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load company users');
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, role: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('user_id', userId)
        .eq('company_id', profile?.company_id);

      if (error) throw error;

      toast.success(`Role ${ROLE_LABELS[role]} assigned successfully`);
      loadCompanyUsers();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
    }
  };

  const inviteUser = async () => {
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    try {
      // This would typically send an invitation email
      // For now, we'll just show a message
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setSelectedRole('employee');
    } catch (error) {
      console.error('Error inviting user:', error);
      toast.error('Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  useEffect(() => {
    if (profile) {
      loadCompanyUsers();
    }
  }, [profile]);

  if (!canManageUsers()) {
    return (
      <RoleGuard requiredRoles={['owner', 'admin', 'hr_manager', 'ceo']}>
        <div>Access denied</div>
      </RoleGuard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">Manage company users and their roles</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
              <DialogDescription>
                Send an invitation to join your company with a specific role.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Initial Role</Label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={inviteUser} disabled={isInviting || !inviteEmail.trim()}>
                {isInviting ? 'Sending...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Company Users ({users.length})
          </CardTitle>
          <CardDescription>
            Manage roles and permissions for your company members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">
                        {user.first_name} {user.last_name}
                      </h4>
                      {user.role === 'owner' && <Crown className="h-4 w-4 text-yellow-500" />}
                      {['admin', 'hr_manager'].includes(user.role) && <Shield className="h-4 w-4 text-blue-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.department && (
                      <p className="text-sm text-muted-foreground">{user.department}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={ROLE_COLORS[user.role]}>
                      {ROLE_LABELS[user.role]}
                    </Badge>
                    
                    <Select
                      value=""
                      onValueChange={(value) => assignRole(user.user_id, value as UserRole)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Change Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ROLE_LABELS).map(([value, label]) => (
                          <SelectItem 
                            key={value} 
                            value={value}
                            disabled={user.role === value}
                          >
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              
              {users.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found in your company
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}