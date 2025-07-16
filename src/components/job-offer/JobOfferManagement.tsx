import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  DollarSign,
  Building,
  UserCheck,
  Send,
  Eye,
  Download,
  Filter,
  Search
} from "lucide-react";
import { JobOfferCreationWizard } from "./JobOfferCreationWizard";
import { JobOfferApprovalWorkflow } from "./JobOfferApprovalWorkflow";
import { JobOfferDashboard } from "./JobOfferDashboard";

export interface JobOffer {
  id: string;
  offerNumber: string;
  candidateName: string;
  position: string;
  department: string;
  salary: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdDate: string;
  approvedDate?: string;
  sentDate?: string;
  responseDate?: string;
  approvalChain: ApprovalStep[];
  createdBy: string;
}

export interface ApprovalStep {
  id: string;
  role: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  date?: string;
}

export const JobOfferManagement = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);

  // Mock data for demonstration
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([
    {
      id: "1",
      offerNumber: "OFF-2024-001",
      candidateName: "Ahmed Al-Rashid",
      position: "Senior Software Engineer",
      department: "IT Department",
      salary: 15000,
      status: "pending_approval",
      createdDate: "2024-01-15",
      createdBy: "HR Manager",
      approvalChain: [
        { id: "1", role: "Direct Manager", approverName: "Sarah Johnson", status: "approved", date: "2024-01-16" },
        { id: "2", role: "HR Director", approverName: "Mohammed Ali", status: "pending" },
        { id: "3", role: "Finance Director", approverName: "Fatima Hassan", status: "pending" }
      ]
    },
    {
      id: "2",
      offerNumber: "OFF-2024-002",
      candidateName: "Layla Al-Zahra",
      position: "Marketing Specialist",
      department: "Marketing",
      salary: 12000,
      status: "approved",
      createdDate: "2024-01-10",
      approvedDate: "2024-01-12",
      createdBy: "HR Specialist",
      approvalChain: [
        { id: "1", role: "Direct Manager", approverName: "Omar Khaled", status: "approved", date: "2024-01-11" },
        { id: "2", role: "HR Director", approverName: "Mohammed Ali", status: "approved", date: "2024-01-12" }
      ]
    }
  ]);

  const getStatusBadge = (status: JobOffer['status']) => {
    const statusConfig = {
      draft: { color: "bg-gray-500", text: language === 'ar' ? 'مسودة' : 'Draft' },
      pending_approval: { color: "bg-yellow-500", text: language === 'ar' ? 'في انتظار الموافقة' : 'Pending Approval' },
      approved: { color: "bg-green-500", text: language === 'ar' ? 'معتمد' : 'Approved' },
      sent: { color: "bg-blue-500", text: language === 'ar' ? 'مرسل' : 'Sent' },
      accepted: { color: "bg-emerald-500", text: language === 'ar' ? 'مقبول' : 'Accepted' },
      rejected: { color: "bg-red-500", text: language === 'ar' ? 'مرفوض' : 'Rejected' },
      expired: { color: "bg-gray-400", text: language === 'ar' ? 'منتهي الصلاحية' : 'Expired' }
    };

    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  const handleCreateOffer = () => {
    setActiveTab("create");
  };

  const handleOfferCreated = (offerData: any) => {
    const newOffer: JobOffer = {
      id: Date.now().toString(),
      offerNumber: `OFF-2024-${String(jobOffers.length + 1).padStart(3, '0')}`,
      candidateName: `${offerData.firstName} ${offerData.lastName}`,
      position: offerData.position,
      department: offerData.department,
      salary: offerData.basicSalary,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: 'Current User',
      approvalChain: []
    };

    setJobOffers(prev => [...prev, newOffer]);
    setActiveTab("dashboard");
    
    toast({
      title: language === 'ar' ? "تم إنشاء عرض العمل" : "Job Offer Created",
      description: language === 'ar' ? 
        `تم إنشاء عرض العمل ${newOffer.offerNumber} بنجاح.` : 
        `Job offer ${newOffer.offerNumber} has been created successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {language === 'ar' ? 'إدارة عروض العمل' : 'Job Offer Management'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'ar' ? 
              'إنشاء وإدارة عروض العمل مع سير العمل والموافقات' : 
              'Create and manage job offers with workflows and approvals'
            }
          </p>
        </div>
        <Button onClick={handleCreateOffer} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {language === 'ar' ? 'إنشاء عرض عمل جديد' : 'Create New Job Offer'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {language === 'ar' ? 'إنشاء عرض' : 'Create Offer'}
          </TabsTrigger>
          <TabsTrigger value="approvals" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            {language === 'ar' ? 'الموافقات' : 'Approvals'}
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {language === 'ar' ? 'التقارير' : 'Reports'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <JobOfferDashboard 
            jobOffers={jobOffers}
            onOfferSelect={setSelectedOffer}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>

        <TabsContent value="create">
          <JobOfferCreationWizard
            onOfferCreated={handleOfferCreated}
            onCancel={() => setActiveTab("dashboard")}
          />
        </TabsContent>

        <TabsContent value="approvals">
          <JobOfferApprovalWorkflow
            jobOffers={jobOffers.filter(offer => 
              offer.status === 'pending_approval' || offer.status === 'approved'
            )}
            onOfferUpdate={(updatedOffer) => {
              setJobOffers(prev => 
                prev.map(offer => 
                  offer.id === updatedOffer.id ? updatedOffer : offer
                )
              );
            }}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                {language === 'ar' ? 'تقارير عروض العمل' : 'Job Offer Reports'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' ? 
                  'إنشاء وتصدير تقارير شاملة عن عروض العمل' : 
                  'Generate and export comprehensive job offer reports'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <h4 className="font-semibold">
                            {language === 'ar' ? 'تقرير شامل' : 'Comprehensive Report'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {language === 'ar' ? 'جميع عروض العمل' : 'All job offers'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-8 w-8 text-yellow-500" />
                        <div>
                          <h4 className="font-semibold">
                            {language === 'ar' ? 'تقرير الوقت' : 'Time Report'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {language === 'ar' ? 'أوقات الموافقة' : 'Approval times'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-8 w-8 text-green-500" />
                        <div>
                          <h4 className="font-semibold">
                            {language === 'ar' ? 'تقرير الرواتب' : 'Salary Report'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {language === 'ar' ? 'تحليل الحزم' : 'Package analysis'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};