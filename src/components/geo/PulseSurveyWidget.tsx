import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, TrendingUp, Users } from 'lucide-react';

interface PulseSurveyWidgetProps {
  compact?: boolean;
  onComplete?: (responses: any) => void;
}

const PulseSurveyWidget: React.FC<PulseSurveyWidgetProps> = ({ 
  compact = false, 
  onComplete 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [textInput, setTextInput] = useState('');

  const surveyQuestions = [
    {
      id: 'energy',
      type: 'mood',
      question: 'How energized do you feel about your work today?',
      options: [
        { id: 'very-high', emoji: '🚀', label: 'Very High', value: 5 },
        { id: 'high', emoji: '😊', label: 'High', value: 4 },
        { id: 'neutral', emoji: '😐', label: 'Neutral', value: 3 },
        { id: 'low', emoji: '😔', label: 'Low', value: 2 },
        { id: 'very-low', emoji: '😞', label: 'Very Low', value: 1 }
      ]
    },
    {
      id: 'collaboration',
      type: 'scale',
      question: 'How well is your team collaborating today?',
      scale: { min: 1, max: 5, labels: ['Poor', 'Excellent'] }
    },
    {
      id: 'feedback',
      type: 'text',
      question: 'What\'s one thing that could make your day better?',
      placeholder: 'Share your thoughts...',
      optional: true
    }
  ];

  const handleMoodResponse = (questionId: string, optionId: string, value: number) => {
    const newResponse = { questionId, optionId, value, timestamp: new Date() };
    setResponses(prev => [...prev, newResponse]);
    moveToNext();
  };

  const handleScaleResponse = (questionId: string, value: number) => {
    const newResponse = { questionId, value, timestamp: new Date() };
    setResponses(prev => [...prev, newResponse]);
    moveToNext();
  };

  const handleTextResponse = (questionId: string, text: string) => {
    const newResponse = { questionId, text, timestamp: new Date() };
    setResponses(prev => [...prev, newResponse]);
    moveToNext();
  };

  const moveToNext = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTextInput('');
    } else {
      setIsComplete(true);
      onComplete?.(responses);
    }
  };

  const skipQuestion = () => {
    moveToNext();
  };

  const progressPercent = ((currentQuestion + 1) / surveyQuestions.length) * 100;
  const currentQ = surveyQuestions[currentQuestion];

  if (isComplete) {
    return (
      <Card className={compact ? 'w-full' : 'max-w-md mx-auto'}>
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold">Thank You!</h3>
          <p className="text-muted-foreground">
            Your feedback helps us create a better workplace for everyone.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-primary">94%</div>
              <div className="text-muted-foreground">Response Rate</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-primary">+8%</div>
              <div className="text-muted-foreground">Team Mood</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={compact ? 'w-full' : 'max-w-md mx-auto'}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            📊 Quick Pulse
            {!compact && <Badge variant="outline" className="text-xs">30 sec</Badge>}
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <Progress value={progressPercent} className="h-1" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Question {currentQuestion + 1} of {surveyQuestions.length}</span>
            <span>{Math.round(progressPercent)}% complete</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-base font-medium mb-4">{currentQ.question}</h3>
        </div>

        {/* Mood Question */}
        {currentQ.type === 'mood' && (
          <div className="grid grid-cols-5 gap-2">
            {currentQ.options?.map((option) => (
              <button
                key={option.id}
                className="p-3 rounded-lg border-2 border-border hover:border-primary hover:bg-muted/50 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={() => handleMoodResponse(currentQ.id, option.id, option.value)}
              >
                <div className="text-2xl mb-1">{option.emoji}</div>
                <div className="text-xs font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        )}

        {/* Scale Question */}
        {currentQ.type === 'scale' && (
          <div className="space-y-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentQ.scale?.labels[0]}</span>
              <span>{currentQ.scale?.labels[1]}</span>
            </div>
            <div className="flex justify-center gap-2">
              {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
                <button
                  key={value}
                  className="w-12 h-12 rounded-full border-2 border-border hover:border-primary hover:bg-primary hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => handleScaleResponse(currentQ.id, value)}
                >
                  <span className="font-medium">{value}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Question */}
        {currentQ.type === 'text' && (
          <div className="space-y-4">
            <Textarea
              placeholder={currentQ.placeholder}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="min-h-20 resize-none"
              maxLength={200}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {textInput.length}/200 characters
              </span>
              <div className="flex gap-2">
                {currentQ.optional && (
                  <Button variant="outline" size="sm" onClick={skipQuestion}>
                    Skip
                  </Button>
                )}
                <Button 
                  size="sm" 
                  onClick={() => handleTextResponse(currentQ.id, textInput)}
                  disabled={!currentQ.optional && textInput.trim().length === 0}
                >
                  {currentQuestion === surveyQuestions.length - 1 ? 'Complete' : 'Next'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Skip button for non-text questions */}
        {currentQ.type !== 'text' && (
          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={skipQuestion}>
              Skip this question
            </Button>
          </div>
        )}
      </CardContent>

      {/* Quick Stats Footer */}
      {!compact && (
        <div className="border-t bg-muted/20 p-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>Team participation: 89%</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>Mood trending up</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PulseSurveyWidget;