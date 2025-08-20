import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SurveyItem {
  item_key: string;
  question_text_en: string;
  question_text_ar: string;
  framework: string;
  dimension: string;
  scale_type: string;
  scale_min: number;
  scale_max: number;
  reverse_scored: boolean;
  sort_order: number;
}

const CVF_ITEMS: Omit<SurveyItem, 'sort_order'>[] = [
  // Clan Culture (5 items)
  { item_key: 'cvf_clan_1', question_text_en: 'Our organization is a very personal place. It is like an extended family. People seem to share a lot of themselves.', question_text_ar: 'منظمتنا مكان شخصي جداً. إنها مثل العائلة الممتدة. يبدو أن الناس يشاركون الكثير من أنفسهم.', framework: 'CVF', dimension: 'Clan', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'cvf_clan_2', question_text_en: 'The leadership in the organization is generally considered to exemplify mentoring, facilitating, or nurturing.', question_text_ar: 'تعتبر القيادة في المنظمة بشكل عام مثالاً على التوجيه والتسهيل والرعاية.', framework: 'CVF', dimension: 'Clan', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'cvf_clan_3', question_text_en: 'The management style in the organization is characterized by teamwork, consensus, and participation.', question_text_ar: 'يتميز أسلوب الإدارة في المنظمة بالعمل الجماعي والإجماع والمشاركة.', framework: 'CVF', dimension: 'Clan', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'cvf_clan_4', question_text_en: 'The glue that holds the organization together is loyalty and mutual trust. Commitment to this organization runs high.', question_text_ar: 'الرابطة التي تجمع المنظمة هي الولاء والثقة المتبادلة. الالتزام بهذه المنظمة عالٍ.', framework: 'CVF', dimension: 'Clan', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'cvf_clan_5', question_text_en: 'The organization emphasizes human development. High trust, openness, and participation persist.', question_text_ar: 'تؤكد المنظمة على التنمية البشرية. الثقة العالية والانفتاح والمشاركة مستمرة.', framework: 'CVF', dimension: 'Clan', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },

  // Adhocracy Culture (5 items)
  { item_key: 'cvf_adhoc_1', question_text_en: 'The organization is a very dynamic and entrepreneurial place. People are willing to stick their necks out and take risks.', question_text_ar: 'المنظمة مكان ديناميكي وريادي جداً. الناس مستعدون للمخاطرة وتحمل المسؤولية.', framework: 'CVF', dimension: 'Adhocracy', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'cvf_adhoc_2', question_text_en: 'The leadership in the organization is generally considered to exemplify entrepreneurship, innovation, or risk taking.', question_text_ar: 'تعتبر القيادة في المنظمة بشكل عام مثالاً على ريادة الأعمال والابتكار أو المخاطرة.', framework: 'CVF', dimension: 'Adhocracy', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'cvf_adhoc_3', question_text_en: 'The management style in the organization is characterized by individual risk taking, innovation, freedom, and uniqueness.', question_text_ar: 'يتميز أسلوب الإدارة في المنظمة بالمخاطرة الفردية والابتكار والحرية والتفرد.', framework: 'CVF', dimension: 'Adhocracy', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'cvf_adhoc_4', question_text_en: 'The glue that holds the organization together is commitment to innovation and development. There is an emphasis on being on the cutting edge.', question_text_ar: 'الرابطة التي تجمع المنظمة هي الالتزام بالابتكار والتطوير. هناك تركيز على أن نكون في المقدمة.', framework: 'CVF', dimension: 'Adhocracy', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'cvf_adhoc_5', question_text_en: 'The organization emphasizes acquiring new resources and creating new challenges. Trying new things and prospecting for opportunities are valued.', question_text_ar: 'تؤكد المنظمة على اكتساب موارد جديدة وخلق تحديات جديدة. تجريب أشياء جديدة والبحث عن الفرص أمور مقدرة.', framework: 'CVF', dimension: 'Adhocracy', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },

  // Market Culture (5 items)
  { item_key: 'cvf_market_1', question_text_en: 'The organization is very results-oriented. A major concern is with getting the job done. People are very competitive and achievement-oriented.', question_text_ar: 'المنظمة موجهة نحو النتائج بشدة. الاهتمام الرئيسي هو إنجاز العمل. الناس تنافسيون جداً وموجهون نحو الإنجاز.', framework: 'CVF', dimension: 'Market', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'cvf_market_2', question_text_en: 'The leadership in the organization is generally considered to exemplify a no-nonsense, aggressive, results-oriented focus.', question_text_ar: 'تعتبر القيادة في المنظمة بشكل عام مثالاً على التركيز الجدي والعدواني الموجه نحو النتائج.', framework: 'CVF', dimension: 'Market', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'cvf_market_3', question_text_en: 'The management style in the organization is characterized by hard-driving competitiveness, high demands, and achievement.', question_text_ar: 'يتميز أسلوب الإدارة في المنظمة بالتنافسية الشديدة والمطالب العالية والإنجاز.', framework: 'CVF', dimension: 'Market', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'cvf_market_4', question_text_en: 'The glue that holds the organization together is the emphasis on achievement and goal accomplishment.', question_text_ar: 'الرابطة التي تجمع المنظمة هي التركيز على الإنجاز وتحقيق الأهداف.', framework: 'CVF', dimension: 'Market', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'cvf_market_5', question_text_en: 'The organization emphasizes competitive actions and achievement. Hitting stretch targets and winning in the marketplace are dominant.', question_text_ar: 'تؤكد المنظمة على الأعمال التنافسية والإنجاز. تحقيق الأهداف الطموحة والفوز في السوق هما المهيمنان.', framework: 'CVF', dimension: 'Market', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },

  // Hierarchy Culture (5 items)
  { item_key: 'cvf_hier_1', question_text_en: 'The organization is a very controlled and structured place. Formal procedures generally govern what people do.', question_text_ar: 'المنظمة مكان منضبط ومنظم جداً. الإجراءات الرسمية تحكم بشكل عام ما يفعله الناس.', framework: 'CVF', dimension: 'Hierarchy', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'cvf_hier_2', question_text_en: 'The leadership in the organization is generally considered to exemplify coordinating, organizing, or smooth-running efficiency.', question_text_ar: 'تعتبر القيادة في المنظمة بشكل عام مثالاً على التنسيق والتنظيم أو الكفاءة في التشغيل السلس.', framework: 'CVF', dimension: 'Hierarchy', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'cvf_hier_3', question_text_en: 'The management style in the organization is characterized by security of employment, conformity, predictability, and stability in relationships.', question_text_ar: 'يتميز أسلوب الإدارة في المنظمة بأمان الوظيفة والتوافق والقابلية للتنبؤ والاستقرار في العلاقات.', framework: 'CVF', dimension: 'Hierarchy', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'cvf_hier_4', question_text_en: 'The glue that holds the organization together is formal rules and policies. Maintaining a smooth-running organization is important.', question_text_ar: 'الرابطة التي تجمع المنظمة هي القواعد والسياسات الرسمية. الحفاظ على منظمة تعمل بسلاسة أمر مهم.', framework: 'CVF', dimension: 'Hierarchy', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'cvf_hier_5', question_text_en: 'The organization emphasizes permanence and stability. Efficiency, control and smooth operations are important.', question_text_ar: 'تؤكد المنظمة على الدوام والاستقرار. الكفاءة والسيطرة والعمليات السلسة مهمة.', framework: 'CVF', dimension: 'Hierarchy', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
];

const CULTURAL_WEB_ITEMS: Omit<SurveyItem, 'sort_order'>[] = [
  // Stories (3 items)
  { item_key: 'web_stories_1', question_text_en: 'Stories shared in our organization reinforce our core values and mission.', question_text_ar: 'القصص المشتركة في منظمتنا تعزز قيمنا الأساسية ورسالتنا.', framework: 'Cultural Web', dimension: 'Stories', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'web_stories_2', question_text_en: 'Success stories are regularly celebrated and communicated throughout the organization.', question_text_ar: 'قصص النجاح يتم الاحتفال بها وتوصيلها بانتظام في جميع أنحاء المنظمة.', framework: 'Cultural Web', dimension: 'Stories', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'web_stories_3', question_text_en: 'The stories people tell about our organization reflect what we truly value.', question_text_ar: 'القصص التي يحكيها الناس عن منظمتنا تعكس ما نقدره حقاً.', framework: 'Cultural Web', dimension: 'Stories', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },

  // Symbols (3 items)
  { item_key: 'web_symbols_1', question_text_en: 'Our organizational symbols and logos clearly represent our identity and values.', question_text_ar: 'رموز وشعارات منظمتنا تمثل بوضوح هويتنا وقيمنا.', framework: 'Cultural Web', dimension: 'Symbols', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'web_symbols_2', question_text_en: 'Status symbols in our organization are consistent with our stated values.', question_text_ar: 'رموز المكانة في منظمتنا متسقة مع قيمنا المعلنة.', framework: 'Cultural Web', dimension: 'Symbols', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'web_symbols_3', question_text_en: 'The physical environment and workspace design reflects our organizational culture.', question_text_ar: 'البيئة المادية وتصميم مساحة العمل يعكسان ثقافة منظمتنا.', framework: 'Cultural Web', dimension: 'Symbols', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },

  // Power Structures (3 items)
  { item_key: 'web_power_1', question_text_en: 'Decision-making authority is clearly defined and understood throughout the organization.', question_text_ar: 'سلطة اتخاذ القرار محددة بوضوح ومفهومة في جميع أنحاء المنظمة.', framework: 'Cultural Web', dimension: 'Power Structures', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'web_power_2', question_text_en: 'Influential people in our organization actively support our cultural values.', question_text_ar: 'الأشخاص المؤثرون في منظمتنا يدعمون بنشاط قيمنا الثقافية.', framework: 'Cultural Web', dimension: 'Power Structures', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'web_power_3', question_text_en: 'Power is distributed appropriately to support effective decision-making.', question_text_ar: 'السلطة موزعة بشكل مناسب لدعم اتخاذ القرارات الفعالة.', framework: 'Cultural Web', dimension: 'Power Structures', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },

  // Control Systems (3 items)
  { item_key: 'web_control_1', question_text_en: 'Our measurement systems focus on the right metrics to drive desired behaviors.', question_text_ar: 'أنظمة القياس لدينا تركز على المقاييس الصحيحة لدفع السلوكيات المرغوبة.', framework: 'Cultural Web', dimension: 'Control Systems', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'web_control_2', question_text_en: 'Performance management systems effectively reinforce our organizational values.', question_text_ar: 'أنظمة إدارة الأداء تعزز بفعالية قيم منظمتنا.', framework: 'Cultural Web', dimension: 'Control Systems', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'web_control_3', question_text_en: 'Control mechanisms are balanced and support both accountability and innovation.', question_text_ar: 'آليات السيطرة متوازنة وتدعم كلاً من المساءلة والابتكار.', framework: 'Cultural Web', dimension: 'Control Systems', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },

  // Rituals & Routines (3 items)
  { item_key: 'web_rituals_1', question_text_en: 'Our regular meetings and ceremonies reinforce what we value as an organization.', question_text_ar: 'اجتماعاتنا ومراسمنا المنتظمة تعزز ما نقدره كمنظمة.', framework: 'Cultural Web', dimension: 'Rituals & Routines', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'web_rituals_2', question_text_en: 'Daily work routines consistently reflect our organizational priorities.', question_text_ar: 'روتين العمل اليومي يعكس باستمرار أولويات منظمتنا.', framework: 'Cultural Web', dimension: 'Rituals & Routines', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'web_rituals_3', question_text_en: 'Recognition and reward ceremonies meaningfully celebrate our values.', question_text_ar: 'مراسم التقدير والمكافآت تحتفل بشكل مجدي بقيمنا.', framework: 'Cultural Web', dimension: 'Rituals & Routines', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },

  // Organizational Structure (3 items)
  { item_key: 'web_structure_1', question_text_en: 'Our organizational structure supports effective communication and collaboration.', question_text_ar: 'هيكل منظمتنا يدعم التواصل والتعاون الفعالين.', framework: 'Cultural Web', dimension: 'Organizational Structure', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'web_structure_2', question_text_en: 'Reporting relationships enable quick decision-making when needed.', question_text_ar: 'علاقات التقرير تمكن من اتخاذ القرارات السريعة عند الحاجة.', framework: 'Cultural Web', dimension: 'Organizational Structure', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'web_structure_3', question_text_en: 'The organizational structure flexibly adapts to changing business needs.', question_text_ar: 'الهيكل التنظيمي يتكيف بمرونة مع احتياجات العمل المتغيرة.', framework: 'Cultural Web', dimension: 'Organizational Structure', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
];

const PSYCH_SAFETY_ITEMS: Omit<SurveyItem, 'sort_order'>[] = [
  { item_key: 'psych_safety_1', question_text_en: 'If you make a mistake in this team, it is often held against you.', question_text_ar: 'إذا ارتكبت خطأ في هذا الفريق، غالباً ما يُحتسب ذلك ضدك.', framework: 'Psychological Safety', dimension: 'Psychological Safety', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: true },
  { item_key: 'psych_safety_2', question_text_en: 'Members of this team are able to bring up problems and tough issues.', question_text_ar: 'أعضاء هذا الفريق قادرون على إثارة المشاكل والقضايا الصعبة.', framework: 'Psychological Safety', dimension: 'Psychological Safety', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'psych_safety_3', question_text_en: 'People in this team sometimes reject others for being different.', question_text_ar: 'الناس في هذا الفريق أحياناً يرفضون الآخرين لكونهم مختلفين.', framework: 'Psychological Safety', dimension: 'Psychological Safety', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: true },
  { item_key: 'psych_safety_4', question_text_en: 'It is safe to take a risk in this team.', question_text_ar: 'من الآمن المخاطرة في هذا الفريق.', framework: 'Psychological Safety', dimension: 'Psychological Safety', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'psych_safety_5', question_text_en: 'It is difficult to ask other members of this team for help.', question_text_ar: 'من الصعب طلب المساعدة من أعضاء آخرين في هذا الفريق.', framework: 'Psychological Safety', dimension: 'Psychological Safety', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: true },
  { item_key: 'psych_safety_6', question_text_en: 'No one in this team would deliberately act in a way that undermines my efforts.', question_text_ar: 'لن يتصرف أحد في هذا الفريق عمداً بطريقة تقوض جهودي.', framework: 'Psychological Safety', dimension: 'Psychological Safety', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'psych_safety_7', question_text_en: 'Working with members of this team, my unique skills and talents are valued and utilized.', question_text_ar: 'عند العمل مع أعضاء هذا الفريق، مهاراتي ومواهبي الفريدة مقدرة ومستخدمة.', framework: 'Psychological Safety', dimension: 'Psychological Safety', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
];

const KSA_CONTEXT_ITEMS: Omit<SurveyItem, 'sort_order'>[] = [
  { item_key: 'ksa_context_1', question_text_en: 'Our organization effectively balances Vision 2030 objectives with daily operations.', question_text_ar: 'منظمتنا توازن بفعالية بين أهداف رؤية 2030 والعمليات اليومية.', framework: 'KSA Context', dimension: 'Vision 2030 Alignment', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'ksa_context_2', question_text_en: 'Saudi cultural values are respected and integrated into our workplace practices.', question_text_ar: 'القيم الثقافية السعودية محترمة ومدمجة في ممارسات مكان عملنا.', framework: 'KSA Context', dimension: 'Cultural Integration', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'ksa_context_3', question_text_en: 'Our organization contributes meaningfully to Saudi Arabia\'s economic diversification.', question_text_ar: 'منظمتنا تساهم بشكل مجدي في التنويع الاقتصادي للمملكة العربية السعودية.', framework: 'KSA Context', dimension: 'Economic Contribution', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'ksa_context_4', question_text_en: 'We effectively develop Saudi talent and promote career growth for Saudi employees.', question_text_ar: 'نحن نطور بفعالية المواهب السعودية ونعزز النمو المهني للموظفين السعوديين.', framework: 'KSA Context', dimension: 'Talent Development', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
  { item_key: 'ksa_context_5', question_text_en: 'Our organization adapts well to changing regulations and government initiatives.', question_text_ar: 'منظمتنا تتكيف جيداً مع اللوائح المتغيرة والمبادرات الحكومية.', framework: 'KSA Context', dimension: 'Regulatory Adaptation', scale_type: 'likert_5', scale_min: 1, scale_max: 5, reverse_scored: false },
];

const BARRETT_VALUES_ITEMS: Omit<SurveyItem, 'sort_order'>[] = [
  { item_key: 'values_current', question_text_en: 'Please select up to 5 values that best describe your organization as it is today:', question_text_ar: 'يرجى اختيار ما يصل إلى 5 قيم تصف منظمتك كما هي اليوم:', framework: 'Barrett Values', dimension: 'Current Values', scale_type: 'multi_select', scale_min: 0, scale_max: 5, reverse_scored: false },
  { item_key: 'values_desired', question_text_en: 'Please select up to 5 values that you would like to see in your ideal organization:', question_text_ar: 'يرجى اختيار ما يصل إلى 5 قيم تود رؤيتها في منظمتك المثالية:', framework: 'Barrett Values', dimension: 'Desired Values', scale_type: 'multi_select', scale_min: 0, scale_max: 5, reverse_scored: false },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tenantId } = await req.json();

    if (!tenantId) {
      return new Response(JSON.stringify({ error: 'tenantId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const surveyName = 'AqlHR Corporate Culture Diagnostic v1';

    // Check if survey already exists (idempotent)
    const { data: existingSurvey } = await supabase
      .from('cci_surveys')
      .select('id, wave_count')
      .eq('tenant_id', tenantId)
      .eq('name', surveyName)
      .single();

    if (existingSurvey) {
      // Get existing wave
      const { data: existingWave } = await supabase
        .from('cci_waves')
        .select('id')
        .eq('survey_id', existingSurvey.id)
        .eq('wave_no', 1)
        .eq('is_baseline', true)
        .single();

      // Count existing items
      const { count } = await supabase
        .from('cci_survey_items')
        .select('id', { count: 'exact' })
        .eq('survey_id', existingSurvey.id);

      return new Response(JSON.stringify({
        surveyId: existingSurvey.id,
        waveId: existingWave?.id,
        itemCount: count,
        message: 'Survey already exists'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create new survey
    const { data: survey, error: surveyError } = await supabase
      .from('cci_surveys')
      .insert({
        tenant_id: tenantId,
        name: surveyName,
        language: 'en',
        anonymity_min_n: 7,
        wave_count: 1,
        status: 'draft',
        description: 'Comprehensive organizational culture diagnostic instrument for AqlHR'
      })
      .select()
      .single();

    if (surveyError) {
      console.error('Survey creation error:', surveyError);
      return new Response(JSON.stringify({ error: 'Failed to create survey' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create baseline wave  
    const { data: wave, error: waveError } = await supabase
      .from('cci_waves')
      .insert({
        survey_id: survey.id,
        wave_no: 1,
        is_baseline: true,
        name: 'Baseline Wave',
        status: 'active'
      })
      .select()
      .single();

    if (waveError) {
      console.error('Wave creation error:', waveError);
      return new Response(JSON.stringify({ error: 'Failed to create wave' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build all items with sort order
    const allItems: SurveyItem[] = [];
    let sortOrder = 1;

    // Add CVF items
    CVF_ITEMS.forEach(item => {
      allItems.push({ ...item, sort_order: sortOrder++ });
    });

    // Add Cultural Web items  
    CULTURAL_WEB_ITEMS.forEach(item => {
      allItems.push({ ...item, sort_order: sortOrder++ });
    });

    // Add Psychological Safety items
    PSYCH_SAFETY_ITEMS.forEach(item => {
      allItems.push({ ...item, sort_order: sortOrder++ });
    });

    // Add KSA Context items
    KSA_CONTEXT_ITEMS.forEach(item => {
      allItems.push({ ...item, sort_order: sortOrder++ });
    });

    // Add Barrett Values items
    BARRETT_VALUES_ITEMS.forEach(item => {
      allItems.push({ ...item, sort_order: sortOrder++ });
    });

    // Add reverse-scored fillers (duplicates from CVF and Web marked as reverse_scored)
    const fillerItems = [
      ...CVF_ITEMS.slice(0, 5), // First 5 CVF items
      ...CULTURAL_WEB_ITEMS.slice(0, 5) // First 5 Cultural Web items
    ];

    fillerItems.forEach(item => {
      allItems.push({
        ...item,
        item_key: `${item.item_key}_reverse`,
        reverse_scored: true,
        sort_order: sortOrder++
      });
    });

    // Insert all survey items
    const itemsToInsert = allItems.map(item => ({
      survey_id: survey.id,
      ...item
    }));

    const { error: itemsError } = await supabase
      .from('cci_survey_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Items insertion error:', itemsError);
      return new Response(JSON.stringify({ error: 'Failed to create survey items' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Successfully created survey "${surveyName}" with ${allItems.length} items`);

    return new Response(JSON.stringify({
      surveyId: survey.id,
      waveId: wave.id,
      itemCount: allItems.length,
      message: 'Survey created successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in cci-seed-instrument-v1:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});