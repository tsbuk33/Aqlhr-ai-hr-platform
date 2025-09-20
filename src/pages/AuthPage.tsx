import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { localePath, resolveLang } from "@/lib/i18n/localePath";
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const isRTL = language === 'ar';

  // Redirect if already authenticated
  if (user) {
    const nextUrl = searchParams.get('next') || localePath('dashboard', resolveLang());
    navigate(nextUrl, { replace: true });
    return null;
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setMessage("");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    // Validate password requirements
    if (!password || password.length < 8) {
      setIsError(true);
      setMessage("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Enforce password for signup
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/${resolveLang()}/auth/callback`
          }
        });
        
        if (error) throw error;

        // Show success message for signup
        setMessage(`We emailed you a secure link at ${email}.`);
      } else {
        // Normal password sign-in
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          console.error("Password sign-in failed:", error.message);
          setIsError(true);
          setMessage(error.message === 'Invalid login credentials' ? 'Invalid email or password.' : error.message);
        } else {
          const nextUrl = searchParams.get('next') || localePath('dashboard', resolveLang());
          navigate(nextUrl);
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err.message);
      setIsError(true);
      setMessage(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/${resolveLang()}/auth/callback?reset=true`,
      });

      if (error) throw error;
      
      setResetSent(true);
      setMessage(`Password reset email sent to ${resetEmail}.`);
    } catch (err: any) {
      console.error("Password reset error:", err.message);
      setIsError(true);
      setMessage(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-saudi-hero relative overflow-hidden auth-form-container" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          width: '100%',
          height: '100%'
        }} />
      </div>
      
      <div className="relative z-10 w-full max-w-md p-8 auth-form-card">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AqlHR</h1>
          <h2 className="text-xl text-foreground-muted mb-4">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-muted-foreground">
            {isSignUp ? 'Sign up to access your HR platform' : 'Sign in to continue to your dashboard'}
          </p>
        </div>

        <div className="button-group">
          <button
            className={`px-4 py-2 rounded ${!isSignUp ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
          <button
            className={`px-4 py-2 rounded ${isSignUp ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleAuth} className="auth-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="eye-icon"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {!isSignUp && (
            <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setResetEmail(email);
                }}
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm text-center ${isError ? 'text-destructive' : 'text-green-600 dark:text-green-400'}`}>{message}</p>
        )}

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowForgotPassword(false)}>
            <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">Reset Password</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {resetSent ? "Check your email for reset instructions" : "Enter your email to receive reset instructions"}
                </p>
              </div>

              {!resetSent ? (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full p-2 border border-border bg-background text-foreground rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetEmail("");
                        setResetSent(false);
                        setMessage("");
                        setIsError(false);
                      }}
                      className="flex-1 py-2 px-4 border border-border bg-background text-foreground rounded hover:bg-muted transition-colors"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {loading ? "Sending..." : "Send Reset Email"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-green-600">Reset email sent to {resetEmail}</p>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmail("");
                      setResetSent(false);
                      setMessage("");
                      setIsError(false);
                    }}
                    className="w-full py-2 px-4 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}