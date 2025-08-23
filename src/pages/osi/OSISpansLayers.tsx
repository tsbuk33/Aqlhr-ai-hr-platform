import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocale, formatNumber } from "@/i18n/locale";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Filter
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ManagerSpan {
  manager_id: string;
  span: number;
  target_span: number;
  overload: boolean;
  full_name_en: string;
  grade_name: string;
}

interface OSISpansLayersProps {
  caseId: string;
}

export const OSISpansLayers = ({ caseId }: OSISpansLayersProps) => {
  const [managerSpans, setManagerSpans] = useState<ManagerSpan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const { toast } = useToast();
  const { locale, t } = useLocale();

  useEffect(() => {
    fetchSpansData();
  }, [caseId]);

  const fetchSpansData = async () => {
    try {
      setLoading(true);
      
      // Get manager spans data
      const { data: spansData, error: spansError } = await supabase
        .from('v_manager_spans')
        .select('*')
        .order('span', { ascending: false });

      if (spansError) throw spansError;
      setManagerSpans(spansData || []);

    } catch (error) {
      console.error('Error fetching spans data:', error);
      toast({
        title: "خطأ في البيانات",
        description: "فشل في تحميل بيانات النطاقات والطبقات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSpans = managerSpans.filter(span => {
    if (filterDept !== 'all' && filterGrade !== 'all') {
      // Both filters applied - this would need additional data
      return true;
    }
    return true;
  });

  const getSpanStatusColor = (span: number, target: number) => {
    if (span <= target) return "text-success";
    if (span <= target * 1.2) return "text-warning";
    return "text-destructive";
  };

  const getSpanStatus = (span: number, target: number) => {
    if (span <= target) return "مثالي";
    if (span <= target * 1.2) return "مقبول";
    return "محمل زائد";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">جاري تحميل بيانات النطاقات...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" key={locale}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المدراء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{managerSpans.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">المحملون بأعباء زائدة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {managerSpans.filter(m => m.overload).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">متوسط النطاق</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {managerSpans.length > 0 ? 
                Math.round(managerSpans.reduce((sum, m) => sum + m.span, 0) / managerSpans.length) : 0
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">النطاق الأقصى</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {managerSpans.length > 0 ? Math.max(...managerSpans.map(m => m.span)) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            تصفية البيانات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="اختر القسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأقسام</SelectItem>
                <SelectItem value="operations">العمليات</SelectItem>
                <SelectItem value="support">الدعم</SelectItem>
                <SelectItem value="management">الإدارة</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterGrade} onValueChange={setFilterGrade}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="اختر الدرجة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الدرجات</SelectItem>
                <SelectItem value="L1">L1</SelectItem>
                <SelectItem value="L2">L2</SelectItem>
                <SelectItem value="L3">L3</SelectItem>
                <SelectItem value="L4">L4</SelectItem>
                <SelectItem value="L5">L5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Manager Spans Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            تحليل نطاقات المدراء
          </CardTitle>
          <CardDescription>
            تفاصيل نطاقات الإدارة والأحمال الزائدة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المدير</TableHead>
                  <TableHead>الدرجة</TableHead>
                  <TableHead className="text-center">النطاق الحالي</TableHead>
                  <TableHead className="text-center">النطاق المستهدف</TableHead>
                  <TableHead className="text-center">الحالة</TableHead>
                  <TableHead className="text-center">المؤشر</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpans.map((manager) => (
                  <TableRow key={manager.manager_id}>
                    <TableCell className="font-medium">
                      {manager.full_name_en || 'مدير غير معروف'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{manager.grade_name}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`font-bold ${getSpanStatusColor(manager.span, manager.target_span)}`}>
                        {manager.span}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">{manager.target_span}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={manager.overload ? "destructive" : "secondary"}>
                        {getSpanStatus(manager.span, manager.target_span)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="w-16">
                        <Progress 
                          value={Math.min((manager.span / manager.target_span) * 100, 150)} 
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Layer Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            تحليل الطبقات التنظيمية
          </CardTitle>
          <CardDescription>
            توزيع الموظفين عبر مستويات التنظيم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              رسم بياني تفاعلي للطبقات قريباً
            </p>
            <div className="mt-4 text-sm space-y-2">
              <div className="flex justify-between">
              <span>إجمالي الطبقات:</span>
                <Badge variant="secondary">
                  6</Badge>
              </div>
              <div className="flex justify-between">
                <span>الهدف المثالي:</span>
                <span className="text-muted-foreground">≤6 طبقات</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};