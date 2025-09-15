import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Building2, Users, Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CenteredLayout from '@/components/layout/CenteredLayout';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

const AuthPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    companyName: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      const from = (location.state as any)?.from?.pathname || '/en';
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (activeTab === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }

      if (!formData.firstName || !formData.lastName) {
        setError('First name and last name are required');
        return false;
      }

      if (!formData.companyName) {
        setError('Company name is required');
        return false;
      }
    }

    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) throw error;

      if (data.session) {
        // ✅ Persist session so refresh doesn't log out
        localStorage.setItem(
          "supabase.auth.token",
          JSON.stringify(data.session)
        );

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });

        // ✅ Redirect user (fallback to dashboard)
        const searchParams = new URLSearchParams(location.search);
        const from =
          searchParams.get("from") ||
          (location.state as any)?.from?.pathname ||
          "/dashboard";

        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error("Sign in error:", err);

      if (err.message.includes("Invalid login credentials")) {
        setError("Invalid email or password.");
      } else if (err.message.includes("Email not confirmed")) {
        setError("Please confirm your email before signing in.");
      } else {
        setError(err.message || "An error occurred during sign in.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const redirectUrl = `${window.location.origin}/en`;
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company_name: formData.companyName,
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account before signing in.",
        });
        
        // Clear form and switch to sign in
        setFormData({
          email: formData.email, // Keep email for convenience
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          companyName: ''
        });
        setActiveTab('signin');
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      
      if (err.message.includes('already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
        setActiveTab('signin');
      } else {
        setError(err.message || 'An error occurred during sign up. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/en/auth?reset=true`,
      });

      if (error) throw error;

      setResetSent(true);
      toast({
        title: "Password reset email sent!",
        description: "Please check your email for instructions to reset your password.",
      });
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'An error occurred while sending the reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'signin') {
      handleSignIn();
    } else {
      handleSignUp();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <CenteredLayout variant="auth" maxWidth="md">
      <div className="w-full max-w-md space-y-6 auth-content">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">AqlHR Platform</h1>
          </div>
          <p className="text-muted-foreground">
            Saudi Arabia's Leading AI-Powered HR Management System
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <Users className="h-6 w-6 mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Multi-tenant</p>
          </div>
          <div className="space-y-2">
            <Shield className="h-6 w-6 mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Secure</p>
          </div>
          <div className="space-y-2">
            <Building2 className="h-6 w-6 mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Enterprise</p>
          </div>
        </div>

        {/* Auth Form */}
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs value={activeTab}>
                <TabsContent value="signin" className="space-y-4">
                  <CardDescription>
                    Sign in to your AqlHR account
                  </CardDescription>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm p-0 h-auto"
                      onClick={() => setShowResetForm(true)}
                    >
                      Forgot Password?
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <CardDescription>
                    Create your AqlHR account
                  </CardDescription>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Your company name"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="signupPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min 8 characters)"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {activeTab === 'signin' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  activeTab === 'signin' ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
          <p className="mt-2">
            🔒 Your data is encrypted and secure with enterprise-grade protection
          </p>
        </div>

        {/* Password Reset Modal */}
        {showResetForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                  {resetSent 
                    ? "Check your email for reset instructions"
                    : "Enter your email to receive password reset instructions"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!resetSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="resetEmail">Email</Label>
                      <Input
                        id="resetEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowResetForm(false);
                          setResetEmail('');
                          setError(null);
                          setResetSent(false);
                        }}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        className="flex-1"
                        onClick={handlePasswordReset}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Send Reset Email'
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-green-600">
                      Password reset email sent to {resetEmail}
                    </p>
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        setShowResetForm(false);
                        setResetEmail('');
                        setError(null);
                        setResetSent(false);
                      }}
                    >
                      Close
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </CenteredLayout>
  );
};

export default AuthPage;