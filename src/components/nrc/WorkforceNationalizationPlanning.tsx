import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Users, Calendar, BookOpen, TrendingUp, User, Crown } from 'lucide-react';

const WorkforceNationalizationPlanning = () => {
  // Mock data for planning scenarios
  const planningData = {
    currentState: {
      totalEmployees: 245,
      saudiEmployees: 60,
      targetSaudiEmployees: 75,
      womenEmployees: 89,
      womenInLeadership: 12,
      targetWomenInLeadership: 18
    },
    hiringPlan: [
      {
        id: 1,
        position: 'مطور برمجيات أول',
        priority: 'high',
        timeline: '3 أشهر',
        skillsRequired: ['React', 'Node.js', 'TypeScript'],
        genderTarget: 'any',
        leadershipPotential: true
      },
      {
        id: 2,
        position: 'مديرة مشروع',
        priority: 'high',
        timeline: '2 أشهر',
        skillsRequired: ['إدارة المشاريع', 'قيادة الفرق'],
        genderTarget: 'female',
        leadershipPotential: true
      },
      {
        id: 3,
        position: 'محاسب',
        priority: 'medium',
        timeline: '4 أشهر',
        skillsRequired: ['المحاسبة', 'Excel', 'SAP'],
        genderTarget: 'any',
        leadershipPotential: false
      }
    ],
    trainingPrograms: [
      {
        id: 1,
        name: 'برنامج تطوير القيادات النسائية',
        participants: 15,
        duration: '6 أشهر',
        focus: 'leadership',
        targetGender: 'female'
      },
      {
        id: 2,
        name: 'برنامج التطوير المهني للسعوديين',
        participants: 25,
        duration: '4 أشهر',
        focus: 'technical',
        targetGender: 'any'
      }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="space-y-6">
      {/* Strategic Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">هدف السعودة</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((planningData.currentState.targetSaudiEmployees / planningData.currentState.totalEmployees) * 100)}%
            </div>
            <Progress 
              value={(planningData.currentState.saudiEmployees / planningData.currentState.targetSaudiEmployees) * 100} 
              className="mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              {planningData.currentState.saudiEmployees} من أصل {planningData.currentState.targetSaudiEmployees}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الموظفات المطلوبات</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {planningData.currentState.targetSaudiEmployees - planningData.currentState.saudiEmployees}
            </div>
            <p className="text-xs text-muted-foreground">موظف سعودي إضافي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">النساء في القيادة - الهدف</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((planningData.currentState.targetWomenInLeadership / 28) * 100)}%
            </div>
            <Progress 
              value={(planningData.currentState.womenInLeadership / planningData.currentState.targetWomenInLeadership) * 100} 
              className="mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              {planningData.currentState.womenInLeadership} من أصل {planningData.currentState.targetWomenInLeadership}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المدة المتوقعة</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">أشهر للوصول للهدف</p>
          </CardContent>
        </Card>
      </div>

      {/* Hiring Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            خطة التوظيف الاستراتيجية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {planningData.hiringPlan.map((position) => (
              <div key={position.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{position.position}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getPriorityColor(position.priority)}>
                        أولوية {getPriorityText(position.priority)}
                      </Badge>
                      {position.genderTarget === 'female' && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          مستهدف: نساء
                        </Badge>
                      )}
                      {position.leadershipPotential && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          إمكانية قيادية
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    المدة المتوقعة: {position.timeline}
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">المهارات المطلوبة:</p>
                  <div className="flex flex-wrap gap-1">
                    {position.skillsRequired.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button size="sm">
                    بدء عملية التوظيف
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            برامج التطوير والتدريب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planningData.trainingPrograms.map((program) => (
              <div key={program.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold">{program.name}</h4>
                  {program.targetGender === 'female' && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      للنساء
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">المشاركين:</span>
                    <span className="text-sm font-medium">{program.participants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">المدة:</span>
                    <span className="text-sm font-medium">{program.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">التركيز:</span>
                    <span className="text-sm font-medium">
                      {program.focus === 'leadership' ? 'قيادي' : 'تقني'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button size="sm" variant="outline">
                    عرض التفاصيل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Success Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            مؤشرات النجاح المتوقعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">30.6%</div>
              <p className="text-sm text-muted-foreground">نسبة السعودة المتوقعة</p>
              <p className="text-xs text-muted-foreground mt-1">بعد 8 أشهر</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">64.3%</div>
              <p className="text-sm text-muted-foreground">النساء في القيادة المتوقعة</p>
              <p className="text-xs text-muted-foreground mt-1">18 من أصل 28 منصب</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">42%</div>
              <p className="text-sm text-muted-foreground">نسبة النساء الإجمالية</p>
              <p className="text-xs text-muted-foreground mt-1">مع التوظيفات الجديدة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkforceNationalizationPlanning;