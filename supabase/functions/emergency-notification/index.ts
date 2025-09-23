import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚨 Emergency Notification Function called');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { incident, notifyContacts, activateProtocols, language } = await req.json();

    console.log('🚨 Processing emergency:', {
      type: incident.type,
      severity: incident.severity,
      title: incident.title
    });

    const notifications = [];
    
    // 1. Log the emergency incident
    const { data: loggedIncident, error: logError } = await supabaseClient
      .from('crisis_incidents')
      .insert({
        incident_type: incident.type,
        severity_level: incident.severity,
        title: incident.title,
        description: incident.description,
        location: incident.location,
        reported_by: incident.reportedBy,
        status: 'active',
        affected_departments: incident.affectedDepartments,
        estimated_impact: incident.estimatedImpact,
        current_actions: incident.currentActions
      })
      .select()
      .single();

    if (logError) {
      console.error('❌ Failed to log incident:', logError);
    } else {
      console.log('✅ Emergency incident logged with ID:', loggedIncident?.id);
    }

    // 2. Notify emergency contacts if requested
    if (notifyContacts) {
      const emergencyContacts = await getEmergencyContacts(supabaseClient, incident.type, incident.severity);
      
      for (const contact of emergencyContacts) {
        try {
          // Send SMS notification (mock - would integrate with SMS service)
          const smsResult = await sendEmergencySMS(contact, incident, language);
          notifications.push({
            type: 'sms',
            contact: contact.name,
            status: smsResult.success ? 'sent' : 'failed',
            message: smsResult.message
          });

          // Send email notification (mock - would integrate with email service)
          const emailResult = await sendEmergencyEmail(contact, incident, language);
          notifications.push({
            type: 'email',
            contact: contact.name,
            status: emailResult.success ? 'sent' : 'failed',
            message: emailResult.message
          });

          // Log notification attempt
          await supabaseClient
            .from('emergency_notifications')
            .insert({
              incident_id: loggedIncident?.id,
              contact_id: contact.id,
              notification_type: 'emergency_alert',
              status: 'sent',
              sent_via: ['sms', 'email'],
              language: language
            });

        } catch (error) {
          console.error(`❌ Failed to notify ${contact.name}:`, error);
          notifications.push({
            type: 'error',
            contact: contact.name,
            status: 'failed',
            message: error.message
          });
        }
      }
    }

    // 3. Activate emergency protocols if requested
    let protocolsActivated = [];
    if (activateProtocols) {
      protocolsActivated = await activateEmergencyProtocols(supabaseClient, incident);
    }

    // 4. Send real-time alerts to connected executive apps
    await broadcastEmergencyAlert(supabaseClient, incident);

    // 5. Generate emergency response plan
    const responsePlan = await generateEmergencyResponsePlan(incident, language);

    console.log('✅ Emergency notification processing completed');

    return new Response(
      JSON.stringify({
        success: true,
        incidentId: loggedIncident?.id,
        notificationsSent: notifications.length,
        notifications,
        protocolsActivated,
        responsePlan,
        timestamp: new Date().toISOString(),
        message: language === 'ar' 
          ? 'تم تفعيل بروتوكول الطوارئ وإرسال التنبيهات بنجاح'
          : 'Emergency protocol activated and notifications sent successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('💥 Emergency Notification Error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to process emergency notification'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function getEmergencyContacts(supabaseClient: any, incidentType: string, severity: string) {
  console.log('📞 Getting emergency contacts for:', incidentType, severity);
  
  // Mock emergency contacts - in real implementation, would query database
  const allContacts = [
    {
      id: 'contact_001',
      name: 'Dr. Sarah Al-Mahmoud',
      nameAr: 'د. سارة المحمود',
      role: 'Chief Medical Officer',
      phone: '+966-50-123-4567',
      email: 'sarah.almahmoud@company.com',
      specialties: ['medical', 'safety'],
      priority: 1
    },
    {
      id: 'contact_002',
      name: 'Ahmed Al-Rashid',
      nameAr: 'أحمد الراشد',
      role: 'Security Chief',
      phone: '+966-50-234-5678',
      email: 'ahmed.alrashid@company.com',
      specialties: ['security', 'operational'],
      priority: 1
    },
    {
      id: 'contact_003',
      name: 'Fatima Al-Zahra',
      nameAr: 'فاطمة الزهراء',
      role: 'Legal Counsel',
      phone: '+966-50-345-6789',
      email: 'fatima.alzahra@company.com',
      specialties: ['regulatory', 'legal'],
      priority: 2
    },
    {
      id: 'contact_004',
      name: 'Mohammed Al-Qarni',
      nameAr: 'محمد القرني',
      role: 'CEO',
      phone: '+966-50-456-7890',
      email: 'mohammed.alqarni@company.com',
      specialties: ['all'],
      priority: 1
    }
  ];

  // Filter contacts based on incident type and severity
  let relevantContacts = allContacts.filter(contact => 
    contact.specialties.includes(incidentType) || 
    contact.specialties.includes('all') ||
    (severity === 'critical' && contact.priority === 1)
  );

  // For critical incidents, notify all priority 1 contacts
  if (severity === 'critical') {
    relevantContacts = allContacts.filter(contact => contact.priority === 1);
  }

  console.log(`📞 Found ${relevantContacts.length} relevant contacts`);
  return relevantContacts;
}

async function sendEmergencySMS(contact: any, incident: any, language: string) {
  console.log('📱 Sending emergency SMS to:', contact.name);
  
  // Mock SMS sending - would integrate with SMS service like Twilio
  const message = language === 'ar' 
    ? `🚨 تنبيه طوارئ
${incident.title}
النوع: ${incident.type}
الخطورة: ${incident.severity}
الموقع: ${incident.location || 'غير محدد'}
الوقت: ${new Date().toLocaleString('ar-SA')}

يرجى الاستجابة فوراً.`
    : `🚨 EMERGENCY ALERT
${incident.title}
Type: ${incident.type}
Severity: ${incident.severity}
Location: ${incident.location || 'Not specified'}
Time: ${new Date().toLocaleString()}

Please respond immediately.`;

  // Simulate SMS API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    message: `SMS sent to ${contact.phone}`,
    content: message
  };
}

async function sendEmergencyEmail(contact: any, incident: any, language: string) {
  console.log('📧 Sending emergency email to:', contact.email);
  
  const subject = language === 'ar' 
    ? `🚨 تنبيه طوارئ فوري - ${incident.title}`
    : `🚨 URGENT EMERGENCY ALERT - ${incident.title}`;

  const body = language === 'ar' 
    ? `عزيزي/عزيزتي ${contact.nameAr || contact.name},

تم الإبلاغ عن حالة طوارئ تتطلب انتباهك الفوري:

📋 تفاصيل الحادث:
• النوع: ${incident.type}
• مستوى الخطورة: ${incident.severity}
• العنوان: ${incident.title}
• الوصف: ${incident.description}
• الموقع: ${incident.location || 'غير محدد'}
• المُبلغ: ${incident.reportedBy}
• الوقت: ${new Date().toLocaleString('ar-SA')}

🚨 الإجراءات المطلوبة:
${incident.currentActions?.map((action: string, index: number) => `${index + 1}. ${action}`).join('\n') || 'لا توجد إجراءات محددة'}

يرجى الاستجابة الفورية والتواصل مع فريق الطوارئ.

تحياتي،
نظام إدارة الطوارئ - AqlHR`
    : `Dear ${contact.name},

An emergency incident has been reported that requires your immediate attention:

📋 Incident Details:
• Type: ${incident.type}
• Severity Level: ${incident.severity}
• Title: ${incident.title}
• Description: ${incident.description}
• Location: ${incident.location || 'Not specified'}
• Reported By: ${incident.reportedBy}
• Time: ${new Date().toLocaleString()}

🚨 Required Actions:
${incident.currentActions?.map((action: string, index: number) => `${index + 1}. ${action}`).join('\n') || 'No specific actions defined'}

Please respond immediately and coordinate with the emergency response team.

Best regards,
Emergency Management System - AqlHR`;

  // Simulate email API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    success: true,
    message: `Email sent to ${contact.email}`,
    subject,
    body
  };
}

async function activateEmergencyProtocols(supabaseClient: any, incident: any) {
  console.log('🔒 Activating emergency protocols for:', incident.type);
  
  const protocols = [];
  
  // Define protocols based on incident type
  const protocolMap: any = {
    medical: [
      'Medical response team dispatch',
      'Secure incident area',
      'Notify healthcare authorities',
      'Prepare medical documentation'
    ],
    security: [
      'Security lockdown activation',
      'Access control enforcement',
      'Law enforcement notification',
      'Evidence preservation'
    ],
    operational: [
      'Business continuity plan activation',
      'Backup systems engagement',
      'Stakeholder notification',
      'Alternative operations setup'
    ],
    natural: [
      'Evacuation procedures initiation',
      'Emergency shelter preparation',
      'Communication systems backup',
      'Recovery planning activation'
    ]
  };

  const relevantProtocols = protocolMap[incident.type] || ['Generic emergency response'];
  
  for (const protocol of relevantProtocols) {
    try {
      // Log protocol activation
      await supabaseClient
        .from('emergency_protocols')
        .insert({
          incident_type: incident.type,
          protocol_name: protocol,
          activation_time: new Date().toISOString(),
          status: 'activated',
          severity_level: incident.severity
        });

      protocols.push({
        name: protocol,
        status: 'activated',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error(`❌ Failed to activate protocol ${protocol}:`, error);
      protocols.push({
        name: protocol,
        status: 'failed',
        error: error.message
      });
    }
  }

  console.log(`✅ Activated ${protocols.length} emergency protocols`);
  return protocols;
}

async function broadcastEmergencyAlert(supabaseClient: any, incident: any) {
  console.log('📡 Broadcasting emergency alert to connected apps');
  
  // Use Supabase Realtime to broadcast to all connected executive apps
  const alertData = {
    type: 'emergency_alert',
    incident: {
      id: incident.id,
      type: incident.type,
      severity: incident.severity,
      title: incident.title,
      description: incident.description,
      timestamp: new Date().toISOString()
    },
    actions: incident.currentActions || []
  };

  // Broadcast through Supabase Realtime
  await supabaseClient
    .channel('emergency_alerts')
    .send({
      type: 'broadcast',
      event: 'emergency_incident',
      payload: alertData
    });

  console.log('✅ Emergency alert broadcasted');
}

async function generateEmergencyResponsePlan(incident: any, language: string) {
  console.log('📋 Generating emergency response plan');
  
  const isArabic = language === 'ar';
  
  const responsePlans: any = {
    medical: {
      title: isArabic ? 'خطة الاستجابة للطوارئ الطبية' : 'Medical Emergency Response Plan',
      steps: isArabic ? [
        'تقييم فوري للحالة الطبية',
        'استدعاء الطاقم الطبي المختص',
        'تأمين المنطقة وعزل المصاب',
        'إخطار الإدارة والعائلة',
        'توثيق الحادث والمتابعة'
      ] : [
        'Immediate medical assessment',
        'Call specialized medical team',
        'Secure area and isolate patient',
        'Notify management and family',
        'Document incident and follow up'
      ]
    },
    security: {
      title: isArabic ? 'خطة الاستجابة للطوارئ الأمنية' : 'Security Emergency Response Plan',
      steps: isArabic ? [
        'تفعيل إنذار الأمن',
        'إخلاء المنطقة المتأثرة',
        'إخطار الجهات الأمنية',
        'تأمين الأدلة والشهود',
        'التحقيق ومتابعة الإجراءات'
      ] : [
        'Activate security alert',
        'Evacuate affected area',
        'Notify security authorities',
        'Secure evidence and witnesses',
        'Investigation and follow-up procedures'
      ]
    }
  };

  const plan = responsePlans[incident.type] || {
    title: isArabic ? 'خطة الاستجابة العامة للطوارئ' : 'General Emergency Response Plan',
    steps: isArabic ? [
      'تقييم الوضع',
      'تفعيل فريق الاستجابة',
      'اتخاذ الإجراءات الوقائية',
      'إخطار الجهات المعنية',
      'المتابعة والتقييم'
    ] : [
      'Assess the situation',
      'Activate response team',
      'Take preventive measures',
      'Notify relevant authorities',
      'Follow-up and evaluation'
    ]
  };

  return {
    ...plan,
    generatedAt: new Date().toISOString(),
    incidentId: incident.id,
    estimatedDuration: '2-4 hours',
    priority: incident.severity === 'critical' ? 'HIGHEST' : 'HIGH'
  };
}