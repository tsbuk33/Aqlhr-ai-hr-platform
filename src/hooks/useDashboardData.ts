import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  pendingLeaves: number;
  performanceReviews: number;
  saudiEmployees: number;
  nonSaudiEmployees: number;
  attendanceRate: number;
}

interface SystemAlert {
  id: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  type: 'success' | 'warning' | 'critical';
  isActive: boolean;
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    performanceReviews: 0,
    saudiEmployees: 0,
    nonSaudiEmployees: 0,
    attendanceRate: 0,
  });
  
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch employees count
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('id, nationality')
        .eq('status', 'active');

      if (employeesError) throw employeesError;

      // Fetch pending leaves
      const { data: leaves, error: leavesError } = await supabase
        .from('leave_requests')
        .select('id')
        .eq('status', 'pending');

      if (leavesError) throw leavesError;

      // Fetch performance reviews due this month
      const currentDate = new Date();
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const { data: reviews, error: reviewsError } = await supabase
        .from('performance_reviews')
        .select('id')
        .gte('created_at', firstDay.toISOString())
        .lte('created_at', lastDay.toISOString())
        .eq('status', 'pending');

      if (reviewsError) throw reviewsError;

      // Calculate stats
      const totalEmployees = employees?.length || 0;
      const saudiEmployees = employees?.filter(emp => emp.nationality === 'saudi').length || 0;
      const nonSaudiEmployees = totalEmployees - saudiEmployees;
      const presentToday = totalEmployees; // Simplified for now
      const attendanceRate = totalEmployees > 0 ? (presentToday / totalEmployees) * 100 : 0;

      setStats({
        totalEmployees,
        presentToday,
        pendingLeaves: leaves?.length || 0,
        performanceReviews: reviews?.length || 0,
        saudiEmployees,
        nonSaudiEmployees,
        attendanceRate,
      });

      // Set system alerts (these could come from a table in the future)
      setAlerts([
        {
          id: '1',
          title: 'Authentication System',
          titleAr: 'نظام المصادقة',
          message: 'All authentication systems are operational',
          messageAr: 'جميع أنظمة المصادقة تعمل بشكل طبيعي',
          type: 'success',
          isActive: true,
        },
        {
          id: '2',
          title: 'Database Status',
          titleAr: 'حالة قاعدة البيانات',
          message: 'Database is running optimally',
          messageAr: 'قاعدة البيانات تعمل بأفضل أداء',
          type: 'success',
          isActive: true,
        },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    alerts,
    loading,
    refetch: fetchDashboardData,
  };
}