import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw } from 'lucide-react';

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const exchangeCodeForSession = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      
      if (error) {
        console.error('Auth exchange error:', error);
        throw error;
      }

      if (data.session) {
        toast({
          title: 'Welcome to AqlHR!',
          description: 'You have been successfully signed in.',
        });
        
        // Small delay to ensure session is fully set
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 100);
      } else {
        throw new Error('No session received');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed');
      setIsLoading(false);
    }
  };

  const handleSendFreshLink = async () => {
    try {
      setIsLoading(true);
      
      // Try to get email from URL params or show input
      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get('email') || prompt('Please enter your email address:');
      
      if (!email) {
        setError('Email is required to send a fresh link');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('send-auth-link', {
        body: { 
          email, 
          mode: 'magic', 
          redirectTo: `${window.location.origin}/auth/callback` 
        }
      });

      if (error || data?.error) {
        throw new Error(error?.message || data?.error || 'Failed to send email');
      }

      if (data?.actionLink) {
        window.location.assign(data.actionLink as string);
        return;
      }

      toast({
        title: 'Fresh link sent!',
        description: `We've sent a new sign-in link to ${email}. Please check your inbox.`,
      });
      
      setError(null);
    } catch (err: any) {
      console.error('Send fresh link error:', err);
      setError(err.message || 'Failed to send fresh link');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    exchangeCodeForSession();
  }, []);

  if (isLoading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Signing you in...</h2>
            <p className="text-muted-foreground text-center">
              Please wait while we complete your authentication to AqlHR.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-destructive">
            Authentication Issue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            {error || 'There was a problem signing you in to AqlHR.'}
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={handleSendFreshLink} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Send me a fresh link
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/auth')} 
              className="w-full"
            >
              Back to Sign In
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            If you continue to have issues, please contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;