import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Exchange the auth code in the URL for a Supabase session
        const { error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );

        if (error) {
          console.error("Auth callback error:", error.message);
          setStatus("error");
          return;
        }

        // On success, redirect to dashboard with language prefix
        navigate("/en", { replace: true });
      } catch (err) {
        console.error("Unexpected auth callback error:", err);
        setStatus("error");
      }
    };

    handleCallback();
  }, [navigate]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-lg">Finishing sign-in… please wait.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="p-6 bg-card border rounded-lg shadow-lg text-center space-y-4">
          <h2 className="text-xl font-bold">Sign-in failed</h2>
          <p className="text-sm text-muted-foreground">
            The link may have expired or was already used. Please try signing in
            again.
          </p>
          <button
            onClick={() => navigate("/en/auth")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return null;
}