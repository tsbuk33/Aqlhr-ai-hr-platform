-- Context Engineering Engine (CEE) Database Schema
-- Purpose: Support Genspark.ai-first AI orchestration with intent classification, routing, and telemetry
-- PDPL Compliant: No raw document content, only metadata and routing statistics

-- AI Sessions: User interaction sessions for context tracking
create table if not exists ai_sessions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  user_id uuid not null,
  role text not null check (role in ('employee', 'manager', 'hr_manager', 'admin', 'super_admin')),
  lang text not null check (lang in ('en', 'ar')) default 'en',
  route text not null,                -- Current URL path for context
  user_agent text,                    -- Browser/client information
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- AI Intents: Classified user intents from Genspark analysis
create table if not exists ai_intents (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references ai_sessions(id) on delete cascade,
  company_id uuid not null,
  user_id uuid not null,
  lang text not null check (lang in ('en', 'ar')),
  route text not null,                -- URL path where intent originated
  module_context text not null,       -- e.g., 'gov.qiwa', 'employee', 'payroll'
  query text not null,                -- Original user query
  intent text not null,               -- Normalized intent label from Genspark
  urgency numeric not null check (urgency >= 0 and urgency <= 1),     -- 0..1 urgency score
  complexity numeric not null check (complexity >= 0 and complexity <= 1), -- 0..1 complexity score
  risk_hints jsonb default '[]'::jsonb, -- Array of risk indicators
  confidence numeric default 0.5 check (confidence >= 0 and confidence <= 1),
  created_at timestamptz not null default now()
);

-- AI Routing Plans: Generated routing decisions
create table if not exists ai_routing_plans (
  id uuid primary key default gen_random_uuid(),
  intent_id uuid not null references ai_intents(id) on delete cascade,
  plan jsonb not null,                -- Complete routing plan with providers, models, streaming config
  cost_target text not null check (cost_target in ('low', 'balanced', 'high')) default 'balanced',
  allow_streaming boolean not null default true,
  executed boolean not null default false,
  execution_started_at timestamptz,
  execution_completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- AI Routing Statistics: Execution telemetry
create table if not exists ai_routing_stats (
  id uuid primary key default gen_random_uuid(),
  intent_id uuid not null references ai_intents(id) on delete cascade,
  plan_id uuid not null references ai_routing_plans(id) on delete cascade,
  provider text not null check (provider in ('genspark', 'openai', 'manus', 'gemini')),
  model text not null,
  attempt_order int not null default 1, -- Order of execution in fallback chain
  latency_ms int not null check (latency_ms >= 0),
  tokens_in int not null default 0 check (tokens_in >= 0),
  tokens_out int not null default 0 check (tokens_out >= 0),
  cost_est_sar numeric not null default 0 check (cost_est_sar >= 0),
  success boolean not null,
  error_message text,
  response_quality numeric check (response_quality >= 0 and response_quality <= 1),
  created_at timestamptz not null default now()
);

-- AI Control Settings: Admin configuration
create table if not exists ai_control_settings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  module_context text not null,
  settings jsonb not null default '{}'::jsonb,
  updated_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(company_id, module_context)
);

-- Intent Labels: Predefined intent categories for consistency
create table if not exists ai_intent_labels (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  category text not null,
  description_en text not null,
  description_ar text not null,
  priority_weight numeric default 1.0 check (priority_weight >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Insert default intent labels
insert into ai_intent_labels (label, category, description_en, description_ar, priority_weight) values
('document_search', 'documents', 'User wants to search or find documents', 'يريد المستخدم البحث عن المستندات أو العثور عليها', 1.0),
('document_upload', 'documents', 'User wants to upload documents', 'يريد المستخدم رفع المستندات', 0.8),
('employee_inquiry', 'hr', 'Questions about employee data or records', 'استفسارات حول بيانات الموظفين أو السجلات', 1.2),
('payroll_calculation', 'payroll', 'Payroll and salary calculations', 'حسابات الرواتب والأجور', 1.5),
('compliance_check', 'compliance', 'Compliance and regulatory questions', 'استفسارات الامتثال واللوائح', 2.0),
('policy_review', 'policy', 'Policy interpretation and guidance', 'مراجعة وتفسير السياسات', 1.8),
('government_integration', 'government', 'Questions about government platforms', 'استفسارات حول المنصات الحكومية', 1.6),
('data_analysis', 'analytics', 'Data analysis and reporting requests', 'طلبات تحليل البيانات والتقارير', 1.4),
('technical_support', 'support', 'Technical help and troubleshooting', 'المساعدة التقنية وحل المشاكل', 1.0),
('general_inquiry', 'general', 'General questions and information requests', 'الاستفسارات العامة وطلبات المعلومات', 0.5)
on conflict (label) do nothing;

-- Create indexes for performance
create index if not exists idx_ai_sessions_company_user on ai_sessions(company_id, user_id);
create index if not exists idx_ai_sessions_created_at on ai_sessions(created_at desc);
create index if not exists idx_ai_intents_company_context on ai_intents(company_id, module_context);
create index if not exists idx_ai_intents_created_at on ai_intents(created_at desc);
create index if not exists idx_ai_intents_intent on ai_intents(intent);
create index if not exists idx_ai_routing_plans_intent on ai_routing_plans(intent_id);
create index if not exists idx_ai_routing_stats_provider on ai_routing_stats(provider);
create index if not exists idx_ai_routing_stats_created_at on ai_routing_stats(created_at desc);
create index if not exists idx_ai_control_settings_company on ai_control_settings(company_id);

-- Enable Row Level Security
alter table ai_sessions enable row level security;
alter table ai_intents enable row level security;
alter table ai_routing_plans enable row level security;
alter table ai_routing_stats enable row level security;
alter table ai_control_settings enable row level security;
alter table ai_intent_labels enable row level security;

-- RLS Policies for ai_sessions
create policy p_ai_sessions_tenant on ai_sessions
  using (company_id = public.get_user_company_id());

create policy p_ai_sessions_insert on ai_sessions
  for insert
  with check (company_id = public.get_user_company_id());

create policy p_ai_sessions_update on ai_sessions
  for update
  using (company_id = public.get_user_company_id());

-- RLS Policies for ai_intents
create policy p_ai_intents_tenant on ai_intents
  using (company_id = public.get_user_company_id());

create policy p_ai_intents_insert on ai_intents
  for insert
  with check (company_id = public.get_user_company_id());

-- RLS Policies for ai_routing_plans
create policy p_ai_routing_plans_tenant on ai_routing_plans
  using (intent_id in (select id from ai_intents where company_id = public.get_user_company_id()));

create policy p_ai_routing_plans_insert on ai_routing_plans
  for insert
  with check (intent_id in (select id from ai_intents where company_id = public.get_user_company_id()));

create policy p_ai_routing_plans_update on ai_routing_plans
  for update
  using (intent_id in (select id from ai_intents where company_id = public.get_user_company_id()));

-- RLS Policies for ai_routing_stats
create policy p_ai_routing_stats_tenant on ai_routing_stats
  using (intent_id in (select id from ai_intents where company_id = public.get_user_company_id()));

create policy p_ai_routing_stats_insert on ai_routing_stats
  for insert
  with check (intent_id in (select id from ai_intents where company_id = public.get_user_company_id()));

-- RLS Policies for ai_control_settings
create policy p_ai_control_settings_tenant on ai_control_settings
  using (company_id = public.get_user_company_id());

create policy p_ai_control_settings_insert on ai_control_settings
  for insert
  with check (company_id = public.get_user_company_id());

create policy p_ai_control_settings_update on ai_control_settings
  for update
  using (company_id = public.get_user_company_id());

-- RLS Policies for ai_intent_labels (read-only for all authenticated users)
create policy p_ai_intent_labels_read on ai_intent_labels
  for select
  using (true);

-- Functions for analytics and reporting

-- Get intent statistics for a company
create or replace function get_intent_stats_v1(
  target_company_id uuid default null,
  start_date timestamptz default (now() - interval '30 days'),
  end_date timestamptz default now()
)
returns table(
  intent text,
  count bigint,
  avg_urgency numeric,
  avg_complexity numeric,
  avg_latency_ms numeric,
  success_rate numeric
)
language plpgsql
security definer
as $$
begin
  -- Use tenant isolation if target_company_id not provided
  if target_company_id is null then
    target_company_id := public.get_user_company_id();
  end if;

  return query
  select 
    i.intent,
    count(*) as count,
    round(avg(i.urgency), 3) as avg_urgency,
    round(avg(i.complexity), 3) as avg_complexity,
    round(avg(s.latency_ms), 0) as avg_latency_ms,
    round(avg(case when s.success then 1.0 else 0.0 end), 3) as success_rate
  from ai_intents i
  left join ai_routing_stats s on i.id = s.intent_id
  where i.company_id = target_company_id
    and i.created_at >= start_date
    and i.created_at <= end_date
  group by i.intent
  order by count desc;
end;
$$;

-- Get routing performance by provider
create or replace function get_routing_performance_v1(
  target_company_id uuid default null,
  start_date timestamptz default (now() - interval '7 days'),
  end_date timestamptz default now()
)
returns table(
  provider text,
  model text,
  requests bigint,
  success_rate numeric,
  avg_latency_ms numeric,
  total_tokens bigint,
  total_cost_sar numeric
)
language plpgsql
security definer
as $$
begin
  -- Use tenant isolation if target_company_id not provided
  if target_company_id is null then
    target_company_id := public.get_user_company_id();
  end if;

  return query
  select 
    s.provider,
    s.model,
    count(*) as requests,
    round(avg(case when s.success then 1.0 else 0.0 end), 3) as success_rate,
    round(avg(s.latency_ms), 0) as avg_latency_ms,
    sum(s.tokens_in + s.tokens_out) as total_tokens,
    round(sum(s.cost_est_sar), 2) as total_cost_sar
  from ai_routing_stats s
  join ai_intents i on s.intent_id = i.id
  where i.company_id = target_company_id
    and s.created_at >= start_date
    and s.created_at <= end_date
  group by s.provider, s.model
  order by requests desc;
end;
$$;

-- Update session activity
create or replace function update_session_activity_v1(session_uuid uuid)
returns void
language plpgsql
security definer
as $$
begin
  update ai_sessions 
  set updated_at = now()
  where id = session_uuid
    and company_id = public.get_user_company_id();
end;
$$;

-- Comments for documentation
comment on table ai_sessions is 'AI interaction sessions for context tracking and user behavior analysis';
comment on table ai_intents is 'Classified user intents from Genspark analysis with urgency and complexity scoring';
comment on table ai_routing_plans is 'AI routing decisions and execution plans for provider selection';
comment on table ai_routing_stats is 'Execution telemetry and performance metrics for AI operations';
comment on table ai_control_settings is 'Admin configuration for AI behavior per module context';
comment on table ai_intent_labels is 'Predefined intent categories for consistent classification';

comment on column ai_intents.urgency is 'Urgency score from 0 (low) to 1 (high) based on business context';
comment on column ai_intents.complexity is 'Query complexity from 0 (simple) to 1 (complex) requiring advanced models';
comment on column ai_routing_plans.plan is 'JSON routing plan with provider order, models, and configuration';
comment on column ai_routing_stats.attempt_order is 'Order of execution in fallback provider chain';
comment on column ai_routing_stats.cost_est_sar is 'Estimated cost in Saudi Riyals for the API call';