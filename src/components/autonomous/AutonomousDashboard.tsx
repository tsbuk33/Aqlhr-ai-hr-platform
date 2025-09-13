import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAutonomousAgent } from '@/hooks/useAutonomousAgent';
import { 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Shield, 
  Zap,
  Brain,
  Clock,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AutonomousDashboard: React.FC = () => {
  const { status, loading, error, actions } = useAutonomousAgent();
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAutonomousAction = async (actionName: string, actionFn: () => Promise<{ success: boolean; message: string }>) => {
    setActionLoading(actionName);
    try {
      const result = await actionFn();
      toast({
        title: result.success ? "نجح العمل الذاتي" : "فشل العمل الذاتي",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (err) {
      toast({
        title: "خطأ في النظام",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getNitaqatColor = (level: string) => {
    switch (level) {
      case 'red': return 'bg-destructive text-destructive-foreground';
      case 'yellow': return 'bg-yellow-500 text-white';
      case 'green': return 'bg-green-500 text-white';
      case 'premium': return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">تحميل النظام الذكي...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">لوحة التحكم الذكية</h1>
          <p className="text-muted-foreground">نظام AqlHR الذكي للإدارة الذاتية</p>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg ${
            status.agentActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <Activity className={`h-4 w-4 ${status.agentActive ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-medium">
              {status.agentActive ? 'النظام نشط' : 'النظام متوقف'}
            </span>
          </div>
        </div>
      </div>

      {/* Agent Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نسبة السعودة</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.saudiCompliance.saudizationRatio}%</div>
            <Progress value={status.saudiCompliance.saudizationRatio} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              مستوى النطاقات: 
              <Badge className={`ml-2 ${getNitaqatColor(status.saudiCompliance.nitaqatLevel)}`}>
                {status.saudiCompliance.nitaqatLevel}
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">امتثال GOSI</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status.saudiCompliance.gosiStatus ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {status.saudiCompliance.gosiStatus ? 'متوافق' : 'غير متوافق'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حالة قوى</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge className={
                status.saudiCompliance.qiwaStatus === 'compliant' ? 'bg-green-500' :
                status.saudiCompliance.qiwaStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }>
                {status.saudiCompliance.qiwaStatus === 'compliant' ? 'متوافق' :
                 status.saudiCompliance.qiwaStatus === 'warning' ? 'تحذير' : 'مخالف'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              متزامن مع منصة قوى
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التحديثات المباشرة</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.realTimeUpdates.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              آخر تحديث: منذ دقائق
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Autonomous Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <Brain className="h-5 w-5" />
            <span>الإجراءات الذكية</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => handleAutonomousAction('saudization', actions.optimizeSaudization)}
              disabled={actionLoading === 'saudization'}
              className="h-20 flex flex-col items-center justify-center space-y-2"
            >
              <Users className="h-6 w-6" />
              <span>تحسين السعودة</span>
              {actionLoading === 'saudization' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
            </Button>

            <Button
              onClick={() => handleAutonomousAction('compliance', actions.runComplianceCheck)}
              disabled={actionLoading === 'compliance'}
              className="h-20 flex flex-col items-center justify-center space-y-2"
              variant="outline"
            >
              <Shield className="h-6 w-6" />
              <span>فحص الامتثال</span>
              {actionLoading === 'compliance' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              )}
            </Button>

            <Button
              onClick={() => handleAutonomousAction('report', actions.generateExecutiveReport)}
              disabled={actionLoading === 'report'}
              className="h-20 flex flex-col items-center justify-center space-y-2"
              variant="secondary"
            >
              <BarChart3 className="h-6 w-6" />
              <span>تقرير تنفيذي</span>
              {actionLoading === 'report' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Clock className="h-5 w-5" />
              <span>التحديثات المباشرة</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {status.realTimeUpdates.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  لا توجد تحديثات حالياً
                </p>
              ) : (
                status.realTimeUpdates.map((update) => (
                  <div key={update.id} className="flex items-start space-x-3 rtl:space-x-reverse p-3 rounded-lg bg-muted/50">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      update.status === 'completed' ? 'bg-green-500' :
                      update.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{update.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {update.module} • {update.timestamp.toLocaleTimeString('ar-SA')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Executive Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Brain className="h-5 w-5" />
              <span>الرؤى التنفيذية</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {status.executiveInsights.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  لا توجد رؤى متاحة
                </p>
              ) : (
                status.executiveInsights.map((insight) => (
                  <div key={insight.id} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold">{insight.title}</h4>
                      <Badge className={getPriorityColor(insight.priority)}>
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {insight.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>دقة: {Math.round(insight.confidence * 100)}%</span>
                      <Badge variant="outline">{insight.category}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutonomousDashboard;