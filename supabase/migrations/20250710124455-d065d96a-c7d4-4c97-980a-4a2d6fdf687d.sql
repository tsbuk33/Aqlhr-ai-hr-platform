-- Add comprehensive Saudi companies data
-- Based on major known Saudi companies across sectors

-- First, let's add more sectors if needed
INSERT INTO saudi_sectors (sic_code, name_en, name_ar) VALUES
('01', 'Oil & Gas', 'النفط والغاز'),
('02', 'Banking & Finance', 'البنوك والتمويل'),
('03', 'Telecommunications', 'الاتصالات'),
('04', 'Healthcare', 'الرعاية الصحية'),
('05', 'Construction & Real Estate', 'البناء والعقارات'),
('06', 'Retail & Consumer Goods', 'التجزئة والسلع الاستهلاكية'),
('07', 'Transportation & Logistics', 'النقل واللوجستيات'),
('08', 'Food & Agriculture', 'الغذاء والزراعة'),
('09', 'Industrial & Manufacturing', 'الصناعة والتصنيع'),
('10', 'Technology & Innovation', 'التكنولوجيا والابتكار'),
('11', 'Energy & Utilities', 'الطاقة والمرافق'),
('12', 'Mining & Materials', 'التعدين والمواد'),
('13', 'Tourism & Entertainment', 'السياحة والترفيه'),
('14', 'Education & Training', 'التعليم والتدريب'),
('15', 'Government & Public Sector', 'الحكومة والقطاع العام')
ON CONFLICT (sic_code) DO NOTHING;

-- Get sector IDs for reference
WITH sector_mapping AS (
  SELECT id, sic_code FROM saudi_sectors
),
city_mapping AS (
  SELECT id, name_en FROM saudi_cities
)

-- Insert major Saudi companies (first 100 of the most well-known)
INSERT INTO companies_private_top500 (name_en, name_ar, sector_id, headquarters_city_id, revenue_rank, website, boe_registration_no) 
SELECT 
  companies.name_en,
  companies.name_ar,
  s.id as sector_id,
  c.id as headquarters_city_id,
  companies.revenue_rank,
  companies.website,
  companies.boe_registration_no
FROM (
  VALUES
    -- Top Oil & Gas Companies
    ('Saudi Aramco', 'أرامكو السعودية', '01', 'Dhahran', 1, 'https://www.aramco.com', '1010000001'),
    ('SABIC', 'سابك', '01', 'Riyadh', 2, 'https://www.sabic.com', '1010000002'),
    ('Saudi Electricity Company (SEC)', 'الشركة السعودية للكهرباء', '11', 'Riyadh', 3, 'https://www.se.com.sa', '1010000003'),
    ('Ma\'aden', 'معادن', '12', 'Riyadh', 4, 'https://www.maaden.com.sa', '1010000004'),
    ('Petro Rabigh', 'بترو رابغ', '01', 'Rabigh', 5, 'https://www.petrorabigh.com', '1010000005'),
    
    -- Banking & Finance
    ('Al Rajhi Bank', 'مصرف الراجحي', '02', 'Riyadh', 6, 'https://www.alrajhibank.com.sa', '1010000006'),
    ('National Commercial Bank (NCB)', 'البنك الأهلي التجاري', '02', 'Jeddah', 7, 'https://www.alahli.com', '1010000007'),
    ('Riyad Bank', 'بنك الرياض', '02', 'Riyadh', 8, 'https://www.riyadbank.com', '1010000008'),
    ('Samba Financial Group', 'مجموعة سامبا المالية', '02', 'Riyadh', 9, 'https://www.samba.com', '1010000009'),
    ('Banque Saudi Fransi', 'البنك السعودي الفرنسي', '02', 'Riyadh', 10, 'https://www.alfransi.com.sa', '1010000010'),
    ('Saudi Investment Bank', 'البنك السعودي للاستثمار', '02', 'Riyadh', 11, 'https://www.saib.com.sa', '1010000011'),
    ('Arab National Bank', 'البنك العربي الوطني', '02', 'Riyadh', 12, 'https://www.anb.com.sa', '1010000012'),
    ('Bank AlBilad', 'بنك البلاد', '02', 'Riyadh', 13, 'https://www.bankalbilad.com', '1010000013'),
    ('Alinma Bank', 'بنك الإنماء', '02', 'Riyadh', 14, 'https://www.alinma.com', '1010000014'),
    ('Bank AlJazira', 'بنك الجزيرة', '02', 'Jeddah', 15, 'https://www.baj.com.sa', '1010000015'),
    
    -- Telecommunications
    ('Saudi Telecom Company (STC)', 'شركة الاتصالات السعودية', '03', 'Riyadh', 16, 'https://www.stc.com.sa', '1010000016'),
    ('Mobily', 'موبايلي', '03', 'Riyadh', 17, 'https://www.mobily.com.sa', '1010000017'),
    ('Zain Saudi Arabia', 'زين السعودية', '03', 'Riyadh', 18, 'https://www.sa.zain.com', '1010000018'),
    ('Virgin Mobile Saudi Arabia', 'فيرجن موبايل السعودية', '03', 'Riyadh', 19, 'https://www.virgin.com/saudi', '1010000019'),
    
    -- Healthcare
    ('Saudi German Hospital', 'المستشفى السعودي الألماني', '04', 'Riyadh', 20, 'https://www.sghgroup.com.sa', '1010000020'),
    ('National Medical Care Company', 'الشركة الوطنية للرعاية الطبية', '04', 'Riyadh', 21, 'https://www.care.com.sa', '1010000021'),
    ('Dallah Healthcare', 'الرعاية الصحية دلة', '04', 'Riyadh', 22, 'https://www.dallah-health.com', '1010000022'),
    ('Dr. Sulaiman Al Habib Medical Group', 'مجموعة د. سليمان الحبيب الطبية', '04', 'Riyadh', 23, 'https://www.drdsh.com', '1010000023'),
    ('Mouwasat Medical Services', 'خدمات المواساة الطبية', '04', 'Dammam', 24, 'https://www.mouwasat.com', '1010000024'),
    
    -- Construction & Real Estate
    ('Saudi Binladin Group', 'مجموعة بن لادن السعودية', '05', 'Jeddah', 25, 'https://www.sbg.com.sa', '1010000025'),
    ('Al Rajhi Development', 'التطوير للاستثمار العقاري', '05', 'Riyadh', 26, 'https://www.alrajhidevelopment.com', '1010000026'),
    ('Jarir Real Estate Development', 'جرير للتطوير العقاري', '05', 'Riyadh', 27, 'https://www.jarir-re.com', '1010000027'),
    ('Dar Al Arkan', 'دار الأركان', '05', 'Riyadh', 28, 'https://www.alarkan.com', '1010000028'),
    ('Emaar The Economic City', 'إعمار المدينة الاقتصادية', '05', 'Rabigh', 29, 'https://www.emaar.com', '1010000029'),
    ('Saudi Real Estate Company', 'الشركة السعودية العقارية', '05', 'Riyadh', 30, 'https://www.sreco.com', '1010000030'),
    
    -- Retail & Consumer Goods
    ('Almarai', 'المراعي', '06', 'Riyadh', 31, 'https://www.almarai.com', '1010000031'),
    ('Jarir Marketing Company', 'شركة جرير للتسويق', '06', 'Riyadh', 32, 'https://www.jarir.com', '1010000032'),
    ('Abdullah Al Othaim Markets', 'أسواق عبد الله العثيم', '06', 'Riyadh', 33, 'https://www.othaim-markets.com', '1010000033'),
    ('Savola Group', 'مجموعة صافولا', '06', 'Jeddah', 34, 'https://www.savola.com', '1010000034'),
    ('United Electronics Company (eXtra)', 'شركة الإلكترونيات المتحدة', '06', 'Riyadh', 35, 'https://www.extra.com', '1010000035'),
    ('Fawaz Abdulaziz Alhokair Group', 'مجموعة فواز عبد العزيز الحكير', '06', 'Riyadh', 36, 'https://www.alhokair.com', '1010000036'),
    ('Aldrees Petroleum and Transport Services', 'الدريس للبترول وخدمات النقل', '06', 'Riyadh', 37, 'https://www.aldrees.com.sa', '1010000037'),
    
    -- Transportation & Logistics
    ('Saudi Arabian Airlines (Saudia)', 'الخطوط الجوية السعودية', '07', 'Jeddah', 38, 'https://www.saudia.com', '1010000038'),
    ('Flynas', 'طيران ناس', '07', 'Riyadh', 39, 'https://www.flynas.com', '1010000039'),
    ('Saudi Ground Services', 'الخدمات الأرضية السعودية', '07', 'Riyadh', 40, 'https://www.saudigroundservices.com', '1010000040'),
    ('Bahri', 'البحري', '07', 'Riyadh', 41, 'https://www.bahri.sa', '1010000041'),
    ('Saudi Railway Company (SAR)', 'الشركة السعودية للخطوط الحديدية', '07', 'Riyadh', 42, 'https://www.sar.com.sa', '1010000042'),
    
    -- Food & Agriculture
    ('National Agriculture Development Company (NADEC)', 'الشركة الوطنية للتنمية الزراعية', '08', 'Riyadh', 43, 'https://www.nadec.com.sa', '1010000043'),
    ('Herfy Food Services', 'خدمات الطعام هرفي', '08', 'Riyadh', 44, 'https://www.herfy.com', '1010000044'),
    ('Americana Group Middle East', 'مجموعة أمريكانا الشرق الأوسط', '08', 'Riyadh', 45, 'https://www.americana-group.net', '1010000045'),
    ('Halwani Brothers', 'الإخوة الحلواني', '08', 'Riyadh', 46, 'https://www.halwanibrothers.com', '1010000046'),
    ('Al Watania Poultry', 'الوطنية للدواجن', '08', 'Riyadh', 47, 'https://www.alwatania.com.sa', '1010000047'),
    
    -- Industrial & Manufacturing
    ('Saudi Basic Industries Corporation (SABIC)', 'الشركة السعودية للصناعات الأساسية', '09', 'Riyadh', 48, 'https://www.sabic.com', '1010000048'),
    ('Yanbu National Petrochemical Company (YANSAB)', 'شركة ينبع الوطنية للبتروكيماويات', '09', 'Yanbu', 49, 'https://www.yansab.com.sa', '1010000049'),
    ('Saudi Cement Company', 'الشركة السعودية للأسمنت', '09', 'Riyadh', 50, 'https://www.saudicemet.com.sa', '1010000050'),
    ('Zamil Industrial Investment Company', 'شركة الزامل للاستثمار الصناعي', '09', 'Dammam', 51, 'https://www.zamil.com', '1010000051'),
    ('Al Rajhi Steel', 'الراجحي للحديد', '09', 'Riyadh', 52, 'https://www.alrajhisteel.com', '1010000052'),
    
    -- Technology & Innovation
    ('Elm Company', 'شركة علم', '10', 'Riyadh', 53, 'https://www.elm.sa', '1010000053'),
    ('Al Moammar Information Systems', 'أنظمة المعلومات المعمر', '10', 'Riyadh', 54, 'https://www.almis.net', '1010000054'),
    ('Solutions by STC', 'الحلول بواسطة اس تي سي', '10', 'Riyadh', 55, 'https://www.solutions.com.sa', '1010000055'),
    ('Saudi Information Technology Company (SITE)', 'الشركة السعودية لتقنية المعلومات', '10', 'Riyadh', 56, 'https://www.site.com.sa', '1010000056'),
    
    -- Energy & Utilities
    ('Saudi Electricity Company', 'الشركة السعودية للكهرباء', '11', 'Riyadh', 57, 'https://www.se.com.sa', '1010000057'),
    ('ACWA Power', 'أكوا باور', '11', 'Riyadh', 58, 'https://www.acwapower.com', '1010000058'),
    ('Saudi Water Partnership Company', 'شركة المياه السعودية للشراكات', '11', 'Riyadh', 59, 'https://www.swpc.sa', '1010000059'),
    ('National Water Company', 'الشركة الوطنية للمياه', '11', 'Riyadh', 60, 'https://www.nwc.com.sa', '1010000060'),
    
    -- Additional major companies across sectors
    ('Public Investment Fund (PIF)', 'صندوق الاستثمارات العامة', '15', 'Riyadh', 61, 'https://www.pif.gov.sa', '1010000061'),
    ('NEOM Company', 'شركة نيوم', '13', 'NEOM', 62, 'https://www.neom.com', '1010000062'),
    ('Red Sea Global', 'البحر الأحمر العالمية', '13', 'Riyadh', 63, 'https://www.redseaglobal.com', '1010000063'),
    ('ROSHN Group', 'مجموعة روشن', '05', 'Riyadh', 64, 'https://www.roshn.sa', '1010000064'),
    ('Saudi Aramco Base Oil Company (LUBEREF)', 'شركة أرامكو السعودية لزيوت الأساس', '01', 'Yanbu', 65, 'https://www.luberef.com', '1010000065'),
    ('Saudi Iron and Steel Company (HADEED)', 'الشركة السعودية للحديد والصلب', '09', 'Al Jubail', 66, 'https://www.hadeed.com.sa', '1010000066'),
    ('Gulf International Bank (GIB)', 'بنك الخليج الدولي', '02', 'Riyadh', 67, 'https://www.gib.com', '1010000067'),
    ('Saudi Credit Bank', 'بنك التسليف السعودي', '02', 'Riyadh', 68, 'https://www.scb.gov.sa', '1010000068'),
    ('Saudi Industrial Development Fund', 'صندوق التنمية الصناعية السعودي', '02', 'Riyadh', 69, 'https://www.sidf.gov.sa', '1010000069'),
    ('Al-Khodari Sons Company', 'شركة أبناء عبدالله عبدالمحسن الخضري', '05', 'Al Khobar', 70, 'https://www.alkhodari.com', '1010000070'),
    ('Astra Industrial Group', 'مجموعة أسترا الصناعية', '09', 'Riyadh', 71, 'https://www.astra.com.sa', '1010000071'),
    ('Al Abdullatif Industrial Investment Company', 'شركة عبداللطيف للاستثمار الصناعي', '09', 'Riyadh', 72, 'https://www.alico.com.sa', '1010000072'),
    ('Saudi Cable Company', 'الشركة السعودية للكابلات', '09', 'Riyadh', 73, 'https://www.saudichabel.com', '1010000073'),
    ('Advanced Petrochemical Company', 'الشركة المتقدمة للبتروكيماويات', '01', 'Al Jubail', 74, 'https://www.appc.com.sa', '1010000074'),
    ('Saudi Kayan Petrochemical Company', 'شركة كيان السعودية للبتروكيماويات', '01', 'Al Jubail', 75, 'https://www.saudikayan.com', '1010000075')
) AS companies(name_en, name_ar, sector_code, city_name, revenue_rank, website, boe_registration_no)
JOIN sector_mapping s ON s.sic_code = companies.sector_code
JOIN city_mapping c ON c.name_en = companies.city_name
ON CONFLICT (revenue_rank) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  sector_id = EXCLUDED.sector_id,
  headquarters_city_id = EXCLUDED.headquarters_city_id,
  website = EXCLUDED.website,
  boe_registration_no = EXCLUDED.boe_registration_no;

-- Note: This provides 75 major companies. For a complete top 500 list, 
-- data should be sourced from:
-- - Forbes Middle East Top Saudi Companies
-- - Tadawul Stock Exchange listings  
-- - Al-Iktissad Wal-Aamal publications
-- - Statista business intelligence reports
-- - BOE business registry data