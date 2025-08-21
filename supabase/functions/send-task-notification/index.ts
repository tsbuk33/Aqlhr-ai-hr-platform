import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  notification_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { notification_id }: NotificationRequest = await req.json();

    // Get notification details
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .select(`
        *,
        task:tasks(*)
      `)
      .eq('id', notification_id)
      .single();

    if (notificationError || !notification) {
      throw new Error(`Notification not found: ${notification_id}`);
    }

    console.log('Processing notification:', notification);

    // For development: Just log the email that would be sent
    const emailContent = {
      to: notification.to_email || 'no-email@example.com',
      subject: `Task Assignment: ${notification.task?.title || 'Unknown Task'}`,
      html: `
        <h2>Task Assignment Notification</h2>
        <p><strong>Task:</strong> ${notification.task?.title}</p>
        <p><strong>Description:</strong> ${notification.task?.description || 'No description provided'}</p>
        <p><strong>Priority:</strong> ${notification.task?.priority?.toUpperCase()}</p>
        <p><strong>Due Date:</strong> ${notification.task?.due_at ? new Date(notification.task.due_at).toLocaleDateString() : 'No due date'}</p>
        <p><strong>Module:</strong> ${notification.task?.module}</p>
        
        <hr>
        <p><strong>Message:</strong></p>
        <p>${notification.message}</p>
        
        <hr>
        <p><em>This is a development notification. In production, this would be sent via email service (Resend/SendGrid).</em></p>
      `
    };

    console.log('DEV MODE - Email would be sent:', emailContent);

    // Update notification status to sent
    const { error: updateError } = await supabase
      .from('notifications')
      .update({ 
        status: 'sent', 
        sent_at: new Date().toISOString(),
        error_details: { 
          dev_mode: true, 
          would_send_to: emailContent.to,
          processed_at: new Date().toISOString()
        }
      })
      .eq('id', notification_id);

    if (updateError) {
      console.error('Failed to update notification status:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        dev_mode: true,
        message: 'Notification processed (dev mode - logged only)',
        email_preview: emailContent
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in send-task-notification function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        dev_mode: true
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);