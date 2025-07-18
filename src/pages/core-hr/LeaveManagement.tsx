import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlAIFileProcessor } from "@/components/aql/AqlAIFileProcessor";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Calendar, Clock, CheckCircle } from "lucide-react";

const LeaveManagement = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  const translations = {
    en: {
      leave_management: "Leave Management",
      leave_management_desc: "Manage employee leave requests and track leave balances",
      pending_requests: "Pending Requests",
      approved_this_month: "Approved This Month", 
      annual_leave_balance: "Annual Leave Balance",
      emergency_leaves: "Emergency Leaves"
    },
    ar: {
      leave_management: "إدارة الإجازات",
      leave_management_desc: "إدارة طلبات إجازات الموظفين وتتبع أرصدة الإجازات",
      pending_requests: "الطلبات المعلقة",
      approved_this_month: "المعتمدة هذا الشهر",
      annual_leave_balance: "رصيد الإجازة السنوية", 
      emergency_leaves: "الإجازات الطارئة"
    }
  };

  const t = (key: string) => translations[language][key] || key;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('leave_management')}</h1>
        <p className="text-muted-foreground">{t('leave_management_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('pending_requests')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('approved_this_month')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">145</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('annual_leave_balance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">18.5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('emergency_leaves')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-danger">12</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">{language === 'ar' ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="documents">{language === 'ar' ? 'الوثائق' : 'Documents'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('leave_management')}</CardTitle>
              <CardDescription>{t('leave_management_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {language === 'ar'
                  ? "نظام شامل لإدارة طلبات الإجازات وتتبع أرصدة الإجازات للموظفين مع دعم كامل للقوانين السعودية."
                  : "Comprehensive leave management system for tracking employee leave requests and balances with full Saudi labor law compliance."
                }
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {language === 'ar' ? "رفع الوثائق" : "Document Upload"}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? "رفع ومعالجة وثائق إدارة الإجازات والطلبات" 
                  : "Upload and process leave management documents and requests"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AqlAIFileProcessor
                platform="leave-management"
                moduleType="core-hr"
                onFileProcessed={(file) => {
                  toast({
                    title: language === 'ar' ? "تم معالجة الملف بنجاح" : "File processed successfully",
                    description: language === 'ar' 
                      ? `تم رفع ${file.name} ومعالجته بالذكاء الاصطناعي`
                      : `${file.name} has been uploaded and processed with AI`,
                  });
                }}
                acceptedTypes={['.xlsx', '.xls', '.pdf', '.doc', '.docx']}
                maxFileSize={10 * 1024 * 1024}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaveManagement;