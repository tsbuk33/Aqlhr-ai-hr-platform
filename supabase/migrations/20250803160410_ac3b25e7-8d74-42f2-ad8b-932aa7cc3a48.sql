-- Add GOSI rates for non-Saudi employees (effective July 3, 2024)
-- Non-Saudi employees: 0% employee contribution + 2% employer contribution = 2% total

-- First, update any existing non-Saudi rates to end before July 3, 2024
UPDATE gosi_rate_history 
SET effective_to = '2024-07-02'
WHERE nationality = 'NON_SAUDI' AND effective_from <= '2024-07-03' AND (effective_to IS NULL OR effective_to > '2024-07-03');

-- Insert the new 2024 GOSI rates for non-Saudi employees (both OLD and NEW systems)
INSERT INTO gosi_rate_history (
  system_type,
  nationality, 
  employee_rate,
  employer_rate,
  effective_from,
  effective_to
) VALUES 
  ('OLD', 'NON_SAUDI', 0.00, 2.00, '2024-07-03', NULL),
  ('NEW', 'NON_SAUDI', 0.00, 2.00, '2024-07-03', NULL);