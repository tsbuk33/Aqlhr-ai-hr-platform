import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}

interface ToolCall {
  tool: string;
  parameters: any;
  result?: any;
  loading?: boolean;
}

interface ToolDefinition {
  name: string;
  description: string;
  icon: string;
  parameters: Record<string, any>;
}

export const useAskAql = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Saudi HR AI Assistant. I can help you with headcount, Saudization rates, create tasks, export reports, and find documents. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const tools: ToolDefinition[] = [
    {
      name: 'get_headcount',
      description: 'Get current active employee headcount',
      icon: '👥',
      parameters: {}
    },
    {
      name: 'get_saudization',
      description: 'Get Saudization rate and compliance status',
      icon: '🇸🇦',
      parameters: {}
    },
    {
      name: 'create_task',
      description: 'Create a task or reminder',
      icon: '✅',
      parameters: {
        title: 'string',
        description: 'string',
        priority: 'low|medium|high|urgent',
        due_days: 'number'
      }
    },
    {
      name: 'export_cci_pdf',
      description: 'Export CCI survey results as PDF',
      icon: '📄',
      parameters: {
        survey_id: 'string'
      }
    },
    {
      name: 'find_document',
      description: 'Search for documents using AI',
      icon: '🔍',
      parameters: {
        query: 'string',
        document_type: 'string'
      }
    }
  ];

  const executeTool = async (tool: string, parameters: any, userMessage: string) => {
    try {
      setIsLoading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get tenant ID (company ID)
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      if (!userRoles) throw new Error('User company not found');

      const { data, error } = await supabase.functions.invoke('ask-aql-tools', {
        body: {
          tool,
          parameters,
          tenantId: userRoles.company_id,
          userId: user.id,
          prompt: userMessage
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Tool execution error:', error);
      toast({
        title: "Tool Error",
        description: error instanceof Error ? error.message : 'Tool execution failed',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string, selectedTool?: string, toolParams?: any) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let assistantResponse = '';
      let toolCalls: ToolCall[] = [];

      if (selectedTool) {
        // Execute specific tool
        const toolCall: ToolCall = {
          tool: selectedTool,
          parameters: toolParams || {},
          loading: true
        };
        toolCalls = [toolCall];

        // Update message with loading tool call
        const tempAssistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Executing ${selectedTool}...`,
          timestamp: new Date(),
          toolCalls
        };
        setMessages(prev => [...prev, tempAssistantMessage]);

        try {
          const result = await executeTool(selectedTool, toolParams || {}, content);
          toolCall.result = result;
          toolCall.loading = false;

          // Format response based on tool
          assistantResponse = formatToolResponse(selectedTool, result);
        } catch (error) {
          toolCall.loading = false;
          assistantResponse = `Sorry, I encountered an error while executing ${selectedTool}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }

        // Update the message with final result
        setMessages(prev => prev.map(msg => 
          msg.id === tempAssistantMessage.id 
            ? { ...msg, content: assistantResponse, toolCalls }
            : msg
        ));
      } else {
        // Parse natural language to determine tools needed
        const detectedTools = detectToolsFromMessage(content);
        
        if (detectedTools.length > 0) {
          assistantResponse = "I'll help you with that. Let me gather the information...";
          
          for (const detectedTool of detectedTools) {
            try {
              const result = await executeTool(detectedTool.tool, detectedTool.parameters, content);
              toolCalls.push({
                tool: detectedTool.tool,
                parameters: detectedTool.parameters,
                result
              });
            } catch (error) {
              console.error(`Error executing ${detectedTool.tool}:`, error);
            }
          }

          // Format comprehensive response
          assistantResponse = formatMultiToolResponse(toolCalls, content);
        } else {
          assistantResponse = "I can help you with headcount, Saudization rates, creating tasks, exporting reports, and finding documents. You can use the tool buttons below or ask me directly!";
        }

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: assistantResponse,
          timestamp: new Date(),
          toolCalls: toolCalls.length > 0 ? toolCalls : undefined
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const detectToolsFromMessage = (message: string): Array<{tool: string, parameters: any}> => {
    const lowerMessage = message.toLowerCase();
    const detectedTools: Array<{tool: string, parameters: any}> = [];

    // Detect headcount queries
    if (lowerMessage.includes('headcount') || lowerMessage.includes('how many employees') || lowerMessage.includes('employee count')) {
      detectedTools.push({ tool: 'get_headcount', parameters: {} });
    }

    // Detect Saudization queries
    if (lowerMessage.includes('saudization') || lowerMessage.includes('saudi ratio') || lowerMessage.includes('nitaqat') || lowerMessage.includes('iqama')) {
      detectedTools.push({ tool: 'get_saudization', parameters: {} });
    }

    // Detect task creation
    if (lowerMessage.includes('create task') || lowerMessage.includes('reminder') || lowerMessage.includes('follow up')) {
      const title = extractTaskTitle(message);
      detectedTools.push({ 
        tool: 'create_task', 
        parameters: { 
          title: title || 'Follow-up Task',
          description: `Task created from: ${message}`,
          priority: 'medium',
          due_days: 7
        } 
      });
    }

    return detectedTools;
  };

  const extractTaskTitle = (message: string): string => {
    // Simple extraction - in production this would be more sophisticated
    const taskMatch = message.match(/create.*task.*?([^.!?]+)/i);
    return taskMatch ? taskMatch[1].trim() : '';
  };

  const formatToolResponse = (tool: string, result: any): string => {
    if (result.error) {
      return `I encountered an error: ${result.error}`;
    }

    switch (tool) {
      case 'get_headcount':
        const headcount = result.data;
        return `**Current Headcount Summary**\n\n` +
               `• **Total Active Employees:** ${headcount.total_active_employees}\n` +
               `• **Saudi Employees:** ${headcount.saudi_employees}\n` +
               `• **Non-Saudi Employees:** ${headcount.non_saudi_employees}\n\n` +
               `*${result.source} - ${result.scope}*`;

      case 'get_saudization':
        const saud = result.data;
        return `**Saudization Status**\n\n` +
               `• **Saudization Rate:** ${saud.saudization_rate}%\n` +
               `• **Total Employees:** ${saud.total_employees}\n` +
               `• **Saudi Employees:** ${saud.saudi_employees}\n` +
               `• **Iqamas Expiring (30 days):** ${saud.iqamas_expiring_30_days}\n` +
               `• **Compliance Status:** ${saud.compliance_status}\n\n` +
               `*${result.source} - ${result.scope}*`;

      case 'create_task':
        const task = result.data;
        return `**Task Created Successfully** ✅\n\n` +
               `• **Title:** ${task.title}\n` +
               `• **Priority:** ${task.priority}\n` +
               `• **Due Date:** ${new Date(task.due_date).toLocaleDateString()}\n\n` +
               `*${result.source}*`;

      default:
        return `Tool executed successfully. Check the details in the tool call data.`;
    }
  };

  const formatMultiToolResponse = (toolCalls: ToolCall[], originalMessage: string): string => {
    let response = "Here's what I found:\n\n";
    
    toolCalls.forEach(call => {
      if (call.result && !call.result.error) {
        response += formatToolResponse(call.tool, call.result) + "\n\n";
      }
    });

    // Add contextual suggestions
    const saudizationCall = toolCalls.find(call => call.tool === 'get_saudization');
    if (saudizationCall?.result?.data?.iqamas_expiring_30_days > 0) {
      response += "💡 **Suggestion:** I noticed you have Iqamas expiring soon. Would you like me to create a follow-up task to review these cases?";
    }

    return response;
  };

  return {
    messages,
    isLoading,
    tools,
    sendMessage,
    executeTool
  };
};