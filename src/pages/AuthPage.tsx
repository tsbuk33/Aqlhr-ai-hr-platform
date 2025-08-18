import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

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

    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        // User exists but may be unconfirmed — automatically send magic link/verification
        try {
          const { data: emailData, error: emailError } = await supabase.functions.invoke('resend-verification', {
            body: { email, redirectUrl: `${window.location.origin}/` }
          });

          if (emailError || emailData?.error) {
            console.error('Email sending error:', emailError || emailData?.error);
            setError('This email is already registered. We could not send a new verification email automatically. Please try the Resend button.');
          } else {
            toast({
              title: 'Verification email re-sent',
              description: `We sent a fresh link to ${email}. Please check your inbox or spam folder.`,
            });
            setError(null);
          }
        } catch (emailErr) {
          console.error('Email network error:', emailErr);
          setError('Could not send verification email automatically. Please try again.');
        }
        setIsLoading(false);
        return;
      } else {
        setError(error.message);
        setIsLoading(false);
        return;
      }
    }

    // Automatically send verification email via our reliable Resend system
    try {
      const { data: emailData, error: emailError } = await supabase.functions.invoke('resend-verification', {
        body: { email, redirectUrl: `${window.location.origin}/` }
      });

      if (emailError || emailData?.error) {
        console.error('Email sending error:', emailError || emailData?.error);
        toast({
          title: 'Account created successfully',
          description: "Account created, but there was an issue sending the verification email. You can use the 'Resend verification' button below.",
        });
      } else {
        toast({
          title: 'Account created successfully',
          description: 'Please check your email to verify your account. The verification email should arrive within a few minutes.',
        });
      }
    } catch (emailErr) {
      console.error('Email network error:', emailErr);
      toast({
        title: 'Account created successfully',
        description: "Account created, but there was an issue sending the verification email. You can use the 'Resend verification' button below.",
      });
    }

    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('invalid login credentials') || msg.includes('email not confirmed')) {
        // Fall back to passwordless magic link for a smoother UX
        await handleResendVerification('signin');
        toast({
          title: 'Check your email',
          description: 'We sent you a secure sign-in link. Use it to access your account instantly.',
        });
        setError(null);
      } else {
        setError(error.message);
      }
    } else {
      navigate('/');
    }
  };

  const handleResendVerification = async (source: 'signin' | 'signup') => {
    const email = source === 'signup' ? signupEmailRef.current?.value : signinEmailRef.current?.value;
    if (!email) {
      toast({ title: 'Enter your email', description: 'Please type your email then click resend.' });
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.functions.invoke('resend-verification', {
        body: { email, redirectUrl }
      });

      if (error) {
        console.error('Edge function error:', error);
        setError('Failed to send verification email. Please try again.');
      } else if (data?.error) {
        console.error('Server error:', data.error);
        setError(data.error);
      } else {
        toast({
          title: 'Verification email sent!',
          description: `Check your inbox at ${email}. The email should arrive within a few minutes.`
        });
        setError(null);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Please check your connection and try again.');
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
                <Button type="button" variant="link" className="w-full" onClick={() => handleResendVerification('signin')}>
                  Didn't get the email? Resend verification
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
                <Button type="button" variant="link" className="w-full" onClick={() => handleResendVerification('signup')}>
                  Didn't get the email? Resend verification
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