import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from '@/hooks/useUserCompany';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { Key, Copy, Trash2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface APIKey {
  id: string;
  name: string;
  key_hash: string;
  scopes: string[];
  created_at: string;
  last_used_at?: string;
  active: boolean;
}

const APIKeyManager: React.FC = () => {
  const { companyId } = useUserCompany();
  const { isArabic } = useSimpleLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] = useState('read,write');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  // Fetch API keys
  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['api-keys', companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('tenant_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as APIKey[];
    },
    enabled: !!companyId
  });

  // Create API key mutation
  const createKeyMutation = useMutation({
    mutationFn: async ({ name, scopes }: { name: string; scopes: string[] }) => {
      if (!companyId) throw new Error('No company ID');

      const { data, error } = await supabase
        .rpc('api_create_key_v1' as any, {
          p_tenant_id: companyId,
          p_name: name,
          p_scopes: scopes
        });

      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      setGeneratedKey(data.api_key);
      queryClient.invalidateQueries({ queryKey: ['api-keys', companyId] });
      toast({
        title: isArabic ? 'تم إنشاء مفتاح API' : 'API Key Created',
        description: isArabic ? 'تم إنشاء مفتاح API جديد بنجاح' : 'New API key created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: isArabic ? 'خطأ' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Revoke API key mutation
  const revokeKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const { data, error } = await supabase
        .rpc('api_revoke_key_v1' as any, { p_key_id: keyId });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', companyId] });
      toast({
        title: isArabic ? 'تم إلغاء المفتاح' : 'Key Revoked',
        description: isArabic ? 'تم إلغاء مفتاح API بنجاح' : 'API key revoked successfully',
      });
    }
  });

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: isArabic ? 'خطأ' : 'Error',
        description: isArabic ? 'يرجى إدخال اسم للمفتاح' : 'Please enter a key name',
        variant: 'destructive',
      });
      return;
    }

    const scopes = newKeyScopes.split(',').map(s => s.trim()).filter(Boolean);
    createKeyMutation.mutate({ name: newKeyName, scopes });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: isArabic ? 'تم النسخ' : 'Copied',
      description: isArabic ? 'تم نسخ المفتاح إلى الحافظة' : 'Key copied to clipboard',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            {isArabic ? 'مفاتيح API' : 'API Keys'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          {isArabic ? 'مفاتيح API' : 'API Keys'}
        </CardTitle>
        <CardDescription>
          {isArabic 
            ? 'إدارة مفاتيح API للوصول الخارجي إلى النظام'
            : 'Manage API keys for external system access'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {isArabic ? `${apiKeys?.length || 0} مفتاح نشط` : `${apiKeys?.length || 0} active keys`}
          </p>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                {isArabic ? 'إنشاء مفتاح جديد' : 'Create New Key'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isArabic ? 'إنشاء مفتاح API جديد' : 'Create New API Key'}
                </DialogTitle>
                <DialogDescription>
                  {isArabic 
                    ? 'أنشئ مفتاح API جديد للوصول الخارجي'
                    : 'Create a new API key for external access'
                  }
                </DialogDescription>
              </DialogHeader>

              {generatedKey ? (
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {isArabic 
                        ? 'احفظ هذا المفتاح الآن - لن تتمكن من رؤيته مرة أخرى!'
                        : 'Save this key now - you won\'t be able to see it again!'
                      }
                    </AlertDescription>
                  </Alert>
                  <div className="flex items-center gap-2">
                    <Input value={generatedKey} readOnly className="font-mono text-sm" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(generatedKey)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setGeneratedKey(null);
                      setNewKeyName('');
                      setNewKeyScopes('read,write');
                    }}
                    className="w-full"
                  >
                    {isArabic ? 'إغلاق' : 'Close'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="keyName">
                      {isArabic ? 'اسم المفتاح' : 'Key Name'}
                    </Label>
                    <Input
                      id="keyName"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder={isArabic ? 'مثال: تطبيق الهاتف المحمول' : 'e.g., Mobile App'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="keyScopes">
                      {isArabic ? 'الصلاحيات (مفصولة بفاصلة)' : 'Scopes (comma-separated)'}
                    </Label>
                    <Input
                      id="keyScopes"
                      value={newKeyScopes}
                      onChange={(e) => setNewKeyScopes(e.target.value)}
                      placeholder="read,write,admin"
                    />
                  </div>
                  <Button 
                    onClick={handleCreateKey}
                    disabled={createKeyMutation.isPending}
                    className="w-full"
                  >
                    {createKeyMutation.isPending 
                      ? (isArabic ? 'جاري الإنشاء...' : 'Creating...')
                      : (isArabic ? 'إنشاء المفتاح' : 'Create Key')
                    }
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {apiKeys?.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{key.name}</h4>
                  <Badge variant={key.active ? 'default' : 'secondary'}>
                    {key.active 
                      ? (isArabic ? 'نشط' : 'Active')
                      : (isArabic ? 'غير نشط' : 'Inactive')
                    }
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    {isArabic ? 'تم الإنشاء: ' : 'Created: '}
                    {format(new Date(key.created_at), 'PPp')}
                  </div>
                  {key.last_used_at && (
                    <div>
                      {isArabic ? 'آخر استخدام: ' : 'Last used: '}
                      {format(new Date(key.last_used_at), 'PPp')}
                    </div>
                  )}
                  <div className="flex gap-1 flex-wrap">
                    {key.scopes.map((scope) => (
                      <Badge key={scope} variant="outline" className="text-xs">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => revokeKeyMutation.mutate(key.id)}
                disabled={!key.active || revokeKeyMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {!apiKeys?.length && (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{isArabic ? 'لا توجد مفاتيح API' : 'No API keys found'}</p>
              <p className="text-sm">
                {isArabic 
                  ? 'أنشئ مفتاح API للوصول الخارجي إلى النظام'
                  : 'Create an API key to enable external system access'
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeyManager;