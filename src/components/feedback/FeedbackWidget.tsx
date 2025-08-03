import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Bug, 
  Lightbulb, 
  AlertTriangle, 
  Send,
  Star,
  Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { supabase } from '@/integrations/supabase/client';
import { trackEvent } from '@/lib/analytics';

interface FeedbackData {
  type: 'bug' | 'feature' | 'improvement' | 'general';
  category: string;
  rating: number;
  message: string;
  page_url: string;
  module_name: string;
  priority: 'low' | 'medium' | 'high';
  include_screenshot: boolean;
  contact_me: boolean;
}

interface FeedbackWidgetProps {
  moduleName: string;
  position?: 'fixed' | 'inline';
  trigger?: 'button' | 'icon' | 'text';
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ 
  moduleName, 
  position = 'fixed',
  trigger = 'button' 
}) => {
  const { t, isArabic } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [quickFeedback, setQuickFeedback] = useState<'positive' | 'negative' | null>(null);
  
  const [feedback, setFeedback] = useState<FeedbackData>({
    type: 'general',
    category: '',
    rating: 0,
    message: '',
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    module_name: moduleName,
    priority: 'medium',
    include_screenshot: false,
    contact_me: false
  });

  const feedbackTypes = [
    { value: 'bug', label: isArabic ? 'خطأ في النظام' : 'Bug Report', icon: Bug, color: 'text-red-500' },
    { value: 'feature', label: isArabic ? 'اقتراح ميزة' : 'Feature Request', icon: Lightbulb, color: 'text-blue-500' },
    { value: 'improvement', label: isArabic ? 'تحسين' : 'Improvement', icon: AlertTriangle, color: 'text-yellow-500' },
    { value: 'general', label: isArabic ? 'عام' : 'General Feedback', icon: MessageSquare, color: 'text-gray-500' }
  ];

  const categories = {
    bug: [
      { value: 'ui', label: isArabic ? 'واجهة المستخدم' : 'User Interface' },
      { value: 'performance', label: isArabic ? 'الأداء' : 'Performance' },
      { value: 'data', label: isArabic ? 'البيانات' : 'Data Issues' },
      { value: 'integration', label: isArabic ? 'التكامل' : 'Integration' }
    ],
    feature: [
      { value: 'automation', label: isArabic ? 'الأتمتة' : 'Automation' },
      { value: 'reporting', label: isArabic ? 'التقارير' : 'Reporting' },
      { value: 'ai', label: isArabic ? 'الذكاء الاصطناعي' : 'AI Features' },
      { value: 'mobile', label: isArabic ? 'الجوال' : 'Mobile' }
    ],
    improvement: [
      { value: 'usability', label: isArabic ? 'سهولة الاستخدام' : 'Usability' },
      { value: 'accessibility', label: isArabic ? 'إمكانية الوصول' : 'Accessibility' },
      { value: 'localization', label: isArabic ? 'التوطين' : 'Localization' },
      { value: 'workflow', label: isArabic ? 'سير العمل' : 'Workflow' }
    ],
    general: [
      { value: 'praise', label: isArabic ? 'إشادة' : 'Praise' },
      { value: 'question', label: isArabic ? 'سؤال' : 'Question' },
      { value: 'other', label: isArabic ? 'أخرى' : 'Other' }
    ]
  };

  const handleQuickFeedback = async (type: 'positive' | 'negative') => {
    setQuickFeedback(type);
    
    try {
      const quickFeedbackData = {
        type: 'general' as const,
        category: type === 'positive' ? 'praise' : 'improvement',
        rating: type === 'positive' ? 5 : 2,
        message: type === 'positive' 
          ? (isArabic ? 'تجربة إيجابية' : 'Positive experience')
          : (isArabic ? 'يحتاج تحسين' : 'Needs improvement'),
        page_url: feedback.page_url,
        module_name: feedback.module_name,
        priority: 'low' as const,
        include_screenshot: false,
        contact_me: false
      };

      await submitFeedback(quickFeedbackData);
      
      // Track quick feedback
      trackEvent('quick_feedback', moduleName, { 
        feedback_type: type,
        module: moduleName 
      });

      setTimeout(() => {
        setQuickFeedback(null);
      }, 2000);

    } catch (error) {
      console.error('Failed to submit quick feedback:', error);
      setQuickFeedback(null);
    }
  };

  const submitFeedback = async (feedbackData: FeedbackData) => {
    try {
      setIsSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      
      const feedbackRecord = {
        user_id: user?.id,
        feedback_type: feedbackData.type,
        category: feedbackData.category,
        rating: feedbackData.rating,
        message: feedbackData.message,
        page_url: feedbackData.page_url,
        module_name: feedbackData.module_name,
        priority: feedbackData.priority,
        metadata: {
          include_screenshot: feedbackData.include_screenshot,
          contact_me: feedbackData.contact_me,
          user_agent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      };

      const { error } = await supabase
        .from('user_feedback')
        .insert([feedbackRecord]);

      if (error) throw error;

      // Track feedback submission
      trackEvent('feedback_submitted', moduleName, {
        feedback_type: feedbackData.type,
        category: feedbackData.category,
        rating: feedbackData.rating
      });

      toast({
        title: isArabic ? 'تم إرسال الملاحظات' : 'Feedback Submitted',
        description: isArabic 
          ? 'شكراً لك! ملاحظاتك تساعدنا في التحسين.' 
          : 'Thank you! Your feedback helps us improve.',
      });

      // Reset form
      setStep(1);
      setFeedback({
        type: 'general',
        category: '',
        rating: 0,
        message: '',
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        module_name: moduleName,
        priority: 'medium',
        include_screenshot: false,
        contact_me: false
      });
      setIsOpen(false);

    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast({
        title: isArabic ? 'خطأ' : 'Error',
        description: isArabic 
          ? 'فشل في إرسال الملاحظات. يرجى المحاولة مرة أخرى.' 
          : 'Failed to submit feedback. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    submitFeedback(feedback);
  };

  const renderTrigger = () => {
    const triggerContent = {
      button: (
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 me-2" />
          {isArabic ? 'ملاحظات' : 'Feedback'}
        </Button>
      ),
      icon: (
        <Button variant="ghost" size="sm">
          <MessageSquare className="h-4 w-4" />
        </Button>
      ),
      text: (
        <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary">
          {isArabic ? 'إرسال ملاحظات' : 'Send Feedback'}
        </span>
      )
    };

    return triggerContent[trigger];
  };

  const FeedbackTrigger = position === 'fixed' ? (
    <div className={`fixed bottom-6 ${isArabic ? 'left-6' : 'right-6'} z-50`}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {renderTrigger()}
        </DialogTrigger>
        <FeedbackDialog />
      </Dialog>
      
      {/* Quick feedback buttons */}
      {!isOpen && (
        <div className={`flex gap-2 mt-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleQuickFeedback('positive')}
            className={`${quickFeedback === 'positive' ? 'bg-green-100 text-green-600' : ''}`}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleQuickFeedback('negative')}
            className={`${quickFeedback === 'negative' ? 'bg-red-100 text-red-600' : ''}`}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  ) : (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {renderTrigger()}
      </DialogTrigger>
      <FeedbackDialog />
    </Dialog>
  );

  function FeedbackDialog() {
    return (
      <DialogContent className={`sm:max-w-md ${isArabic ? 'rtl' : 'ltr'}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {isArabic ? 'إرسال ملاحظات' : 'Send Feedback'}
          </DialogTitle>
          <DialogDescription>
            {isArabic 
              ? 'ساعدنا في تحسين تجربتك مع النظام'
              : 'Help us improve your experience with the system'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <Label>{isArabic ? 'نوع الملاحظات' : 'Feedback Type'}</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {feedbackTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.value}
                        variant={feedback.type === type.value ? "default" : "outline"}
                        className="h-auto p-3 flex flex-col gap-2"
                        onClick={() => setFeedback({ ...feedback, type: type.value as any })}
                      >
                        <Icon className={`h-5 w-5 ${type.color}`} />
                        <span className="text-xs">{type.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {feedback.type && (
                <div>
                  <Label>{isArabic ? 'الفئة' : 'Category'}</Label>
                  <Select value={feedback.category} onValueChange={(value) => setFeedback({ ...feedback, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={isArabic ? 'اختر الفئة' : 'Select category'} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories[feedback.type]?.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {feedback.category && (
                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)}>
                    {isArabic ? 'التالي' : 'Next'}
                  </Button>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <Label>{isArabic ? 'التقييم' : 'Rating'}</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      onClick={() => setFeedback({ ...feedback, rating: star })}
                    >
                      <Star className={`h-5 w-5 ${star <= feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>{isArabic ? 'الرسالة' : 'Message'}</Label>
                <Textarea
                  value={feedback.message}
                  onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                  placeholder={isArabic ? 'اكتب ملاحظاتك هنا...' : 'Write your feedback here...'}
                  rows={4}
                />
              </div>

              <div>
                <Label>{isArabic ? 'الأولوية' : 'Priority'}</Label>
                <RadioGroup 
                  value={feedback.priority} 
                  onValueChange={(value) => setFeedback({ ...feedback, priority: value as any })}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">{isArabic ? 'منخفضة' : 'Low'}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">{isArabic ? 'متوسطة' : 'Medium'}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">{isArabic ? 'عالية' : 'High'}</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="screenshot"
                    checked={feedback.include_screenshot}
                    onCheckedChange={(checked) => setFeedback({ ...feedback, include_screenshot: checked as boolean })}
                  />
                  <Label htmlFor="screenshot" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    {isArabic ? 'تضمين لقطة شاشة' : 'Include screenshot'}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="contact"
                    checked={feedback.contact_me}
                    onCheckedChange={(checked) => setFeedback({ ...feedback, contact_me: checked as boolean })}
                  />
                  <Label htmlFor="contact">
                    {isArabic ? 'يمكنكم التواصل معي' : 'You may contact me'}
                  </Label>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  {isArabic ? 'السابق' : 'Back'}
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting || !feedback.message.trim()}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full me-2" />
                      {isArabic ? 'جاري الإرسال...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 me-2" />
                      {isArabic ? 'إرسال' : 'Send'}
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    );
  }

  return FeedbackTrigger;
};

export default FeedbackWidget;