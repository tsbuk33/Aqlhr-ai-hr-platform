import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setMessage("");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignUp) {
        // Try Supabase signup
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // Always trigger our custom edge function after signup
        await supabase.functions.invoke("send-auth-link", {
          body: {
            email,
            mode: "signup",
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        setMessage(`We sent a confirmation email to ${email}. Check your inbox.`);
      } else {
        // Try normal password sign-in
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          // On invalid credentials or unconfirmed email, fallback to magic link
          await supabase.functions.invoke("send-auth-link", {
            body: {
              email,
              mode: "magic",
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });
          setMessage(`We sent a secure sign-in link to ${email}. Check your inbox.`);
        } else {
          // Success → redirect
          navigate("/");
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err.message);

      // Final fallback: OTP via Supabase if Edge Function fails
      await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setMessage(`We emailed you a secure link at ${email}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-lg border">
        <h2 className="text-2xl font-bold text-center">
          Welcome to AqlHR
        </h2>

        <div className="flex justify-center space-x-4">
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

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-input text-foreground border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isSignUp ? true : false}
              className="w-full px-3 py-2 bg-input text-foreground border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
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
          <p className="mt-4 text-sm text-center text-green-600 dark:text-green-400">{message}</p>
        )}
      </div>
    </div>
  );
}