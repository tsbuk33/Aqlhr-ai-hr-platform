import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

const ZATCAIntegration = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`container mx-auto p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('zatca.title')}</h1>
          <p className="text-muted-foreground">{t('zatca.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-status-success text-white">{t('zatca.compliant')}</Badge>
          <Button variant="outline">{t('zatca.file_return')}</Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid w-full grid-cols-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TabsTrigger value="overview">{t('zatca.overview')}</TabsTrigger>
          <TabsTrigger value="returns">{t('zatca.returns')}</TabsTrigger>
          <TabsTrigger value="payments">{t('zatca.payments')}</TabsTrigger>
          <TabsTrigger value="compliance">{t('zatca.compliance')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('zatca.vat_returns_filed')}</CardTitle>
                <CardDescription>{t('zatca.annual_compliance')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-primary">12/12</div>
                <Progress value={100} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">{t('zatca.on_time')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('zatca.compliance_rate')}</CardTitle>
                <CardDescription>{t('zatca.overall_compliance')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-success">100%</div>
                <Badge className="mt-2 bg-status-success text-white">{t('zatca.excellent')}</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('zatca.tax_collected')}</CardTitle>
                <CardDescription>{t('zatca.vat_collected_year')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-accent">SAR 45.6K</div>
                <p className="text-xs text-muted-foreground mt-2">{t('zatca.vs_last_year')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('zatca.penalties_avoided')}</CardTitle>
                <CardDescription>{t('zatca.savings_compliance')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-warning">SAR 23K</div>
                <Badge className="mt-2 bg-status-success text-white">{t('zatca.zero_penalties')}</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="returns">
          <Card>
            <CardHeader>
              <CardTitle>{t('zatca.vat_return_history')}</CardTitle>
              <CardDescription>{t('zatca.track_returns')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Q4 2023</h4>
                  <p className="text-lg font-bold text-brand-success">{t('zatca.filed')}</p>
                  <p className="text-sm text-muted-foreground">SAR 12.4K</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Q3 2023</h4>
                  <p className="text-lg font-bold text-brand-success">{t('zatca.filed')}</p>
                  <p className="text-sm text-muted-foreground">SAR 11.8K</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Q2 2023</h4>
                  <p className="text-lg font-bold text-brand-success">{t('zatca.filed')}</p>
                  <p className="text-sm text-muted-foreground">SAR 10.9K</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>{t('zatca.tax_payments')}</CardTitle>
              <CardDescription>{t('zatca.payment_history')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{t('zatca.vat_payments')}</span>
                  <Badge className="bg-status-success text-white">{t('zatca.up_to_date')}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('zatca.withholding_tax')}</span>
                  <Badge className="bg-status-success text-white">{t('zatca.current')}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('zatca.zakat_obligations')}</span>
                  <Badge className="bg-status-success text-white">{t('zatca.compliant')}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>{t('zatca.compliance_status')}</CardTitle>
              <CardDescription>{t('zatca.regulatory_overview')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{t('zatca.registration_status')}</span>
                  <Badge className="bg-status-success text-white">{t('zatca.active')}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('zatca.filing_requirements')}</span>
                  <Badge className="bg-status-success text-white">{t('zatca.met')}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('zatca.payment_obligations')}</span>
                  <Badge className="bg-status-success text-white">{t('zatca.current')}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('zatca.record_keeping')}</span>
                  <Badge className="bg-status-success text-white">{t('zatca.compliant')}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ZATCAIntegration;