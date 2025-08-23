import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { getLang } from '@/lib/i18n/getLang';
import { RetentionAction } from '@/hooks/useRetention';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Props {
  actions: RetentionAction[];
  loading: boolean;
  tenantId: string | null;
  refetch: () => void;
}

export const RetentionActions: React.FC<Props> = ({
  actions,
  loading,
  tenantId,
  refetch
}) => {
  const lang = getLang();
  const isRTL = lang === 'ar';
  const { toast } = useToast();
  const [generating, setGenerating] = React.useState(false);

  const t = (key: string) => {
    const translations: Record<string, any> = {
      retention: {
        actions: {
          title: lang === 'ar' ? "خطة الإجراءات" : "Action Plans",
          description: lang === 'ar' 
            ? "مبادرات للحد من مخاطر ترك الموظفين" 
            : "Initiatives to reduce employee turnover risk",
          generate: lang === 'ar' ? "توليد خطة الإجراءات" : "Generate Action Plan"
        },
        grid: {
          title: lang === 'ar' ? "العنوان" : "Title",
          priority: lang === 'ar' ? "الأولوية" : "Priority",
          status: lang === 'ar' ? "الحالة" : "Status",
          owner: lang === 'ar' ? "المسؤول" : "Owner",
          created: lang === 'ar' ? "تاريخ الإنشاء" : "Created"
        },
        ui: {
          noActions: lang === 'ar' ? "لا توجد إجراءات حتى الآن" : "No action plans generated yet",
          loading: lang === 'ar' ? "جاري التحميل..." : "Loading...",
          generating: lang === 'ar' ? "جاري توليد خطة الإجراءات..." : "Generating action plan...",
          generateFirst: lang === 'ar' ? "انقر لتوليد خطة إجراءات مخصصة" : "Click to generate a customized action plan"
        },
        priority: {
          high: lang === 'ar' ? "عالية" : "High",
          med: lang === 'ar' ? "متوسطة" : "Medium", 
          low: lang === 'ar' ? "منخفضة" : "Low"
        },
        status: {
          open: lang === 'ar' ? "مفتوح" : "Open",
          in_progress: lang === 'ar' ? "قيد التنفيذ" : "In Progress",
          completed: lang === 'ar' ? "مكتمل" : "Completed",
          cancelled: lang === 'ar' ? "ملغي" : "Cancelled"
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

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'med': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleGeneratePlaybook = async () => {
    if (!tenantId) return;

    setGenerating(true);
    try {
      // Call the edge function to generate retention playbook
      const { data, error } = await supabase.functions.invoke('agent-retention-plan-v1', {
        body: { tenantId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: lang === 'ar' 
          ? "تم توليد خطة الإجراءات بنجاح" 
          : "Action plan generated successfully"
      });

      // Refresh actions list
      await refetch();
    } catch (error: any) {
      console.error('Error generating playbook:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className={`ml-2 ${isRTL ? 'mr-2 ml-0' : ''}`}>{t('retention.ui.loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Generate Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('retention.actions.title')}</span>
            <Button 
              onClick={handleGeneratePlaybook} 
              disabled={generating || !tenantId}
              size="sm"
            >
              <PlayCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {generating ? t('retention.ui.generating') : t('retention.actions.generate')}
            </Button>
          </CardTitle>
          <CardDescription>{t('retention.actions.description')}</CardDescription>
        </CardHeader>
      </Card>

      {/* Actions List */}
      <Card>
        <CardContent className="pt-6">
          {actions.length === 0 ? (
            <div className="text-center py-8">
              <PlayCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">{t('retention.ui.noActions')}</h3>
              <p className="text-muted-foreground mb-4">{t('retention.ui.generateFirst')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {actions.map((action) => (
                <Card key={action.id} className="border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(action.status)}
                          <h4 className="font-medium">{action.title}</h4>
                          <Badge variant={getPriorityVariant(action.priority)}>
                            {t(`retention.priority.${action.priority}`)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {action.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{t('retention.grid.status')}: {t(`retention.status.${action.status}`)}</span>
                          <span>{t('retention.grid.created')}: {new Date(action.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};