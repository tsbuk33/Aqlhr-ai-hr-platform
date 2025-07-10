-- Create comprehensive Saudi Arabia reference database

-- Saudi Regions (13 provinces/governorates)
CREATE TABLE public.saudi_regions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Saudi Cities (major cities linked to regions)
CREATE TABLE public.saudi_cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region_id UUID NOT NULL REFERENCES public.saudi_regions(id),
  code TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  timezone TEXT DEFAULT 'Asia/Riyadh',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Saudi Industry Sectors
CREATE TABLE public.saudi_sectors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sic_code TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Saudi Economic Activities (linked to sectors)
CREATE TABLE public.saudi_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sector_id UUID NOT NULL REFERENCES public.saudi_sectors(id),
  classification_code TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Saudi Government Entities
CREATE TABLE public.saudi_gov_entities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_key TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Top 500 Saudi Private Companies
CREATE TABLE public.companies_private_top500 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  sector_id UUID REFERENCES public.saudi_sectors(id),
  headquarters_city_id UUID REFERENCES public.saudi_cities(id),
  revenue_rank INTEGER,
  website TEXT,
  boe_registration_no TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.saudi_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saudi_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saudi_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saudi_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saudi_gov_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies_private_top500 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public read access for reference data)
CREATE POLICY "Anyone can view Saudi regions" ON public.saudi_regions FOR SELECT USING (true);
CREATE POLICY "Anyone can view Saudi cities" ON public.saudi_cities FOR SELECT USING (true);
CREATE POLICY "Anyone can view Saudi sectors" ON public.saudi_sectors FOR SELECT USING (true);
CREATE POLICY "Anyone can view Saudi activities" ON public.saudi_activities FOR SELECT USING (true);
CREATE POLICY "Anyone can view Saudi government entities" ON public.saudi_gov_entities FOR SELECT USING (true);
CREATE POLICY "Anyone can view top 500 companies" ON public.companies_private_top500 FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_saudi_cities_region_id ON public.saudi_cities(region_id);
CREATE INDEX idx_saudi_activities_sector_id ON public.saudi_activities(sector_id);
CREATE INDEX idx_companies_sector_id ON public.companies_private_top500(sector_id);
CREATE INDEX idx_companies_city_id ON public.companies_private_top500(headquarters_city_id);
CREATE INDEX idx_companies_revenue_rank ON public.companies_private_top500(revenue_rank);

-- Create triggers for updated_at
CREATE TRIGGER update_saudi_regions_updated_at
  BEFORE UPDATE ON public.saudi_regions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saudi_cities_updated_at
  BEFORE UPDATE ON public.saudi_cities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saudi_sectors_updated_at
  BEFORE UPDATE ON public.saudi_sectors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saudi_activities_updated_at
  BEFORE UPDATE ON public.saudi_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saudi_gov_entities_updated_at
  BEFORE UPDATE ON public.saudi_gov_entities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_private_top500_updated_at
  BEFORE UPDATE ON public.companies_private_top500
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Helper functions for API endpoints
CREATE OR REPLACE FUNCTION public.get_cities_by_region(region_code TEXT)
RETURNS TABLE(
  id UUID,
  code TEXT,
  name_en TEXT,
  name_ar TEXT,
  timezone TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.code, c.name_en, c.name_ar, c.timezone
  FROM public.saudi_cities c
  JOIN public.saudi_regions r ON c.region_id = r.id
  WHERE r.code = region_code
  ORDER BY c.name_en;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.get_activities_by_sector(sector_code TEXT)
RETURNS TABLE(
  id UUID,
  classification_code TEXT,
  name_en TEXT,
  name_ar TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.classification_code, a.name_en, a.name_ar
  FROM public.saudi_activities a
  JOIN public.saudi_sectors s ON a.sector_id = s.id
  WHERE s.sic_code = sector_code
  ORDER BY a.name_en;
END;
$$ LANGUAGE plpgsql STABLE;

-- Seed Saudi Regions (13 provinces)
INSERT INTO public.saudi_regions (code, name_en, name_ar) VALUES
  ('01', 'Riyadh Province', 'منطقة الرياض'),
  ('02', 'Makkah Province', 'منطقة مكة المكرمة'),
  ('03', 'Eastern Province', 'المنطقة الشرقية'),
  ('04', 'Asir Province', 'منطقة عسير'),
  ('05', 'Jazan Province', 'منطقة جازان'),
  ('06', 'Medina Province', 'منطقة المدينة المنورة'),
  ('07', 'Al-Qassim Province', 'منطقة القصيم'),
  ('08', 'Ha''il Province', 'منطقة حائل'),
  ('09', 'Tabuk Province', 'منطقة تبوك'),
  ('10', 'Northern Borders Province', 'منطقة الحدود الشمالية'),
  ('11', 'Al-Jawf Province', 'منطقة الجوف'),
  ('12', 'Najran Province', 'منطقة نجران'),
  ('13', 'Al-Bahah Province', 'منطقة الباحة')
ON CONFLICT (code) DO NOTHING;

-- Seed Major Saudi Cities
INSERT INTO public.saudi_cities (region_id, code, name_en, name_ar, timezone) VALUES
  -- Riyadh Province
  ((SELECT id FROM public.saudi_regions WHERE code = '01'), 'RYD001', 'Riyadh', 'الرياض', 'Asia/Riyadh'),
  ((SELECT id FROM public.saudi_regions WHERE code = '01'), 'RYD002', 'Al-Kharj', 'الخرج', 'Asia/Riyadh'),
  ((SELECT id FROM public.saudi_regions WHERE code = '01'), 'RYD003', 'Al-Diriyah', 'الدرعية', 'Asia/Riyadh'),
  
  -- Makkah Province
  ((SELECT id FROM public.saudi_regions WHERE code = '02'), 'MKK001', 'Makkah', 'مكة المكرمة', 'Asia/Riyadh'),
  ((SELECT id FROM public.saudi_regions WHERE code = '02'), 'MKK002', 'Jeddah', 'جدة', 'Asia/Riyadh'),
  ((SELECT id FROM public.saudi_regions WHERE code = '02'), 'MKK003', 'At-Taif', 'الطائف', 'Asia/Riyadh'),
  
  -- Eastern Province
  ((SELECT id FROM public.saudi_regions WHERE code = '03'), 'EAS001', 'Dammam', 'الدمام', 'Asia/Riyadh'),
  ((SELECT id FROM public.saudi_regions WHERE code = '03'), 'EAS002', 'Al-Khobar', 'الخبر', 'Asia/Riyadh'),
  ((SELECT id FROM public.saudi_regions WHERE code = '03'), 'EAS003', 'Dhahran', 'الظهران', 'Asia/Riyadh'),
  ((SELECT id FROM public.saudi_regions WHERE code = '03'), 'EAS004', 'Al-Jubail', 'الجبيل', 'Asia/Riyadh'),
  
  -- Asir Province
  ((SELECT id FROM public.saudi_regions WHERE code = '04'), 'ASR001', 'Abha', 'أبها', 'Asia/Riyadh'),
  ((SELECT id FROM public.saudi_regions WHERE code = '04'), 'ASR002', 'Khamis Mushait', 'خميس مشيط', 'Asia/Riyadh'),
  
  -- Jazan Province
  ((SELECT id FROM public.saudi_regions WHERE code = '05'), 'JAZ001', 'Jazan', 'جازان', 'Asia/Riyadh'),
  
  -- Medina Province
  ((SELECT id FROM public.saudi_regions WHERE code = '06'), 'MED001', 'Medina', 'المدينة المنورة', 'Asia/Riyadh'),
  ((SELECT id FROM public.saudi_regions WHERE code = '06'), 'MED002', 'Yanbu', 'ينبع', 'Asia/Riyadh'),
  
  -- Al-Qassim Province
  ((SELECT id FROM public.saudi_regions WHERE code = '07'), 'QAS001', 'Buraydah', 'بريدة', 'Asia/Riyadh'),
  ((SELECT id FROM public.saudi_regions WHERE code = '07'), 'QAS002', 'Unaizah', 'عنيزة', 'Asia/Riyadh'),
  
  -- Ha'il Province
  ((SELECT id FROM public.saudi_regions WHERE code = '08'), 'HAI001', 'Ha''il', 'حائل', 'Asia/Riyadh'),
  
  -- Tabuk Province
  ((SELECT id FROM public.saudi_regions WHERE code = '09'), 'TAB001', 'Tabuk', 'تبوك', 'Asia/Riyadh'),
  
  -- Northern Borders Province
  ((SELECT id FROM public.saudi_regions WHERE code = '10'), 'NOR001', 'Arar', 'عرعر', 'Asia/Riyadh'),
  
  -- Al-Jawf Province
  ((SELECT id FROM public.saudi_regions WHERE code = '11'), 'JAW001', 'Sakaka', 'سكاكا', 'Asia/Riyadh'),
  
  -- Najran Province
  ((SELECT id FROM public.saudi_regions WHERE code = '12'), 'NAJ001', 'Najran', 'نجران', 'Asia/Riyadh'),
  
  -- Al-Bahah Province
  ((SELECT id FROM public.saudi_regions WHERE code = '13'), 'BAH001', 'Al-Bahah', 'الباحة', 'Asia/Riyadh')
ON CONFLICT (code) DO NOTHING;

-- Seed Industry Sectors
INSERT INTO public.saudi_sectors (sic_code, name_en, name_ar) VALUES
  ('A', 'Agriculture, Forestry and Fishing', 'الزراعة والغابات والصيد'),
  ('B', 'Mining and Quarrying', 'التعدين واستغلال المحاجر'),
  ('C', 'Manufacturing', 'الصناعات التحويلية'),
  ('D', 'Electricity, Gas, Steam and Air Conditioning Supply', 'إمدادات الكهرباء والغاز والبخار وتكييف الهواء'),
  ('E', 'Water Supply; Sewerage, Waste Management', 'إمدادات المياه وأنشطة الصرف الصحي وإدارة النفايات'),
  ('F', 'Construction', 'التشييد'),
  ('G', 'Wholesale and Retail Trade', 'تجارة الجملة والتجزئة'),
  ('H', 'Transportation and Storage', 'النقل والتخزين'),
  ('I', 'Accommodation and Food Service Activities', 'أنشطة خدمات الإقامة والطعام'),
  ('J', 'Information and Communication', 'المعلومات والاتصالات'),
  ('K', 'Financial and Insurance Activities', 'الأنشطة المالية وأنشطة التأمين'),
  ('L', 'Real Estate Activities', 'الأنشطة العقارية'),
  ('M', 'Professional, Scientific and Technical Activities', 'الأنشطة المهنية والعلمية والتقنية'),
  ('N', 'Administrative and Support Service Activities', 'أنشطة الخدمات الإدارية وخدمات الدعم'),
  ('O', 'Public Administration and Defence', 'الإدارة العامة والدفاع'),
  ('P', 'Education', 'التعليم'),
  ('Q', 'Human Health and Social Work Activities', 'أنشطة الصحة البشرية والعمل الاجتماعي'),
  ('R', 'Arts, Entertainment and Recreation', 'الفنون والترفيه والاستجمام'),
  ('S', 'Other Service Activities', 'أنشطة الخدمات الأخرى'),
  ('T', 'Activities of Households', 'أنشطة الأسر المعيشية')
ON CONFLICT (sic_code) DO NOTHING;

-- Seed Economic Activities (sample)
INSERT INTO public.saudi_activities (sector_id, classification_code, name_en, name_ar) VALUES
  -- Manufacturing
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'C'), 'C10', 'Food Products Manufacturing', 'صناعة المنتجات الغذائية'),
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'C'), 'C11', 'Beverage Manufacturing', 'صناعة المشروبات'),
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'C'), 'C13', 'Textile Manufacturing', 'صناعة المنسوجات'),
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'C'), 'C20', 'Chemical Manufacturing', 'صناعة المواد الكيميائية'),
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'C'), 'C23', 'Non-metallic Mineral Products', 'منتجات المعادن اللافلزية'),
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'C'), 'C24', 'Basic Metals Manufacturing', 'صناعة الفلزات القاعدية'),
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'C'), 'C29', 'Motor Vehicle Manufacturing', 'صناعة المركبات ذات المحركات'),
  
  -- Information and Communication
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'J'), 'J58', 'Software Publishing', 'نشر البرمجيات'),
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'J'), 'J61', 'Telecommunications', 'الاتصالات السلكية واللاسلكية'),
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'J'), 'J62', 'Computer Programming', 'أنشطة البرمجة الحاسوبية'),
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'J'), 'J63', 'Information Service Activities', 'أنشطة خدمات المعلومات'),
  
  -- Financial Services
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'K'), 'K64', 'Financial Service Activities', 'أنشطة الخدمات المالية'),
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'K'), 'K65', 'Insurance and Pension Funding', 'التأمين وصناديق المعاشات'),
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'K'), 'K66', 'Auxiliary Financial Services', 'الأنشطة المساعدة للخدمات المالية'),
  
  -- Construction
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'F'), 'F41', 'Construction of Buildings', 'تشييد المباني'),
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'F'), 'F42', 'Civil Engineering', 'أعمال الهندسة المدنية'),
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'F'), 'F43', 'Specialized Construction Activities', 'أنشطة التشييد المتخصصة'),
  
  -- Retail and Wholesale
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'G'), 'G45', 'Motor Vehicle Sales', 'تجارة وإصلاح المركبات ذات المحركات'),
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'G'), 'G46', 'Wholesale Trade', 'تجارة الجملة'),
  ((SELECT id FROM public.saudi_sectors WHERE sic_code = 'G'), 'G47', 'Retail Trade', 'تجارة التجزئة')
ON CONFLICT (classification_code) DO NOTHING;

-- Seed Government Entities
INSERT INTO public.saudi_gov_entities (entity_key, name_en, name_ar, url) VALUES
  ('qiwa', 'Qiwa Platform', 'منصة قوى', 'https://qiwa.sa'),
  ('gosi', 'General Organization for Social Insurance', 'المؤسسة العامة للتأمينات الاجتماعية', 'https://www.gosi.gov.sa'),
  ('absher', 'Absher Platform', 'منصة أبشر', 'https://www.absher.sa'),
  ('mudad', 'Mudad Platform', 'منصة مداد', 'https://mudad.gov.sa'),
  ('zatca', 'Zakat, Tax and Customs Authority', 'هيئة الزكاة والضريبة والجمارك', 'https://zatca.gov.sa'),
  ('elm', 'Elm Information Security', 'شركة علم لأمن المعلومات', 'https://www.elm.sa'),
  ('mol', 'Ministry of Labor', 'وزارة العمل', 'https://www.mol.gov.sa'),
  ('momrah', 'Ministry of Municipal and Rural Affairs', 'وزارة الشؤون البلدية والقروية', 'https://www.momrah.gov.sa'),
  ('mcit', 'Ministry of Communications and Information Technology', 'وزارة الاتصالات وتقنية المعلومات', 'https://www.mcit.gov.sa'),
  ('sama', 'Saudi Arabian Monetary Authority', 'مؤسسة النقد العربي السعودي', 'https://www.sama.gov.sa'),
  ('ncaaa', 'National Commission for Academic Accreditation', 'هيئة تقويم التعليم والتدريب', 'https://www.etec.gov.sa'),
  ('tvtc', 'Technical and Vocational Training Corporation', 'المؤسسة العامة للتدريب التقني والمهني', 'https://www.tvtc.gov.sa'),
  ('seha', 'Seha Platform', 'منصة صحة', 'https://seha.sa'),
  ('tawakkalna', 'Tawakkalna Platform', 'تطبيق توكلنا', 'https://ta.gov.sa'),
  ('boe', 'Business Owners Enterprise', 'منصة بالأعمال', 'https://www.boe.gov.sa')
ON CONFLICT (entity_key) DO NOTHING;

-- Seed Top 50 Private Companies (sample - would be expanded to 500)
INSERT INTO public.companies_private_top500 (name_en, name_ar, sector_id, headquarters_city_id, revenue_rank, website, boe_registration_no) VALUES
  ('Saudi Aramco', 'أرامكو السعودية', 
   (SELECT id FROM public.saudi_sectors WHERE sic_code = 'B'), 
   (SELECT id FROM public.saudi_cities WHERE code = 'EAS003'), 1, 'https://www.aramco.com', 'BOE001'),
  
  ('SABIC', 'سابك',
   (SELECT id FROM public.saudi_sectors WHERE sic_code = 'C'),
   (SELECT id FROM public.saudi_cities WHERE code = 'RYD001'), 2, 'https://www.sabic.com', 'BOE002'),
  
  ('Saudi Telecom Company', 'شركة الاتصالات السعودية',
   (SELECT id FROM public.saudi_sectors WHERE sic_code = 'J'),
   (SELECT id FROM public.saudi_cities WHERE code = 'RYD001'), 3, 'https://www.stc.com.sa', 'BOE003'),
  
  ('Al Rajhi Bank', 'مصرف الراجحي',
   (SELECT id FROM public.saudi_sectors WHERE sic_code = 'K'),
   (SELECT id FROM public.saudi_cities WHERE code = 'RYD001'), 4, 'https://www.alrajhibank.com.sa', 'BOE004'),
  
  ('Saudi Electricity Company', 'الشركة السعودية للكهرباء',
   (SELECT id FROM public.saudi_sectors WHERE sic_code = 'D'),
   (SELECT id FROM public.saudi_cities WHERE code = 'RYD001'), 5, 'https://www.se.com.sa', 'BOE005'),
  
  ('Mobily', 'موبايلي',
   (SELECT id FROM public.saudi_sectors WHERE sic_code = 'J'),
   (SELECT id FROM public.saudi_cities WHERE code = 'RYD001'), 6, 'https://www.mobily.com.sa', 'BOE006'),
  
  ('Saudi British Bank', 'البنك السعودي البريطاني',
   (SELECT id FROM public.saudi_sectors WHERE sic_code = 'K'),
   (SELECT id FROM public.saudi_cities WHERE code = 'RYD001'), 7, 'https://www.sabb.com', 'BOE007'),
  
  ('Banque Saudi Fransi', 'البنك السعودي الفرنسي',
   (SELECT id FROM public.saudi_sectors WHERE sic_code = 'K'),
   (SELECT id FROM public.saudi_cities WHERE code = 'RYD001'), 8, 'https://www.alfransi.com.sa', 'BOE008'),
  
  ('Saudi National Bank', 'البنك الأهلي السعودي',
   (SELECT id FROM public.saudi_sectors WHERE sic_code = 'K'),
   (SELECT id FROM public.saudi_cities WHERE code = 'RYD001'), 9, 'https://www.snb.com', 'BOE009'),
  
  ('Riyad Bank', 'بنك الرياض',
   (SELECT id FROM public.saudi_sectors WHERE sic_code = 'K'),
   (SELECT id FROM public.saudi_cities WHERE code = 'RYD001'), 10, 'https://www.riyadbank.com', 'BOE010'),
  
  ('Abdullah Al Othaim Markets', 'أسواق عبدالله العثيم',
   (SELECT id FROM public.saudi_sectors WHERE sic_code = 'G'),
   (SELECT id FROM public.saudi_cities WHERE code = 'RYD001'), 11, 'https://www.othaim-markets.com', 'BOE011'),
  
  ('Almarai Company', 'شركة المراعي',
   (SELECT id FROM public.saudi_sectors WHERE sic_code = 'C'),
   (SELECT id FROM public.saudi_cities WHERE code = 'RYD001'), 12, 'https://www.almarai.com', 'BOE012'),
  
  ('Jarir Marketing Company', 'شركة جرير للتسويق',
   (SELECT id FROM public.saudi_sectors WHERE sic_code = 'G'),
   (SELECT id FROM public.saudi_cities WHERE code = 'RYD001'), 13, 'https://www.jarir.com', 'BOE013'),
  
  ('Saudi Airlines', 'الخطوط الجوية السعودية',
   (SELECT id FROM public.saudi_sectors WHERE sic_code = 'H'),
   (SELECT id FROM public.saudi_cities WHERE code = 'MKK002'), 14, 'https://www.saudia.com', 'BOE014'),
  
  ('Savola Group', 'مجموعة صافولا',
   (SELECT id FROM public.saudi_sectors WHERE sic_code = 'C'),
   (SELECT id FROM public.saudi_cities WHERE code = 'MKK002'), 15, 'https://www.savola.com', 'BOE015')
ON CONFLICT (boe_registration_no) DO NOTHING;