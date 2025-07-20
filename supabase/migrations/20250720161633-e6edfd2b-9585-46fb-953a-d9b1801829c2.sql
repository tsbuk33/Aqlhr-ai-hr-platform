-- Fix the gov_integration_status_status_check constraint to include 'connected' status
ALTER TABLE gov_integration_status 
DROP CONSTRAINT gov_integration_status_status_check;

ALTER TABLE gov_integration_status 
ADD CONSTRAINT gov_integration_status_status_check 
CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'error'::text, 'pending'::text, 'connected'::text, 'syncing'::text, 'disconnected'::text]));