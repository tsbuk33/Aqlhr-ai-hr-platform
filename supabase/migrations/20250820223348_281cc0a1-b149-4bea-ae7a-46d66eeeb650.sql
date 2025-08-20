-- Create cci_waves table if it doesn't exist
CREATE TABLE IF NOT EXISTS cci_waves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    survey_id UUID NOT NULL REFERENCES cci_surveys(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft',
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID
);

-- Enable RLS
ALTER TABLE cci_waves ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "cci_waves_tenant_access" ON cci_waves
FOR ALL USING (tenant_id = get_user_company_id())
WITH CHECK (tenant_id = get_user_company_id());