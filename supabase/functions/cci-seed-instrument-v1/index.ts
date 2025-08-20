import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { tenantId } = await req.json();

    // Check if survey already exists
    const { data: existingSurvey } = await supabaseClient
      .from('cci_surveys')
      .select('id, wave_count')
      .eq('tenant_id', tenantId)
      .eq('name', 'AqlHR Corporate Culture Diagnostic v1')
      .single();

    if (existingSurvey) {
      const { data: wave } = await supabaseClient
        .from('cci_waves')
        .select('id')
        .eq('survey_id', existingSurvey.id)
        .eq('wave_no', 1)
        .single();

      const { count: itemCount } = await supabaseClient
        .from('cci_survey_items')
        .select('*', { count: 'exact' })
        .eq('survey_id', existingSurvey.id);

      return new Response(JSON.stringify({
        surveyId: existingSurvey.id,
        waveId: wave?.id,
        itemCount: itemCount || 0,
        message: 'Survey already exists'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create new survey
    const { data: survey, error: surveyError } = await supabaseClient
      .from('cci_surveys')
      .insert({
        tenant_id: tenantId,
        name: 'AqlHR Corporate Culture Diagnostic v1',
        language: 'en',
        anonymity_min_n: 7,
        status: 'active'
      })
      .select()
      .single();

    if (surveyError) throw surveyError;

    // Create baseline wave
    const { data: wave, error: waveError } = await supabaseClient
      .from('cci_waves')
      .insert({
        tenant_id: tenantId,
        survey_id: survey.id,
        name: 'Baseline Wave 1',
        wave_no: 1,
        is_baseline: true,
        status: 'active'
      })
      .select()
      .single();

    if (waveError) throw waveError;

    // Survey items with EN/AR text
    const surveyItems = [
      // CVF Items
      { framework: 'cvf', dimension: 'Clan', text_en: 'This organization is like a family. People share a lot of themselves.', text_ar: 'هذه المنظمة تشبه العائلة. الناس يتشاركون الكثير من أنفسهم.', reverse_scored: false },
      { framework: 'cvf', dimension: 'Clan', text_en: 'The leadership is generally considered to exemplify mentoring, facilitating, or nurturing.', text_ar: 'القيادة تُعتبر عموماً مثالاً للتوجيه والتسهيل والرعاية.', reverse_scored: false },
      { framework: 'cvf', dimension: 'Clan', text_en: 'The organization emphasizes human development, trust, openness, and participation.', text_ar: 'المنظمة تركز على تطوير الإنسان والثقة والانفتاح والمشاركة.', reverse_scored: false },
      { framework: 'cvf', dimension: 'Clan', text_en: 'The organization defines success on the basis of development of human resources.', text_ar: 'المنظمة تعرّف النجاح على أساس تطوير الموارد البشرية.', reverse_scored: false },
      { framework: 'cvf', dimension: 'Clan', text_en: 'People rarely collaborate or share personal information here.', text_ar: 'الناس نادراً ما يتعاونون أو يتشاركون المعلومات الشخصية هنا.', reverse_scored: true },
      
      { framework: 'cvf', dimension: 'Adhocracy', text_en: 'This organization is very dynamic and entrepreneurial. People are willing to stick their necks out and take risks.', text_ar: 'هذه المنظمة ديناميكية وريادية جداً. الناس مستعدون للمغامرة وأخذ المخاطر.', reverse_scored: false },
      { framework: 'cvf', dimension: 'Adhocracy', text_en: 'The leadership is generally considered to exemplify entrepreneurship, innovation, or risk-taking.', text_ar: 'القيادة تُعتبر عموماً مثالاً لريادة الأعمال والابتكار وأخذ المخاطر.', reverse_scored: false },
      { framework: 'cvf', dimension: 'Adhocracy', text_en: 'The organization emphasizes acquiring new resources and creating new challenges.', text_ar: 'المنظمة تركز على اكتساب موارد جديدة وخلق تحديات جديدة.', reverse_scored: false },
      { framework: 'cvf', dimension: 'Adhocracy', text_en: 'Innovation and risk-taking are discouraged in this organization.', text_ar: 'الابتكار وأخذ المخاطر محبطان في هذه المنظمة.', reverse_scored: true },
      
      { framework: 'cvf', dimension: 'Market', text_en: 'This organization is very results-oriented. Major concern is with getting the job done.', text_ar: 'هذه المنظمة موجهة نحو النتائج بشدة. الاهتمام الأساسي هو إنجاز العمل.', reverse_scored: false },
      { framework: 'cvf', dimension: 'Market', text_en: 'The leadership is generally considered to exemplify a no-nonsense, aggressive, results-oriented focus.', text_ar: 'القيادة تُعتبر عموماً مثالاً للتركيز الجدي والعدواني الموجه نحو النتائج.', reverse_scored: false },
      { framework: 'cvf', dimension: 'Market', text_en: 'The organization emphasizes competitive actions and achievement.', text_ar: 'المنظمة تركز على الأعمال التنافسية والإنجاز.', reverse_scored: false },
      { framework: 'cvf', dimension: 'Market', text_en: 'Results and goal achievement are not prioritized here.', text_ar: 'النتائج وتحقيق الأهداف ليست أولوية هنا.', reverse_scored: true },
      
      { framework: 'cvf', dimension: 'Hierarchy', text_en: 'This organization is very controlled and structured. Formal procedures govern what people do.', text_ar: 'هذه المنظمة محكومة ومنظمة جداً. الإجراءات الرسمية تحكم ما يفعله الناس.', reverse_scored: false },
      { framework: 'cvf', dimension: 'Hierarchy', text_en: 'The leadership is generally considered to exemplify coordinating, organizing, or smooth-running efficiency.', text_ar: 'القيادة تُعتبر عموماً مثالاً للتنسيق والتنظيم والكفاءة السلسة.', reverse_scored: false },
      { framework: 'cvf', dimension: 'Hierarchy', text_en: 'The organization emphasizes permanence and stability.', text_ar: 'المنظمة تركز على الديمومة والاستقرار.', reverse_scored: false },
      { framework: 'cvf', dimension: 'Hierarchy', text_en: 'Formal procedures and structure are often ignored here.', text_ar: 'الإجراءات الرسمية والهيكل غالباً ما يتم تجاهلها هنا.', reverse_scored: true },

      // Cultural Web Items
      { framework: 'web', dimension: 'Stories', text_en: 'Stories told here reinforce our core values and mission.', text_ar: 'القصص المحكية هنا تعزز قيمنا الأساسية ومهمتنا.', reverse_scored: false },
      { framework: 'web', dimension: 'Stories', text_en: 'People share inspiring examples of success and learning from failures.', text_ar: 'الناس يتشاركون أمثلة ملهمة للنجاح والتعلم من الفشل.', reverse_scored: false },
      { framework: 'web', dimension: 'Stories', text_en: 'The stories people tell here often undermine our stated values.', text_ar: 'القصص التي يحكيها الناس هنا غالباً ما تقوض قيمنا المعلنة.', reverse_scored: true },
      
      { framework: 'web', dimension: 'Symbols', text_en: 'Our symbols and branding reflect what we truly stand for.', text_ar: 'رموزنا وعلامتنا التجارية تعكس ما نقف من أجله حقاً.', reverse_scored: false },
      { framework: 'web', dimension: 'Symbols', text_en: 'Physical spaces and design elements support our culture.', text_ar: 'المساحات المادية وعناصر التصميم تدعم ثقافتنا.', reverse_scored: false },
      { framework: 'web', dimension: 'Symbols', text_en: 'Our symbols send mixed messages about what we value.', text_ar: 'رموزنا ترسل رسائل مختلطة حول ما نقدره.', reverse_scored: true },
      
      { framework: 'web', dimension: 'Power Structures', text_en: 'Power is distributed fairly across the organization.', text_ar: 'السلطة موزعة بعدالة عبر المنظمة.', reverse_scored: false },
      { framework: 'web', dimension: 'Power Structures', text_en: 'Decision-making involves the right people at the right levels.', text_ar: 'صنع القرار يشمل الأشخاص المناسبين في المستويات المناسبة.', reverse_scored: false },
      { framework: 'web', dimension: 'Power Structures', text_en: 'A few people hold most of the real power here.', text_ar: 'عدد قليل من الناس يحتكرون معظم السلطة الحقيقية هنا.', reverse_scored: true },
      
      { framework: 'web', dimension: 'Control Systems', text_en: 'Our performance measures align with our strategic priorities.', text_ar: 'مقاييس أدائنا تتماشى مع أولوياتنا الاستراتيجية.', reverse_scored: false },
      { framework: 'web', dimension: 'Control Systems', text_en: 'We have effective systems for monitoring and improving performance.', text_ar: 'لدينا أنظمة فعالة لمراقبة وتحسين الأداء.', reverse_scored: false },
      { framework: 'web', dimension: 'Control Systems', text_en: 'Our control systems often work against our stated goals.', text_ar: 'أنظمة السيطرة لدينا غالباً ما تعمل ضد أهدافنا المعلنة.', reverse_scored: true },
      
      { framework: 'web', dimension: 'Rituals & Routines', text_en: 'Our regular practices reinforce the behaviors we want to see.', text_ar: 'ممارساتنا المنتظمة تعزز السلوكيات التي نريد رؤيتها.', reverse_scored: false },
      { framework: 'web', dimension: 'Rituals & Routines', text_en: 'Meetings, processes, and routines add real value.', text_ar: 'الاجتماعات والعمليات والروتين تضيف قيمة حقيقية.', reverse_scored: false },
      { framework: 'web', dimension: 'Rituals & Routines', text_en: 'Our routines often feel like empty rituals without purpose.', text_ar: 'روتيننا غالباً ما يبدو كطقوس فارغة بلا هدف.', reverse_scored: true },
      
      { framework: 'web', dimension: 'Organizational Structure', text_en: 'Our structure enables effective collaboration and communication.', text_ar: 'هيكلنا يمكّن التعاون والتواصل الفعال.', reverse_scored: false },
      { framework: 'web', dimension: 'Organizational Structure', text_en: 'Reporting relationships and hierarchy are clear and logical.', text_ar: 'علاقات التبعية والتسلسل الهرمي واضحة ومنطقية.', reverse_scored: false },
      { framework: 'web', dimension: 'Organizational Structure', text_en: 'Our structure creates barriers to getting work done effectively.', text_ar: 'هيكلنا يخلق حواجز لإنجاز العمل بفعالية.', reverse_scored: true },

      // Psychological Safety Items
      { framework: 'psych_safety', dimension: 'Safety', text_en: 'I can show vulnerability and ask for help without fear.', text_ar: 'يمكنني إظهار الضعف وطلب المساعدة دون خوف.', reverse_scored: false },
      { framework: 'psych_safety', dimension: 'Safety', text_en: 'It is safe to take risks and make mistakes here.', text_ar: 'من الآمن أخذ المخاطر وارتكاب الأخطاء هنا.', reverse_scored: false },
      { framework: 'psych_safety', dimension: 'Safety', text_en: 'People feel comfortable being themselves at work.', text_ar: 'الناس يشعرون بالراحة في كونهم أنفسهم في العمل.', reverse_scored: false },
      { framework: 'psych_safety', dimension: 'Safety', text_en: 'It is difficult to discuss problems and tough issues here.', text_ar: 'من الصعب مناقشة المشاكل والقضايا الصعبة هنا.', reverse_scored: true },
      { framework: 'psych_safety', dimension: 'Safety', text_en: 'People often get rejected for being different.', text_ar: 'الناس غالباً ما يتم رفضهم لكونهم مختلفين.', reverse_scored: true },

      // Custom/Additional Items for Saudi Context
      { framework: 'custom', dimension: 'Saudi Vision 2030', text_en: 'Our organization actively supports Saudi Vision 2030 objectives.', text_ar: 'منظمتنا تدعم بنشاط أهداف رؤية السعودية 2030.', reverse_scored: false },
      { framework: 'custom', dimension: 'Saudi Vision 2030', text_en: 'We have clear initiatives aligned with national transformation goals.', text_ar: 'لدينا مبادرات واضحة متماشية مع أهداف التحول الوطني.', reverse_scored: false },
      { framework: 'custom', dimension: 'Saudi Vision 2030', text_en: 'Vision 2030 objectives are rarely considered in our planning.', text_ar: 'أهداف رؤية 2030 نادراً ما تُعتبر في تخطيطنا.', reverse_scored: true },
      
      { framework: 'custom', dimension: 'Saudization & Inclusion', text_en: 'Saudi and non-Saudi employees are treated equally and fairly.', text_ar: 'الموظفون السعوديون وغير السعوديين يعاملون بمساواة وعدالة.', reverse_scored: false },
      { framework: 'custom', dimension: 'Saudization & Inclusion', text_en: 'We have effective programs for developing Saudi talent.', text_ar: 'لدينا برامج فعالة لتطوير المواهب السعودية.', reverse_scored: false },
      { framework: 'custom', dimension: 'Saudization & Inclusion', text_en: 'There are obvious differences in how different nationalities are treated.', text_ar: 'هناك فروق واضحة في كيفية معاملة الجنسيات المختلفة.', reverse_scored: true },

      { framework: 'custom', dimension: 'Digital Transformation', text_en: 'We effectively use technology to improve our work processes.', text_ar: 'نستخدم التكنولوجيا بفعالية لتحسين عمليات عملنا.', reverse_scored: false },
      { framework: 'custom', dimension: 'Digital Transformation', text_en: 'Employees are well-trained on digital tools and systems.', text_ar: 'الموظفون مدربون جيداً على الأدوات والأنظمة الرقمية.', reverse_scored: false },
      { framework: 'custom', dimension: 'Digital Transformation', text_en: 'Our technology often creates more problems than it solves.', text_ar: 'تكنولوجيتنا غالباً ما تخلق مشاكل أكثر مما تحل.', reverse_scored: true },

      { framework: 'custom', dimension: 'Work-Life Balance', text_en: 'The organization respects employees\' personal time and commitments.', text_ar: 'المنظمة تحترم الوقت الشخصي والالتزامات الشخصية للموظفين.', reverse_scored: false },
      { framework: 'custom', dimension: 'Work-Life Balance', text_en: 'There is good support for family responsibilities and religious obligations.', text_ar: 'هناك دعم جيد للمسؤوليات العائلية والالتزامات الدينية.', reverse_scored: false },
      { framework: 'custom', dimension: 'Work-Life Balance', text_en: 'Work demands often interfere with personal and family life.', text_ar: 'متطلبات العمل غالباً ما تتدخل في الحياة الشخصية والعائلية.', reverse_scored: true },

      { framework: 'custom', dimension: 'Learning & Development', text_en: 'Employees have good opportunities for professional growth.', text_ar: 'الموظفون لديهم فرص جيدة للنمو المهني.', reverse_scored: false },
      { framework: 'custom', dimension: 'Learning & Development', text_en: 'The organization invests in developing employee skills and capabilities.', text_ar: 'المنظمة تستثمر في تطوير مهارات وقدرات الموظفين.', reverse_scored: false },
      { framework: 'custom', dimension: 'Learning & Development', text_en: 'There are limited opportunities for learning and career advancement.', text_ar: 'هناك فرص محدودة للتعلم والتقدم المهني.', reverse_scored: true }
    ];

    // Insert survey items
    const itemsToInsert = surveyItems.map((item, index) => ({
      survey_id: survey.id,
      item_code: `item_${String(index + 1).padStart(3, '0')}`,
      text_en: item.text_en,
      text_ar: item.text_ar,
      framework: item.framework,
      dimension: item.dimension,
      scale_min: 1,
      scale_max: 5,
      reverse_scored: item.reverse_scored,
      sort_order: index + 1
    }));

    const { error: itemsError } = await supabaseClient
      .from('cci_survey_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    return new Response(JSON.stringify({
      surveyId: survey.id,
      waveId: wave.id,
      itemCount: surveyItems.length,
      message: 'CCI instrument seeded successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in cci-seed-instrument-v1:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});