-- Insert tool categories for SanadHR integrations
INSERT INTO public.tool_integrations (tool_name, tool_category, is_enabled, configuration, sync_status) VALUES

-- Communication & Collaboration (5 tools)
('Microsoft Teams', 'communication_collaboration', false, '{"type": "communication", "features": ["chat", "video_calls", "file_sharing", "channel_management"]}', 'inactive'),
('Slack', 'communication_collaboration', false, '{"type": "communication", "features": ["messaging", "channels", "integrations", "file_sharing"]}', 'inactive'),
('WhatsApp Business', 'communication_collaboration', false, '{"type": "communication", "features": ["business_messaging", "automated_responses", "customer_support"]}', 'inactive'),
('Email Integration', 'communication_collaboration', false, '{"type": "communication", "features": ["email_sync", "calendar_integration", "contact_management"]}', 'inactive'),
('Outlook Integration', 'communication_collaboration', false, '{"type": "communication", "features": ["email", "calendar", "contacts", "tasks"]}', 'inactive'),

-- Document Management (6 tools)
('SharePoint', 'document_management', false, '{"type": "storage", "features": ["document_storage", "collaboration", "version_control", "workflows"]}', 'inactive'),
('Google Drive', 'document_management', false, '{"type": "storage", "features": ["cloud_storage", "real_time_collaboration", "sharing", "sync"]}', 'inactive'),
('OneDrive', 'document_management', false, '{"type": "storage", "features": ["personal_storage", "business_storage", "sync", "sharing"]}', 'inactive'),
('Dropbox', 'document_management', false, '{"type": "storage", "features": ["file_storage", "sync", "sharing", "collaboration"]}', 'inactive'),
('DocuSign', 'document_management', false, '{"type": "signatures", "features": ["digital_signatures", "document_workflow", "compliance", "templates"]}', 'inactive'),
('Adobe Sign', 'document_management', false, '{"type": "signatures", "features": ["e_signatures", "document_security", "workflow_automation"]}', 'inactive'),

-- Calendar & Scheduling (4 tools)
('Google Calendar', 'calendar_scheduling', false, '{"type": "calendar", "features": ["event_management", "scheduling", "reminders", "integration"]}', 'inactive'),
('Outlook Calendar', 'calendar_scheduling', false, '{"type": "calendar", "features": ["appointment_scheduling", "meeting_management", "calendar_sync"]}', 'inactive'),
('Calendly', 'calendar_scheduling', false, '{"type": "scheduling", "features": ["automated_scheduling", "booking_pages", "calendar_integration"]}', 'inactive'),
('Room Booking', 'calendar_scheduling', false, '{"type": "booking", "features": ["room_reservation", "resource_management", "conflict_resolution"]}', 'inactive'),

-- Analytics & BI (4 tools)
('Power BI', 'analytics_bi', false, '{"type": "analytics", "features": ["data_visualization", "dashboards", "reports", "data_modeling"]}', 'inactive'),
('Tableau', 'analytics_bi', false, '{"type": "analytics", "features": ["advanced_visualization", "data_analysis", "interactive_dashboards"]}', 'inactive'),
('Google Analytics', 'analytics_bi', false, '{"type": "web_analytics", "features": ["website_tracking", "user_behavior", "conversion_analysis"]}', 'inactive'),
('Custom Connectors', 'analytics_bi', false, '{"type": "integration", "features": ["api_connections", "data_sync", "custom_workflows"]}', 'inactive'),

-- Learning & Development (4 tools)
('LinkedIn Learning', 'learning_development', false, '{"type": "e_learning", "features": ["professional_courses", "skill_development", "certificates", "learning_paths"]}', 'inactive'),
('Coursera Business', 'learning_development', false, '{"type": "e_learning", "features": ["business_courses", "university_partnerships", "skill_assessments"]}', 'inactive'),
('Udemy Business', 'learning_development', false, '{"type": "e_learning", "features": ["business_training", "technical_skills", "on_demand_learning"]}', 'inactive'),
('Local Training Platforms', 'learning_development', false, '{"type": "training", "features": ["local_content", "custom_training", "compliance_training"]}', 'inactive'),

-- Automation Platforms (3 tools)
('Zapier', 'automation_platforms', false, '{"type": "automation", "features": ["workflow_automation", "app_connections", "triggers", "actions"]}', 'inactive'),
('Power Automate', 'automation_platforms', false, '{"type": "automation", "features": ["microsoft_integration", "business_processes", "approval_workflows"]}', 'inactive'),
('Custom Workflows', 'automation_platforms', false, '{"type": "automation", "features": ["bespoke_automation", "api_integration", "business_logic"]}', 'inactive');