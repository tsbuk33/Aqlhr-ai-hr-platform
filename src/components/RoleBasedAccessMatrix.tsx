import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, Users, UserCheck, Building2, Settings, Crown,
  CheckCircle, XCircle, AlertCircle, Eye, Edit, Lock, UserPlus
} from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface RolePermission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  approve: boolean;
  configure: boolean;
}

interface ModuleAccess {
  moduleName: string;
  moduleNameAr: string;
  permissions: {
    super_admin: RolePermission;
    hrbp: RolePermission;
    hr_manager: RolePermission;
    line_manager: RolePermission;
    employee: RolePermission;
  };
  description: string;
  descriptionAr: string;
}

const roleDefinitions = [
  {
    role: 'super_admin',
    title: 'Super Admin (Owner)',
    titleAr: 'المدير العام (المالك)',
    icon: Crown,
    color: 'bg-red-500',
    description: 'Full system access, user management, global configuration',
    descriptionAr: 'الوصول الكامل للنظام، إدارة المستخدمين، التكوين العام',
    level: 'OWNER',
    interfaces: '120+ (All)',
    keyResponsibilities: [
      'System configuration and setup',
      'User role management', 
      'Global policy setting',
      'Data export and backup',
      'Integration management',
      'Security configuration'
    ]
  },
  {
    role: 'hrbp',
    title: 'HRBP (HR Business Partner)',
    titleAr: 'شريك الموارد البشرية',
    icon: Users,
    color: 'bg-blue-500',
    description: 'Full HR operations, strategic planning, analytics access',
    descriptionAr: 'عمليات الموارد البشرية الكاملة، التخطيط الاستراتيجي، الوصول للتحليلات',
    level: 'STRATEGIC',
    interfaces: '85+',
    keyResponsibilities: [
      'Strategic HR planning',
      'Employee lifecycle management',
      'Performance management',
      'Compensation & benefits',
      'Analytics and reporting',
      'Compliance monitoring'
    ]
  },
  {
    role: 'hr_manager',
    title: 'HR Manager',
    titleAr: 'مدير الموارد البشرية',
    icon: Building2,
    color: 'bg-green-500',
    description: 'Departmental HR operations, team oversight, operational tasks',
    descriptionAr: 'عمليات الموارد البشرية القسمية، إشراف الفريق، المهام التشغيلية',
    level: 'OPERATIONAL',
    interfaces: '45+',
    keyResponsibilities: [
      'Department-level HR operations',
      'Employee onboarding',
      'Leave management',
      'Basic reporting',
      'Policy implementation',
      'Training coordination'
    ]
  },
  {
    role: 'line_manager',
    title: 'Line Manager',
    titleAr: 'المدير المباشر',
    icon: UserCheck,
    color: 'bg-yellow-500',
    description: 'Team management, approval workflows, direct reports oversight',
    descriptionAr: 'إدارة الفريق، سير عمل الموافقات، إشراف التقارير المباشرة',
    level: 'SUPERVISORY',
    interfaces: '25+',
    keyResponsibilities: [
      'Team performance management',
      'Leave approvals',
      'Time & attendance oversight',
      'Performance reviews',
      'Goal setting',
      'Team reports viewing'
    ]
  },
  {
    role: 'employee',
    title: 'Employee',
    titleAr: 'موظف',
    icon: Users,
    color: 'bg-purple-500',
    description: 'Self-service access, personal data management, basic interactions',
    descriptionAr: 'وصول الخدمة الذاتية، إدارة البيانات الشخصية، التفاعلات الأساسية',
    level: 'SELF-SERVICE',
    interfaces: '15+',
    keyResponsibilities: [
      'Personal profile management',
      'Leave requests',
      'Time tracking',
      'Document uploads',
      'Self-evaluation',
      'Benefits viewing'
    ]
  }
];

const moduleAccessMatrix: ModuleAccess[] = [
  {
    moduleName: "Employee Master Data",
    moduleNameAr: "البيانات الأساسية للموظفين",
    description: "Complete employee records, personal information, contracts",
    descriptionAr: "سجلات الموظفين الكاملة، المعلومات الشخصية، العقود",
    permissions: {
      super_admin: { create: true, read: true, update: true, delete: true, approve: true, configure: true },
      hrbp: { create: true, read: true, update: true, delete: false, approve: true, configure: false },
      hr_manager: { create: true, read: true, update: true, delete: false, approve: false, configure: false },
      line_manager: { create: false, read: true, update: false, delete: false, approve: false, configure: false },
      employee: { create: false, read: true, update: true, delete: false, approve: false, configure: false }
    }
  },
  {
    moduleName: "Payroll & Compensation",
    moduleNameAr: "الرواتب والتعويضات",
    description: "Salary processing, benefits, allowances, deductions",
    descriptionAr: "معالجة الرواتب، المزايا، البدلات، الخصومات",
    permissions: {
      super_admin: { create: true, read: true, update: true, delete: true, approve: true, configure: true },
      hrbp: { create: true, read: true, update: true, delete: false, approve: true, configure: false },
      hr_manager: { create: false, read: true, update: false, delete: false, approve: false, configure: false },
      line_manager: { create: false, read: false, update: false, delete: false, approve: false, configure: false },
      employee: { create: false, read: true, update: false, delete: false, approve: false, configure: false }
    }
  },
  {
    moduleName: "Performance Management",
    moduleNameAr: "إدارة الأداء",
    description: "Performance reviews, goals, KPIs, evaluations",
    descriptionAr: "مراجعات الأداء، الأهداف، مؤشرات الأداء، التقييمات",
    permissions: {
      super_admin: { create: true, read: true, update: true, delete: true, approve: true, configure: true },
      hrbp: { create: true, read: true, update: true, delete: false, approve: true, configure: true },
      hr_manager: { create: true, read: true, update: true, delete: false, approve: true, configure: false },
      line_manager: { create: true, read: true, update: true, delete: false, approve: true, configure: false },
      employee: { create: true, read: true, update: true, delete: false, approve: false, configure: false }
    }
  },
  {
    moduleName: "Time & Attendance",
    moduleNameAr: "الوقت والحضور",
    description: "Clock in/out, overtime, schedules, attendance tracking",
    descriptionAr: "تسجيل الدخول/الخروج، العمل الإضافي، الجداول، تتبع الحضور",
    permissions: {
      super_admin: { create: true, read: true, update: true, delete: true, approve: true, configure: true },
      hrbp: { create: false, read: true, update: true, delete: false, approve: true, configure: false },
      hr_manager: { create: false, read: true, update: true, delete: false, approve: true, configure: false },
      line_manager: { create: false, read: true, update: true, delete: false, approve: true, configure: false },
      employee: { create: true, read: true, update: true, delete: false, approve: false, configure: false }
    }
  },
  {
    moduleName: "Leave Management",
    moduleNameAr: "إدارة الإجازات",
    description: "Leave requests, approvals, balances, policies",
    descriptionAr: "طلبات الإجازة، الموافقات، الأرصدة، السياسات",
    permissions: {
      super_admin: { create: true, read: true, update: true, delete: true, approve: true, configure: true },
      hrbp: { create: true, read: true, update: true, delete: false, approve: true, configure: true },
      hr_manager: { create: true, read: true, update: true, delete: false, approve: true, configure: false },
      line_manager: { create: false, read: true, update: false, delete: false, approve: true, configure: false },
      employee: { create: true, read: true, update: true, delete: false, approve: false, configure: false }
    }
  },
  {
    moduleName: "Recruitment & Onboarding",
    moduleNameAr: "التوظيف والإدماج",
    description: "Job postings, candidate management, hiring process",
    descriptionAr: "إعلانات الوظائف، إدارة المرشحين، عملية التوظيف",
    permissions: {
      super_admin: { create: true, read: true, update: true, delete: true, approve: true, configure: true },
      hrbp: { create: true, read: true, update: true, delete: false, approve: true, configure: true },
      hr_manager: { create: true, read: true, update: true, delete: false, approve: false, configure: false },
      line_manager: { create: false, read: true, update: false, delete: false, approve: false, configure: false },
      employee: { create: false, read: false, update: false, delete: false, approve: false, configure: false }
    }
  },
  {
    moduleName: "AI & Analytics",
    moduleNameAr: "الذكاء الاصطناعي والتحليلات",
    description: "AI tools, predictive analytics, insights, dashboards",
    descriptionAr: "أدوات الذكاء الاصطناعي، التحليلات التنبؤية، الرؤى، لوحات القيادة",
    permissions: {
      super_admin: { create: true, read: true, update: true, delete: true, approve: true, configure: true },
      hrbp: { create: false, read: true, update: false, delete: false, approve: false, configure: false },
      hr_manager: { create: false, read: true, update: false, delete: false, approve: false, configure: false },
      line_manager: { create: false, read: true, update: false, delete: false, approve: false, configure: false },
      employee: { create: false, read: false, update: false, delete: false, approve: false, configure: false }
    }
  },
  {
    moduleName: "Government Integration",
    moduleNameAr: "التكامل الحكومي",
    description: "QIWA, ABSHER, Nitaqat, GOSI, MOL integrations",
    descriptionAr: "تكامل قوى، أبشر، نطاقات، التأمينات، العمل",
    permissions: {
      super_admin: { create: true, read: true, update: true, delete: true, approve: true, configure: true },
      hrbp: { create: false, read: true, update: false, delete: false, approve: false, configure: false },
      hr_manager: { create: false, read: true, update: false, delete: false, approve: false, configure: false },
      line_manager: { create: false, read: false, update: false, delete: false, approve: false, configure: false },
      employee: { create: false, read: false, update: false, delete: false, approve: false, configure: false }
    }
  },
  {
    moduleName: "Compliance & Legal",
    moduleNameAr: "الامتثال والقانونية",
    description: "Regulatory compliance, audit trails, documentation",
    descriptionAr: "الامتثال التنظيمي، مسارات التدقيق، التوثيق",
    permissions: {
      super_admin: { create: true, read: true, update: true, delete: true, approve: true, configure: true },
      hrbp: { create: false, read: true, update: false, delete: false, approve: false, configure: false },
      hr_manager: { create: false, read: true, update: false, delete: false, approve: false, configure: false },
      line_manager: { create: false, read: false, update: false, delete: false, approve: false, configure: false },
      employee: { create: false, read: false, update: false, delete: false, approve: false, configure: false }
    }
  },
  {
    moduleName: "System Administration",
    moduleNameAr: "إدارة النظام",
    description: "User management, security, backups, configurations",
    descriptionAr: "إدارة المستخدمين، الأمان، النسخ الاحتياطية، التكوينات",
    permissions: {
      super_admin: { create: true, read: true, update: true, delete: true, approve: true, configure: true },
      hrbp: { create: false, read: false, update: false, delete: false, approve: false, configure: false },
      hr_manager: { create: false, read: false, update: false, delete: false, approve: false, configure: false },
      line_manager: { create: false, read: false, update: false, delete: false, approve: false, configure: false },
      employee: { create: false, read: false, update: false, delete: false, approve: false, configure: false }
    }
  }
];

const getPermissionIcon = (hasPermission: boolean) => {
  if (hasPermission) {
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  } else {
    return <XCircle className="h-4 w-4 text-red-500" />;
  }
};

const getPermissionBadge = (level: string) => {
  const variants: { [key: string]: any } = {
    'OWNER': 'destructive',
    'STRATEGIC': 'default',
    'OPERATIONAL': 'secondary',
    'SUPERVISORY': 'outline',
    'SELF-SERVICE': 'outline'
  };
  return variants[level] || 'secondary';
};

export const RoleBasedAccessMatrix: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [selectedRole, setSelectedRole] = useState('super_admin');

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            {isArabic ? 'مصفوفة الوصول المبنية على الأدوار' : 'Role-Based Access Matrix'}
          </CardTitle>
          <CardDescription>
            {isArabic 
              ? 'مراجعة شاملة لصلاحيات الوصول والواجهات لكل نوع مستخدم في النظام'
              : 'Comprehensive review of access permissions and interfaces for each user type in the system'
            }
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            {isArabic ? 'نظرة عامة على الأدوار' : 'Roles Overview'}
          </TabsTrigger>
          <TabsTrigger value="permissions">
            {isArabic ? 'مصفوفة الصلاحيات' : 'Permissions Matrix'}
          </TabsTrigger>
          <TabsTrigger value="interfaces">
            {isArabic ? 'تفصيل الواجهات' : 'Interface Breakdown'}
          </TabsTrigger>
        </TabsList>

        {/* Roles Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleDefinitions.map((role) => (
              <Card key={role.role} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${role.color} text-white`}>
                      <role.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {isArabic ? role.titleAr : role.title}
                      </CardTitle>
                      <Badge variant={getPermissionBadge(role.level)} className="text-xs">
                        {role.level}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? role.descriptionAr : role.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {isArabic ? 'الواجهات المتاحة:' : 'Available Interfaces:'}
                      </span>
                      <Badge variant="secondary">{role.interfaces}</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      {isArabic ? 'المسؤوليات الرئيسية:' : 'Key Responsibilities:'}
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {role.keyResponsibilities.slice(0, 3).map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-primary">•</span>
                          {responsibility}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Permissions Matrix */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'مصفوفة الصلاحيات التفصيلية' : 'Detailed Permissions Matrix'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'صلاحيات CRUD (إنشاء، قراءة، تحديث، حذف) والموافقة والتكوين لكل وحدة'
                  : 'CRUD (Create, Read, Update, Delete), Approval, and Configuration permissions for each module'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {moduleAccessMatrix.map((module, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        {isArabic ? module.moduleNameAr : module.moduleName}
                      </CardTitle>
                      <CardDescription>
                        {isArabic ? module.descriptionAr : module.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <div className="grid grid-cols-6 gap-2 min-w-[800px]">
                          {/* Header */}
                          <div className="font-medium text-sm">
                            {isArabic ? 'الدور' : 'Role'}
                          </div>
                          <div className="font-medium text-sm text-center">
                            {isArabic ? 'إنشاء' : 'Create'}
                          </div>
                          <div className="font-medium text-sm text-center">
                            {isArabic ? 'قراءة' : 'Read'}
                          </div>
                          <div className="font-medium text-sm text-center">
                            {isArabic ? 'تحديث' : 'Update'}
                          </div>
                          <div className="font-medium text-sm text-center">
                            {isArabic ? 'حذف' : 'Delete'}
                          </div>
                          <div className="font-medium text-sm text-center">
                            {isArabic ? 'موافقة' : 'Approve'}
                          </div>
                          
                          {/* Rows */}
                          {Object.entries(module.permissions).map(([role, permissions]) => {
                            const roleInfo = roleDefinitions.find(r => r.role === role);
                            return (
                              <React.Fragment key={role}>
                                <div className="text-sm py-2">
                                  <Badge variant="outline" className="text-xs">
                                    {isArabic ? roleInfo?.titleAr : roleInfo?.title}
                                  </Badge>
                                </div>
                                <div className="flex justify-center py-2">
                                  {getPermissionIcon(permissions.create)}
                                </div>
                                <div className="flex justify-center py-2">
                                  {getPermissionIcon(permissions.read)}
                                </div>
                                <div className="flex justify-center py-2">
                                  {getPermissionIcon(permissions.update)}
                                </div>
                                <div className="flex justify-center py-2">
                                  {getPermissionIcon(permissions.delete)}
                                </div>
                                <div className="flex justify-center py-2">
                                  {getPermissionIcon(permissions.approve)}
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interface Breakdown */}
        <TabsContent value="interfaces" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isArabic ? 'تفصيل الواجهات المتاحة لكل دور' : 'Available Interfaces by Role'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'قائمة شاملة بجميع الواجهات والوحدات المتاحة لكل نوع مستخدم'
                  : 'Comprehensive list of all interfaces and modules available to each user type'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {roleDefinitions.map((role) => (
                  <Card key={role.role} className="h-fit">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${role.color} text-white`}>
                          <role.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {isArabic ? role.titleAr : role.title}
                          </CardTitle>
                          <Badge variant={getPermissionBadge(role.level)} className="text-xs">
                            {role.interfaces} {isArabic ? 'واجهة' : 'Interfaces'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">
                          {isArabic ? 'الوحدات الرئيسية:' : 'Main Modules:'}
                        </h4>
                        <ul className="text-sm space-y-1">
                          {role.keyResponsibilities.map((responsibility, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{responsibility}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {role.role === 'super_admin' && (
                          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="flex items-start gap-2">
                              <Crown className="h-4 w-4 text-red-500 mt-0.5" />
                              <div className="text-xs text-red-700 dark:text-red-300">
                                <div className="font-medium">
                                  {isArabic ? 'صلاحيات المالك الكاملة' : 'Full Owner Privileges'}
                                </div>
                                <div className="mt-1">
                                  {isArabic 
                                    ? 'وصول كامل لجميع الواجهات، التكوين، والإدارة المتقدمة'
                                    : 'Complete access to all interfaces, configuration, and advanced administration'
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoleBasedAccessMatrix;