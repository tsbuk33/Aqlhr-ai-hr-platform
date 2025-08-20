-- Seed AqlHR Corporate Culture Diagnostic v1 instrument
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

-- Get the survey ID for item insertion (using a variable approach)
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
    INSERT INTO public.cci_survey_items (survey_id, item_number, framework, dimension, text_en, text_ar, response_type, reverse_scored, tenant_id) VALUES
    (survey_uuid, 1, 'CVF', 'Clan', 'People here help each other across teams.', 'الزملاء هنا يساعدون بعضهم عبر الفرق.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 2, 'CVF', 'Clan', 'Managers act as mentors, not just bosses.', 'المديرون يعملون كمرشدين وليس فقط رؤساء.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 3, 'CVF', 'Clan', 'We share knowledge openly.', 'نشارك المعرفة بانفتاح.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 4, 'CVF', 'Clan', 'Newcomers feel welcomed and supported.', 'الموظفون الجدد يشعرون بالترحيب والدعم.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 5, 'CVF', 'Clan', 'It''s safe to admit mistakes.', 'من الآمن الاعتراف بالأخطاء.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- CVF - Adhocracy (5 items)  
    INSERT INTO public.cci_survey_items (survey_id, item_number, framework, dimension, text_en, text_ar, response_type, reverse_scored, tenant_id) VALUES
    (survey_uuid, 6, 'CVF', 'Adhocracy', 'Experimentation is encouraged.', 'يُشجَّع التجريب.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 7, 'CVF', 'Adhocracy', 'People are rewarded for new ideas.', 'يُكافأ الناس على الأفكار الجديدة.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 8, 'CVF', 'Adhocracy', 'We learn quickly and move fast.', 'نتعلم بسرعة ونتحرك بسرعة.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 9, 'CVF', 'Adhocracy', 'Reasonable risk-taking is supported.', 'يُدعَم تحمُّل المخاطر المعقولة.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 10, 'CVF', 'Adhocracy', 'We iterate instead of waiting for perfect.', 'نُحسِّن تدريجيًا بدل انتظار الكمال.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- CVF - Market (5 items)
    INSERT INTO public.cci_survey_items (survey_id, item_number, framework, dimension, text_en, text_ar, response_type, reverse_scored, tenant_id) VALUES
    (survey_uuid, 11, 'CVF', 'Market', 'Customer needs guide priorities.', 'احتياجات العميل توجه الأولويات.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 12, 'CVF', 'Market', 'Clear targets drive our work.', 'الأهداف الواضحة تقود عملنا.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 13, 'CVF', 'Market', 'Accountability for results is strong.', 'المساءلة عن النتائج قوية.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 14, 'CVF', 'Market', 'High performance is recognized.', 'يُعترف بالأداء العالي.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 15, 'CVF', 'Market', 'Urgency is appropriate to business demands.', 'الإلحاح يتناسب مع متطلبات العمل.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- CVF - Hierarchy (5 items)
    INSERT INTO public.cci_survey_items (survey_id, item_number, framework, dimension, text_en, text_ar, response_type, reverse_scored, tenant_id) VALUES
    (survey_uuid, 16, 'CVF', 'Hierarchy', 'Processes are clear and documented.', 'العمليات واضحة ومُوثَّقة.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 17, 'CVF', 'Hierarchy', 'Compliance is taken seriously.', 'الامتثال يُؤخَذ على محمل الجد.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 18, 'CVF', 'Hierarchy', 'Roles and responsibilities are well defined.', 'الأدوار والمسؤوليات محددة جيدًا.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 19, 'CVF', 'Hierarchy', 'Approvals are proportionate and timely.', 'الموافقات متناسبة وفي الوقت المناسب.', 'likert_5', true, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 20, 'CVF', 'Hierarchy', 'Planning and follow-through are consistent.', 'التخطيط والمتابعة منتظمة.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Cultural Web - Stories (3 items)
    INSERT INTO public.cci_survey_items (survey_id, item_number, framework, dimension, text_en, text_ar, response_type, reverse_scored, tenant_id) VALUES
    (survey_uuid, 21, 'Cultural Web', 'Stories', 'We celebrate stories of ethical decisions, not shortcuts.', 'نحتفي بقصص القرارات الأخلاقية لا الطرق المختصرة.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 22, 'Cultural Web', 'Stories', 'Success stories credit teams, not only individuals.', 'قصص النجاح تُنسب للفرق لا للأفراد فقط.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 23, 'Cultural Web', 'Stories', 'We learn from failures without blame.', 'نتعلم من الإخفاق دون لوم.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Cultural Web - Symbols (3 items)
    INSERT INTO public.cci_survey_items (survey_id, item_number, framework, dimension, text_en, text_ar, response_type, reverse_scored, tenant_id) VALUES
    (survey_uuid, 24, 'Cultural Web', 'Symbols', 'Titles and perks don''t hinder collaboration.', 'الألقاب والمزايا لا تعيق التعاون.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 25, 'Cultural Web', 'Symbols', 'Workspaces/signage reflect our values.', 'بيئة العمل واللافتات تعكس قيمنا.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 26, 'Cultural Web', 'Symbols', 'Recognition is visible and fair.', 'التقدير مرئي وعادل.', 'likert_5', false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Continue with remaining items...
END $$;