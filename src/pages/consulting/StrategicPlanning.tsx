import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAPITranslations } from "@/hooks/useAPITranslations";

const StrategicPlanning = () => {
  const { t } = useAPITranslations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('consulting.strategic_planning')}</h1>
        <p className="text-muted-foreground">{t('consulting.strategic_planning_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Strategic Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Achievement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">87%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Planning Horizon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">5 Years</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Strategic ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">450%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StrategicPlanning;