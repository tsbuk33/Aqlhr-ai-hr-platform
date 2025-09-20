import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  Square,
  Settings,
  Languages,
  Headphones,
  MessageSquare,
  Command,
  Zap,
  Brain,
  Eye,
  Activity
} from 'lucide-react';

interface VoiceCommand {
  id: string;
  phrase: string;
  phraseAr: string;
  action: string;
  category: 'navigation' | 'data' | 'communication' | 'analysis' | 'control';
  description: string;
  descriptionAr: string;
  confidence?: number;
  lastUsed?: string;
}

interface VoiceSession {
  id: string;
  startTime: string;
  duration: number;
  commandsExecuted: number;
  language: 'en' | 'ar';
  status: 'active' | 'paused' | 'ended';
}

interface VoiceActivatedCommandsProps {
  isArabic: boolean;
  expanded?: boolean;
}

export const VoiceActivatedCommands: React.FC<VoiceActivatedCommandsProps> = ({ 
  isArabic, 
  expanded = false 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentCommand, setCurrentCommand] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [voiceSession, setVoiceSession] = useState<VoiceSession | null>(null);
  const [availableCommands, setAvailableCommands] = useState<VoiceCommand[]>([]);
  const [recentCommands, setRecentCommands] = useState<VoiceCommand[]>([]);

  useEffect(() => {
    loadVoiceCommands();
    if (isEnabled) {
      initializeVoiceRecognition();
    }
  }, [isEnabled, isArabic]);

  const loadVoiceCommands = () => {
    const commands: VoiceCommand[] = [
      // Navigation Commands
      {
        id: 'nav_001',
        phrase: 'Show dashboard',
        phraseAr: 'أظهر لوحة التحكم',
        action: 'navigate_dashboard',
        category: 'navigation',
        description: 'Navigate to the main dashboard',
        descriptionAr: 'انتقل إلى لوحة التحكم الرئيسية'
      },
      {
        id: 'nav_002',
        phrase: 'Open strategic KPIs',
        phraseAr: 'افتح المؤشرات الاستراتيجية',
        action: 'open_kpis',
        category: 'navigation',
        description: 'Display strategic KPI dashboard',
        descriptionAr: 'عرض لوحة المؤشرات الاستراتيجية'
      },
      {
        id: 'nav_003',
        phrase: 'Show calendar',
        phraseAr: 'أظهر التقويم',
        action: 'show_calendar',
        category: 'navigation',
        description: 'Open executive calendar',
        descriptionAr: 'افتح التقويم التنفيذي'
      },

      // Data Commands
      {
        id: 'data_001',
        phrase: 'What is our revenue growth',
        phraseAr: 'ما هو نمو إيراداتنا',
        action: 'query_revenue_growth',
        category: 'data',
        description: 'Get current revenue growth statistics',
        descriptionAr: 'احصل على إحصائيات نمو الإيرادات الحالية'
      },
      {
        id: 'data_002',
        phrase: 'Show employee satisfaction',
        phraseAr: 'أظهر رضا الموظفين',
        action: 'query_employee_satisfaction',
        category: 'data',
        description: 'Display employee satisfaction metrics',
        descriptionAr: 'عرض مقاييس رضا الموظفين'
      },
      {
        id: 'data_003',
        phrase: 'Generate quarterly report',
        phraseAr: 'أنشئ التقرير الربعي',
        action: 'generate_quarterly_report',
        category: 'data',
        description: 'Create quarterly performance report',
        descriptionAr: 'إنشاء تقرير الأداء الربعي'
      },

      // Communication Commands
      {
        id: 'comm_001',
        phrase: 'Call crisis team',
        phraseAr: 'اتصل بفريق الأزمات',
        action: 'call_crisis_team',
        category: 'communication',
        description: 'Initiate emergency call to crisis management team',
        descriptionAr: 'بدء مكالمة طوارئ لفريق إدارة الأزمات'
      },
      {
        id: 'comm_002',
        phrase: 'Send board update',
        phraseAr: 'أرسل تحديث مجلس الإدارة',
        action: 'send_board_update',
        category: 'communication',
        description: 'Send update to board members',
        descriptionAr: 'إرسال تحديث لأعضاء مجلس الإدارة'
      },

      // Analysis Commands
      {
        id: 'analysis_001',
        phrase: 'Analyze performance trends',
        phraseAr: 'حلل اتجاهات الأداء',
        action: 'analyze_performance_trends',
        category: 'analysis',
        description: 'Run AI analysis on performance trends',
        descriptionAr: 'تشغيل تحليل الذكاء الاصطناعي على اتجاهات الأداء'
      },
      {
        id: 'analysis_002',
        phrase: 'Predict next quarter',
        phraseAr: 'تنبأ بالربع القادم',
        action: 'predict_next_quarter',
        category: 'analysis',
        description: 'Generate predictive analytics for next quarter',
        descriptionAr: 'إنشاء تحليلات تنبؤية للربع القادم'
      },

      // Control Commands
      {
        id: 'control_001',
        phrase: 'Activate crisis mode',
        phraseAr: 'فعل وضع الأزمة',
        action: 'activate_crisis_mode',
        category: 'control',
        description: 'Enable crisis management protocols',
        descriptionAr: 'تفعيل بروتوكولات إدارة الأزمات'
      },
      {
        id: 'control_002',
        phrase: 'Switch to Arabic',
        phraseAr: 'التبديل للعربية',
        action: 'switch_language_ar',
        category: 'control',
        description: 'Change interface language to Arabic',
        descriptionAr: 'تغيير لغة الواجهة إلى العربية'
      },
      {
        id: 'control_003',
        phrase: 'Switch to English',
        phraseAr: 'التبديل للإنجليزية',
        action: 'switch_language_en',
        category: 'control',
        description: 'Change interface language to English',
        descriptionAr: 'تغيير لغة الواجهة إلى الإنجليزية'
      }
    ];

    setAvailableCommands(commands);
  };

  const initializeVoiceRecognition = () => {
    // Simulate voice recognition initialization
    if (!voiceSession) {
      const newSession: VoiceSession = {
        id: `session_${Date.now()}`,
        startTime: new Date().toISOString(),
        duration: 0,
        commandsExecuted: 0,
        language: isArabic ? 'ar' : 'en',
        status: 'active'
      };
      setVoiceSession(newSession);
    }
  };

  const startListening = () => {
    if (!isEnabled) return;
    
    setIsListening(true);
    setCurrentCommand('');
    setConfidence(0);

    // Simulate voice recognition
    setTimeout(() => {
      simulateVoiceRecognition();
    }, 1000);
  };

  const stopListening = () => {
    setIsListening(false);
    setCurrentCommand('');
    setConfidence(0);
  };

  const simulateVoiceRecognition = () => {
    const randomCommand = availableCommands[Math.floor(Math.random() * availableCommands.length)];
    const phrase = isArabic ? randomCommand.phraseAr : randomCommand.phrase;
    
    // Simulate recognition process
    let text = '';
    const words = phrase.split(' ');
    
    const addWord = (index: number) => {
      if (index < words.length && isListening) {
        text += (index > 0 ? ' ' : '') + words[index];
        setCurrentCommand(text);
        setConfidence(Math.min(95, 20 + (index / words.length) * 75));
        
        setTimeout(() => addWord(index + 1), 300);
      } else if (isListening) {
        executeCommand(randomCommand);
      }
    };
    
    addWord(0);
  };

  const executeCommand = (command: VoiceCommand) => {
    setCurrentCommand(isArabic ? command.phraseAr : command.phrase);
    setConfidence(95);
    
    // Add to recent commands
    const updatedCommand = {
      ...command,
      confidence: confidence,
      lastUsed: new Date().toISOString()
    };
    
    setRecentCommands(prev => [updatedCommand, ...prev.slice(0, 4)]);
    
    // Update session
    if (voiceSession) {
      setVoiceSession(prev => prev ? {
        ...prev,
        commandsExecuted: prev.commandsExecuted + 1,
        duration: Date.now() - new Date(prev.startTime).getTime()
      } : null);
    }

    // Simulate command execution
    setTimeout(() => {
      setIsListening(false);
      setCurrentCommand('');
      setConfidence(0);
    }, 2000);
  };

  const toggleVoiceEnabled = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      stopListening();
      setVoiceSession(null);
    }
  };

  const getCategoryIcon = (category: VoiceCommand['category']) => {
    switch (category) {
      case 'navigation':
        return <Eye className="h-4 w-4" />;
      case 'data':
        return <Activity className="h-4 w-4" />;
      case 'communication':
        return <MessageSquare className="h-4 w-4" />;
      case 'analysis':
        return <Brain className="h-4 w-4" />;
      case 'control':
        return <Command className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: VoiceCommand['category']) => {
    switch (category) {
      case 'navigation':
        return 'bg-blue-100 text-blue-700';
      case 'data':
        return 'bg-green-100 text-green-700';
      case 'communication':
        return 'bg-purple-100 text-purple-700';
      case 'analysis':
        return 'bg-orange-100 text-orange-700';
      case 'control':
        return 'bg-red-100 text-red-700';
    }
  };

  const categories = [
    { key: 'navigation', label: isArabic ? 'التنقل' : 'Navigation' },
    { key: 'data', label: isArabic ? 'البيانات' : 'Data' },
    { key: 'communication', label: isArabic ? 'التواصل' : 'Communication' },
    { key: 'analysis', label: isArabic ? 'التحليل' : 'Analysis' },
    { key: 'control', label: isArabic ? 'التحكم' : 'Control' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            {isArabic ? 'الأوامر الصوتية' : 'Voice-Activated Commands'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVoiceEnabled}
            >
              {isEnabled ? (
                <Volume2 className="h-4 w-4 text-green-500" />
              ) : (
                <VolumeX className="h-4 w-4 text-red-500" />
              )}
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {voiceSession && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Languages className="h-3 w-3" />
                {voiceSession.language.toUpperCase()}
              </Badge>
              <span className="text-muted-foreground">
                {isArabic ? 'الأوامر المنفذة' : 'Commands'}: {voiceSession.commandsExecuted}
              </span>
            </div>
            <Badge 
              className={voiceSession.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}
            >
              {voiceSession.status.toUpperCase()}
            </Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Voice Control Interface */}
        <Card className={`border-2 ${isListening ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
          <CardContent className="p-4">
            <div className="text-center space-y-4">
              <Button
                size="lg"
                onClick={isListening ? stopListening : startListening}
                disabled={!isEnabled}
                className={`w-16 h-16 rounded-full ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isListening ? (
                  <Square className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>
              
              <div className="space-y-2">
                {isListening ? (
                  <p className="text-sm font-medium text-red-600">
                    {isArabic ? 'أستمع...' : 'Listening...'}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'اضغط للتحدث' : 'Tap to speak'}
                  </p>
                )}
                
                {currentCommand && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      "{currentCommand}"
                    </p>
                    {confidence > 0 && (
                      <div className="space-y-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${confidence}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {isArabic ? 'الثقة' : 'Confidence'}: {confidence}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Commands */}
        {recentCommands.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {isArabic ? 'الأوامر الأخيرة' : 'Recent Commands'}
            </h4>
            
            <div className="space-y-2">
              {recentCommands.map((command) => (
                <Card key={`${command.id}_${command.lastUsed}`} className="border">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={getCategoryColor(command.category)}>
                          {getCategoryIcon(command.category)}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">
                            {isArabic ? command.phraseAr : command.phrase}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isArabic ? command.descriptionAr : command.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {command.confidence && (
                          <Badge variant="outline" className="text-xs">
                            {command.confidence}%
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Commands by Category */}
        {expanded && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Command className="h-4 w-4" />
              {isArabic ? 'الأوامر المتاحة' : 'Available Commands'}
            </h4>
            
            <div className="space-y-4">
              {categories.map((category) => {
                const categoryCommands = availableCommands.filter(cmd => cmd.category === category.key);
                
                return (
                  <div key={category.key} className="space-y-2">
                    <h5 className="text-sm font-medium flex items-center gap-2">
                      {getCategoryIcon(category.key as any)}
                      {category.label}
                    </h5>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {categoryCommands.slice(0, 3).map((command) => (
                        <Card key={command.id} className="border">
                          <CardContent className="p-2">
                            <div className="flex items-center justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium truncate">
                                  "{isArabic ? command.phraseAr : command.phrase}"
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {isArabic ? command.descriptionAr : command.description}
                                </p>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Mic className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Voice Settings Status */}
        <Card className={`bg-gradient-to-r ${
          isEnabled 
            ? 'from-green-50 to-blue-50 border-green-200' 
            : 'from-gray-50 to-gray-100 border-gray-200'
        }`}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className={`h-4 w-4 ${isEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${
                  isEnabled ? 'text-green-800' : 'text-gray-600'
                }`}>
                  {isArabic ? 'نظام الأوامر الصوتية' : 'Voice Command System'}
                </span>
              </div>
              <Badge variant="outline" className={
                isEnabled 
                  ? 'text-green-700 border-green-300' 
                  : 'text-gray-700 border-gray-300'
              }>
                {isEnabled ? (isArabic ? 'مفعل' : 'Enabled') : (isArabic ? 'معطل' : 'Disabled')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};