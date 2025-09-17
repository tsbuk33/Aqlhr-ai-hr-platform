import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Crown, AlertTriangle, Code2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function OwnerBootstrapGuide() {
  const [authUid, setAuthUid] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success('Copied to clipboard');
  };

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        setAuthUid(user.id);
        toast.success('Current user loaded');
      } else {
        toast.error('No user logged in');
      }
    } catch (error) {
      toast.error('Failed to get current user');
    }
  };

  const bootstrapCurrentUser = async () => {
    if (!currentUser) {
      toast.error('Please get current user first');
      return;
    }

    setLoading(true);
    try {
        const { data, error } = await supabase.rpc('bootstrap_current_user_as_owner' as any, {
          p_company_id: companyId || null
        });

      if (error) {
        if (error.message.includes('disabled in production')) {
          toast.error('This function is disabled in production. Use manual SQL instead.');
        } else {
          throw error;
        }
      } else {
        toast.success('User bootstrapped successfully!');
        console.log('Bootstrap result:', data);
      }
    } catch (error: any) {
      toast.error(`Bootstrap failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const manualSqlCommands = [
    {
      id: 'role',
      title: 'Insert Super Admin Role',
      sql: `-- Insert super admin role for your account
INSERT INTO public.user_roles (user_id, role, company_id) 
VALUES ('${authUid || '<YOUR_AUTH_UID>'}', 'super_admin', ${companyId ? `'${companyId}'` : 'NULL'})
ON CONFLICT (user_id, role) DO NOTHING;`
    },
    {
      id: 'profile',
      title: 'Update Profile Company',
      sql: `-- Update your profile with company association
UPDATE public.profiles 
SET company_id = '${companyId || '<YOUR_COMPANY_UUID>'}', updated_at = now()
WHERE user_id = '${authUid || '<YOUR_AUTH_UID>'};`
    },
    {
      id: 'helper',
      title: 'Use Helper Function (Dev/Preview)',
      sql: `-- Use the helper function (dev/preview only)
SELECT public.bootstrap_owner(
  '${authUid || '<YOUR_AUTH_UID>'}', 
  ${companyId ? `'${companyId}'` : 'NULL'}
);`
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-600" />
            Owner Bootstrap Guide
          </CardTitle>
          <CardDescription>
            Set up super admin access for your production account safely
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Current User Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Step 1: Get Your Auth UID
            </h4>
            <div className="flex gap-2">
              <Button onClick={getCurrentUser} variant="outline" size="sm">
                Get Current User
              </Button>
              {currentUser && (
                <Badge variant="secondary" className="font-mono text-xs">
                  Logged in: {currentUser.email}
                </Badge>
              )}
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Auth UID</label>
              <Input
                value={authUid}
                onChange={(e) => setAuthUid(e.target.value)}
                placeholder="00000000-0000-0000-0000-000000000000"
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company/Tenant UUID (Optional)</label>
              <Input
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                placeholder="00000000-0000-0000-0000-000000000000"
                className="font-mono text-xs"
              />
            </div>
          </div>

          {/* Dev Bootstrap */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              Step 2a: Automated Bootstrap (Dev/Preview Only)
            </h4>
            <div className="flex gap-2">
              <Button 
                onClick={bootstrapCurrentUser}
                disabled={!authUid || loading}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? 'Bootstrapping...' : 'Bootstrap Current User'}
              </Button>
              <Badge variant="outline" className="text-orange-600">
                Preview/Dev Only
              </Badge>
            </div>
          </div>

          {/* Manual SQL Commands */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              Step 2b: Manual SQL (Production Safe)
            </h4>
            
            <div className="space-y-3">
              {manualSqlCommands.map((cmd) => (
                <Card key={cmd.id} className="bg-gray-50 dark:bg-gray-900">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{cmd.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="text-xs bg-black text-green-400 p-3 rounded overflow-x-auto">
                        <code>{cmd.sql}</code>
                      </pre>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => copyToClipboard(cmd.sql, cmd.id)}
                      >
                        {copied === cmd.id ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Warning */}
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-orange-800 dark:text-orange-200">
                    Production Safety Notes:
                  </p>
                  <ul className="space-y-1 text-orange-700 dark:text-orange-300 text-xs">
                    <li>• Only run this once after your first login to production</li>
                    <li>• Execute SQL commands in Supabase SQL Editor with admin privileges</li>
                    <li>• The helper function is disabled in production for security</li>
                    <li>• Replace placeholder UUIDs with your actual values</li>
                    <li>• Verify your profile exists before running the UPDATE command</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}