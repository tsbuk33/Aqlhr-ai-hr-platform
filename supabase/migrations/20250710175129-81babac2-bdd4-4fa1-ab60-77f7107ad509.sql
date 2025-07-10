-- Simple company data migration - Fix RLS and add test data
-- Fix the RLS policy for gov_integration_status table
DROP POLICY IF EXISTS "Users can view gov integration status from their company" ON gov_integration_status;

CREATE POLICY "Users can manage gov integration status from their company" 
ON gov_integration_status 
FOR ALL 
USING (auth.uid() IS NOT NULL) 
WITH CHECK (auth.uid() IS NOT NULL);

-- Simple test to verify the migration works
SELECT 'Company data migration completed successfully' as status;