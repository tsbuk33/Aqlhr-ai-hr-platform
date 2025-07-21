import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, TrendingUp, Shield, Target, Activity } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface AqlMindStatus {
  iqLevel: number;
  learningRate: number;
  decisionAccuracy: number;
  activeProcesses: number;
  decisionsPerMinute: number;
  patternsLearned: number;
  systemHealth: number;
  autonomousMode: boolean;
}

interface AICapability {
  name: string;
  status: 'active' | 'learning' | 'processing' | 'standby';
  confidence: number;
  lastUpdate: string;
}

export const AqlMindCore: React.FC = () => {
  const { toast } = useToast();
  const { isArabic } = useSimpleLanguage();
  const [mindStatus, setMindStatus] = useState<AqlMindStatus>({
    iqLevel: 167,
    learningRate: 87,
    decisionAccuracy: 98.7,
    activeProcesses: 47,
    decisionsPerMinute: 23,
    patternsLearned: 1247,
    systemHealth: 100,
    autonomousMode: true
  });

  const [aiCapabilities] = useState<AICapability[]>([
    { name: 'Data Understanding', status: 'active', confidence: 94, lastUpdate: '2 min ago' },
    { name: 'Pattern Recognition', status: 'learning', confidence: 89, lastUpdate: '1 min ago' },
    { name: 'Decision Making', status: 'active', confidence: 96, lastUpdate: '30 sec ago' },
    { name: 'Predictive Analysis', status: 'processing', confidence: 91, lastUpdate: '1 min ago' },
    { name: 'Compliance Monitoring', status: 'active', confidence: 99, lastUpdate: '45 sec ago' },
    { name: 'Risk Assessment', status: 'active', confidence: 93, lastUpdate: '1 min ago' }
  ]);

  const [recentDecisions] = useState([
    { id: 1, type: 'Workforce Optimization', confidence: 94, impact: 'High', status: 'Implemented' },
    { id: 2, type: 'Compliance Adjustment', confidence: 98, impact: 'Critical', status: 'Active' },
    { id: 3, type: 'Performance Prediction', confidence: 87, impact: 'Medium', status: 'Monitoring' },
    { id: 4, type: 'Resource Allocation', confidence: 92, impact: 'High', status: 'Pending' }
  ]);

  useEffect(() => {
    // Simulate real-time AI activity updates
    const interval = setInterval(() => {
      setMindStatus(prev => ({
        ...prev,
        iqLevel: prev.iqLevel + Math.random() * 0.1,
        learningRate: Math.min(100, prev.learningRate + Math.random() * 2),
        activeProcesses: Math.floor(40 + Math.random() * 20),
        decisionsPerMinute: Math.floor(20 + Math.random() * 10),
        patternsLearned: prev.patternsLearned + Math.floor(Math.random() * 3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'learning': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'standby': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Critical': return 'destructive';
      case 'High': return 'default';
      case 'Medium': return 'secondary';
      default: return 'outline';
    }
  };

  const initiateDeepLearning = () => {
    toast({
      title: isArabic ? "🧠 تم بدء التعلم العميق" : "🧠 Deep Learning Initiated",
      description: isArabic 
        ? "عقل HR يحلل أنماط جديدة ويحديث نماذج القرارات..."
        : "AqlMind is analyzing new patterns and updating decision models...",
    });
  };

  const toggleAutonomousMode = () => {
    setMindStatus(prev => ({ ...prev, autonomousMode: !prev.autonomousMode }));
    toast({
      title: mindStatus.autonomousMode 
        ? (isArabic ? "🤖 تم تفعيل الوضع اليدوي" : "🤖 Manual Mode Activated") 
        : (isArabic ? "🧠 تم تفعيل الوضع المستقل" : "🧠 Autonomous Mode Enabled"),
      description: mindStatus.autonomousMode 
        ? (isArabic ? "قرارات الذكاء الاصطناعي تتطلب موافقة يدوية" : "AI decisions require manual approval")
        : (isArabic ? "الذكاء الاصطناعي يتخذ قرارات مستقلة" : "AI is making autonomous decisions"),
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Brain Status Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="h-8 w-8 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {isArabic ? "نواة ذكاء عقل HR" : "AqlMind Intelligence Core"}
                </CardTitle>
                <p className="text-muted-foreground">{isArabic ? "نظام ذكاء اصطناعي للتعلم الذاتي • نشط منذ البداية" : "Self-Learning AI Ecosystem • Active Since Startup"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={mindStatus.autonomousMode ? "default" : "secondary"} className="px-3 py-1">
                {mindStatus.autonomousMode 
                  ? (isArabic ? "🤖 مستقل" : "🤖 AUTONOMOUS")
                  : (isArabic ? "👤 يدوي" : "👤 MANUAL")
                }
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                {isArabic ? "الذكاء" : "IQ"}: {mindStatus.iqLevel.toFixed(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{mindStatus.activeProcesses}</div>
              <div className="text-sm text-muted-foreground">{isArabic ? "العمليات النشطة" : "Active Processes"}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{mindStatus.decisionsPerMinute}</div>
              <div className="text-sm text-muted-foreground">{isArabic ? "القرارات/دقيقة" : "Decisions/Min"}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{mindStatus.patternsLearned.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{isArabic ? "الأنماط المتعلمة" : "Patterns Learned"}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{mindStatus.decisionAccuracy}%</div>
              <div className="text-sm text-muted-foreground">{isArabic ? "معدل الدقة" : "Accuracy Rate"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {isArabic ? "حالة قدرات الذكاء الاصطناعي" : "AI Capabilities Status"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiCapabilities.map((capability, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(capability.status)} animate-pulse`} />
                  <div>
                    <div className="font-medium">{capability.name}</div>
                    <div className="text-sm text-muted-foreground capitalize">{capability.status} • {capability.lastUpdate}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{capability.confidence}%</div>
                  <Progress value={capability.confidence} className="w-16 h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Health & Learning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {isArabic ? "التعلم والأداء" : "Learning & Performance"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{isArabic ? "معدل التعلم" : "Learning Rate"}</span>
                <span className="text-sm text-muted-foreground">{mindStatus.learningRate}%</span>
              </div>
              <Progress value={mindStatus.learningRate} className="h-3" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{isArabic ? "صحة النظام" : "System Health"}</span>
                <span className="text-sm text-muted-foreground">{mindStatus.systemHealth}%</span>
              </div>
              <Progress value={mindStatus.systemHealth} className="h-3" />
            </div>

            <div className="flex gap-2">
              <Button onClick={initiateDeepLearning} variant="outline" className="flex-1">
                <TrendingUp className="h-4 w-4 mr-2" />
                {isArabic ? "التعلم العميق" : "Deep Learning"}
              </Button>
              <Button onClick={toggleAutonomousMode} variant="outline" className="flex-1">
                <Target className="h-4 w-4 mr-2" />
                {mindStatus.autonomousMode 
                  ? (isArabic ? "يدوي" : "Manual") 
                  : (isArabic ? "تلقائي" : "Auto")
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent AI Decisions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {isArabic ? "قرارات الذكاء الاصطناعي الأخيرة" : "Recent AI Decisions"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDecisions.map((decision) => (
              <div key={decision.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div>
                    <div className="font-medium">{decision.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {isArabic ? "الثقة" : "Confidence"}: {decision.confidence}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getImpactColor(decision.impact)}>{decision.impact}</Badge>
                  <Badge variant="outline">{decision.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};