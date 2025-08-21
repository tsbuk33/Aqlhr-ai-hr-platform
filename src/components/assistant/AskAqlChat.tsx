import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useAskAql } from '@/hooks/useAskAql';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const AskAqlChat: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const { messages, isLoading, tools, sendMessage } = useAskAql();
  const [input, setInput] = useState('');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [toolParams, setToolParams] = useState<Record<string, any>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !selectedTool) return;
    
    await sendMessage(input, selectedTool || undefined, selectedTool ? toolParams : undefined);
    setInput('');
    setSelectedTool(null);
    setToolParams({});
  };

  const handleToolSelect = (toolName: string) => {
    setSelectedTool(toolName);
    setToolParams({});
  };

  const handleParamChange = (paramName: string, value: any) => {
    setToolParams(prev => ({ ...prev, [paramName]: value }));
  };

  const renderToolCall = (toolCall: any) => {
    if (toolCall.loading) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Executing {toolCall.tool}...</span>
        </div>
      );
    }

    if (toolCall.result) {
      return (
        <Card className="bg-accent/20 border-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="text-lg">{tools.find(t => t.name === toolCall.tool)?.icon}</span>
              {toolCall.tool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {toolCall.result.source && (
              <Badge variant="outline" className="text-xs">
                {toolCall.result.source}
              </Badge>
            )}
            {toolCall.result.scope && (
              <p className="text-xs text-muted-foreground">
                {toolCall.result.scope}
              </p>
            )}
            <pre className="text-xs bg-background/50 p-2 rounded overflow-auto">
              {JSON.stringify(toolCall.result.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  const renderToolParameters = () => {
    if (!selectedTool) return null;

    const tool = tools.find(t => t.name === selectedTool);
    if (!tool || !Object.keys(tool.parameters).length) return null;

    return (
      <Card className="mb-4 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">
            {tool.icon} Configure {tool.name.replace(/_/g, ' ')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(tool.parameters).map(([paramName, paramType]) => (
            <div key={paramName}>
              <label className="text-sm font-medium block mb-1">
                {paramName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </label>
              {paramType === 'string' ? (
                <Input
                  placeholder={`Enter ${paramName}`}
                  value={toolParams[paramName] || ''}
                  onChange={(e) => handleParamChange(paramName, e.target.value)}
                />
              ) : paramType?.includes('|') ? (
                <select
                  className="w-full p-2 border rounded-md bg-background"
                  value={toolParams[paramName] || ''}
                  onChange={(e) => handleParamChange(paramName, e.target.value)}
                >
                  <option value="">Select {paramName}</option>
                  {paramType.split('|').map((option: string) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : paramType === 'number' ? (
                <Input
                  type="number"
                  placeholder={`Enter ${paramName}`}
                  value={toolParams[paramName] || ''}
                  onChange={(e) => handleParamChange(paramName, parseInt(e.target.value) || '')}
                />
              ) : (
                <Input
                  placeholder={`Enter ${paramName}`}
                  value={toolParams[paramName] || ''}
                  onChange={(e) => handleParamChange(paramName, e.target.value)}
                />
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedTool(null)}
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-primary" />
            {isArabic ? 'اسأل عقل - مساعد الموارد البشرية السعودي' : 'Ask Aql - Saudi HR Assistant'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col gap-4">
          {/* Messages */}
          <ScrollArea className="flex-1 h-96" ref={scrollRef}>
            <div className="space-y-4 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="flex-shrink-0">
                      {message.role === 'user' ? (
                        <User className="w-6 h-6 p-1 rounded-full bg-primary text-primary-foreground" />
                      ) : (
                        <Bot className="w-6 h-6 p-1 rounded-full bg-accent text-accent-foreground" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Card className={message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                        <CardContent className="p-3">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </CardContent>
                      </Card>
                      
                      {/* Tool Calls */}
                      {message.toolCalls && message.toolCalls.length > 0 && (
                        <div className="space-y-2 ml-2">
                          {message.toolCalls.map((toolCall, index) => (
                            <div key={index}>
                              {renderToolCall(toolCall)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <Bot className="w-6 h-6 p-1 rounded-full bg-accent text-accent-foreground" />
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isArabic ? 'جاري المعالجة...' : 'Processing...'}</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />

          {/* Tool Parameters */}
          {renderToolParameters()}

          {/* Tool Buttons */}
          <div className="space-y-3">
            <div className="text-sm font-medium">
              {isArabic ? 'الأدوات المتاحة:' : 'Available Tools:'}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {tools.map((tool) => (
                <Button
                  key={tool.name}
                  variant={selectedTool === tool.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToolSelect(tool.name)}
                  className="justify-start text-xs h-auto p-2"
                >
                  <span className="text-base mr-2">{tool.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{tool.name.replace(/_/g, ' ')}</div>
                    <div className="text-xs opacity-70 truncate">{tool.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder={isArabic ? 'اكتب رسالتك أو اختر أداة أعلاه...' : 'Type your message or select a tool above...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSend} 
              disabled={isLoading || (!input.trim() && !selectedTool)}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="text-xs text-muted-foreground">
            {isArabic ? 'أمثلة:' : 'Try:'} "What's our Saudization rate?" • "How many employees do we have?" • "Create a task to review expiring Iqamas"
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AskAqlChat;