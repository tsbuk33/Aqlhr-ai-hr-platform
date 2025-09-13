import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Brain, 
  Shield, 
  Activity, 
  CheckCircle,
  AlertTriangle,
  Rocket
} from 'lucide-react';
import { useMasterOrchestrator } from '@/hooks/useMasterOrchestrator';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useToast } from '@/hooks/use-toast';

const MasterAgentActivator: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const isArabic = language === 'ar';
  
  const {
    isRunning,
    loading,
    systemStatus,
    totalModules,
    activeModules,
    isHealthy,
    isCompliant,
    startOrchestration,
    stopOrchestration,
    executeComplianceCheck
  } = useMasterOrchestrator();

  const [activating, setActivating] = useState(false);

  const handleActivate = async () => {
    setActivating(true);
    
    try {
      const result = await startOrchestration();
      
      if (result.success) {
        toast({
          title: isArabic ? "🤖 تم تفعيل الذكاء الاصطناعي الرئيسي" : "🤖 Master AI Agent Activated",
          description: isArabic 
            ? "نظام التحكم الذاتي نشط ويدير 109+ وظيفة ذكية و 21 نظام حكومي"
            : "Autonomous control system active, managing 109+ AI functions & 21 government systems",
        });
      } else {
        toast({
          variant: "destructive",
          title: isArabic ? "❌ فشل التفعيل" : "❌ Activation Failed",
          description: result.error || (isArabic ? "حدث خطأ في تفعيل النظام" : "Failed to activate the system"),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: isArabic ? "❌ خطأ في النظام" : "❌ System Error",
        description: isArabic ? "حدث خطأ غير متوقع" : "An unexpected error occurred",
      });
    } finally {
      setActivating(false);
    }
  };

  const handleDeactivate = () => {
    const result = stopOrchestration();
    
    if (result.success) {
      toast({
        title: isArabic ? "🛑 تم إيقاف النظام" : "🛑 System Deactivated",
        description: isArabic ? "تم إيقاف النظام الذاتي بأمان" : "Autonomous system safely deactivated",
      });
    }
  };

  const handleComplianceCheck = async () => {
    const result = await executeComplianceCheck();
    
    if (result.success) {
      toast({
        title: isArabic ? "✅ فحص الامتثال مكتمل" : "✅ Compliance Check Complete",
        description: isArabic ? "جميع الأنظمة الحكومية متوافقة" : "All government systems compliant",
      });
    } else {
      toast({
        variant: "destructive",
        title: isArabic ? "⚠️ مشكلة في الامتثال" : "⚠️ Compliance Issue",
        description: result.error || (isArabic ? "تم العثور على مشاكل في الامتثال" : "Compliance issues detected"),
      });
    }
  };

  if (loading) {
    return (
      <Card className="border-2 border-dashed border-primary/20">
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <Brain className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'تحميل النظام...' : 'Loading system...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5" dir={isArabic ? 'rtl' : 'ltr'}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-6 h-6 text-primary" />
            {isArabic ? 'الذكاء الاصطناعي الرئيسي' : 'Master AI Agent'}
          </CardTitle>
          <Badge 
            variant={isRunning ? "default" : "secondary"}
            className={isRunning ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {isRunning ? (
              <>
                <Activity className="w-3 h-3 mr-1 animate-pulse" />
                {isArabic ? 'نشط' : 'ACTIVE'}
              </>
            ) : (
              <>
                <Shield className="w-3 h-3 mr-1" />
                {isArabic ? 'معطل' : 'STANDBY'}
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* System Status */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{activeModules}</div>
            <div className="text-xs text-muted-foreground">
              {isArabic ? 'وحدات نشطة' : 'Active Modules'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-600">109+</div>
            <div className="text-xs text-muted-foreground">
              {isArabic ? 'وظائف ذكية' : 'AI Functions'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-purple-600">21</div>
            <div className="text-xs text-muted-foreground">
              {isArabic ? 'نظام حكومي' : 'Gov Systems'}
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-1">
            {isHealthy ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            )}
            <span className="text-xs">
              {isArabic ? 'صحة النظام' : 'System Health'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {isCompliant ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            )}
            <span className="text-xs">
              {isArabic ? 'الامتثال' : 'Compliance'}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          {!isRunning ? (
            <Button
              onClick={handleActivate}
              disabled={activating}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {activating ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  {isArabic ? 'جاري التفعيل...' : 'Activating...'}
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  {isArabic ? 'تفعيل النظام' : 'ACTIVATE'}
                </>
              )}
            </Button>
          ) : (
            <>
              <Button
                onClick={handleDeactivate}
                variant="destructive"
                className="flex-1"
              >
                <Shield className="w-4 h-4 mr-2" />
                {isArabic ? 'إيقاف' : 'STOP'}
              </Button>
              <Button
                onClick={handleComplianceCheck}
                variant="outline"
                size="sm"
              >
                <Zap className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Quick Status */}
        {isRunning && systemStatus && (
          <div className="text-center text-xs text-muted-foreground">
            {isArabic 
              ? `آخر تحديث: ${systemStatus.timestamp.toLocaleTimeString('ar-SA')}`
              : `Last update: ${systemStatus.timestamp.toLocaleTimeString()}`
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MasterAgentActivator;