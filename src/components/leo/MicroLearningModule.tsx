import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, SkipBack, Bookmark, Share, MessageSquare, CheckCircle } from 'lucide-react';

interface MicroLearningModuleProps {
  moduleId: string;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const MicroLearningModule: React.FC<MicroLearningModuleProps> = ({
  moduleId,
  onComplete,
  onNext,
  onPrevious
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock module data
  const moduleData = {
    id: moduleId,
    title: 'Understanding AI in HR: Fundamentals',
    subtitle: 'Building the Foundation for Smart HR Decisions',
    totalSteps: 5,
    estimatedTime: 8,
    currentStep: currentStep,
    progressPercent: (currentStep / 5) * 100,
    contentType: 'video', // 'video', 'interactive', 'quiz', 'reading'
    
    steps: [
      {
        id: 1,
        type: 'video',
        title: 'Introduction to AI in HR',
        content: {
          videoUrl: '/api/placeholder/video',
          duration: 120,
          subtitles: true
        }
      },
      {
        id: 2,
        type: 'interactive',
        title: 'AI Applications Scenario',
        content: {
          scenario: 'Your company is considering implementing AI for recruitment...',
          interactions: [
            { id: 'a', text: 'Implement immediately', feedback: 'Consider the challenges first' },
            { id: 'b', text: 'Conduct pilot program', feedback: 'Excellent strategic thinking!' },
            { id: 'c', text: 'Avoid AI completely', feedback: 'AI can provide significant benefits when implemented thoughtfully' }
          ]
        }
      },
      {
        id: 3,
        type: 'quiz',
        title: 'Knowledge Check',
        content: {
          question: 'What is the primary benefit of AI in recruitment?',
          options: [
            { id: 'a', text: 'Eliminating human involvement entirely' },
            { id: 'b', text: 'Reducing bias and improving efficiency' },
            { id: 'c', text: 'Making hiring decisions automatically' },
            { id: 'd', text: 'Replacing HR professionals' }
          ],
          correctAnswer: 'b',
          explanation: 'AI helps reduce unconscious bias and improves efficiency while maintaining human oversight in decision-making.'
        }
      }
    ]
  };

  const currentStepData = moduleData.steps.find(step => step.id === currentStep);

  const handleNext = () => {
    if (currentStep < moduleData.totalSteps) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
    } else {
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setSelectedAnswer(null);
    } else {
      onPrevious?.();
    }
  };

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const renderVideoContent = () => (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/40">
          <Button
            size="lg"
            variant="ghost"
            className="text-white hover:bg-white/20 h-16 w-16 rounded-full"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <Progress value={35} className="h-1 bg-white/30" />
          <div className="flex justify-between text-xs text-white mt-1">
            <span>1:25</span>
            <span>3:40</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">1x</Button>
          <Button variant="outline" size="sm">CC</Button>
          <Button variant="outline" size="sm">HD</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderInteractiveContent = () => (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">Scenario Analysis</h3>
        <p className="text-blue-800 mb-4">{currentStepData?.content.scenario}</p>
        <div className="space-y-3">
          {currentStepData?.content.interactions?.map((interaction: any) => (
            <button
              key={interaction.id}
              className="w-full p-3 text-left border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
              onClick={() => handleAnswerSelect(interaction.id)}
            >
              {interaction.text}
            </button>
          ))}
        </div>
        {selectedAnswer && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">Feedback:</p>
            <p className="text-green-700">
              {currentStepData?.content.interactions?.find((i: any) => i.id === selectedAnswer)?.feedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderQuizContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Knowledge Check</h3>
        <p className="text-muted-foreground">Step {currentStep} of {moduleData.totalSteps}</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <h4 className="font-medium mb-4">{currentStepData?.content.question}</h4>
          <div className="space-y-3">
            {currentStepData?.content.options?.map((option: any) => (
              <button
                key={option.id}
                className={`w-full p-3 text-left border-2 rounded-lg transition-all ${
                  selectedAnswer === option.id
                    ? selectedAnswer === currentStepData?.content.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-red-500 bg-red-50 text-red-800'
                    : 'border-border hover:border-primary hover:bg-muted/50'
                }`}
                onClick={() => handleAnswerSelect(option.id)}
                disabled={selectedAnswer !== null}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === option.id
                      ? selectedAnswer === currentStepData?.content.correctAnswer
                        ? 'border-green-500 bg-green-500'
                        : 'border-red-500 bg-red-500'
                      : 'border-muted-foreground'
                  }`}>
                    {selectedAnswer === option.id && (
                      <CheckCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span>{option.text}</span>
                </div>
              </button>
            ))}
          </div>
          
          {selectedAnswer && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium mb-2">Explanation:</p>
              <p className="text-blue-700">{currentStepData?.content.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Module Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Module {moduleData.currentStep} of {moduleData.totalSteps}</span>
          <span>•</span>
          <span>⏱️ {moduleData.estimatedTime} minutes</span>
        </div>
        <Progress value={moduleData.progressPercent} className="w-full h-2" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{moduleData.title}</h1>
          <p className="text-muted-foreground">{moduleData.subtitle}</p>
        </div>
      </div>

      {/* Module Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{currentStepData?.title}</span>
            <div className="flex gap-2">
              <Badge variant="outline">{currentStepData?.type}</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleBookmark}
                className={isBookmarked ? 'text-yellow-600' : ''}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStepData?.type === 'video' && renderVideoContent()}
          {currentStepData?.type === 'interactive' && renderInteractiveContent()}
          {currentStepData?.type === 'quiz' && renderQuizContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <SkipBack className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={toggleBookmark}>
            <Bookmark className="h-4 w-4 mr-2" />
            Bookmark
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Note
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        <Button onClick={handleNext}>
          {currentStep === moduleData.totalSteps ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete
            </>
          ) : (
            <>
              Next
              <SkipForward className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MicroLearningModule;