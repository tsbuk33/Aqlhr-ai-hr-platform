import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, CheckCircle, Info, RefreshCw, User, Mail, Key } from 'lucide-react';

export const AuthDebugPanel: React.FC = () => {
  const [email, setEmail] = useState('');
  const [debugResults, setDebugResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();

  const debugAuth = async (action: string) => {
    if (!email && action !== 'check_session') {
      alert('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/supabase/functions/debug-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({ action, email }),
      });

      const result = await response.json();
      setDebugResults(result);
    } catch (error) {
      console.error('Debug error:', error);
      setDebugResults({ 
        success: false, 
        error: 'Failed to connect to debug service',
        details: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSupabaseConfig = () => {
    const config = {
      origin: window.location.origin,
      currentPath: window.location.pathname,
      hashFragment: window.location.hash,
      searchParams: window.location.search,
      hasSupabaseClient: !!supabase,
      timestamp: new Date().toISOString(),
    };
    
    setDebugResults({
      success: true,
      action: 'config_check',
      result: config
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Authentication Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Auth State */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm">User Status:</span>
            <Badge variant={user ? 'default' : 'secondary'}>
              {user ? 'Authenticated' : 'Not Authenticated'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="text-sm">Email:</span>
            <span className="text-sm font-mono">{user?.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="text-sm">Session:</span>
            <Badge variant={session ? 'default' : 'secondary'}>
              {session ? 'Active' : 'None'}
            </Badge>
          </div>
        </div>

        {/* Debug Email Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Email to Debug:</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address to debug"
          />
        </div>

        {/* Debug Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            onClick={() => debugAuth('check_user')}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Check User'}
          </Button>
          
          <Button
            onClick={() => debugAuth('resend_confirmation')}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Resend Email'}
          </Button>
          
          <Button
            onClick={() => debugAuth('check_session')}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Check Session'}
          </Button>
          
          <Button
            onClick={checkSupabaseConfig}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            Check Config
          </Button>
        </div>

        {/* Debug Results */}
        {debugResults && (
          <Alert className={debugResults.success ? 'border-green-200' : 'border-red-200'}>
            <div className="flex items-center gap-2">
              {debugResults.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="font-medium">
                Debug Results ({debugResults.action})
              </span>
            </div>
            <AlertDescription className="mt-2">
              <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                {JSON.stringify(debugResults, null, 2)}
              </pre>
            </AlertDescription>
          </Alert>
        )}

        {/* Configuration Recommendations */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Vercel Deployment Checklist:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Set Site URL in Supabase to your Vercel domain</li>
              <li>Add all Vercel URLs (preview + production) to Redirect URLs</li>
              <li>Ensure email confirmation is enabled for security</li>
              <li>Check that DNS/domain configuration is correct</li>
              <li>Verify CORS settings allow your domain</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};