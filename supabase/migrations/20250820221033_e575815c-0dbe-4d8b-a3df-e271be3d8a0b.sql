-- 1) DB hardening: unique constraint for one response per respondent per wave
create unique index if not exists uq_cci_response_per_wave
  on public.cci_responses(tenant_id, survey_id, wave_id, respondent_hash);

-- 2) Optional invite tokens table for closed surveys
create table if not exists public.cci_invite_tokens (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  survey_id uuid not null references public.cci_surveys(id) on delete cascade,
  wave_id uuid not null references public.cci_waves(id) on delete cascade,
  token_hash text not null unique,
  channel text check (channel in ('email','sms','qr','link')) default 'link',
  expires_at timestamptz,
  redeemed_at timestamptz,
  meta jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_cci_invites_tenant_survey_wave 
  on public.cci_invite_tokens(tenant_id, survey_id, wave_id);

-- Enable RLS on invite tokens
alter table public.cci_invite_tokens enable row level security;

-- RLS policy for invite tokens
create policy "cci_invite_tokens_tenant_access" 
on public.cci_invite_tokens 
for all 
using (tenant_id = get_user_company_id()) 
with check (tenant_id = get_user_company_id());