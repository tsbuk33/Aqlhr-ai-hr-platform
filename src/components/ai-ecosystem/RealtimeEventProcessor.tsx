import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Zap, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText,
  TrendingUp,
  Shield,
  Bot,
  Eye,
  BrainCircuit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

interface RealtimeEvent {
  id: string;
  type: 'employee_action' | 'compliance_alert' | 'performance_change' | 'system_event' | 'government_update';
  source: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  status: 'detected' | 'processing' | 'action_taken' | 'resolved' | 'escalated';
  timestamp: string;
  affectedEmployees?: number;
  aiResponse?: {
    confidence: number;
    action: string;
    reasoning: string;
  };
  metadata: Record<string, any>;
}

interface ProcessorMetrics {
  eventsProcessed: number;
  eventsPerMinute: number;
  responseTime: number;
  actionsTaken: number;
  automationRate: number;
  uptime: number;
}

interface StreamStatus {
  name: string;
  source: string;
  status: 'active' | 'inactive' | 'error';
  eventsToday: number;
  latency: number;
}

export const RealtimeEventProcessor: React.FC = () => {
  const { toast } = useToast();
  const { isArabic } = useSimpleLanguage();
  
  const [processorActive, setProcessorActive] = useState(true);
  const [events, setEvents] = useState<RealtimeEvent[]>([
    {
      id: '1',
      type: 'compliance_alert',
      source: 'GOSI API',
      title: 'GOSI Contribution Discrepancy Detected',
      description: 'Employee Ahmed Al-Mansouri: GOSI contribution calculation mismatch detected',
      severity: 'warning',
      status: 'action_taken',
      timestamp: '12 seconds ago',
      affectedEmployees: 1,
      aiResponse: {
        confidence: 94,
        action: 'Auto-corrected calculation and submitted to GOSI',
        reasoning: 'Salary change from last month not reflected in GOSI system'
      },
      metadata: {
        employeeId: 'emp_001',
        expectedAmount: 1250,
        actualAmount: 1100,
        difference: 150
      }
    },
    {
      id: '2',
      type: 'employee_action',
      source: 'Attendance System',
      title: 'Unusual Late Pattern Detected',
      description: 'Sarah Al-Rashid: 5 late arrivals in the past week (unusual pattern)',
      severity: 'info',
      status: 'processing',
      timestamp: '45 seconds ago',
      affectedEmployees: 1,
      aiResponse: {
        confidence: 87,
        action: 'Analyzing correlation with personal events and workload',
        reasoning: 'Employee has perfect attendance history, investigating external factors'
      },
      metadata: {
        employeeId: 'emp_002',
        lateCount: 5,
        avgLateness: '15 minutes',
        historicalPattern: 'excellent'
      }
    },
    {
      id: '3',
      type: 'government_update',
      source: 'Qiwa Portal',
      title: 'New Visa Quota Available',
      description: 'Ministry announced 50 new work visa quotas for IT professionals',
      severity: 'success',
      status: 'action_taken',
      timestamp: '2 minutes ago',
      aiResponse: {
        confidence: 98,
        action: 'Auto-submitted applications for 3 pending candidates',
        reasoning: 'Aligns with current Saudization hiring plan and budget approval'
      },
      metadata: {
        quotaType: 'IT Professional',
        availableQuota: 50,
        applicationsSubmitted: 3,
        pendingCandidates: 12
      }
    },
    {
      id: '4',
      type: 'performance_change',
      source: 'Performance System',
      title: 'Exceptional Performance Milestone',
      description: 'Mohammad Al-Otaibi achieved 100% project delivery rate for Q4',
      severity: 'success',
      status: 'resolved',
      timestamp: '5 minutes ago',
      affectedEmployees: 1,
      aiResponse: {
        confidence: 91,
        action: 'Recommended for performance bonus and promotion consideration',
        reasoning: 'Consistent high performance over 6 months, leadership potential identified'
      },
      metadata: {
        employeeId: 'emp_003',
        deliveryRate: 100,
        quarter: 'Q4',
        teamImpact: 'positive'
      }
    },
    {
      id: '5',
      type: 'system_event',
      source: 'AI Learning Engine',
      title: 'New Pattern Discovered',
      description: 'Correlation identified: Training completion rate vs retention (R² = 0.82)',
      severity: 'info',
      status: 'resolved',
      timestamp: '8 minutes ago',
      aiResponse: {
        confidence: 96,
        action: 'Updated retention prediction model and created training recommendations',
        reasoning: 'Strong statistical correlation supports model enhancement'
      },
      metadata: {
        correlation: 0.82,
        sampleSize: 234,
        confidence: 96,
        modelVersion: 'v2.1'
      }
    }
  ]);

  const [metrics, setMetrics] = useState<ProcessorMetrics>({
    eventsProcessed: 2847,
    eventsPerMinute: 12.3,
    responseTime: 0.34,
    actionsTaken: 1923,
    automationRate: 87.2,
    uptime: 99.8
  });

  const [streams, setStreams] = useState<StreamStatus[]>([
    { name: 'GOSI Integration', source: 'gosi_api', status: 'active', eventsToday: 45, latency: 120 },
    { name: 'Qiwa Portal', source: 'qiwa_api', status: 'active', eventsToday: 23, latency: 250 },
    { name: 'Absher Services', source: 'absher_api', status: 'active', eventsToday: 12, latency: 180 },
    { name: 'Performance System', source: 'performance_db', status: 'active', eventsToday: 67, latency: 45 },
    { name: 'Attendance System', source: 'attendance_db', status: 'active', eventsToday: 156, latency: 32 },
    { name: 'Learning Platform', source: 'learning_api', status: 'active', eventsToday: 89, latency: 78 }
  ]);

  useEffect(() => {
    if (!processorActive) return;

    const interval = setInterval(() => {
      // Simulate new events
      if (Math.random() < 0.3) {
        const newEvent: RealtimeEvent = {
          id: `event_${Date.now()}`,
          type: ['employee_action', 'compliance_alert', 'performance_change', 'system_event'][Math.floor(Math.random() * 4)] as any,
          source: ['GOSI API', 'Qiwa Portal', 'Performance System', 'Attendance System'][Math.floor(Math.random() * 4)],
          title: 'New Event Detected',
          description: 'Real-time event processing in action',
          severity: ['info', 'warning', 'success'][Math.floor(Math.random() * 3)] as any,
          status: 'detected',
          timestamp: 'Just now',
          affectedEmployees: Math.floor(Math.random() * 5) + 1,
          metadata: {}
        };

        setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
      }

      // Update metrics
      setMetrics(prev => ({
        ...prev,
        eventsProcessed: prev.eventsProcessed + Math.floor(Math.random() * 3),
        eventsPerMinute: 10 + Math.random() * 5,
        responseTime: 0.2 + Math.random() * 0.3,
        actionsTaken: prev.actionsTaken + Math.floor(Math.random() * 2)
      }));

      // Update stream metrics
      setStreams(prev => prev.map(stream => ({
        ...stream,
        eventsToday: stream.eventsToday + Math.floor(Math.random() * 2),
        latency: Math.max(20, stream.latency + (Math.random() - 0.5) * 20)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [processorActive]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-status-danger" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-brand-warning" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-brand-success" />;
      case 'info': return <Zap className="h-4 w-4 text-primary" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'detected': return <Eye className="h-4 w-4 text-brand-warning animate-pulse" />;
      case 'processing': return <Activity className="h-4 w-4 text-primary animate-spin" />;
      case 'action_taken': return <Bot className="h-4 w-4 text-brand-success" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-brand-success" />;
      case 'escalated': return <AlertTriangle className="h-4 w-4 text-status-danger" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStreamStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-brand-success';
      case 'inactive': return 'bg-muted-foreground';
      case 'error': return 'bg-status-danger';
      default: return 'bg-muted-foreground';
    }
  };

  const toggleProcessor = () => {
    setProcessorActive(!processorActive);
    toast({
      title: processorActive 
        ? (isArabic ? "تم إيقاف معالج الأحداث" : "Event Processor Paused")
        : (isArabic ? "تم تفعيل معالج الأحداث" : "Event Processor Activated"),
      description: processorActive 
        ? (isArabic ? "إيقاف معالجة الأحداث الفورية" : "Real-time event processing paused")
        : (isArabic ? "استئناف معالجة الأحداث الفورية" : "Resuming real-time event processing"),
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {isArabic ? "معالج الأحداث الفوري" : "Real-time Event Processor"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isArabic 
              ? "معالجة ومراقبة الأحداث والتغييرات في الوقت الفعلي عبر جميع الأنظمة" 
              : "Real-time monitoring and processing of events across all HR systems"
            }
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={processorActive ? "default" : "secondary"} className="px-4 py-2">
            {processorActive 
              ? (isArabic ? "🔥 نشط" : "🔥 LIVE")
              : (isArabic ? "⏸️ متوقف" : "⏸️ PAUSED")
            }
          </Badge>
          <Button onClick={toggleProcessor} variant={processorActive ? "destructive" : "default"}>
            {processorActive 
              ? (isArabic ? "إيقاف" : "Pause")
              : (isArabic ? "تفعيل" : "Start")
            }
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "أحداث/دقيقة" : "Events/Min"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.eventsPerMinute.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-brand-warning" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "زمن الاستجابة" : "Response Time"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.responseTime.toFixed(2)}s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-brand-success" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "الإجراءات المتخذة" : "Actions Taken"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.actionsTaken}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "معدل الأتمتة" : "Automation Rate"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.automationRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-success" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "الأحداث المعالجة" : "Events Processed"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.eventsProcessed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-success" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isArabic ? "وقت التشغيل" : "Uptime"}
                </p>
                <p className="text-2xl font-bold text-foreground">{metrics.uptime}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Event Stream */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {isArabic ? "تدفق الأحداث المباشر" : "Live Event Stream"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {getSeverityIcon(event.severity)}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold text-foreground truncate">
                            {event.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {event.source} • {event.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getStatusIcon(event.status)}
                        <Badge variant="outline" className="text-xs">
                          {event.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    
                    {event.aiResponse && (
                      <div className="bg-muted/30 rounded p-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <Bot className="h-3 w-3 text-primary" />
                          <span className="text-xs font-medium text-primary">
                            AI Response ({event.aiResponse.confidence}% confidence)
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          <strong>Action:</strong> {event.aiResponse.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <strong>Reasoning:</strong> {event.aiResponse.reasoning}
                        </p>
                      </div>
                    )}
                    
                    {event.affectedEmployees && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{event.affectedEmployees} employees affected</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Data Streams Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {isArabic ? "حالة تدفق البيانات" : "Data Streams Status"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {streams.map((stream) => (
                <div key={stream.source} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStreamStatusColor(stream.status)}`} />
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{stream.name}</h4>
                      <p className="text-xs text-muted-foreground">{stream.source}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {stream.eventsToday} events
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stream.latency}ms latency
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* System Health */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {isArabic ? "صحة النظام العامة" : "Overall System Health"}
                </span>
                <span className="text-sm font-bold text-brand-success">
                  {metrics.uptime}%
                </span>
              </div>
              <Progress value={metrics.uptime} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>All streams operational</span>
                <span>Last check: 30s ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};