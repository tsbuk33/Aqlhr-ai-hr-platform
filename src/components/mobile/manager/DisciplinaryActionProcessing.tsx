import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertTriangle, 
  Shield, 
  FileText, 
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  Scale,
  Eye,
  Edit,
  Save,
  Plus
} from 'lucide-react';

interface DisciplinaryAction {
  id: string;
  employeeName: string;
  employeeNameAr: string;
  employeeId: string;
  incidentDate: string;
  reportedDate: string;
  incidentType: 'attendance' | 'performance' | 'conduct' | 'policy_violation' | 'safety' | 'other';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  status: 'reported' | 'investigating' | 'pending_decision' | 'action_taken' | 'closed' | 'appealed';
  description: string;
  descriptionAr: string;
  investigationNotes: string;
  actionTaken: string;
  actionTakenAr: string;
  actionType: 'verbal_warning' | 'written_warning' | 'final_warning' | 'suspension' | 'termination' | 'other';
  reportedBy: string;
  assignedInvestigator: string;
  dueDate?: string;
  completedDate?: string;
  witnesses: string[];
  documents: string[];
  appealDeadline?: string;
  isAppealed: boolean;
}

export const DisciplinaryActionProcessing: React.FC = () => {
  const { lang: locale } = useUnifiedLocale();
  const [cases, setCases] = useState<DisciplinaryAction[]>([]);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'appealed'>('active');
  const [loading, setLoading] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [showNewCaseForm, setShowNewCaseForm] = useState(false);

  // Mock data for demonstration
  const mockCases: DisciplinaryAction[] = [
    {
      id: '1',
      employeeName: 'Ahmad Al-Mansour',
      employeeNameAr: 'أحمد المنصور',
      employeeId: 'EMP-001',
      incidentDate: '2024-01-10',
      reportedDate: '2024-01-12',
      incidentType: 'attendance',
      severity: 'moderate',
      status: 'investigating',
      description: 'Excessive tardiness and unauthorized absences over the past month',
      descriptionAr: 'تأخير مفرط وغيابات غير مصرح بها خلال الشهر الماضي',
      investigationNotes: 'Employee has been late 8 times in January. Manager has spoken informally but no improvement shown.',
      actionTaken: '',
      actionTakenAr: '',
      actionType: 'written_warning',
      reportedBy: 'Sarah Johnson',
      assignedInvestigator: 'HR Manager',
      dueDate: '2024-01-20',
      witnesses: ['Team Lead', 'Security Guard'],
      documents: ['Attendance Report', 'Previous Warnings'],
      isAppealed: false
    },
    {
      id: '2',
      employeeName: 'Layla Al-Rashid',
      employeeNameAr: 'ليلى الراشد',
      employeeId: 'EMP-002',
      incidentDate: '2024-01-08',
      reportedDate: '2024-01-08',
      incidentType: 'conduct',
      severity: 'major',
      status: 'pending_decision',
      description: 'Inappropriate behavior towards colleagues during team meeting',
      descriptionAr: 'سلوك غير مناسب تجاه الزملاء أثناء اجتماع الفريق',
      investigationNotes: 'Multiple witnesses confirmed the incident. Employee showed remorse and apologized.',
      actionTaken: 'Final written warning and mandatory sensitivity training',
      actionTakenAr: 'إنذار نهائي مكتوب وتدريب إلزامي على الحساسية',
      actionType: 'final_warning',
      reportedBy: 'Team Manager',
      assignedInvestigator: 'HR Director',
      dueDate: '2024-01-15',
      witnesses: ['John Smith', 'Maria Garcia', 'Ahmed Hassan'],
      documents: ['Meeting Minutes', 'Witness Statements'],
      isAppealed: false
    },
    {
      id: '3',
      employeeName: 'Khalid Al-Mahmoud',
      employeeNameAr: 'خالد المحمود',
      employeeId: 'EMP-003',
      incidentDate: '2023-12-20',
      reportedDate: '2023-12-21',
      incidentType: 'policy_violation',
      severity: 'critical',
      status: 'appealed',
      description: 'Violation of confidentiality agreement by sharing sensitive client data',
      descriptionAr: 'انتهاك اتفاقية السرية من خلال مشاركة بيانات العملاء الحساسة',
      investigationNotes: 'IT logs confirm unauthorized data access and external sharing.',
      actionTaken: 'Termination for cause',
      actionTakenAr: 'إنهاء الخدمة بسبب مبرر',
      actionType: 'termination',
      reportedBy: 'IT Security',
      assignedInvestigator: 'Legal Team',
      dueDate: '2024-01-05',
      completedDate: '2024-01-05',
      appealDeadline: '2024-01-15',
      witnesses: ['IT Manager'],
      documents: ['IT Logs', 'Email Evidence', 'Client Complaint'],
      isAppealed: true
    }
  ];

  useEffect(() => {
    loadDisciplinaryCases();
  }, []);

  const loadDisciplinaryCases = async () => {
    setLoading(true);
    try {
      // For now, use mock data
      // In production, this would fetch from the database
      setCases(mockCases);
    } catch (error) {
      console.error('Error loading disciplinary cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'major': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      case 'minor': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityText = (severity: string) => {
    if (locale === 'ar') {
      switch (severity) {
        case 'critical': return 'حرج';
        case 'major': return 'كبير';
        case 'moderate': return 'متوسط';
        case 'minor': return 'طفيف';
        default: return 'غير محدد';
      }
    }
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return 'bg-green-500';
      case 'action_taken': return 'bg-blue-500';
      case 'investigating': return 'bg-yellow-500';
      case 'pending_decision': return 'bg-orange-500';
      case 'appealed': return 'bg-purple-500';
      case 'reported': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    if (locale === 'ar') {
      switch (status) {
        case 'closed': return 'مغلق';
        case 'action_taken': return 'تم اتخاذ إجراء';
        case 'investigating': return 'قيد التحقيق';
        case 'pending_decision': return 'في انتظار القرار';
        case 'appealed': return 'تم الاستئناف';
        case 'reported': return 'تم الإبلاغ';
        default: return 'غير محدد';
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  const getIncidentTypeText = (type: string) => {
    if (locale === 'ar') {
      switch (type) {
        case 'attendance': return 'الحضور';
        case 'performance': return 'الأداء';
        case 'conduct': return 'السلوك';
        case 'policy_violation': return 'انتهاك السياسة';
        case 'safety': return 'السلامة';
        case 'other': return 'أخرى';
        default: return 'غير محدد';
      }
    }
    return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
  };

  const getActionTypeText = (type: string) => {
    if (locale === 'ar') {
      switch (type) {
        case 'verbal_warning': return 'إنذار شفهي';
        case 'written_warning': return 'إنذار مكتوب';
        case 'final_warning': return 'إنذار نهائي';
        case 'suspension': return 'إيقاف';
        case 'termination': return 'إنهاء الخدمة';
        case 'other': return 'أخرى';
        default: return 'غير محدد';
      }
    }
    return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
  };

  const updateCaseStatus = async (caseId: string, newStatus: string) => {
    try {
      await supabase.functions.invoke('update-disciplinary-case', {
        body: { caseId, status: newStatus }
      });
      loadDisciplinaryCases();
    } catch (error) {
      console.error('Error updating case status:', error);
    }
  };

  const saveInvestigationNotes = async (caseId: string, notes: string) => {
    try {
      await supabase.functions.invoke('update-investigation-notes', {
        body: { caseId, notes }
      });
      setEditingNotes(false);
      loadDisciplinaryCases();
    } catch (error) {
      console.error('Error saving investigation notes:', error);
    }
  };

  const filteredCases = cases.filter(c => {
    if (activeTab === 'active') return ['reported', 'investigating', 'pending_decision'].includes(c.status);
    if (activeTab === 'completed') return ['action_taken', 'closed'].includes(c.status);
    if (activeTab === 'appealed') return c.status === 'appealed';
    return false;
  });

  const selectedCaseData = selectedCase ? cases.find(c => c.id === selectedCase) : null;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {locale === 'ar' ? 'معالجة الإجراءات التأديبية' : 'Disciplinary Action Processing'}
          </h2>
          <p className="text-muted-foreground">
            {locale === 'ar' ? 'إدارة ومعالجة القضايا التأديبية للموظفين' : 'Manage and process employee disciplinary cases'}
          </p>
        </div>
        <Button size="sm" onClick={() => setShowNewCaseForm(true)}>
          <Plus className="h-4 w-4 mr-1" />
          {locale === 'ar' ? 'قضية جديدة' : 'New Case'}
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {(['active', 'completed', 'appealed'] as const).map((status) => (
          <Button
            key={status}
            variant={activeTab === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(status)}
            className="whitespace-nowrap"
          >
            {locale === 'ar' ? 
              (status === 'active' ? 'نشط' : status === 'completed' ? 'مكتمل' : 'مستأنف') :
              status.charAt(0).toUpperCase() + status.slice(1)
            }
          </Button>
        ))}
      </div>

      {selectedCase ? (
        /* Detailed Case View */
        <div className="space-y-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedCase(null)}
          >
            ← {locale === 'ar' ? 'العودة' : 'Back'}
          </Button>

          {selectedCaseData && (
            <>
              {/* Case Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {locale === 'ar' ? selectedCaseData.employeeNameAr : selectedCaseData.employeeName}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {selectedCaseData.employeeId} • {getIncidentTypeText(selectedCaseData.incidentType)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'ar' ? 'تاريخ الحادثة:' : 'Incident Date:'} {selectedCaseData.incidentDate}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge variant="outline" className={getSeverityColor(selectedCaseData.severity) + ' text-white'}>
                        {getSeverityText(selectedCaseData.severity)}
                      </Badge>
                      <br />
                      <Badge variant="outline" className={getStatusColor(selectedCaseData.status) + ' text-white'}>
                        {getStatusText(selectedCaseData.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Case Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {locale === 'ar' ? 'تفاصيل الحادثة' : 'Incident Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {locale === 'ar' ? 'الوصف' : 'Description'}
                    </h4>
                    <p className="text-muted-foreground">
                      {locale === 'ar' ? selectedCaseData.descriptionAr : selectedCaseData.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">{locale === 'ar' ? 'المبلغ:' : 'Reported by:'}</span>
                      <p className="text-muted-foreground">{selectedCaseData.reportedBy}</p>
                    </div>
                    <div>
                      <span className="font-semibold">{locale === 'ar' ? 'المحقق:' : 'Investigator:'}</span>
                      <p className="text-muted-foreground">{selectedCaseData.assignedInvestigator}</p>
                    </div>
                    <div>
                      <span className="font-semibold">{locale === 'ar' ? 'تاريخ الاستحقاق:' : 'Due Date:'}</span>
                      <p className="text-muted-foreground">{selectedCaseData.dueDate}</p>
                    </div>
                    <div>
                      <span className="font-semibold">{locale === 'ar' ? 'الشهود:' : 'Witnesses:'}</span>
                      <p className="text-muted-foreground">{selectedCaseData.witnesses.join(', ')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Investigation Notes */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      {locale === 'ar' ? 'ملاحظات التحقيق' : 'Investigation Notes'}
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingNotes(!editingNotes);
                        setTempNotes(selectedCaseData.investigationNotes);
                      }}
                    >
                      {editingNotes ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                      {editingNotes ? 
                        (locale === 'ar' ? 'حفظ' : 'Save') : 
                        (locale === 'ar' ? 'تعديل' : 'Edit')
                      }
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingNotes ? (
                    <div className="space-y-3">
                      <Textarea
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        rows={4}
                        placeholder={locale === 'ar' ? 'أضف ملاحظات التحقيق...' : 'Add investigation notes...'}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => saveInvestigationNotes(selectedCaseData.id, tempNotes)}
                        >
                          {locale === 'ar' ? 'حفظ الملاحظات' : 'Save Notes'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingNotes(false)}
                        >
                          {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-foreground">
                      {selectedCaseData.investigationNotes || (locale === 'ar' ? 'لا توجد ملاحظات بعد' : 'No investigation notes yet')}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Action Taken */}
              {selectedCaseData.actionTaken && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      {locale === 'ar' ? 'الإجراء المتخذ' : 'Action Taken'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="outline">
                        {getActionTypeText(selectedCaseData.actionType)}
                      </Badge>
                      <p className="text-foreground">
                        {locale === 'ar' ? selectedCaseData.actionTakenAr : selectedCaseData.actionTaken}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Status Actions */}
              {selectedCaseData.status !== 'closed' && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-2 flex-wrap">
                      {selectedCaseData.status === 'reported' && (
                        <Button onClick={() => updateCaseStatus(selectedCaseData.id, 'investigating')}>
                          <Eye className="h-4 w-4 mr-1" />
                          {locale === 'ar' ? 'بدء التحقيق' : 'Start Investigation'}
                        </Button>
                      )}
                      {selectedCaseData.status === 'investigating' && (
                        <Button onClick={() => updateCaseStatus(selectedCaseData.id, 'pending_decision')}>
                          <Clock className="h-4 w-4 mr-1" />
                          {locale === 'ar' ? 'في انتظار القرار' : 'Pending Decision'}
                        </Button>
                      )}
                      {selectedCaseData.status === 'pending_decision' && (
                        <Button onClick={() => updateCaseStatus(selectedCaseData.id, 'action_taken')}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {locale === 'ar' ? 'تنفيذ الإجراء' : 'Take Action'}
                        </Button>
                      )}
                      {selectedCaseData.status === 'action_taken' && (
                        <Button 
                          variant="outline"
                          onClick={() => updateCaseStatus(selectedCaseData.id, 'closed')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          {locale === 'ar' ? 'إغلاق القضية' : 'Close Case'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      ) : (
        /* Cases List View */
        <div className="space-y-4">
          {filteredCases.map((disciplinaryCase) => (
            <Card key={disciplinaryCase.id} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedCase(disciplinaryCase.id)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {locale === 'ar' ? disciplinaryCase.employeeNameAr : disciplinaryCase.employeeName}
                      </h3>
                      <Badge variant="outline">
                        {disciplinaryCase.employeeId}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {getIncidentTypeText(disciplinaryCase.incidentType)} • 
                      {locale === 'ar' ? ' تاريخ الحادثة: ' : ' Incident: '}{disciplinaryCase.incidentDate}
                    </p>
                    
                    <p className="text-sm text-foreground mb-3 line-clamp-2">
                      {locale === 'ar' ? disciplinaryCase.descriptionAr : disciplinaryCase.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{disciplinaryCase.reportedBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{disciplinaryCase.dueDate}</span>
                      </div>
                      {disciplinaryCase.isAppealed && (
                        <Badge variant="destructive" className="text-xs">
                          {locale === 'ar' ? 'مستأنف' : 'Appealed'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <Badge variant="outline" className={getSeverityColor(disciplinaryCase.severity) + ' text-white'}>
                      {getSeverityText(disciplinaryCase.severity)}
                    </Badge>
                    <br />
                    <Badge variant={disciplinaryCase.status === 'closed' ? 'default' : 'secondary'}>
                      {getStatusText(disciplinaryCase.status)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredCases.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {locale === 'ar' ? 'لا توجد قضايا تأديبية' : 'No Disciplinary Cases'}
            </h3>
            <p className="text-muted-foreground">
              {locale === 'ar' ? 'لا توجد قضايا تأديبية في هذه الفئة' : 'No disciplinary cases in this category'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};