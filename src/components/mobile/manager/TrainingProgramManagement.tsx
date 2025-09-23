import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calendar, Users, Clock, Award, Plus, Search, Filter } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  completionRate: number;
}

export default function TrainingProgramManagement() {
  const { isRTL } = useUnifiedLocale();
  const [activeTab, setActiveTab] = useState<'programs' | 'new' | 'reports'>('programs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const mockPrograms: TrainingProgram[] = [
    {
      id: '1',
      title: 'برنامج التطوير القيادي',
      description: 'برنامج شامل لتطوير المهارات القيادية',
      instructor: 'د. أحمد محمد',
      duration: '3 أسابيع',
      startDate: '2024-02-01',
      endDate: '2024-02-21',
      participants: 25,
      maxParticipants: 30,
      status: 'ongoing',
      category: 'القيادة',
      level: 'intermediate',
      completionRate: 68
    },
    {
      id: '2',
      title: 'التدريب على السلامة المهنية',
      description: 'برنامج أساسي للسلامة في مكان العمل',
      instructor: 'م. فاطمة أحمد',
      duration: '5 أيام',
      startDate: '2024-02-15',
      endDate: '2024-02-19',
      participants: 45,
      maxParticipants: 50,
      status: 'scheduled',
      category: 'السلامة',
      level: 'beginner',
      completionRate: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'ongoing': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPrograms = mockPrograms.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || program.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/5" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isRTL ? 'إدارة البرامج التدريبية' : 'Training Program Management'}
            </h1>
            <p className="text-muted-foreground">
              {isRTL ? 'تنظيم وإدارة برامج التدريب والتطوير' : 'Organize and manage training and development programs'}
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {isRTL ? 'برنامج جديد' : 'New Program'}
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('programs')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'programs'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'البرامج' : 'Programs'}
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'new'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'إنشاء برنامج' : 'Create Program'}
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'reports'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRTL ? 'التقارير' : 'Reports'}
          </button>
        </div>

        {activeTab === 'programs' && (
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isRTL ? 'البحث في البرامج...' : 'Search programs...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
                  <SelectItem value="scheduled">{isRTL ? 'مجدولة' : 'Scheduled'}</SelectItem>
                  <SelectItem value="ongoing">{isRTL ? 'جارية' : 'Ongoing'}</SelectItem>
                  <SelectItem value="completed">{isRTL ? 'مكتملة' : 'Completed'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Programs List */}
            <div className="space-y-4">
              {filteredPrograms.map((program) => (
                <Card key={program.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{program.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{program.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(program.status)}>
                          {isRTL ? 
                            (program.status === 'scheduled' ? 'مجدولة' : 
                             program.status === 'ongoing' ? 'جارية' : 
                             program.status === 'completed' ? 'مكتملة' : 'ملغية') 
                            : program.status}
                        </Badge>
                        <Badge variant="outline" className={getLevelColor(program.level)}>
                          {isRTL ? 
                            (program.level === 'beginner' ? 'مبتدئ' : 
                             program.level === 'intermediate' ? 'متوسط' : 'متقدم') 
                            : program.level}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{isRTL ? 'المدرب:' : 'Instructor:'}</span>
                        <span>{program.instructor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{isRTL ? 'المدة:' : 'Duration:'}</span>
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{isRTL ? 'تاريخ البدء:' : 'Start Date:'}</span>
                        <span>{program.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{isRTL ? 'المشاركون:' : 'Participants:'}</span>
                        <span>{program.participants}/{program.maxParticipants}</span>
                      </div>
                    </div>

                    {program.status === 'ongoing' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{isRTL ? 'نسبة الإكمال:' : 'Completion Rate:'}</span>
                          <span>{program.completionRate}%</span>
                        </div>
                        <Progress value={program.completionRate} className="h-2" />
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        {isRTL ? 'عرض التفاصيل' : 'View Details'}
                      </Button>
                      <Button variant="outline" size="sm">
                        {isRTL ? 'إدارة المشاركين' : 'Manage Participants'}
                      </Button>
                      {program.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <Award className="h-4 w-4 mr-1" />
                          {isRTL ? 'إصدار الشهادات' : 'Issue Certificates'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'new' && (
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'إنشاء برنامج تدريبي جديد' : 'Create New Training Program'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>{isRTL ? 'عنوان البرنامج' : 'Program Title'}</Label>
                  <Input placeholder={isRTL ? 'أدخل عنوان البرنامج' : 'Enter program title'} />
                </div>

                <div>
                  <Label>{isRTL ? 'وصف البرنامج' : 'Program Description'}</Label>
                  <Textarea 
                    placeholder={isRTL ? 'وصف مفصل للبرنامج التدريبي' : 'Detailed program description'}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{isRTL ? 'الفئة' : 'Category'}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر الفئة' : 'Select category'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leadership">{isRTL ? 'القيادة' : 'Leadership'}</SelectItem>
                        <SelectItem value="technical">{isRTL ? 'تقني' : 'Technical'}</SelectItem>
                        <SelectItem value="safety">{isRTL ? 'السلامة' : 'Safety'}</SelectItem>
                        <SelectItem value="communication">{isRTL ? 'التواصل' : 'Communication'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{isRTL ? 'المستوى' : 'Level'}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={isRTL ? 'اختر المستوى' : 'Select level'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">{isRTL ? 'مبتدئ' : 'Beginner'}</SelectItem>
                        <SelectItem value="intermediate">{isRTL ? 'متوسط' : 'Intermediate'}</SelectItem>
                        <SelectItem value="advanced">{isRTL ? 'متقدم' : 'Advanced'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{isRTL ? 'تاريخ البدء' : 'Start Date'}</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>{isRTL ? 'تاريخ الانتهاء' : 'End Date'}</Label>
                    <Input type="date" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{isRTL ? 'المدرب' : 'Instructor'}</Label>
                    <Input placeholder={isRTL ? 'اسم المدرب' : 'Instructor name'} />
                  </div>
                  <div>
                    <Label>{isRTL ? 'الحد الأقصى للمشاركين' : 'Max Participants'}</Label>
                    <Input type="number" placeholder="30" />
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                {isRTL ? 'إنشاء البرنامج' : 'Create Program'}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'إحصائيات البرامج' : 'Program Statistics'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{isRTL ? 'إجمالي البرامج' : 'Total Programs'}</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isRTL ? 'البرامج النشطة' : 'Active Programs'}</span>
                  <span className="font-bold">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isRTL ? 'إجمالي المشاركين' : 'Total Participants'}</span>
                  <span className="font-bold">234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isRTL ? 'معدل الإكمال' : 'Completion Rate'}</span>
                  <span className="font-bold">87%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'الفئات الأكثر شيوعاً' : 'Popular Categories'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{isRTL ? 'القيادة' : 'Leadership'}</span>
                    <span>35%</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{isRTL ? 'التقني' : 'Technical'}</span>
                    <span>28%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{isRTL ? 'السلامة' : 'Safety'}</span>
                    <span>22%</span>
                  </div>
                  <Progress value={22} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}