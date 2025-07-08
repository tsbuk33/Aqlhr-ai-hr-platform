import React from 'react';
import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { EnhancedFormSystem } from "@/components/enhanced/EnhancedFormSystem";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, FileCheck, AlertTriangle, Search, Filter, Calendar, MapPin } from "lucide-react";

const EmployeeMasterData = () => {
  const { language } = useLanguage();

  const stats = [
    {
      title: language === 'ar' ? 'إجمالي الموظفين' : 'Total Employees',
      value: 2847,
      icon: Users,
      variant: "primary" as const,
      trend: { value: "12%", isPositive: true }
    },
    {
      title: language === 'ar' ? 'التوظيفات الجديدة هذا الشهر' : 'New Hires This Month',
      value: 67,
      icon: UserPlus,
      variant: "success" as const,
      trend: { value: "23%", isPositive: true }
    },
    {
      title: language === 'ar' ? 'معدل اكتمال البيانات' : 'Data Completion Rate',
      value: '94.2%',
      icon: FileCheck,
      variant: "accent" as const,
      trend: { value: "2%", isPositive: true }
    },
    {
      title: language === 'ar' ? 'التحديثات المعلقة' : 'Pending Updates',
      value: 23,
      icon: AlertTriangle,
      variant: "warning" as const
    }
  ];

  const quickActions = [
    {
      title: language === 'ar' ? 'إضافة موظف جديد' : 'Add New Employee',
      description: language === 'ar' ? 'تسجيل موظف جديد في النظام' : 'Register a new employee in the system',
      icon: UserPlus,
      color: "bg-blue-500",
      onClick: () => console.log('Add employee')
    },
    {
      title: language === 'ar' ? 'البحث في البيانات' : 'Search Employee Data',
      description: language === 'ar' ? 'البحث والفلترة المتقدمة' : 'Advanced search and filtering',
      icon: Search,
      color: "bg-green-500",
      onClick: () => console.log('Search employees')
    },
    {
      title: language === 'ar' ? 'تصدير التقارير' : 'Export Reports',
      description: language === 'ar' ? 'تصدير بيانات الموظفين' : 'Export employee data',
      icon: FileCheck,
      color: "bg-purple-500",
      onClick: () => console.log('Export data')
    },
    {
      title: language === 'ar' ? 'إدارة التنظيم' : 'Organization Management',
      description: language === 'ar' ? 'إدارة الأقسام والمناصب' : 'Manage departments and positions',
      icon: MapPin,
      color: "bg-orange-500",
      onClick: () => console.log('Manage org')
    }
  ];

  const employeeFormFields = [
    {
      name: 'firstName',
      label: 'First Name',
      arabicLabel: 'الاسم الأول',
      type: 'text' as const,
      required: true
    },
    {
      name: 'lastName',
      label: 'Last Name',
      arabicLabel: 'اسم العائلة',
      type: 'text' as const,
      required: true
    },
    {
      name: 'employeeNumber',
      label: 'Employee Number',
      arabicLabel: 'رقم الموظف',
      type: 'text' as const,
      required: true
    },
    {
      name: 'email',
      label: 'Email Address',
      arabicLabel: 'البريد الإلكتروني',
      type: 'email' as const,
      required: true,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: language === 'ar' ? 'تنسيق البريد الإلكتروني غير صحيح' : 'Invalid email format'
      }
    },
    {
      name: 'phone',
      label: 'Phone Number',
      arabicLabel: 'رقم الهاتف',
      type: 'text' as const,
      validation: {
        pattern: /^[\+]?[1-9][\d]{0,15}$/,
        message: language === 'ar' ? 'رقم هاتف غير صحيح' : 'Invalid phone number'
      }
    },
    {
      name: 'department',
      label: 'Department',
      arabicLabel: 'القسم',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'hr', label: language === 'ar' ? 'الموارد البشرية' : 'Human Resources' },
        { value: 'it', label: language === 'ar' ? 'تكنولوجيا المعلومات' : 'Information Technology' },
        { value: 'finance', label: language === 'ar' ? 'المالية' : 'Finance' },
        { value: 'marketing', label: language === 'ar' ? 'التسويق' : 'Marketing' }
      ]
    },
    {
      name: 'position',
      label: 'Position',
      arabicLabel: 'المنصب',
      type: 'text' as const,
      required: true
    },
    {
      name: 'salary',
      label: 'Salary (SAR)',
      arabicLabel: 'الراتب (ريال سعودي)',
      type: 'number' as const,
      validation: {
        min: 3000,
        max: 50000
      }
    },
    {
      name: 'nationality',
      label: 'Nationality',
      arabicLabel: 'الجنسية',
      type: 'select' as const,
      options: [
        { value: 'saudi', label: language === 'ar' ? 'سعودي' : 'Saudi' },
        { value: 'other', label: language === 'ar' ? 'أخرى' : 'Other' }
      ]
    },
    {
      name: 'notes',
      label: 'Additional Notes',
      arabicLabel: 'ملاحظات إضافية',
      type: 'textarea' as const
    }
  ];

  const documents = [
    {
      name: language === 'ar' ? 'كشف_بيانات_الموظفين_ديسمبر_2024.xlsx' : 'employee_data_export_december_2024.xlsx',
      type: language === 'ar' ? 'جدول بيانات' : 'Spreadsheet',
      date: '2024-12-30',
      size: '2.4 MB'
    },
    {
      name: language === 'ar' ? 'تقرير_البيانات_الناقصة.pdf' : 'incomplete_data_report.pdf',
      type: language === 'ar' ? 'تقرير' : 'Report',
      date: '2024-12-28',
      size: '890 KB'
    },
    {
      name: language === 'ar' ? 'قالب_بيانات_الموظف_الجديد.docx' : 'new_employee_data_template.docx',
      type: language === 'ar' ? 'قالب' : 'Template',
      date: '2024-12-20',
      size: '245 KB'
    }
  ];

  const tabs = [
    {
      id: 'overview',
      label: language === 'ar' ? 'نظرة عامة' : 'Overview',
      content: (
        <div className="space-y-6">
          {/* Employee Directory */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{language === 'ar' ? 'دليل الموظفين' : 'Employee Directory'}</CardTitle>
                  <CardDescription>
                    {language === 'ar' ? 'البحث والإطلاع على بيانات الموظفين' : 'Search and view employee information'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                    <span className="ml-2">{language === 'ar' ? 'فلترة' : 'Filter'}</span>
                  </Button>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4" />
                    <span className="ml-2">{language === 'ar' ? 'إضافة موظف' : 'Add Employee'}</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder={language === 'ar' ? 'البحث في بيانات الموظفين...' : 'Search employee data...'}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <Button>
                    <Search className="h-4 w-4" />
                    <span className="ml-2">{language === 'ar' ? 'بحث' : 'Search'}</span>
                  </Button>
                </div>
                
                {/* Sample Employee Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {language === 'ar' ? `موظف نموذجي ${i}` : `Sample Employee ${i}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {language === 'ar' ? 'قسم تكنولوجيا المعلومات' : 'IT Department'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'add-employee',
      label: language === 'ar' ? 'إضافة موظف' : 'Add Employee',
      content: (
        <EnhancedFormSystem
          title={language === 'ar' ? 'إضافة موظف جديد' : 'Add New Employee'}
          description={language === 'ar' ? 'أدخل بيانات الموظف الجديد' : 'Enter new employee information'}
          fields={employeeFormFields}
          onSubmit={(data) => console.log('Employee data:', data)}
          showProgress={true}
          allowFileUpload={true}
          submitText={language === 'ar' ? 'إضافة الموظف' : 'Add Employee'}
        />
      )
    },
    {
      id: 'reports',
      label: language === 'ar' ? 'التقارير' : 'Reports',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'تقارير البيانات' : 'Data Reports'}</CardTitle>
              <CardDescription>
                {language === 'ar' ? 'إنشاء وتصدير تقارير بيانات الموظفين' : 'Generate and export employee data reports'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col gap-2">
                  <FileCheck className="h-6 w-6" />
                  <span>{language === 'ar' ? 'تقرير شامل' : 'Complete Report'}</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>{language === 'ar' ? 'تقرير شهري' : 'Monthly Report'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <EnhancedPageLayout
      title={language === 'ar' ? 'البيانات الأساسية للموظفين' : 'Employee Master Data'}
      description={language === 'ar' ? 'إدارة شاملة لمعلومات الموظفين' : 'Complete employee information management'}
      showUserInfo={true}
      showQuickActions={true}
      showTabs={true}
      stats={stats}
      quickActions={quickActions}
      documents={documents}
      tabs={tabs}
    />
  );
};

export default EmployeeMasterData;