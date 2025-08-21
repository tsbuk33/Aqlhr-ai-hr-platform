import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'tool';
  content: string;
}

interface RequestPayload {
  sessionId?: string;
  messages: ChatMessage[];
  lang?: 'en' | 'ar';
  confirm?: boolean;
}

interface ResponsePayload {
  text: string;
  lang: 'en' | 'ar';
  actions?: { label: string; type: 'link' | 'download' | 'navigate'; href?: string }[];
  citations?: { source: string; scope?: string; note?: string }[];
  needsConfirmation?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const payload: RequestPayload = await req.json();
    const { sessionId, messages, lang = 'en', confirm = false } = payload;

    // Resolve tenant ID
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Get user's company ID (tenant)
    const { data: userRoles } = await supabaseClient
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    const tenantId = userRoles?.company_id;
    if (!tenantId) {
      throw new Error('No company found for user');
    }

    // Get or create session
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const { data: newSession } = await supabaseClient
        .from('assistant_sessions')
        .insert({
          tenant_id: tenantId,
          created_by: user.id,
          lang
        })
        .select()
        .single();
      currentSessionId = newSession?.id;
    }

    // Get the latest user message
    const userMessage = messages[messages.length - 1];
    if (!userMessage || userMessage.role !== 'user') {
      throw new Error('No user message found');
    }

    const query = userMessage.content.toLowerCase();
    
    // Intent detection and tool mapping
    const response: ResponsePayload = {
      text: '',
      lang,
      citations: [],
      actions: []
    };

    // Store user message
    await supabaseClient
      .from('assistant_messages')
      .insert({
        tenant_id: tenantId,
        session_id: currentSessionId,
        role: 'user',
        content: userMessage.content
      });

    // Tool routing logic
    if (query.includes('saudization') || query.includes('nitaqat') || query.includes('سعودة') || query.includes('توطين')) {
      // Saudization status
      const { data: headcount } = await supabaseClient.rpc('ask_headcount_v1', { p_tenant: tenantId });
      const { data: saudStatus } = await supabaseClient.rpc('ask_saudization_status_v1', { p_tenant: tenantId });
      
      const hc = headcount?.[0] || { total: 0, saudi: 0, non_saudi: 0, saudization_rate: 0 };
      const status = saudStatus?.[0] || { color: 'red', rate: 0 };

      response.text = lang === 'ar' 
        ? `لدينا ${hc.total} موظف نشط؛ نسبة التوطين ${hc.saudization_rate}% (${status.color === 'green' ? 'أخضر' : status.color === 'yellow' ? 'أصفر' : 'أحمر'}).`
        : `We have ${hc.total} active employees; Saudization is ${hc.saudization_rate}% (${status.color}).`;

      response.citations = [
        { source: 'ask_headcount_v1', scope: `tenant=${tenantId}`, note: 'Latest headcount snapshot' },
        { source: 'ask_saudization_status_v1', scope: `tenant=${tenantId}`, note: 'Nitaqat status calculation' }
      ];

      // Log tool usage
      await supabaseClient
        .from('assistant_tool_logs')
        .insert({
          tenant_id: tenantId,
          tool_name: 'saudization_query',
          requested_by: user.id,
          payload: { query: userMessage.content },
          result_summary: `Saudization: ${hc.saudization_rate}%, Status: ${status.color}`
        });

    } else if (query.includes('expiring') && (query.includes('iqama') || query.includes('هوية') || query.includes('مقيم'))) {
      // Iqama expiring
      const days = 30; // Default to 30 days
      const { data: expiring } = await supabaseClient.rpc('ask_iqama_expiring_summary_v1', { p_tenant: tenantId, p_days: days });
      
      const exp = expiring?.[0] || { days_ahead: days, total: 0, by_department: { en: {}, ar: {} } };
      const deptList = Object.entries(exp.by_department[lang] || {}).slice(0, 3);

      response.text = lang === 'ar'
        ? `خلال ${exp.days_ahead} يومًا القادمة توجد ${exp.total} هويات مقيم مستحقة. أعلى الإدارات: ${deptList.map(([dept, count]) => `${dept}: ${count}`).join('، ')}`
        : `Over the next ${exp.days_ahead} days, ${exp.total} iqamas are due. Top departments: ${deptList.map(([dept, count]) => `${dept}: ${count}`).join(', ')}`;

      if (exp.total === 0) {
        response.text += lang === 'ar' ? '\n\nلا توجد هويات مقيم مستحقة حاليًا.' : '\n\nNo iqamas are currently due for renewal.';
      }

      response.text += lang === 'ar' ? '\n\nعرض مجمع. القوائم التفصيلية تتطلب صلاحيات الموارد البشرية.' : '\n\nAggregated view. Detailed lists require HR privileges.';

      response.citations = [
        { source: 'ask_iqama_expiring_summary_v1', scope: `tenant=${tenantId}, days=${days}`, note: 'PDPL-safe aggregated data' }
      ];

      // Check if user is admin and wants detailed list
      if (query.includes('list') || query.includes('قائمة')) {
        const { data: userRole } = await supabaseClient
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['admin', 'hr_manager', 'super_admin'])
          .limit(1);

        if (userRole && userRole.length > 0) {
          const { data: detailedList } = await supabaseClient.rpc('ask_iqama_expiring_list_admin_v1', { p_tenant: tenantId, p_days: days });
          
          if (detailedList && detailedList.length > 0) {
            response.text += lang === 'ar' 
              ? '\n\nقائمة تفصيلية (للإدارة فقط):\n' 
              : '\n\nDetailed list (admin only):\n';
            
            detailedList.slice(0, 10).forEach((emp: any) => {
              response.text += lang === 'ar'
                ? `• ${emp.full_name_ar || emp.full_name_en} (${emp.employee_no}) - ${emp.dept_ar || emp.dept_en} - تنتهي: ${emp.expiry_date}\n`
                : `• ${emp.full_name_en} (${emp.employee_no}) - ${emp.dept_en} - Expires: ${emp.expiry_date}\n`;
            });

            response.actions?.push({
              label: lang === 'ar' ? 'إنشاء مهام للكل' : 'Create Tasks for All',
              type: 'link',
              href: '/tasks?action=bulk_create&type=iqama_renewal'
            });
          }
        } else {
          response.text += lang === 'ar' 
            ? '\n\nالقوائم التفصيلية متاحة للإدارة فقط.' 
            : '\n\nDetailed lists are only available to administrators.';
        }
      }

    } else if (query.includes('run compliance') || query.includes('autopilot') || query.includes('تشغيل الامتثال')) {
      // Compliance autopilot
      if (!confirm) {
        response.text = lang === 'ar'
          ? 'سيقوم نظام الامتثال التلقائي بمراجعة جميع البيانات وإنشاء المهام والتقارير المطلوبة. هل تريد المتابعة؟'
          : 'The compliance autopilot will review all data and create necessary tasks and reports. Do you want to proceed?';
        response.needsConfirmation = true;
      } else {
        // Run the compliance autopilot
        const { data: runResult } = await supabaseClient.functions.invoke('compliance-autopilot-daily-v1', {
          body: { tenant_id: tenantId }
        });

        response.text = lang === 'ar'
          ? `تم تشغيل نظام الامتثال بنجاح. تم إنشاء ${runResult?.tasks_created || 0} مهمة جديدة.`
          : `Compliance autopilot completed successfully. Created ${runResult?.tasks_created || 0} new tasks.`;
        
        response.actions = [{
          label: lang === 'ar' ? 'عرض المهام' : 'View Tasks',
          type: 'navigate',
          href: '/tasks'
        }];

        response.citations = [
          { source: 'compliance_run_now_v1', scope: `tenant=${tenantId}`, note: 'Automated compliance check' }
        ];
      }

    } else if (query.includes('sync mol') || query.includes('sync qiwa') || query.includes('sync gosi') || query.includes('sync absher') || 
               query.includes('اختبار التكامل') || query.includes('مزامنة') && (query.includes('العمل') || query.includes('قوى') || query.includes('تأمينات') || query.includes('أبشر'))) {
      // Government system sync
      if (!confirm) {
        const system = query.includes('mol') || query.includes('العمل') ? 'MOL' :
                      query.includes('qiwa') || query.includes('قوى') ? 'QIWA' :
                      query.includes('gosi') || query.includes('تأمينات') ? 'GOSI' :
                      query.includes('absher') || query.includes('أبشر') ? 'ABSHER' : 'ALL';
        
        response.text = lang === 'ar'
          ? `سيتم تشغيل مزامنة اختبار مع نظام ${system}. هل تريد المتابعة؟`
          : `This will run a test sync with ${system} system. Do you want to proceed?`;
        response.needsConfirmation = true;
      } else {
        // Check if user has admin access
        const { data: userRole } = await supabaseClient
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['admin', 'hr_manager', 'super_admin'])
          .limit(1);

        if (!userRole || userRole.length === 0) {
          response.text = lang === 'ar'
            ? 'عذرًا، تحتاج صلاحيات إدارية لتشغيل مزامنة الأنظمة الحكومية.'
            : 'Sorry, you need administrative permissions to sync government systems.';
          return;
        }

        // Determine which system to sync
        const system = query.includes('mol') || query.includes('العمل') ? 'mol' :
                      query.includes('qiwa') || query.includes('قوى') ? 'qiwa' :
                      query.includes('gosi') || query.includes('تأمينات') ? 'gosi' :
                      query.includes('absher') || query.includes('أبشر') ? 'absher' : 'all';
        
        let syncResult;
        if (system === 'all') {
          syncResult = await supabaseClient.functions.invoke('gov_sync_all_v1', {
            body: { tenantId, testMode: true }
          });
        } else {
          syncResult = await supabaseClient.functions.invoke(`gov_sync_${system}_v1`, {
            body: { tenantId, testMode: true }
          });
        }

        if (syncResult.error) {
          response.text = lang === 'ar'
            ? `حدث خطأ أثناء المزامنة: ${syncResult.error.message}`
            : `Sync error: ${syncResult.error.message}`;
        } else {
          const changes = syncResult.data?.changes || syncResult.data?.summary?.total_changes || 0;
          response.text = lang === 'ar'
            ? `تمت المزامنة بنجاح مع ${system.toUpperCase()}. تم استلام ${changes} تحديث.`
            : `Successfully synced with ${system.toUpperCase()}. Received ${changes} updates.`;
          
          response.actions = [{
            label: lang === 'ar' ? 'عرض التغييرات' : 'View Changes',
            type: 'navigate',
            href: '/integrations'
          }];
        }

        response.citations = [
          { source: `gov_sync_${system}_v1`, scope: `tenant=${tenantId}, testMode=true`, note: 'Government system sync' }
        ];
      }

    } else if (query.includes('integration status') || query.includes('حالة التكامل') || query.includes('تكاملات')) {
      // Integration status
      const { data: govStatus } = await supabaseClient.rpc('gov_get_status_v1', { p_tenant: tenantId });
      const { data: overview } = await supabaseClient.rpc('integrations_overview_v2', { p_tenant: tenantId });
      
      const govSystems = govStatus || [];
      const overviewData = overview || [];
      const govGroup = overviewData.find((o: any) => o.integration_group === 'gov');
      const toolsGroup = overviewData.find((o: any) => o.integration_group === 'tools');

      let statusText = '';
      if (lang === 'ar') {
        statusText = `حالة التكاملات:\n`;
        statusText += `• الأنظمة الحكومية: ${govGroup?.connected || 0}/${govGroup?.total || 0} متصل\n`;
        statusText += `• الأدوات الأخرى: ${toolsGroup?.connected || 0}/${toolsGroup?.total || 0} متصل\n\n`;
        
        if (govSystems.length > 0) {
          statusText += `تفاصيل الأنظمة الحكومية:\n`;
          govSystems.forEach((sys: any) => {
            const sysName = sys.system === 'MOL' ? 'وزارة العمل' :
                           sys.system === 'QIWA' ? 'قوى' :
                           sys.system === 'GOSI' ? 'التأمينات' :
                           sys.system === 'ABSHER' ? 'أبشر' : sys.system;
            const status = sys.status === 'connected' ? 'متصل' : 
                          sys.status === 'error' ? 'خطأ' : 'في الانتظار';
            const lastSync = sys.last_sync ? new Date(sys.last_sync).toLocaleDateString('ar-SA') : 'لم يتم';
            statusText += `• ${sysName}: ${status} (آخر مزامنة: ${lastSync})\n`;
          });
        }
      } else {
        statusText = `Integration Status:\n`;
        statusText += `• Government Systems: ${govGroup?.connected || 0}/${govGroup?.total || 0} connected\n`;
        statusText += `• Other Tools: ${toolsGroup?.connected || 0}/${toolsGroup?.total || 0} connected\n\n`;
        
        if (govSystems.length > 0) {
          statusText += `Government System Details:\n`;
          govSystems.forEach((sys: any) => {
            const lastSync = sys.last_sync ? new Date(sys.last_sync).toLocaleDateString() : 'Never';
            statusText += `• ${sys.system}: ${sys.status} (Last sync: ${lastSync})\n`;
          });
        }
      }

      response.text = statusText;
      response.actions = [{
        label: lang === 'ar' ? 'إدارة التكاملات' : 'Manage Integrations',
        type: 'navigate',
        href: '/integrations'
      }];

      response.citations = [
        { source: 'gov_get_status_v1', scope: `tenant=${tenantId}`, note: 'Government adapter status' },
        { source: 'integrations_overview_v2', scope: `tenant=${tenantId}`, note: 'Integration overview' }
      ];

    } else if (query.includes('create task') || query.includes('إنشاء مهمة')) {
      if (!confirm) {
        response.text = lang === 'ar'
          ? 'سيتم إنشاء مهمة جديدة. يرجى تأكيد المتابعة.'
          : 'A new task will be created. Please confirm to proceed.';
        response.needsConfirmation = true;
      } else {
        // Create a task - this is a simplified version, you'd want to extract more details from the message
        const { data: newTask } = await supabaseClient.rpc('task_create_v1', {
          p_tenant_id: tenantId,
          p_module: 'assistant',
          p_title: lang === 'ar' ? 'مهمة من المساعد الذكي' : 'Task from AI Assistant',
          p_description: userMessage.content,
          p_priority: 'medium'
        });

        response.text = lang === 'ar'
          ? `تم إنشاء المهمة بنجاح. رقم المهمة: ${newTask}`
          : `Task created successfully. Task ID: ${newTask}`;
        
        response.actions = [{
          label: lang === 'ar' ? 'عرض المهام' : 'View Tasks',
          type: 'navigate',
          href: '/tasks'
        }];
      }

    } else if (query.includes('export') && (query.includes('cci') || query.includes('pdf') || query.includes('تصدير'))) {
      // CCI Export
      const exportLang = query.includes('arabic') || query.includes('عربي') ? 'ar' : 'en';
      const format = query.includes('ppt') || query.includes('powerpoint') ? 'ppt' : 'pdf';
      
      response.text = lang === 'ar'
        ? `سيتم تصدير تقرير الثقافة التنظيمية بصيغة ${format} باللغة ${exportLang === 'ar' ? 'العربية' : 'الإنجليزية'}.`
        : `Exporting CCI report in ${format} format in ${exportLang === 'ar' ? 'Arabic' : 'English'}.`;

      response.actions = [{
        label: lang === 'ar' ? 'تحميل التقرير' : 'Download Report',
        type: 'download',
        href: `/api/cci-export?format=${format}&lang=${exportLang}`
      }];

      response.citations = [
        { source: 'cci_export_pdf_v1', scope: `tenant=${tenantId}, format=${format}, lang=${exportLang}`, note: 'CCI executive report export' }
      ];

    } else if (query.includes('find') && (query.includes('evidence') || query.includes('document') || query.includes('بحث') || query.includes('دليل'))) {
      // Evidence search
      const { data: evidence } = await supabaseClient.rpc('ask_search_evidence_v1', { 
        p_tenant: tenantId, 
        p_query: userMessage.content, 
        p_limit: 5 
      });

      if (evidence && evidence.length > 0) {
        response.text = lang === 'ar'
          ? `وجدت ${evidence.length} نتيجة:\n\n`
          : `Found ${evidence.length} results:\n\n`;
        
        evidence.forEach((item: any) => {
          response.text += lang === 'ar'
            ? `• ${item.title}\n  العلامات: ${item.tags?.join(', ') || 'لا توجد'}\n\n`
            : `• ${item.title}\n  Tags: ${item.tags?.join(', ') || 'None'}\n\n`;
        });

        response.actions = [{
          label: lang === 'ar' ? 'عرض جميع الأدلة' : 'View All Evidence',
          type: 'navigate',
          href: '/evidence'
        }];
      } else {
        response.text = lang === 'ar'
          ? 'لم يتم العثور على أدلة مطابقة لطلبك.'
          : 'No evidence found matching your request.';
      }

      response.citations = [
        { source: 'ask_search_evidence_v1', scope: `tenant=${tenantId}, query="${userMessage.content}"`, note: 'Vector-based evidence search' }
      ];

    } else {
      // Default response for unrecognized queries
      response.text = lang === 'ar'
        ? 'أعتذر، لم أتمكن من فهم طلبك. يمكنني مساعدتك في:\n• استعلامات التوطين\n• هويات المقيم المنتهية\n• تشغيل فحص الامتثال\n• تصدير التقارير\n• البحث عن الأدلة'
        : 'I apologize, I didn\'t understand your request. I can help you with:\n• Saudization queries\n• Expiring iqamas\n• Running compliance checks\n• Exporting reports\n• Finding evidence';
    }

    // Store assistant response
    await supabaseClient
      .from('assistant_messages')
      .insert({
        tenant_id: tenantId,
        session_id: currentSessionId,
        role: 'assistant',
        content: response.text,
        tool_name: 'ask_aql_router',
        tool_result: response
      });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ask-aql-router-v1:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      text: 'Sorry, I encountered an error processing your request.',
      lang: 'en'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});