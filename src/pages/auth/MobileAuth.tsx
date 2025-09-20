import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { 
  Smartphone, 
  Mail, 
  Lock, 
  Loader2, 
  Languages,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

export const MobileAuth: React.FC = () => {
  const { user, signIn, signUp } = useAuth();
  const { lang, setLang } = useUnifiedLocale();
  const location = useLocation();
  const isArabic = lang === 'ar';

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (user) {
    const from = (location.state as any)?.from?.pathname || '/en/mobile';
    return <Navigate to={from} replace />;
  }

  const handleLanguageToggle = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(isArabic ? 'خطأ في تسجيل الدخول' : 'Login failed', {
            description: error.message
          });
        } else {
          toast.success(isArabic ? 'تم تسجيل الدخول بنجاح' : 'Login successful');
        }
      } else {
        if (password !== confirmPassword) {
          toast.error(isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email, password);
        if (error) {
          toast.error(isArabic ? 'خطأ في إنشاء الحساب' : 'Sign up failed', {
            description: error.message
          });
        } else {
          toast.success(isArabic ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(isArabic ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir={isArabic ? 'rtl' : 'ltr'}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Smartphone className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {isArabic ? 'اقل للموارد البشرية' : 'AqlHR Mobile'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {isLogin 
              ? (isArabic ? 'تسجيل الدخول إلى حسابك' : 'Sign in to your account')
              : (isArabic ? 'إنشاء حساب جديد' : 'Create a new account')
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                {isArabic ? 'البريد الإلكتروني' : 'Email'}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {isArabic ? 'كلمة المرور' : 'Password'}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter your password'}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={isArabic ? 'أعد إدخال كلمة المرور' : 'Re-enter your password'}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin 
                ? (isArabic ? 'تسجيل الدخول' : 'Sign In')
                : (isArabic ? 'إنشاء حساب' : 'Sign Up')
              }
            </Button>
          </form>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin 
                ? (isArabic ? 'ليس لديك حساب؟ إنشاء حساب' : "Don't have an account? Sign up")
                : (isArabic ? 'لديك حساب؟ تسجيل الدخول' : 'Already have an account? Sign in')
              }
            </Button>
          </div>

          <div className="text-center border-t pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLanguageToggle}
              className="flex items-center gap-2"
            >
              <Languages className="h-4 w-4" />
              {isArabic ? 'English' : 'العربية'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileAuth;