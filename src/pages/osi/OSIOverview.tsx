import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useEntitlement } from "@/hooks/useEntitlement";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  TrendingUp, 
  Layers, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  FileText,
  BarChart3,
  Target
} from "lucide-react";
import { useState, useEffect } from "react";

interface OSIData {
  tenant_id: string;
  headcount: number;
  managers: number;
  span_avg: number;
  span_p90: number;
  layers_depth: number;
  saudization: number;
  female_pct: number;
  cost_total: number;
  cost_to_manage: number;
  manager_overload_n: number;
  duplicate_titles_n: number;
  vacant_positions_n: number;
  flags: string[];
  org_health_score: number;
  created_at: string;
}

interface OSIOverviewProps {
  caseId: string;
}

export const OSIOverview = ({ caseId }: OSIOverviewProps) => {
  const [data, setData] = useState<OSIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  const { hasEntitlement } = useEntitlement('SKU_OSI');

  useEffect(() => {
    fetchOSIData();
  }, [caseId]);

  const fetchOSIData = async () => {
    try {
      setLoading(true);
      const { data: osiData, error } = await supabase
        .rpc('osi_get_overview_v1', { p_case_id: caseId });

      if (error) throw error;
      setData(osiData as unknown as OSIData);
    } catch (error) {
      console.error('Error fetching OSI data:', error);
      toast({
        title: "خطأ في البيانات",
        description: "فشل في تحميل بيانات التحليل التنظيمي",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runOSIAnalysis = async () => {
    if (!hasEntitlement) {
      toast({
        title: "الترقية مطلوبة",
        description: "تحليل OSI يتطلب الوصول لخطة المؤسسة",
        variant: "destructive"
      });
      return;
    }

    try {
      setGenerating(true);
      const { data: result, error } = await supabase.functions.invoke('osi-run-v1', {
        body: { caseId }
      });

      if (error) throw error;
      
      toast({
        title: "اكتمل التحليل",
        description: "تم إنشاء تحليل OSI بنجاح",
      });
      
      await fetchOSIData();
    } catch (error) {
      console.error('Error running OSI analysis:', error);
      toast({
        title: "فشل التحليل",
        description: "فشل في إنشاء تحليل OSI",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getSeverityColor = (flag: string) => {
    if (['DEEP_LAYERS', 'HIGH_COST_TO_MANAGE'].includes(flag)) return 'destructive';
    return 'secondary';
  };

  const getFlagDescription = (flag: string) => {
    const descriptions = {
      'OVER_SPAN': 'نطاقات الإدارة تتجاوز أفضل الممارسات',
      'DEEP_LAYERS': 'عدد كبير جداً من الطبقات التنظيمية',
      'LOW_SAUDI_LAYER': 'نسبة سعودة منخفضة في المناصب الإدارية',
      'HIGH_COST_TO_MANAGE': 'نسبة عالية لتكلفة الإدارة',
      'DUP_ROLE_TITLES': 'اكتشاف مسميات وظيفية مكررة'
    };
    return descriptions[flag as keyof typeof descriptions] || flag;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">جاري تحميل البيانات التنظيمية...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            ذكاء الهيكل التنظيمي
          </CardTitle>
          <CardDescription>
            تحليل الهيكل التنظيمي للكفاءة والامتثال
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا يوجد تحليل متاح</h3>
            <p className="text-muted-foreground mb-4">
              قم بتشغيل أول تحليل OSI للحصول على رؤى حول هيكلك التنظيمي
            </p>
            <Button onClick={runOSIAnalysis} disabled={generating}>
              <PlayCircle className="h-4 w-4 mr-2" />
              {generating ? "جاري التحليل..." : "تشغيل تحليل OSI"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const healthScore = data.org_health_score || 85;

  return (
    <div className="space-y-6">
      {/* Health Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            نقاط الصحة التنظيمية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${getHealthColor(healthScore)}`}>
              {healthScore}/100
            </div>
            <div className="flex-1">
              <Progress value={healthScore} className="h-3" />
              <p className="text-sm text-muted-foreground mt-1">
                {healthScore >= 85 ? "ممتاز" : 
                 healthScore >= 70 ? "جيد" : 
                 healthScore >= 50 ? "يحتاج تحسين" : "حرج"}
              </p>
            </div>
            <Button onClick={runOSIAnalysis} disabled={generating} variant="outline">
              <PlayCircle className="h-4 w-4 mr-2" />
              {generating ? "جاري التحديث..." : "تحديث"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              إجمالي الموظفين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.headcount}</div>
            <p className="text-xs text-muted-foreground">الموظفون النشطون</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              متوسط نطاق الإدارة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.span_avg}</div>
            <p className="text-xs text-muted-foreground">
              الهدف: 7 | P90: {data.span_p90}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Layers className="h-4 w-4" />
              طبقات التنظيم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.layers_depth}</div>
            <p className="text-xs text-muted-foreground">
              الهدف: ≤6 طبقات
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              تكلفة الإدارة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.cost_to_manage}%</div>
            <p className="text-xs text-muted-foreground">
              الهدف: 12-18%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">الديموغرافيا التنظيمية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>نسبة السعودة</span>
              <div className="flex items-center gap-2">
                <Progress value={data.saudization} className="w-20 h-2" />
                <span className="font-semibold text-primary">{data.saudization}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>نسبة الإناث</span>
              <div className="flex items-center gap-2">
                <Progress value={data.female_pct} className="w-20 h-2" />
                <span className="font-semibold text-primary">{data.female_pct}%</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>إجمالي المدراء</span>
              <span className="font-semibold">{data.managers}</span>
            </div>
            <div className="flex justify-between">
              <span>المدراء المُحمّلون بأعباء زائدة</span>
              <Badge variant={data.manager_overload_n > 0 ? "destructive" : "secondary"}>
                {data.manager_overload_n}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">مشاكل الهيكل</CardTitle>
          </CardHeader>
          <CardContent>
            {data.flags && data.flags.length > 0 ? (
              <div className="space-y-3">
                {data.flags.map((flag, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                    <div className="flex-1">
                      <Badge variant={getSeverityColor(flag)} className="mb-1">
                        {flag}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {getFlagDescription(flag)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-success p-4 bg-success/10 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">لم يتم اكتشاف مشاكل حرجة</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">الإجراءات المتاحة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              إنشاء تقرير
            </Button>
            <Button variant="outline" className="justify-start">
              <Layers className="h-4 w-4 mr-2" />
              عرض الهيكل التنظيمي
            </Button>
            <Button variant="outline" className="justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              تحليل التكاليف
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};