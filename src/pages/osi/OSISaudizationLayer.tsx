import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocale, formatNumber } from "@/i18n/locale";
import { 
  Users, 
  TrendingUp, 
  Target,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface LayerData {
  layer: number;
  total: number;
  saudi: number;
  non_saudi: number;
  saudization_rate: number;
  is_compliant: boolean;
}

interface OSISaudizationLayerProps {
  caseId: string;
}

export const OSISaudizationLayer = ({ caseId }: OSISaudizationLayerProps) => {
  const [layerData, setLayerData] = useState<LayerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallSaudization, setOverallSaudization] = useState(0);
  const { toast } = useToast();
  const { locale, t } = useLocale();

  useEffect(() => {
    fetchSaudizationData();
  }, [caseId]);

  const fetchSaudizationData = async () => {
    try {
      setLoading(true);
      
      // Get OSI overview for overall saudization
      const { data: overview, error: overviewError } = await supabase
        .rpc('osi_get_overview_v1', { p_tenant: caseId });

      if (overviewError) throw overviewError;
      
      if (overview) {
        setOverallSaudization((overview as any).saudization || 0);
      }

      // Mock layer data - in real implementation would come from database
      const mockLayerData: LayerData[] = [
        { layer: 1, total: 5, saudi: 3, non_saudi: 2, saudization_rate: 60, is_compliant: true },
        { layer: 2, total: 12, saudi: 7, non_saudi: 5, saudization_rate: 58.3, is_compliant: true },
        { layer: 3, total: 35, saudi: 18, non_saudi: 17, saudization_rate: 51.4, is_compliant: true },
        { layer: 4, total: 85, saudi: 32, non_saudi: 53, saudization_rate: 37.6, is_compliant: false },
        { layer: 5, total: 156, saudi: 89, non_saudi: 67, saudization_rate: 57.1, is_compliant: true },
        { layer: 6, total: 89, saudi: 78, non_saudi: 11, saudization_rate: 87.6, is_compliant: true },
      ];

      setLayerData(mockLayerData);

    } catch (error) {
      console.error('Error fetching saudization data:', error);
      toast({
        title: "خطأ في البيانات",
        description: "فشل في تحميل بيانات السعودة بالطبقات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 50) return "#22c55e"; // success
    if (rate >= 40) return "#f59e0b"; // warning
    return "#ef4444"; // destructive
  };

  const chartData = layerData.map(layer => ({
    layer: `الطبقة ${layer.layer}`,
    saudi: layer.saudi,
    non_saudi: layer.non_saudi,
    rate: layer.saudization_rate,
    total: layer.total
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">جاري تحميل بيانات السعودة...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" key={locale}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">نسبة السعودة الإجمالية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{overallSaudization}%</div>
            <Progress value={overallSaudization} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">الطبقات المتوافقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {layerData.filter(l => l.is_compliant).length}
            </div>
            <p className="text-xs text-muted-foreground">من أصل {layerData.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">أعلى طبقة سعودة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {layerData.length > 0 ? 
                Math.max(...layerData.map(l => l.saudization_rate)).toFixed(1) : 0
              }%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">الطبقات الحرجة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {layerData.filter(l => !l.is_compliant).length}
            </div>
            <p className="text-xs text-muted-foreground">أقل من 40%</p>
          </CardContent>
        </Card>
      </div>

      {/* Saudization by Layer Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            توزيع السعودة حسب الطبقات
          </CardTitle>
          <CardDescription>
            نسبة السعوديين وغير السعوديين في كل طبقة تنظيمية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="layer" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-semibold">{label}</p>
                          <p className="text-success">سعوديون: {data.saudi}</p>
                          <p className="text-muted-foreground">غير سعوديين: {data.non_saudi}</p>
                          <p className="font-medium">نسبة السعودة: {data.rate.toFixed(1)}%</p>
                          <p className="text-sm">الإجمالي: {data.total}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="saudi" name="سعوديون" fill="hsl(var(--success))" />
                <Bar dataKey="non_saudi" name="غير سعوديين" fill="hsl(var(--muted))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Layer Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            تفاصيل السعودة بالطبقات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {layerData.map((layer) => (
              <div key={layer.layer} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">الطبقة {layer.layer}</div>
                    <div className="text-xs text-muted-foreground">{layer.total} موظف</div>
                  </div>
                  
                  <div className="w-32">
                    <Progress 
                      value={layer.saudization_rate} 
                      className="h-3" 
                    />
                    <div className="text-xs text-center mt-1">
                      {layer.saudization_rate.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <div className="text-success font-medium">{layer.saudi} سعودي</div>
                    <div className="text-muted-foreground">{layer.non_saudi} غير سعودي</div>
                  </div>
                  
                  {layer.is_compliant ? (
                    <div className="flex items-center gap-1 text-success">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs">متوافق</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-xs">غير متوافق</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص الامتثال</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-success mb-2">الطبقات المتوافقة</h4>
              <div className="space-y-2">
                {layerData.filter(l => l.is_compliant).map(layer => (
                  <div key={layer.layer} className="flex justify-between text-sm">
                    <span>الطبقة {layer.layer}</span>
                    <span className="text-success">{layer.saudization_rate.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-destructive mb-2">الطبقات غير المتوافقة</h4>
              <div className="space-y-2">
                {layerData.filter(l => !l.is_compliant).map(layer => (
                  <div key={layer.layer} className="flex justify-between text-sm">
                    <span>الطبقة {layer.layer}</span>
                    <span className="text-destructive">{layer.saudization_rate.toFixed(1)}%</span>
                  </div>
                ))}
                {layerData.filter(l => !l.is_compliant).length === 0 && (
                  <div className="text-sm text-muted-foreground">جميع الطبقات متوافقة</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};