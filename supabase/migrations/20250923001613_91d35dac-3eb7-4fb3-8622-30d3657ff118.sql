-- Manager Dashboard Backend Infrastructure
CREATE TABLE public.manager_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL,
  employee_id TEXT NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT,
  department TEXT NOT NULL,
  department_ar TEXT,
  direct_reports INTEGER DEFAULT 0,
  team_performance_score NUMERIC DEFAULT 0,
  pending_approvals INTEGER DEFAULT 0,
  team_goals_total INTEGER DEFAULT 0,
  team_goals_achieved INTEGER DEFAULT 0,
  emergency_contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team members under managers
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manager_id UUID NOT NULL REFERENCES public.manager_profiles(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ar TEXT,
  position TEXT,
  position_ar TEXT,
  status TEXT CHECK (status IN ('present', 'absent', 'late', 'on_leave', 'remote')) DEFAULT 'present',
  check_in_time TIME,
  check_out_time TIME,
  location TEXT,
  performance_score NUMERIC DEFAULT 0,
  engagement_score NUMERIC DEFAULT 0,
  productivity_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Manager alerts and notifications
CREATE TABLE public.manager_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manager_id UUID NOT NULL REFERENCES public.manager_profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('attendance', 'leave', 'performance', 'urgent', 'approval', 'goal')) NOT NULL,
  title TEXT NOT NULL,
  title_ar TEXT,
  message TEXT NOT NULL,
  message_ar TEXT,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  is_read BOOLEAN DEFAULT false,
  related_employee_id UUID REFERENCES public.employees(id),
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team approval workflows
CREATE TABLE public.team_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manager_id UUID NOT NULL REFERENCES public.manager_profiles(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  approval_type TEXT CHECK (approval_type IN ('leave', 'overtime', 'expense', 'training', 'performance', 'goal')) NOT NULL,
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT,
  description_ar TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')) DEFAULT 'pending',
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  requested_date DATE,
  amount NUMERIC,
  currency TEXT DEFAULT 'SAR',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  rejection_reason_ar TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team goals and objectives
CREATE TABLE public.team_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manager_id UUID NOT NULL REFERENCES public.manager_profiles(id) ON DELETE CASCADE,
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT,
  description_ar TEXT,
  category TEXT CHECK (category IN ('performance', 'learning', 'project', 'kpi', 'personal')) NOT NULL,
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  unit TEXT,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused', 'cancelled')) DEFAULT 'not_started',
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  start_date DATE,
  due_date DATE,
  completion_percentage NUMERIC DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team Analytics Infrastructure
CREATE TABLE public.team_performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  manager_id UUID REFERENCES public.manager_profiles(id) ON DELETE CASCADE,
  team_id UUID,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_team_members INTEGER DEFAULT 0,
  active_members INTEGER DEFAULT 0,
  average_performance_score NUMERIC DEFAULT 0,
  average_engagement_score NUMERIC DEFAULT 0,
  average_productivity_score NUMERIC DEFAULT 0,
  goals_achieved INTEGER DEFAULT 0,
  goals_total INTEGER DEFAULT 0,
  attendance_rate NUMERIC DEFAULT 0,
  on_time_rate NUMERIC DEFAULT 0,
  overtime_hours NUMERIC DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  tasks_assigned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Attendance analytics
CREATE TABLE public.attendance_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  team_member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT CHECK (status IN ('present', 'absent', 'late', 'on_leave', 'remote')) NOT NULL,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  break_duration NUMERIC DEFAULT 0,
  working_hours NUMERIC DEFAULT 0,
  overtime_hours NUMERIC DEFAULT 0,
  location TEXT,
  is_remote BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Productivity tracking
CREATE TABLE public.productivity_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  team_member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  tasks_completed INTEGER DEFAULT 0,
  tasks_assigned INTEGER DEFAULT 0,
  quality_score NUMERIC DEFAULT 0,
  efficiency_score NUMERIC DEFAULT 0,
  collaboration_score NUMERIC DEFAULT 0,
  innovation_score NUMERIC DEFAULT 0,
  time_utilization NUMERIC DEFAULT 0,
  project_contributions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Workload distribution
CREATE TABLE public.workload_distribution (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  manager_id UUID NOT NULL REFERENCES public.manager_profiles(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_tasks INTEGER DEFAULT 0,
  high_priority_tasks INTEGER DEFAULT 0,
  medium_priority_tasks INTEGER DEFAULT 0,
  low_priority_tasks INTEGER DEFAULT 0,
  estimated_hours NUMERIC DEFAULT 0,
  actual_hours NUMERIC DEFAULT 0,
  workload_percentage NUMERIC DEFAULT 0,
  stress_level NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team engagement tracking
CREATE TABLE public.team_engagement_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  team_member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  engagement_score NUMERIC DEFAULT 0 CHECK (engagement_score >= 0 AND engagement_score <= 10),
  satisfaction_score NUMERIC DEFAULT 0 CHECK (satisfaction_score >= 0 AND satisfaction_score <= 10),
  motivation_level NUMERIC DEFAULT 0 CHECK (motivation_level >= 0 AND motivation_level <= 10),
  feedback_sentiment NUMERIC DEFAULT 0,
  participation_rate NUMERIC DEFAULT 0,
  communication_frequency INTEGER DEFAULT 0,
  team_collaboration_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Action items and recommendations
CREATE TABLE public.action_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  manager_id UUID NOT NULL REFERENCES public.manager_profiles(id) ON DELETE CASCADE,
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT,
  description_ar TEXT,
  category TEXT CHECK (category IN ('performance', 'attendance', 'engagement', 'training', 'goal', 'recognition')) NOT NULL,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  due_date DATE,
  assigned_to UUID REFERENCES auth.users(id),
  is_ai_generated BOOLEAN DEFAULT false,
  confidence_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.manager_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productivity_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workload_distribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Manager Profiles
CREATE POLICY "Users can view their own manager profile" ON public.manager_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own manager profile" ON public.manager_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own manager profile" ON public.manager_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "HR managers can view all manager profiles in their company" ON public.manager_profiles FOR SELECT USING (
  is_hr_manager() AND company_id = get_current_user_company_id()
);

-- RLS Policies for Team Members
CREATE POLICY "Managers can view their team members" ON public.team_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.manager_profiles WHERE id = team_members.manager_id AND user_id = auth.uid())
);
CREATE POLICY "Managers can manage their team members" ON public.team_members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.manager_profiles WHERE id = team_members.manager_id AND user_id = auth.uid())
);
CREATE POLICY "HR managers can view all team members in their company" ON public.team_members FOR SELECT USING (
  is_hr_manager() AND EXISTS (
    SELECT 1 FROM public.manager_profiles mp WHERE mp.id = team_members.manager_id AND mp.company_id = get_current_user_company_id()
  )
);

-- RLS Policies for Manager Alerts
CREATE POLICY "Managers can view their own alerts" ON public.manager_alerts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.manager_profiles WHERE id = manager_alerts.manager_id AND user_id = auth.uid())
);
CREATE POLICY "Managers can manage their own alerts" ON public.manager_alerts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.manager_profiles WHERE id = manager_alerts.manager_id AND user_id = auth.uid())
);

-- RLS Policies for Team Approvals
CREATE POLICY "Managers can view their team approvals" ON public.team_approvals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.manager_profiles WHERE id = team_approvals.manager_id AND user_id = auth.uid())
);
CREATE POLICY "Managers can manage their team approvals" ON public.team_approvals FOR ALL USING (
  EXISTS (SELECT 1 FROM public.manager_profiles WHERE id = team_approvals.manager_id AND user_id = auth.uid())
);

-- RLS Policies for Team Goals
CREATE POLICY "Managers can view their team goals" ON public.team_goals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.manager_profiles WHERE id = team_goals.manager_id AND user_id = auth.uid())
);
CREATE POLICY "Managers can manage their team goals" ON public.team_goals FOR ALL USING (
  EXISTS (SELECT 1 FROM public.manager_profiles WHERE id = team_goals.manager_id AND user_id = auth.uid())
);

-- RLS Policies for Analytics Tables
CREATE POLICY "Company users can view team performance metrics" ON public.team_performance_metrics FOR SELECT USING (
  company_id = get_current_user_company_id()
);
CREATE POLICY "Managers can manage team performance metrics" ON public.team_performance_metrics FOR ALL USING (
  manager_id IS NULL OR EXISTS (SELECT 1 FROM public.manager_profiles WHERE id = team_performance_metrics.manager_id AND user_id = auth.uid())
);

CREATE POLICY "Company users can view attendance analytics" ON public.attendance_analytics FOR SELECT USING (
  company_id = get_current_user_company_id()
);
CREATE POLICY "Managers can manage attendance analytics" ON public.attendance_analytics FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.team_members tm 
    JOIN public.manager_profiles mp ON mp.id = tm.manager_id 
    WHERE tm.id = attendance_analytics.team_member_id AND mp.user_id = auth.uid()
  )
);

CREATE POLICY "Company users can view productivity metrics" ON public.productivity_metrics FOR SELECT USING (
  company_id = get_current_user_company_id()
);
CREATE POLICY "Managers can manage productivity metrics" ON public.productivity_metrics FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.team_members tm 
    JOIN public.manager_profiles mp ON mp.id = tm.manager_id 
    WHERE tm.id = productivity_metrics.team_member_id AND mp.user_id = auth.uid()
  )
);

CREATE POLICY "Company users can view workload distribution" ON public.workload_distribution FOR SELECT USING (
  company_id = get_current_user_company_id()
);
CREATE POLICY "Managers can manage workload distribution" ON public.workload_distribution FOR ALL USING (
  EXISTS (SELECT 1 FROM public.manager_profiles WHERE id = workload_distribution.manager_id AND user_id = auth.uid())
);

CREATE POLICY "Company users can view engagement metrics" ON public.team_engagement_metrics FOR SELECT USING (
  company_id = get_current_user_company_id()
);
CREATE POLICY "Managers can manage engagement metrics" ON public.team_engagement_metrics FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.team_members tm 
    JOIN public.manager_profiles mp ON mp.id = tm.manager_id 
    WHERE tm.id = team_engagement_metrics.team_member_id AND mp.user_id = auth.uid()
  )
);

CREATE POLICY "Company users can view action items" ON public.action_items FOR SELECT USING (
  company_id = get_current_user_company_id()
);
CREATE POLICY "Managers can manage action items" ON public.action_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.manager_profiles WHERE id = action_items.manager_id AND user_id = auth.uid())
);

-- Create indexes for performance
CREATE INDEX idx_manager_profiles_user_id ON public.manager_profiles(user_id);
CREATE INDEX idx_manager_profiles_company_id ON public.manager_profiles(company_id);
CREATE INDEX idx_team_members_manager_id ON public.team_members(manager_id);
CREATE INDEX idx_team_members_employee_id ON public.team_members(employee_id);
CREATE INDEX idx_manager_alerts_manager_id ON public.manager_alerts(manager_id);
CREATE INDEX idx_manager_alerts_created_at ON public.manager_alerts(created_at DESC);
CREATE INDEX idx_team_approvals_manager_id ON public.team_approvals(manager_id);
CREATE INDEX idx_team_approvals_status ON public.team_approvals(status);
CREATE INDEX idx_team_goals_manager_id ON public.team_goals(manager_id);
CREATE INDEX idx_team_performance_metrics_company_id ON public.team_performance_metrics(company_id);
CREATE INDEX idx_team_performance_metrics_date ON public.team_performance_metrics(metric_date DESC);
CREATE INDEX idx_attendance_analytics_company_id ON public.attendance_analytics(company_id);
CREATE INDEX idx_attendance_analytics_date ON public.attendance_analytics(attendance_date DESC);
CREATE INDEX idx_productivity_metrics_company_id ON public.productivity_metrics(company_id);
CREATE INDEX idx_workload_distribution_manager_id ON public.workload_distribution(manager_id);
CREATE INDEX idx_team_engagement_metrics_company_id ON public.team_engagement_metrics(company_id);
CREATE INDEX idx_action_items_manager_id ON public.action_items(manager_id);

-- Create update triggers
CREATE TRIGGER update_manager_profiles_updated_at BEFORE UPDATE ON public.manager_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_manager_alerts_updated_at BEFORE UPDATE ON public.manager_alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_team_approvals_updated_at BEFORE UPDATE ON public.team_approvals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_team_goals_updated_at BEFORE UPDATE ON public.team_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_team_performance_metrics_updated_at BEFORE UPDATE ON public.team_performance_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_attendance_analytics_updated_at BEFORE UPDATE ON public.attendance_analytics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_productivity_metrics_updated_at BEFORE UPDATE ON public.productivity_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_workload_distribution_updated_at BEFORE UPDATE ON public.workload_distribution FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_team_engagement_metrics_updated_at BEFORE UPDATE ON public.team_engagement_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_action_items_updated_at BEFORE UPDATE ON public.action_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();