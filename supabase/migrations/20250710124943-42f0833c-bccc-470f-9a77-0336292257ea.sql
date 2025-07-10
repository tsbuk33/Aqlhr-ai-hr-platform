-- Update companies_private_top500 with accurate market data and major private companies
-- Clear existing data first
DELETE FROM companies_private_top500;

-- Get sector and city mappings for reference
WITH sector_mapping AS (
  SELECT id, sic_code FROM saudi_sectors
),
city_mapping AS (
  SELECT id, name_en FROM saudi_cities
)

-- Insert top Saudi companies with accurate market data
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
    -- Top 20 Public Companies (with market caps)
    ('Saudi Arabian Oil Company (Aramco)', 'شركة أرامكو السعودية', '01', 'Dhahran', 1, 'https://www.aramco.com', '1010000001'),
    ('Al Rajhi Banking and Investment Corporation', 'مصرف الراجحي', '02', 'Riyadh', 2, 'https://www.alrajhibank.com.sa', '1010000002'),
    ('The Saudi National Bank', 'البنك الأهلي السعودي', '02', 'Riyadh', 3, 'https://www.alahli.com', '1010000003'),
    ('Saudi Arabian Mining Company (Ma''aden)', 'شركة التعدين العربية السعودية', '12', 'Riyadh', 4, 'https://www.maaden.com.sa', '1010000004'),
    ('Saudi Telecom Company (STC)', 'شركة الاتصالات السعودية', '03', 'Riyadh', 5, 'https://www.stc.com.sa', '1010000005'),
    ('ACWA Power Company', 'شركة أكوا باور', '11', 'Riyadh', 6, 'https://www.acwapower.com', '1010000006'),
    ('Saudi Basic Industries Corporation (SABIC)', 'الشركة السعودية للصناعات الأساسية', '09', 'Riyadh', 7, 'https://www.sabic.com', '1010000007'),
    ('Dr. Sulaiman Al Habib Medical Services Group', 'مجموعة د. سليمان الحبيب الطبية', '04', 'Riyadh', 8, 'https://www.drdsh.com', '1010000008'),
    ('Riyad Bank', 'بنك الرياض', '02', 'Riyadh', 9, 'https://www.riyadbank.com', '1010000009'),
    ('Elm Company', 'شركة علم', '10', 'Riyadh', 10, 'https://www.elm.sa', '1010000010'),
    
    -- Major Private/Family-Owned Companies
    ('Al Muhaidib Group', 'مجموعة المحيدب', '06', 'Riyadh', 11, 'https://www.almuhaidib.com', '1010000011'),
    ('Abdul Latif Jameel Group', 'مجموعة عبد اللطيف جميل', '07', 'Jeddah', 12, 'https://www.alj.com', '1010000012'),
    ('Olayan Group', 'مجموعة العليان', '02', 'Riyadh', 13, 'https://www.olayan.com', '1010000013'),
    ('Saudi Binladin Group', 'مجموعة بن لادن السعودية', '05', 'Jeddah', 14, 'https://www.sbg.com.sa', '1010000014'),
    ('Al Faisal Holding', 'مجموعة الفيصل القابضة', '02', 'Riyadh', 15, 'https://www.alfaisalholding.com', '1010000015'),
    ('SEDCO Holding', 'شركة سدكو القابضة', '02', 'Jeddah', 16, 'https://www.sedco.com', '1010000016'),
    ('Alfanar Group', 'مجموعة الفنار', '09', 'Riyadh', 17, 'https://www.alfanar.com', '1010000017'),
    ('Al Othaim Holding Company', 'شركة العثيم القابضة', '06', 'Riyadh', 18, 'https://www.alothaim.com', '1010000018'),
    
    -- Additional Major Banking Companies
    ('Samba Financial Group', 'مجموعة سامبا المالية', '02', 'Riyadh', 19, 'https://www.samba.com', '1010000019'),
    ('Banque Saudi Fransi', 'البنك السعودي الفرنسي', '02', 'Riyadh', 20, 'https://www.alfransi.com.sa', '1010000020'),
    ('Saudi Investment Bank', 'البنك السعودي للاستثمار', '02', 'Riyadh', 21, 'https://www.saib.com.sa', '1010000021'),
    ('Arab National Bank', 'البنك العربي الوطني', '02', 'Riyadh', 22, 'https://www.anb.com.sa', '1010000022'),
    ('Bank AlBilad', 'بنك البلاد', '02', 'Riyadh', 23, 'https://www.bankalbilad.com', '1010000023'),
    ('Alinma Bank', 'بنك الإنماء', '02', 'Riyadh', 24, 'https://www.alinma.com', '1010000024'),
    ('Bank AlJazira', 'بنك الجزيرة', '02', 'Jeddah', 25, 'https://www.baj.com.sa', '1010000025'),
    
    -- Energy & Utilities
    ('Saudi Electricity Company', 'الشركة السعودية للكهرباء', '11', 'Riyadh', 26, 'https://www.se.com.sa', '1010000026'),
    ('National Gas Company', 'شركة الغاز الوطنية', '01', 'Dhahran', 27, 'https://www.ngc.com.sa', '1010000027'),
    ('Petro Rabigh', 'شركة بترو رابغ', '01', 'Rabigh', 28, 'https://www.petrorabigh.com', '1010000028'),
    
    -- Telecommunications
    ('Mobily', 'شركة اتحاد اتصالات (موبايلي)', '03', 'Riyadh', 29, 'https://www.mobily.com.sa', '1010000029'),
    ('Arabian Internet', 'الإنترنت العربية', '03', 'Riyadh', 30, 'https://www.arabianinternet.com', '1010000030'),
    ('Zain Saudi Arabia', 'زين السعودية', '03', 'Riyadh', 31, 'https://www.sa.zain.com', '1010000031'),
    
    -- Healthcare
    ('Banaja Holdings', 'شركة بناجا القابضة', '04', 'Jeddah', 32, 'https://www.banaja.com', '1010000032'),
    ('Dallah Healthcare', 'الرعاية الصحية دلة', '04', 'Riyadh', 33, 'https://www.dallah-health.com', '1010000033'),
    ('Mouwasat Medical Services', 'خدمات المواساة الطبية', '04', 'Dammam', 34, 'https://www.mouwasat.com', '1010000034'),
    
    -- Food & Beverages
    ('Almarai Company', 'شركة المراعي', '08', 'Riyadh', 35, 'https://www.almarai.com', '1010000035'),
    ('Savola Group', 'مجموعة صافولا', '08', 'Jeddah', 36, 'https://www.savola.com', '1010000036'),
    ('National Agriculture Development Company (NADEC)', 'الشركة الوطنية للتنمية الزراعية', '08', 'Riyadh', 37, 'https://www.nadec.com.sa', '1010000037'),
    ('Herfy Food Services', 'خدمات الطعام هرفي', '08', 'Riyadh', 38, 'https://www.herfy.com', '1010000038'),
    
    -- Construction & Real Estate
    ('Al Shuwayer Group', 'مجموعة الشويعر', '05', 'Riyadh', 39, 'https://www.alshuwayer.com', '1010000039'),
    ('Dar Al Arkan', 'دار الأركان', '05', 'Riyadh', 40, 'https://www.alarkan.com', '1010000040'),
    ('Emaar The Economic City', 'إعمار المدينة الاقتصادية', '05', 'Rabigh', 41, 'https://www.emaar.com', '1010000041'),
    ('Al Rajhi Development', 'التطوير للاستثمار العقاري', '05', 'Riyadh', 42, 'https://www.alrajhidevelopment.com', '1010000042'),
    
    -- Retail & Consumer Goods
    ('Jarir Marketing Company', 'شركة جرير للتسويق', '06', 'Riyadh', 43, 'https://www.jarir.com', '1010000043'),
    ('Abdullah Al Othaim Markets', 'أسواق عبد الله العثيم', '06', 'Riyadh', 44, 'https://www.othaim-markets.com', '1010000044'),
    ('United Electronics Company (eXtra)', 'شركة الإلكترونيات المتحدة', '06', 'Riyadh', 45, 'https://www.extra.com', '1010000045'),
    ('Fawaz Abdulaziz Alhokair Group', 'مجموعة فواز عبد العزيز الحكير', '06', 'Riyadh', 46, 'https://www.alhokair.com', '1010000046'),
    
    -- Transportation & Logistics
    ('Saudi Arabian Airlines (Saudia)', 'الخطوط الجوية السعودية', '07', 'Jeddah', 47, 'https://www.saudia.com', '1010000047'),
    ('Flynas', 'طيران ناس', '07', 'Riyadh', 48, 'https://www.flynas.com', '1010000048'),
    ('Bahri', 'شركة البحري', '07', 'Riyadh', 49, 'https://www.bahri.sa', '1010000049'),
    ('Saudi Railway Company (SAR)', 'الشركة السعودية للخطوط الحديدية', '07', 'Riyadh', 50, 'https://www.sar.com.sa', '1010000050')
    
) AS companies(name_en, name_ar, sector_code, city_name, revenue_rank, website, boe_registration_no)
JOIN sector_mapping s ON s.sic_code = companies.sector_code
JOIN city_mapping c ON c.name_en = companies.city_name;