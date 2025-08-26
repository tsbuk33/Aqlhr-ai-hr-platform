import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useToast } from '@/hooks/use-toast';
import { UniversalDocumentManager } from '@/components/common/UniversalDocumentManager';
import { AqlHRAIAssistant } from '@/components/ai';
import { 
  Users, 
  TrendingUp, 
  Target, 
  Crown, 
  GitBranch,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Award,
  BarChart3,
  Shield,
  Globe,
  Building,
  Briefcase,
  Star,
  ArrowUp,
  ArrowRight,
  Plus,
  Eye,
  Edit,
  ChevronRight,
  Network,
  Zap
} from 'lucide-react';

interface SuccessionCandidate {
  id: string;
  name: string;
  nameAr: string;
  currentPosition: string;
  department: string;
  readinessLevel: 'ready-now' | 'ready-1-2-years' | 'ready-3-5-years' | 'development-needed';
  performanceRating: number;
  potentialRating: number;
  keyStrengths: string[];
  developmentAreas: string[];
  lastAssessment: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface KeyPosition {
  id: string;
  title: string;
  titleAr: string;
  department: string;
  level: 'c-suite' | 'senior-vp' | 'vp' | 'director' | 'senior-manager' | 'manager';
  criticality: 'critical' | 'important' | 'standard';
  currentHolder: string;
  retirementRisk: number;
  successionDepth: number;
  candidates: SuccessionCandidate[];
  businessImpact: 'strategic' | 'high' | 'medium' | 'low';
  governmentReporting: boolean;
  nationalSecurity: boolean;
}

import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

export default function SuccessionPlanning() {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);

  // Mock data for demonstration
  const [keyPositions] = useState<KeyPosition[]>([
    {
      id: '1',
      title: 'Chief Executive Officer',
      titleAr: 'الرئيس التنفيذي',
      department: 'Executive',
      level: 'c-suite',
      criticality: 'critical',
      currentHolder: 'Ahmed Al-Rashid',
      retirementRisk: 25,
      successionDepth: 3,
      businessImpact: 'strategic',
      governmentReporting: true,
      nationalSecurity: true,
      candidates: [
        {
          id: '1',
          name: 'Khalid Al-Fahad',
          nameAr: 'خالد الفهد',
          currentPosition: 'Chief Operating Officer',
          department: 'Operations',
          readinessLevel: 'ready-now',
          performanceRating: 95,
          potentialRating: 90,
          keyStrengths: ['Strategic Vision', 'Operational Excellence', 'Leadership'],
          developmentAreas: ['Global Experience', 'Digital Transformation'],
          lastAssessment: '2024-01-15',
          riskLevel: 'low'
        }
      ]
    },
    {
      id: '2',
      title: 'Chief Financial Officer',
      titleAr: 'الرئيس المالي',
      department: 'Finance',
      level: 'c-suite',
      criticality: 'critical',
      currentHolder: 'Fatima Al-Zahra',
      retirementRisk: 15,
      successionDepth: 2,
      businessImpact: 'strategic',
      governmentReporting: true,
      nationalSecurity: false,
      candidates: []
    },
    {
      id: '3',
      title: 'VP of Strategic Operations',
      titleAr: 'نائب رئيس العمليات الاستراتيجية',
      department: 'Operations',
      level: 'senior-vp',
      criticality: 'critical',
      currentHolder: 'Mohammed Al-Saud',
      retirementRisk: 45,
      successionDepth: 1,
      businessImpact: 'strategic',
      governmentReporting: true,
      nationalSecurity: true,
      candidates: []
    }
  ]);

  const metrics = {
    criticalPositions: 24,
    identifiedSuccessors: 18,
    readyNow: 8,
    developmentNeeded: 16,
    averageSuccessionDepth: 2.1,
    retirementRisk: 35,
    diversityScore: 72,
    nationalComplianceScore: 94
  };

  const getReadinessColor = (level: string) => {
    switch (level) {
      case 'ready-now': return 'text-green-600 bg-green-50 border-green-200';
      case 'ready-1-2-years': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'ready-3-5-years': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'important': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return 'text-red-600';
    if (risk >= 40) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Crown className="h-8 w-8 text-amber-600" />
          {language === 'ar' ? 'التخطيط للخلافة القيادية' : 'Strategic Succession Planning'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {language === 'ar' 
            ? 'إدارة استراتيجية لتطوير وإعداد القيادات المستقبلية والمواهب الحرجة للمؤسسة'
            : 'Strategic leadership development and critical talent pipeline management for organizational continuity'
          }
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-600" />
              {language === 'ar' ? 'المناصب الحرجة' : 'Critical Positions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.criticalPositions}</div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'تتطلب تخطيط خلافة' : 'Requiring succession'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              {language === 'ar' ? 'الخلفاء المحددين' : 'Identified Successors'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.identifiedSuccessors}</div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'من أصل 24 منصب' : 'Out of 24 positions'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              {language === 'ar' ? 'جاهزين الآن' : 'Ready Now'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.readyNow}</div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'يمكن تعيينهم فوراً' : 'Can be promoted immediately'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-amber-600" />
              {language === 'ar' ? 'الامتثال الوطني' : 'National Compliance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{metrics.nationalComplianceScore}%</div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'للمعايير الحكومية' : 'Government standards'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {language === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="positions" className="gap-2">
            <Briefcase className="h-4 w-4" />
            {language === 'ar' ? 'المناصب الحرجة' : 'Key Positions'}
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="gap-2">
            <Network className="h-4 w-4" />
            {language === 'ar' ? 'خط المواهب' : 'Talent Pipeline'}
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <Users className="h-4 w-4" />
            {language === 'ar' ? 'المستندات' : 'Documents'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Risk Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  {language === 'ar' ? 'تحليل المخاطر' : 'Risk Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {language === 'ar' ? 'مخاطر التقاعد (5 سنوات)' : 'Retirement Risk (5 years)'}
                    </span>
                    <span className={`text-sm font-bold ${getRiskColor(metrics.retirementRisk)}`}>
                      {metrics.retirementRisk}%
                    </span>
                  </div>
                  <Progress value={metrics.retirementRisk} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {language === 'ar' ? 'عمق التخطيط للخلافة' : 'Succession Depth'}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {metrics.averageSuccessionDepth}x
                    </span>
                  </div>
                  <Progress value={metrics.averageSuccessionDepth * 33.33} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {language === 'ar' ? 'التنوع في الخلافة' : 'Succession Diversity'}
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {metrics.diversityScore}%
                    </span>
                  </div>
                  <Progress value={metrics.diversityScore} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  {language === 'ar' ? 'جاهزية الخلافة' : 'Succession Readiness'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge className="bg-green-50 text-green-700 border-green-200">
                    {language === 'ar' ? 'جاهز الآن' : 'Ready Now'}
                  </Badge>
                  <span className="font-bold text-green-600">{metrics.readyNow}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {language === 'ar' ? '1-2 سنة' : '1-2 Years'}
                  </Badge>
                  <span className="font-bold text-yellow-600">6</span>
                </div>

                <div className="flex justify-between items-center">
                  <Badge className="bg-orange-50 text-orange-700 border-orange-200">
                    {language === 'ar' ? '3-5 سنوات' : '3-5 Years'}
                  </Badge>
                  <span className="font-bold text-orange-600">4</span>
                </div>

                <div className="flex justify-between items-center">
                  <Badge className="bg-red-50 text-red-700 border-red-200">
                    {language === 'ar' ? 'يحتاج تطوير' : 'Development Needed'}
                  </Badge>
                  <span className="font-bold text-red-600">{metrics.developmentNeeded}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strategic Initiatives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                {language === 'ar' ? 'المبادرات الاستراتيجية' : 'Strategic Succession Initiatives'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    {language === 'ar' ? 'برنامج القيادات الوطنية' : 'National Leadership Program'}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === 'ar' 
                      ? 'تطوير القيادات السعودية للمناصب الاستراتيجية'
                      : 'Developing Saudi leaders for strategic positions'
                    }
                  </p>
                  <Badge className="bg-green-50 text-green-700 border-green-200">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-purple-600" />
                    {language === 'ar' ? 'برنامج الخبرة الدولية' : 'Global Experience Program'}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === 'ar' 
                      ? 'تطوير المهارات العالمية للقيادات المستقبلية'
                      : 'Building global capabilities for future leaders'
                    }
                  </p>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    {language === 'ar' ? 'قيد التطوير' : 'In Development'}
                  </Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-600" />
                    {language === 'ar' ? 'برنامج المواهب الحرجة' : 'Critical Talent Program'}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === 'ar' 
                      ? 'الاحتفاظ وتطوير المواهب الحرجة للمؤسسة'
                      : 'Retention and development of mission-critical talent'
                    }
                  </p>
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                    {language === 'ar' ? 'قيد التخطيط' : 'Planning'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {language === 'ar' ? 'المناصب الحرجة والاستراتيجية' : 'Critical & Strategic Positions'}
            </h3>
            <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  {language === 'ar' ? 'إضافة منصب حرج' : 'Add Critical Position'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {language === 'ar' ? 'إضافة منصب حرج جديد' : 'Add New Critical Position'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{language === 'ar' ? 'المسمى الوظيفي' : 'Position Title'}</Label>
                      <Input placeholder={language === 'ar' ? 'المسمى الوظيفي' : 'Position title'} />
                    </div>
                    <div className="space-y-2">
                      <Label>{language === 'ar' ? 'القسم' : 'Department'}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'ar' ? 'اختر القسم' : 'Select department'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="executive">{language === 'ar' ? 'الإدارة التنفيذية' : 'Executive'}</SelectItem>
                          <SelectItem value="operations">{language === 'ar' ? 'العمليات' : 'Operations'}</SelectItem>
                          <SelectItem value="finance">{language === 'ar' ? 'المالية' : 'Finance'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{language === 'ar' ? 'مستوى الأهمية' : 'Criticality Level'}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'ar' ? 'مستوى الأهمية' : 'Criticality level'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">{language === 'ar' ? 'حرج' : 'Critical'}</SelectItem>
                          <SelectItem value="important">{language === 'ar' ? 'مهم' : 'Important'}</SelectItem>
                          <SelectItem value="standard">{language === 'ar' ? 'عادي' : 'Standard'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{language === 'ar' ? 'التأثير على الأعمال' : 'Business Impact'}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'ar' ? 'التأثير على الأعمال' : 'Business impact'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strategic">{language === 'ar' ? 'استراتيجي' : 'Strategic'}</SelectItem>
                          <SelectItem value="high">{language === 'ar' ? 'عالي' : 'High'}</SelectItem>
                          <SelectItem value="medium">{language === 'ar' ? 'متوسط' : 'Medium'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsCreatePlanOpen(false)}>
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </Button>
                    <Button onClick={() => {
                      setIsCreatePlanOpen(false);
                      toast({
                        title: language === 'ar' ? 'تم إضافة المنصب' : 'Position Added',
                        description: language === 'ar' ? 'تم إضافة المنصب الحرج بنجاح' : 'Critical position added successfully',
                      });
                    }}>
                      {language === 'ar' ? 'إضافة' : 'Add Position'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {keyPositions.map((position) => (
              <Card key={position.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold">
                          {language === 'ar' ? position.titleAr : position.title}
                        </h4>
                        <Badge className={getCriticalityColor(position.criticality)}>
                          {language === 'ar' ? 
                            (position.criticality === 'critical' ? 'حرج' : position.criticality === 'important' ? 'مهم' : 'عادي') :
                            position.criticality
                          }
                        </Badge>
                        {position.governmentReporting && (
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            <Globe className="h-3 w-3 mr-1" />
                            {language === 'ar' ? 'حكومي' : 'Gov'}
                          </Badge>
                        )}
                        {position.nationalSecurity && (
                          <Badge variant="outline" className="text-red-600 border-red-200">
                            <Shield className="h-3 w-3 mr-1" />
                            {language === 'ar' ? 'أمن قومي' : 'National Security'}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>{language === 'ar' ? 'شاغل المنصب:' : 'Current Holder:'}</strong> {position.currentHolder}</p>
                        <p><strong>{language === 'ar' ? 'القسم:' : 'Department:'}</strong> {position.department}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 border rounded-lg">
                      <div className={`text-lg font-bold ${getRiskColor(position.retirementRisk)}`}>
                        {position.retirementRisk}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'مخاطر التقاعد' : 'Retirement Risk'}
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{position.successionDepth}</div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'عمق الخلافة' : 'Succession Depth'}
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-lg font-bold text-green-600">{position.candidates.length}</div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'المرشحين' : 'Candidates'}
                      </div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        {position.businessImpact === 'strategic' ? 'A' : position.businessImpact === 'high' ? 'B' : 'C'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'ar' ? 'تأثير الأعمال' : 'Business Impact'}
                      </div>
                    </div>
                  </div>

                  {position.candidates.length > 0 && (
                    <div className="border-t pt-4">
                      <h5 className="font-medium mb-3">
                        {language === 'ar' ? 'أفضل المرشحين للخلافة' : 'Top Succession Candidates'}
                      </h5>
                      {position.candidates.map((candidate) => (
                        <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="font-medium">{language === 'ar' ? candidate.nameAr : candidate.name}</p>
                                <p className="text-sm text-muted-foreground">{candidate.currentPosition}</p>
                              </div>
                              <Badge className={`${getReadinessColor(candidate.readinessLevel)} border`}>
                                {language === 'ar' ? 
                                  (candidate.readinessLevel === 'ready-now' ? 'جاهز الآن' : 
                                   candidate.readinessLevel === 'ready-1-2-years' ? '1-2 سنة' :
                                   candidate.readinessLevel === 'ready-3-5-years' ? '3-5 سنوات' : 'يحتاج تطوير') :
                                  candidate.readinessLevel.replace('-', ' ')
                                }
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-sm font-bold text-green-600">{candidate.performanceRating}%</div>
                              <div className="text-xs text-muted-foreground">
                                {language === 'ar' ? 'الأداء' : 'Performance'}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-bold text-blue-600">{candidate.potentialRating}%</div>
                              <div className="text-xs text-muted-foreground">
                                {language === 'ar' ? 'الإمكانات' : 'Potential'}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-blue-600" />
                {language === 'ar' ? 'خط المواهب والتطوير' : 'Talent Pipeline & Development'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'تتبع وإدارة المسارات التطويرية للمواهب الحرجة والقيادات المستقبلية'
                  : 'Track and manage development pathways for critical talent and future leaders'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center py-8 text-muted-foreground">
                  <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    {language === 'ar' 
                      ? 'شبكة المواهب التفاعلية قيد التطوير'
                      : 'Interactive talent network coming soon'
                    }
                  </p>
                  <p className="text-sm">
                    {language === 'ar' 
                      ? 'تصور شامل لمسارات التطوير والمواهب الحرجة'
                      : 'Comprehensive visualization of development pathways and critical talent'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {language === 'ar' ? 'مركز مستندات التخطيط للخلافة' : 'Succession Planning Document Center'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'رفع وإدارة المستندات المتعلقة بالتخطيط للخلافة والتطوير القيادي'
                  : 'Upload and manage documents related to succession planning and leadership development'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UniversalDocumentManager 
                moduleName="Succession Planning"
                moduleNameAr="التخطيط للخلافة"
                description="Upload succession plans, leadership assessments, development reports, and strategic talent documents"
                descriptionAr="رفع خطط الخلافة وتقييمات القيادة وتقارير التطوير ومستندات المواهب الاستراتيجية"
                platform="succession-planning"
                moduleType="hr"
                acceptedTypes={['.pdf', '.doc', '.docx', '.xlsx', '.xls', '.ppt', '.pptx', '.jpg', '.jpeg', '.png']}
                maxFileSize={100 * 1024 * 1024}
                maxFiles={50}
                showAsCard={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Assistant */}
      <AqlHRAIAssistant 
        moduleContext="succession-planning" 
        companyId="demo-company"
      />
      {/* AI Integration for Succession Planning */}
      <UniversalAIIntegrator 
        pageType="strategic" 
        moduleName="succession-planning" 
        companyId="demo-company" 
        enabledFeatures={['strategic-planning', 'succession-planning', 'talent-pipeline', 'leadership-analytics']}
      />
    </div>
  );
}