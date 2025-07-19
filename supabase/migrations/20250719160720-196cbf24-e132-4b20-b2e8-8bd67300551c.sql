-- Comprehensive data population for LEO-GEO functionality
-- Insert sample data into learning_progress_tracking for functional testing

INSERT INTO public.learning_progress_tracking (
  employee_id, 
  company_id, 
  module_id, 
  completion_percentage, 
  time_spent_hours, 
  last_accessed, 
  quiz_scores, 
  certificates_earned,
  skills_gained
) VALUES 
  (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 85.5, 12.5, now() - interval '2 hours', ARRAY[88, 92, 79], ARRAY['AI Fundamentals', 'Data Analytics'], ARRAY['Machine Learning', 'Data Visualization']),
  (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 67.2, 8.3, now() - interval '1 day', ARRAY[75, 82], ARRAY['Leadership Basics'], ARRAY['Team Management', 'Communication']),
  (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 92.8, 15.7, now() - interval '3 hours', ARRAY[90, 95, 88], ARRAY['Vision 2030 Certificate', 'Strategic Planning'], ARRAY['Strategic Thinking', 'Change Management']),
  (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 45.1, 6.2, now() - interval '5 days', ARRAY[60, 70], ARRAY[], ARRAY['Cultural Intelligence']),
  (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 78.9, 11.4, now() - interval '1 hour', ARRAY[85, 78, 80], ARRAY['HR Technology'], ARRAY['HRIS Management', 'Analytics']),
  (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 100.0, 20.0, now() - interval '2 days', ARRAY[95, 98, 92], ARRAY['Digital Transformation', 'Innovation Leadership'], ARRAY['Digital Strategy', 'Innovation Management']),
  (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 33.5, 4.8, now() - interval '1 week', ARRAY[65], ARRAY[], ARRAY['Project Management']),
  (gen_random_uuid(), gen_random_uuid(), gen_random_uuid(), 88.3, 14.2, now() - interval '4 hours', ARRAY[89, 87, 91], ARRAY['Cross-Cultural Communication'], ARRAY['Communication', 'Cultural Awareness']);

-- Insert sample data into engagement_metrics_tracking for functional testing
INSERT INTO public.engagement_metrics_tracking (
  employee_id, 
  company_id, 
  measurement_date, 
  engagement_score, 
  satisfaction_score, 
  productivity_score, 
  stress_level, 
  feedback_sentiment,
  pulse_responses,
  recognition_received,
  collaboration_index
) VALUES 
  (gen_random_uuid(), gen_random_uuid(), CURRENT_DATE, 87.5, 89.2, 85.8, 25.3, 'positive', 
   jsonb_build_object('energy', 4, 'motivation', 5, 'workload', 3), 
   jsonb_build_array('Innovation Award', 'Team Player'), 92.1),
  (gen_random_uuid(), gen_random_uuid(), CURRENT_DATE - 1, 74.2, 76.8, 72.5, 45.7, 'neutral', 
   jsonb_build_object('energy', 3, 'motivation', 3, 'workload', 4), 
   jsonb_build_array('Good Performance'), 78.5),
  (gen_random_uuid(), gen_random_uuid(), CURRENT_DATE, 91.8, 94.1, 88.9, 18.2, 'very_positive', 
   jsonb_build_object('energy', 5, 'motivation', 5, 'workload', 2), 
   jsonb_build_array('Excellence Award', 'Leadership Recognition', 'Innovation'), 95.7),
  (gen_random_uuid(), gen_random_uuid(), CURRENT_DATE - 2, 62.3, 65.9, 59.7, 58.4, 'negative', 
   jsonb_build_object('energy', 2, 'motivation', 2, 'workload', 5), 
   jsonb_build_array(), 65.2),
  (gen_random_uuid(), gen_random_uuid(), CURRENT_DATE, 83.6, 85.4, 81.2, 32.1, 'positive', 
   jsonb_build_object('energy', 4, 'motivation', 4, 'workload', 3), 
   jsonb_build_array('Team Collaboration'), 86.8),
  (gen_random_uuid(), gen_random_uuid(), CURRENT_DATE - 1, 79.4, 82.1, 76.8, 38.5, 'neutral', 
   jsonb_build_object('energy', 3, 'motivation', 4, 'workload', 4), 
   jsonb_build_array('Reliable Performance'), 81.3),
  (gen_random_uuid(), gen_random_uuid(), CURRENT_DATE, 95.2, 97.8, 92.6, 12.4, 'very_positive', 
   jsonb_build_object('energy', 5, 'motivation', 5, 'workload', 1), 
   jsonb_build_array('Outstanding Performance', 'Innovation Leader', 'Mentor'), 98.4),
  (gen_random_uuid(), gen_random_uuid(), CURRENT_DATE - 3, 68.9, 71.5, 66.3, 52.7, 'neutral', 
   jsonb_build_object('energy', 2, 'motivation', 3, 'workload', 4), 
   jsonb_build_array('Steady Contributor'), 72.6);

-- Update learning_engagement_insights with comprehensive data
INSERT INTO public.learning_engagement_insights (
  company_id,
  employee_id,
  learning_engagement_score,
  skills_completion_rate,
  engagement_impact_on_learning,
  learning_impact_on_engagement,
  cross_correlation_strength,
  recommended_actions,
  trend_analysis
) VALUES 
  (gen_random_uuid(), gen_random_uuid(), 89.7, 85.2, 15.3, 12.8, 0.78, 
   jsonb_build_array('Increase micro-learning opportunities', 'Gamify learning experience'), 
   jsonb_build_object('trend', 'increasing', 'velocity', 2.3)),
  (gen_random_uuid(), gen_random_uuid(), 72.4, 67.1, 8.9, 6.5, 0.65, 
   jsonb_build_array('Improve learning content relevance', 'Add peer collaboration'), 
   jsonb_build_object('trend', 'stable', 'velocity', 0.1)),
  (gen_random_uuid(), gen_random_uuid(), 94.1, 92.8, 18.7, 16.2, 0.85, 
   jsonb_build_array('Continue current approach', 'Add advanced modules'), 
   jsonb_build_object('trend', 'increasing', 'velocity', 3.1)),
  (gen_random_uuid(), gen_random_uuid(), 63.8, 59.4, 5.2, 4.1, 0.52, 
   jsonb_build_array('Address engagement barriers', 'Personalize learning paths'), 
   jsonb_build_object('trend', 'decreasing', 'velocity', -1.2)),
  (gen_random_uuid(), gen_random_uuid(), 81.5, 78.9, 12.4, 10.7, 0.72, 
   jsonb_build_array('Enhance social learning features', 'Add recognition system'), 
   jsonb_build_object('trend', 'increasing', 'velocity', 1.8)),
  (gen_random_uuid(), gen_random_uuid(), 76.2, 73.6, 9.8, 8.3, 0.68, 
   jsonb_build_array('Improve feedback mechanisms', 'Add skill assessments'), 
   jsonb_build_object('trend', 'stable', 'velocity', 0.3));

-- Add more cross-system recommendations for comprehensive testing
INSERT INTO public.cross_system_recommendations (
  company_id,
  employee_id,
  source_system,
  target_system,
  recommendation_type,
  recommendation_data,
  priority_score,
  is_active,
  expires_at
) VALUES 
  (gen_random_uuid(), gen_random_uuid(), 'leo', 'geo', 'engagement_boost', 
   jsonb_build_object(
     'title', 'High Learning Achiever Recognition',
     'description', 'This employee completed 3 advanced modules this month - perfect for peer recognition',
     'confidence', 0.92,
     'actions', jsonb_build_array('Nominate for Learning Champion', 'Share success story', 'Mentor new learners'),
     'priority', 88.5
   ), 88.5, true, now() + interval '30 days'),
  
  (gen_random_uuid(), gen_random_uuid(), 'geo', 'leo', 'learning_recommendation', 
   jsonb_build_object(
     'title', 'Engagement-Driven Learning Path',
     'description', 'High engagement in collaborative projects suggests readiness for leadership training',
     'confidence', 0.85,
     'actions', jsonb_build_array('Enroll in Leadership Program', 'Add team management modules', 'Assign mentorship role'),
     'priority', 82.3
   ), 82.3, true, now() + interval '30 days'),
  
  (gen_random_uuid(), gen_random_uuid(), 'leo', 'geo', 'skill_showcase', 
   jsonb_build_object(
     'title', 'Technical Skill Milestone',
     'description', 'Completed AI certification - opportunity for internal knowledge sharing',
     'confidence', 0.89,
     'actions', jsonb_build_array('Organize tech talk', 'Join innovation committee', 'Mentor colleagues'),
     'priority', 85.7
   ), 85.7, true, now() + interval '30 days'),
  
  (gen_random_uuid(), gen_random_uuid(), 'geo', 'leo', 'adaptive_learning', 
   jsonb_build_object(
     'title', 'Cultural Intelligence Development',
     'description', 'Strong cultural engagement signals readiness for advanced cultural leadership training',
     'confidence', 0.78,
     'actions', jsonb_build_array('Cultural ambassador program', 'Cross-cultural communication course', 'International project assignment'),
     'priority', 79.1
   ), 79.1, true, now() + interval '30 days'),
  
  (gen_random_uuid(), gen_random_uuid(), 'leo', 'geo', 'collaboration_opportunity', 
   jsonb_build_object(
     'title', 'Knowledge Sharing Champion',
     'description', 'Consistent high performance in knowledge assessments - ideal for peer coaching',
     'confidence', 0.91,
     'actions', jsonb_build_array('Peer coaching program', 'Knowledge base contributor', 'Training assistant'),
     'priority', 87.2
   ), 87.2, true, now() + interval '30 days'),
  
  (gen_random_uuid(), gen_random_uuid(), 'geo', 'leo', 'skill_gap_analysis', 
   jsonb_build_object(
     'title', 'Engagement-Learning Correlation',
     'description', 'Low engagement despite high learning completion - needs different learning approaches',
     'confidence', 0.73,
     'actions', jsonb_build_array('Switch to micro-learning', 'Add gamification', 'Peer learning groups'),
     'priority', 74.8
   ), 74.8, true, now() + interval '30 days');

-- Add performance analytics data
INSERT INTO public.ai_predictions (
  company_id,
  employee_id,
  model_type,
  prediction_score,
  risk_level,
  influencing_factors,
  confidence_interval,
  prediction_date,
  expires_at
) VALUES 
  (gen_random_uuid(), gen_random_uuid(), 'engagement_prediction', 0.87, 'low', 
   jsonb_build_object('learning_velocity', 0.82, 'team_collaboration', 0.91, 'recognition_frequency', 0.78),
   jsonb_build_object('lower', 0.82, 'upper', 0.92), CURRENT_DATE, CURRENT_DATE + 90),
  
  (gen_random_uuid(), gen_random_uuid(), 'retention_prediction', 0.73, 'medium', 
   jsonb_build_object('engagement_trend', 0.68, 'skill_development', 0.75, 'career_progression', 0.71),
   jsonb_build_object('lower', 0.65, 'upper', 0.81), CURRENT_DATE, CURRENT_DATE + 90),
  
  (gen_random_uuid(), gen_random_uuid(), 'performance_prediction', 0.92, 'low', 
   jsonb_build_object('learning_completion', 0.94, 'peer_feedback', 0.89, 'innovation_index', 0.93),
   jsonb_build_object('lower', 0.88, 'upper', 0.96), CURRENT_DATE, CURRENT_DATE + 90),
  
  (gen_random_uuid(), gen_random_uuid(), 'skill_development_prediction', 0.85, 'low', 
   jsonb_build_object('current_velocity', 0.83, 'motivation_score', 0.87, 'resource_utilization', 0.79),
   jsonb_build_object('lower', 0.80, 'upper', 0.90), CURRENT_DATE, CURRENT_DATE + 90);

-- Add system diagnostics for monitoring
INSERT INTO public.system_diagnostics (
  company_id,
  module_id,
  diagnostic_type,
  severity_level,
  issue_description,
  issue_description_ar,
  recommended_action,
  recommended_action_ar,
  ai_confidence_score,
  auto_fixable
) VALUES 
  (gen_random_uuid(), gen_random_uuid(), 'data_quality', 'info', 
   'LEO-GEO integration operating at optimal levels', 
   'تكامل LEO-GEO يعمل بمستويات مثلى',
   'Continue monitoring data flow and user engagement', 
   'استمر في مراقبة تدفق البيانات ومشاركة المستخدمين',
   0.95, false),
  
  (gen_random_uuid(), gen_random_uuid(), 'performance', 'info', 
   'All learning modules loading efficiently', 
   'جميع وحدات التعلم تحمل بكفاءة',
   'Monitor user completion rates and feedback', 
   'راقب معدلات إكمال المستخدمين والتعليقات',
   0.88, false),
  
  (gen_random_uuid(), gen_random_uuid(), 'integration', 'info', 
   'Cross-system recommendations generating successfully', 
   'توصيات الأنظمة المتداخلة تُنتج بنجاح',
   'Review recommendation accuracy and user adoption', 
   'راجع دقة التوصيات واعتماد المستخدمين',
   0.91, false);

-- Ensure AI sync events are populated for monitoring
INSERT INTO public.ai_sync_events (
  company_id,
  event_type,
  source_table,
  source_record_id,
  affected_modules,
  payload,
  sync_status
) VALUES 
  (gen_random_uuid(), 'leo_geo_sync', 'learning_progress_tracking', gen_random_uuid(),
   ARRAY['leo', 'geo', 'analytics', 'recommendations'],
   jsonb_build_object('sync_type', 'learning_update', 'timestamp', now(), 'status', 'success'),
   'completed'),
  
  (gen_random_uuid(), 'engagement_sync', 'engagement_metrics_tracking', gen_random_uuid(),
   ARRAY['geo', 'leo', 'analytics', 'predictions'],
   jsonb_build_object('sync_type', 'engagement_update', 'timestamp', now(), 'status', 'success'),
   'completed'),
  
  (gen_random_uuid(), 'recommendation_generation', 'cross_system_recommendations', gen_random_uuid(),
   ARRAY['leo', 'geo', 'ai_engine'],
   jsonb_build_object('sync_type', 'ai_recommendation', 'timestamp', now(), 'status', 'success'),
   'completed');