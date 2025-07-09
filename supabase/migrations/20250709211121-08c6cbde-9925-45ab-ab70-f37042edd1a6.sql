-- Create payment infrastructure tables for SanadHR

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id),
  plan_type TEXT NOT NULL, -- 'basic', 'professional', 'enterprise'
  billing_cycle TEXT NOT NULL, -- 'monthly', 'annual'
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  hyperpay_subscription_id TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'pending'
  trial_end_date TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  company_id UUID REFERENCES public.companies(id),
  subscription_id UUID REFERENCES public.subscriptions(id),
  hyperpay_payment_id TEXT,
  hyperpay_checkout_id TEXT,
  payment_type TEXT NOT NULL, -- 'subscription', 'one_time', 'setup_fee'
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  vat_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  payment_method TEXT, -- 'mada', 'visa', 'mastercard', 'stc_pay', 'apple_pay'
  description TEXT,
  invoice_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id UUID REFERENCES public.payments(id),
  invoice_number TEXT UNIQUE NOT NULL,
  company_id UUID REFERENCES public.companies(id),
  user_id UUID REFERENCES auth.users(id),
  subtotal DECIMAL(10,2) NOT NULL,
  vat_rate DECIMAL(5,2) DEFAULT 15.00, -- 15% VAT in Saudi Arabia
  vat_amount DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  status TEXT DEFAULT 'draft', -- 'draft', 'sent', 'paid', 'overdue', 'cancelled'
  due_date DATE,
  issued_date DATE DEFAULT CURRENT_DATE,
  paid_date DATE,
  invoice_data JSONB, -- Store Arabic/English invoice details
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_code TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_annual DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  features JSONB NOT NULL, -- List of features in Arabic/English
  max_employees INTEGER,
  max_modules INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (plan_code, name_en, name_ar, description_en, description_ar, price_monthly, price_annual, features, max_employees, max_modules) VALUES
('basic', 'Basic Plan', 'الخطة الأساسية', 'Essential HR features for small businesses', 'الميزات الأساسية للموارد البشرية للشركات الصغيرة', 299.00, 2988.00, 
'{"en": ["Employee Management", "Basic Payroll", "Leave Management", "Basic Reports"], "ar": ["إدارة الموظفين", "كشوف المرتبات الأساسية", "إدارة الإجازات", "التقارير الأساسية"]}', 50, 5),

('professional', 'Professional Plan', 'الخطة المهنية', 'Advanced HR features for growing companies', 'ميزات موارد بشرية متقدمة للشركات النامية', 599.00, 5988.00,
'{"en": ["All Basic Features", "Advanced Analytics", "Government Integration", "Performance Management", "Training Management"], "ar": ["جميع الميزات الأساسية", "التحليلات المتقدمة", "التكامل الحكومي", "إدارة الأداء", "إدارة التدريب"]}', 200, 10),

('enterprise', 'Enterprise Plan', 'خطة المؤسسات', 'Complete HR solution for large organizations', 'حل شامل للموارد البشرية للمؤسسات الكبيرة', 1299.00, 12988.00,
'{"en": ["All Professional Features", "AI-Powered Analytics", "Custom Integrations", "24/7 Support", "Compliance Management", "Multi-Company Support"], "ar": ["جميع الميزات المهنية", "التحليلات المدعومة بالذكاء الاصطناعي", "التكاملات المخصصة", "الدعم على مدار الساعة", "إدارة الامتثال", "دعم متعدد الشركات"]}', 1000, 999);

-- Enable RLS on all tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view their company subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their company subscriptions" 
ON public.subscriptions 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for payments
CREATE POLICY "Users can view their company payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their company payments" 
ON public.payments 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for invoices
CREATE POLICY "Users can view their company invoices" 
ON public.invoices 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their company invoices" 
ON public.invoices 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for subscription plans (public read access)
CREATE POLICY "Anyone can view subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (true);

-- Create updated_at triggers
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();