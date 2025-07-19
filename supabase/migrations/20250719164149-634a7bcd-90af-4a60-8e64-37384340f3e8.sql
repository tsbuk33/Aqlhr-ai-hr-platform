-- TASK 3C: ANALYTICS & AI MODULE DATA POPULATION

DO $$ 
DECLARE 
    company_uuid uuid;
    emp_ids uuid[];
BEGIN
    -- Get company and employee IDs
    SELECT id INTO company_uuid FROM public.companies LIMIT 1;
    SELECT ARRAY(SELECT id FROM public.employees WHERE company_id = company_uuid LIMIT 10) INTO emp_ids;

    -- AI PREDICTIONS DATA
    INSERT INTO public.ai_predictions (
        company_id, employee_id, model_type, prediction_score, risk_level,
        influencing_factors, confidence_interval, prediction_date, expires_at
    ) VALUES 
        (company_uuid, emp_ids[1], 'performance_prediction', 0.95, 'low', 
         jsonb_build_object('leadership_score', 0.98, 'team_feedback', 0.92, 'goal_achievement', 0.97),
         jsonb_build_object('lower', 0.92, 'upper', 0.98), CURRENT_DATE, CURRENT_DATE + 90),
        
        (company_uuid, emp_ids[2], 'retention_prediction', 0.88, 'low', 
         jsonb_build_object('engagement_score', 0.85, 'career_progression', 0.92, 'compensation_satisfaction', 0.87),
         jsonb_build_object('lower', 0.82, 'upper', 0.94), CURRENT_DATE, CURRENT_DATE + 90),
        
        (company_uuid, emp_ids[3], 'skill_development_prediction', 0.92, 'low', 
         jsonb_build_object('learning_velocity', 0.95, 'technical_aptitude', 0.94, 'innovation_index', 0.89),
         jsonb_build_object('lower', 0.87, 'upper', 0.97), CURRENT_DATE, CURRENT_DATE + 90),
        
        (company_uuid, emp_ids[4], 'promotion_readiness', 0.78, 'medium', 
         jsonb_build_object('performance_trend', 0.82, 'leadership_potential', 0.75, 'skill_gaps', 0.77),
         jsonb_build_object('lower', 0.72, 'upper', 0.84), CURRENT_DATE, CURRENT_DATE + 90),
        
        (company_uuid, emp_ids[5], 'burnout_prediction', 0.25, 'low', 
         jsonb_build_object('workload_balance', 0.85, 'stress_indicators', 0.20, 'work_life_balance', 0.88),
         jsonb_build_object('lower', 0.15, 'upper', 0.35), CURRENT_DATE, CURRENT_DATE + 90);

    -- ATTENDANCE ANALYTICS
    INSERT INTO public.attendance_analytics (
        company_id, employee_id, analysis_date, attendance_score, punctuality_score,
        risk_indicators, productivity_correlation, recommendations, overtime_trend, leave_pattern
    ) VALUES 
        (company_uuid, emp_ids[1], CURRENT_DATE, 98.5, 95.2, 
         jsonb_build_object('late_arrivals', 2, 'early_departures', 1, 'absences', 0),
         0.92, jsonb_build_array('Maintain excellent attendance', 'Consider flexible schedule for optimization'),
         'stable', 'regular'),
        
        (company_uuid, emp_ids[2], CURRENT_DATE, 94.8, 89.3, 
         jsonb_build_object('late_arrivals', 5, 'early_departures', 2, 'absences', 1),
         0.87, jsonb_build_array('Improve morning punctuality', 'Set up attendance reminders'),
         'increasing', 'planned'),
        
        (company_uuid, emp_ids[3], CURRENT_DATE, 96.7, 92.1, 
         jsonb_build_object('late_arrivals', 3, 'early_departures', 0, 'absences', 1),
         0.94, jsonb_build_array('Excellent commitment', 'Monitor for overwork signs'),
         'high_overtime', 'minimal'),
        
        (company_uuid, emp_ids[4], CURRENT_DATE, 91.2, 85.7, 
         jsonb_build_object('late_arrivals', 7, 'early_departures', 3, 'absences', 2),
         0.82, jsonb_build_array('Schedule coaching session', 'Review personal circumstances'),
         'stable', 'frequent_short'),
        
        (company_uuid, emp_ids[5], CURRENT_DATE, 97.3, 94.8, 
         jsonb_build_object('late_arrivals', 1, 'early_departures', 1, 'absences', 1),
         0.95, jsonb_build_array('Outstanding performance', 'Consider for attendance recognition'),
         'overtime_efficient', 'strategic');

    -- AUDIT LOGS for system transparency
    INSERT INTO public.audit_logs (
        company_id, action, table_name, record_id, 
        old_values, new_values, ip_address, user_agent
    ) VALUES 
        (company_uuid, 'CREATE', 'employees', emp_ids[1], 
         null, jsonb_build_object('status', 'active', 'department', 'Executive'),
         '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0'),
        
        (company_uuid, 'UPDATE', 'employees', emp_ids[2], 
         jsonb_build_object('position', 'HR Specialist'), 
         jsonb_build_object('position', 'Chief Human Resources Officer'),
         '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/14.1'),
        
        (company_uuid, 'CREATE', 'payroll', gen_random_uuid(), 
         null, jsonb_build_object('month', 12, 'year', 2024, 'status', 'processed'),
         '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) Firefox/89.0'),
        
        (company_uuid, 'CREATE', 'training_records', gen_random_uuid(), 
         null, jsonb_build_object('status', 'completed', 'hours', 40),
         '192.168.1.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/91.0'),
        
        (company_uuid, 'UPDATE', 'attendance_timesheet', gen_random_uuid(), 
         jsonb_build_object('status', 'pending'), 
         jsonb_build_object('status', 'approved'),
         '192.168.1.104', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) Safari/604.1');

END $$;