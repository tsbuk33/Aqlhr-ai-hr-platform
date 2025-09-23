import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Languages,
  Activity,
  CheckCircle,
  AlertTriangle,
  Brain,
  MessageSquare,
  Command
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VoiceCommand {
  id: string;
  command: string;
  commandAr: string;
  description: string;
  descriptionAr: string;
  category: 'reports' | 'data' | 'navigation' | 'actions';
  examples: string[];
  examplesAr: string[];
}

interface VoiceCommandCenterProps {
  isArabic?: boolean;
  onCommandExecuted?: (command: string, result: any) => void;
}

export const VoiceCommandCenter: React.FC<VoiceCommandCenterProps> = ({ 
  isArabic = false,
  onCommandExecuted 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>(isArabic ? 'ar' : 'en');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  
  const wsRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const voiceCommands: VoiceCommand[] = [
    {
      id: 'generate-board-report',
      command: 'Generate board report',
      commandAr: 'أنشئ تقرير مجلس الإدارة',
      description: 'Creates a comprehensive board presentation',
      descriptionAr: 'ينشئ عرضاً تقديمياً شاملاً لمجلس الإدارة',
      category: 'reports',
      examples: ['Generate board report', 'Create presentation for board', 'Prepare board meeting report'],
      examplesAr: ['أنشئ تقرير مجلس الإدارة', 'اعد عرض تقديمي للمجلس', 'حضر تقرير اجتماع المجلس']
    },
    {
      id: 'show-workforce-metrics',
      command: 'Show workforce metrics',
      commandAr: 'اعرض مقاييس القوى العاملة',
      description: 'Displays current workforce analytics',
      descriptionAr: 'يعرض تحليلات القوى العاملة الحالية',
      category: 'data',
      examples: ['Show workforce data', 'Display employee metrics', 'What are our workforce numbers?'],
      examplesAr: ['اعرض بيانات القوى العاملة', 'اظهر مقاييس الموظفين', 'ما هي أرقام القوى العاملة لدينا؟']
    },
    {
      id: 'check-compliance-status',
      command: 'Check compliance status',
      commandAr: 'تحقق من حالة الامتثال',
      description: 'Reviews government compliance across all portals',
      descriptionAr: 'يراجع الامتثال الحكومي عبر جميع البوابات',
      category: 'data',
      examples: ['Check compliance', 'Show regulatory status', 'Are we compliant?'],
      examplesAr: ['تحقق من الامتثال', 'اعرض الحالة التنظيمية', 'هل نحن ملتزمون؟']
    },
    {
      id: 'emergency-alert',
      command: 'Activate emergency protocol',
      commandAr: 'فعل بروتوكول الطوارئ',
      description: 'Triggers crisis management procedures',
      descriptionAr: 'يفعل إجراءات إدارة الأزمات',
      category: 'actions',
      examples: ['Emergency alert', 'Crisis mode', 'Activate emergency response'],
      examplesAr: ['تنبيه طوارئ', 'وضع الأزمة', 'فعل استجابة الطوارئ']
    },
    {
      id: 'navigate-dashboard',
      command: 'Go to dashboard',
      commandAr: 'انتقل إلى لوحة التحكم',
      description: 'Navigate to main dashboard',
      descriptionAr: 'الانتقال إلى لوحة التحكم الرئيسية',
      category: 'navigation',
      examples: ['Go to main dashboard', 'Show me the overview', 'Navigate to home'],
      examplesAr: ['اذهب إلى لوحة التحكم الرئيسية', 'اظهر لي النظرة العامة', 'انتقل إلى الصفحة الرئيسية']
    }
  ];

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = currentLanguage === 'ar' ? 'ar-SA' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const transcript = lastResult[0].transcript;
          const confidence = lastResult[0].confidence;
          handleVoiceCommand(transcript, confidence);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error(
          isArabic 
            ? 'خطأ في التعرف على الصوت' 
            : 'Speech recognition error'
        );
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      closeWebSocketConnection();
    };
  }, [currentLanguage]);

  const initializeWebSocketConnection = async () => {
    try {
      setConnectionStatus('connecting');
      
      // Connect to OpenAI Realtime API through our edge function
      wsRef.current = new WebSocket(
        `wss://qcuhjcyjlkfizesndmth.supabase.co/functions/v1/voice-command-processor`
      );

      wsRef.current.onopen = () => {
        console.log('Voice command WebSocket connected');
        setConnectionStatus('connected');
        
        // Send session configuration
        const sessionConfig = {
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: isArabic 
              ? 'أنت مساعد ذكي للتطبيق التنفيذي في منصة عقل الموارد البشرية. ساعد في تنفيذ الأوامر الصوتية وإدارة المهام التنفيذية.'
              : 'You are an AI assistant for the executive app in AqlHR platform. Help execute voice commands and manage executive tasks.',
            voice: 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: {
              model: 'whisper-1'
            },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1000
            },
            language: currentLanguage,
            temperature: 0.7,
            max_response_output_tokens: 1000
          }
        };

        wsRef.current?.send(JSON.stringify(sessionConfig));
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
        toast.error(
          isArabic 
            ? 'فشل الاتصال بخدمة الأوامر الصوتية' 
            : 'Failed to connect to voice command service'
        );
      };

      wsRef.current.onclose = () => {
        setConnectionStatus('disconnected');
        setIsListening(false);
      };

    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      setConnectionStatus('disconnected');
    }
  };

  const closeWebSocketConnection = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'response.audio.delta':
        // Handle audio response (if implementing voice responses)
        break;
      case 'response.audio_transcript.delta':
        // Handle transcript updates
        if (data.delta) {
          setLastCommand(prev => (prev || '') + data.delta);
        }
        break;
      case 'response.function_call_arguments.done':
        // Handle function call completion
        executeCommand(data.arguments);
        break;
      case 'session.created':
      case 'session.updated':
        console.log('Session updated:', data);
        break;
      default:
        console.log('Unhandled message type:', data.type);
    }
  };

  const startListening = async () => {
    try {
      if (connectionStatus !== 'connected') {
        await initializeWebSocketConnection();
        // Wait for connection
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (recognitionRef.current) {
        recognitionRef.current.lang = currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
        
        toast.success(
          isArabic 
            ? 'بدأ الاستماع للأوامر الصوتية...' 
            : 'Started listening for voice commands...'
        );
      } else {
        // Fallback to WebSocket-based voice recognition
        await requestMicrophoneAccess();
        setIsListening(true);
      }
    } catch (error) {
      console.error('Failed to start listening:', error);
      toast.error(
        isArabic 
          ? 'فشل في بدء الاستماع' 
          : 'Failed to start listening'
      );
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    
    toast.info(
      isArabic 
        ? 'توقف الاستماع للأوامر الصوتية' 
        : 'Stopped listening for voice commands'
    );
  };

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        if (isListening && wsRef.current?.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const audioData = encodeAudioForAPI(inputData);
          
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: audioData
          }));
        }
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

    } catch (error) {
      console.error('Microphone access denied:', error);
      throw error;
    }
  };

  const encodeAudioForAPI = (float32Array: Float32Array): string => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    return btoa(binary);
  };

  const handleVoiceCommand = async (transcript: string, confidence: number) => {
    setLastCommand(transcript);
    setConfidence(confidence);
    setIsProcessing(true);

    try {
      // Find matching command
      const matchedCommand = voiceCommands.find(cmd => {
        const commands = currentLanguage === 'ar' ? [cmd.commandAr, ...cmd.examplesAr] : [cmd.command, ...cmd.examples];
        return commands.some(c => 
          transcript.toLowerCase().includes(c.toLowerCase()) || 
          c.toLowerCase().includes(transcript.toLowerCase())
        );
      });

      if (matchedCommand) {
        await executeCommand(matchedCommand.id);
        toast.success(
          isArabic 
            ? 'تم تنفيذ الأمر بنجاح' 
            : 'Command executed successfully'
        );
      } else {
        // Send to AI for interpretation
        await sendToAIForInterpretation(transcript);
      }
    } catch (error) {
      console.error('Command processing failed:', error);
      toast.error(
        isArabic 
          ? 'فشل في تنفيذ الأمر' 
          : 'Failed to execute command'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const sendToAIForInterpretation = async (transcript: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('interpret-voice-command', {
        body: {
          transcript,
          language: currentLanguage,
          context: 'executive_mobile_app'
        }
      });

      if (error) throw error;

      if (data?.commandId) {
        await executeCommand(data.commandId, data.parameters);
      } else {
        toast.info(
          isArabic 
            ? 'لم أفهم الأمر. يرجى المحاولة مرة أخرى.' 
            : "I didn't understand that command. Please try again."
        );
      }
    } catch (error) {
      console.error('AI interpretation failed:', error);
    }
  };

  const executeCommand = async (commandId: string, parameters?: any) => {
    switch (commandId) {
      case 'generate-board-report':
        onCommandExecuted?.('generate-report', { type: 'board' });
        break;
      case 'show-workforce-metrics':
        onCommandExecuted?.('navigate', { section: 'workforce' });
        break;
      case 'check-compliance-status':
        onCommandExecuted?.('navigate', { section: 'compliance' });
        break;
      case 'emergency-alert':
        onCommandExecuted?.('emergency-alert', {});
        break;
      case 'navigate-dashboard':
        onCommandExecuted?.('navigate', { section: 'dashboard' });
        break;
      default:
        console.log('Unknown command:', commandId);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    setCurrentLanguage(newLanguage);
    
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLanguage === 'ar' ? 'ar-SA' : 'en-US';
    }
    
    toast.info(
      newLanguage === 'ar' 
        ? 'تم التبديل إلى العربية' 
        : 'Switched to English'
    );
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'connecting': return <Activity className="h-4 w-4 animate-pulse" />;
      case 'disconnected': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                {isArabic ? 'مركز الأوامر الصوتية' : 'Voice Command Center'}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? 'تحكم في التطبيق التنفيذي باستخدام الأوامر الصوتية بالعربية والإنجليزية' 
                  : 'Control the executive app with voice commands in Arabic and English'
                }
              </CardDescription>
            </div>
            <div className={`flex items-center gap-2 ${getConnectionStatusColor()}`}>
              {getConnectionStatusIcon()}
              <span className="text-sm font-medium">
                {connectionStatus === 'connected' && (isArabic ? 'متصل' : 'Connected')}
                {connectionStatus === 'connecting' && (isArabic ? 'جاري الاتصال' : 'Connecting')}
                {connectionStatus === 'disconnected' && (isArabic ? 'غير متصل' : 'Disconnected')}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Voice Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                className={`h-16 w-16 rounded-full ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
              >
                {isListening ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={toggleLanguage}
                className="flex items-center gap-2"
              >
                <Languages className="h-4 w-4" />
                {currentLanguage === 'ar' ? 'عربي' : 'English'}
              </Button>
            </div>

            {/* Status Indicators */}
            {(isListening || isProcessing || lastCommand) && (
              <div className="space-y-3">
                {isListening && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Activity className="h-4 w-4 animate-pulse" />
                    {isArabic ? 'جاري الاستماع...' : 'Listening...'}
                  </div>
                )}

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Brain className="h-4 w-4 animate-pulse" />
                      {isArabic ? 'جاري معالجة الأمر...' : 'Processing command...'}
                    </div>
                    <Progress value={75} className="w-full" />
                  </div>
                )}

                {lastCommand && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 mt-0.5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {isArabic ? 'آخر أمر:' : 'Last command:'}
                        </p>
                        <p className="text-sm text-muted-foreground">"{lastCommand}"</p>
                        {confidence > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {isArabic ? 'الثقة:' : 'Confidence:'}
                            </span>
                            <Progress value={confidence * 100} className="w-20 h-2" />
                            <span className="text-xs text-muted-foreground">
                              {Math.round(confidence * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            {isArabic ? 'الأوامر المتاحة' : 'Available Commands'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {voiceCommands.map((command) => (
              <div key={command.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {command.category}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {isArabic ? command.commandAr : command.command}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? command.descriptionAr : command.description}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {isArabic ? 'أمثلة:' : 'Examples:'}
                  </p>
                  {(isArabic ? command.examplesAr : command.examples).slice(0, 2).map((example, index) => (
                    <p key={index} className="text-xs text-muted-foreground italic">
                      "{example}"
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};