import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthOptional } from '@/hooks/useAuthOptional';
import { toast } from 'sonner';

interface TeamPerformanceMetric {
  id: string;
  company_id: string;
  manager_id?: string;
  team_id?: string;
  metric_date: string;
  total_team_members: number;
  active_members: number;
  average_performance_score: number;
  average_engagement_score: number;
  average_productivity_score: number;
  goals_achieved: number;
  goals_total: number;
  attendance_rate: number;
  on_time_rate: number;
  overtime_hours: number;
  tasks_completed: number;
  tasks_assigned: number;
}

interface AttendanceAnalytic {
  id: string;
  company_id: string;
  employee_id: string;
  analysis_date: string;
  attendance_score: number;
  punctuality_score: number;
  productivity_correlation: number;
  overtime_trend?: string;
  leave_pattern?: string;
  risk_indicators?: any;
  anomaly_flags?: any;
  recommendations?: any;
}

interface ProductivityMetric {
  id: string;
  company_id: string;
  team_member_id: string;
  metric_date: string;
  tasks_completed: number;
  tasks_assigned: number;
  quality_score: number;
  efficiency_score: number;
  collaboration_score: number;
  innovation_score: number;
  time_utilization: number;
  project_contributions: number;
}

interface WorkloadDistribution {
  id: string;
  company_id: string;
  manager_id: string;
  team_member_id: string;
  period_start: string;
  period_end: string;
  total_tasks: number;
  high_priority_tasks: number;
  medium_priority_tasks: number;
  low_priority_tasks: number;
  estimated_hours: number;
  actual_hours: number;
  workload_percentage: number;
  stress_level: number;
}

interface TeamEngagementMetric {
  id: string;
  company_id: string;
  team_member_id: string;
  metric_date: string;
  engagement_score: number;
  satisfaction_score: number;
  motivation_level: number;
  feedback_sentiment: number;
  participation_rate: number;
  communication_frequency: number;
  team_collaboration_score: number;
}

interface ActionItem {
  id: string;
  company_id: string;
  manager_id: string;
  team_member_id?: string;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  category: 'performance' | 'attendance' | 'engagement' | 'training' | 'goal' | 'recognition';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  assigned_to?: string;
  is_ai_generated: boolean;
  confidence_score: number;
}

export interface TeamAnalyticsData {
  performanceMetrics: TeamPerformanceMetric[];
  attendanceAnalytics: AttendanceAnalytic[];
  productivityMetrics: ProductivityMetric[];
  workloadDistribution: WorkloadDistribution[];
  engagementMetrics: TeamEngagementMetric[];
  actionItems: ActionItem[];
  loading: boolean;
  error: string | null;
}

export const useTeamAnalyticsData = () => {
  const { user } = useAuthOptional();
  const [data, setData] = useState<TeamAnalyticsData>({
    performanceMetrics: [],
    attendanceAnalytics: [],
    productivityMetrics: [],
    workloadDistribution: [],
    engagementMetrics: [],
    actionItems: [],
    loading: true,
    error: null,
  });

  const fetchAnalyticsData = async () => {
    if (!user) return;

    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch team performance metrics
      const { data: performanceMetrics, error: performanceError } = await supabase
        .from('team_performance_metrics')
        .select('*')
        .order('metric_date', { ascending: false })
        .limit(30);

      if (performanceError) throw performanceError;

      // Fetch attendance analytics - use existing table
      const { data: attendanceRaw, error: attendanceError } = await supabase
        .from('attendance_analytics')
        .select('*')
        .order('analysis_date', { ascending: false })
        .limit(100);

      if (attendanceError) throw attendanceError;

      // Fetch action items with proper type casting
      const { data: actionItemsRaw, error: actionError } = await supabase
        .from('action_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (actionError) throw actionError;

      setData({
        performanceMetrics: performanceMetrics || [],
        attendanceAnalytics: (attendanceRaw || []) as AttendanceAnalytic[],
        productivityMetrics: [],
        workloadDistribution: [],
        engagementMetrics: [],
        actionItems: (actionItemsRaw || []) as ActionItem[],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics data',
      }));
      toast.error('Failed to load analytics data');
    }
  };

  const createActionItem = async (actionItem: Omit<ActionItem, 'id' | 'company_id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('action_items')
        .insert({
          ...actionItem,
          company_id: '00000000-0000-0000-0000-000000000000', // Will be updated with real company_id
        });

      if (error) throw error;
      await fetchAnalyticsData();
      toast.success('Action item created successfully');
    } catch (error) {
      console.error('Error creating action item:', error);
      toast.error('Failed to create action item');
    }
  };

  const updateActionItemStatus = async (actionItemId: string, status: ActionItem['status']) => {
    try {
      const { error } = await supabase
        .from('action_items')
        .update({ status })
        .eq('id', actionItemId);

      if (error) throw error;
      await fetchAnalyticsData();
      toast.success('Action item updated successfully');
    } catch (error) {
      console.error('Error updating action item:', error);
      toast.error('Failed to update action item');
    }
  };

  const seedDemoAnalyticsData = async () => {
    try {
      const companyId = '00000000-0000-0000-0000-000000000000';
      const managerId = '00000000-0000-0000-0000-000000000001';
      const teamMemberId = '00000000-0000-0000-0000-000000000002';

      // Create demo performance metrics for the last 30 days
      const performanceMetrics = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          company_id: companyId,
          manager_id: managerId,
          metric_date: date.toISOString().split('T')[0],
          total_team_members: 12,
          active_members: Math.floor(10 + Math.random() * 2),
          average_performance_score: Math.floor(80 + Math.random() * 15),
          average_engagement_score: Math.floor(75 + Math.random() * 20),
          average_productivity_score: Math.floor(85 + Math.random() * 10),
          goals_achieved: Math.floor(8 + Math.random() * 4),
          goals_total: 12,
          attendance_rate: Math.floor(88 + Math.random() * 10),
          on_time_rate: Math.floor(92 + Math.random() * 6),
          overtime_hours: Math.floor(Math.random() * 20),
          tasks_completed: Math.floor(25 + Math.random() * 15),
          tasks_assigned: Math.floor(30 + Math.random() * 10),
        };
      });

      const { error: performanceError } = await supabase
        .from('team_performance_metrics')
        .upsert(performanceMetrics, { onConflict: 'company_id,manager_id,metric_date' });

      if (performanceError) throw performanceError;

      // Create demo action items
      const actionItems = [
        {
          company_id: companyId,
          manager_id: managerId,
          team_member_id: teamMemberId,
          title: 'Improve Time Management Skills',
          title_ar: 'تحسين مهارات إدارة الوقت',
          description: 'Recommend time management training for better productivity',
          description_ar: 'توصية بتدريب إدارة الوقت لتحسين الإنتاجية',
          category: 'training' as const,
          priority: 'medium' as const,
          status: 'pending' as const,
          is_ai_generated: true,
          confidence_score: 85,
        },
        {
          company_id: companyId,
          manager_id: managerId,
          title: 'Team Building Activity',
          title_ar: 'نشاط بناء الفريق',
          description: 'Organize team building event to improve collaboration',
          description_ar: 'تنظيم فعالية بناء الفريق لتحسين التعاون',
          category: 'engagement' as const,
          priority: 'high' as const,
          status: 'in_progress' as const,
          is_ai_generated: true,
          confidence_score: 92,
        },
        {
          company_id: companyId,
          manager_id: managerId,
          team_member_id: teamMemberId,
          title: 'Performance Recognition',
          title_ar: 'تقدير الأداء',
          description: 'Recognize outstanding performance in monthly meeting',
          description_ar: 'تقدير الأداء المتميز في الاجتماع الشهري',
          category: 'recognition' as const,
          priority: 'low' as const,
          status: 'completed' as const,
          is_ai_generated: false,
          confidence_score: 95,
        },
      ];

      const { error: actionError } = await supabase
        .from('action_items')
        .upsert(actionItems, { onConflict: 'company_id,manager_id,title' });

      if (actionError) throw actionError;

      await fetchAnalyticsData();
      toast.success('Demo analytics data created successfully');
    } catch (error) {
      console.error('Error seeding demo analytics data:', error);
      toast.error('Failed to create demo analytics data');
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [user]);

  return {
    ...data,
    refetch: fetchAnalyticsData,
    createActionItem,
    updateActionItemStatus,
    seedDemoAnalyticsData,
  };
};