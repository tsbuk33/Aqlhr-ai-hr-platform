import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  BookOpen, 
  Play,
  CheckSquare,
  Clock,
  User,
  Target,
  TrendingUp,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

interface Initiative {
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  estimated_impact: string;
  timeline: string;
  owner_role: string;
  metrics: string[];
}

interface PlaybookData {
  id: string;
  ai_summary: string;
  initiatives: Initiative[];
  confidence: number;
  status: string;
  created_at: string;
}

interface OSIPlaybookProps {
  caseId: string;
}

export const OSIPlaybook = ({ caseId }: OSIPlaybookProps) => {
  const [playbook, setPlaybook] = useState<PlaybookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlaybook();
  }, [caseId]);

  const fetchPlaybook = async () => {
    try {
      setLoading(true);
      const { data: playbookData, error } = await supabase
        .from('dx_playbooks')
        .select('*')
        .eq('case_id', caseId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setPlaybook(playbookData as unknown as PlaybookData);
    } catch (error) {
      console.error('Error fetching playbook:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePlaybook = async () => {
    try {
      setGenerating(true);
      const { data: result, error } = await supabase.functions.invoke('osi-run-v1', {
        body: { caseId }
      });

      if (error) throw error;
      
      toast({
        title: "تم إنشاء الدليل",
        description: "تم إنشاء دليل العمل بنجاح",
      });
      
      await fetchPlaybook();
    } catch (error) {
      console.error('Error generating playbook:', error);
      toast({
        title: "فشل إنشاء الدليل",
        description: "فشل في إنشاء دليل العمل",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const createTasks = async () => {
    if (!playbook?.initiatives) return;
    
    try {
      const tasks = playbook.initiatives.map(initiative => ({
        case_id: caseId,
        title: initiative.title,
        description: initiative.description,
        priority: initiative.priority,
        owner_role: initiative.owner_role,
        estimated_timeline: initiative.timeline,
        status: 'pending'
      }));

      // Create tasks in the task center
      for (const task of tasks) {
        await supabase.rpc('task_create_v1', {
          p_tenant_id: (await supabase.rpc('get_demo_tenant_id')).data,
          p_module: 'OSI',
          p_title: task.title,
          p_description: task.description,
          p_priority: task.priority,
          p_owner_role: task.owner_role,
          p_metadata: { 
            timeline: task.estimated_timeline,
            source: 'osi_playbook'
          }
        });
      }

      toast({
        title: "تم إنشاء المهام",
        description: `تم إنشاء ${tasks.length} مهمة في مركز المهام`,
      });
    } catch (error) {
      console.error('Error creating tasks:', error);
      toast({
        title: "خطأ في إنشاء المهام",
        description: "فشل في إنشاء المهام",
        variant: "destructive"
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل';
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return priority;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">جاري تحميل دليل العمل...</div>
      </div>
    );
  }

  if (!playbook) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            دليل العمل التنظيمي
          </CardTitle>
          <CardDescription>
            دليل مدعوم بالذكاء الاصطناعي للتحسينات التنظيمية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا يوجد دليل عمل</h3>
            <p className="text-muted-foreground mb-4">
              إنشاء دليل عمل ذكي بناءً على تحليل الهيكل التنظيمي
            </p>
            <Button onClick={generatePlaybook} disabled={generating}>
              <Play className="h-4 w-4 mr-2" />
              {generating ? "جاري الإنشاء..." : "إنشاء دليل العمل"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Playbook Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              دليل العمل التنظيمي
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">مستوى الثقة:</span>
              <Progress value={playbook.confidence * 100} className="w-20" />
              <span className="text-sm font-semibold">{Math.round(playbook.confidence * 100)}%</span>
            </div>
          </CardTitle>
          <CardDescription>
            تم إنشاؤه بتاريخ {new Date(playbook.created_at).toLocaleDateString('ar-SA')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line text-muted-foreground">
              {playbook.ai_summary}
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={generatePlaybook} disabled={generating} variant="outline">
              <Play className="h-4 w-4 mr-2" />
              {generating ? "جاري التحديث..." : "تحديث الدليل"}
            </Button>
            <Button onClick={createTasks} variant="default">
              <CheckSquare className="h-4 w-4 mr-2" />
              إنشاء مهام
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Initiatives */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Target className="h-5 w-5" />
          المبادرات الموصى بها ({playbook.initiatives?.length || 0})
        </h2>
        
        {playbook.initiatives?.map((initiative, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">
                    {initiative.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {initiative.description}
                  </CardDescription>
                </div>
                <Badge variant={getPriorityColor(initiative.priority)}>
                  {getPriorityText(initiative.priority)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">التأثير المتوقع</div>
                    <div className="text-muted-foreground">{initiative.estimated_impact}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">الجدول الزمني</div>
                    <div className="text-muted-foreground">{initiative.timeline}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">المسؤول</div>
                    <div className="text-muted-foreground">{initiative.owner_role}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">المؤشرات</div>
                    <div className="text-muted-foreground">
                      {initiative.metrics.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="mt-4 pt-3 border-t">
                <Button variant="outline" size="sm" className="w-full justify-between">
                  <span>عرض التفاصيل</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};