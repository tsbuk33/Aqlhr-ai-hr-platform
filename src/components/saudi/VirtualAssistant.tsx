import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const VirtualAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = isArabic 
        ? [
            'مرحبا بك في منصة إيه كيو إل إتش ار للموارد البشرية. كيف يمكنني مساعدتك؟',
            'يمكنني مساعدتك في استعلامات الموظفين والرواتب.',
            'هل تريد معرفة المزيد عن خدماتنا؟'
          ]
        : [
            'Welcome to AqlHR platform. How can I help you?',
            'I can assist you with employee and payroll inquiries.',
            'Would you like to know more about our services?'
          ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { text: randomResponse, isUser: false }]);
    }, 1000);
    
    setInput('');
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary-hover shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-80 h-96 flex flex-col shadow-2xl border-0 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Bot className="h-5 w-5" />
          <span className={`font-medium ${isArabic ? 'font-arabic' : ''}`}>
            {isArabic ? 'المساعد الافتراضي' : 'Virtual Assistant'}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Bot className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className={isArabic ? 'font-arabic' : ''}>
              {isArabic ? 'مرحبا! كيف يمكنني مساعدتك؟' : 'Hello! How can I help you?'}
            </p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-lg ${
                message.isUser
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              } ${isArabic ? 'font-arabic text-right' : 'text-left'}`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2 rtl:space-x-reverse">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isArabic ? 'اكتب رسالتك...' : 'Type your message...'}
            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              isArabic ? 'font-arabic text-right' : 'text-left'
            }`}
            dir={isArabic ? 'rtl' : 'ltr'}
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};