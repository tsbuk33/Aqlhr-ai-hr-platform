-- Comprehensive data population for LEO-GEO functionality with correct column names
-- Insert sample data into learning_progress_tracking for functional testing

INSERT INTO public.learning_progress_tracking (
  employee_id, 
  company_id, 
  skill_name,
  skill_category,
  current_level,
  target_level,
  completion_percentage, 
  learning_streak_days,
  last_activity_date,
  engagement_correlation
) VALUES 
  (gen_random_uuid(), gen_random_uuid(), 'AI & Machine Learning', 'Technical', 75.0, 90.0, 85.5, 12, CURRENT_DATE - 2, 0.82),
  (gen_random_uuid(), gen_random_uuid(), 'Leadership Development', 'Management', 67.0, 85.0, 67.2, 8, CURRENT_DATE - 1, 0.75),
  (gen_random_uuid(), gen_random_uuid(), 'Vision 2030 Strategy', 'Strategic', 92.0, 95.0, 92.8, 15, CURRENT_DATE, 0.89),
  (gen_random_uuid(), gen_random_uuid(), 'Cultural Intelligence', 'Cultural', 45.0, 75.0, 45.1, 6, CURRENT_DATE - 5, 0.68),
  (gen_random_uuid(), gen_random_uuid(), 'HR Technology', 'Technical', 78.0, 90.0, 78.9, 11, CURRENT_DATE - 1, 0.85),
  (gen_random_uuid(), gen_random_uuid(), 'Digital Transformation', 'Innovation', 100.0, 100.0, 100.0, 20, CURRENT_DATE - 2, 0.95),
  (gen_random_uuid(), gen_random_uuid(), 'Project Management', 'Business', 33.0, 80.0, 33.5, 4, CURRENT_DATE - 7, 0.65),
  (gen_random_uuid(), gen_random_uuid(), 'Cross-Cultural Communication', 'Cultural', 88.0, 95.0, 88.3, 14, CURRENT_DATE, 0.87);

-- Insert sample data into engagement_metrics_tracking for functional testing
INSERT INTO public.engagement_metrics_tracking (
  employee_id, 
  company_id, 
  engagement_score,
  pulse_response_rate,
  recognition_given,
  recognition_received,
  connections_made,
  collaboration_score,
  learning_correlation,
  measurement_date
) VALUES 
  (gen_random_uuid(), gen_random_uuid(), 87.5, 94.2, 12, 5, 8, 92.1, 0.85, CURRENT_DATE),
  (gen_random_uuid(), gen_random_uuid(), 74.2, 86.8, 6, 2, 4, 78.5, 0.72, CURRENT_DATE - 1),
  (gen_random_uuid(), gen_random_uuid(), 91.8, 98.1, 18, 9, 12, 95.7, 0.92, CURRENT_DATE),
  (gen_random_uuid(), gen_random_uuid(), 62.3, 75.9, 3, 1, 2, 65.2, 0.58, CURRENT_DATE - 2),
  (gen_random_uuid(), gen_random_uuid(), 83.6, 90.4, 10, 4, 7, 86.8, 0.81, CURRENT_DATE),
  (gen_random_uuid(), gen_random_uuid(), 79.4, 88.1, 8, 3, 5, 81.3, 0.78, CURRENT_DATE - 1),
  (gen_random_uuid(), gen_random_uuid(), 95.2, 99.8, 25, 15, 18, 98.4, 0.97, CURRENT_DATE),
  (gen_random_uuid(), gen_random_uuid(), 68.9, 81.5, 4, 1, 3, 72.6, 0.69, CURRENT_DATE - 3);

-- Update learning_engagement_insights with comprehensive data
INSERT INTO public.learning_engagement_insights (
  company_id,
  employee_id,
  learning_engagement_score,
  skills_completion_rate,
  engagement_impact_on_learning,
  learning_impact_on_engagement,
  recommended_learning_actions,
  recommended_engagement_actions
) VALUES 
  (gen_random_uuid(), gen_random_uuid(), 89.7, 85.2, 15.3, 12.8, 
   jsonb_build_array('Increase micro-learning opportunities', 'Gamify learning experience'), 
   jsonb_build_array('Peer recognition program', 'Innovation showcase')),
  (gen_random_uuid(), gen_random_uuid(), 72.4, 67.1, 8.9, 6.5, 
   jsonb_build_array('Improve learning content relevance', 'Add peer collaboration'), 
   jsonb_build_array('Team building activities', 'Mentorship program')),
  (gen_random_uuid(), gen_random_uuid(), 94.1, 92.8, 18.7, 16.2, 
   jsonb_build_array('Continue current approach', 'Add advanced modules'), 
   jsonb_build_array('Leadership opportunities', 'Knowledge sharing sessions')),
  (gen_random_uuid(), gen_random_uuid(), 63.8, 59.4, 5.2, 4.1, 
   jsonb_build_array('Address engagement barriers', 'Personalize learning paths'), 
   jsonb_build_array('One-on-one coaching', 'Career development planning')),
  (gen_random_uuid(), gen_random_uuid(), 81.5, 78.9, 12.4, 10.7, 
   jsonb_build_array('Enhance social learning features', 'Add recognition system'), 
   jsonb_build_array('Cross-functional projects', 'Peer feedback system')),
  (gen_random_uuid(), gen_random_uuid(), 76.2, 73.6, 9.8, 8.3, 
   jsonb_build_array('Improve feedback mechanisms', 'Add skill assessments'), 
   jsonb_build_array('Regular check-ins', 'Achievement celebrations'));

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

-- Add AI sync events for monitoring
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