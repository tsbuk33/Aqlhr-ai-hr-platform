-- Enhanced Saudi Arabian Knowledge Base for AqlHR Document Processing
-- This migration creates a comprehensive knowledge system for document processing

-- Saudi Legal Framework Knowledge Base
CREATE TABLE IF NOT EXISTS public.saudi_legal_framework (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  law_code TEXT NOT NULL UNIQUE,
  law_name_en TEXT NOT NULL,
  law_name_ar TEXT NOT NULL,
  category TEXT NOT NULL, -- 'labor', 'commercial', 'tax', 'compliance', 'saudization', 'gosi'
  authority TEXT NOT NULL, -- 'MHRSD', 'MOC', 'ZATCA', 'GOSI', 'SAMA', etc.
  effective_date DATE NOT NULL,
  last_amended DATE,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'superseded', 'draft'
  summary_en TEXT NOT NULL,
  summary_ar TEXT NOT NULL,
  key_articles JSONB DEFAULT '[]'::jsonb,
  compliance_requirements JSONB DEFAULT '[]'::jsonb,
  penalties JSONB DEFAULT '[]'::jsonb,
  related_laws TEXT[] DEFAULT '{}',
  keywords_en TEXT[] DEFAULT '{}',
  keywords_ar TEXT[] DEFAULT '{}',
  document_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Saudi Government Entities and Procedures
CREATE TABLE IF NOT EXISTS public.saudi_gov_entities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_code TEXT NOT NULL UNIQUE,
  entity_name_en TEXT NOT NULL,
  entity_name_ar TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'ministry', 'authority', 'agency', 'commission'
  parent_entity UUID REFERENCES public.saudi_gov_entities(id),
  jurisdiction TEXT[] NOT NULL, -- areas of responsibility
  services JSONB DEFAULT '[]'::jsonb, -- list of services offered
  contact_info JSONB DEFAULT '{}'::jsonb,
  digital_channels JSONB DEFAULT '{}'::jsonb, -- websites, apis, portals
  keywords_en TEXT[] DEFAULT '{}',
  keywords_ar TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced Document Intelligence System
CREATE TABLE IF NOT EXISTS public.document_intelligence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  original_file_name TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  file_type TEXT NOT NULL, -- 'pdf', 'docx', 'xlsx', 'image', 'txt'
  storage_path TEXT NOT NULL,
  upload_user_id UUID,
  module_context TEXT NOT NULL, -- which HR module this relates to
  
  -- Processing Status
  processing_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  processing_started_at TIMESTAMPTZ,
  processing_completed_at TIMESTAMPTZ,
  processing_duration_ms INTEGER,
  
  -- Extracted Content (Multiple Layers)
  raw_text TEXT, -- OCR/extracted text
  structured_content JSONB, -- preserved tables, lists, sections
  document_metadata JSONB, -- author, created_date, properties
  
  -- AI-Enhanced Understanding (Layer 1: Basic)
  ai_summary_en TEXT,
  ai_summary_ar TEXT,
  ai_keywords_en TEXT[] DEFAULT '{}',
  ai_keywords_ar TEXT[] DEFAULT '{}',
  document_classification TEXT, -- 'contract', 'policy', 'report', 'form', etc.
  confidence_score NUMERIC(3,2) DEFAULT 0.0,
  
  -- AI-Enhanced Understanding (Layer 2: Semantic)
  semantic_sections JSONB DEFAULT '[]'::jsonb, -- identified sections with meaning
  key_entities JSONB DEFAULT '[]'::jsonb, -- people, places, organizations, dates
  action_items JSONB DEFAULT '[]'::jsonb, -- extracted action items/requirements
  compliance_flags JSONB DEFAULT '[]'::jsonb, -- potential compliance issues
  
  -- AI-Enhanced Understanding (Layer 3: Contextual Saudi Knowledge)
  saudi_law_references JSONB DEFAULT '[]'::jsonb, -- referenced laws/regulations
  government_entity_mentions JSONB DEFAULT '[]'::jsonb, -- mentioned gov entities
  saudization_relevance NUMERIC(3,2) DEFAULT 0.0,
  gosi_relevance NUMERIC(3,2) DEFAULT 0.0,
  labor_law_relevance NUMERIC(3,2) DEFAULT 0.0,
  
  -- Search and Indexing
  search_vector tsvector,
  embeddings VECTOR(1536), -- OpenAI ada-002 embeddings
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Document Processing Layers (for tracking multi-layer analysis)
CREATE TABLE IF NOT EXISTS public.document_processing_layers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.document_intelligence(id) ON DELETE CASCADE,
  layer_type TEXT NOT NULL, -- 'ocr', 'structure', 'summary', 'semantic', 'saudi_context', 'compliance'
  layer_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  processing_model TEXT, -- which AI model was used
  processing_prompt TEXT, -- the prompt used for AI processing
  layer_output JSONB DEFAULT '{}'::jsonb, -- the output of this layer
  confidence_score NUMERIC(3,2) DEFAULT 0.0,
  processing_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Saudi HR Templates and Document Standards
CREATE TABLE IF NOT EXISTS public.saudi_hr_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_code TEXT NOT NULL UNIQUE,
  template_name_en TEXT NOT NULL,
  template_name_ar TEXT NOT NULL,
  category TEXT NOT NULL, -- 'contract', 'policy', 'form', 'report'
  document_type TEXT NOT NULL, -- 'employment_contract', 'leave_policy', etc.
  required_by_law BOOLEAN DEFAULT false,
  authority_source TEXT, -- which government entity requires this
  template_structure JSONB NOT NULL, -- expected structure/fields
  validation_rules JSONB DEFAULT '[]'::jsonb,
  sample_content JSONB DEFAULT '{}'::jsonb,
  keywords_en TEXT[] DEFAULT '{}',
  keywords_ar TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced AI Knowledge Base with Saudi Context
ALTER TABLE public.ai_knowledge_base 
ADD COLUMN IF NOT EXISTS saudi_law_category TEXT,
ADD COLUMN IF NOT EXISTS government_source TEXT,
ADD COLUMN IF NOT EXISTS compliance_level TEXT, -- 'mandatory', 'recommended', 'best_practice'
ADD COLUMN IF NOT EXISTS implementation_difficulty TEXT, -- 'low', 'medium', 'high'
ADD COLUMN IF NOT EXISTS business_impact TEXT, -- 'low', 'medium', 'high', 'critical'
ADD COLUMN IF NOT EXISTS related_documents UUID[], -- references to document_intelligence
ADD COLUMN IF NOT EXISTS embeddings VECTOR(1536);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_document_intelligence_tenant ON public.document_intelligence(tenant_id);
CREATE INDEX IF NOT EXISTS idx_document_intelligence_status ON public.document_intelligence(processing_status);
CREATE INDEX IF NOT EXISTS idx_document_intelligence_type ON public.document_intelligence(document_classification);
CREATE INDEX IF NOT EXISTS idx_document_intelligence_search ON public.document_intelligence USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_document_intelligence_embeddings ON public.document_intelligence USING ivfflat(embeddings vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_saudi_legal_framework_category ON public.saudi_legal_framework(category);
CREATE INDEX IF NOT EXISTS idx_saudi_legal_framework_authority ON public.saudi_legal_framework(authority);
CREATE INDEX IF NOT EXISTS idx_saudi_legal_framework_keywords_en ON public.saudi_legal_framework USING GIN(keywords_en);
CREATE INDEX IF NOT EXISTS idx_saudi_legal_framework_keywords_ar ON public.saudi_legal_framework USING GIN(keywords_ar);

CREATE INDEX IF NOT EXISTS idx_document_processing_layers_doc ON public.document_processing_layers(document_id);
CREATE INDEX IF NOT EXISTS idx_document_processing_layers_type ON public.document_processing_layers(layer_type);

-- Enable Row Level Security
ALTER TABLE public.document_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_processing_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saudi_legal_framework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saudi_gov_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saudi_hr_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Document Intelligence
CREATE POLICY "Users can access their tenant documents" ON public.document_intelligence
  FOR ALL USING (tenant_id = aqlhr_core.core_user_tenant());

CREATE POLICY "Users can access processing layers for their documents" ON public.document_processing_layers
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.document_intelligence di 
    WHERE di.id = document_processing_layers.document_id 
    AND di.tenant_id = aqlhr_core.core_user_tenant()
  ));

-- Saudi knowledge is readable by all authenticated users
CREATE POLICY "Saudi legal framework is readable by all" ON public.saudi_legal_framework
  FOR SELECT USING (true);

CREATE POLICY "Saudi gov entities are readable by all" ON public.saudi_gov_entities
  FOR SELECT USING (true);

CREATE POLICY "Saudi HR templates are readable by all" ON public.saudi_hr_templates
  FOR SELECT USING (true);

-- Functions for search vector updates
CREATE OR REPLACE FUNCTION public.update_document_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.raw_text, '') || ' ' ||
    COALESCE(NEW.ai_summary_en, '') || ' ' ||
    COALESCE(NEW.document_classification, '') || ' ' ||
    COALESCE(array_to_string(NEW.ai_keywords_en, ' '), '')
  );
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_document_search_vector_trigger
  BEFORE INSERT OR UPDATE ON public.document_intelligence
  FOR EACH ROW EXECUTE FUNCTION public.update_document_search_vector();

-- Insert Saudi Legal Framework Seed Data
INSERT INTO public.saudi_legal_framework (law_code, law_name_en, law_name_ar, category, authority, effective_date, summary_en, summary_ar, keywords_en, keywords_ar) VALUES
('SLL-2005', 'Saudi Labor Law', 'نظام العمل السعودي', 'labor', 'MHRSD', '2005-01-01', 
 'Comprehensive labor law governing employment relationships in Saudi Arabia', 
 'النظام الشامل للعمل الذي ينظم علاقات العمل في المملكة العربية السعودية',
 ARRAY['employment', 'contracts', 'termination', 'wages', 'working hours'], 
 ARRAY['العمل', 'العقود', 'الإنهاء', 'الأجور', 'ساعات العمل']),

('GOSI-2001', 'General Organization for Social Insurance Law', 'نظام المؤسسة العامة للتأمينات الاجتماعية', 'social_insurance', 'GOSI', '2001-01-01',
 'Social insurance system for private sector employees in Saudi Arabia',
 'نظام التأمينات الاجتماعية لموظفي القطاع الخاص في المملكة العربية السعودية',
 ARRAY['social insurance', 'retirement', 'disability', 'unemployment'], 
 ARRAY['التأمينات الاجتماعية', 'التقاعد', 'العجز', 'البطالة']),

('NITAQAT-2011', 'Saudization Program (Nitaqat)', 'برنامج السعودة (نطاقات)', 'saudization', 'MHRSD', '2011-01-01',
 'Program to increase employment of Saudi nationals in private sector',
 'برنامج لزيادة توظيف المواطنين السعوديين في القطاع الخاص',
 ARRAY['saudization', 'localization', 'employment quotas', 'green category'], 
 ARRAY['السعودة', 'التوطين', 'حصص التوظيف', 'النطاق الأخضر']);

-- Insert Saudi Government Entities Seed Data  
INSERT INTO public.saudi_gov_entities (entity_code, entity_name_en, entity_name_ar, entity_type, jurisdiction, services, keywords_en, keywords_ar) VALUES
('MHRSD', 'Ministry of Human Resources and Social Development', 'وزارة الموارد البشرية والتنمية الاجتماعية', 'ministry', 
 ARRAY['labor relations', 'social development', 'employment'], 
 '["work permits", "labor inspection", "saudization monitoring"]'::jsonb,
 ARRAY['labor', 'employment', 'social development'], 
 ARRAY['العمل', 'التوظيف', 'التنمية الاجتماعية']),

('GOSI', 'General Organization for Social Insurance', 'المؤسسة العامة للتأمينات الاجتماعية', 'authority',
 ARRAY['social insurance', 'retirement', 'occupational hazards'],
 '["registration", "contributions", "benefits", "retirement"]'::jsonb,
 ARRAY['social insurance', 'retirement', 'contributions'],
 ARRAY['التأمينات الاجتماعية', 'التقاعد', 'المساهمات']),

('ZATCA', 'Zakat, Tax and Customs Authority', 'هيئة الزكاة والضريبة والجمارك', 'authority',
 ARRAY['taxation', 'zakat', 'customs'],
 '["tax registration", "vat", "zakat calculation", "customs clearance"]'::jsonb,
 ARRAY['tax', 'vat', 'zakat', 'customs'],
 ARRAY['الضريبة', 'ضريبة القيمة المضافة', 'الزكاة', 'الجمارك']);