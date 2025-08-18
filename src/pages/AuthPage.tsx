import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail } from 'lucide-react';

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const signupEmailRef = useRef<HTMLInputElement>(null);
  const signinEmailRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const maskEmail = (email: string): string => {
    const [username, domain] = email.split('@');
    if (username.length <= 2) return email;
    const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
    return `${maskedUsername}@${domain}`;
  };

  const sendAuthLink = async (email: string, mode: 'signup' | 'magic'): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('send-auth-link', {
        body: {
          email,
          mode,
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error || (data as any)?.error) {
        throw new Error(error?.message || (data as any)?.error || 'Failed to send email');
      }

      return true;
    } catch (err: any) {
      console.error('Auth link invoke failed, falling back to OTP:', err);
      // Fallback to Supabase magic link to keep user moving if function/network fails
      try {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (otpError) throw otpError;
        return true;
      } catch (fallbackErr: any) {
        console.error('Fallback OTP also failed:', fallbackErr);
        throw new Error('We could not send the email right now. Please try again.');
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      // First try to sign up with Supabase
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error && error.message.toLowerCase().includes('already registered')) {
        // User exists - send magic link instead
        await sendAuthLink(email, 'magic');
        toast({
          title: 'Check your email',
          description: `We sent a secure sign-in link to ${maskEmail(email)}. Click it to access your AqlHR account.`,
        });
      } else if (error) {
        setError(error.message);
      } else {
        // New user signup - always send verification via our reliable system
        await sendAuthLink(email, 'signup');
        toast({
          title: 'Check your email',
          description: `We've sent a confirmation email to ${maskEmail(email)}. Open it to activate your AqlHR account.`,
        });
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('invalid') || msg.includes('credentials') || msg.includes('not confirmed')) {
          // Auto-send magic link for smoother UX
          await sendAuthLink(email, 'magic');
          toast({
            title: 'Check your email',
            description: `We emailed you a secure sign-in link at ${maskEmail(email)}. Check your inbox to continue.`,
          });
          setError(null);
        } else {
          setError(error.message);
        }
      } else {
        // Success - redirect to dashboard
        navigate('/');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordlessSignIn = async () => {
    const email = signinEmailRef.current?.value;
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await sendAuthLink(email, 'magic');
      toast({
        title: 'Check your email',
        description: `We emailed you a secure sign-in link at ${maskEmail(email)}. Click it to access your AqlHR account.`,
      });
    } catch (err: any) {
      console.error('Passwordless sign in error:', err);
      setError(err.message || 'Failed to send sign-in link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to AqlHR</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    disabled={isLoading}
                    ref={signinEmailRef}
                  />
                </div>
                <div className="space-y-2 relative">
                  <Input
                    name="password"
                    type={showSignInPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={handlePasswordlessSignIn}
                  disabled={isLoading}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email me a link
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    disabled={isLoading}
                    ref={signupEmailRef}
                  />
                </div>
                <div className="space-y-2 relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="space-y-2 relative">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;