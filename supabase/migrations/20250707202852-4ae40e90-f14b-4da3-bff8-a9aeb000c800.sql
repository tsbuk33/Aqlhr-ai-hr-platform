-- Add 50+ diverse attendance locations for each company
INSERT INTO public.attendance_locations (company_id, name, name_ar, address, latitude, longitude, radius_meters) 
SELECT 
  c.id,
  location_data.name,
  location_data.name_ar,
  location_data.address,
  location_data.latitude + (RANDOM() * 0.002 - 0.001), -- Add small random variation
  location_data.longitude + (RANDOM() * 0.002 - 0.001),
  location_data.radius
FROM public.companies c
CROSS JOIN (
  VALUES 
    -- Riyadh locations
    ('Riyadh Administrative Office', 'مكتب الرياض الإداري', 'King Abdulaziz Road, Riyadh', 24.7136, 46.6753, 120),
    ('Olaya District Branch', 'فرع حي العليا', 'Olaya Street, Riyadh', 24.6877, 46.6947, 100),
    ('King Fahd District Office', 'مكتب حي الملك فهد', 'King Fahd District, Riyadh', 24.7731, 46.7378, 150),
    ('Diplomatic Quarter Branch', 'فرع الحي الدبلوماسي', 'Diplomatic Quarter, Riyadh', 24.6934, 46.6197, 200),
    ('Al Malaz Industrial Site', 'موقع الملز الصناعي', 'Al Malaz District, Riyadh', 24.6408, 46.7271, 300),
    ('Exit 5 Warehouse', 'مستودع المخرج 5', 'Exit 5, Ring Road, Riyadh', 24.8247, 46.7749, 500),
    ('Al Nasiriyah Service Center', 'مركز خدمة الناصرية', 'Al Nasiriyah, Riyadh', 24.7506, 46.7167, 80),
    ('King Khalid Airport Office', 'مكتب مطار الملك خالد', 'King Khalid Airport, Riyadh', 24.9576, 46.6988, 200),
    ('Northern Ring Road Facility', 'منشأة الطريق الدائري الشمالي', 'Northern Ring Road, Riyadh', 24.8000, 46.6500, 400),
    ('Al Suwaidi Commercial Center', 'مركز السويدي التجاري', 'Al Suwaidi, Riyadh', 24.6123, 46.7234, 150),
    
    -- Jeddah locations
    ('Jeddah Main Hub', 'مركز جدة الرئيسي', 'King Abdulaziz Street, Jeddah', 21.4858, 39.1925, 180),
    ('Al Balad Historical Office', 'مكتب البلد التاريخي', 'Al Balad, Jeddah', 21.4817, 39.1754, 100),
    ('Corniche Branch', 'فرع الكورنيش', 'Jeddah Corniche, Jeddah', 21.5169, 39.1748, 120),
    ('King Abdul Aziz Port Office', 'مكتب ميناء الملك عبدالعزيز', 'Jeddah Islamic Port, Jeddah', 21.4692, 39.1831, 300),
    ('Jeddah Industrial City', 'مدينة جدة الصناعية', 'Jeddah Industrial City', 21.3891, 39.2562, 600),
    ('Red Sea Mall Branch', 'فرع مول البحر الأحمر', 'Red Sea Mall, Jeddah', 21.5894, 39.1634, 100),
    ('Al Rawdah District Office', 'مكتب حي الروضة', 'Al Rawdah, Jeddah', 21.5433, 39.1729, 90),
    ('King Abdulaziz University Office', 'مكتب جامعة الملك عبدالعزيز', 'KAU Campus, Jeddah', 21.4057, 39.2521, 250),
    ('Jeddah Airport Branch', 'فرع مطار جدة', 'King Abdulaziz Airport, Jeddah', 21.6796, 39.1567, 300),
    ('Tahlia Street Office', 'مكتب شارع التحلية', 'Prince Sultan Street, Jeddah', 21.5169, 39.1673, 80),
    
    -- Dammam/Eastern Province locations
    ('Dammam Regional Office', 'مكتب الدمام الإقليمي', 'King Saud Street, Dammam', 26.4282, 50.0887, 150),
    ('Dhahran Technology Hub', 'مركز الظهران التقني', 'KFUPM, Dhahran', 26.3069, 50.1632, 200),
    ('Khobar Commercial District', 'منطقة الخبر التجارية', 'Prince Turkey Street, Khobar', 26.2172, 50.1971, 100),
    ('Jubail Industrial Complex', 'مجمع الجبيل الصناعي', 'Jubail Industrial City', 27.0174, 49.6252, 800),
    ('Qatif Agricultural Center', 'مركز القطيف الزراعي', 'Qatif Oasis, Qatif', 26.5735, 49.9968, 300),
    ('Ras Tanura Refinery Office', 'مكتب مصفاة رأس تنورة', 'Ras Tanura', 26.6583, 50.1500, 400),
    ('Half Moon Bay Resort', 'منتجع خليج نصف القمر', 'Half Moon Bay, Khobar', 26.1333, 50.3167, 200),
    ('King Fahd Port Office', 'مكتب ميناء الملك فهد', 'King Fahd Port, Dammam', 26.4500, 50.1833, 350),
    ('Aramco Headquarters Branch', 'فرع مقر أرامكو', 'Saudi Aramco, Dhahran', 26.2661, 50.1539, 500),
    ('Eastern Province Mall', 'مول المنطقة الشرقية', 'Al Rashid Mall, Khobar', 26.2797, 50.2088, 120),
    
    -- Makkah locations
    ('Makkah Holy Site Office', 'مكتب الموقع المقدس مكة', 'Haram Area, Makkah', 21.4225, 39.8262, 100),
    ('Azizia District Branch', 'فرع حي العزيزية', 'Azizia, Makkah', 21.3891, 39.8579, 150),
    ('Mina Operations Center', 'مركز عمليات منى', 'Mina, Makkah', 21.4067, 39.8842, 300),
    ('Arafat Logistics Hub', 'مركز الخدمات اللوجستية عرفات', 'Mount Arafat, Makkah', 21.3544, 39.9844, 500),
    ('Taneem Service Point', 'نقطة خدمة التنعيم', 'Taneem, Makkah', 21.4500, 39.7833, 80),
    
    -- Madinah locations
    ('Madinah Prophet Mosque Office', 'مكتب المسجد النبوي المدينة', 'Haram Area, Madinah', 24.4672, 39.6142, 120),
    ('Quba Mosque Branch', 'فرع مسجد قباء', 'Quba District, Madinah', 24.4381, 39.6175, 100),
    ('Madinah Airport Office', 'مكتب مطار المدينة', 'Prince Mohammad Airport, Madinah', 24.5534, 39.7050, 200),
    ('Islamic University Campus', 'حرم الجامعة الإسلامية', 'Islamic University, Madinah', 24.4858, 39.5736, 300),
    
    -- Taif locations
    ('Taif Mountain Office', 'مكتب الطائف الجبلي', 'Al Hada Road, Taif', 21.2703, 40.4158, 150),
    ('Shubra Palace Branch', 'فرع قصر شبرا', 'Shubra District, Taif', 21.2622, 40.3825, 100),
    ('Taif Rose Factory', 'مصنع ورد الطائف', 'Al Ward District, Taif', 21.2500, 40.4000, 200),
    
    -- Abha/Southern Region locations
    ('Abha Regional Center', 'مركز أبها الإقليمي', 'King Khalid Street, Abha', 18.2164, 42.5053, 180),
    ('Asir Mountains Office', 'مكتب جبال عسير', 'Asir National Park, Abha', 18.0735, 42.3348, 250),
    ('Khamis Mushait Branch', 'فرع خميس مشيط', 'King Fahd Road, Khamis Mushait', 18.3000, 42.7333, 120),
    
    -- Tabuk locations
    ('Tabuk Northern Office', 'مكتب تبوك الشمالي', 'Prince Fahd Road, Tabuk', 28.3998, 36.5700, 200),
    ('NEOM Project Site', 'موقع مشروع نيوم', 'NEOM Development, Tabuk', 28.2500, 35.0000, 1000),
    
    -- Hail locations
    ('Hail Agricultural Center', 'مركز حائل الزراعي', 'University Road, Hail', 27.5114, 41.6900, 300),
    ('Qassim Dates Factory', 'مصنع تمور القصيم', 'Buraidah, Qassim', 26.3260, 43.9750, 400),
    
    -- Industrial Cities
    ('Yanbu Industrial Port', 'ميناء ينبع الصناعي', 'Yanbu Industrial City', 24.0896, 38.0617, 600),
    ('Ras Al Khair Industrial', 'راس الخير الصناعية', 'Ras Al Khair Industrial City', 27.7500, 49.5833, 800),
    ('Jazan Economic City', 'مدينة جازان الاقتصادية', 'Jazan Economic City', 16.8892, 42.5511, 500),
    
    -- Remote Sites
    ('Shaybah Remote Site', 'موقع شيبة النائي', 'Shaybah Oil Field', 22.5333, 53.9667, 1000),
    ('Ghawar Field Office', 'مكتب حقل الغوار', 'Ghawar Oil Field', 25.5000, 49.5000, 800),
    ('Safaniya Offshore Platform', 'منصة السفانية البحرية', 'Safaniya Oil Field', 27.9167, 49.5333, 300),
    
    -- Construction Sites
    ('Red Sea Project Site 1', 'موقع البحر الأحمر 1', 'Red Sea Project Area', 28.0000, 36.5000, 500),
    ('KAEC Construction Zone', 'منطقة إنشاءات مدينة الملك عبدالله', 'King Abdullah Economic City', 22.3500, 39.1000, 400),
    ('Qiddiya Entertainment Site', 'موقع القدية الترفيهي', 'Qiddiya Project, Riyadh', 24.5500, 46.4000, 600),
    
    -- Border Checkpoints
    ('Al Haditha Border Office', 'مكتب الحديثة الحدودي', 'Al Haditha Border Crossing', 32.4000, 41.0833, 200),
    ('Jadidat Arar Checkpoint', 'نقطة جديدة عرعر', 'Jadidat Arar Border', 30.9500, 41.0333, 150),
    ('Al Batha Border Station', 'محطة الباطن الحدودية', 'Al Batha Crossing', 25.9333, 47.1000, 180),
    
    -- Training Centers
    ('Riyadh Training Academy', 'أكاديمية الرياض للتدريب', 'Training District, Riyadh', 24.7000, 46.8000, 200),
    ('Technical Institute Branch', 'فرع المعهد التقني', 'TVTC Campus, Various Cities', 24.6000, 46.7000, 150)
) AS location_data(name, name_ar, address, latitude, longitude, radius);