import React, { useState } from 'react';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  BookOpen, 
  Scale, 
  DollarSign,
  Calendar,
  User,
  FileText,
  TrendingUp,
  Clock,
  Star,
  ExternalLink,
  Download,
  Eye,
  Plus
} from 'lucide-react';

export const LegalResearchAssistant: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [researchType, setResearchType] = useState('');

  const caseLawResults = [
    {
      id: 1,
      caseTitle: isRTL ? 'قضية الفصل التعسفي - الرياض 2023' : 'Wrongful Termination Case - Riyadh 2023',
      caseNumber: 'RIY-2023-1452',
      court: isRTL ? 'محكمة الرياض العمالية' : 'Riyadh Labor Court',
      date: '2023-11-15',
      relevanceScore: 92,
      summary: isRTL 
        ? 'قضية تتعلق بفصل موظف دون إنذار مسبق، تم الحكم لصالح الموظف بتعويض شهرين راتب'
        : 'Case involving termination without prior notice, ruled in favor of employee with 2 months salary compensation',
      keywords: ['termination', 'notice', 'compensation'],
      outcome: 'employee-favor'
    },
    {
      id: 2,
      caseTitle: isRTL ? 'نزاع ساعات العمل الإضافية - جدة 2024' : 'Overtime Hours Dispute - Jeddah 2024',
      caseNumber: 'JED-2024-0334',
      court: isRTL ? 'محكمة جدة العمالية' : 'Jeddah Labor Court',
      date: '2024-01-10',
      relevanceScore: 88,
      summary: isRTL
        ? 'نزاع حول عدم دفع ساعات العمل الإضافية، تم الحكم بإلزام الشركة بدفع المستحقات'
        : 'Dispute over unpaid overtime hours, court ordered company to pay outstanding amounts',
      keywords: ['overtime', 'payment', 'hours'],
      outcome: 'employee-favor'
    },
    {
      id: 3,
      caseTitle: isRTL ? 'قضية تمييز في التوظيف - الدمام 2023' : 'Employment Discrimination Case - Dammam 2023',
      caseNumber: 'DAM-2023-0891',
      court: isRTL ? 'محكمة الدمام العمالية' : 'Dammam Labor Court',
      date: '2023-12-20',
      relevanceScore: 75,
      summary: isRTL
        ? 'ادعاء تمييز في عملية التوظيف، تم رفض الدعوى لعدم وجود أدلة كافية'
        : 'Alleged discrimination in hiring process, case dismissed due to insufficient evidence',
      keywords: ['discrimination', 'hiring', 'evidence'],
      outcome: 'employer-favor'
    }
  ];

  const precedentAnalysis = [
    {
      id: 1,
      topic: isRTL ? 'تعويض الفصل التعسفي' : 'Wrongful Termination Compensation',
      cases: 15,
      winRate: 78,
      avgCompensation: isRTL ? '45,000 ريال' : '45,000 SAR',
      trend: 'increasing',
      keyFactors: [
        isRTL ? 'مدة الخدمة' : 'Length of service',
        isRTL ? 'سبب الفصل' : 'Reason for termination',
        isRTL ? 'الإنذارات المسبقة' : 'Prior warnings'
      ]
    },
    {
      id: 2,
      topic: isRTL ? 'نزاعات الأجور والمزايا' : 'Wage and Benefit Disputes',
      cases: 23,
      winRate: 65,
      avgCompensation: isRTL ? '28,000 ريال' : '28,000 SAR',
      trend: 'stable',
      keyFactors: [
        isRTL ? 'وضوح العقد' : 'Contract clarity',
        isRTL ? 'وثائق الراتب' : 'Salary documentation',
        isRTL ? 'سياسات الشركة' : 'Company policies'
      ]
    }
  ];

  const legalStrategies = [
    {
      id: 1,
      scenario: isRTL ? 'موظف يدعي الفصل التعسفي' : 'Employee claiming wrongful termination',
      strategy: isRTL ? 'استراتيجية دفاعية' : 'Defensive Strategy',
      recommendation: isRTL
        ? 'مراجعة ملف الموظف، توثيق الأداء، التحقق من اتباع الإجراءات القانونية'
        : 'Review employee file, document performance, verify legal procedures were followed',
      successRate: 72,
      estimatedCost: isRTL ? '15,000 - 30,000 ريال' : '15,000 - 30,000 SAR',
      timeframe: isRTL ? '3-6 أشهر' : '3-6 months'
    },
    {
      id: 2,
      scenario: isRTL ? 'نزاع حول ساعات العمل الإضافية' : 'Overtime hours dispute',
      strategy: isRTL ? 'التسوية الودية' : 'Amicable Settlement',
      recommendation: isRTL
        ? 'مراجعة سجلات الحضور، حساب المستحقات، عرض تسوية عادلة'
        : 'Review attendance records, calculate dues, offer fair settlement',
      successRate: 85,
      estimatedCost: isRTL ? '5,000 - 15,000 ريال' : '5,000 - 15,000 SAR',
      timeframe: isRTL ? '1-2 شهر' : '1-2 months'
    }
  ];

  const expertConsultations = [
    {
      id: 1,
      expertName: isRTL ? 'الأستاذ أحمد القانوني' : 'Prof. Ahmed Alqanouni',
      expertise: isRTL ? 'قانون العمل السعودي' : 'Saudi Labor Law',
      rating: 4.8,
      consultations: 156,
      hourlyRate: isRTL ? '500 ريال/ساعة' : '500 SAR/hour',
      availability: 'available',
      languages: ['Arabic', 'English']
    },
    {
      id: 2,
      expertName: isRTL ? 'الدكتورة فاطمة العدل' : 'Dr. Fatima Aladl',
      expertise: isRTL ? 'نزاعات العمل والتحكيم' : 'Labor Disputes & Arbitration',
      rating: 4.9,
      consultations: 203,
      hourlyRate: isRTL ? '600 ريال/ساعة' : '600 SAR/hour',
      availability: 'busy',
      languages: ['Arabic', 'English', 'French']
    },
    {
      id: 3,
      expertName: isRTL ? 'المستشار محمد الشريعة' : 'Counselor Mohammed Alsharia',
      expertise: isRTL ? 'القانون التجاري والعمالي' : 'Commercial & Labor Law',
      rating: 4.7,
      consultations: 89,
      hourlyRate: isRTL ? '450 ريال/ساعة' : '450 SAR/hour',
      availability: 'available',
      languages: ['Arabic']
    }
  ];

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'employee-favor': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'employer-favor': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'settlement': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'busy': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'limited': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Search className="h-6 w-6" />
            {isRTL ? 'مساعد البحث القانوني' : 'Legal Research Assistant'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {isRTL ? 'بحث في السوابق القضائية وتحليل الاستراتيجيات القانونية' : 'Research case law and analyze legal strategies'}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {isRTL ? 'بحث جديد' : 'New Research'}
        </Button>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {isRTL ? 'البحث في السوابق القضائية' : 'Case Law Research'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRTL ? 'أدخل موضوع البحث أو الكلمات المفتاحية...' : 'Enter research topic or keywords...'}
              />
            </div>
            <Select value={researchType} onValueChange={setResearchType}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? 'نوع البحث' : 'Research Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="case-law">{isRTL ? 'السوابق القضائية' : 'Case Law'}</SelectItem>
                <SelectItem value="precedent">{isRTL ? 'تحليل السوابق' : 'Precedent Analysis'}</SelectItem>
                <SelectItem value="strategy">{isRTL ? 'الاستراتيجيات القانونية' : 'Legal Strategies'}</SelectItem>
                <SelectItem value="expert">{isRTL ? 'استشارة خبير' : 'Expert Consultation'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full md:w-auto">
            <Search className="h-4 w-4 mr-2" />
            {isRTL ? 'بحث' : 'Search'}
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="case-law" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="case-law">{isRTL ? 'السوابق القضائية' : 'Case Law'}</TabsTrigger>
          <TabsTrigger value="precedent">{isRTL ? 'تحليل السوابق' : 'Precedent Analysis'}</TabsTrigger>
          <TabsTrigger value="strategy">{isRTL ? 'الاستراتيجيات' : 'Legal Strategies'}</TabsTrigger>
          <TabsTrigger value="experts">{isRTL ? 'الاستشارات' : 'Expert Consultation'}</TabsTrigger>
        </TabsList>

        <TabsContent value="case-law" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {isRTL ? 'نتائج البحث في السوابق القضائية' : 'Case Law Search Results'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caseLawResults.map((caseItem) => (
                  <div key={caseItem.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{caseItem.caseTitle}</h4>
                          <Badge variant="outline">{caseItem.caseNumber}</Badge>
                          <Badge className={getOutcomeColor(caseItem.outcome)}>
                            {caseItem.outcome}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{caseItem.summary}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Scale className="h-3 w-3" />
                            {caseItem.court}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {caseItem.date}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getRelevanceColor(caseItem.relevanceScore)}`}>
                          {caseItem.relevanceScore}%
                        </div>
                        <div className="text-xs text-muted-foreground">{isRTL ? 'صلة' : 'Relevance'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      {caseItem.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        {isRTL ? 'عرض التفاصيل' : 'View Details'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        {isRTL ? 'تحميل الحكم' : 'Download Judgment'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {isRTL ? 'المصدر' : 'Source'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="precedent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {isRTL ? 'تحليل السوابق وتحديد الأنماط' : 'Precedent Analysis & Pattern Identification'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {precedentAnalysis.map((analysis) => (
                  <div key={analysis.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{analysis.topic}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'عدد القضايا:' : 'Cases:'}</span>
                            <div className="font-medium">{analysis.cases}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'معدل النجاح:' : 'Win Rate:'}</span>
                            <div className="font-medium text-green-600">{analysis.winRate}%</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'متوسط التعويض:' : 'Avg Compensation:'}</span>
                            <div className="font-medium">{analysis.avgCompensation}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'الاتجاه:' : 'Trend:'}</span>
                            <div className="font-medium flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-green-500" />
                              {analysis.trend}
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">{isRTL ? 'العوامل الرئيسية:' : 'Key Factors:'}</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {analysis.keyFactors.map((factor, index) => (
                              <Badge key={index} variant="secondary">{factor}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                {isRTL ? 'توصيات الاستراتيجيات القانونية' : 'Legal Strategy Recommendations'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {legalStrategies.map((strategy) => (
                  <div key={strategy.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{strategy.scenario}</h4>
                          <Badge variant="outline">{strategy.strategy}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{strategy.recommendation}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'معدل النجاح:' : 'Success Rate:'}</span>
                            <div className="font-medium text-green-600">{strategy.successRate}%</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'التكلفة المقدرة:' : 'Estimated Cost:'}</span>
                            <div className="font-medium">{strategy.estimatedCost}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'الإطار الزمني:' : 'Timeframe:'}</span>
                            <div className="font-medium">{strategy.timeframe}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {isRTL ? 'جدولة استشارة الخبراء' : 'Expert Consultation Scheduling'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expertConsultations.map((expert) => (
                  <div key={expert.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{expert.expertName}</h4>
                          <Badge className={getAvailabilityColor(expert.availability)}>
                            {expert.availability}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{expert.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{expert.expertise}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'الاستشارات:' : 'Consultations:'}</span>
                            <div className="font-medium">{expert.consultations}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'السعر/ساعة:' : 'Hourly Rate:'}</span>
                            <div className="font-medium">{expert.hourlyRate}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{isRTL ? 'اللغات:' : 'Languages:'}</span>
                            <div className="font-medium">{expert.languages.join(', ')}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" disabled={expert.availability === 'busy'}>
                        <Calendar className="h-3 w-3 mr-1" />
                        {isRTL ? 'حجز استشارة' : 'Book Consultation'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        {isRTL ? 'الملف الشخصي' : 'View Profile'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {isRTL ? 'تقدير التكلفة' : 'Cost Estimation'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};