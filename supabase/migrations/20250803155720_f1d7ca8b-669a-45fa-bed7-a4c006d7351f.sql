-- Update GOSI rates to reflect July 3, 2024 changes (effective 2024-07-03)
-- Add the new 2024 GOSI contribution rates as documented in the Jisr system

-- First, update the effective_to date for the old rates to end before July 3, 2024
UPDATE gosi_rate_history 
SET effective_to = '2024-07-02'
WHERE effective_from = '2025-07-01' AND nationality = 'SAUDI' AND system_type = 'NEW';

-- Insert the new 2024 GOSI rates for Saudi employees (NEW system)
-- Option 2: 11.75% Company + 9.75% Employee = 21.5% total (most common split)
INSERT INTO gosi_rate_history (
  system_type,
  nationality, 
  employee_rate,
  employer_rate,
  effective_from,
  effective_to
) VALUES 
  ('NEW', 'SAUDI', 9.75, 11.75, '2024-07-03', '2025-06-30'),
  ('NEW', 'SAUDI', 10.25, 12.25, '2024-07-03', '2025-06-30'), -- Option 5: Alternative split = 22.5% total
  ('NEW', 'SAUDI', 0.00, 21.50, '2024-07-03', '2025-06-30'), -- Option 1: Company pays all 21.5%
  ('NEW', 'SAUDI', 0.00, 22.50, '2024-07-03', '2025-06-30'); -- Option 7: Company pays all 22.5%

-- Keep the progressive rates starting from 2025-07-01 as they are future rates
-- These represent the planned progressive increases after 2025