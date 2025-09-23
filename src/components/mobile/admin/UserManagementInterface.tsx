import React, { useState } from 'react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  Edit, 
  Trash2, 
  Lock,
  Unlock,
  Crown,
  Building
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  role: 'super_admin' | 'admin' | 'hr_manager' | 'manager' | 'employee';
  company: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
}

export const UserManagementInterface: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Ahmad Al-Rashid',
      nameAr: 'أحمد الراشد',
      email: 'ahmad@company.com',
      role: 'super_admin',
      company: 'TechCorp',
      status: 'active',
      lastLogin: '2024-01-15 10:30',
      permissions: ['all_access']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      nameAr: 'سارة جونسون',
      email: 'sarah@company.com',
      role: 'admin',
      company: 'TechCorp',
      status: 'active',
      lastLogin: '2024-01-15 09:15',
      permissions: ['user_management', 'system_config']
    },
    {
      id: '3',
      name: 'Mohammed Hassan',
      nameAr: 'محمد حسن',
      email: 'mohammed@company.com',
      role: 'hr_manager',
      company: 'TechCorp',
      status: 'active',
      lastLogin: '2024-01-14 16:45',
      permissions: ['hr_management', 'employee_data']
    },
    {
      id: '4',
      name: 'Fatima Al-Zahra',
      nameAr: 'فاطمة الزهراء',
      email: 'fatima@company.com',
      role: 'manager',
      company: 'TechCorp',
      status: 'inactive',
      lastLogin: '2024-01-12 14:20',
      permissions: ['team_management']
    }
  ]);

  const [userStats] = useState({
    total: 1247,
    active: 1156,
    inactive: 67,
    suspended: 24,
    superAdmins: 3,
    admins: 12,
    hrManagers: 25,
    managers: 145,
    employees: 1062
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'hr_manager': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-green-100 text-green-800';
      case 'employee': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.nameAr.includes(searchTerm);
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {isArabic ? 'إدارة المستخدمين' : 'User Management'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* User Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{userStats.total.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{isArabic ? 'إجمالي المستخدمين' : 'Total Users'}</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{userStats.active.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{isArabic ? 'نشط' : 'Active'}</div>
            </div>
          </div>

          {/* Role Distribution */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
              <span className="text-sm">{isArabic ? 'مدير عام' : 'Super Admin'}</span>
              <Badge className="bg-purple-100 text-purple-800">{userStats.superAdmins}</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
              <span className="text-sm">{isArabic ? 'مدير' : 'Admin'}</span>
              <Badge className="bg-red-100 text-red-800">{userStats.admins}</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-sm">{isArabic ? 'مدير موارد بشرية' : 'HR Manager'}</span>
              <Badge className="bg-blue-100 text-blue-800">{userStats.hrManagers}</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-sm">{isArabic ? 'مدير فريق' : 'Manager'}</span>
              <Badge className="bg-green-100 text-green-800">{userStats.managers}</Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              <UserPlus className="h-4 w-4 mr-2" />
              {isArabic ? 'إضافة مستخدم' : 'Add User'}
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Shield className="h-4 w-4 mr-2" />
              {isArabic ? 'إدارة الأذونات' : 'Permissions'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isArabic ? 'البحث عن المستخدمين...' : 'Search users...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Tabs value={selectedRole} onValueChange={setSelectedRole}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="text-xs">
                  {isArabic ? 'الكل' : 'All'}
                </TabsTrigger>
                <TabsTrigger value="admin" className="text-xs">
                  {isArabic ? 'إداريين' : 'Admins'}
                </TabsTrigger>
                <TabsTrigger value="employee" className="text-xs">
                  {isArabic ? 'موظفين' : 'Employees'}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">
                      {isArabic ? user.nameAr : user.name}
                    </h3>
                    {user.role === 'super_admin' && (
                      <Crown className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{user.company}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 items-end">
                  <Badge className={getRoleColor(user.role)}>
                    {isArabic 
                      ? user.role === 'super_admin' ? 'مدير عام'
                        : user.role === 'admin' ? 'مدير'
                        : user.role === 'hr_manager' ? 'موارد بشرية'
                        : user.role === 'manager' ? 'مدير فريق' : 'موظف'
                      : user.role.replace('_', ' ').toUpperCase()
                    }
                  </Badge>
                  <Badge className={getStatusColor(user.status)}>
                    {isArabic 
                      ? user.status === 'active' ? 'نشط'
                        : user.status === 'inactive' ? 'غير نشط' : 'معلق'
                      : user.status
                    }
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>{isArabic ? 'آخر دخول:' : 'Last login:'} {user.lastLogin}</span>
                <span>{user.permissions.length} {isArabic ? 'صلاحيات' : 'permissions'}</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  {isArabic ? 'تعديل' : 'Edit'}
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  {user.status === 'active' ? (
                    <>
                      <Lock className="h-3 w-3 mr-1" />
                      {isArabic ? 'تعليق' : 'Suspend'}
                    </>
                  ) : (
                    <>
                      <Unlock className="h-3 w-3 mr-1" />
                      {isArabic ? 'تفعيل' : 'Activate'}
                    </>
                  )}
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};