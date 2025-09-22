import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from "@/hooks/useLanguageCompat";
import { 
  Languages, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Zap,
  FileText,
  Brain,
  Shield,
  TrendingUp
} from 'lucide-react';

interface TranslationAudit {
  id: string;
  audit_type: string;
  audit_status: string;
  total_keys_scanned: number;
  missing_arabic_keys: number;
  ai_patched_keys: number;
  needs_review_count: number;
  hardcoded_strings_found: number;
  audit_results: any;
  created_at: string;
  completed_at: string;
}

interface TranslationPatch {
  id: string;
  translation_key: string;
  patched_text: string;
  language: string;
  confidence_score: number;
  applied_at: string;
  approval_status: string;
}

export const TranslationIntegrityEngine: React.FC = () => {
  const [audits, setAudits] = useState<TranslationAudit[]>([]);
  const [patches, setPatches] = useState<TranslationPatch[]>([]);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [isHealing, setIsHealing] = useState(false);
  const [healthScore, setHealthScore] = useState(0);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  useEffect(() => {
    loadTranslationData();
  }, []);

  const loadTranslationData = async () => {
    try {
      // Load recent audits
      const { data: auditData, error: auditError } = await supabase
        .from('translation_audits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (auditError) throw auditError;
      setAudits(auditData || []);

      // Load recent patches
      const { data: patchData, error: patchError } = await supabase
        .from('translation_patches')
        .select('*')
        .order('applied_at', { ascending: false })
        .limit(20);

      if (patchError) throw patchError;
      setPatches(patchData || []);

      // Calculate health score
      calculateHealthScore(auditData?.[0]);
    } catch (error) {
      console.error('Error loading translation data:', error);
      toast({
        title: isArabic ? 'خطأ في تحميل البيانات' : 'Error Loading Data',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const calculateHealthScore = (latestAudit?: TranslationAudit) => {
    if (!latestAudit) {
      setHealthScore(0);
      return;
    }

    const total = latestAudit.total_keys_scanned || 1;
    const missing = latestAudit.missing_arabic_keys || 0;
    const hardcoded = latestAudit.hardcoded_strings_found || 0;
    
    const completeness = ((total - missing) / total) * 100;
    const quality = Math.max(0, 100 - (hardcoded * 5)); // Penalize hardcoded strings
    
    const score = Math.round((completeness + quality) / 2);
    setHealthScore(Math.min(100, Math.max(0, score)));
  };

  const runTranslationAudit = async () => {
    setIsRunningAudit(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-translation-engine', {
        body: {
          action: 'audit',
          auditFiles: ['src/**/*.tsx', 'src/**/*.ts']
        }
      });

      if (error) throw error;

      toast({
        title: isArabic ? 'تم إكمال التدقيق' : 'Audit Completed',
        description: `${data.results.totalKeys} ${isArabic ? 'مفتاح تم فحصه' : 'keys scanned'}`,
      });

      await loadTranslationData();
    } catch (error) {
      console.error('Error running audit:', error);
      toast({
        title: isArabic ? 'فشل التدقيق' : 'Audit Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsRunningAudit(false);
    }
  };

  const runSelfHealing = async () => {
    setIsHealing(true);
    try {
      // Get missing translations from latest audit
      const latestAudit = audits[0];
      if (!latestAudit?.audit_results?.details?.missingKeys) {
        throw new Error('No missing keys found to heal');
      }

      const missingKeys = latestAudit.audit_results.details.missingKeys.map((key: string) => ({
        key,
        englishText: key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || key,
        context: 'HR system interface'
      }));

      const { data, error } = await supabase.functions.invoke('ai-translation-engine', {
        body: {
          action: 'bulk_translate',
          auditFiles: missingKeys
        }
      });

      if (error) throw error;

      toast({
        title: isArabic ? 'تم إكمال الإصلاح' : 'Healing Completed',
        description: `${data.successCount} ${isArabic ? 'مفتاح تم إصلاحه' : 'keys healed'}`,
      });

      await loadTranslationData();
    } catch (error) {
      console.error('Error running self-healing:', error);
      toast({
        title: isArabic ? 'فشل الإصلاح' : 'Healing Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsHealing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-status-warning';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header with Health Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                {isArabic ? 'محرك سلامة الترجمة' : 'Translation Integrity Engine'}
              </CardTitle>
              <CardDescription>
                {t('translation.self.healing.description')}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getHealthColor(healthScore)}`}>
                {healthScore}%
              </div>
              <div className="text-sm text-muted-foreground">
                {t('translation.health.score')}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={runTranslationAudit}
              disabled={isRunningAudit}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRunningAudit ? 'animate-spin' : ''}`} />
              {isRunningAudit ? t('translation.auditing') : t('translation.run.audit')}
            </Button>
            <Button
              onClick={runSelfHealing}
              disabled={isHealing || audits.length === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Zap className={`h-4 w-4 ${isHealing ? 'animate-pulse' : ''}`} />
              {isHealing ? t('translation.healing') : t('translation.self.heal')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="audits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audits" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('translation.audits')}
          </TabsTrigger>
          <TabsTrigger value="patches" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            {t('translation.ai.patches')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('translation.analytics')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audits">
          <Card>
            <CardHeader>
              <CardTitle>{t('translation.audit.history')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audits.map((audit) => (
                  <div key={audit.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(audit.audit_status)}>
                          {audit.audit_status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(audit.created_at).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </span>
                      </div>
                      <div className="text-sm font-medium">
                        {audit.audit_type}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">{t('translation.total.keys')}</div>
                        <div className="font-medium">{audit.total_keys_scanned}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">{t('translation.missing.arabic')}</div>
                        <div className="font-medium text-red-600">{audit.missing_arabic_keys}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">{t('translation.ai.patched')}</div>
                        <div className="font-medium text-blue-600">{audit.ai_patched_keys}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">{t('translation.hardcoded.strings')}</div>
                        <div className="font-medium text-orange-600">{audit.hardcoded_strings_found}</div>
                      </div>
                    </div>

                    {audit.audit_status === 'completed' && (
                      <div className="mt-3">
                        <Progress 
                          value={((audit.total_keys_scanned - audit.missing_arabic_keys) / audit.total_keys_scanned) * 100}
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {t('translation.completion.rate')}: {Math.round(((audit.total_keys_scanned - audit.missing_arabic_keys) / audit.total_keys_scanned) * 100)}%
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {audits.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('translation.no.audits')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patches">
          <Card>
            <CardHeader>
              <CardTitle>{t('translation.ai.patches.applied')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patches.map((patch) => (
                  <div key={patch.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{patch.translation_key}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant={patch.language === 'ar' ? 'default' : 'secondary'}>
                          {patch.language.toUpperCase()}
                        </Badge>
                        <Badge variant={getStatusColor(patch.approval_status)}>
                          {patch.approval_status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      {patch.patched_text}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {t('translation.confidence')}: {Math.round((patch.confidence_score || 0) * 100)}%
                      </span>
                      <span>
                        {new Date(patch.applied_at).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                      </span>
                    </div>
                  </div>
                ))}

                {patches.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('translation.no.patches')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t('translation.quality.metrics')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t('translation.health.score')}</span>
                    <span className={`font-bold ${getHealthColor(healthScore)}`}>{healthScore}%</span>
                  </div>
                  <Progress value={healthScore} />
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {audits[0]?.total_keys_scanned - audits[0]?.missing_arabic_keys || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t('translation.translated.keys')}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {patches.filter(p => p.approval_status === 'pending').length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t('translation.pending.review')}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('translation.recent.activity')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patches.slice(0, 5).map((patch) => (
                    <div key={patch.id} className="flex items-center gap-3">
                      <Brain className="h-4 w-4 text-blue-500" />
                      <div className="flex-1 text-sm">
                        <div className="font-medium">{patch.translation_key}</div>
                        <div className="text-muted-foreground">
                          {t('translation.auto.translated')} • {Math.round((patch.confidence_score || 0) * 100)}%
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(patch.applied_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};