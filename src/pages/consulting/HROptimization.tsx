import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAPITranslations } from "@/hooks/useAPITranslations";

const HROptimization = () => {
  const { t } = useAPITranslations();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('consulting.hr_optimization')}</h1>
        <p className="text-muted-foreground">{t('consulting.hr_optimization_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Process Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">+45%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">32%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cycle Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">-60%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">9.2/10</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HROptimization;