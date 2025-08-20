-- Seed AqlHR Corporate Culture Diagnostic v1 instrument (corrected)
-- Insert the survey
INSERT INTO public.cci_surveys (tenant_id, name, language, status, anonymity_min_n, created_by)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid, -- Default tenant for seeding
  'AqlHR Corporate Culture Diagnostic v1',
  'en',
  'draft',
  7,
  '00000000-0000-0000-0000-000000000001'::uuid
);

-- Get the survey ID for item insertion
DO $$
DECLARE
    survey_uuid uuid;
BEGIN
    -- Get the survey ID
    SELECT id INTO survey_uuid 
    FROM public.cci_surveys 
    WHERE name = 'AqlHR Corporate Culture Diagnostic v1' 
    LIMIT 1;

    -- CVF - Clan (5 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 1, 'CVF', 'Clan', 'People here help each other across teams.', 'الزملاء هنا يساعدون بعضهم عبر الفرق.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 2, 'CVF', 'Clan', 'Managers act as mentors, not just bosses.', 'المديرون يعملون كمرشدين وليس فقط رؤساء.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 3, 'CVF', 'Clan', 'We share knowledge openly.', 'نشارك المعرفة بانفتاح.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 4, 'CVF', 'Clan', 'Newcomers feel welcomed and supported.', 'الموظفون الجدد يشعرون بالترحيب والدعم.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 5, 'CVF', 'Clan', 'It''s safe to admit mistakes.', 'من الآمن الاعتراف بالأخطاء.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- CVF - Adhocracy (5 items)  
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 6, 'CVF', 'Adhocracy', 'Experimentation is encouraged.', 'يُشجَّع التجريب.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 7, 'CVF', 'Adhocracy', 'People are rewarded for new ideas.', 'يُكافأ الناس على الأفكار الجديدة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 8, 'CVF', 'Adhocracy', 'We learn quickly and move fast.', 'نتعلم بسرعة ونتحرك بسرعة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 9, 'CVF', 'Adhocracy', 'Reasonable risk-taking is supported.', 'يُدعَم تحمُّل المخاطر المعقولة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 10, 'CVF', 'Adhocracy', 'We iterate instead of waiting for perfect.', 'نُحسِّن تدريجيًا بدل انتظار الكمال.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- CVF - Market (5 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 11, 'CVF', 'Market', 'Customer needs guide priorities.', 'احتياجات العميل توجه الأولويات.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 12, 'CVF', 'Market', 'Clear targets drive our work.', 'الأهداف الواضحة تقود عملنا.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 13, 'CVF', 'Market', 'Accountability for results is strong.', 'المساءلة عن النتائج قوية.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 14, 'CVF', 'Market', 'High performance is recognized.', 'يُعترف بالأداء العالي.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 15, 'CVF', 'Market', 'Urgency is appropriate to business demands.', 'الإلحاح يتناسب مع متطلبات العمل.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- CVF - Hierarchy (5 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 16, 'CVF', 'Hierarchy', 'Processes are clear and documented.', 'العمليات واضحة ومُوثَّقة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 17, 'CVF', 'Hierarchy', 'Compliance is taken seriously.', 'الامتثال يُؤخَذ على محمل الجد.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 18, 'CVF', 'Hierarchy', 'Roles and responsibilities are well defined.', 'الأدوار والمسؤوليات محددة جيدًا.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 19, 'CVF', 'Hierarchy', 'Approvals are proportionate and timely.', 'الموافقات متناسبة وفي الوقت المناسب.', 1, 5, true, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 20, 'CVF', 'Hierarchy', 'Planning and follow-through are consistent.', 'التخطيط والمتابعة منتظمة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Cultural Web - Stories (3 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 21, 'Cultural Web', 'Stories', 'We celebrate stories of ethical decisions, not shortcuts.', 'نحتفي بقصص القرارات الأخلاقية لا الطرق المختصرة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 22, 'Cultural Web', 'Stories', 'Success stories credit teams, not only individuals.', 'قصص النجاح تُنسب للفرق لا للأفراد فقط.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 23, 'Cultural Web', 'Stories', 'We learn from failures without blame.', 'نتعلم من الإخفاق دون لوم.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Cultural Web - Symbols (3 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 24, 'Cultural Web', 'Symbols', 'Titles and perks don''t hinder collaboration.', 'الألقاب والمزايا لا تعيق التعاون.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 25, 'Cultural Web', 'Symbols', 'Workspaces/signage reflect our values.', 'بيئة العمل واللافتات تعكس قيمنا.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 26, 'Cultural Web', 'Symbols', 'Recognition is visible and fair.', 'التقدير مرئي وعادل.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Cultural Web - Power Structures (3 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 27, 'Cultural Web', 'Power Structures', 'Decisions are made by those closest to the work.', 'القرارات تُتَّخذ من الأقرب للعمل.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 28, 'Cultural Web', 'Power Structures', '"Wasta" (favoritism) does not influence outcomes.', 'الواسطة لا تؤثر على النتائج.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 29, 'Cultural Web', 'Power Structures', 'Leaders are accessible and listen.', 'القادة متاحون ويستمعون.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Cultural Web - Control Systems (3 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 30, 'Cultural Web', 'Control Systems', 'KPIs measure what truly matters.', 'المؤشرات تقيس ما يهم فعلاً.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 31, 'Cultural Web', 'Control Systems', 'Quality and safety are rewarded, not bypassed.', 'الجودة والسلامة يُكافآن ولا يتم تجاوزهما.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 32, 'Cultural Web', 'Control Systems', 'We balance compliance with agility.', 'نوازن بين الامتثال والمرونة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Cultural Web - Rituals & Routines (3 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 33, 'Cultural Web', 'Rituals & Routines', 'Meetings are purposeful and end with decisions.', 'الاجتماعات هادفة وتنتهي بقرارات.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 34, 'Cultural Web', 'Rituals & Routines', 'We give timely feedback.', 'نقدّم تغذية راجعة في الوقت المناسب.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 35, 'Cultural Web', 'Rituals & Routines', 'Cross-department rituals build unity.', 'الطقوس بين الإدارات تبني وحدة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Cultural Web - Org Structure (3 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 36, 'Cultural Web', 'Org Structure', 'Layers of approval are reasonable.', 'طبقات الموافقة معقولة.', 1, 5, true, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 37, 'Cultural Web', 'Org Structure', 'Teams collaborate across boundaries easily.', 'الفرق تتعاون عبر الحدود بسهولة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 38, 'Cultural Web', 'Org Structure', 'We can form task forces quickly when needed.', 'نشكّل فرق مهام بسرعة عند الحاجة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Psychological Safety (7 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 39, 'Psychological Safety', 'Safety', 'I can speak up with ideas or concerns.', 'أستطيع طرح الأفكار أو المخاوف.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 40, 'Psychological Safety', 'Safety', 'Mistakes are treated as learning opportunities.', 'الأخطاء فرص للتعلّم.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 41, 'Psychological Safety', 'Safety', 'Asking for help is encouraged.', 'طلب المساعدة مُشجَّع.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 42, 'Psychological Safety', 'Safety', 'People like me are respected here.', 'أمثالي يُحترمون هنا.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 43, 'Psychological Safety', 'Safety', 'Feedback from managers is fair.', 'ملاحظات المديرين عادلة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 44, 'Psychological Safety', 'Safety', 'Conflicts are addressed constructively.', 'يُعالَج الخلاف بشكل بنّاء.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 45, 'Psychological Safety', 'Safety', 'I trust my team to support me under pressure.', 'أثق بفريقي أنه يدعمني تحت الضغط.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Custom KSA Context (5 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 46, 'KSA Context', 'Local Context', 'People of all nationalities are treated with respect.', 'يُعامَل جميع الجنسيات باحترام.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 47, 'KSA Context', 'Local Context', 'We act in line with HRSD regulations and spirit.', 'نلتزم بأنظمة وزارة الموارد البشرية وروحها.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 48, 'KSA Context', 'Local Context', 'Worker welfare standards are upheld consistently.', 'معايير رفاهية العمال تُطبَّق باستمرار.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 49, 'KSA Context', 'Local Context', 'Promotion is based on merit, not connections.', 'الترقية على أساس الجدارة لا العلاقات.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 50, 'KSA Context', 'Local Context', 'Our work reflects Vision 2030 ethics and ambition.', 'عملنا يعكس أخلاقيات ورؤية 2030.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

END $$;