import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthOptional } from '@/hooks/useAuthOptional';
import { toast } from 'sonner';

interface ManagerProfile {
  id: string;
  user_id: string;
  company_id: string;
  employee_id: string;
  name: string;
  name_ar?: string;
  department: string;
  department_ar?: string;
  direct_reports: number;
  team_performance_score: number;
  pending_approvals: number;
  team_goals_total: number;
  team_goals_achieved: number;
  emergency_contact_phone?: string;
}

interface TeamMember {
  id: string;
  manager_id: string;
  employee_id: string;
  name: string;
  name_ar?: string;
  position?: string;
  position_ar?: string;
  status: 'present' | 'absent' | 'late' | 'on_leave' | 'remote';
  check_in_time?: string;
  check_out_time?: string;
  location?: string;
  performance_score: number;
  engagement_score: number;
  productivity_score: number;
}

interface ManagerAlert {
  id: string;
  manager_id: string;
  type: 'attendance' | 'leave' | 'performance' | 'urgent' | 'approval' | 'goal';
  title: string;
  title_ar?: string;
  message: string;
  message_ar?: string;
  priority: 'high' | 'medium' | 'low';
  is_read: boolean;
  related_employee_id?: string;
  action_url?: string;
  created_at: string;
}

interface TeamApproval {
  id: string;
  manager_id: string;
  employee_id: string;
  approval_type: 'leave' | 'overtime' | 'expense' | 'training' | 'performance' | 'goal';
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  requested_date?: string;
  amount?: number;
  currency: string;
  created_at: string;
}

export interface ManagerData {
  profile: ManagerProfile | null;
  teamMembers: TeamMember[];
  alerts: ManagerAlert[];
  approvals: TeamApproval[];
  loading: boolean;
  error: string | null;
}

export const useManagerData = () => {
  const { user } = useAuthOptional();
  const [data, setData] = useState<ManagerData>({
    profile: null,
    teamMembers: [],
    alerts: [],
    approvals: [],
    loading: true,
    error: null,
  });

  const fetchManagerData = async () => {
    if (!user) return;

    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch or create manager profile
      let { data: managerProfile, error: profileError } = await supabase
        .from('manager_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      // Create profile if it doesn't exist
      if (!managerProfile) {
        const { data: newProfile, error: createError } = await supabase
          .from('manager_profiles')
          .insert({
            user_id: user.id,
            company_id: '00000000-0000-0000-0000-000000000000', // Will be updated with real company_id
            employee_id: 'MGR-' + Date.now(),
            name: user.email?.split('@')[0] || 'Manager',
            name_ar: 'المدير',
            department: 'Management',
            department_ar: 'الإدارة',
          })
          .select()
          .single();

        if (createError) throw createError;
        managerProfile = newProfile;
      }

      // Fetch team members with proper type casting
      const { data: teamMembersRaw, error: teamError } = await supabase
        .from('team_members')
        .select('*')
        .eq('manager_id', managerProfile.id);

      if (teamError) throw teamError;

      // Fetch alerts with proper type casting
      const { data: alertsRaw, error: alertsError } = await supabase
        .from('manager_alerts')
        .select('*')
        .eq('manager_id', managerProfile.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (alertsError) throw alertsError;

      // Fetch approvals with proper type casting
      const { data: approvalsRaw, error: approvalsError } = await supabase
        .from('team_approvals')
        .select('*')
        .eq('manager_id', managerProfile.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (approvalsError) throw approvalsError;

      setData({
        profile: managerProfile,
        teamMembers: (teamMembersRaw || []) as TeamMember[],
        alerts: (alertsRaw || []) as ManagerAlert[],
        approvals: (approvalsRaw || []) as TeamApproval[],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching manager data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch manager data',
      }));
      toast.error('Failed to load manager data');
    }
  };

  const createAlert = async (alert: Omit<ManagerAlert, 'id' | 'manager_id' | 'created_at' | 'is_read'>) => {
    if (!data.profile) return;

    try {
      const { error } = await supabase
        .from('manager_alerts')
        .insert({
          ...alert,
          manager_id: data.profile.id,
        });

      if (error) throw error;
      await fetchManagerData();
      toast.success('Alert created successfully');
    } catch (error) {
      console.error('Error creating alert:', error);
      toast.error('Failed to create alert');
    }
  };

  const markAlertAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('manager_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) throw error;
      await fetchManagerData();
    } catch (error) {
      console.error('Error marking alert as read:', error);
      toast.error('Failed to update alert');
    }
  };

  const approveRequest = async (approvalId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('team_approvals')
        .update({
          status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', approvalId);

      if (error) throw error;
      await fetchManagerData();
      toast.success('Request approved successfully');
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  };

  const rejectRequest = async (approvalId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('team_approvals')
        .update({
          status: 'rejected',
          rejection_reason: reason,
        })
        .eq('id', approvalId);

      if (error) throw error;
      await fetchManagerData();
      toast.success('Request rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const seedDemoData = async () => {
    if (!data.profile) return;

    try {
      // Create demo team members
      const demoTeamMembers = [
        {
          manager_id: data.profile.id,
          employee_id: '00000000-0000-0000-0000-000000000001',
          name: 'Ahmed Al-Rashid',
          name_ar: 'أحمد الراشد',
          position: 'Senior Developer',
          position_ar: 'مطور أول',
          status: 'present' as const,
          check_in_time: '08:30',
          location: 'Riyadh Office',
          performance_score: 87,
          engagement_score: 9.2,
          productivity_score: 85,
        },
        {
          manager_id: data.profile.id,
          employee_id: '00000000-0000-0000-0000-000000000002',
          name: 'Fatima Al-Zahra',
          name_ar: 'فاطمة الزهراء',
          position: 'UI/UX Designer',
          position_ar: 'مصممة واجهات',
          status: 'late' as const,
          check_in_time: '09:15',
          location: 'Remote',
          performance_score: 92,
          engagement_score: 8.8,
          productivity_score: 89,
        },
      ];

      const { error: teamError } = await supabase
        .from('team_members')
        .upsert(demoTeamMembers, { onConflict: 'manager_id,employee_id' });

      if (teamError) throw teamError;

      // Create demo alerts
      const demoAlerts = [
        {
          manager_id: data.profile.id,
          type: 'attendance' as const,
          title: 'Late Arrival Alert',
          title_ar: 'تنبيه تأخير',
          message: 'Fatima Al-Zahra checked in late (9:15 AM)',
          message_ar: 'فاطمة الزهراء تأخرت في الحضور (9:15 ص)',
          priority: 'medium' as const,
        },
        {
          manager_id: data.profile.id,
          type: 'performance' as const,
          title: 'Outstanding Performance',
          title_ar: 'أداء متميز',
          message: 'Ahmed Al-Rashid exceeded monthly targets',
          message_ar: 'أحمد الراشد تجاوز الأهداف الشهرية',
          priority: 'low' as const,
        },
      ];

      const { error: alertsError } = await supabase
        .from('manager_alerts')
        .upsert(demoAlerts, { onConflict: 'manager_id,type,message' });

      if (alertsError) throw alertsError;

      await fetchManagerData();
      toast.success('Demo data created successfully');
    } catch (error) {
      console.error('Error seeding demo data:', error);
      toast.error('Failed to create demo data');
    }
  };

  useEffect(() => {
    fetchManagerData();
  }, [user]);

  return {
    ...data,
    refetch: fetchManagerData,
    createAlert,
    markAlertAsRead,
    approveRequest,
    rejectRequest,
    seedDemoData,
  };
};