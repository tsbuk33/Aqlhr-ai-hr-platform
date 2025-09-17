import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { supabase } from '@/integrations/supabase/client';
import { 
  Settings, 
  Check, 
  X, 
  AlertTriangle, 
  RefreshCw,
  Zap,
  Activity,
  BarChart3
} from 'lucide-react';

interface ToolIntegration {
  id: string;
  tool_name: string;
  tool_category: string;
  is_enabled: boolean;
  configuration: any;
  last_sync: string | null;
  sync_status: string;
  created_at: string;
  updated_at: string;
}

interface ToolIntegrationManagerProps {
  companyId?: string;
}

const ToolIntegrationManager: React.FC<ToolIntegrationManagerProps> = ({ companyId }) => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<ToolIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);

  // Tool categories with their configurations
  const toolCategories = {
    communication_collaboration: {
      title: t('nav.communication_collaboration'),
      icon: Settings,
      color: 'bg-blue-500',
    },
    document_management: {
      title: t('nav.document_management'),
      icon: Settings,
      color: 'bg-green-500',
    },
    calendar_scheduling: {
      title: t('nav.calendar_scheduling'),
      icon: Settings,
      color: 'bg-purple-500',
    },
    analytics_bi: {
      title: t('nav.analytics_bi'),
      icon: BarChart3,
      color: 'bg-orange-500',
    },
    learning_development: {
      title: t('nav.learning_development'),
      icon: Settings,
      color: 'bg-indigo-500',
    },
    automation_platforms: {
      title: t('nav.automation_platforms'),
      icon: Zap,
      color: 'bg-yellow-500',
    }
  };

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('tool_integrations')
        .select('*')
        .order('tool_category', { ascending: true })
        .order('tool_name', { ascending: true });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحميل التكاملات' : 'Failed to load integrations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleIntegration = async (integrationId: string, toolName: string, currentStatus: boolean) => {
    setSyncing(integrationId);
    try {
      const { error: updateError } = await supabase
        .from('tool_integrations')
        .update({ 
          is_enabled: !currentStatus,
          sync_status: !currentStatus ? 'active' : 'inactive',
          last_sync: !currentStatus ? new Date().toISOString() : null
        })
        .eq('id', integrationId);

      if (updateError) throw updateError;

      // Call sync function
      const { error: syncError } = await supabase.rpc('sync_tool_integration' as any, {
        p_company_id: companyId,
        p_tool_name: toolName,
        p_action: !currentStatus ? 'enable' : 'disable'
      });

      if (syncError) throw syncError;

      // Log usage analytics
      await supabase.from('tool_usage_analytics').insert({
        company_id: companyId,
        tool_name: toolName,
        action_type: !currentStatus ? 'enable' : 'disable',
        metadata: {
          previous_status: currentStatus,
          new_status: !currentStatus,
          integration_id: integrationId
        },
        success: true
      });

      await fetchIntegrations();
      
      toast({
        title: isRTL ? 'تم التحديث' : 'Updated',
        description: isRTL 
          ? `${toolName} ${!currentStatus ? 'تم تفعيله' : 'تم إلغاء تفعيله'}` 
          : `${toolName} ${!currentStatus ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error toggling integration:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تحديث التكامل' : 'Failed to update integration',
        variant: 'destructive',
      });
    } finally {
      setSyncing(null);
    }
  };

  const syncAllTools = async () => {
    try {
      const enabledTools = integrations.filter(i => i.is_enabled);
      
      for (const tool of enabledTools) {
        await supabase.rpc('sync_tool_integration' as any, {
          p_company_id: companyId,
          p_tool_name: tool.tool_name,
          p_action: 'sync'
        });
      }

      await fetchIntegrations();
      
      toast({
        title: isRTL ? 'تمت المزامنة' : 'Synced',
        description: isRTL ? 'تم مزامنة جميع الأدوات' : 'All tools synced successfully',
      });
    } catch (error) {
      console.error('Error syncing tools:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في مزامنة الأدوات' : 'Failed to sync tools',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'error':
        return <X className="h-4 w-4 text-red-600" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'syncing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get category display names
  const getCategoryDisplayName = (category: string): string => {
    const categoryNames: { [key: string]: string } = {
      'communication_collaboration': 'Communication & Collaboration',
      'document_management': 'Document Management', 
      'calendar_scheduling': 'Calendar & Scheduling',
      'analytics_bi': 'Analytics & BI',
      'learning_development': 'Learning & Development',
      'automation_platforms': 'Automation Platforms',
      'government': 'Government Integrations',
      'compliance': 'Compliance Tools',
      'hr_systems': 'HR Systems',
      'payroll': 'Payroll Systems'
    };
    return categoryNames[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Helper function to get tool icons
  const getToolIcon = (toolName: string) => {
    const iconMap: { [key: string]: any } = {
      'Microsoft Teams': Settings,
      'Slack': Settings,
      'WhatsApp Business': Settings,
      'Email Integration': Settings,
      'Outlook Integration': Settings,
      'SharePoint': Settings,
      'Google Drive': Settings,
      'OneDrive': Settings,
      'Dropbox': Settings,
      'DocuSign': Settings,
      'Adobe Sign': Settings,
      'Google Calendar': Settings,
      'Outlook Calendar': Settings,
      'Calendly': Settings,
      'Room Booking': Settings,
      'Power BI': BarChart3,
      'Tableau': BarChart3,
      'Google Analytics': BarChart3,
      'Custom Connectors': Settings,
      'LinkedIn Learning': Settings,
      'Coursera Business': Settings,
      'Udemy Business': Settings,
      'Local Training Platforms': Settings,
      'Zapier': Zap,
      'Power Automate': Zap,
      'Custom Workflows': Zap
    };
    return iconMap[toolName] || Settings;
  };

  // Group integrations by category
  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.tool_category]) {
      acc[integration.tool_category] = [];
    }
    acc[integration.tool_category].push(integration);
    return acc;
  }, {} as Record<string, ToolIntegration[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const enabledCount = integrations.filter(i => i.is_enabled).length;
  const activeCount = integrations.filter(i => i.sync_status === 'active').length;

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {isRTL ? 'إدارة تكاملات الأدوات' : 'Tool Integration Manager'}
          </h2>
          <p className="text-muted-foreground">
            {isRTL 
              ? `${enabledCount} من ${integrations.length} أداة مفعلة | ${activeCount} نشطة`
              : `${enabledCount} of ${integrations.length} tools enabled | ${activeCount} active`}
          </p>
        </div>
        <Button onClick={syncAllTools} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          {isRTL ? 'مزامنة الكل' : 'Sync All'}
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{integrations.length}</p>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'إجمالي الأدوات' : 'Total Tools'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{enabledCount}</p>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'مفعل' : 'Enabled'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCount}</p>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'نشط' : 'Active'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((activeCount / integrations.length) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'معدل النشاط' : 'Activity Rate'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tool Categories */}
      {Object.entries(groupedIntegrations).map(([category, categoryIntegrations]) => (
        <Card key={category}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>{getCategoryDisplayName(category)}</CardTitle>
                <CardDescription>
                  {`${categoryIntegrations.length} tools available`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryIntegrations.map((integration) => {
                const ToolIcon = getToolIcon(integration.tool_name);
                return (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                        <ToolIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{integration.tool_name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={getStatusColor(integration.sync_status)}>
                            {integration.sync_status}
                          </Badge>
                          {integration.last_sync && (
                            <span className="text-xs text-muted-foreground">
                              Last sync: {new Date(integration.last_sync).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {/* Show tool features */}
                        {integration.configuration?.features && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {integration.configuration.features.slice(0, 3).map((feature: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                            {integration.configuration.features.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{integration.configuration.features.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(integration.sync_status)}
                      <Switch
                        checked={integration.is_enabled}
                        onCheckedChange={() => 
                          toggleIntegration(integration.id, integration.tool_name, integration.is_enabled)
                        }
                        disabled={syncing === integration.id}
                      />
                      {syncing === integration.id && (
                        <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ToolIntegrationManager;