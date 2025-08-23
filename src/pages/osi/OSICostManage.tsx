import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocale, formatNumber } from "@/i18n/locale";
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Calculator
} from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface OSIData {
  cost_total: number;
  cost_to_manage: number;
  manager_overload_n: number;
  headcount: number;
  managers: number;
}

interface CostTrendData {
  month: string;
  cost_to_manage: number;
  target: number;
}

interface OSICostManageProps {
  caseId: string;
}

export const OSICostManage = ({ caseId }: OSICostManageProps) => {
  const [data, setData] = useState<OSIData | null>(null);
  const [trendData, setTrendData] = useState<CostTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { locale, t } = useLocale();

  useEffect(() => {
    fetchCostData();
  }, [caseId]);

  const fetchCostData = async () => {
    try {
      setLoading(true);
      
      const { data: osiData, error } = await supabase
        .rpc('osi_get_overview_v1', { p_case_id: caseId });

      if (error) throw error;
      setData(osiData as unknown as OSIData);

      // Mock trend data - would come from historical snapshots
      const mockTrend: CostTrendData[] = [
        { month: 'يناير', cost_to_manage: 18.5, target: 15 },
        { month: 'فبراير', cost_to_manage: 17.8, target: 15 },
        { month: 'مارس', cost_to_manage: 17.2, target: 15 },
        { month: 'أبريل', cost_to_manage: 16.8, target: 15 },
        { month: 'مايو', cost_to_manage: 16.4, target: 15 },
        { month: 'يونيو', cost_to_manage: (osiData as any)?.cost_to_manage || 16, target: 15 },
      ];
      
      setTrendData(mockTrend);

    } catch (error) {
      console.error('Error fetching cost data:', error);
      toast({
        title: "خطأ في البيانات",
        description: "فشل في تحميل بيانات تكلفة الإدارة",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateSavings = () => {
    if (!data) return 0;
    const targetRate = 15; // 15% target
    const currentRate = data.cost_to_manage;
    if (currentRate <= targetRate) return 0;
    
    const savingsRate = (currentRate - targetRate) / 100;
    return Math.round(data.cost_total * savingsRate);
  };

  const getCostStatus = (current: number, target: number) => {
    if (current <= target) return { status: "مثالي", color: "success", icon: CheckCircle };
    if (current <= target * 1.1) return { status: "مقبول", color: "warning", icon: AlertTriangle };
    return { status: "مرتفع", color: "destructive", icon: AlertTriangle };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">جاري تحميل بيانات التكاليف...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">لا توجد بيانات تكلفة متاحة</p>
      </div>
    );
  }

  const targetRate = 15;
  const costStatus = getCostStatus(data.cost_to_manage, targetRate);
  const savings = calculateSavings();
  const StatusIcon = costStatus.icon;

  return (
    <div className="space-y-6" key={locale}>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">نسبة تكلفة الإدارة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold text-${costStatus.color}`}>
              {data.cost_to_manage.toFixed(1)}%
            </div>
            <div className="flex items-center gap-1 mt-1">
              <StatusIcon className={`h-3 w-3 text-${costStatus.color}`} />
              <span className={`text-xs text-${costStatus.color}`}>{costStatus.status}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">النسبة المستهدفة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{targetRate}%</div>
            <p className="text-xs text-muted-foreground">معيار أفضل الممارسات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التكلفة الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {data.cost_total.toLocaleString()} ريال
            </div>
            <p className="text-xs text-muted-foreground">للموظفين النشطين</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">الوفورات المحتملة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${savings > 0 ? 'text-success' : 'text-muted-foreground'}`}>
              {savings > 0 ? `${savings.toLocaleString()} ريال` : 'لا توجد'}
            </div>
            <p className="text-xs text-muted-foreground">شهرياً عند الوصول للهدف</p>
          </CardContent>
        </Card>
      </div>

      {/* Cost to Manage Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            اتجاه تكلفة الإدارة
          </CardTitle>
          <CardDescription>
            تطور نسبة تكلفة الإدارة خلال الأشهر الماضية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis domain={[12, 20]} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-semibold">{label}</p>
                          <p className="text-primary">
                            تكلفة الإدارة: {payload[0].value}%
                          </p>
                          <p className="text-muted-foreground">
                            الهدف: {payload[1]?.value}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={15} stroke="hsl(var(--success))" strokeDasharray="5 5" />
                <Line 
                  type="monotone" 
                  dataKey="cost_to_manage" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            الخط المتقطع يمثل النسبة المستهدفة (15%)
          </div>
        </CardContent>
      </Card>

      {/* Cost Analysis Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">تحليل التكلفة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>تكلفة المدراء الشهرية</span>
              <span className="font-semibold text-primary">
                {Math.round(data.cost_total * (data.cost_to_manage / 100)).toLocaleString()} ريال
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>تكلفة الموظفين العاديين</span>
              <span className="font-semibold text-primary">
                {Math.round(data.cost_total * (1 - data.cost_to_manage / 100)).toLocaleString()} ريال
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>متوسط تكلفة المدير</span>
              <span className="font-semibold text-primary">
                {data.managers > 0 ? 
                  Math.round((data.cost_total * (data.cost_to_manage / 100)) / data.managers).toLocaleString() : 0
                } ريال
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>متوسط تكلفة الموظف</span>
              <span className="font-semibold text-primary">
                {Math.round(data.cost_total / data.headcount).toLocaleString()} ريال
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">فرص التحسين</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {savings > 0 ? (
              <>
                <div className="p-4 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-success" />
                    <span className="font-semibold text-success">وفورات محتملة</span>
                  </div>
                  <div className="text-2xl font-bold text-success mb-1">
                    {savings.toLocaleString()} ريال شهرياً
                  </div>
                  <div className="text-lg font-semibold text-success">
                    {(savings * 12).toLocaleString()} ريال سنوياً
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <h4 className="font-semibold">التوصيات:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• إعادة توزيع نطاقات الإدارة</li>
                    <li>• دمج الأدوار المكررة</li>
                    <li>• تحسين الهيكل التنظيمي</li>
                    <li>• تقليل طبقات الإدارة</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="p-4 bg-success/10 rounded-lg text-center">
                <CheckCircle className="h-8 w-8 mx-auto text-success mb-2" />
                <div className="font-semibold text-success mb-1">ممتاز!</div>
                <p className="text-sm text-muted-foreground">
                  تكلفة الإدارة ضمن النطاق المستهدف
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Benchmark Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            مقارنة بالمعايير القياسية
          </CardTitle>
          <CardDescription>
            مقارنة أداء منظمتك بمعايير القطاع في المملكة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">الشركات الصغيرة</div>
              <div className="text-lg font-bold text-muted-foreground">12-15%</div>
              <Progress value={data.cost_to_manage > 15 ? 100 : (data.cost_to_manage / 15) * 100} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">الشركات المتوسطة</div>
              <div className="text-lg font-bold text-warning">15-18%</div>
              <Progress value={data.cost_to_manage > 18 ? 100 : (data.cost_to_manage / 18) * 100} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">الشركات الكبيرة</div>
              <div className="text-lg font-bold text-destructive">18%+</div>
              <Progress value={data.cost_to_manage > 20 ? 100 : (data.cost_to_manage / 20) * 100} className="mt-2" />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold">منظمتك:</span>
              <div className="flex items-center gap-2">
                <Badge variant={data.cost_to_manage <= 15 ? "default" : data.cost_to_manage <= 18 ? "secondary" : "destructive"}>
                  {data.cost_to_manage.toFixed(1)}%
                </Badge>
                {data.cost_to_manage <= 15 ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>خطة العمل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.cost_to_manage > 18 && (
              <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <div className="font-semibold text-destructive">أولوية عالية</div>
                  <div className="text-sm text-muted-foreground">
                    تقليل طبقات الإدارة وإعادة هيكلة النطاقات
                  </div>
                </div>
              </div>
            )}
            
            {data.manager_overload_n > 0 && (
              <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                <div>
                  <div className="font-semibold text-warning">أولوية متوسطة</div>
                  <div className="text-sm text-muted-foreground">
                    إعادة توزيع أعباء العمل على {data.manager_overload_n} مدير محمل بأعباء زائدة
                  </div>
                </div>
              </div>
            )}
            
            {data.cost_to_manage <= 15 && (
              <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-success shrink-0" />
                <div>
                  <div className="font-semibold text-success">الأداء ممتاز</div>
                  <div className="text-sm text-muted-foreground">
                    الحفاظ على الكفاءة الحالية ومراقبة التغييرات
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};