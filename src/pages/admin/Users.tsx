import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, UserPlus, Search, MoreHorizontal, 
  Shield, Eye, Edit, Trash2, Settings
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const UsersPage = () => {
  const { isArabic } = useSimpleLanguage();

  useEffect(() => {
    document.title = isArabic ? 'إدارة المستخدمين - سند' : 'User Management - SanadHR';
  }, [isArabic]);

  const users = [
    {
      id: 1,
      name: isArabic ? 'أحمد محمد الأحمد' : 'Ahmed Mohammed Al-Ahmad',
      email: 'ahmed.ahmad@company.com',
      role: isArabic ? 'مدير الموارد البشرية' : 'HR Manager',
      department: isArabic ? 'الموارد البشرية' : 'Human Resources',
      status: 'active',
      lastLogin: isArabic ? 'منذ ساعتين' : '2 hours ago',
      permissions: ['read', 'write', 'admin']
    },
    {
      id: 2,
      name: isArabic ? 'فاطمة علي السالم' : 'Fatima Ali Al-Salem',
      email: 'fatima.salem@company.com',
      role: isArabic ? 'أخصائي موارد بشرية' : 'HR Specialist',
      department: isArabic ? 'الموارد البشرية' : 'Human Resources',
      status: 'active',
      lastLogin: isArabic ? 'منذ 30 دقيقة' : '30 minutes ago',
      permissions: ['read', 'write']
    },
    {
      id: 3,
      name: isArabic ? 'خالد سعد الغامدي' : 'Khalid Saad Al-Ghamdi',
      email: 'khalid.ghamdi@company.com',
      role: isArabic ? 'مدير مالي' : 'Finance Manager',
      department: isArabic ? 'المالية' : 'Finance',
      status: 'active',
      lastLogin: isArabic ? 'منذ يوم واحد' : '1 day ago',
      permissions: ['read']
    },
    {
      id: 4,
      name: isArabic ? 'نورا حسن العتيبي' : 'Nora Hassan Al-Otaibi',
      email: 'nora.otaibi@company.com',
      role: isArabic ? 'مطور نظم' : 'System Developer',
      department: isArabic ? 'تقنية المعلومات' : 'IT',
      status: 'inactive',
      lastLogin: isArabic ? 'منذ أسبوع' : '1 week ago',
      permissions: ['read', 'write', 'admin']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (role: string) => {
    if (role.includes('مدير') || role.includes('Manager')) return 'text-purple-600 bg-purple-100';
    if (role.includes('أخصائي') || role.includes('Specialist')) return 'text-blue-600 bg-blue-100';
    if (role.includes('مطور') || role.includes('Developer')) return 'text-green-600 bg-green-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isArabic ? '👥 إدارة المستخدمين' : '👥 User Management'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isArabic ? 'إدارة حسابات المستخدمين والصلاحيات' : 'Manage user accounts and permissions'}
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          {isArabic ? 'إضافة مستخدم' : 'Add User'}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {isArabic ? 'البحث والتصفية' : 'Search & Filter'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input 
              placeholder={isArabic ? 'البحث عن مستخدم...' : 'Search users...'} 
              className="max-w-sm"
            />
            <Button variant="outline">
              {isArabic ? 'تصفية' : 'Filter'}
            </Button>
            <Button variant="outline">
              {isArabic ? 'تصدير' : 'Export'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {isArabic ? 'قائمة المستخدمين' : 'Users List'}
          </CardTitle>
          <CardDescription>
            {isArabic ? `إجمالي ${users.length} مستخدم` : `Total ${users.length} users`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge variant="outline">
                        {user.department}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge className={getStatusColor(user.status)} variant="secondary">
                      {user.status === 'active' ? (isArabic ? 'نشط' : 'Active') : 
                       user.status === 'inactive' ? (isArabic ? 'غير نشط' : 'Inactive') :
                       (isArabic ? 'قيد الانتظار' : 'Pending')}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isArabic ? 'آخر دخول:' : 'Last login:'} {user.lastLogin}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'مستخدم نشط' : 'Active Users'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.permissions.includes('admin')).length}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'مدراء النظام' : 'System Admins'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'طلبات الانضمام' : 'Pending Requests'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => u.status === 'inactive').length}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'حسابات معطلة' : 'Inactive Accounts'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersPage;