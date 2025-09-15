import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { localePath, resolveLang } from "@/lib/i18n/localePath";
import { useLanguage } from '@/hooks/useLanguageCompat';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

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

    try {
      if (isSignUp) {
        // Try Supabase signup
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // Always trigger our custom edge function after signup
        const { data, error: fnError } = await supabase.functions.invoke("send-auth-link", {
          body: {
            email,
            mode: "signup",
redirectTo: `${window.location.origin}/${resolveLang()}/auth/callback`,
          },
        });

        if (fnError || (data as any)?.error) {
          throw new Error(fnError?.message || (data as any)?.error || "Failed to send email");
        }

        if ((data as any)?.actionLink) {
          const url = (data as any).actionLink as string;
          const opened = window.open(url, "_blank", "noopener,noreferrer");
          setMessage(`We sent a confirmation email to ${email}. If it doesn't arrive, use this link: ${url}`);
        } else {
          setMessage(`We sent a confirmation email to ${email}. Check your inbox.`);
        }
        } else {
          // Normal password sign-in only (no magic link fallback)
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

      // Final fallback: OTP via Supabase if Edge Function fails
      await supabase.auth.signInWithOtp({
        email,
options: { emailRedirectTo: `${window.location.origin}/${resolveLang()}/auth/callback` },
      });
      setMessage(`We emailed you a secure link at ${email}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-form-container bg-background text-foreground ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="auth-form-card">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">AqlHR</h1>
          <h2 className="text-xl font-semibold">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-muted-foreground mt-2">
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
              required={!isSignUp ? true : false}
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
        
      </div>
    </div>
  );
}