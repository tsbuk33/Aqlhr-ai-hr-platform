-- Create company intelligence table for analyzing Saudi companies
CREATE TABLE company_intelligence (
  id SERIAL PRIMARY KEY,
  company_id VARCHAR(50) UNIQUE NOT NULL,
  company_name_en VARCHAR(255),
  company_name_ar VARCHAR(255),
  company_type VARCHAR(50),
  sector_primary VARCHAR(100),
  total_employees INTEGER,
  saudization_rate DECIMAL(5,2),
  contract_potential_score DECIMAL(3,1),
  nitaqat_color VARCHAR(20),
  confidence_score DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE company_intelligence ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view company intelligence data
CREATE POLICY "Users can view company intelligence data" 
ON company_intelligence 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create policy for authenticated users to manage company intelligence data
CREATE POLICY "Users can manage company intelligence data" 
ON company_intelligence 
FOR ALL 
USING (auth.uid() IS NOT NULL) 
WITH CHECK (auth.uid() IS NOT NULL);