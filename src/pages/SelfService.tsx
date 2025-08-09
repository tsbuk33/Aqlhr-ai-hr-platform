import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { usePerformantLocalization } from "@/hooks/usePerformantLocalization";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  User, 
  FileText, 
  Download, 
  Upload, 
  Calendar, 
  Clock, 
  DollarSign,
  Settings,
  Bell,
  Shield,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Briefcase,
  Edit,
  Save,
  Plus,
  Send,
  Eye
} from "lucide-react";
import { AqlHRAIAssistant } from '@/components/ai';

const SelfService = () => {
  const { t, language, isRTL } = useLanguage();
  const { formatters, directionClasses } = usePerformantLocalization();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // State management
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: language === 'ar' ? "أحمد محمد العلي" : "Ahmed Mohammed Al Ali",
    email: "ahmed.ali@company.com",
    phone: "+966 50 123 4567",
    address: language === 'ar' ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia",
    emergencyContact: language === 'ar' ? "سارة العلي" : "Sarah Al Ali",
    emergencyPhone: "+966 50 987 6543"
  });
  const [newRequest, setNewRequest] = useState({
    type: "",
    description: "",
    priority: "medium"
  });

  // Mock requests data
  const myRequests = [
    {
      id: "REQ-001",
      type: language === 'ar' ? "طلب إجازة سنوية" : "Annual Leave Request",
      description: language === 'ar' ? "إجازة لمدة أسبوع لقضاء العطلة مع الأسرة" : "One week vacation with family",
      status: "approved",
      priority: "medium",
      submittedDate: "2024-12-20",
      responseDate: "2024-12-22"
    },
    {
      id: "REQ-002",
      type: language === 'ar' ? "طلب شهادة راتب" : "Salary Certificate Request",
      description: language === 'ar' ? "شهادة راتب للبنك لطلب قرض شخصي" : "Salary certificate for bank loan application",
      status: "pending",
      priority: "high",
      submittedDate: "2024-12-25",
      responseDate: null
    },
    {
      id: "REQ-003",
      type: language === 'ar' ? "تحديث بيانات شخصية" : "Personal Data Update",
      description: language === 'ar' ? "تحديث رقم الهاتف وعنوان السكن" : "Update phone number and home address",
      status: "in_review",
      priority: "low",
      submittedDate: "2024-12-18",
      responseDate: null
    }
  ];

  // Handlers
  const handleProfileUpdate = () => {
    toast({
      title: language === 'ar' ? "تم تحديث البيانات" : "Profile Updated",
      description: language === 'ar' ? "تم حفظ التغييرات بنجاح" : "Changes saved successfully",
    });
    setIsEditingProfile(false);
  };

  const handleNewRequest = () => {
    if (!newRequest.type || !newRequest.description) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: language === 'ar' ? "تم إرسال الطلب" : "Request Submitted",
      description: language === 'ar' ? "سيتم مراجعة طلبك قريباً" : "Your request will be reviewed soon",
    });

    setNewRequest({ type: "", description: "", priority: "medium" });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { 
        label: language === 'ar' ? "موافق عليه" : "Approved", 
        variant: "default" as const,
        color: "text-green-600"
      },
      pending: { 
        label: language === 'ar' ? "قيد الانتظار" : "Pending", 
        variant: "secondary" as const,
        color: "text-yellow-600"
      },
      in_review: { 
        label: language === 'ar' ? "قيد المراجعة" : "In Review", 
        variant: "outline" as const,
        color: "text-blue-600"
      },
      rejected: { 
        label: language === 'ar' ? "مرفوض" : "Rejected", 
        variant: "destructive" as const,
        color: "text-red-600"
      }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  // Mock employee data - in real app, fetch from Supabase
  const employee = {
    id: "emp-001",
    name: language === 'ar' ? "أحمد محمد العلي" : "Ahmed Mohammed Al Ali",
    position: language === 'ar' ? "مطور البرمجيات" : "Software Developer",
    department: language === 'ar' ? "تكنولوجيا المعلومات" : "Information Technology",
    employeeNumber: "EMP-2024-001",
    joinDate: "2023-01-15",
    salary: 12000,
    avatar: null
  };

  const quickStats = [
    {
      title: language === 'ar' ? "الراتب الشهري" : "Monthly Salary",
      value: formatters.salary(employee.salary),
      icon: DollarSign,
      variant: "default" as const
    },
    {
      title: language === 'ar' ? "الإجازات المتبقية" : "Leave Balance",
      value: "21",
      icon: Calendar,
      variant: "success" as const
    },
    {
      title: language === 'ar' ? "ساعات العمل هذا الشهر" : "Hours This Month",
      value: "168",
      icon: Clock,
      variant: "accent" as const
    },
    {
      title: language === 'ar' ? "الطلبات المعلقة" : "Pending Requests",
      value: myRequests.filter(req => req.status === 'pending' || req.status === 'in_review').length.toString(),
      icon: AlertCircle,
      variant: "warning" as const
    }
  ];

  const recentDocuments = [
    {
      name: language === 'ar' ? "كشف_راتب_ديسمبر_2024.pdf" : "payslip_december_2024.pdf",
      type: language === 'ar' ? "كشف راتب" : "Payslip",
      date: "2024-12-30",
      size: "245 KB"
    },
    {
      name: language === 'ar' ? "شهادة_راتب_2024.pdf" : "salary_certificate_2024.pdf",
      type: language === 'ar' ? "شهادة راتب" : "Salary Certificate",
      date: "2024-12-15",
      size: "180 KB"
    },
    {
      name: language === 'ar' ? "طلب_إجازة_سنوية.pdf" : "annual_leave_request.pdf",
      type: language === 'ar' ? "طلب إجازة" : "Leave Request",
      date: "2024-12-10",
      size: "120 KB"
    }
  ];

  const quickActions = [
    {
      title: language === 'ar' ? "طلب إجازة" : "Request Leave",
      description: language === 'ar' ? "تقديم طلب إجازة جديد" : "Submit a new leave request",
      icon: Calendar,
      color: "bg-blue-500"
    },
    {
      title: language === 'ar' ? "تحديث البيانات" : "Update Profile",
      description: language === 'ar' ? "تحديث البيانات الشخصية" : "Update personal information",
      icon: User,
      color: "bg-green-500"
    },
    {
      title: language === 'ar' ? "رفع مستند" : "Upload Document",
      description: language === 'ar' ? "رفع مستندات جديدة" : "Upload new documents",
      icon: Upload,
      color: "bg-purple-500"
    },
    {
      title: language === 'ar' ? "تقرير الحضور" : "Attendance Report",
      description: language === 'ar' ? "عرض تقرير الحضور" : "View attendance report",
      icon: FileCheck,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className={`container mx-auto p-4 space-y-6 max-w-6xl ${directionClasses.container}`}>
      {/* Header with Employee Info - Centered */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {language === 'ar' ? 'الخدمة الذاتية للموظفين' : 'Employee Self Service'}
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
          {language === 'ar' ? 'إدارة معلوماتك الشخصية وطلباتك' : 'Manage your personal information and requests'}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-4 mb-8">
        <div className={`flex items-center gap-4 ${directionClasses.flex}`}>
          <Avatar className="h-16 w-16">
            <AvatarImage src={employee.avatar || ''} alt={employee.name} />
            <AvatarFallback className="text-lg font-bold">
              {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className={directionClasses.text}>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {language === 'ar' ? `مرحباً، ${employee.name}` : `Welcome, ${employee.name}`}
            </h1>
            <p className="text-muted-foreground">
              {employee.position} • {employee.department}
            </p>
            <Badge variant="outline" className="mt-1">
              {employee.employeeNumber}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
            {!isMobile && <span className="ml-2">{language === 'ar' ? 'الإعدادات' : 'Settings'}</span>}
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4" />
            {!isMobile && <span className="ml-2">{language === 'ar' ? 'الإشعارات' : 'Notifications'}</span>}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`flex items-center gap-3 ${directionClasses.flex}`}>
                <div className={`p-2 rounded-lg bg-${stat.variant === 'default' ? 'primary' : stat.variant}/10`}>
                  <stat.icon className={`h-5 w-5 text-${stat.variant === 'default' ? 'primary' : stat.variant}`} />
                </div>
                <div className={directionClasses.text}>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
          <TabsTrigger value="dashboard">
            {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
          </TabsTrigger>
          <TabsTrigger value="documents">
            {language === 'ar' ? 'المستندات' : 'Documents'}
          </TabsTrigger>
          {!isMobile && (
            <>
              <TabsTrigger value="requests">
                {language === 'ar' ? 'الطلبات' : 'Requests'}
              </TabsTrigger>
              <TabsTrigger value="profile">
                {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className={directionClasses.text}>
                {language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted/50 ${directionClasses.text}`}
                  >
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className={directionClasses.text}>
                  {language === 'ar' ? 'الأنشطة الأخيرة' : 'Recent Activity'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center gap-3 ${directionClasses.flex}`}>
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div className={directionClasses.text}>
                    <p className="text-sm font-medium">
                      {language === 'ar' ? 'تم الموافقة على طلب الإجازة' : 'Leave request approved'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'منذ يومين' : '2 days ago'}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${directionClasses.flex}`}>
                  <FileText className="h-5 w-5 text-primary" />
                  <div className={directionClasses.text}>
                    <p className="text-sm font-medium">
                      {language === 'ar' ? 'تم إنشاء كشف راتب جديد' : 'New payslip generated'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'منذ 3 أيام' : '3 days ago'}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${directionClasses.flex}`}>
                  <Briefcase className="h-5 w-5 text-accent" />
                  <div className={directionClasses.text}>
                    <p className="text-sm font-medium">
                      {language === 'ar' ? 'تم تحديث بيانات الوظيفة' : 'Job details updated'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'منذ أسبوع' : '1 week ago'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className={directionClasses.text}>
                  {language === 'ar' ? 'المهام المعلقة' : 'Pending Tasks'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center gap-3 ${directionClasses.flex}`}>
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <div className={directionClasses.text}>
                    <p className="text-sm font-medium">
                      {language === 'ar' ? 'تحديث شهادة السلامة' : 'Update safety certificate'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'مطلوب خلال 5 أيام' : 'Due in 5 days'}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${directionClasses.flex}`}>
                  <FileText className="h-5 w-5 text-warning" />
                  <div className={directionClasses.text}>
                    <p className="text-sm font-medium">
                      {language === 'ar' ? 'إكمال تقييم الأداء' : 'Complete performance review'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'مطلوب خلال أسبوع' : 'Due in 1 week'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <UniversalDocumentManager
            moduleName={language === 'ar' ? "الخدمة الذاتية للموظفين" : "Employee Self Service"}
            description={language === 'ar' ? "إدارة مستنداتك الشخصية والطلبات" : "Manage your personal documents and requests"}
            platform="self_service"
            moduleType="hr"
            acceptedTypes={['.pdf', '.doc', '.docx', '.jpg', '.png']}
            maxFileSize={10}
            maxFiles={20}
          />
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          {/* New Request Form */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${directionClasses.text}`}>
                <Plus className="h-5 w-5" />
                {language === 'ar' ? 'طلب جديد' : 'New Request'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="request-type">
                    {language === 'ar' ? 'نوع الطلب' : 'Request Type'}
                  </Label>
                  <Select
                    value={newRequest.type}
                    onValueChange={(value) => setNewRequest(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? "اختر نوع الطلب" : "Select request type"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leave">{language === 'ar' ? 'طلب إجازة' : 'Leave Request'}</SelectItem>
                      <SelectItem value="salary_certificate">{language === 'ar' ? 'شهادة راتب' : 'Salary Certificate'}</SelectItem>
                      <SelectItem value="profile_update">{language === 'ar' ? 'تحديث بيانات' : 'Profile Update'}</SelectItem>
                      <SelectItem value="document_request">{language === 'ar' ? 'طلب مستند' : 'Document Request'}</SelectItem>
                      <SelectItem value="other">{language === 'ar' ? 'أخرى' : 'Other'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">
                    {language === 'ar' ? 'الأولوية' : 'Priority'}
                  </Label>
                  <Select
                    value={newRequest.priority}
                    onValueChange={(value) => setNewRequest(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{language === 'ar' ? 'منخفض' : 'Low'}</SelectItem>
                      <SelectItem value="medium">{language === 'ar' ? 'متوسط' : 'Medium'}</SelectItem>
                      <SelectItem value="high">{language === 'ar' ? 'عالي' : 'High'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {language === 'ar' ? 'وصف الطلب' : 'Request Description'}
                </Label>
                <Textarea
                  id="description"
                  placeholder={language === 'ar' ? "اكتب تفاصيل الطلب..." : "Enter request details..."}
                  value={newRequest.description}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <Button onClick={handleNewRequest} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
              </Button>
            </CardContent>
          </Card>

          {/* My Requests List */}
          <Card>
            <CardHeader>
              <CardTitle className={directionClasses.text}>
                {language === 'ar' ? 'طلباتي' : 'My Requests'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myRequests.map((request) => {
                  const status = getStatusBadge(request.status);
                  return (
                    <div key={request.id} className="border rounded-lg p-4 space-y-3">
                      <div className={`flex items-center justify-between ${directionClasses.flex}`}>
                        <div className={directionClasses.text}>
                          <h3 className="font-medium">{request.type}</h3>
                          <p className="text-sm text-muted-foreground">ID: {request.id}</p>
                        </div>
                        <Badge variant={status.variant} className={status.color}>
                          {status.label}
                        </Badge>
                      </div>
                      
                      <p className={`text-sm ${directionClasses.text}`}>
                        {request.description}
                      </p>
                      
                      <div className={`flex items-center justify-between text-xs text-muted-foreground ${directionClasses.flex}`}>
                        <span>
                          {language === 'ar' ? 'تاريخ الإرسال:' : 'Submitted:'} {request.submittedDate}
                        </span>
                        {request.responseDate && (
                          <span>
                            {language === 'ar' ? 'تاريخ الرد:' : 'Responded:'} {request.responseDate}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          {language === 'ar' ? 'عرض' : 'View'}
                        </Button>
                        {request.status === 'pending' && (
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            {language === 'ar' ? 'تعديل' : 'Edit'}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center justify-between ${directionClasses.text}`}>
                <span>{language === 'ar' ? 'الملف الشخصي' : 'Profile Information'}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {isEditingProfile 
                    ? (language === 'ar' ? 'إلغاء' : 'Cancel') 
                    : (language === 'ar' ? 'تعديل' : 'Edit')
                  }
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className={`text-lg font-medium ${directionClasses.text}`}>
                  {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    </Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      {language === 'ar' ? 'العنوان' : 'Address'}
                    </Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className={`text-lg font-medium ${directionClasses.text}`}>
                  {language === 'ar' ? 'جهة الاتصال الطارئة' : 'Emergency Contact'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency-contact">
                      {language === 'ar' ? 'اسم جهة الاتصال' : 'Emergency Contact Name'}
                    </Label>
                    <Input
                      id="emergency-contact"
                      value={profileData.emergencyContact}
                      onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      disabled={!isEditingProfile}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency-phone">
                      {language === 'ar' ? 'رقم الهاتف الطارئ' : 'Emergency Phone'}
                    </Label>
                    <Input
                      id="emergency-phone"
                      value={profileData.emergencyPhone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>
              </div>

              {/* Employment Details (Read-only) */}
              <div className="space-y-4">
                <h3 className={`text-lg font-medium ${directionClasses.text}`}>
                  {language === 'ar' ? 'تفاصيل التوظيف' : 'Employment Details'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{language === 'ar' ? 'رقم الموظف' : 'Employee Number'}</Label>
                    <Input value={employee.employeeNumber} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label>{language === 'ar' ? 'المنصب' : 'Position'}</Label>
                    <Input value={employee.position} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label>{language === 'ar' ? 'القسم' : 'Department'}</Label>
                    <Input value={employee.department} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label>{language === 'ar' ? 'تاريخ الالتحاق' : 'Join Date'}</Label>
                    <Input value={employee.joinDate} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label>{language === 'ar' ? 'الراتب الأساسي' : 'Basic Salary'}</Label>
                    <Input value={formatters.salary(employee.salary)} disabled />
                  </div>
                </div>
              </div>

              {isEditingProfile && (
                <div className="flex gap-2">
                  <Button onClick={handleProfileUpdate}>
                    <Save className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditingProfile(false)}
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AqlHRAIAssistant 
        moduleContext="self-service" 
        companyId="demo-company"
      />
    </div>
  );
};

export default SelfService;