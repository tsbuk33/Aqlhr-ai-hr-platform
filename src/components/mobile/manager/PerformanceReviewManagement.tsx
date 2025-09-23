import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { supabase } from '@/integrations/supabase/client';
import { 
  Star, 
  TrendingUp, 
  TrendingDown,
  User, 
  Target,
  Award,
  Calendar,
  FileText,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Save
} from 'lucide-react';

interface PerformanceGoal {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: 'productivity' | 'quality' | 'leadership' | 'innovation' | 'teamwork';
  targetValue: number;
  currentValue: number;
  unit: string;
  weight: number;
  status: 'on_track' | 'at_risk' | 'exceeded' | 'not_met';
}

interface PerformanceReview {
  id: string;
  employeeName: string;
  employeeNameAr: string;
  position: string;
  positionAr: string;
  department: string;
  departmentAr: string;
  reviewPeriod: string;
  reviewType: 'quarterly' | 'annual' | 'probation' | 'special';
  status: 'draft' | 'in_progress' | 'pending_approval' | 'completed';
  overallRating: number;
  goals: PerformanceGoal[];
  managerComments: string;
  employeeComments: string;
  nextReviewDate: string;
  completionDate?: string;
  strengths: string[];
  improvementAreas: string[];
  developmentPlan: string;
}

export const PerformanceReviewManagement: React.FC = () => {
  const { lang: locale } = useUnifiedLocale();
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [loading, setLoading] = useState(false);
  const [editingComments, setEditingComments] = useState(false);
  const [tempComments, setTempComments] = useState('');

  // Mock data for demonstration
  const mockReviews: PerformanceReview[] = [
    {
      id: '1',
      employeeName: 'Fatima Al-Zahra',
      employeeNameAr: 'فاطمة الزهراء',
      position: 'Senior Developer',
      positionAr: 'مطورة أولى',
      department: 'Technology',
      departmentAr: 'التكنولوجيا',
      reviewPeriod: 'Q4 2023',
      reviewType: 'quarterly',
      status: 'in_progress',
      overallRating: 4.2,
      nextReviewDate: '2024-04-01',
      managerComments: 'Excellent technical skills and consistent delivery. Shows great potential for leadership roles.',
      employeeComments: 'I feel challenged and supported in my role. Looking forward to taking on more responsibilities.',
      strengths: ['Technical expertise', 'Problem solving', 'Team collaboration'],
      improvementAreas: ['Public speaking', 'Project management'],
      developmentPlan: 'Enroll in leadership development program and presentation skills workshop.',
      goals: [
        {
          id: '1',
          title: 'Complete 4 major projects',
          titleAr: 'إكمال 4 مشاريع كبرى',
          description: 'Successfully deliver 4 high-priority development projects',
          descriptionAr: 'تسليم 4 مشاريع تطوير عالية الأولوية بنجاح',
          category: 'productivity',
          targetValue: 4,
          currentValue: 3,
          unit: 'projects',
          weight: 30,
          status: 'on_track'
        },
        {
          id: '2',
          title: 'Mentor 2 junior developers',
          titleAr: 'توجيه 2 من المطورين المبتدئين',
          description: 'Provide guidance and support to new team members',
          descriptionAr: 'تقديم التوجيه والدعم لأعضاء الفريق الجدد',
          category: 'leadership',
          targetValue: 2,
          currentValue: 2,
          unit: 'people',
          weight: 25,
          status: 'exceeded'
        },
        {
          id: '3',
          title: 'Improve code quality score',
          titleAr: 'تحسين نقاط جودة الكود',
          description: 'Achieve 95% code quality score in reviews',
          descriptionAr: 'تحقيق نقاط جودة كود 95% في المراجعات',
          category: 'quality',
          targetValue: 95,
          currentValue: 88,
          unit: '%',
          weight: 25,
          status: 'at_risk'
        }
      ]
    },
    {
      id: '2',
      employeeName: 'Omar Al-Said',
      employeeNameAr: 'عمر السعيد',
      position: 'Marketing Manager',
      positionAr: 'مدير التسويق',
      department: 'Marketing',
      departmentAr: 'التسويق',
      reviewPeriod: 'Annual 2023',
      reviewType: 'annual',
      status: 'pending_approval',
      overallRating: 3.8,
      nextReviewDate: '2024-12-31',
      completionDate: '2024-01-15',
      managerComments: 'Strong strategic thinking and campaign execution. Needs to improve team communication.',
      employeeComments: 'Had a challenging year with great learning opportunities. Ready for next level responsibilities.',
      strengths: ['Strategic planning', 'Campaign management', 'Data analysis'],
      improvementAreas: ['Team communication', 'Budget management'],
      developmentPlan: 'Communication skills training and financial management course.',
      goals: [
        {
          id: '1',
          title: 'Increase brand awareness',
          titleAr: 'زيادة الوعي بالعلامة التجارية',
          description: 'Achieve 40% increase in brand recognition metrics',
          descriptionAr: 'تحقيق زيادة 40% في مقاييس التعرف على العلامة التجارية',
          category: 'productivity',
          targetValue: 40,
          currentValue: 35,
          unit: '%',
          weight: 40,
          status: 'on_track'
        }
      ]
    }
  ];

  useEffect(() => {
    loadPerformanceReviews();
  }, []);

  const loadPerformanceReviews = async () => {
    setLoading(true);
    try {
      // For now, use mock data
      // In production, this would fetch from the database
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error loading performance reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending_approval': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    if (locale === 'ar') {
      switch (status) {
        case 'completed': return 'مكتمل';
        case 'in_progress': return 'قيد التقدم';
        case 'pending_approval': return 'في انتظار الموافقة';
        case 'draft': return 'مسودة';
        default: return 'غير محدد';
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'exceeded': return 'text-green-600';
      case 'on_track': return 'text-blue-600';
      case 'at_risk': return 'text-yellow-600';
      case 'not_met': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getGoalStatusIcon = (status: string) => {
    switch (status) {
      case 'exceeded': return <TrendingUp className="h-4 w-4" />;
      case 'on_track': return <Target className="h-4 w-4" />;
      case 'at_risk': return <AlertCircle className="h-4 w-4" />;
      case 'not_met': return <TrendingDown className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'productivity': return <Target className="h-4 w-4" />;
      case 'quality': return <Award className="h-4 w-4" />;
      case 'leadership': return <User className="h-4 w-4" />;
      case 'innovation': return <Star className="h-4 w-4" />;
      case 'teamwork': return <MessageCircle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const calculateGoalProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const updateReviewStatus = async (reviewId: string, newStatus: string) => {
    try {
      await supabase.functions.invoke('update-performance-review', {
        body: { reviewId, status: newStatus }
      });
      loadPerformanceReviews();
    } catch (error) {
      console.error('Error updating review status:', error);
    }
  };

  const saveComments = async (reviewId: string, comments: string) => {
    try {
      await supabase.functions.invoke('update-review-comments', {
        body: { reviewId, managerComments: comments }
      });
      setEditingComments(false);
      loadPerformanceReviews();
    } catch (error) {
      console.error('Error saving comments:', error);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (activeTab === 'pending') return r.status === 'draft' || r.status === 'pending_approval';
    if (activeTab === 'in_progress') return r.status === 'in_progress';
    if (activeTab === 'completed') return r.status === 'completed';
    return false;
  });

  const selectedReviewData = selectedReview ? reviews.find(r => r.id === selectedReview) : null;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {locale === 'ar' ? 'إدارة تقييم الأداء' : 'Performance Review Management'}
          </h2>
          <p className="text-muted-foreground">
            {locale === 'ar' ? 'إدارة مراجعات أداء الموظفين وتقييماتهم' : 'Manage employee performance reviews and evaluations'}
          </p>
        </div>
        <Button size="sm">
          <Star className="h-4 w-4 mr-1" />
          {locale === 'ar' ? 'مراجعة جديدة' : 'New Review'}
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {(['pending', 'in_progress', 'completed'] as const).map((status) => (
          <Button
            key={status}
            variant={activeTab === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(status)}
            className="whitespace-nowrap"
          >
            {locale === 'ar' ? 
              (status === 'pending' ? 'معلق' : status === 'in_progress' ? 'قيد التقدم' : 'مكتمل') :
              status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
            }
          </Button>
        ))}
      </div>

      {selectedReview ? (
        /* Detailed Review View */
        <div className="space-y-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedReview(null)}
          >
            ← {locale === 'ar' ? 'العودة' : 'Back'}
          </Button>

          {selectedReviewData && (
            <>
              {/* Review Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {locale === 'ar' ? selectedReviewData.employeeNameAr : selectedReviewData.employeeName}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {locale === 'ar' ? selectedReviewData.positionAr : selectedReviewData.position}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedReviewData.reviewPeriod} • {locale === 'ar' ? selectedReviewData.departmentAr : selectedReviewData.department}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="text-2xl font-bold text-primary">{selectedReviewData.overallRating}</span>
                        <span className="text-muted-foreground">/5</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(selectedReviewData.status) + ' text-white'}>
                        {getStatusText(selectedReviewData.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Goals Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {locale === 'ar' ? 'الأهداف والإنجازات' : 'Goals & Achievements'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedReviewData.goals.map((goal) => (
                    <div key={goal.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(goal.category)}
                          <h4 className="font-semibold text-foreground">
                            {locale === 'ar' ? goal.titleAr : goal.title}
                          </h4>
                          <Badge variant="outline">
                            {goal.weight}% {locale === 'ar' ? 'وزن' : 'weight'}
                          </Badge>
                        </div>
                        <div className={`flex items-center gap-1 ${getGoalStatusColor(goal.status)}`}>
                          {getGoalStatusIcon(goal.status)}
                          <span className="text-sm font-medium capitalize">
                            {goal.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {locale === 'ar' ? goal.descriptionAr : goal.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{locale === 'ar' ? 'التقدم' : 'Progress'}</span>
                          <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                        </div>
                        <Progress value={calculateGoalProgress(goal.currentValue, goal.targetValue)} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      {locale === 'ar' ? 'تعليقات المدير' : 'Manager Comments'}
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingComments(!editingComments);
                        setTempComments(selectedReviewData.managerComments);
                      }}
                    >
                      {editingComments ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                      {editingComments ? 
                        (locale === 'ar' ? 'حفظ' : 'Save') : 
                        (locale === 'ar' ? 'تعديل' : 'Edit')
                      }
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingComments ? (
                    <div className="space-y-3">
                      <Textarea
                        value={tempComments}
                        onChange={(e) => setTempComments(e.target.value)}
                        rows={4}
                        placeholder={locale === 'ar' ? 'أضف تعليقاتك...' : 'Add your comments...'}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => saveComments(selectedReviewData.id, tempComments)}
                        >
                          {locale === 'ar' ? 'حفظ التعليقات' : 'Save Comments'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingComments(false)}
                        >
                          {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-foreground">
                      {selectedReviewData.managerComments || (locale === 'ar' ? 'لا توجد تعليقات بعد' : 'No comments yet')}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Employee Comments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {locale === 'ar' ? 'تعليقات الموظف' : 'Employee Comments'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">
                    {selectedReviewData.employeeComments || (locale === 'ar' ? 'لم يقدم الموظف تعليقات بعد' : 'Employee has not provided comments yet')}
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {selectedReviewData.status !== 'completed' && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-2 flex-wrap">
                      {selectedReviewData.status === 'draft' && (
                        <Button onClick={() => updateReviewStatus(selectedReviewData.id, 'in_progress')}>
                          {locale === 'ar' ? 'بدء المراجعة' : 'Start Review'}
                        </Button>
                      )}
                      {selectedReviewData.status === 'in_progress' && (
                        <Button onClick={() => updateReviewStatus(selectedReviewData.id, 'pending_approval')}>
                          {locale === 'ar' ? 'إرسال للموافقة' : 'Submit for Approval'}
                        </Button>
                      )}
                      {selectedReviewData.status === 'pending_approval' && (
                        <Button onClick={() => updateReviewStatus(selectedReviewData.id, 'completed')}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {locale === 'ar' ? 'إكمال المراجعة' : 'Complete Review'}
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
        /* Reviews List View */
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedReview(review.id)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {locale === 'ar' ? review.employeeNameAr : review.employeeName}
                      </h3>
                      <Badge variant="outline">
                        {locale === 'ar' ? review.positionAr : review.position}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {locale === 'ar' ? review.departmentAr : review.department} • 
                      {review.reviewPeriod} • {review.reviewType}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{review.overallRating}</span>
                        <span className="text-muted-foreground text-sm">/5</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {review.goals.length} {locale === 'ar' ? 'أهداف' : 'goals'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {locale === 'ar' ? 'التالي:' : 'Next:'} {review.nextReviewDate}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant={review.status === 'completed' ? 'default' : 'secondary'}>
                      {getStatusText(review.status)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredReviews.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {locale === 'ar' ? 'لا توجد مراجعات أداء' : 'No Performance Reviews'}
            </h3>
            <p className="text-muted-foreground">
              {locale === 'ar' ? 'لا توجد مراجعات أداء في هذه الفئة' : 'No performance reviews in this category'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};