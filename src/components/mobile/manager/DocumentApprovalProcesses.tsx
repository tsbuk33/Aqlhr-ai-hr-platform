import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, CheckCircle, XCircle, Clock, User, Calendar, MessageSquare } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

interface DocumentApproval {
  id: string;
  documentName: string;
  documentType: string;
  submittedBy: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  fileSize: string;
  approver: string;
  approvalDate?: string;
  comments?: string;
  version: number;
}

export default function DocumentApprovalProcesses() {
  const { isRTL } = useUnifiedLocale();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'history'>('pending');
  const [selectedDocument, setSelectedDocument] = useState<DocumentApproval | null>(null);
  const [approvalComment, setApprovalComment] = useState('');

  const mockDocuments: DocumentApproval[] = [
    {
      id: '1',
      documentName: 'سياسة الموارد البشرية المحدثة',
      documentType: 'سياسة',
      submittedBy: 'أحمد محمد',
      submittedDate: '2024-01-25',
      status: 'pending',
      priority: 'high',
      description: 'تحديث سياسة الموارد البشرية لتتماشى مع اللوائح الجديدة',
      fileSize: '2.4 MB',
      approver: 'مدير الموارد البشرية',
      version: 3
    },
    {
      id: '2',
      documentName: 'دليل إجراءات السلامة المهنية',
      documentType: 'دليل إجراءات',
      submittedBy: 'فاطمة أحمد',
      submittedDate: '2024-01-22',
      status: 'pending',
      priority: 'medium',
      description: 'دليل شامل لإجراءات السلامة المهنية في مكان العمل',
      fileSize: '1.8 MB',
      approver: 'مدير الأمن والسلامة',
      version: 1
    },
    {
      id: '3',
      documentName: 'تقرير الأداء الربعي',
      documentType: 'تقرير',
      submittedBy: 'خالد سعد',
      submittedDate: '2024-01-20',
      status: 'approved',
      priority: 'medium',
      description: 'تقرير الأداء للربع الأول من 2024',
      fileSize: '3.1 MB',
      approver: 'المدير التنفيذي',
      approvalDate: '2024-01-21',
      comments: 'ممتاز، تقرير شامل ومفصل',
      version: 2
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'revision_requested': return <MessageSquare className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'revision_requested': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'سياسة': return '📋';
      case 'دليل إجراءات': return '📖';
      case 'تقرير': return '📊';
      case 'عقد': return '📄';
      default: return '📁';
    }
  };

  const filteredDocuments = mockDocuments.filter(doc => {
    if (activeTab === 'pending') return doc.status === 'pending';
    if (activeTab === 'approved') return doc.status === 'approved';
    if (activeTab === 'rejected') return doc.status === 'rejected' || doc.status === 'revision_requested';
    return true; // history shows all
  });

  const handleApprove = async (documentId: string) => {
    console.log('Approving document:', documentId, 'with comment:', approvalComment);
    setApprovalComment('');
  };

  const handleReject = async (documentId: string) => {
    console.log('Rejecting document:', documentId, 'with comment:', approvalComment);
    setApprovalComment('');
  };

  const handleRequestRevision = async (documentId: string) => {
    console.log('Requesting revision for document:', documentId, 'with comment:', approvalComment);
    setApprovalComment('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isRTL ? 'عمليات اعتماد الوثائق' : 'Document Approval Processes'}
            </h1>
            <p className="text-muted-foreground">
              {isRTL ? 'مراجعة واعتماد الوثائق والمستندات' : 'Review and approve documents and files'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'في الانتظار' : 'Pending'} ({mockDocuments.filter(d => d.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'approved'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'معتمدة' : 'Approved'} ({mockDocuments.filter(d => d.status === 'approved').length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'rejected'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'مرفوضة' : 'Rejected'} ({mockDocuments.filter(d => d.status === 'rejected' || d.status === 'revision_requested').length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'التاريخ' : 'History'}
          </button>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">{getDocumentTypeIcon(document.documentType)}</span>
                      {document.documentName}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{document.documentType}</span>
                      <span>•</span>
                      <span>{isRTL ? 'الإصدار' : 'Version'} {document.version}</span>
                      <span>•</span>
                      <span>{document.fileSize}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(document.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(document.status)}
                        <span>
                          {isRTL ? 
                            (document.status === 'pending' ? 'في الانتظار' : 
                             document.status === 'approved' ? 'معتمد' : 
                             document.status === 'rejected' ? 'مرفوض' : 'يتطلب مراجعة') 
                            : document.status}
                        </span>
                      </div>
                    </Badge>
                    <Badge className={getPriorityColor(document.priority)}>
                      {isRTL ? 
                        (document.priority === 'low' ? 'منخفضة' : 
                         document.priority === 'medium' ? 'متوسطة' : 
                         document.priority === 'high' ? 'عالية' : 'عاجلة') 
                        : document.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{document.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{isRTL ? 'مقدم من:' : 'Submitted by:'}</span>
                    <span>{document.submittedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{isRTL ? 'تاريخ التقديم:' : 'Submitted on:'}</span>
                    <span>{document.submittedDate}</span>
                  </div>
                </div>

                {document.status === 'approved' && document.approvalDate && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-300 mb-1">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">{isRTL ? 'تم الاعتماد في:' : 'Approved on:'} {document.approvalDate}</span>
                    </div>
                    {document.comments && (
                      <p className="text-sm text-green-700 dark:text-green-400">{document.comments}</p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    {isRTL ? 'معاينة' : 'Preview'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    {isRTL ? 'تحميل' : 'Download'}
                  </Button>
                  
                  {document.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(document.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isRTL ? 'اعتماد' : 'Approve'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRequestRevision(document.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {isRTL ? 'طلب مراجعة' : 'Request Revision'}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleReject(document.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        {isRTL ? 'رفض' : 'Reject'}
                      </Button>
                    </>
                  )}
                </div>

                {/* Comments Section for Pending Documents */}
                {document.status === 'pending' && (
                  <div className="space-y-2 pt-2 border-t">
                    <Label htmlFor="comment">{isRTL ? 'تعليق الاعتماد' : 'Approval Comment'}</Label>
                    <Textarea
                      id="comment"
                      value={approvalComment}
                      onChange={(e) => setApprovalComment(e.target.value)}
                      placeholder={isRTL ? 'أضف تعليقاً أو ملاحظات...' : 'Add comments or notes...'}
                      rows={2}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filteredDocuments.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  {isRTL ? 'لا توجد وثائق' : 'No Documents'}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL ? 'لا توجد وثائق في هذه الفئة حالياً' : 'No documents in this category currently'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}