import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GovernmentPortal {
  id: string;
  portal_code: string;
  portal_name_en: string;
  portal_name_ar: string;
  portal_category: string;
  api_base_url?: string;
  documentation_url?: string;
  status: string;
  supported_operations: string[];
  rate_limits: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CompanyGovConnection {
  id: string;
  company_id: string;
  portal_code: string;
  connection_status: 'connected' | 'disconnected' | 'error' | 'demo' | 'testing';
  credentials_configured: boolean;
  last_sync_at?: string;
  last_error?: string;
  sync_frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual';
  auto_sync_enabled: boolean;
  configuration: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface GovernmentPortalStatus {
  portal_code: string;
  portal_name_en: string;
  portal_name_ar: string;
  category: string;
  connection_status: string;
  last_sync_at?: string;
  compliance_count: number;
}

export const useGovernmentPortals = () => {
  const [portals, setPortals] = useState<GovernmentPortal[]>([]);
  const [connections, setConnections] = useState<CompanyGovConnection[]>([]);
  const [portalStatus, setPortalStatus] = useState<GovernmentPortalStatus[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current company ID
  const getCurrentCompanyId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userRole } = await supabase
      .from('user_roles')
      .select('company_id')
      .eq('user_id', user.id)
      .single();

    return userRole?.company_id || null;
  };

  // Fetch all government portals
  const fetchPortals = async () => {
    try {
      const { data, error } = await supabase
        .from('government_portals')
        .select('*')
        .eq('status', 'active')
        .order('portal_category, portal_name_en');
      
      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(portal => ({
        ...portal,
        supported_operations: Array.isArray(portal.supported_operations) 
          ? portal.supported_operations 
          : JSON.parse(String(portal.supported_operations || '[]')),
        rate_limits: typeof portal.rate_limits === 'object' 
          ? portal.rate_limits 
          : JSON.parse(String(portal.rate_limits || '{}'))
      }));
      
      setPortals(transformedData);
    } catch (error) {
      console.error('Error fetching government portals:', error);
      toast.error('Failed to fetch government portals');
    }
  };

  // Fetch company connections
  const fetchConnections = async () => {
    try {
      const companyId = await getCurrentCompanyId();
      if (!companyId) return;

      const { data, error } = await supabase
        .from('company_gov_connections')
        .select('*')
        .eq('company_id', companyId);
      
      if (error) throw error;
      
      // Transform the data to ensure correct types
      const transformedData = (data || []).map(connection => ({
        ...connection,
        connection_status: connection.connection_status as 'connected' | 'disconnected' | 'error' | 'demo' | 'testing',
        sync_frequency: connection.sync_frequency as 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual',
        configuration: typeof connection.configuration === 'object' 
          ? connection.configuration 
          : JSON.parse(String(connection.configuration || '{}'))
      }));
      
      setConnections(transformedData);
    } catch (error) {
      console.error('Error fetching government connections:', error);
      toast.error('Failed to fetch government connections');
    }
  };

  // Fetch portal status using the database function
  const fetchPortalStatus = async () => {
    try {
      const companyId = await getCurrentCompanyId();
      if (!companyId) return;

      const { data, error } = await supabase.rpc('get_government_portals_status', {
        p_company_id: companyId
      });
      
      if (error) throw error;
      setPortalStatus(data || []);
    } catch (error) {
      console.error('Error fetching portal status:', error);
      toast.error('Failed to fetch portal status');
    }
  };

  // Initialize company government portals
  const initializePortals = async () => {
    try {
      const companyId = await getCurrentCompanyId();
      if (!companyId) return;

      const { data, error } = await supabase.rpc('initialize_company_gov_portals', {
        p_company_id: companyId
      });
      
      if (error) throw error;
      
      toast.success(`Initialized ${data} government portal connections`);
      await fetchConnections();
      await fetchPortalStatus();
    } catch (error) {
      console.error('Error initializing portals:', error);
      toast.error('Failed to initialize government portals');
    }
  };

  // Connect to a government portal
  const connectPortal = async (portalCode: string, configuration: Record<string, any> = {}) => {
    try {
      const companyId = await getCurrentCompanyId();
      if (!companyId) return;

      // Update connection status
      const { error } = await supabase
        .from('company_gov_connections')
        .upsert({
          company_id: companyId,
          portal_code: portalCode,
          connection_status: 'connected',
          credentials_configured: true,
          configuration,
          last_sync_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success(`Connected to ${portalCode.toUpperCase()} successfully`);
      await fetchConnections();
      await fetchPortalStatus();
    } catch (error) {
      console.error('Error connecting portal:', error);
      toast.error(`Failed to connect to ${portalCode.toUpperCase()}`);
    }
  };

  // Disconnect from a government portal
  const disconnectPortal = async (portalCode: string) => {
    try {
      const companyId = await getCurrentCompanyId();
      if (!companyId) return;

      const { error } = await supabase
        .from('company_gov_connections')
        .update({
          connection_status: 'disconnected',
          credentials_configured: false,
          last_error: null
        })
        .eq('company_id', companyId)
        .eq('portal_code', portalCode);

      if (error) throw error;

      toast.success(`Disconnected from ${portalCode.toUpperCase()}`);
      await fetchConnections();
      await fetchPortalStatus();
    } catch (error) {
      console.error('Error disconnecting portal:', error);
      toast.error(`Failed to disconnect from ${portalCode.toUpperCase()}`);
    }
  };

  // Test portal connection
  const testPortalConnection = async (portalCode: string) => {
    try {
      const companyId = await getCurrentCompanyId();
      if (!companyId) return;

      const { data, error } = await supabase.functions.invoke('government-integration-master', {
        body: {
          portal_code: portalCode,
          operation: 'health_check',
          company_id: companyId,
          payload: { test: true }
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`${portalCode.toUpperCase()} connection test successful`);
        // Update connection status
        await supabase
          .from('company_gov_connections')
          .update({
            connection_status: 'connected',
            last_sync_at: new Date().toISOString(),
            last_error: null
          })
          .eq('company_id', companyId)
          .eq('portal_code', portalCode);
      } else {
        throw new Error(data.error || 'Connection test failed');
      }

      await fetchConnections();
      await fetchPortalStatus();
    } catch (error) {
      console.error('Error testing portal connection:', error);
      toast.error(`${portalCode.toUpperCase()} connection test failed`);
      
      // Update error status
      const companyId = await getCurrentCompanyId();
      if (companyId) {
        await supabase
          .from('company_gov_connections')
          .update({
            connection_status: 'error',
            last_error: error.message
          })
          .eq('company_id', companyId)
          .eq('portal_code', portalCode);
      }
    }
  };

  // Execute portal operation
  const executePortalOperation = async (
    portalCode: string, 
    operation: string, 
    payload: Record<string, any> = {}
  ) => {
    try {
      const companyId = await getCurrentCompanyId();
      if (!companyId) throw new Error('Company ID not found');

      const { data, error } = await supabase.functions.invoke('government-integration-master', {
        body: {
          portal_code: portalCode,
          operation,
          company_id: companyId,
          payload
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`${portalCode.toUpperCase()} ${operation} completed successfully`);
        return data.result;
      } else {
        throw new Error(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error executing portal operation:', error);
      toast.error(`Failed to execute ${portalCode.toUpperCase()} ${operation}`);
      throw error;
    }
  };

  // Get portal statistics
  const getPortalStatistics = () => {
    const totalPortals = portals.length;
    const connectedPortals = portalStatus.filter(p => p.connection_status === 'connected').length;
    const disconnectedPortals = portalStatus.filter(p => p.connection_status === 'disconnected').length;
    const errorPortals = portalStatus.filter(p => p.connection_status === 'error').length;
    const demoPortals = portalStatus.filter(p => p.connection_status === 'demo').length;

    const categoryStats = portals.reduce((acc, portal) => {
      acc[portal.portal_category] = (acc[portal.portal_category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPortals,
      connectedPortals,
      disconnectedPortals,
      errorPortals,
      demoPortals,
      connectionRate: totalPortals > 0 ? (connectedPortals / totalPortals) * 100 : 0,
      categoryStats
    };
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        fetchPortals(),
        fetchConnections(),
        fetchPortalStatus()
      ]);
      setLoading(false);
    };

    initializeData();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    const connectionsSubscription = supabase
      .channel('company_gov_connections')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'company_gov_connections' },
        () => {
          fetchConnections();
          fetchPortalStatus();
        }
      )
      .subscribe();

    return () => {
      connectionsSubscription.unsubscribe();
    };
  }, []);

  return {
    portals,
    connections,
    portalStatus,
    loading,
    statistics: getPortalStatistics(),
    initializePortals,
    connectPortal,
    disconnectPortal,
    testPortalConnection,
    executePortalOperation,
    refetch: () => Promise.all([fetchPortals(), fetchConnections(), fetchPortalStatus()])
  };
};