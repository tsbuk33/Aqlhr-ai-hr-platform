import React, { useState } from 'react';
import { FeatureGate } from '@/components/pricing/FeatureGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Brain, 
  Target, 
  Users, 
  Calendar, 
  CheckCircle,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  Settings,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useCCIPlaybook } from '@/hooks/useCCIPlaybook';
import { useTaskIntegration } from '@/hooks/useTaskIntegration';

const Playbook: React.FC = () => {
  const isArabic = false; // TODO: Implement i18n
  
  // Mock data for now - replace with actual tenant/survey/wave from context
  const tenantId = "mock-tenant-id"; // TODO: Get from auth context
  const surveyId = "mock-survey-id"; // TODO: Get from URL params or context
  const waveId = "mock-wave-id"; // TODO: Get from URL params or context
  
  const { 
    currentPlaybook, 
    playbooks, 
    loading, 
    generating, 
    error,
    generatePlaybook,
    updatePlaybookStatus 
  } = useCCIPlaybook(tenantId, surveyId, waveId);

  const { createCCITask } = useTaskIntegration();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const handleGeneratePlaybook = async () => {
    await generatePlaybook({ tenantId, surveyId, waveId });
  };

  const handleStartInitiative = async (initiativeId: string) => {
    // Find the initiative in the current playbook
    const initiative = currentPlaybook?.initiatives?.find(i => i.id === initiativeId);
    
    if (initiative) {
      try {
        // Create a task for this initiative
        const taskId = await createCCITask({
          title: initiative.title,
          description: initiative.description,
          priority: initiative.priority as 'low' | 'medium' | 'high' | 'urgent',
          dueDate: undefined, // Will be set based on milestone timing
          ownerRole: 'hr_manager', // Default owner role
          category: 'culture_improvement'
        });
        
        console.log('Created task for initiative:', initiativeId, 'Task ID:', taskId);
        
        // Update initiative status (if you have this function)
        // await updateInitiativeStatus(initiativeId, 'in_progress');
        
      } catch (error) {
        console.error('Failed to create task for initiative:', error);
      }
    }
  };

  // Filter initiatives based on selected filter
  const filteredInitiatives = currentPlaybook?.initiatives?.filter(initiative => {
    if (selectedFilter === 'all') return true;
    return initiative.priority.toLowerCase() === selectedFilter.toLowerCase();
  }) || [];

  // Calculate overview stats
  const totalInitiatives = currentPlaybook?.initiatives?.length || 0;
  const activeInitiatives = filteredInitiatives.filter(i => i.milestones?.some(m => m.week <= 4)).length;
  const avgConfidence = totalInitiatives > 0 
    ? Math.round(filteredInitiatives.reduce((acc, init) => acc + (init.kpis?.length || 0) * 20, 0) / totalInitiatives)
    : 0;
  const avgDuration = totalInitiatives > 0
    ? Math.round(filteredInitiatives.reduce((acc, init) => acc + (init.duration_weeks || 0) / 4, 0) / totalInitiatives)
    : 0;
  const uniqueOwners = new Set(filteredInitiatives.map(i => i.owner)).size;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'secondary';
      case 'ready': return 'default';
      case 'in-progress': return 'default';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning': return <Clock className="h-4 w-4" />;
      case 'ready': return <Play className="h-4 w-4" />;
      case 'in-progress': return <Pause className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning': return isArabic ? 'تخطيط' : 'Planning';
      case 'ready': return isArabic ? 'جاهز' : 'Ready';
      case 'in-progress': return isArabic ? 'قيد التنفيذ' : 'In Progress';
      case 'completed': return isArabic ? 'مكتمل' : 'Completed';
      default: return status;
    }
  };

  return (
    <FeatureGate 
      featureKey="cci_playbook" 
      featureName="CCI AI Change Playbook"
      demoScreenshot="/demo-playbook-screenshot.png"
    >
      <div className={`min-h-screen bg-background p-6 ${isArabic ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{isArabic ? 'كتيب التغيير الذكي' : 'AI Change Playbook'}</h1>
            <p className="text-muted-foreground">{isArabic ? 'مبادرات التغيير المقترحة بالذكاء الاصطناعي' : 'AI-powered change initiatives and recommendations'}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleGeneratePlaybook}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isArabic ? 'توليد مبادرات جديدة' : 'Generate New Initiatives'}
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              {isArabic ? 'إعدادات الذكاء الاصطناعي' : 'AI Settings'}
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isArabic ? 'إجمالي المبادرات' : 'Total Initiatives'}
              </CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInitiatives}</div>
              <p className="text-xs text-muted-foreground">
                {isArabic ? `${activeInitiatives} نشطة، ${totalInitiatives - activeInitiatives} مخططة` : `${activeInitiatives} active, ${totalInitiatives - activeInitiatives} planned`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isArabic ? 'معدل الثقة بالذكاء الاصطناعي' : 'AI Confidence'}
              </CardTitle>
              <Brain className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgConfidence}%</div>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'متوسط عبر جميع المبادرات' : 'Average across all initiatives'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isArabic ? 'المدة المتوقعة' : 'Expected Duration'}
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgDuration}</div>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'أشهر متوسط' : 'months average'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isArabic ? 'الفرق المشاركة' : 'Teams Involved'}
              </CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueOwners}</div>
              <p className="text-xs text-muted-foreground">
                {isArabic ? 'عبر الإدارات المختلفة' : 'across departments'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Initiatives List */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {isArabic ? 'المبادرات المقترحة' : 'Recommended Initiatives'}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                {isArabic ? 'فلترة حسب الأولوية' : 'Filter by Priority'}
              </Button>
              <Button variant="outline" size="sm">
                {isArabic ? 'ترتيب حسب التأثير' : 'Sort by Impact'}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredInitiatives.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {isArabic ? 'لا توجد مبادرات' : 'No Initiatives Available'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {isArabic ? 'انقر على "توليد مبادرات جديدة" لإنشاء خطة تغيير بالذكاء الاصطناعي' : 'Click "Generate New Initiatives" to create an AI-powered change plan'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredInitiatives.map((initiative) => (
                <Card key={initiative.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{initiative.title}</CardTitle>
                        <CardDescription>{initiative.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(initiative.priority)}>
                          {initiative.priority === 'High' ? (isArabic ? 'عالية' : 'High') :
                           initiative.priority === 'Medium' ? (isArabic ? 'متوسطة' : 'Medium') :
                           (isArabic ? 'منخفضة' : 'Low')}
                        </Badge>
                        <Badge variant={getStatusColor(initiative.status)} className="flex items-center gap-1">
                          {getStatusIcon(initiative.status)}
                          {getStatusText(initiative.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        {isArabic ? 'عرض التفاصيل' : 'View Details'}
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleStartInitiative(initiative.id)}
                      >
                        {initiative.status === 'ready' ? (isArabic ? 'بدء التنفيذ' : 'Start Implementation') :
                         initiative.status === 'planning' ? (isArabic ? 'بدء التخطيط' : 'Begin Planning') :
                         (isArabic ? 'متابعة' : 'Continue')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {isArabic ? 'رؤى الذكاء الاصطناعي' : 'AI Insights'}
            </CardTitle>
            <CardDescription>
              {isArabic ? 'تحليل وتوصيات مبنية على الذكاء الاصطناعي' : 'AI-powered analysis and recommendations'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">
                      {isArabic ? 'نمط محدد: فجوة في القيادة التحويلية' : 'Pattern Detected: Transformational Leadership Gap'}
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {isArabic ? 'يشير التحليل إلى وجود فجوة كبيرة في مهارات القيادة التحويلية. يُوصى بالبدء ببرنامج تطوير القيادة كأولوية قصوى.' : 'Analysis indicates a significant gap in transformational leadership skills. Recommend prioritizing leadership development program as immediate action.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">
                      {isArabic ? 'فرصة: الاستفادة من الثقافة العشائرية الحالية' : 'Opportunity: Leverage Current Clan Culture'}
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      {isArabic ? 'الثقافة العشائرية القوية الحالية توفر أساساً ممتازاً لتعزيز الأمان النفسي والتعاون. استخدم هذا كنقطة انطلاق.' : 'Strong existing clan culture provides excellent foundation for psychological safety and collaboration. Use this as launching point.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-900">
                      {isArabic ? 'تحذير: مقاومة محتملة للتغيير' : 'Caution: Potential Change Resistance'}
                    </h4>
                    <p className="text-sm text-orange-700 mt-1">
                      {isArabic ? 'مستويات الأمان النفسي المنخفضة قد تؤدي إلى مقاومة التغيير. يُنصح بالتركيز على بناء الثقة قبل تنفيذ تغييرات كبيرة.' : 'Lower psychological safety levels may lead to change resistance. Recommend focusing on trust-building before implementing major changes.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FeatureGate>
  );
};

export default Playbook;