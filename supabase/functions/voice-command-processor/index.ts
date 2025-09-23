import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  try {
    console.log('🎤 Voice Command Processor WebSocket connection initiated');

    const { socket, response } = Deno.upgradeWebSocket(req);
    
    // Connect to OpenAI Realtime API
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not found');
      socket.close(1008, 'API key not configured');
      return response;
    }

    console.log('🔌 Connecting to OpenAI Realtime API...');
    
    let openAISocket: WebSocket | null = null;
    let sessionActive = false;

    const connectToOpenAI = async () => {
      try {
        openAISocket = new WebSocket(
          'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
          [],
          {
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'OpenAI-Beta': 'realtime=v1'
            }
          }
        );

        openAISocket.onopen = () => {
          console.log('✅ Connected to OpenAI Realtime API');
          sessionActive = true;
        };

        openAISocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('📨 OpenAI message:', data.type);
            
            // Handle session events
            if (data.type === 'session.created') {
              console.log('🎯 OpenAI session created, sending configuration...');
              
              // Send session configuration after session is created
              const sessionConfig = {
                type: 'session.update',
                session: {
                  modalities: ['text', 'audio'],
                  instructions: `You are an AI assistant for the AqlHR Executive Mobile App. You help executives manage their HR operations through voice commands. 

Available commands you can execute:
1. Generate board reports and presentations
2. Show workforce analytics and metrics
3. Check government compliance status
4. Navigate to different sections of the app
5. Activate emergency protocols
6. Schedule reports and meetings

Respond in a professional, executive-friendly manner. Keep responses concise but informative. When users ask for data or reports, confirm the action and provide brief insights.

If a user makes a request you can handle, respond with function calls to execute the appropriate action.`,
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
                  tools: [
                    {
                      type: 'function',
                      name: 'generate_board_report',
                      description: 'Generate a comprehensive board presentation or executive report',
                      parameters: {
                        type: 'object',
                        properties: {
                          reportType: {
                            type: 'string',
                            enum: ['board-presentation', 'executive-summary', 'kpi-snapshot', 'financial-performance', 'workforce-analytics', 'compliance-report', 'strategic-initiatives'],
                            description: 'Type of report to generate'
                          },
                          language: {
                            type: 'string',
                            enum: ['en', 'ar'],
                            description: 'Language for the report'
                          }
                        },
                        required: ['reportType']
                      }
                    },
                    {
                      type: 'function',
                      name: 'show_workforce_metrics',
                      description: 'Display current workforce analytics and metrics',
                      parameters: {
                        type: 'object',
                        properties: {
                          metricType: {
                            type: 'string',
                            enum: ['overview', 'saudization', 'performance', 'attendance', 'retention'],
                            description: 'Type of workforce metrics to show'
                          }
                        },
                        required: ['metricType']
                      }
                    },
                    {
                      type: 'function',
                      name: 'check_compliance_status',
                      description: 'Check government compliance status across all portals',
                      parameters: {
                        type: 'object',
                        properties: {
                          portalType: {
                            type: 'string',
                            enum: ['all', 'mol', 'gosi', 'nitaqat', 'zatca'],
                            description: 'Specific portal to check or all portals'
                          }
                        },
                        required: ['portalType']
                      }
                    },
                    {
                      type: 'function',
                      name: 'navigate_to_section',
                      description: 'Navigate to a specific section of the executive app',
                      parameters: {
                        type: 'object',
                        properties: {
                          section: {
                            type: 'string',
                            enum: ['dashboard', 'workforce', 'compliance', 'reports', 'analytics', 'calendar', 'documents'],
                            description: 'Section to navigate to'
                          }
                        },
                        required: ['section']
                      }
                    },
                    {
                      type: 'function',
                      name: 'activate_emergency_protocol',
                      description: 'Activate emergency or crisis management protocol',
                      parameters: {
                        type: 'object',
                        properties: {
                          emergencyType: {
                            type: 'string',
                            enum: ['medical', 'security', 'operational', 'natural-disaster'],
                            description: 'Type of emergency'
                          },
                          severity: {
                            type: 'string',
                            enum: ['low', 'medium', 'high', 'critical'],
                            description: 'Severity level of the emergency'
                          }
                        },
                        required: ['emergencyType', 'severity']
                      }
                    }
                  ],
                  tool_choice: 'auto',
                  temperature: 0.7,
                  max_response_output_tokens: 1000
                }
              };

              openAISocket?.send(JSON.stringify(sessionConfig));
            }

            // Forward relevant messages to client
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(event.data);
            }

          } catch (error) {
            console.error('❌ Error processing OpenAI message:', error);
          }
        };

        openAISocket.onerror = (error) => {
          console.error('❌ OpenAI WebSocket error:', error);
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              type: 'error',
              message: 'OpenAI connection error',
              error: error.toString()
            }));
          }
        };

        openAISocket.onclose = (event) => {
          console.log('🔌 OpenAI WebSocket closed:', event.code, event.reason);
          sessionActive = false;
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              type: 'session.disconnected',
              reason: 'OpenAI connection closed'
            }));
          }
        };

      } catch (error) {
        console.error('❌ Failed to connect to OpenAI:', error);
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Failed to connect to OpenAI Realtime API',
            error: error.toString()
          }));
        }
      }
    };

    // Client WebSocket event handlers
    socket.onopen = () => {
      console.log('✅ Client WebSocket connected');
      connectToOpenAI();
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Client message:', data.type);

        // Forward audio and session messages to OpenAI
        if (openAISocket && openAISocket.readyState === WebSocket.OPEN && sessionActive) {
          if (data.type === 'input_audio_buffer.append' || 
              data.type === 'input_audio_buffer.commit' ||
              data.type === 'response.create' ||
              data.type === 'session.update') {
            openAISocket.send(event.data);
          }
        }

        // Handle function call results
        if (data.type === 'conversation.item.create' && data.item?.type === 'function_call_output') {
          if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
            openAISocket.send(event.data);
          }
        }

      } catch (error) {
        console.error('❌ Error processing client message:', error);
      }
    };

    socket.onclose = (event) => {
      console.log('🔌 Client WebSocket closed:', event.code, event.reason);
      if (openAISocket) {
        openAISocket.close();
      }
    };

    socket.onerror = (error) => {
      console.error('❌ Client WebSocket error:', error);
      if (openAISocket) {
        openAISocket.close();
      }
    };

    return response;

  } catch (error) {
    console.error('💥 Voice Command Processor Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to establish voice command connection'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});