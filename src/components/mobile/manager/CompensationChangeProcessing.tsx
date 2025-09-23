import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Calendar, FileText, CheckCircle, Clock, AlertCircle, User } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

interface CompensationChange {
  id: string;
  employeeName: string;
  currentSalary: number;
  proposedSalary: number;
  changeType: 'increase' | 'decrease' | 'bonus' | 'promotion';
  effectiveDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  requestedBy: string;
  submittedDate: string;
  approvalLevel: 'hr_manager' | 'finance' | 'ceo';
}

export default function CompensationChangeProcessing() {
  const { isRTL } = useUnifiedLocale();
  const [activeTab, setActiveTab] = useState<'requests' | 'new' | 'history'>('requests');
  const [formData, setFormData] = useState({
    employeeId: '',
    changeType: '',
    currentSalary: '',
    proposedAmount: '',
    effectiveDate: '',
    reason: '',
    justification: ''
  });

  const mockCompensationChanges: CompensationChange[] = [
    {
      id: '1',
      employeeName: 'أحمد محمد علي',
      currentSalary: 12000,
      proposedSalary: 14000,
      changeType: 'increase',
      effectiveDate: '2024-02-01',
      reason: 'ترقية إلى منصب أعلى',
      status: 'pending',
      requestedBy: 'مدير الموارد البشرية',
      submittedDate: '2024-01-15',
      approvalLevel: 'ceo'
    },
    {
      id: '2',
      employeeName: 'فاطمة أحمد سعد',
      currentSalary: 8500,
      proposedSalary: 9200,
      changeType: 'increase',
      effectiveDate: '2024-01-15',
      reason: 'زيادة سنوية',
      status: 'approved',
      requestedBy: 'مدير المبيعات',
      submittedDate: '2024-01-01',
      approvalLevel: 'hr_manager'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      case 'implemented': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'implemented': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'increase': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decrease': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      case 'bonus': return <DollarSign className="h-4 w-4 text-blue-600" />;
      case 'promotion': return <TrendingUp className="h-4 w-4 text-purple-600" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const calculatePercentageChange = (current: number, proposed: number) => {
    return (((proposed - current) / current) * 100).toFixed(1);
  };

  const handleSubmitChange = async () => {
    // Implementation for submitting compensation change
    console.log('Compensation change submitted:', formData);
  };

  const handleApproveChange = async (changeId: string) => {
    // Implementation for approving compensation change
    console.log('Compensation change approved:', changeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isRTL ? 'معالجة تغييرات التعويضات' : 'Compensation Change Processing'}
            </h1>
            <p className="text-muted-foreground">
              {isRTL ? 'إدارة طلبات تعديل الرواتب والتعويضات' : 'Manage salary and compensation change requests'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'requests'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'الطلبات المعلقة' : 'Pending Requests'}
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'new'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'طلب جديد' : 'New Request'}
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

        {activeTab === 'requests' && (
          <div className="space-y-4">
            {mockCompensationChanges.map((change) => (
              <Card key={change.id} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {change.employeeName}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {getChangeTypeIcon(change.changeType)}
                        <span>
                          {isRTL ? 
                            (change.changeType === 'increase' ? 'زيادة راتب' : 
                             change.changeType === 'decrease' ? 'تخفيض راتب' : 
                             change.changeType === 'bonus' ? 'مكافأة' : 'ترقية') 
                            : change.changeType}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(change.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(change.status)}
                        <span>
                          {isRTL ? 
                            (change.status === 'pending' ? 'معلق' : 
                             change.status === 'approved' ? 'موافق عليه' : 
                             change.status === 'rejected' ? 'مرفوض' : 'منفذ') 
                            : change.status}
                        </span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Salary Comparison */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {isRTL ? 'الراتب الحالي' : 'Current Salary'}
                        </p>
                        <p className="text-lg font-bold">{change.currentSalary.toLocaleString()} {isRTL ? 'ر.س' : 'SAR'}</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <TrendingUp className={`h-6 w-6 ${change.proposedSalary > change.currentSalary ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {isRTL ? 'الراتب المقترح' : 'Proposed Salary'}
                        </p>
                        <p className="text-lg font-bold">{change.proposedSalary.toLocaleString()} {isRTL ? 'ر.س' : 'SAR'}</p>
                        <p className={`text-sm ${change.proposedSalary > change.currentSalary ? 'text-green-600' : 'text-red-600'}`}>
                          {change.proposedSalary > change.currentSalary ? '+' : ''}{calculatePercentageChange(change.currentSalary, change.proposedSalary)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{isRTL ? 'تاريخ التطبيق:' : 'Effective Date:'}</span>
                      <span>{change.effectiveDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{isRTL ? 'مطلوب من:' : 'Requested by:'}</span>
                      <span>{change.requestedBy}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="font-medium">{isRTL ? 'السبب:' : 'Reason:'}</span>
                      <p className="text-muted-foreground mt-1">{change.reason}</p>
                    </div>
                  </div>

                  {change.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={() => handleApproveChange(change.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isRTL ? 'موافق' : 'Approve'}
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {isRTL ? 'رفض' : 'Reject'}
                      </Button>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        {isRTL ? 'طلب معلومات' : 'Request Info'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'new' && (
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'طلب تغيير تعويض جديد' : 'New Compensation Change Request'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="employee">{isRTL ? 'الموظف' : 'Employee'}</Label>
                  <Select value={formData.employeeId} onValueChange={(value) => setFormData({...formData, employeeId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? 'اختر الموظف' : 'Select employee'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{isRTL ? 'أحمد محمد علي' : 'Ahmed Mohammed Ali'}</SelectItem>
                      <SelectItem value="2">{isRTL ? 'فاطمة أحمد سعد' : 'Fatima Ahmed Saad'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="changeType">{isRTL ? 'نوع التغيير' : 'Change Type'}</Label>
                    <Select value={formData.changeType} onValueChange={(value) => setFormData({...formData, changeType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر نوع التغيير' : 'Select change type'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="increase">{isRTL ? 'زيادة راتب' : 'Salary Increase'}</SelectItem>
                        <SelectItem value="decrease">{isRTL ? 'تخفيض راتب' : 'Salary Decrease'}</SelectItem>
                        <SelectItem value="bonus">{isRTL ? 'مكافأة' : 'Bonus'}</SelectItem>
                        <SelectItem value="promotion">{isRTL ? 'ترقية' : 'Promotion'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="effectiveDate">{isRTL ? 'تاريخ التطبيق' : 'Effective Date'}</Label>
                    <Input 
                      type="date" 
                      value={formData.effectiveDate}
                      onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentSalary">{isRTL ? 'الراتب الحالي' : 'Current Salary'}</Label>
                    <Input 
                      type="number" 
                      value={formData.currentSalary}
                      onChange={(e) => setFormData({...formData, currentSalary: e.target.value})}
                      placeholder={isRTL ? 'الراتب الحالي بالريال' : 'Current salary in SAR'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="proposedAmount">{isRTL ? 'المبلغ المقترح' : 'Proposed Amount'}</Label>
                    <Input 
                      type="number" 
                      value={formData.proposedAmount}
                      onChange={(e) => setFormData({...formData, proposedAmount: e.target.value})}
                      placeholder={isRTL ? 'المبلغ الجديد بالريال' : 'New amount in SAR'}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reason">{isRTL ? 'سبب التغيير' : 'Reason for Change'}</Label>
                  <Input 
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder={isRTL ? 'أدخل سبب التغيير' : 'Enter reason for change'}
                  />
                </div>

                <div>
                  <Label htmlFor="justification">{isRTL ? 'التبرير التفصيلي' : 'Detailed Justification'}</Label>
                  <Textarea 
                    value={formData.justification}
                    onChange={(e) => setFormData({...formData, justification: e.target.value})}
                    placeholder={isRTL ? 'قدم تبريراً مفصلاً للتغيير المطلوب' : 'Provide detailed justification for the requested change'}
                    rows={4}
                  />
                </div>
              </div>

              <Button onClick={handleSubmitChange} className="w-full">
                <DollarSign className="h-4 w-4 mr-2" />
                {isRTL ? 'تقديم طلب التغيير' : 'Submit Change Request'}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'إحصائيات التغييرات' : 'Change Statistics'}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">25</p>
                  <p className="text-sm text-muted-foreground">{isRTL ? 'إجمالي الطلبات' : 'Total Requests'}</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-sm text-muted-foreground">{isRTL ? 'موافق عليها' : 'Approved'}</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">{isRTL ? 'معلقة' : 'Pending'}</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">12%</p>
                  <p className="text-sm text-muted-foreground">{isRTL ? 'متوسط الزيادة' : 'Avg Increase'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}