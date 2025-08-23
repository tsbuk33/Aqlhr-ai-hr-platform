import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, MessageSquare } from "lucide-react";
import { getLang } from '@/lib/i18n/getLang';
import { useAuthOptional } from '@/lib/auth/useAuthOptional';
import { RetentionWatchlistItem } from '@/hooks/useRetention';

interface Props {
  watchlist: RetentionWatchlistItem[];
  loading: boolean;
  tenantId: string | null;
}

export const RetentionWatchlist: React.FC<Props> = ({
  watchlist,
  loading,
  tenantId
}) => {
  const lang = getLang();
  const isRTL = lang === 'ar';
  const { user, hasRole, hasAnyRole } = useAuthOptional();
  
  const isAdmin = hasAnyRole(['admin', 'hr_manager', 'super_admin']);

  const t = (key: string) => {
    const translations: Record<string, any> = {
      retention: {
        watchlist: {
          title: lang === 'ar' ? "قائمة المراقبة" : "High-Risk Watchlist",
          description: lang === 'ar' 
            ? "الموظفون ذوو المخاطر العالية الذين يحتاجون لاهتمام فوري" 
            : "High-risk employees requiring immediate attention",
          adminOnly: lang === 'ar' ? "للإداريين فقط" : "Admin Access Only",
          bulkActions: lang === 'ar' ? "إجراءات جماعية" : "Bulk Actions",
          scheduleInterviews: lang === 'ar' ? "جدولة مقابلات البقاء" : "Schedule Stay Interviews",
          managerCoaching: lang === 'ar' ? "إرشاد المديرين" : "Manager Coaching Brief"
        },
        grid: {
          employee: lang === 'ar' ? "الموظف" : "Employee",
          department: lang === 'ar' ? "القسم" : "Department", 
          manager: lang === 'ar' ? "المدير" : "Manager",
          riskScore: lang === 'ar' ? "درجة الخطر" : "Risk Score",
          topFactors: lang === 'ar' ? "أهم عوامل الخطر" : "Top Risk Factors"
        },
        ui: {
          noData: lang === 'ar' ? "لا توجد موظفين عالي المخاطر" : "No high-risk employees found",
          loading: lang === 'ar' ? "جاري التحميل..." : "Loading...",
          accessDenied: lang === 'ar' 
            ? "تتطلب هذه الصفحة صلاحيات الإدارة لعرض تفاصيل الموظفين"
            : "This view requires admin access to display employee details",
          pdplNotice: lang === 'ar' 
            ? "عرض محمي بنظام حماية البيانات الشخصية - أسماء الموظفين مخفية لغير الإداريين"
            : "PDPL-protected view - Employee names hidden for non-admin roles"
        }
      }
    };

    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const getFactorName = (factorKey: string) => {
    const factorTranslations: Record<string, string> = {
      low_tenure: lang === 'ar' ? "فترة خدمة قصيرة" : "Low Tenure",
      below_median_salary: lang === 'ar' ? "راتب أقل من المتوسط" : "Below Median Salary", 
      no_manager: lang === 'ar' ? "بدون مدير مباشر" : "No Manager",
      high_workload: lang === 'ar' ? "عبء عمل مرتفع" : "High Workload",
      low_engagement: lang === 'ar' ? "مشاركة منخفضة" : "Low Engagement",
      career_stagnation: lang === 'ar' ? "ركود وظيفي" : "Career Stagnation"
    };
    
    return factorTranslations[factorKey] || factorKey.replace(/_/g, ' ');
  };

  const formatTopFactors = (factors: any) => {
    if (!factors || !Array.isArray(factors)) return [];
    return factors.slice(0, 3).map(factor => ({
      name: getFactorName(factor.name),
      impact: factor.impact
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className={`ml-2 ${isRTL ? 'mr-2 ml-0' : ''}`}>{t('retention.ui.loading')}</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="border-muted">
        <CardContent className="p-8 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">{t('retention.watchlist.adminOnly')}</h3>
          <p className="text-muted-foreground">{t('retention.ui.accessDenied')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('retention.watchlist.bulkActions')}
          </CardTitle>
          <CardDescription>
            Quick actions for multiple high-risk employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <MessageSquare className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('retention.watchlist.scheduleInterviews')}
            </Button>
            <Button variant="outline" size="sm">
              <Users className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('retention.watchlist.managerCoaching')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Watchlist Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('retention.watchlist.title')}</CardTitle>
          <CardDescription>
            {t('retention.watchlist.description')} ({watchlist.length} employees)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {watchlist.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('retention.ui.noData')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className={`text-${isRTL ? 'right' : 'left'} py-3 font-medium`}>
                      {t('retention.grid.employee')}
                    </th>
                    <th className={`text-${isRTL ? 'right' : 'left'} py-3 font-medium`}>
                      {t('retention.grid.department')}
                    </th>
                    <th className={`text-${isRTL ? 'right' : 'left'} py-3 font-medium`}>
                      {t('retention.grid.manager')}
                    </th>
                    <th className="text-center py-3 font-medium">{t('retention.grid.riskScore')}</th>
                    <th className={`text-${isRTL ? 'right' : 'left'} py-3 font-medium`}>
                      {t('retention.grid.topFactors')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {watchlist.map((item, index) => {
                    const topFactors = formatTopFactors(item.top_factors);
                    
                    return (
                      <tr key={item.employee_id || index} className="border-b">
                        <td className={`py-3 text-${isRTL ? 'right' : 'left'}`}>
                          <div className="font-medium">
                            {lang === 'ar' ? item.employee_name_ar : item.employee_name_en}
                          </div>
                        </td>
                        <td className={`py-3 text-${isRTL ? 'right' : 'left'}`}>
                          {lang === 'ar' ? item.dept_name_ar : item.dept_name_en}
                        </td>
                        <td className={`py-3 text-${isRTL ? 'right' : 'left'}`}>
                          <span className="text-muted-foreground">
                            {item.manager_name}
                          </span>
                        </td>
                        <td className="text-center py-3">
                          <Badge variant="destructive">
                            {item.risk_score.toFixed(1)}
                          </Badge>
                        </td>
                        <td className={`py-3 text-${isRTL ? 'right' : 'left'}`}>
                          <div className="flex flex-wrap gap-1">
                            {topFactors.map((factor, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {factor.name}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PDPL Notice */}
      <Card className="border-muted">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            {t('retention.ui.pdplNotice')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};