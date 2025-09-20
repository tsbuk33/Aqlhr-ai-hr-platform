import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  TrendingUp, 
  TrendingDown,
  User,
  Award,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  nameAr: string;
  status: 'present' | 'absent' | 'late' | 'on_leave';
}

interface PerformanceData {
  employeeId: string;
  name: string;
  nameAr: string;
  overallScore: number;
  productivity: number;
  quality: number;
  attendance: number;
  collaboration: number;
  trend: 'up' | 'down' | 'stable';
  recentAchievements: string[];
  areasForImprovement: string[];
  lastReviewDate: string;
  nextReviewDue: string;
}

interface PerformanceQuickReviewProps {
  isArabic: boolean;
  teamMembers: TeamMember[];
}

export const PerformanceQuickReview: React.FC<PerformanceQuickReviewProps> = ({ 
  isArabic, 
  teamMembers 
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [performanceData] = useState<PerformanceData[]>([
    {
      employeeId: 'emp_001',
      name: 'Ahmed Al-Rashid',
      nameAr: 'أحمد الراشد',
      overallScore: 4.2,
      productivity: 85,
      quality: 92,
      attendance: 96,
      collaboration: 88,
      trend: 'up',
      recentAchievements: [
        'Completed project 2 weeks ahead of schedule',
        'Led successful client presentation',
        'Mentored 2 new team members'
      ],
      areasForImprovement: [
        'Time management in meetings',
        'Documentation practices'
      ],
      lastReviewDate: '2024-10-15',
      nextReviewDue: '2025-01-15'
    },
    {
      employeeId: 'emp_002',
      name: 'Fatima Al-Zahra',
      nameAr: 'فاطمة الزهراء',
      overallScore: 4.7,
      productivity: 94,
      quality: 96,
      attendance: 89,
      collaboration: 95,
      trend: 'up',
      recentAchievements: [
        'Achieved 99.5% accuracy in deliverables',
        'Won Employee of the Month',
        'Improved team collaboration metrics'
      ],
      areasForImprovement: [
        'Occasional late arrivals',
        'Could delegate more effectively'
      ],
      lastReviewDate: '2024-11-01',
      nextReviewDue: '2025-02-01'
    },
    {
      employeeId: 'emp_003',
      name: 'Mohammed Al-Saud',
      nameAr: 'محمد السعود',
      overallScore: 3.8,
      productivity: 78,
      quality: 82,
      attendance: 94,
      collaboration: 75,
      trend: 'stable',
      recentAchievements: [
        'Consistent performance',
        'Good technical skills development'
      ],
      areasForImprovement: [
        'Communication with team members',
        'Meeting project deadlines',
        'Proactive problem solving'
      ],
      lastReviewDate: '2024-09-20',
      nextReviewDue: '2024-12-20'
    },
    {
      employeeId: 'emp_004',
      name: 'Nora Al-Qasimi',
      nameAr: 'نورا القاسمي',
      overallScore: 4.5,
      productivity: 91,
      quality: 89,
      attendance: 98,
      collaboration: 93,
      trend: 'up',
      recentAchievements: [
        'Perfect attendance record',
        'Innovative solution implementation',
        'Strong leadership in team projects'
      ],
      areasForImprovement: [
        'Could improve technical documentation'
      ],
      lastReviewDate: '2024-11-10',
      nextReviewDue: '2025-02-10'
    }
  ]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getOverallRating = (score: number) => {
    if (score >= 4.5) return { rating: isArabic ? 'ممتاز' : 'Excellent', color: 'text-green-500' };
    if (score >= 4.0) return { rating: isArabic ? 'جيد جداً' : 'Very Good', color: 'text-blue-500' };
    if (score >= 3.5) return { rating: isArabic ? 'جيد' : 'Good', color: 'text-yellow-500' };
    return { rating: isArabic ? 'يحتاج تحسين' : 'Needs Improvement', color: 'text-red-500' };
  };

  const getTrendIcon = (trend: PerformanceData['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <div className="h-4 w-4 border-b-2 border-blue-500" />;
    }
  };

  const isReviewDue = (nextReviewDue: string) => {
    const dueDate = new Date(nextReviewDue);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 30; // Due within 30 days
  };

  const getEmployeePerformance = (employeeId: string) => {
    return performanceData.find(p => p.employeeId === employeeId);
  };

  const selectedPerformance = selectedEmployee ? getEmployeePerformance(selectedEmployee) : null;

  return (
    <div className="space-y-4">
      {/* Team Performance Overview */}
      <div className="grid grid-cols-2 gap-3">
        {teamMembers.slice(0, 4).map((member) => {
          const performance = getEmployeePerformance(member.id);
          if (!performance) return null;

          const rating = getOverallRating(performance.overallScore);
          const needsReview = isReviewDue(performance.nextReviewDue);

          return (
            <div 
              key={member.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                selectedEmployee === member.id ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'
              }`}
              onClick={() => setSelectedEmployee(selectedEmployee === member.id ? null : member.id)}
            >
              <div className="space-y-2">
                {/* Employee Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      {isArabic ? member.nameAr : member.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(performance.trend)}
                    {needsReview && (
                      <AlertTriangle className="h-3 w-3 text-orange-500" />
                    )}
                  </div>
                </div>

                {/* Score Display */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className={`h-4 w-4 ${rating.color}`} />
                    <span className={`text-lg font-bold ${rating.color}`}>
                      {performance.overallScore.toFixed(1)}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {rating.rating}
                  </Badge>
                </div>

                {/* Quick Metrics */}
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="flex justify-between">
                    <span>{isArabic ? 'الإنتاجية' : 'Productivity'}</span>
                    <span className={getScoreColor(performance.productivity)}>
                      {performance.productivity}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? 'الحضور' : 'Attendance'}</span>
                    <span className={getScoreColor(performance.attendance)}>
                      {performance.attendance}%
                    </span>
                  </div>
                </div>

                {/* Review Status */}
                {needsReview && (
                  <div className="flex items-center gap-1 text-xs text-orange-600">
                    <Clock className="h-3 w-3" />
                    <span>
                      {isArabic ? 'مراجعة مستحقة' : 'Review Due'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Performance View */}
      {selectedPerformance && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              {isArabic ? selectedPerformance.nameAr : selectedPerformance.name}
            </h4>
            <Button size="sm" variant="outline">
              <Eye className="h-3 w-3 mr-1" />
              {isArabic ? 'عرض التفاصيل الكاملة' : 'View Full Details'}
            </Button>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{isArabic ? 'الإنتاجية' : 'Productivity'}</span>
                <span className={getScoreColor(selectedPerformance.productivity)}>
                  {selectedPerformance.productivity}%
                </span>
              </div>
              <Progress value={selectedPerformance.productivity} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{isArabic ? 'الجودة' : 'Quality'}</span>
                <span className={getScoreColor(selectedPerformance.quality)}>
                  {selectedPerformance.quality}%
                </span>
              </div>
              <Progress value={selectedPerformance.quality} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{isArabic ? 'الحضور' : 'Attendance'}</span>
                <span className={getScoreColor(selectedPerformance.attendance)}>
                  {selectedPerformance.attendance}%
                </span>
              </div>
              <Progress value={selectedPerformance.attendance} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{isArabic ? 'التعاون' : 'Collaboration'}</span>
                <span className={getScoreColor(selectedPerformance.collaboration)}>
                  {selectedPerformance.collaboration}%
                </span>
              </div>
              <Progress value={selectedPerformance.collaboration} className="h-2" />
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-green-500" />
              {isArabic ? 'الإنجازات الأخيرة' : 'Recent Achievements'}
            </h5>
            <div className="space-y-1">
              {selectedPerformance.recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              {isArabic ? 'مجالات للتحسين' : 'Areas for Improvement'}
            </h5>
            <div className="space-y-1">
              {selectedPerformance.areasForImprovement.map((area, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Information */}
          <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>
              {isArabic ? 'آخر مراجعة: ' : 'Last Review: '}
              {new Date(selectedPerformance.lastReviewDate).toLocaleDateString()}
            </span>
            <span>
              {isArabic ? 'المراجعة التالية: ' : 'Next Review: '}
              {new Date(selectedPerformance.nextReviewDue).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1">
          <Award className="h-3 w-3 mr-1" />
          {isArabic ? 'إنشاء مراجعة' : 'Create Review'}
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          <Target className="h-3 w-3 mr-1" />
          {isArabic ? 'تعيين الأهداف' : 'Set Goals'}
        </Button>
      </div>
    </div>
  );
};