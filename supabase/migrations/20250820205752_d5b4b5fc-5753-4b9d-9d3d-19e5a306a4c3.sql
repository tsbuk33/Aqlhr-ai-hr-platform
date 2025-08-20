-- Seed AqlHR Corporate Culture Diagnostic v1 instrument (complete)
DO $$
DECLARE
    survey_uuid uuid;
BEGIN
    -- Insert the survey and get the ID
    INSERT INTO public.cci_surveys (tenant_id, name, language, status, anonymity_min_n, created_by)
    VALUES (
      '00000000-0000-0000-0000-000000000001'::uuid, -- Default tenant for seeding
      'AqlHR Corporate Culture Diagnostic v1 Final',
      'en',
      'draft',
      7,
      '00000000-0000-0000-0000-000000000001'::uuid
    )
    RETURNING id INTO survey_uuid;

    -- CVF - Clan (5 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 1, 'cvf', 'Clan', 'People here help each other across teams.', 'الزملاء هنا يساعدون بعضهم عبر الفرق.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 2, 'cvf', 'Clan', 'Managers act as mentors, not just bosses.', 'المديرون يعملون كمرشدين وليس فقط رؤساء.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 3, 'cvf', 'Clan', 'We share knowledge openly.', 'نشارك المعرفة بانفتاح.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 4, 'cvf', 'Clan', 'Newcomers feel welcomed and supported.', 'الموظفون الجدد يشعرون بالترحيب والدعم.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 5, 'cvf', 'Clan', 'It''s safe to admit mistakes.', 'من الآمن الاعتراف بالأخطاء.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- CVF - Adhocracy (5 items)  
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 6, 'cvf', 'Adhocracy', 'Experimentation is encouraged.', 'يُشجَّع التجريب.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 7, 'cvf', 'Adhocracy', 'People are rewarded for new ideas.', 'يُكافأ الناس على الأفكار الجديدة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 8, 'cvf', 'Adhocracy', 'We learn quickly and move fast.', 'نتعلم بسرعة ونتحرك بسرعة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 9, 'cvf', 'Adhocracy', 'Reasonable risk-taking is supported.', 'يُدعَم تحمُّل المخاطر المعقولة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 10, 'cvf', 'Adhocracy', 'We iterate instead of waiting for perfect.', 'نُحسِّن تدريجيًا بدل انتظار الكمال.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- CVF - Market (5 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 11, 'cvf', 'Market', 'Customer needs guide priorities.', 'احتياجات العميل توجه الأولويات.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 12, 'cvf', 'Market', 'Clear targets drive our work.', 'الأهداف الواضحة تقود عملنا.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 13, 'cvf', 'Market', 'Accountability for results is strong.', 'المساءلة عن النتائج قوية.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 14, 'cvf', 'Market', 'High performance is recognized.', 'يُعترف بالأداء العالي.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 15, 'cvf', 'Market', 'Urgency is appropriate to business demands.', 'الإلحاح يتناسب مع متطلبات العمل.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- CVF - Hierarchy (5 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 16, 'cvf', 'Hierarchy', 'Processes are clear and documented.', 'العمليات واضحة ومُوثَّقة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 17, 'cvf', 'Hierarchy', 'Compliance is taken seriously.', 'الامتثال يُؤخَذ على محمل الجد.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 18, 'cvf', 'Hierarchy', 'Roles and responsibilities are well defined.', 'الأدوار والمسؤوليات محددة جيدًا.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 19, 'cvf', 'Hierarchy', 'Approvals are proportionate and timely.', 'الموافقات متناسبة وفي الوقت المناسب.', 1, 5, true, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 20, 'cvf', 'Hierarchy', 'Planning and follow-through are consistent.', 'التخطيط والمتابعة منتظمة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Cultural Web - Stories (3 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 21, 'web', 'Stories', 'We celebrate stories of ethical decisions, not shortcuts.', 'نحتفي بقصص القرارات الأخلاقية لا الطرق المختصرة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 22, 'web', 'Stories', 'Success stories credit teams, not only individuals.', 'قصص النجاح تُنسب للفرق لا للأفراد فقط.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 23, 'web', 'Stories', 'We learn from failures without blame.', 'نتعلم من الإخفاق دون لوم.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Cultural Web - Symbols (3 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 24, 'web', 'Symbols', 'Titles and perks don''t hinder collaboration.', 'الألقاب والمزايا لا تعيق التعاون.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 25, 'web', 'Symbols', 'Workspaces/signage reflect our values.', 'بيئة العمل واللافتات تعكس قيمنا.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 26, 'web', 'Symbols', 'Recognition is visible and fair.', 'التقدير مرئي وعادل.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Cultural Web - Power Structures (3 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 27, 'web', 'Power Structures', 'Decisions are made by those closest to the work.', 'القرارات تُتَّخذ من الأقرب للعمل.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 28, 'web', 'Power Structures', '"Wasta" (favoritism) does not influence outcomes.', 'الواسطة لا تؤثر على النتائج.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 29, 'web', 'Power Structures', 'Leaders are accessible and listen.', 'القادة متاحون ويستمعون.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Cultural Web - Control Systems (3 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 30, 'web', 'Control Systems', 'KPIs measure what truly matters.', 'المؤشرات تقيس ما يهم فعلاً.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 31, 'web', 'Control Systems', 'Quality and safety are rewarded, not bypassed.', 'الجودة والسلامة يُكافآن ولا يتم تجاوزهما.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 32, 'web', 'Control Systems', 'We balance compliance with agility.', 'نوازن بين الامتثال والمرونة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Cultural Web - Rituals & Routines (3 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 33, 'web', 'Rituals & Routines', 'Meetings are purposeful and end with decisions.', 'الاجتماعات هادفة وتنتهي بقرارات.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 34, 'web', 'Rituals & Routines', 'We give timely feedback.', 'نقدّم تغذية راجعة في الوقت المناسب.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 35, 'web', 'Rituals & Routines', 'Cross-department rituals build unity.', 'الطقوس بين الإدارات تبني وحدة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Cultural Web - Org Structure (3 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 36, 'web', 'Org Structure', 'Layers of approval are reasonable.', 'طبقات الموافقة معقولة.', 1, 5, true, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 37, 'web', 'Org Structure', 'Teams collaborate across boundaries easily.', 'الفرق تتعاون عبر الحدود بسهولة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 38, 'web', 'Org Structure', 'We can form task forces quickly when needed.', 'نشكّل فرق مهام بسرعة عند الحاجة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Psychological Safety (7 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 39, 'psych_safety', 'Safety', 'I can speak up with ideas or concerns.', 'أستطيع طرح الأفكار أو المخاوف.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 40, 'psych_safety', 'Safety', 'Mistakes are treated as learning opportunities.', 'الأخطاء فرص للتعلّم.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 41, 'psych_safety', 'Safety', 'Asking for help is encouraged.', 'طلب المساعدة مُشجَّع.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 42, 'psych_safety', 'Safety', 'People like me are respected here.', 'أمثالي يُحترمون هنا.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 43, 'psych_safety', 'Safety', 'Feedback from managers is fair.', 'ملاحظات المديرين عادلة.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 44, 'psych_safety', 'Safety', 'Conflicts are addressed constructively.', 'يُعالَج الخلاف بشكل بنّاء.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 45, 'psych_safety', 'Safety', 'I trust my team to support me under pressure.', 'أثق بفريقي أنه يدعمني تحت الضغط.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

    -- Custom KSA Context (5 items)
    INSERT INTO public.cci_survey_items (survey_id, order_no, framework, dimension, text_en, text_ar, scale_min, scale_max, reverse_scored, tenant_id) VALUES
    (survey_uuid, 46, 'custom', 'Local Context', 'People of all nationalities are treated with respect.', 'يُعامَل جميع الجنسيات باحترام.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 47, 'custom', 'Local Context', 'We act in line with HRSD regulations and spirit.', 'نلتزم بأنظمة وزارة الموارد البشرية وروحها.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 48, 'custom', 'Local Context', 'Worker welfare standards are upheld consistently.', 'معايير رفاهية العمال تُطبَّق باستمرار.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 49, 'custom', 'Local Context', 'Promotion is based on merit, not connections.', 'الترقية على أساس الجدارة لا العلاقات.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid),
    (survey_uuid, 50, 'custom', 'Local Context', 'Our work reflects Vision 2030 ethics and ambition.', 'عملنا يعكس أخلاقيات ورؤية 2030.', 1, 5, false, '00000000-0000-0000-0000-000000000001'::uuid);

END $$;