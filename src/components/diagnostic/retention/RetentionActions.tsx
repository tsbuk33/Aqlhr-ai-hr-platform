import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, Clock, CheckCircle, AlertCircle, Square } from "lucide-react";
import { getLang } from '@/lib/i18n/getLang';
import { RetentionAction } from '@/hooks/useRetention';
import { useAIStream } from '@/lib/ai/useAIStream';
import { useToast } from '@/hooks/use-toast';

const PHASES = ['planning', 'generating', 'saving', 'ready'] as const;

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
  const { start, cancel, isStreaming, partial, phase, pct, error, meta } = useAIStream();

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

    start({
      tenantId,
      userId: 'auto', 
      lang: lang as 'en' | 'ar',
      moduleContext: 'retention.plan',
      pageType: 'retention_actions',
      intent: 'retention action plan'
    }, `https://qcuhjcyjlkfizesndmth.functions.supabase.co/agent-retention-plan-v1`);
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
            {isStreaming ? (
              <Button 
                onClick={cancel} 
                variant="destructive"
                size="sm"
              >
                <Square className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {lang === 'ar' ? 'إيقاف' : 'Stop'}
              </Button>
            ) : (
              <Button 
                onClick={handleGeneratePlaybook} 
                disabled={!tenantId}
                size="sm"
              >
                <PlayCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('retention.actions.generate')}
              </Button>
            )}
          </CardTitle>
          <CardDescription>{t('retention.actions.description')}</CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Section */}
      {(isStreaming || phase) && (
        <Card>
          <CardContent className="pt-6">
            {/* Phase Steps */}
            <div className="flex items-center gap-3 mb-4">
              {PHASES.map((p, index) => (
                <div key={p} className={`flex items-center gap-2 ${phase === p ? 'text-primary' : phase && PHASES.indexOf(phase) > index ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    phase === p ? 'bg-primary text-primary-foreground' :
                    phase && PHASES.indexOf(phase) > index ? 'bg-green-600 text-white' : 'bg-muted'
                  }`}>
                    {phase && PHASES.indexOf(phase) > index ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className="text-sm font-medium">
                    {lang === 'ar' 
                      ? p === 'planning' ? 'التخطيط'
                      : p === 'generating' ? 'جاري التوليد'  
                      : p === 'saving' ? 'جاري الحفظ'
                      : 'جاهز'
                      : p === 'planning' ? 'Planning'
                      : p === 'generating' ? 'Generating'
                      : p === 'saving' ? 'Saving'
                      : 'Ready'
                    }
                  </span>
                  {index < PHASES.length - 1 && <div className="w-8 h-px bg-border" />}
                </div>
              ))}
              <div className="ml-auto text-sm text-muted-foreground">
                {meta?.provider && (
                  <Badge variant="outline" className="ml-2">
                    {lang === 'ar' ? 'مباشر' : 'Live'} · {meta.provider}
                  </Badge>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <Progress value={pct} className="mb-4" />

            {/* Live Transcript */}
            {partial && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">
                  {lang === 'ar' ? 'جاري البث المباشر...' : 'Streaming live...'}
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed max-h-32 overflow-y-auto">
                  {partial}
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="text-sm font-medium text-destructive">
                  {lang === 'ar' ? 'خطأ' : 'Error'}
                </div>
                <div className="text-sm text-destructive/80">{error}</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2" 
                  onClick={handleGeneratePlaybook}
                >
                  {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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