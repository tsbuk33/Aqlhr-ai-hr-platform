import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

const AbsherPlatform = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('government.absher_platform')}</h1>
          <p className="text-muted-foreground">{t('government.absher_desc')}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-status-success text-white">{t('common.online')}</Badge>
          <Button variant="outline">{t('government.test_connection')}</Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('common.overview')}</TabsTrigger>
          <TabsTrigger value="verification">{t('government.verification')}</TabsTrigger>
          <TabsTrigger value="documents">{t('government.documents')}</TabsTrigger>
          <TabsTrigger value="security">{t('government.security')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('government.verified_ids')}</CardTitle>
                <CardDescription>{t('government.total_id_verifications')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-primary">2,456</div>
                <p className="text-xs text-muted-foreground mt-2">+89 {t('common.today')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('government.verification_rate')}</CardTitle>
                <CardDescription>{t('government.success_percentage')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-success">97.8%</div>
                <Progress value={97.8} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('government.response_time')}</CardTitle>
                <CardDescription>{t('government.average_api_response')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-accent">1.2s</div>
                <Badge className="mt-2 bg-status-success text-white">{t('common.excellent')}</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('government.daily_checks')}</CardTitle>
                <CardDescription>{t('government.verifications_today')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-brand-warning">234</div>
                <p className="text-xs text-muted-foreground mt-2">{t('common.peak')}: 345 ({t('common.last_week')})</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>{t('government.identity_verification_process')}</CardTitle>
              <CardDescription>{t('government.realtime_id_validation')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">{t('government.saudi_nationals')}</h4>
                  <p className="text-2xl font-bold text-brand-success">1,876</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">{t('government.residents')}</h4>
                  <p className="text-2xl font-bold text-brand-accent">580</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">{t('government.failed_verifications')}</h4>
                  <p className="text-2xl font-bold text-brand-warning">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>{t('government.document_validation')}</CardTitle>
              <CardDescription>{t('government.validate_official_documents')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{t('government.national_id_cards')}</span>
                  <Badge className="bg-status-success text-white">2,456 {t('government.validated')}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('government.residence_permits')}</span>
                  <Badge className="bg-status-success text-white">580 {t('government.validated')}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('government.passport_documents')}</span>
                  <Badge className="bg-status-success text-white">234 {t('government.validated')}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t('government.security_privacy')}</CardTitle>
              <CardDescription>{t('government.data_protection_measures')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{t('government.data_encryption')}</span>
                  <Badge className="bg-status-success text-white">AES-256</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('government.api_security')}</span>
                  <Badge className="bg-status-success text-white">OAuth 2.0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('government.compliance_status')}</span>
                  <Badge className="bg-status-success text-white">PDPL {t('government.compliant')}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AbsherPlatform;