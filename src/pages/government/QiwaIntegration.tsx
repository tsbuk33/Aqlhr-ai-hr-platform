import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePerformantLocalization } from "@/hooks/usePerformantLocalization";
import { MemoizedMetricCard } from "@/components/performance/MemoizedMetricCard";
import { FocusManager } from "@/components/accessibility/FocusManager";
import { ScreenReaderText } from "@/components/accessibility/ScreenReaderText";
import { Activity, CheckCircle, Clock, Shield } from "lucide-react";

const QiwaIntegration = () => {
  const { t, isRTL } = useLanguage();
  const { directionClasses, formatters, dateFormatters } = usePerformantLocalization();

  return (
    <FocusManager autoFocus restoreFocus>
      <div className={`container mx-auto p-6 space-y-6 ${directionClasses.container}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={`flex justify-between items-center ${directionClasses.flex}`}>
          <div className={directionClasses.text}>
            <h1 className="text-3xl font-bold text-foreground">
              {t('government.qiwa_integration')}
              <ScreenReaderText>
                {t('government.qiwa_integration_desc')}
              </ScreenReaderText>
            </h1>
            <p className="text-muted-foreground">{t('government.employment_contracts_permits')}</p>
          </div>
          <div className={`flex gap-2 ${directionClasses.flex}`}>
            <Badge variant="outline" className="bg-status-success text-white">
              {t('common.connected')}
            </Badge>
            <Button variant="outline">
              {t('common.sync_now')}
            </Button>
          </div>
        </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="permits">Work Permits</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MemoizedMetricCard
              title={t('government.active_contracts')}
              value={2847}
              description={`+${formatters.number(12)} ${t('common.this_month')}`}
              icon={<Activity className="h-6 w-6" />}
              type="number"
              variant="primary"
              trend={{
                value: 12,
                isPositive: true
              }}
            />
            <MemoizedMetricCard
              title={t('government.processing_success')}
              value={98.1}
              description={t('government.successful_api_calls')}
              icon={<CheckCircle className="h-6 w-6" />}
              type="percentage"
              variant="success"
            />
            <MemoizedMetricCard
              title={t('government.monthly_transfers')}
              value={45}
              description={`-${formatters.number(3)} ${t('common.last_month')}`}
              icon={<Clock className="h-6 w-6" />}
              type="number"
              variant="accent"
              trend={{
                value: 3,
                isPositive: false
              }}
            />
            <MemoizedMetricCard
              title={t('government.compliance_score')}
              value={100}
              description={t('government.overall_compliance')}
              icon={<Shield className="h-6 w-6" />}
              type="percentage"
              variant="warning"
            />
          </div>
          <Progress value={98.1} className="mt-4" aria-label={`${t('government.processing_success')}: ${formatters.percentage(98.1)}`} />
        </TabsContent>
        
        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Contract Management</CardTitle>
              <CardDescription>Manage employment contracts through Qiwa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Pending Contracts</h4>
                  <p className="text-2xl font-bold text-brand-warning">23</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Active Contracts</h4>
                  <p className="text-2xl font-bold text-brand-success">2,801</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Expired Contracts</h4>
                  <p className="text-2xl font-bold text-brand-accent">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permits">
          <Card>
            <CardHeader>
              <CardTitle>Work Permits Status</CardTitle>
              <CardDescription>Monitor work permit applications and renewals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Active Permits</h4>
                  <p className="text-2xl font-bold text-brand-primary">1,234</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Renewal Due (30 days)</h4>
                  <p className="text-2xl font-bold text-brand-warning">45</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>Qiwa compliance requirements and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Contract Registration</span>
                  <Badge className="bg-status-success text-white">Compliant</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Work Permit Validity</span>
                  <Badge className="bg-status-success text-white">Compliant</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Data Synchronization</span>
                  <Badge className="bg-status-success text-white">Up to Date</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </FocusManager>
  );
};

export default QiwaIntegration;