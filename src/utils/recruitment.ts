// Simple recruitment utilities without external API dependencies
export const calculateSaudizationRate = (employees: any[]) => {
  if (!employees || employees.length === 0) return 0;
  const saudiCount = employees.filter(emp => emp.nationality === 'saudi').length;
  return Math.round((saudiCount / employees.length) * 100);
};

export const getRecruitmentMetrics = (data: any) => {
  return {
    totalPositions: data?.positions?.length || 0,
    filledPositions: data?.positions?.filter((p: any) => p.status === 'filled').length || 0,
    pendingApplications: data?.applications?.filter((a: any) => a.status === 'pending').length || 0,
    interviewsScheduled: data?.interviews?.length || 0
  };
};

export const formatApplicationStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'معلق',
    'under_review': 'قيد المراجعة',
    'interviewed': 'تم إجراء المقابلة',
    'offered': 'تم تقديم العرض',
    'hired': 'تم التوظيف',
    'rejected': 'مرفوض'
  };
  return statusMap[status] || status;
};