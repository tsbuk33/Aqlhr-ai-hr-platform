import React, { useState } from 'react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Users, 
  DollarSign, 
  BarChart3, 
  FileText, 
  Settings, 
  Shield, 
  Brain,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  UserCheck,
  Award,
  Calendar,
  Globe,
  Smartphone,
  Lock,
  HelpCircle
} from 'lucide-react';

interface HelpItem {
  id: number;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  category: string;
  icon: React.ComponentType<any>;
  tags: string[];
  action?: string;
}

const helpItems: HelpItem[] = [
  // Employee Management (10 items)
  {
    id: 1,
    title: { en: "How to add a new employee", ar: "كيفية إضافة موظف جديد" },
    description: { en: "Step-by-step guide to onboard new employees", ar: "دليل خطوة بخطوة لإضافة موظفين جدد" },
    category: "employees",
    icon: Users,
    tags: ["onboarding", "hr", "basic"],
    action: "employees"
  },
  {
    id: 2,
    title: { en: "Employee profile management", ar: "إدارة ملف الموظف" },
    description: { en: "Edit and update employee information", ar: "تحرير وتحديث معلومات الموظف" },
    category: "employees",
    icon: UserCheck,
    tags: ["profile", "data"],
    action: "employees"
  },
  {
    id: 3,
    title: { en: "Employee status changes", ar: "تغيير حالة الموظف" },
    description: { en: "Manage employee statuses and transitions", ar: "إدارة حالات الموظفين والانتقالات" },
    category: "employees",
    icon: CheckCircle,
    tags: ["status", "workflow"]
  },
  {
    id: 4,
    title: { en: "Bulk employee operations", ar: "العمليات المجمعة للموظفين" },
    description: { en: "Process multiple employees simultaneously", ar: "معالجة عدة موظفين في وقت واحد" },
    category: "employees",
    icon: Users,
    tags: ["bulk", "efficiency"]
  },
  {
    id: 5,
    title: { en: "Employee search and filters", ar: "البحث والفلاتر للموظفين" },
    description: { en: "Find employees using advanced search", ar: "العثور على الموظفين باستخدام البحث المتقدم" },
    category: "employees",
    icon: Search,
    tags: ["search", "filters"]
  },
  {
    id: 6,
    title: { en: "Department management", ar: "إدارة الأقسام" },
    description: { en: "Organize employees by departments", ar: "تنظيم الموظفين حسب الأقسام" },
    category: "employees",
    icon: Users,
    tags: ["departments", "organization"]
  },
  {
    id: 7,
    title: { en: "Employee hierarchy setup", ar: "إعداد التسلسل الهرمي للموظفين" },
    description: { en: "Define reporting relationships", ar: "تحديد علاقات الإبلاغ" },
    category: "employees",
    icon: TrendingUp,
    tags: ["hierarchy", "management"]
  },
  {
    id: 8,
    title: { en: "Employee document management", ar: "إدارة وثائق الموظف" },
    description: { en: "Store and organize employee documents", ar: "تخزين وتنظيم وثائق الموظف" },
    category: "employees",
    icon: FileText,
    tags: ["documents", "storage"]
  },
  {
    id: 9,
    title: { en: "Employee contact information", ar: "معلومات الاتصال بالموظف" },
    description: { en: "Manage employee contact details", ar: "إدارة تفاصيل الاتصال بالموظف" },
    category: "employees",
    icon: Smartphone,
    tags: ["contact", "communication"]
  },
  {
    id: 10,
    title: { en: "Employee termination process", ar: "عملية إنهاء خدمة الموظف" },
    description: { en: "Handle employee offboarding", ar: "التعامل مع إنهاء خدمة الموظف" },
    category: "employees",
    icon: AlertCircle,
    tags: ["termination", "offboarding"]
  },

  // Payroll & Benefits (8 items)
  {
    id: 11,
    title: { en: "Salary calculation setup", ar: "إعداد حساب الراتب" },
    description: { en: "Configure salary components and calculations", ar: "تكوين مكونات الراتب والحسابات" },
    category: "payroll",
    icon: DollarSign,
    tags: ["salary", "calculation"],
    action: "payroll"
  },
  {
    id: 12,
    title: { en: "Monthly payroll processing", ar: "معالجة الرواتب الشهرية" },
    description: { en: "Run monthly payroll for all employees", ar: "تشغيل الرواتب الشهرية لجميع الموظفين" },
    category: "payroll",
    icon: Calendar,
    tags: ["monthly", "processing"]
  },
  {
    id: 13,
    title: { en: "Overtime calculations", ar: "حسابات العمل الإضافي" },
    description: { en: "Calculate overtime pay and allowances", ar: "حساب أجر العمل الإضافي والبدلات" },
    category: "payroll",
    icon: Clock,
    tags: ["overtime", "allowances"]
  },
  {
    id: 14,
    title: { en: "Deductions and benefits", ar: "الخصومات والمزايا" },
    description: { en: "Manage employee deductions and benefits", ar: "إدارة خصومات ومزايا الموظفين" },
    category: "payroll",
    icon: DollarSign,
    tags: ["deductions", "benefits"]
  },
  {
    id: 15,
    title: { en: "Payslip generation", ar: "إنتاج قسيمة الراتب" },
    description: { en: "Generate and distribute payslips", ar: "إنتاج وتوزيع قسائم الرواتب" },
    category: "payroll",
    icon: FileText,
    tags: ["payslip", "distribution"]
  },
  {
    id: 16,
    title: { en: "Tax calculations", ar: "حسابات الضرائب" },
    description: { en: "Handle tax deductions and reporting", ar: "التعامل مع خصومات الضرائب والتقارير" },
    category: "payroll",
    icon: BarChart3,
    tags: ["tax", "reporting"]
  },
  {
    id: 17,
    title: { en: "End of service benefits", ar: "مكافأة نهاية الخدمة" },
    description: { en: "Calculate end of service gratuity", ar: "حساب مكافأة نهاية الخدمة" },
    category: "payroll",
    icon: Award,
    tags: ["gratuity", "end-service"]
  },
  {
    id: 18,
    title: { en: "Payroll reports", ar: "تقارير الرواتب" },
    description: { en: "Generate comprehensive payroll reports", ar: "إنتاج تقارير شاملة للرواتب" },
    category: "payroll",
    icon: BarChart3,
    tags: ["reports", "analytics"]
  },

  // Performance & Training (6 items)
  {
    id: 19,
    title: { en: "Performance review setup", ar: "إعداد تقييم الأداء" },
    description: { en: "Configure performance review cycles", ar: "تكوين دورات تقييم الأداء" },
    category: "performance",
    icon: TrendingUp,
    tags: ["review", "setup"],
    action: "performance"
  },
  {
    id: 20,
    title: { en: "Goal setting and tracking", ar: "وضع الأهداف ومتابعتها" },
    description: { en: "Set and monitor employee goals", ar: "وضع ومراقبة أهداف الموظفين" },
    category: "performance",
    icon: CheckCircle,
    tags: ["goals", "tracking"]
  },
  {
    id: 21,
    title: { en: "Training program management", ar: "إدارة برامج التدريب" },
    description: { en: "Create and manage training programs", ar: "إنشاء وإدارة برامج التدريب" },
    category: "performance",
    icon: Award,
    tags: ["training", "development"],
    action: "training"
  },
  {
    id: 22,
    title: { en: "Skills assessment", ar: "تقييم المهارات" },
    description: { en: "Evaluate employee skills and competencies", ar: "تقييم مهارات وكفاءات الموظفين" },
    category: "performance",
    icon: UserCheck,
    tags: ["skills", "assessment"]
  },
  {
    id: 23,
    title: { en: "Career development planning", ar: "تخطيط التطوير المهني" },
    description: { en: "Plan employee career paths", ar: "تخطيط المسارات المهنية للموظفين" },
    category: "performance",
    icon: TrendingUp,
    tags: ["career", "development"]
  },
  {
    id: 24,
    title: { en: "Performance analytics", ar: "تحليلات الأداء" },
    description: { en: "Analyze performance metrics and trends", ar: "تحليل مقاييس الأداء والاتجاهات" },
    category: "performance",
    icon: BarChart3,
    tags: ["analytics", "metrics"]
  },

  // System & Settings (8 items)
  {
    id: 25,
    title: { en: "Company profile setup", ar: "إعداد ملف الشركة" },
    description: { en: "Configure company information and settings", ar: "تكوين معلومات وإعدادات الشركة" },
    category: "system",
    icon: Settings,
    tags: ["company", "setup"],
    action: "company"
  },
  {
    id: 26,
    title: { en: "User access management", ar: "إدارة وصول المستخدمين" },
    description: { en: "Control user permissions and roles", ar: "التحكم في أذونات وأدوار المستخدمين" },
    category: "system",
    icon: Lock,
    tags: ["access", "permissions"]
  },
  {
    id: 27,
    title: { en: "Data backup and restore", ar: "النسخ الاحتياطي واستعادة البيانات" },
    description: { en: "Backup and restore system data", ar: "النسخ الاحتياطي واستعادة بيانات النظام" },
    category: "system",
    icon: Shield,
    tags: ["backup", "restore"]
  },
  {
    id: 28,
    title: { en: "System integration setup", ar: "إعداد تكامل النظام" },
    description: { en: "Connect with external systems", ar: "الاتصال بالأنظمة الخارجية" },
    category: "system",
    icon: Globe,
    tags: ["integration", "api"]
  },
  {
    id: 29,
    title: { en: "Language and localization", ar: "اللغة والتوطين" },
    description: { en: "Configure language settings", ar: "تكوين إعدادات اللغة" },
    category: "system",
    icon: Globe,
    tags: ["language", "localization"]
  },
  {
    id: 30,
    title: { en: "Notification settings", ar: "إعدادات الإشعارات" },
    description: { en: "Configure system notifications", ar: "تكوين إشعارات النظام" },
    category: "system",
    icon: MessageSquare,
    tags: ["notifications", "alerts"]
  },
  {
    id: 31,
    title: { en: "Security configuration", ar: "تكوين الأمان" },
    description: { en: "Set up security policies", ar: "إعداد سياسات الأمان" },
    category: "system",
    icon: Shield,
    tags: ["security", "policies"]
  },
  {
    id: 32,
    title: { en: "System monitoring", ar: "مراقبة النظام" },
    description: { en: "Monitor system health and performance", ar: "مراقبة صحة النظام والأداء" },
    category: "system",
    icon: BarChart3,
    tags: ["monitoring", "health"]
  },

  // AI & Analytics (8 items)
  {
    id: 33,
    title: { en: "AI assistant usage", ar: "استخدام المساعد الذكي" },
    description: { en: "How to interact with the AI assistant", ar: "كيفية التفاعل مع المساعد الذكي" },
    category: "ai",
    icon: Brain,
    tags: ["ai", "assistant"]
  },
  {
    id: 34,
    title: { en: "Analytics dashboard", ar: "لوحة التحليلات" },
    description: { en: "Understanding analytics and reports", ar: "فهم التحليلات والتقارير" },
    category: "ai",
    icon: BarChart3,
    tags: ["analytics", "dashboard"],
    action: "analytics"
  },
  {
    id: 35,
    title: { en: "Predictive insights", ar: "الرؤى التنبؤية" },
    description: { en: "Leverage AI for workforce predictions", ar: "الاستفادة من الذكاء الاصطناعي للتنبؤات" },
    category: "ai",
    icon: TrendingUp,
    tags: ["predictions", "insights"]
  },
  {
    id: 36,
    title: { en: "Automated workflows", ar: "سير العمل الآلي" },
    description: { en: "Set up automated HR processes", ar: "إعداد عمليات الموارد البشرية الآلية" },
    category: "ai",
    icon: Settings,
    tags: ["automation", "workflows"]
  },
  {
    id: 37,
    title: { en: "Smart recommendations", ar: "التوصيات الذكية" },
    description: { en: "Use AI recommendations for HR decisions", ar: "استخدام التوصيات الذكية لقرارات الموارد البشرية" },
    category: "ai",
    icon: Brain,
    tags: ["recommendations", "smart"]
  },
  {
    id: 38,
    title: { en: "Data visualization", ar: "تصور البيانات" },
    description: { en: "Create interactive charts and graphs", ar: "إنشاء مخططات ورسوم بيانية تفاعلية" },
    category: "ai",
    icon: BarChart3,
    tags: ["visualization", "charts"]
  },
  {
    id: 39,
    title: { en: "Custom reports", ar: "التقارير المخصصة" },
    description: { en: "Build custom analytical reports", ar: "بناء تقارير تحليلية مخصصة" },
    category: "ai",
    icon: FileText,
    tags: ["reports", "custom"]
  },
  {
    id: 40,
    title: { en: "AI model training", ar: "تدريب نماذج الذكاء الاصطناعي" },
    description: { en: "Improve AI accuracy with your data", ar: "تحسين دقة الذكاء الاصطناعي بالبيانات" },
    category: "ai",
    icon: Brain,
    tags: ["training", "models"]
  }
];

const categories = [
  { id: "all", label: { en: "All Items", ar: "جميع العناصر" }, icon: HelpCircle },
  { id: "employees", label: { en: "Employee Management", ar: "إدارة الموظفين" }, icon: Users },
  { id: "payroll", label: { en: "Payroll & Benefits", ar: "الرواتب والمزايا" }, icon: DollarSign },
  { id: "performance", label: { en: "Performance & Training", ar: "الأداء والتدريب" }, icon: TrendingUp },
  { id: "system", label: { en: "System & Settings", ar: "النظام والإعدادات" }, icon: Settings },
  { id: "ai", label: { en: "AI & Analytics", ar: "الذكاء الاصطناعي والتحليلات" }, icon: Brain }
];

const HelpPage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = helpItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title[isArabic ? 'ar' : 'en'].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description[isArabic ? 'ar' : 'en'].toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleItemClick = (item: HelpItem) => {
    if (item.action) {
      window.location.href = `/${isArabic ? 'ar' : 'en'}/${item.action}`;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title={isArabic ? 'المساعدة التفاعلية' : 'Interactive Help'}
        description={isArabic 
          ? 'دليل شامل لجميع وحدات الموارد البشرية وأدوات النظام مع الذكاء الاصطناعي'
          : 'Comprehensive guide for all HR modules and system tools with AI integration'
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{isArabic ? 'المجموع' : 'Total Items'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">40</div>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'موضوع مساعدة' : 'Help topics'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{isArabic ? 'الفئات' : 'Categories'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">6</div>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'فئات مختلفة' : 'Different categories'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{isArabic ? 'المعروض' : 'Showing'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">{filteredItems.length}</div>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'عنصر مطابق' : 'Matching items'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{isArabic ? 'التفاعلية' : 'Interactive'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">✨</div>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'مساعدة ذكية' : 'Smart help'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={isArabic ? 'البحث في المساعدة...' : 'Search help topics...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {filteredItems.length} / 40
          </Badge>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-2 text-xs"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {category.label[isArabic ? 'ar' : 'en']}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Help Items Grid */}
        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={item.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    item.action ? 'hover:bg-accent/50' : ''
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-sm font-medium line-clamp-2">
                          {item.title[isArabic ? 'ar' : 'en']}
                        </CardTitle>
                        <div className="flex gap-1 mt-2">
                          {item.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.action && (
                            <Badge variant="secondary" className="text-xs">
                              {isArabic ? 'انتقال سريع' : 'Quick Jump'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs line-clamp-3">
                      {item.description[isArabic ? 'ar' : 'en']}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {isArabic ? 'لم يتم العثور على نتائج' : 'No Results Found'}
              </h3>
              <p className="text-muted-foreground">
                {isArabic 
                  ? 'جرب مصطلح بحث مختلف أو تحقق من الفئات الأخرى'
                  : 'Try a different search term or check other categories'
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpPage;