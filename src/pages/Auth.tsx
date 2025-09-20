import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, Eye, EyeOff, Building2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguageCompat';
import LanguageToggle from '@/components/LanguageToggle';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | React.ReactNode>('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('signin');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { toast } = useToast();
  const isArabic = language === 'ar';

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // User is already logged in, redirect to main page
        const from = location.state?.from?.pathname || `/${language}`;
        navigate(from, { replace: true });
      }
    };
    
    checkAuth();
  }, [navigate, location, language]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const from = location.state?.from?.pathname || `/${language}`;
        navigate(from, { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location, language]);

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setError(isArabic ? 'يرجى إدخال البريد الإلكتروني أولاً' : 'Please enter your email first');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('resend-verification', {
        body: { email: email.trim() }
      });

      if (error) throw error;

      setSuccess(isArabic ? 'تم إرسال رابط التأكيد إلى بريدك الإلكتروني' : 'Verification link sent to your email');
      toast({
        title: isArabic ? 'تم الإرسال' : 'Email Sent',
        description: isArabic ? 'تحقق من بريدك الإلكتروني' : 'Check your email inbox'
      });
    } catch (err: any) {
      setError(err.message || (isArabic ? 'فشل في إرسال البريد' : 'Failed to send email'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          // Check if it's an email confirmation issue
          const { data: user } = await supabase.auth.getUser();
          if (!user.user && error.message.includes('Invalid login credentials')) {
            setError(
              <div className="space-y-2">
                <p>{isArabic ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة، أو لم يتم تأكيد البريد بعد' : 'Invalid credentials or email not confirmed yet'}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResendVerification}
                  disabled={isLoading}
                >
                  {isArabic ? 'إعادة إرسال رابط التأكيد' : 'Resend confirmation'}
                </Button>
              </div>
            );
          } else {
            setError(isArabic ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password');
          }
        } else if (error.message === 'Email not confirmed') {
          setError(
            <div className="space-y-2">
              <p>{isArabic ? 'يرجى تأكيد بريدك الإلكتروني أولاً' : 'Please confirm your email first'}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResendVerification}
                disabled={isLoading}
              >
                {isArabic ? 'إعادة إرسال رابط التأكيد' : 'Resend confirmation'}
              </Button>
            </div>
          );
        } else {
          setError(error.message);
        }
        return;
      }

      toast({
        title: isArabic ? 'تم تسجيل الدخول بنجاح' : 'Sign in successful',
        description: isArabic ? 'مرحباً بك في منصة الموارد البشرية الذكية' : 'Welcome to the Smart HR Platform'
      });

    } catch (err) {
      setError(isArabic ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (password !== confirmPassword) {
      setError(isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(isArabic ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/${language}`;
      
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        if (error.message === 'User already registered') {
          setError(isArabic ? 'المستخدم مسجل مسبقاً. يرجى تسجيل الدخول بدلاً من ذلك' : 'User already registered. Please sign in instead');
          setActiveTab('signin');
        } else {
          setError(error.message);
        }
        return;
      }

      setSuccess(isArabic ? 'تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني' : 'Account created successfully! Please check your email for verification');
      
      toast({
        title: isArabic ? 'تم إنشاء الحساب' : 'Account Created',
        description: isArabic ? 'يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب' : 'Please check your email to confirm your account'
      });

    } catch (err) {
      setError(isArabic ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/10 p-4 ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {isArabic ? 'عقل HR' : 'AqlHR'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'منصة الموارد البشرية الذكية' : 'Smart HR Platform'}
              </p>
            </div>
          </div>
          
          {/* Language Toggle */}
          <div className="flex justify-center">
            <LanguageToggle />
          </div>
        </div>

        {/* Auth Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center">
              {isArabic ? 'الوصول إلى المنصة' : 'Access Platform'}
            </CardTitle>
            <CardDescription className="text-center">
              {isArabic ? 'قم بتسجيل الدخول أو إنشاء حساب جديد' : 'Sign in to your account or create a new one'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">
                  {isArabic ? 'تسجيل الدخول' : 'Sign In'}
                </TabsTrigger>
                <TabsTrigger value="signup">
                  {isArabic ? 'إنشاء حساب' : 'Sign Up'}
                </TabsTrigger>
              </TabsList>

              {/* Sign In Form */}
              <TabsContent value="signin" className="space-y-4 mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">
                      {isArabic ? 'البريد الإلكتروني' : 'Email'}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder={isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">
                      {isArabic ? 'كلمة المرور' : 'Password'}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={isArabic ? 'أدخل كلمة المرور' : 'Enter your password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isArabic ? 'جاري تسجيل الدخول...' : 'Signing in...'}
                      </>
                    ) : (
                      isArabic ? 'تسجيل الدخول' : 'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Form */}
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">
                      {isArabic ? 'البريد الإلكتروني' : 'Email'}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder={isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">
                      {isArabic ? 'كلمة المرور' : 'Password'}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={isArabic ? 'أدخل كلمة المرور (6 أحرف على الأقل)' : 'Enter password (min 6 characters)'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      {isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={isArabic ? 'أعد إدخال كلمة المرور' : 'Re-enter your password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isArabic ? 'جاري إنشاء الحساب...' : 'Creating account...'}
                      </>
                    ) : (
                      isArabic ? 'إنشاء حساب' : 'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Error/Success Messages */}
            {error && (
              <Alert className="mt-4 border-destructive/50 text-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-4 border-green-500/50 text-green-700">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            {isArabic 
              ? 'منصة الموارد البشرية الذكية للمملكة العربية السعودية' 
              : 'Smart HR Platform for Saudi Arabia'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;