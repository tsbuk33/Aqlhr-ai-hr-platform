import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateRenewalLetterPDF } from '@/utils/letterGenerator';

interface ComplianceData {
  upcomingExpiries: any[];
  autoTasks: any[];
  actionHistory: any[];
}

interface NitaqatStatus {
  color: string;
  current_rate: number;
  target_rate: number;
}

interface UpcomingExpiries {
  urgent: number;
  total: number;
}

export const useComplianceAutopilot = () => {
  const [complianceData, setComplianceData] = useState<ComplianceData>({
    upcomingExpiries: [],
    autoTasks: [],
    actionHistory: []
  });
  const [nitaqatStatus, setNitaqatStatus] = useState<NitaqatStatus | null>(null);
  const [upcomingExpiries, setUpcomingExpiries] = useState<UpcomingExpiries | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchComplianceData = async () => {
    try {
      setLoading(true);

      // Get current user's company
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) return;

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', userData.user.id)
        .single();

      if (rolesError || !userRoles?.company_id) return;

      // Fetch upcoming Iqama expiries (next 90 days)
      const ninetyDaysFromNow = new Date();
      ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
      
      const { data: expiries } = await supabase
        .from('hr_employees')
        .select('*')
        .eq('company_id', userRoles.company_id)
        .eq('employment_status', 'active')
        .eq('is_saudi', false)
        .not('iqama_expiry', 'is', null)
        .lte('iqama_expiry', ninetyDaysFromNow.toISOString().split('T')[0])
        .gt('iqama_expiry', new Date().toISOString().split('T')[0])
        .order('iqama_expiry', { ascending: true });

      // Calculate urgency and add metadata
      const now = new Date();
      const enrichedExpiries = (expiries || []).map((emp: any) => {
        const expiryDate = new Date(emp.iqama_expiry);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        let priority = 'low';
        if (daysUntilExpiry <= 7) priority = 'urgent';
        else if (daysUntilExpiry <= 30) priority = 'high';
        else if (daysUntilExpiry <= 60) priority = 'medium';

        return {
          ...emp,
          days_until_expiry: daysUntilExpiry,
          priority
        };
      });

      // Fetch auto-generated tasks
      const { data: autoTasks } = await supabase
        .from('tasks')
        .select('id, title, description, priority, status, created_at, metadata')
        .eq('tenant_id', userRoles.company_id)
        .eq('module', 'compliance')
        .contains('metadata', { source: 'compliance_autopilot' })
        .order('created_at', { ascending: false })
        .limit(20);

      // Fetch action history with explicit typing
      const actionHistoryQuery = await supabase
        .from('agent_actions')
        .select('id, action_type, action_description, created_at')
        .eq('company_id', userRoles.company_id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      const actionHistory = actionHistoryQuery.data;

      // Get company Nitaqat status
      const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('id', userRoles.company_id)
        .single();

      // Calculate current Saudization rate
      const { data: employeeCounts } = await supabase
        .from('hr_employees')
        .select('is_saudi, employment_status')
        .eq('company_id', userRoles.company_id)
        .eq('employment_status', 'active');

      let currentRate = 0;
      if (employeeCounts && employeeCounts.length > 0) {
        const saudiCount = employeeCounts.filter((emp: any) => emp.is_saudi).length;
        currentRate = (saudiCount / employeeCounts.length) * 100;
      }

      // Determine Nitaqat color
      let color = 'green';
      const target = company?.saudization_target || 60;
      if (currentRate < target - 10) color = 'red';
      else if (currentRate < target - 5) color = 'yellow';
      else if (currentRate >= 85) color = 'platinum';

      setNitaqatStatus({
        color,
        current_rate: currentRate,
        target_rate: target
      });

      setUpcomingExpiries({
        urgent: enrichedExpiries.filter((emp: any) => emp.priority === 'urgent').length,
        total: enrichedExpiries.length
      });

      setComplianceData({
        upcomingExpiries: enrichedExpiries,
        autoTasks: autoTasks || [],
        actionHistory: actionHistory || []
      });

    } catch (error) {
      console.error('Error fetching compliance data:', error);
      toast({
        title: "Error",
        description: "Failed to load compliance data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runAutopilot = async () => {
    try {
      const response = await fetch('https://qcuhjcyjlkfizesndmth.supabase.co/functions/v1/compliance-autopilot-daily-v1', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdWhqY3lqbGtmaXplc25kbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NDY4NzgsImV4cCI6MjA2MzQyMjg3OH0.Vr1tBpNjv8e6sNtjfISJul12Mg9ROQVrlRTgWB1dPoc',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to run autopilot');
      }
      
      const data = await response.json();
      
      // Refresh data after running autopilot
      await fetchComplianceData();
      
      return data;
    } catch (error) {
      console.error('Error running autopilot:', error);
      throw error;
    }
  };

  const downloadLetter = async (employee: any) => {
    try {
      // Get company data for letter
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('company_id')
        .eq('user_id', userData.user.id)
        .single();

      if (!userRoles?.company_id) return;

      const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('id', userRoles.company_id)
        .single();

      if (!company) return;

      // Generate and download PDF
      await generateRenewalLetterPDF({
        company_name_en: company.name,
        company_name_ar: company.company_name_arabic || company.name,
        employee_name_en: employee.full_name_en,
        employee_name_ar: employee.full_name_ar || employee.full_name_en,
        employee_id: employee.employee_no,
        iqama_expiry: employee.iqama_expiry,
        generated_date: new Date().toISOString().split('T')[0]
      });

      toast({
        title: "Letter Downloaded",
        description: `Iqama renewal letter for ${employee.full_name_en} has been downloaded.`,
      });
    } catch (error) {
      console.error('Error downloading letter:', error);
      toast({
        title: "Error",
        description: "Failed to generate renewal letter",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchComplianceData();
  }, []);

  return {
    complianceData,
    nitaqatStatus,
    upcomingExpiries,
    loading,
    runAutopilot,
    downloadLetter,
    refreshData: fetchComplianceData
  };
};