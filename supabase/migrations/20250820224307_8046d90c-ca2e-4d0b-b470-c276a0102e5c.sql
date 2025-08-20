-- DB hardening: unique constraint and invite tokens table
-- One response per respondent per wave
CREATE UNIQUE INDEX IF NOT EXISTS uq_cci_response_per_wave
  ON public.cci_responses(tenant_id, survey_id, wave_id, respondent_hash);

-- One-time invite tokens (for closed surveys)
CREATE TABLE IF NOT EXISTS public.cci_invite_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  survey_id UUID NOT NULL REFERENCES public.cci_surveys(id) ON DELETE CASCADE,
  wave_id UUID NOT NULL REFERENCES public.cci_waves(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  channel TEXT CHECK (channel IN ('email','sms','qr','link')) DEFAULT 'link',
  expires_at TIMESTAMPTZ,
  redeemed_at TIMESTAMPTZ,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cci_invites_tenant_survey_wave 
ON public.cci_invite_tokens(tenant_id, survey_id, wave_id);

-- Enable RLS for invite tokens
ALTER TABLE public.cci_invite_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cci_invite_tokens_tenant_access" ON public.cci_invite_tokens
FOR ALL USING (tenant_id = get_user_company_id())
WITH CHECK (tenant_id = get_user_company_id());