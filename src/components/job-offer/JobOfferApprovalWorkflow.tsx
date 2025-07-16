import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  UserCheck, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  MessageSquare,
  Calendar,
  ChevronRight,
  FileText,
  Send,
  Eye
} from "lucide-react";
import { JobOffer, ApprovalStep } from "./JobOfferManagement";

interface JobOfferApprovalWorkflowProps {
  jobOffers: JobOffer[];
  onOfferUpdate: (offer: JobOffer) => void;
  getStatusBadge: (status: JobOffer['status']) => JSX.Element;
}

export const JobOfferApprovalWorkflow = ({ 
  jobOffers, 
  onOfferUpdate, 
  getStatusBadge 
}: JobOfferApprovalWorkflowProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState("");

  const getApprovalStatusIcon = (status: ApprovalStep['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getApprovalStatusText = (status: ApprovalStep['status']) => {
    switch (status) {
      case 'pending':
        return language === 'ar' ? 'في انتظار الموافقة' : 'Pending Approval';
      case 'approved':
        return language === 'ar' ? 'معتمد' : 'Approved';
      case 'rejected':
        return language === 'ar' ? 'مرفوض' : 'Rejected';
      default:
        return language === 'ar' ? 'غير محدد' : 'Unknown';
    }
  };

  const handleApprovalAction = (offer: JobOffer, action: 'approve' | 'reject') => {
    const updatedApprovalChain = offer.approvalChain.map(step => {
      if (step.status === 'pending') {
        // Update the first pending step
        return {
          ...step,
          status: action === 'approve' ? 'approved' as const : 'rejected' as const,
          comments,
          date: new Date().toISOString().split('T')[0]
        };
      }
      return step;
    });

    // Determine new offer status
    let newStatus: JobOffer['status'] = offer.status;
    
    if (action === 'reject') {
      newStatus = 'rejected';
    } else {
      // Check if all steps are approved
      const allApproved = updatedApprovalChain.every(step => step.status === 'approved');
      if (allApproved) {
        newStatus = 'approved';
      }
    }

    const updatedOffer: JobOffer = {
      ...offer,
      status: newStatus,
      approvalChain: updatedApprovalChain,
      approvedDate: newStatus === 'approved' ? new Date().toISOString().split('T')[0] : undefined
    };

    onOfferUpdate(updatedOffer);
    
    toast({
      title: language === 'ar' ? 
        (action === 'approve' ? "تم الاعتماد" : "تم الرفض") : 
        (action === 'approve' ? "Approved" : "Rejected"),
      description: language === 'ar' ? 
        `تم ${action === 'approve' ? 'اعتماد' : 'رفض'} عرض العمل ${offer.offerNumber}.` : 
        `Job offer ${offer.offerNumber} has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
    });

    // Reset form
    setSelectedOffer(null);
    setActionType(null);
    setComments("");
  };

  const sendOfferToCandidate = (offer: JobOffer) => {
    const updatedOffer: JobOffer = {
      ...offer,
      status: 'sent',
      sentDate: new Date().toISOString().split('T')[0]
    };

    onOfferUpdate(updatedOffer);
    
    toast({
      title: language === 'ar' ? "تم إرسال العرض" : "Offer Sent",
      description: language === 'ar' ? 
        `تم إرسال عرض العمل ${offer.offerNumber} للمرشح.` : 
        `Job offer ${offer.offerNumber} has been sent to the candidate.`,
    });
  };

  const getCurrentApprovalStep = (offer: JobOffer) => {
    return offer.approvalChain.find(step => step.status === 'pending');
  };

  const getNextApprovalStep = (offer: JobOffer) => {
    const currentIndex = offer.approvalChain.findIndex(step => step.status === 'pending');
    return currentIndex !== -1 ? offer.approvalChain[currentIndex] : null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-yellow-500" />
              {language === 'ar' ? 'في انتظار الموافقة' : 'Pending Approvals'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {jobOffers.filter(o => o.status === 'pending_approval').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'ar' ? 'عروض تحتاج موافقة' : 'offers need approval'}
            </p>
          </CardContent>
        </Card>

        {/* Approved Offers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {language === 'ar' ? 'معتمد' : 'Approved'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {jobOffers.filter(o => o.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'ar' ? 'عروض جاهزة للإرسال' : 'offers ready to send'}
            </p>
          </CardContent>
        </Card>

        {/* Average Approval Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-blue-500" />
              {language === 'ar' ? 'متوسط وقت الموافقة' : 'Avg. Approval Time'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">2.4</div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'ar' ? 'أيام' : 'days'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Offers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            {language === 'ar' ? 'قائمة عروض العمل' : 'Job Offers List'}
          </CardTitle>
          <CardDescription>
            {language === 'ar' ? 'إدارة الموافقات وإرسال العروض' : 'Manage approvals and send offers'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobOffers.map((offer) => (
              <Card key={offer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-lg">{offer.candidateName}</h4>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {offer.offerNumber}
                        </Badge>
                        {getStatusBadge(offer.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {offer.position} • {offer.department} • {offer.salary.toLocaleString()} SAR
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {offer.status === 'approved' && (
                        <Button 
                          onClick={() => sendOfferToCandidate(offer)}
                          className="flex items-center gap-2"
                          size="sm"
                        >
                          <Send className="h-4 w-4" />
                          {language === 'ar' ? 'إرسال للمرشح' : 'Send to Candidate'}
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedOffer(offer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Approval Chain */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-sm">
                      {language === 'ar' ? 'سلسلة الموافقات' : 'Approval Chain'}
                    </h5>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {offer.approvalChain.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                            step.status === 'approved' ? 'bg-green-50 border-green-200' :
                            step.status === 'rejected' ? 'bg-red-50 border-red-200' :
                            'bg-yellow-50 border-yellow-200'
                          }`}>
                            {getApprovalStatusIcon(step.status)}
                            <div className="text-xs">
                              <div className="font-medium">{step.role}</div>
                              <div className="text-muted-foreground">{step.approverName}</div>
                            </div>
                          </div>
                          {index < offer.approvalChain.length - 1 && (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Current Approval Action */}
                    {offer.status === 'pending_approval' && getCurrentApprovalStep(offer) && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">
                              {language === 'ar' ? 'يتطلب موافقة من:' : 'Awaiting approval from:'} {getCurrentApprovalStep(offer)?.approverName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => {
                                setSelectedOffer(offer);
                                setActionType('approve');
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {language === 'ar' ? 'اعتماد' : 'Approve'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => {
                                setSelectedOffer(offer);
                                setActionType('reject');
                              }}
                            >
                              {language === 'ar' ? 'رفض' : 'Reject'}
                            </Button>
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

      {/* Approval Action Modal */}
      {selectedOffer && actionType && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {actionType === 'approve' ? 
                <CheckCircle className="h-5 w-5 text-green-500" /> : 
                <XCircle className="h-5 w-5 text-red-500" />
              }
              {language === 'ar' ? 
                (actionType === 'approve' ? 'اعتماد العرض' : 'رفض العرض') :
                (actionType === 'approve' ? 'Approve Offer' : 'Reject Offer')
              }
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                {language === 'ar' ? 'عرض العمل:' : 'Job Offer:'} {selectedOffer.offerNumber}
              </p>
              <p className="font-medium">
                {selectedOffer.candidateName} - {selectedOffer.position}
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor="comments" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {language === 'ar' ? 'التعليقات' : 'Comments'}
              </Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={language === 'ar' ? 'أضف تعليقات (اختياري)' : 'Add comments (optional)'}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button 
                onClick={() => handleApprovalAction(selectedOffer, actionType)}
                className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                variant={actionType === 'approve' ? 'default' : 'destructive'}
              >
                {language === 'ar' ? 
                  (actionType === 'approve' ? 'تأكيد الاعتماد' : 'تأكيد الرفض') :
                  (actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection')
                }
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedOffer(null);
                  setActionType(null);
                  setComments("");
                }}
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};