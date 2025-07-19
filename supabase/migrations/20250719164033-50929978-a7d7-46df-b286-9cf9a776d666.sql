-- TASK 3B: CORE HR MODULE DATA POPULATION

DO $$ 
DECLARE 
    company_uuid uuid;
    emp_ids uuid[];
BEGIN
    -- Get company and employee IDs
    SELECT id INTO company_uuid FROM public.companies LIMIT 1;
    SELECT ARRAY(SELECT id FROM public.employees WHERE company_id = company_uuid LIMIT 10) INTO emp_ids;

    -- PAYROLL DATA
    INSERT INTO public.payroll (
        company_id, employee_id, month, year, basic_salary, allowances, overtime, 
        deductions, gosi_employee, gosi_employer, net_salary, wps_status
    ) VALUES 
        (company_uuid, emp_ids[1], 12, 2024, 50000, 5000, 0, 2500, 2250, 4500, 50250, 'processed'),
        (company_uuid, emp_ids[2], 12, 2024, 35000, 8750, 0, 1750, 1575, 3150, 39825, 'processed'),
        (company_uuid, emp_ids[3], 12, 2024, 45000, 12600, 2250, 2250, 2025, 4050, 55575, 'processed'),
        (company_uuid, emp_ids[4], 12, 2024, 25000, 8750, 0, 1250, 1125, 2250, 31375, 'processed'),
        (company_uuid, emp_ids[5], 12, 2024, 28000, 8400, 1400, 1400, 1260, 2520, 35140, 'processed'),
        (company_uuid, emp_ids[6], 12, 2024, 15000, 5250, 0, 750, 675, 1350, 19175, 'processed'),
        (company_uuid, emp_ids[7], 12, 2024, 22000, 7700, 1100, 1100, 990, 1980, 28690, 'processed'),
        (company_uuid, emp_ids[8], 12, 2024, 12000, 4200, 0, 600, 540, 1080, 15460, 'processed'),
        (company_uuid, emp_ids[9], 12, 2024, 10000, 3500, 0, 500, 450, 900, 12550, 'processed'),
        (company_uuid, emp_ids[10], 12, 2024, 9000, 3150, 0, 450, 405, 810, 11295, 'processed');

    -- ATTENDANCE DATA (last 7 days)
    INSERT INTO public.attendance_timesheet (
        company_id, employee_id, date, check_in_time, check_out_time, 
        planned_hours, actual_hours, overtime_hours, status
    ) VALUES 
        (company_uuid, emp_ids[1], CURRENT_DATE - 1, CURRENT_DATE - 1 + TIME '08:00', CURRENT_DATE - 1 + TIME '17:00', 8, 8.5, 0.5, 'present'),
        (company_uuid, emp_ids[2], CURRENT_DATE - 1, CURRENT_DATE - 1 + TIME '08:15', CURRENT_DATE - 1 + TIME '17:00', 8, 8.25, 0.25, 'present'),
        (company_uuid, emp_ids[3], CURRENT_DATE - 1, CURRENT_DATE - 1 + TIME '07:45', CURRENT_DATE - 1 + TIME '18:00', 8, 9.75, 1.75, 'present'),
        (company_uuid, emp_ids[4], CURRENT_DATE - 1, CURRENT_DATE - 1 + TIME '09:00', CURRENT_DATE - 1 + TIME '17:30', 8, 8, 0, 'present'),
        (company_uuid, emp_ids[5], CURRENT_DATE - 1, CURRENT_DATE - 1 + TIME '08:00', CURRENT_DATE - 1 + TIME '18:30', 8, 10, 2, 'present'),
        (company_uuid, emp_ids[6], CURRENT_DATE - 1, CURRENT_DATE - 1 + TIME '08:30', CURRENT_DATE - 1 + TIME '17:00', 8, 8, 0, 'present'),
        (company_uuid, emp_ids[7], CURRENT_DATE - 1, CURRENT_DATE - 1 + TIME '08:00', CURRENT_DATE - 1 + TIME '17:30', 8, 9, 1, 'present'),
        (company_uuid, emp_ids[8], CURRENT_DATE - 1, CURRENT_DATE - 1 + TIME '08:45', CURRENT_DATE - 1 + TIME '17:00', 8, 7.75, 0, 'late'),
        (company_uuid, emp_ids[9], CURRENT_DATE - 1, CURRENT_DATE - 1 + TIME '08:00', CURRENT_DATE - 1 + TIME '17:00', 8, 8.5, 0.5, 'present'),
        (company_uuid, emp_ids[10], CURRENT_DATE - 1, null, null, 8, 0, 0, 'absent');

    -- TRAINING RECORDS
    INSERT INTO public.training_records (
        employee_id, course_name, course_name_ar, provider, status, 
        start_date, end_date, hours, certificate_url
    ) VALUES 
        (emp_ids[1], 'Executive Leadership Program', 'برنامج القيادة التنفيذية', 'Harvard Business School', 'completed', '2024-01-15', '2024-03-15', 40, '/certificates/exec_leadership_001.pdf'),
        (emp_ids[2], 'Strategic HR Management', 'إدارة الموارد البشرية الاستراتيجية', 'SHRM', 'completed', '2024-02-01', '2024-04-01', 35, '/certificates/hr_strategic_002.pdf'),
        (emp_ids[3], 'AI & Machine Learning for Leaders', 'الذكاء الاصطناعي والتعلم الآلي للقادة', 'Stanford Online', 'completed', '2024-03-01', '2024-05-01', 50, '/certificates/ai_ml_003.pdf'),
        (emp_ids[4], 'Digital Marketing Mastery', 'إتقان التسويق الرقمي', 'Google Digital Academy', 'in_progress', '2024-11-01', '2024-12-31', 25, null),
        (emp_ids[5], 'Lean Six Sigma Black Belt', 'الحزام الأسود في لين سكس سيجما', 'ASQ', 'completed', '2024-06-01', '2024-08-01', 60, '/certificates/six_sigma_005.pdf'),
        (emp_ids[6], 'Advanced HR Analytics', 'تحليلات الموارد البشرية المتقدمة', 'CIPD', 'in_progress', '2024-10-01', '2024-12-15', 30, null),
        (emp_ids[7], 'Cloud Architecture Certification', 'شهادة هندسة الحوسبة السحابية', 'AWS', 'completed', '2024-04-01', '2024-06-01', 45, '/certificates/aws_arch_007.pdf'),
        (emp_ids[8], 'Financial Modeling & Analysis', 'النمذجة والتحليل المالي', 'CFA Institute', 'in_progress', '2024-09-01', '2024-12-31', 35, null),
        (emp_ids[9], 'Sales Excellence Program', 'برنامج التميز في المبيعات', 'Salesforce', 'completed', '2024-07-01', '2024-09-01', 20, '/certificates/sales_excel_009.pdf'),
        (emp_ids[10], 'Customer Success Mastery', 'إتقان نجاح العملاء', 'HubSpot Academy', 'completed', '2024-08-01', '2024-10-01', 15, '/certificates/customer_success_010.pdf');

END $$;