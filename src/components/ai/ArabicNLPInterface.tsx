import React, { useState } from 'react';
import { Languages, Mic, MicOff, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ArabicNLPInterfaceProps {
  className?: string;
}

export const ArabicNLPInterface: React.FC<ArabicNLPInterfaceProps> = ({ className }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleProcessText = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('arabic-nlp-engine', {
        body: {
          text: inputText,
          operations: ['sentiment', 'entities', 'translation']
        }
      });

      if (error) throw error;

      setResults(data);
      toast({
        title: "Text Processed",
        description: "Arabic NLP analysis completed successfully.",
      });
    } catch (error) {
      console.error('Arabic NLP error:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process Arabic text.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
    toast({
      title: isListening ? "Voice Input Stopped" : "Voice Input Started",
      description: isListening ? "Microphone deactivated" : "Listening for Arabic speech...",
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Arabic NLP Engine
        </CardTitle>
        <CardDescription>
          Advanced Arabic language processing and cultural context understanding
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="default">
            Ready
          </Badge>
          <div className="flex gap-2">
            <Badge variant="outline">العربية</Badge>
            <Badge variant="outline">English</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <Textarea
            placeholder="أدخل النص العربي هنا أو اكتب بالإنجليزية... / Enter Arabic text here or type in English..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[100px]"
            dir="auto"
          />

          <div className="flex gap-2">
            <Button 
              onClick={handleProcessText} 
              disabled={!inputText.trim() || isProcessing}
              className="flex-1"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Process Text'}
            </Button>
            
            <Button
              variant="outline"
              onClick={toggleVoiceInput}
              className={isListening ? 'bg-red-50 border-red-200' : ''}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {results && (
          <div className="p-3 bg-muted rounded-lg space-y-2">
            <p className="text-sm font-medium">Analysis Results:</p>
            <div className="text-xs space-y-1">
              {results.sentiment && (
                <div>Sentiment: <Badge variant="outline">{results.sentiment}</Badge></div>
              )}
              {results.language && (
                <div>Language: <Badge variant="outline">{results.language}</Badge></div>
              )}
              {results.translation && (
                <div className="mt-2">
                  <p className="font-medium">Translation:</p>
                  <p className="text-muted-foreground">{results.translation}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Supports Arabic sentiment analysis, entity extraction, bilingual processing, and cultural context understanding.
        </div>
      </CardContent>
    </Card>
  );
};