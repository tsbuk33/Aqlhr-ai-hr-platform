import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/layout/PageLayout";
import { Upload, Calendar, Clock, CheckCircle } from "lucide-react";
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';

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
    <PageLayout
      title={t('leave_management')}
      description={t('leave_management_desc')}
    >
      
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
          <UniversalDocumentManager
            moduleName="Leave Management"
            moduleNameAr="إدارة الإجازات"
            description="Upload leave policies, vacation requests, medical certificates, and leave balance reports"
            descriptionAr="رفع سياسات الإجازات وطلبات الإجازات والشهادات الطبية وتقارير أرصدة الإجازات"
            platform="leave-management"
            moduleType="hr"
            acceptedTypes={['.pdf', '.doc', '.docx', '.xlsx', '.xls', '.jpg', '.jpeg', '.png']}
            maxFileSize={15 * 1024 * 1024}
            maxFiles={25}
          />
        </TabsContent>
      </Tabs>
      
      <AqlHRAIAssistant moduleContext="core-hr.leaveManagement" />
    </PageLayout>
  );
};

export default LeaveManagement;