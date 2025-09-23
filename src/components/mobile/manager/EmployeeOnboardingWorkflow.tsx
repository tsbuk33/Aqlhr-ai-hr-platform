import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { supabase } from '@/integrations/supabase/client';
import { 
  UserPlus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Clipboard,
  Users,
  Calendar,
  MapPin,
  Star,
  Send,
  Edit,
  Settings
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assignedTo: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  category: 'documentation' | 'equipment' | 'training' | 'setup' | 'verification';
  notes?: string;
}

interface OnboardingCase {
  id: string;
  employeeName: string;
  employeeNameAr: string;
  position: string;
  positionAr: string;
  department: string;
  departmentAr: string;
  startDate: string;
  progress: number;
  status: 'draft' | 'active' | 'completed' | 'delayed';
  steps: OnboardingStep[];
  assignedManager: string;
  createdAt: string;
}

export const EmployeeOnboardingWorkflow: React.FC = () => {
  const { lang: locale } = useUnifiedLocale();
  const [onboardingCases, setOnboardingCases] = useState<OnboardingCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'draft'>('active');

  // Mock data for demonstration
  const mockOnboardingCases: OnboardingCase[] = [
    {
      id: '1',
      employeeName: 'Sarah Al-Mahmoud',
      employeeNameAr: 'سارة المحمود',
      position: 'Senior Software Engineer',
      positionAr: 'مهندسة برمجيات أولى',
      department: 'Technology',
      departmentAr: 'التكنولوجيا',
      startDate: '2024-02-01',
      progress: 75,
      status: 'active',
      assignedManager: 'Ahmed Hassan',
      createdAt: '2024-01-15',
      steps: [
        {
          id: '1',
          title: 'Contract Signing',
          titleAr: 'توقيع العقد',
          description: 'Complete employment contract and NDA',
          descriptionAr: 'إكمال عقد العمل واتفاقية السرية',
          status: 'completed',
          assignedTo: 'HR Department',
          dueDate: '2024-01-20',
          priority: 'high',
          category: 'documentation'
        },
        {
          id: '2',
          title: 'IT Equipment Setup',
          titleAr: 'إعداد معدات تقنية المعلومات',
          description: 'Laptop, access cards, and software installation',
          descriptionAr: 'حاسوب محمول وبطاقات دخول وتثبيت البرامج',
          status: 'completed',
          assignedTo: 'IT Department',
          dueDate: '2024-01-28',
          priority: 'high',
          category: 'equipment'
        },
        {
          id: '3',
          title: 'Orientation Training',
          titleAr: 'التدريب التوجيهي',
          description: 'Company culture and policies overview',
          descriptionAr: 'نظرة عامة على ثقافة الشركة والسياسات',
          status: 'in_progress',
          assignedTo: 'Training Team',
          dueDate: '2024-02-05',
          priority: 'medium',
          category: 'training'
        },
        {
          id: '4',
          title: 'Department Integration',
          titleAr: 'دمج القسم',
          description: 'Team introductions and project assignments',
          descriptionAr: 'تعريف بالفريق وتعيين المشاريع',
          status: 'pending',
          assignedTo: 'Department Manager',
          dueDate: '2024-02-10',
          priority: 'medium',
          category: 'setup'
        }
      ]
    },
    {
      id: '2',
      employeeName: 'Mohammad Al-Fares',
      employeeNameAr: 'محمد الفارس',
      position: 'Marketing Specialist',
      positionAr: 'أخصائي تسويق',
      department: 'Marketing',
      departmentAr: 'التسويق',
      startDate: '2024-02-15',
      progress: 25,
      status: 'active',
      assignedManager: 'Layla Ahmed',
      createdAt: '2024-01-28',
      steps: [
        {
          id: '1',
          title: 'Background Verification',
          titleAr: 'التحقق من الخلفية',
          description: 'Educational and employment verification',
          descriptionAr: 'التحقق من التعليم والعمل',
          status: 'completed',
          assignedTo: 'HR Department',
          dueDate: '2024-02-05',
          priority: 'high',
          category: 'verification'
        },
        {
          id: '2',
          title: 'Workspace Assignment',
          titleAr: 'تخصيص مساحة العمل',
          description: 'Desk setup and office tour',
          descriptionAr: 'إعداد المكتب وجولة في المكتب',
          status: 'in_progress',
          assignedTo: 'Facilities',
          dueDate: '2024-02-12',
          priority: 'medium',
          category: 'setup'
        }
      ]
    }
  ];

  useEffect(() => {
    loadOnboardingCases();
  }, []);

  const loadOnboardingCases = async () => {
    setLoading(true);
    try {
      // For now, use mock data
      // In production, this would fetch from the database
      setOnboardingCases(mockOnboardingCases);
    } catch (error) {
      console.error('Error loading onboarding cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    if (locale === 'ar') {
      switch (status) {
        case 'completed': return 'مكتمل';
        case 'in_progress': return 'قيد التقدم';
        case 'pending': return 'في الانتظار';
        case 'blocked': return 'محظور';
        default: return 'غير محدد';
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'documentation': return <FileText className="h-4 w-4" />;
      case 'equipment': return <MapPin className="h-4 w-4" />;
      case 'training': return <Users className="h-4 w-4" />;
      case 'setup': return <Settings className="h-4 w-4" />;
      case 'verification': return <CheckCircle className="h-4 w-4" />;
      default: return <Clipboard className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const updateStepStatus = async (caseId: string, stepId: string, newStatus: string) => {
    try {
      // Update step status in database
      await supabase.functions.invoke('update-onboarding-step', {
        body: { caseId, stepId, status: newStatus }
      });
      
      // Refresh data
      loadOnboardingCases();
    } catch (error) {
      console.error('Error updating step status:', error);
    }
  };

  const filteredCases = onboardingCases.filter(c => c.status === activeTab);

  const selectedCaseData = selectedCase ? onboardingCases.find(c => c.id === selectedCase) : null;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {locale === 'ar' ? 'سير عمل إعداد الموظفين' : 'Employee Onboarding Workflow'}
          </h2>
          <p className="text-muted-foreground">
            {locale === 'ar' ? 'إدارة عملية إعداد الموظفين الجدد' : 'Manage new employee onboarding process'}
          </p>
        </div>
        <Button size="sm">
          <UserPlus className="h-4 w-4 mr-1" />
          {locale === 'ar' ? 'إعداد جديد' : 'New Onboarding'}
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {(['active', 'draft', 'completed'] as const).map((status) => (
          <Button
            key={status}
            variant={activeTab === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(status)}
            className="whitespace-nowrap"
          >
            {locale === 'ar' ? 
              (status === 'active' ? 'نشط' : status === 'draft' ? 'مسودة' : 'مكتمل') :
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
                        {locale === 'ar' ? selectedCaseData.positionAr : selectedCaseData.position}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'ar' ? selectedCaseData.departmentAr : selectedCaseData.department}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{selectedCaseData.progress}%</div>
                      <div className="text-sm text-muted-foreground">
                        {locale === 'ar' ? 'مكتمل' : 'Complete'}
                      </div>
                    </div>
                  </div>
                  <Progress value={selectedCaseData.progress} className="mt-4" />
                </CardHeader>
              </Card>

              {/* Steps List */}
              <div className="space-y-3">
                {selectedCaseData.steps.map((step) => (
                  <Card key={step.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(step.status)}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getCategoryIcon(step.category)}
                              <h3 className="font-semibold text-foreground">
                                {locale === 'ar' ? step.titleAr : step.title}
                              </h3>
                              <Star className={`h-3 w-3 ${getPriorityColor(step.priority)}`} />
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {locale === 'ar' ? step.descriptionAr : step.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{step.assignedTo}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{step.dueDate}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant="outline" className={getStatusColor(step.status) + ' text-white'}>
                            {getStatusText(step.status)}
                          </Badge>
                          {step.status !== 'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStepStatus(selectedCaseData.id, step.id, 'completed')}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {locale === 'ar' ? 'إكمال' : 'Complete'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        /* Cases List View */
        <div className="space-y-4">
          {filteredCases.map((onboardingCase) => (
            <Card key={onboardingCase.id} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedCase(onboardingCase.id)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {locale === 'ar' ? onboardingCase.employeeNameAr : onboardingCase.employeeName}
                      </h3>
                      <Badge variant="outline">
                        {locale === 'ar' ? onboardingCase.positionAr : onboardingCase.position}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {locale === 'ar' ? onboardingCase.departmentAr : onboardingCase.department} • 
                      {locale === 'ar' ? ' يبدأ في: ' : ' Starts: '}{onboardingCase.startDate}
                    </p>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                        <span>{locale === 'ar' ? 'التقدم' : 'Progress'}</span>
                        <span>{onboardingCase.progress}%</span>
                      </div>
                      <Progress value={onboardingCase.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{onboardingCase.assignedManager}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clipboard className="h-3 w-3" />
                        <span>{onboardingCase.steps.length} {locale === 'ar' ? 'خطوات' : 'steps'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant={onboardingCase.status === 'active' ? 'default' : 'secondary'}>
                      {getStatusText(onboardingCase.status)}
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
            <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {locale === 'ar' ? 'لا توجد حالات إعداد' : 'No Onboarding Cases'}
            </h3>
            <p className="text-muted-foreground">
              {locale === 'ar' ? 'لا توجد حالات إعداد موظفين في هذه الفئة' : 'No employee onboarding cases in this category'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};